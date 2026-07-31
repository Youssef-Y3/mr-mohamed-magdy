// ============================================================
// pages-admin.jsx — Teacher admin panel (dashboard, courses, students, payments, reports, settings)
// ============================================================

const motionAd = (window.Motion && window.Motion.motion) || {};
const R = window.Recharts || {};

// ---- Admin layout ----
function AdminLayout({ children, active }) {
  const { logout } = useAuth();
  const [open, setOpen] = React.useState(false);
  const nav = [
    { id: 'dash',     label: 'الرئيسية',       icon: <HomeIcon size={20}/>, href: '#/admin' },
    { id: 'courses',  label: 'الكورسات',       icon: <BookIcon size={20}/>, href: '#/admin/courses' },
    { id: 'payments', label: 'الإيصالات',      icon: <WalletIcon size={20}/>, href: '#/admin/payments' },
    { id: 'students', label: 'الطلاب',          icon: <UsersIcon size={20}/>, href: '#/admin/students' },
    { id: 'reports',  label: 'التقارير المالية', icon: <ChartIcon size={20}/>, href: '#/admin/reports' },
    { id: 'settings', label: 'الإعدادات',       icon: <SettingsIcon size={20}/>, href: '#/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-brand-50/50 dark:bg-ink-950">
      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 right-0 h-screen z-40 w-72 bg-white dark:bg-ink-900 border-l border-brand-100 dark:border-brand-900/40 shadow-brand md:shadow-none transition-transform ${
        open ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
      }`}>
        <div className="p-5 border-b border-brand-100 dark:border-brand-900/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-700 to-violet2-600 flex items-center justify-center">
            <DnaIcon size={22} animated={false} color="#fff"/>
          </div>
          <div>
            <div className="font-black text-brand-950 dark:text-white">لوحة المعلم</div>
            <div className="text-xs text-brand-700 dark:text-brand-300 font-semibold">مستر محمد مجدي</div>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {nav.map(n => (
            <a key={n.id} href={n.href} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${
                active === n.id
                  ? 'bg-gradient-to-l from-brand-700 to-violet2-600 text-white shadow-soft'
                  : 'text-ink-900/70 dark:text-white/70 hover:bg-brand-50 dark:hover:bg-brand-900/40'
              }`}>
              {n.icon} <span>{n.label}</span>
            </a>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
          <a href="#/" className="flex-1 btn-ghost text-center text-sm !py-2">عرض الموقع</a>
          <button onClick={logout} className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 flex items-center justify-center">
            <LogoutIcon/>
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="md:hidden sticky top-0 z-30 bg-white/95 dark:bg-ink-950/95 backdrop-blur border-b border-brand-100 dark:border-brand-900/40 h-16 flex items-center justify-between px-4">
          <button onClick={() => setOpen(v => !v)} className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center">
            {open ? <CloseIcon/> : <MenuIcon/>}
          </button>
          <div className="font-black text-brand-950 dark:text-white">لوحة المعلم</div>
          <div className="w-10 h-10"/>
        </div>
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

// ---- Admin Dashboard ----
function AdminDashboard() {
  const [fin, setFin] = React.useState(null);
  const [students, setStudents] = React.useState(null);
  const [pending, setPending] = React.useState(null);
  const { tweaks } = useTweaksCtx();

  React.useEffect(() => {
    (async () => {
      try { setFin(await apiFetch('/api/admin/report/financial')); }
      catch { setFin(tweaks.sampleData ? SAMPLE_FINANCIAL : { today: 0, week: 0, month: 0, by_day: [], by_plan: [] }); }
      try {
        const s = await apiFetch('/api/admin/students');
        setStudents(Array.isArray(s) ? s : (s.students || s.items || []));
      } catch { setStudents(tweaks.sampleData ? SAMPLE_ADMIN_STUDENTS : []); }
      try {
        const p = await apiFetch('/api/admin/payments/pending');
        setPending(Array.isArray(p) ? p : (p.payments || p.items || []));
      } catch { setPending(tweaks.sampleData ? SAMPLE_ADMIN_PAYMENTS.filter(x => x.status === 'pending') : []); }
    })();
  }, [tweaks.sampleData]);

  return (
    <AdminLayout active="dash">
      <FadeIn>
        <h1 className="text-3xl md:text-4xl font-black text-brand-950 dark:text-white mb-2 font-cairo">مرحباً مستر 👋</h1>
        <p className="text-ink-900/60 dark:text-white/60 mb-8">نظرة سريعة على أداء المنصة النهارده</p>
      </FadeIn>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'إيرادات اليوم',   value: fin?.today,  icon: <WalletIcon size={22}/>, color: 'from-emerald-500 to-teal-600' },
          { label: 'إيرادات الأسبوع', value: fin?.week,   icon: <ChartIcon size={22}/>,  color: 'from-brand-500 to-violet2-600' },
          { label: 'إيرادات الشهر',   value: fin?.month,  icon: <ChartIcon size={22}/>,  color: 'from-pink-500 to-rose-600' },
          { label: 'إيصالات معلقة',   value: pending?.length ?? 0, icon: <WalletIcon size={22}/>, color: 'from-amber-500 to-orange-600', money: false },
        ].map((s, i) => (
          <FadeIn key={i} delay={0.05 * i}>
            <div className="relative overflow-hidden rounded-2xl p-5 bg-white dark:bg-ink-900 border border-brand-100 dark:border-brand-900/40 shadow-soft">
              <div className={`absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-gradient-to-br ${s.color} opacity-20 blur-2xl`}/>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-3`}>
                {s.icon}
              </div>
              <div className="text-xs font-bold text-ink-900/60 dark:text-white/60 mb-1">{s.label}</div>
              <div className="text-2xl md:text-3xl font-black text-brand-950 dark:text-white">
                {s.value === undefined ? <span className="sk h-8 w-24 inline-block"/> :
                  (s.money !== false ? fmtMoney(s.value) : fmtNum(s.value))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Chart + Recent */}
      <div className="grid md:grid-cols-[1fr,360px] gap-6">
        <FadeIn delay={0.2}>
          <div className="rounded-3xl p-5 md:p-6 bg-white dark:bg-ink-900 border border-brand-100 dark:border-brand-900/40 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="font-black text-brand-950 dark:text-white text-lg">الإيرادات اليومية — آخر أسبوعين</div>
            </div>
            {fin ? (
              <div style={{ width: '100%', height: 260 }}>
                {R.ResponsiveContainer && (
                  <R.ResponsiveContainer>
                    <R.AreaChart data={fin.by_day}>
                      <defs>
                        <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.5}/>
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <R.CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.1)"/>
                      <R.XAxis dataKey="day" tick={{ fill: '#7C3AED', fontSize: 12, fontFamily: 'Cairo' }}/>
                      <R.YAxis tick={{ fill: '#7C3AED', fontSize: 12 }}/>
                      <R.Tooltip
                        contentStyle={{ background: '#1E1B4B', border: 'none', borderRadius: 12, color: '#fff', fontFamily: 'Cairo' }}
                        formatter={(v) => [fmtMoney(v), 'إيراد']}/>
                      <R.Area type="monotone" dataKey="amount" stroke="#7C3AED" strokeWidth={2.5} fill="url(#revG)"/>
                    </R.AreaChart>
                  </R.ResponsiveContainer>
                )}
              </div>
            ) : <div className="sk h-64"/>}
          </div>
        </FadeIn>

        <FadeIn delay={0.25}>
          <div className="rounded-3xl p-5 bg-white dark:bg-ink-900 border border-brand-100 dark:border-brand-900/40 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div className="font-black text-brand-950 dark:text-white">إيصالات محتاجة مراجعة</div>
              {pending && pending.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 text-xs font-black">
                  {fmtNum(pending.length)}
                </span>
              )}
            </div>
            {pending === null && <div className="sk h-40"/>}
            {pending && pending.length === 0 && (
              <div className="text-center py-6 text-ink-900/60 dark:text-white/60 text-sm">مفيش إيصالات معلقة 🎉</div>
            )}
            {pending && pending.slice(0, 5).map(p => (
              <a key={p.id} href="#/admin/payments" className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-violet2-500 text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                  {p.student_name?.charAt(0) || 'ط'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-brand-950 dark:text-white line-clamp-1">{p.student_name || 'طالب'}</div>
                  <div className="text-xs text-ink-900/60 dark:text-white/60">{fmtMoney(p.amount)} · {p.method === 'vodafone_cash' ? 'فودافون' : 'انستاباي'}</div>
                </div>
              </a>
            ))}
            {pending && pending.length > 5 && (
              <a href="#/admin/payments" className="mt-2 block text-center text-sm font-bold text-brand-700 dark:text-brand-300 hover:underline">
                عرض كل الإيصالات ({fmtNum(pending.length)})
              </a>
            )}
          </div>
        </FadeIn>
      </div>
    </AdminLayout>
  );
}

// ---- Admin Courses ----
function AdminCoursesPage() {
  const { tweaks } = useTweaksCtx();
  const toast = useToast();
  const [courses, setCourses] = React.useState(null);
  const [showAdd, setShowAdd] = React.useState(false);
  const [expanded, setExpanded] = React.useState(null);

  const load = async () => {
    try {
      const data = await apiFetch('/api/admin/courses');
      setCourses(Array.isArray(data) ? data : (data.courses || data.items || []));
    } catch { setCourses(tweaks.sampleData ? SAMPLE_COURSES : []); }
  };
  React.useEffect(() => { load(); }, [tweaks.sampleData]);

  const publish = async (id) => {
    try { await apiFetch(`/api/admin/courses/${id}/publish`, { method: 'POST' }); toast.show('اتنشر الكورس', 'success'); load(); }
    catch (e) { toast.show(e.message || 'فشل', 'error'); }
  };
  const remove = async (id) => {
    if (!confirm('متأكد إنك عايز تحذف الكورس ده؟')) return;
    try { await apiFetch(`/api/admin/courses/${id}`, { method: 'DELETE' }); toast.show('اتحذف', 'success'); load(); }
    catch (e) { toast.show(e.message || 'فشل', 'error'); }
  };

  return (
    <AdminLayout active="courses">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-brand-950 dark:text-white font-cairo">إدارة الكورسات</h1>
          <p className="text-ink-900/60 dark:text-white/60 mt-1">أضف كورس، اضف وحدات ودروس، ثم اضف الفيديوهات</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary inline-flex items-center gap-2">
          <PlusIcon size={20}/> كورس جديد
        </button>
      </div>

      {courses === null && <div className="grid md:grid-cols-2 gap-4">{[1,2,3,4].map(i => <SkeletonCard key={i}/>)}</div>}
      {courses && courses.length === 0 && (
        <EmptyState title="لسه محدش أضاف كورس" sub="ابدأ أول كورس دلوقتي"
          action={<button onClick={() => setShowAdd(true)} className="btn-primary">أضف كورس</button>}/>
      )}

      <div className="space-y-4">
        {courses && courses.map((c, i) => (
          <FadeIn key={c.id} delay={0.04 * i}>
            <div className="rounded-3xl bg-white dark:bg-ink-900 border border-brand-100 dark:border-brand-900/40 shadow-soft overflow-hidden">
              <div className="p-5 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.cover_color || 'from-brand-500 to-violet2-500'} text-white flex items-center justify-center`}>
                  <DnaIcon size={26} animated={false} color="#fff"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-brand-950 dark:text-white text-lg line-clamp-1">{c.title}</div>
                  <div className="text-sm text-ink-900/60 dark:text-white/60 mt-0.5 flex items-center gap-2 flex-wrap">
                    <span>{gradeName(c.grade)}</span>
                    <span>·</span>
                    <span>{(c.units || []).length} وحدة</span>
                    <span>·</span>
                    <span>{countLessons(c, 'reel')} ريل + {countLessons(c, 'lecture')} محاضرة</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {c.published ? (
                    <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-black">منشور</span>
                  ) : (
                    <button onClick={() => publish(c.id)} className="px-3 py-1.5 rounded-full bg-brand-700 text-white text-xs font-black hover:bg-brand-800">
                      نشر
                    </button>
                  )}
                  <button onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                    className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 flex items-center justify-center">
                    <ChevronDownIcon className={`transition-transform ${expanded === c.id ? 'rotate-180' : ''}`}/>
                  </button>
                  <button onClick={() => remove(c.id)} className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 flex items-center justify-center">
                    <TrashIcon/>
                  </button>
                </div>
              </div>

              {expanded === c.id && <CourseUnitsPanel course={c} onReload={load}/>}
            </div>
          </FadeIn>
        ))}
      </div>

      <NewCourseModal open={showAdd} onClose={() => setShowAdd(false)} onCreated={load}/>
    </AdminLayout>
  );
}

