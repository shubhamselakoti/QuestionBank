import React, { useState, useEffect } from 'react';

const AnagramQuestion = ({ question, onAnswer, answered }) => {
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [shuffledBlocks, setShuffledBlocks] = useState([]);
  const [blockStatus, setBlockStatus] = useState([]);

  useEffect(() => {
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    if (question.blocks) {
      const shuffled = shuffleArray([...question.blocks]);
      setShuffledBlocks(shuffled);
      setBlockStatus(new Array(shuffled.length).fill(false));
    }
  }, [question.blocks]);

  const handleBlockClick = (block, index) => {
    if (answered || blockStatus[index]) return;

    setSelectedBlocks([...selectedBlocks, block]);
    const updatedBlockStatus = [...blockStatus];
    updatedBlockStatus[index] = true;
    setBlockStatus(updatedBlockStatus);
  };

  const handleSubmit = () => {
    const userAnswer = selectedBlocks.join(
      question.anagramType === 'WORD' ? '' : ' '
    );
    const isCorrect = userAnswer === question.solution;
    onAnswer(userAnswer, isCorrect);
  };

  const handleReset = () => {
    setSelectedBlocks([]);
    setBlockStatus(new Array(shuffledBlocks.length).fill(false));
  };

  return (
    <div>
      <h3 className="question-title">{question.title}</h3>

      <div>
        <div className="blocks-container">
          {shuffledBlocks.map((block, index) => (
            <button
              key={index}
              onClick={() => handleBlockClick(block.text, index)}
              disabled={answered || blockStatus[index]}
              className="button button-primary"
            >
              {block.text}
            </button>
          ))}
        </div>

        <div className="answer-display">
          {selectedBlocks.join(question.anagramType === 'WORD' ? '' : ' ')}
        </div>

        <div className="button-group">
          <button
            onClick={handleSubmit}
            disabled={answered || selectedBlocks.length === 0}
            className="button button-success"
          >
            Submit
          </button>
          <button
            onClick={handleReset}
            disabled={answered || selectedBlocks.length === 0}
            className="button button-error"
          >
            Reset
          </button>
        </div>
      </div>

      {answered && (
        <div
          className={`feedback ${
            selectedBlocks.join(question.anagramType === 'WORD' ? '' : ' ') ===
            question.solution
              ? 'feedback-success'
              : 'feedback-error'
          }`}
        >
          <p className="feedback-text">
            {selectedBlocks.join(question.anagramType === 'WORD' ? '' : ' ') ===
            question.solution
              ? 'Correct!'
              : `Incorrect. The correct answer is: ${question.solution}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default AnagramQuestion;
