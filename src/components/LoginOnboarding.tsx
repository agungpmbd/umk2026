import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ArrowRight, User, Briefcase, FileText, BarChart3, CheckSquare, Sparkles, HelpCircle, Phone, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginOnboardingProps {
  onLoginSuccess: (ownerData?: any) => void;
}

export default function LoginOnboarding({ onLoginSuccess }: LoginOnboardingProps) {
  const [email, setEmail] = useState('siti.rahma@rasanusantara.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [consentChecked, setConsentChecked] = useState(true);
  const [validationError, setValidationError] = useState('');

  // Form states for onboarding
  const [ownerProfile, setOwnerProfile] = useState({
    name: 'Siti Rahmawati',
    nik: '3374025112830001',
    gender: 'Perempuan',
    phone: '0812-3456-7890',
  });
  
  const [businessProfile, setBusinessProfile] = useState({
    businessName: 'Rasa Nusantara',
    sector: 'Food & Beverage',
    subsector: 'Olahan Sambal & Bumbu Tradisional',
    establishedYear: '2021',
    description: 'Memproduksi sambal kemasan dan bumbu instan khas Nusantara.',
  });

  const [legalDocuments, setLegalDocuments] = useState({
    nib: '9120010293021',
    pirt: 'P-IRT 2063374010234-26',
    halal: '',
  });

  const [initialConditions, setInitialConditions] = useState({
    revenue: '15000000',
    employees: '3',
    digitalChannels: '2',
  });

  const [commitmentChecked, setCommitmentChecked] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setValidationError('Silakan isi email dan kata sandi Anda.');
      return;
    }
    if (!consentChecked) {
      setValidationError('Anda harus menyetujui pernyataan persetujuan data pribadi.');
      return;
    }
    // Success, go straight to main app as Siti
    onLoginSuccess();
  };

  const startOnboarding = () => {
    setIsOnboarding(true);
    setOnboardingStep(1);
  };

  const handleNextStep = () => {
    if (onboardingStep === 1) {
      if (!ownerProfile.name || !ownerProfile.nik || !ownerProfile.phone) {
        setValidationError('Semua kolom berlogo bintang wajib diisi.');
        return;
      }
      setValidationError('');
      setOnboardingStep(2);
    } else if (onboardingStep === 2) {
      if (!businessProfile.businessName || !businessProfile.sector || !businessProfile.establishedYear) {
        setValidationError('Semua kolom berlogo bintang wajib diisi.');
        return;
      }
      setValidationError('');
      setOnboardingStep(3);
    } else if (onboardingStep === 3) {
      setValidationError('');
      setOnboardingStep(4);
    } else if (onboardingStep === 4) {
      if (!initialConditions.revenue || !initialConditions.employees) {
        setValidationError('Silakan isi data kondisi awal usaha.');
        return;
      }
      setValidationError('');
      setOnboardingStep(5);
    } else if (onboardingStep === 5) {
      if (!commitmentChecked) {
        setValidationError('Anda harus menyetujui lembar komitmen program.');
        return;
      }
      setValidationError('');
      // Onboarding complete, enter dashboard
      onLoginSuccess();
    }
  };

  const handlePrevStep = () => {
    setValidationError('');
    setOnboardingStep((prev) => Math.max(1, prev - 1));
  };

  const stepIcons = [
    { label: 'Profil Pemilik', icon: User },
    { label: 'Profil Usaha', icon: Briefcase },
    { label: 'Legalitas', icon: FileText },
    { label: 'Kondisi Awal', icon: BarChart3 },
    { label: 'Komitmen', icon: CheckSquare },
  ];

  return (
    <div id="login-onboarding-container" className="min-h-screen bg-[#F5F7FA] flex flex-col justify-between font-sans">
      {/* Header Bar */}
      <header className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex flex-col">
            <span className="font-sans font-extrabold text-[#0072BC] text-lg md:text-xl tracking-tight leading-none">
              PERTAMINA
            </span>
            <span className="font-sans font-extrabold text-[#A8C61F] text-[10px] md:text-xs tracking-[0.15em] mt-1 leading-none">
              UMK ACADEMY 2026
            </span>
          </div>
          <div className="h-6 w-[2px] bg-gray-200"></div>
          <span className="text-xs font-semibold text-[#16365C] bg-[#F5F7FA] px-2 py-1 rounded">
            PROPOSAL PROTOTYPE
          </span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500 font-medium">
          <Phone className="h-4 w-4 text-[#ED1B2F]" />
          <span>Helpdesk: +62 811-135-0000</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <AnimatePresence mode="wait">
          {!isOnboarding ? (
            /* LOGIN SCREEN */
            <motion.div
              key="login-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="p-8 md:p-10">
                {/* Logo & Headline */}
                <div className="text-center mb-8">
                  <div className="inline-flex p-3 bg-red-50 rounded-full mb-3 text-[#ED1B2F]">
                    <Sparkles className="h-6 w-6 animate-pulse" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#16365C] tracking-tight mb-2">
                    Bertumbuh Bersama, Naik Kelas Bersama
                  </h1>
                  <p className="text-sm text-gray-500">
                    Selamat datang di LIMS Pertamina UMK Academy 2026. Portal belajar dan pemantauan dampak usaha Anda.
                  </p>
                </div>

                {validationError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-medium">
                    {validationError}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Email atau No. Handphone
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <User className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0072BC] focus:bg-white transition-all text-gray-800"
                        placeholder="contoh: siti@rasanusantara.com"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Kata Sandi
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        className="text-xs font-semibold text-[#0072BC] hover:underline"
                      >
                        Lupa Kata Sandi?
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0072BC] focus:bg-white transition-all text-gray-800"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Personal Data Consent Panel */}
                  <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start space-x-2.5">
                    <input
                      id="consent-checkbox"
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="mt-0.5 rounded text-[#0072BC] focus:ring-[#0072BC]"
                    />
                    <label htmlFor="consent-checkbox" className="text-[11px] text-gray-600 leading-relaxed cursor-pointer select-none">
                      Saya memberikan persetujuan kepada Pertamina untuk mengelola data identitas pribadi dan profil usaha saya demi kelancaran kurasi dan pengukuran dampak program SROI.
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="pt-2 space-y-3">
                    <button
                      type="submit"
                      className="w-full bg-[#0072BC] hover:bg-[#0072BC]/90 text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all flex justify-center items-center space-x-2"
                    >
                      <span>Masuk ke Dashboard</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <div className="flex items-center my-4">
                      <div className="flex-grow h-[1px] bg-gray-200"></div>
                      <span className="px-3 text-xs text-gray-400 font-semibold uppercase">Atau</span>
                      <div className="flex-grow h-[1px] bg-gray-200"></div>
                    </div>

                    <button
                      type="button"
                      onClick={startOnboarding}
                      className="w-full bg-white hover:bg-gray-50 border border-[#0072BC] text-[#0072BC] py-3 rounded-xl font-bold text-sm transition-all flex justify-center items-center space-x-2"
                    >
                      <Sparkles className="h-4 w-4 text-[#A8C61F]" />
                      <span>Aktivasi Akun / Onboarding Peserta</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Footer info */}
              <div className="bg-[#16365C] px-8 py-4 text-center text-xs text-white/80 flex items-center justify-center space-x-1.5">
                <ShieldCheck className="h-4 w-4 text-[#A8C61F]" />
                <span>Sistem Terverifikasi & Terintegrasi Satu Data SMEPP</span>
              </div>
            </motion.div>
          ) : (
            /* ONBOARDING FLOW WIZARD */
            <motion.div
              key="onboarding-card"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              {/* Stepper Progress bar */}
              <div className="bg-[#16365C] px-6 py-5 text-white">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-bold">Aktivasi Profil & Onboarding</h2>
                    <p className="text-xs text-white/70">Langkah {onboardingStep} dari 5: Lengkapi profil baseline Anda</p>
                  </div>
                  <button
                    onClick={() => setIsOnboarding(false)}
                    className="text-xs bg-white/10 hover:bg-white/20 text-white font-semibold py-1.5 px-3 rounded-lg transition"
                  >
                    Batal
                  </button>
                </div>

                {/* Progress Indicators */}
                <div className="grid grid-cols-5 gap-2 relative z-10">
                  {stepIcons.map((step, idx) => {
                    const stepNum = idx + 1;
                    const isActive = onboardingStep >= stepNum;
                    const isCurrent = onboardingStep === stepNum;
                    const IconComponent = step.icon;

                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            isCurrent
                              ? 'bg-[#ED1B2F] text-white ring-4 ring-red-100'
                              : isActive
                              ? 'bg-[#A8C61F] text-white'
                              : 'bg-white/20 text-white/50'
                          }`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <span
                          className={`hidden md:block text-[10px] mt-1.5 text-center font-medium ${
                            isCurrent ? 'text-white font-bold' : isActive ? 'text-white/80' : 'text-white/40'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6 md:p-8">
                {validationError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-medium">
                    {validationError}
                  </div>
                )}

                {/* STEP 1: PROFIL PEMILIK */}
                {onboardingStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-[#16365C] pb-2 border-b">Data Identitas Pemilik UMK</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Nama Lengkap Pemilik *</label>
                        <input
                          type="text"
                          value={ownerProfile.name}
                          onChange={(e) => setOwnerProfile({ ...ownerProfile, name: e.target.value })}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Nomor Induk Kependudukan (NIK) *</label>
                        <input
                          type="text"
                          maxLength={16}
                          value={ownerProfile.nik}
                          onChange={(e) => setOwnerProfile({ ...ownerProfile, nik: e.target.value })}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-800"
                        />
                        <span className="text-[10px] text-gray-400">Data NIK akan di-masking untuk keamanan privasi Anda.</span>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Jenis Kelamin *</label>
                        <select
                          value={ownerProfile.gender}
                          onChange={(e) => setOwnerProfile({ ...ownerProfile, gender: e.target.value })}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800"
                        >
                          <option value="Perempuan">Perempuan</option>
                          <option value="Laki-laki">Laki-laki</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">No. WhatsApp Aktif *</label>
                        <input
                          type="text"
                          value={ownerProfile.phone}
                          onChange={(e) => setOwnerProfile({ ...ownerProfile, phone: e.target.value })}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: PROFIL USAHA */}
                {onboardingStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-[#16365C] pb-2 border-b">Profil Usaha (Firma / Brand)</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Nama Usaha / Merek *</label>
                          <input
                            type="text"
                            value={businessProfile.businessName}
                            onChange={(e) => setBusinessProfile({ ...businessProfile, businessName: e.target.value })}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Sektor Usaha *</label>
                          <select
                            value={businessProfile.sector}
                            onChange={(e) => setBusinessProfile({ ...businessProfile, sector: e.target.value })}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800"
                          >
                            <option value="Food & Beverage">Food & Beverage</option>
                            <option value="Agribisnis">Agribisnis</option>
                            <option value="Fesyen & Wastra">Fesyen & Wastra</option>
                            <option value="Craft & Jewellery">Craft & Jewellery</option>
                            <option value="Jasa">Jasa</option>
                            <option value="Perdagangan">Perdagangan</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Subsektor Spesifik *</label>
                          <input
                            type="text"
                            value={businessProfile.subsector}
                            onChange={(e) => setBusinessProfile({ ...businessProfile, subsector: e.target.value })}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800"
                            placeholder="Contoh: Sambal Kemasan Botol"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Tahun Berdiri *</label>
                          <input
                            type="number"
                            value={businessProfile.establishedYear}
                            onChange={(e) => setBusinessProfile({ ...businessProfile, establishedYear: e.target.value })}
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi Singkat Usaha *</label>
                        <textarea
                          rows={3}
                          value={businessProfile.description}
                          onChange={(e) => setBusinessProfile({ ...businessProfile, description: e.target.value })}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: LEGALITAS */}
                {onboardingStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-[#16365C] pb-2 border-b">Legalitas & Sertifikasi (Opsional - Bisa Diisi Nanti)</h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Tuliskan nomor dokumen yang sudah ada. Sertifikasi ini membantu kurasi kelayakan SMEXPO & program lanjutan.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Nomor Induk Berusaha (NIB)</label>
                        <input
                          type="text"
                          value={legalDocuments.nib}
                          onChange={(e) => setLegalDocuments({ ...legalDocuments, nib: e.target.value })}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 font-mono"
                          placeholder="91200xxxxxx"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Nomor P-IRT (Dinkes)</label>
                        <input
                          type="text"
                          value={legalDocuments.pirt}
                          onChange={(e) => setLegalDocuments({ ...legalDocuments, pirt: e.target.value })}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 font-mono"
                          placeholder="P-IRT xxxxxxxxxxxxxxx"
                        />
                      </div>
                      <div className="p-4 bg-[#A8C61F]/10 rounded-xl border border-[#A8C61F]/30 flex items-start space-x-3">
                        <ShieldCheck className="h-5 w-5 text-[#0072BC] shrink-0 mt-0.5" />
                        <div className="text-xs text-[#16365C]">
                          <span className="font-bold block mb-1">Belum Memiliki Dokumen di Atas?</span>
                          Jangan khawatir! Selama mengikuti UMK Academy, fasilitator kami akan mendampingi pengurusan NIB, Halal Self Declare, dan P-IRT secara terpadu.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: KONDISI AWAL (BASELINE IMPACT MEASUREMENT) */}
                {onboardingStep === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-[#16365C] pb-2 border-b">Kondisi Awal Usaha (Baseline SROI)</h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Data ini diperlukan sebagai pembanding di akhir pembinaan untuk menghitung persentase pertumbuhan omzet dan dampak program.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Omzet Rata-rata Bulanan (Rp) *</label>
                        <input
                          type="number"
                          value={initialConditions.revenue}
                          onChange={(e) => setInitialConditions({ ...initialConditions, revenue: e.target.value })}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Jumlah Tenaga Kerja (Orang) *</label>
                        <input
                          type="number"
                          value={initialConditions.employees}
                          onChange={(e) => setInitialConditions({ ...initialConditions, employees: e.target.value })}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Jumlah Saluran Penjualan Digital *</label>
                        <input
                          type="number"
                          value={initialConditions.digitalChannels}
                          onChange={(e) => setInitialConditions({ ...initialConditions, digitalChannels: e.target.value })}
                          className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 font-mono"
                          placeholder="e.g. Tokopedia, Shopee, IG"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: KOMITMEN */}
                {onboardingStep === 5 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold text-[#16365C] pb-2 border-b">Pernyataan Komitmen & Integritas</h3>
                    <div className="p-4 bg-gray-50 border rounded-xl text-xs space-y-3 max-h-60 overflow-y-auto leading-relaxed text-gray-600">
                      <p className="font-bold text-[#16365C]">Sebagai peserta resmi pembinaan Pertamina UMK Academy 2026, saya berjanji:</p>
                      <p>1. Menghadiri minimal 80% dari seluruh rangkaian webinar materi, sesi mentoring kelompok, dan forum bimbingan teknis yang dijadwalkan.</p>
                      <p>2. Mengisi dan memperbarui data omzet serta profil bisnis di Business Passport secara jujur, akurat, dan berbasis bukti nyata (no overclaim).</p>
                      <p>3. Menyelesaikan seluruh Tantangan Bisnis (Challenges) wajib tepat waktu guna mengukur kapabilitas kenaikan kelas usaha.</p>
                      <p>4. Berpartisipasi aktif dalam kegiatan gotong royong komunitas UMK dan menjaga nama baik PT Pertamina (Persero).</p>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-start space-x-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={commitmentChecked}
                          onChange={(e) => setCommitmentChecked(e.target.checked)}
                          className="mt-0.5 rounded text-[#0072BC] focus:ring-[#0072BC]"
                        />
                        <span className="text-xs text-gray-700 leading-normal">
                          Saya menyetujui lembar komitmen di atas dan berjanji akan mengikuti seluruh program pembinaan dengan penuh rasa tanggung jawab.
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Wizard Navigation */}
                <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={onboardingStep === 1}
                    className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                      onboardingStep === 1 ? 'text-gray-300 bg-gray-100 cursor-not-allowed' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Kembali
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-[#0072BC] hover:bg-[#0072BC]/90 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow transition-all flex items-center space-x-1.5"
                  >
                    <span>{onboardingStep === 5 ? 'Selesaikan & Masuk' : 'Lanjut'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Consent Notice */}
      <footer className="bg-white border-t border-gray-100 py-3 px-6 text-center text-[11px] text-gray-400">
        © 2026 PT Pertamina (Persero) - Tanggung Jawab Sosial dan Lingkungan (TJSL). Dikembangkan untuk Program Satu Data SMEPP.
      </footer>
    </div>
  );
}
