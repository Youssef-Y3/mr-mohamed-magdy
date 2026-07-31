// ============================================================
// ui.jsx — shared UI: BlobBg, Particles, Loaders, Header, Layouts
// ============================================================

const M = window.Motion || {};
const motion = M.motion || {};
const AnimatePresence = M.AnimatePresence || (({ children }) => children);

// ---- Blob background (organic moving shapes) ----
function BlobBg({ dark = false, intensity = 1, className = '' }) {
  const opac = 0.35 * intensity;
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <div className="blob absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full"
           style={{ background: dark ? '#4338CA' : '#A5B4FC', opacity: opac, animationDelay: '0s' }}/>
      <div className="blob absolute top-1/3 -left-40 w-[600px] h-[600px] rounded-full"
           style={{ background: dark ? '#7C3AED' : '#C4B5FD', opacity: opac * 0.8, animationDelay: '-6s' }}/>
      <div className="blob absolute bottom-0 right-1/4 w-[480px] h-[480px] rounded-full"
           style={{ background: dark ? '#EC4899' : '#F0ABFC', opacity: opac * 0.55, animationDelay: '-12s' }}/>
      <div className="blob absolute top-10 right-1/3 w-[300px] h-[300px] rounded-full"
           style={{ background: dark ? '#22D3EE' : '#67E8F9', opacity: opac * 0.35, animationDelay: '-4s' }}/>
    </div>
  );
}

// ---- Floating particles (cells drifting up) ----
function Particles({ count = 24, dark = false }) {
  const particles = React.useMemo(() => Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 3 + Math.random() * 6,
    duration: 12 + Math.random() * 14,
    delay: -Math.random() * 20,
    drift: (Math.random() - 0.5) * 80,
    op: 0.25 + Math.random() * 0.35,
    color: Math.random() > 0.5 ? '#A78BFA' : '#7C3AED',
  })), [count]);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map(p => (
        <span key={p.id}
          className="particle absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: '-20px',
            width: p.size, height: p.size,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--drift': `${p.drift}px`,
            '--op': p.op,
            boxShadow: dark ? `0 0 ${p.size*2}px ${p.color}` : 'none',
          }}/>
      ))}
    </div>
  );
}

// ---- Cell-division loader ----
function CellLoader({ size = 40, label = '' }) {
  const s = size;
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center" style={{ width: s * 2, height: s }}>
        <span className="cell-a absolute rounded-full" style={{
          width: s, height: s, left: '50%', transform: 'translateX(-50%)',
          background: 'radial-gradient(circle at 30% 30%, #C4B5FD, #4338CA)',
          boxShadow: '0 4px 20px rgba(124,58,237,0.4)'
        }}/>
        <span className="cell-b absolute rounded-full" style={{
          width: s, height: s, left: '50%', transform: 'translateX(-50%)',
          background: 'radial-gradient(circle at 70% 30%, #F0ABFC, #7C3AED)',
          boxShadow: '0 4px 20px rgba(236,72,153,0.4)'
        }}/>
      </div>
      {label && <p className="text-sm text-brand-700 dark:text-brand-300 font-semibold">{label}</p>}
    </div>
  );
}

// ---- Section fade-in on scroll ----
function FadeIn({ children, delay = 0, y = 30, className = '' }) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>{children}</div>
  );
}

// ---- Confetti burst ----
function Confetti({ show }) {
  const dots = React.useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    angle: (Math.PI * 2 * i) / 40,
    dist: 80 + Math.random() * 180,
    color: ['#10B981','#7C3AED','#A78BFA','#F472B6','#FBBF24'][Math.floor(Math.random()*5)],
    size: 4 + Math.random() * 5,
    delay: Math.random() * 0.2,
  })), []);
  if (!show) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
      {dots.map(d => (
        <span key={d.id} className="confetti-dot absolute rounded-full"
          style={{
            width: d.size, height: d.size, background: d.color,
            boxShadow: `0 0 8px ${d.color}`,
            '--tx': `${Math.cos(d.angle) * d.dist}px`,
            '--ty': `${Math.sin(d.angle) * d.dist}px`,
            animationDelay: `${d.delay}s`,
          }}/>
      ))}
    </div>
  );
}

