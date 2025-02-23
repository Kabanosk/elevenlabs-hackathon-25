import { Message } from "openai/resources/beta/threads/messages.mjs";
import React from "react";
import { cn } from "../../lib/utils";
interface TranscriptionViewProps {
  isTranscribing: boolean;
  transcription: string | Message[];
}

export function TranscriptionView({ isTranscribing, transcription }: TranscriptionViewProps) {
  if (isTranscribing) {
    return <div className="text-base text-muted-foreground">Transcribing...</div>;
  }

  if (Array.isArray(transcription)) {
    return (
      <div className="flex flex-col gap-4">
        {transcription.map((msg, index) => (
          <div 
            key={index}
            className={cn(
              "flex",
              msg.source === "ai" ? "justify-start" : "justify-end"
            )}
          >
            <div
              className={cn(
                "rounded-lg px-4 py-2 max-w-[80%] break-words",
                msg.source === "ai" 
                  ? "bg-[#9b87f5] text-white rounded-tl-none" 
                  : "bg-[#F97316] text-white rounded-tr-none"
              )}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (typeof transcription === "string" && transcription) {
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