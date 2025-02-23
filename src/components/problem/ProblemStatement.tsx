import { ScrollArea } from "../ui/scroll-area"
import { BlurredContainer } from "../layout/BlurredContainer"
import React from "react";

interface ProblemStatementProps {
  showProblem: boolean;
  content: string;
}

export function ProblemStatement({ showProblem, content }: ProblemStatementProps) {
  return (
    <BlurredContainer 
      showContent={showProblem} 
      blurMessage="Click play to view the problem statement"
      className="h-[44vh] mt-2 mb-2"
    >
      <ScrollArea className="h-full" type="always">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Problem Statement</h2>
          <div className="text-base text-muted-foreground pr-4">
            {content}
          </div>
        </div>
      </ScrollArea>
    </BlurredContainer>
  );
}