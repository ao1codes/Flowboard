import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Play, Pause, Square, X } from "lucide-react";
import { useTimer } from "../../hooks/useTimer";

interface PomodoroWidgetProps {
  duration: number;
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  onUpdateData: (data: any) => void;
  onRemove: () => void;
}

export function PomodoroWidget({ 
  duration, 
  timeRemaining: initialTimeRemaining, 
  isRunning: initialIsRunning, 
  isPaused: initialIsPaused,
  onUpdateData, 
  onRemove 
}: PomodoroWidgetProps) {
  const timer = useTimer(duration);

  // Initialize timer with saved state
  useEffect(() => {
    // Only initialize once when component mounts
    if (timer.duration !== duration) {
      timer.setDuration(duration);
    }
  }, [duration]);

  // Save timer state to parent
  useEffect(() => {
    onUpdateData({
      duration: timer.duration,
      timeRemaining: timer.timeRemaining,
      isRunning: timer.isRunning,
      isPaused: timer.isPaused,
    });
  }, [timer.timeRemaining, timer.isRunning, timer.isPaused, timer.duration]);

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (timer.progress / 100) * circumference;

  return (
    <div className="sketchy-border p-6 widget-hover transition-all duration-300 notebook-texture h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-dusty-pink rounded-full flex items-center justify-center doodle-icon">
            <Clock className="text-warm-brown h-4 w-4" />
          </div>
          <h3 className="text-lg font-bold text-warm-brown">Pomodoro</h3>
        </div>
        <Button
          onClick={onRemove}
          variant="ghost"
          size="sm"
          className="text-warm-brown/50 hover:text-warm-brown doodle-icon p-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-center space-y-4">
        <div className="relative w-24 h-24 mx-auto">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="none" 
              stroke="hsl(var(--ivory))" 
              strokeWidth="8"
            />
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="none" 
              stroke="hsl(var(--dusty-pink))" 
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-warm-brown">
              {timer.formatTime()}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-center space-x-2">
            {!timer.isRunning || timer.isPaused ? (
              <Button
                onClick={() => {
                  console.log('Starting timer'); // Debug log
                  timer.start();
                }}
                className="hand-drawn-button px-4 py-2 text-sm font-semibold text-warm-brown hover:scale-105 transition-transform"
                variant="ghost"
              >
                <Play className="mr-1 h-3 w-3" />
                Start
              </Button>
            ) : (
              <Button
                onClick={timer.pause}
                className="hand-drawn-button px-4 py-2 text-sm font-semibold text-warm-brown hover:scale-105 transition-transform"
                variant="ghost"
              >
                <Pause className="mr-1 h-3 w-3" />
                Pause
              </Button>
            )}
            <Button
              onClick={timer.reset}
              className="hand-drawn-button px-4 py-2 text-sm font-semibold text-warm-brown hover:scale-105 transition-transform"
              variant="ghost"
            >
              <Square className="mr-1 h-3 w-3" />
              Reset
            </Button>
          </div>
          <p className="text-sm text-warm-brown/70">
            {timer.isRunning && !timer.isPaused ? 'Focus session' : 'Ready to focus'}
          </p>
        </div>
      </div>
    </div>
  );
}
