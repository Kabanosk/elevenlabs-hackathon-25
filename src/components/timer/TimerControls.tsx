import React from "react";
import { Button } from "../ui/button"
import { Play, Square } from "lucide-react"
interface TimerControlsProps {
  time: number;
  isTimerRunning: boolean;
  onStartTimer: () => void;
  onEndTimer: () => void;
}
export function TimerControls({ time, isTimerRunning, onStartTimer, onEndTimer }: TimerControlsProps) {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-lg">{formatTime(time)}</span>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onStartTimer}
          disabled={isTimerRunning}
        >
          <Play className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onEndTimer}
          disabled={!isTimerRunning}
        >
          <Square className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}