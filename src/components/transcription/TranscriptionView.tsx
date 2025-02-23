import React from "react";

interface TranscriptionViewProps {
    isTranscribing: boolean;
    transcription: string;
  }
  export function TranscriptionView({ isTranscribing, transcription }: TranscriptionViewProps) {
    if (isTranscribing) {
      return <div className="text-base text-muted-foreground">Transcribing...</div>;
    }
    if (transcription) {
      return (
        <div className="text-base bg-muted p-4 rounded-lg whitespace-pre-wrap">
          {transcription}
        </div>
      );
    }
    return (
      <div className="text-base text-muted-foreground">
        No transcription yet. Start recording to begin.
      </div>
    );
  }