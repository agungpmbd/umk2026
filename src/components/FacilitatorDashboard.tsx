import React, { useState } from 'react';
import { Participant, Challenge, ActionPlan } from '../types';
import { Users, AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight, Search, Filter, MessageSquare, BookOpen, TrendingUp, HelpCircle, Star, Sparkles } from 'lucide-react';

interface FacilitatorDashboardProps {
  participants: Participant[];
  onUpdateParticipants: (updatedList: Participant[]) => void;
}

export default function FacilitatorDashboard({ participants, onUpdateParticipants }: FacilitatorDashboardProps) {
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('Semua');
  const [riskFilter, setRiskFilter] = useState('Semua');
  const [successMessage, setSuccessMessage] = useState('');

  // Facilitator coaching note input
  const [coachingNoteInput, setCoachingNoteInput] = useState('');

  const selectedParticipant = participants.find(p => p.id === selectedParticipantId);

  // Filters calculation
  const filteredParticipants = participants.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.passport.businessName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = sectorFilter === 'Semua' || p.passport.sector === sectorFilter;
    const matchesRisk = riskFilter === 'Semua' || p.riskStatus === riskFilter;
    return matchesSearch && matchesSector && matchesRisk;
  });

  // KPI Metrics calculations
  const totalDampingan = participants.length;
  const totalBerisiko = participants.filter(p => p.riskStatus === 'Berisiko' || p.riskStatus === 'Perlu Perhatian').length;
  const pendingVerifications = participants.reduce((acc, p) => 
    acc + (p.challenges || []).filter(c => c.status === 'Sedang Diverifikasi').length, 0
  );

  // Interactive Facilitator Actions
  const handleVerifyField = (fieldName: string) => {
    if (!selectedParticipantId) return;

    const updated = participants.map(p => {
      if (p.id === selectedParticipantId) {
        return {
          ...p,
          passport: {
            ...p.passport,
            dataConfidenceLevel: Math.min(100, p.passport.dataConfidenceLevel + 5)
          }
        };
      }
      return p;
    });

    onUpdateParticipants(updated);
    triggerSuccess('Dokumen legalitas berhasil diverifikasi! Tingkat keyakinan data naik.');
  };

  const handleApproveChallenge = (challengeId: string) => {
    if (!selectedParticipantId) return;

    const updated = participants.map(p => {
      if (p.id === selectedParticipantId) {
        const updatedChallenges = (p.challenges || []).map(c => {
          if (c.id === challengeId) {
            return { ...c, status: 'Selesai' as const };
          }
          return c;
        });

        // Increase XP Points
        const challengePoints = (p.challenges || []).find(c => c.id === challengeId)?.points || 0;

        return {
          ...p,
          challenges: updatedChallenges,
          challengePoints: p.challengePoints + challengePoints
        };
      }
      return p;
    });

    onUpdateParticipants(updated);
    triggerSuccess('Tantangan disetujui! Poin XP peserta berhasil ditambahkan.');
  };

  const handleRequestRevision = (challengeId: string) => {
    if (!selectedParticipantId) return;

    const updated = participants.map(p => {
      if (p.id === selectedParticipantId) {
        const updatedChallenges = (p.challenges || []).map(c => {
          if (c.id === challengeId) {
            return {
              ...c,
              status: 'Perlu Revisi' as const,
              facilitatorFeedback: 'SOP belum memuat alur pembuangan limbah sisa cabai, silakan tambahkan diagram pembuangan ramah lingkungan.'
            };
          }
          return c;
        });
        return { ...p, challenges: updatedChallenges };
      }
      return p;
    });

    onUpdateParticipants(updated);
    triggerSuccess('Tantangan dikirim balik untuk direvisi dengan feedback khusus.');
  };

  const handleUpdateRisk = (newRisk: 'Aman' | 'Perlu Perhatian' | 'Berisiko' | 'Tidak Aktif') => {
    if (!selectedParticipantId) return;

    const updated = participants.map(p => {
      if (p.id === selectedParticipantId) {
        return { ...p, riskStatus: newRisk };
      }
      return p;
    });

    onUpdateParticipants(updated);
    triggerSuccess(`Status risiko peserta diubah menjadi: ${newRisk}`);
  };

  const handleRecommendNational = () => {
    if (!selectedParticipantId) return;

    const updated = participants.map(p => {
      if (p.id === selectedParticipantId) {
        return { ...p, stage: 'Nasional' };
      }
      return p;
    });

    onUpdateParticipants(updated);
    triggerSuccess('Selamat! Peserta direkomendasikan masuk ke seleksi Kurikulum Nasional.');
  };

  const handleAddCoachingNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachingNoteInput.trim() || !selectedParticipantId) return;

    // Simulate appending note
    setCoachingNoteInput('');
    triggerSuccess('Catatan pendampingan baru berhasil disimpan dan dikirim ke HP peserta.');
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div id="facilitator-dashboard-container" className="space-y-6 font-sans text-[#16365C] pb-20 md:pb-10">
      
      {/* Page Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-black">Dashboard Pendamping & Akselerator</h2>
        <p className="text-xs text-gray-500">Kamar operasional fasilitator untuk memantau kelayakan, membimbing rencana aksi, dan memverifikasi tantangan</p>
      </div>

      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-bold animate-pulse flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* KPI METRICS GAUGE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Peserta Binaan</span>
            <span className="text-2xl font-black block mt-1">{totalDampingan} UMK</span>
          </div>
          <Users className="h-8 w-8 text-[#0072BC]" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Peserta Berisiko</span>
            <span className="text-2xl font-black block mt-1 text-red-500">{totalBerisiko} UMK</span>
          </div>
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Perlu Verifikasi</span>
            <span className="text-2xl font-black block mt-1 text-[#0072BC]">{pendingVerifications} Tugas</span>
          </div>
          <Sparkles className="h-8 w-8 text-[#A8C61F]" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Rerata Nilai Kelas</span>
            <span className="text-2xl font-black block mt-1">82.5%</span>
          </div>
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
      </div>

      {/* DUAL PANE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANE: TABLE LIST OF PARTICIPANTS (7 Cols if detail open, 12 if closed) */}
        <div className={`${selectedParticipantId ? 'lg:col-span-6' : 'lg:col-span-12'} bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4`}>
          
          <div className="flex flex-col md:flex-row justify-between gap-3 items-center border-b pb-3">
            <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Daftar Binaan Regional Semarang</h4>
            
            {/* Table Filters */}
            <div className="flex gap-2 flex-wrap text-xs">
              <input
                type="text"
                placeholder="Cari peserta/usaha..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-1.5 border rounded-lg bg-gray-50 text-xs text-gray-800"
              />
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="p-1.5 border rounded-lg bg-gray-50 text-xs text-gray-800"
              >
                <option value="Semua">Semua Risiko</option>
                <option value="Aman">Aman</option>
                <option value="Perlu Perhatian">Perlu Perhatian</option>
                <option value="Berisiko">Berisiko</option>
              </select>
            </div>
          </div>

          {/* WARNING SYSTEM NOTIFICATION ON BOARD */}
          <div className="p-3 bg-red-50/50 border border-red-200/50 rounded-xl flex items-start space-x-2.5 text-[10px] text-red-700">
            <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">Sistem Peringatan Dini (Early Warning Rules)</span>
              Peserta di-flag merah bila: Tidak login &gt;7 hari, belum melengkapi draf baseline finansial, atau melebihi 2 batas waktu tantangan.
            </div>
          </div>

          {/* Participant Table */}
          <div className="overflow-x-auto text-xs leading-normal">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-400 font-bold border-b text-[10px] uppercase">
                  <th className="py-2.5 px-3">Nama / Usaha</th>
                  <th className="py-2.5 px-3">Progres</th>
                  <th className="py-2.5 px-3">Nilai</th>
                  <th className="py-2.5 px-3">Risiko</th>
                  <th className="py-2.5 px-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {filteredParticipants.map((p) => {
                  const isSelected = p.id === selectedParticipantId;
                  const isBerisiko = p.riskStatus === 'Berisiko' || p.riskStatus === 'Perlu Perhatian';

                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedParticipantId(p.id)}
                      className={`cursor-pointer transition ${
                        isSelected ? 'bg-[#0072BC]/5' : 'hover:bg-gray-50/50'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div>
                          <p className="font-bold text-gray-800">{p.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{p.passport.businessName}</p>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-500">{p.learningProgress}%</td>
                      <td className="py-3 px-3 font-bold">{p.challengePoints.toLocaleString()} XP</td>
                      <td className="py-3 px-3">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          p.riskStatus === 'Aman'
                            ? 'bg-green-50 text-green-600'
                            : p.riskStatus === 'Perlu Perhatian'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-red-50 text-red-600 font-bold'
                        }`}>
                          {p.riskStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <ChevronRight className="h-4 w-4 text-gray-400 inline" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT PANE: SELECTED PARTICIPANT DETAIL VIEW (Sliding detail) */}
        {selectedParticipantId && selectedParticipant && (
          <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-6 animate-fadeIn">
            
            {/* Header row with close button */}
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Detail Pendampingan</span>
                <h3 className="font-black text-base text-gray-800">{selectedParticipant.name}</h3>
                <p className="text-[10px] text-[#0072BC] font-semibold">{selectedParticipant.passport.businessName}</p>
              </div>
              <button
                onClick={() => setSelectedParticipantId(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm"
              >
                ✕ Tutup
              </button>
            </div>

            {/* Quick Actions Panel */}
            <div className="p-4 bg-gray-50 rounded-xl space-y-3 text-xs font-sans">
              <span className="font-bold text-gray-700 block">Tindakan Cepat Pendamping (Facilitator Interventions)</span>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleUpdateRisk('Aman')}
                  className="bg-green-50 hover:bg-green-100 text-green-700 font-bold px-3 py-1 rounded-lg border border-green-200"
                >
                  Set Aman
                </button>
                <button
                  onClick={() => handleUpdateRisk('Berisiko')}
                  className="bg-red-50 hover:bg-red-100 text-red-700 font-bold px-3 py-1 rounded-lg border border-red-200"
                >
                  Flag Berisiko
                </button>
                <button
                  onClick={handleRecommendNational}
                  className="bg-[#0072BC] hover:bg-[#0072BC]/95 text-white font-bold px-4 py-1.5 rounded-lg shadow"
                >
                  Rekomendasikan Naik Kelas Nasional
                </button>
              </div>
            </div>

            {/* Verification of legal files checklist */}
            <div className="space-y-3.5 text-xs">
              <h4 className="font-bold text-gray-800 border-b pb-1">Verifikasi Legalitas & Dokumen Bukti</h4>
              
              <div className="p-3 bg-gray-50 border rounded-xl flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-gray-800">Nomor Induk Berusaha (NIB)</h5>
                  <p className="text-[10px] text-gray-400 mt-0.5">Siti_Rahma_NIB.pdf • Terunggah</p>
                </div>
                <button
                  onClick={() => handleVerifyField('NIB')}
                  className="bg-[#0072BC] hover:bg-[#0072BC]/90 text-white font-bold px-3 py-1 rounded-lg"
                >
                  Verifikasi NIB
                </button>
              </div>
            </div>

            {/* Pending Challenges Verification (STRICT REQUIREMENT) */}
            <div className="space-y-3.5 text-xs">
              <h4 className="font-bold text-gray-800 border-b pb-1">Tantangan Menunggu Verifikasi</h4>

              {(selectedParticipant.challenges || []).filter(c => c.status === 'Sedang Diverifikasi').length === 0 ? (
                <p className="text-gray-400 italic text-center py-4">Tidak ada tantangan draf/pending untuk saat ini.</p>
              ) : (
                (selectedParticipant.challenges || []).filter(c => c.status === 'Sedang Diverifikasi').map((challenge) => (
                  <div key={challenge.id} className="p-4 bg-amber-50/40 border border-amber-200 rounded-xl space-y-3 leading-relaxed">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[9px] text-amber-600 font-bold block uppercase">{challenge.type} • {challenge.points} XP</span>
                        <h5 className="font-bold text-gray-800">{challenge.title}</h5>
                      </div>
                    </div>

                    <div className="p-3 bg-white border rounded-lg text-[11px] text-gray-600">
                      <strong>Laporan Tertulis Peserta:</strong>
                      <p className="mt-1 font-sans text-gray-700">
                        {challenge.submission?.textResponse || 'Telah disubmit dengan bukti fisik.'}
                      </p>
                    </div>

                    <div className="flex justify-end space-x-2 text-xs">
                      <button
                        onClick={() => handleRequestRevision(challenge.id)}
                        className="bg-white border border-red-200 text-red-600 font-bold px-3 py-1 rounded-lg hover:bg-red-50"
                      >
                        Minta Revisi
                      </button>
                      <button
                        onClick={() => handleApproveChallenge(challenge.id)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-1 rounded-lg shadow-sm"
                      >
                        Setujui & Verifikasi
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Append Coaching Notes Form */}
            <form onSubmit={handleAddCoachingNote} className="space-y-3 text-xs">
              <h4 className="font-bold text-gray-800 border-b pb-1">Tambah Catatan Pendampingan Baru</h4>
              <textarea
                required
                rows={3}
                value={coachingNoteInput}
                onChange={(e) => setCoachingNoteInput(e.target.value)}
                placeholder="Tulis instruksi tindak lanjut pasca coaching untuk dipantau peserta pada log HP mereka..."
                className="w-full p-2 bg-gray-50 border rounded-lg focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#16365C] hover:bg-[#16365C]/95 text-white font-bold py-1.5 px-4 rounded-lg shadow"
              >
                Simpan Catatan
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
