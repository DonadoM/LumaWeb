const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./DATA.sqlite', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

module.exports = db;