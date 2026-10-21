import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  LogOut01 
} from '@untitledui/icons';
import NavDropdown from './NavDropdown';

// Spiral Logo Badge from reference
export function SpiralLogoBadge({ size = 32 }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(234, 88, 12, 0.35)',
      }}
    >
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 100 100" fill="none">
        <path
          d="M50 15 C30 15, 18 32, 22 52 C26 70, 44 82, 64 78 C80 74, 90 56, 84 38 C78 22, 60 16, 44 22 C30 28, 24 44, 30 58 C36 70, 50 74, 62 68 C72 62, 74 48, 68 38 C62 30, 48 30, 42 38 C38 44, 40 52, 48 54 C54 56, 58 50, 56 46"
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function FloatingNavbar({ user, onLogout, onNavigate, activePage = 'dashboard' }) {
  const [openDropdown, setOpenDropdown] = useState(null); // 'courses' | 'tutorials' | 'resources' | null
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (menuKey) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(menuKey);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  // Courses Menu Items (from user screenshot 1)
  const coursesItems = [
    'DSA / Placements',
    'DA / Data Science & AI',
    'Development',
    'DevOps Course',
    'GATE Prep',
    'All Courses',
  ];

  // Tutorials Menu Items (from user screenshot 2)
  const tutorialsItems = [
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
    'School Learning',
    'Software and Tools',
  ];

  // Resources Menu Items
  const resourcesItems = [
    'Lecture Notes',
    'PYQs & Solution Keys',
    'Syllabus Drive',
  ];

  return (
    <nav className="floating-nav-wrapper">
      <div 
        className="floating-nav-pill"
        onMouseLeave={handleMouseLeave}
      >
        {/* Left Spiral Logo (clicks to Home Dashboard) */}
        <div 
          className="nav-brand-container" 
          onClick={() => onNavigate('dashboard')}
          style={{ cursor: 'pointer' }}
          title="Home Dashboard"
        >
          <SpiralLogoBadge size={34} />
        </div>

        {/* Center Nav Links with Dropdowns */}
        <div className="nav-links-group">
          
          {/* Header 1: Courses */}
          <div 
            className="nav-item-wrapper"
            onMouseEnter={() => handleMouseEnter('courses')}
          >
            <button 
              className={`nav-link-btn ${activePage === 'courses' ? 'active-page' : ''} ${openDropdown === 'courses' ? 'active' : ''}`}
              onClick={() => {
                onNavigate('courses');
                setOpenDropdown(openDropdown === 'courses' ? null : 'courses');
              }}
            >
              <span>Courses</span>
              {openDropdown === 'courses' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <AnimatePresence>
              {openDropdown === 'courses' && (
                <NavDropdown 
                  items={coursesItems} 
                  width={230}
                  onSelect={(item) => {
                    setOpenDropdown(null);
                    onNavigate('courses', item);
                  }}
                  onMouseEnter={() => handleMouseEnter('courses')}
                  onMouseLeave={handleMouseLeave}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Header 2: Tutorials */}
          <div 
            className="nav-item-wrapper"
            onMouseEnter={() => handleMouseEnter('tutorials')}
          >
            <button 
              className={`nav-link-btn ${activePage === 'tutorials' ? 'active-page' : ''} ${openDropdown === 'tutorials' ? 'active' : ''}`}
              onClick={() => {
                onNavigate('tutorials');
                setOpenDropdown(openDropdown === 'tutorials' ? null : 'tutorials');
              }}
            >
              <span>Tutorials</span>
              {openDropdown === 'tutorials' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <AnimatePresence>
              {openDropdown === 'tutorials' && (
                <NavDropdown 
                  items={tutorialsItems} 
                  width={250}
                  maxHeight={440}
                  onSelect={(item) => {
                    setOpenDropdown(null);
                    onNavigate('tutorials', item);
                  }}
                  onMouseEnter={() => handleMouseEnter('tutorials')}
                  onMouseLeave={handleMouseLeave}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Header 3: Resources */}
          <div 
            className="nav-item-wrapper"
            onMouseEnter={() => handleMouseEnter('resources')}
          >
            <button 
              className={`nav-link-btn ${openDropdown === 'resources' ? 'active' : ''}`}
              onClick={() => {
                setOpenDropdown(openDropdown === 'resources' ? null : 'resources');
              }}
            >
              <span>Resources</span>
              {openDropdown === 'resources' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <AnimatePresence>
              {openDropdown === 'resources' && (
                <NavDropdown 
                  items={resourcesItems} 
                  width={230}
                  onSelect={(item) => {
                    setOpenDropdown(null);
                    onNavigate('dashboard', item);
                  }}
                  onMouseEnter={() => handleMouseEnter('resources')}
                  onMouseLeave={handleMouseLeave}
                />
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Right Button: Profile Pill */}
        <div className="nav-auth-container" style={{ position: 'relative' }}>
          <motion.button 
            className="nav-profile-pill-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="nav-profile-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="nav-profile-name">{user?.name?.split(' ')[0] || 'Profile'}</span>
            <ChevronDown size={14} />
          </motion.button>

          {/* User Profile Popover */}
          <AnimatePresence>
            {isProfileOpen && user && (
              <motion.div
                className="profile-popover-card"
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              >
                <div className="profile-popover-header">
                  <div className="popover-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="popover-name">{user.name}</div>
                    <div className="popover-email">{user.email}</div>
                  </div>
                </div>

                <div className="profile-popover-meta">
                  <div className="meta-badge">{user.department || 'Computer Science'}</div>
                  <div className="meta-badge">{user.year || '3rd Year'}</div>
                </div>

                <div className="profile-popover-divider"></div>

                <button 
                  className="popover-logout-btn"
                  onClick={() => {
                    setIsProfileOpen(false);
                    onLogout();
                  }}
                >
                  <LogOut01 size={16} />
                  <span>Log out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </nav>
  );
}
