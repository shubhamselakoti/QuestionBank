import React, { useState } from 'react';
import { CircleCheckBig, CircleX } from 'lucide-react';

const ReadAlongQuestion = ({ question, onAnswer, answered }) => {
  const [userInput, setUserInput] = useState('');

  const handleSubmit = () => {
    const isCorrect = userInput.trim().toLowerCase() === question.title.toLowerCase() || userInput.trim().toLowerCase() === 'yes';
    onAnswer(userInput, isCorrect);
  };

  return (
    <div>
      <h3 className="question-title">Read and type the following text:</h3>
      
      <div className="read-text">
        <p>{question.title}</p>
      </div>

      <div>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={answered}
          className="textarea"
          placeholder="Type the text here... (or simply type 'yes')"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={answered || !userInput.trim()}
        className="button button-primary"
      >
        Submit
      </button>

      {answered && (
        <div
            className={`feedback ${
            (userInput.trim().toLowerCase() === question.title.trim().toLowerCase() || 
            userInput.trim().toLowerCase() === 'yes')
                ? 'feedback-success'
                : 'feedback-error'
            }`}
        >
            <p className="feedback-text">
            {(userInput.trim().toLowerCase() === question.title.trim().toLowerCase() || 
                userInput.trim().toLowerCase() === 'yes')
                ? (
                  <><CircleCheckBig className='resultIcon' /> Correct!</>
                )
                : (
                  <><CircleX className='resultIcon' /> Incorrect. The correct answer is: {question.title} </>
                )
            }
            </p>
        </div>
        )}

    </div>
  );
};

export default ReadAlongQuestion;