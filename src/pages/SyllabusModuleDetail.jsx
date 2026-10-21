import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen01, 
  ChevronRight, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
  Lock01,
  Zap,
  Award01
} from '@untitledui/icons';
import TheoryRenderer from '../components/TheoryRenderer';
import ConceptQuizPage from './ConceptQuizPage';

// 9 Distinct tactile color palettes inspired by user reference images (Image 2 'know.' & Image 3 Ticket UI)
const TACTILE_PALETTES = [
  {
    bg: '#15803d', // Kelly green (Image 2 Anatomy)
    textColor: '#ffffff',
    subColor: 'rgba(255, 255, 255, 0.84)',
    badgeBg: 'rgba(0, 0, 0, 0.24)',
    arrowBg: 'rgba(255, 255, 255, 0.22)',
    accent: '#4ade80',
    symbol: '✤',
    tag: 'Fundamental'
  },
  {
    bg: '#ddd6fe', // Lavender Lilac (Image 2 History)
    textColor: '#1e1b4b',
    subColor: '#5b21b6',
    badgeBg: 'rgba(255, 255, 255, 0.7)',
    arrowBg: '#ffffff',
    accent: '#8b5cf6',
    symbol: '❙❚',
    tag: 'Architecture'
  },
  {
    bg: '#ff5722', // Coral Orange (Image 2 Astronomy)
    textColor: '#ffffff',
    subColor: 'rgba(255, 255, 255, 0.88)',
    badgeBg: 'rgba(0, 0, 0, 0.22)',
    arrowBg: 'rgba(255, 255, 255, 0.25)',
    accent: '#ff8a65',
    symbol: '●●',
    tag: '10M Priority'
  },
  {
    bg: '#ffffff', // Crisp White (Image 2 Philosophy)
    textColor: '#18181b',
    subColor: '#71717a',
    badgeBg: '#f4f4f5',
    arrowBg: '#f4f4f5',
    accent: '#18181b',
    symbol: '▲',
    tag: 'Comparison'
  },
  {
    bg: '#0284c7', // Sky / Ocean Blue (Image 3 Bars/Theatre)
    textColor: '#ffffff',
    subColor: 'rgba(255, 255, 255, 0.85)',
    badgeBg: 'rgba(0, 0, 0, 0.22)',
    arrowBg: 'rgba(255, 255, 255, 0.25)',
    accent: '#38bdf8',
    symbol: '◈',
    tag: 'Topology'
  },
  {
    bg: '#bef264', // Neon Lime (Image 3 Coffee/Flights)
    textColor: '#14532d',
    subColor: '#365314',
    badgeBg: 'rgba(255, 255, 255, 0.65)',
    arrowBg: '#ffffff',
    accent: '#65a30d',
    symbol: '✦',
    tag: 'Physical Media'
  },
  {
    bg: '#18181b', // Midnight Charcoal (Image 3 Hotels/Shops)
    textColor: '#ffffff',
    subColor: 'rgba(255, 255, 255, 0.75)',
    badgeBg: 'rgba(255, 255, 255, 0.12)',
    arrowBg: 'rgba(255, 255, 255, 0.18)',
    accent: '#a1a1aa',
    symbol: '⬢',
    tag: 'Client-Server'
  },
  {
    bg: '#f59e0b', // Warm Amber (Image 3 Food/Picks)
    textColor: '#451a03',
    subColor: '#78350f',
    badgeBg: 'rgba(255, 255, 255, 0.55)',
    arrowBg: '#ffffff',
    accent: '#d97706',
    symbol: '★',
    tag: 'Hardware'
  },
  {
    bg: '#e11d48', // Vivid Crimson (Image 3 Art/Beaches)
    textColor: '#ffffff',
    subColor: 'rgba(255, 255, 255, 0.85)',
    badgeBg: 'rgba(0, 0, 0, 0.22)',
    arrowBg: 'rgba(255, 255, 255, 0.25)',
    accent: '#fb7185',
    symbol: '✿',
    tag: 'Self-Learning'
  }
];

