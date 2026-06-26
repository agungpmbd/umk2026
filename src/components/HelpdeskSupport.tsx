import React, { useState } from 'react';
import { HelpCircle, Search, MessageSquare, PhoneCall, CheckCircle2, ChevronDown, ChevronUp, PlayCircle } from 'lucide-react';

export default function HelpdeskSupport() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  
  // Ticket Form States
  const [ticketCategory, setTicketCategory] = useState('Sertifikasi');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [ticketSuccess, setTicketSuccess] = useState(false);

  const faqs = [
    {
      q: 'Bagaimana cara mendaftarkan sertifikasi Halal gratis (Self-Declare) di UMK Academy?',
      a: 'Anda dapat masuk ke tab "Profil & Business Passport", pilih sub-tab "Legalitas", lalu pilih daftar Halal BPJPH. Ikuti draf instruksi pengisian bahan baku halal yang dipandu oleh Andi Pratama selaku fasilitator regional Anda.'
    },
    {
      q: 'Mengapa draf tantangan bisnis (Challenge) saya ditandai "Perlu Revisi" oleh fasilitator?',
      a: 'Fasilitator biasanya memberikan feedback detail jika berkas bukti kerja Anda (contoh: foto/SOP) kurang memuat diagram pengelolaan limbah atau sterilisasi standar. Anda dapat memperbaikinya lalu mengunggah ulang bukti kerja di menu Challenge Bisnis.'
    },
    {
      q: 'Kapan pengumuman peserta yang lolos seleksi Kurikulum Nasional (Go Digital / Go Global)?',
      a: 'Seleksi Kurikulum Nasional akan dilakukan pada akhir bulan Juli 2026 berdasarkan skor komparatif rapor akademis, kelengkapan data passport (>85%), dan rasio pertumbuhan omzet usaha.'
    },
    {
      q: 'Bagaimana cara mengabsen kehadiran pada sesi kunjungan lapangan pameran offline?',
      a: 'Di lokasi pameran offline, buka tab "Agenda & Kehadiran", cari agenda pameran tersebut, lalu klik tombol "Scan Absensi QR" untuk membuka kamera pemindai. Arahkan HP Anda ke barcode cetak yang disediakan panitia di lokasi.'
    }
  ];

  const handleToggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage.trim()) return;

    // Generate random mock ticket ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setTicketId(`TKT-2026-LS${randomNum}`);
    setTicketSuccess(true);
    setTicketMessage('');

    setTimeout(() => {
      setTicketSuccess(false);
    }, 4500);
  };

  const filteredFaqs = faqs.filter(f => 
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="helpdesk-container" className="space-y-6 font-sans text-[#16365C] pb-20 md:pb-10">
      
      {/* Page Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-black">Helpdesk & Pusat Bantuan</h2>
        <p className="text-xs text-gray-500">Ajukan keluhan teknis, tonton tutorial penggunaan sistem, dan temukan jawaban atas pertanyaan kurasi</p>
      </div>

      {/* SEARCH AND WHATSAPP CALLOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* FAQs accordion (Left 8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            
            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kendala teknis atau informasi syarat kelulusan..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0072BC] focus:bg-white"
              />
            </div>

            {/* FAQ Accordions */}
            <div className="space-y-2.5">
              <span className="font-bold text-xs text-gray-400 uppercase tracking-wider block">Pertanyaan Sering Diajukan (FAQ)</span>
              
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div key={idx} className="border rounded-xl overflow-hidden text-xs">
                    <button
                      onClick={() => handleToggleFaq(idx)}
                      className="w-full p-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center text-left font-bold text-gray-800"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    {isOpen && (
                      <div className="p-4 bg-white border-t text-gray-600 leading-relaxed font-sans">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Video Tutorial Cards */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <span className="font-bold text-xs text-gray-400 uppercase tracking-wider block">Video Tutorial Sistem</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-3.5 bg-gray-50 border rounded-xl flex items-center space-x-3 cursor-pointer hover:bg-gray-100 transition">
                <PlayCircle className="h-8 w-8 text-[#0072BC]" />
                <div>
                  <h5 className="font-bold text-gray-800">Cara Edit Business Passport</h5>
                  <p className="text-[10px] text-gray-400">Durasi: 3 Menit • Video Tutorial</p>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 border rounded-xl flex items-center space-x-3 cursor-pointer hover:bg-gray-100 transition">
                <PlayCircle className="h-8 w-8 text-[#A8C61F]" />
                <div>
                  <h5 className="font-bold text-gray-800">Tips Kirim Bukti Challenge</h5>
                  <p className="text-[10px] text-gray-400">Durasi: 5 Menit • Panduan Sukses</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Support Ticket Form (Right 4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Quick WA Contact card */}
          <div className="bg-[#A8C61F]/10 border border-[#A8C61F]/30 p-5 rounded-2xl space-y-3 text-xs">
            <div className="flex items-center space-x-2.5">
              <MessageSquare className="h-5 w-5 text-[#16365C]" />
              <h4 className="font-bold text-sm">WhatsApp Careline SMEPP</h4>
            </div>
            <p className="text-gray-600 leading-normal">
              Butuh konsultasi cepat via ponsel? Layanan chatbot resmi dan agen manusia siap melayani Anda Senin-Jumat pukul 08:00 - 17:00 WIB.
            </p>
            <a
              href="https://wa.me/628123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#16365C] text-white hover:bg-[#16365C]/90 font-bold py-2 px-4 rounded-xl text-center block shadow transition"
            >
              Hubungi WhatsApp Customer Service
            </a>
          </div>

          {/* Ticket Form */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-xs space-y-4">
            <h4 className="font-bold text-gray-800 border-b pb-2">Buat Tiket Dukungan Teknis</h4>
            
            {ticketSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl leading-relaxed">
                <CheckCircle2 className="h-5 w-5 text-green-500 mb-1" />
                <span className="font-bold block text-xs">Tiket Berhasil Terkirim!</span>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">Kode: {ticketId}</p>
                <p className="text-[10px] text-gray-500 mt-1">Tim IT SMEPP akan merespon tiket Anda via WA / Email dalam 15 menit.</p>
              </div>
            )}

            <form onSubmit={handleSubmitTicket} className="space-y-3 font-sans">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Kategori Masalah *</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full p-2 bg-gray-50 border rounded-lg"
                >
                  <option value="Sertifikasi">Kendala Legalitas / Halal</option>
                  <option value="LMS">Materi Video Tidak Terputar</option>
                  <option value="Upload">Gagal Unggah Bukti Challenge</option>
                  <option value="Akun">Profil / Ganti Nomor WhatsApp</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Deskripsi Masalah Anda *</label>
                <textarea
                  required
                  rows={4}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Ceritakan kegagalan unggah berkas atau pertanyaan kurasi yang membingungkan..."
                  className="w-full p-2 bg-gray-50 border rounded-lg focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0072BC] hover:bg-[#0072BC]/95 text-white font-bold py-2 rounded-xl shadow transition"
              >
                Kirim Tiket Bantuan
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
