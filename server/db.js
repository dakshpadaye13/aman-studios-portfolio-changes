const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'portfolio.db');
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create videos table
db.exec(`
  CREATE TABLE IF NOT EXISTS videos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT NOT NULL,
    category    TEXT NOT NULL,
    description TEXT DEFAULT '',
    youtube_url TEXT DEFAULT '',
    video_path  TEXT DEFAULT '',
    thumbnail_path TEXT DEFAULT '',
    created_at  TEXT DEFAULT (datetime('now'))
  );
`);

console.log(`📦 Database ready: ${DB_PATH}`);

module.exports = db;
