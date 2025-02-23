import React from "react";
import { Card } from "../ui/card"
import { ReactNode } from "react"

interface BlurredContainerProps {
  showContent: boolean;
  children: ReactNode;
  blurMessage?: string;
  className?: string;
}

export function BlurredContainer({ showContent, children, blurMessage, className = "" }: BlurredContainerProps) {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      {children}
      {!showContent && (
        <div className="absolute inset-0 backdrop-blur-xl bg-background/50 flex items-center justify-center flex-col gap-4">
          <p className="text-3xl text-muted-foreground">
            {blurMessage || "Click play to start"}
          </p>
        </div>
      )}
    </Card>
  );
}