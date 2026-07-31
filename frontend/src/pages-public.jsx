// ============================================================
// pages-public.jsx — Landing + Courses list
// ============================================================

const motionP = (window.Motion && window.Motion.motion) || {};
const AnimatePresenceP = (window.Motion && window.Motion.AnimatePresence) || (({ children }) => children);

// ---- Landing page ----
function LandingPage() {
  const { tweaks } = useTweaksCtx();
  const dark = tweaks.darkMode;
  const draft = ABOUT_DRAFTS[tweaks.aboutDraft] || ABOUT_DRAFTS[0];
  const [courses, setCourses] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch('/api/courses');
        if (!cancelled) setCourses(Array.isArray(data) ? data : (data.courses || data.items || []));
      } catch {
        if (!cancelled) setCourses(tweaks.sampleData ? SAMPLE_COURSES : []);
      }
    })();
    return () => { cancelled = true; };
  }, [tweaks.sampleData]);

  return (
    <div className="relative flex-1 flex flex-col">
      {tweaks.particlesOn && <Particles count={ANIM_LEVELS[tweaks.animIntensity].particles} dark={dark}/>}

      {/* HERO */}
      <section className="relative overflow-hidden">
        <BlobBg dark={dark} intensity={ANIM_LEVELS[tweaks.animIntensity].blobs}/>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-16 pb-16 md:pb-24 grid md:grid-cols-2 gap-10 items-center">
          {/* Text side */}
          <FadeIn>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light dark:glass-dark mb-6 text-brand-800 dark:text-brand-200 font-bold text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
                منصة أحياء وعلوم متكاملة — عام / أزهر
              </div>
              <h1 className="text-4xl md:text-6xl font-black leading-[1.15] font-cairo text-brand-950 dark:text-white mb-6">
                الأحياء مش صعبة،
                <br/>
                <span className="text-gradient-brand">دي مادتك المفضلة</span>
                <br/>
                <span className="text-2xl md:text-3xl font-bold text-ink-900/70 dark:text-white/70">مع مستر محمد مجدي</span>
              </h1>
              <p className="text-lg text-ink-900/70 dark:text-white/70 mb-8 max-w-lg leading-relaxed">
                كورسات كاملة لأولى وتالتة ثانوي، بأسلوب شرح مختلف بيبسّط أصعب المفاهيم، مع ريلز سريعة للمراجعة قبل الامتحان.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#/register" className="btn-primary inline-flex items-center gap-2 text-base">
                  ابدأ رحلتك دلوقتي <ArrowLeftIcon size={18}/>
                </a>
                <a href="#/courses" className="btn-ghost inline-flex items-center gap-2 text-base">
                  استعرض الكورسات
                </a>
              </div>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-3 gap-3 max-w-md">
                {[
                  { k: 'st1', n: '+12K', l: 'طالب' },
                  { k: 'st2', n: '+80', l: 'محاضرة' },
                  { k: 'st3', n: '+200', l: 'ريل' },
                ].map((s, i) => (
                  <FadeIn key={s.k} delay={0.1 * (i+1)}>
                    <div className="p-4 rounded-2xl glass-light dark:glass-dark text-center">
                      <div className="text-2xl md:text-3xl font-black text-gradient-brand">{s.n}</div>
                      <div className="text-xs text-ink-900/60 dark:text-white/60 font-semibold mt-1">{s.l}</div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Portrait side */}
          <FadeIn delay={0.15}>
            <div className="relative">
              <div className="absolute inset-4 rounded-[3rem] bg-gradient-to-br from-brand-500 via-violet2-500 to-pink-500 blur-2xl opacity-40 dark:opacity-60"/>
              <div className="relative aspect-[4/5] max-w-md mx-auto rounded-[2.5rem] overflow-hidden shadow-brand border-4 border-white/50 dark:border-brand-900/60">
                <img src="assets/teacher.jpg" alt="مستر محمد مجدي" className="w-full h-full object-cover"/>
                {/* floating chips */}
                <motionP.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white/95 backdrop-blur shadow-brand flex items-center gap-2">
                  <DnaIcon size={18} animated={true}/>
                  <span className="text-brand-800 font-black text-sm">أحياء</span>
                </motionP.div>
                <motionP.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute bottom-6 left-6 px-4 py-2 rounded-full bg-brand-700 text-white shadow-brand flex items-center gap-2">
                  <CellIcon size={18}/>
                  <span className="font-black text-sm">علوم متكاملة</span>
                </motionP.div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* GRADES */}
      <section className="relative py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <SectionTitle eyebrow="اختار مرحلتك" title="كورسات متخصصة لكل صف" center/>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { grade: 'first', title: 'أولى ثانوي', desc: 'مقدمة كاملة في الأحياء + العلوم المتكاملة، أساس قوي يبنى عليه.', gradient: 'from-brand-500 to-violet2-500', icon: <MoleculeIcon size={44}/> },
              { grade: 'third', title: 'تالتة ثانوي', desc: 'كل منهج الثانوية العامة والأزهر بترتيب مدروس، مع مراجعات مركزة.', gradient: 'from-violet2-600 to-pink-500', icon: <DnaIcon size={44} animated={false} color="#fff"/> },
            ].map((g, i) => (
              <FadeIn key={g.grade} delay={0.1 * i}>
                <a href={`#/courses?grade=${g.grade}`}
                  className="group block relative overflow-hidden rounded-[2rem] p-8 md:p-10 bg-gradient-to-br shadow-brand hover:shadow-glow-brand transition-all"
                  style={{}}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${g.gradient}`}/>
                  <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-white/10 blur-3xl"/>
                  <div className="relative text-white">
                    <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      {g.icon}
                    </div>
                    <h3 className="text-3xl font-black mb-2">{g.title}</h3>
                    <p className="text-white/85 mb-6 text-base">{g.desc}</p>
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur font-bold text-sm">
                      استعرض الكورسات <ArrowLeftIcon size={16}/>
                    </span>
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="relative py-16 md:py-20 px-4 md:px-6 bg-gradient-to-b from-transparent via-brand-50/50 to-transparent dark:via-brand-950/30">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[auto,1fr] gap-8 items-center">
          <FadeIn>
            <div className="relative w-48 h-48 md:w-60 md:h-60 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-violet2-500 rounded-full blur-2xl opacity-40"/>
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-brand-900 shadow-brand">
                <img src="assets/teacher.jpg" alt="" className="w-full h-full object-cover"/>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 mb-4 text-brand-700 dark:text-violet2-400 font-bold text-sm">
                <DnaIcon size={20}/> عن المعلم
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-brand-950 dark:text-white mb-4 font-cairo">{draft.title}</h2>
              <p className="text-lg leading-relaxed text-ink-900/75 dark:text-white/75">{draft.body}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FEATURED COURSES */}
      <section className="relative py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <SectionTitle eyebrow="آخر ما تم إضافته" title="كورسات جاهزة تنطلق فيها" sub="اختار كورسك وابدأ بأي درس. المشاهدة مفتوحة بمجرد الاشتراك."/>
          {courses === null && (
            <div className="grid md:grid-cols-3 gap-5">
              {[1,2,3].map(i => <SkeletonCard key={i}/>)}
            </div>
          )}
          {courses && courses.length === 0 && (
            <EmptyState
              icon={<CellIcon size={48}/>}
              title="لسه محدش نزّل كورس"
              sub="متابعنا! أول كورس قريبًا جدًا."
              action={<a href="#/register" className="btn-primary">سجّل حسابك دلوقتي</a>}/>
          )}
          {courses && courses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.slice(0, 6).map((c, i) => <CourseCard key={c.id} course={c} index={i}/>)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[2.5rem] p-8 md:p-14 text-center text-white shadow-brand">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-violet2-600 to-pink-600"/>
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-3xl"/>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-black/10 blur-3xl"/>
          <div className="relative">
            <MoleculeIcon size={56} className="mx-auto mb-4 opacity-90"/>
            <h2 className="text-3xl md:text-5xl font-black mb-4 font-cairo">جاهز تبدأ رحلتك؟</h2>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              اشترك دلوقتي، ادخل على كل الكورسات والريلز والمحاضرات، وابدأ أول درس فورًا.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="#/register" className="px-8 py-4 rounded-2xl bg-white text-brand-800 font-black hover:scale-105 transition-transform shadow-xl">
                سجّل حسابك مجانًا
              </a>
              <a href="#/login" className="px-8 py-4 rounded-2xl bg-white/15 backdrop-blur border-2 border-white/30 text-white font-black hover:bg-white/25">
                عندي حساب — دخول
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ---- Reusable Course card ----
function CourseCard({ course, index = 0 }) {
  const gradient = course.cover_color || 'from-brand-500 to-violet2-500';
  const reels = countLessons(course, 'reel');
  const lectures = countLessons(course, 'lecture');
  return (
    <FadeIn delay={0.06 * index}>
      <a href={`#/dash/course/${course.id}`}
        className="group block rounded-3xl overflow-hidden bg-white dark:bg-ink-900 shadow-soft hover:shadow-brand border border-brand-100 dark:border-brand-900/40 transition-all hover:-translate-y-1">
        <div className={`relative h-40 bg-gradient-to-br ${gradient} overflow-hidden`}>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/20 blur-2xl"/>
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/25 backdrop-blur text-white text-xs font-black">
            {gradeName(course.grade)}
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:scale-110 transition-transform">
            <DnaIcon size={64} animated={false} color="#fff"/>
          </div>
        </div>
        <div className="p-5 text-right">
          <h3 className="text-lg font-black text-brand-950 dark:text-white mb-2 line-clamp-1">{course.title}</h3>
          {course.description && <p className="text-sm text-ink-900/60 dark:text-white/60 mb-4 line-clamp-2 leading-relaxed">{course.description}</p>}
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/40 text-brand-800 dark:text-brand-200 font-bold">
              <FilmIcon size={14}/> {fmtNum(reels)} ريل
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet2-500/10 text-violet2-700 dark:text-violet2-300 font-bold">
              <BookIcon size={14}/> {fmtNum(lectures)} محاضرة
            </span>
          </div>
        </div>
      </a>
    </FadeIn>
  );
}
function countLessons(course, type) {
  if (!course.units) return course[`${type}_count`] || 0;
  return course.units.reduce((acc, u) => acc + (u.lessons || []).filter(l => l.content_type === type).length, 0);
}

// ---- Courses list page ----
function CoursesPage() {
  const { tweaks } = useTweaksCtx();
  const [courses, setCourses] = React.useState(null);
  const [grade, setGrade] = React.useState(() => {
    const params = new URLSearchParams(location.hash.split('?')[1] || '');
    return params.get('grade') || 'all';
  });

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch('/api/courses');
        if (!cancelled) setCourses(Array.isArray(data) ? data : (data.courses || data.items || []));
      } catch {
        if (!cancelled) setCourses(tweaks.sampleData ? SAMPLE_COURSES : []);
      }
    })();
    return () => { cancelled = true; };
  }, [tweaks.sampleData]);

  const filtered = React.useMemo(() => {
    if (!courses) return null;
    if (grade === 'all') return courses;
    return courses.filter(c => c.grade === grade);
  }, [courses, grade]);

  return (
    <div className="relative flex-1">
      <BlobBg dark={tweaks.darkMode} intensity={0.25}/>
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <SectionTitle eyebrow="الكورسات" title="اختار الكورس اللي يناسبك"/>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { v: 'all', l: 'الكل' },
            { v: 'first', l: 'أولى ثانوي' },
            { v: 'third', l: 'تالتة ثانوي' },
          ].map(f => (
            <button key={f.v} onClick={() => setGrade(f.v)}
              className={`px-5 py-2.5 rounded-full font-bold transition-all ${
                grade === f.v
                  ? 'bg-gradient-to-l from-brand-700 to-violet2-600 text-white shadow-brand scale-105'
                  : 'bg-white dark:bg-ink-900 text-ink-900/70 dark:text-white/70 border border-brand-100 dark:border-brand-900/40 hover:bg-brand-50 dark:hover:bg-brand-900/40'
              }`}>
              {f.l}
            </button>
          ))}
        </div>

        {filtered === null && (
          <div className="grid md:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i}/>)}
          </div>
        )}
        {filtered && filtered.length === 0 && (
          <EmptyState icon={<CellIcon size={48}/>} title="لا يوجد كورسات في الصف ده لسه"
            sub="جرب صف تاني أو رجع بعدين."
            action={<button onClick={() => setGrade('all')} className="btn-ghost">عرض كل الكورسات</button>}/>
        )}
        {filtered && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((c, i) => <CourseCard key={c.id} course={c} index={i}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { LandingPage, CoursesPage, CourseCard, countLessons });
