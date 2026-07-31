// ============================================================
// pages-payment.jsx — Payment upload (Vodafone Cash / InstaPay)
// ============================================================

function PaymentPage() {
  const { tweaks } = useTweaksCtx();
  const toast = useToast();
  const [info, setInfo] = React.useState(null);
  const [selectedPlan, setSelectedPlan] = React.useState(() => {
    const params = new URLSearchParams(location.hash.split('?')[1] || '');
    return params.get('plan') || 'term';
  });
  const [method, setMethod] = React.useState('vodafone_cash');
  const [last4, setLast4] = React.useState('');
  const [receipt, setReceipt] = React.useState(null);
  const [receiptPreview, setReceiptPreview] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [history, setHistory] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch('/api/payment/info');
        setInfo(data);
      } catch {
        setInfo(tweaks.sampleData ? SAMPLE_PAYMENT_INFO : SAMPLE_PAYMENT_INFO);
      }
      try {
        const h = await apiFetch('/api/payment/my');
        setHistory(Array.isArray(h) ? h : (h.payments || h.items || []));
      } catch { setHistory([]); }
    })();
  }, [tweaks.sampleData]);

  const onFile = (file) => {
    if (!file) return;
    setReceipt(file);
    const url = URL.createObjectURL(file);
    setReceiptPreview(url);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!receipt) { toast.show('لازم ترفع صورة الإيصال', 'error'); return; }
    if (last4.length !== 4) { toast.show('اكتب آخر 4 أرقام من رقم اللي حوّل', 'error'); return; }
    setSubmitting(true);
    try {
      const priceKey = { monthly: 'price_monthly', term: 'price_term', yearly: 'price_yearly' }[selectedPlan];
      const amount = info[priceKey];
      const fd = new FormData();
      fd.append('receipt', receipt);
      fd.append('method', method);
      fd.append('plan', selectedPlan);
      fd.append('amount', String(amount));
      fd.append('sender_last4', last4);
      await apiFetch('/api/payment/submit', { method: 'POST', body: fd });
      toast.show('اتبعت الإيصال! هيتم مراجعته خلال ساعات', 'success');
      setReceipt(null); setReceiptPreview(null); setLast4('');
      // refresh history
      try {
        const h = await apiFetch('/api/payment/my');
        setHistory(Array.isArray(h) ? h : (h.payments || h.items || []));
      } catch {}
    } catch (err) {
      toast.show(err.message || 'حصل خطأ أثناء رفع الإيصال', 'error');
    } finally { setSubmitting(false); }
  };

  if (!info) return <StudentLayout><div className="py-16"><CellLoader label="جاري تحميل بيانات الدفع..."/></div></StudentLayout>;

  const plans = [
    { key: 'monthly', label: 'شهر واحد',  price: info.price_monthly },
    { key: 'term',    label: 'ترم دراسي', price: info.price_term },
    { key: 'yearly',  label: 'سنة كاملة', price: info.price_yearly },
  ];
  const activePrice = plans.find(p => p.key === selectedPlan)?.price;

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <SectionTitle eyebrow="اشتراك جديد" title="ادفع بسهولة، وسجّل الإيصال"/>

        <div className="grid md:grid-cols-[1fr,380px] gap-6">
          {/* Left: form */}
          <FadeIn>
            <div className="rounded-3xl bg-white dark:bg-ink-900 border border-brand-100 dark:border-brand-900/40 shadow-soft p-6 md:p-8">
              {/* Plan chooser */}
              <div className="mb-6">
                <div className="text-sm font-black text-brand-950 dark:text-white mb-3">اختار الخطة</div>
                <div className="grid grid-cols-3 gap-2">
                  {plans.map(p => (
                    <button key={p.key} type="button" onClick={() => setSelectedPlan(p.key)}
                      className={`p-3 rounded-2xl border-2 text-center transition-all ${
                        selectedPlan === p.key
                          ? 'border-brand-700 bg-brand-50 dark:bg-brand-900/40'
                          : 'border-brand-100 dark:border-brand-900/40 hover:border-brand-300'
                      }`}>
                      <div className="text-xs font-bold text-ink-900/70 dark:text-white/70">{p.label}</div>
                      <div className="text-xl font-black text-brand-950 dark:text-white mt-1">{fmtNum(p.price)}<span className="text-xs font-bold text-ink-900/50 dark:text-white/40"> ج.م</span></div>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={submit} className="space-y-5">
                {/* Method */}
                <div>
                  <div className="text-sm font-black text-brand-950 dark:text-white mb-3">طريقة التحويل</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { v: 'vodafone_cash', l: 'فودافون كاش', color: 'from-red-500 to-red-600' },
                      { v: 'instapay',      l: 'انستاباي',     color: 'from-emerald-500 to-teal-600' },
                    ].map(m => (
                      <button key={m.v} type="button" onClick={() => setMethod(m.v)}
                        className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-all ${
                          method === m.v
                            ? 'border-brand-700 bg-brand-50 dark:bg-brand-900/40'
                            : 'border-brand-100 dark:border-brand-900/40 hover:border-brand-300'
                        }`}>
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${m.color} text-white flex items-center justify-center font-black`}>
                          <WalletIcon size={22}/>
                        </div>
                        <div className="text-right flex-1">
                          <div className="font-black text-brand-950 dark:text-white">{m.l}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Last 4 */}
                <div>
                  <label className="text-sm font-black text-brand-950 dark:text-white mb-3 block">آخر 4 أرقام من رقمك اللي حوّلت منه</label>
                  <input required inputMode="numeric" pattern="\d{4}" maxLength={4}
                    value={last4} onChange={e => setLast4(e.target.value.replace(/\D/g, '').slice(0,4))}
                    className="field text-center tracking-[0.5em] text-2xl font-black" placeholder="0000"/>
                </div>

                {/* Receipt */}
                <div>
                  <label className="text-sm font-black text-brand-950 dark:text-white mb-3 block">صورة إيصال التحويل</label>
                  <label className="block cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={e => onFile(e.target.files[0])}/>
                    <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                      receiptPreview
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20'
                        : 'border-brand-200 dark:border-brand-900/50 hover:border-brand-500 hover:bg-brand-50/50 dark:hover:bg-brand-900/20'
                    }`}>
                      {receiptPreview ? (
                        <div className="space-y-3">
                          <img src={receiptPreview} alt="preview" className="max-h-40 mx-auto rounded-xl shadow-soft"/>
                          <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-2">
                            <CheckIcon size={18}/> تم اختيار الصورة — اضغط لتغييرها
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 mx-auto flex items-center justify-center">
                            <UploadIcon size={28}/>
                          </div>
                          <div className="font-black text-brand-950 dark:text-white">اضغط لرفع صورة الإيصال</div>
                          <div className="text-xs text-ink-900/60 dark:text-white/50">JPG / PNG · حتى 5 ميجا</div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                <button disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 text-lg">
                  {submitting ? 'جاري الرفع...' : `تأكيد الدفع — ${fmtMoney(activePrice)}`}
                </button>
              </form>
            </div>
          </FadeIn>

          {/* Right: instructions + numbers */}
          <div className="space-y-4">
            <FadeIn delay={0.1}>
              <div className="rounded-3xl p-6 bg-gradient-to-br from-brand-700 to-violet2-600 text-white shadow-brand">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                    <WalletIcon/>
                  </div>
                  <div className="font-black text-lg">حوّل على الرقم ده</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/15 backdrop-blur border border-white/25 mb-3">
                  <div className="text-white/70 text-xs font-bold mb-1">فودافون كاش / انستاباي (نفس الرقم)</div>
                  <div className="text-3xl font-black tracking-wider font-mono direction-ltr" dir="ltr">{info.vodafone_cash_number}</div>
                </div>
                <div className="text-sm text-white/85 leading-relaxed">
                  الرقم ده هو <b>نفسه</b> في فودافون كاش وانستاباي — تقدر تحوّل بأي وسيلة تناسبك.
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="rounded-3xl p-5 bg-white dark:bg-ink-900 border border-brand-100 dark:border-brand-900/40 shadow-soft">
                <div className="font-black text-brand-950 dark:text-white mb-3">خطوات بسيطة</div>
                <ol className="space-y-3 text-sm">
                  {[
                    'اختار الخطة اللي تناسبك',
                    'حوّل المبلغ للرقم اللي في اليمين',
                    'صوّر إيصال التحويل أو Screenshot',
                    'ارفع الصورة + اكتب آخر 4 أرقام من رقمك',
                    'اضغط تأكيد — وهيتم التفعيل خلال ساعات',
                  ].map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5">
                        {i+1}
                      </div>
                      <div className="text-ink-900/80 dark:text-white/80 leading-relaxed">{s}</div>
                    </li>
                  ))}
                </ol>
              </div>
            </FadeIn>

            {/* History */}
            {history && history.length > 0 && (
              <FadeIn delay={0.2}>
                <div className="rounded-3xl p-5 bg-white dark:bg-ink-900 border border-brand-100 dark:border-brand-900/40 shadow-soft">
                  <div className="font-black text-brand-950 dark:text-white mb-3">مدفوعاتي</div>
                  <div className="space-y-2">
                    {history.slice(0, 5).map((p, i) => (
                      <div key={p.id || i} className="flex items-center justify-between p-3 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-sm">
                        <div>
                          <div className="font-bold text-brand-950 dark:text-white">{fmtMoney(p.amount)}</div>
                          <div className="text-xs text-ink-900/60 dark:text-white/60">{p.plan}</div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                          p.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : p.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                        }`}>
                          {p.status === 'confirmed' ? 'مؤكد' : p.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

Object.assign(window, { PaymentPage });
