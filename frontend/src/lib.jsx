// ============================================================
// lib.jsx — helpers, API client, auth, router, contexts
// ============================================================

const { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } = React;

const API_BASE = window.API_BASE;

// ---- Palettes ----
const PALETTES = [
  { name: 'كحلي بنفسجي', start: '#4338CA', mid: '#6D28D9', end: '#A78BFA' },
  { name: 'بنفسجي وردي', start: '#5B21B6', mid: '#8B5CF6', end: '#EC4899' },
  { name: 'أزرق نيون',   start: '#1E40AF', mid: '#4F46E5', end: '#22D3EE' },
  { name: 'بنفسجي ملكي',  start: '#312E81', mid: '#6D28D9', end: '#F472B6' },
];

// ---- About drafts ----
const ABOUT_DRAFTS = [
  {
    title: 'هتحب الأحياء غصب عنك',
    body: 'يا صاحبي، الأحياء مش مادة حفظ أعمى. عندنا هنا بنكسر المادة مع بعض، بنحوّل الجدول الطويل لقصة، والفهرس لخريطة، والمصطلح الصعب لصورة مش هتنساها. اللي بيخرج من الحصة عارف قال إيه وليه، مش بس حافظه. اركب معايا، وهتلاقي نفسك بتحب اللي كنت هارب منه.',
  },
  {
    title: 'طريقة شرح بتخلي الأحياء منطقية',
    body: 'الأحياء عندي مش موضوعات متفرّقة، دي منظومة واحدة كل حاجة فيها بتفسر التانية. أسلوبي بيربط النقطة بالنقطة، بيبسّط المصطلح، ويحطّه في سياق حقيقي تفتكره وقت الامتحان. طلابي بيوصلوا لأعلى الدرجات مش صدفة، ده نتيجة طريقة مدروسة كل خطوة فيها ليها هدف.',
  },
  {
    title: 'من أول درس شرحته لحد النهارده',
    body: 'بدأت أدرّس علشان لقيت في نفسي إن أنا فاهم إزاي دماغ الطالب بتشتغل، مش بس فاهم المادة. مع الوقت طوّرت طريقة شرح خاصة، فيها طاقة وحماس، وفيها احترام لعقل الطالب. النهارده معايا آلاف الطلاب، وكل واحد منهم بيحس إن الحصة معمولة ليه هو بالذات.',
  },
];

// ---- Anim presets ----
const ANIM_LEVELS = [
  { key: 0, name: 'خفيف',   duration: 0.25, spring: { stiffness: 260, damping: 26 }, blobs: 0.35, particles: 12 },
  { key: 1, name: 'متوسط',  duration: 0.35, spring: { stiffness: 220, damping: 22 }, blobs: 0.55, particles: 24 },
  { key: 2, name: 'حماسي',  duration: 0.45, spring: { stiffness: 180, damping: 18 }, blobs: 0.75, particles: 40 },
];

// ---- Storage helpers ----
const store = {
  get: (k, def = null) => {
    try { const v = localStorage.getItem(k); return v === null ? def : JSON.parse(v); }
    catch { return def; }
  },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del: (k) => { try { localStorage.removeItem(k); } catch {} },
};

// ---- API client ----
async function apiFetch(path, opts = {}) {
  const token = store.get('token');
  const headers = { ...(opts.headers || {}) };
  if (!(opts.body instanceof FormData) && opts.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (token && !opts.noAuth) headers['Authorization'] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...opts,
      headers,
      body: opts.body && typeof opts.body === 'object' && !(opts.body instanceof FormData)
        ? JSON.stringify(opts.body)
        : opts.body,
    });
  } catch (e) {
    throw { network: true, message: 'تعذّر الاتصال بالسيرفر. تأكد من الإنترنت وحاول مرة تانية.' };
  }

  const contentType = res.headers.get('content-type') || '';
  let data;
  if (contentType.includes('application/json')) {
    try { data = await res.json(); } catch { data = null; }
  } else {
    data = await res.text();
  }

  if (res.status === 401 && !opts.noAuth) {
    store.del('token');
    store.del('user');
    store.del('role');
    if (!location.hash.includes('/login') && !location.hash.includes('/admin/login')) {
      window.dispatchEvent(new CustomEvent('auth-expired'));
    }
    throw { status: 401, message: 'الجلسة انتهت. من فضلك سجّل الدخول من جديد.', data };
  }
  if (res.status === 402) {
    window.dispatchEvent(new CustomEvent('subscription-required'));
    throw { status: 402, message: 'محتاج اشتراك فعّال عشان تدخل الدرس ده.', data };
  }
  if (!res.ok) {
    throw { status: res.status, message: (data && data.error) || (data && data.message) || `خطأ ${res.status}`, data };
  }
  return data;
}

