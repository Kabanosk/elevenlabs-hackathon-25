import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { toast } from "../components/ui/use-toast";
import { Conversation } from "@11labs/client";
import { useState, useRef, useEffect } from 'react';
import { Repeat, Camera, Plus } from "lucide-react";
import { Textarea } from "../components/ui/textarea";
import { ScrollArea } from "../components/ui/scroll-area";
import { ThemeToggle } from "../components/ThemeToggle";
import { useNavigate } from 'react-router-dom';
import { TimerControls } from "../components/timer/TimerControls";
import React from 'react';
import { VideoPreview } from "../components/video/VideoPreview";
import { ProgressList } from "../components/progress/ProgressList";
import { TranscriptionView } from "../components/transcription/TranscriptionView";
import { ProblemStatement } from "../components/problem/ProblemStatement";
import { BlurredContainer } from "../components/layout/BlurredContainer";

interface ListItem {
  id: number;
  text: string;
  checked: boolean;
}

let isInitialized = false;
let clientName = "James";
let conversation = null;

const Index = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<string>("");
  const [userText, setUserText] = useState<string>("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [showProgress, setShowProgress] = useState(true);
  const [showProblem, setShowProblem] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioBlob = useRef<Blob | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const [items, setItems] = useState<ListItem[]>([
    { id: 1, text: 'Lorem Ipsum', checked: true },
    { id: 2, text: 'Lorem Ipsum', checked: false },
  ]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const agentKey = import.meta.env.VITE_AGENT_KEY;

  async function startConversationalAI() {
    try {
      // 1. Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // 2. (Optional) If using a signed URL for a private agent
      // const signedUrl = await getSignedUrl();

      // 3. Start the conversation using your agent ID (or signedUrl)
      conversation = await Conversation.startSession({
        agentId: agentKey, // or use { signedUrl } if needed
        onConnect: () => console.log('Connected to the agent!'),
        onDisconnect: () => console.log('Disconnected!'),
        onMessage: (message) => console.log('Agent message:', message),
        onError: (error) => console.error('Error:', error),
        clientTools: {
          checkCorrectnessOfResponseLevelOne: async ({message}) => {
            console.log("Dupa: ", message);
          }
        },
      });

      // Now your agent is live and listening/responding.
      // You can interact with the conversation object as needed.

      // For demonstration, end the session after 60 seconds:
      setTimeout(async () => {
        await conversation.endSession();
        console.log('Conversation ended.');
      }, 60000);
      
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }

  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = window.setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          if (newTime >= 1800) { // Time in s == 30min
            handleEndTimer();
          }
          return newTime;
        });
      }, 1000);
    } else if (timerIntervalRef.current) {
      window.clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) {
        window.clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerRunning]);

  const handleStartTimer = async () => {
    setIsTimerRunning(true);
    setShowProblem(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      toast({
        title: "Timer started",
        description: "Your interview time is now being recorded",
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Could not access camera",
        variant: "destructive",
      });
    }
  };

  const handleEndTimer = () => {
    setIsTimerRunning(false);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    toast({
      title: "Timer stopped",
      description: `Total time: ${time}`,
    });
    navigate('/finished');
  };

  const handleSwap = () => {
    setShowProgress(!showProgress);
    toast({
      title: "View switched",
      description: `Switched to ${showProgress ? "transcription" : "progress"} view`,
    });
  };

  const handleAddItem = () => {
    const lastItem = items[items.length - 1];
    const newItem = {
      id: lastItem ? lastItem.id + 1 : 1,
      text: 'Lorem Ipsum',
      checked: false
    };
    
    if (lastItem) {
      const updatedItems = items.map(item => 
        item.id === lastItem.id ? { ...item, checked: true } : item
      );
      setItems([...updatedItems, newItem]);
    } else {
      setItems([newItem]);
    }

    toast({
      title: "Item added",
      description: "New item has been added to the list",
    });
  };

  const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.`;

const fibonacciProblem = `
## **Fibonacci Sequence**

The **Fibonacci numbers**, denoted as F(n), form a sequence known as the **Fibonacci sequence**, where each number is the sum of the two preceding ones. The sequence starts with:

\`\`\`
F(0) = 0,  F(1) = 1
F(n) = F(n - 1) + F(n - 2), for n > 1
\`\`\`

Given an integer **n** , calculate F(n).

---

#### **Example:**
**Input:**  
\`n = 2\`  
**Output:**  
\`1\`  `;



return (
  <div className="h-screen overflow-hidden bg-background p-4 flex flex-col gap-4">
    <div className="flex justify-between items-center -m-4 mb-0 p-2">
      <div className="w-24 ml-2">
        <TimerControls
          time={time}
          isTimerRunning={isTimerRunning}
          onStartTimer={handleStartTimer}
          onEndTimer={handleEndTimer}
        />
      </div>
      <h1 className="text-2xl font-bold">Mock Interview</h1>
      <div className="w-24 flex justify-end">
        <ThemeToggle />
      </div>
    </div>
    <div className="flex gap-4 flex-1 mb-4">
      <div className="w-1/2 flex flex-col gap-4 h-full">
        <ProblemStatement showProblem={showProblem} content={fibonacciProblem} />

        <BlurredContainer
          showContent={showProblem}
          className="h-[44vh]"
          blurMessage="Click the start button to track your progress or live trascription"
        >
          <div className="p-6 h-full flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4">
              <h3 className="text-3xl font-bold whitespace-nowrap">{showProgress ? "Progress" : "Transcription"}</h3>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddItem}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!showProblem || !showProgress}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleSwap}
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!showProblem}
                >
                  <Repeat className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[34vh]" type="always">
              {showProblem ? (
                <div className="space-y-4 pr-4">
                  {showProgress ? (
                    <ProgressList items={items} />
                  ) : (
                    <TranscriptionView
                      isTranscribing={isTranscribing}
                      transcription={transcription}
                    />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[30vh] text-center">
                  <p className="text-lg text-muted-foreground mb-4">
                    Click the play button to start the interview and track your progress
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        </BlurredContainer>
      </div>

      <div className="w-1/2 flex flex-col gap-4 mt-3">
        <div className="flex gap-4 h-[25vh]">
          <VideoPreview showProblem={showProblem} videoRef={videoRef} />
          <Card className="w-1/2 overflow-hidden">
            <div className="h-full flex items-center justify-center bg-muted">
              <Camera className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>
        </div>
        <Card className="h-[63vh] overflow-hidden">
          <ScrollArea className="h - full" type="always">
            <Textarea
              className="w-full h-[63vh] resize-none text-lg"
              placeholder="Start typing or use voice input..."
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              disabled={!showProblem}
            />
          </ScrollArea>
        </Card>
      </div>
    </div>
  </div>
);
};
export default Index;