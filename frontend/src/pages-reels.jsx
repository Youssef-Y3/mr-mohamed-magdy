// ============================================================
// pages-reels.jsx — TikTok-style vertical reels experience
// ============================================================

const motionR = (window.Motion && window.Motion.motion) || {};

function ReelsPage() {
  const { tweaks } = useTweaksCtx();
  const { user } = useAuth();
  const toast = useToast();
  const [reels, setReels] = React.useState(null);
  const [active, setActive] = React.useState(0);
  const containerRef = React.useRef(null);
  const [ripple, setRipple] = React.useState(null);

  // Load all reels for the student's grade directly from /api/reels.
  React.useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch('/api/reels');
        const list = Array.isArray(data) ? data : (data.reels || []);
        if (list.length === 0 && tweaks.sampleData) {
          const grade = user?.grade || 'first';
          setReels(collectReels(SAMPLE_COURSES.filter(c => c.grade === grade)));
        } else {
          setReels(list);
        }
      } catch {
        const grade = user?.grade || 'first';
        setReels(tweaks.sampleData ? collectReels(SAMPLE_COURSES.filter(c => c.grade === grade)) : []);
      }
    })();
  }, [user, tweaks.sampleData]);

  // Handle scroll snap
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollTop / el.clientHeight);
      if (idx !== active) {
        setActive(idx);
        setRipple(Date.now());
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [active]);

  if (reels === null) return (
    <div className="flex items-center justify-center h-[100dvh] bg-ink-950">
      <CellLoader size={50} label="جاري تحميل الريلز..."/>
    </div>
  );

  if (reels.length === 0) {
    return (
      <div className="min-h-[100dvh] bg-ink-950 text-white flex items-center justify-center p-6">
        <EmptyState icon={<FilmIcon size={44} className="text-brand-300"/>}
          title="لسه محدش نزّل ريلز"
          sub="متابعنا! ريلز جديدة قادمة قريبًا."
          action={<a href="#/dash" className="btn-primary">رجوع للوحة</a>}/>
      </div>
    );
  }

  return (
    <div className="relative bg-ink-950 h-[100dvh] w-full overflow-hidden">
      {/* Back button */}
      <a href="#/dash" className="fixed top-4 right-4 z-30 w-11 h-11 rounded-full bg-white/15 backdrop-blur border border-white/20 text-white flex items-center justify-center hover:bg-white/25 transition-colors">
        <CloseIcon size={22}/>
      </a>

      {/* Reels list */}
      <div ref={containerRef} className="reels-scroll">
        {reels.map((reel, idx) => (
          <ReelItem key={reel.id} reel={reel} active={idx === active} index={idx} total={reels.length}/>
        ))}
      </div>

      {/* Ripple transition */}
      {ripple && (
        <div key={ripple} className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center">
          <span className="ripple-anim w-40 h-40 rounded-full border-4 border-violet2-400/60"/>
        </div>
      )}

      {/* Progress dots on the right side */}
      <div className="fixed left-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1.5">
        {reels.slice(Math.max(0, active - 3), active + 4).map((_, i, arr) => {
          const realI = Math.max(0, active - 3) + i;
          return (
            <div key={realI}
              className={`w-1 rounded-full transition-all ${
                realI === active ? 'h-8 bg-white' : 'h-1.5 bg-white/40'
              }`}/>
          );
        })}
      </div>
    </div>
  );
}

