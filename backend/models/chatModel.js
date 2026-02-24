import Database from 'better-sqlite3';
const db = new Database('database.db');

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT,
    role TEXT CHECK(role IN ('user', 'assistant')),
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
  );
`);

export const ChatModel = {
  createSession: (sessionId) => {
    const stmt = db.prepare('INSERT OR IGNORE INTO sessions (id) VALUES (?)');
    return stmt.run(sessionId);
  },

  saveMessage: (sessionId, role, content) => {
    const stmt = db.prepare('INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)');
    db.prepare('UPDATE sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(sessionId);
    return stmt.run(sessionId, role, content);
  },

  getHistory: (sessionId) => {
    return db.prepare('SELECT role, content FROM messages WHERE session_id = ? ORDER BY created_at ASC').all(sessionId);
  },

  getSessions: () => {
    return db.prepare('SELECT id as sessionId, updated_at as lastUpdated FROM sessions ORDER BY updated_at DESC').all();
  }
};