import React from 'react';
import { Participant, LearningModule, Challenge, AgendaEvent } from '../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import {
  Sparkles, Award, BookOpen, Clock, Calendar, CheckCircle2, TrendingUp,
  ChevronRight, Users, MessageSquare, ShieldAlert, ArrowUpRight
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

  // Journey steps mapping
  const journeySteps = [
    { label: 'Pendaftaran', desc: 'Lolos' },
    { label: 'Verifikasi', desc: 'Lolos' },
    { label: 'Pembinaan Regional', desc: 'Sedang Berjalan', active: true },
    { label: 'Kurasi Nasional', desc: 'Juli 2026' },
    { label: 'Pembinaan Nasional', desc: 'Agustus 2026' },
    { label: 'Graduation', desc: 'September 2026' }
  ];

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

      {/* B. HORIZONTAL JOURNEY TRACKER */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Journey Tahapan Program UMK Academy 2026</h3>
        
        {/* Responsive Steps */}
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-2">
          {/* Background progress line on desktop */}
          <div className="hidden md:block absolute top-[18px] left-[5%] right-[5%] h-[4px] bg-gray-100 -z-0"></div>
          <div className="hidden md:block absolute top-[18px] left-[5%] w-[40%] h-[4px] bg-[#A8C61F] -z-0"></div>

          {journeySteps.map((step, idx) => {
            const isCompleted = idx < 2;
            const isCurrent = idx === 2;
            const isFuture = idx > 2;

            return (
              <div key={idx} className="flex md:flex-col items-center text-left md:text-center flex-1 relative z-10 w-full">
                {/* Dot */}
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                    isCompleted
                      ? 'bg-[#A8C61F] text-white ring-4 ring-green-100'
                      : isCurrent
                      ? 'bg-[#0072BC] text-white ring-4 ring-blue-100 scale-110 animate-pulse'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                </div>
                
                {/* Labels */}
                <div className="ml-3 md:ml-0 md:mt-2">
                  <p className={`text-xs font-bold leading-tight ${isCurrent ? 'text-[#0072BC] font-extrabold' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
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
