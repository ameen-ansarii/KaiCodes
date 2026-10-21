import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  ShieldTick, 
  Eye, 
  EyeOff,
  Menu01
} from '@untitledui/icons';
import { AvatarOne, AvatarTwo } from './components/Avatars';
import Sidebar from './components/Sidebar';
import SyllabusModuleDetail from './pages/SyllabusModuleDetail';
import { SEMESTER_DATA } from './data/muSyllabusData';
import { registerUser, loginUser } from './lib/turso';
import './App.css';

export default function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [toastMessage, setToastMessage] = useState(null);

  // Clean up any lingering mock user from previous turn
  useEffect(() => {
    localStorage.removeItem('kaicode_current_user');
    localStorage.removeItem('kaicode_flow_mode');
  }, []);

  // Authentication Flow State: 'home' | 'login' | 'signup' | 'dashboard'
  // If user is already authenticated in session, resume in dashboard; otherwise home
  const [flowMode, setFlowMode] = useState(() => {
    try {
      localStorage.removeItem('kaicode_current_user');
      localStorage.removeItem('kaicode_flow_mode');
      const saved = sessionStorage.getItem('kaicode_auth_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u && u.name && u.name !== 'Scholar') return 'dashboard';
      }
    } catch {
      // fallback
    }
    return 'home';
  });
  const [currentStep, setCurrentStep] = useState(1);
  // Direction: 1 = forward (slide in from right), -1 = back (slide in from left)
  const [direction, setDirection] = useState(1);

  // Curriculum & Sidebar Navigation State
  const [activeSubjectId, setActiveSubjectId] = useState('cn');
  const [activeModuleId, setActiveModuleId] = useState('cn-mod-1');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    year: '',
    password: '',
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const triggerFeedback = (actionName) => {
    setToastMessage(`⚡ ${actionName}`);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const isMobileLayout = windowWidth < 900;

  // Spring physics for tactile feel
  const iosSpringTransition = {
    type: 'spring',
    stiffness: 450,
    damping: 28,
    mass: 0.85,
  };

  // Start Flows (always forward: direction = 1)
  const startSignup = () => {
    setDirection(1);
    setFlowMode('signup');
    setCurrentStep(1);
    triggerFeedback('Create an account');
  };

  const startLogin = () => {
    setDirection(1);
    setFlowMode('login');
    setCurrentStep(1);
    triggerFeedback('I have an account');
  };

  // Go Back (always backward: direction = -1, slides in from left)
  const goBack = () => {
    setDirection(-1);
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      setFlowMode('home');
      setCurrentStep(1);
    }
  };

  // User & Submission State (Retrieved from session when real user logs in; NO mock user)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      localStorage.removeItem('kaicode_current_user');
      localStorage.removeItem('kaicode_flow_mode');
      const saved = sessionStorage.getItem('kaicode_auth_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u && u.name && u.name !== 'Scholar') {
          return u;
        }
      }
    } catch {
      // fallback
    }
    return null;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('kaicode_auth_user');
    localStorage.removeItem('kaicode_current_user');
    localStorage.removeItem('kaicode_flow_mode');
    setCurrentUser(null);
    setFlowMode('home');
    triggerFeedback('Logged out successfully');
  };

  const handleNavClick = (target) => {
    if (target === 'auth' || target === 'Sign in') {
      startLogin();
    } else if (target === 'home') {
      setFlowMode(currentUser ? 'dashboard' : 'home');
    } else if (target === 'download') {
      triggerFeedback('PWA ready: Installable on laptop and phone');
    } else {
      triggerFeedback(`Navigated to ${target}`);
    }
  };

  // Advance Step (always forward: direction = 1, slides in from right)
  const advanceStep = async () => {
    setDirection(1);
    if (flowMode === 'login') {
      if (currentStep === 1) {
        setCurrentStep(2);
      } else {
        setIsSubmitting(true);
        try {
          const user = await loginUser({
            email: formData.email,
            password: formData.password,
          });
          sessionStorage.setItem('kaicode_auth_user', JSON.stringify(user));
          setCurrentUser(user);
          setFlowMode('dashboard');
          triggerFeedback(`Welcome back, ${user.name || 'Student'}!`);
        } catch (err) {
          triggerFeedback(err.message || 'Login failed');
        } finally {
          setIsSubmitting(false);
        }
      }
    } else if (flowMode === 'signup') {
      if (currentStep < 5) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsSubmitting(true);
        try {
          const user = await registerUser(formData);
          sessionStorage.setItem('kaicode_auth_user', JSON.stringify(user));
          setCurrentUser(user);
          setFlowMode('dashboard');
          triggerFeedback(`Account created! Welcome, ${user.name}`);
        } catch (err) {
          triggerFeedback(err.message || 'Account creation failed');
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };


  // Directional slide animation variants
  const slideVariants = {
    initial: (dir) => ({
      opacity: 0,
      x: dir > 0 ? 40 : -40,
    }),
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: (dir) => ({
      opacity: 0,
      x: dir > 0 ? -40 : 40,
    }),
  };

  const currentSubject = SEMESTER_DATA.subjects.find(s => s.id === activeSubjectId) || SEMESTER_DATA.subjects[0];
  const currentModule = currentSubject?.modules.find(m => m.id === activeModuleId) || currentSubject?.modules[0];

  return (
    <div className={`auth-page-container ${isMobileLayout ? 'pure-mobile' : ''}`}>
      
      {/* =========================================================
          STATE A: ACTIVE QUESTIONNAIRE FLOW (Login or Signup)
          ========================================================= */}
      {(flowMode === 'login' || flowMode === 'signup') && (
        <div className="flow-page-layout">
          {/* Top Bar with Back Arrow & Step Counter */}
          <div className="flow-topbar">
            <motion.button
              className="back-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              transition={iosSpringTransition}
              onClick={goBack}
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </motion.button>

            <span className="flow-step-counter">
              {flowMode === 'login' ? `Step ${currentStep} of 2` : `Step ${currentStep} of 5`}
            </span>
          </div>

          {/* Question Form Content with Directional Transitions */}
          <div className="flow-main-content">
            <AnimatePresence mode="wait" custom={direction}>
              {flowMode === 'login' && (
                <LoginStep
                  key={`login-${currentStep}`}
                  step={currentStep}
                  formData={formData}
                  setFormData={setFormData}
                  onNext={advanceStep}
                  springTransition={iosSpringTransition}
                  slideVariants={slideVariants}
                  direction={direction}
                  isSubmitting={isSubmitting}
                />
              )}

              {flowMode === 'signup' && (
                <SignupStep
                  key={`signup-${currentStep}`}
                  step={currentStep}
                  formData={formData}
                  setFormData={setFormData}
                  onNext={advanceStep}
                  springTransition={iosSpringTransition}
                  slideVariants={slideVariants}
                  direction={direction}
                  isSubmitting={isSubmitting}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="ios-home-indicator"></div>
        </div>
      )}

      {/* =========================================================
          STATE B: AUTHENTICATED CURRICULUM SYLLABUS EXPLORER (With Sidebar)
          ========================================================= */}
      {flowMode === 'dashboard' && (
        <div className="sidebar-layout-container">
          
          {/* Mobile Top Bar */}
          <div className="mobile-top-nav-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '15px', color: '#111114' }}>MU Syllabus</span>
              <span style={{ fontSize: '11px', color: '#71717a', background: '#f4f4f5', padding: '2px 6px', borderRadius: '4px' }}>Sem V</span>
            </div>
            <button 
              className="mobile-hamburger-btn" 
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open syllabus menu"
            >
              <Menu01 size={22} />
            </button>
          </div>

          {/* Desktop Persistent / Collapsible Sidebar + Mobile Drawer */}
          <Sidebar 
            user={currentUser}
            activeSubjectId={activeSubjectId}
            activeModuleId={activeModuleId}
            onSelectSubject={(id) => {
              setActiveSubjectId(id);
              const subj = SEMESTER_DATA.subjects.find(s => s.id === id);
              if (subj && subj.modules.length > 0) {
                setActiveModuleId(subj.modules[0].id);
              }
            }}
            onSelectModule={(modId) => setActiveModuleId(modId)}
            onLogout={handleLogout}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isMobileOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
          />

          {/* Right Canvas: Detailed Module & Concept Viewer (Space properly utilized) */}
          <main className="main-study-canvas">
            <SyllabusModuleDetail 
              subject={currentSubject}
              module={currentModule}
              onNavigateModule={(modId) => setActiveModuleId(modId)}
              onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            />
          </main>

        </div>
      )}

      {/* =========================================================
          STATE C: HOME / LANDING SCREEN (Desktop or Mobile)
          ========================================================= */}
      {flowMode === 'home' && (
        <>
          {/* MOBILE SCREEN */}
          {isMobileLayout ? (
            <div className="native-mobile-screen">
              {/* Brand Wordmark */}
              <div className="brand-wordmark">kaicode</div>

              {/* Main Hero Typography */}
              <div className="hero-text-section">
                <h1 className="hero-heading">
                  <div className="hero-line">
                    <span className="text-black">mumbai</span>
                  </div>
                  <div className="hero-line">
                    <span className="text-muted">university</span>
                  </div>
                  <div className="hero-line">
                    <span className="text-black">syllabus</span>
                  </div>
                </h1>
                <p style={{ fontSize: '14px', color: '#71717a', lineHeight: 1.5, marginTop: '12px' }}>
                  NEP 2020 semester subjects, module breakdowns (1 to 6), and concept deep-dives.
                </p>
              </div>

              {/* Bottom Group: Buttons & Lowered Terms */}
              <div className="mobile-bottom-group">
                <div className="buttons-section">
                  <motion.button
                    className="ios-btn ios-btn-apple"
                    whileHover={{ scale: 1.012 }}
                    whileTap={{ scale: 0.965 }}
                    transition={iosSpringTransition}
                    onClick={startSignup}
                  >
                    <span>Create an account</span>
                  </motion.button>

                  <motion.button
                    className="ios-btn ios-btn-secondary"
                    whileHover={{ scale: 1.012 }}
                    whileTap={{ scale: 0.965 }}
                    transition={iosSpringTransition}
                    onClick={startLogin}
                  >
                    <span>I have an account</span>
                  </motion.button>
                </div>

                <p className="disclaimer-text">
                  By continuing you confirm that you agree to our{' '}
                  <span className="disclaimer-link">Terms of Service</span> and{' '}
                  <span className="disclaimer-link">Privacy Policy</span>.
                </p>

                <div className="ios-home-indicator"></div>
              </div>
            </div>
          ) : (
            /* DESKTOP / LAPTOP LANDSCAPE LAYOUT */
            <div className="desktop-auth-layout">
              {/* Left Column: Brand & Curriculum Hero Showcase */}
              <div className="desktop-left-column">
                <div className="desktop-brand-header">
                  <span className="desktop-brand-title">kaicode</span>
                </div>

                <div className="desktop-hero-content">
                  <div className="desktop-hero-heading">
                    <div className="hero-line">
                      <span className="text-black">mumbai</span>
                      <AvatarOne size={62} />
                      <span className="text-black">university</span>
                    </div>
                    <div className="hero-line">
                      <span className="text-muted">semester</span>
                      <span className="text-black">syllabus</span>
                    </div>
                    <div className="hero-line">
                      <span className="text-black">concepts</span>
                      <AvatarTwo size={62} />
                      <span className="text-muted">& theory</span>
                    </div>
                  </div>

                  <p className="desktop-subheadline">
                    Official University of Mumbai NEP 2020 syllabus modules, structured concepts, and exam theory for Computer Science & Engineering (AI & ML).
                  </p>
                </div>

                <div className="desktop-left-footer">
                  <div className="stat-item">
                    <ShieldTick size={16} />
                    <span>Verified College Network</span>
                  </div>
                  <div className="stat-item">
                    <Check size={16} />
                    <span>PWA Offline Access Ready</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Authentication Panel */}
              <div className="desktop-right-column">
                <div className="desktop-auth-card">
                  <div className="auth-card-header">
                    <h2 className="auth-card-title">Join your campus rooms</h2>
                    <p className="auth-card-subtitle">
                      Sign in or create your profile to access all departmental study resources.
                    </p>
                  </div>

                  <div className="desktop-buttons-group">
                    <motion.button
                      className="ios-btn ios-btn-apple"
                      whileHover={{ scale: 1.012, y: -1 }}
                      whileTap={{ scale: 0.965, y: 1 }}
                      transition={iosSpringTransition}
                      onClick={startSignup}
                    >
                      <span>Create an account</span>
                    </motion.button>

                    <motion.button
                      className="ios-btn ios-btn-secondary"
                      whileHover={{ scale: 1.012, y: -1 }}
                      whileTap={{ scale: 0.965, y: 1 }}
                      transition={iosSpringTransition}
                      onClick={startLogin}
                    >
                      <span>I have an account</span>
                    </motion.button>
                  </div>

                  <p className="disclaimer-text" style={{ marginTop: '32px' }}>
                    By continuing you confirm that you agree to our{' '}
                    <span className="disclaimer-link">Terms of Service</span>,{' '}
                    <span className="disclaimer-link">Privacy Policy</span> and good behavior in chat with users (write to your loved ones more often 🤍).
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Spring feedback toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className="feedback-toast"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={iosSpringTransition}
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// -------------------------------------------------------------
// LOGIN STEP SUB-COMPONENT
// -------------------------------------------------------------
function LoginStep({ step, formData, setFormData, onNext, springTransition, slideVariants, direction, isSubmitting }) {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [step]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1 && formData.email.trim()) onNext();
    if (step === 2 && formData.password.trim()) onNext();
  };

  return (
    <motion.form 
      className="flow-form"
      onSubmit={handleSubmit}
      custom={direction}
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={springTransition}
    >
      {step === 1 && (
        <>
          <h1 className="flow-question-title">What's your email address?</h1>
          <p className="flow-question-sub">Enter the email you used to register your account.</p>

          <div className="underline-input-wrapper">
            <input
              ref={inputRef}
              type="email"
              className="underline-input"
              placeholder="name@college.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="flow-bottom-group">
            <motion.button
              type="submit"
              className="ios-btn ios-btn-apple"
              whileHover={{ scale: 1.012 }}
              whileTap={{ scale: 0.965 }}
              transition={springTransition}
              disabled={!formData.email.trim()}
              style={{ opacity: formData.email.trim() ? 1 : 0.5 }}
            >
              <span>Continue</span>
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="flow-question-title">Enter your password</h1>
          <p className="flow-question-sub">Welcome back, {formData.email}</p>

          <div className="underline-input-wrapper">
            <input
              ref={inputRef}
              type={showPassword ? 'text' : 'password'}
              className="underline-input"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="button"
              className="input-addon-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flow-bottom-group">
            <motion.button
              type="submit"
              className="ios-btn ios-btn-apple"
              whileHover={{ scale: 1.012 }}
              whileTap={{ scale: 0.965 }}
              transition={springTransition}
              disabled={!formData.password.trim() || isSubmitting}
              style={{ opacity: formData.password.trim() && !isSubmitting ? 1 : 0.5 }}
            >
              <span>{isSubmitting ? 'Verifying...' : 'Log in'}</span>
              {!isSubmitting && <ArrowRight size={18} />}
            </motion.button>
          </div>
        </>
      )}
    </motion.form>
  );
}

// -------------------------------------------------------------
// SIGNUP STEP SUB-COMPONENT
// -------------------------------------------------------------
function SignupStep({ step, formData, setFormData, onNext, springTransition, slideVariants, direction, isSubmitting }) {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [step]);

  const departments = [
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Information Technology',
    'Electrical & Electronics',
  ];

  const years = ['1st Year (Freshman)', '2nd Year (Sophomore)', '3rd Year (Junior)', '4th Year (Senior)'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1 && formData.name.trim()) onNext();
    if (step === 2 && formData.email.trim()) onNext();
    if (step === 3 && formData.department) onNext();
    if (step === 4 && formData.year) onNext();
    if (step === 5 && formData.password.trim()) onNext();
  };

  return (
    <motion.form
      className="flow-form"
      onSubmit={handleSubmit}
      custom={direction}
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={springTransition}
    >
      {/* Step 1: Name */}
      {step === 1 && (
        <>
          <h1 className="flow-question-title">What's your full name?</h1>
          <p className="flow-question-sub">This is how your batchmates will see you in rooms.</p>

          <div className="underline-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              className="underline-input"
              placeholder="e.g. Alex Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="flow-bottom-group">
            <motion.button
              type="submit"
              className="ios-btn ios-btn-apple"
              whileHover={{ scale: 1.012 }}
              whileTap={{ scale: 0.965 }}
              transition={springTransition}
              disabled={!formData.name.trim()}
              style={{ opacity: formData.name.trim() ? 1 : 0.5 }}
            >
              <span>Continue</span>
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </>
      )}

      {/* Step 2: College Email */}
      {step === 2 && (
        <>
          <h1 className="flow-question-title">What's your college email?</h1>
          <p className="flow-question-sub">We use this to verify and connect your campus rooms.</p>

          <div className="underline-input-wrapper">
            <input
              ref={inputRef}
              type="email"
              className="underline-input"
              placeholder="name@college.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="flow-bottom-group">
            <motion.button
              type="submit"
              className="ios-btn ios-btn-apple"
              whileHover={{ scale: 1.012 }}
              whileTap={{ scale: 0.965 }}
              transition={springTransition}
              disabled={!formData.email.trim()}
              style={{ opacity: formData.email.trim() ? 1 : 0.5 }}
            >
              <span>Continue</span>
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </>
      )}

      {/* Step 3: Department */}
      {step === 3 && (
        <>
          <h1 className="flow-question-title">Choose your department</h1>
          <p className="flow-question-sub">You will automatically get access to its syllabus and notes.</p>

          <div className="options-grid">
            {departments.map((dept) => (
              <motion.button
                key={dept}
                type="button"
                className={`option-pill-btn ${formData.department === dept ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, department: dept })}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={springTransition}
              >
                <span>{dept}</span>
                {formData.department === dept && <Check size={18} />}
              </motion.button>
            ))}
          </div>

          <div className="flow-bottom-group">
            <motion.button
              type="submit"
              className="ios-btn ios-btn-apple"
              whileHover={{ scale: 1.012 }}
              whileTap={{ scale: 0.965 }}
              transition={springTransition}
              disabled={!formData.department}
              style={{ opacity: formData.department ? 1 : 0.5 }}
            >
              <span>Continue</span>
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </>
      )}

      {/* Step 4: Academic Year */}
      {step === 4 && (
        <>
          <h1 className="flow-question-title">What year are you in?</h1>
          <p className="flow-question-sub">Helps filter the right semester subjects and past papers.</p>

          <div className="options-grid">
            {years.map((yr) => (
              <motion.button
                key={yr}
                type="button"
                className={`option-pill-btn ${formData.year === yr ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, year: yr })}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={springTransition}
              >
                <span>{yr}</span>
                {formData.year === yr && <Check size={18} />}
              </motion.button>
            ))}
          </div>

          <div className="flow-bottom-group">
            <motion.button
              type="submit"
              className="ios-btn ios-btn-apple"
              whileHover={{ scale: 1.012 }}
              whileTap={{ scale: 0.965 }}
              transition={springTransition}
              disabled={!formData.year}
              style={{ opacity: formData.year ? 1 : 0.5 }}
            >
              <span>Continue</span>
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </>
      )}

      {/* Step 5: Password */}
      {step === 5 && (
        <>
          <h1 className="flow-question-title">Create a secure password</h1>
          <p className="flow-question-sub">At least 8 characters to keep your account safe.</p>

          <div className="underline-input-wrapper">
            <input
              ref={inputRef}
              type={showPassword ? 'text' : 'password'}
              className="underline-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="button"
              className="input-addon-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flow-bottom-group">
            <motion.button
              type="submit"
              className="ios-btn ios-btn-apple"
              whileHover={{ scale: 1.012 }}
              whileTap={{ scale: 0.965 }}
              transition={springTransition}
              disabled={formData.password.length < 6 || isSubmitting}
              style={{ opacity: formData.password.length >= 6 && !isSubmitting ? 1 : 0.5 }}
            >
              <span>{isSubmitting ? 'Saving to Turso...' : 'Enter rooms'}</span>
              {!isSubmitting && <ArrowRight size={18} />}
            </motion.button>
          </div>
        </>
      )}
    </motion.form>
  );
}
