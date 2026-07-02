import React, { useState, useMemo } from 'react';
import { 
  Users, CheckCircle2, AlertTriangle, ShieldCheck, Search, Filter, ArrowUpDown, 
  ChevronRight, RefreshCw, CheckSquare, Eye, FileText, FileSpreadsheet, 
  Settings, Award, TrendingUp, Sparkles, MessageSquare, AlertCircle, PlayCircle, HelpCircle
} from 'lucide-react';
import { Participant } from '../types';

interface KurasiPesertaRegionalProps {
  participants: Participant[];
  onUpdateParticipants: (updated: Participant[]) => void;
}

// 10 Specific Mock Scenarios as requested in Section 20
const MOCK_REGISTRATION_SCENARIOS: Participant[] = [
  {
    id: 'P101',
    name: 'Siti Rahmawati',
    businessName: 'Rasa Nusantara',
    sector: 'Food & Beverage',
    region: 'Jawa Tengah',
    stage: 'Pendaftaran',
    status: 'Submitted',
    riskStatus: 'Aman',
    lastLogin: '2026-06-29 14:20',
    challengePoints: 0,
    learningProgress: 0,
    attendanceRate: 0,
    overallScore: 88,
    passport: {
      ownerName: 'Siti Rahmawati',
      ownerIdentity: {
        nik: '3374025112830001',
        email: 'siti.rahma@rasanusantara.com',
        phone: '0812-3456-7890',
        address: 'Semarang, Jawa Tengah',
        gender: 'Perempuan'
      },
      businessName: 'Rasa Nusantara',
      sector: 'Food & Beverage',
      subsector: 'Sambal Tradisional',
      region: 'Jawa Tengah',
      establishedYear: 2021,
      description: 'Olahan sambal khas Nusantara tanpa bahan pengawet.',
      mainProducts: ['Sambal Bawang', 'Sambal Ijo'],
      financials: {
        revenueBaseline: 15000000,
        revenueCurrent: 15000000,
        profitBaseline: 4500000,
        profitCurrent: 4500000,
        employeesBaseline: 3,
        employeesCurrent: 3,
        digitalChannelsBaseline: 2,
        digitalChannelsCurrent: 2,
        hasBankAccount: true,
        useQRIS: true,
        usePOS: true
      },
      certifications: [
        { name: 'NIB', status: 'Terverifikasi', expiryDate: 'Seumur Hidup', number: '9120010293021', evidenceUrl: 'nib_siti.pdf' },
        { name: 'P-IRT', status: 'Terverifikasi', expiryDate: '2028-10-12', number: 'P-IRT 2063374010234-26', evidenceUrl: 'pirt_siti.pdf' },
        { name: 'Halal', status: 'Proses', expiryDate: '-', number: '-', evidenceUrl: 'halal_draft.pdf' }
      ],
      sustainability: {
        wasteManagement: 'Ampas cabai dijadikan pupuk.',
        ecoMaterials: 'Stoples kaca reusable.',
        energySaving: 'Kompor gas hemat energi.'
      },
      marketArea: 'Pulau Jawa',
      suppliers: 'Petani lokal Semarang',
      partners: 'Ritel Oleh-oleh Pandanaran',
      dataConfidenceLevel: 95,
      completeness: 100
    },
    capabilities: [],
    actionPlans: [],
    developmentCard: {
      strengths: [],
      weaknesses: [],
      recommendation30Days: '',
      recommendation60Days: '',
      recommendation90Days: '',
      smexpoReadiness: 'Belum Siap',
      aggregatorReadiness: 'Belum Siap'
    },
    tjslStatus: 'Binaan Terverifikasi',
    tjslVerificationStatus: 'Terverifikasi',
    tjslClaim: {
      isBinaan: 'Ya',
      programAsal: 'PFpreneur',
      subholding: 'Pertamina Patra Niaga',
      region: 'Jawa Tengah',
      tahun: 2025,
      mitraId: 'PF-2025-0819',
      picName: 'Ibu Rini',
      statusProgram: 'Alumni',
      evidenceFile: 'sertifikat_pfpreneur_siti.pdf',
      notes: 'Lulusan terbaik regional',
      consent: true,
      dbMatchStatus: 'Match',
      dbMatchDetails: 'NIK cocok 100% dengan database pusat Satu Data SMEPP.'
    }
  },
  {
    id: 'P102',
    name: 'Andi Wijaya',
    businessName: 'Kriya Bambu Lestari',
    sector: 'Craft & Jewellery',
    region: 'Jawa Barat',
    stage: 'Pendaftaran',
    status: 'Submitted',
    riskStatus: 'Aman',
    lastLogin: '2026-06-29 11:15',
    challengePoints: 0,
    learningProgress: 0,
    attendanceRate: 0,
    overallScore: 85,
    passport: {
      ownerName: 'Andi Wijaya',
      ownerIdentity: {
        nik: '3204012403840002',
        email: 'andi.wijaya@kriyabambu.com',
        phone: '0857-1234-5678',
        address: 'Tasikmalaya, Jawa Barat',
        gender: 'Laki-laki'
      },
      businessName: 'Kriya Bambu Lestari',
      sector: 'Craft & Jewellery',
      subsector: 'Kerajinan Bambu',
      region: 'Jawa Barat',
      establishedYear: 2019,
      description: 'Produk dekorasi interior berbahan bambu ramah lingkungan.',
      mainProducts: ['Lampu Hias Bambu', 'Rantang Bambu'],
      financials: {
        revenueBaseline: 25000000,
        revenueCurrent: 25000000,
        profitBaseline: 8000000,
        profitCurrent: 8000000,
        employeesBaseline: 5,
        employeesCurrent: 5,
        digitalChannelsBaseline: 3,
        digitalChannelsCurrent: 3,
        hasBankAccount: true,
        useQRIS: true,
        usePOS: false
      },
      certifications: [
        { name: 'NIB', status: 'Terverifikasi', expiryDate: 'Seumur Hidup', number: '9120301923041', evidenceUrl: 'nib_andi.pdf' }
      ],
      sustainability: {
        wasteManagement: 'Serpihan bambu diolah menjadi briket.',
        ecoMaterials: 'Bambu bersertifikasi lestari.',
        energySaving: 'Pengeringan alami.'
      },
      marketArea: 'Nasional & Bali',
      suppliers: 'Hutan bambu desa',
      partners: 'Galeri kerajinan Bali',
      dataConfidenceLevel: 92,
      completeness: 100
    },
    capabilities: [],
    actionPlans: [],
    developmentCard: {
      strengths: [],
      weaknesses: [],
      recommendation30Days: '',
      recommendation60Days: '',
      recommendation90Days: '',
      smexpoReadiness: 'Belum Siap',
      aggregatorReadiness: 'Belum Siap'
    },
    tjslStatus: 'Peserta Eksternal',
    tjslVerificationStatus: 'Peserta Eksternal',
    tjslClaim: {
      isBinaan: 'Belum',
      programAsal: '',
      subholding: '',
      region: '',
      tahun: 2026,
      mitraId: '',
      picName: '',
      statusProgram: '',
      evidenceFile: '',
      notes: '',
      consent: true,
      dbMatchStatus: 'No_Match',
      dbMatchDetails: 'Pendaftar umum eksternal (belum terafiliasi TJSL).'
    }
  },
  {
    id: 'P103',
    name: 'Dewi Lestari',
    businessName: 'Tenun Ikat Srikandi',
    sector: 'Fesyen & Wastra',
    region: 'Nusa Tenggara Timur',
    stage: 'Pendaftaran',
    status: 'Data Belum Lengkap',
    riskStatus: 'Perlu Perhatian',
    lastLogin: '2026-06-28 09:30',
    challengePoints: 0,
    learningProgress: 0,
    attendanceRate: 0,
    overallScore: 42,
    passport: {
      ownerName: 'Dewi Lestari',
      ownerIdentity: {
        nik: '5303021408890003',
        email: 'dewi.tenun@srikandi.com',
        phone: '0813-9876-5432',
        address: 'Kupang, NTT',
        gender: 'Perempuan'
      },
      businessName: 'Tenun Ikat Srikandi',
      sector: 'Fesyen & Wastra',
      subsector: 'Tenun Tradisional',
      region: 'Nusa Tenggara Timur',
      establishedYear: 2022,
      description: 'Tenun ikat pewarna alami khas NTT.',
      mainProducts: ['Selendang Tenun', 'Sarung Tenun'],
      financials: {
        revenueBaseline: 8000000,
        revenueCurrent: 8000000,
        profitBaseline: 2500000,
        profitCurrent: 2500000,
        employeesBaseline: 2,
        employeesCurrent: 2,
        digitalChannelsBaseline: 1,
        digitalChannelsCurrent: 1,
        hasBankAccount: false,
        useQRIS: false,
        usePOS: false
      },
      certifications: [
        { name: 'NIB', status: 'Belum Lengkap', expiryDate: '-', number: '-', evidenceUrl: '' }
      ],
      sustainability: {
        wasteManagement: 'Sisa benang ditenun kembali.',
        ecoMaterials: 'Pewarna alam nabati.',
        energySaving: 'Alat tenun bukan mesin (ATBM).'
      },
      marketArea: 'Kupang',
      suppliers: 'Pintal benang kapas lokal',
      partners: 'Koperasi wanita NTT',
      dataConfidenceLevel: 55,
      completeness: 60
    },
    capabilities: [],
    actionPlans: [],
    developmentCard: {
      strengths: [],
      weaknesses: [],
      recommendation30Days: '',
      recommendation60Days: '',
      recommendation90Days: '',
      smexpoReadiness: 'Belum Siap',
      aggregatorReadiness: 'Belum Siap'
    },
    tjslStatus: 'Peserta Eksternal',
    tjslVerificationStatus: 'Peserta Eksternal',
    tjslClaim: {
      isBinaan: 'Belum',
      programAsal: '',
      subholding: '',
      region: '',
      tahun: 2026,
      mitraId: '',
      picName: '',
      statusProgram: '',
      evidenceFile: '',
      notes: 'Dokumen NIB belum di-upload dan data keuangan masih estimasi kasar.',
      consent: true,
      dbMatchStatus: 'No_Match',
      dbMatchDetails: 'NIB kosong. Dokumen administrasi belum valid.'
    }
  },
  {
    id: 'P104',
    name: 'Budi Hartono',
    businessName: 'Madu Hutan Borneo',
    sector: 'Food & Beverage',
    region: 'Kalimantan Timur',
    stage: 'Pendaftaran',
    status: 'Potensi Data Ganda',
    riskStatus: 'Bahaya',
    lastLogin: '2026-06-27 16:45',
    challengePoints: 0,
    learningProgress: 0,
    attendanceRate: 0,
    overallScore: 50,
    passport: {
      ownerName: 'Budi Hartono',
      ownerIdentity: {
        nik: '3374025112830001', // DUPLICATE NIK with Siti!
        email: 'budi.madu@borneo.com',
        phone: '0812-9988-7766',
        address: 'Samarinda, Kalimantan Timur',
        gender: 'Laki-laki'
      },
      businessName: 'Madu Hutan Borneo',
      sector: 'Food & Beverage',
      subsector: 'Madu Asli',
      region: 'Kalimantan Timur',
      establishedYear: 2020,
      description: 'Madu murni dari pedalaman hutan Kalimantan.',
      mainProducts: ['Madu Odeng', 'Madu Kelulut'],
      financials: {
        revenueBaseline: 18000000,
        revenueCurrent: 18000000,
        profitBaseline: 6000000,
        profitCurrent: 6000000,
        employeesBaseline: 4,
        employeesCurrent: 4,
        digitalChannelsBaseline: 2,
        digitalChannelsCurrent: 2,
        hasBankAccount: true,
        useQRIS: true,
        usePOS: false
      },
      certifications: [
        { name: 'NIB', status: 'Terverifikasi', expiryDate: 'Seumur Hidup', number: '9120010293999', evidenceUrl: 'nib_budi_madu.pdf' }
      ],
      sustainability: {
        wasteManagement: 'Ampas sarang lebah dijadikan lilin aromaterapi.',
        ecoMaterials: 'Botol kaca reusable.',
        energySaving: 'Penyaringan alami.'
      },
      marketArea: 'Regional Kaltim',
      suppliers: 'Pencari madu suku Dayak',
      partners: 'Apotek lokal',
      dataConfidenceLevel: 40,
      completeness: 80
    },
    capabilities: [],
    actionPlans: [],
    developmentCard: {
      strengths: [],
      weaknesses: [],
      recommendation30Days: '',
      recommendation60Days: '',
      recommendation90Days: '',
      smexpoReadiness: 'Belum Siap',
      aggregatorReadiness: 'Belum Siap'
    },
    tjslStatus: 'Peserta Eksternal',
    tjslVerificationStatus: 'Peserta Eksternal',
    tjslClaim: {
      isBinaan: 'Belum',
      programAsal: '',
      subholding: '',
      region: '',
      tahun: 2026,
      mitraId: '',
      picName: '',
      statusProgram: '',
      evidenceFile: '',
      notes: '',
      consent: true,
      dbMatchStatus: 'Duplicate',
      dbMatchDetails: 'PERINGATAN: NIK ini terdeteksi ganda di sistem, sudah terdaftar atas nama Siti Rahmawati (P101).'
    }
  },
  {
    id: 'P105',
    name: 'Eko Prasetyo',
    businessName: 'Pupuk Hijau Nusantara',
    sector: 'Agribisnis',
    region: 'Jawa Timur',
    stage: 'Pendaftaran',
    status: 'Perlu Klarifikasi',
    riskStatus: 'Perlu Perhatian',
    lastLogin: '2026-06-29 10:00',
    challengePoints: 0,
    learningProgress: 0,
    attendanceRate: 0,
    overallScore: 68,
    passport: {
      ownerName: 'Eko Prasetyo',
      ownerIdentity: {
        nik: '3507012306820005',
        email: 'eko.pupuk@hijau.com',
        phone: '0811-2233-4455',
        address: 'Malang, Jawa Timur',
        gender: 'Laki-laki'
      },
      businessName: 'Pupuk Hijau Nusantara',
      sector: 'Agribisnis',
      subsector: 'Pupuk Organik',
      region: 'Jawa Timur',
      establishedYear: 2023,
      description: 'Produsen pupuk organik cair berbahan urin kelinci.',
      mainProducts: ['Pupuk Cair Super', 'Media Tanam'],
      financials: {
        revenueBaseline: 55000000, // Very high but only established 2023
        revenueCurrent: 55000000,
        profitBaseline: 22000000,
        profitCurrent: 22000000,
        employeesBaseline: 2,
        employeesCurrent: 2,
        digitalChannelsBaseline: 1,
        digitalChannelsCurrent: 1,
        hasBankAccount: true,
        useQRIS: true,
        usePOS: false
      },
      certifications: [
        { name: 'NIB', status: 'Terverifikasi', expiryDate: 'Seumur Hidup', number: '9120301923055', evidenceUrl: 'nib_eko.pdf' }
      ],
      sustainability: {
        wasteManagement: 'Nol limbah.',
        ecoMaterials: 'Jeriken daur ulang.',
        energySaving: 'Energi manual.'
      },
      marketArea: 'Malang Raya',
      suppliers: 'Peternak kelinci Malang',
      partners: 'Kelompok tani Pujon',
      dataConfidenceLevel: 75,
      completeness: 90
    },
    capabilities: [],
    actionPlans: [],
    developmentCard: {
      strengths: [],
      weaknesses: [],
      recommendation30Days: '',
      recommendation60Days: '',
      recommendation90Days: '',
      smexpoReadiness: 'Belum Siap',
      aggregatorReadiness: 'Belum Siap'
    },
    tjslStatus: 'Binaan Terverifikasi',
    tjslVerificationStatus: 'Perlu Klarifikasi',
    tjslClaim: {
      isBinaan: 'Ya',
      programAsal: 'Rumah BUMN Malang',
      subholding: 'Pertamina Hulu Energi',
      region: 'Jawa Timur',
      tahun: 2024,
      mitraId: 'RB-MLG-837',
      picName: 'Pak Wahyu',
      statusProgram: 'Aktif',
      evidenceFile: 'surat_keterangan_rb.pdf',
      notes: 'Estimasi keuangan terlampau tinggi untuk skala usaha mikro yang baru berdiri 1 tahun.',
      consent: true,
      dbMatchStatus: 'Clarify_Needed',
      dbMatchDetails: 'Omzet 55 Juta per bulan dengan 2 tenaga kerja memerlukan klarifikasi buku kas atau rekening koran.'
    }
  },
  {
    id: 'P106',
    name: 'Fatimah Az-Zahra',
    businessName: 'Zahra Muslim Store',
    sector: 'Fesyen & Wastra',
    region: 'DKI Jakarta',
    stage: 'Pendaftaran',
    status: 'Submitted',
    riskStatus: 'Aman',
    lastLogin: '2026-06-29 13:40',
    challengePoints: 0,
    learningProgress: 0,
    attendanceRate: 0,
    overallScore: 78,
    passport: {
      ownerName: 'Fatimah Az-Zahra',
      ownerIdentity: {
        nik: '3171014502900006',
        email: 'zahra.store@gmail.com',
        phone: '0815-5566-7788',
        address: 'Tanah Abang, DKI Jakarta',
        gender: 'Perempuan'
      },
      businessName: 'Zahra Muslim Store',
      sector: 'Fesyen & Wastra',
      subsector: 'Busana Muslim Syari',
      region: 'DKI Jakarta',
      establishedYear: 2018,
      description: 'Hijab dan gamis syari premium jahit mandiri.',
      mainProducts: ['Gamis Syari', 'Khimar Instant'],
      financials: {
        revenueBaseline: 40000000,
        revenueCurrent: 40000000,
        profitBaseline: 15000000,
        profitCurrent: 15000000,
        employeesBaseline: 4,
        employeesCurrent: 4,
        digitalChannelsBaseline: 4,
        digitalChannelsCurrent: 4,
        hasBankAccount: true,
        useQRIS: true,
        usePOS: true
      },
      certifications: [
        { name: 'NIB', status: 'Terverifikasi', expiryDate: 'Seumur Hidup', number: '9120301923066', evidenceUrl: 'nib_zahra.pdf' }
      ],
      sustainability: {
        wasteManagement: 'Perca diolah jadi bando dan konektor masker.',
        ecoMaterials: 'Kemasan cassava bag terurai air.',
        energySaving: 'Mesin jahit dinamo servo hemat listrik.'
      },
      marketArea: 'Jabodetabek & Sumatera',
      suppliers: 'Toko bahan tekstil Tanah Abang',
      partners: 'Shopee Mall, Tokopedia Pro',
      dataConfidenceLevel: 90,
      completeness: 100
    },
    capabilities: [],
    actionPlans: [],
    developmentCard: {
      strengths: [],
      weaknesses: [],
      recommendation30Days: '',
      recommendation60Days: '',
      recommendation90Days: '',
      smexpoReadiness: 'Belum Siap',
      aggregatorReadiness: 'Belum Siap'
    },
    tjslStatus: 'Peserta Eksternal',
    tjslVerificationStatus: 'Peserta Eksternal',
    tjslClaim: {
      isBinaan: 'Belum',
      programAsal: '',
      subholding: '',
      region: '',
      tahun: 2026,
      mitraId: '',
      picName: '',
      statusProgram: '',
      evidenceFile: '',
      notes: 'Sedang mengikuti program pembinaan dari Kemenkop UKM.',
      consent: true,
      dbMatchStatus: 'No_Match',
      dbMatchDetails: 'Pendaftar eksternal, riwayat program pembinaan lain terdeteksi aktif.'
    }
  },
  {
    id: 'P107',
    name: 'Guntur Pratama',
    businessName: 'Sepatu Kulit Garut',
    sector: 'Craft & Jewellery',
    region: 'Jawa Barat',
    stage: 'Pendaftaran',
    status: 'Submitted',
    riskStatus: 'Aman',
    lastLogin: '2026-06-28 15:10',
    challengePoints: 0,
    learningProgress: 0,
    attendanceRate: 0,
    overallScore: 72,
    passport: {
      ownerName: 'Guntur Pratama',
      ownerIdentity: {
        nik: '3205011802920007',
        email: 'guntur.leather@garut.com',
        phone: '0812-7777-8888',
        address: 'Sukaregang, Garut',
        gender: 'Laki-laki'
      },
      businessName: 'Sepatu Kulit Garut',
      sector: 'Craft & Jewellery',
      subsector: 'Alas Kaki Kulit',
      region: 'Jawa Barat',
      establishedYear: 2021,
      description: 'Sepatu kulit handmade berkualitas premium.',
      mainProducts: ['Sepatu Pantofel', 'Sandal Kulit'],
      financials: {
        revenueBaseline: 12000000,
        revenueCurrent: 12000000,
        profitBaseline: 3000000,
        profitCurrent: 3000000,
        employeesBaseline: 2,
        employeesCurrent: 2,
        digitalChannelsBaseline: 2,
        digitalChannelsCurrent: 2,
        hasBankAccount: true,
        useQRIS: true,
        usePOS: false
      },
      certifications: [
        { name: 'NIB', status: 'Terverifikasi', expiryDate: 'Seumur Hidup', number: '9120301923077', evidenceUrl: 'nib_guntur.pdf' }
      ],
      sustainability: {
        wasteManagement: 'Kulit sisa dijadikan gantungan kunci.',
        ecoMaterials: 'Bahan penyamak ramah lingkungan.',
        energySaving: 'Pengerjaan manual.'
      },
      marketArea: 'Jawa Barat',
      suppliers: 'Penyamak kulit Sukaregang',
      partners: 'Toko retail Garut',
      dataConfidenceLevel: 88,
      completeness: 100
    },
    capabilities: [],
    actionPlans: [],
    developmentCard: {
      strengths: [],
      weaknesses: [],
      recommendation30Days: '',
      recommendation60Days: '',
      recommendation90Days: '',
      smexpoReadiness: 'Belum Siap',
      aggregatorReadiness: 'Belum Siap'
    },
    tjslStatus: 'Binaan Terverifikasi',
    tjslVerificationStatus: 'Terverifikasi',
    tjslClaim: {
      isBinaan: 'Ya',
      programAsal: 'SMEPP Pertamina',
      subholding: 'Pertamina Power & NRE',
      region: 'Jawa Barat',
      tahun: 2025,
      mitraId: 'PNRE-2025-103',
      picName: 'Pak Rully',
      statusProgram: 'Alumni',
      evidenceFile: 'sk_mitra_binaan_pnr.pdf',
      notes: 'Peserta potensial cadangan karena skor berada di batas tengah.',
      consent: true,
      dbMatchStatus: 'Match',
      dbMatchDetails: 'Terdaftar di database PUMK Pusat.'
    }
  },
  {
    id: 'P108',
    name: 'Hendra Wijaya',
    businessName: 'Cokelat Kayu Manis',
    sector: 'Food & Beverage',
    region: 'Sumatera Barat',
    stage: 'Pendaftaran',
    status: 'Submitted',
    riskStatus: 'Aman',
    lastLogin: '2026-06-29 08:30',
    challengePoints: 0,
    learningProgress: 0,
    attendanceRate: 0,
    overallScore: 69, // Low score, overridden to Lolos by SMEPP/PTC for regional representation
    passport: {
      ownerName: 'Hendra Wijaya',
      ownerIdentity: {
        nik: '1306012401880008',
        email: 'hendra.cocoa@kayumanis.com',
        phone: '0812-4455-6677',
        address: 'Tanah Datar, Sumatera Barat',
        gender: 'Laki-laki'
      },
      businessName: 'Cokelat Kayu Manis',
      sector: 'Food & Beverage',
      subsector: 'Olahan Kakao',
      region: 'Sumatera Barat',
      establishedYear: 2020,
      description: 'Olahan cokelat batangan artisan dengan kayu manis Sumatra.',
      mainProducts: ['Cokelat Kayu Manis 70%', 'Bubuk Kakao Premium'],
      financials: {
        revenueBaseline: 9000000,
        revenueCurrent: 9000000,
        profitBaseline: 2500000,
        profitCurrent: 2500000,
        employeesBaseline: 2,
        employeesCurrent: 2,
        digitalChannelsBaseline: 1,
        digitalChannelsCurrent: 1,
        hasBankAccount: true,
        useQRIS: true,
        usePOS: false
      },
      certifications: [
        { name: 'NIB', status: 'Terverifikasi', expiryDate: 'Seumur Hidup', number: '9120301923088', evidenceUrl: 'nib_hendra.pdf' }
      ],
      sustainability: {
        wasteManagement: 'Kulit biji kakao dijadikan pakan ternak.',
        ecoMaterials: 'Kertas daur ulang unbleached.',
        energySaving: 'Mesin sangrai gas LPG hemat energi.'
      },
      marketArea: 'Sumatera Barat',
      suppliers: 'Petani kakao rakyat Tanah Datar',
      partners: 'Kafe lokal Padang',
      dataConfidenceLevel: 86,
      completeness: 100
    },
    capabilities: [],
    actionPlans: [],
    developmentCard: {
      strengths: [],
      weaknesses: [],
      recommendation30Days: '',
      recommendation60Days: '',
      recommendation90Days: '',
      smexpoReadiness: 'Belum Siap',
      aggregatorReadiness: 'Belum Siap'
    },
    tjslStatus: 'Binaan Terverifikasi',
    tjslVerificationStatus: 'Terverifikasi',
    tjslClaim: {
      isBinaan: 'Ya',
      programAsal: 'PUMK Pertamina',
      subholding: 'Pertamina Hulu Rokan',
      region: 'Sumatera Barat',
      tahun: 2024,
      mitraId: 'PHR-2024-054',
      picName: 'Ibu Widya',
      statusProgram: 'Alumni',
      evidenceFile: 'sertifikat_binaan_rokan.pdf',
      notes: 'Overridden oleh Admin SMEPP untuk pemerataan sebaran wilayah Sumatera Barat.',
      consent: true,
      dbMatchStatus: 'Match',
      dbMatchDetails: 'Data binaan terdaftar di Subholding Hulu Rokan.'
    }
  },
  {
    id: 'P109',
    name: 'Indah Permata',
    businessName: 'Sambal Andaliman',
    sector: 'Food & Beverage',
    region: 'Sumatera Utara',
    stage: 'Pendaftaran',
    status: 'Submitted',
    riskStatus: 'Aman',
    lastLogin: '2026-06-29 09:15',
    challengePoints: 0,
    learningProgress: 0,
    attendanceRate: 0,
    overallScore: 84, // Initially selected, but declines regional offer
    passport: {
      ownerName: 'Indah Permata',
      ownerIdentity: {
        nik: '1201014405930009',
        email: 'indah.andaliman@gmail.com',
        phone: '0813-2211-4433',
        address: 'Toba Samosir, Sumatera Utara',
        gender: 'Perempuan'
      },
      businessName: 'Sambal Andaliman',
      sector: 'Food & Beverage',
      subsector: 'Sambal Tradisional',
      region: 'Sumatera Utara',
      establishedYear: 2022,
      description: 'Sambal khas Batak dengan buah andaliman segar pilihan.',
      mainProducts: ['Sambal Andaliman Botol', 'Sambal Teri Toba'],
      financials: {
        revenueBaseline: 14000000,
        revenueCurrent: 14000000,
        profitBaseline: 4000000,
        profitCurrent: 4000000,
        employeesBaseline: 2,
        employeesCurrent: 2,
        digitalChannelsBaseline: 2,
        digitalChannelsCurrent: 2,
        hasBankAccount: true,
        useQRIS: true,
        usePOS: false
      },
      certifications: [
        { name: 'NIB', status: 'Terverifikasi', expiryDate: 'Seumur Hidup', number: '9120301923099', evidenceUrl: 'nib_indah.pdf' }
      ],
      sustainability: {
        wasteManagement: 'Biji andaliman sisa dijadikan benih baru.',
        ecoMaterials: 'Botol kaca.',
        energySaving: 'Alat masak standar.'
      },
      marketArea: 'Sumut & Pekanbaru',
      suppliers: 'Petani andaliman Lintongnihuta',
      partners: 'Toko oleh-oleh Bandara Silangit',
      dataConfidenceLevel: 94,
      completeness: 100
    },
    capabilities: [],
    actionPlans: [],
    developmentCard: {
      strengths: [],
      weaknesses: [],
      recommendation30Days: '',
      recommendation60Days: '',
      recommendation90Days: '',
      smexpoReadiness: 'Belum Siap',
      aggregatorReadiness: 'Belum Siap'
    },
    tjslStatus: 'Peserta Eksternal',
    tjslVerificationStatus: 'Peserta Eksternal',
    tjslClaim: {
      isBinaan: 'Belum',
      programAsal: '',
      subholding: '',
      region: '',
      tahun: 2026,
      mitraId: '',
      picName: '',
      statusProgram: '',
      evidenceFile: '',
      notes: 'Peserta mengundurkan diri (Declined Regional Offer) karena fokus melahirkan.',
      consent: true,
      dbMatchStatus: 'No_Match',
      dbMatchDetails: 'Pendaftar eksternal.'
    }
  },
  {
    id: 'P110',
    name: 'Joko Susilo',
    businessName: 'Pupuk Kompos Subur',
    sector: 'Agribisnis',
    region: 'Jawa Tengah',
    stage: 'Pendaftaran',
    status: 'Submitted',
    riskStatus: 'Aman',
    lastLogin: '2026-06-28 17:00',
    challengePoints: 0,
    learningProgress: 0,
    attendanceRate: 0,
    overallScore: 71, // Reserve candidate, promoted to replace Indah Permata!
    passport: {
      ownerName: 'Joko Susilo',
      ownerIdentity: {
        nik: '3302011210850010',
        email: 'joko.pupuk@gmail.com',
        phone: '0812-4455-2233',
        address: 'Banyumas, Jawa Tengah',
        gender: 'Laki-laki'
      },
      businessName: 'Pupuk Kompos Subur',
      sector: 'Agribisnis',
      subsector: 'Pupuk Organik Padat',
      region: 'Jawa Tengah',
      establishedYear: 2020,
      description: 'Produksi kompos organik berkualitas tinggi dari limbah peternakan sapi.',
      mainProducts: ['Kompos Sapi Super', 'Pupuk Kascing'],
      financials: {
        revenueBaseline: 11000000,
        revenueCurrent: 11000000,
        profitBaseline: 3200000,
        profitCurrent: 3200000,
        employeesBaseline: 2,
        employeesCurrent: 2,
        digitalChannelsBaseline: 1,
        digitalChannelsCurrent: 1,
        hasBankAccount: true,
        useQRIS: true,
        usePOS: false
      },
      certifications: [
        { name: 'NIB', status: 'Terverifikasi', expiryDate: 'Seumur Hidup', number: '9120301923100', evidenceUrl: 'nib_joko.pdf' }
      ],
      sustainability: {
        wasteManagement: 'Mengubah limbah peternakan menjadi pupuk bernilai tinggi.',
        ecoMaterials: 'Karung plastik daur ulang.',
        energySaving: 'Pencampuran manual bertenaga biodigester.'
      },
      marketArea: 'Banyumas & Cilacap',
      suppliers: 'Peternak sapi Banyumas',
      partners: 'Kios pupuk lokal',
      dataConfidenceLevel: 89,
      completeness: 100
    },
    capabilities: [],
    actionPlans: [],
    developmentCard: {
      strengths: [],
      weaknesses: [],
      recommendation30Days: '',
      recommendation60Days: '',
      recommendation90Days: '',
      smexpoReadiness: 'Belum Siap',
      aggregatorReadiness: 'Belum Siap'
    },
    tjslStatus: 'Binaan Terverifikasi',
    tjslVerificationStatus: 'Terverifikasi',
    tjslClaim: {
      isBinaan: 'Ya',
      programAsal: 'PUMK Pertamina',
      subholding: 'Pertamina Patra Niaga',
      region: 'Jawa Tengah',
      tahun: 2024,
      mitraId: 'PPN-2024-918',
      picName: 'Pak Dwi',
      statusProgram: 'Alumni',
      evidenceFile: 'sk_mitra_patra_niaga.pdf',
      notes: 'Dipromosikan dari daftar cadangan untuk menggantikan peserta yang mundur.',
      consent: true,
      dbMatchStatus: 'Match',
      dbMatchDetails: 'Terdaftar di database PUMK Region Jateng.'
    }
  }
];

