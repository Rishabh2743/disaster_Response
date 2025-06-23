require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const rateLimit = require('express-rate-limit');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});
app.use(cors({
  origin: 'http://localhost:3000', // or your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
// Global Rate Limiter (applies to all /api/* routes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per 15 minutes
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Make socket available in routes
global.io = io;

// Middleware
app.use(cors());
app.use(express.json());

// Apply limiter to all /api routes
app.use('/api', limiter);

// Route Modules
const disasterRoutes = require('./routes/disasters');
const socialRoutes = require('./routes/socialMedia');
const resourceRoutes = require('./routes/resources');
const updateRoutes = require('./routes/updates');
const verifyRoutes = require('./routes/verification');
const geocodeRoutes = require('./routes/geocode');

// Mount API routes
app.use('/api/disasters', disasterRoutes);
app.use('/api/disasters/:id/social-media', socialRoutes);
app.use('/api/disasters/:id/resources', resourceRoutes);
app.use('/api/updates', updateRoutes);
app.use('/api/disasters', verifyRoutes);
app.use('/api/geocode', geocodeRoutes);

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start server
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
} else {
  module.exports = app; // for testing
}
