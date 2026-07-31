// ============================================================
// pages-student.jsx — Student dashboard, courses list, course detail, subscription
// ============================================================

const motionS = (window.Motion && window.Motion.motion) || {};

// ---- Guard ----
function RequireAuth({ children, role = 'student' }) {
  const { token, role: userRole } = useAuth();
  React.useEffect(() => {
    if (!token) { navigate('/login', true); return; }
    if (role === 'admin' && userRole !== 'admin') navigate('/admin/login', true);
  }, [token, userRole, role]);
  if (!token) return null;
  if (role === 'admin' && userRole !== 'admin') return null;
  return children;
}

// ---- Student layout wrapper ----
function StudentLayout({ children }) {
  const { tweaks } = useTweaksCtx();
  return (
    <div className="flex-1 flex flex-col relative">
      {tweaks.particlesOn && <Particles count={16} dark={tweaks.darkMode}/>}
      {children}
    </div>
  );
}

// ---- Student home / dashboard ----
function StudentDashboard() {
  const { user } = useAuth();
  const { tweaks } = useTweaksCtx();
  const [progress] = React.useState(SAMPLE_PROGRESS); // (real API not documented)
  const [courses, setCourses] = React.useState(null);
  const [payInfo, setPayInfo] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch('/api/courses');
        setCourses(Array.isArray(data) ? data : (data.courses || data.items || []));
      } catch { setCourses(tweaks.sampleData ? SAMPLE_COURSES : []); }
      try {
        const info = await apiFetch('/api/payment/my');
        setPayInfo(info);
      } catch { /* silent */ }
    })();
  }, [tweaks.sampleData]);

  const grade = user?.grade || 'first';
  const myCourses = courses ? courses.filter(c => c.grade === grade) : null;

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10 w-full">
        {/* Welcome hero */}
        <FadeIn>
          <div className="relative rounded-3xl overflow-hidden p-6 md:p-10 bg-gradient-to-br from-brand-700 via-violet2-600 to-brand-800 text-white mb-8 shadow-brand">
            <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl"/>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-black/20 blur-3xl"/>
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="text-white/70 text-sm mb-2 font-semibold">أهلاً بك يا</div>
                <h1 className="text-3xl md:text-4xl font-black font-cairo mb-2">{user?.name || 'الطالب'} 👋</h1>
                <div className="text-white/80">{gradeName(grade)} · اتمنى لك يوم دراسي مفيد</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-black">{fmtNum(progress.streak_days)}</div>
                  <div className="text-xs text-white/70 font-semibold">يوم متتالي 🔥</div>
                </div>
                <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                  <DnaIcon size={44} animated={true} color="#fff"/>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Cards row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <FadeIn delay={0.05}>
            <div className="rounded-3xl p-5 bg-white dark:bg-ink-900 border border-brand-100 dark:border-brand-900/40 shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center">
                  <ChartIcon size={22}/>
                </div>
                <div className="text-ink-900/60 dark:text-white/60 font-bold text-sm">نسبة إنجازك</div>
              </div>
              <div className="text-3xl font-black text-brand-950 dark:text-white mb-3">{progress.overall_percent}%</div>
              <div className="h-2 rounded-full bg-brand-100 dark:bg-brand-900/40 overflow-hidden">
                <div className="h-full bg-gradient-to-l from-brand-700 to-violet2-500 rounded-full transition-all"
                     style={{ width: `${progress.overall_percent}%` }}/>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="rounded-3xl p-5 bg-white dark:bg-ink-900 border border-brand-100 dark:border-brand-900/40 shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <CheckIcon size={22}/>
                </div>
                <div className="text-ink-900/60 dark:text-white/60 font-bold text-sm">حالة الاشتراك</div>
              </div>
              <div className="text-2xl font-black text-brand-950 dark:text-white mb-1">
                {progress.subscription.status === 'active' ? 'فعّال' : 'غير فعّال'}
              </div>
              <div className="text-xs text-ink-900/60 dark:text-white/60">
                ينتهي: {progress.subscription.expires_at}
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <a href={`#/dash/lecture/${progress.last_lesson.id}`}
              className="rounded-3xl p-5 bg-gradient-to-br from-brand-700 to-violet2-600 text-white block hover:scale-[1.02] transition-transform">
              <div className="text-white/70 text-sm font-bold mb-2">آخر محاضرة</div>
              <div className="font-black text-lg mb-3 line-clamp-1">{progress.last_lesson.title}</div>
              <div className="flex items-center justify-between text-sm">
                <span>{Math.round(progress.last_lesson.position / progress.last_lesson.duration * 100)}%</span>
                <span className="inline-flex items-center gap-1 font-bold">
                  <PlayIcon size={14}/> كمّل من هنا
                </span>
              </div>
            </a>
          </FadeIn>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { icon: <FilmIcon size={24}/>,  label: 'الريلز',       href: '#/dash/reels', color: 'from-pink-500 to-violet2-500' },
            { icon: <BookIcon size={24}/>,  label: 'الكورسات',     href: '#/dash/courses', color: 'from-brand-500 to-cyan-500' },
            { icon: <WalletIcon size={24}/>,label: 'الاشتراك',      href: '#/dash/subscribe', color: 'from-amber-500 to-orange-500' },
            { icon: <SettingsIcon size={24}/>,label: 'الإعدادات', href: '#/dash', color: 'from-emerald-500 to-cyan-500' },
          ].map((a, i) => (
            <FadeIn key={i} delay={0.05 * i}>
              <a href={a.href}
                className={`block p-4 rounded-2xl bg-gradient-to-br ${a.color} text-white text-center hover:scale-105 transition-transform shadow-soft`}>
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur mx-auto mb-2 flex items-center justify-center">
                  {a.icon}
                </div>
                <div className="font-black text-sm">{a.label}</div>
              </a>
            </FadeIn>
          ))}
        </div>

        {/* My courses */}
        <SectionTitle eyebrow="كورسات صفك" title={`المتاح لـ${gradeName(grade)}`}/>
        {myCourses === null && <div className="grid md:grid-cols-3 gap-5">{[1,2,3].map(i => <SkeletonCard key={i}/>)}</div>}
        {myCourses && myCourses.length === 0 && (
          <EmptyState title="لسه محدش نزّل كورس لصفك" sub="متابعنا! أول كورس قريبًا جدًا."/>
        )}
        {myCourses && myCourses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myCourses.map((c, i) => <CourseCard key={c.id} course={c} index={i}/>)}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