// Fetch video Blob with progress + 45s timeout
async function fetchVideoBlob(lessonId, onProgress, timeoutMs = 45000) {
  const token = store.get('token');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort('timeout'), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}/api/stream/video/${lessonId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
      signal: controller.signal,
    });
    if (!res.ok) {
      if (res.status === 401) throw { status: 401, message: 'الجلسة انتهت.' };
      if (res.status === 402) throw { status: 402, message: 'محتاج اشتراك فعّال.' };
      throw { status: res.status, message: `خطأ في تحميل الفيديو (${res.status})` };
    }
    const total = parseInt(res.headers.get('content-length') || '0', 10);
    const reader = res.body.getReader();
    const chunks = [];
    let received = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      if (total && onProgress) onProgress(Math.round((received / total) * 100));
      else if (onProgress) onProgress(-1); // indeterminate
    }
    clearTimeout(timer);
    return new Blob(chunks, { type: res.headers.get('content-type') || 'video/mp4' });
  } catch (e) {
    clearTimeout(timer);
    if (e.name === 'AbortError' || e === 'timeout') {
      throw { timeout: true, message: 'التحميل استغرق وقت طويل. حاول تاني من فضلك.' };
    }
    throw e;
  }
}

// ---- Router (hash-based, RTL friendly) ----
function useRoute() {
  const [route, setRoute] = useState(() => location.hash.slice(1) || '/');
  useEffect(() => {
    const onHash = () => setRoute(location.hash.slice(1) || '/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
}
function navigate(to, replace = false) {
  if (replace) location.replace('#' + to);
  else location.hash = to;
}
function matchRoute(pattern, path) {
  const pParts = pattern.split('/').filter(Boolean);
  const rParts = path.split('/').filter(Boolean);
  if (pParts.length !== rParts.length) return null;
  const params = {};
  for (let i = 0; i < pParts.length; i++) {
    if (pParts[i].startsWith(':')) params[pParts[i].slice(1)] = decodeURIComponent(rParts[i]);
    else if (pParts[i] !== rParts[i]) return null;
  }
  return params;
}

// ---- Auth context ----
const AuthContext = createContext(null);
function AuthProvider({ children }) {
  const [token, setToken]   = useState(() => store.get('token'));
  const [user, setUser]     = useState(() => store.get('user'));
  const [role, setRole]     = useState(() => store.get('role', 'student'));
  const login = useCallback((t, u, r = 'student') => {
    store.set('token', t); store.set('user', u); store.set('role', r);
    setToken(t); setUser(u); setRole(r);
  }, []);
  const logout = useCallback(() => {
    store.del('token'); store.del('user'); store.del('role');
    setToken(null); setUser(null); setRole('student');
    navigate('/');
  }, []);
  useEffect(() => {
    const onExpired = () => { logout(); navigate('/login'); };
    window.addEventListener('auth-expired', onExpired);
    return () => window.removeEventListener('auth-expired', onExpired);
  }, [logout]);
  return (
    <AuthContext.Provider value={{ token, user, role, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
const useAuth = () => useContext(AuthContext);

// ---- Toast ----
const ToastContext = createContext(null);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = 'info', dur = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), dur);
  }, []);
  const M = window.Motion || {};
  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none">
        {M.AnimatePresence && (
          <M.AnimatePresence>
            {toasts.map(t => (
              <M.motion.div
                key={t.id}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className={`px-5 py-3 rounded-2xl shadow-brand font-semibold text-sm pointer-events-auto
                  ${t.type === 'error' ? 'bg-red-500 text-white'
                    : t.type === 'success' ? 'bg-emerald-500 text-white'
                    : 'bg-brand-700 text-white'}`}
              >
                {t.msg}
              </M.motion.div>
            ))}
          </M.AnimatePresence>
        )}
      </div>
    </ToastContext.Provider>
  );
}
const useToast = () => useContext(ToastContext) || { show: () => {} };

// ---- Format helpers ----
const fmtMoney = (n) => new Intl.NumberFormat('ar-EG').format(Math.round(n || 0)) + ' ج.م';
const fmtNum   = (n) => new Intl.NumberFormat('ar-EG').format(n || 0);
const fmtTime  = (s) => {
  if (!s || isNaN(s)) return '00:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
};
const gradeName = (g) => g === 'first' ? 'أولى ثانوي' : g === 'third' ? 'تالتة ثانوي' : g;

// ---- Global exports ----
Object.assign(window, {
  API_BASE, PALETTES, ABOUT_DRAFTS, ANIM_LEVELS,
  store, apiFetch, fetchVideoBlob,
  useRoute, navigate, matchRoute,
  AuthContext, AuthProvider, useAuth,
  ToastContext, ToastProvider, useToast,
  fmtMoney, fmtNum, fmtTime, gradeName,
});
