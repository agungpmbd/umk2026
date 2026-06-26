import React, { useState } from 'react';
import { Participant, Certification } from '../types';
import { ShieldCheck, CheckCircle2, AlertTriangle, Edit2, Check, FileText, Upload, Save, HelpCircle } from 'lucide-react';

interface BusinessPassportProps {
  participant: Participant;
  onUpdateParticipant: (updated: Participant) => void;
}

export default function BusinessPassport({ participant, onUpdateParticipant }: BusinessPassportProps) {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFields, setEditFields] = useState<any>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const tabs = [
    { label: 'Profil Pemilik', key: 'pemilik' },
    { label: 'Profil Usaha', key: 'usaha' },
    { label: 'Legalitas', key: 'legalitas' },
    { label: 'Keuangan', key: 'keuangan' },
    { label: 'Operasional', key: 'operasional' },
    { label: 'Digitalisasi', key: 'digitalisasi' },
    { label: 'Pasar & Reseller', key: 'pasar' },
    { label: 'Sustainability', key: 'sustainability' },
    { label: 'Riwayat Pembinaan', key: 'riwayat' },
    { label: 'Dokumen', key: 'dokumen' }
  ];

  const passport = participant.passport;

  const handleOpenEdit = () => {
    // Clone passport fields into state for editing
    setEditFields({
      // owner
      ownerName: passport.ownerName,
      phone: passport.ownerIdentity.phone,
      address: passport.ownerIdentity.address,
      email: passport.ownerIdentity.email,
      // business
      businessName: passport.businessName,
      subsector: passport.subsector,
      establishedYear: passport.establishedYear,
      description: passport.description,
      mainProducts: passport.mainProducts.join(', '),
      // financials
      revenueBaseline: passport.financials.revenueBaseline,
      revenueCurrent: passport.financials.revenueCurrent,
      profitBaseline: passport.financials.profitBaseline,
      profitCurrent: passport.financials.profitCurrent,
      employeesBaseline: passport.financials.employeesBaseline,
      employeesCurrent: passport.financials.employeesCurrent,
      loanSource: passport.financials.loanSource,
      loanAmount: passport.financials.loanAmount,
      useQRIS: passport.financials.useQRIS,
      usePOS: passport.financials.usePOS,
      hasBankAccount: passport.financials.hasBankAccount,
      // certifications
      nib: passport.certifications[0]?.number || '',
      halal: passport.certifications[1]?.number || '',
      pirt: passport.certifications[2]?.number || '',
      bpom: passport.certifications[3]?.number || '',
      // sustainability
      wasteManagement: passport.sustainability.wasteManagement,
      ecoMaterials: passport.sustainability.ecoMaterials,
      energySaving: passport.sustainability.energySaving,
      // market
      marketArea: passport.marketArea,
      suppliers: passport.suppliers,
      partners: passport.partners
    });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    // Map edit fields back to participant object
    const updatedCertifications: Certification[] = [
      { name: 'NIB (Nomor Induk Berusaha)', status: editFields.nib ? 'Terverifikasi' : 'Belum Lengkap', expiryDate: 'Seumur Hidup', number: editFields.nib || '-' },
      { name: 'Sertifikasi Halal', status: editFields.halal ? 'Terverifikasi' : 'Proses', expiryDate: '2030-02-15', number: editFields.halal || '-' },
      { name: 'P-IRT (Pangan Industri Rumah Tangga)', status: editFields.pirt ? 'Terverifikasi' : 'Belum Lengkap', expiryDate: '2028-10-12', number: editFields.pirt || '-' },
      { name: 'Izin BPOM MD', status: editFields.bpom ? 'Terverifikasi' : 'Belum Lengkap', expiryDate: '-', number: editFields.bpom || '-' }
    ];

    const updatedParticipant: Participant = {
      ...participant,
      passport: {
        ...passport,
        ownerName: editFields.ownerName,
        ownerIdentity: {
          ...passport.ownerIdentity,
          phone: editFields.phone,
          address: editFields.address,
          email: editFields.email
        },
        businessName: editFields.businessName,
        subsector: editFields.subsector,
        establishedYear: Number(editFields.establishedYear),
        description: editFields.description,
        mainProducts: editFields.mainProducts.split(',').map((p: string) => p.trim()),
        financials: {
          ...passport.financials,
          revenueBaseline: Number(editFields.revenueBaseline),
          revenueCurrent: Number(editFields.revenueCurrent),
          profitBaseline: Number(editFields.profitBaseline),
          profitCurrent: Number(editFields.profitCurrent),
          employeesBaseline: Number(editFields.employeesBaseline),
          employeesCurrent: Number(editFields.employeesCurrent),
          loanSource: editFields.loanSource,
          loanAmount: Number(editFields.loanAmount),
          useQRIS: editFields.useQRIS,
          usePOS: editFields.usePOS,
          hasBankAccount: editFields.hasBankAccount
        },
        certifications: updatedCertifications,
        sustainability: {
          wasteManagement: editFields.wasteManagement,
          ecoMaterials: editFields.ecoMaterials,
          energySaving: editFields.energySaving
        },
        marketArea: editFields.marketArea,
        suppliers: editFields.suppliers,
        partners: editFields.partners,
        completeness: 92 // Increases as editing shows completeness
      }
    };

    onUpdateParticipant(updatedParticipant);
    setIsEditModalOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const formatRupiah = (num: number) => {
    return 'Rp' + num.toLocaleString('id-ID');
  };

  return (
    <div id="business-passport-container" className="space-y-6 font-sans text-[#16365C] pb-20 md:pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black">Profil & Business Passport</h2>
          <p className="text-xs text-gray-500">Satu ID Profil Digital Terverifikasi untuk Seluruh Kebutuhan Program TJSL Pertamina</p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleOpenEdit}
            className="bg-[#0072BC] hover:bg-[#0072BC]/95 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition flex items-center space-x-1.5"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Passport Data</span>
          </button>
        </div>
      </div>

      {/* WARNING NOTIFICATION (STRICT REQUIREMENT) */}
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/60 flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-[#16365C]">
          <span className="font-bold block mb-1">Perhatian Penting</span>
          Data yang lengkap dan valid akan digunakan untuk proses kurasi, rekomendasi pameran, dan pengukuran dampak program. Pastikan data finansial dan legalitas diisi dengan jujur berdasarkan bukti otentik.
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl text-xs font-bold animate-pulse flex items-center space-x-2">
          <Check className="h-4 w-4" />
          <span>Business Passport berhasil diperbarui! Kelengkapan data kini naik menjadi 92%.</span>
        </div>
      )}

      {/* Metadata Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">ID Passport</span>
          <span className="text-sm font-mono font-bold block mt-1 text-[#0072BC]">PP-UMK-2026-0001</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Kelengkapan Data</span>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-lg font-black text-gray-800">{passport.completeness}%</span>
            <div className="flex-grow bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#A8C61F] h-full" style={{ width: `${passport.completeness}%` }}></div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tingkat Keyakinan Data (Confidence)</span>
          <div className="flex items-center space-x-1.5 mt-1">
            <ShieldCheck className="h-5 w-5 text-[#0072BC]" />
            <span className="text-sm font-bold text-gray-800">{passport.dataConfidenceLevel}% Verified</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Tahap Verifikasi</span>
          <span className="text-xs bg-green-50 text-green-600 font-bold px-2 py-0.5 rounded w-max mt-1.5 block">NIB & P-IRT Terverifikasi</span>
        </div>
      </div>

      {/* Horizontal Scrollable Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-none space-x-1 py-1.5">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTabIdx(idx)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTabIdx === idx
                ? 'bg-[#16365C] text-white shadow'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        {/* PANEL 1: PROFIL PEMILIK */}
        {activeTabIdx === 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-3 mb-2">
              <h4 className="text-sm font-bold uppercase tracking-wider">Identitas Pemilik UMK</h4>
              <span className="text-xs text-gray-400">Terakhir diperbarui: 24 Juni 2026</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1">
                <span className="text-gray-400 font-medium block">Nama Lengkap Pemilik</span>
                <p className="font-bold text-sm">{passport.ownerName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 font-medium block">Nomor Induk Kependudukan (NIK)</span>
                <p className="font-mono font-bold text-sm">{passport.ownerIdentity.nik}</p>
                <span className="text-[10px] text-gray-400 block">Sesuai KTP - Data Di-masking demi keamanan</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 font-medium block">Jenis Kelamin</span>
                <p className="font-bold text-sm">{passport.ownerIdentity.gender}</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 font-medium block">Email</span>
                <p className="font-bold text-sm text-[#0072BC]">{passport.ownerIdentity.email}</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 font-medium block">No. WhatsApp Aktif</span>
                <p className="font-bold text-sm">{passport.ownerIdentity.phone}</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 font-medium block">Alamat Sesuai KTP</span>
                <p className="font-bold text-sm">{passport.ownerIdentity.address}</p>
              </div>
            </div>
          </div>
        )}

        {/* PANEL 2: PROFIL USAHA */}
        {activeTabIdx === 1 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-3 mb-2">
              <h4 className="text-sm font-bold uppercase tracking-wider">Informasi Umum Usaha</h4>
              <span className="text-xs text-gray-400">Terakhir diperbarui: 24 Juni 2026</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
              <div className="space-y-1">
                <span className="text-gray-400 font-medium block">Nama Usaha / Brand</span>
                <p className="font-bold text-sm text-gray-800">{passport.businessName}</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 font-medium block">Sektor & Subsektor Usaha</span>
                <p className="font-bold text-sm text-gray-800">{passport.sector} ({passport.subsector})</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 font-medium block">Tahun Berdiri</span>
                <p className="font-bold text-sm text-gray-800">{passport.establishedYear}</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 font-medium block">Region Asal</span>
                <p className="font-bold text-sm text-gray-800">{passport.region}</p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <span className="text-gray-400 font-medium block">Deskripsi Usaha</span>
                <p className="text-sm leading-relaxed text-gray-700">{passport.description}</p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <span className="text-gray-400 font-medium block">Produk Utama</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {passport.mainProducts.map((p, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PANEL 3: LEGALITAS */}
        {activeTabIdx === 2 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-3 mb-2">
              <h4 className="text-sm font-bold uppercase tracking-wider">Perizinan & Sertifikat</h4>
              <span className="text-xs text-gray-400">Verifikasi terintegrasi OSS & BPOM</span>
            </div>
            <div className="space-y-3.5">
              {passport.certifications.map((cert, idx) => (
                <div key={idx} className="p-3.5 bg-gray-50 border rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg border">
                      <FileText className="h-5 w-5 text-[#0072BC]" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-gray-800">{cert.name}</h5>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-mono">No: {cert.number || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      cert.status === 'Terverifikasi'
                        ? 'bg-green-50 text-green-600'
                        : cert.status === 'Proses'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {cert.status}
                    </span>
                    {cert.status === 'Terverifikasi' && (
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL 4: KEUANGAN */}
        {activeTabIdx === 3 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-3 mb-2">
              <h4 className="text-sm font-bold uppercase tracking-wider">Laporan Keuangan & Dampak SROI</h4>
              <span className="text-xs text-[#0072BC] font-semibold">Tahun Buku: 2026</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                <span className="font-bold text-gray-600">Omzet Bulanan (Pendidikan / Baseline)</span>
                <p className="text-lg font-black text-gray-700">{formatRupiah(passport.financials.revenueBaseline)}</p>
                <p className="text-[10px] text-gray-400">Dicatat saat pertama kali bergabung program.</p>
              </div>
              <div className="p-4 bg-[#0072BC]/5 rounded-xl space-y-2 border border-[#0072BC]/10">
                <span className="font-bold text-[#0072BC]">Omzet Terkini (Juni 2026)</span>
                <p className="text-lg font-black text-[#0072BC]">{formatRupiah(passport.financials.revenueCurrent)}</p>
                <p className="text-[10px] text-green-600 font-semibold">Bertumbuh sebesar +23.3% semenjak pembinaan</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                <span className="font-bold text-gray-600">Jumlah Tenaga Kerja (Baseline)</span>
                <p className="text-lg font-black text-gray-700">{passport.financials.employeesBaseline} Orang</p>
              </div>
              <div className="p-4 bg-[#0072BC]/5 rounded-xl space-y-2 border border-[#0072BC]/10">
                <span className="font-bold text-[#0072BC]">Jumlah Tenaga Kerja Saat Ini</span>
                <p className="text-lg font-black text-gray-800">{passport.financials.employeesCurrent} Orang</p>
                <p className="text-[10px] text-green-600 font-semibold">Menyerap 1 tenaga kerja lokal baru (+33% dampak sosial)</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl space-y-2 md:col-span-2">
                <span className="font-bold text-gray-600">Sumber Pembiayaan & Pinjaman Modal</span>
                <p className="text-sm font-bold text-gray-800">{passport.financials.loanSource} - {formatRupiah(passport.financials.loanAmount)}</p>
              </div>
            </div>
          </div>
        )}

        {/* PANEL 5: OPERASIONAL */}
        {activeTabIdx === 4 && (
          <div className="space-y-4">
            <div className="border-b pb-3 mb-2">
              <h4 className="text-sm font-bold uppercase tracking-wider">Kapasitas & Alur Operasional</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="space-y-1">
                <span className="text-gray-400 font-medium block">Kapasitas Produksi Bulanan</span>
                <p className="font-bold text-sm text-gray-800">1.500 Botol Sambal</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 font-medium block">Sistem Manajemen Stok</span>
                <p className="font-bold text-sm text-gray-800">Masih manual, direncanakan beralih ke POS Digital</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 font-medium block">Kondisi Dapur Produksi</span>
                <p className="font-bold text-sm text-gray-800">Higienis, memisahkan area pencucian cabai, sterilisasi botol, dan pemasakan bumbu</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 font-medium block">Tantangan Operasional Terbesar</span>
                <p className="font-bold text-sm text-gray-800">Fluktuasi harga cabai segar di pasar regional Jawa Tengah</p>
              </div>
            </div>
          </div>
        )}

        {/* PANEL 6: DIGITALISASI */}
        {activeTabIdx === 5 && (
          <div className="space-y-4">
            <div className="border-b pb-3 mb-2">
              <h4 className="text-sm font-bold uppercase tracking-wider">Status Adopsi Digital (Go Digital)</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
              <div className={`p-4 rounded-xl border ${passport.financials.usePOS ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'}`}>
                <h5 className="font-bold mb-1">Aplikasi Kasir (POS)</h5>
                <p className="text-[10px] text-gray-500 mb-3">Pencatatan kas kasir digital otomatis</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${passport.financials.usePOS ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {passport.financials.usePOS ? 'Sudah Aktif' : 'Belum Aktif'}
                </span>
              </div>

              <div className={`p-4 rounded-xl border ${passport.financials.useQRIS ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'}`}>
                <h5 className="font-bold mb-1">Pembayaran Cashless QRIS</h5>
                <p className="text-[10px] text-gray-500 mb-3">Menerima pembayaran nontunai e-wallet</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${passport.financials.useQRIS ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {passport.financials.useQRIS ? 'Sudah Aktif' : 'Belum Aktif'}
                </span>
              </div>

              <div className={`p-4 rounded-xl border ${passport.financials.hasBankAccount ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'}`}>
                <h5 className="font-bold mb-1">Rekening Bank Usaha Khusus</h5>
                <p className="text-[10px] text-gray-500 mb-3">Pemisahan rekening pribadi & bisnis</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${passport.financials.hasBankAccount ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {passport.financials.hasBankAccount ? 'Sudah Terpisah' : 'Masih Tercampur'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* PANEL 7: PASAR */}
        {activeTabIdx === 6 && (
          <div className="space-y-4">
            <div className="border-b pb-3 mb-2">
              <h4 className="text-sm font-bold uppercase tracking-wider">Akses Pasar & Skala Distribusi</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="space-y-1">
                <span className="text-gray-400 font-medium block">Cakupan Wilayah Pemasaran</span>
                <p className="font-bold text-sm text-gray-800">{passport.marketArea}</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-400 font-medium block">Kemitraan Distributor / Reseller</span>
                <p className="font-bold text-sm text-gray-800">{passport.partners}</p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <span className="text-gray-400 font-medium block">Daftar Pemasok Utama (Suppliers)</span>
                <p className="font-bold text-sm text-gray-800">{passport.suppliers}</p>
              </div>
            </div>
          </div>
        )}

        {/* PANEL 8: SUSTAINABILITY */}
        {activeTabIdx === 7 && (
          <div className="space-y-4">
            <div className="border-b pb-3 mb-2">
              <h4 className="text-sm font-bold uppercase tracking-wider">Praktik Hijau & ESG (Go Green)</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
              <div className="p-4 bg-green-50/30 rounded-xl space-y-2 border border-green-100">
                <span className="font-bold text-green-700 block">Pengelolaan Limbah</span>
                <p className="text-xs leading-relaxed text-gray-700">{passport.sustainability.wasteManagement}</p>
              </div>

              <div className="p-4 bg-green-50/30 rounded-xl space-y-2 border border-green-100">
                <span className="font-bold text-green-700 block">Bahan Baku Ramah Lingkungan</span>
                <p className="text-xs leading-relaxed text-gray-700">{passport.sustainability.ecoMaterials}</p>
              </div>

              <div className="p-4 bg-green-50/30 rounded-xl space-y-2 border border-green-100">
                <span className="font-bold text-green-700 block">Efisiensi Energi</span>
                <p className="text-xs leading-relaxed text-gray-700">{passport.sustainability.energySaving}</p>
              </div>
            </div>
          </div>
        )}

        {/* PANEL 9: RIWAYAT PEMBINAAN */}
        {activeTabIdx === 8 && (
          <div className="space-y-4">
            <div className="border-b pb-3 mb-2">
              <h4 className="text-sm font-bold uppercase tracking-wider">Riwayat Program TJSL & Eksternal</h4>
            </div>
            <div className="space-y-3.5 text-xs font-sans">
              <div className="p-3 bg-gray-50 border rounded-xl flex justify-between items-center">
                <div>
                  <h5 className="font-bold text-gray-800">Pertamina UMK Academy 2026</h5>
                  <p className="text-[10px] text-[#0072BC] mt-0.5">Sesi Sedang Berjalan • Kelas Regional Jawa Tengah</p>
                </div>
                <span className="bg-blue-50 text-[#0072BC] px-2 py-0.5 rounded font-bold text-[10px]">Aktif</span>
              </div>

              <div className="p-3 bg-gray-50 border rounded-xl flex justify-between items-center">
                <div>
                  <h5 className="font-bold text-gray-800">Pelatihan Keamanan Pangan Dinkes Semarang</h5>
                  <p className="text-[10px] text-gray-400 mt-0.5">Diselenggarakan Dinas Kesehatan Kota Semarang • Tahun 2023</p>
                </div>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold text-[10px]">Selesai</span>
              </div>
            </div>
          </div>
        )}

        {/* PANEL 10: DOKUMEN PENDUKUNG */}
        {activeTabIdx === 9 && (
          <div className="space-y-4">
            <div className="border-b pb-3 mb-2">
              <h4 className="text-sm font-bold uppercase tracking-wider">Unggahan Berkas Pendukung (Audit Trail)</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-3.5 border border-dashed rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <h5 className="font-bold text-gray-800">nib_siti.pdf</h5>
                    <p className="text-[9px] text-gray-400">NIB Terverifikasi • 320 KB</p>
                  </div>
                </div>
                <span className="text-[9px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">Verified</span>
              </div>

              <div className="p-3.5 border border-dashed rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <h5 className="font-bold text-gray-800">pirt_siti.pdf</h5>
                    <p className="text-[9px] text-gray-400">P-IRT Sertifikat • 512 KB</p>
                  </div>
                </div>
                <span className="text-[9px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">Verified</span>
              </div>

              <div className="p-3.5 border border-dashed rounded-xl flex items-center justify-between md:col-span-2 bg-[#0072BC]/5">
                <div className="flex items-center space-x-2.5">
                  <Upload className="h-5 w-5 text-[#0072BC]" />
                  <div>
                    <h5 className="font-bold text-gray-800 text-[#0072BC]">Unggah Dokumen Baru</h5>
                    <p className="text-[9px] text-gray-400">Seret file ke sini atau klik untuk mencari (PDF, JPG maks 5MB)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EDIT MODAL DIALOG */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border w-full max-w-2xl overflow-hidden max-h-[85vh] flex flex-col font-sans text-xs">
            {/* Modal Header */}
            <div className="bg-[#16365C] text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold">Edit Business Passport</h3>
                <p className="text-[10px] text-white/70">Sesuaikan draf data profil bisnis terverifikasi Anda</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-white/60 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-grow">
              {/* SECTION: PEMILIK */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#0072BC] border-b pb-1">Identitas Pemilik</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={editFields.ownerName}
                      onChange={(e) => setEditFields({ ...editFields, ownerName: e.target.value })}
                      className="w-full p-2 bg-gray-50 border rounded-lg text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">No. WhatsApp</label>
                    <input
                      type="text"
                      value={editFields.phone}
                      onChange={(e) => setEditFields({ ...editFields, phone: e.target.value })}
                      className="w-full p-2 bg-gray-50 border rounded-lg text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: USAHA */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#0072BC] border-b pb-1">Detail Usaha</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Nama Brand / Merek</label>
                    <input
                      type="text"
                      value={editFields.businessName}
                      onChange={(e) => setEditFields({ ...editFields, businessName: e.target.value })}
                      className="w-full p-2 bg-gray-50 border rounded-lg text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Subsektor</label>
                    <input
                      type="text"
                      value={editFields.subsector}
                      onChange={(e) => setEditFields({ ...editFields, subsector: e.target.value })}
                      className="w-full p-2 bg-gray-50 border rounded-lg text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: KEUANGAN */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#0072BC] border-b pb-1">Keuangan & Tenaga Kerja (Baseline vs Juni)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Omzet Awal (Baseline) (Rp)</label>
                    <input
                      type="number"
                      value={editFields.revenueBaseline}
                      onChange={(e) => setEditFields({ ...editFields, revenueBaseline: e.target.value })}
                      className="w-full p-2 bg-gray-50 border rounded-lg text-gray-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Omzet Terkini (Juni) (Rp)</label>
                    <input
                      type="number"
                      value={editFields.revenueCurrent}
                      onChange={(e) => setEditFields({ ...editFields, revenueCurrent: e.target.value })}
                      className="w-full p-2 bg-gray-50 border rounded-lg text-gray-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Pekerja Awal (Orang)</label>
                    <input
                      type="number"
                      value={editFields.employeesBaseline}
                      onChange={(e) => setEditFields({ ...editFields, employeesBaseline: e.target.value })}
                      className="w-full p-2 bg-gray-50 border rounded-lg text-gray-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Pekerja Saat Ini (Orang)</label>
                    <input
                      type="number"
                      value={editFields.employeesCurrent}
                      onChange={(e) => setEditFields({ ...editFields, employeesCurrent: e.target.value })}
                      className="w-full p-2 bg-gray-50 border rounded-lg text-gray-800 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: ADOPSI DIGITAL */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#0072BC] border-b pb-1">Adopsi Digital</h4>
                <div className="grid grid-cols-3 gap-3">
                  <label className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFields.usePOS}
                      onChange={(e) => setEditFields({ ...editFields, usePOS: e.target.checked })}
                      className="rounded text-[#0072BC]"
                    />
                    <span className="font-bold text-gray-700">Sudah Pakai POS</span>
                  </label>

                  <label className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFields.useQRIS}
                      onChange={(e) => setEditFields({ ...editFields, useQRIS: e.target.checked })}
                      className="rounded text-[#0072BC]"
                    />
                    <span className="font-bold text-gray-700">Sudah Pakai QRIS</span>
                  </label>

                  <label className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFields.hasBankAccount}
                      onChange={(e) => setEditFields({ ...editFields, hasBankAccount: e.target.checked })}
                      className="rounded text-[#0072BC]"
                    />
                    <span className="font-bold text-gray-700">Rekening Terpisah</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 border-t flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 bg-[#0072BC] hover:bg-[#0072BC]/95 text-white font-bold rounded-lg shadow-md flex items-center space-x-1"
              >
                <Save className="h-4 w-4" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
