require('dotenv').config();
const pool = require('./src/db');

async function createTable() {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS Contact (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) DEFAULT NULL,
        message TEXT NOT NULL,
        status ENUM('unread', 'read', 'resolved') DEFAULT 'unread',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await pool.query(query);
    console.log('Contact table created successfully.');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    pool.end();
  }
}
createTable();
