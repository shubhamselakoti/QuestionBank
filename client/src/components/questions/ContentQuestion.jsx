import React from 'react';

const ContentQuestion = (question) => {
  
  return (
    <div>
      <h3 className="question-title">Express Yourself:</h3>
      <div className="read-text">
        <p>{question.question.title}</p>
      </div>

    </div>
  );
};

export default ContentQuestion;