const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database/medications.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error('Connection error:', err.message);
  console.log(`✅ Connected to SQLite database at ${dbPath}`);
});

// Users table
const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  role TEXT
)`;
db.run(createUsersTable);

// Medications table
const createMedicationsTable = `CREATE TABLE IF NOT EXISTS medications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  dosage TEXT,
  frequency TEXT,
  taken INTEGER DEFAULT 0
)`;
db.run(createMedicationsTable);

module.exports = db;