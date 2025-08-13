import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from the Next.js dev server
app.use(cors({ origin: ['http://localhost:3000'], methods: ['GET','POST','DELETE','PATCH'] }));
app.use(express.json());

// Data file setup
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'feedback.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.access(dataFile).catch(async () => {
      await fs.writeFile(dataFile, JSON.stringify([], null, 2), 'utf-8');
    });
  } catch (err) {
    console.error('Error ensuring data file:', err);
  }
}

async function readFeedbacks() {
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, 'utf-8');
  return JSON.parse(raw || '[]');
}

async function writeFeedbacks(items) {
  await fs.writeFile(dataFile, JSON.stringify(items, null, 2), 'utf-8');
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// List all feedback
app.get('/api/feedback', async (req, res) => {
  const items = await readFeedbacks();
  // newest first
  items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json(items);
});

// Create feedback
app.post('/api/feedback', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'name, email, and message are required' });
  }
  const items = await readFeedbacks();
  const newItem = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString()
  };
  items.push(newItem);
  await writeFeedbacks(items);
  res.status(201).json(newItem);
});

// Delete feedback by id (simple admin action)
app.delete('/api/feedback/:id', async (req, res) => {
  const { id } = req.params;
  const items = await readFeedbacks();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const [removed] = items.splice(idx, 1);
  await writeFeedbacks(items);
  res.json({ success: true, removed });
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
