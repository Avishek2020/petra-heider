const { list, put } = require('@vercel/blob');

const BLOB_PATHNAME = 'messages.json';

async function getMessagesFromBlob() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const { blobs } = await list({ prefix: 'messages' });
    const blob = blobs.find((b) => b.pathname === BLOB_PATHNAME);
    if (!blob || !blob.url) return [];
    const res = await fetch(blob.url);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function saveMessagesToBlob(messages) {
  const blob = await put(BLOB_PATHNAME, JSON.stringify(messages, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return blob;
}

async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const messages = await getMessagesFromBlob();
      return res.status(200).json(messages);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read messages' });
    }
  }

  if (req.method === 'POST') {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(503).json({
        error: 'Blob storage not configured. Add a Blob store in the Vercel project and set BLOB_READ_WRITE_TOKEN.',
      });
    }
    try {
      const { name, ort, beziehung, message } = req.body || {};
      if (!name || !message || typeof name !== 'string' || typeof message !== 'string') {
        return res.status(400).json({ error: 'Name and message are required' });
      }
      const date = new Date().toLocaleDateString('de-DE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
      const ortValue = ort != null && typeof ort === 'string' ? ort.trim() : '';
      const relValue = beziehung != null && typeof beziehung === 'string' ? beziehung.trim() : '';
      const messages = await getMessagesFromBlob();
      const newMsg = { name: name.trim(), Beziehung: relValue, ort: ortValue, message: message.trim(), date };
      messages.unshift(newMsg);
      await saveMessagesToBlob(messages);
      return res.status(201).json(newMsg);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to save message' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

module.exports = handler;
