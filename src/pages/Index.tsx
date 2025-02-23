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
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const agentKey = import.meta.env.VITE_AGENT_KEY;

  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = window.setInterval(() => {
        setTime(prevTime => prevTime + 1);
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        audioBlob.current = blob;
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        toast({
          title: "Recording complete",
          description: "Starting transcription...",
        });
        await transcribeAudio();
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setTranscription("");
      toast({
        title: "Recording started",
        description: "Speak into your microphone",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const transcribeAudio = async () => {
    if (!audioBlob.current) {
      toast({
        title: "No recording",
        description: "Please record something first",
        variant: "destructive",
      });
      return;
    }

    setIsTranscribing(true);
    const formData = new FormData();
    formData.append('file', audioBlob.current, 'audio.webm');
    formData.append('model', 'whisper-1');

    try {
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Transcription failed');
      }

      setTranscription(data.text);
      toast({
        title: "Transcription complete",
        description: "Your transcription is ready",
      });
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: "Error",
        description: "Could not transcribe audio",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
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
          <ProblemStatement showProblem={showProblem} content={loremIpsum} />

          <BlurredContainer
            showContent={showProblem}
            className="flex-1"
            blurMessage="Click the start button to track your progress or live trascription"
          >
            <div className="p-6 h-full flex flex-col gap-4">
              <div className="flex justify-between items-center gap-4">
                <h3 className="font-medium whitespace-nowrap">{showProgress ? "Progress" : "Transcription"}</h3>
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
                    onClick={isRecording ? stopRecording : startRecording}
                    variant={isRecording ? "destructive" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    disabled={!showProblem}
                  >
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

              <ScrollArea className="flex-1">
                {showProblem ? (
                  <div className="space-y-4">
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
                  <div className="flex flex-col items-center justify-center h-[30vh] full text-center">
                    <p className="text-lg text-muted-foreground mb-4">
                      Click the play button to start the interview and track your progress
                    </p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </BlurredContainer>
        </div>

        <div className="w-1/2 flex flex-col gap-4 mt-2">
          <div className="flex gap-4 h-[20vh]">
            <VideoPreview showProblem={showProblem} videoRef={videoRef} />
            <Card className="w-1/2 overflow-hidden">
              <div className="h-full flex items-center justify-center bg-muted">
                <Camera className="w-8 h-8 text-muted-foreground" />
              </div>
            </Card>
          </div>
            <Card className="flex-1 overflow-hidden flex flex-col">
              <ScrollArea className="flex-1" type="always">
                <Textarea
                  className="w-full min-h-[68vh] flex-grow resize-none text-lg"
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