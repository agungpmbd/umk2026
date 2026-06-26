import React, { useState } from 'react';
import { Participant, TJSLAuditLog } from '../types';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { 
  TrendingUp, FileText, Download, Filter, Sparkles, CheckCircle2, 
  ShieldCheck, Award, Info, Search, ShieldAlert, Check, X, Clock, AlertTriangle, MessageSquare, AlertCircle
} from 'lucide-react';

interface ExecutiveDashboardProps {
  participants: Participant[];
  onUpdateParticipants: (updatedList: Participant[]) => void;
}

export default function ExecutiveDashboard({ participants, onUpdateParticipants }: ExecutiveDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'analitik' | 'kurasi' | 'export' | 'tjsl_verification'>('analitik');
  
  // TJSL states
  const [selectedPartId, setSelectedPartId] = useState<string>('P001');
  const [tjslStatusFilter, setTjslStatusFilter] = useState<string>('Semua');
  const [tjslSubholdingFilter, setTjslSubholdingFilter] = useState<string>('Semua');
  const [tjslSearch, setTjslSearch] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [activeAction, setActiveAction] = useState<'approve' | 'clarify' | 'decline' | null>(null);
  const [regionFilter, setRegionFilter] = useState('Semua');
  const [sectorFilter, setSectorFilter] = useState('Semua');
  const [exportingType, setExportingType] = useState<string | null>(null);

  // Filter participants
  const filteredParticipants = participants.filter(p => {
    const matchesRegion = regionFilter === 'Semua' || p.passport.region === regionFilter;
    const matchesSector = sectorFilter === 'Semua' || p.passport.sector === sectorFilter;
    return matchesRegion && matchesSector;
  });

  // KPI calculations
  const totalRegistrants = 5240;
  const verifiedApplicants = 3120;
  const activeRegional = 1250;
  const activeNational = 350;
  const averageConfidence = 91;

  // Recharts Data mapping
  const sectorData = [
    { name: 'Food & Beverage', value: 45, color: '#0072BC' },
    { name: 'Craft / Kerajinan', value: 20, color: '#A8C61F' },
    { name: 'Fesyen & Tekstil', value: 18, color: '#16365C' },
    { name: 'Agribisnis', value: 10, color: '#ED1B2F' },
    { name: 'Lain-lain', value: 7, color: '#A1A1AA' }
  ];

  const regionalData = [
    { name: 'Jateng', UMK: 450 },
    { name: 'Jabar', UMK: 320 },
    { name: 'Jatim', UMK: 280 },
    { name: 'Sumatera', UMK: 110 },
    { name: 'Kalimantan', UMK: 90 }
  ];

  const revenueGrowthData = [
    { month: 'Jan', Omzet: 12 },
    { month: 'Feb', Omzet: 14 },
    { month: 'Mar', Omzet: 15 },
    { month: 'Apr', Omzet: 18 },
    { month: 'Mei', Omzet: 21 },
    { month: 'Jun', Omzet: 24 }
  ];

  const handleToggleFlag = (participantId: string, flag: 'isRecommendedSMEXPO' | 'isRecommendedAggregator' | 'isUMKMTroopers' | 'isExportReady') => {
    const updated = participants.map(p => {
      if (p.id === participantId) {
        return {
          ...p,
          [flag]: !p[flag]
        };
      }
      return p;
    });
    onUpdateParticipants(updated);
  };

  const handleExportSim = (type: string) => {
    setExportingType(type);
    setTimeout(() => {
      setExportingType(null);
      alert(`Berkas Eksekutif "${type}" berhasil diekspor (Format XLS/PDF).`);
    }, 1500);
  };

  return (
    <div id="executive-dashboard-container" className="space-y-6 font-sans text-[#16365C] pb-20 md:pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black">Dashboard Eksekutif & C-Suite</h2>
          <p className="text-xs text-gray-500">Monitoring real-time kemajuan program TJSL Pertamina UMK Academy 2026 tingkat nasional</p>
        </div>

        {/* View Switches */}
        <div className="flex flex-wrap bg-gray-100 p-1.5 rounded-xl border gap-1">
          <button
            onClick={() => setActiveSubTab('analitik')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'analitik' ? 'bg-[#16365C] text-white shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Dashboard Analitik
          </button>
          <button
            onClick={() => setActiveSubTab('kurasi')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'kurasi' ? 'bg-[#16365C] text-white shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Kurasi & Rekomendasi
          </button>
          <button
            onClick={() => setActiveSubTab('tjsl_verification')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all relative ${
              activeSubTab === 'tjsl_verification' ? 'bg-[#16365C] text-white shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Verifikasi TJSL
            {participants.some(p => p.tjslVerificationStatus === 'Menunggu Verifikasi') && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-white"></span>
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('export')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeSubTab === 'export' ? 'bg-[#16365C] text-white shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            SROI & Laporan Ekspor
          </button>
        </div>
      </div>

      {/* FILTERS PANEL */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center justify-between text-xs font-sans">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-[#0072BC]" />
          <span className="font-bold">Filter Dashboard:</span>
        </div>

        <div className="flex gap-3 flex-wrap">
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="p-1.5 border rounded-lg bg-gray-50 text-gray-800"
          >
            <option value="Semua">Semua Region</option>
            <option value="Jawa Tengah">Jawa Tengah</option>
            <option value="Jawa Barat">Jawa Barat</option>
            <option value="Jawa Timur">Jawa Timur</option>
          </select>

          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="p-1.5 border rounded-lg bg-gray-50 text-gray-800"
          >
            <option value="Semua">Semua Sektor</option>
            <option value="Food & Beverage">Food & Beverage</option>
            <option value="Craft / Kerajinan">Craft / Kerajinan</option>
            <option value="Fesyen">Fesyen</option>
          </select>
        </div>
      </div>

      {/* VIEW: EXECUTIVE ANALYTICS */}
      {activeSubTab === 'analitik' && (
        <div className="space-y-6">
          {/* Executive KPI Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Pendaftar Awal (Funnel 1)</span>
              <span className="text-2xl font-black block mt-1 text-gray-800">{totalRegistrants.toLocaleString()} UMK</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Lolos Seleksi Administrasi</span>
              <span className="text-2xl font-black block mt-1 text-[#0072BC]">{verifiedApplicants.toLocaleString()} UMK</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Peserta Regional (Aktif)</span>
              <span className="text-2xl font-black block mt-1 text-green-600">{activeRegional.toLocaleString()} UMK</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Target C-Suite (Nasional)</span>
              <span className="text-2xl font-black block mt-1 text-[#ED1B2F]">{activeNational.toLocaleString()} UMK</span>
            </div>
          </div>

          {/* Program Funnel Graphic (SMEPP Specific) */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Tahapan Funnel Kurasi Pertamina UMK Academy 2026</h4>
            
            <div className="grid grid-cols-6 gap-2 text-center text-xs font-bold font-mono">
              <div className="bg-blue-900 text-white p-3 rounded-xl">
                <span>Pendaftar</span>
                <span className="block text-sm font-black mt-1">100%</span>
              </div>
              <div className="bg-[#0072BC] text-white p-3 rounded-xl">
                <span>Administrasi</span>
                <span className="block text-sm font-black mt-1">59%</span>
              </div>
              <div className="bg-[#0072BC]/80 text-white p-3 rounded-xl">
                <span>Regional</span>
                <span className="block text-sm font-black mt-1">23%</span>
              </div>
              <div className="bg-green-600 text-white p-3 rounded-xl">
                <span>Nasional</span>
                <span className="block text-sm font-black mt-1">6.6%</span>
              </div>
              <div className="bg-[#A8C61F] text-white p-3 rounded-xl">
                <span>Graduation</span>
                <span className="block text-sm font-black mt-1">2.8%</span>
              </div>
              <div className="bg-[#ED1B2F] text-white p-3 rounded-xl">
                <span>Top 100</span>
                <span className="block text-sm font-black mt-1">1.9%</span>
              </div>
            </div>
          </div>

          {/* Recharts Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
            
            {/* Pie Chart: Sector */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <h5 className="font-bold text-xs text-gray-400 uppercase tracking-wider border-b pb-2 mb-3">Peserta Berdasarkan Sektor</h5>
              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sectorData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 justify-center text-[10px] text-gray-500 font-semibold mt-2">
                {sectorData.map((s, idx) => (
                  <span key={idx} className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full block" style={{ backgroundColor: s.color }}></span>
                    <span>{s.name} ({s.value}%)</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Bar Chart: Regional */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <h5 className="font-bold text-xs text-gray-400 uppercase tracking-wider border-b pb-2 mb-3">Sebaran Regional Wilayah</h5>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" fontSize={10} />
                    <YAxis fontSize={9} />
                    <Tooltip />
                    <Bar dataKey="UMK" fill="#0072BC" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Line Chart: Revenue Trend */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <h5 className="font-bold text-xs text-gray-400 uppercase tracking-wider border-b pb-2 mb-3">Rerata Kenaikan Omzet (Miliar Rupiah)</h5>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" fontSize={10} />
                    <YAxis fontSize={9} />
                    <Tooltip />
                    <Line type="monotone" dataKey="Omzet" stroke="#ED1B2F" strokeWidth={2.5} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW: KURASI & REKOMENDASI LIST */}
      {activeSubTab === 'kurasi' && (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-xs">
          <div className="border-b pb-3 mb-4 flex justify-between items-center">
            <div>
              <h4 className="font-bold">Panel Kurasi & Flagging Akses Pasar</h4>
              <p className="text-[10px] text-gray-400">Pilih dan rekomendasikan lulusan terbaik untuk program khusus eksternal Pertamina</p>
            </div>
            <span className="text-[10px] font-bold text-[#0072BC] bg-blue-50 px-2 py-0.5 rounded">Filter: Regional Semarang ({filteredParticipants.length})</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="bg-gray-100 text-gray-400 font-bold border-b text-[10px] uppercase">
                  <th className="py-2.5 px-3">Nama / Usaha</th>
                  <th className="py-2.5 px-3">Sektor</th>
                  <th className="py-2.5 px-3 text-center">SMEXPO</th>
                  <th className="py-2.5 px-3 text-center">Aggregator</th>
                  <th className="py-2.5 px-3 text-center">UMKM Troopers</th>
                  <th className="py-2.5 px-3 text-center">Siap Ekspor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                {filteredParticipants.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-3">
                      <div>
                        <p className="font-bold text-gray-800">{p.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{p.passport.businessName}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-500">{p.passport.sector}</td>
                    
                    {/* SMEXPO flag */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggleFlag(p.id, 'isRecommendedSMEXPO')}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          p.isRecommendedSMEXPO ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {p.isRecommendedSMEXPO ? 'Rekomendasi' : 'Draf'}
                      </button>
                    </td>

                    {/* Aggregator flag */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggleFlag(p.id, 'isRecommendedAggregator')}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          p.isRecommendedAggregator ? 'bg-blue-100 text-[#0072BC]' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {p.isRecommendedAggregator ? 'Aggregator' : 'Draf'}
                      </button>
                    </td>

                    {/* Troopers flag */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggleFlag(p.id, 'isUMKMTroopers')}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          p.isUMKMTroopers ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {p.isUMKMTroopers ? 'Trooper' : 'Draf'}
                      </button>
                    </td>

                    {/* Export flag */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggleFlag(p.id, 'isExportReady')}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          p.isExportReady ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {p.isExportReady ? 'Export Ready' : 'Draf'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW: EXPORT & SROI REPORTS */}
      {activeSubTab === 'export' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SROI Explanation Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-7 space-y-4">
            <div className="border-b pb-2">
              <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Metrik SROI (Social Return on Investment) & Dampak</h4>
            </div>

            <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl flex items-start space-x-3 text-xs text-amber-800">
              <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Catatan Penting Pengukuran Dampak</span>
                Pengukuran dampak SROI program harus berbasis bukti dan memperhitungkan kontribusi faktor eksternal (misal: kondisi pasar makro, subsidi daerah) untuk menghindari bias overclaim.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-3.5 bg-gray-50 rounded-xl">
                <span className="text-gray-400 font-bold block uppercase">Rasio SROI Terproyeksi</span>
                <span className="text-xl font-black text-gray-800">1 : 4.25</span>
                <p className="text-[10px] text-gray-400 mt-1">Tiap Rp1 investasi Pertamina menghasilkan Rp4.25 nilai sosial & kemandirian lokal.</p>
              </div>

              <div className="p-3.5 bg-[#0072BC]/5 border border-[#0072BC]/10 rounded-xl">
                <span className="text-gray-400 font-bold block uppercase">Jumlah Serapan Kerja Baru</span>
                <span className="text-xl font-black text-[#0072BC]">412 Tenaga Kerja</span>
                <p className="text-[10px] text-gray-400 mt-1">Penyerapan tenaga kerja baru di tingkat regional Jawa Tengah.</p>
              </div>
            </div>
          </div>

          {/* Export Panel */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-5 space-y-4">
            <div className="border-b pb-2">
              <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Ekspor Laporan & Evaluasi Akhir</h4>
            </div>

            <p className="text-gray-500 text-xs leading-normal">
              Unduh lembar laporan kinerja program regional, kuesioner SROI, dan profil data business passport peserta dalam satu berkas terenkripsi.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleExportSim('SMEPP Executive Report')}
                className="w-full bg-[#16365C] hover:bg-[#16365C]/95 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center space-x-1.5 transition"
              >
                <Download className="h-4 w-4 text-[#A8C61F]" />
                <span>Unduh SMEPP Executive Report (PDF)</span>
              </button>

              <button
                onClick={() => handleExportSim('Social Return XLS Data')}
                className="w-full bg-[#0072BC] hover:bg-[#0072BC]/95 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center space-x-1.5 transition"
              >
                <Download className="h-4 w-4 text-[#A8C61F]" />
                <span>Ekspor Data SROI Lengkap (Excel)</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* VIEW: TJSL VERIFICATION QUEUE */}
      {activeSubTab === 'tjsl_verification' && (() => {
        // Filter participants who have some TJSL data
        const tjslParticipants = participants.filter(p => {
          const hasTjslData = !!p.tjslVerificationStatus;
          if (!hasTjslData) return false;

          const matchesSearch = p.name.toLowerCase().includes(tjslSearch.toLowerCase()) || 
                                p.businessName.toLowerCase().includes(tjslSearch.toLowerCase());
          
          const matchesStatus = tjslStatusFilter === 'Semua' || p.tjslVerificationStatus === tjslStatusFilter;
          
          const claimSubholding = p.tjslClaim?.subholding || '';
          const matchesSubholding = tjslSubholdingFilter === 'Semua' || claimSubholding === tjslSubholdingFilter;

          return matchesSearch && matchesStatus && matchesSubholding;
        });

        // Current selected participant
        const selectedPart = participants.find(p => p.id === selectedPartId) || tjslParticipants[0];

        // Hardcoded matching simulation helper
        const getDbMatch = (pId: string) => {
          if (pId === 'P001') {
            return {
              found: true,
              mitraId: 'PUMK-2024-88392',
              name: 'Siti Rahmawati',
              programAsal: 'Program PUMK Pertamina',
              subholding: 'PT Pertamina Patra Niaga',
              region: 'Jawa Tengah',
              tahun: 2024,
              statusProgram: 'Aktif',
              mismatchFields: [] as string[]
            };
          }
          if (pId === 'P006') {
            return {
              found: true,
              mitraId: 'PUMK-2024-91823',
              name: 'Ahmad Hidayat',
              programAsal: 'Program PUMK Pertamina',
              subholding: 'PHE (Pertamina Hulu Energi)',
              region: 'Jawa Barat',
              tahun: 2024,
              statusProgram: 'Aktif',
              mismatchFields: [] as string[]
            };
          }
          if (pId === 'P007') {
            return {
              found: true,
              mitraId: 'RB-2023-44122',
              name: 'Maria Lestari',
              programAsal: 'Rumah BUMN Pertamina',
              subholding: 'PT Pertamina Patra Niaga',
              region: 'Yogyakarta',
              tahun: 2023,
              statusProgram: 'Alumni',
              mismatchFields: ['tahun', 'subholding']
            };
          }
          return {
            found: false,
            reason: 'NIK atau Nama tidak terdaftar di Satu Data SMEPP.'
          };
        };

        const currentMatch = selectedPart ? getDbMatch(selectedPart.id) : null;

        const handleAuditAction = (status: 'Terverifikasi' | 'Perlu Klarifikasi' | 'Tidak Eligible', notesText: string) => {
          if (!selectedPart) return;

          const actionLabel = status === 'Terverifikasi' ? 'Status diperbarui menjadi Terverifikasi' :
                              status === 'Perlu Klarifikasi' ? 'Status diperbarui menjadi Perlu Klarifikasi' :
                              'Status diperbarui menjadi Tidak Eligible';

          const newLog: TJSLAuditLog = {
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            action: actionLabel,
            pic: 'Admin SMEPP (Pusat)',
            notes: notesText || (status === 'Terverifikasi' ? 'Klaim data terbukti sah dalam database Satu Data SMEPP.' : 'Diperbarui oleh Admin.')
          };

          const updated = participants.map(p => {
            if (p.id === selectedPart.id) {
              return {
                ...p,
                tjslVerificationStatus: status,
                tjslLogs: [newLog, ...(p.tjslLogs || [])]
              };
            }
            return p;
          });

          onUpdateParticipants(updated);
          setActiveAction(null);
          setAdminNotes('');
        };

        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: LIST AND FILTERS (5 COLS) */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-extrabold text-sm text-[#16365C] uppercase tracking-wider">Antrean Verifikasi Binaan</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Tinjau klaim dan berkas afiliasi program TJSL Pertamina</p>
              </div>

              {/* SEARCH & FILTERS */}
              <div className="space-y-2 text-xs">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={tjslSearch}
                    onChange={(e) => setTjslSearch(e.target.value)}
                    placeholder="Cari nama peserta atau bisnis..."
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#0072BC]"
                  />
                </div>

                {/* Status Filter */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold mb-1">Status Verifikasi</label>
                    <select
                      value={tjslStatusFilter}
                      onChange={(e) => setTjslStatusFilter(e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                    >
                      <option value="Semua">Semua Status</option>
                      <option value="Terverifikasi">Terverifikasi</option>
                      <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                      <option value="Perlu Klarifikasi">Perlu Klarifikasi</option>
                      <option value="Tidak Eligible">Tidak Eligible</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-gray-400 font-bold mb-1">Subholding Asal</label>
                    <select
                      value={tjslSubholdingFilter}
                      onChange={(e) => setTjslSubholdingFilter(e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                    >
                      <option value="Semua">Semua Subholding</option>
                      <option value="PT Pertamina Patra Niaga">Patra Niaga</option>
                      <option value="PHE (Pertamina Hulu Energi)">PHE (Hulu Energi)</option>
                      <option value="Rumah BUMN Pertamina">Rumah BUMN</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* PARTICIPANTS LIST */}
              <div className="space-y-2.5 overflow-y-auto max-h-[480px] pr-1">
                {tjslParticipants.length > 0 ? (
                  tjslParticipants.map(p => {
                    const isSelected = p.id === selectedPartId;
                    const claimStatus = p.tjslVerificationStatus;
                    
                    const badgeStyle = 
                      claimStatus === 'Terverifikasi' ? 'bg-green-100 text-green-800' :
                      claimStatus === 'Perlu Klarifikasi' ? 'bg-orange-100 text-orange-800' :
                      claimStatus === 'Menunggu Verifikasi' ? 'bg-blue-100 text-[#0072BC]' :
                      'bg-red-100 text-red-800';

                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedPartId(p.id);
                          setActiveAction(null);
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition text-xs space-y-2 ${
                          isSelected ? 'border-[#0072BC] bg-blue-50/10 shadow-sm' : 'border-gray-100 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono text-gray-400 block">{p.id}</span>
                            <span className="font-extrabold text-gray-800">{p.name}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeStyle}`}>
                            {claimStatus}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium">
                          <span>{p.businessName}</span>
                          <span className="text-gray-400 font-semibold">{p.tjslClaim?.subholding || 'Pendaftaran Mandiri'}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center bg-gray-50 rounded-xl border">
                    <AlertCircle className="h-6 w-6 text-gray-400 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-gray-500">Antrean Kosong</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Tidak ditemukan peserta dengan parameter penyaringan tersebut.</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: SIDE-BY-SIDE COMPARE & AUDIT PANEL (7 COLS) */}
            <div className="lg:col-span-7 space-y-6">
              {selectedPart ? (
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                  
                  {/* Participant Meta */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-3.5 gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-[#0072BC] font-extrabold block">PROFIL MITRA BINAAN</span>
                      <h3 className="font-extrabold text-base text-[#16365C]">{selectedPart.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{selectedPart.businessName} • {selectedPart.sector}</p>
                    </div>
                    <div className="bg-gray-50 px-3 py-1.5 rounded-lg border text-right">
                      <span className="text-[9px] text-gray-400 block font-bold">NIK PEMILIK</span>
                      <span className="text-xs font-mono font-bold text-gray-700">3374092209840001</span>
                    </div>
                  </div>

                  {/* COMPARISON TABLES */}
                  <div className="space-y-3.5">
                    <h4 className="text-xs font-bold uppercase text-[#0072BC] flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4" />
                      <span>Sanding Berkas Klaim vs Database PUMK Nasional</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Klaim Input Peserta */}
                      <div className="p-3.5 bg-gray-50 border border-gray-200/60 rounded-xl space-y-2.5 text-xs">
                        <div className="border-b pb-1">
                          <span className="font-extrabold text-[10px] text-gray-500 block">KLAIM MANDIRI PESERTA</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 block font-semibold">Asal Program</span>
                          <span className="font-bold text-gray-800">{selectedPart.tjslClaim?.programAsal}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-gray-400 block font-semibold">Subholding Penanggung</span>
                          <span className="font-bold text-gray-800">{selectedPart.tjslClaim?.subholding || '-'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[9px] text-gray-400 block font-semibold">Tahun</span>
                            <span className="font-bold font-mono text-gray-800">{selectedPart.tjslClaim?.tahun || '-'}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 block font-semibold">Mitra ID</span>
                            <span className="font-bold font-mono text-[#0072BC]">{selectedPart.tjslClaim?.mitraId || '-'}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[9px] text-gray-400 block font-semibold">Region</span>
                            <span className="font-bold text-gray-800">{selectedPart.tjslClaim?.region || '-'}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 block font-semibold">PIC Pendamping</span>
                            <span className="font-bold text-gray-800">{selectedPart.tjslClaim?.picName || '-'}</span>
                          </div>
                        </div>
                        <div className="border-t pt-2 mt-1">
                          <span className="text-[9px] text-gray-400 block font-semibold">Lampiran Berkas Bukti</span>
                          <span className="font-bold text-[#ED1B2F] flex items-center gap-1 cursor-pointer">
                            <FileText className="h-3 w-3 shrink-0" />
                            <span>{selectedPart.tjslClaim?.evidenceFile || 'Tidak dilampirkan'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Right: Data Padanan Database */}
                      <div className="p-3.5 bg-blue-50/20 border border-blue-100 rounded-xl space-y-2.5 text-xs">
                        <div className="border-b pb-1 flex justify-between items-center">
                          <span className="font-extrabold text-[10px] text-[#0072BC] block">DATABASE SATU DATA SMEPP</span>
                          {currentMatch && 'found' in currentMatch && currentMatch.found ? (
                            <span className="bg-green-100 text-green-800 px-1.5 py-0.2 rounded text-[8px] font-bold">Matched</span>
                          ) : (
                            <span className="bg-red-100 text-red-800 px-1.5 py-0.2 rounded text-[8px] font-bold">No Match</span>
                          )}
                        </div>

                        {currentMatch && 'found' in currentMatch && currentMatch.found ? (
                          <>
                            <div>
                              <span className="text-[9px] text-gray-400 block font-semibold">Asal Program (Database)</span>
                              <span className="font-bold text-green-800">{currentMatch.programAsal}</span>
                            </div>
                            <div>
                              <span className="text-[9px] text-gray-400 block font-semibold">Subholding (Database)</span>
                              <span className="font-bold text-green-800">{currentMatch.subholding}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-[9px] text-gray-400 block font-semibold">Tahun</span>
                                <span className={`font-bold font-mono ${currentMatch.mismatchFields.includes('tahun') ? 'text-red-500 font-extrabold' : 'text-green-800'}`}>
                                  {currentMatch.tahun}
                                </span>
                              </div>
                              <div>
                                <span className="text-[9px] text-gray-400 block font-semibold">Mitra ID</span>
                                <span className="font-bold font-mono text-green-800">{currentMatch.mitraId}</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-[9px] text-gray-400 block font-semibold">Region</span>
                                <span className="font-bold text-green-800">{currentMatch.region}</span>
                              </div>
                              <div>
                                <span className="text-[9px] text-gray-400 block font-semibold">Penerima Manfaat</span>
                                <span className="font-bold text-green-800">{currentMatch.name}</span>
                              </div>
                            </div>
                            <div className="border-t pt-2 mt-1">
                              <span className="text-[9px] text-gray-400 block font-semibold">Status Pembinaan</span>
                              <span className="px-1.5 py-0.1 bg-green-100 text-green-800 text-[9px] rounded-full font-bold inline-block mt-0.5">
                                {currentMatch.statusProgram}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full py-10 text-center space-y-1.5">
                            <ShieldAlert className="h-6 w-6 text-red-500" />
                            <span className="font-extrabold text-[11px] text-gray-700">Padanan Tidak Ditemukan</span>
                            <p className="text-[10px] text-gray-400 max-w-[180px] leading-normal">
                              {currentMatch && 'reason' in currentMatch ? currentMatch.reason : 'NIK tidak terdaftar sebagai penerima hibah binaan.'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* INTERACTIVE ACTION BUTTONS */}
                  <div className="border-t pt-4 space-y-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Tindakan Audit Lapangan:</span>
                    
                    {activeAction === null ? (
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => handleAuditAction('Terverifikasi', 'Data klaim divalidasi dan lolos verifikasi Satu Data SMEPP.')}
                          className="py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs flex justify-center items-center gap-1.5 transition shadow"
                        >
                          <Check className="h-4 w-4" />
                          <span>Setujui Klaim</span>
                        </button>

                        <button
                          onClick={() => setActiveAction('clarify')}
                          className="py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex justify-center items-center gap-1.5 transition shadow"
                        >
                          <AlertTriangle className="h-4 w-4" />
                          <span>Minta Klarifikasi</span>
                        </button>

                        <button
                          onClick={() => setActiveAction('decline')}
                          className="py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex justify-center items-center gap-1.5 transition shadow"
                        >
                          <X className="h-4 w-4" />
                          <span>Tolak Klaim</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 space-y-3.5 text-xs">
                        <div className="flex justify-between items-center font-bold text-gray-700 border-b pb-1.5">
                          <span>
                            {activeAction === 'clarify' ? 'Alasan Klarifikasi Tambahan' : 'Alasan Penolakan Klaim (Tidak Eligible)'}
                          </span>
                          <button onClick={() => setActiveAction(null)} className="text-gray-400 hover:text-gray-600">
                            Batal
                          </button>
                        </div>

                        <textarea
                          rows={3}
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder={activeAction === 'clarify' ? 'Tulis berkas apa yang harus diperbaiki oleh mitra (misal: upload ulang sertifikat)...' : 'Tulis alasan rincik mengapa mitra ini diklasifikasikan tidak eligible...'}
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800"
                        />

                        <button
                          onClick={() => handleAuditAction(activeAction === 'clarify' ? 'Perlu Klarifikasi' : 'Tidak Eligible', adminNotes)}
                          className={`w-full py-2.5 text-white font-bold rounded-xl text-xs flex justify-center items-center gap-1.5 transition ${
                            activeAction === 'clarify' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-600 hover:bg-red-700'
                          }`}
                        >
                          <span>Kirim Keputusan & Catat Log</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* HISTORY / AUDIT LOG TIMELINE */}
                  <div className="border-t pt-4 space-y-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block">Log Riwayat Verifikasi Berkas:</span>
                    <div className="relative border-l-2 border-gray-100 pl-4 space-y-3 text-xs">
                      {selectedPart.tjslLogs && selectedPart.tjslLogs.length > 0 ? (
                        selectedPart.tjslLogs.map((log, index) => (
                          <div key={index} className="relative">
                            <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-[#0072BC]"></span>
                            <div className="text-[10px] text-gray-400 font-semibold">{log.date}</div>
                            <div className="font-extrabold text-gray-800 mt-0.5">{log.action}</div>
                            <div className="text-[10px] text-gray-500 font-medium mt-0.5">Oleh: {log.pic || log.actor}</div>
                            <p className="text-[10px] text-gray-400 mt-0.5 italic">"{log.notes}"</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 italic">Belum ada riwayat audit log.</p>
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="bg-white p-10 text-center rounded-2xl border">
                  <AlertCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Pilih peserta di daftar antrean untuk mulai mengaudit.</p>
                </div>
              )}
            </div>

          </div>
        );
      })()}

    </div>
  );
}
