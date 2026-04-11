require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Simple in-memory session store for tokens
const validTokens = new Map();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // More flexible for dev
    credentials: true
}));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Auth endpoint
app.post('/api/auth', express.json(), (req, res) => {
    const { password } = req.body;

    if (!password || !process.env.ADMIN_PASSWORD) {
        return res.status(400).json({ error: 'Auth configuration error' });
    }

    if (password === process.env.ADMIN_PASSWORD) {
        // Generate a real random token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
        
        validTokens.set(token, expires);
        
        // Cleanup old tokens occasionally
        if (validTokens.size > 100) {
            const now = Date.now();
            for (const [t, exp] of validTokens) {
                if (exp < now) validTokens.delete(t);
            }
        }

        res.json({
            success: true,
            token: token,
            message: 'Authentication successful'
        });
    } else {
        res.status(401).json({ error: 'Invalid password' });
    }
});

// Middleware to verify admin token
function verifyAdminToken(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token || !validTokens.has(token)) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const expires = validTokens.get(token);
    if (Date.now() > expires) {
        validTokens.delete(token);
        return res.status(401).json({ error: 'Session expired' });
    }

    next();
}

// Upload endpoint
app.post('/api/upload', verifyAdminToken, upload.single('file'), async (req, res) => {
    try {
        if (!process.env.GETPRONTO_API_KEY || !req.file) {
            return res.status(400).json({ error: 'Invalid request or missing API key' });
        }

        const FormData = require('form-data');
        const formData = new FormData();
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });

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

        const imageUrl = response.data?.data?.url;
        if (!imageUrl) throw new Error('Provider response error');

        res.json({
            success: true,
            data: { url: imageUrl, filename: req.file.originalname }
        });

    } catch (error) {
        console.error('Upload Error:', error.message);
        res.status(500).json({ error: 'Upload failed: ' + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Backend running on port ${PORT}`);
});
