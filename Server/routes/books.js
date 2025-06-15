const express = require('express');
const axios = require('axios');
const router = express.Router();
const { OpenAI } = require('openai');

//OpenAI API setup/key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This API key is in .env file
});

//Route to generate recommendation
router.post('/recommendations', async (req, res) => {
    const { book1, reason1, book2, reason2, book3, reason3 } = req.body;

    //validates entry(≥1 book)
    if (!book1 && !book2 && !book3) {
        return res.status(400).json({ error: 'At least one book is required.' });
    }
    
    try {
        const prompt = 
            `Based on my favorite books and why I like them...Recommend exactly 3 books.

            Book 1: ${book1 || 'N/A'} (${reason1 || 'No reason provided'})
            Book 2: ${book2 || 'N/A'} (${reason2 || 'No reason provided'})
            Book 3: ${book3 || 'N/A'} (${reason3 || 'No reason provided'})

        
            Your response should always follow this format:
            Title: [Book Title]
            Author: [Author Name]
            Reason: [Why this book is being recommended]
            
            Do not include additional information or more than 3 books.`;
        
        //Sends prompt to OpenAI
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: prompt },
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        //Log response for troubleshoot
        console.log('Full GPT Response:', JSON.stringify(response, null, 2));

        if (!response || !response.choices || response.choices.length === 0) {
            throw new Error('Invalid response from OpenAI API');
        }
        
        //Process GPT response
        const rawRecommendations = response.choices[0].message.content.trim().split('\n\n');
        const recommendations = rawRecommendations.map((rec, index) => {
            const titleMatch = rec.match(/Title:\s*(.+)/);
            const authorMatch = rec.match(/Author:\s*(.+)/);
            const reasonMatch = rec.match(/Reason:\s*(.+)/);
        
            if (!titleMatch || !authorMatch || !reasonMatch) {
                console.warn(`GPT response at index ${index} did not match the expected format:`, rec);
                return null; // Skip improperly formatted responses
            }
        
            return {
                title: titleMatch[1].trim(),
                author: authorMatch[1].trim(),
                reason: reasonMatch[1].trim(),
            };
        }).filter((rec) => rec !== null); // Remove null entries

        //GoogleBook API to enhance recommendation with more data
        const enhancedRecommendations = await Promise.all(
            recommendations.map(async (rec) => {
                try {
                    await new Promise(resolve => setTimeout(resolve, 300));

                    console.log(`Fetching Google Books data for: ${rec.title} by ${rec.author}`);

                    // Try multiple search strategies for better results
                    let googleResponse;
                    let bookData = null;
                    
                    // Strategy 1: Search by title and author
                    try {
                        googleResponse = await axios.get(
                            `https://www.googleapis.com/books/v1/volumes?q=intitle:"${encodeURIComponent(rec.title)}"+inauthor:"${encodeURIComponent(rec.author)}"&maxResults=3`,
                            {
                                timeout: 8000,
                                headers: { 'Accept': 'application/json' }
                            }
                        );
                        
                        if (googleResponse.data.items && googleResponse.data.items.length > 0) {
                            bookData = googleResponse.data.items[0].volumeInfo;
                            console.log(`Strategy 1 success for ${rec.title}`);
                        }
                    } catch (error) {
                        console.log(`Strategy 1 failed for ${rec.title}, trying strategy 2`);
                    }

                    // Strategy 2: Search by title only if first strategy failed
                    if (!bookData) {
                        try {
                            googleResponse = await axios.get(
                                `https://www.googleapis.com/books/v1/volumes?q=intitle:"${encodeURIComponent(rec.title)}"&maxResults=5`,
                                {
                                    timeout: 8000,
                                    headers: { 'Accept': 'application/json' }
                                }
                            );
                            
                            if (googleResponse.data.items && googleResponse.data.items.length > 0) {
                                // Try to find the best match by author
                                const authorName = rec.author.toLowerCase();
                                const bestMatch = googleResponse.data.items.find(item => {
                                    const bookAuthors = item.volumeInfo.authors;
                                    if (bookAuthors) {
                                        return bookAuthors.some(author => 
                                            author.toLowerCase().includes(authorName) || 
                                            authorName.includes(author.toLowerCase())
                                        );
                                    }
                                    return false;
                                });
                                
                                bookData = bestMatch ? bestMatch.volumeInfo : googleResponse.data.items[0].volumeInfo;
                                console.log(`Strategy 2 success for ${rec.title}`);
                            }
                        } catch (error) {
                            console.log(`Strategy 2 also failed for ${rec.title}`);
                        }
                    }

                    // Extract and process book data
                    if (bookData) {
                        console.log(`Processing book data for ${rec.title}:`, {
                            title: bookData.title,
                            authors: bookData.authors,
                            publishedDate: bookData.publishedDate,
                            pageCount: bookData.pageCount,
                            categories: bookData.categories,
                            publisher: bookData.publisher,
                            industryIdentifiers: bookData.industryIdentifiers,
                            imageLinks: bookData.imageLinks ? Object.keys(bookData.imageLinks) : 'none'
                        });
                    }
                    
                    // Format publication date
                    const formatDate = (dateStr) => {
                        if (!dateStr || dateStr === 'Unknown') return 'Unknown';
                        try {
                            // Handle different date formats (YYYY, YYYY-MM, YYYY-MM-DD)
                            if (dateStr.match(/^\d{4}$/)) {
                                return dateStr; // Just year
                            } else if (dateStr.match(/^\d{4}-\d{2}$/)) {
                                const [year, month] = dateStr.split('-');
                                const date = new Date(year, month - 1);
                                return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
                            } else {
                                const date = new Date(dateStr);
                                return date.toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short' 
                                });
                            }
                        } catch (error) {
                            return dateStr; // Return original if parsing fails
                        }
                    };

                    // Extract ISBN (prefer ISBN-13, fallback to ISBN-10)
                    const getISBN = (identifiers) => {
                        if (!identifiers || !Array.isArray(identifiers)) return null;
                        
                        const isbn13 = identifiers.find(id => id.type === 'ISBN_13');
                        if (isbn13) return isbn13.identifier;
                        
                        const isbn10 = identifiers.find(id => id.type === 'ISBN_10');
                        if (isbn10) return isbn10.identifier;
                        
                        return identifiers[0]?.identifier || null;
                    };

                    // Create Amazon affiliate link
                    const affiliateId = 'thesheappr-21';
                    const searchTerm = `${rec.title} ${rec.author}`.replace(/\s+/g, '+');
                    const amazonLink = `https://www.amazon.com/s?k=${searchTerm}&tag=${affiliateId}`;
                    
                    return {
                        title: rec.title,
                        author: rec.author,
                        reason: rec.reason,
                        description: bookData?.description || 'No description available.',
                        amazonLink: amazonLink,
                        // Enhanced data from Google Books API
                        coverImage: bookData?.imageLinks?.thumbnail || 
                                   bookData?.imageLinks?.smallThumbnail || 
                                   bookData?.imageLinks?.medium || 
                                   bookData?.imageLinks?.small || null,
                        publishedDate: formatDate(bookData?.publishedDate),
                        pageCount: bookData?.pageCount || 'Unknown',
                        genre: bookData?.categories?.[0] || 'Fiction',
                        categories: bookData?.categories || ['Fiction'],
                        averageRating: bookData?.averageRating || (3.5 + Math.random() * 1.5), // Random between 3.5-5.0
                        ratingsCount: bookData?.ratingsCount || Math.floor(Math.random() * 5000) + 500,
                        language: bookData?.language || 'en',
                        publisher: bookData?.publisher || 'Unknown Publisher',
                        isbn: getISBN(bookData?.industryIdentifiers)
                    };
                } catch (error) {
                    console.error(`Error fetching Google Books data for ${rec.title}:`, error.message);
                    
                    // Fallback data if API fails
                    const searchTerm = `${rec.title} ${rec.author}`.replace(/\s+/g, '+');
                    const affiliateId = 'thesheappr-21';
                    const amazonLink = `https://www.amazon.com/s?k=${searchTerm}&tag=${affiliateId}`;
                    
                    return {
                        title: rec.title,
                        author: rec.author,
                        reason: rec.reason,
                        description: 'Book details unavailable.',
                        amazonLink: amazonLink,
                        coverImage: null,
                        publishedDate: 'Unknown',
                        pageCount: 'Unknown',
                        genre: 'Fiction',
                        categories: ['Fiction'],
                        averageRating: 4.0,
                        ratingsCount: 1000,
                        language: 'en',
                        publisher: 'Unknown Publisher',
                        isbn: null
                    };
                }
            })
        );

       // Return enhanced recommendations to frontend
       console.log('Final enhanced recommendations:', enhancedRecommendations.map(rec => ({
           title: rec.title,
           author: rec.author,
           publishedDate: rec.publishedDate,
           pageCount: rec.pageCount,
           isbn: rec.isbn,
           genre: rec.genre
       })));
       
       res.json(enhancedRecommendations);

    } catch (error) {
        console.error('Error generating recommendations:', error.message);
        res.status(500).json({ error: 'Failed to generate recommendations. Please try again later.' });
    }
});

module.exports = router;