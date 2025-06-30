
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
}

const QuizPage = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState<{ [key: number]: boolean }>({});

  const today = new Date().toISOString().split('T')[0];

  const { data: quiz, isLoading, error } = useQuery({
    queryKey: ['quiz', today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('date', today)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
    setShowResults(prev => ({
      ...prev,
      [questionIndex]: true
    }));
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-destructive">Failed to load quiz</p>
      </div>
    );
  }

  if (!quiz || !quiz.questions) {
    return (
      <div className="p-4 pb-20">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Daily Quiz</h2>
          <p className="text-muted-foreground">Test your knowledge</p>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No quiz available for today</p>
        </div>
      </div>
    );
  }

  const questions = quiz.questions as QuizQuestion[];

  return (
    <div className="p-4 pb-20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Daily Quiz</h2>
        <p className="text-muted-foreground">Test your knowledge with today's questions</p>
      </div>

      <div className="space-y-6">
        {questions.map((question, questionIndex) => (
          <Card key={questionIndex}>
            <CardHeader>
              <CardTitle className="text-lg">
                Question {questionIndex + 1}
              </CardTitle>
              <p className="text-foreground">{question.question}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => {
                  const isSelected = selectedAnswers[questionIndex] === optionIndex;
                  const isCorrect = optionIndex === question.correct_answer;
                  const showResult = showResults[questionIndex];
                  
                  return (
                    <Button
                      key={optionIndex}
                      variant="outline"
                      className={cn(
                        "w-full text-left justify-start h-auto p-3",
                        showResult && isCorrect && "bg-green-100 border-green-500 text-green-800",
                        showResult && isSelected && !isCorrect && "bg-red-100 border-red-500 text-red-800",
                        !showResult && isSelected && "bg-primary/10 border-primary"
                      )}
                      onClick={() => handleAnswerSelect(questionIndex, optionIndex)}
                      disabled={showResults[questionIndex]}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        <span className="flex-1">{option}</span>
                        {showResult && isCorrect && <CheckCircle size={20} className="text-green-600" />}
                        {showResult && isSelected && !isCorrect && <XCircle size={20} className="text-red-600" />}
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuizPage;
