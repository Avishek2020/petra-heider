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
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf8');
    console.log(`Successfully wrote ${messages.length} message(s) to ${MESSAGES_FILE}`);
  } catch (err) {
    console.error('Error writing messages file:', err);
    throw err;
  }
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
    const { name, ort, beziehung, message } = req.body || {};
    console.log('Received POST request:', { name, ort, beziehung, message });
    
    if (!name || !message || typeof name !== 'string' || typeof message !== 'string') {
      console.log('Validation failed: name or message missing');
      return res.status(400).json({ error: 'Name and message are required' });
    }
    const date = new Date().toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    const ortValue = (ort != null && typeof ort === 'string') ? ort.trim() : '';
    // Always save Beziehung field, even if empty
    let relValue = '';
    if (beziehung != null && beziehung !== undefined) {
      if (typeof beziehung === 'string') {
        relValue = beziehung.trim();
      } else {
        relValue = String(beziehung).trim();
      }
    }
    // Fallback: also check for 'relationship' in case old clients send it
    if (!relValue && req.body.relationship != null && req.body.relationship !== undefined) {
      relValue = typeof req.body.relationship === 'string' ? req.body.relationship.trim() : String(req.body.relationship).trim();
    }
    console.log('Processing values - ort:', ortValue, 'beziehung received:', beziehung, 'beziehung saved:', relValue);
    const messages = readMessages();
    const newMsg = { name: name.trim(), Beziehung: relValue, ort: ortValue, message: message.trim(), date };
    console.log('Saving message with Beziehung:', newMsg.Beziehung, 'Full message:', JSON.stringify(newMsg, null, 2));
    messages.unshift(newMsg);
    writeMessages(messages);
    console.log('Message saved successfully:', newMsg);
    res.status(201).json(newMsg);
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ error: 'Failed to save message', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
