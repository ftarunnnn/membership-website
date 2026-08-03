import app from './app.js';
import { initDb } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize Database & Run Server
const startServer = async () => {
  try {
    // Run SQLite DB setups and seeding
    await initDb();
    
    app.listen(PORT, () => {
      console.log(`Server is running in development mode on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
