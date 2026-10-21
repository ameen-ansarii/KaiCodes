import React from 'react';

// First avatar (between "chat" and "rooms") - Lavender circle with friendly illustrated character with round glasses
export function AvatarOne({ className = '', size = 52 }) {
  return (
    <span
      className={`inline-avatar avatar-lavender ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: '#dbe4ff',
        verticalAlign: 'middle',
        overflow: 'hidden',
        boxShadow: '0 2px 6px rgba(100, 116, 139, 0.12)',
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="50" fill="#dbe4ff" />
        
        {/* Hair back */}
        <path d="M30 46 C28 32, 40 22, 54 22 C68 22, 74 32, 72 46 Z" fill="#1e1e24" />
        
        {/* Face */}
        <ellipse cx="50" cy="48" rx="16" ry="17" fill="#fff" stroke="#1e1e24" strokeWidth="2.4" />
        
        {/* Hair bangs */}
        <path d="M36 34 C44 30, 56 30, 64 36 C60 33, 48 33, 36 34 Z" fill="#1e1e24" />
        
        {/* Glasses */}
        <circle cx="43" cy="46" r="5.5" stroke="#1e1e24" strokeWidth="2.2" fill="none" />
        <circle cx="57" cy="46" r="5.5" stroke="#1e1e24" strokeWidth="2.2" fill="none" />
        <line x1="48.5" y1="46" x2="51.5" y2="46" stroke="#1e1e24" strokeWidth="2.2" />
        
        {/* Eyes inside glasses */}
        <circle cx="43" cy="46" r="1.5" fill="#1e1e24" />
        <circle cx="57" cy="46" r="1.5" fill="#1e1e24" />
        
        {/* Smile */}
        <path d="M46 56 Q50 60 54 56" stroke="#1e1e24" strokeWidth="2" strokeLinecap="round" fill="none" />
        
        {/* Neck */}
        <rect x="46" y="63" width="8" height="6" fill="#fff" stroke="#1e1e24" strokeWidth="2" />
        
        {/* Turtleneck / Sweater */}
        <path d="M32 82 C34 70, 42 66, 50 66 C58 66, 66 70, 68 82 L72 100 L28 100 Z" fill="#ffffff" stroke="#1e1e24" strokeWidth="2.4" />
        
        {/* Collar lines */}
        <path d="M43 68 Q50 72 57 68" stroke="#1e1e24" strokeWidth="2" fill="none" />
        <path d="M50 72 L50 94" stroke="#1e1e24" strokeWidth="1.8" strokeDasharray="3 3" />
      </svg>
    </span>
  );
}

// Second avatar (after "valuable") - Mint green circle with two illustrated friends smiling
export function AvatarTwo({ className = '', size = 52 }) {
  return (
    <span
      className={`inline-avatar avatar-mint ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: '#d1fae5',
        verticalAlign: 'middle',
        overflow: 'hidden',
        boxShadow: '0 2px 6px rgba(16, 185, 129, 0.12)',
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="50" fill="#d1fae5" />
        
        {/* Character 1 (Left - Dark shirt, shoulder tilt) */}
        {/* Hair */}
        <path d="M22 45 C20 32, 32 24, 44 26 C48 30, 48 38, 46 48 Z" fill="#18181b" />
        {/* Face */}
        <ellipse cx="36" cy="46" rx="11" ry="12" fill="#fff" stroke="#18181b" strokeWidth="2.2" />
        {/* Eyes & Smile */}
        <circle cx="32" cy="45" r="1.3" fill="#18181b" />
        <circle cx="40" cy="45" r="1.3" fill="#18181b" />
        <path d="M34 52 Q36 55 39 52" stroke="#18181b" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Body (Dark) */}
        <path d="M16 84 C18 68, 28 62, 38 62 C46 62, 50 67, 52 84 L54 100 L12 100 Z" fill="#18181b" />

        {/* Character 2 (Right - White sweater, hugging / posing close) */}
        {/* Hair */}
        <path d="M54 36 C56 26, 68 24, 76 30 C82 35, 80 46, 78 50 Z" fill="#27272a" />
        {/* Face */}
        <ellipse cx="64" cy="48" rx="11" ry="12" fill="#fff" stroke="#18181b" strokeWidth="2.2" />
        {/* Glasses/Eyes */}
        <circle cx="60" cy="47" r="1.3" fill="#18181b" />
        <circle cx="68" cy="47" r="1.3" fill="#18181b" />
        <path d="M62 53 Q64 56 67 53" stroke="#18181b" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Body (White shirt) */}
        <path d="M48 84 C50 68, 58 64, 68 64 C78 64, 86 68, 88 84 L92 100 L44 100 Z" fill="#ffffff" stroke="#18181b" strokeWidth="2.2" />
        <path d="M68 64 L68 76" stroke="#18181b" strokeWidth="1.6" />
      </svg>
    </span>
  );
}

// Official Apple SVG Logo
export function AppleLogo({ size = 18, color = 'currentColor', className = '' }) {
  return (
    <svg
      width={size}
      height={size * 1.22}
      viewBox="0 0 170 170"
      fill={color}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.75-11.64-14.13-6.41-9.9-11.25-20.91-14.52-33.02-3.27-12.11-4.9-23.75-4.9-34.92 0-14.7 3.8-26.79 11.41-36.27 7.61-9.48 17.18-14.28 28.71-14.42 4.58 0 10.16 1.25 16.74 3.75 6.58 2.5 10.74 3.75 12.5 3.75 1.53 0 5.9-1.33 13.1-4 7.21-2.67 13.06-3.89 17.55-3.67 13.05.65 23.49 5.38 31.33 14.19-11.33 6.85-16.89 16.32-16.68 28.42.21 9.47 3.83 17.47 10.85 24 7.02 6.53 15.22 10.12 24.6 10.77-2.17 6.53-4.78 13.05-7.83 19.57zM119.22 31.84c0-7.72 2.76-14.99 8.28-21.81 5.52-6.82 12.39-10.78 20.61-11.88.22 1.09.33 2.18.33 3.27 0 7.61-2.9 14.93-8.71 21.96-5.81 7.03-12.87 11.05-21.18 12.06-.21-1.2-.33-2.4-.33-3.6z" />
    </svg>
  );
}
