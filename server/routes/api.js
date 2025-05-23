const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// GET /api/messages
router.get('/messages', async (req, res) => {
  try {
    const messagesPath = path.join(__dirname, '..', 'data', 'messages.json');
    const messages = JSON.parse(await fs.readFile(messagesPath, 'utf8'));
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /api/messages
router.post('/messages', async (req, res) => {
  try {
    const messagesPath = path.join(__dirname, '..', 'data', 'messages.json');
    const messages = JSON.parse(await fs.readFile(messagesPath, 'utf8'));
    const newMessage = req.body;
    messages.push(newMessage);
    await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2));
    res.json(newMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// DELETE /api/messages/:index (Commented out temporarily)
/*
console.log('Registering DELETE /api/messages/:index');
router.delete('/messages/:index', async (req, res) => {
  console.log(`Handling DELETE /api/messages/${req.params.index}`);
  try {
    const index = parseInt(req.params.index);
    const messagesPath = path.join(__dirname, '..', 'data', 'messages.json');
    const messages = JSON.parse(await fs.readFile(messagesPath, 'utf8'));

    if (index < 0 || index >= messages.length) {
      return res.status(400).json({ error: 'Invalid message index' });
    }

    messages.splice(index, 1);
    await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2));
    res.json(messages);
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});
*/

// POST /api/copilot/suggestions
router.post('/copilot/suggestions', async (req, res) => {
  const { message } = req.body;
  try {
    const prompt = `You are a customer service AI. Provide a helpful response for the following customer query: "${message}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.json({
      text: text,
      links: ["Getting a refund", "Refund for an order placed by mistake", "Refund for an unwanted gift"],
    });
  } catch (error) {
    console.error('Error in /api/copilot/suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch suggestion' });
  }
});

// POST /api/copilot/rephrase
router.post('/copilot/rephrase', async (req, res) => {
  const { message, tone } = req.body;
  try {
    const prompt = `Rephrase the following message to be more ${tone}, returning only the rephrased sentence without any additional explanation or list: "${message}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    res.json({ rephrased: text });
  } catch (error) {
    console.error('Error in /api/copilot/rephrase:', error);
    res.status(500).json({ error: 'Failed to rephrase message' });
  }
});

module.exports = router;