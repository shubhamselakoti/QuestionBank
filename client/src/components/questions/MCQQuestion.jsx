import React, { useState, useEffect } from 'react';

const MCQQuestion = ({ question, onAnswer, answered }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    if (question.options) {
      setShuffledOptions(shuffleArray([...question.options]));
    }
  }, [question.options]);

  const handleOptionSelect = (option, isCorrect) => {
    if (answered) return;
    setSelectedOption(option);
    onAnswer(option, isCorrect);
  };

  return (
    <div>
      <h3 className="question-title">{question.title}</h3>
      
      <div className="options-list">
        {shuffledOptions?.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(option.text, option.isCorrectAnswer)}
            disabled={answered}
            className={`option-button ${
              answered
                ? option.isCorrectAnswer
                  ? 'option-correct'
                  : selectedOption === option.text
                  ? 'option-incorrect'
                  : ''
                : ''
            }`}
          >
            {option.text}
          </button>
        ))}
      </div>

      {answered && (
        <div
          className={`feedback ${
            selectedOption === shuffledOptions?.find((o) => o.isCorrectAnswer)?.text
              ? 'feedback-success'
              : 'feedback-error'
          }`}
        >
          <p className="feedback-text">
            {selectedOption === shuffledOptions?.find((o) => o.isCorrectAnswer)?.text
              ? 'Correct!'
              : `Incorrect. The correct answer is: ${
                  shuffledOptions?.find((o) => o.isCorrectAnswer)?.text
                }`}
          </p>
        </div>
      )}
    </div>
  );
};

export default MCQQuestion;
