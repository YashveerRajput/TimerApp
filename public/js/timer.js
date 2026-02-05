// Client-side timer logic for Focus Timer
// Vanilla JavaScript with Apple-style smooth interactions

// State management
let timerState = {
  mode: 'timer', // 'timer' or 'stopwatch'
  isRunning: false,
  isPaused: false,
  totalSeconds: 0,
  startTime: null,
  elapsedTime: 0,
  intervalId: null,
  laps: []
};

// Auto-hide state
let autoHideState = {
  enabled: true, // Always enabled
  timeoutId: null,
  controlsHidden: false
};

// DOM elements
const timerDisplay = document.getElementById('timer-display');
const millisecondsDisplay = document.getElementById('milliseconds-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const lapBtn = document.getElementById('lap-btn');
const timerModeBtn = document.getElementById('timer-mode-btn');
const stopwatchModeBtn = document.getElementById('stopwatch-mode-btn');
const timerSettings = document.getElementById('timer-settings');
const lapsContainer = document.getElementById('laps-container');
const lapsList = document.getElementById('laps-list');
const minutesInput = document.getElementById('minutes-input');
const secondsInput = document.getElementById('seconds-input');
const setTimerBtn = document.getElementById('set-timer-btn');
const fontSlider = document.getElementById('font-slider');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const saveSessionBtn = document.getElementById('save-session-btn');
const alertSound = document.getElementById('alert-sound');

// Initialize
init();

function init() {
  // Load last timer settings
  loadLastTimer();
  
  // Auto-hide mouse tracking
  document.addEventListener('mousemove', handleMouseMove);
  
  // Event listeners
  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);
  lapBtn.addEventListener('click', recordLap);
  timerModeBtn.addEventListener('click', () => switchMode('timer'));
  stopwatchModeBtn.addEventListener('click', () => switchMode('stopwatch'));
  setTimerBtn.addEventListener('click', setTimerFromInputs);
  fontSlider.addEventListener('input', updateFontSize);
  fullscreenBtn.addEventListener('click', toggleFullscreen);
  saveSessionBtn.addEventListener('click', saveSession);
  
  // Set initial timer value
  setTimerFromInputs();
}

// Load last timer settings from database
async function loadLastTimer() {
  try {
    const response = await fetch('/api/last-timer');
    const data = await response.json();
    
    if (data.lastTimer) {
      const duration = data.lastTimer.duration;
      const parts = duration.split(':');
      if (parts.length >= 2) {
        minutesInput.value = parseInt(parts[0]) || 0;
        secondsInput.value = parseInt(parts[1]) || 0;
        setTimerFromInputs();
      }
    }
  } catch (error) {
    console.error('Error loading last timer:', error);
  }
}

// Switch between timer and stopwatch modes
function switchMode(mode) {
  timerState.mode = mode;
  resetTimer();
  
  // Update UI
  if (mode === 'timer') {
    timerModeBtn.classList.add('bg-white/10', 'text-white');
    stopwatchModeBtn.classList.remove('bg-white/10', 'text-white');
    timerSettings.classList.remove('hidden');
    lapsContainer.classList.add('hidden');
    lapBtn.classList.add('hidden');
    millisecondsDisplay.classList.add('hidden');
  } else {
    stopwatchModeBtn.classList.add('bg-white/10', 'text-white');
    timerModeBtn.classList.remove('bg-white/10', 'text-white');
    timerSettings.classList.add('hidden');
    lapsContainer.classList.remove('hidden');
    millisecondsDisplay.classList.remove('hidden');
    lapBtn.classList.remove('hidden');
  }
}

// Set timer from input fields
function setTimerFromInputs() {
  const minutes = parseInt(minutesInput.value) || 0;
  const seconds = parseInt(secondsInput.value) || 0;
  timerState.totalSeconds = minutes * 60 + seconds;
  timerState.elapsedTime = 0;
  updateDisplay();
}

