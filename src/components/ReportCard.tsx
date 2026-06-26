import React, { useState } from 'react';
import { Participant } from '../types';
import { Award, FileText, Download, Share2, Sparkles, CheckCircle2, Star, Target, ArrowUpRight, Check } from 'lucide-react';

interface ReportCardProps {
  participant: Participant;
}

export default function ReportCard({ participant }: ReportCardProps) {
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [downloadingCard, setDownloadingCard] = useState(false);
  const [sharedSuccess, setSharedSuccess] = useState(false);

  const passport = participant.passport;

  // Calculate composite score averages
  const compositeScores = [
    { name: 'Kehadiran & Partisipasi', score: 92, target: 80, desc: 'Aktif menghadiri webinar wajib regional' },
    { name: 'Pembelajaran Mandiri', score: 85, target: 75, desc: 'Menyelesaikan modul bacaan luring' },
    { name: 'Gamifikasi & Poin XP', score: 78, target: 70, desc: 'Pengerjaan kuis materi secara tepat waktu' },
    { name: 'Sesi Coaching 1-on-1', score: 95, target: 80, desc: 'Kolaborasi aktif bersama Andi Pratama' },
    { name: 'Kenaikan Omzet Usaha', score: 82, target: 75, desc: 'Pertumbuhan omzet baseline vs terkini (+23%)' },
    { name: 'Bukti Kerja Tantangan', score: 88, target: 80, desc: 'Validasi dokumen bukti SOP oleh akselerator' }
  ];

  const overallScore = Math.round(
    compositeScores.reduce((acc, curr) => acc + curr.score, 0) / compositeScores.length
  );

  const handleDownloadReport = () => {
    setDownloadingReport(true);
    setTimeout(() => {
      setDownloadingReport(false);
      alert('Rapor Akademis Pertamina UMK Academy 2026 berhasil diunduh (PDF - 1.2 MB).');
    }, 1500);
  };

  const handleDownloadCard = () => {
    setDownloadingCard(true);
    setTimeout(() => {
      setDownloadingCard(false);
      alert('Business Development Card untuk Rasa Nusantara berhasil diunduh (PDF - 840 KB).');
    }, 1500);
  };

  const handleShare = () => {
    setSharedSuccess(true);
    setTimeout(() => setSharedSuccess(false), 3000);
  };

  return (
    <div id="report-card-container" className="space-y-6 font-sans text-[#16365C] pb-20 md:pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black">Rapor & Kartu Perkembangan</h2>
          <p className="text-xs text-gray-500">Evaluasi akademis, kesiapan kenaikan kelas program nasional, dan rekomendasi aksi 30-60-90 hari</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={handleDownloadReport}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-[#16365C] font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5"
            disabled={downloadingReport}
          >
            <Download className="h-4 w-4 text-[#ED1B2F]" />
            <span>{downloadingReport ? 'Mengunduh...' : 'Unduh Rapor'}</span>
          </button>

          <button
            onClick={handleDownloadCard}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-[#16365C] font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5"
            disabled={downloadingCard}
          >
            <FileText className="h-4 w-4 text-[#0072BC]" />
            <span>{downloadingCard ? 'Mengunduh...' : 'Unduh Development Card'}</span>
          </button>

          <button
            onClick={handleShare}
            className="bg-[#0072BC] hover:bg-[#0072BC]/95 text-white font-bold px-4 py-1.5 rounded-xl shadow-md transition flex items-center space-x-1.5"
          >
            <Share2 className="h-4 w-4 text-[#A8C61F]" />
            <span>Bagikan ke Fasilitator</span>
          </button>
        </div>
      </div>

      {sharedSuccess && (
        <div className="p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl text-xs font-bold flex items-center space-x-2">
          <Check className="h-4 w-4" />
          <span>Berhasil! Rapor terkirim ke dashboard Andi Pratama untuk persiapan seleksi nasional.</span>
        </div>
      )}

      {/* OVERALL ACADEMIC METRIC GAUGE CARD */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between gap-6">
        
        {/* Progress Score Left */}
        <div className="flex items-center space-x-5 md:border-r pr-6 border-gray-100">
          <div className="relative flex items-center justify-center">
            {/* Simple circular metric styling */}
            <div className="w-24 h-24 rounded-full border-[10px] border-[#A8C61F]/20 flex items-center justify-center text-[#16365C]">
              <span className="text-3xl font-black">{overallScore}</span>
            </div>
            {/* Ring fill overlay */}
            <div className="absolute inset-0 rounded-full border-[10px] border-[#0072BC] border-r-transparent border-b-transparent"></div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Skor Evaluasi Gabungan</span>
            <span className="text-sm font-black text-gray-800">Sangat Memuaskan (A)</span>
            <p className="text-[11px] text-gray-400 max-w-xs leading-normal">
              Skor Anda berada di atas Kriteria Kelulusan Minimal (KKM: 75) dan lolos ambang batas Kurasi Nasional.
            </p>
          </div>
        </div>

        {/* Readiness Targets Right */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div className="p-4 bg-green-50/40 rounded-xl border border-green-100/50 flex flex-col justify-between space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#16365C]">Kesiapan Pameran Pertamina SMEXPO</span>
              <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.2 rounded font-extrabold">SIAP (90%)</span>
            </div>
            <p className="text-gray-500 text-[10px] leading-normal">Legalitas NIB & P-IRT terverifikasi, kemasan higienis, produk kuliner memiliki daya tahan baik.</p>
          </div>

          <div className="p-4 bg-[#0072BC]/5 rounded-xl border border-[#0072BC]/10 flex flex-col justify-between space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#16365C]">Kandidat Pertapreneur Aggregator</span>
              <span className="text-[9px] bg-blue-100 text-[#0072BC] px-1.5 py-0.2 rounded font-extrabold">DIREKOMENDASIKAN</span>
            </div>
            <p className="text-gray-500 text-[10px] leading-normal">Rasa Nusantara menyerap hasil cabai lokal petani binaan Semarang, memenuhi pilar sustainability ESG.</p>
          </div>
        </div>
      </div>

      {/* COMPOSITE ACADEMIC PILLARS */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider border-b pb-2">Komponen Nilai Rapor</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-sans">
          {compositeScores.map((score, idx) => (
            <div key={idx} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700">{score.name}</span>
                <span className="font-mono font-bold text-gray-800">{score.score} / 100</span>
              </div>
              <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                <div className="bg-[#0072BC] h-full" style={{ width: `${score.score}%` }}></div>
              </div>
              <p className="text-[10px] text-gray-400">{score.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RECOMMENDATION DEVELOPMENT CARD (STRICT REQUIREMENT) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
        <div className="border-b pb-3 flex items-center space-x-2">
          <Award className="h-5 w-5 text-[#A8C61F]" />
          <div>
            <h3 className="font-black text-sm">Recommendation Development Card</h3>
            <p className="text-[10px] text-gray-400">Peta jalan pendampingan bisnis pasca-kelulusan regional yang dipersonalisasi</p>
          </div>
        </div>

        {/* SWOT / Profile Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div className="p-4 bg-blue-50/30 border border-blue-100/50 rounded-xl space-y-1.5">
            <span className="font-bold text-[#0072BC] block">Kekuatan Utama Usaha (Key Strengths)</span>
            <ul className="list-disc pl-5 space-y-1 text-gray-600 leading-normal">
              <li>Sertifikasi dasar lengkap (NIB & P-IRT).</li>
              <li>Produk sambal higienis dengan ketahanan saji alami 6 bulan.</li>
              <li>Mampu menyerap cabai segar lokal dari petani binaan langsung di region Semarang.</li>
            </ul>
          </div>

          <div className="p-4 bg-amber-50/30 border border-amber-200/50 rounded-xl space-y-1.5">
            <span className="font-bold text-amber-700 block">Area Pengembangan Prioritas (Opportunities)</span>
            <ul className="list-disc pl-5 space-y-1 text-gray-600 leading-normal">
              <li>Pemisahan pembukuan arus kas harian melalui POS digital kasir.</li>
              <li>Belum memiliki lisensi Halal resmi dan label kemasan barcode BPOM MD.</li>
              <li>Sistem retensi pelanggan reseller di luar regional belum tertata.</li>
            </ul>
          </div>
        </div>

        {/* 30-60-90 DAY TIMELINE ACTION PLANS */}
        <div className="space-y-3 font-sans">
          <span className="font-bold text-xs text-gray-400 uppercase tracking-wider block">Peta Strategis 30 - 60 - 90 Hari</span>

          <div className="relative border-l-2 border-gray-100 pl-6 space-y-5 text-xs">
            {/* 30 Day */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#0072BC] border-2 border-white flex items-center justify-center"></span>
              <div className="space-y-1">
                <span className="font-bold text-[#0072BC] block">Target 30 Hari Kedepan (Evaluasi Digitalisasi)</span>
                <p className="text-gray-600 leading-normal max-w-3xl">
                  Mulai mencatat kasir digital melalui integrasi POS Pintar, melengkapi sisa dokumen administrasi Halal, dan mendaftar sesi webinar khusus ESG Pertamina.
                </p>
              </div>
            </div>

            {/* 60 Day */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#A8C61F] border-2 border-white flex items-center justify-center"></span>
              <div className="space-y-1">
                <span className="font-bold text-[#16365C] block">Target 60 Hari Kedepan (Kurasi Nasional & Halal)</span>
                <p className="text-gray-600 leading-normal max-w-3xl">
                  Menerbitkan sertifikasi Halal resmi Kemenag melalui jalur afirmasi, melakukan pemisahan rekening bank Rasa Nusantara secara mandiri, dan mendaftarkan draf pameran SMEXPO.
                </p>
              </div>
            </div>

            {/* 90 Day */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center"></span>
              <div className="space-y-1">
                <span className="font-bold text-amber-700 block">Target 90 Hari Kedepan (SMEXPO & Ekspor)</span>
                <p className="text-gray-600 leading-normal max-w-3xl">
                  Ikut serta dalam kurasi akhir SMEXPO Jakarta, menjalin kontrak distribusi awal dengan 2 reseller regional Jabodetabek, dan merancang draf label kemasan bilingual (Persiapan Ekspor).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RECOMMENDATION CLASSIFICATIONS FOOTER */}
        <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-[10px] text-gray-400 font-bold block uppercase">Rekomendasi Sertifikasi</span>
            <span className="font-bold block mt-1 text-gray-800">Sertifikasi Halal & BPOM MD</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-[10px] text-gray-400 font-bold block uppercase">Rekomendasi Akses Pasar</span>
            <span className="font-bold block mt-1 text-gray-800">Pertamina SMEXPO & Bright Store</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-[10px] text-gray-400 font-bold block uppercase">Akses Pendanaan Berkelanjutan</span>
            <span className="font-bold block mt-1 text-gray-800">Pendanaan Usaha Mikro dan Kecil (PUMK)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
