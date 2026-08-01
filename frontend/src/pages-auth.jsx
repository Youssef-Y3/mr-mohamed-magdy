// ============================================================
// pages-auth.jsx — Login, Register, Google, Complete Profile, Admin Login
// ============================================================

const motionA = (window.Motion && window.Motion.motion) || {};

// ---- Google button (shared) ----
function GoogleButton({ onSuccess, onError }) {
  const btnRef = React.useRef(null);
  const [rendered, setRendered] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    function tryInit() {
      if (cancelled) return;
      if (window.google && window.google.accounts && window.google.accounts.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: window.GOOGLE_CLIENT_ID,
            callback: async (res) => {
              try {
                const data = await apiFetch('/api/auth/google', {
                  method: 'POST', noAuth: true,
                  body: { id_token: res.credential },
                });
                onSuccess && onSuccess(data);
              } catch (e) {
                onError && onError(e.message || 'فشل الدخول بجوجل');
              }
            },
          });
          if (btnRef.current) {
            window.google.accounts.id.renderButton(btnRef.current, {
              theme: 'outline', size: 'large', width: 320, locale: 'ar', shape: 'pill',
            });
            setRendered(true);
          }
        } catch (e) { /* placeholder client id */ }
      } else {
        setTimeout(tryInit, 400);
      }
    }
    tryInit();
    return () => { cancelled = true; };
  }, []);

  // Fallback custom button when Google SDK / client_id not ready
  return (
    <div className="flex flex-col items-center gap-3">
      <div ref={btnRef} className={rendered ? '' : 'hidden'}/>
      {!rendered && (
        <button
          type="button"
          onClick={() => onError && onError('لازم تحط Google Client ID في الإعدادات الأول.')}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-2xl bg-white border-2 border-brand-100 hover:border-brand-300 dark:bg-ink-900 dark:border-brand-900/50 text-ink-900 dark:text-white font-bold transition-all">
          <GoogleIcon size={22}/>
          <span>المتابعة بحساب جوجل</span>
        </button>
      )}
    </div>
  );
}

// ---- Divider ----
function OrDivider() {
  return (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-brand-100 dark:bg-brand-900/50"/>
      <span className="text-xs font-black text-ink-900/40 dark:text-white/40">أو</span>
      <div className="flex-1 h-px bg-brand-100 dark:bg-brand-900/50"/>
    </div>
  );
}

// ---- Auth shell (glass card + blobs + particles) ----
function AuthShell({ title, subtitle, children, footer }) {
  const { tweaks } = useTweaksCtx();
  return (
    <div className="relative flex-1 flex items-center justify-center py-10 md:py-16 px-4">
      <BlobBg dark={tweaks.darkMode} intensity={0.5}/>
      {tweaks.particlesOn && <Particles count={20} dark={tweaks.darkMode}/>}
      <div className="relative w-full max-w-md">
        <div className="glass-light dark:glass-dark rounded-[2rem] p-6 md:p-8 shadow-brand">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-700 to-violet2-600 flex items-center justify-center shadow-brand">
              <DnaIcon size={32} animated={true} color="#fff"/>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-brand-950 dark:text-white font-cairo">{title}</h1>
            {subtitle && <p className="text-sm text-ink-900/60 dark:text-white/60 mt-2">{subtitle}</p>}
          </div>
          {children}
        </div>
        {footer && <div className="text-center mt-4 text-sm text-ink-900/60 dark:text-white/60">{footer}</div>}
      </div>
    </div>
  );
}