export default function SyllabusModuleDetail({
  subject,
  module,
  onNavigateModule,
  _onOpenMobileMenu
}) {
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('theory'); // 'theory' | 'exam' | 'takeaways'
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [lockedAlert, setLockedAlert] = useState(null);

  // Persistent Gamification State (Saved in LocalStorage)
  const [unlockedIds, setUnlockedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`kaicode_unlocked_${module?.id}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return module?.concepts?.[0]?.id ? [module.concepts[0].id] : [];
  });

  const [masteredIds, setMasteredIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`kaicode_mastered_${module?.id}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [userXP, setUserXP] = useState(() => {
    try {
      const saved = localStorage.getItem('kaicode_user_xp');
      if (saved) return parseInt(saved, 10);
    } catch {}
    return 100;
  });

  // Sync state changes with localStorage
  useEffect(() => {
    if (module?.id) {
      localStorage.setItem(`kaicode_unlocked_${module.id}`, JSON.stringify(unlockedIds));
      localStorage.setItem(`kaicode_mastered_${module.id}`, JSON.stringify(masteredIds));
    }
  }, [unlockedIds, masteredIds, module?.id]);

  useEffect(() => {
    localStorage.setItem('kaicode_user_xp', userXP.toString());
  }, [userXP]);

  if (!subject || !module) {
    return (
      <div className="canvas-empty-state">
        <p>Select a subject and module from the sidebar to start reading.</p>
      </div>
    );
  }

  const activeConcept = module?.concepts ? module.concepts[activeConceptIndex] : null;

  // Render dedicated full Quiz view when quiz is active!
  if (isQuizActive && activeConcept) {
    return (
      <ConceptQuizPage
        concept={activeConcept}
        conceptIndex={activeConceptIndex}
        module={module}
        subject={subject}
        onBackToTheory={() => setIsQuizActive(false)}
        onPassQuiz={handlePassQuiz}
        onGoToNextConcept={() => {
          handleNextConcept();
          setIsQuizActive(false);
        }}
        hasNextConcept={activeConceptIndex < module.concepts.length - 1}
      />
    );
  }
  const currentModIdx = subject.modules.findIndex(m => m.id === module.id);
  const prevModule = currentModIdx > 0 ? subject.modules[currentModIdx - 1] : null;
  const nextModule = currentModIdx < subject.modules.length - 1 ? subject.modules[currentModIdx + 1] : null;

  // Percentage completion
  const completionPercentage = Math.round((masteredIds.length / module.concepts.length) * 100);

  // Handle card click with locked detection
  const handleCardClick = (idx, concept) => {
    const isUnlocked = unlockedIds.includes(concept.id) || idx === 0;

    if (!isUnlocked) {
      setLockedAlert(`🔒 Concept ${idx + 1} is locked! Pass Concept ${idx}'s quiz to unlock.`);
      setTimeout(() => setLockedAlert(null), 3500);
      return;
    }

    setActiveConceptIndex(idx);
    setActiveTab('theory');
    // Smooth scroll down to stage
    const stageEl = document.getElementById('concept-study-stage');
    if (stageEl) {
      stageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // When user passes quiz
  const handlePassQuiz = (conceptId, conceptIndex) => {
    // Add to mastered
    if (!masteredIds.includes(conceptId)) {
      setMasteredIds(prev => [...prev, conceptId]);
      setUserXP(prev => prev + 50);
    }

    // Unlock next concept
    if (conceptIndex < module.concepts.length - 1) {
      const nextConcept = module.concepts[conceptIndex + 1];
      if (!unlockedIds.includes(nextConcept.id)) {
        setUnlockedIds(prev => [...prev, nextConcept.id]);
      }
    }
  };

  const handleNextConcept = () => {
    if (activeConceptIndex < module.concepts.length - 1) {
      setActiveConceptIndex(activeConceptIndex + 1);
      setActiveTab('theory');
      const stageEl = document.getElementById('concept-study-stage');
      if (stageEl) {
        stageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="module-detail-canvas">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="canvas-topbar">
        <div className="canvas-breadcrumbs">
          <span className="crumb-root">Semester V</span>
          <ChevronRight size={13} className="crumb-arrow" />
          <span className="crumb-subject">{subject.name}</span>
          <ChevronRight size={13} className="crumb-arrow" />
          <span className="crumb-current">{module.number}</span>
        </div>

        <div className="canvas-top-meta">
          <div className="gamify-xp-chip">
            <Zap size={14} className="xp-bolt" />
            <span>{userXP} XP</span>
          </div>
          <span className="course-code-badge">{subject.code}</span>
          <span className="course-co-badge">{module.co}</span>
          <span className="course-hours-badge">
            <Clock size={12} />
            {module.hours} Hours
          </span>
        </div>
      </div>

      {/* Main Module Header (Bold 'know.' style) */}
      <header className="module-hero-header tactile-hero">
        <div className="module-tag-row">
          <span className="module-tag">{module.number}</span>
          <span className="module-category">{subject.category}</span>
          <span className="module-syllabus-year">NEP 2020 Official</span>
        </div>
        <h1 className="module-hero-title">{module.title}</h1>
        <p className="module-hero-summary">{module.summary}</p>

        {/* Gamified Live Progress Bar */}
        <div className="module-progress-dashboard">
          <div className="progress-info-row">
            <div className="progress-title-block">
              <Award01 size={16} />
              <span>Module Mastery Quest</span>
            </div>
            <div className="progress-stats">
              <span className="stat-count">{masteredIds.length} of {module.concepts.length} Lessons Mastered</span>
              <span className="stat-percent">{completionPercentage}%</span>
            </div>
          </div>
          <div className="progress-track">
            <motion.div 
              className="progress-fill" 
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>
      </header>

      {/* Locked Toast Alert if user clicks locked card */}
      <AnimatePresence>
        {lockedAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="locked-warning-toast"
          >
            <Lock01 size={16} />
            <span>{lockedAlert}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tactile Lesson Cards Grid (Inspired directly by user reference images) */}
      <section className="concepts-section">
        <div className="section-title-row">
          <div>
            <span className="popular-sections-tag">Popular Sections</span>
            <h2 className="section-title">Core Lessons & Knowledge Gates ({module.concepts.length})</h2>
          </div>
          <span className="section-hint">Complete quizzes to unlock sequential lessons</span>
        </div>

        <div className="tactile-cards-grid">
          {module.concepts.map((concept, idx) => {
            const isSelected = activeConceptIndex === idx;
            const isMastered = masteredIds.includes(concept.id);
            const isUnlocked = unlockedIds.includes(concept.id) || idx === 0;
            const palette = TACTILE_PALETTES[idx % TACTILE_PALETTES.length];

            return (
              <motion.div
                key={idx}
                className={`tactile-card ${isSelected ? 'selected-stage-card' : ''} ${!isUnlocked ? 'card-is-locked' : ''}`}
                style={{
                  backgroundColor: palette.bg,
                  color: palette.textColor,
                  boxShadow: isSelected ? `0 12px 30px ${palette.bg}55` : '0 4px 18px rgba(0, 0, 0, 0.05)'
                }}
                onClick={() => handleCardClick(idx, concept)}
                whileHover={{ y: isUnlocked ? -4 : -1, scale: isUnlocked ? 1.01 : 1 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              >
                {/* Top Geometric Symbol + Status Badges */}
                <div className="tactile-card-top">
                  <div className="tactile-symbol" style={{ color: palette.textColor }}>
                    {palette.symbol}
                  </div>

                  <div className="tactile-badges-group">
                    {isMastered ? (
                      <span className="tactile-status-pill mastered-pill">
                        <CheckCircle size={12} />
                        Mastered
                      </span>
                    ) : !isUnlocked ? (
                      <span className="tactile-status-pill locked-pill">
                        <Lock01 size={12} />
                        Locked
                      </span>
                    ) : isSelected ? (
                      <span className="tactile-status-pill active-pill">
                        <Zap size={12} />
                        Reading
                      </span>
                    ) : (
                      <span className="tactile-status-pill open-pill" style={{ background: palette.badgeBg }}>
                        {palette.tag}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Title & Meta (Chunked & Punchy) */}
                <div className="tactile-card-body">
                  <span className="tactile-card-num" style={{ color: palette.subColor }}>
                    Lesson 0{idx + 1}
                  </span>
                  <h3 className="tactile-card-title" style={{ color: palette.textColor }}>
                    {concept.title || concept.name}
                  </h3>
                  <p className="tactile-card-desc" style={{ color: palette.subColor }}>
                    {concept.summary || concept.desc}
                  </p>
                </div>

                {/* Bottom Disc Arrow or Lock Disc */}
                <div className="tactile-card-footer">
                  <span className="tactile-sub-meta" style={{ color: palette.subColor }}>
                    {concept.examWeightage?.marks || '5-10 Marks'} • {concept.quiz?.length || 7} Questions
                  </span>

                  <div 
                    className="tactile-arrow-disc"
                    style={{ 
                      background: palette.arrowBg,
                      color: palette.textColor 
                    }}
                  >
                    {!isUnlocked ? (
                      <Lock01 size={14} />
                    ) : isMastered ? (
                      <CheckCircle size={15} />
                    ) : (
                      <ChevronRight size={15} />
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Focused Concept Interactive Stage (Progressive Disclosure - Principle #2) */}
      {activeConcept && (
        <section id="concept-study-stage" className="concept-deepdive-panel tactile-stage-panel">
          
          {/* Streamlined, Clean Stage Header */}
          <div className="deepdive-header-clean">
            
            {/* Top Meta Bar: Badge on Left, Stepper Nav on Right */}
            <div className="deepdive-top-bar-meta">
              <div className="deepdive-badges-cluster">
                <span className="lesson-badge-pill">Lesson 0{activeConcept.number || (activeConceptIndex + 1)}</span>
                {masteredIds.includes(activeConcept.id) ? (
                  <span className="concept-mastered-badge">
                    <CheckCircle size={13} />
                    <span>Mastered (+50 XP)</span>
                  </span>
                ) : (
                  <span className="concept-gate-badge">
                    <Zap size={13} />
                    <span>Knowledge Gate</span>
                  </span>
                )}
              </div>

              {/* Stepper Controls */}
              <div className="deepdive-stepper-controls">
                <button
                  type="button"
                  className="concept-mini-step-btn"
                  disabled={activeConceptIndex === 0}
                  onClick={() => handleCardClick(activeConceptIndex - 1, module.concepts[activeConceptIndex - 1])}
                  title="Previous Lesson"
                  aria-label="Previous Lesson"
                >
                  <ArrowLeft size={14} />
                </button>
                <span className="stepper-counter-text">{activeConceptIndex + 1} of {module.concepts.length}</span>
                <button
                  type="button"
                  className="concept-mini-step-btn"
                  disabled={activeConceptIndex === module.concepts.length - 1 || !unlockedIds.includes(module.concepts[activeConceptIndex + 1]?.id)}
                  onClick={() => handleCardClick(activeConceptIndex + 1, module.concepts[activeConceptIndex + 1])}
                  title="Next Lesson"
                  aria-label="Next Lesson"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Clean Topic Headline */}
            <h2 className="deepdive-title-clean">{activeConcept.title || activeConcept.name}</h2>

            {/* Subtle Syllabus Subtitle (No clunky pill box!) */}
            {activeConcept.syllabusMapping && (
              <p className="deepdive-syllabus-clean-sub">
                <span className="sub-prefix">Syllabus Scope:</span> {activeConcept.syllabusMapping}
              </p>
            )}

            {/* Fast Action Row */}
            <div className="deepdive-action-strip">
              <button 
                type="button" 
                className="quiz-quick-launch-pill"
                onClick={() => setIsQuizActive(true)}
              >
                <Zap size={14} />
                <span>Dedicated Quiz ({activeConcept.quiz?.length || 7} Qs)</span>
              </button>
              <span className="strip-exam-marks">{activeConcept.examWeightage?.marks || '5-10 Marks'} in MU Exam</span>
            </div>

          </div>

          {/* Progressive Disclosure Interactive Segment Tabs (Horizontal pill strip) */}
          <div className="stage-perspective-tabs">
            <button
              type="button"
              className={`perspective-tab-btn ${activeTab === 'theory' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('theory')}
            >
              <BookOpen01 size={15} />
              <span>1. Theory</span>
            </button>

            <button
              type="button"
              className={`perspective-tab-btn ${activeTab === 'exam' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('exam')}
            >
              <Award01 size={15} />
              <span>2. Blueprints</span>
            </button>

            <button
              type="button"
              className={`perspective-tab-btn ${activeTab === 'takeaways' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('takeaways')}
            >
              <CheckCircle size={15} />
              <span>3. Revision</span>
            </button>

            <button
              type="button"
              className="perspective-tab-btn quiz-tab-highlight"
              onClick={() => setIsQuizActive(true)}
            >
              <Zap size={15} />
              <span>4. Quiz Gate</span>
              {masteredIds.includes(activeConcept.id) ? (
                <span className="tab-pill-done">Passed</span>
              ) : (
                <span className="tab-pill-xp">+50 XP</span>
              )}
            </button>
          </div>


          {/* Tab Content Display (Progressive Disclosure) */}
          <div className="stage-body-wrapper">
            
            {/* TAB 1: Visual Theory */}
            {activeTab === 'theory' && (
              <div className="tab-panel-content">
                {activeConcept.theory ? (
                  <div className="theory-full-container">
                    <TheoryRenderer content={activeConcept.theory} />
                  </div>
                ) : (
                  <p className="deepdive-explanation">
                    {activeConcept.summary || activeConcept.desc}
                  </p>
                )}

                <div className="tab-next-cta-box">
                  <div className="cta-text">
                    <strong>Ready for the Knowledge Gate Quiz?</strong>
                    <p>Test your understanding with {activeConcept.quiz?.length || 7} questions on the dedicated quiz page to unlock Lesson {activeConceptIndex + 2}!</p>
                  </div>
                  <button 
                    type="button" 
                    className="cta-quiz-btn"
                    onClick={() => setIsQuizActive(true)}
                  >
                    <span>Launch Dedicated Quiz</span>
                    <Zap size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: Exam Blueprints */}
            {activeTab === 'exam' && (
              <div className="tab-panel-content">
                {activeConcept.examWeightage ? (
                  <div className="exam-weightage-card tactile-exam-card">
                    <div className="exam-card-header">
                      <div className="exam-marks-badge">
                        <BookOpen01 size={14} />
                        <span>{activeConcept.examWeightage.marks}</span>
                      </div>
                      <span className="exam-freq-text">{activeConcept.examWeightage.frequency}</span>
                    </div>

                    {activeConcept.examWeightage.expectedQuestions && activeConcept.examWeightage.expectedQuestions.length > 0 && (
                      <div className="expected-questions-block">
                        <span className="expected-q-title">Frequently Asked University Examination Questions:</span>
                        <ul className="expected-q-list">
                          {activeConcept.examWeightage.expectedQuestions.map((q, qIdx) => (
                            <li key={qIdx}>
                              <span className="q-badge">Q{qIdx + 1}</span>
                              <span className="q-content">{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="deepdive-explanation">Standard Mumbai University theoretical question.</p>
                )}
              </div>
            )}

            {/* TAB 3: Fast Revision Takeaways */}
            {activeTab === 'takeaways' && (
              <div className="tab-panel-content">
                {activeConcept.keyTakeaways && activeConcept.keyTakeaways.length > 0 && (
                  <div className="key-takeaways-card tactile-takeaways-card">
                    <div className="takeaways-header">
                      <CheckCircle size={18} className="takeaways-icon" />
                      <span className="takeaways-title">High-Yield Revision Checklist</span>
                    </div>
                    <ul className="takeaways-list">
                      {activeConcept.keyTakeaways.map((point, pIdx) => (
                        <li key={pIdx}>
                          <span className="point-bullet">✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

          </div>
        </section>
      )}

      {/* Self-Learning Topics (Direct from Mumbai University PDF) */}
      {module.selfLearning && (
        <div className="self-learning-banner tactile-self-banner">
          <div className="self-learning-tag">Syllabus Self-Learning & Practical Activity</div>
          <p className="self-learning-text">{module.selfLearning}</p>
        </div>
      )}

      {/* Previous / Next Module Navigation */}
      <footer className="module-pagination-footer">
        {prevModule ? (
          <button 
            type="button"
            className="module-nav-btn prev"
            onClick={() => onNavigateModule(prevModule.id)}
          >
            <ArrowLeft size={16} />
            <div className="nav-btn-texts">
              <span className="nav-sub">Previous Module</span>
              <span className="nav-title">{prevModule.number}: {prevModule.title}</span>
            </div>
          </button>
        ) : (
          <div />
        )}

        {nextModule && (
          <button 
            type="button"
            className="module-nav-btn next"
            onClick={() => onNavigateModule(nextModule.id)}
          >
            <div className="nav-btn-texts right-align">
              <span className="nav-sub">Next Module</span>
              <span className="nav-title">{nextModule.number}: {nextModule.title}</span>
            </div>
            <ArrowRight size={16} />
          </button>
        )}
      </footer>

    </div>
  );
}

