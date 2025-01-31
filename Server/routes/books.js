const express = require('express');
const axios = require('axios');
const router  = express.Router();
const { OpenAI } = require('openai');

//OpenAI API setup/key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This API key is in .env file
});


//Route to generate recommendation
router.post('/recommendations', async (req, res) =>{
    const {book1, reason1, book2, reason2, book3, reason3 } = req.body;

    //validates entry(≥1 book)
    if (!book1 && !book2 && !book3) {
        return res.status(400).json({error: 'At least one book is required.' });
    }
    
    try{
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
        

        //GoogleBook API to enhance reccomendation
        const enhancedRecommendations = await Promise.all(
            recommendations.map(async (rec) => {
                try {
                    const googleResponse = await axios.get(
                        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(rec.title)}`
                    );
                    const bookData = googleResponse.data.items?.[0]?.volumeInfo || {};

                    return {
                        title: rec.title,
                        author: rec.author,
                        reason: rec.reason,
                        description: bookData.description || 'No description available.',
                    };
                } catch (error) {
                    console.error(`Error fetching Google Books data for ${rec.title}:`, error.message);
                    return {
                        ...rec,
                        description: 'Failed to fetch Google Books data.',
                    };
                }
            })
        );
       // Return enhanced recommendations to frontend
       res.json(enhancedRecommendations);

    } catch (error) {
        console.error('Error generating recommendations:', error.message);
        res.status(500).json({error: 'Failed to generate recommendations. Please try again later.'});
    }
});

module.exports = router;