// Course units + lessons expand
function CourseUnitsPanel({ course, onReload }) {
  const toast = useToast();
  const [showAddUnit, setShowAddUnit] = React.useState(false);
  const [showAddLesson, setShowAddLesson] = React.useState(null); // unit_id
  const [showUpload, setShowUpload] = React.useState(null); // lesson

  const addUnit = async (title) => {
    try {
      await apiFetch('/api/admin/units', { method: 'POST', body: { course_id: course.id, title, order_num: (course.units || []).length + 1 } });
      toast.show('اتضافت الوحدة', 'success'); setShowAddUnit(false); onReload();
    } catch (e) { toast.show(e.message || 'فشل', 'error'); }
  };
  const addLesson = async (unitId, title, content_type) => {
    try {
      const unit = (course.units || []).find(u => u.id === unitId);
      await apiFetch('/api/admin/lessons', { method: 'POST', body: { unit_id: unitId, title, content_type, order_num: ((unit && unit.lessons) || []).length + 1 } });
      toast.show('اتضاف الدرس', 'success'); setShowAddLesson(null); onReload();
    } catch (e) { toast.show(e.message || 'فشل', 'error'); }
  };
  const publishLesson = async (id) => {
    try { await apiFetch(`/api/admin/lessons/${id}/publish`, { method: 'POST' }); toast.show('اتنشر', 'success'); onReload(); }
    catch (e) { toast.show(e.message || 'فشل', 'error'); }
  };

  return (
    <div className="border-t border-brand-100 dark:border-brand-900/40 p-5 bg-brand-50/40 dark:bg-brand-950/20">
      <div className="flex items-center justify-between mb-4">
        <div className="font-black text-brand-950 dark:text-white">وحدات ودروس</div>
        <button onClick={() => setShowAddUnit(true)} className="btn-ghost !py-1.5 !px-3 text-sm inline-flex items-center gap-1">
          <PlusIcon size={16}/> وحدة
        </button>
      </div>
      {(course.units || []).length === 0 && (
        <div className="text-sm text-ink-900/60 dark:text-white/60 text-center py-4">ابدأ بإضافة أول وحدة للكورس</div>
      )}
      <div className="space-y-3">
        {(course.units || []).map((u, ui) => (
          <div key={u.id} className="rounded-2xl bg-white dark:bg-ink-900 border border-brand-100 dark:border-brand-900/40 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center font-black text-sm">{ui+1}</div>
              <div className="font-bold text-brand-950 dark:text-white flex-1">{u.title}</div>
              <button onClick={() => setShowAddLesson(u.id)} className="text-brand-700 dark:text-brand-300 text-xs font-black inline-flex items-center gap-1">
                <PlusIcon size={14}/> درس
              </button>
            </div>
            <div className="space-y-1.5 pr-2">
              {(u.lessons || []).map(l => (
                <div key={l.id} className="flex items-center gap-3 p-2 rounded-xl bg-brand-50/60 dark:bg-brand-900/20">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    l.content_type === 'reel'
                      ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300'
                      : 'bg-brand-200 text-brand-800 dark:bg-brand-800 dark:text-brand-100'
                  }`}>{l.content_type === 'reel' ? 'ريل' : 'محاضرة'}</span>
                  <div className="flex-1 text-sm text-brand-950 dark:text-white line-clamp-1">{l.title}</div>
                  <button onClick={() => setShowUpload(l)} className="text-xs font-black text-brand-700 dark:text-brand-300 inline-flex items-center gap-1">
                    <UploadIcon size={14}/> فيديو
                  </button>
                  <button onClick={() => publishLesson(l.id)} className="text-xs font-black text-emerald-600 dark:text-emerald-400">نشر</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <SimpleTextModal open={showAddUnit} onClose={() => setShowAddUnit(false)} title="اسم الوحدة" onSubmit={addUnit}/>
      <LessonModal open={!!showAddLesson} onClose={() => setShowAddLesson(null)}
        onSubmit={(title, ct) => addLesson(showAddLesson, title, ct)}/>
      <VideoUploadModal open={!!showUpload} onClose={() => setShowUpload(null)} lesson={showUpload} onDone={onReload}/>
    </div>
  );
}

function NewCourseModal({ open, onClose, onCreated }) {
  const [title, setTitle] = React.useState('');
  const [grade, setGrade] = React.useState('اولي ثانوي');
  const [busy, setBusy] = React.useState(false);
  const toast = useToast();
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await apiFetch('/api/admin/courses', { method: 'POST', body: { title, grade } });
      toast.show('اتضاف الكورس', 'success'); setTitle(''); onCreated(); onClose();
    } catch (e) { toast.show(e.message || 'فشل', 'error'); }
    finally { setBusy(false); }
  };
  return (
    <Modal open={open} onClose={onClose} title="كورس جديد">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-sm font-bold mb-1.5 block text-ink-900/70 dark:text-white/70">اسم الكورس</label>
          <input required className="field" value={title} onChange={e => setTitle(e.target.value)} placeholder="أحياء أولى ثانوي — الترم الأول"/>
        </div>
        <div>
          <label className="text-sm font-bold mb-1.5 block text-ink-900/70 dark:text-white/70">الصف</label>
          <div className="grid grid-cols-2 gap-2">
            {[{v:'اولي ثانوي',l:'أولى ثانوي'},{v:'تالته ثانوي',l:'تالتة ثانوي'}].map(g => (
              <button key={g.v} type="button" onClick={() => setGrade(g.v)}
                className={`p-3 rounded-xl border-2 font-bold ${grade === g.v ? 'border-brand-700 bg-brand-50 dark:bg-brand-900/40' : 'border-brand-100 dark:border-brand-900/40'}`}>{g.l}</button>
            ))}
          </div>
        </div>
        <button disabled={busy} className="btn-primary w-full">{busy ? '...' : 'إنشاء الكورس'}</button>
      </form>
    </Modal>
  );
}
function SimpleTextModal({ open, onClose, title, onSubmit }) {
  const [val, setVal] = React.useState('');
  React.useEffect(() => { if (open) setVal(''); }, [open]);
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form onSubmit={e => { e.preventDefault(); onSubmit(val); }} className="space-y-4">
        <input required className="field" value={val} onChange={e => setVal(e.target.value)} autoFocus/>
        <button className="btn-primary w-full">إضافة</button>
      </form>
    </Modal>
  );
}
function LessonModal({ open, onClose, onSubmit }) {
  const [title, setTitle] = React.useState('');
  const [ct, setCt] = React.useState('lecture');
  React.useEffect(() => { if (open) { setTitle(''); setCt('lecture'); } }, [open]);
  return (
    <Modal open={open} onClose={onClose} title="درس جديد">
      <form onSubmit={e => { e.preventDefault(); onSubmit(title, ct); }} className="space-y-4">
        <div>
          <label className="text-sm font-bold mb-1.5 block text-ink-900/70 dark:text-white/70">اسم الدرس</label>
          <input required className="field" value={title} onChange={e => setTitle(e.target.value)} autoFocus/>
        </div>
        <div>
          <label className="text-sm font-bold mb-1.5 block text-ink-900/70 dark:text-white/70">نوع المحتوى</label>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setCt('reel')}
              className={`p-4 rounded-2xl border-2 text-center ${ct === 'reel' ? 'border-brand-700 bg-brand-50 dark:bg-brand-900/40' : 'border-brand-100 dark:border-brand-900/40'}`}>
              <FilmIcon size={28} className="mx-auto mb-1 text-brand-700 dark:text-brand-300"/>
              <div className="font-black text-brand-950 dark:text-white text-sm">ريل</div>
              <div className="text-xs text-ink-900/60 dark:text-white/50 mt-1">فيديو قصير عمودي</div>
            </button>
            <button type="button" onClick={() => setCt('lecture')}
              className={`p-4 rounded-2xl border-2 text-center ${ct === 'lecture' ? 'border-brand-700 bg-brand-50 dark:bg-brand-900/40' : 'border-brand-100 dark:border-brand-900/40'}`}>
              <BookIcon size={28} className="mx-auto mb-1 text-brand-700 dark:text-brand-300"/>
              <div className="font-black text-brand-950 dark:text-white text-sm">محاضرة</div>
              <div className="text-xs text-ink-900/60 dark:text-white/50 mt-1">فيديو طويل بمشغل كامل</div>
            </button>
          </div>
        </div>
        <button className="btn-primary w-full">إضافة الدرس</button>
      </form>
    </Modal>
  );
}

// Video upload modal (drag & drop)
function VideoUploadModal({ open, onClose, lesson, onDone }) {
  const toast = useToast();
  const [file, setFile] = React.useState(null);
  const [progress, setProgress] = React.useState(0);
  const [uploading, setUploading] = React.useState(false);
  const [drag, setDrag] = React.useState(false);
  const [duration, setDuration] = React.useState(0);

  React.useEffect(() => { if (open) { setFile(null); setProgress(0); setUploading(false); setDuration(0); } }, [open]);

  const onFile = (f) => {
    if (!f) return;
    setFile(f);
    // extract duration
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.onloadedmetadata = () => { setDuration(Math.floor(v.duration)); URL.revokeObjectURL(v.src); };
    v.src = URL.createObjectURL(f);
  };

  const upload = async () => {
    if (!file || !lesson) return;
    setUploading(true);
    try {
      // Use XHR to get upload progress
      const token = store.get('token');
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_BASE}/api/admin/lessons/${lesson.id}/video`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject({ message: `فشل الرفع (${xhr.status})` });
        xhr.onerror = () => reject({ message: 'فشل الاتصال' });
        const fd = new FormData();
        fd.append('video', file);
        fd.append('duration_seconds', String(duration));
        xhr.send(fd);
      });
      toast.show('اترفع الفيديو ', 'success');
      onDone && onDone();
      onClose();
    } catch (e) {
      toast.show(e.message || 'فشل الرفع', 'error');
    } finally { setUploading(false); }
  };

  return (
    <Modal open={open} onClose={onClose} title={`رفع فيديو: ${lesson?.title || ''}`} size="lg">
      <div className="space-y-4">
        <div
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files[0]); }}
          className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all ${
            drag ? 'border-brand-700 bg-brand-50 dark:bg-brand-900/40 scale-[1.01]'
                 : file ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20'
                        : 'border-brand-200 dark:border-brand-900/50 hover:border-brand-500'
          }`}>
          <input id="video-upload-input" type="file" accept="video/*" className="hidden" onChange={e => onFile(e.target.files[0])}/>
          {file ? (
            <div className="space-y-2">
              <CheckIcon size={44} className="mx-auto text-emerald-500"/>
              <div className="font-black text-brand-950 dark:text-white">{file.name}</div>
              <div className="text-xs text-ink-900/60 dark:text-white/60">
                {(file.size / (1024*1024)).toFixed(1)} MB · مدة: {fmtTime(duration)}
              </div>
              <label htmlFor="video-upload-input" className="text-xs font-black text-brand-700 dark:text-brand-300 cursor-pointer">تغيير الملف</label>
            </div>
          ) : (
            <label htmlFor="video-upload-input" className="cursor-pointer block">
              <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 mx-auto mb-3 flex items-center justify-center">
                <UploadIcon size={30}/>
              </div>
              <div className="font-black text-brand-950 dark:text-white mb-1">اسحب الفيديو هنا أو اضغط للاختيار</div>
              <div className="text-xs text-ink-900/60 dark:text-white/50">MP4 / MOV / WebM</div>
            </label>
          )}
        </div>

        {uploading && (
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-ink-900/70 dark:text-white/70 mb-2">
              <span>جاري الرفع...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-brand-100 dark:bg-brand-900/40 overflow-hidden">
              <div className="h-full bg-gradient-to-l from-brand-500 to-violet2-500 transition-all" style={{ width: `${progress}%` }}/>
            </div>
          </div>
        )}

        <button onClick={upload} disabled={!file || uploading} className="btn-primary w-full">
          {uploading ? 'جاري الرفع...' : 'ارفع الفيديو'}
        </button>
      </div>
    </Modal>
  );
}

// ---- Admin Payments ----
function AdminPaymentsPage() {
  const { tweaks } = useTweaksCtx();
  const toast = useToast();
  const [payments, setPayments] = React.useState(null);
  const [filter, setFilter] = React.useState('pending');
  const [viewReceipt, setViewReceipt] = React.useState(null);
  const [rejectFor, setRejectFor] = React.useState(null);

  const load = async () => {
    try {
      const endpoint = filter === 'pending' ? '/api/admin/payments/pending' : '/api/admin/payments';
      const data = await apiFetch(endpoint);
      setPayments(Array.isArray(data) ? data : (data.payments || data.items || []));
    } catch {
      let base = tweaks.sampleData ? SAMPLE_ADMIN_PAYMENTS : [];
      if (filter === 'pending') base = base.filter(x => x.status === 'pending');
      setPayments(base);
    }
  };
  React.useEffect(() => { load(); }, [filter, tweaks.sampleData]);

  const confirm = async (id) => {
    try { await apiFetch(`/api/admin/payments/${id}/confirm`, { method: 'POST' }); toast.show('تم التأكيد', 'success'); load(); }
    catch (e) { toast.show(e.message || 'فشل', 'error'); }
  };
  const reject = async (id, note) => {
    try { await apiFetch(`/api/admin/payments/${id}/reject`, { method: 'POST', body: { note } }); toast.show('تم الرفض', 'success'); setRejectFor(null); load(); }
    catch (e) { toast.show(e.message || 'فشل', 'error'); }
  };

  return (
    <AdminLayout active="payments">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-brand-950 dark:text-white font-cairo">إدارة الإيصالات</h1>
        <p className="text-ink-900/60 dark:text-white/60 mt-1">راجع الإيصالات وأكّد أو ارفض</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { v: 'pending', l: 'قيد المراجعة' },
          { v: 'all',     l: 'كل الإيصالات' },
        ].map(f => (
          <button key={f.v} onClick={() => setFilter(f.v)}
            className={`px-5 py-2 rounded-full font-bold ${
              filter === f.v ? 'bg-brand-700 text-white' : 'bg-white dark:bg-ink-900 text-ink-900/70 dark:text-white/70 border border-brand-100 dark:border-brand-900/40'
            }`}>{f.l}</button>
        ))}
      </div>

      {payments === null && <div className="sk h-96"/>}
      {payments && payments.length === 0 && <EmptyState title="مفيش إيصالات" sub="راجع تاني بعدين"/>}

      {payments && payments.length > 0 && (
        <div className="overflow-x-auto rounded-3xl bg-white dark:bg-ink-900 border border-brand-100 dark:border-brand-900/40 shadow-soft">
          <table className="w-full text-right min-w-[720px]">
            <thead className="bg-brand-50 dark:bg-brand-900/30">
              <tr className="text-xs font-black text-brand-800 dark:text-brand-200">
                <th className="p-4">الطالب</th>
                <th className="p-4">المبلغ</th>
                <th className="p-4">الخطة</th>
                <th className="p-4">الطريقة</th>
                <th className="p-4">آخر 4 أرقام</th>
                <th className="p-4">الحالة</th>
                <th className="p-4">التاريخ</th>
                <th className="p-4">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50 dark:divide-brand-900/40">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-colors">
                  <td className="p-4 font-bold text-brand-950 dark:text-white">{p.student_name}</td>
                  <td className="p-4 font-black text-brand-950 dark:text-white">{fmtMoney(p.amount)}</td>
                  <td className="p-4 text-sm">{p.plan === 'monthly' ? 'شهر' : p.plan === 'term' ? 'ترم' : 'سنة'}</td>
                  <td className="p-4 text-sm">{p.method === 'vodafone_cash' ? 'فودافون' : 'انستاباي'}</td>
                  <td className="p-4 font-mono">{p.sender_last4}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                      p.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : p.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                    }`}>
                      {p.status === 'confirmed' ? 'مؤكد' : p.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-ink-900/60 dark:text-white/50">{p.created_at}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewReceipt(p)} className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center">
                        <EyeIcon/>
                      </button>
                      {p.status === 'pending' && (
                        <>
                          <button onClick={() => confirm(p.id)} className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                            <CheckIcon size={16}/>
                          </button>
                          <button onClick={() => setRejectFor(p)} className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center">
                            <CloseIcon size={16}/>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Receipt lightbox */}
      <Modal open={!!viewReceipt} onClose={() => setViewReceipt(null)} title={`إيصال — ${viewReceipt?.student_name}`} size="lg">
        <div className="text-center">
          <div className="w-full aspect-[3/4] max-h-[70vh] mx-auto rounded-2xl bg-brand-50 dark:bg-brand-900/40 flex items-center justify-center overflow-hidden">
            <ReceiptImg paymentId={viewReceipt?.id}/>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-right text-sm">
            <div><div className="text-ink-900/60 dark:text-white/60 font-bold">المبلغ:</div><div className="font-black text-brand-950 dark:text-white">{fmtMoney(viewReceipt?.amount)}</div></div>
            <div><div className="text-ink-900/60 dark:text-white/60 font-bold">آخر 4 أرقام:</div><div className="font-black font-mono">{viewReceipt?.sender_last4}</div></div>
            <div><div className="text-ink-900/60 dark:text-white/60 font-bold">الطريقة:</div><div>{viewReceipt?.method === 'vodafone_cash' ? 'فودافون' : 'انستاباي'}</div></div>
            <div><div className="text-ink-900/60 dark:text-white/60 font-bold">الخطة:</div><div>{viewReceipt?.plan}</div></div>
          </div>
        </div>
      </Modal>

      {/* Reject modal */}
      <RejectModal open={!!rejectFor} onClose={() => setRejectFor(null)} onSubmit={(note) => reject(rejectFor.id, note)}/>
    </AdminLayout>
  );
}

