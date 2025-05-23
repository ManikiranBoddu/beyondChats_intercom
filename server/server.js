const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use('/api', apiRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Temporary DELETE endpoint
app.delete('/api/messages/:index', async (req, res) => {
  console.log(`Handling DELETE /api/messages/${req.params.index}`);
  try {
    const index = parseInt(req.params.index);
    const messagesPath = path.join(__dirname, 'data', 'messages.json');
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

// Catch-all for 404
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Route not found' });
});

app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`));