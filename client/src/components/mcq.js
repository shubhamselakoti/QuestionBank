import React, { useState, useEffect } from "react";
import "./App.css";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const MCQApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [userAnswers, setUserAnswers] = useState({});
  const QUESTIONS_PER_PAGE = 5;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:5000/get");
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const filteredQuestions = questions.filter((q) =>
    q.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAnswer = (id, answer) => {
    setUserAnswers((prev) => ({ ...prev, [id]: answer }));
  };

  return (
    <div className="container">
      <h1 className="title">Interactive Question App</h1>

      <input
        type="text"
        placeholder="Search questions..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="search-box"
      />

      <div className="questions">
        {paginatedQuestions.length > 0 ? (
          paginatedQuestions.map((q) => (
            <div key={q._id.$oid || q.id} className="question-card">
              <h2 className="question">{q.title}</h2>

            
              {q.type === "READ_ALONG" && (
                <p className="instruction">Please read the above text aloud.</p>
              )}

              {q.type === "ANAGRAM" && (
                <div className="instruction">
                  <p>Rearrange to find the correct word/sentence.</p>
                  <input
                    type="text"
                    placeholder="Your answer"
                    value={userAnswers[q._id.$oid] || ""}
                    onChange={(e) => handleAnswer(q._id.$oid, e.target.value)}
                    className="anagram-input"
                  />
                  {userAnswers[q._id.$oid] && (
                    <p
                      className={
                        userAnswers[q._id.$oid].toLowerCase() === q.solution.toLowerCase()
                          ? "correct"
                          : "wrong"
                      }
                    >
                      {userAnswers[q._id.$oid].toLowerCase() === q.solution.toLowerCase()
                        ? "Correct!"
                        : "Try again."}
                    </p>
                  )}
                </div>
              )}

              {q.type === "MCQ" && (
                <ul className="options">
                  {q.options.map((option, index) => (
                    <li
                      key={index}
                      className={`option ${
                        userAnswers[q._id.$oid] === option.text
                          ? option.isCorrectAnswer
                            ? "correct"
                            : "wrong"
                          : ""
                      }`}
                      onClick={() => handleAnswer(q._id.$oid, option.text)}
                    >
                      {option.text}
                      {userAnswers[q._id.$oid] === option.text && (
                        <span>
                          {option.isCorrectAnswer ? " (Correct)" : " (Wrong)"}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        ) : (
          <p className="no-results">No questions match your search.</p>
        )}
      </div>

     
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MCQApp;
