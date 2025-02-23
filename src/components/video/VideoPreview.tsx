import { Card } from "../ui/card"
import { Camera } from "lucide-react"
import React, { useState } from "react";

interface VideoPreviewProps {
  showProblem: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
}

export function RecordingPreview({ showProblem }: { showProblem: boolean }) {
  const [videoError, setVideoError] = useState<string | null>(null);

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video error:", e);
    setVideoError("Error loading video");
  };

  return (
    <Card className="w-1/2 overflow-hidden">
      <div className="h-full relative bg-muted">
        {showProblem && (
          <>
            <video
              src="/src/components/video/output.mp4"
              autoPlay
              loop
              playsInline
              muted
              onError={handleVideoError}
              className="w-full h-full object-cover"
            />
            {videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                {videoError}
              </div>
            )}
          </>
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