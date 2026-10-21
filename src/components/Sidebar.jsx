import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutLeft, 
  ChevronDown, 
  ChevronRight, 
  SearchLg, 
  FolderClosed, 
  Folder, 
  LogOut01
} from '@untitledui/icons';
import { SEMESTER_DATA } from '../data/muSyllabusData';

// Spiral brand icon
function BrandSpiralIcon({ size = 24 }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
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

export default function Sidebar({
  user,
  activeSubjectId,
  activeModuleId,
  onSelectSubject,
  onSelectModule,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) {
  const [expandedSubjects, setExpandedSubjects] = useState({ [activeSubjectId || 'cn']: true });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSubject = (subjectId) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subjectId]: !prev[subjectId]
    }));
    onSelectSubject(subjectId);
  };

  const filteredSubjects = SEMESTER_DATA.subjects.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.modules.some(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sidebarContent = (
    <div className={`sidebar-inner-container ${isCollapsed ? 'is-collapsed' : 'is-expanded'}`}>
      
      {/* 1. Header with Brand & Collapse Button */}
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="sidebar-brand-group">
            <BrandSpiralIcon size={26} />
            <div className="brand-text-stack">
              <span className="brand-title">MU Syllabus</span>
              <span className="brand-sub">Sem V • AI & ML</span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="collapsed-brand-center" title="MU Syllabus • Sem V">
            <BrandSpiralIcon size={28} />
          </div>
        )}

        {/* Toggle Collapse Button */}
        <button
          className="sidebar-toggle-btn"
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label="Toggle Sidebar"
        >
          <LayoutLeft size={18} />
        </button>
      </div>

      {/* 2. Quick Search (Hidden when collapsed) */}
      {!isCollapsed && (
        <div className="sidebar-search-box">
          <SearchLg size={15} className="sidebar-search-icon" />
          <input
            type="text"
            className="sidebar-search-input"
            placeholder="Search syllabus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* 3. Subjects & Modules Navigation Tree */}
      <div className="sidebar-nav-scroll">
        {!isCollapsed && (
          <div className="sidebar-section-label">
            <span>SEMESTER V SUBJECTS</span>
          </div>
        )}

        <div className="sidebar-subjects-list">
          {filteredSubjects.map((subject) => {
            const isSubjectActive = activeSubjectId === subject.id;
            const isSubjectExpanded = expandedSubjects[subject.id];

            return (
              <div key={subject.id} className="sidebar-subject-group">
                
                {/* Subject Header Item */}
                <button
                  className={`sidebar-subject-item ${isSubjectActive ? 'active-subject' : ''}`}
                  onClick={() => {
                    if (isCollapsed) {
                      onToggleCollapse(); // expand when clicking icon in collapsed mode
                    }
                    toggleSubject(subject.id);
                  }}
                  title={isCollapsed ? `${subject.name} (${subject.shortName})` : ''}
                >
                  <div className="subject-item-left">
                    {isSubjectExpanded ? (
                      <Folder size={18} className="subject-folder-icon open" />
                    ) : (
                      <FolderClosed size={18} className="subject-folder-icon" />
                    )}
                    {!isCollapsed && (
                      <div className="subject-text-meta">
                        <span className="subject-title">{subject.shortName}</span>
                        <span className="subject-full-title">{subject.name}</span>
                      </div>
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className="subject-item-right">
                      <span className="module-count-badge">{subject.modules.length}</span>
                      {isSubjectExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                  )}
                </button>

                {/* Sub-tree: Modules (1 to 6) - strictly limited to module level in sidebar */}
                <AnimatePresence>
                  {!isCollapsed && isSubjectExpanded && (
                    <motion.div
                      className="sidebar-modules-sublist"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                      {subject.modules.map((mod) => {
                        const isModuleActive = isSubjectActive && activeModuleId === mod.id;

                        return (
                          <button
                            key={mod.id}
                            className={`sidebar-module-item ${isModuleActive ? 'active-module' : ''}`}
                            onClick={() => {
                              onSelectSubject(subject.id);
                              onSelectModule(mod.id);
                              if (onCloseMobile) onCloseMobile();
                            }}
                          >
                            <span className="module-num">{mod.number}</span>
                            <span className="module-title">{mod.title}</span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom User Profile Card */}
      <div className="sidebar-footer">
        <div className="sidebar-profile-card">
          <div className="sidebar-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          {!isCollapsed && (
            <div className="sidebar-profile-info">
              <span className="profile-name">{user?.name || 'Student'}</span>
              <span className="profile-role">
                {user?.year ? `${user.year} • ${user.department || 'Engineering'}` : (user?.department || 'Sem V • AI & ML')}
              </span>
            </div>
          )}
          {!isCollapsed && (
            <button 
              className="sidebar-logout-btn" 
              onClick={onLogout} 
              title="Log out"
              aria-label="Log out"
            >
              <LogOut01 size={16} />
            </button>
          )}
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className={`desktop-sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="mobile-drawer-portal">
            <motion.div
              className="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
            />
            <motion.aside
              className="mobile-sidebar-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
