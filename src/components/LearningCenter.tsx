import React, { useState } from 'react';
import { LearningModule } from '../types';
import { BookOpen, Play, Download, CheckCircle2, Lock, Star, ChevronLeft, MessageSquare, AlertCircle, HelpCircle, Send } from 'lucide-react';

interface LearningCenterProps {
  modules: LearningModule[];
  onMarkModuleComplete: (moduleId: string) => void;
}

export default function LearningCenter({ modules, onMarkModuleComplete }: LearningCenterProps) {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [activeTrack, setActiveTrack] = useState<'Regional' | 'National'>('Regional');
  const [quizAnswers, setQuizAnswers] = useState<{ [questionIdx: number]: number }>({});
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  
  // Rating and discussion state
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState([
    { author: 'Ibu Minah (Sambal Bu Minah)', text: 'Materi laba rugi sangat membantu saya memisahkan pengeluaran bumbu dapur rumah!', time: '2 hari lalu' },
    { author: 'Ahmad Fauzi (Tani Mandiri)', text: 'Sesi penjelasan mengenai cashflow harian sangat mudah dipahami pemula.', time: '5 hari lalu' }
  ]);
  const [newComment, setNewComment] = useState('');

  const selectedModule = modules.find(m => m.id === selectedModuleId);

  const handleSelectModule = (id: string, status: string) => {
    if (status === 'Terkunci') return;
    setSelectedModuleId(id);
    // Reset quiz
    setQuizAnswers({});
    setQuizChecked(false);
    setQuizScore(null);
  };

  const handleQuizAnswer = (qIdx: number, oIdx: number) => {
    if (quizChecked) return;
    setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx });
  };

  const checkQuiz = () => {
    if (!selectedModule?.quizQuestions) return;
    let correct = 0;
    selectedModule.quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.answerIndex) {
        correct++;
      }
    });
    const score = Math.round((correct / selectedModule.quizQuestions.length) * 100);
    setQuizScore(score);
    setQuizChecked(true);
  };

  const handleMarkComplete = () => {
    if (selectedModuleId) {
      onMarkModuleComplete(selectedModuleId);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([{ author: 'Siti Rahmawati (Rasa Nusantara)', text: newComment, time: 'Baru saja' }, ...comments]);
    setNewComment('');
  };

  const filteredModules = modules.filter(m => m.track === activeTrack);

  return (
    <div id="learning-center-container" className="space-y-6 font-sans text-[#16365C] pb-20 md:pb-10">
      {/* Dynamic Back Navigation if Module is Open */}
      {selectedModuleId && selectedModule ? (
        /* DETAIL MODULE PAGE */
        <div className="space-y-6 animate-fadeIn">
          {/* Breadcrumb Back Button */}
          <button
            onClick={() => setSelectedModuleId(null)}
            className="flex items-center space-x-2 text-[#0072BC] hover:text-[#0072BC]/80 font-bold text-xs"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Kembali ke Daftar Materi</span>
          </button>

          {/* Module Title Section */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded uppercase">{selectedModule.format} • {selectedModule.duration}</span>
              <h2 className="text-xl md:text-2xl font-black mt-1.5">{selectedModule.title}</h2>
              <p className="text-xs text-gray-500 mt-1">Diajar oleh: <strong>{selectedModule.instructor}</strong></p>
            </div>
            
            {/* Status action */}
            {selectedModule.status === 'Selesai' ? (
              <span className="text-xs bg-green-50 text-green-600 font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>Materi Selesai</span>
              </span>
            ) : (
              <button
                onClick={handleMarkComplete}
                className="bg-[#A8C61F] hover:bg-[#A8C61F]/90 text-[#16365C] font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition"
              >
                Tandai Selesai & Ambil Kuis
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left side: Video player & Details */}
            <div className="lg:col-span-8 space-y-6">
              {/* Simulated Video Player */}
              <div className="bg-black rounded-2xl aspect-video overflow-hidden relative shadow-lg border border-gray-800">
                {selectedModule.format === 'Video' || selectedModule.format === 'Webinar' ? (
                  /* Standard responsive video player */
                  <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center relative">
                    <iframe
                      width="100%"
                      height="100%"
                      src={selectedModule.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                      title={selectedModule.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    ></iframe>
                  </div>
                ) : (
                  /* PDF or Worksheet visual mockup */
                  <div className="w-full h-full bg-[#16365C] flex flex-col items-center justify-center p-6 text-white text-center">
                    <BookOpen className="h-16 w-16 text-[#A8C61F] mb-4 animate-bounce" />
                    <h3 className="font-bold text-lg mb-2">Dokumen Modul PDF / Lembar Kerja</h3>
                    <p className="text-xs text-white/70 max-w-sm mb-4">Modul berformat PDF siap diunduh untuk belajar luring mandiri di rumah.</p>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="bg-white text-[#16365C] font-bold text-xs py-2 px-5 rounded-lg flex items-center space-x-1.5 shadow"
                    >
                      <Download className="h-4 w-4 text-[#ED1B2F]" />
                      <span>Unduh Modul ({selectedModule.duration})</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Description & Objectives */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-xs font-sans">
                <div>
                  <h3 className="text-sm font-bold text-[#16365C] border-b pb-2 mb-2">Deskripsi Materi</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{selectedModule.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-bold text-[#16365C] border-b pb-2 mb-2">Target Capaian Belajar (Learning Objectives)</h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                    <li>Peserta mampu menjabarkan struktur manajemen biaya produksi UMK.</li>
                    <li>Peserta terampil menggunakan alat ukur kasir digital dasar.</li>
                    <li>Mempersiapkan baseline laporan keuangan untuk seleksi Kurasi Nasional.</li>
                  </ul>
                </div>
              </div>

              {/* Discussion Section */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-[#16365C] border-b pb-2 flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Forum Diskusi Materi ({comments.length})</span>
                </h3>

                {/* Simulated Comment Input */}
                <form onSubmit={handlePostComment} className="flex space-x-3">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
                    alt="Siti"
                    className="w-8 h-8 rounded-full border shrink-0 object-cover"
                  />
                  <div className="flex-grow flex space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Tulis tanggapan atau pertanyaan mengenai materi ini..."
                      className="flex-grow p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0072BC] focus:bg-white text-gray-800"
                    />
                    <button
                      type="submit"
                      className="bg-[#0072BC] hover:bg-[#0072BC]/90 text-white p-2 rounded-xl"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </form>

                {/* Comment list */}
                <div className="space-y-4 pt-2">
                  {comments.map((comment, i) => (
                    <div key={i} className="flex space-x-3 text-xs leading-normal">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-[#0072BC] shrink-0">
                        {comment.author[0]}
                      </div>
                      <div className="bg-gray-50 p-3 rounded-2xl flex-grow space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-700">{comment.author}</span>
                          <span className="text-[10px] text-gray-400">{comment.time}</span>
                        </div>
                        <p className="text-gray-600">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side: Quiz & Ratings panel */}
            <div className="lg:col-span-4 space-y-6">
              {/* QUIZ INTERACTIVE CARD */}
              {selectedModule.quizQuestions && selectedModule.quizQuestions.length > 0 ? (
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-xs font-sans">
                  <h3 className="text-sm font-bold text-[#16365C] border-b pb-2 flex items-center space-x-1.5">
                    <HelpCircle className="h-4 w-4 text-[#0072BC]" />
                    <span>Uji Pemahaman (Quiz Materi)</span>
                  </h3>

                  {selectedModule.quizQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-2">
                      <p className="font-bold text-gray-800">{qIdx + 1}. {q.question}</p>
                      <div className="space-y-1.5">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = quizAnswers[qIdx] === oIdx;
                          const isCorrect = oIdx === q.answerIndex;
                          
                          let bgClass = 'bg-gray-50 border-gray-200';
                          if (isSelected) bgClass = 'bg-blue-50 border-[#0072BC] text-[#0072BC] font-semibold';
                          if (quizChecked) {
                            if (isCorrect) bgClass = 'bg-green-100 border-green-400 text-green-700 font-semibold';
                            else if (isSelected) bgClass = 'bg-red-100 border-red-400 text-red-700';
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleQuizAnswer(qIdx, oIdx)}
                              className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all leading-relaxed ${bgClass}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Quiz Results Screen */}
                  {quizScore !== null && (
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-center">
                      <span className="font-bold text-xs block text-gray-700">Skor Kuis Anda</span>
                      <span className="text-3xl font-black text-[#0072BC] block mt-1">{quizScore}%</span>
                      {quizScore >= 75 ? (
                        <span className="text-[10px] text-green-600 font-bold block mt-1">Lulus KKM! Lencana Pembelajaran Diperoleh 🎉</span>
                      ) : (
                        <span className="text-[10px] text-red-500 font-bold block mt-1">Skor di bawah KKM, coba tonton kembali materi.</span>
                      )}
                    </div>
                  )}

                  {!quizChecked ? (
                    <button
                      onClick={checkQuiz}
                      disabled={Object.keys(quizAnswers).length < selectedModule.quizQuestions.length}
                      className={`w-full font-bold text-xs py-2 rounded-xl transition ${
                        Object.keys(quizAnswers).length < selectedModule.quizQuestions.length
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-[#0072BC] hover:bg-[#0072BC]/95 text-white shadow'
                      }`}
                    >
                      Kirim Jawaban Kuis
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setQuizAnswers({});
                        setQuizChecked(false);
                        setQuizScore(null);
                      }}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2 rounded-xl transition"
                    >
                      Ulangi Kuis
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center py-6 text-xs text-gray-400">
                  <AlertCircle className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                  <span>Kuis tidak tersedia untuk modul bacaan luring. Selesaikan tantangan tugas untuk mengukur pemahaman Anda.</span>
                </div>
              )}

              {/* RATE THIS MATERIAL */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center space-y-3 text-xs font-sans">
                <h4 className="font-bold">Apakah Materi Ini Bermanfaat?</h4>
                <div className="flex justify-center space-x-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition"
                    >
                      <Star className={`h-6 w-6 ${rating >= star ? 'fill-amber-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400">Rating membantu tim kurikulum SMEPP meningkatkan kualitas materi.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MATERIAL LISTS VIEW */
        <div className="space-y-6">
          {/* Track selector tab bar */}
          <div className="flex justify-between items-center border-b pb-1.5">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTrack('Regional')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                  activeTrack === 'Regional'
                    ? 'bg-[#0072BC] text-white shadow'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                Kurikulum Regional (Go Modern)
              </button>
              <button
                onClick={() => setActiveTrack('National')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center space-x-1.5 ${
                  activeTrack === 'National'
                    ? 'bg-[#0072BC] text-white shadow'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <span>Kurikulum Nasional (Kenaikan Kelas)</span>
                <span className="text-[9px] bg-red-50 text-[#ED1B2F] px-1 py-0.2 rounded font-extrabold uppercase">Terkunci</span>
              </button>
            </div>
          </div>

          {activeTrack === 'Regional' && (
            <div className="bg-[#0072BC]/5 border border-[#0072BC]/20 p-4 rounded-xl flex items-start space-x-3 text-xs">
              <AlertCircle className="h-5 w-5 text-[#0072BC] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-gray-800 mb-0.5">Spesialisasi Sektor: {modules[0].sector || 'Food & Beverage'}</span>
                Seluruh peserta Pembinaan Regional otomatis didaftarkan pada materi dasar tata kelola bisnis modern. Selesaikan seluruh modul dasar ini untuk membuka jalur Kurikulum Nasional (Go Digital, Go Online, Go Global, Go Green).
              </div>
            </div>
          )}

          {/* Grid Layout of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
            {filteredModules.map((module) => {
              const isLocked = module.status === 'Terkunci';

              return (
                <div
                  key={module.id}
                  onClick={() => handleSelectModule(module.id, module.status)}
                  className={`bg-white rounded-2xl border p-5 shadow-sm transition-all duration-300 flex flex-col justify-between ${
                    isLocked
                      ? 'border-gray-100 opacity-60 cursor-not-allowed bg-gray-50/50'
                      : 'border-gray-100 hover:border-[#0072BC] hover:shadow-md cursor-pointer'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">
                        {module.format}
                      </span>
                      {module.status === 'Selesai' && (
                        <span className="text-[9px] font-extrabold bg-green-50 text-green-600 px-2 py-0.5 rounded flex items-center space-x-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Selesai</span>
                        </span>
                      )}
                      {module.status === 'Sedang Dipelajari' && (
                        <span className="text-[9px] font-extrabold bg-amber-50 text-amber-600 px-2 py-0.5 rounded">
                          Dipelajari
                        </span>
                      )}
                      {isLocked && <Lock className="h-4 w-4 text-gray-400" />}
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-gray-800 leading-snug line-clamp-2 h-8">
                        {module.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1">Instructor: {module.instructor}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400">
                    <span>Durasi: {module.duration}</span>
                    <span className="font-semibold text-[#0072BC]">Deadline: {module.deadline}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
