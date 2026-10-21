import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from '@untitledui/icons';

export default function NavDropdown({ 
  items, 
  onSelect, 
  onMouseEnter, 
  onMouseLeave,
  width = 240,
  maxHeight = 420
}) {
  return (
    <motion.div
      className="soft-dropdown-card"
      style={{ width: `${width}px`, maxHeight: `${maxHeight}px` }}
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 480, damping: 28 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="simple-dropdown-list">
        {items.map((item, idx) => {
          const title = typeof item === 'string' ? item : item.title;
          const subtitle = typeof item === 'object' ? item.subtitle : null;

          return (
            <motion.div
              key={idx}
              className="simple-dropdown-item"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.15 }}
              onClick={() => onSelect(title)}
            >
              <div className="dropdown-item-content">
                <span className="simple-dropdown-text">{title}</span>
                {subtitle && <span className="simple-dropdown-sub">{subtitle}</span>}
              </div>
              <ChevronRight size={13} className="item-arrow-hint" />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
