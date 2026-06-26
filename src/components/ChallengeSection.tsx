import React, { useState } from 'react';
import { Challenge, Participant } from '../types';
import { Trophy, Award, Filter, AlertCircle, FileText, CheckCircle2, ChevronRight, Upload, Link, ListFilter, Star, Sparkles } from 'lucide-react';
import { MOCK_LEADERBOARD } from '../data/initialData';

interface ChallengeSectionProps {
  challenges: Challenge[];
  onSubmitChallenge: (challengeId: string, submission: any) => void;
  points: number;
}

export default function ChallengeSection({ challenges, onSubmitChallenge, points }: ChallengeSectionProps) {
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard' | 'badges'>('challenges');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  
  // Submit modal states
  const [textResponse, setTextResponse] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [videoLink, setVideoLink] = useState('');

  const currentChallenge = challenges.find(c => c.id === selectedChallengeId);

  const handleOpenSubmit = (challengeId: string) => {
    const c = challenges.find(ch => ch.id === challengeId);
    if (!c) return;
    
    // Pre-fill if draft/revising
    setTextResponse(c.submission?.textResponse || '');
    setFileUrl(c.submission?.fileUrl || '');
    setPhotoUrl(c.submission?.photoUrl || '');
    setVideoLink(c.submission?.videoLink || '');
    setSelectedChallengeId(challengeId);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textResponse.trim()) {
      alert('Mohon isi deskripsi tanggapan tantangan Anda.');
      return;
    }
    
    const submission = {
      textResponse,
      fileUrl: fileUrl || 'upload_berkas_bukti.pdf',
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80',
      videoLink,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    if (selectedChallengeId) {
      onSubmitChallenge(selectedChallengeId, submission);
    }
    setSelectedChallengeId(null);
  };

  // Status Filter options
  const statusOptions = ['Semua', 'Wajib', 'Pilihan', 'Draft', 'Sedang Diverifikasi', 'Perlu Revisi', 'Selesai'];

  const getFilteredChallenges = () => {
    return challenges.filter(c => {
      if (filterStatus === 'Semua') return true;
      if (filterStatus === 'Wajib') return c.type === 'Wajib';
      if (filterStatus === 'Pilihan') return c.type === 'Pilihan';
      if (filterStatus === 'Draft') return c.status === 'Draft';
      if (filterStatus === 'Sedang Diverifikasi') return c.status === 'Sedang Diverifikasi';
      if (filterStatus === 'Perlu Revisi') return c.status === 'Perlu Revisi';
      if (filterStatus === 'Selesai') return c.status === 'Selesai' || c.status === 'Terverifikasi';
      return true;
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-600';
      case 'Dikirim':
      case 'Sedang Diverifikasi':
        return 'bg-blue-50 text-[#0072BC] font-semibold';
      case 'Perlu Revisi':
        return 'bg-red-50 text-red-600 font-bold';
      case 'Terverifikasi':
      case 'Selesai':
        return 'bg-green-50 text-green-600 font-bold';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const badges = [
    { title: 'Konsisten Belajar', desc: 'Selesaikan 2 modul belajar berturut-turut', icon: Star, unlocked: true },
    { title: 'Digital Starter', desc: 'Aktifkan QRIS / POS digital di profil bisnis', icon: Sparkles, unlocked: true },
    { title: 'Green Initiator', desc: 'Terapkan konsep Zero Waste produksi', icon: Trophy, unlocked: true },
    { title: 'Market Explorer', desc: 'Bermitra dengan reseller di luar regional', icon: Award, unlocked: false },
    { title: 'Growth Champion', desc: 'Omzet bertumbuh > 20% di lembar evaluasi', icon: CheckCircle2, unlocked: true }
  ];

  return (
    <div id="challenges-section-container" className="space-y-6 font-sans text-[#16365C] pb-20 md:pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black">Tantangan Bisnis & Gamifikasi</h2>
          <p className="text-xs text-gray-500">Kerjakan tantangan operasional harian untuk menguji kesiapan naik kelas dan raih poin kurasi</p>
        </div>

        {/* View Switches */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl border space-x-1">
          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'challenges' ? 'bg-[#16365C] text-white shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Tantangan Saya
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'leaderboard' ? 'bg-[#16365C] text-white shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Leaderboard Kelas
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'badges' ? 'bg-[#16365C] text-white shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Lencana Penghargaan
          </button>
        </div>
      </div>

      {/* GAMIFICATION SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-[#16365C] to-[#0072BC] p-4 rounded-xl text-white shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider block">Total Poin</span>
            <span className="text-2xl font-black block mt-1">{points.toLocaleString()} XP</span>
          </div>
          <Sparkles className="h-8 w-8 text-[#A8C61F] shrink-0" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Ranking Regional</span>
            <span className="text-2xl font-black block mt-1 text-[#16365C]">#1 <span className="text-xs text-gray-400 font-medium">dari 150</span></span>
          </div>
          <Trophy className="h-8 w-8 text-[#A8C61F] shrink-0" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Challenge Selesai</span>
            <span className="text-2xl font-black block mt-1 text-green-600">3 <span className="text-xs text-gray-400 font-medium">dari 5</span></span>
          </div>
          <CheckCircle2 className="h-8 w-8 text-green-500 shrink-0" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Lencana Diperoleh</span>
            <span className="text-2xl font-black block mt-1 text-amber-500">4 <span className="text-xs text-gray-400 font-medium">unlocked</span></span>
          </div>
          <Award className="h-8 w-8 text-amber-500 shrink-0" />
        </div>
      </div>

      {/* VIEW PANEL 1: CHALLENGE LISTS */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          {/* Status Filter Tab row */}
          <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-none py-1 space-x-1.5">
            {statusOptions.map((status, i) => (
              <button
                key={i}
                onClick={() => setFilterStatus(status)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterStatus === status
                    ? 'bg-[#0072BC] text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Grid list of challenges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-sans text-xs">
            {getFilteredChallenges().map((challenge) => {
              const isPending = challenge.status === 'Sedang Diverifikasi';
              const isCompleted = challenge.status === 'Selesai' || challenge.status === 'Terverifikasi';
              const isRevision = challenge.status === 'Perlu Revisi';
              const isDraft = challenge.status === 'Draft';

              return (
                <div key={challenge.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">{challenge.type} • {challenge.points} XP</span>
                        <h4 className="text-sm font-black text-gray-800 mt-1 leading-snug">{challenge.title}</h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getStatusBadge(challenge.status)} shrink-0`}>
                        {challenge.status}
                      </span>
                    </div>

                    <p className="text-gray-600 leading-relaxed text-xs">
                      <strong>Objektif:</strong> {challenge.objective}
                    </p>

                    <div className="p-3 bg-gray-50 border rounded-xl leading-relaxed text-gray-500">
                      <strong>Bukti Kelayakan:</strong> {challenge.evidenceExample}
                    </div>

                    {/* Facilitator feedback section */}
                    {challenge.facilitatorFeedback && (
                      <div className="p-3 bg-amber-50/50 border border-amber-200/50 rounded-xl space-y-1">
                        <span className="font-bold text-[#16365C] block">Catatan Pendamping:</span>
                        <p className="text-gray-600 italic leading-normal">&ldquo;{challenge.facilitatorFeedback}&rdquo;</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t flex justify-between items-center">
                    <span className="text-[10px] text-gray-400 font-medium">Batas Kirim: {challenge.deadline}</span>
                    
                    {isCompleted ? (
                      <span className="text-[11px] text-green-600 font-bold flex items-center space-x-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Poin Terverifikasi</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOpenSubmit(challenge.id)}
                        className={`font-black text-xs px-3.5 py-1.5 rounded-xl transition ${
                          isPending
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : isRevision
                            ? 'bg-[#ED1B2F] text-white hover:bg-red-700 shadow-sm'
                            : 'bg-[#0072BC] hover:bg-[#0072BC]/95 text-white shadow-sm'
                        }`}
                        disabled={isPending}
                      >
                        {isPending ? 'Sedang Diverifikasi' : isRevision ? 'Revisi Bukti' : 'Unggah Bukti'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW PANEL 2: LEADERBOARD CLASSES */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-xs">
          <div className="p-4 bg-gray-50 border-b">
            <h4 className="font-bold">Klasemen Sementara Regional Jawa Tengah</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">Poin dihitung dari pengerjaan modul, partisipasi kelas, dan validitas tantangan bisnis.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-400 font-bold border-b text-[10px] uppercase">
                  <th className="py-3 px-4">Peringkat</th>
                  <th className="py-3 px-4">Peserta & Usaha</th>
                  <th className="py-3 px-4">Sektor Bisnis</th>
                  <th className="py-3 px-4 text-right">Poin XP</th>
                  <th className="py-3 px-4">Lencana Utama</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {MOCK_LEADERBOARD.map((p, idx) => (
                  <tr key={idx} className={`hover:bg-gray-50/50 ${p.business === 'Rasa Nusantara' ? 'bg-[#0072BC]/5 font-bold text-[#0072BC]' : ''}`}>
                    <td className="py-3.5 px-4 font-black">
                      {idx + 1 === 1 ? '🥇 1' : idx + 1 === 2 ? '🥈 2' : idx + 1 === 3 ? '🥉 3' : idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-bold text-gray-800">{p.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{p.business}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">{p.sector}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-gray-800">{p.points.toLocaleString()} XP</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg">
                        {p.badge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW PANEL 3: BADGES GRID */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-sans text-xs">
          {badges.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className={`p-5 rounded-2xl border flex items-start space-x-3.5 transition-all ${
                  b.unlocked
                    ? 'bg-white border-gray-100 shadow-sm'
                    : 'bg-gray-50 border-gray-200/60 opacity-60'
                }`}
              >
                <div className={`p-3 rounded-full ${b.unlocked ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-400'}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-gray-800">{b.title}</h4>
                    {b.unlocked ? (
                      <span className="text-[9px] bg-green-50 text-green-600 px-1.5 py-0.2 rounded font-extrabold uppercase">Unlocked</span>
                    ) : (
                      <span className="text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.2 rounded font-bold uppercase">Locked</span>
                    )}
                  </div>
                  <p className="text-gray-500 leading-normal">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* INTERACTIVE SUBMISSION MODAL (STRICT REQUIREMENT) */}
      {selectedChallengeId && currentChallenge && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handleFormSubmit} className="bg-white rounded-2xl shadow-xl border w-full max-w-lg overflow-hidden font-sans text-xs flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#16365C] text-white p-5">
              <span className="text-[10px] text-[#A8C61F] font-bold uppercase tracking-wider">{currentChallenge.type} CHALLENGE • {currentChallenge.points} Poin</span>
              <h3 className="text-base font-black mt-1">Kirim Bukti Implementasi</h3>
              <p className="text-[10px] text-white/70 leading-normal mt-1">{currentChallenge.title}</p>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="p-3 bg-blue-50/50 border border-blue-100/50 rounded-xl leading-normal text-gray-600">
                <span className="font-bold block mb-1">Objektif:</span>
                {currentChallenge.objective}
              </div>

              {/* Text Area */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Tanggapan / Laporan Tertulis *</label>
                <textarea
                  required
                  rows={4}
                  value={textResponse}
                  onChange={(e) => setTextResponse(e.target.value)}
                  placeholder="Deskripsikan proses implementasi tantangan yang sudah Anda lakukan secara rinci (contoh: alur SOP sterilisasi, dampak setelah QRIS aktif)..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#0072BC] focus:bg-white text-gray-800"
                />
              </div>

              {/* Upload & Link Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Nama Berkas Bukti (PDF / Excel)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-gray-400">
                      <FileText className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      placeholder="contoh: sop_sterilisasi.pdf"
                      className="w-full pl-8 pr-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tautan URL Pendukung</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-gray-400">
                      <Link className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                      placeholder="contoh: instagram.com/p/xxx"
                      className="w-full pl-8 pr-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Supporting Photo Upload simulation */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Simulasi Unggah Foto Bukti Kerja (Wajib)</label>
                <div className="border border-dashed border-gray-200 bg-gray-50 rounded-xl p-4 text-center cursor-pointer hover:bg-gray-100 transition-all flex flex-col items-center">
                  <Upload className="h-6 w-6 text-gray-400 mb-1" />
                  <span className="font-bold block text-gray-600">Pilih Foto Kegiatan</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">Maksimal 5MB (JPG, PNG) • Lampirkan foto asli dapur/toko</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 border-t flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setSelectedChallengeId(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0072BC] hover:bg-[#0072BC]/95 text-white font-bold rounded-lg shadow-md flex items-center space-x-1"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Kirim Bukti Kerja</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
