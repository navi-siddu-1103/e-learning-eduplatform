import { useState } from 'react';
import type { Quiz, Course, User } from '../types';
import { EmailService } from '../services/EmailService';
import { CourseService } from '../services/CourseService';

interface QuizProps {
  quiz: Quiz;
  course: Course;
  user: User;
  onComplete: (score: number) => void;
}

export function QuizComponent({ quiz, course, user, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };
  const calculateScore = async () => {
    const correctAnswers = answers.reduce((score, answer, index) => {
      return score + (answer === quiz.questions[index].correctAnswer ? 1 : 0);
    }, 0);
    const finalScore = (correctAnswers / quiz.questions.length) * 100;
    setShowResults(true);
    
    // Send email with quiz results
    try {
      await EmailService.sendQuizResults(
        user.email,
        user.name,
        course.title,
        finalScore,
        quiz.questions.length,
        correctAnswers
      );

      // Update course progress
      await CourseService.updateQuizScore(
        user.id,
        course.id,
        quiz.id,
        finalScore
      );

      // Check if course is completed
      const isCompleted = await CourseService.checkCourseCompletion(
        user.id,
        course.id
      );

      if (isCompleted) {
        // Send course completion certificate
        await EmailService.sendCourseCompletionCertificate(
          user.email,
          user.name,
          course.title,
          new Date()
        );
      }
    } catch (error) {
      console.error('Error processing quiz completion:', error);
    }

    onComplete(finalScore);
  };

  if (showResults) {
    const score = (answers.reduce((score, answer, index) => {
      return score + (answer === quiz.questions[index].correctAnswer ? 1 : 0);
    }, 0) / quiz.questions.length) * 100;

    return (
      <div className="quiz-results">
        <h3>Quiz Complete!</h3>
        <div className="score-display">
          <p>Your Score: {score.toFixed(1)}%</p>
        </div>
        <div className="answer-review">
          {quiz.questions.map((question, index) => (
            <div key={index} className={`question-review ${
              answers[index] === question.correctAnswer ? 'correct' : 'incorrect'
            }`}>
              <p><strong>Question {index + 1}:</strong> {question.question}</p>
              <p>Your answer: {question.options[answers[index]]}</p>
              <p>Correct answer: {question.options[question.correctAnswer]}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-progress">
        Question {currentQuestion + 1} of {quiz.questions.length}
      </div>
      
      <div className="question-card">
        <h3>{question.question}</h3>
        <div className="options-list">
          {question.options.map((option, index) => (
            <button
              key={index}
              className="option-button"
              onClick={() => handleAnswer(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