function ReceiptImg({ paymentId }) {
  const [url, setUrl] = React.useState(null);
  const [err, setErr] = React.useState(false);
  React.useEffect(() => {
    if (!paymentId) return;
    let cancelled = false;
    (async () => {
      try {
        const token = store.get('token');
        const res = await fetch(`${API_BASE}/api/admin/payments/${paymentId}/receipt`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const blob = await res.blob();
        if (!cancelled) setUrl(URL.createObjectURL(blob));
      } catch { if (!cancelled) setErr(true); }
    })();
    return () => { cancelled = true; if (url) URL.revokeObjectURL(url); };
  }, [paymentId]);
  if (err) return <div className="text-ink-900/60 dark:text-white/60 text-sm p-8">لا يمكن عرض الإيصال</div>;
  if (!url) return <CellLoader/>;
  return <img src={url} alt="receipt" className="max-w-full max-h-full object-contain"/>;
}

function RejectModal({ open, onClose, onSubmit }) {
  const [note, setNote] = React.useState('');
  React.useEffect(() => { if (open) setNote(''); }, [open]);
  return (
    <Modal open={open} onClose={onClose} title="سبب الرفض">
      <form onSubmit={e => { e.preventDefault(); onSubmit(note); }} className="space-y-4">
        <textarea required rows={4} className="field" value={note} onChange={e => setNote(e.target.value)}
          placeholder="مثال: الإيصال غير واضح، أو المبلغ غير مطابق"/>
        <button className="btn-primary w-full !bg-gradient-to-l from-red-600 to-red-500 hover:from-red-700 hover:to-red-600" style={{background: 'linear-gradient(135deg, #DC2626, #EF4444)'}}>
          تأكيد الرفض
        </button>
      </form>
    </Modal>
  );
}

// ---- Admin Students ----
function AdminStudentsPage() {
  const { tweaks } = useTweaksCtx();
  const [students, setStudents] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [grade, setGrade] = React.useState('all');

  React.useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch('/api/admin/students');
        setStudents(Array.isArray(data) ? data : (data.students || data.items || []));
      } catch { setStudents(tweaks.sampleData ? SAMPLE_ADMIN_STUDENTS : []); }
    })();
  }, [tweaks.sampleData]);

  const filtered = React.useMemo(() => {
    if (!students) return null;
    return students.filter(s => {
      if (grade !== 'all' && s.grade !== grade) return false;
      if (search && !s.name.includes(search) && !s.username.includes(search)) return false;
      return true;
    });
  }, [students, grade, search]);

  return (
    <AdminLayout active="students">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-brand-950 dark:text-white font-cairo">الطلاب</h1>
        <p className="text-ink-900/60 dark:text-white/60 mt-1">إجمالي {students ? fmtNum(students.length) : '...'} طالب</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[240px]">
          <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-900/40 dark:text-white/40"/>
          <input className="field pr-10" placeholder="ابحث بالاسم أو اليوزر..." value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        {[
          { v: 'all',   l: 'الكل' },
          { v: 'اولي ثانوي', l: 'أولى ثانوي' },
          { v: 'تالته ثانوي', l: 'تالتة ثانوي' },
        ].map(f => (
          <button key={f.v} onClick={() => setGrade(f.v)}
            className={`px-5 py-2 rounded-full font-bold ${
              grade === f.v ? 'bg-brand-700 text-white' : 'bg-white dark:bg-ink-900 text-ink-900/70 dark:text-white/70 border border-brand-100 dark:border-brand-900/40'
            }`}>{f.l}</button>
        ))}
      </div>

      {filtered === null && <div className="sk h-96"/>}
      {filtered && filtered.length === 0 && <EmptyState title="لا يوجد طلاب"/>}
      {filtered && filtered.length > 0 && (
        <div className="overflow-x-auto rounded-3xl bg-white dark:bg-ink-900 border border-brand-100 dark:border-brand-900/40 shadow-soft">
          <table className="w-full text-right min-w-[640px]">
            <thead className="bg-brand-50 dark:bg-brand-900/30">
              <tr className="text-xs font-black text-brand-800 dark:text-brand-200">
                <th className="p-4">الطالب</th>
                <th className="p-4">اليوزر</th>
                <th className="p-4">الصف</th>
                <th className="p-4">الاشتراك</th>
                <th className="p-4">التقدم</th>
                <th className="p-4">تاريخ الانضمام</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50 dark:divide-brand-900/40">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-brand-50/50 dark:hover:bg-brand-900/20">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-violet2-500 text-white flex items-center justify-center font-black text-xs">{s.name?.charAt(0)}</div>
                      <div className="font-bold text-brand-950 dark:text-white">{s.name}</div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-sm text-ink-900/70 dark:text-white/70">{s.username}</td>
                  <td className="p-4 text-sm">{gradeName(s.grade)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                      s.subscription === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : s.subscription === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {s.subscription === 'active' ? 'فعّال' : s.subscription === 'pending' ? 'معلق' : 'بدون'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full bg-brand-100 dark:bg-brand-900/40 overflow-hidden">
                        <div className="h-full bg-gradient-to-l from-brand-600 to-violet2-500" style={{ width: `${s.progress}%` }}/>
                      </div>
                      <span className="text-xs font-bold text-brand-950 dark:text-white">{s.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-ink-900/60 dark:text-white/50">{s.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

// ---- Admin Reports ----
function AdminReportsPage() {
  const { tweaks } = useTweaksCtx();
  const [fin, setFin] = React.useState(null);
  React.useEffect(() => {
    (async () => {
      try { setFin(await apiFetch('/api/admin/report/financial')); }
      catch { setFin(tweaks.sampleData ? SAMPLE_FINANCIAL : { today: 0, week: 0, month: 0, by_day: [], by_plan: [] }); }
    })();
  }, [tweaks.sampleData]);

  return (
    <AdminLayout active="reports">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-brand-950 dark:text-white font-cairo">التقارير المالية</h1>
        <p className="text-ink-900/60 dark:text-white/60 mt-1">نظرة على أداء الإيرادات والاشتراكات</p>
      </div>

      {!fin ? <div className="sk h-96"/> : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { l: 'اليوم', v: fin.today, c: 'from-emerald-500 to-teal-600' },
              { l: 'الأسبوع', v: fin.week, c: 'from-brand-500 to-violet2-600' },
              { l: 'الشهر', v: fin.month, c: 'from-pink-500 to-rose-600' },
            ].map((s, i) => (
              <FadeIn key={i} delay={0.05*i}>
                <div className="relative overflow-hidden rounded-3xl p-6 text-white">
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.c}`}/>
                  <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/15 blur-2xl"/>
                  <div className="relative">
                    <div className="text-white/80 font-bold text-sm">{s.l}</div>
                    <div className="text-4xl font-black mt-2">{fmtMoney(s.v)}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="grid md:grid-cols-[1fr,340px] gap-6">
            <div className="rounded-3xl p-5 md:p-6 bg-white dark:bg-ink-900 border border-brand-100 dark:border-brand-900/40 shadow-soft">
              <div className="font-black text-brand-950 dark:text-white mb-4">الإيرادات اليومية</div>
              <div style={{ width: '100%', height: 300 }}>
                {R.ResponsiveContainer && (
                  <R.ResponsiveContainer>
                    <R.BarChart data={fin.by_day}>
                      <R.CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.1)"/>
                      <R.XAxis dataKey="day" tick={{ fill: '#7C3AED', fontSize: 12 }}/>
                      <R.YAxis tick={{ fill: '#7C3AED', fontSize: 12 }}/>
                      <R.Tooltip contentStyle={{ background: '#1E1B4B', border: 'none', borderRadius: 12, color: '#fff' }} formatter={(v) => [fmtMoney(v), 'إيراد']}/>
                      <R.Bar dataKey="amount" fill="url(#barG)" radius={[8,8,0,0]}/>
                      <defs>
                        <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#7C3AED"/>
                          <stop offset="100%" stopColor="#4338CA"/>
                        </linearGradient>
                      </defs>
                    </R.BarChart>
                  </R.ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="rounded-3xl p-5 md:p-6 bg-white dark:bg-ink-900 border border-brand-100 dark:border-brand-900/40 shadow-soft">
              <div className="font-black text-brand-950 dark:text-white mb-4">الاشتراكات حسب الخطة</div>
              <div style={{ width: '100%', height: 260 }}>
                {R.ResponsiveContainer && (
                  <R.ResponsiveContainer>
                    <R.PieChart>
                      <R.Pie data={fin.by_plan} dataKey="value" nameKey="plan" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4}>
                        {fin.by_plan.map((entry, i) => <R.Cell key={i} fill={entry.color}/>)}
                      </R.Pie>
                      <R.Tooltip contentStyle={{ background: '#1E1B4B', border: 'none', borderRadius: 12, color: '#fff' }}/>
                    </R.PieChart>
                  </R.ResponsiveContainer>
                )}
              </div>
              <div className="mt-3 space-y-2">
                {fin.by_plan.map(p => (
                  <div key={p.plan} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ background: p.color }}/>
                      <span className="font-bold text-brand-950 dark:text-white">{p.plan}</span>
                    </div>
                    <span className="font-black text-brand-950 dark:text-white">{p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// ---- Admin Settings ----
function AdminSettingsPage() {
  const { tweaks } = useTweaksCtx();
  const toast = useToast();
  const [form, setForm] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      try {
        const s = await apiFetch('/api/admin/settings');
        setForm({
          vodafone_cash_number: s.vodafone_cash_number || '',
          instapay_handle:      s.instapay_handle || '',
          price_monthly:        s.price_monthly || 199,
          price_term:           s.price_term || 499,
          price_yearly:         s.price_yearly || 1299,
          teacher_bio:          s.teacher_bio || ABOUT_DRAFTS[tweaks.aboutDraft].body,
        });
      } catch {
        setForm({
          vodafone_cash_number: SAMPLE_PAYMENT_INFO.vodafone_cash_number,
          instapay_handle:      SAMPLE_PAYMENT_INFO.instapay_handle,
          price_monthly:        SAMPLE_PAYMENT_INFO.price_monthly,
          price_term:           SAMPLE_PAYMENT_INFO.price_term,
          price_yearly:         SAMPLE_PAYMENT_INFO.price_yearly,
          teacher_bio:          ABOUT_DRAFTS[tweaks.aboutDraft].body,
        });
      }
    })();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      await apiFetch('/api/admin/settings', { method: 'PUT', body: form });
      toast.show('تم حفظ الإعدادات', 'success');
    } catch (e) { toast.show(e.message || 'فشل الحفظ', 'error'); }
  };

  if (!form) return <AdminLayout active="settings"><div className="sk h-96"/></AdminLayout>;

  return (
    <AdminLayout active="settings">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-brand-950 dark:text-white font-cairo">الإعدادات</h1>
        <p className="text-ink-900/60 dark:text-white/60 mt-1">تحكم في أرقام الدفع، الأسعار، ونص المعلم</p>
      </div>

      <form onSubmit={save} className="space-y-6 max-w-3xl">
        <div className="rounded-3xl p-6 bg-white dark:bg-ink-900 border border-brand-100 dark:border-brand-900/40 shadow-soft space-y-4">
          <div className="font-black text-brand-950 dark:text-white text-lg flex items-center gap-2">
            <WalletIcon/> أرقام الدفع
          </div>
          <div>
            <label className="text-sm font-bold mb-1.5 block text-ink-900/70 dark:text-white/70">رقم فودافون كاش</label>
            <input required className="field font-mono" value={form.vodafone_cash_number} onChange={e => setForm({...form, vodafone_cash_number: e.target.value})}/>
          </div>
          <div>
            <label className="text-sm font-bold mb-1.5 block text-ink-900/70 dark:text-white/70">يوزر انستاباي (نفس الرقم)</label>
            <input required className="field font-mono" value={form.instapay_handle} onChange={e => setForm({...form, instapay_handle: e.target.value})}/>
          </div>
        </div>

        <div className="rounded-3xl p-6 bg-white dark:bg-ink-900 border border-brand-100 dark:border-brand-900/40 shadow-soft">
          <div className="font-black text-brand-950 dark:text-white text-lg mb-4">الأسعار</div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { k: 'price_monthly', l: 'شهر' },
              { k: 'price_term',    l: 'ترم' },
              { k: 'price_yearly',  l: 'سنة' },
            ].map(f => (
              <div key={f.k}>
                <label className="text-sm font-bold mb-1.5 block text-ink-900/70 dark:text-white/70">{f.l}</label>
                <input required type="number" className="field text-center" value={form[f.k]} onChange={e => setForm({...form, [f.k]: Number(e.target.value)})}/>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl p-6 bg-white dark:bg-ink-900 border border-brand-100 dark:border-brand-900/40 shadow-soft">
          <div className="font-black text-brand-950 dark:text-white text-lg mb-4">نص "عن المعلم"</div>
          <textarea rows={6} className="field leading-relaxed" value={form.teacher_bio} onChange={e => setForm({...form, teacher_bio: e.target.value})}/>
          <div className="mt-3 flex flex-wrap gap-2">
            <div className="text-xs text-ink-900/60 dark:text-white/60 font-bold w-full">مسودات جاهزة (اضغط لملء):</div>
            {ABOUT_DRAFTS.map((d, i) => (
              <button key={i} type="button" onClick={() => setForm({...form, teacher_bio: d.body})}
                className="px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-xs font-bold hover:bg-brand-100">
                #{i+1} — {d.title.slice(0, 22)}...
              </button>
            ))}
          </div>
        </div>

        <button className="btn-primary">حفظ الإعدادات</button>
      </form>
    </AdminLayout>
  );
}

Object.assign(window, {
  AdminLayout, AdminDashboard, AdminCoursesPage, AdminPaymentsPage,
  AdminStudentsPage, AdminReportsPage, AdminSettingsPage,
});