// ---- Student courses list (all his grade courses) ----
function StudentCoursesPage() {
  const { user } = useAuth();
  const { tweaks } = useTweaksCtx();
  const [courses, setCourses] = React.useState(null);
  const [tab, setTab] = React.useState('all');

  React.useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch('/api/courses');
        setCourses(Array.isArray(data) ? data : (data.courses || data.items || []));
      } catch { setCourses(tweaks.sampleData ? SAMPLE_COURSES : []); }
    })();
  }, [tweaks.sampleData]);

  const grade = user?.grade || 'first';
  const myCourses = courses ? courses.filter(c => c.grade === grade) : null;

  // Split by content type based on if course has any reels/lectures
  const filtered = React.useMemo(() => {
    if (!myCourses) return null;
    if (tab === 'reel') return myCourses.filter(c => countLessons(c, 'reel') > 0);
    if (tab === 'lecture') return myCourses.filter(c => countLessons(c, 'lecture') > 0);
    return myCourses;
  }, [myCourses, tab]);

  return (
    <StudentLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <SectionTitle eyebrow={gradeName(grade)} title="كل الكورسات المتاحة لك"/>

        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { v: 'all', l: 'الكل', icon: null },
            { v: 'reel', l: 'الريلز', icon: <FilmIcon size={16}/> },
            { v: 'lecture', l: 'المحاضرات', icon: <BookIcon size={16}/> },
          ].map(t => (
            <button key={t.v} onClick={() => setTab(t.v)}
              className={`px-5 py-2.5 rounded-full font-bold transition-all inline-flex items-center gap-2 ${
                tab === t.v
                  ? 'bg-gradient-to-l from-brand-700 to-violet2-600 text-white shadow-brand'
                  : 'bg-white dark:bg-ink-900 text-ink-900/70 dark:text-white/70 border border-brand-100 dark:border-brand-900/40'
              }`}>{t.icon}{t.l}</button>
          ))}
        </div>

        {filtered === null && <div className="grid md:grid-cols-3 gap-5">{[1,2,3,4,5,6].map(i => <SkeletonCard key={i}/>)}</div>}
        {filtered && filtered.length === 0 && (
          <EmptyState title="لا يوجد" sub="جرب فلتر تاني"/>
        )}
        {filtered && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((c, i) => <CourseCard key={c.id} course={c} index={i}/>)}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

