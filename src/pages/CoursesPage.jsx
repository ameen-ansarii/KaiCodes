import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen01, 
  ArrowRight, 
  Check, 
  Clock, 
  Users01, 
  Star01 
} from '@untitledui/icons';

export default function CoursesPage({ user, onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'DSA / Placements',
    'DA / Data Science & AI',
    'Development',
    'DevOps Course',
    'GATE Prep',
  ];

  const courseList = [
    {
      id: 'dsa-mastery',
      title: 'Complete DSA & Placement Bootcamp',
      category: 'DSA / Placements',
      desc: 'Arrays, Trees, Dynamic Programming, Graphs & LeetCode 250+ curated interview patterns.',
      modules: 24,
      duration: '12 Weeks',
      students: '1.4k students',
      level: 'All Levels',
      badge: 'Popular',
    },
    {
      id: 'gate-cs',
      title: 'GATE CS Complete Core Prep',
      category: 'GATE Prep',
      desc: 'Engineering Math, TOC, Compiler Design, OS, DBMS, Computer Architecture & Algorithms.',
      modules: 36,
      duration: '16 Weeks',
      students: '890 students',
      level: 'Advanced',
      badge: 'Comprehensive',
    },
    {
      id: 'fullstack-dev',
      title: 'Modern Full Stack & Systems Engineering',
      category: 'Development',
      desc: 'React, Node.js, WebSockets, Redis caching, microservices & production deployment.',
      modules: 18,
      duration: '10 Weeks',
      students: '2.1k students',
      level: 'Intermediate',
      badge: 'Updated 2026',
    },
    {
      id: 'data-science-ai',
      title: 'Data Science, Machine Learning & GenAI',
      category: 'DA / Data Science & AI',
      desc: 'Pandas, NumPy, Scikit-learn, PyTorch deep learning, LLMs & Retrieval-Augmented Generation.',
      modules: 22,
      duration: '12 Weeks',
      students: '1.2k students',
      level: 'Intermediate',
      badge: 'Trending',
    },
    {
      id: 'devops-cloud',
      title: 'DevOps, Docker, Kubernetes & CI/CD',
      category: 'DevOps Course',
      desc: 'Containerization, Linux fundamentals, GitHub Actions workflows & cloud infrastructure.',
      modules: 14,
      duration: '8 Weeks',
      students: '760 students',
      level: 'Intermediate',
    },
    {
      id: 'interview-dsa',
      title: 'FAANG / Product Interview Sprint',
      category: 'DSA / Placements',
      desc: 'Mock interviews, behavioral frameworks, system design fundamentals & resume reviews.',
      modules: 10,
      duration: '4 Weeks',
      students: '940 students',
      level: 'Advanced',
    },
  ];

  const filteredCourses = selectedCategory === 'All'
    ? courseList
    : courseList.filter(c => c.category === selectedCategory);

  return (
    <div className="catalog-page-container">
      {/* Header section */}
      <header className="catalog-header">
        <div className="catalog-tag">Curated Syllabus Courses</div>
        <h1 className="catalog-title">Structured Courses for Engineering</h1>
        <p className="catalog-subtitle">
          Department-aligned modules, competitive programming track, and placement prep tailored for {user?.department || 'Engineering'}.
        </p>

        {/* Category Pills */}
        <div className="catalog-category-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`catalog-cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Courses Grid */}
      <main className="catalog-grid">
        {filteredCourses.map((course) => (
          <motion.div
            key={course.id}
            className="catalog-card"
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div className="catalog-card-header">
              <span className="catalog-card-category">{course.category}</span>
              {course.badge && <span className="catalog-card-badge">{course.badge}</span>}
            </div>

            <h3 className="catalog-card-title">{course.title}</h3>
            <p className="catalog-card-desc">{course.desc}</p>

            <div className="catalog-card-meta">
              <div className="meta-pill">
                <BookOpen01 size={14} />
                <span>{course.modules} Modules</span>
              </div>
              <div className="meta-pill">
                <Clock size={14} />
                <span>{course.duration}</span>
              </div>
              <div className="meta-pill">
                <Users01 size={14} />
                <span>{course.students}</span>
              </div>
            </div>

            <div className="catalog-card-footer">
              <span className="level-indicator">{course.level}</span>
              <button className="catalog-open-btn">
                <span>Start Learning</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        ))}
      </main>
    </div>
  );
}
