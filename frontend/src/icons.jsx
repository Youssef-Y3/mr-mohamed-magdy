// ============================================================
// icons.jsx — Biology-themed SVG icons + generic icons
// ============================================================

// DNA helix icon (optional slow rotation)
function DnaIcon({ size = 24, className = '', animated = true, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         className={`${className} ${animated ? 'dna-spin' : ''}`}
         style={{ display: 'inline-block' }}>
      <path d="M7 2c0 4 10 4 10 8s-10 4-10 8 10 4 10 6" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M17 2c0 4-10 4-10 8s10 4 10 8-10 4-10 6" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <line x1="8"  y1="5"  x2="16" y2="5"  stroke={color} strokeWidth="1.4" opacity="0.7"/>
      <line x1="7"  y1="9"  x2="17" y2="9"  stroke={color} strokeWidth="1.4" opacity="0.7"/>
      <line x1="7"  y1="15" x2="17" y2="15" stroke={color} strokeWidth="1.4" opacity="0.7"/>
      <line x1="8"  y1="19" x2="16" y2="19" stroke={color} strokeWidth="1.4" opacity="0.7"/>
    </svg>
  );
}

// Cell (with nucleus) icon
function CellIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <defs>
        <radialGradient id="cellG" cx="0.35" cy="0.35">
          <stop offset="0" stopColor="#C4B5FD" />
          <stop offset="1" stopColor="#4338CA" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="9.5" fill="url(#cellG)" opacity="0.9"/>
      <circle cx="12" cy="12" r="9.5" fill="none" stroke="#4338CA" strokeWidth="1" opacity="0.4"/>
      <circle cx="12" cy="12" r="3.2" fill="#3730A3"/>
      <circle cx="12" cy="12" r="1.4" fill="#EEF0FF"/>
      {/* organelles */}
      <ellipse cx="7" cy="8" rx="1.4" ry="0.9" fill="#7C3AED" opacity="0.7"/>
      <ellipse cx="17" cy="15" rx="1.6" ry="1" fill="#7C3AED" opacity="0.7"/>
      <circle cx="8" cy="16" r="0.9" fill="#A78BFA"/>
      <circle cx="16" cy="7" r="0.7" fill="#A78BFA"/>
    </svg>
  );
}

// Molecule icon (nodes + bonds)
function MoleculeIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <line x1="6" y1="7" x2="12" y2="12" stroke="#7C3AED" strokeWidth="1.6"/>
      <line x1="12" y1="12" x2="18" y2="7" stroke="#7C3AED" strokeWidth="1.6"/>
      <line x1="12" y1="12" x2="12" y2="19" stroke="#7C3AED" strokeWidth="1.6"/>
      <line x1="6" y1="7" x2="12" y2="4" stroke="#7C3AED" strokeWidth="1.6" opacity="0.6"/>
      <circle cx="6"  cy="7"  r="2.4" fill="#4338CA"/>
      <circle cx="18" cy="7"  r="2.4" fill="#7C3AED"/>
      <circle cx="12" cy="12" r="2.8" fill="#A78BFA"/>
      <circle cx="12" cy="19" r="2.2" fill="#6D28D9"/>
      <circle cx="12" cy="4"  r="1.6" fill="#C4B5FD"/>
    </svg>
  );
}

// Leaf
function LeafIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none">
      <path d="M4 20c0-9 6-16 16-16 0 10-7 16-16 16z" fill="#10B981" opacity="0.85"/>
      <path d="M4 20 20 4" stroke="#065F46" strokeWidth="1.2"/>
    </svg>
  );
}

// Play / pause
const PlayIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M8 5v14l11-7z"/>
  </svg>
);
const PauseIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6 5h4v14H6zM14 5h4v14h-4z"/>
  </svg>
);
const HeartIcon = ({ size = 22, filled = false, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M12 21s-7-4.35-9.5-8.5C.5 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4 4.5 8.5C19 16.65 12 21 12 21z"/>
  </svg>
);
const BookmarkIcon = ({ size = 22, filled = false, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M6 4h12v17l-6-4-6 4z"/>
  </svg>
);
const ShareIcon = ({ size = 22, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <path d="m9 11 6-4M9 13l6 4"/>
  </svg>
);
const VolumeIcon = ({ size = 20, muted = false, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M5 9v6h4l5 4V5L9 9H5z"/>
    {!muted && <path d="M16 8c1.5 1 2 2.5 2 4s-.5 3-2 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>}
    {muted && <path d="M17 8l4 4m0-4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>}
  </svg>
);
const FullscreenIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>
  </svg>
);
const SunIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
  </svg>
);
const MoonIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const MenuIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
    <path d="M4 6h16M4 12h16M4 18h16"/>
  </svg>
);
const CloseIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
    <path d="M6 6l12 12M18 6L6 18"/>
  </svg>
);
const ArrowLeftIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);
const ArrowRightIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);
const CheckIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);
const UploadIcon = ({ size = 22, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
  </svg>
);
const CameraIcon = ({ size = 22, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);
const GoogleIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);
const SearchIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);
const ChevronDownIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
const TrashIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14"/>
  </svg>
);
const PlusIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" className={className}>
    <path d="M12 5v14M5 12h14"/>
  </svg>
);
const EyeIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const UsersIcon = ({ size = 22, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const WalletIcon = ({ size = 22, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/>
    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>
  </svg>
);
const FilmIcon = ({ size = 22, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="2.18"/>
    <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"/>
  </svg>
);
const BookIcon = ({ size = 22, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const ChartIcon = ({ size = 22, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 3v18h18M7 15l4-4 4 4 5-6"/>
  </svg>
);
const SettingsIcon = ({ size = 22, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const LogoutIcon = ({ size = 20, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
);
const HomeIcon = ({ size = 22, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <path d="M9 22V12h6v10"/>
  </svg>
);

Object.assign(window, {
  DnaIcon, CellIcon, MoleculeIcon, LeafIcon,
  PlayIcon, PauseIcon, HeartIcon, BookmarkIcon, ShareIcon,
  VolumeIcon, FullscreenIcon, SunIcon, MoonIcon,
  MenuIcon, CloseIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon,
  UploadIcon, CameraIcon, GoogleIcon, SearchIcon, ChevronDownIcon,
  TrashIcon, PlusIcon, EyeIcon, UsersIcon, WalletIcon, FilmIcon,
  BookIcon, ChartIcon, SettingsIcon, LogoutIcon, HomeIcon,
});
