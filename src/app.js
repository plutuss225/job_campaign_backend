const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const personRoutes = require('./routes/personRoutes');
const whatsappRoutes = require('./routes/whatsappRoutes');
const adminRoutes = require('./routes/adminRoutes');
const documentRoutes = require('./routes/documentRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const contactRoutes = require('./routes/contactRoutes');
const blogRoutes = require('./routes/blogRoutes');
const pool = require('./db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(morgan('dev'));
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',') : '*';
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/persons', personRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/blogs', blogRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

// Visit count endpoints
app.get('/api/visits', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT count FROM WebsiteVisits WHERE id = 1');
    const count = rows.length > 0 ? rows[0].count : 0;
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching visit count:', error);
    res.status(500).json({ error: 'Failed to fetch visit count' });
  }
});

app.post('/api/visits/increment', async (req, res) => {
  try {
    await pool.query('UPDATE WebsiteVisits SET count = count + 1 WHERE id = 1');
    const [rows] = await pool.query('SELECT count FROM WebsiteVisits WHERE id = 1');
    const count = rows.length > 0 ? rows[0].count : 0;
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error incrementing visit count:', error);
    res.status(500).json({ error: 'Failed to increment visit count' });
  }
});

module.exports = app;
