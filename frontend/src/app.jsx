// ============================================================
// app.jsx — main App + router mount
// ============================================================

function App() {
  const route = useRoute();
  const [subModalOpen, setSubModalOpen] = React.useState(false);

  React.useEffect(() => {
    const on = () => setSubModalOpen(true);
    window.addEventListener('subscription-required', on);
    return () => window.removeEventListener('subscription-required', on);
  }, []);

  // Route parsing — supports query strings on hash: `/path?a=1`
  const path = route.split('?')[0] || '/';

  // Public
  if (path === '/' || path === '') return <PublicShell><LandingPage/></PublicShell>;
  if (path === '/courses') return <PublicShell><CoursesPage/></PublicShell>;

  // Auth
  if (path === '/login') return <PublicShell><LoginPage/></PublicShell>;
  if (path === '/register') return <PublicShell><RegisterPage/></PublicShell>;
  if (path === '/complete-profile') return <PublicShell><CompleteProfilePage/></PublicShell>;
  if (path === '/admin/login') return <PublicShell noHeader><AdminLoginPage/></PublicShell>;

  // Student
  if (path === '/dash') return <RequireAuth><PublicShell><StudentDashboard/></PublicShell></RequireAuth>;
  if (path === '/dash/courses') return <RequireAuth><PublicShell><StudentCoursesPage/></PublicShell></RequireAuth>;
  const courseMatch = matchRoute('/dash/course/:id', path);
  if (courseMatch) return <RequireAuth><PublicShell><CourseDetailPage courseId={courseMatch.id}/></PublicShell></RequireAuth>;
  if (path === '/dash/reels') return <RequireAuth><ReelsPage/></RequireAuth>;
  const lectureMatch = matchRoute('/dash/lecture/:id', path);
  if (lectureMatch) return <RequireAuth><LecturePage lessonId={lectureMatch.id}/></RequireAuth>;
  if (path === '/dash/subscribe') return <RequireAuth><PublicShell><SubscribePage/></PublicShell></RequireAuth>;
  if (path === '/dash/pay') return <RequireAuth><PublicShell><PaymentPage/></PublicShell></RequireAuth>;

  // Admin
  if (path === '/admin') return <RequireAuth role="admin"><AdminDashboard/></RequireAuth>;
  if (path === '/admin/courses') return <RequireAuth role="admin"><AdminCoursesPage/></RequireAuth>;
  if (path === '/admin/payments') return <RequireAuth role="admin"><AdminPaymentsPage/></RequireAuth>;
  if (path === '/admin/students') return <RequireAuth role="admin"><AdminStudentsPage/></RequireAuth>;
  if (path === '/admin/reports') return <RequireAuth role="admin"><AdminReportsPage/></RequireAuth>;
  if (path === '/admin/settings') return <RequireAuth role="admin"><AdminSettingsPage/></RequireAuth>;

  // 404
  return (
    <PublicShell>
      <div className="flex-1 flex items-center justify-center py-24">
        <EmptyState
          icon={<MoleculeIcon size={54}/>}
          title="الصفحة مش موجودة"
          sub="جرب ترجع للرئيسية"
          action={<a href="#/" className="btn-primary">الرئيسية</a>}/>
      </div>
    </PublicShell>
  );
}

// ---- Public shell (header + footer) ----
function PublicShell({ children, noHeader = false }) {
  return (
    <div className="min-h-screen flex flex-col">
      {!noHeader && <Header/>}
      {children}
      <Footer/>
    </div>
  );
}

// ---- Root ----
function Root() {
  return (
    <AuthProvider>
      <TweaksProvider>
        <ToastProvider>
          <App/>
          <AppTweaksPanel/>
        </ToastProvider>
      </TweaksProvider>
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root/>);
