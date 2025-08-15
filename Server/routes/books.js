const express = require('express');
const axios = require('axios');
const router = express.Router();
const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getBookScore = (item) => {
    if (!item || !item.volumeInfo) return 0;
    const info = item.volumeInfo;
    let score = 0;
    if (info.imageLinks?.thumbnail) score += 100;
    if (info.language === 'en') score += 75;
    if (info.description && info.description.length > 50) score += 50;
    if (info.industryIdentifiers?.some(id => id.type === 'ISBN_13')) score += 40;
    if (info.ratingsCount) score += info.ratingsCount;
    return score;
};

router.post('/recommendations', async (req, res) => {
    const { book1, reason1, book2, reason2, book3, reason3, vibe, filters } = req.body;

    let prompt;
    // The prompt now requests a longer summary to serve as a good fallback.
    const responseFormat = `
        Your response must follow this exact format for each book, with no extra text:
        Title: [Book Title]
        Author: [Author Name]
        Reason: [Why this book matches the request]
        Original Year: [Year]
        Page Count: [Number of pages]
        Summary: [A 4-10 sentence, well-written, spoiler-free description of the book]`;

    if (vibe !== undefined) {
        if (!vibe.trim()) {
            return res.status(400).json({ error: 'A description of what you want to read is required.' });
        }
        prompt = `Based on the following user request: "${vibe}", recommend exactly 3 books.`;
        
        if (filters?.isFiction === 'fiction') {
            prompt += ' The books must be fiction.';
        } else if (filters?.isFiction === 'non-fiction') {
            prompt += ' The books must be non-fiction.';
        }
        prompt += responseFormat;
    } else {
        if (!book1 && !book2 && !book3) {
            return res.status(400).json({ error: 'At least one book is required.' });
        }
        prompt = `Based on my favorite books, recommend exactly 3 other books.
            My Books:
            - ${book1 || 'N/A'} (${reason1 || 'No reason provided'})
            - ${book2 || 'N/A'} (${reason2 || 'No reason provided'})
            - ${book3 || 'N/A'} (${reason3 || 'No reason provided'})
            ${responseFormat}`;
    }
    
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 700, // Increased token limit for longer summaries
            temperature: 0.7,
        });

        const gptContent = response.choices[0].message.content;
        const recommendations = [];
        const recommendationBlocks = gptContent.split(/Title:/).slice(1);

        for (const block of recommendationBlocks) {
            const titleMatch = `Title:${block}`.match(/Title:\s*(.*)/);
            const authorMatch = block.match(/Author:\s*(.*)/);
            const reasonMatch = block.match(/Reason:\s*(.*)/);
            const yearMatch = block.match(/Original Year:\s*(.*)/);
            const pageCountMatch = block.match(/Page Count:\s*(\d+)/);
            const summaryMatch = block.match(/Summary:\s*(.*)/s);
            
            if (titleMatch && authorMatch && reasonMatch && yearMatch && summaryMatch && pageCountMatch) {
                recommendations.push({
                    title: titleMatch[1].trim(),
                    author: authorMatch[1].trim(),
                    reason: reasonMatch[1].trim(),
                    originalYear: yearMatch[1].trim(),
                    llmPageCount: pageCountMatch[1].trim(),
                    llmSummary: summaryMatch[1].trim(),
                });
            }
        }
        
        if (recommendations.length === 0) {
            throw new Error('Could not parse recommendations from LLM response.');
        }

        const enhancedRecommendations = await Promise.all(
            recommendations.map(async (rec) => {
                try {
                    const googleResponse = await axios.get(
                        `https://www.googleapis.com/books/v1/volumes?q=intitle:"${encodeURIComponent(rec.title)}"+inauthor:"${encodeURIComponent(rec.author)}"&maxResults=5`
                    );

                    let bestBookItem = null;
                    if (googleResponse.data.items && googleResponse.data.items.length > 0) {
                        bestBookItem = googleResponse.data.items
                            .map(item => ({ item, score: getBookScore(item) }))
                            .sort((a, b) => b.score - a.score)[0].item;
                    }
                    
                    const bookData = bestBookItem ? bestBookItem.volumeInfo : null;
                    
                    // --- NEW LOGIC: Rewrite the description using the LLM ---
                    let finalDescription = rec.llmSummary; // Start with the LLM's summary as a fallback

                    if (bookData?.description) {
                        try {
                            const rewritePrompt = `Please rewrite the following book description to be a high-quality, spoiler-free description of 4 to 10 sentences.
                                                    If the original publisher description looks good and does not contain too much fluff/publisher nonsense(for example "'The best book you'll read this year' New York Times'"),
                                                    you can keep the original description entirely or trim it/edit it to be 12 sentences or less. Please lean towards keeping the publisher description where possible. Description: "${bookData.description}"`;
                            const rewriteResponse = await openai.chat.completions.create({
                                model: 'gpt-4o-mini',
                                messages: [{ role: 'user', content: rewritePrompt }],
                                max_tokens: 250,
                                temperature: 0.6,
                            });
                            finalDescription = rewriteResponse.choices[0].message.content.trim();
                        } catch (rewriteError) {
                            console.error("Could not rewrite description, using original from Google Books.", rewriteError.message);
                            finalDescription = bookData.description; // Fallback to raw Google description on rewrite failure
                        }
                    }

                    const getISBN = (identifiers) => {
                        if (!identifiers) return null;
                        const isbn13 = identifiers.find(id => id.type === 'ISBN_13');
                        return isbn13 ? isbn13.identifier : null;
                    };

                    const affiliateId = 'bookwizard02-20';
                    const searchTerm = `${rec.title} ${rec.author}`.replace(/\s+/g, '+');
                    const amazonLink = `https://www.amazon.com/s?k=${searchTerm}&tag=${affiliateId}`;
                    
                    return {
                        title: rec.title, author: rec.author, reason: rec.reason, originalYear: rec.originalYear, amazonLink,
                        description: finalDescription, // Use the new, rewritten description
                        pageCount: bookData?.pageCount || rec.llmPageCount,
                        coverImage: bookData?.imageLinks?.thumbnail || bookData?.imageLinks?.smallThumbnail || null,
                        genre: bookData?.categories?.[0] || 'Fiction',
                        averageRating: bookData?.averageRating || null,
                        ratingsCount: bookData?.ratingsCount || null,
                        publisher: bookData?.publisher || 'Unknown Publisher',
                        isbn: getISBN(bookData?.industryIdentifiers)
                    };
                } catch (error) {
                    console.error(`Error enhancing data for ${rec.title}:`, error.message);
                    return { 
                        title: rec.title, author: rec.author, reason: rec.reason, originalYear: rec.originalYear,
                        description: rec.llmSummary, pageCount: rec.llmPageCount, coverImage: null,
                        amazonLink: `https://www.amazon.com/s?k=${rec.title}+${rec.author}&tag=bookwizard02-20` 
                    };
                }
            })
        );
       
       res.json(enhancedRecommendations);

    } catch (error) {
        console.error('Error in /recommendations route:', error.message);
        res.status(500).json({ error: 'Failed to generate recommendations.' });
    }
});

module.exports = router;