export default function KurasiPesertaRegional({ participants, onUpdateParticipants }: KurasiPesertaRegionalProps) {
  const [activeTab, setActiveTab] = useState<'semua' | 'verifikasi' | 'ranking' | 'approval'>('semua');
  
  // Create state based on the 10 distinct mock scenarios
  const [localParticipants, setLocalParticipants] = useState<Participant[]>(() => {
    // Check if we already have the mock ones loaded or need to load them
    const existingIds = participants.map(p => p.id);
    const missingMocks = MOCK_REGISTRATION_SCENARIOS.filter(mock => !existingIds.includes(mock.id));
    if (missingMocks.length > 0) {
      return [...participants, ...missingMocks];
    }
    return participants;
  });

  // Selection quota details (Section 13)
  const REGIONAL_QUOTA = 1200;
  const RESERVE_QUOTA = 120; // 10% of regional quota

  // States for search and filter on Tab 1
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterSector, setFilterSector] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [filterEligibility, setFilterEligibility] = useState('');
  const [filterCompleteness, setFilterCompleteness] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Sort State
  const [sortBy, setSortBy] = useState<'overallScore' | 'name' | 'businessName'>('overallScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Column visibility for Tab 1
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    name: true,
    businessName: true,
    region: true,
    sector: true,
    source: true,
    eligibility: true,
    score: true,
    status: true,
    action: true
  });

  // Selected participant for detail view or verification
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>('P101');
  const currentSelectedParticipant = useMemo(() => {
    return localParticipants.find(p => p.id === selectedParticipantId) || localParticipants[0];
  }, [localParticipants, selectedParticipantId]);

  // Verification Checklist State for Tab 2
  const [verificationChecklist, setVerificationChecklist] = useState({
    nib: 'Terverifikasi' as 'Belum Diperiksa' | 'Terverifikasi' | 'Ditolak' | 'Perlu Klarifikasi',
    ownership: 'Terverifikasi' as 'Belum Diperiksa' | 'Terverifikasi' | 'Ditolak' | 'Perlu Klarifikasi',
    businessAge: 'Terverifikasi' as 'Belum Diperiksa' | 'Terverifikasi' | 'Ditolak' | 'Perlu Klarifikasi',
    revenue: 'Terverifikasi' as 'Belum Diperiksa' | 'Terverifikasi' | 'Ditolak' | 'Perlu Klarifikasi',
    employees: 'Terverifikasi' as 'Belum Diperiksa' | 'Terverifikasi' | 'Ditolak' | 'Perlu Klarifikasi',
    salesChannels: 'Terverifikasi' as 'Belum Diperiksa' | 'Terverifikasi' | 'Ditolak' | 'Perlu Klarifikasi',
    legalDocuments: 'Terverifikasi' as 'Belum Diperiksa' | 'Terverifikasi' | 'Ditolak' | 'Perlu Klarifikasi',
    commitment: 'Terverifikasi' as 'Belum Diperiksa' | 'Terverifikasi' | 'Ditolak' | 'Perlu Klarifikasi'
  });
  const [verificationNote, setVerificationNote] = useState('');

  // Override logic State for Tab 4
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideTargetStatus, setOverrideTargetStatus] = useState<'Lolos Pembinaan Regional' | 'Cadangan' | 'Tidak Lolos' | 'Perlu Klarifikasi'>('Lolos Pembinaan Regional');
  const [auditLogs, setAuditLogs] = useState<Array<{
    timestamp: string;
    participantId: string;
    participantName: string;
    prevStatus: string;
    newStatus: string;
    reason: string;
    operator: string;
  }>>([
    {
      timestamp: '2026-06-29 11:05',
      participantId: 'P108',
      participantName: 'Hendra Wijaya',
      prevStatus: 'Recommended Tidak Lolos',
      newStatus: 'Lolos Pembinaan Regional',
      reason: 'Apresiasi keterwakilan daerah Tanah Datar, Sumatera Barat (Intervensi Kebijakan SMEPP)',
      operator: 'Dra. Sri Wahyuni (SMEPP)'
    }
  ]);

  // Handle active participant changes to reset verification checklist based on their data
  const selectParticipantForVerification = (pId: string) => {
    setSelectedParticipantId(pId);
    const p = localParticipants.find(x => x.id === pId);
    if (p) {
      setVerificationNote(p.tjslClaim?.notes || '');
      // Autofill verification state based on their document status
      setVerificationChecklist({
        nib: p.passport?.certifications?.find(c => c.name === 'NIB')?.status === 'Terverifikasi' ? 'Terverifikasi' : 'Belum Diperiksa',
        ownership: 'Terverifikasi',
        businessAge: (p.passport?.establishedYear && Number(p.passport.establishedYear) <= 2025) ? 'Terverifikasi' : 'Belum Diperiksa',
        revenue: p.status === 'Perlu Klarifikasi' ? 'Perlu Klarifikasi' : 'Terverifikasi',
        employees: 'Terverifikasi',
        salesChannels: 'Terverifikasi',
        legalDocuments: p.passport?.completeness && p.passport.completeness >= 80 ? 'Terverifikasi' : 'Belum Diperiksa',
        commitment: p.tjslClaim?.consent ? 'Terverifikasi' : 'Belum Diperiksa'
      });
    }
  };

  // 1. Calculate Aggregate KPIs representing ~3000 applicants
  const kpis = useMemo(() => {
    const totalCount = 3020;
    const submittedCount = 2860;
    
    // Count from our stateful local array
    const localSubmitted = localParticipants.filter(p => p.stage === 'Pendaftaran' || p.stage === 'Pembinaan Regional');
    const eligibleCount = 2240;
    const clarificationCount = localParticipants.filter(p => p.status === 'Perlu Klarifikasi').length + 142; // aggregate representation
    const ineligibleCount = 478;

    // Final selected
    const lolosCount = localParticipants.filter(p => p.stage === 'Pembinaan Regional' || p.status === 'Onboarding Regional' || p.status === 'Onboarding Selesai').length + 1195;
    const cadanganCount = localParticipants.filter(p => p.status === 'Cadangan').length + 118;
    const tidakLolosCount = totalCount - lolosCount - cadanganCount;

    return {
      total: totalCount,
      submitted: submittedCount,
      eligible: eligibleCount,
      clarification: clarificationCount,
      ineligible: ineligibleCount,
      lolos: lolosCount,
      cadangan: cadanganCount,
      tidakLolos: tidakLolosCount
    };
  }, [localParticipants]);

  // 2. Scorecard Calculation helper (Section 8)
  const getScorecardBreakdown = (p: Participant) => {
    // Scorecard weights:
    // 1. Asal Ekosistem (TJSL=100, Alumni=85, External=60) - 15%
    // 2. Legalitas & Sertifikasi (NIB+PIRT=100, NIB=80, Halal=90, None=30) - 15%
    // 3. Kesiapan Usaha (Years of business, employees, revenue) - 20%
    // 4. Digital & Branding (Channels, marketplace, QRIS, social media) - 15%
    // 5. Komitmen & Data (Data completeness, correctness) - 20%
    // 6. Growth Mindset (Challenges previous program, sustainability description) - 15%

    let asalScore = p.tjslStatus === 'Binaan Terverifikasi' ? 100 : p.tjslStatus === 'Alumni Program Pertamina' ? 85 : 60;
    
    let hasNib = p.passport?.certifications?.some(c => c.name === 'NIB' && c.status === 'Terverifikasi');
    let hasPirt = p.passport?.certifications?.some(c => c.name === 'P-IRT' && c.status === 'Terverifikasi');
    let legalScore = (hasNib && hasPirt) ? 100 : hasNib ? 80 : 40;

    let established = Number(p.passport?.establishedYear) || 2024;
    let years = 2026 - established;
    let prepScore = years >= 5 ? 100 : years >= 3 ? 90 : years >= 1 ? 75 : 50;

    let channels = Number(p.passport?.financials?.digitalChannelsBaseline) || 1;
    let digitalScore = channels >= 3 ? 100 : channels >= 2 ? 85 : 65;

    let completeness = p.passport?.completeness || 80;
    let commitmentScore = completeness;

    let sustainability = p.passport?.sustainability ? 90 : 70;
    let growthScore = sustainability;

    const weightedAsal = Number((asalScore * 0.15).toFixed(1));
    const weightedLegal = Number((legalScore * 0.15).toFixed(1));
    const weightedPrep = Number((prepScore * 0.20).toFixed(1));
    const weightedDigital = Number((digitalScore * 0.15).toFixed(1));
    const weightedCommitment = Number((commitmentScore * 0.20).toFixed(1));
    const weightedGrowth = Number((growthScore * 0.15).toFixed(1));

    const total = Math.round(weightedAsal + weightedLegal + weightedPrep + weightedDigital + weightedCommitment + weightedGrowth);

    return {
      asal: { score: asalScore, weight: 15, weighted: weightedAsal },
      legal: { score: legalScore, weight: 15, weighted: weightedLegal },
      prep: { score: prepScore, weight: 20, weighted: weightedPrep },
      digital: { score: digitalScore, weight: 15, weighted: weightedDigital },
      commitment: { score: commitmentScore, weight: 20, weighted: weightedCommitment },
      growth: { score: growthScore, weight: 15, weighted: weightedGrowth },
      total
    };
  };

  // 3. Automated System Validation & Eligibility Checks
  const getEligibilityInfo = (p: Participant) => {
    const alerts: string[] = [];
    let isEligible = 'Eligible' as 'Eligible' | 'Perlu Klarifikasi' | 'Tidak Eligible';

    // A. NIK Duplicate check
    const duplicateNIK = localParticipants.some(x => x.id !== p.id && x.passport?.ownerIdentity?.nik === p.passport?.ownerIdentity?.nik);
    if (duplicateNIK) {
      alerts.push('PERINGATAN SISTEM: NIK ini duplikat dengan pendaftar lain!');
      isEligible = 'Tidak Eligible';
    }

    // B. Missing NIB check
    const hasNib = p.passport?.certifications?.some(c => c.name === 'NIB' && c.number !== '-' && c.number !== '');
    if (!hasNib) {
      alerts.push('DOKUMEN TIDAK LENGKAP: Belum melampirkan Nomor Induk Berusaha (NIB) aktif.');
      isEligible = 'Tidak Eligible';
    }

    // C. Under 6-months other BUMN program check
    if (p.tjslClaim?.mengikutiProgramPembinaanLain6BulanTerakhir === true) {
      alerts.push('RIWAYAT BUMN LAIN: Sedang aktif mengikuti pembinaan instansi BUMN/Kementerian lain.');
      isEligible = 'Perlu Klarifikasi';
    }

    // D. Inconsistent financials check
    const rev = p.passport?.financials?.revenueBaseline || 0;
    const emp = p.passport?.financials?.employeesBaseline || 0;
    if (rev > 50000000 && emp <= 2) {
      alerts.push('INKONSISTENSI DATA: Rasio omzet bulanan tinggi dengan jumlah pekerja minim perlu divalidasi.');
      if (isEligible !== 'Tidak Eligible') {
        isEligible = 'Perlu Klarifikasi';
      }
    }

    return {
      status: isEligible,
      alerts,
      isTjslMatch: p.tjslVerificationStatus === 'Terverifikasi'
    };
  };

  // 4. Sort and Filter Logic for Table 1
  const filteredParticipants = useMemo(() => {
    return localParticipants.filter(p => {
      const eligibilityInfo = getEligibilityInfo(p);
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion = !filterRegion || p.region === filterRegion;
      const matchesSector = !filterSector || p.sector === filterSector;
      const matchesSource = !filterSource || p.tjslStatus === filterSource;
      const matchesEligibility = !filterEligibility || eligibilityInfo.status === filterEligibility;
      
      const pCompleteness = p.passport?.completeness || 100;
      const matchesCompleteness = 
        !filterCompleteness || 
        (filterCompleteness === 'Lengkap' && pCompleteness >= 90) ||
        (filterCompleteness === 'Belum Lengkap' && pCompleteness < 90);

      const matchesStatus = !filterStatus || p.status === filterStatus;

      return matchesSearch && matchesRegion && matchesSector && matchesSource && matchesEligibility && matchesCompleteness && matchesStatus;
    }).sort((a, b) => {
      let valA: any = a[sortBy];
      let valB: any = b[sortBy];

      // fallback to computed scores
      if (sortBy === 'overallScore') {
        valA = getScorecardBreakdown(a).total;
        valB = getScorecardBreakdown(b).total;
      }

      if (valA < valB) return sortOrder === 'desc' ? 1 : -1;
      if (valA > valB) return sortOrder === 'desc' ? -1 : 1;
      return 0;
    });
  }, [localParticipants, searchQuery, filterRegion, filterSector, filterSource, filterEligibility, filterCompleteness, filterStatus, sortBy, sortOrder]);

  // 5. Ranking & Recommended Shortlist Generator (Section 12 & 13)
  const rankedParticipants = useMemo(() => {
    // Ranking rule:
    // Include only submitted, data complete, eligible, verified, score available
    return localParticipants
      .filter(p => p.status === 'Submitted' || p.status === 'Onboarding Regional' || p.stage === 'Pembinaan Regional')
      .map(p => {
        const scorecard = getScorecardBreakdown(p);
        const eligibility = getEligibilityInfo(p);
        return {
          ...p,
          scorecard,
          eligibility
        };
      })
      .sort((a, b) => {
        // Primary sort: Score desc
        if (b.scorecard.total !== a.scorecard.total) {
          return b.scorecard.total - a.scorecard.total;
        }
        // Tie breaker 1: Commitment score desc
        if (b.scorecard.commitment.score !== a.scorecard.commitment.score) {
          return b.scorecard.commitment.score - a.scorecard.commitment.score;
        }
        // Tie breaker 2: Business Prep score desc
        if (b.scorecard.prep.score !== a.scorecard.prep.score) {
          return b.scorecard.prep.score - a.scorecard.prep.score;
        }
        // Tie breaker 3: Data Confidence desc
        const confA = a.passport?.dataConfidenceLevel || 0;
        const confB = b.passport?.dataConfidenceLevel || 0;
        if (confB !== confA) {
          return confB - confA;
        }
        // Tie breaker 4: Alphabetic
        return a.name.localeCompare(b.name);
      });
  }, [localParticipants]);

  // Determine automatic recommended status based on rank index
  const getRecommendationByRank = (rankIndex: number, p: Participant) => {
    const eligibility = getEligibilityInfo(p);
    if (eligibility.status === 'Tidak Eligible') {
      return 'Recommended Tidak Lolos';
    }
    if (eligibility.status === 'Perlu Klarifikasi') {
      return 'Perlu Klarifikasi';
    }
    // Cutoff based on quotas (scaled down to our mock size)
    // Scale: top 4 (40%) get Lolos, next 2 get Cadangan (reserve), rest Tidak Lolos
    if (rankIndex < 5) {
      return 'Recommended Lolos';
    } else if (rankIndex < 7) {
      return 'Recommended Cadangan';
    } else {
      return 'Recommended Tidak Lolos';
    }
  };

  // Submit Verification (Section 7)
  const handleVerifyParticipant = () => {
    const allCheckedOk = Object.values(verificationChecklist).every(v => v === 'Terverifikasi');
    const hasRejected = Object.values(verificationChecklist).some(v => v === 'Ditolak');
    const hasClarify = Object.values(verificationChecklist).some(v => v === 'Perlu Klarifikasi');

    let nextStatus: string = 'Submitted';
    if (hasRejected) nextStatus = 'Tidak Eligible';
    else if (hasClarify) nextStatus = 'Perlu Klarifikasi';
    else if (allCheckedOk) nextStatus = 'Submitted';

    const updated = localParticipants.map(p => {
      if (p.id === selectedParticipantId) {
        return {
          ...p,
          status: nextStatus,
          tjslVerificationStatus: allCheckedOk ? 'Terverifikasi' : hasClarify ? 'Perlu Klarifikasi' : 'Terverifikasi',
          tjslClaim: {
            ...p.tjslClaim,
            notes: verificationNote,
            consent: true
          }
        };
      }
      return p;
    });

    setLocalParticipants(updated);
    onUpdateParticipants(updated);
    alert(`Verifikasi berkas peserta ${currentSelectedParticipant?.name} berhasil diperbarui! Status: ${nextStatus}`);
  };

  // Submit Admin Review / Override Selection (Section 15)
  const handleOverrideDecision = () => {
    if (!overrideReason.trim()) {
      alert('Alasan override keputusan wajib diisi untuk menjaga akuntabilitas audit trail!');
      return;
    }

    const updated = localParticipants.map(p => {
      if (p.id === selectedParticipantId) {
        return {
          ...p,
          status: overrideTargetStatus === 'Lolos Pembinaan Regional' ? 'Onboarding Regional' : overrideTargetStatus,
          stage: overrideTargetStatus === 'Lolos Pembinaan Regional' ? 'Pembinaan Regional' : 'Pendaftaran'
        };
      }
      return p;
    });

    // Record in Audit Trail
    const newLog = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      participantId: currentSelectedParticipant.id,
      participantName: currentSelectedParticipant.name,
      prevStatus: currentSelectedParticipant.status,
      newStatus: overrideTargetStatus,
      reason: overrideReason,
      operator: 'Admin SMEPP / PTC (Mochamad S.)'
    };

    setAuditLogs([newLog, ...auditLogs]);
    setLocalParticipants(updated);
    onUpdateParticipants(updated);
    setOverrideReason('');
    alert(`Keputusan berhasil di-override! ${currentSelectedParticipant.name} sekarang berstatus: ${overrideTargetStatus}`);
  };

  // Promoting reserve candidate when somebody declines (Section 17)
  const handlePromoteReserve = (declineId: string, reserveId: string) => {
    const updated = localParticipants.map(p => {
      if (p.id === declineId) {
        return { ...p, status: 'Mengundurkan Diri' };
      }
      if (p.id === reserveId) {
        return { 
          ...p, 
          status: 'Onboarding Regional', 
          stage: 'Pembinaan Regional',
          tjslClaim: {
            ...p.tjslClaim,
            notes: 'Dipromosikan otomatis menggantikan ' + localParticipants.find(x => x.id === declineId)?.name
          }
        };
      }
      return p;
    });

    // Audit log
    const newLog = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      participantId: reserveId,
      participantName: localParticipants.find(x => x.id === reserveId)?.name || '',
      prevStatus: 'Cadangan',
      newStatus: 'Onboarding Regional',
      reason: `Promosi otomatis dari daftar cadangan menggantikan ${localParticipants.find(x => x.id === declineId)?.name} yang mengundurkan diri`,
      operator: 'Sistem Otomatis Regional Selection'
    };

    setAuditLogs([newLog, ...auditLogs]);
    setLocalParticipants(updated);
    onUpdateParticipants(updated);
    alert('Peserta cadangan berhasil dipromosikan sebagai Lolos Regional!');
  };

  // Export functions (Simulated)
  const handleExportData = (format: 'PDF' | 'Excel') => {
    alert(`Pengeksporan shortlist regional Jateng dalam format ${format} berhasil diunduh!`);
  };

  // Find ties for ranking page
  const scoreCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    rankedParticipants.forEach(p => {
      counts[p.scorecard.total] = (counts[p.scorecard.total] || 0) + 1;
    });
    return counts;
  }, [rankedParticipants]);

  return (
    <div id="kurasi-peserta-regional-panel" className="space-y-6 pb-20 font-sans text-[#16365C]">
      
      {/* A. HEADER & GENERAL METRICS OVERVIEW */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase bg-[#0072BC]/10 text-[#0072BC] px-3 py-1 rounded-full">
            Kementerian BUMN • Pertamina UMK Academy 2026
          </span>
          <h2 className="text-2xl font-extrabold text-[#16365C] mt-2 tracking-tight">
            Sistem Kurasi & Seleksi Regional Peserta 2026
          </h2>
          <p className="text-gray-500 text-xs mt-1">
            Validasi, scoring otomatis, seleksi kriteria, ranking regional Jawa Tengah, dan penerbitan rekomendasi kelulusan.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleExportData('Excel')}
            className="px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <FileSpreadsheet className="h-4 w-4 text-green-600" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => handleExportData('PDF')}
            className="px-3 py-2 bg-[#ED1B2F] hover:bg-[#ED1B2F]/90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-100 transition"
          >
            <FileText className="h-4 w-4" />
            <span>Cetak SK Kelulusan (PDF)</span>
          </button>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Total Pendaftar</span>
          <span className="text-2xl font-black text-[#16365C] mt-2">{kpis.total.toLocaleString('id-ID')}</span>
          <span className="text-[10px] text-gray-500 mt-1">Animo nasional terintegrasi</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between border-l-4 border-l-[#0072BC]">
          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Submitted / Lengkap</span>
          <span className="text-2xl font-black text-[#0072BC] mt-2">{kpis.submitted.toLocaleString('id-ID')}</span>
          <span className="text-[10px] text-green-600 mt-1">✓ Berhasil Masuk Gate</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between border-l-4 border-l-[#A8C61F]">
          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Lolos Regional</span>
          <span className="text-2xl font-black text-[#A8C61F] mt-2">{kpis.lolos.toLocaleString('id-ID')}</span>
          <span className="text-[10px] text-gray-500 mt-1">Kuota: Max {REGIONAL_QUOTA}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between border-l-4 border-l-orange-400">
          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Cadangan (10%)</span>
          <span className="text-2xl font-black text-orange-500 mt-2">{kpis.cadangan.toLocaleString('id-ID')}</span>
          <span className="text-[10px] text-gray-500 mt-1">Kesiapan pengganti</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between border-l-4 border-l-red-500">
          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Perlu Klarifikasi</span>
          <span className="text-2xl font-black text-red-500 mt-2">{kpis.clarification}</span>
          <span className="text-[10px] text-red-500 font-bold mt-1">Aksi segera diperlukan</span>
        </div>
      </div>

      {/* DISTRIBUTION WARNING (Section 14) */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
        <div className="text-xs text-yellow-800 leading-relaxed">
          <span className="font-extrabold block">Pemberitahuan Keseimbangan Distribusi (SROI Balance):</span>
          Pendaftar eksternal saat ini mendominasi shortlist (55%). Proporsi TJSL Pertamina Grup berada di angka 25% (target ideal 30%). Keseimbangan sektor kuliner (F&B) mendominasi (62%).
          <strong className="block mt-1">“Peringatan distribusi tidak otomatis mengubah ranking. Penyesuaian hanya dapat dilakukan melalui review SMEPP/PTC.”</strong>
        </div>
      </div>

      {/* SUB-TABS NAVIGATION */}
      <div className="border-b border-gray-200">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('semua')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'semua' ? 'border-[#0072BC] text-[#0072BC]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            1. Semua Pendaftar ({filteredParticipants.length})
          </button>
          <button
            onClick={() => setActiveTab('verifikasi')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'verifikasi' ? 'border-[#0072BC] text-[#0072BC]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            2. Perlu Verifikasi & Dokumen 
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <button
            onClick={() => setActiveTab('ranking')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'ranking' ? 'border-[#0072BC] text-[#0072BC]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            3. Ranking & Shortlist Otomatis ({rankedParticipants.length})
          </button>
          <button
            onClick={() => setActiveTab('approval')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'approval' ? 'border-[#0072BC] text-[#0072BC]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            4. Review & Approval Final 
            <span className="px-1.5 py-0.2 text-[9px] bg-[#ED1B2F] text-white rounded font-extrabold">Audit</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENTS */}
      {activeTab === 'semua' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Filters Bar */}
          <div className="p-4 bg-gray-50 border-b border-gray-100 flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute inset-y-0 left-3 h-4 w-4 text-gray-400 my-auto" />
              <input
                type="text"
                placeholder="Cari ID, nama pendaftar, atau nama brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs w-full focus:outline-none focus:ring-2 focus:ring-[#0072BC]"
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded-xl text-xs"
              >
                <option value="">Semua Wilayah</option>
                <option value="Jawa Tengah">Jawa Tengah</option>
                <option value="Jawa Barat">Jawa Barat</option>
                <option value="Jawa Timur">Jawa Timur</option>
                <option value="Sumatera Utara">Sumatera Utara</option>
                <option value="Kalimantan Timur">Kalimantan Timur</option>
                <option value="Nusa Tenggara Timur">Nusa Tenggara Timur</option>
              </select>

              <select
                value={filterSector}
                onChange={(e) => setFilterSector(e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded-xl text-xs"
              >
                <option value="">Semua Sektor</option>
                <option value="Food & Beverage">F&B</option>
                <option value="Agribisnis">Agribisnis</option>
                <option value="Fesyen & Wastra">Fesyen & Wastra</option>
                <option value="Craft & Jewellery">Craft & Jewellery</option>
              </select>

              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded-xl text-xs"
              >
                <option value="">Semua Sumber</option>
                <option value="Binaan Terverifikasi">Binaan TJSL</option>
                <option value="Peserta Eksternal">Umum / Eksternal</option>
              </select>

              <select
                value={filterEligibility}
                onChange={(e) => setFilterEligibility(e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded-xl text-xs"
              >
                <option value="">Semua Kelayakan</option>
                <option value="Eligible">Eligible</option>
                <option value="Perlu Klarifikasi">Perlu Klarifikasi</option>
                <option value="Tidak Eligible">Tidak Eligible</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-2 bg-white border border-gray-200 rounded-xl text-xs"
              >
                <option value="">Semua Status</option>
                <option value="Submitted">Submitted</option>
                <option value="Data Belum Lengkap">Belum Lengkap</option>
                <option value="Perlu Klarifikasi">Klarifikasi</option>
                <option value="Potensi Data Ganda">Data Ganda</option>
                <option value="Onboarding Regional">Lolos</option>
                <option value="Cadangan">Cadangan</option>
                <option value="Mengundurkan Diri">Mundur</option>
              </select>

              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterRegion('');
                  setFilterSector('');
                  setFilterSource('');
                  setFilterEligibility('');
                  setFilterStatus('');
                }}
                className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl text-xs flex justify-center items-center"
                title="Reset Filters"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-extrabold">
                  <th className="p-4 w-12">No</th>
                  <th className="p-4">ID Pendaftar</th>
                  <th className="p-4">Nama Peserta / Brand</th>
                  <th className="p-4">Region / Sektor</th>
                  <th className="p-4">Sumber Peserta</th>
                  <th className="p-4">Kelayakan (Gate)</th>
                  <th className="p-4">Kelengkapan</th>
                  <th className="p-4 text-center">Data Conf.</th>
                  <th className="p-4 text-center">Score</th>
                  <th className="p-4">Status Akhir</th>
                  <th className="p-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-gray-100">
                {filteredParticipants.map((p, idx) => {
                  const eligibility = getEligibilityInfo(p);
                  const scoreBreakdown = getScorecardBreakdown(p);
                  const completeness = p.passport?.completeness || 100;

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition">
                      <td className="p-4 text-gray-400 font-semibold">{idx + 1}</td>
                      <td className="p-4 font-mono font-bold text-gray-600">{p.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-[#16365C]">{p.name}</div>
                        <div className="text-gray-400 text-[10px] mt-0.5">{p.businessName}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold">{p.region}</div>
                        <div className="text-gray-400 text-[10px] mt-0.5">{p.sector}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          p.tjslStatus === 'Binaan Terverifikasi' ? 'bg-[#0072BC]/10 text-[#0072BC]' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {p.tjslStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          eligibility.status === 'Eligible' ? 'bg-green-100 text-green-800' :
                          eligibility.status === 'Perlu Klarifikasi' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {eligibility.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="w-20 bg-gray-100 h-1.5 rounded-full overflow-hidden mb-1">
                          <div className={`h-full ${completeness >= 90 ? 'bg-green-500' : 'bg-orange-400'}`} style={{ width: `${completeness}%` }}></div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold">{completeness}% Data</span>
                      </td>
                      <td className="p-4 text-center font-mono font-extrabold text-blue-600">{p.passport?.dataConfidenceLevel || 90}%</td>
                      <td className="p-4 text-center">
                        <span className="font-mono font-bold text-sm bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                          {scoreBreakdown.total}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          p.status === 'Onboarding Regional' || p.status === 'Submitted' ? 'bg-[#0072BC] text-white' :
                          p.status === 'Cadangan' ? 'bg-amber-500 text-white' :
                          p.status === 'Tidak Eligible' || p.status === 'Tidak Lolos' ? 'bg-red-500 text-white' :
                          p.status === 'Potensi Data Ganda' ? 'bg-purple-600 text-white animate-pulse' :
                          p.status === 'Perlu Klarifikasi' ? 'bg-orange-400 text-white' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {p.status === 'Submitted' && p.stage === 'Pembinaan Regional' ? 'Lolos Regional' : p.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => {
                            setActiveTab('verifikasi');
                            selectParticipantForVerification(p.id);
                          }}
                          className="p-1 text-[#0072BC] hover:bg-blue-50 rounded"
                          title="Periksa & Verifikasi Berkas"
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'verifikasi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Participant selection rail */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3 max-h-[600px] overflow-y-auto">
            <h3 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider mb-2">Antrean Verifikasi Berkas</h3>
            {localParticipants.map(p => {
              const isSelected = p.id === selectedParticipantId;
              const eligibility = getEligibilityInfo(p);
              return (
                <button
                  key={p.id}
                  onClick={() => selectParticipantForVerification(p.id)}
                  className={`w-full text-left p-3 rounded-xl border transition flex justify-between items-center ${
                    isSelected ? 'bg-blue-50/50 border-[#0072BC]' : 'border-gray-100 hover:bg-gray-50/30'
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-gray-400 block font-mono font-bold">{p.id}</span>
                    <strong className="text-xs text-[#16365C] block truncate max-w-[150px]">{p.name}</strong>
                    <span className="text-[10px] text-gray-400 truncate max-w-[150px] block">{p.businessName}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold block ${
                      eligibility.status === 'Eligible' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {p.status}
                    </span>
                    <span className="text-[9px] text-gray-400 block mt-1">Score: {getScorecardBreakdown(p).total}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Verification form panel (Section 7) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div className="border-b pb-4 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">Verifikasi Form & Dokumen Pendukung</span>
                <h3 className="text-base font-extrabold text-[#16365C] mt-1">{currentSelectedParticipant?.name}</h3>
                <p className="text-xs text-gray-500">{currentSelectedParticipant?.businessName} • {currentSelectedParticipant?.region}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500">Tingkat Kelengkapan Data</span>
                <span className="block text-lg font-black text-green-600">{currentSelectedParticipant?.passport?.completeness}%</span>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="space-y-4">
              <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider">Lembar Checklist Pemeriksaan Berkas:</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold">1. Nomor Induk Berusaha (NIB) *</span>
                    <span className="text-[10px] text-gray-500">NIB: {currentSelectedParticipant?.passport?.certifications?.[0]?.number || '-'}</span>
                  </div>
                  <select
                    value={verificationChecklist.nib}
                    onChange={(e: any) => setVerificationChecklist({ ...verificationChecklist, nib: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="Belum Diperiksa">Belum Diperiksa</option>
                    <option value="Terverifikasi">Terverifikasi</option>
                    <option value="Ditolak">Ditolak (NIB Tidak Aktif)</option>
                    <option value="Perlu Klarifikasi">Perlu Klarifikasi</option>
                  </select>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold">2. Keabsahan Pemilik (KTP/NIK) *</span>
                    <span className="text-[10px] text-gray-500">NIK: {currentSelectedParticipant?.passport?.ownerIdentity?.nik || '-'}</span>
                  </div>
                  <select
                    value={verificationChecklist.ownership}
                    onChange={(e: any) => setVerificationChecklist({ ...verificationChecklist, ownership: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="Belum Diperiksa">Belum Diperiksa</option>
                    <option value="Terverifikasi">Terverifikasi</option>
                    <option value="Ditolak">Ditolak (NIK Tidak Valid)</option>
                    <option value="Perlu Klarifikasi">Perlu Klarifikasi</option>
                  </select>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold">3. Usia Berdiri Usaha *</span>
                    <span className="text-[10px] text-gray-500">Tahun Berdiri: {currentSelectedParticipant?.passport?.establishedYear || '-'}</span>
                  </div>
                  <select
                    value={verificationChecklist.businessAge}
                    onChange={(e: any) => setVerificationChecklist({ ...verificationChecklist, businessAge: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="Belum Diperiksa">Belum Diperiksa</option>
                    <option value="Terverifikasi">Terverifikasi</option>
                    <option value="Ditolak">Ditolak (Di bawah syarat 6 bulan)</option>
                    <option value="Perlu Klarifikasi">Perlu Klarifikasi</option>
                  </select>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold">4. Validitas Angka Omzet *</span>
                    <span className="text-[10px] text-gray-500">Omzet: Rp {currentSelectedParticipant?.passport?.financials?.revenueBaseline?.toLocaleString('id-ID') || '0'}</span>
                  </div>
                  <select
                    value={verificationChecklist.revenue}
                    onChange={(e: any) => setVerificationChecklist({ ...verificationChecklist, revenue: e.target.value })}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="Belum Diperiksa">Belum Diperiksa</option>
                    <option value="Terverifikasi">Terverifikasi</option>
                    <option value="Ditolak">Ditolak (Fiktif)</option>
                    <option value="Perlu Klarifikasi">Perlu Klarifikasi (Terlalu Tinggi/Ragu)</option>
                  </select>
                </div>
              </div>

              {/* System Duplication or Conflict Warnings */}
              {getEligibilityInfo(currentSelectedParticipant).alerts.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    Peringatan Deteksi Sistem:
                  </span>
                  {getEligibilityInfo(currentSelectedParticipant).alerts.map((alert, index) => (
                    <p key={index}>• {alert}</p>
                  ))}
                </div>
              )}

              {/* PDF Document Preview mock */}
              <div className="p-4 bg-blue-50/20 border border-blue-100 rounded-xl">
                <span className="text-xs font-bold block mb-2 text-[#0072BC]">Dokumen Pendukung Yang Diunggah:</span>
                <div className="flex flex-wrap gap-2">
                  {currentSelectedParticipant?.passport?.certifications?.map((c, i) => (
                    c.evidenceUrl && (
                      <a
                        key={i}
                        href="#"
                        onClick={(e) => { e.preventDefault(); alert(`Membuka berkas dokumen: ${c.evidenceUrl}`); }}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 text-gray-700 flex items-center gap-1.5"
                      >
                        <FileText className="h-3.5 w-3.5 text-red-500" />
                        <span>{c.name} ({c.evidenceUrl})</span>
                      </a>
                    )
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Catatan Verifikator SMEPP / PTC:</label>
                <textarea
                  value={verificationNote}
                  onChange={(e) => setVerificationNote(e.target.value)}
                  placeholder="Masukkan instruksi revisi data, hasil wawancara, atau catatan pendukung lainnya..."
                  rows={3}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0072BC]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    // Quick mark clarify
                    setVerificationChecklist({
                      nib: 'Perlu Klarifikasi',
                      ownership: 'Terverifikasi',
                      businessAge: 'Terverifikasi',
                      revenue: 'Perlu Klarifikasi',
                      employees: 'Terverifikasi',
                      salesChannels: 'Terverifikasi',
                      legalDocuments: 'Belum Diperiksa',
                      commitment: 'Terverifikasi'
                    });
                    setVerificationNote('Ditemukan tumpang tindih program atau data keuangan memerlukan rincian buku kas.');
                  }}
                  className="px-3 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-xl text-xs font-bold transition"
                >
                  Minta Klarifikasi Berkas
                </button>
                <button
                  onClick={handleVerifyParticipant}
                  className="px-4 py-2 bg-[#0072BC] hover:bg-[#0072BC]/90 text-white rounded-xl text-xs font-bold transition"
                >
                  Simpan Status Verifikasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ranking' && (
        <div className="space-y-6">
          {/* Automatic scorecard rules explanation (Section 8) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-extrabold text-sm text-[#16365C] border-b pb-3 flex items-center gap-2">
              <Award className="h-5 w-5 text-[#A8C61F]" />
              <span>Sistem Pembobotan Kartu Penilaian Otomatis (Scorecard Weights)</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-4 text-center">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Asal Ekosistem</span>
                <span className="text-sm font-black text-[#0072BC] block mt-1">Bobot: 15%</span>
                <span className="text-[9px] text-gray-500 block mt-1">Prioritas Binaan TJSL</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Legalitas</span>
                <span className="text-sm font-black text-[#0072BC] block mt-1">Bobot: 15%</span>
                <span className="text-[9px] text-gray-500 block mt-1">NIB & P-IRT</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Kesiapan Usaha</span>
                <span className="text-sm font-black text-[#0072BC] block mt-1">Bobot: 20%</span>
                <span className="text-[9px] text-gray-500 block mt-1">Lama Usaha & Omzet</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Digital & Brand</span>
                <span className="text-sm font-black text-[#0072BC] block mt-1">Bobot: 15%</span>
                <span className="text-[9px] text-gray-500 block mt-1">Marketplace & POS</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Komitmen & Data</span>
                <span className="text-sm font-black text-[#0072BC] block mt-1">Bobot: 20%</span>
                <span className="text-[9px] text-gray-500 block mt-1">Kebenaran & Pengisian</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Growth Mindset</span>
                <span className="text-sm font-black text-[#0072BC] block mt-1">Bobot: 15%</span>
                <span className="text-[9px] text-gray-500 block mt-1">Sustainability & SROI</span>
              </div>
            </div>
          </div>

          {/* Ranking list (Section 12 & 13) */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h4 className="font-extrabold text-sm">Peringkat Kelulusan & Recommended Shortlist</h4>
                <p className="text-[11px] text-gray-400">Peringkat dinilai otomatis berdasarkan total nilai pembobotan & tiebreaker.</p>
              </div>
              <div className="text-xs text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-xl font-bold">
                Tiebreaker priority: 1. Total Score | 2. Komitmen | 3. Kesiapan | 4. Confidence Level
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                    <th className="p-4 w-12">Peringkat</th>
                    <th className="p-4">Brand / Pendaftar</th>
                    <th className="p-4">Ekosistem (15%)</th>
                    <th className="p-4">Legalitas (15%)</th>
                    <th className="p-4">Kesiapan (20%)</th>
                    <th className="p-4">Digital (15%)</th>
                    <th className="p-4">Komitmen (20%)</th>
                    <th className="p-4">Mindset (15%)</th>
                    <th className="p-4 text-center">Total Score</th>
                    <th className="p-4">Rekomendasi Seleksi</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-gray-100">
                  {rankedParticipants.map((p, index) => {
                    const score = p.scorecard;
                    const rec = getRecommendationByRank(index, p);
                    
                    // Tie Indicator (Section 12)
                    const isTie = scoreCounts[score.total] > 1;

                    return (
                      <tr key={p.id} className="hover:bg-gray-50/40">
                        <td className="p-4 font-black text-[#0072BC] flex items-center gap-1">
                          <span>#{index + 1}</span>
                          {isTie && (
                            <span className="text-[8px] bg-amber-100 text-amber-800 px-1 rounded" title="Tie detected! Resolved via tiebreaker rules.">TIE</span>
                          )}
                        </td>
                        <td className="p-4">
                          <strong className="text-[#16365C] block">{p.businessName}</strong>
                          <span className="text-gray-400 text-[10px]">{p.name} ({p.region})</span>
                        </td>
                        <td className="p-4 font-mono">{score.asal.score} <span className="text-gray-400 text-[10px]">({score.asal.weighted})</span></td>
                        <td className="p-4 font-mono">{score.legal.score} <span className="text-gray-400 text-[10px]">({score.legal.weighted})</span></td>
                        <td className="p-4 font-mono">{score.prep.score} <span className="text-gray-400 text-[10px]">({score.prep.weighted})</span></td>
                        <td className="p-4 font-mono">{score.digital.score} <span className="text-gray-400 text-[10px]">({score.digital.weighted})</span></td>
                        <td className="p-4 font-mono">{score.commitment.score} <span className="text-gray-400 text-[10px]">({score.commitment.weighted})</span></td>
                        <td className="p-4 font-mono">{score.growth.score} <span className="text-gray-400 text-[10px]">({score.growth.weighted})</span></td>
                        <td className="p-4 text-center">
                          <span className="font-mono font-black text-sm text-[#0072BC] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {score.total}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            rec === 'Recommended Lolos' ? 'bg-green-100 text-green-800' :
                            rec === 'Recommended Cadangan' ? 'bg-amber-100 text-amber-800' :
                            rec === 'Perlu Klarifikasi' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {rec}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'approval' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Direct selection list with decision switcher */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <h3 className="font-extrabold text-sm border-b pb-3">Daftar Review & Keputusan Override Admin SMEPP / PTC</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Peserta Terpilih Untuk Keputusan:</span>
                    <strong className="text-sm text-[#16365C]">{currentSelectedParticipant?.name}</strong>
                    <span className="text-xs text-gray-500 block">{currentSelectedParticipant?.businessName} • {currentSelectedParticipant?.region}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block">Rekomendasi Awal:</span>
                    <span className="text-xs font-bold text-gray-700">
                      {getRecommendationByRank(rankedParticipants.findIndex(x => x.id === currentSelectedParticipant.id), currentSelectedParticipant)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Tetapkan Keputusan Akhir *</label>
                    <select
                      value={overrideTargetStatus}
                      onChange={(e: any) => setOverrideTargetStatus(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#0072BC]"
                    >
                      <option value="Lolos Pembinaan Regional">Lolos Pembinaan Regional</option>
                      <option value="Cadangan">Pindahkan Ke Daftar Cadangan</option>
                      <option value="Perlu Klarifikasi">Klarifikasi Terbuka</option>
                      <option value="Tidak Lolos">Tetapkan Tidak Lolos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Alasan Override / Intervensi (MANDATORY) *</label>
                    <input
                      type="text"
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      placeholder="Contoh: Pemerataan kuota wilayah / Binaan unggulan subholding"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#0072BC]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleOverrideDecision}
                    className="px-4 py-2.5 bg-[#ED1B2F] hover:bg-[#ED1B2F]/90 text-white font-bold rounded-xl text-xs shadow-md shadow-red-100 transition"
                  >
                    Terapkan & Catat Audit Trail
                  </button>
                </div>
              </div>

              {/* Audit trail display (Section 15) */}
              <div className="border-t pt-6 space-y-4">
                <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider">Audit Trail & Log Intervensi Kebijakan</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {auditLogs.map((log, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-gray-500">
                        <span>{log.participantName} ({log.participantId})</span>
                        <span>{log.timestamp}</span>
                      </div>
                      <p className="text-gray-700">
                        Mengubah status dari <strong className="text-orange-600">"{log.prevStatus}"</strong> menjadi <strong className="text-green-600">"{log.newStatus}"</strong>.
                      </p>
                      <p className="text-[11px] text-gray-500 italic bg-white p-1.5 rounded border border-gray-100 mt-1">
                        Alasan: "{log.reason}" — Oleh: {log.operator}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Regional Onboarding Promotion and confirmation (Section 17) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="font-extrabold text-sm border-b pb-3 flex items-center gap-1.5">
                <Settings className="h-5 w-5 text-[#A8C61F]" />
                <span>Regional Onboarding Control</span>
              </h3>
              
              <div className="space-y-3">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Peserta yang disetujui Lolos Regional wajib melakukan konfirmasi dalam 2x24 jam. Jika mengundurkan diri, posisinya dapat digantikan oleh cadangan tertinggi di region yang sama.
                </p>

                {/* Indah Permata declines scenario */}
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-xs space-y-3">
                  <span className="font-bold text-orange-800 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    Kasus: Peserta Mengundurkan Diri
                  </span>
                  <div>
                    <strong className="block text-gray-700">Indah Permata (P109)</strong>
                    <span className="text-gray-400 block text-[10px]">Sambal Andaliman • Sumatera Utara</span>
                    <span className="text-[10px] text-red-500 font-bold block mt-1">Status Onboarding: Mengundurkan Diri</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-orange-100 space-y-1.5">
                    <span className="text-[10px] text-gray-500 block">Rekomendasi Cadangan Teratas (Region Terdekat):</span>
                    <strong className="block text-[#16365C]">Joko Susilo (P110)</strong>
                    <span className="text-[10px] text-gray-500 block">Score: 71 • Jawa Tengah • Kompos Sapi Super</span>
                  </div>

                  {localParticipants.find(p => p.id === 'P110')?.status === 'Cadangan' ? (
                    <button
                      onClick={() => handlePromoteReserve('P109', 'P110')}
                      className="w-full bg-[#0072BC] hover:bg-[#0072BC]/90 text-white font-bold py-2 rounded-lg text-[10px] text-center block transition shadow-sm"
                    >
                      Promosikan Joko Susilo ke Lolos Regional
                    </button>
                  ) : (
                    <span className="text-[10px] text-green-600 font-bold block bg-green-50 p-1 rounded border border-green-100 text-center">
                      ✓ Joko Susilo berhasil dipromosikan!
                    </span>
                  )}
                </div>

                <button
                  onClick={() => alert('Semua pengumuman regional resmi dipublish ke LMS & email masing-masing peserta!')}
                  className="w-full py-3 bg-[#A8C61F] hover:bg-[#A8C61F]/90 text-white font-extrabold rounded-xl text-xs shadow-md shadow-green-100 text-center block transition"
                >
                  Publish Pengumuman Hasil Seleksi
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