// ---- Login ----
function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const [form, setForm] = React.useState({ username: '', password: '' });
  const [busy, setBusy] = React.useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST', noAuth: true, body: form,
      });
      login(data.token, data.student || { name: form.username, username: form.username }, 'student');
      toast.show('أهلاً بك من جديد!', 'success');
      navigate('/dash');
    } catch (e) {
      toast.show(e.message || 'بيانات الدخول غير صحيحة', 'error');
    } finally { setBusy(false); }
  };

  const onGoogle = (data) => {
    login(data.token, data.student, 'student');
    if (data.needs_grade) navigate('/complete-profile');
    else navigate('/dash');
  };

  return (
    <AuthShell
      title="تسجيل الدخول"
      subtitle="أهلاً بك تاني، هنكمّل من فين وقفت"
      footer={<>مالكش حساب؟ <a href="#/register" className="text-brand-700 dark:text-brand-300 font-bold">سجّل دلوقتي</a></>}
    >
      <GoogleButton onSuccess={onGoogle} onError={(msg) => toast.show(msg, 'error')}/>
      <OrDivider/>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-sm font-bold text-ink-900/70 dark:text-white/70 mb-1.5 block">اسم المستخدم</label>
          <input required className="field" value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="username"/>
        </div>
        <div>
          <label className="text-sm font-bold text-ink-900/70 dark:text-white/70 mb-1.5 block">كلمة السر</label>
          <input required type="password" className="field" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••"/>
        </div>
        <button disabled={busy} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
          {busy ? <><CellLoader size={20}/> جاري الدخول...</> : 'دخول'}
        </button>
        <div className="text-center text-xs text-ink-900/50 dark:text-white/40">
          <a href="#/admin/login" className="hover:text-brand-700 dark:hover:text-brand-300">دخول المعلم</a>
        </div>
      </form>
    </AuthShell>
  );
}

// ---- Register ----
// NOTE: grade values below must match the backend's VALID_GRADES exactly
// (see auth.js / admin.js / google-auth.js / courses.js) — those use the
// Arabic labels 'اولي ثانوي' / 'تالته ثانوي'. Previously this sent
// 'first' / 'third', which the backend always rejected with
// "الصف الدراسي غير صالح", and — even when a value did slip through —
// never matched course.grade, leaving students with zero visible courses.
function RegisterPage() {
  const { login } = useAuth();
  const toast = useToast();
  const [form, setForm] = React.useState({ username: '', password: '', name: '', grade: 'اولي ثانوي' });
  const [busy, setBusy] = React.useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await apiFetch('/api/auth/register', {
        method: 'POST', noAuth: true, body: form,
      });
      // If register returns token/student, log in directly
      if (data.token) {
        login(data.token, data.student || { name: form.name, username: form.username, grade: form.grade }, 'student');
        toast.show('اتسجّلت بنجاح — أهلاً بك!', 'success');
        navigate('/dash');
      } else {
        toast.show('اتسجّلت بنجاح — سجّل دخولك دلوقتي', 'success');
        navigate('/login');
      }
    } catch (e) {
      toast.show(e.message || 'حصل خطأ في التسجيل', 'error');
    } finally { setBusy(false); }
  };

  const onGoogle = (data) => {
    login(data.token, data.student, 'student');
    if (data.needs_grade) navigate('/complete-profile');
    else navigate('/dash');
  };

  return (
    <AuthShell
      title="حساب جديد"
      subtitle="خمس ثواني، ودخلت"
      footer={<>عندك حساب؟ <a href="#/login" className="text-brand-700 dark:text-brand-300 font-bold">دخول</a></>}
    >
      <GoogleButton onSuccess={onGoogle} onError={(msg) => toast.show(msg, 'error')}/>
      <OrDivider/>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-sm font-bold text-ink-900/70 dark:text-white/70 mb-1.5 block">اسمك بالكامل</label>
          <input required className="field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="محمد أحمد علي"/>
        </div>
        <div>
          <label className="text-sm font-bold text-ink-900/70 dark:text-white/70 mb-1.5 block">اسم المستخدم</label>
          <input required className="field" value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="mohamed_ahmed"/>
        </div>
        <div>
          <label className="text-sm font-bold text-ink-900/70 dark:text-white/70 mb-1.5 block">كلمة السر</label>
          <input required type="password" minLength={6} className="field" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="على الأقل 6 حروف"/>
        </div>
        <div>
          <label className="text-sm font-bold text-ink-900/70 dark:text-white/70 mb-1.5 block">صفك الدراسي</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { v: 'اولي ثانوي', l: 'أولى ثانوي' },
              { v: 'تالته ثانوي', l: 'تالتة ثانوي' },
            ].map(g => (
              <button key={g.v} type="button" onClick={() => setForm({...form, grade: g.v})}
                className={`p-3 rounded-xl border-2 font-bold transition-all ${
                  form.grade === g.v
                    ? 'border-brand-700 bg-brand-50 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200'
                    : 'border-brand-100 dark:border-brand-900/40 text-ink-900/70 dark:text-white/60'
                }`}>{g.l}</button>
            ))}
          </div>
        </div>
        <button disabled={busy} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
          {busy ? <><CellLoader size={20}/> جاري التسجيل...</> : 'إنشاء الحساب'}
        </button>
      </form>
    </AuthShell>
  );
}

