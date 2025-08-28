const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Slideshow Generator API is running!' });
});

// Generate slideshow endpoint
app.post('/api/generate-slideshow', async (req, res) => {
  try {
    const { prompt, slideCount = 5 } = req.body;

    if (!prompt) {
      return res.status(400).json({ 
        success: false, 
        error: 'Prompt is required' 
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        error: 'Gemini API key not configured' 
      });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // First, get background image search terms from Gemini
    const backgroundSearchPrompt = `
      Based on this slideshow topic: "${prompt}"
      
      Generate 3-5 relevant search terms for finding background images that would be perfect for a TikTok slideshow about this topic.
      
      Return ONLY a comma-separated list of search terms without any explanation. Focus on:
      - Visual themes that match the topic
      - Colors, moods, or aesthetics that would enhance the content
      - Abstract concepts that complement the subject
      
      Example output: "abstract gradient, modern technology, blue background, minimalist design"
      
      Search terms for "${prompt}":
    `;

    const backgroundResult = await model.generateContent(backgroundSearchPrompt);
    const backgroundResponse = await backgroundResult.response;
    const backgroundSearchTerms = backgroundResponse.text().trim();

    // Create the prompt for generating slideshow content
    const fullPrompt = `
      Create a TikTok slideshow with exactly ${slideCount} slides based on this prompt: "${prompt}"

      Please respond with a JSON object in this exact format:
      {
        "title": "Main slideshow title",
        "description": "Brief description of the slideshow content",
        "slides": [
          {
            "slideNumber": 1,
            "title": "Slide title",
            "content": "Main slide content - keep it concise and engaging for TikTok audience",
            "bulletPoints": ["Point 1", "Point 2", "Point 3"]
          }
        ],
        "tiktokDescription": "Engaging TikTok video description with relevant hashtags"
      }

      Guidelines:
      - Keep slide titles short and catchy (max 6 words)
      - Each slide content should be 1-2 sentences max
      - Include 2-3 bullet points per slide
      - Make it TikTok-friendly with engaging language
      - Format: 9:16 vertical format in mind
      - Include relevant hashtags in the TikTok description
      - Content should be informative yet entertaining
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the JSON response
    let slideshowData;
    try {
      // Clean the response text to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        slideshowData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Raw response:', text);
      
      // Fallback: create a structured response from the text
      slideshowData = {
        title: "Generated Slideshow",
        description: "AI-generated slideshow content",
        slides: [
          {
            slideNumber: 1,
            title: "Content Generated",
            content: text.substring(0, 100) + "...",
            bulletPoints: ["Generated content", "From Gemini AI", "Ready to use"]
          }
        ],
        tiktokDescription: "Check out this amazing content! #TikTok #Content #AI"
      };
    }

    // Ensure we have the right number of slides
    if (slideshowData.slides && slideshowData.slides.length !== slideCount) {
      console.warn(`Expected ${slideCount} slides, got ${slideshowData.slides.length}`);
    }

    // Search for background images using Gemini-generated terms
    let backgroundImages = [];
    if (process.env.PEXELS_API_KEY && backgroundSearchTerms) {
      try {
        // Split search terms and search each one to get diverse results
        const searchTerms = backgroundSearchTerms.split(',').map(term => term.trim());
        const allImages = [];
        
        for (const searchTerm of searchTerms) {
          if (searchTerm) {
            try {
              const pexelsResponse = await axios.get('https://api.pexels.com/v1/search', {
                headers: {
                  Authorization: process.env.PEXELS_API_KEY
                },
                params: {
                  query: searchTerm,
                  orientation: 'portrait',
                  per_page: 5, // Get fewer per term to have variety
                  size: 'medium'
                }
              });

              if (pexelsResponse.data.photos && pexelsResponse.data.photos.length > 0) {
                const formattedPhotos = pexelsResponse.data.photos.map(photo => ({
                  id: photo.id,
                  src: {
                    small: photo.src.small,
                    medium: photo.src.medium,
                    large: photo.src.large,
                    portrait: photo.src.portrait
                  },
                  photographer: photo.photographer,
                  photographer_url: photo.photographer_url,
                  alt: photo.alt,
                  avg_color: photo.avg_color,
                  searchTerm: searchTerm // Track which term found this image
                }));
                
                allImages.push(...formattedPhotos);
              }
            } catch (pexelsError) {
              console.error(`Error searching Pexels for "${searchTerm}":`, pexelsError.message);
              continue; // Try next search term
            }
          }
        }
        
        // Remove duplicates by ID and limit to 10 images
        const uniqueImages = allImages.filter((image, index, self) => 
          index === self.findIndex((img) => img.id === image.id)
        );
        
        backgroundImages = uniqueImages.slice(0, 10);
        
        // If we didn't get enough images from specific terms, try a general search
        if (backgroundImages.length < 5) {
          try {
            const fallbackResponse = await axios.get('https://api.pexels.com/v1/search', {
              headers: {
                Authorization: process.env.PEXELS_API_KEY
              },
              params: {
                query: 'abstract background gradient',
                orientation: 'portrait',
                per_page: 10,
                size: 'medium'
              }
            });

            if (fallbackResponse.data.photos && fallbackResponse.data.photos.length > 0) {
              const fallbackImages = fallbackResponse.data.photos.map(photo => ({
                id: photo.id,
                src: {
                  small: photo.src.small,
                  medium: photo.src.medium,
                  large: photo.src.large,
                  portrait: photo.src.portrait
                },
                photographer: photo.photographer,
                photographer_url: photo.photographer_url,
                alt: photo.alt,
                avg_color: photo.avg_color,
                searchTerm: 'fallback'
              }));
              
              // Merge with existing, remove duplicates, limit to 10
              const allCombined = [...backgroundImages, ...fallbackImages];
              const uniqueCombined = allCombined.filter((image, index, self) => 
                index === self.findIndex((img) => img.id === image.id)
              );
              
              backgroundImages = uniqueCombined.slice(0, 10);
            }
          } catch (fallbackError) {
            console.error('Error in fallback image search:', fallbackError.message);
          }
        }
        
      } catch (error) {
        console.error('Error generating background images:', error);
        // Continue without background images
      }
    }

    res.json({
      success: true,
      data: {
        ...slideshowData,
        generatedAt: new Date().toISOString(),
        prompt: prompt,
        backgroundImages: backgroundImages,
        backgroundSearchTerms: backgroundSearchTerms,
        suggestedBackground: backgroundImages.length > 0 ? backgroundImages[0] : null
      }
    });

  } catch (error) {
    console.error('Error generating slideshow:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate slideshow content'
    });
  }
});

// Search for background images
app.get('/api/search-images', async (req, res) => {
  try {
    const { query = 'abstract background', orientation = 'portrait' } = req.query;
    
    console.log(`🔍 Manual image search request: query="${query}", orientation="${orientation}"`);

    if (!process.env.PEXELS_API_KEY) {
      console.error('❌ Pexels API key not configured');
      return res.status(500).json({ 
        success: false, 
        error: 'Pexels API key not configured' 
      });
    }

    console.log(`📡 Making Pexels API request...`);
    const response = await axios.get('https://api.pexels.com/v1/search', {
      headers: {
        Authorization: process.env.PEXELS_API_KEY
      },
      params: {
        query: query,
        orientation: orientation,
        per_page: 10,
        size: 'medium'
      }
    });
    
    console.log(`✅ Pexels API response: ${response.data.photos?.length || 0} photos found`);

    // Format the response for our frontend
    const images = response.data.photos.map(photo => ({
      id: photo.id,
      src: {
        small: photo.src.small,
        medium: photo.src.medium,
        large: photo.src.large,
        portrait: photo.src.portrait
      },
      photographer: photo.photographer,
      photographer_url: photo.photographer_url,
      alt: photo.alt,
      avg_color: photo.avg_color
    }));

    res.json({
      success: true,
      data: {
        images,
        total_results: response.data.total_results,
        query: query
      }
    });

  } catch (error) {
    console.error('Error searching images:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search for images'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    pexelsConfigured: !!process.env.PEXELS_API_KEY
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Gemini API Key configured: ${!!process.env.GEMINI_API_KEY}`);
  console.log(`Pexels API Key configured: ${!!process.env.PEXELS_API_KEY}`);
  if (process.env.PEXELS_API_KEY) {
    console.log(`Pexels API Key: ${process.env.PEXELS_API_KEY.substring(0, 10)}...`);
  }
});
