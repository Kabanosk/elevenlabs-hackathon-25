import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Award, Star, ThumbsUp, ThumbsDown } from "lucide-react";

interface FeedbackItem {
  title: string;
  score: number;
  pros: string[];
  cons: string[];
}

const interviewFeedback: FeedbackItem[] = [
  {
    title: "Understanding the problem",
    score: 8,
    pros: ["Asked clarifying questions", "Considered edge cases"],
    cons: ["Could have drawn more examples"]
  },
  {
    title: "Writing brute-force approach",
    score: 7,
    pros: ["Clear explanation of approach", "Good pseudocode"],
    cons: ["Took slightly longer than expected"]
  },
  {
    title: "Optimizing the solution",
    score: 9,
    pros: ["Identified bottlenecks", "Suggested multiple optimizations"],
    cons: ["Could have analyzed space complexity earlier"]
  },
  {
    title: "Testing the solution",
    score: 8,
    pros: ["Comprehensive test cases", "Found edge case bugs"],
    cons: ["Missed one corner case"]
  },
  {
    title: "Discussing complexity",
    score: 9,
    pros: ["Clear time complexity analysis", "Understood space-time tradeoffs"],
    cons: ["Could have discussed amortized complexity"]
  },
  {
    title: "Discussing trade-offs",
    score: 8,
    pros: ["Good system design considerations", "Scalability discussion"],
    cons: ["Could have discussed more alternatives"]
  }
];

const Finished = () => {
  const averageScore = Math.round(
    interviewFeedback.reduce((acc, item) => acc + item.score, 0) / interviewFeedback.length
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center gap-4 pb-6">
            <Award className="w-12 h-12 text-primary" />
            <div>
              <CardTitle className="text-3xl font-bold">Interview Complete</CardTitle>
              <p className="text-muted-foreground mt-2">
                Overall Score: {averageScore}/10
              </p>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {interviewFeedback.map((feedback, index) => (
            <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className="bg-card border-b pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">
                    {feedback.title}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-primary fill-primary" />
                    <span className="text-lg font-bold">{feedback.score}/10</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-green-500">Pros</span>
                    </div>
                    <ul className="list-disc list-inside text-sm space-y-1 text-green-600 dark:text-green-400">
                      {feedback.pros.map((pro, idx) => (
                        <li key={idx}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ThumbsDown className="w-4 h-4 text-red-500" />
                      <span className="font-medium text-red-500">Areas for Improvement</span>
                    </div>
                    <ul className="list-disc list-inside text-sm space-y-1 text-red-600 dark:text-red-400">
                      {feedback.cons.map((con, idx) => (
                        <li key={idx}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Finished;