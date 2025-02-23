import React from "react";
import { Card } from "../ui/card"
import { ReactNode } from "react"

interface BlurredContainerProps {
  showContent: boolean;
  children: ReactNode;
  blurMessage?: string;
  className?: string;
}

interface BlurredContainerProps {
  showContent: boolean;
  children: ReactNode;
  blurMessage?: string;
  className?: string;
}

export function BlurredContainer({ showContent, children, blurMessage, className = "" }: BlurredContainerProps) {
  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const generateIrregularText = () => {
    const texts = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vehicula diam vel lectus ultrices lobortis.\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.\ndolore eu fudolore eu fudolore eu fudolore eu fu",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\ndolore eu fu",
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.\nAt vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.",
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.",
      "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod.\ndolore eu fudolore eu fudolore eu fudolore eu fu",
      "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet.\nNam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod"
    ];

    const numParagraphs = getRandomInt(4, 8);
    const selectedTexts = new Set<string>();

    while (selectedTexts.size < numParagraphs) {
      const randomIndex = getRandomInt(0, texts.length - 1);
      selectedTexts.add(texts[randomIndex]);
    }

    return Array.from(selectedTexts);
  };

  const paragraphs = generateIrregularText();

  return (
    <Card className={`relative ${className}`}>
      <div className={`${!showContent ? 'opacity-0' : ''} relative z-30 h-full`}>
        {children}
      </div>
      {!showContent && (
        <>
          <div className="absolute inset-0 p-6 z-10">
            {paragraphs.map((text, index) => (
              <p 
                key={index} 
                className={`text-muted-foreground ${index > 0 ? 'mt-4' : ''}`}
                style={{ maxWidth: `${getRandomInt(85, 100)}%` }}
              >
                {text}
              </p>
            ))}
          </div>
          <div className="absolute inset-0 backdrop-blur-[8px] bg-background/60 z-20 flex items-center justify-center flex-col gap-4">
            <p className="text-lg text-muted-foreground">
              {blurMessage || "Click play to start"}
            </p>
          </div>
        </>
      )}
    </Card>
  );
}