// Start timer/stopwatch
function startTimer() {
  if (timerState.mode === 'timer' && timerState.totalSeconds === 0) {
    alert('Please set a timer duration');
    return;
  }
  
  timerState.isRunning = true;
  timerState.isPaused = false;
  timerState.startTime = Date.now() - timerState.elapsedTime;
  
  // Update button visibility
  startBtn.classList.add('hidden');
  pauseBtn.classList.remove('hidden');
  
  // Start interval
  if (timerState.mode === 'timer') {
    timerState.intervalId = setInterval(updateTimerCountdown, 100);
  } else {
    timerState.intervalId = setInterval(updateStopwatchCountup, 10);
  }
  
  // Start auto-hide timer
  startAutoHideTimer();
}

// Pause timer/stopwatch
function pauseTimer() {
  timerState.isRunning = false;
  timerState.isPaused = true;
  clearInterval(timerState.intervalId);
  
  // Update button visibility
  pauseBtn.classList.add('hidden');
  startBtn.classList.remove('hidden');
  
  // Stop auto-hide and show controls
  clearTimeout(autoHideState.timeoutId);
  showControls();
}

// Reset timer/stopwatch
function resetTimer() {
  timerState.isRunning = false;
  timerState.isPaused = false;
  timerState.elapsedTime = 0;
  timerState.laps = [];
  clearInterval(timerState.intervalId);
  
  // Update button visibility
  pauseBtn.classList.add('hidden');
  startBtn.classList.remove('hidden');
  
  // Stop auto-hide and show controls
  clearTimeout(autoHideState.timeoutId);
  showControls();
  
  // Clear laps
  lapsList.innerHTML = '';
  
  // Reset display
  if (timerState.mode === 'timer') {
    setTimerFromInputs();
  } else {
    timerState.totalSeconds = 0;
    updateDisplay();
  }
}

// Update timer countdown
function updateTimerCountdown() {
  timerState.elapsedTime = Date.now() - timerState.startTime;
  const remainingSeconds = timerState.totalSeconds - Math.floor(timerState.elapsedTime / 1000);
  
  if (remainingSeconds <= 0) {
    // Timer finished
    clearInterval(timerState.intervalId);
    timerState.isRunning = false;
    timerDisplay.textContent = '00:00:00';
    
    // Play alert and flash
    alertSound.play();
    document.body.classList.add('flash-bg');
    setTimeout(() => document.body.classList.remove('flash-bg'), 1500);
    
    // Reset buttons
    pauseBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    
    return;
  }
  
  updateDisplay(remainingSeconds);
}

// Update stopwatch countup
function updateStopwatchCountup() {
  timerState.elapsedTime = Date.now() - timerState.startTime;
  const totalSeconds = Math.floor(timerState.elapsedTime / 1000);
  const milliseconds = timerState.elapsedTime % 1000;
  
  updateDisplay(totalSeconds);
  millisecondsDisplay.textContent = `.${String(milliseconds).padStart(3, '0')}`;
}

// Update display
function updateDisplay(seconds) {
  if (seconds === undefined) {
    seconds = timerState.mode === 'timer' ? timerState.totalSeconds : 0;
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  timerDisplay.textContent = 
    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Record lap (stopwatch only)
function recordLap() {
  if (!timerState.isRunning || timerState.mode !== 'stopwatch') return;
  
  const currentTime = timerDisplay.textContent + millisecondsDisplay.textContent;
  timerState.laps.push(currentTime);
  
  // Add to UI
  const lapItem = document.createElement('div');
  lapItem.className = 'lap-item px-4 py-3 rounded-xl';
  lapItem.innerHTML = `
    <div class="flex justify-between items-center">
      <span class="text-sm text-white/60">Lap ${timerState.laps.length}</span>
      <span class="font-mono">${currentTime}</span>
    </div>
  `;
  lapsList.insertBefore(lapItem, lapsList.firstChild);
}

// Update font size
function updateFontSize() {
  const fontSize = fontSlider.value + 'px';
  timerDisplay.style.fontSize = fontSize;
}

// Toggle fullscreen
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error('Error attempting to enable fullscreen:', err);
    });
  } else {
    document.exitFullscreen();
  }
}