// ---- Course detail (units + lessons list) ----
function CourseDetailPage({ courseId }) {
  const { tweaks } = useTweaksCtx();
  const [course, setCourse] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch(`/api/courses/${courseId}`);
        setCourse(data.course || data);
      } catch {
        const found = (tweaks.sampleData ? SAMPLE_COURSES : []).find(c => c.id === courseId);
        setCourse(found || null);
      }
    })();
  }, [courseId, tweaks.sampleData]);

  if (!course) return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto py-16"><CellLoader size={44} label="جاري تحميل الكورس..."/></div>
    </StudentLayout>
  );

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10">
        {/* Header */}
        <FadeIn>
          <div className={`relative rounded-[2rem] p-6 md:p-10 mb-8 overflow-hidden text-white shadow-brand`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${course.cover_color || 'from-brand-700 to-violet2-600'}`}/>
            <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-white/10 blur-3xl"/>
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur mb-4 text-xs font-black">
                {gradeName(course.grade)}
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-3 font-cairo">{course.title}</h1>
              {course.description && <p className="text-white/85 max-w-2xl text-base md:text-lg leading-relaxed">{course.description}</p>}
              <div className="flex flex-wrap gap-2 mt-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur font-bold text-sm">
                  <FilmIcon size={16}/> {fmtNum(countLessons(course, 'reel'))} ريل
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur font-bold text-sm">
                  <BookIcon size={16}/> {fmtNum(countLessons(course, 'lecture'))} محاضرة
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur font-bold text-sm">
                  <UsersIcon size={16}/> {fmtNum((course.units || []).length)} وحدة
                </span>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Units */}
        <div className="space-y-5">
          {(course.units || []).map((unit, uIdx) => (
            <FadeIn key={unit.id || uIdx} delay={0.05 * uIdx}>
              <div className="rounded-3xl bg-white dark:bg-ink-900 border border-brand-100 dark:border-brand-900/40 shadow-soft overflow-hidden">
                <div className="p-5 md:p-6 flex items-center gap-4 border-b border-brand-100 dark:border-brand-900/40">
                  <div className="w-11 h-11 rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center font-black text-lg">
                    {uIdx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg text-brand-950 dark:text-white">{unit.title}</h3>
                    <div className="text-xs text-ink-900/60 dark:text-white/60 mt-0.5">{(unit.lessons || []).length} درس</div>
                  </div>
                </div>
                <div className="divide-y divide-brand-50 dark:divide-brand-900/40">
                  {(unit.lessons || []).map((lesson) => (
                    <a key={lesson.id}
                      href={lesson.content_type === 'reel' ? `#/dash/reels?start=${lesson.id}` : `#/dash/lecture/${lesson.id}`}
                      className="flex items-center gap-4 p-4 md:p-5 hover:bg-brand-50/60 dark:hover:bg-brand-900/20 transition-colors group">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        lesson.content_type === 'reel'
                          ? 'bg-gradient-to-br from-pink-500 to-violet2-500 text-white'
                          : 'bg-gradient-to-br from-brand-600 to-violet2-600 text-white'
                      }`}>
                        {lesson.content_type === 'reel' ? <FilmIcon size={22}/> : <PlayIcon size={22}/>}
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <div className="font-bold text-brand-950 dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors line-clamp-1">
                          {lesson.title}
                        </div>
                        <div className="text-xs text-ink-900/60 dark:text-white/60 mt-0.5 flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full font-bold ${
                            lesson.content_type === 'reel'
                              ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300'
                              : 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                          }`}>
                            {lesson.content_type === 'reel' ? 'ريل' : 'محاضرة'}
                          </span>
                          <span>{fmtTime(lesson.duration)}</span>
                        </div>
                      </div>
                      <div className="text-brand-700 dark:text-brand-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowLeftIcon size={20}/>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
}

