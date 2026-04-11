require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store in memory, don't save to disk
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Only allow image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        // Verify API key exists
        if (!process.env.GETPRONTO_API_KEY) {
            return res.status(500).json({
                error: 'Server configuration error: GETPRONTO_API_KEY not set'
            });
        }

        // Verify file exists
        if (!req.file) {
            return res.status(400).json({
                error: 'No file provided'
            });
        }

        // Create FormData for GetPronto
        const FormData = require('form-data');
        const formData = new FormData();
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });

        // Send to GetPronto API
        const response = await axios.post(
            'https://api.getpronto.io/v1/files/upload',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `Bearer ${process.env.GETPRONTO_API_KEY}`
                },
                timeout: 30000
            }
        );

        // Return success with image URL
        const imageUrl = response.data?.data?.url;
        if (!imageUrl) {
            return res.status(500).json({
                error: 'GetPronto did not return image URL'
            });
        }

        res.json({
            success: true,
            data: {
                url: imageUrl,
                filename: req.file.originalname
            }
        });

    } catch (error) {
        console.error('Upload error:', error.message);

        // Handle different error types
        if (error.response?.status === 401) {
            return res.status(401).json({
                error: 'Authentication failed with GetPronto API'
            });
        }

        if (error.message === 'File too large') {
            return res.status(413).json({
                error: 'File size exceeds 10MB limit'
            });
        }

        res.status(500).json({
            error: error.message || 'Upload failed'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Express error:', err);

    if (err instanceof multer.MulterError) {
        if (err.code === 'FILE_TOO_LARGE') {
            return res.status(413).json({
                error: 'File size exceeds 10MB limit'
            });
        }
        return res.status(400).json({
            error: err.message
        });
    }

    if (err.message && err.message.includes('Only image files')) {
        return res.status(400).json({
            error: err.message
        });
    }

    res.status(500).json({
        error: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found'
    });
});

app.listen(PORT, () => {
    console.log(`✅ Backend server running on port ${PORT}`);
    console.log(`📤 Upload endpoint: POST http://localhost:${PORT}/api/upload`);
    console.log(`🔒 GETPRONTO_API_KEY: ${process.env.GETPRONTO_API_KEY ? 'Set' : 'NOT SET - uploads will fail'}`);
});