// Handle fullscreen changes
function handleFullscreenChange() {
  const isFullscreen = !!document.fullscreenElement;
  const bottomRightControls = document.getElementById('bottom-controls');
  
  if (isFullscreen) {
    // Hide timer settings in fullscreen
    timerSettings.style.display = 'none';
    // Clear any display styles on bottom right controls so auto-hide CSS can work
    if (bottomRightControls) {
      bottomRightControls.style.display = '';
    }
  } else {
    // Show controls when exiting fullscreen
    if (timerState.mode === 'timer') {
      timerSettings.style.display = 'block';
    }
    // Clear display style so CSS takes over
    if (bottomRightControls) {
      bottomRightControls.style.display = '';
    }
  }
}

// Listen for fullscreen changes
document.addEventListener('fullscreenchange', handleFullscreenChange);

// Save session to database
async function saveSession() {
  if (timerState.mode === 'timer' && timerState.totalSeconds === 0) {
    alert('No timer session to save');
    return;
  }
  
  if (timerState.mode === 'stopwatch' && timerState.elapsedTime === 0) {
    alert('No stopwatch session to save');
    return;
  }
  
  const duration = timerDisplay.textContent;
  const sessionData = {
    type: timerState.mode,
    duration: duration,
    laps: timerState.mode === 'stopwatch' ? timerState.laps : []
  };
  
  try {
    const response = await fetch('/api/save-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sessionData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Show success feedback
      saveSessionBtn.style.transform = 'scale(0.9)';
      setTimeout(() => {
        saveSessionBtn.style.transform = 'scale(1)';
      }, 200);
      
      // Optional: Show a toast notification
      showNotification('Session saved!');
    } else {
      alert('Error saving session');
    }
  } catch (error) {
    console.error('Error saving session:', error);
    alert('Error saving session');
  }
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'fixed top-8 left-1/2 transform -translate-x-1/2 glass-card px-6 py-3 rounded-2xl smooth-transition';
  notification.textContent = message;
  notification.style.zIndex = '9999';
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Space: Start/Pause
  if (e.code === 'Space') {
    e.preventDefault();
    if (timerState.isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }
  
  // R: Reset
  if (e.code === 'KeyR') {
    e.preventDefault();
    resetTimer();
  }
  
  // L: Lap (stopwatch mode)
  if (e.code === 'KeyL' && timerState.mode === 'stopwatch' && timerState.isRunning) {
    e.preventDefault();
    recordLap();
  }
  
  // F: Fullscreen
  if (e.code === 'KeyF') {
    e.preventDefault();
    toggleFullscreen();
  }
});

// Auto-hide functionality

// Handle mouse movement
function handleMouseMove() {
  if (!timerState.isRunning) return;
  
  // Show controls on mouse move (works in fullscreen too)
  showControls();
  
  // Reset the hide timer
  startAutoHideTimer();
}

// Start auto-hide timer (5 seconds)
function startAutoHideTimer() {
  clearTimeout(autoHideState.timeoutId);
  
  autoHideState.timeoutId = setTimeout(() => {
    if (timerState.isRunning) {
      hideControls();
    }
  }, 5000);
}

// Hide controls with fade out
function hideControls() {
  if (autoHideState.controlsHidden) return;
  
  const elements = document.querySelectorAll('.auto-hide-element');
  elements.forEach(el => {
    // Remove any inline display styles that might interfere
    el.style.display = '';
    el.classList.add('hidden');
  });
  
  autoHideState.controlsHidden = true;
  document.body.classList.add('hide-cursor');
}

// Show controls with fade in
function showControls() {
  // Always allow showing controls
  const elements = document.querySelectorAll('.auto-hide-element');
  elements.forEach(el => {
    // Remove any inline display styles that might interfere
    el.style.display = '';
    el.classList.remove('hidden');
  });
  
  autoHideState.controlsHidden = false;
  document.body.classList.remove('hide-cursor');
}
