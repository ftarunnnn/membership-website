import sqlite3 from 'sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const dbPath = path.resolve(process.env.DB_FILE || './database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database at:', dbPath);
  }
});

// Helper wrapper to use async/await with SQLite
export const query = {
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

export const initDb = async () => {
  try {
    // 1. Create Users Table
    await query.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Create Membership Plans Table
    await query.run(`
      CREATE TABLE IF NOT EXISTS membership_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        price REAL NOT NULL,
        billing_period TEXT NOT NULL,
        features TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Create Subscriptions Table
    await query.run(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        plan_id INTEGER NOT NULL,
        status TEXT DEFAULT 'active',
        start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        end_date DATETIME NOT NULL,
        auto_renew INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (plan_id) REFERENCES membership_plans(id)
      )
    `);

    // 4. Create Payments Table
    await query.run(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        subscription_id INTEGER,
        amount REAL NOT NULL,
        payment_status TEXT DEFAULT 'pending',
        payment_gateway TEXT NOT NULL,
        transaction_id TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL
      )
    `);

    // 5. Create Content Table
    await query.run(`
      CREATE TABLE IF NOT EXISTS content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        content_type TEXT NOT NULL,
        membership_level TEXT NOT NULL,
        content_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables verified/created successfully.');

    // Seed default plans if they don't exist
    const planCount = await query.get('SELECT COUNT(*) as count FROM membership_plans');
    if (planCount.count === 0) {
      console.log('Seeding default membership plans...');
      await query.run(
        `INSERT INTO membership_plans (name, price, billing_period, features) VALUES (?, ?, ?, ?)`,
        ['Free', 0, 'monthly', JSON.stringify(['Limited content access', 'Basic text tutorials', 'Community forum viewing'])]
      );
      await query.run(
        `INSERT INTO membership_plans (name, price, billing_period, features) VALUES (?, ?, ?, ?)`,
        ['Pro', 299, 'monthly', JSON.stringify(['Full access to standard courses', 'Exclusive video guides', 'Downloadable source code templates', 'Priority email support'])]
      );
      await query.run(
        `INSERT INTO membership_plans (name, price, billing_period, features) VALUES (?, ?, ?, ?)`,
        ['Premium', 799, 'monthly', JSON.stringify(['Unlimited access to all content', 'Advanced microservices masterclass', 'Access to exclusive community chat', 'Weekly 1-on-1 Q&A sessions', 'Certificates of completion'])]
      );
    }

    // Seed default content if empty
    const contentCount = await query.get('SELECT COUNT(*) as count FROM content');
    if (contentCount.count === 0) {
      console.log('Seeding default protected content...');
      await query.run(
        `INSERT INTO content (title, description, content_type, membership_level, content_url) VALUES (?, ?, ?, ?, ?)`,
        [
          'Getting Started with Javascript Basics',
          'Learn the fundamental blocks of JavaScript: variables, arrays, and functions in this quick introductory guide.',
          'article',
          'Free',
          'https://www.youtube.com/embed/W6NZfCO5SIk'
        ]
      );
      await query.run(
        `INSERT INTO content (title, description, content_type, membership_level, content_url) VALUES (?, ?, ?, ?, ?)`,
        [
          'Building RESTful APIs with Node.js & Express',
          'A complete video walkthrough showing you how to set up an Express app, route requests, configure environment variables, and structure responses.',
          'video',
          'Pro',
          'https://www.youtube.com/embed/Oe421EPjeBE'
        ]
      );
      await query.run(
        `INSERT INTO content (title, description, content_type, membership_level, content_url) VALUES (?, ?, ?, ?, ?)`,
        [
          'Advanced Architecture: Scaling Node.js with Microservices',
          'Masterclass on message queues, Docker, and API gateways. Learn how to divide your monolith into resilient microservices.',
          'video',
          'Premium',
          'https://www.youtube.com/embed/1v_7zzA_jBc'
        ]
      );
      await query.run(
        `INSERT INTO content (title, description, content_type, membership_level, content_url) VALUES (?, ?, ?, ?, ?)`,
        [
          'Premium Boilerplate Project Code Template',
          'A zipped React + Node full stack boilerplate with authentication, routing, and SQLite setup configured and ready to build upon.',
          'pdf',
          'Pro',
          'https://github.com/ftarunnnn/membership-website/archive/refs/heads/main.zip'
        ]
      );
    }

    // Seed default admin account if not exists
    const adminUser = await query.get(`SELECT * FROM users WHERE email = ?`, ['admin@membership.com']);
    if (!adminUser) {
      console.log('Seeding default administrator account...');
      const adminPassHash = await bcrypt.hash('admin123', 10);
      await query.run(
        `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
        ['Admin User', 'admin@membership.com', adminPassHash, 'admin']
      );
      console.log('Admin user seeded: admin@membership.com / admin123');
    }
  } catch (error) {
    console.error('Error during database initialization:', error.message);
  }
};

export default db;
