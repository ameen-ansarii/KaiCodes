import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  File02, 
  ArrowRight, 
  SearchLg, 
  Check, 
  Code01, 
  LayersThree01 
} from '@untitledui/icons';

export default function TutorialsPage({ user, onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const tutorialTopics = [
    'All',
    'Python',
    'Java',
    'DSA',
    'ML & Data Science',
    'Interview Corner',
    'Programming Languages',
    'Web Development',
    'GATE',
    'CS Subjects',
    'DevOps',
    'Software and Tools',
  ];

  const tutorials = [
    {
      id: 'python-core',
      title: 'Python Core & Advanced Concepts',
      category: 'Python',
      readTime: '15 min read',
      chapters: 18,
      desc: 'Generators, decorators, GIL, memory management, multithreading, and async I/O in Python 3.12+.',
      tag: 'Hands-on Code',
    },
    {
      id: 'dsa-graphs',
      title: 'Graph Algorithms: BFS, DFS, Dijkstra & Prim',
      category: 'DSA',
      readTime: '25 min read',
      chapters: 12,
      desc: 'Visual explanation of graph representations, shortest path algorithms, cycle detection, and topological sorting.',
      tag: 'Interview Must-Know',
    },
    {
      id: 'os-concurrency',
      title: 'Operating Systems: Concurrency, Semaphores & Deadlocks',
      category: 'CS Subjects',
      readTime: '20 min read',
      chapters: 9,
      desc: 'Process synchronization, critical section problems, mutex locks, and Banker’s algorithm with exam practice.',
      tag: 'Semester Core',
    },
    {
      id: 'java-multithreading',
      title: 'Java Memory Model & Concurrency Utilities',
      category: 'Java',
      readTime: '18 min read',
      chapters: 14,
      desc: 'Thread pools, ExecutorService, CompletableFuture, ConcurrentHashMap, and volatile variables explained.',
      tag: 'Backend Core',
    },
    {
      id: 'web-react-arch',
      title: 'Modern Web: React 19, Server Components & Hooks',
      category: 'Web Development',
      readTime: '22 min read',
      chapters: 16,
      desc: 'Deep dive into reconciliation, concurrent rendering, custom hooks patterns, and state management architectures.',
      tag: 'Modern Web',
    },
    {
      id: 'ml-math',
      title: 'Essential Mathematics for Machine Learning',
      category: 'ML & Data Science',
      readTime: '30 min read',
      chapters: 11,
      desc: 'Linear algebra, matrix factorizations, multivariate calculus, gradient descent derivations, and probability.',
      tag: 'Foundations',
    },
    {
      id: 'devops-docker',
      title: 'Docker & Multi-Stage Production Builds',
      category: 'DevOps',
      readTime: '14 min read',
      chapters: 8,
      desc: 'Layer caching, minimal base images, security best practices, and compose networks for full-stack apps.',
      tag: 'Infrastructure',
    },
    {
      id: 'interview-prep',
      title: 'Top 50 Behavioral & Technical Interview Frameworks',
      category: 'Interview Corner',
      readTime: '16 min read',
      chapters: 10,
      desc: 'STAR method answers, problem decomposition, trade-off communication, and edge-case handling guidelines.',
      tag: 'Placement Guide',
    },
    {
      id: 'git-tools',
      title: 'Git Internals & Advanced Rebase Workflows',
      category: 'Software and Tools',
      readTime: '12 min read',
      chapters: 7,
      desc: 'Understanding git objects (blobs, trees, commits), interactive rebasing, bisecting, and merge conflict resolution.',
      tag: 'Developer Tools',
    },
  ];

  const filteredTutorials = tutorials.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="catalog-page-container">
      {/* Header section */}
      <header className="catalog-header">
        <div className="catalog-tag">Interactive Knowledge Hub</div>
        <h1 className="catalog-title">Engineering Tutorials & References</h1>
        <p className="catalog-subtitle">
          Concise, code-first tutorials spanning core computer science subjects, modern frameworks, and placement question banks.
        </p>

        {/* Search Bar */}
        <div className="tutorial-search-container">
          <SearchLg size={18} className="search-icon-adornment" />
          <input
            type="text"
            className="tutorial-search-input"
            placeholder="Search tutorials by subject, topic or framework (e.g. Dijkstra, Concurrency)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Topic Pills */}
        <div className="catalog-category-bar">
          {tutorialTopics.map((topic) => (
            <button
              key={topic}
              className={`catalog-cat-pill ${activeCategory === topic ? 'active' : ''}`}
              onClick={() => setActiveCategory(topic)}
            >
              <span>{topic}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Tutorials Grid */}
      <main className="catalog-grid">
        {filteredTutorials.map((tut) => (
          <motion.div
            key={tut.id}
            className="catalog-card"
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div className="catalog-card-header">
              <span className="catalog-card-category">{tut.category}</span>
              <span className="catalog-card-badge">{tut.tag}</span>
            </div>

            <h3 className="catalog-card-title">{tut.title}</h3>
            <p className="catalog-card-desc">{tut.desc}</p>

            <div className="catalog-card-meta">
              <div className="meta-pill">
                <File02 size={14} />
                <span>{tut.chapters} Chapters</span>
              </div>
              <div className="meta-pill">
                <span>{tut.readTime}</span>
              </div>
            </div>

            <div className="catalog-card-footer">
              <span className="level-indicator">Free Study Guide</span>
              <button className="catalog-open-btn">
                <span>Read Tutorial</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        ))}
      </main>
    </div>
  );
}
