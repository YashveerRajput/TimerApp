# Focus Timer

A full-stack web application for time management with Apple-inspired minimal design.

## Features

- **Timer Mode**: Countdown timer with customizable minutes/seconds
- **Stopwatch Mode**: Stopwatch with lap functionality and millisecond precision
- **Apple-Style UI**: Glassmorphism, soft shadows, smooth animations
- **Fullscreen Support**: Toggle fullscreen mode for distraction-free focus
- **Dynamic Font Sizing**: Adjust clock size with a slider
- **Session History**: Save and view past timer/stopwatch sessions
- **Keyboard Shortcuts**: Space (start/pause), R (reset), L (lap), F (fullscreen)

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: EJS templating + Vanilla JavaScript
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Font**: Inter (Google Fonts)

## Project Structure

```
Timer/
├── app.js                 # Main Express server
├── package.json           # Dependencies
├── .env                   # Environment variables
├── config/
│   └── db.js             # MongoDB connection
├── models/
│   └── TimerSession.js   # MongoDB schema
├── routes/
│   └── index.js          # Express routes
├── views/
│   ├── index.ejs         # Main timer page
│   └── history.ejs       # History page
└── public/
    └── js/
        └── timer.js      # Client-side timer logic
```

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up MongoDB**:
   - Make sure MongoDB is running locally on `mongodb://localhost:27017`
   - Or update the `MONGODB_URI` in `.env` file with your connection string

3. **Run the application**:
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   ```
   http://localhost:3000
   ```

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/focus-timer
PORT=3000
```

## Usage

### Timer Mode
1. Set minutes and seconds
2. Click "Set Timer" to apply
3. Press "Start" to begin countdown
4. Timer will alert when complete

### Stopwatch Mode
1. Switch to "Stopwatch" tab
2. Press "Start" to begin
3. Press "Lap" to record lap times
4. View laps in the panel

### Keyboard Shortcuts
- **Space**: Start/Pause
- **R**: Reset
- **L**: Record Lap (stopwatch mode)
- **F**: Toggle Fullscreen

### Save Sessions
- Click the save icon (bottom center) to save current session
- View all saved sessions at `/history`

## API Endpoints

- `GET /` - Main timer page
- `GET /history` - Session history page
- `POST /api/save-session` - Save a timer/stopwatch session
- `GET /api/last-timer` - Get last used timer settings
- `DELETE /api/session/:id` - Delete a session

## Design Philosophy

- **Minimal**: Clean interface, no distractions
- **Apple-inspired**: Glassmorphism, smooth transitions, soft shadows
- **Dark theme**: Black background (#000) with white text (#fff)
- **Responsive**: Works on mobile and desktop
- **Accessible**: Clear contrast, readable fonts

## License

ISC
