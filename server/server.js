const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();

// Simple CORS setup
app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('✅ Test endpoint hit successfully');
  res.json({ 
    message: 'Backend is running!',
    timestamp: new Date().toISOString(),
    env: {
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      port: process.env.PORT || 5000
    }
  });
});

// The main endpoint
app.post('/api/ask-fin', async (req, res) => {
  console.log('✅ /api/ask-fin endpoint hit successfully');
  console.log('Request body:', req.body);
  
  try {
    const { text } = req.body;
    
    if (!text) {
      console.log('❌ No text provided');
      return res.status(400).json({ error: 'Text is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.log('❌ No Gemini API key');
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    console.log('🤖 Calling Gemini API...');
    const prompt = `You are Fin, a helpful AI assistant. Analyze this message: "${text}"`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    console.log('✅ Gemini API response received');
    const response = { text: responseText, timestamp };
    
    res.json(response);
  } catch (error) {
    console.error('❌ Error in /api/ask-fin:', error);
    res.status(500).json({ 
      error: 'Failed to fetch response from Gemini API',
      details: error.message 
    });
  }
});

// Catch all other routes
app.use('*', (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    availableRoutes: [
      'GET /api/test',
      'POST /api/ask-fin'
    ]
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('🚀 Server starting...');
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log('GET  /api/test');
  console.log('POST /api/ask-fin');
  console.log('Environment:');
  console.log(`GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Not set'}`);
  console.log(`PORT: ${PORT}`);
  console.log('Watching for requests...');
});
