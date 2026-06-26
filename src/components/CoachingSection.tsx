import React, { useState } from 'react';
import { Participant, ActionPlan, CapabilityScore } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { Calendar, Users, Target, BookOpen, AlertCircle, Plus, CheckCircle2, Star, Edit2, Play, Check } from 'lucide-react';

interface CoachingSectionProps {
  participant: Participant;
  onUpdateParticipant: (updated: Participant) => void;
}

export default function CoachingSection({ participant, onUpdateParticipant }: CoachingSectionProps) {
  const [activeView, setActiveView] = useState<'coaching' | 'radar'>('coaching');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookDate, setBookDate] = useState('2026-07-05');
  const [bookTime, setBookTime] = useState('14:00');
  const [bookNotes, setBookNotes] = useState('Sesi mentoring 1-on-1 mengenai setup Kasir Pintar.');
  const [bookSuccess, setBookSuccess] = useState(false);

  // New action plan form states
  const [newArea, setNewArea] = useState('Digitalisasi');
  const [newActivity, setNewActivity] = useState('');
  const [newPic, setNewPic] = useState('Siti Rahmawati');
  const [newDeadline, setNewDeadline] = useState('2026-07-20');

  // Map capability scores for Radar chart
  const radarData = participant.capabilities.map(c => ({
    subject: c.name,
    Skor: c.score,
    Target: c.target,
    fullMark: 100
  }));

  const handleToggleStatus = (planId: string) => {
    const updatedActionPlans = participant.actionPlans.map(p => {
      if (p.id === planId) {
        let nextStatus: 'Belum Mulai' | 'Dalam Proses' | 'Selesai' = 'Belum Mulai';
        if (p.status === 'Belum Mulai') nextStatus = 'Dalam Proses';
        else if (p.status === 'Dalam Proses') nextStatus = 'Selesai';
        else if (p.status === 'Selesai') nextStatus = 'Belum Mulai';
        return { ...p, status: nextStatus };
      }
      return p;
    });

    onUpdateParticipant({
      ...participant,
      actionPlans: updatedActionPlans
    });
  };

  const handleAddActionPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.trim()) return;

    const newPlan: ActionPlan = {
      id: 'AP' + (participant.actionPlans.length + 1),
      area: newArea,
      activity: newActivity,
      pic: newPic,
      deadline: newDeadline,
      status: 'Belum Mulai'
    };

    onUpdateParticipant({
      ...participant,
      actionPlans: [...participant.actionPlans, newPlan]
    });

    setNewActivity('');
  };

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    setBookSuccess(true);
    setTimeout(() => {
      setBookSuccess(false);
      setIsBookModalOpen(false);
    }, 2000);
  };

  return (
    <div id="coaching-section-container" className="space-y-6 font-sans text-[#16365C] pb-20 md:pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black">Coaching & Pendampingan</h2>
          <p className="text-xs text-gray-500">Konsultasikan kendala bisnis dengan accelerator regional Jawa Tengah Anda dan pantau rencana aksi</p>
        </div>

        {/* View switcher tabs */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl border space-x-1">
          <button
            onClick={() => setActiveView('coaching')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeView === 'coaching' ? 'bg-[#16365C] text-white shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Fasilitator & Action Plan
          </button>
          <button
            onClick={() => setActiveView('radar')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeView === 'radar' ? 'bg-[#16365C] text-white shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Analisis Radar Kapasitas
          </button>
        </div>
      </div>

      {/* VIEW PANEL 1: FACILITATOR & ACTION PLAN */}
      {activeView === 'coaching' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Facilitator Card Left 5 Cols */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Akselerator Pendamping Anda</h3>
              </div>

              <div className="flex items-center space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                  alt="Fasilitator"
                  className="w-14 h-14 rounded-full border-2 border-[#0072BC] shrink-0 object-cover"
                />
                <div>
                  <h4 className="font-black text-sm text-gray-800">Andi Pratama, MBA</h4>
                  <p className="text-[10px] text-gray-500">Business Accelerator • Jateng</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600 leading-normal">
                <p><strong>Spesialisasi:</strong> Manajemen Keuangan Modern, Standarisasi SOP Operasional, Integrasi QRIS & POS Digital.</p>
                <div className="p-3 bg-gray-50 rounded-xl leading-relaxed">
                  <strong>Catatan Sesi Terakhir (25 Juni):</strong> &ldquo;Ibu Siti, silakan selesaikan SOP sterilisasi botol dan mulailah menginput nominal omzet terkini di tab finansial. Sesi coaching berikutnya akan membahas ekspor.&rdquo;
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsBookModalOpen(true)}
              className="w-full bg-[#0072BC] hover:bg-[#0072BC]/95 text-white font-bold text-xs py-2.5 rounded-xl transition flex justify-center items-center space-x-1.5 shadow"
            >
              <Calendar className="h-4 w-4 text-[#A8C61F]" />
              <span>Jadwalkan Sesi Coaching Privat</span>
            </button>
          </div>

          {/* Action Plan Table Right 7 Cols */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-7 space-y-4 text-xs font-sans">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Rencana Aksi Pengembangan (Action Plan)</h3>
              <span className="text-[10px] text-gray-400">Klik status untuk mengubah</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-400 font-bold border-b text-[10px] uppercase">
                    <th className="py-2.5 px-3">Sektor</th>
                    <th className="py-2.5 px-3">Aktivitas Perbaikan</th>
                    <th className="py-2.5 px-3">PIC</th>
                    <th className="py-2.5 px-3">Deadline</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {participant.actionPlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-50/50">
                      <td className="py-2.5 px-3 font-semibold text-[#0072BC]">{plan.area}</td>
                      <td className="py-2.5 px-3 text-gray-800">{plan.activity}</td>
                      <td className="py-2.5 px-3 text-gray-500">{plan.pic}</td>
                      <td className="py-2.5 px-3 text-gray-400 font-mono">{plan.deadline}</td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => handleToggleStatus(plan.id)}
                          className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full transition-all hover:scale-105 ${
                            plan.status === 'Selesai'
                              ? 'bg-green-100 text-green-700'
                              : plan.status === 'Dalam Proses'
                              ? 'bg-blue-100 text-[#0072BC]'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {plan.status}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* In-place form to add custom Action Plan */}
            <form onSubmit={handleAddActionPlan} className="bg-gray-50 p-4 border rounded-xl space-y-3">
              <span className="font-bold text-gray-700 block">Buat Rencana Aksi Baru</span>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <select
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full p-2 bg-white border rounded-lg"
                  >
                    <option value="Keuangan">Keuangan</option>
                    <option value="Operasional">Operasional</option>
                    <option value="Legalitas">Legalitas</option>
                    <option value="Digitalisasi">Digitalisasi</option>
                    <option value="Pemasaran">Pemasaran</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <input
                    required
                    type="text"
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    placeholder="Contoh: Mengurus sertifikat BPOM MD..."
                    className="w-full p-2 bg-white border rounded-lg"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-[#0072BC] hover:bg-[#0072BC]/95 text-white font-bold p-2 rounded-lg flex items-center justify-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PANEL 2: RADAR CHART ANALYSIS */}
      {activeView === 'radar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Radar Chart Visual (Left 7 Cols) */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-7 flex flex-col justify-between">
            <div className="border-b pb-2 mb-4">
              <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Analisis Radar Tingkat Kemandirian Usaha (7 Pilar)</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Analisis baseline kapasitas Anda (Skor) dibandingkan target kelulusan Kurasi Nasional.</p>
            </div>

            {/* Recharts Radar render */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="subject" stroke="#71717A" fontSize={10} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#A1A1AA" fontSize={8} />
                  <Radar name="Skor Anda" dataKey="Skor" stroke="#0072BC" fill="#0072BC" fillOpacity={0.2} />
                  <Radar name="Target Nasional" dataKey="Target" stroke="#A8C61F" fill="#A8C61F" fillOpacity={0.1} />
                  <Legend wrapperStyle={{ fontSize: '10px', marginTop: '10px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Indicator Cards Right 5 Cols */}
          <div className="lg:col-span-5 space-y-3 overflow-y-auto max-h-[420px] pr-1.5">
            {participant.capabilities.map((cap, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-gray-800">{cap.name}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    cap.score >= cap.target ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'
                  }`}>
                    {cap.score} / {cap.target} Target
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#0072BC] h-full" style={{ width: `${cap.score}%` }}></div>
                </div>
                <p className="text-gray-500 text-[10px] italic leading-normal">&ldquo;{cap.recommendation}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOOKING MODAL */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handleBookSession} className="bg-white rounded-2xl shadow-xl border w-full max-w-sm overflow-hidden font-sans text-xs flex flex-col">
            <div className="bg-[#16365C] text-white p-4">
              <h3 className="font-bold text-sm">Jadwalkan Mentoring Privat 1-on-1</h3>
              <p className="text-[10px] text-white/70">Pilih slot waktu bersama Andi Pratama</p>
            </div>

            <div className="p-5 space-y-4">
              {bookSuccess ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto animate-bounce" />
                  <h4 className="font-bold text-green-700">Sesi Berhasil Dijadwalkan!</h4>
                  <p className="text-gray-500">Konfirmasi dikirim ke WhatsApp Anda. Link Zoom otomatis disematkan pada Agenda.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Tanggal Konsultasi *</label>
                    <input
                      type="date"
                      value={bookDate}
                      onChange={(e) => setBookDate(e.target.value)}
                      className="w-full p-2 bg-gray-50 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Jam Sesi (WIB) *</label>
                    <select
                      value={bookTime}
                      onChange={(e) => setBookTime(e.target.value)}
                      className="w-full p-2 bg-gray-50 border rounded-lg"
                    >
                      <option value="09:00">09:00 - 10:30 WIB</option>
                      <option value="11:00">11:00 - 12:30 WIB</option>
                      <option value="14:00">14:00 - 15:30 WIB</option>
                      <option value="16:00">16:00 - 17:30 WIB</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Topik Utama Mentoring</label>
                    <textarea
                      rows={3}
                      value={bookNotes}
                      onChange={(e) => setBookNotes(e.target.value)}
                      className="w-full p-2 bg-gray-50 border rounded-lg"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="bg-gray-50 p-4 border-t flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsBookModalOpen(false)}
                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold"
                disabled={bookSuccess}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 bg-[#0072BC] hover:bg-[#0072BC]/95 text-white font-bold rounded-lg shadow-md flex items-center space-x-1"
                disabled={bookSuccess}
              >
                <Check className="h-4 w-4" />
                <span>Konfirmasi Jadwal</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
