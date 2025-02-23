import { Card } from "../ui/card"
import { Camera } from "lucide-react"
import React from "react";

interface VideoPreviewProps {
  showProblem: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
}
export function VideoPreview({ showProblem, videoRef }: VideoPreviewProps) {
  return (
    <Card className="w-1/2 overflow-hidden">
      <div className="h-full relative bg-muted">
        {showProblem && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}
        {!showProblem && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
      </div>
    </Card>
  );
}