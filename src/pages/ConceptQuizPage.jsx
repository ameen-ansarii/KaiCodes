import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw01, 
  Award01,
  BookOpen01
} from '@untitledui/icons';

export default function ConceptQuizPage({
  concept,
  conceptIndex,
  subject,
  onBackToTheory,
  onPassQuiz,
  onGoToNextConcept,
  hasNextConcept
}) {
  const quiz = concept?.quiz || [];
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qIdx]: optionIdx }
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Timer: 5 minutes countdown (like Image 2: 03:58)
  const [secondsLeft, setSecondsLeft] = useState(300);

  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  // Format timer MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!quiz || quiz.length === 0) {
    return (
      <div className="quiz-page-empty">
        <p>No quiz questions available for this concept.</p>
        <button type="button" className="quiz-back-btn" onClick={onBackToTheory}>
          <ArrowLeft size={16} />
          <span>Back to Theory</span>
        </button>
      </div>
    );
  }

  const currentQ = quiz[currentQIndex];
  const selectedOpt = answers[currentQIndex];
  const isCurrentAnswered = selectedOpt !== undefined;

  // Calculate stats
  const answeredCount = Object.keys(answers).length;
  let correctCount = 0;
  quiz.forEach((q, idx) => {
    if (answers[idx] === q.correctIndex) {
      correctCount++;
    }
  });

  const accuracyPercent = answeredCount > 0 
    ? Math.round((correctCount / answeredCount) * 100) 
    : 0;

  const totalScorePercent = Math.round((correctCount / quiz.length) * 100);
  const hasPassed = isCompleted && (correctCount / quiz.length >= 0.7 || correctCount >= Math.ceil(quiz.length * 0.65));

  const handleSelectOption = (optIdx) => {
    if (isCompleted) return;
    setAnswers(prev => ({
      ...prev,
      [currentQIndex]: optIdx
    }));
  };

  const handleNext = () => {
    if (currentQIndex < quiz.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Finished all questions!
      setIsCompleted(true);
      if (correctCount + (answers[currentQIndex] === currentQ.correctIndex ? 1 : 0) >= Math.ceil(quiz.length * 0.65)) {
        if (onPassQuiz) {
          onPassQuiz(concept.id, conceptIndex);
        }
      }
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentQIndex(0);
    setIsCompleted(false);
    setSecondsLeft(300);
  };

  // Progress bar percentage across questions
  const progressPercent = Math.round(((currentQIndex + 1) / quiz.length) * 100);

  return (
    <div className="dedicated-quiz-page">
      
      {/* Top App Header / Bar (Matching Image 2) */}
      <header className="quiz-navbar-header">
        <button 
          type="button" 
          className="quiz-header-back-disc"
          onClick={onBackToTheory}
          title="Back to Reading"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="quiz-header-center">
          <span className="quiz-lesson-tag">{subject.shortName || 'CN'} • Lesson {concept.number || (conceptIndex + 1)}</span>
          <span className="quiz-counter-text">
            {String(currentQIndex + 1).padStart(2, '0')} of {String(quiz.length).padStart(2, '0')}
          </span>
        </div>

        <div className="quiz-header-timer-pill">
          <Clock size={15} className="timer-icon" />
          <span className="timer-digits">{formatTime(secondsLeft)}</span>
        </div>
      </header>

      {/* Thin Horizontal Progress Bar */}
      <div className="quiz-top-progress-bar">
        <motion.div 
          className="quiz-progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main Dual-Layout Wrapper (Image 1 Desktop Right Sidebar + Image 2 Mobile Stacking) */}
      <div className="quiz-page-layout">
        
        {/* MOBILE-ONLY TOP STATS BAR (Stacks upside the questions on mobile as requested) */}
        <div className="mobile-stats-card-top">
          <div className="mobile-score-pill">
            <span className="score-big">{accuracyPercent}%</span>
            <div className="mobile-score-right">
              <span className="score-label">{correctCount} of {answeredCount} correct</span>
              <span className="score-hint">Need 70% to pass</span>
            </div>
          </div>

          <div className="mobile-q-dots-row">
            {quiz.map((q, idx) => {
              const ans = answers[idx];
              const isCurr = currentQIndex === idx;
              let dotClass = 'q-mini-dot';
              if (ans !== undefined) {
                dotClass += ans === q.correctIndex ? ' dot-correct' : ' dot-wrong';
              }
              if (isCurr) dotClass += ' dot-active';

              return (
                <button
                  key={idx}
                  type="button"
                  className={dotClass}
                  onClick={() => setCurrentQIndex(idx)}
                >
                  {ans !== undefined ? (
                    ans === q.correctIndex ? '✓' : '✕'
                  ) : (
                    idx + 1
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* LEFT / CENTER COLUMN: Current Question Floating Card (Image 1 + Image 2) */}
        <main className="quiz-main-stage">
          {!isCompleted ? (
            <div className="quiz-question-card-wrapper">
              
              {/* Quiz Stage Header (Image 1 MDQuiz Header style) */}
              <div className="quiz-stage-hero-bar">
                <div className="quiz-title-row">
                  <h1 className="quiz-hero-title">{concept.title || concept.name}</h1>
                  <span className="quiz-stage-badge">MU NEP 2020</span>
                </div>

                {/* Progress Bar with Percentage on Right (Image 1) */}
                <div className="quiz-progress-track-wrapper">
                  <div className="quiz-track-bar">
                    <motion.div 
                      className="quiz-track-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="quiz-track-percentage-label">{progressPercent}%</span>
                </div>
              </div>

              {/* Floating Question Card (Image 2 style) */}
              <div className="quiz-question-floating-card">
                
                {/* Category / Question Index */}
                <div className="card-top-category">
                  <span className="category-pill-label">Question {currentQIndex + 1} of {quiz.length}</span>
                  <span className="card-q-progress">Knowledge Gate</span>
                </div>

                {/* Question Prompt */}
                <h2 className="quiz-question-headline">
                  {currentQ.question}
                </h2>

                {/* Reference Topic Link (Image 1 style) */}
                <div className="card-reference-row">
                  <button 
                    type="button" 
                    className="reference-link-btn"
                    onClick={onBackToTheory}
                  >
                    📖 Read Reference Notes in Theory
                  </button>
                </div>

                {/* Option Buttons (Exact match to Image 2: rounded, soft states, right check/cross) */}
                <div className="quiz-tactile-options-stack">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    const hasAnswered = isCurrentAnswered;
                    const isCorrect = optIdx === currentQ.correctIndex;

                    let optBtnClass = 'tactile-quiz-option';
                    if (hasAnswered) {
                      if (isCorrect) {
                        optBtnClass += ' opt-is-correct';
                      } else if (isSelected && !isCorrect) {
                        optBtnClass += ' opt-is-wrong';
                      }
                    } else if (isSelected) {
                      optBtnClass += ' opt-is-selected';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        className={optBtnClass}
                        onClick={() => handleSelectOption(optIdx)}
                      >
                        <span className="opt-label-text">{opt}</span>

                        {/* Status Icon on Right (Exact match to Image 2) */}
                        {hasAnswered && (
                          <div className="opt-right-indicator">
                            {isCorrect ? (
                              <CheckCircle size={22} className="indicator-icon-correct" />
                            ) : isSelected ? (
                              <XCircle size={22} className="indicator-icon-wrong" />
                            ) : null}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Reveal Box */}
                {isCurrentAnswered && (
                  <motion.div 
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`quiz-instant-explanation ${selectedOpt === currentQ.correctIndex ? 'exp-pass' : 'exp-fail'}`}
                  >
                    <span className="exp-heading">
                      {selectedOpt === currentQ.correctIndex ? '✓ Correct Answer:' : '✕ Key Technical Concept:'}
                    </span>
                    <p className="exp-body">{currentQ.explanation}</p>
                  </motion.div>
                )}

              </div>

              {/* Bottom Tactile Action Buttons (Image 2 style with chunky depth) */}
              <div className="quiz-bottom-actions-row">
                <button
                  type="button"
                  className="tactile-prev-btn"
                  disabled={currentQIndex === 0}
                  onClick={handlePrev}
                >
                  <ArrowLeft size={16} />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  className="tactile-next-chunky-btn"
                  disabled={!isCurrentAnswered}
                  onClick={handleNext}
                >
                  <span>{currentQIndex === quiz.length - 1 ? 'Finish & Check Score' : 'Next'}</span>
                  <ArrowRight size={18} />
                </button>
              </div>

            </div>
          ) : (
            /* COMPLETION & CELEBRATION SUMMARY SCREEN */
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="quiz-results-card"
            >
              <div className="results-celebration-head">
                <div className={`results-icon-badge ${hasPassed ? 'badge-passed' : 'badge-retry'}`}>
                  {hasPassed ? <Award01 size={36} /> : <RefreshCw01 size={36} />}
                </div>
                <h2 className="results-title">
                  {hasPassed ? 'Lesson Mastered!' : 'Keep Practicing!'}
                </h2>
                <p className="results-sub">
                  {hasPassed 
                    ? `Brilliant work! You answered ${correctCount} of ${quiz.length} questions correctly and unlocked the next lesson.` 
                    : `You scored ${correctCount} of ${quiz.length} (${totalScorePercent}%). You need at least 70% to unlock the next lesson.`}
                </p>
              </div>

              <div className="results-stats-row">
                <div className="result-metric-card">
                  <span className="metric-val">{totalScorePercent}%</span>
                  <span className="metric-lbl">Final Score</span>
                </div>
                <div className="result-metric-card">
                  <span className="metric-val">{correctCount}/{quiz.length}</span>
                  <span className="metric-lbl">Correct Answers</span>
                </div>
                <div className="result-metric-card">
                  <span className="metric-val">+{hasPassed ? 50 : 10} XP</span>
                  <span className="metric-lbl">XP Earned</span>
                </div>
              </div>

              <div className="results-actions-group">
                {hasPassed && hasNextConcept ? (
                  <button
                    type="button"
                    className="tactile-next-chunky-btn pass-continue-btn"
                    onClick={onGoToNextConcept}
                  >
                    <span>Proceed to Next Lesson</span>
                    <ArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="tactile-next-chunky-btn retry-btn"
                    onClick={handleRetry}
                  >
                    <RefreshCw01 size={18} />
                    <span>Try Quiz Again</span>
                  </button>
                )}

                <button
                  type="button"
                  className="tactile-prev-btn"
                  onClick={onBackToTheory}
                >
                  <BookOpen01 size={16} />
                  <span>Review Theory Material</span>
                </button>
              </div>
            </motion.div>
          )}
        </main>

        {/* RIGHT COLUMN (Desktop Sidebar - Image 1 MDQuiz layout) */}
        <aside className="quiz-desktop-sidebar">
          
          {/* Top Score Percentage Card (Image 1) */}
          <div className="sidebar-score-card">
            <span className="score-percentage-number">{accuracyPercent}%</span>
            <span className="score-sub-text">
              {answeredCount > 0 
                ? `You got ${correctCount} of ${answeredCount} answers correct` 
                : 'Answer questions to calculate live accuracy'}
            </span>
          </div>

          {/* Questions Stepper List (Image 1) */}
          <div className="sidebar-questions-list">
            <div className="list-header-tag">Question Index</div>
            {quiz.map((q, idx) => {
              const isSelected = currentQIndex === idx;
              const ans = answers[idx];
              const hasAns = ans !== undefined;
              const isRight = ans === q.correctIndex;

              return (
                <button
                  key={idx}
                  type="button"
                  className={`sidebar-q-row ${isSelected ? 'row-active' : ''}`}
                  onClick={() => {
                    if (!isCompleted) setCurrentQIndex(idx);
                  }}
                >
                  <div className="q-row-left">
                    {hasAns ? (
                      isRight ? (
                        <CheckCircle size={16} className="q-icon-green" />
                      ) : (
                        <XCircle size={16} className="q-icon-red" />
                      )
                    ) : (
                      <span className="q-circle-unanswered" />
                    )}
                    <span className="q-row-name">Question {idx + 1}</span>
                  </div>

                  {isSelected && <span className="current-q-pill">Focus</span>}
                </button>
              );
            })}
          </div>

        </aside>

      </div>

    </div>
  );
}
