const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const MESSAGES_FILE = path.join(__dirname, 'messages.json');

app.use(express.json());
app.use(express.static(__dirname));

function readMessages() {
  try {
    const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

function writeMessages(messages) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf8');
}

app.get('/api/messages', (req, res) => {
  try {
    const messages = readMessages();
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read messages' });
  }
});

app.post('/api/messages', (req, res) => {
  try {
    const { name, ort, relationship, message } = req.body || {};
    if (!name || !message || typeof name !== 'string' || typeof message !== 'string') {
      return res.status(400).json({ error: 'Name and message are required' });
    }
    const date = new Date().toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    const ortValue = (ort != null && typeof ort === 'string') ? ort.trim() : '';
    const relValue = (relationship != null && typeof relationship === 'string') ? relationship.trim() : '';
    const messages = readMessages();
    const newMsg = { name: name.trim(), ort: ortValue, relationship: relValue, message: message.trim(), date };
    messages.unshift(newMsg);
    writeMessages(messages);
    res.status(201).json(newMsg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