// ---- Header (public) ----
function Header({ light = true }) {
  const { user, role, logout } = useAuth();
  const tw = useTweaksCtx();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const route = useRoute();
  React.useEffect(() => { setMobileOpen(false); }, [route]);

  const links = [
    { to: '/',        label: 'الرئيسية' },
    { to: '/courses', label: 'الكورسات' },
  ];
  const dashLink = user ? (role === 'admin' ? { to: '/admin', label: 'لوحة المعلم' } : { to: '/dash', label: 'لوحتي' }) : null;

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors
      ${light ? 'bg-white/75 border-brand-100 dark:bg-ink-950/70 dark:border-brand-900/40'
              : 'bg-ink-950/70 border-brand-900/40'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-[72px] flex items-center justify-between gap-4">
        <a href="#/" className="flex items-center gap-3 group">
          <span className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br from-brand-700 to-violet2-600 shadow-brand text-white">
            <DnaIcon size={26} animated={false} color="#fff"/>
          </span>
          <div className="leading-tight">
            <div className="font-black text-lg md:text-xl text-brand-950 dark:text-white font-cairo">مستر محمد مجدي</div>
            <div className="text-[11px] md:text-xs text-brand-700 dark:text-violet2-400 font-semibold">الأحياء والعلوم المتكاملة</div>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <a key={l.to} href={`#${l.to}`}
              className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                route === l.to
                  ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/60 dark:text-white'
                  : 'text-ink-900/70 hover:bg-brand-50 dark:text-white/70 dark:hover:bg-brand-900/30'
              }`}>{l.label}</a>
          ))}
          {dashLink && (
            <a href={`#${dashLink.to}`}
              className="px-4 py-2 rounded-xl font-semibold text-ink-900/70 hover:bg-brand-50 dark:text-white/70 dark:hover:bg-brand-900/30">
              {dashLink.label}
            </a>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={() => tw.setTweak('darkMode', !tw.tweaks.darkMode)}
            className="w-10 h-10 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/40 dark:hover:bg-brand-900/60 text-brand-700 dark:text-violet2-300 flex items-center justify-center transition-colors"
            aria-label="تبديل الوضع">
            {tw.tweaks.darkMode ? <SunIcon/> : <MoonIcon/>}
          </button>

          {!user ? (
            <>
              <a href="#/login" className="hidden md:inline-flex btn-ghost !py-2 !px-4 whitespace-nowrap">دخول</a>
              <a href="#/register" className="btn-primary !py-2 !px-4 text-sm whitespace-nowrap">اشترك</a>
            </>
          ) : (
            <>
              <a href={dashLink.to === '/admin' ? '#/admin' : '#/dash'}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-800 dark:text-brand-200 font-semibold text-sm">
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-600 to-violet2-500 text-white flex items-center justify-center text-xs font-black">
                  {user.name ? user.name.charAt(0) : 'ط'}
                </span>
                <span className="max-w-[100px] truncate">{user.name || 'الطالب'}</span>
              </a>
              <button onClick={logout} className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center dark:bg-red-900/30" title="تسجيل خروج">
                <LogoutIcon/>
              </button>
            </>
          )}

          <button onClick={() => setMobileOpen(v => !v)}
            className="md:hidden w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-white flex items-center justify-center">
            {mobileOpen ? <CloseIcon/> : <MenuIcon/>}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-brand-100 dark:border-brand-900/40 bg-white dark:bg-ink-950">
            <div className="p-4 flex flex-col gap-2">
              {links.map(l => (
                <a key={l.to} href={`#${l.to}`}
                  className="px-4 py-3 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-800 dark:text-white font-semibold">
                  {l.label}
                </a>
              ))}
              {dashLink && <a href={`#${dashLink.to}`} className="px-4 py-3 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-800 dark:text-white font-semibold">{dashLink.label}</a>}
              {!user && <a href="#/login" className="px-4 py-3 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-800 dark:text-white font-semibold">تسجيل الدخول</a>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ---- Footer ----
function Footer() {
  return (
    <footer className="mt-auto border-t border-brand-100 dark:border-brand-900/40 py-8 px-4 md:px-6 text-center relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-brand-700 to-violet2-600">
            <DnaIcon size={20} animated={false} color="#fff"/>
          </span>
          <span className="font-bold text-brand-950 dark:text-white">مستر محمد مجدي © 2026</span>
        </div>
        <div className="text-sm text-ink-900/60 dark:text-white/50">
          منصة تعليمية متخصصة في الأحياء والعلوم المتكاملة — أولى وتالتة ثانوي (عام / أزهر)
        </div>
      </div>
    </footer>
  );
}

// ---- Section title ----
function SectionTitle({ eyebrow, title, sub, center = false }) {
  return (
    <FadeIn>
      <div className={`mb-10 ${center ? 'text-center' : ''}`}>
        {eyebrow && (
          <span className="inline-block px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-800 dark:text-brand-200 font-bold text-xs mb-4">
            {eyebrow}
          </span>
        )}
        <h2 className="text-3xl md:text-4xl font-black text-brand-950 dark:text-white font-cairo leading-tight">{title}</h2>
        {sub && <p className="mt-3 text-ink-900/60 dark:text-white/60 text-base md:text-lg max-w-2xl">{sub}</p>}
      </div>
    </FadeIn>
  );
}

// ---- Modal ----
function Modal({ open, onClose, title, children, size = 'md' }) {
  React.useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-ink-950/70 backdrop-blur-sm"
          onClick={onClose}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            onClick={e => e.stopPropagation()}
            className={`w-full ${sizes[size]} bg-white dark:bg-ink-900 rounded-3xl shadow-brand overflow-hidden max-h-[90vh] flex flex-col`}>
            {title && (
              <div className="flex items-center justify-between p-5 border-b border-brand-100 dark:border-brand-900/40">
                <h3 className="text-xl font-black text-brand-950 dark:text-white">{title}</h3>
                <button onClick={onClose} className="w-9 h-9 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/40 flex items-center justify-center text-ink-900 dark:text-white">
                  <CloseIcon size={20}/>
                </button>
              </div>
            )}
            <div className="overflow-y-auto p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---- Tweaks context ----
const TweaksCtx = React.createContext(null);
function TweaksProvider({ children }) {
  const [tweaks, setTweaksState] = React.useState(() => {
    const stored = store.get('tweaks_local');
    return { ...window.TWEAK_DEFAULTS, ...(stored || {}) };
  });
  const setTweak = React.useCallback((k, v) => {
    setTweaksState(prev => {
      const next = typeof k === 'object' ? { ...prev, ...k } : { ...prev, [k]: v };
      store.set('tweaks_local', next);
      try {
        window.parent.postMessage({ type: '__edit_mode_set_keys', edits: typeof k === 'object' ? k : { [k]: v } }, '*');
      } catch {}
      return next;
    });
  }, []);
  // apply dark mode
  React.useEffect(() => {
    if (tweaks.darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [tweaks.darkMode]);
  // apply palette variables
  React.useEffect(() => {
    const p = PALETTES[tweaks.palette] || PALETTES[0];
    const r = document.documentElement.style;
    r.setProperty('--brand-start', p.start);
    r.setProperty('--brand-mid', p.mid);
    r.setProperty('--brand-end', p.end);
  }, [tweaks.palette]);
  return <TweaksCtx.Provider value={{ tweaks, setTweak }}>{children}</TweaksCtx.Provider>;
}
const useTweaksCtx = () => React.useContext(TweaksCtx);

// ---- Tweaks Panel (visible when host toggle activates) ----
function AppTweaksPanel() {
  const { tweaks, setTweak } = useTweaksCtx();
  const T = window.TweaksPanel;
  const S = window.TweakSection;
  const R = window.TweakRadio;
  const Sw = window.TweakToggle;
  const Sel = window.TweakSelect;
  const Col = window.TweakColor;
  if (!T) return null;
  return (
    <T title="Tweaks — إعدادات التصميم">
      <S title="الوضع والألوان">
        <Sw label="Dark Mode" value={tweaks.darkMode} onChange={v => setTweak('darkMode', v)}/>
        <Sel
          label="لوحة الألوان"
          value={tweaks.palette}
          options={PALETTES.map((p, i) => ({ value: i, label: p.name }))}
          onChange={v => setTweak('palette', Number(v))}/>
      </S>
      <S title="الأنيميشن">
        <R
          label="كثافة الأنيميشن"
          value={tweaks.animIntensity}
          options={ANIM_LEVELS.map(a => ({ value: a.key, label: a.name }))}
          onChange={v => setTweak('animIntensity', Number(v))}/>
        <Sw label="جسيمات عائمة" value={tweaks.particlesOn} onChange={v => setTweak('particlesOn', v)}/>
      </S>
      <S title="المحتوى">
        <R
          label="نص عن المعلم"
          value={tweaks.aboutDraft}
          options={ABOUT_DRAFTS.map((d, i) => ({ value: i, label: `#${i+1}` }))}
          onChange={v => setTweak('aboutDraft', Number(v))}/>
        <Sw label="بيانات وهمية (Demo)" value={tweaks.sampleData} onChange={v => setTweak('sampleData', v)}/>
      </S>
      <S title="الـ Hero">
        <R
          label="شكل الـ Hero"
          value={tweaks.heroStyle}
          options={[
            { value: 0, label: 'صورة + نص' },
            { value: 1, label: 'مركزي' },
          ]}
          onChange={v => setTweak('heroStyle', Number(v))}/>
      </S>
    </T>
  );
}

// ---- Empty state ----
function EmptyState({ icon, title, sub, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-100 to-violet2-100 dark:from-brand-900/40 dark:to-violet2-900/40 flex items-center justify-center mb-5 shadow-soft">
        {icon || <CellIcon size={48}/>}
      </div>
      <h3 className="text-xl font-black text-brand-950 dark:text-white mb-2">{title}</h3>
      {sub && <p className="text-ink-900/60 dark:text-white/60 max-w-md mb-6">{sub}</p>}
      {action}
    </div>
  );
}

// ---- Skeleton ----
function SkeletonCard() {
  return (
    <div className="rounded-3xl p-4 bg-white dark:bg-ink-900 shadow-soft border border-brand-100 dark:border-brand-900/40">
      <div className="sk h-40 w-full mb-4"/>
      <div className="sk h-5 w-3/4 mb-2"/>
      <div className="sk h-4 w-1/2"/>
    </div>
  );
}

Object.assign(window, {
  BlobBg, Particles, CellLoader, FadeIn, Confetti,
  Header, Footer, SectionTitle, Modal,
  TweaksCtx, TweaksProvider, useTweaksCtx, AppTweaksPanel,
  EmptyState, SkeletonCard,
});
