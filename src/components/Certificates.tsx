import React, { useState } from 'react';
import { Participant } from '../types';
import { Award, CheckCircle2, Lock, Download, AlertTriangle, ShieldCheck, QrCode } from 'lucide-react';

interface CertificatesProps {
  participant: Participant;
}

export default function Certificates({ participant }: CertificatesProps) {
  const [downloadingCertId, setDownloadingCertId] = useState<string | null>(null);

  const passport = participant.passport;

  const certificatesList = [
    {
      id: 'cert_participation',
      title: 'Sertifikat Partisipasi (Regional)',
      type: 'Participation',
      certNumber: 'CERT-UMKA-2026-REG-0941',
      status: 'Unlocked',
      desc: 'Diberikan sebagai bukti partisipasi aktif dalam pembinaan UMK Academy Tingkat Regional.',
      requirements: [
        { label: 'Mengisi Kondisi Awal (Baseline) Usaha', met: true },
        { label: 'Kehadiran Sesi Pembinaan Regional > 75%', met: true },
        { label: 'Mengunggah NIB (Nomor Induk Berusaha)', met: true }
      ]
    },
    {
      id: 'cert_completion',
      title: 'Sertifikat Kelulusan Akademik (Completion)',
      type: 'Completion',
      certNumber: 'Pending - Belum Memenuhi KKM',
      status: 'Locked',
      desc: 'Diberikan setelah menyelesaikan seluruh materi regional dan lulus kuis dengan nilai rata-rata > 75.',
      requirements: [
        { label: 'Progress Pembelajaran Kelas 100% (Saat ini: 68%)', met: false },
        { label: 'Menyelesaikan Seluruh Kuis dengan Nilas Lulus (>75)', met: true },
        { label: 'Mengerjakan Semua Challenge Wajib', met: false }
      ]
    },
    {
      id: 'cert_graduation',
      title: 'Sertifikat Penghargaan Nasional (Graduation)',
      type: 'Graduation',
      certNumber: 'Pending - Tahap Kurasi Akhir',
      status: 'Locked',
      desc: 'Sertifikat prestasi tertinggi, khusus bagi alumni regional yang lolos proses kurasi naik kelas tingkat nasional.',
      requirements: [
        { label: 'Lolos Kurasi Nasional (SMEPP Pertamina)', met: false },
        { label: 'Meningkatkan Omzet Bisnis > 10% (Baseline vs Endline)', met: true },
        { label: 'Menyerap Tenaga Kerja Baru Baru', met: true }
      ]
    }
  ];

  const handleDownload = (certId: string, title: string) => {
    setDownloadingCertId(certId);
    setTimeout(() => {
      setDownloadingCertId(null);
      alert(`Sertifikat Resmi "${title}" berhasil diunduh ke folder Downloads Anda.`);
    }, 1500);
  };

  return (
    <div id="certificates-container" className="space-y-6 font-sans text-[#16365C] pb-20 md:pb-10">
      {/* Page Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-black">Sertifikasi & Kredensial</h2>
        <p className="text-xs text-gray-500">Unduh dokumen sertifikasi resmi Pertamina UMK Academy 2026 Anda yang dilengkapi verifikasi QR-Code</p>
      </div>

      {/* Grid of Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        {certificatesList.map((cert) => {
          const isUnlocked = cert.status === 'Unlocked';
          const isDownloading = downloadingCertId === cert.id;

          return (
            <div
              key={cert.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between space-y-4 transition-all duration-300 ${
                isUnlocked
                  ? 'border-gray-100 hover:shadow-md'
                  : 'border-gray-200/60 bg-gray-50/50 opacity-75'
              }`}
            >
              <div className="space-y-3.5 text-xs">
                {/* Header Row */}
                <div className="flex justify-between items-start">
                  <div className={`p-2.5 rounded-xl ${isUnlocked ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}>
                    <Award className="h-6 w-6" />
                  </div>
                  
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                    isUnlocked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {cert.status}
                  </span>
                </div>

                {/* Title & Desc */}
                <div>
                  <h4 className="font-black text-sm text-gray-800 leading-snug">{cert.title}</h4>
                  <p className="text-gray-500 leading-normal mt-1.5">{cert.desc}</p>
                </div>

                {/* Requirements Checklist */}
                <div className="p-3 bg-gray-50/70 border rounded-xl space-y-2">
                  <span className="font-bold text-[10px] text-gray-400 uppercase tracking-wider block">Kriteria Kelayakan</span>
                  {cert.requirements.map((req, rIdx) => (
                    <div key={rIdx} className="flex items-start space-x-2 text-[11px] leading-relaxed">
                      {req.met ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      ) : (
                        <Lock className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                      )}
                      <span className={req.met ? 'text-gray-600' : 'text-gray-400 italic'}>{req.label}</span>
                    </div>
                  ))}
                </div>

                {/* Certificate Code Validation if Unlocked */}
                {isUnlocked && (
                  <div className="flex items-center space-x-2.5 pt-2 text-[10px] text-gray-400 border-t">
                    <QrCode className="h-6 w-6 text-gray-600 shrink-0" />
                    <div>
                      <span className="font-bold text-gray-500 block">No. Validasi Kemenag/SMEPP</span>
                      <span className="font-mono">{cert.certNumber}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action button */}
              <div className="pt-3 border-t">
                {isUnlocked ? (
                  <button
                    onClick={() => handleDownload(cert.id, cert.title)}
                    className="w-full bg-[#0072BC] hover:bg-[#0072BC]/95 text-white font-bold text-xs py-2 rounded-xl transition flex justify-center items-center space-x-1.5 shadow"
                  >
                    <Download className="h-4 w-4 text-[#A8C61F]" />
                    <span>{isDownloading ? 'Mengunduh...' : 'Unduh Berkas PDF'}</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-100 text-gray-400 font-bold text-xs py-2 rounded-xl cursor-not-allowed flex justify-center items-center space-x-1.5"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Belum Memenuhi Syarat</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
