import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';
import app from './app';
import connectDB from './config/database';
import { initializeSocket } from './sockets';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 5000;

// Upload dir (cross-platform)
const uploadDir = process.platform === 'win32'
  ? path.join(process.env.TEMP || 'C:/temp', 'neurolearn-uploads')
  : '/tmp/uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

(async () => {
  // Connect to DB (auto-fallback to in-memory if no MongoDB)
  await connectDB();

  const httpServer = createServer(app);

  try { initializeSocket(httpServer); } catch (e: any) {
    console.warn('⚠️ Socket.io init warning:', e.message);
  }

  httpServer.listen(PORT, () => {
    console.log('╔══════════════════════════════════════════════╗');
    console.log(`║  🧠 NeuroLearn AI — http://localhost:${PORT}      ║`);
    console.log('╚══════════════════════════════════════════════╝\n');
  });
})();
