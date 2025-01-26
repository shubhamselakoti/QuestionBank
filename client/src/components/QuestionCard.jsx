import React, { useState } from 'react';
import AnagramQuestion from './questions/AnagramQuestion';
import MCQQuestion from './questions/MCQQuestion';
import ReadAlongQuestion from './questions/ReadAlongQuestion';

const QuestionCard = ({ question, onAnswer }) => {
  const [answered, setAnswered] = useState(false);

  const handleAnswer = (answer, isCorrect) => {
    if (!answered) {
      setAnswered(true);
      onAnswer({
        questionId: question._id.$oid,
        answer,
        isCorrect
      });
    }
  };

  return (
    <div className="question-card">
      <div className="question-type">
        Question Type: {question.type}
        {question.anagramType ? ` (${question.anagramType})` : ''}
      </div>

      {question.type === 'ANAGRAM' && (
        <AnagramQuestion
          question={question}
          onAnswer={handleAnswer}
          answered={answered}
        />
      )}

      {question.type === 'MCQ' && (
        <MCQQuestion
          question={question}
          onAnswer={handleAnswer}
          answered={answered}
        />
      )}

      {question.type === 'READ_ALONG' && (
        <ReadAlongQuestion
          question={question}
          onAnswer={handleAnswer}
          answered={answered}
        />
      )}
    </div>
  );
};

export default QuestionCard;