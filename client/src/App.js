import React, { useState, useEffect } from 'react';
import QuestionCard from './components/QuestionCard';
import Pagination from './components/Pagination';
import { Brain } from 'lucide-react';

const QUESTIONS_PER_PAGE = 20;

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://questionbank-42ci.onrender.com/get?page=${currentPage}&limit=${QUESTIONS_PER_PAGE}&search=${searchTerm}`
        );
        const data = await response.json();
        // console.log(data);
        

        setQuestions(data.data);
        setFilteredQuestions(data.data);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [currentPage, searchTerm]);

  const handleAnswer = (answer) => {
    setUserAnswers((prev) => [...prev, answer]);
  };

  const getScore = () => {
    const correctAnswers = userAnswers.filter((answer) => answer.isCorrect).length;
    return `${correctAnswers}/${userAnswers.length}`;
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = questions.filter((q) =>
      q.title.toLowerCase().includes(term)
    );
    setFilteredQuestions(filtered);
  };

  return (
    <div className="container">
      <div className="content">
        <div className="header">
          <h1 className="title">
            <Brain className="w-8 h-8" />
            Interactive Quiz
          </h1>
          <div className="score">
            <span className="score-text">Score: {getScore()}</span>
          </div>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <div className="questions-list">
              {filteredQuestions?.map((question) => (
                <QuestionCard
                  key={question._id}
                  question={question}
                  onAnswer={handleAnswer}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
