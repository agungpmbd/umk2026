import React, { useState } from 'react';
import { Participant, TJSLClaim, TJSLAuditLog } from '../types';
import { 
  ShieldCheck, ShieldAlert, Clock, AlertTriangle, FileText, CheckCircle2, 
  HelpCircle, Upload, Send, HelpCircle as HelpIcon, ArrowUpRight, 
  Check, UserCheck, AlertCircle, RefreshCw, MessageSquare
} from 'lucide-react';

interface TJSLStatusViewProps {
  participant: Participant;
  onUpdateParticipant: (updated: Participant) => void;
}

export default function TJSLStatusView({ participant, onUpdateParticipant }: TJSLStatusViewProps) {
  const claim = participant.tjslClaim;
  const status = participant.tjslVerificationStatus || 'Belum Mengajukan';
  const logs = participant.tjslLogs || [];

  // Local interactive states
  const [responseMsg, setResponseMsg] = useState('');
  const [picContact, setPicContact] = useState('');
  const [evidenceName, setEvidenceName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Hardcoded simulated official match database records based on initial scenarios
  // In a real app this comes from backend; we mock it beautifully
  const getOfficialDatabaseMatch = () => {
    if (participant.id === 'P001') {
      return {
        found: true,
        mitraId: 'PUMK-2024-88392',
        name: 'Siti Rahmawati',
        programAsal: 'Program PUMK Pertamina',
        subholding: 'PT Pertamina Patra Niaga',
        region: 'Jawa Tengah',
        tahun: 2024,
        statusProgram: 'Aktif',
        matchPercentage: 95,
        mismatchFields: [] as string[]
      };
    }
    if (participant.id === 'P006') {
      return {
        found: true,
        mitraId: 'PUMK-2024-91823',
        name: 'Ahmad Hidayat',
        programAsal: 'Program PUMK Pertamina',
        subholding: 'PHE (Pertamina Hulu Energi)',
        region: 'Jawa Barat',
        tahun: 2024,
        statusProgram: 'Aktif',
        matchPercentage: 100,
        mismatchFields: [] as string[]
      };
    }
    if (participant.id === 'P007') {
      return {
        found: true,
        mitraId: 'RB-2023-44122',
        name: 'Maria Lestari',
        programAsal: 'Rumah BUMN Pertamina',
        subholding: 'PT Pertamina Patra Niaga',
        region: 'Yogyakarta',
        tahun: 2023,
        statusProgram: 'Alumni',
        matchPercentage: 60,
        mismatchFields: ['tahun', 'subholding'] // Simulated mismatches
      };
    }
    if (participant.id === 'P008') {
      return {
        found: false,
        reason: 'Nama atau NIK tidak ditemukan di database Rumah BUMN maupun PUMK nasional.'
      };
    }
    return null;
  };

  const officialMatch = getOfficialDatabaseMatch();

  // Status configuration mappings
  const getStatusConfig = () => {
    switch (status) {
      case 'Terverifikasi':
        return {
          icon: ShieldCheck,
          bgColor: 'bg-green-50 border-green-200',
          textColor: 'text-green-800',
          badgeColor: 'bg-green-100 text-green-800',
          iconColor: 'text-green-600',
          title: 'Status Binaan Terverifikasi',
          desc: 'Klaim afiliasi Anda telah berhasil dicocokkan dengan database TJSL Satu Data SMEPP Pertamina. Anda resmi berhak atas benefit khusus program binaan.'
        };
      case 'Perlu Klarifikasi':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-orange-50 border-orange-200',
          textColor: 'text-orange-800',
          badgeColor: 'bg-orange-100 text-orange-800',
          iconColor: 'text-orange-600',
          title: 'Perlu Klarifikasi Lapangan',
          desc: 'Ditemukan ketidakcocokan minor antara klaim data Anda dengan arsip database Pertamina. Mohon lengkapi berkas klarifikasi di bawah.'
        };
      case 'Menunggu Verifikasi':
        return {
          icon: Clock,
          bgColor: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-800',
          badgeColor: 'bg-blue-100 text-blue-800',
          iconColor: 'text-blue-600',
          title: 'Dalam Antrean Verifikasi',
          desc: 'Berkas klaim / klarifikasi Anda telah diterima dan sedang diperiksa silang secara manual oleh Tim Auditor TJSL Pertamina.'
        };
      case 'Tidak Eligible':
        return {
          icon: ShieldAlert,
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-800',
          badgeColor: 'bg-red-100 text-red-800',
          iconColor: 'text-red-600',
          title: 'Tidak Terverifikasi / Tidak Eligible',
          desc: 'Maaf, data klaim Anda tidak cocok dengan parameter binaan program kami. Silakan hubungi Helpdesk jika Anda merasa terjadi kekeliruan.'
        };
      default:
        return {
          icon: HelpCircle,
          bgColor: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-800',
          badgeColor: 'bg-gray-100 text-gray-800',
          iconColor: 'text-gray-600',
          title: 'Belum Terbuka',
          desc: 'Silakan lakukan aktivasi akun dan isi riwayat pembinaan di formulir pendaftaran terlebih dahulu.'
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  // Drag and drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setEvidenceName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEvidenceName(e.target.files[0].name);
    }
  };

  // Submit response
  const handleSubmitClarification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseMsg.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Create new audit log
      const newLog: TJSLAuditLog = {
        id: 'LOG-' + Date.now(),
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        action: 'Klarifikasi Tambahan Dikirim',
        actor: 'Peserta (Mandiri)',
        notes: `Komentar: "${responseMsg}". File Bukti: ${evidenceName || 'Tidak ada berkas baru'}. PIC Pendamping: ${picContact || 'Tidak ada PIC baru'}.`
      };

      // Create updated participant object
      const updatedParticipant: Participant = {
        ...participant,
        tjslVerificationStatus: 'Menunggu Verifikasi', // Transition status
        tjslLogs: [newLog, ...logs]
      };

      onUpdateParticipant(updatedParticipant);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setResponseMsg('');
      setPicContact('');
      setEvidenceName('');
    }, 1200);
  };

  return (
    <div id="tjsl-verification-detail" className="space-y-6 font-sans text-[#16365C]">
      {/* 1. STATUS SUMMARY HEADER */}
      <div className={`p-6 rounded-2xl border ${config.bgColor} shadow-sm transition`}>
        <div className="flex flex-col md:flex-row gap-5 items-start">
          <div className={`p-4 rounded-xl bg-white shrink-0 shadow-sm ${config.iconColor}`}>
            <StatusIcon className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-bold">{config.title}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${config.badgeColor}`}>
                {status}
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">{config.desc}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2. SIDE-BY-SIDE MATCHING COMPARISON (7 COLS) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-8 space-y-5">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#16365C] flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-[#0072BC]" />
              <span>Verifikasi Berkas vs Database Padanan</span>
            </h3>
            <p className="text-[11px] text-gray-400 mt-1">
              Hasil komparasi klaim data yang diinput oleh peserta dengan arsip data di sistem TJSL Satu Data SMEPP.
            </p>
          </div>

          {claim ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CLAIM CARD */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/60 space-y-3">
                  <div className="flex justify-between items-center border-b pb-1.5">
                    <span className="font-bold text-xs text-gray-500">KLAIM DATA ANDA</span>
                    <span className="text-[10px] bg-[#0072BC]/10 text-[#0072BC] px-1.5 py-0.2 rounded font-bold">Input Mandiri</span>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 block">Asal Program</span>
                      <span className="font-bold">{claim.programAsal}</span>
                    </div>
                    {claim.programAsal === 'Program Pertamina lainnya' && (
                      <div>
                        <span className="text-[10px] text-gray-400 block">Program Lainnya</span>
                        <span className="font-bold">{claim.programAsalLainnya || '-'}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] text-gray-400 block">Subholding / Entitas</span>
                      <span className="font-bold">{claim.subholding || '-'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Tahun</span>
                        <span className="font-bold font-mono">{claim.tahun}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">ID Mitra Binaan</span>
                        <span className="font-bold font-mono text-[#0072BC]">{claim.mitraId || '-'}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-gray-400 block">PIC Pendamping</span>
                        <span className="font-bold">{claim.picName || '-'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">Region</span>
                        <span className="font-bold">{claim.region || '-'}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block">Berkas Bukti</span>
                      <span className="font-bold text-[#ED1B2F] flex items-center gap-1">
                        <FileText className="h-3 w-3 shrink-0" />
                        <span>{claim.evidenceFile || 'Tidak dilampirkan'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* MATCHED OFFICIAL DATABASE CARD */}
                <div className="p-4 bg-blue-50/20 rounded-xl border border-blue-100 space-y-3">
                  <div className="flex justify-between items-center border-b pb-1.5">
                    <span className="font-bold text-xs text-[#0072BC]">DATABASE SATU DATA SMEPP</span>
                    {officialMatch && 'found' in officialMatch && officialMatch.found ? (
                      <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                        <Check className="h-3 w-3" />
                        <span>Match {officialMatch.matchPercentage}%</span>
                      </span>
                    ) : (
                      <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.2 rounded font-bold">Unmatched</span>
                    )}
                  </div>

                  {officialMatch && 'found' in officialMatch && officialMatch.found ? (
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 block">Asal Program (Database)</span>
                        <span className={`font-bold ${officialMatch.mismatchFields.includes('programAsal') ? 'text-red-500 line-through' : 'text-green-700'}`}>
                          {officialMatch.programAsal}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">Subholding / Entitas (Database)</span>
                        <span className={`font-bold ${officialMatch.mismatchFields.includes('subholding') ? 'text-red-500 line-through' : 'text-green-700'}`}>
                          {officialMatch.subholding}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] text-gray-400 block">Tahun (Database)</span>
                          <span className={`font-bold font-mono ${officialMatch.mismatchFields.includes('tahun') ? 'text-red-500 font-extrabold' : 'text-green-700'}`}>
                            {officialMatch.tahun}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block">ID Mitra Binaan (Database)</span>
                          <span className="font-bold font-mono text-green-700">{officialMatch.mitraId}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] text-gray-400 block">Nama Penerima</span>
                          <span className="font-bold text-green-700">{officialMatch.name}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block">Region (Database)</span>
                          <span className="font-bold text-green-700">{officialMatch.region}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block">Status Pembinaan</span>
                        <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-green-100 text-green-800 font-bold w-max block mt-0.5">
                          {officialMatch.statusProgram}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-6 text-center space-y-2">
                      <AlertCircle className="h-8 w-8 text-red-500" />
                      <p className="text-xs font-bold text-gray-700">Pencarian Database Nihil</p>
                      <p className="text-[10px] text-gray-400 leading-normal max-w-[200px]">
                        {officialMatch && 'reason' in officialMatch ? officialMatch.reason : 'Tidak ditemukan padanan dengan data NIK / Nama pemilik usaha Anda.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Explanatory notes */}
              <div className="p-4 bg-[#16365C]/5 rounded-xl text-xs space-y-1.5">
                <span className="font-bold text-sm block">Keterangan Hasil Audit:</span>
                {status === 'Terverifikasi' && (
                  <p className="text-gray-600 leading-relaxed">
                    Data Anda <strong className="text-green-600">Terverifikasi 100%</strong>. Nama pemilik dan NIK terdaftar sebagai mitra aktif dalam binaan Pertamina sejak tahun {officialMatch && 'tahun' in officialMatch ? officialMatch.tahun : '2024'}. Klaim disetujui.
                  </p>
                )}
                {status === 'Perlu Klarifikasi' && (
                  <p className="text-gray-600 leading-relaxed">
                    Terdapat perbedaan tipis pada <strong className="text-orange-600">tahun kepesertaan</strong> atau <strong className="text-orange-600">subholding penanggung jawab</strong>. Mohon submit bukti tambahan berupa sertifikat resmi atau cantumkan nomor HP PIC Pendamping untuk verifikasi cepat oleh admin.
                  </p>
                )}
                {status === 'Menunggu Verifikasi' && (
                  <p className="text-gray-600 leading-relaxed">
                    Klaim/klarifikasi Anda dalam antrean audit manual. Kami sedang menghubungi PIC Pendamping dari subholding bersangkutan untuk verifikasi silang dokumen yang diunggah.
                  </p>
                )}
                {status === 'Tidak Eligible' && (
                  <p className="text-gray-600 leading-relaxed">
                    Berdasarkan audit silang, NIK Anda tidak terdaftar pada entitas PUMK maupun Rumah BUMN. Silakan ajukan surat keluhan resmi melalui kanal Helpdesk dengan format PDF.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-gray-50 rounded-xl border">
              <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-600">Belum ada riwayat pendaftaran klaim afiliasi TJSL.</p>
              <p className="text-[10px] text-gray-400 mt-1">Anda terdaftar sebagai pendaftar mandiri umum.</p>
            </div>
          )}
        </div>

        {/* 3. INTERACTIVE ACTIONS / SUBMISSION PANEL (4 COLS) */}
        <div className="space-y-6 lg:col-span-4">
          {/* Action Panel */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#16365C] flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-[#A8C61F]" />
              <span>Klarifikasi & Unggah Bukti</span>
            </h3>

            {submitSuccess && (
              <div className="p-3 bg-green-50 border border-green-100 text-green-800 rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Klarifikasi Dikirim!</span>
                </div>
                <p className="text-[10px] text-green-700 leading-normal">
                  Klarifikasi Anda telah terdaftar dan status verifikasi beralih menjadi 'Menunggu Verifikasi'.
                </p>
              </div>
            )}

            {status === 'Perlu Klarifikasi' ? (
              <form onSubmit={handleSubmitClarification} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tulis Tanggapan / Alasan Klarifikasi *</label>
                  <textarea
                    required
                    rows={3}
                    value={responseMsg}
                    onChange={(e) => setResponseMsg(e.target.value)}
                    placeholder="Contoh: Tahun di sertifikat saya adalah 2023, namun di database tertulis 2024. Sertifikat terlampir..."
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:ring-1 focus:ring-[#0072BC]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Kontak PIC Pendamping / No. HP *</label>
                  <input
                    type="text"
                    required
                    value={picContact}
                    onChange={(e) => setPicContact(e.target.value)}
                    placeholder="Nama PIC & No WA (e.g. Budi - 0812xxx)"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Unggah Berkas Pendukung Tambahan *</label>
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition ${
                      dragActive ? 'border-[#0072BC] bg-[#0072BC]/5' : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                    }`}
                  >
                    <input
                      type="file"
                      id="supplementary-file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="supplementary-file" className="cursor-pointer block space-y-1.5">
                      <Upload className="h-5 w-5 text-gray-400 mx-auto" />
                      <div className="font-bold text-[11px] text-[#0072BC]">
                        {evidenceName ? evidenceName : 'Pilih Berkas atau Tarik Kemari'}
                      </div>
                      <span className="text-[9px] text-gray-400 block">Format PDF / PNG / JPG. Maks 5MB.</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#0072BC] hover:bg-[#0072BC]/95 text-white font-bold rounded-lg flex justify-center items-center gap-1.5 shadow transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Mengirim Klarifikasi...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Kirim Berkas Klarifikasi</span>
                    </>
                  )}
                </button>
              </form>
            ) : status === 'Menunggu Verifikasi' ? (
              <div className="p-4 bg-blue-50/40 rounded-xl space-y-3 border border-blue-100 text-xs">
                <Clock className="h-5 w-5 text-[#0072BC]" />
                <p className="font-bold text-gray-800">Menunggu Antrean Review</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Berkas Anda sedang diproses oleh Tim Auditor SMEPP Pertamina. Proses peninjauan berkas meliputi sinkronisasi ID Mitra, keabsahan tanda tangan PIC, dan kelayakan dokumen pendukung.
                </p>
                <p className="text-[10px] text-[#0072BC] font-semibold">
                  Saran: Siapkan dokumen fisik sertifikat binaan atau invoice bantuan modal jika dihubungi sewaktu-waktu oleh tim peninjau.
                </p>
              </div>
            ) : status === 'Terverifikasi' ? (
              <div className="p-4 bg-green-50 rounded-xl border border-green-100 space-y-3.5 text-xs text-center">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                  <UserCheck className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-extrabold text-green-800 text-sm">Validasi Berhasil!</p>
                  <p className="text-[11px] text-green-700 leading-normal">
                    Anda resmi diklasifikasikan sebagai <strong>UMK Binaan Pertamina</strong>.
                  </p>
                </div>
                <div className="bg-white/80 p-3 rounded-lg border border-green-100 text-left text-[10px] space-y-1 text-green-800">
                  <p className="font-bold border-b pb-0.5">Benefit Aktif:</p>
                  <p>✔ Prioritas Kurasi SMEXPO & Pasar Digital BUMN</p>
                  <p>✔ Hibah Pendampingan Sertifikasi Halal Gratis</p>
                  <p>✔ Sesi Coaching Eksklusif Level Up Bisnis</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 rounded-xl border border-red-100 space-y-3 text-xs">
                <ShieldAlert className="h-5 w-5 text-red-600" />
                <p className="font-bold text-red-800">Evaluasi Selesai: Tidak Eligible</p>
                <p className="text-[11px] text-red-700 leading-relaxed">
                  Data yang disampaikan terbukti tidak sinkron dengan portofolio binaan Pertamina. Anda tetap dapat mengikuti program UMK Academy 2026 melalui **Kategori Jalur Umum Mandiri** tanpa kehilangan akses materi inti webinar.
                </p>
              </div>
            )}
          </div>

          {/* Audit Logs / Activity History */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#16365C] flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-[#A8C61F]" />
              <span>Log Riwayat Verifikasi</span>
            </h3>

            <div className="relative border-l-2 border-gray-100 pl-4 space-y-4">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <div key={log.id} className="relative text-xs">
                    {/* Bullet marker */}
                    <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-[#0072BC]"></span>
                    
                    <div className="text-[10px] text-gray-400 font-medium">{log.date}</div>
                    <div className="font-bold text-gray-800 mt-0.5">{log.action}</div>
                    <div className="text-[10px] text-gray-500 font-semibold mt-0.5">Oleh: {log.actor}</div>
                    <p className="text-[10px] text-gray-400 mt-1 italic leading-relaxed">
                      "{log.notes}"
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">Belum ada riwayat aktivitas verifikasi.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
