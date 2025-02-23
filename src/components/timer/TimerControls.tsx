import React from "react";
import { Button } from "../ui/button"
import { Play, Square } from "lucide-react"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

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
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={onStartTimer}
          disabled={isTimerRunning}
          className="hover:scale-105 transition-transform"
        >
          <Play className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onEndTimer}
          disabled={!isTimerRunning}
          className="hover:scale-105 transition-transform"
        >
          <Square className="w-4 h-4" />
        </Button>
        <Select>
          <SelectTrigger className="w-[130px] h-9 ml-1 hover:scale-105 transition-transform">
            <SelectValue placeholder="Choose company..." />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border shadow-lg">
            <SelectItem value="google" className="hover:bg-accent hover:scale-[1.02] transition-all duration-200">Google</SelectItem>
            <SelectItem value="11labs" className="hover:bg-accent hover:scale-[1.02] transition-all duration-200">11labs</SelectItem>
            <SelectItem value="lovable" className="hover:bg-accent hover:scale-[1.02] transition-all duration-200">Lovable</SelectItem>
            <SelectItem value="posthog" className="hover:bg-accent hover:scale-[1.02] transition-all duration-200">Posthog</SelectItem>
            <SelectItem value="xtb" className="hover:bg-accent hover:scale-[1.02] transition-all duration-200">XTB</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}