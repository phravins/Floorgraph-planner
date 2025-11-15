import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { dirname } from 'path';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static(uploadsDir));

const API_KEY = "sk-ZdNUzcpQ5bK9nNJdd8wi3o00GFIhl5d2ZTxUkOOOlGhXMm2r";
const API_URL = "https://api.stability.ai/v2beta/stable-image/generate/sd3";

// Root route - API information
app.get('/', (req, res) => {
    res.json({
        message: '🏠 AI Floor Plan Generator API',
        status: 'running',
        version: '1.0.0',
        server: 'Node.js/Express',
        timestamp: new Date().toISOString(),
        endpoints: {
            root: 'GET / - API Information (this page)',
            health: 'GET /health - Server health check',
            test: 'GET /api/test - Test endpoint', 
            generate: 'POST /generate-floorplan - Generate floor plan',
            uploads: 'GET /uploads/<filename> - Serve generated images'
        },
        quick_test: {
            health_check: `http://localhost:${PORT}/health`,
            api_test: `http://localhost:${PORT}/api/test`
        },
        api_status: {
            stability_ai_configured: !!API_KEY,
            cors_enabled: true,
            uploads_directory: 'uploads/'
        }
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'AI Floor Plan Generator - Node.js Backend'
    });
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Node.js backend is working!',
        timestamp: new Date().toISOString(),
        api_key_configured: !!API_KEY
    });
});

// Generate floor plan endpoint
app.post('/generate-floorplan', async (req, res) => {
    try {
        console.log('📝 Received floor plan request:', JSON.stringify(req.body, null, 2));

        const {
            sqft,
            depth,
            width,
            directions,
            bathrooms,
            masterbedroom,
            masterbedrooms,
            floors,
            garden,
            varanda,
            design,
            description
        } = req.body;

        // Validate required fields
        if (!sqft || !depth || !width) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: sqft, depth, and width are required'
            });
        }

        // Create detailed prompt for Stability AI
        const prompt = `
You are a skilled architect specializing in architectural layout visualization.
Your task is to generate an image of a 2D architectural floor plan based on the reference style below.

📐 Reference Style:
The layout consists of rooms drawn as labeled rectangles arranged on a rectangular grid. Each room has a specified width and height (in meters or feet), and rooms are placed adjacent to each other with no overlaps.

Each room must have:
- A labeled name (e.g., "Kitchen", "Bedroom", etc.)
- Dimensions marked either inside or beside the room
- Clearly visible borders

Additional Requirements:
- Use a fixed layout (e.g., Pantry next to Kitchen, Bathrooms beside Bedrooms).
- Use different colors per room and add a legend.
- Add North arrow at top-right.
- Professional architectural drawing style with clean lines.

User Inputs:
Total plot area: ${sqft} sqft
Plot width: ${width} ft
Plot depth: ${depth} ft
Orientation: ${directions || 'North facing'}
Master Bedrooms: ${masterbedrooms || '1'}, Size: ${masterbedroom || 'Standard'}
Bathrooms: ${bathrooms || 'Standard'}
Garden: ${garden || 'No'}
Veranda: ${varanda || 'No'}
Design Style: ${design || 'Modern Contemporary'}
Floors: ${floors || 'Single story'}
Description: ${description || 'Professional floor plan design'}
`;

        console.log('🔄 Sending request to Stability AI...');

        // Create form data for the API request
        const formData = new FormData();
        formData.append('prompt', prompt);
        formData.append('output_format', 'jpeg');
        formData.append('aspect_ratio', '16:9');

        // Make request to Stability AI
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'image/*'
            },
            body: formData
        });

        console.log(`📡 Stability AI Response Status: ${response.status}`);

        if (response.ok) {
            // Generate unique filename
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `floorplan_${timestamp}.jpg`;
            const filepath = path.join(uploadsDir, filename);

            // Save the image
            const buffer = await response.buffer();
            fs.writeFileSync(filepath, buffer);

            console.log(`✅ Floor plan saved: ${filename}`);

            // Return success response
            res.json({
                success: true,
                image_url: `/uploads/${filename}`,
                filename: filename,
                message: 'Floor plan generated successfully',
                generation_time: new Date().toISOString()
            });

        } else {
            // Handle API errors
            let errorMessage = 'Unknown error occurred';
            
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || `API Error ${response.status}`;
            } catch (e) {
                errorMessage = `API Error ${response.status}: ${response.statusText}`;
            }

            console.error('❌ Stability AI API Error:', errorMessage);

            // Return appropriate error based on status code
            if (response.status === 401) {
                errorMessage = 'Invalid API key. Please check your Stability AI API key.';
            } else if (response.status === 402) {
                errorMessage = 'Insufficient credits. Please check your Stability AI account balance.';
            } else if (response.status === 429) {
                errorMessage = 'Rate limit exceeded. Please try again in a few minutes.';
            }

            res.status(response.status).json({
                success: false,
                error: errorMessage
            });
        }

    } catch (error) {
        console.error('❌ Error in generate-floorplan:', error);
        
        res.status(500).json({
            success: false,
            error: `Server error: ${error.message}`
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server Error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 Node.js Backend Server Started!');
    console.log(`📍 Server running on http://localhost:${PORT}`);
    console.log('📋 Available endpoints:');
    console.log('  GET  / - API Information');
    console.log('  GET  /health - Health check');
    console.log('  GET  /api/test - Test endpoint');
    console.log('  POST /generate-floorplan - Generate floor plan');
    console.log('  GET  /uploads/<filename> - Serve generated images');
    console.log('');
    console.log('🔍 Testing API connection...');
    
    // Test API key on startup
    if (API_KEY && API_KEY !== "sk-ZdNUzcpQ5bK9nNJdd8wi3o00GFIhl5d2ZTxUkOOOlGhXMm2r") {
        console.log('✅ API key configured');
    } else {
        console.log('❌ API key not configured properly');
    }
});

export default app;