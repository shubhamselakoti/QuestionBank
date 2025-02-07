import React, { useState, useEffect } from 'react';
import QuestionCard from './components/QuestionCard';
import Pagination from './components/Pagination';
import { Brain, Filter, Goal } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedType, setSelectedType] = useState('ALL');
  const [questionsPerPage, setQuestionsPerPage] = useState(20);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const questionTypes = [
    'ALL',
    'ANAGRAM-SENTENCE',
    'MCQ',
    'ANAGRAM-WORD',
    'READ_ALONG',
    'CONVERSATION',
    'CONTENT_ONLY',
  ];

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://questionbank-bksa.onrender.com/get?page=${currentPage}&limit=${questionsPerPage}&search=${searchTerm}&type=${selectedType}`
        );
        const data = await response.json();
        setFilteredQuestions(data.data);
        console.log(filteredQuestions.length);
        setTotalPages(data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [currentPage, searchTerm, selectedType, questionsPerPage]);


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
  };

  const handleFilterChange = (e) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
  };

  const handleQuestionsPerPageChange = (e) => {
    setQuestionsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="container">
      <div className="content">
        <div className="header">
          <h1 className="title">
            <Brain className="w-8 h-8 logo-icon" />
            Interactive Quiz
          </h1>
          <div className="score">
            <span className="score-text"><Goal className='goalIcon'/> Score: {getScore()}</span>
          </div>
        </div>

        <div className="search-filter-container">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            <button onClick={toggleFilterDropdown} className="filter-btn">
              <Filter className="filter-icon" />
            </button>

            {isFilterOpen && (
              <div className="filter-dropdown-container">
                <label htmlFor="type">Filter by Type</label>
                <select
                  id = "type"
                  value={selectedType}
                  onChange={handleFilterChange}
                  className="filter-dropdown"
                >
                  {questionTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <label htmlFor="questionsPerPage">Questions per Page</label>
                <select
                  id = "questionsPerPage"
                  value={questionsPerPage}
                  onChange={handleQuestionsPerPageChange}
                  className="filter-dropdown"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            )}
        </div>


        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <>
          {filteredQuestions.length > 1 ? (
              <div className="questions-list">
                {filteredQuestions?.map((question) => (
                  <QuestionCard
                    key={question._id}
                    question={question}
                    onAnswer={handleAnswer}
                  />
                ))}
              </div>
            ) : (
              <div className="no-data-container"> 
                <DotLottieReact
                  src="https://lottie.host/55adcd15-e5ee-4b9e-9eeb-158b4ba4d5f9/MT986zmR7a.lottie"
                  loop
                  autoplay
                />
                No Questions Found...
              </div>
            )
          }

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
