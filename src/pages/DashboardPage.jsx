import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users01, 
  BookOpen01, 
  MessageSquare01, 
  Calendar, 
  File02, 
  ArrowRight,
  SearchLg
} from '@untitledui/icons';

export default function DashboardPage({ user, onNavigate, onTriggerFeedback }) {
  return (
    <main className="dashboard-hero-section">
      {/* Top Greeting & Campus Hub details */}
      <div className="dashboard-greeting-row">
        <div>
          <h1 className="dashboard-greeting">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'} 👋
          </h1>
          <p className="dashboard-subtext">
            Connected to your campus hub for <strong>{user?.department || 'Computer Science & Engineering'}</strong> • <strong>{user?.year || '3rd Year'}</strong>.
          </p>
        </div>
      </div>

      {/* Featured Live Room Hero Banner */}
      <motion.div 
        className="live-room-hero-card"
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
        onClick={() => onTriggerFeedback('Joined Batch Study Room')}
      >
        <div className="live-room-content">
          <div className="live-room-status-badge">
            <span className="live-pulse-dot"></span>
            <span>Batch Study Room • Live Now</span>
          </div>
          <h2 className="live-room-title">
            {user?.department || 'Computer Science'} ({user?.year || '3rd Year'})
          </h2>
          <p className="live-room-desc">
            Active real-time discussion: Midterm exam preparation, lab submission questions, and algorithm practice.
          </p>
          <div className="live-room-meta">
            <div className="live-user-stat">
              <Users01 size={16} />
              <span>142 classmates online</span>
            </div>
          </div>
        </div>

        <button className="live-room-join-btn">
          <span>Enter Room</span>
          <ArrowRight size={16} />
        </button>
      </motion.div>

      {/* Balanced 3-Column Resource Grid */}
      <div className="dashboard-balanced-grid">
        {/* Card 1: Verified Lecture Notes */}
        <motion.div 
          className="dashboard-card"
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 26 }}
          onClick={() => onTriggerFeedback('Opened Lecture Notes')}
        >
          <div className="card-top-icon">
            <BookOpen01 size={24} />
          </div>
          <h3 className="card-title">Verified Lecture Notes</h3>
          <p className="card-desc">
            Handwritten and typed notes organized by subject, professor, and unit for your current semester.
          </p>
          <div className="card-footer">
            <span>34 new uploads</span>
            <span className="card-arrow-link">Browse Notes →</span>
          </div>
        </motion.div>

        {/* Card 2: PYQs & Exams */}
        <motion.div 
          className="dashboard-card"
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 26 }}
          onClick={() => onTriggerFeedback('Opened PYQs & Exams')}
        >
          <div className="card-top-icon">
            <Calendar size={24} />
          </div>
          <h3 className="card-title">PYQs & Solution Keys</h3>
          <p className="card-desc">
            Previous 5 years midterms and end-sem question papers with verified step-by-step solutions.
          </p>
          <div className="card-footer">
            <span>2026 Updated</span>
            <span className="card-arrow-link">View Papers →</span>
          </div>
        </motion.div>

        {/* Card 3: Syllabus & Drive */}
        <motion.div 
          className="dashboard-card"
          whileHover={{ y: -3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 26 }}
          onClick={() => onTriggerFeedback('Opened Syllabus Drive')}
        >
          <div className="card-top-icon">
            <File02 size={24} />
          </div>
          <h3 className="card-title">Syllabus & Course Drive</h3>
          <p className="card-desc">
            Official curriculum modules, reference book PDFs, and academic calendar dates.
          </p>
          <div className="card-footer">
            <span>Full Syllabus</span>
            <span className="card-arrow-link">Open Drive →</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
