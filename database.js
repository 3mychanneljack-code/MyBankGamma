const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./bank.db");

db.serialize(()=>{

db.run(`
CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT UNIQUE,
password TEXT,
balance INTEGER DEFAULT 1000
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS transactions(
id INTEGER PRIMARY KEY AUTOINCREMENT,
sender TEXT,
receiver TEXT,
amount INTEGER,
date TEXT
)
`);

});

module.exports = db;