// ---- Single Reel ----
function ReelItem({ reel, active, index, total }) {
  const [blobUrl, setBlobUrl] = React.useState(null);
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState(null);
  const [playing, setPlaying] = React.useState(false);
  const [liked, setLiked] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const videoRef = React.useRef(null);
  const loadOnceRef = React.useRef(false);

  // Load video when this reel becomes active (once)
  React.useEffect(() => {
    if (!active || loadOnceRef.current) return;
    loadOnceRef.current = true;
    let cancelled = false;
    (async () => {
      try {
        const blob = await fetchVideoBlob(reel.id, (p) => { if (!cancelled) setProgress(p); }, 45000);
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      } catch (e) {
        if (!cancelled) setError(e.message || 'فشل تحميل الريل');
      }
    })();
    return () => { cancelled = true; };
  }, [active, reel.id]);

  // Auto play when active
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v || !blobUrl) return;
    if (active) {
      v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      v.pause();
      setPlaying(false);
    }
  }, [active, blobUrl]);

  // Cleanup blob url
  React.useEffect(() => () => { if (blobUrl) URL.revokeObjectURL(blobUrl); }, [blobUrl]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  return (
    <div className="reel-item relative flex items-center justify-center bg-gradient-to-b from-ink-950 via-brand-950 to-ink-950">
      {/* Placeholder animated background when video missing */}
      {!blobUrl && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <BlobBg dark={true} intensity={0.6}/>
          <div className="relative z-10 text-center px-6">
            <CellLoader size={54}/>
            <div className="mt-6 text-white/80 font-bold">جاري تحميل الريل...</div>
            {progress > 0 && (
              <div className="mt-4 w-56 mx-auto">
                <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
                  <div className="h-full bg-gradient-to-l from-brand-400 to-violet2-400 transition-all" style={{ width: `${progress}%` }}/>
                </div>
                <div className="text-xs text-white/60 mt-2">{progress}%</div>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 backdrop-blur border border-red-400/40 mx-auto mb-4 flex items-center justify-center">
              <CloseIcon className="text-red-300"/>
            </div>
            <div className="text-white font-bold mb-2">{error}</div>
            <button onClick={() => { setError(null); loadOnceRef.current = false; }}
              className="mt-3 btn-primary text-sm">إعادة المحاولة</button>
          </div>
        </div>
      )}

      {blobUrl && (
        <video
          ref={videoRef}
          src={blobUrl}
          className="w-full h-full object-cover"
          playsInline
          loop
          muted={muted}
          onClick={togglePlay}
        />
      )}

      {/* Play overlay */}
      {blobUrl && !playing && (
        <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <div className="w-20 h-20 rounded-full bg-white/25 backdrop-blur border border-white/40 flex items-center justify-center">
            <PlayIcon size={36} className="text-white"/>
          </div>
        </button>
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none"/>
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"/>

      {/* Info bottom-right */}
      <div className="absolute bottom-24 right-4 left-24 z-20 text-white">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur border border-white/25 mb-3 text-xs font-black">
          <DnaIcon size={14} animated={false} color="#fff"/>
          {reel.course_title}
        </div>
        <div className="text-white/70 text-xs font-semibold mb-1">{reel.unit_title}</div>
        <h2 className="text-2xl md:text-3xl font-black leading-tight font-cairo drop-shadow-lg">{reel.title}</h2>
        <div className="text-white/60 text-xs mt-2 font-bold">{fmtTime(reel.duration)} · {gradeName(reel.grade)}</div>
      </div>

      {/* Action buttons (left side, RTL: user's finger reach = left in RTL is 'right' for actions in TikTok's mirror) */}
      <div className="absolute bottom-24 left-3 z-20 flex flex-col items-center gap-4">
        <button onClick={() => setLiked(v => !v)}
          className={`w-12 h-12 rounded-full backdrop-blur border border-white/25 flex items-center justify-center transition-all ${
            liked ? 'bg-red-500 text-white scale-110' : 'bg-white/15 text-white hover:bg-white/25'
          }`}>
          <HeartIcon filled={liked}/>
        </button>
        <button onClick={() => setSaved(v => !v)}
          className={`w-12 h-12 rounded-full backdrop-blur border border-white/25 flex items-center justify-center transition-all ${
            saved ? 'bg-amber-500 text-white scale-110' : 'bg-white/15 text-white hover:bg-white/25'
          }`}>
          <BookmarkIcon filled={saved}/>
        </button>
        <button className="w-12 h-12 rounded-full bg-white/15 backdrop-blur border border-white/25 text-white hover:bg-white/25 flex items-center justify-center">
          <ShareIcon/>
        </button>
        <button onClick={() => setMuted(m => !m)}
          className="w-12 h-12 rounded-full bg-white/15 backdrop-blur border border-white/25 text-white hover:bg-white/25 flex items-center justify-center">
          <VolumeIcon muted={muted}/>
        </button>
        <div className="text-white/60 text-[10px] font-black">{index + 1}/{total}</div>
      </div>

      {/* Swipe hint (only on first) */}
      {index === 0 && active && (
        <motionR.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 1, 0], y: [20, 0, -20] }}
          transition={{ duration: 2.5, repeat: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/80 text-xs font-bold flex flex-col items-center gap-1">
          <ChevronDownIcon size={22}/>
          اسحب للأعلى للريل التالي
        </motionR.div>
      )}
    </div>
  );
}

// collectReels kept for sample-data fallback only (SAMPLE_COURSES still has nested units).
function collectReels(courses) {
  const reels = [];
  (courses || []).forEach(c => {
    (c.units || []).forEach(u => {
      (u.lessons || []).forEach(l => {
        if (l.content_type === 'reel') {
          reels.push({ ...l, course_title: c.title, unit_title: u.title, course_id: c.id, grade: c.grade });
        }
      });
    });
  });
  return reels;
}

Object.assign(window, { ReelsPage, collectReels });
