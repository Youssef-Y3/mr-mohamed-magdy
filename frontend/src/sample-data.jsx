// ============================================================
// sample-data.jsx — realistic Arabic sample data for demo mode
// ============================================================

const SAMPLE_COURSES = [
  {
    id: 'c1', title: 'أحياء أولى ثانوي — الترم الأول', grade: 'first', published: true,
    description: 'كورس متكامل يغطي منهج الترم الأول لأولى ثانوي، من المستوى الجزيئي للكائن الحي.',
    cover_color: 'from-brand-500 to-violet2-500',
    units: [
      { id: 'u1', title: 'الوحدة الأولى: المستوى الجزيئي والخلوي', lessons: [
        { id: 'l1', title: 'مقدمة: ليه بندرس الأحياء؟', content_type: 'reel', duration: 68 },
        { id: 'l2', title: 'الماء ودوره في الخلية',      content_type: 'reel', duration: 84 },
        { id: 'l3', title: 'الكربوهيدرات كاملة',          content_type: 'lecture', duration: 2340 },
        { id: 'l4', title: 'البروتينات — الشرح الكامل',   content_type: 'lecture', duration: 2680 },
      ]},
      { id: 'u2', title: 'الوحدة الثانية: الخلية ووظائفها', lessons: [
        { id: 'l5', title: 'تركيب الخلية في 90 ثانية',    content_type: 'reel', duration: 92 },
        { id: 'l6', title: 'العضيات كاملة',                content_type: 'lecture', duration: 3120 },
      ]},
    ],
  },
  {
    id: 'c2', title: 'أحياء تالتة ثانوي — الشامل', grade: 'third', published: true,
    description: 'كل منهج تالتة ثانوي بترتيب مدروس، مع إجابات على أصعب أسئلة الثانوية العامة والأزهرية.',
    cover_color: 'from-violet2-600 to-pink-500',
    units: [
      { id: 'u3', title: 'الوحدة الأولى: الدعامة والحركة', lessons: [
        { id: 'l7',  title: 'الدعامة عند الحيوان — Reel',  content_type: 'reel',    duration: 76 },
        { id: 'l8',  title: 'الجهاز العضلي كامل',          content_type: 'lecture', duration: 3410 },
        { id: 'l9',  title: 'الجهاز الهيكلي كامل',         content_type: 'lecture', duration: 3200 },
      ]},
      { id: 'u4', title: 'الوحدة الثانية: التنسيق الهرموني', lessons: [
        { id: 'l10', title: 'الجهاز العصبي — مقدمة سريعة',  content_type: 'reel',    duration: 88 },
        { id: 'l11', title: 'المخ بالتفصيل',                content_type: 'lecture', duration: 2820 },
        { id: 'l12', title: 'أشباه المستقبلات',              content_type: 'reel',    duration: 72 },
        { id: 'l13', title: 'الغدد الصماء الشامل',           content_type: 'lecture', duration: 3600 },
      ]},
      { id: 'u5', title: 'الوحدة الثالثة: الجهاز التناسلي والوراثة', lessons: [
        { id: 'l14', title: 'الوراثة عند الإنسان',           content_type: 'lecture', duration: 2940 },
        { id: 'l15', title: 'قوانين مندل في دقيقة',           content_type: 'reel',    duration: 55 },
      ]},
    ],
  },
  {
    id: 'c3', title: 'ريلز الأحياء — للمراجعة السريعة', grade: 'first', published: true,
    description: 'مجموعة فيديوهات قصيرة لمراجعة أهم مفاهيم أولى ثانوي، كل فيديو تحت الدقيقتين.',
    cover_color: 'from-cyan-500 to-brand-600',
    units: [
      { id: 'u6', title: 'ريلز مختارة', lessons: [
        { id: 'l16', title: 'ATP في دقيقة',           content_type: 'reel', duration: 62 },
        { id: 'l17', title: 'إنزيمات — سؤال محسوم',    content_type: 'reel', duration: 74 },
        { id: 'l18', title: 'ميتوكندريا مش صعبة',      content_type: 'reel', duration: 51 },
      ]},
    ],
  },
];

const SAMPLE_PAYMENT_INFO = {
  vodafone_cash_number: '01012345678',
  instapay_handle:      '01012345678',
  price_monthly: 199,
  price_term:    499,
  price_yearly:  1299,
  teacher_bio: null, // filled from tweak drafts
};

const SAMPLE_ADMIN_STUDENTS = Array.from({ length: 24 }).map((_, i) => ({
  id: `s${i+1}`,
  name: ['محمد أحمد','يوسف علي','آية إبراهيم','مريم حسن','عمر خالد','ليلى محمود','ملك سيد','زياد وائل','سلمى ناصر','عبدالرحمن','هنا مصطفى','كريم فؤاد'][i % 12] + ' ' + (i+1),
  username: `student_${i+1}`,
  grade: i % 2 === 0 ? 'first' : 'third',
  subscription: ['active','active','pending','none','active'][i % 5],
  progress: Math.floor(Math.random() * 100),
  joined: `2026-0${1 + (i % 6)}-${10 + (i % 15)}`,
}));

const SAMPLE_ADMIN_PAYMENTS = Array.from({ length: 12 }).map((_, i) => ({
  id: `p${i+1}`,
  student_name: SAMPLE_ADMIN_STUDENTS[i]?.name,
  amount: [199, 499, 1299][i % 3],
  plan:  ['monthly','term','yearly'][i % 3],
  method: i % 2 === 0 ? 'vodafone_cash' : 'instapay',
  sender_last4: String(1000 + i * 111).slice(-4),
  status: ['pending','pending','confirmed','pending','rejected','confirmed'][i % 6],
  created_at: `2026-07-${10 + (i % 20)}`,
}));

const SAMPLE_FINANCIAL = {
  today: 2495,
  week: 18450,
  month: 72300,
  by_day: Array.from({ length: 14 }).map((_, i) => ({
    day: `${16 + i}/7`,
    amount: Math.floor(1200 + Math.random() * 4800),
  })),
  by_plan: [
    { plan: 'شهر',   value: 12, color: '#7C3AED' },
    { plan: 'ترم',   value: 18, color: '#4338CA' },
    { plan: 'سنة',   value: 9,  color: '#EC4899' },
  ],
};

const SAMPLE_PROGRESS = {
  last_lesson: { id: 'l4', title: 'البروتينات — الشرح الكامل', course: 'أحياء أولى ثانوي', position: 1240, duration: 2680 },
  overall_percent: 42,
  subscription: { status: 'active', plan: 'term', expires_at: '2026-11-15' },
  streak_days: 6,
};

Object.assign(window, {
  SAMPLE_COURSES, SAMPLE_PAYMENT_INFO, SAMPLE_ADMIN_STUDENTS,
  SAMPLE_ADMIN_PAYMENTS, SAMPLE_FINANCIAL, SAMPLE_PROGRESS,
});
