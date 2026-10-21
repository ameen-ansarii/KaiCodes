import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  ArrowRight, 
  LockUnlocked01, 
  Zap, 
  RefreshCw01
} from '@untitledui/icons';

export default function ConceptQuiz({ 
  quiz, 
  conceptId, 
  conceptIndex, 
  isCompleted, 
  onPassQuiz,
  onNextConcept,
  hasNextConcept
}) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState(isCompleted);

  if (!quiz || quiz.length === 0) return null;

  const handleSelectOption = (qIdx, optIdx) => {
    if (submitted && passed) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [qIdx]: optIdx
    }));
  };

  const calculateScore = () => {
    let score = 0;
    quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    const score = calculateScore();
    setSubmitted(true);
    // Passing score: 2 out of 3, or all correct
    if (score >= Math.ceil(quiz.length * 0.65)) {
      setPassed(true);
      if (onPassQuiz) {
        onPassQuiz(conceptId, conceptIndex);
      }
    } else {
      setPassed(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setPassed(false);
  };

  const score = calculateScore();
  const allAnswered = Object.keys(selectedAnswers).length === quiz.length;

  return (
    <div className="concept-quiz-container">
      {/* Quiz Section Header */}
      <div className="quiz-banner-header">
        <div className="quiz-badge-group">
          <span className="quiz-fire-pill">
            <Zap size={14} />
            Knowledge Gate
          </span>
          <span className="quiz-xp-pill">+50 XP to Unlock Next</span>
        </div>
        <h3 className="quiz-title">Concept Mastery Check</h3>
        <p className="quiz-subtitle">
          Test your comprehension with 3 high-yield questions based on this lesson. Answer correctly to unlock the next concept!
        </p>
      </div>

      {/* Questions Stack */}
      <div className="quiz-questions-list">
        {quiz.map((q, qIdx) => {
          const selected = selectedAnswers[qIdx];
          const hasAnswered = selected !== undefined;
          const isCorrect = submitted && selected === q.correctIndex;
          const isWrong = submitted && hasAnswered && selected !== q.correctIndex;

          return (
            <div key={q.id || qIdx} className={`quiz-card ${submitted ? (isCorrect ? 'card-correct' : 'card-wrong') : ''}`}>
              <div className="quiz-card-head">
                <span className="quiz-q-num">Q{qIdx + 1}</span>
                <span className="quiz-question-text">{q.question}</span>
              </div>

              {/* Options Grid */}
              <div className="quiz-options-grid">
                {q.options.map((opt, optIdx) => {
                  const isOptSelected = selected === optIdx;
                  let optClass = 'quiz-opt-btn';

                  if (isOptSelected) optClass += ' opt-selected';
                  if (submitted) {
                    if (optIdx === q.correctIndex) {
                      optClass += ' opt-correct';
                    } else if (isOptSelected && optIdx !== q.correctIndex) {
                      optClass += ' opt-incorrect';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      className={optClass}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      disabled={submitted && passed}
                    >
                      <span className="opt-letter">{String.fromCharCode(65 + optIdx)}</span>
                      <span className="opt-text">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Immediate Explanation on Submit */}
              {submitted && (
                <motion.div 
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`quiz-explanation-box ${isCorrect ? 'exp-correct' : 'exp-wrong'}`}
                >
                  <span className="exp-label">{isCorrect ? '✓ Correct Explanation:' : '✕ Review Notes:'}</span>
                  <p className="exp-text">{q.explanation}</p>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quiz Actions Bar */}
      <div className="quiz-actions-footer">
        {!submitted ? (
          <button
            type="button"
            className="quiz-submit-btn"
            disabled={!allAnswered}
            onClick={handleSubmit}
          >
            <span>Submit Answers & Unlock</span>
            <LockUnlocked01 size={16} />
          </button>
        ) : passed ? (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="quiz-passed-banner"
          >
            <div className="passed-info">
              <CheckCircle size={24} className="passed-icon" />
              <div>
                <h4 className="passed-title">Concept Mastered! ({score}/{quiz.length} Correct)</h4>
                <p className="passed-sub">+50 XP Earned • The next concept is now unlocked!</p>
              </div>
            </div>

            {hasNextConcept && (
              <button
                type="button"
                className="quiz-continue-btn"
                onClick={onNextConcept}
              >
                <span>Continue to Next Lesson</span>
                <ArrowRight size={16} />
              </button>
            )}
          </motion.div>
        ) : (
          <div className="quiz-failed-banner">
            <div className="failed-text">
              <h4>Score: {score}/{quiz.length} Correct</h4>
              <p>You need at least 2 correct answers to unlock the next concept. Review the key points above and try again!</p>
            </div>
            <button
              type="button"
              className="quiz-retry-btn"
              onClick={handleRetry}
            >
              <RefreshCw01 size={15} />
              <span>Retry Quiz</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
