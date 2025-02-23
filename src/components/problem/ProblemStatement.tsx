import { ScrollArea } from "../ui/scroll-area"
import { BlurredContainer } from "../layout/BlurredContainer"
import React from "react";
import ReactMarkdown from "react-markdown";

interface ProblemStatementProps {
  showProblem: boolean;
  content: string;
}

export function ProblemStatement({ showProblem, content }: ProblemStatementProps) {
  return (
    <BlurredContainer 
      showContent={showProblem} 
      blurMessage="Click the start button to view the problem statement"
      className="h-[44vh] mt-2 mb-2"
    >
      <ScrollArea className="h-full" type="always">
        <div className="p-6">
          <h2 className="text-3xl font-bold mb-4">Problem Statement</h2>
          <ReactMarkdown>
              {content}
          </ReactMarkdown>
        </div>
      </ScrollArea>
    </BlurredContainer>
  );
}