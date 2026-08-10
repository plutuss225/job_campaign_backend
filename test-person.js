require('dotenv').config();
const pool = require('./src/db');

async function test() {
  try {
    const [rows] = await pool.query('DESCRIBE Person');
    console.log('Person Columns:', rows);
  } catch (err) {
    console.error('MySQL connection failed:', err);
  } finally {
    pool.end();
  }
}
test();
