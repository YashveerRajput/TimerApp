// Express routes for Focus Timer application
const express = require('express');
const router = express.Router();
const TimerSession = require('../models/TimerSession');

// Home page - Main Timer UI
router.get('/', (req, res) => {
  res.render('index');
});

// History page - Display saved sessions
router.get('/history', async (req, res) => {
  try {
    const sessions = await TimerSession.find().sort({ createdAt: -1 }).limit(50);
    res.render('history', { sessions });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).send('Error loading history');
  }
});

// API: Save timer session
router.post('/api/save-session', async (req, res) => {
  try {
    const { type, duration, laps } = req.body;
    const session = new TimerSession({ type, duration, laps });
    await session.save();
    res.json({ success: true, session });
  } catch (error) {
    console.error('Error saving session:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Get last timer settings
router.get('/api/last-timer', async (req, res) => {
  try {
    const lastTimer = await TimerSession.findOne({ type: 'timer' }).sort({ createdAt: -1 });
    res.json({ lastTimer });
  } catch (error) {
    console.error('Error fetching last timer:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: Delete session
router.delete('/api/session/:id', async (req, res) => {
  try {
    await TimerSession.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