// ---- Complete profile (after Google if needs_grade) ----
function CompleteProfilePage() {
  const { user, token, setUser } = useAuth();
  const toast = useToast();
  const [grade, setGrade] = React.useState('اولي ثانوي');
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (!token) navigate('/login', true);
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await apiFetch('/api/auth/complete-profile', { method: 'POST', body: { grade } });
      setUser({ ...(user || {}), ...(data.student || {}), grade });
      store.set('user', { ...(user || {}), ...(data.student || {}), grade });
      toast.show('تمام! خليك جاهز', 'success');
      navigate('/dash');
    } catch (e) {
      toast.show(e.message || 'حصل خطأ', 'error');
    } finally { setBusy(false); }
  };

  return (
    <AuthShell
      title="خطوة صغيرة كمان"
      subtitle="اختار صفك عشان نظبطلك الكورسات المناسبة"
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {[
            { v: 'اولي ثانوي', l: 'أولى ثانوي', d: 'مقدمة قوية في الأحياء والعلوم' },
            { v: 'تالته ثانوي', l: 'تالتة ثانوي', d: 'ثانوية عامة أو أزهر — الشامل' },
          ].map(g => (
            <button key={g.v} type="button" onClick={() => setGrade(g.v)}
              className={`p-5 rounded-2xl border-2 text-right transition-all ${
                grade === g.v
                  ? 'border-brand-700 bg-brand-50 dark:bg-brand-900/40'
                  : 'border-brand-100 dark:border-brand-900/40 hover:border-brand-300'
              }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-black text-brand-950 dark:text-white">{g.l}</div>
                  <div className="text-sm text-ink-900/60 dark:text-white/60 mt-1">{g.d}</div>
                </div>
                {grade === g.v && (
                  <div className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center">
                    <CheckIcon size={18}/>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
        <button disabled={busy} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
          {busy ? 'جاري الحفظ...' : 'يلا نبدأ'}
        </button>
      </form>
    </AuthShell>
  );
}

// ---- Admin Login ----
function AdminLoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const [form, setForm] = React.useState({ username: '', password: '' });
  const [busy, setBusy] = React.useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await apiFetch('/api/auth/admin-login', {
        method: 'POST', noAuth: true, body: form,
      });
      login(data.token, { name: 'مستر محمد مجدي', role: 'admin' }, 'admin');
      toast.show('أهلاً مستر!', 'success');
      navigate('/admin');
    } catch (e) {
      toast.show(e.message || 'بيانات الدخول غير صحيحة', 'error');
    } finally { setBusy(false); }
  };

  return (
    <AuthShell
      title="لوحة المعلم"
      subtitle="دخول للمعلم فقط"
      footer={<><a href="#/login" className="text-brand-700 dark:text-brand-300 font-bold">دخول الطلاب من هنا</a></>}
    >
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-sm font-bold text-ink-900/70 dark:text-white/70 mb-1.5 block">اسم المستخدم</label>
          <input required className="field" value={form.username} onChange={e => setForm({...form, username: e.target.value})} placeholder="admin"/>
        </div>
        <div>
          <label className="text-sm font-bold text-ink-900/70 dark:text-white/70 mb-1.5 block">كلمة السر</label>
          <input required type="password" className="field" value={form.password} onChange={e => setForm({...form, password: e.target.value})}/>
        </div>
        <button disabled={busy} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
          {busy ? 'جاري الدخول...' : 'دخول لوحة المعلم'}
        </button>
      </form>
    </AuthShell>
  );
}

Object.assign(window, {
  GoogleButton, AuthShell, LoginPage, RegisterPage, CompleteProfilePage, AdminLoginPage,
});
