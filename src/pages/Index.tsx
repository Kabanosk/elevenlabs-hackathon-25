import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { toast } from "../components/ui/use-toast";
import { Conversation } from "@11labs/client";
import { useState, useRef, useEffect } from 'react';
import { Play, Mic, Square, Repeat } from "lucide-react";
import { Textarea } from "../components/ui/textarea";
import { ScrollArea } from "../components/ui/scroll-area";
import { ThemeToggle } from "../components/ThemeToggle";
import { Checkbox } from "../components/ui/checkbox";
import React from 'react';

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<string>("");
  const [userText, setUserText] = useState<string>("");
  const isInitialized = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [showProblem, setShowProblem] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioBlob = useRef<Blob | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const [showProgress, setShowProgress] = useState(true);
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const agentKey = import.meta.env.VITE_AGENT_KEY;

  const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
olorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.`;
  
  async function startConversationalAI() {
    try {
      // 1. Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // 2. (Optional) If using a signed URL for a private agent
      // const signedUrl = await getSignedUrl();

      // 3. Start the conversation using your agent ID (or signedUrl)
      const conversation = await Conversation.startSession({
        agentId: agentKey, // or use { signedUrl } if needed
        onConnect: () => console.log('Connected to the agent!'),
        onDisconnect: () => console.log('Disconnected!'),
        onMessage: (message) => console.log('Agent message:', message),
        onError: (error) => console.error('Error:', error),
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
  startConversationalAI();

  const handleSwap = () => {
    setShowProgress(!showProgress);
    toast({
      title: "View switched",
      description: `Switched to ${showProgress ? "transcription" : "progress"} view`,
    });
  };

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

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = () => {
    setIsTimerRunning(true);
    setShowProblem(true);
    toast({
      title: "Timer started",
      description: "Your interview time is now being recorded",
    });
  };

  const handleEndTimer = () => {
    setIsTimerRunning(false);
    toast({
      title: "Timer stopped",
      description: `Total time: ${formatTime(time)}`,
    });
  };

  const startRecording = async () => {
    try {

      // const conversation = await Conversation.startSession({
      //   agentId: agentKey,
      //   onConnect: () => console.log('Connected to the agent!'),
      //   onDisconnect: () => console.log('Disconnected from the agent!'),
      //   onMessage: (message) => console.log('New message:', message),
      //   onError: (error) => console.error('Error:', error),
      // });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        console.log("Data available:", e.data.size);
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log("Recording stopped, chunks:", chunksRef.current.length);
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        audioBlob.current = blob;
        const url = URL.createObjectURL(blob);
        console.log("Created URL:", url);
        setAudioURL(url);
        toast({
          title: "Recording complete",
          description: "Starting transcription...",
        });
        // Automatically start transcription
        await transcribeAudio();
      };

      console.log("Starting media recorder...");

      mediaRecorder.start(100);
      setIsRecording(true);
      setTranscription(""); // Clear previous transcription
      toast({
        title: "Recording started",
        description: "Speak into your microphone",
      });
      // setTimeout(async () => {
      //   await conversation.endSession();
      //   console.log('Conversation ended.');
      // }, 15000);

      // await conversation.endSession();
      
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

  const playAudio = () => {
    if (audioURL) {
      console.log("Playing audio from URL:", audioURL);
      const audio = new Audio(audioURL);
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        toast({
          title: "Error",
          description: "Could not play audio",
          variant: "destructive",
        });
      });
    } else {
      toast({
        title: "No recording",
        description: "Please record something first",
        variant: "destructive",
      });
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
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Transcription failed');
      }

      // Set transcription text
      setTranscription(data.text);

      toast({
        title: "Transcription complete",
        description: "Your transcription is ready",
      });
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: "Error",
        description: error.message || "Could not transcribe audio",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-background p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center -m-4 mb-0 p-2">
        <div className="w-24 ml-2">
          <div className="flex items-center gap-4">
            <span className="font-mono text-lg">{formatTime(time)}</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleStartTimer}
                disabled={isTimerRunning}
              >
                <Play className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleEndTimer}
                disabled={!isTimerRunning}
              >
                <Square className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-bold">Mock Interview</h1>
        <div className="w-24 flex justify-end">
          <ThemeToggle />
        </div>
      </div>
      <div className="flex gap-4 flex-1 mb-4">
        <div className="w-1/2 flex flex-col gap-4 h-full">
          <Card className="h-[44vh] overflow-hidden mt-2 mb-2">
            <div className="h-full">
              <ScrollArea className="h-full" type="always">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Problem Statement</h2>
                  <div className="text-base text-muted-foreground pr-4">
                    {showProblem ? loremIpsum : (
                      <div className="flex flex-col items-center justify-center h-[30vh] text-center">
                        <p className="text-lg text-muted-foreground mb-4">
                          Click the play button to start the interview and view the problem statement
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </Card>

          <Card className="h-[44vh] overflow-hidden mb-4">
            <div className="p-6 h-full flex flex-col gap-4">
              <div className="flex justify-between items-center gap-4">
                <h3 className="font-medium whitespace-nowrap">{showProgress ? "Progress" : "Transcription"}</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    variant={isRecording ? "destructive" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    disabled={!showProblem}
                  >
                    <Mic className="w-4 h-4" />
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
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="item1" defaultChecked disabled />
                          <label
                            htmlFor="item1"
                            className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Start interview.
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="item2" disabled />
                          <label
                            htmlFor="item2"
                            className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Problem Analysis and Breakdown
                          </label>
                        </div>
                      </div>
                    ) : isTranscribing ? (
                      <div className="text-base text-muted-foreground">Transcribing...</div>
                    ) : transcription ? (
                      <div className="text-base bg-muted p-4 rounded-lg whitespace-pre-wrap">
                        {transcription}
                      </div>
                    ) : (
                      <div className="text-base text-muted-foreground">No transcription yet. Start recording to begin.</div>
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
          </Card>
        </div>

        <Card className="w-1/2 h-[90vh] overflow-hidden mt-2 mb-4">
          <div className="h-full p-2 flex flex-col gap-4">
            <ScrollArea className="h-full" type="always">
              <Textarea
                className="min-h-[90vh] resize-none text-base"
                placeholder="Start typing or use voice input..."
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                disabled={!showProblem}
              />
            </ScrollArea>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;