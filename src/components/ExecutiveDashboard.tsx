import React, { useState } from 'react';
import { Participant } from '../types';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, FileText, Download, Filter, Sparkles, CheckCircle2, ShieldCheck, Award, Info } from 'lucide-react';

interface ExecutiveDashboardProps {
  participants: Participant[];
  onUpdateParticipants: (updatedList: Participant[]) => void;
}

export default function ExecutiveDashboard({ participants, onUpdateParticipants }: ExecutiveDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'analitik' | 'kurasi' | 'export'>('analitik');
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
        <div className="flex bg-gray-100 p-1.5 rounded-xl border space-x-1">
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

    </div>
  );
}
