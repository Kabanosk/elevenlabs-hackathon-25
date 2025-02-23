import React from "react";
import { Card } from "../ui/card"
import { ScrollArea } from "../ui/scroll-area"

interface ProblemStatementProps {
    showProblem: boolean;
    content: string;
}
  
export function ProblemStatement({ showProblem, content }: ProblemStatementProps) {
    return (
      <Card className="h-[44vh] overflow-hidden mt-2 mb-2 relative">
        <ScrollArea className="h-full" type="always">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Problem Statement</h2>
            <div className="text-base text-muted-foreground pr-4">
              {content}
            </div>
          </div>
        </ScrollArea>
        {!showProblem && (
          <div className="absolute inset-0 backdrop-blur-xl bg-background/50 flex items-center justify-center flex-col gap-4">
            <p className="text-3xl text-muted-foreground">
              Click the start button to view the problem statement
            </p>
          </div>
        )}
      </Card>
    );
  }