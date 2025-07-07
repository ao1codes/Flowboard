import { useState, useEffect, useRef } from 'react';

export function useTimer(initialMinutes: number = 25) {
  const [duration, setDuration] = useState(initialMinutes);
  const [timeRemaining, setTimeRemaining] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsPaused(false);
            // timer done - play sound
            console.log('🍅 pomodoro timer done'); // debug
            try {
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGnOKuxWVpO2XS3/TNcywKJHrJ9OuXUAsUYr3z66VKFkxIgL7ztXIfBijE5vLQdyoIIHu7+N2PTgwSX7nywGUtDJNy4Nq0XwkqesSx2I5uKAOZxtK8biMISnyTz6N/UhKDU5prgpRr2F2NQP2r4S7F+N2QQAoHUNqx2I5uKAOZxtK8biMISnyTz6N/UhKDU5prgpRr2F2NQP2r4S7F+N2QQAoHUNqx2I5uKAOZxtK8biMISnyTz6N/UhKDU5prgpRr2F2NQP2r4S7F+N2QQAoHUNqx2I5uKAOZxtK8biMISnyTz6N/UhKDU5prgpRr2F2NQP2r4S7F+N2QQAoHUNqx2I5uKAOZxtK8biMISnyTz6N/UhKDU5prgpRr2F2NQP2r4S7F+N2QQAoHUNqx2I5uKAOZxtK8biMISnyTz6N/UhKDU5prgpRr2F2NQP2r4S7F+N2QQAoHUNqx2I5uKAOZxtK8biMISnyTz6N/UhKDU5prgpRr2F2NQP2r4S7F+N2QQAoH');
              audio.volume = 0.3;
              audio.play().catch(() => {
                // Notification sound failed, but continue
              });
            } catch (error) {
              // audio failed but whatever
            }
            // reset timer after 2 secs
            setTimeout(() => {
              setTimeRemaining(duration * 60);
            }, 2000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  const start = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pause = () => {
    setIsPaused(true);
  };

  const reset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(duration * 60);
  };

  const setNewDuration = (minutes: number) => {
    setDuration(minutes);
    if (!isRunning) {
      setTimeRemaining(minutes * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeRemaining) / (duration * 60)) * 100;

  return {
    timeRemaining,
    isRunning,
    isPaused,
    duration,
    progress,
    start,
    pause,
    reset,
    setDuration: setNewDuration,
    formatTime: () => formatTime(timeRemaining),
  };
}
