// Local development server entry point
// Uses the shared Express app from app.js

const app = require('./app');

const PORT = process.env.PORT || 3000;

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

