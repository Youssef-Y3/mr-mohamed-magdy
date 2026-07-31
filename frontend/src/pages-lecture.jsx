// ============================================================
// pages-lecture.jsx — Full custom video player for lectures
// ============================================================

const motionL = (window.Motion && window.Motion.motion) || {};

function LecturePage({ lessonId }) {
  const { tweaks } = useTweaksCtx();
  const toast = useToast();

  const [lesson, setLesson] = React.useState(null);
  const [blobUrl, setBlobUrl] = React.useState(null);
  const [loadProgress, setLoadProgress] = React.useState(0);
  const [error, setError] = React.useState(null);
  const [reloadKey, setReloadKey] = React.useState(0);
  const [showCompleteConfetti, setShowCompleteConfetti] = React.useState(false);

  // Lesson metadata
  React.useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch(`/api/lessons/${lessonId}`);
        setLesson(data.lesson || data);
      } catch {
        // fallback to sample
        for (const c of SAMPLE_COURSES) {
          for (const u of (c.units || [])) {
            const l = (u.lessons || []).find(x => x.id === lessonId);
            if (l) { setLesson({ ...l, course_title: c.title, unit_title: u.title }); return; }
          }
        }
        setLesson({ id: lessonId, title: 'الدرس', content_type: 'lecture', duration: 0 });
      }
    })();
  }, [lessonId]);

  // Fetch video blob
  React.useEffect(() => {
    let cancelled = false;
    setError(null); setBlobUrl(null); setLoadProgress(0);
    (async () => {
      try {
        const blob = await fetchVideoBlob(lessonId, (p) => { if (!cancelled) setLoadProgress(Math.max(0, p)); }, 45000);
        if (cancelled) return;
        setBlobUrl(URL.createObjectURL(blob));
      } catch (e) {
        if (!cancelled) setError(e.message || 'فشل تحميل الفيديو');
      }
    })();
    return () => { cancelled = true; };
  }, [lessonId, reloadKey]);

  React.useEffect(() => () => { if (blobUrl) URL.revokeObjectURL(blobUrl); }, [blobUrl]);

  const onComplete = React.useCallback(() => {
    setShowCompleteConfetti(true);
    toast.show('برافو! خلّصت المحاضرة كاملة 🎉', 'success');
    setTimeout(() => setShowCompleteConfetti(false), 1500);
    apiFetch(`/api/lessons/${lessonId}/progress`, {
      method: 'POST',
      body: { position_seconds: 0, completed: true },
    }).catch(() => {});
  }, [lessonId, toast]);

  const savePosition = React.useCallback((pos) => {
    apiFetch(`/api/lessons/${lessonId}/progress`, {
      method: 'POST',
      body: { position_seconds: Math.floor(pos), completed: false },
    }).catch(() => {});
  }, [lessonId]);

  return (
    <div className="min-h-[100dvh] bg-ink-950 text-white">
      <Confetti show={showCompleteConfetti}/>

      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-ink-950/80 border-b border-brand-900/40">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <a href="#/dash" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center">
            <ArrowRightIcon size={20}/>
          </a>
          <div className="flex-1 text-center min-w-0">
            <div className="text-xs text-white/50 font-bold truncate">{lesson?.course_title || 'محاضرة'}</div>
            <div className="text-sm md:text-base font-black text-white truncate">{lesson?.title || '...'}</div>
          </div>
          <div className="w-10 h-10"/>
        </div>
      </div>

      {/* Video area */}
      <div className="relative max-w-6xl mx-auto p-4 md:p-6">
        <div className="relative aspect-video rounded-2xl md:rounded-3xl overflow-hidden bg-ink-950 border border-brand-900/40 shadow-brand">
          {/* Loading */}
          {!blobUrl && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-ink-950 via-brand-950 to-ink-950">
              <BlobBg dark={true} intensity={0.4}/>
              <div className="relative z-10 text-center">
                <CellLoader size={60}/>
                <div className="mt-6 text-white/80 font-bold text-lg">جاري تحميل المحاضرة...</div>
                <div className="mt-6 w-72 mx-auto">
                  <div className="flex items-center justify-between text-xs text-white/60 mb-2 font-bold">
                    <span>يتم فك تشفير الفيديو من السيرفر بأمان</span>
                    <span>{loadProgress > 0 ? `${loadProgress}%` : '...'}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    {loadProgress > 0 ? (
                      <div className="h-full bg-gradient-to-l from-brand-400 to-violet2-400 transition-all"
                           style={{ width: `${Math.max(5, loadProgress)}%` }}/>
                    ) : (
                      <div className="h-full shimmer bg-white/10"/>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 rounded-3xl bg-red-500/20 backdrop-blur border border-red-400/40 mx-auto mb-4 flex items-center justify-center">
                  <CloseIcon size={32} className="text-red-300"/>
                </div>
                <div className="text-white font-black text-xl mb-2">حصلت مشكلة</div>
                <div className="text-white/70 mb-5">{error}</div>
                <button onClick={() => setReloadKey(k => k + 1)} className="btn-primary">إعادة المحاولة</button>
              </div>
            </div>
          )}

          {/* Player */}
          {blobUrl && (
            <CustomVideoPlayer
              src={blobUrl}
              initialPosition={lesson?.progress?.position_seconds}
              onProgressSave={savePosition}
              onEnded={onComplete}
            />
          )}
        </div>

        {/* Lesson meta below */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-900/40 border border-brand-700/30 font-bold">
            <BookIcon size={16}/> محاضرة كاملة
          </span>
          {lesson?.unit_title && <span className="text-white/60 font-semibold">{lesson.unit_title}</span>}
          {lesson?.duration && <span className="text-white/60 font-semibold">مدة: {fmtTime(lesson.duration)}</span>}
        </div>
      </div>
    </div>
  );
}

// ---- Custom video player with themed controls (no watermark) ----
function CustomVideoPlayer({ src, initialPosition = 0, onProgressSave, onEnded }) {
  const videoRef = React.useRef(null);
  const wrapperRef = React.useRef(null);
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(false);
  const [current, setCurrent] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [buffered, setBuffered] = React.useState(0);
  const [speed, setSpeed] = React.useState(1);
  const [showControls, setShowControls] = React.useState(true);
  const [isFs, setIsFs] = React.useState(false);
  const [showSpeed, setShowSpeed] = React.useState(false);
  const hideTimer = React.useRef(null);
  const saveTimer = React.useRef(null);

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  // Set initial position once metadata loaded
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onLoaded = () => {
      setDuration(v.duration || 0);
      if (initialPosition && initialPosition < v.duration) v.currentTime = initialPosition;
    };
    v.addEventListener('loadedmetadata', onLoaded);
    return () => v.removeEventListener('loadedmetadata', onLoaded);
  }, [src]);

  // Time update + buffered + save every 15s
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      setCurrent(v.currentTime);
      if (v.buffered.length > 0) {
        setBuffered(v.buffered.end(v.buffered.length - 1));
      }
      if (!saveTimer.current) {
        saveTimer.current = setTimeout(() => {
          onProgressSave && onProgressSave(v.currentTime);
          saveTimer.current = null;
        }, 15000);
      }
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => { onEnded && onEnded(); };
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onEnd);
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onEnd);
      if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null; }
    };
  }, [onEnded, onProgressSave]);

  // Auto-hide controls
  const bumpControls = () => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => { if (playing) setShowControls(false); }, 3000);
  };
  React.useEffect(() => { bumpControls(); }, [playing]);

  // Fullscreen state
  React.useEffect(() => {
    const on = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', on);
    return () => document.removeEventListener('fullscreenchange', on);
  }, []);

  const togglePlay = () => {
    const v = videoRef.current; if (!v) return;
    if (v.paused) v.play(); else v.pause();
  };
  const seek = (val) => {
    const v = videoRef.current; if (!v) return;
    v.currentTime = val;
    setCurrent(val);
  };
  const seekBy = (delta) => {
    const v = videoRef.current; if (!v) return;
    v.currentTime = Math.max(0, Math.min((v.duration || 0), v.currentTime + delta));
  };
  const toggleMute = () => {
    const v = videoRef.current; if (!v) return;
    v.muted = !v.muted; setMuted(v.muted);
  };
  const changeSpeed = (s) => {
    const v = videoRef.current; if (!v) return;
    v.playbackRate = s; setSpeed(s); setShowSpeed(false);
  };
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) wrapperRef.current?.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
      else if (e.code === 'ArrowLeft')  seekBy(-5);
      else if (e.code === 'ArrowRight') seekBy(5);
      else if (e.code === 'KeyF') toggleFullscreen();
      else if (e.code === 'KeyM') toggleMute();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const pct = duration > 0 ? (current / duration) * 100 : 0;
  const bufPct = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div ref={wrapperRef}
      className="relative w-full h-full bg-black group no-select"
      onMouseMove={bumpControls}
      onTouchStart={bumpControls}>
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full"
        onClick={togglePlay}
        playsInline
      />

      {/* Center play overlay */}
      {!playing && (
        <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/30">
          <motionL.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-600 to-violet2-500 flex items-center justify-center shadow-brand">
            <PlayIcon size={44} className="text-white pr-1"/>
          </motionL.div>
        </button>
      )}

      {/* Controls bar */}
      <div className={`absolute inset-x-0 bottom-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Progress track */}
        <div className="px-4 pb-1">
          <div className="relative h-1.5 rounded-full bg-white/25 group/track hover:h-2 transition-all cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const rel = (e.clientX - rect.left) / rect.width;
              // In RTL, direction is reversed
              const relLTR = 1 - rel;
              seek(relLTR * duration);
            }}>
            {/* Buffered */}
            <div className="absolute right-0 top-0 h-full bg-white/40 rounded-full" style={{ width: `${bufPct}%` }}/>
            {/* Played */}
            <div className="absolute right-0 top-0 h-full bg-gradient-to-l from-brand-400 to-violet2-400 rounded-full"
                 style={{ width: `${pct}%` }}/>
            {/* Thumb */}
            <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-glow-brand transition-transform group-hover/track:scale-125"
                 style={{ right: `calc(${pct}% - 7px)` }}/>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 pb-4 pt-2 bg-gradient-to-t from-black/90 to-transparent">
          <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
            {playing ? <PauseIcon size={18}/> : <PlayIcon size={18}/>}
          </button>
          <button onClick={() => seekBy(-10)} className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white text-xs font-black transition-colors" title="10 ثواني للخلف">
            10-
          </button>
          <button onClick={() => seekBy(10)} className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white text-xs font-black transition-colors" title="10 ثواني للأمام">
            10+
          </button>
          <button onClick={toggleMute} className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
            <VolumeIcon size={18} muted={muted}/>
          </button>
          <div className="text-white/90 text-xs md:text-sm font-mono font-bold ml-2">
            {fmtTime(current)} <span className="text-white/50">/</span> {fmtTime(duration)}
          </div>
          <div className="flex-1"/>
          <div className="relative">
            <button onClick={() => setShowSpeed(v => !v)} className="px-3 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-black transition-colors">
              {speed}x
            </button>
            {showSpeed && (
              <div className="absolute bottom-full mb-2 right-0 rounded-2xl bg-ink-950/95 backdrop-blur border border-brand-900/50 p-2 shadow-brand">
                {speeds.map(s => (
                  <button key={s} onClick={() => changeSpeed(s)}
                    className={`block w-24 px-3 py-1.5 rounded-lg text-sm font-bold text-right ${
                      s === speed ? 'bg-brand-700 text-white' : 'text-white/80 hover:bg-white/10'
                    }`}>
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={toggleFullscreen} className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
            <FullscreenIcon size={18}/>
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LecturePage, CustomVideoPlayer });