// ---- Subscription plans ----
function SubscribePage() {
  const { tweaks } = useTweaksCtx();
  const [info, setInfo] = React.useState(null);
  const [selected, setSelected] = React.useState('term');

  React.useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch('/api/payment/info');
        setInfo(data);
      } catch {
        if (tweaks.sampleData) setInfo(SAMPLE_PAYMENT_INFO);
        else setInfo(SAMPLE_PAYMENT_INFO); // still show plan structure
      }
    })();
  }, [tweaks.sampleData]);

  if (!info) return <StudentLayout><div className="py-16"><CellLoader label="جاري تحميل الأسعار..."/></div></StudentLayout>;

  const plans = [
    { key: 'monthly', label: 'شهر واحد',  price: info.price_monthly, badge: null,       desc: 'جرّب المنصة، اشتراك مرن' },
    { key: 'term',    label: 'ترم دراسي', price: info.price_term,    badge: 'الأكثر طلبًا', desc: 'أوفر — يغطي ترم كامل' },
    { key: 'yearly',  label: 'سنة كاملة', price: info.price_yearly,  badge: 'أوفر',      desc: 'وفّر أكتر، ادرس طول السنة' },
  ];

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <SectionTitle eyebrow="اشتراكات" title="اختار الخطة اللي تناسبك" sub="كل الخطط بتفتحلك كل المحتوى — الريلز، المحاضرات، الكورسات كاملة." center/>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {plans.map((p, i) => {
            const isSel = selected === p.key;
            const isRec = p.badge === 'الأكثر طلبًا';
            return (
              <FadeIn key={p.key} delay={0.08 * i}>
                <div onClick={() => setSelected(p.key)}
                  className={`relative rounded-[2rem] p-6 md:p-8 cursor-pointer border-2 transition-all ${
                    isSel
                      ? 'border-brand-700 bg-gradient-to-br from-brand-700 to-violet2-600 text-white shadow-brand -translate-y-2'
                      : 'border-brand-100 dark:border-brand-900/40 bg-white dark:bg-ink-900 shadow-soft hover:-translate-y-1'
                  }`}>
                  {p.badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full font-black text-xs shadow-brand ${
                      isSel ? 'bg-white text-brand-800' : (isRec ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white')
                    }`}>{p.badge}</div>
                  )}
                  <div className={`text-sm font-bold ${isSel ? 'text-white/80' : 'text-ink-900/60 dark:text-white/60'}`}>{p.desc}</div>
                  <div className={`text-2xl font-black mt-2 ${isSel ? 'text-white' : 'text-brand-950 dark:text-white'}`}>{p.label}</div>
                  <div className={`mt-4 flex items-baseline gap-2 ${isSel ? 'text-white' : 'text-brand-950 dark:text-white'}`}>
                    <span className="text-5xl font-black">{fmtNum(p.price)}</span>
                    <span className={`text-sm font-bold ${isSel ? 'text-white/80' : 'text-ink-900/60 dark:text-white/60'}`}>ج.م</span>
                  </div>
                  <ul className={`mt-6 space-y-2 text-sm ${isSel ? 'text-white/90' : 'text-ink-900/75 dark:text-white/75'}`}>
                    {['كل الكورسات مفتوحة', 'ريلز ومحاضرات', 'تتبع تقدمك', 'دعم فني سريع'].map(f => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckIcon size={16} className={isSel ? 'text-white' : 'text-emerald-500'}/> {f}
                      </li>
                    ))}
                  </ul>
                  {isSel && (
                    <a href={`#/dash/pay?plan=${p.key}`}
                      className="mt-6 block text-center py-3 rounded-2xl bg-white text-brand-800 font-black hover:scale-105 transition-transform">
                      اشترك الآن
                    </a>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>

        <div className="max-w-2xl mx-auto mt-10 text-center text-sm text-ink-900/60 dark:text-white/60">
          الدفع بفودافون كاش أو انستاباي — بعد التحويل ارفع صورة الإيصال وهيتم تفعيل الاشتراك خلال ساعات.
        </div>
      </div>
    </StudentLayout>
  );
}

Object.assign(window, {
  RequireAuth, StudentLayout, StudentDashboard,
  StudentCoursesPage, CourseDetailPage, SubscribePage,
});
