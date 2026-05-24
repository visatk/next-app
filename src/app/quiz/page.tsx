"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Assuming Shadcn is configured
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner"; // From your package.json dependencies

export default function QuizPlayer() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds timer per question
  
  // Example MVP Data (Will come from D1 Database)
  const quiz = {
    question: "বাংলাদেশের জাতীয় পাখির নাম কী?",
    options: ["দোয়েল", "কাক", "ময়না", "টিয়া"],
    correct: "দোয়েল"
  };

  useEffect(() => {
    if (timeLeft === 0) {
      handleAnswer(null); // Time out
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = async (selected: string | null) => {
    if (selected === quiz.correct) {
      toast.success("সঠিক উত্তর! +১০ পয়েন্ট");
      // Call D1 API to update user wallet using better-auth session
    } else {
      toast.error("ভুল উত্তর!");
    }
    // Proceed to next question & reset timer
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Native AdSense Placeholder - Top */}
      <div className="w-full max-w-md h-[100px] bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center mb-6 rounded-lg text-gray-500 text-sm">
        [ Google AdSense Banner ]
      </div>

      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-slate-500">প্রশ্ন {currentQuestion + 1}/10</span>
            <span className="text-sm font-bold text-red-500 bg-red-100 px-3 py-1 rounded-full">
              ⏳ {timeLeft} সেকেন্ড
            </span>
          </div>
          <Progress value={(timeLeft / 10) * 100} className="h-2" />
          <CardTitle className="text-xl pt-4 leading-relaxed font-semibold">
            {quiz.question}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {quiz.options.map((option, idx) => (
            <Button 
              key={idx} 
              variant="outline" 
              className="w-full justify-start h-14 text-lg hover:bg-slate-100 hover:text-black border-slate-200"
              onClick={() => handleAnswer(option)}
            >
              <span className="bg-slate-200 text-slate-700 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">
                {String.fromCharCode(65 + idx)} {/* Generates A, B, C, D */}
              </span>
              {option}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Native AdSense Placeholder - Bottom */}
      <div className="w-full max-w-md h-[250px] bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center mt-6 rounded-lg text-gray-500 text-sm">
        [ Google AdSense Square Ad ]
      </div>
    </div>
  );
}
