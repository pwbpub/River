const express = require('express');
const axios = require('axios');
const router = express.Router();
const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// MODIFIED: Overhauled scoring function to prioritize completeness and quality signals.
const getBookScore = (item) => {
    if (!item || !item.volumeInfo) return 0;
    const info = item.volumeInfo;

    let score = 0;
    
    
    if (info.imageLinks?.thumbnail) score += 100;
    if (info.language === 'en') score += 75;
    if (info.description && info.description.length > 50) score += 50;
    if (info.industryIdentifiers?.some(id => id.type === 'ISBN_13')) score += 40;
    
    
    if (info.ratingsCount) {
        score += info.ratingsCount;
    }

    return score;
};


router.post('/recommendations', async (req, res) => {
    const { book1, reason1, book2, reason2, book3, reason3 } = req.body;

    if (!book1 && !book2 && !book3) {
        return res.status(400).json({ error: 'At least one book is required.' });
    }
    
    try {
        const prompt = 
            `Based on my favorite books, recommend exactly 3 other books.
            For each recommendation, provide the title, author, a compelling reason, the original publication year, a standard page count, and a concise, high-quality summary.

            My Books:
            - ${book1 || 'N/A'} (${reason1 || 'No reason provided'})
            - ${book2 || 'N/A'} (${reason2 || 'No reason provided'})
            - ${book3 || 'N/A'} (${reason3 || 'No reason provided'})
        
            Your response must follow this exact format for each book:
            Title: [Book Title]
            Author: [Author Name]
            Reason: [Why this book is being recommended]
            Original Year: [Year]
            Page Count: [Number of pages]
            Summary: [A 2-3 sentence, well-written summary of the plot or main ideas without spoilers]`;
        
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 600, // Increased token limit for more data
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
            const summaryMatch = block.match(/Summary:\s*(.*)/s); // 's' flag to match across newlines
            
            if (titleMatch && authorMatch && reasonMatch && yearMatch && summaryMatch && pageCountMatch) {
                recommendations.push({
                    title: titleMatch[1].trim(),
                    author: authorMatch[1].trim(),
                    reason: reasonMatch[1].trim(),
                    originalYear: yearMatch[1].trim(),
                    llmPageCount: pageCountMatch[1].trim(), // Store LLM fallbacks
                    llmSummary: summaryMatch[1].trim(),   // Store LLM fallbacks
                });
            }
        }
        
        if (recommendations.length === 0) {
            throw new Error('Could not parse recommendations from LLM response.');
        }   //Maybe add retry function(1-2 runs) to allow llm another chance

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
                    
                    const getISBN = (identifiers) => {
                        if (!identifiers) return null;
                        const isbn13 = identifiers.find(id => id.type === 'ISBN_13');
                        if (isbn13) return isbn13.identifier;
                        const isbn10 = identifiers.find(id => id.type === 'ISBN_10');
                        return isbn10 ? isbn10.identifier : null;
                    };

                    const affiliateId = 'thesheappr-21';
                    const searchTerm = `${rec.title} ${rec.author}`.replace(/\s+/g, '+');
                    const amazonLink = `https://www.amazon.com/s?k=${searchTerm}&tag=${affiliateId}`;
                    
                    return {
                        title: rec.title,
                        author: rec.author,
                        reason: rec.reason,
                        originalYear: rec.originalYear,
                        amazonLink: amazonLink,
                        
                        // Data from Google Books API with LLM fallbacks
                        description: bookData?.description || rec.llmSummary,
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
                        amazonLink: `https://www.amazon.com/s?k=${rec.title}+${rec.author}&tag=thesheappr-21` 
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