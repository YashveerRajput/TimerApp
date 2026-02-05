// Focus Timer - Main Express Application
// Full-stack timer with Apple-style minimal UI

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./config/db');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Focus Timer Server Started');
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`⏱️  Timer: http://localhost:${PORT}/`);
  console.log(`📜 History: http://localhost:${PORT}/history`);
  console.log('');
  console.log('⌨️  Keyboard Shortcuts:');
  console.log('   Space - Start/Pause');
  console.log('   R - Reset');
  console.log('   L - Lap (Stopwatch mode)');
  console.log('   F - Toggle Fullscreen');
});
