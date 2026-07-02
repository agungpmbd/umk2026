import React from 'react';
import { Participant, LearningModule, Challenge, AgendaEvent } from '../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import {
  Sparkles, Award, BookOpen, Clock, Calendar, CheckCircle2, TrendingUp,
  ChevronRight, Users, MessageSquare, ShieldAlert, ArrowUpRight, ShieldCheck,
  PlayCircle, AlertCircle, CheckSquare
} from 'lucide-react';

interface ParticipantDashboardProps {
  participant: Participant;
  modules: LearningModule[];
  challenges: Challenge[];
  agendaEvents: AgendaEvent[];
  onTabChange: (tab: string) => void;
  onMarkModuleComplete?: (moduleId: string) => void;
}

// Chart data for Siti's Monthly Revenue Growth
const revenueData = [
  { month: 'Jan', revenue: 15000000 },
  { month: 'Feb', revenue: 15200000 },
  { month: 'Mar', revenue: 15800000 },
  { month: 'Apr', revenue: 16500000 },
  { month: 'Mei', revenue: 17200000 },
  { month: 'Jun', revenue: 18500000 }
];

export default function ParticipantDashboard({
  participant,
  modules,
  challenges,
  agendaEvents,
  onTabChange,
  onMarkModuleComplete
}: ParticipantDashboardProps) {

  // Journey stages mapping (6 high-level stages as requested)
  const journeyStages = [
    { 
      id: 'pendaftaran_verifikasi',
      label: 'Pendaftaran & Verifikasi', 
      desc: 'Identitas, status binaan, dan administrasi' 
    },
    { 
      id: 'pembinaan_regional',
      label: 'Pembinaan Regional', 
      desc: 'Materi & mentoring regional' 
    },
    { 
      id: 'kurasi_nasional',
      label: 'Kurasi Nasional', 
      desc: 'Penilaian & kurasi nasional' 
    },
    { 
      id: 'pembinaan_nasional',
      label: 'Pembinaan Nasional', 
      desc: 'Mentoring intensif nasional' 
    },
    { 
      id: 'seleksi_akhir',
      label: 'Seleksi Akhir', 
      desc: 'Top 100 Champion & Calon PAG' 
    },
    { 
      id: 'inaugurasi_champions',
      label: 'Inaugurasi & Champions', 
      desc: 'Apresiasi & kelulusan' 
    }
  ];

  const getActiveStageIndex = (stageName: string) => {
    const s = stageName ? stageName.toLowerCase() : '';
    if (s.includes('pendaftaran') || s.includes('identitas') || s.includes('administrasi') || s.includes('tjsl')) {
      return 0;
    }
    if (s.includes('regional')) {
      return 1;
    }
    if (s.includes('kurasi nasional')) {
      return 2;
    }
    if (s.includes('pembinaan nasional') || s.includes('nasional')) {
      return 3;
    }
    if (s.includes('top 100') || s.includes('seleksi akhir') || s.includes('pag')) {
      return 4;
    }
    if (s.includes('graduation') || s.includes('champions') || s.includes('inaugurasi')) {
      return 5;
    }
    return 1; // Default to Pembinaan Regional
  };

  const activeIdx = getActiveStageIndex(participant.stage);

  // Default selected stage is the participant's current stage
  const [selectedStageId, setSelectedStageId] = React.useState<string>(
    journeyStages[activeIdx]?.id || 'pembinaan_regional'
  );

  // Formatting utility
  const formatRupiah = (num: number) => {
    return 'Rp' + num.toLocaleString('id-ID');
  };

  // Next upcoming event for Siti
  const nextEvent = agendaEvents.find(e => e.attendanceStatus === 'Menunggu') || agendaEvents[2];

  // Uncompleted important tasks
  const pendingChallenges = challenges.filter(c => c.status === 'Draft' || c.status === 'Perlu Revisi');

  const [showDetailProses, setShowDetailProses] = React.useState(false);
  const [onboardingStatus, setOnboardingStatus] = React.useState<'Belum Konfirmasi' | 'Sudah Konfirmasi' | 'Mengundurkan Diri'>('Belum Konfirmasi');
  const [hasSignedCommitment, setHasSignedCommitment] = React.useState(false);

  // Participant registration sub-statuses for Detail Proses
  const processSteps = [
    { name: 'Pendaftaran', desc: 'Pengisian data identitas, profil bisnis, dan legalitas awal.', status: 'Selesai', date: '2026-06-20' },
    { name: 'Validasi Sistem', desc: 'Pengecekan otomatis kelengkapan formulir dan format berkas.', status: 'Selesai', date: '2026-06-21' },
    { name: 'Eligibility Gate', desc: 'Pemeriksaan kepemilikan NIB aktif dan duplikasi NIK pendaftar.', status: 'Eligible', date: '2026-06-22' },
    { name: 'Verifikasi TJSL', desc: 'Sinkronisasi data keabsahan program afiliasi Satu Data SMEPP.', status: 'Terverifikasi', date: '2026-06-23' },
    { name: 'Verifikasi Dokumen', desc: 'Pemeriksaan berkas manual oleh tim kurator pusat.', status: 'Selesai', date: '2026-06-24' },
    { name: 'Kurasi', desc: 'Penilaian bobot scorecard otomatis & peringkat kelayakan regional.', status: 'Selesai', date: '2026-06-25' },
    { name: 'Pengumuman', desc: 'Keputusan final kelulusan regional oleh komite SMEPP/PTC.', status: 'Lolos Pembinaan Regional', date: '2026-06-28' },
    { name: 'Onboarding Regional', desc: 'Konfirmasi kehadiran, penandatanganan komitmen, dan penentuan fasilitator.', status: onboardingStatus === 'Sudah Konfirmasi' ? 'Selesai' : 'Menunggu Konfirmasi', date: 'Hari Ini' }
  ];

  return (
    <div id="participant-dashboard" className="space-y-6 pb-20 md:pb-10 font-sans text-[#16365C]">
      {/* A. WELCOME HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-1">
        <div>
          <div className="flex items-center space-x-2 bg-[#0072BC]/10 px-3 py-1 rounded-full text-[11px] font-bold text-[#0072BC] w-max mb-2">
            <Sparkles className="h-3.5 w-3.5 text-[#A8C61F]" />
            <span>Regional Jawa Tengah • {participant.sector}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#16365C]">Selamat datang kembali, Ibu {participant.name}!</h2>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Pantau status pendaftaran dan rangkaian persiapan pembinaan <strong className="text-[#0072BC]">"{participant.businessName}"</strong> Anda di bawah ini.
          </p>
        </div>
      </div>

      {/* B. MAIN CARD: STATUS PENDAFTARAN & VERIFIKASI */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
        {/* Card Header */}
        <div className="p-6 bg-gradient-to-r from-[#16365C] to-[#0072BC] text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8C61F] block">Sistem Terintegrasi Satu Data SMEPP</span>
            <h3 className="text-lg font-black mt-1">Status Pendaftaran & Verifikasi</h3>
          </div>
          <span className="px-3.5 py-1.5 bg-[#A8C61F] text-white text-xs font-black rounded-full shadow-md animate-pulse">
            Lolos Pembinaan Regional
          </span>
        </div>

        {/* Card Body */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center md:text-left">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Status Kelulusan</span>
              <span className="text-xs font-extrabold text-[#0072BC] block mt-1.5">Lolos Regional</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Kelengkapan Data</span>
              <span className="text-xs font-extrabold text-green-600 block mt-1.5">✓ 100% Lengkap</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Status Kelayakan</span>
              <span className="text-xs font-extrabold text-green-600 block mt-1.5">✓ Eligible (NIB Aktif)</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Verifikasi TJSL</span>
              <span className="text-xs font-extrabold text-green-600 block mt-1.5">✓ Terverifikasi (PFpreneur)</span>
            </div>
          </div>

          {/* Clarification Box (Graceful empty state/no clarification needed) */}
          <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-[#0072BC] shrink-0 mt-0.5 animate-bounce" />
            <div className="text-xs text-gray-600 leading-relaxed">
              <strong className="text-[#16365C] block mb-0.5">Semua Berkas Terverifikasi Sah!</strong>
              Tidak ada permintaan klarifikasi aktif dari kurator pusat. Data omzet awal, legalitas NIB, dan riwayat program TJSL Anda telah cocok dengan sistem database nasional Satu Data SMEPP.
            </div>
          </div>

          {/* Announcement Text Box */}
          <div className="p-5 bg-green-50 border border-green-100 rounded-2xl space-y-2">
            <h4 className="text-sm font-black text-green-800 flex items-center gap-1.5">
              <Award className="h-5 w-5 text-[#A8C61F]" />
              <span>Pengumuman Hasil Seleksi Regional:</span>
            </h4>
            <p className="text-xs text-green-700 leading-relaxed font-medium">
              Selamat! Berdasarkan hasil scoring otomatis berkas administrasi, legalitas usaha, rekam jejak program pembinaan terdahulu, dan komitmen tinggi Anda, brand <strong>"Rasa Nusantara"</strong> dinyatakan <strong>LOLOS UTAMA</strong> untuk mengikuti rangkaian <strong>Pembinaan UMK Academy 2026 Regional Jawa Tengah</strong>.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              onClick={() => setShowDetailProses(!showDetailProses)}
              className="px-5 py-3 bg-[#16365C] hover:bg-[#16365C]/95 text-white font-bold rounded-xl text-xs transition flex justify-center items-center gap-1.5"
            >
              <span>{showDetailProses ? 'Sembunyikan Detail Proses' : 'Lihat Detail Sub-Status Proses'}</span>
              <ChevronRight className={`h-4 w-4 transition-transform ${showDetailProses ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* C. COLLAPSIBLE PROCESS DETAILED TIMELINE */}
      {showDetailProses && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h4 className="font-extrabold text-sm border-b pb-2 text-[#16365C]">Detail Langkah Operasional Seleksi Regional Anda:</h4>
          <div className="relative border-l border-gray-200 pl-6 space-y-6 py-2">
            {processSteps.map((step, idx) => (
              <div key={idx} className="relative">
                {/* Dot */}
                <div className="absolute -left-[31px] top-1 h-5 w-5 rounded-full bg-white border-2 border-[#0072BC] flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-[#0072BC]" />
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <div>
                    <h5 className="text-xs font-black text-[#16365C]">{idx + 1}. {step.name}</h5>
                    <p className="text-[11px] text-gray-500 mt-0.5">{step.desc}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-[9px] font-extrabold bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full">
                      {step.status}
                    </span>
                    <span className="block text-[9px] text-gray-400 mt-0.5">{step.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* D. INTERACTIVE REGIONAL ONBOARDING STEPS (Section 17) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg space-y-6">
        <h3 className="text-base font-extrabold border-b pb-3 flex items-center gap-2 text-[#16365C]">
          <PlayCircle className="h-5 w-5 text-[#0072BC]" />
          <span>Langkah Onboarding Pembinaan Regional (Wajib Diisi)</span>
        </h3>

        {onboardingStatus === 'Belum Konfirmasi' ? (
          <div className="space-y-6">
            <p className="text-xs text-gray-500 leading-relaxed">
              Mohon selesaikan lembar konfirmasi kehadiran dan penandatanganan komitmen belajar di bawah ini untuk mengaktifkan akun LMS regional Anda.
            </p>

            <div className="p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-100">
              <span className="text-xs font-bold text-[#16365C] block">1. Surat Pernyataan Re-Komitmen & Integritas Belajar</span>
              <div className="text-[11px] text-gray-600 bg-white p-3.5 rounded-lg border border-gray-100 max-h-40 overflow-y-auto leading-relaxed space-y-2">
                <p className="font-bold">Sebagai peserta terpilih UMK Academy 2026 Regional Jawa Tengah, saya menyatakan:</p>
                <p>• Bersedia mengikuti seluruh rangkaian kelas online, webinar, coaching tatap muka, dan pameran wajib.</p>
                <p>• Berkomitmen memperbarui data omzet serta profil bisnis di Business Passport secara jujur setiap bulan.</p>
                <p>• Menyelesaikan minimal 80% tugas (Challenges) yang diberikan oleh fasilitator.</p>
                <p>• Menyetujui konsekuensi non-aktif (pemberhentian hak kepesertaan) apabila tidak hadir 3 kali berturut-turut tanpa alasan medis/darurat.</p>
              </div>

              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasSignedCommitment}
                  onChange={(e) => setHasSignedCommitment(e.target.checked)}
                  className="mt-0.5 rounded text-[#0072BC] focus:ring-[#0072BC]"
                />
                <span className="text-xs text-gray-700 leading-normal">
                  Saya menyatakan setuju, bersedia, dan berjanji akan mematuhi seluruh komitmen di atas dengan penuh tanggung jawab.
                </span>
              </label>
            </div>

            {/* Sektor & Region Confirm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border">
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Sektor Usaha Terkonfirmasi</span>
                <strong className="text-xs block mt-1 text-[#16365C]">{participant.sector}</strong>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border">
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Wilayah Penugasan Regional</span>
                <strong className="text-xs block mt-1 text-[#16365C]">Regional {participant.region || 'Jawa Tengah'}</strong>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  if (confirm('Apakah Anda yakin ingin mengundurkan diri? Posisi Anda akan digantikan oleh peserta cadangan regional.')) {
                    setOnboardingStatus('Mengundurkan Diri');
                  }
                }}
                className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition"
              >
                Mengundurkan Diri
              </button>
              <button
                onClick={() => {
                  if (!hasSignedCommitment) {
                    alert('Mohon centang persetujuan lembar komitmen belajar terlebih dahulu!');
                    return;
                  }
                  setOnboardingStatus('Sudah Konfirmasi');
                  alert('Selamat! Konfirmasi kehadiran Anda berhasil disimpan. Grup belajar, modul, dan alokasi fasilitator sekarang aktif.');
                }}
                className="px-5 py-2.5 bg-[#A8C61F] hover:bg-[#A8C61F]/90 text-white rounded-xl text-xs font-extrabold shadow-md transition"
              >
                Konfirmasi Kehadiran & Aktifkan LMS
              </button>
            </div>
          </div>
        ) : onboardingStatus === 'Mengundurkan Diri' ? (
          <div className="p-5 bg-red-50 border border-red-100 rounded-2xl space-y-2 text-center py-8">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto animate-pulse" />
            <h4 className="text-sm font-black text-red-800">Status Anda: Mengundurkan Diri</h4>
            <p className="text-xs text-red-700 max-w-md mx-auto">
              Anda telah menyatakan mengundurkan diri dari program Pertamina UMK Academy 2026. Posisi Anda otomatis dialokasikan kepada peserta cadangan di peringkat regional teratas berikutnya. Terima kasih atas partisipasi Anda.
            </p>
          </div>
        ) : (
          /* ONBOARDING SUCCESS ACTIVE REGIONAL VIEW */
          <div className="space-y-6">
            <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3">
              <CheckSquare className="h-5 w-5 text-[#A8C61F]" />
              <div className="text-xs text-green-800 font-bold">
                ✓ Onboarding Selesai! Selamat berjuang di kelas Regional Jawa Tengah.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* WhatsApp group */}
              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase block">Langkah 1: Komunikasi</span>
                  <strong className="text-xs text-[#16365C] block mt-1">Gabung WhatsApp Group</strong>
                  <p className="text-[11px] text-gray-400 mt-1">Grup koordinasi resmi bersama fasilitator dan rekan se-region Jateng.</p>
                </div>
                <button
                  onClick={() => alert('Membuka undangan grup belajar WhatsApp: "Pertamina UMK Academy Jateng 2026"')}
                  className="w-full mt-2 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold text-center flex justify-center items-center gap-1.5 transition"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Join WA Group Regional</span>
                </button>
              </div>

              {/* Kick Off */}
              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase block">Langkah 2: Kick-Off</span>
                  <strong className="text-xs text-[#16365C] block mt-1">Jadwal Kick-Off Regional</strong>
                  <p className="text-[11px] text-gray-400 mt-1">Sesi pengenalan kelas dan silabus lengkap bersama komite BUMN.</p>
                  <span className="inline-block mt-2 text-[10px] bg-blue-50 text-blue-700 font-extrabold px-2 py-0.5 rounded">
                    Kamis, 2 Juli 2026 • 09:00 WIB
                  </span>
                </div>
                <button
                  onClick={() => alert('Membuka tautan webinar Kick-Off Regional (Zoom Link)')}
                  className="w-full mt-2 py-2 bg-[#0072BC] hover:bg-[#0072BC]/90 text-white rounded-xl text-xs font-bold text-center block transition"
                >
                  Masuk Tautan Webinar
                </button>
              </div>

              {/* Facilitator Allocation */}
              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-extrabold uppercase block">Langkah 3: Pendampingan</span>
                  <strong className="text-xs text-[#16365C] block mt-1">Fasilitator Kelas Anda</strong>
                  <div className="flex items-center gap-2.5 mt-2">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                      alt="Facilitator Andi"
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                    <div>
                      <strong className="text-xs text-gray-700 block leading-none">Andi Pratama</strong>
                      <span className="text-[9px] text-gray-400 block mt-1">Fasilitator Utama Jateng</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => alert('Menghubungi Fasilitator Andi Pratama via chat helpdesk')}
                  className="w-full mt-2 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold text-center block transition"
                >
                  Chat Fasilitator
                </button>
              </div>
            </div>

            {/* Quick Access to Class Center */}
            <div className="p-5 bg-[#A8C61F]/10 border border-[#A8C61F]/30 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <strong className="text-sm block text-[#16365C]">LMS Pembinaan Regional Jawa Tengah Aktif</strong>
                <p className="text-xs text-gray-500 mt-1">Akses kurikulum modul kelas, rekam jejak presensi, dan submit challenge bisnis Anda sekarang.</p>
              </div>
              <button
                onClick={() => onTabChange('kelas')}
                className="px-5 py-2.5 bg-[#A8C61F] hover:bg-[#A8C61F]/90 text-white font-extrabold rounded-xl text-xs shadow-md transition shrink-0"
              >
                Mulai Belajar Sekarang
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

// Leave the rest of the original unused component below, but we exited early above.
const unusedCodePlaceholderForVite = () => {
  const getActiveStageIndex = (s: string) => 1;
  const participant = { stage: '', sector: '', businessName: '', passport: { financials: { revenueBaseline: 0, revenueCurrent: 0, employeesBaseline: 0, employeesCurrent: 0 } } } as any;
  const journeyStages = [] as any[];
  const agendaEvents = [] as any[];
  const challenges = [] as any[];
  const onTabChange = (t: string) => {};

  const activeIdx = getActiveStageIndex(participant.stage);

  // Default selected stage is the participant's current stage
  const [selectedStageId, setSelectedStageId] = React.useState<string>(
    journeyStages[activeIdx]?.id || 'pembinaan_regional'
  );

  // Formatting utility
  const formatRupiah = (num: number) => {
    return 'Rp' + num.toLocaleString('id-ID');
  };

  // Next upcoming event for Siti
  const nextEvent = agendaEvents.find(e => e.attendanceStatus === 'Menunggu') || agendaEvents[2];

  // Uncompleted important tasks
  const pendingChallenges = challenges.filter(c => c.status === 'Draft' || c.status === 'Perlu Revisi');

  return (
    <div id="participant-dashboard" className="space-y-6 pb-20 md:pb-10 font-sans text-[#16365C]">
      {/* A. WELCOME HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-1">
        <div>
          <div className="flex items-center space-x-2 bg-[#0072BC]/10 px-3 py-1 rounded-full text-[11px] font-bold text-[#0072BC] w-max mb-2">
            <Sparkles className="h-3.5 w-3.5 text-[#A8C61F]" />
            <span>Regional Jawa Tengah • {participant.sector}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#16365C]">Selamat datang kembali, Ibu {participant.name}!</h2>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Pantau perkembangan bisnis <strong className="text-[#0072BC]">"{participant.businessName}"</strong> hari ini.
          </p>
        </div>
        <div className="flex gap-3 shrink-0 w-full md:w-auto">
          <button 
            onClick={() => onTabChange('rapor')}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center gap-2 text-[#16365C] shadow-sm transition"
          >
            <Award className="w-4 h-4 text-[#0072BC]" />
            Unduh Rapor
          </button>
          <button 
            onClick={() => onTabChange('challenge')}
            className="flex-1 md:flex-initial px-4 py-2.5 bg-[#ED1B2F] hover:bg-[#ED1B2F]/90 text-white rounded-xl text-xs md:text-sm font-bold shadow-md shadow-red-200/50 transition"
          >
            Kerjakan Challenge
          </button>
        </div>
      </div>

      {/* TJSL VERIFICATION ACTION CARD */}
      {participant.tjslVerificationStatus && (
        <div className="p-4 bg-gradient-to-r from-[#0072BC]/5 to-[#A8C61F]/5 border border-[#0072BC]/20 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl bg-white shadow-sm shrink-0 ${
              participant.tjslVerificationStatus === 'Terverifikasi' ? 'text-green-600' :
              participant.tjslVerificationStatus === 'Perlu Klarifikasi' ? 'text-orange-500' :
              'text-[#0072BC]'
            }`}>
              {participant.tjslVerificationStatus === 'Terverifikasi' ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <ShieldAlert className="h-5 w-5 animate-pulse" />
              )}
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status Verifikasi Binaan TJSL Pertamina</p>
              <h4 className="text-sm font-extrabold text-[#16365C] mt-0.5">
                {participant.tjslVerificationStatus === 'Terverifikasi' ? 'Selamat! Status Binaan Anda Terverifikasi' :
                 participant.tjslVerificationStatus === 'Perlu Klarifikasi' ? 'Klarifikasi Diperlukan untuk Kelayakan Binaan' :
                 participant.tjslVerificationStatus === 'Menunggu Verifikasi' ? 'Klarifikasi / Klaim Sedang Ditinjau' :
                 'Status: ' + participant.tjslVerificationStatus}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {participant.tjslVerificationStatus === 'Terverifikasi' ? 'Klaim Anda terbukti sah dalam database Satu Data SMEPP.' :
                 participant.tjslVerificationStatus === 'Perlu Klarifikasi' ? 'Ditemukan perbedaan data. Mohon lengkapi tanggapan dan upload berkas bukti segera.' :
                 'Dokumen Anda sedang berada di antrean pemeriksaan manual.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onTabChange('tjsl_verification')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition shrink-0 w-full md:w-auto text-center ${
              participant.tjslVerificationStatus === 'Perlu Klarifikasi' ? 'bg-[#ED1B2F] hover:bg-[#ED1B2F]/90 text-white' : 'bg-white border border-gray-200 hover:bg-gray-50 text-[#16365C]'
            }`}
          >
            {participant.tjslVerificationStatus === 'Perlu Klarifikasi' ? 'Kirim Klarifikasi Sekarang' : 'Lihat Detail Status'}
          </button>
        </div>
      )}

      {/* B. SIMPLIFIED JOURNEY TRACKER */}
      <div id="simplified-journey-tracker" className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-3 gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#16365C]">Journey Tahapan Program UMK Academy 2026</h3>
            <p className="text-xs text-gray-400 mt-0.5">Klik pada tiap tahap di bawah untuk melihat rincian progres dan prasyarat</p>
          </div>
          <span className="text-[11px] font-bold text-[#0072BC] bg-blue-50 px-3 py-1 rounded-full border border-blue-100/50 w-fit">
            Tahap Saat Ini: {journeyStages[activeIdx]?.label || 'Pembinaan Regional'}
          </span>
        </div>

        {/* DESKTOP TIMELINE ROW */}
        <div className="hidden md:block">
          <div className="relative flex flex-row justify-between items-start gap-4 py-4 px-2">
            {/* Background progress line */}
            <div className="absolute top-[28px] left-[6%] right-[6%] h-[3px] bg-gray-100 -z-0"></div>
            <div 
              className="absolute top-[28px] left-[6%] h-[3px] bg-[#A8C61F] transition-all duration-500 -z-0"
              style={{ width: `${(activeIdx / (journeyStages.length - 1)) * 88}%` }}
            ></div>

            {journeyStages.map((stage, idx) => {
              const isCompleted = idx < activeIdx;
              const isCurrent = idx === activeIdx;
              const isFuture = idx > activeIdx;
              const isSelected = selectedStageId === stage.id;

              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStageId(stage.id)}
                  className="flex flex-col items-center text-center flex-1 relative z-10 w-full focus:outline-none group cursor-pointer"
                >
                  {/* Dot */}
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                      isCompleted
                        ? 'bg-[#A8C61F] text-white ring-4 ring-green-100 shadow-sm hover:scale-105'
                        : isCurrent
                        ? 'bg-[#0072BC] text-white ring-4 ring-blue-100 scale-110 font-extrabold shadow-md'
                        : 'bg-gray-100 text-gray-400 border border-gray-200 hover:bg-gray-50'
                    } ${isSelected ? 'ring-4 ring-offset-2 ring-[#0072BC]/40 scale-105' : ''}`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                  </div>
                  
                  {/* Labels */}
                  <div className="mt-3">
                    <p className={`text-[12px] font-bold leading-snug max-w-[130px] mx-auto transition-colors group-hover:text-[#0072BC] ${
                      isCurrent ? 'text-[#0072BC] font-extrabold' : isCompleted ? 'text-gray-800 font-semibold' : 'text-gray-400'
                    }`}>
                      {stage.label}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 max-w-[120px] mx-auto leading-normal">
                      {stage.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* MOBILE STEPPER VIEW (Vertical Stepper) */}
        <div className="block md:hidden space-y-3">
          {journeyStages.map((stage, idx) => {
            const isCompleted = idx < activeIdx;
            const isCurrent = idx === activeIdx;
            const isFuture = idx > activeIdx;
            const isSelected = selectedStageId === stage.id;

            return (
              <div 
                key={stage.id}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrent ? 'bg-blue-50/10 border-[#0072BC] shadow-sm' : 
                  isSelected ? 'border-gray-300 bg-gray-50/20' : 'border-gray-100 bg-white'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedStageId(stage.id)}
                  className="w-full flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        isCompleted
                          ? 'bg-[#A8C61F] text-white'
                          : isCurrent
                          ? 'bg-[#0072BC] text-white ring-2 ring-blue-100 font-extrabold'
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </div>
                    <div>
                      <p className={`text-[12px] font-bold ${
                        isCurrent ? 'text-[#0072BC] font-extrabold' : isCompleted ? 'text-gray-800 font-semibold' : 'text-gray-400'
                      }`}>
                        {stage.label}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">{stage.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${isSelected ? 'transform rotate-90' : ''}`} />
                </button>

                {/* Inline Mobile expanded content */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] space-y-2">
                    {stage.id === 'pendaftaran_verifikasi' && (
                      <div className="space-y-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                        <div className="flex justify-between">
                          <span className="text-gray-500 font-medium">Pendaftaran</span>
                          <span className="font-bold text-gray-700">Selesai</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 font-medium">Verifikasi Identitas</span>
                          <span className="font-bold text-gray-700">Selesai</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 font-medium">Verifikasi Binaan TJSL</span>
                          <span className={`font-bold ${participant.tjslVerificationStatus === 'Terverifikasi' ? 'text-green-600' : 'text-orange-500'}`}>{participant.tjslVerificationStatus || 'Terverifikasi'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 font-medium">Verifikasi Administrasi Usaha</span>
                          <span className="font-bold text-gray-700">Selesai</span>
                        </div>
                        <div className="flex justify-between border-t pt-1.5 mt-1">
                          <span className="text-[#16365C] font-bold">Eligibility</span>
                          <span className="font-bold text-[#0072BC]">Eligible — Binaan Terverifikasi</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onTabChange('tjsl_verification')}
                          className="w-full mt-2 py-1.5 bg-[#0072BC] hover:bg-[#0072BC]/90 text-white rounded-lg text-[10px] font-bold text-center block"
                        >
                          Lihat Detail Verifikasi
                        </button>
                      </div>
                    )}

                    {stage.id === 'pembinaan_regional' && (
                      <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-center">
                        <div>
                          <span className="text-[8px] text-gray-400 uppercase block">Belajar</span>
                          <span className="font-extrabold text-[#16365C] text-xs">{participant.learningProgress}%</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-gray-400 uppercase block">Hadir</span>
                          <span className="font-extrabold text-[#16365C] text-xs">{participant.attendanceRate}%</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-gray-400 uppercase block">Poin</span>
                          <span className="font-extrabold text-green-600 text-xs">{participant.challengePoints}</span>
                        </div>
                      </div>
                    )}

                    {stage.id === 'kurasi_nasional' && (
                      <p className="text-gray-500 italic bg-gray-50 p-2 rounded-lg text-center">
                        Jadwal: Juli 2026. Penilaian berdasarkan rekam jejak regional.
                      </p>
                    )}

                    {stage.id === 'pembinaan_nasional' && (
                      <p className="text-gray-500 italic bg-gray-50 p-2 rounded-lg text-center">
                        Jadwal: Agustus 2026. Kurikulum ekspor & kemitraan strategis.
                      </p>
                    )}

                    {stage.id === 'seleksi_akhir' && (() => {
                      let top100Status = 'Belum Dinilai';
                      let calonPagStatus = 'Belum Dinilai';

                      if (participant.stage === 'Graduation' || participant.stage === 'Champions') {
                        top100Status = 'Lolos';
                        calonPagStatus = participant.isRecommendedAggregator ? 'Lolos' : 'Tidak Lolos';
                      } else if (participant.stage === 'Top 100' || participant.stage === 'Top 100 Champion') {
                        top100Status = 'Lolos';
                        calonPagStatus = 'Menunggu Finalisasi';
                      } else if (participant.stage === '100 Calon PAG') {
                        top100Status = 'Lolos';
                        calonPagStatus = 'Lolos';
                      } else if (activeIdx === 4) {
                        top100Status = 'Sedang Dikurasi';
                        calonPagStatus = 'Sedang Dikurasi';
                      }

                      return (
                        <div className="space-y-1.5 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Status Top 100</span>
                            <span className="font-bold text-gray-700">{top100Status}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Status Calon PAG</span>
                            <span className="font-bold text-gray-700">{calonPagStatus}</span>
                          </div>
                        </div>
                      );
                    })()}

                    {stage.id === 'inaugurasi_champions' && (
                      <p className="text-gray-500 italic bg-gray-50 p-2 rounded-lg text-center">
                        Jadwal: Oktober 2026. Apresiasi dan penghargaan lulusan terbaik.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* DESKTOP INTERACTIVE EXPANDED DETAILS CARD */}
        <div className="hidden md:block bg-gray-50/50 rounded-2xl p-6 border border-gray-100/80 mt-4">
          {selectedStageId === 'pendaftaran_verifikasi' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-[#16365C]">Detail Tahap: Pendaftaran & Verifikasi</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Penilaian administrasi, legalitas, identitas, dan keaslian status TJSL</p>
                </div>
                <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold rounded-full">
                  Selesai
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-2.5">
                      <span className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs font-mono">✓</span>
                      <span className="text-xs font-bold text-gray-700">Pendaftaran</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500">Selesai</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-2.5">
                      <span className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs font-mono">✓</span>
                      <span className="text-xs font-bold text-gray-700">Verifikasi Identitas</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500">Selesai</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-2.5">
                      <span className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs font-mono">✓</span>
                      <span className="text-xs font-bold text-gray-700">Verifikasi Administrasi Usaha</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500">Selesai</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center space-x-2.5">
                      <span className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs font-mono">✓</span>
                      <span className="text-xs font-bold text-gray-700">Verifikasi Binaan TJSL</span>
                    </div>
                    <span className={`text-xs font-bold ${
                      participant.tjslVerificationStatus === 'Terverifikasi' ? 'text-green-600' :
                      participant.tjslVerificationStatus === 'Perlu Klarifikasi' ? 'text-orange-500' :
                      'text-[#0072BC]'
                    }`}>
                      {participant.tjslVerificationStatus || 'Terverifikasi'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-blue-100 shadow-sm">
                    <div className="flex items-center space-x-2.5">
                      <span className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-[#0072BC] font-bold text-xs font-mono">✓</span>
                      <span className="text-xs font-bold text-[#16365C]">Eligibility</span>
                    </div>
                    <span className="text-xs font-bold text-[#0072BC]">
                      Eligible — Binaan Terverifikasi
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-gray-200/50">
                <button
                  type="button"
                  onClick={() => onTabChange('tjsl_verification')}
                  className="px-4 py-2 bg-[#0072BC] hover:bg-[#0072BC]/90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-sm shadow-blue-200"
                >
                  <span>Lihat Detail Verifikasi</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {selectedStageId === 'pembinaan_regional' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-[#16365C]">Detail Tahap: Pembinaan Regional</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Mentoring regional intensif, penugasan mandiri, dan pengerjaan modul belajar</p>
                </div>
                <span className="px-2.5 py-0.5 bg-blue-100 text-[#0072BC] text-[10px] font-bold rounded-full">
                  Aktif
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Kemajuan Belajar</span>
                  <span className="text-xl font-extrabold text-[#16365C] block mt-1">{participant.learningProgress}%</span>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#A8C61F] h-full" style={{ width: `${participant.learningProgress}%` }}></div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Tingkat Kehadiran</span>
                  <span className="text-xl font-extrabold text-[#16365C] block mt-1">{participant.attendanceRate}%</span>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#0072BC] h-full" style={{ width: `${participant.attendanceRate}%` }}></div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">Total Poin Tantangan</span>
                  <span className="text-xl font-extrabold text-green-600 block mt-1">{participant.challengePoints} Poin</span>
                  <span className="text-[9px] text-gray-400 block mt-2">Selesaikan lebih banyak challenge untuk poin ekstra!</span>
                </div>
              </div>
            </div>
          )}

          {selectedStageId === 'kurasi_nasional' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-[#16365C]">Detail Tahap: Kurasi Nasional</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Tahap penyeleksian peserta terbaik dari regional menuju kancah nasional</p>
                </div>
                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full">
                  Belum Dimulai
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Sesi kurasi nasional dijadwalkan pada bulan <strong className="text-[#0072BC]">Juli 2026</strong>. Penilaian mencakup rekam jejak kehadiran, nilai tantangan/tugas, pertumbuhan omset usaha, kematangan produk, serta kelengkapan sertifikasi legalitas usaha.
              </p>
            </div>
          )}

          {selectedStageId === 'pembinaan_nasional' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-[#16365C]">Detail Tahap: Pembinaan Nasional</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Pembinaan eksklusif untuk peserta tersertifikasi nasional & persiapan pasar global</p>
                </div>
                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full">
                  Belum Dimulai
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Peserta yang lolos kurasi nasional akan mengikuti program pembinaan intensif pada bulan <strong className="text-[#0072BC]">Agustus 2026</strong>. Fokus materi meliputi peningkatan ekspor, manajemen keuangan tingkat lanjut, penyesuaian regulasi dagang global, serta persiapan pameran SMEXPO 2026.
              </p>
            </div>
          )}

          {selectedStageId === 'seleksi_akhir' && (() => {
            let top100Status = 'Belum Dinilai';
            let calonPagStatus = 'Belum Dinilai';

            if (participant.stage === 'Graduation' || participant.stage === 'Champions') {
              top100Status = 'Lolos';
              calonPagStatus = participant.isRecommendedAggregator ? 'Lolos' : 'Tidak Lolos';
            } else if (participant.stage === 'Top 100' || participant.stage === 'Top 100 Champion') {
              top100Status = 'Lolos';
              calonPagStatus = 'Menunggu Finalisasi';
            } else if (participant.stage === '100 Calon PAG') {
              top100Status = 'Lolos';
              calonPagStatus = 'Lolos';
            } else if (activeIdx === 4) {
              top100Status = 'Sedang Dikurasi';
              calonPagStatus = 'Sedang Dikurasi';
            }

            const getBadgeClass = (val: string) => {
              switch (val) {
                case 'Lolos':
                  return 'bg-green-100 text-green-800 border-green-200';
                case 'Tidak Lolos':
                  return 'bg-red-100 text-red-800 border-red-200';
                case 'Sedang Dikurasi':
                  return 'bg-orange-100 text-orange-800 border-orange-200';
                case 'Menunggu Finalisasi':
                  return 'bg-blue-100 text-[#0072BC] border-blue-200 animate-pulse';
                default:
                  return 'bg-gray-100 text-gray-500 border-gray-200';
              }
            };

            return (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#16365C]">Detail Tahap: Seleksi Akhir</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">Penetapan Top 100 Champion dan 100 Calon Peserta Pertapreneur Aggregator (PAG)</p>
                  </div>
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                    activeIdx === 4 ? 'bg-blue-100 text-[#0072BC] animate-pulse' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {activeIdx > 4 ? 'Selesai' : activeIdx === 4 ? 'Aktif' : 'Belum Dimulai'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Status Top 100 Champion</span>
                      <p className="text-xs text-gray-500 mt-0.5">Pemilihan 100 UMK Champion Nasional</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold border rounded-lg ${getBadgeClass(top100Status)}`}>
                      {top100Status}
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Status Calon PAG</span>
                      <p className="text-xs text-gray-500 mt-0.5">100 Calon Peserta Pertapreneur Aggregator</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold border rounded-lg ${getBadgeClass(calonPagStatus)}`}>
                      {calonPagStatus}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {selectedStageId === 'inaugurasi_champions' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-[#16365C]">Detail Tahap: Inaugurasi & Champions</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Puncak apresiasi penghargaan, pengumuman lulusan terbaik (Champions), dan seremoni kelulusan</p>
                </div>
                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full">
                  Belum Dimulai
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Puncak seremonial kelulusan dan penobatan program UMK Academy 2026 dijadwalkan pada bulan <strong className="text-[#0072BC]">Oktober 2026</strong>. Para lulusan terbaik akan diundang dalam gala dinner apresiasi dan berkesempatan mendapatkan hibah pengembangan bisnis lanjutan.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* C. MAIN SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Kelengkapan Profil</span>
          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-[#16365C]">{participant.passport.completeness}%</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#0072BC] h-full rounded-full" style={{ width: `${participant.passport.completeness}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Progres Belajar</span>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-amber-500">{participant.learningProgress}%</span>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${participant.learningProgress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Poin</span>
          <div className="mt-3">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-extrabold text-[#A8C61F]">{participant.challengePoints.toLocaleString()}</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold">Top 10%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Kehadiran Kelas</span>
          <div className="mt-3">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-extrabold text-[#16365C]">{participant.attendanceRate}%</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full font-bold">Sangat Baik</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Rapor Sementara</span>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-[#0072BC]">{participant.overallScore}/100</span>
            <span className="text-[9px] text-green-500 font-bold block mt-1">Lulus Grade</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Challenge Selesai</span>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-[#A8C61F]">3<span className="text-xs text-gray-400">/5</span></span>
            <span className="text-[9px] text-[#0072BC] font-semibold block mt-1">1 Menunggu</span>
          </div>
        </div>
      </div>

      {/* D. NEXT ACTIONS & EVENT CALENDAR BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Priority Actions */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#16365C]">Tugas Prioritas Minggu Ini</h3>
            <span className="text-xs bg-red-50 text-[#ED1B2F] font-bold px-2 py-0.5 rounded">Penting</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-red-50/50 hover:bg-red-50 border border-red-100/50 rounded-xl flex items-center justify-between cursor-pointer transition" onClick={() => onTabChange('passport')}>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-[#ED1B2F] font-bold text-xs shrink-0">1</div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Lengkapi laporan omzet bulan Juni</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Batas Pengisian: 30 Juni 2026 • Menu Business Passport</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>

            <div className="p-3 bg-blue-50/30 hover:bg-blue-50 border border-blue-100/30 rounded-xl flex items-center justify-between cursor-pointer transition" onClick={() => onTabChange('challenges')}>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-[#0072BC] font-bold text-xs shrink-0">2</div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Selesaikan Challenge SOP Produksi</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Tugas Wajib • Nilai 300 Poin • Sesi Pembinaan</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>

            <div className="p-3 bg-green-50/30 hover:bg-green-50 border border-green-100/30 rounded-xl flex items-center justify-between cursor-pointer transition" onClick={() => onTabChange('agenda')}>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-[#A8C61F] font-bold text-xs shrink-0">3</div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Hadir di Webinar Legalitas Usaha Mikro</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Kamis, 2 Juli 2026 - 09.00 WIB • Zoom Streaming</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Next Scheduled Event Card */}
        <div className="bg-[#16365C] p-5 rounded-2xl text-white shadow-md lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-[#A8C61F] uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-md">Agenda Terdekat</span>
              <Calendar className="h-5 w-5 text-[#A8C61F]" />
            </div>
            
            <div className="mt-4">
              <h4 className="font-bold text-sm leading-snug">{nextEvent.title}</h4>
              <p className="text-[11px] text-white/70 mt-1">Oleh: {nextEvent.speaker}</p>
            </div>

            <div className="mt-3 flex items-center space-x-2 text-xs text-white/80 bg-white/5 p-2 rounded-lg">
              <Clock className="h-3.5 w-3.5 text-[#A8C61F]" />
              <span>{nextEvent.date} • {nextEvent.time}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex space-x-2">
            <button
              onClick={() => onTabChange('agenda')}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2 rounded-lg transition"
            >
              Lihat Agenda
            </button>
            <a
              href={nextEvent.location}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#A8C61F] hover:bg-[#A8C61F]/90 text-[#16365C] font-bold text-xs py-2 rounded-lg transition text-center"
            >
              Masuk Zoom
            </a>
          </div>
        </div>
      </div>

      {/* E. BUSINESS GROWTH SNAPSHOT (WITH INTERACTIVE GRAPH) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Line Chart */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-8">
          <div className="flex justify-between items-center pb-4 border-b mb-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#16365C]">Grafik Pertumbuhan Pendapatan (Omzet)</h3>
              <p className="text-xs text-gray-500">Mencatat omzet baseline vs kenaikan kelas real-time tahun berjalan</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded flex items-center space-x-1 w-max">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+23.3% Growth</span>
              </span>
            </div>
          </div>

          {/* Recharts Render */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0072BC" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0072BC" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
                <XAxis dataKey="month" stroke="#A1A1AA" fontSize={11} tickLine={false} />
                <YAxis stroke="#A1A1AA" fontSize={11} tickFormatter={(v) => `${(v/1000000).toFixed(1)}Jt`} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(v: any) => [formatRupiah(Number(v)), 'Omzet']}
                  labelFormatter={(l) => `Bulan: ${l}`}
                  contentStyle={{ backgroundColor: '#16365C', borderRadius: '12px', color: 'white', fontSize: '12px', border: 'none' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0072BC" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Business Passport Indicators */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="pb-2 border-b">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#16365C]">Indikator Naik Kelas</h3>
          </div>

          <div className="space-y-3 flex-grow justify-center flex flex-col">
            <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-500">Omzet Awal (Baseline)</span>
              <span className="text-xs font-bold text-gray-700">{formatRupiah(participant.passport.financials.revenueBaseline)}</span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-500">Omzet Terkini (Juni)</span>
              <span className="text-xs font-bold text-[#0072BC]">{formatRupiah(participant.passport.financials.revenueCurrent)}</span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-500">Jumlah Pekerja</span>
              <span className="text-xs font-bold text-gray-700">{participant.passport.financials.employeesBaseline} → {participant.passport.financials.employeesCurrent} Orang</span>
            </div>

            <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-xl">
              <span className="text-xs text-gray-500">Sertifikasi Legalitas</span>
              <div className="text-right">
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded block">P-IRT & NIB</span>
                <span className="text-[9px] text-gray-400 block mt-0.5">Halal (On Progress)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onTabChange('passport')}
            className="w-full bg-[#0072BC] hover:bg-[#0072BC]/90 text-white font-bold text-xs py-2.5 rounded-xl transition flex justify-center items-center space-x-1.5"
          >
            <span>Update Business Passport</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* F. NOTIFICATIONS & FACILITATOR CORNER */}
      <div className="bg-[#A8C61F]/10 border border-[#A8C61F]/30 p-5 rounded-2xl">
        <div className="flex items-start space-x-4">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
            alt="Facilitator Andi"
            className="w-12 h-12 rounded-full border-2 border-[#0072BC] object-cover shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-[#16365C]">Andi Pratama</span>
              <span className="text-[9px] bg-[#0072BC] text-white px-1.5 py-0.2 rounded font-extrabold uppercase">Fasilitator Kelas</span>
            </div>
            <p className="text-xs italic text-gray-700 leading-relaxed">
              &ldquo;SOP sterilisasi kemasan yang Ibu Siti unggah untuk Rasa Nusantara sangat luar biasa rapi. Untuk melengkapi verifikasi Tantangan 1, mohon unggah satu foto pendukung saat lembar SOP tersebut ditempelkan di dinding dapur sebagai petunjuk staf produksi.&rdquo;
            </p>
            <span className="text-[10px] text-gray-400 block pt-1">Dikirim kemarin, 14:32 WIB • Sesi Regional Jateng</span>
          </div>
        </div>
      </div>
    </div>
  );
}
