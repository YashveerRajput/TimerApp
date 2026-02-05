// Vercel serverless function entry that mounts the Express app.

const app = require('../app');

// Vercel Node.js serverless function handler
module.exports = (req, res) => {
  return app(req, res);
};

