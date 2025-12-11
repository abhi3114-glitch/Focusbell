import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ProgressRing from './components/ProgressRing';
import Controls from './components/Controls';
import History from './components/History';
import GoalWidget from './components/GoalWidget';
import ThemeSelector from './components/ThemeSelector';
import VolumeControl from './components/VolumeControl';
import FocusIntent from './components/FocusIntent';
import BreathingGuide from './components/BreathingGuide';
import ShortcutsHelp from './components/ShortcutsHelp';
import SessionTasks from './components/SessionTasks';
import WeeklyChart from './components/WeeklyChart';
import Confetti from './components/Confetti';
import QuoteWidget from './components/QuoteWidget';
import Settings from './components/Settings';
import { ToastProvider, useToast } from './components/ToastProvider';
import { useTimer, MODES } from './hooks/useTimer';
import { useAudio } from './hooks/useAudio';
import { useAmbientSound, NOISE_TYPES } from './hooks/useAmbientSound';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useDailyStats } from './hooks/useDailyStats';
import { useZenMode } from './hooks/useZenMode';
import { usePiP } from './hooks/usePiP';
import { THEMES } from './utils/themes';
import { formatTime } from './utils/format';

// Separate inner component to use Toast Context
const FocusBellApp = () => {
  // --- STATE ---
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('focusbell_history');
    return saved ? JSON.parse(saved) : [];
  });

  // UI State
  const [showHistory, setShowHistory] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [compactMode, setCompactMode] = useState(false);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('focusbell_theme');
    return saved ? JSON.parse(saved) : THEMES.MIDNIGHT;
  });

  // Preferences
  const [autoStart, setAutoStart] = useState(false);
  const [smartLongBreak, setSmartLongBreak] = useState(false);
  const [tickStyle, setTickStyle] = useState('mechanical'); // mechanical, digital, heartbeat
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);

  // Session Tasks
  const [sessionTasks, setSessionTasks] = useState([]);

  // Confetti State
  const [celebrate, setCelebrate] = useState(false);

  // Audio State
  const [chimeVol, setChimeVol] = useState(0.5);
  const [ambientVol, setAmbientVol] = useState(0.4);
  const [tickVol, setTickVol] = useState(0);
  const [intent, setIntent] = useState('');

  // --- HOOKS ---
  const { addToast } = useToast();
  const { playChime, playTick, setCustomChime } = useAudio(chimeVol, tickVol);
  const { playAmbient, currentAmbient } = useAmbientSound(ambientVol);
  const { dailyGoal, todayTotal, currentStreak, setDailyGoal } = useDailyStats(history);

  const { togglePiP, pipWindow } = usePiP();

  const handleCustomChime = async (file) => {
    const success = await setCustomChime(file);
    if (success) addToast('Custom chime loaded!', 'success');
    else addToast('Failed to load audio.', 'error');
  };

  // Auto-Start and Long Break Logic
  const handleNextPhase = (lastMode) => {
    if (!autoStart) return;

    let nextMode = MODES.POMODORO;

    if (lastMode === 'Pomodoro') {
      const newCount = pomodorosCompleted + 1;
      setPomodorosCompleted(newCount);

      if (smartLongBreak && newCount % 4 === 0) {
        nextMode = MODES.BREAK;
        addToast("Time for a Long Break!", "info");
        // Ideally modify time here, but simple break for now
      } else {
        nextMode = MODES.BREAK;
      }
    } else {
      // After break, back to work
      nextMode = MODES.POMODORO;
    }

    switchMode(nextMode);
    start();
    addToast(`Auto-starting ${nextMode.label}`, "info");
  };

  const handleTimerComplete = () => {
    playChime();
    playAmbient('none');
    if (Notification.permission === 'granted') {
      new Notification("FocusBell", { body: "Time's up!" });
    }
    addToast("Session Completed!", "success");

    // Log session
    const newEntry = {
      mode: mode.label,
      duration: mode.time,
      timestamp: Date.now(),
      intent: intent || 'Focus Session'
    };
    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);
    setIntent('');

    // Check Daily Goal Celebration
    // Calc today total with new entry
    // If crossed goal, celebrate
    const todaySeconds = updatedHistory
      .filter(h => new Date(h.timestamp).toDateString() === new Date().toDateString())
      .reduce((acc, curr) => acc + curr.duration, 0);

    // Simple logic: if new entry pushed us over or close to goal
    // Or if we just finished a session and are ABOVE goal
    if (todaySeconds >= dailyGoal * 60) {
      // Only celebrate if we haven't recently? simple check: if todaySeconds - duration < goal, means we JUST crossed it.
      if ((todaySeconds - newEntry.duration) < dailyGoal * 60) {
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 8000);
        addToast("Daily Goal Reached! 🎉", "success");
      }
    }

    handleNextPhase(mode.label);
  };

  const timer = useTimer(MODES.MICRO, handleTimerComplete);
  const { timeLeft, isActive, mode, start, pause, reset, switchMode, setCustomTime } = timer;

  const isZen = useZenMode(isActive);

  // --- EFFECTS ---

  useEffect(() => {
    if (isActive && tickVol > 0) {
      const tickInterval = setInterval(() => {
        playTick(tickStyle);
      }, 1000);
      return () => clearInterval(tickInterval);
    }
  }, [isActive, tickVol, playTick, tickStyle]);

  useEffect(() => { localStorage.setItem('focusbell_history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('focusbell_theme', JSON.stringify(theme)); }, [theme]);

  useKeyboardShortcuts({
    onSpace: () => isActive ? pause() : (intent || !isActive) ? start() : null,
    onEsc: reset,
    onQuestion: () => setShowShortcuts(prev => !prev)
  });

  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  // Clear Data
  const handleClearData = () => {
    setHistory([]);
    localStorage.removeItem('focusbell_history');
    addToast("All data cleared.", "error");
    setShowSettings(false);
  };

  // --- RENDER HELPERS ---
  const ringValue = (timeLeft / mode.time) * 100;

  const TimerUI = ({ minimal = false }) => (
    <div className={`flex flex-col items-center justify-center ${minimal ? 'scale-75' : ''}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className={`${minimal ? 'text-5xl' : 'text-7xl'} font-thin tracking-tighter tabular-nums select-none cursor-default`}>
            {formatTime(timeLeft)}
          </span>
          {!minimal && (
            <span className={`text-sm font-medium uppercase tracking-widest mt-4 transition-colors ${theme.classes.accent}`}>
              {isActive ? (intent || 'Focusing') : 'Ready'}
            </span>
          )}
        </div>

        <ProgressRing
          radius={minimal ? 120 : 180}
          stroke={minimal ? 8 : 6}
          progress={ringValue}
          type={mode.id}
          colorOverride={theme.colors.primary}
        />
      </div>

      {isActive && mode.id === 'break' && !minimal && <BreathingGuide isActive={isActive} />}
    </div>
  );

  return (
    <div className={`min-h-screen ${theme.classes.bg} ${theme.classes.text} flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-700`}>

      <Confetti active={celebrate} />

      {/* Dynamic Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse transition-colors duration-1000"
          style={{ backgroundColor: theme.colors.primary, opacity: 0.1 }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse delay-1000 transition-colors duration-1000"
          style={{ backgroundColor: theme.colors.secondary, opacity: 0.1 }}
        ></div>
      </div>

      {/* Top Bar Widgets */}
      <div className={`absolute top-0 left-0 w-full p-6 flex justify-between items-start z-30 transition-opacity duration-1000 ${isZen || compactMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <GoalWidget
          todayTotal={todayTotal}
          dailyGoal={dailyGoal}
          streak={currentStreak}
          onGoalChange={setDailyGoal}
        />

        <div className="flex items-center gap-4">
          {/* Settings Trigger */}
          <button
            onClick={() => setShowSettings(true)}
            className="text-white/40 hover:text-white transition-colors"
            title="Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>

          {!!window.documentPictureInPicture && (
            <button
              onClick={togglePiP}
              className="text-white/40 hover:text-white transition-colors"
              title="Enter Picture-in-Picture"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </button>
          )}

          <button
            onClick={() => playAmbient(currentAmbient.id !== 'none' ? 'none' : 'brown')}
            className={`text-xs uppercase tracking-widest px-3 py-1 rounded-full border ${currentAmbient.id !== 'none' ? 'border-white text-white' : 'border-white/20 text-white/40'}`}
          >
            {currentAmbient.id !== 'none' ? currentAmbient.label : 'Silence'}
          </button>

          <div className="w-px h-6 bg-white/10"></div>

          <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />
          <VolumeControl
            chimeVol={chimeVol} onChimeVolChange={setChimeVol}
            ambientVol={ambientVol} onAmbientVolChange={(v) => { setAmbientVol(v); playAmbient(currentAmbient.id); }}
            tickVol={tickVol} onTickVolChange={setTickVol}
            onCustomChimeUpload={handleCustomChime}
          />

          <button
            onClick={() => setShowShortcuts(true)}
            className="text-white/40 hover:text-white transition-colors w-6 text-center font-serif italic"
            title="Shortcuts"
          >
            ?
          </button>

          <button
            onClick={() => setShowHistory(true)}
            className="text-white/40 hover:text-white transition-colors"
            title="History"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center w-full max-w-xl px-4">
        <div className={`mb-4 text-center transition-opacity duration-700 ${isZen ? 'opacity-0' : 'opacity-100'}`}>
          <h1 className="text-2xl font-light tracking-widest uppercase text-white/50">FocusBell</h1>
          {!isActive && !compactMode && <QuoteWidget />}
        </div>

        <TimerUI />

        {/* Input Layer */}
        {!isActive && !compactMode && (
          <div className={`transition-opacity duration-500 w-full flex flex-col items-center ${isZen ? 'opacity-0' : 'opacity-100'}`}>
            <FocusIntent intent={intent} onIntentChange={setIntent} />
            <SessionTasks tasks={sessionTasks} onTasksChange={setSessionTasks} />
          </div>
        )}

        {isActive && sessionTasks.length > 0 && !compactMode && (
          <div className={`mt-8 transition-opacity duration-500 ${isZen ? 'opacity-50' : 'opacity-100'}`}>
            {/* Show simplified tasks view while running */}
            <div className="text-white/30 text-xs uppercase tracking-widest text-center mb-2">Next Task</div>
            <div className="text-white/80 text-center text-sm">{sessionTasks.find(t => !t.completed)?.text || "All done!"}</div>
          </div>
        )}

        {/* Controls Container */}
        <div className={`transition-all duration-1000 ${isZen || compactMode ? 'opacity-0 transform translate-y-10' : 'opacity-100 transform translate-y-0'}`}>
          <Controls
            isActive={isActive}
            onStart={start}
            onPause={pause}
            onReset={reset}
            currentMode={mode}
            onModeChange={switchMode}
            onCustomTimeChange={setCustomTime}
          />
        </div>
      </div>

      <History
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        history={history}
        theme={theme}
      />

      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        autoStart={autoStart} setAutoStart={setAutoStart}
        longBreak={smartLongBreak} setLongBreak={setSmartLongBreak}
        tickStyle={tickStyle} setTickStyle={setTickStyle}
        compactMode={compactMode} setCompactMode={setCompactMode}
        onClearData={handleClearData}
      />

      <ShortcutsHelp
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      {/* PiP Portal */}
      {pipWindow && createPortal(
        <div className={`h-full w-full flex items-center justify-center ${theme.classes.bg} ${theme.classes.text}`}>
          <TimerUI minimal />
          <div className="absolute bottom-4 flex gap-4 opacity-0 hover:opacity-100 transition-opacity">
            <button onClick={isActive ? pause : start} className="p-2 bg-white/10 rounded-full">
              {isActive ? '⏸' : '▶'}
            </button>
            <button onClick={reset} className="p-2 bg-white/10 rounded-full">↺</button>
          </div>
        </div>,
        pipWindow.document.body
      )}

    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <FocusBellApp />
    </ToastProvider>
  );
}

export default App;
