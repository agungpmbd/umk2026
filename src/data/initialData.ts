import { Participant, LearningModule, Challenge, AgendaEvent, ForumPost } from '../types';

export const INITIAL_PARTICIPANTS: Participant[] = [
  {
    id: 'P001',
    name: 'Siti Rahmawati',
    businessName: 'Rasa Nusantara',
    sector: 'Food & Beverage',
    region: 'Jawa Tengah',
    stage: 'Pembinaan Regional',
    status: 'Aktif',
    riskStatus: 'Aman',
    lastLogin: '2026-06-25 15:42',
    challengePoints: 1250,
    learningProgress: 68,
    attendanceRate: 90,
    overallScore: 82,
    passport: {
      ownerName: 'Siti Rahmawati',
      ownerIdentity: {
        nik: '33************01',
        email: 'siti.rahma@rasanusantara.com',
        phone: '0812-3456-7890',
        address: 'Jl. Pemuda No. 45, Semarang, Jawa Tengah',
        gender: 'Perempuan'
      },
      businessName: 'Rasa Nusantara',
      sector: 'Food & Beverage',
      subsector: 'Olahan Sambal & Bumbu Tradisional',
      region: 'Jawa Tengah',
      establishedYear: 2021,
      description: 'Memproduksi sambal kemasan dan bumbu instan khas Nusantara dengan resep warisan keluarga tanpa bahan pengawet buatan, menggunakan kemasan kaca ramah lingkungan.',
      mainProducts: ['Sambal Bawang Pedas', 'Sambal Ijo Teri', 'Bumbu Rendang Siap Saji', 'Bumbu Soto Lamongan'],
      financials: {
        revenueBaseline: 15000000,
        revenueCurrent: 18500000,
        profitBaseline: 4500000,
        profitCurrent: 5800000,
        employeesBaseline: 3,
        employeesCurrent: 4,
        digitalChannelsBaseline: 2,
        digitalChannelsCurrent: 4,
        loanSource: 'Pegadaian ULaMM',
        loanAmount: 10000000,
        hasBankAccount: true,
        useQRIS: true,
        usePOS: true
      },
      certifications: [
        { name: 'NIB (Nomor Induk Berusaha)', status: 'Terverifikasi', expiryDate: 'Seumur Hidup', number: '9120010293021', evidenceUrl: 'nib_siti.pdf' },
        { name: 'Sertifikasi Halal', status: 'Proses', expiryDate: '-', number: '-', evidenceUrl: 'halal_draft.pdf' },
        { name: 'P-IRT (Pangan Industri Rumah Tangga)', status: 'Terverifikasi', expiryDate: '2028-10-12', number: 'P-IRT 2063374010234-26', evidenceUrl: 'pirt_siti.pdf' },
        { name: 'Izin BPOM MD', status: 'Belum Lengkap', expiryDate: '-', number: '-', evidenceUrl: '' }
      ],
      sustainability: {
        wasteManagement: 'Ampas cabai dan bawang difermentasi menjadi pupuk organik cair yang dibagikan gratis ke petani lokal supplier cabai.',
        ecoMaterials: 'Kemasan stoples kaca reusable dan pembungkus paket kardus daur ulang tanpa bubble wrap plastik.',
        energySaving: 'Menggunakan kompor gas bertekanan hemat energi (bintang 4 hemat energi).'
      },
      marketArea: 'Pulau Jawa, Bali, dan pengiriman beberapa kali ke Singapura via jastip.',
      suppliers: 'Petani cabai lokal di Bandungan, Kabupaten Semarang.',
      partners: 'Ritel modern lokal Semarang (Oleh-oleh Pandanaran) dan 15 reseller aktif.',
      dataConfidenceLevel: 90,
      completeness: 85
    },
    capabilities: [
      { name: 'Keuangan', score: 65, target: 85, recommendation: 'Rapikan pencatatan arus kas harian menggunakan aplikasi POS digital, batasi pengeluaran pribadi dari kas usaha.' },
      { name: 'Legalitas', score: 80, target: 90, recommendation: 'Selesaikan sertifikasi Halal karena dokumen pendaftaran sudah lengkap, segera ajukan izin edar BPOM MD.' },
      { name: 'Operasional', score: 70, target: 80, recommendation: 'Buat Standard Operating Procedure (SOP) tertulis untuk proses sterilisasi botol kemasan guna menjaga daya tahan produk.' },
      { name: 'Digitalisasi', score: 75, target: 90, recommendation: 'Integrasikan inventori stok produk antara gudang fisik dan dashboard marketplace shopee/tokopedia.' },
      { name: 'Pemasaran', score: 70, target: 85, recommendation: 'Tingkatkan kualitas visual foto katalog produk, optimalkan penggunaan video pendek di TikTok/Instagram Reels.' },
      { name: 'Akses Pasar', score: 60, target: 80, recommendation: 'Ikuti pelatihan kemasan ekspor dan pelajari regulasi bea cukai untuk persiapan SMEXPO 2026.' },
      { name: 'Sustainability', score: 85, target: 90, recommendation: 'Gunakan kemasan ramah lingkungan secara konsisten, buat branding story berfokus pada sustainability.' }
    ],
    actionPlans: [
      { id: 'AP01', area: 'Operasional', activity: 'Penyusunan dokumen SOP Produksi Sambal Bawang', pic: 'Siti Rahmawati', deadline: '2026-07-10', status: 'Dalam Proses' },
      { id: 'AP02', area: 'Keuangan', activity: 'Migrasi laporan keuangan manual ke BukuKas/Kasir Pintar', pic: 'Staf Administrasi', deadline: '2026-07-15', status: 'Belum Mulai' },
      { id: 'AP03', area: 'Legalitas', activity: 'Follow-up audit lapangan untuk Sertifikasi Halal', pic: 'Siti Rahmawati', deadline: '2026-07-05', status: 'Dalam Proses' },
      { id: 'AP04', area: 'Pemasaran', activity: 'Pembuatan 4 video reels Instagram bertema "Behind the Kitchen"', pic: 'Siti Rahmawati', deadline: '2026-07-02', status: 'Selesai' }
    ],
    developmentCard: {
      strengths: ['Resep autentik disukai pasar', 'Memiliki legalitas dasar lengkap (NIB & PIRT)', 'Komitmen pengolahan sampah sisa produksi yang sangat baik'],
      weaknesses: ['Belum memiliki sertifikat Halal resmi', 'SOP sterilisasi kemasan belum konsisten', 'Pencatatan kas pribadi dan bisnis masih sering tercampur'],
      recommendation30Days: 'Selesaikan pendaftaran sertifikasi Halal dan susun SOP produksi dasar.',
      recommendation60Days: 'Terapkan POS digital untuk mencatat semua transaksi penjualan secara real-time.',
      recommendation90Days: 'Rancang katalog produk bahasa Inggris dan ikuti seleksi kurasi SMEXPO 2026.',
      smexpoReadiness: 'Proses Kurasi',
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
      picName: 'Ibu Rini (SMEPP)',
      statusProgram: 'Alumni',
      evidenceFile: 'sertifikat_pfpreneur_siti.pdf',
      notes: 'Lulusan terbaik program kewirausahaan perempuan PFpreneur 2025 regional Jawa Tengah.',
      consent: true,
      dbMatchStatus: 'Match',
      dbMatchDetails: 'Ditemukan di Sistem Database Pusat SMEPP: NIK 3374025112830001 cocok 100%. Nama Usaha "Rasa Nusantara" cocok 100%.'
    },
    tjslLogs: [
      { date: '2026-06-20 09:00', action: 'Submit Pendaftaran', pic: 'Siti Rahmawati', notes: 'Mengisi klaim afiliasi program PFpreneur 2025.' },
      { date: '2026-06-21 14:30', action: 'Verifikasi Database', pic: 'Sistem SMEPP', notes: 'Pencocokan otomatis database pusat berhasil. NIK dan nama usaha terdaftar valid.' },
      { date: '2026-06-22 10:15', action: 'Persetujuan Final', pic: 'Dra. Sri Wahyuni (Fasilitator)', notes: 'Klaim terverifikasi sebagai Binaan Terverifikasi.' }
    ]
  },
  {
    id: 'P002',
    name: 'Budi Santoso',
    businessName: 'Kopi Lestari',
    sector: 'Agribisnis',
    region: 'Jawa Barat',
    stage: 'Pembinaan Regional',
    status: 'Aktif',
    riskStatus: 'Aman',
    lastLogin: '2026-06-24 09:15',
    challengePoints: 950,
    learningProgress: 50,
    attendanceRate: 85,
    overallScore: 74,
    passport: {
      ownerName: 'Budi Santoso',
      ownerIdentity: {
        nik: '32************02',
        email: 'budi.santoso@kopilestari.com',
        phone: '0857-1122-3344',
        address: 'Jl. Raya Ciwidey No. 12, Bandung, Jawa Barat',
        gender: 'Laki-laki'
      },
      businessName: 'Kopi Lestari',
      sector: 'Agribisnis',
      subsector: 'Kopi Specialty & Pasca Panen',
      region: 'Jawa Barat',
      establishedYear: 2020,
      description: 'Menghasilkan biji kopi Arabika Ciwidey kualitas specialty yang diproses secara berkelanjutan, bermitra dengan 25 petani kopi lereng gunung.',
      mainProducts: ['Ciwidey Honey Process Roasted Beans', 'Full Wash Arabica Beans', 'Coffee Drip Bag Instant'],
      financials: {
        revenueBaseline: 28000000,
        revenueCurrent: 32000000,
        profitBaseline: 8000000,
        profitCurrent: 9500000,
        employeesBaseline: 5,
        employeesCurrent: 6,
        digitalChannelsBaseline: 1,
        digitalChannelsCurrent: 2,
        loanSource: 'Bank Mandiri (KUR)',
        loanAmount: 50000000,
        hasBankAccount: true,
        useQRIS: true,
        usePOS: false
      },
      certifications: [
        { name: 'NIB (Nomor Induk Berusaha)', status: 'Terverifikasi', expiryDate: 'Seumur Hidup', number: '9120301923041', evidenceUrl: 'nib_budi.pdf' },
        { name: 'Sertifikasi Halal', status: 'Terverifikasi', expiryDate: '2030-02-15', number: 'ID3211000192837', evidenceUrl: 'halal_budi.pdf' },
        { name: 'Sertifikat Organik', status: 'Proses', expiryDate: '-', number: '-', evidenceUrl: '' }
      ],
      sustainability: {
        wasteManagement: 'Kulit ceri kopi diolah menjadi pupuk kompos untuk tanaman kopi kembali (Circular Economy). Kulit tanduk dijadikan bahan bakar pemanas mesin roasting.',
        ecoMaterials: 'Kemasan kertas kerajinan (kraft paper) ramah lingkungan biodegradeable.',
        energySaving: 'Sistem penjemuran kopi memanfaatkan solar dome dryer alami tanpa listrik.'
      },
      marketArea: 'Kafe-kafe di Jakarta, Bandung, Surabaya, dan ekspor sampel ke Jepang.',
      suppliers: 'Kelompok Tani Lestari Ciwidey.',
      partners: 'Asosiasi Eksportir Kopi Indonesia (AEKI).',
      dataConfidenceLevel: 85,
      completeness: 80
    },
    capabilities: [
      { name: 'Keuangan', score: 70, target: 80, recommendation: 'Perbaiki proyeksi arus kas tahunan menyesuaikan dengan siklus panen raya kopi.' },
      { name: 'Legalitas', score: 85, target: 95, recommendation: 'Segera selesaikan sertifikasi Organik SNI untuk meningkatkan nilai tawar biji kopi mentah.' },
      { name: 'Operasional', score: 80, target: 90, recommendation: 'Lakukan pemeliharaan berkala pada mesin roasting berkapasitas 5kg untuk menjamin konsistensi rasa.' }
    ],
    actionPlans: [],
    developmentCard: {
      strengths: ['Produk kualitas ekspor', 'Kelestarian lingkungan terjaga', 'Kemitraan petani kuat'],
      weaknesses: ['Ketergantungan pada musim panen', 'Branding digital kurang kuat', 'Pencatatan keuangan stok gudang belum rapi'],
      recommendation30Days: 'Buat profil bisnis dalam bahasa Inggris untuk keperluan pameran.',
      recommendation60Days: 'Susun rencana kemitraan B2B dengan distributor kopi luar kota.',
      recommendation90Days: 'Ajukan ke program Pertapreneur Aggregator karena rantai pasok sudah matang.',
      smexpoReadiness: 'Siap',
      aggregatorReadiness: 'Siap'
    }
  },
  {
    id: 'P003',
    name: 'Diana Putri',
    businessName: 'Hijab Cantik',
    sector: 'Fesyen & Wastra',
    region: 'Sumatera Utara',
    stage: 'Pembinaan Regional',
    status: 'Aktif',
    riskStatus: 'Perlu Perhatian',
    lastLogin: '2026-06-18 11:30', // > 7 days ago! Risk trigger
    challengePoints: 400,
    learningProgress: 30,
    attendanceRate: 60,
    overallScore: 48,
    passport: {
      ownerName: 'Diana Putri',
      ownerIdentity: {
        nik: '12************03',
        email: 'diana.putri@hijabcantik.com',
        phone: '0821-6543-2109',
        address: 'Jl. Sisingamangaraja No. 102, Medan, Sumatera Utara',
        gender: 'Perempuan'
      },
      businessName: 'Hijab Cantik',
      sector: 'Fesyen & Wastra',
      subsector: 'Busana Muslim & Hijab Bermotif',
      region: 'Sumatera Utara',
      establishedYear: 2022,
      description: 'Brand lokal busana muslim modern yang mengangkat motif wastra khas Sumatera Utara seperti Ulos dengan teknik digital print.',
      mainProducts: ['Scarf Ulos Digital Print', 'Gamis Modern Ulos Accent', 'Khimar Instan'],
      financials: {
        revenueBaseline: 12000000,
        revenueCurrent: 12500000,
        profitBaseline: 3000000,
        profitCurrent: 3100000,
        employeesBaseline: 2,
        employeesCurrent: 2,
        digitalChannelsBaseline: 2,
        digitalChannelsCurrent: 2,
        loanSource: 'None',
        loanAmount: 0,
        hasBankAccount: true,
        useQRIS: false,
        usePOS: false
      },
      certifications: [
        { name: 'NIB (Nomor Induk Berusaha)', status: 'Terverifikasi', expiryDate: 'Seumur Hidup', number: '9120038472911', evidenceUrl: 'nib_diana.pdf' },
        { name: 'Paten Merek / HKI', status: 'Belum Lengkap', expiryDate: '-', number: '-', evidenceUrl: '' }
      ],
      sustainability: {
        wasteManagement: 'Perca sisa kain jahitan dibuang langsung tanpa diolah.',
        ecoMaterials: 'Bahan poliester biasa, kemasan masih menggunakan plastik ziplock tebal.',
        energySaving: 'Menggunakan mesin jahit listrik dinamo standar.'
      },
      marketArea: 'Medan dan sekitarnya.',
      suppliers: 'Distributor kain kiloan di Medan.',
      partners: 'Tidak ada partner resmi.',
      dataConfidenceLevel: 60,
      completeness: 55
    },
    capabilities: [
      { name: 'Keuangan', score: 40, target: 75, recommendation: 'Mulai pisahkan kas pribadi dan kas usaha.' },
      { name: 'Legalitas', score: 50, target: 80, recommendation: 'Daftarkan merek Hijab Cantik ke Dirjen HKI agar tidak diklaim pihak lain.' }
    ],
    actionPlans: [],
    developmentCard: {
      strengths: ['Konsep wastra etnik menarik', 'Desain up-to-date'],
      weaknesses: ['Minim legalitas merek', 'Produksi belum standar', 'Kurang aktif dalam modul pelatihan'],
      recommendation30Days: 'Hadir dalam sesi pembinaan wajib berikutnya dan selesaikan tantangan ke-2.',
      recommendation60Days: 'Daftarkan merek dagang HKI dan buat SOP penjahitan standar.',
      recommendation90Days: 'Gunakan kemasan kertas ramah lingkungan dan buat website profil gratis.',
      smexpoReadiness: 'Belum Siap',
      aggregatorReadiness: 'Belum Siap'
    }
  },
  {
    id: 'P004',
    name: 'Wayan Suka',
    businessName: 'Bali Crafty',
    sector: 'Craft & Jewellery',
    region: 'Bali',
    stage: 'Pembinaan Regional',
    status: 'Aktif',
    riskStatus: 'Berisiko', // Missed multiple tasks, very low score
    lastLogin: '2026-06-10 08:20', // Over 15 days ago
    challengePoints: 150,
    learningProgress: 15,
    attendanceRate: 45,
    overallScore: 32,
    passport: {
      ownerName: 'Wayan Suka',
      ownerIdentity: {
        nik: '51************04',
        email: 'wayan.suka@balicrafty.com',
        phone: '0813-9876-5432',
        address: 'Jl. Hanoman, Ubud, Gianyar, Bali',
        gender: 'Laki-laki'
      },
      businessName: 'Bali Crafty',
      sector: 'Craft & Jewellery',
      subsector: 'Kerajinan Ukir Kayu Ramah Lingkungan',
      region: 'Bali',
      establishedYear: 2019,
      description: 'Memproduksi hiasan dinding dan sendok garpu kayu estetik yang dipahat manual oleh pengrajin Ubud.',
      mainProducts: ['Mangkok Kayu Jati', 'Set Sendok Garpu Makan Kayu', 'Patung Ukir Mini'],
      financials: {
        revenueBaseline: 8000000,
        revenueCurrent: 7500000, // Revenue decrease!
        profitBaseline: 2500000,
        profitCurrent: 2000000,
        employeesBaseline: 3,
        employeesCurrent: 2,
        digitalChannelsBaseline: 1,
        digitalChannelsCurrent: 1,
        loanSource: 'None',
        loanAmount: 0,
        hasBankAccount: true,
        useQRIS: false,
        usePOS: false
      },
      certifications: [
        { name: 'NIB (Nomor Induk Berusaha)', status: 'Terverifikasi', expiryDate: 'Seumur Hidup', number: '9120058372641', evidenceUrl: 'nib_wayan.pdf' }
      ],
      sustainability: {
        wasteManagement: 'Limbah serbuk gergajian dibakar di area belakang gudang.',
        ecoMaterials: 'Bahan baku kayu jati daur ulang bekas bongkaran rumah.',
        energySaving: 'Peralatan manual pahat tangan.'
      },
      marketArea: 'Wisatawan domestik di Ubud.',
      suppliers: 'Pengepul kayu bekas di Tabanan.',
      partners: 'Kios oleh-oleh lokal di Sukawati.',
      dataConfidenceLevel: 50,
      completeness: 45
    },
    capabilities: [
      { name: 'Keuangan', score: 35, target: 70, recommendation: 'Buat pembukuan mingguan paling sederhana.' }
    ],
    actionPlans: [],
    developmentCard: {
      strengths: ['Menggunakan bahan kayu jati bekas yang ramah lingkungan', 'Skill pertukangan lokal tinggi'],
      weaknesses: ['Penjualan offline menurun drastis pasca sepi turis', 'Belum bisa menggunakan media sosial untuk jualan', 'Kehadiran pembinaan sangat rendah'],
      recommendation30Days: 'Hubungi fasilitator pendamping untuk konsultasi darurat (Intervensi Khusus).',
      recommendation60Days: 'Mulai tawarkan produk ke marketplace Tokopedia/Shopee menggunakan smartphone.',
      recommendation90Days: 'Tingkatkan kualitas finishing kemasan produk agar bernilai ekspor.',
      smexpoReadiness: 'Belum Siap',
      aggregatorReadiness: 'Belum Siap'
    }
  },
  {
    id: 'P005',
    name: 'Ahmad Fauzi',
    businessName: 'Tani Mandiri',
    sector: 'Agribisnis',
    region: 'Jawa Timur',
    stage: 'Pembinaan Regional',
    status: 'Aktif',
    riskStatus: 'Aman',
    lastLogin: '2026-06-25 17:10',
    challengePoints: 1100,
    learningProgress: 75,
    attendanceRate: 95,
    overallScore: 80,
    passport: {
      ownerName: 'Ahmad Fauzi',
      ownerIdentity: {
        nik: '35************05',
        email: 'ahmad.fauzi@tanimandiri.com',
        phone: '0852-9988-7766',
        address: 'Desa Sidomulyo RT 03/RW 04, Batu, Jawa Timur',
        gender: 'Laki-laki'
      },
      businessName: 'Tani Mandiri',
      sector: 'Agribisnis',
      subsector: 'Sayur Organik & Keripik Sayur Sehat',
      region: 'Jawa Timur',
      establishedYear: 2021,
      description: 'Budidaya sayur organik bebas pestisida dan pengolahan sayur afkir menjadi keripik sayur renyah bernilai ekonomi tinggi.',
      mainProducts: ['Keripik Bayam Krispi', 'Keripik Wortel Madu', 'Sayur Selada Hidroponik Segar'],
      financials: {
        revenueBaseline: 18000000,
        revenueCurrent: 22000000,
        profitBaseline: 5000000,
        profitCurrent: 6800000,
        employeesBaseline: 4,
        employeesCurrent: 5,
        digitalChannelsBaseline: 2,
        digitalChannelsCurrent: 3,
        loanSource: 'BRI (KUR)',
        loanAmount: 20000000,
        hasBankAccount: true,
        useQRIS: true,
        usePOS: true
      },
      certifications: [
        { name: 'NIB (Nomor Induk Berusaha)', status: 'Terverifikasi', expiryDate: 'Seumur Hidup', number: '9120048271048', evidenceUrl: 'nib_fauzi.pdf' },
        { name: 'Sertifikasi Halal', status: 'Terverifikasi', expiryDate: '2029-11-20', number: 'ID3511000182741', evidenceUrl: 'halal_fauzi.pdf' },
        { name: 'P-IRT (Pangan Industri Rumah Tangga)', status: 'Terverifikasi', expiryDate: '2029-01-10', number: 'P-IRT 2063579010214-26', evidenceUrl: 'pirt_fauzi.pdf' }
      ],
      sustainability: {
        wasteManagement: 'Limbah akar dan daun tidak layak konsumsi dijadikan pupuk kompos padat dan cair (Zero Waste).',
        ecoMaterials: 'Kemasan menggunakan standing pouch kertas laminasi ramah lingkungan.',
        energySaving: 'Penyiraman tanaman hidroponik menggunakan pompa air bertenaga sel surya panel mandiri.'
      },
      marketArea: 'Supermarket lokal di Malang dan Surabaya, serta toko oleh-oleh Jawa Timur.',
      suppliers: 'Kelompok Tani Desa Sidomulyo.',
      partners: 'Supermarket Brawijaya Malang.',
      dataConfidenceLevel: 90,
      completeness: 88
    },
    capabilities: [
      { name: 'Keuangan', score: 75, target: 80, recommendation: 'Gunakan pencatatan laporan neraca sederhana bulanan.' },
      { name: 'Legalitas', score: 90, target: 95, recommendation: 'Pertahankan seluruh sertifikasi dan persiapkan berkas perpanjangan P-IRT.' },
      { name: 'Operasional', score: 85, target: 90, recommendation: 'Optimalkan kapasitas produksi alat vacuum frying sayur.' }
    ],
    actionPlans: [],
    developmentCard: {
      strengths: ['Sertifikasi halal dan P-IRT lengkap', 'Konsep zero-waste dan energi surya sangat inovatif', 'Pasokan bahan baku terjamin'],
      weaknesses: ['Kapasitas mesin penggoreng hampa (vacuum frying) terbatas', 'Branding kemasan kurang eye-catching'],
      recommendation30Days: 'Ganti desain stiker kemasan agar lebih modern dan berdaya pikat.',
      recommendation60Days: 'Ajukan proposal bantuan alat teknologi tepat guna / CSR Pertamina untuk mesin penggoreng.',
      recommendation90Days: 'Ikuti program business matching tingkat nasional di SMEXPO.',
      smexpoReadiness: 'Siap',
      aggregatorReadiness: 'Siap'
    },
    tjslStatus: 'Belum Diperiksa',
    tjslVerificationStatus: 'Draft',
    tjslClaim: { isBinaan: 'Belum' }
  },
  {
    id: 'P006',
    name: 'Ahmad Hidayat',
    businessName: 'Kopi Lereng',
    sector: 'Agribisnis',
    region: 'Jawa Barat',
    stage: 'Verifikasi Status Binaan TJSL',
    status: 'Aktif',
    riskStatus: 'Perlu Perhatian',
    lastLogin: '2026-06-25 10:12',
    challengePoints: 320,
    learningProgress: 20,
    attendanceRate: 75,
    overallScore: 60,
    passport: {
      ownerName: 'Ahmad Hidayat',
      ownerIdentity: {
        nik: '3204120904850002',
        email: 'ahmad.kopilereng@gmail.com',
        phone: '0812-7766-5544',
        address: 'Jl. Lereng Gunung Puntang No. 15, Bandung, Jawa Barat',
        gender: 'Laki-laki'
      },
      businessName: 'Kopi Lereng',
      sector: 'Agribisnis',
      subsector: 'Kopi Arabika Single Origin',
      region: 'Jawa Barat',
      establishedYear: 2022,
      description: 'Menyediakan kopi arabika specialty hasil ceri pilihan lereng Gunung Puntang Jawa Barat.',
      mainProducts: ['Kopi Puntang Honey', 'Kopi Puntang Arabica'],
      financials: {
        revenueBaseline: 8000000,
        revenueCurrent: 9200000,
        profitBaseline: 2500000,
        profitCurrent: 3100000,
        employeesBaseline: 2,
        employeesCurrent: 2,
        digitalChannelsBaseline: 1,
        digitalChannelsCurrent: 1,
        loanSource: 'None',
        loanAmount: 0,
        hasBankAccount: true,
        useQRIS: true,
        usePOS: false
      },
      certifications: [
        { name: 'NIB (Nomor Induk Berusaha)', status: 'Terverifikasi', expiryDate: 'Seumur Hidup', number: '9120048123011', evidenceUrl: 'nib_ahmad.pdf' }
      ],
      sustainability: {
        wasteManagement: 'Ampas kopi digunakan untuk pakan ternak kambing dan pupuk tanaman sayur.',
        ecoMaterials: 'Kemasan kertas kopi daur ulang.',
        energySaving: 'Pengeringan manual sinar matahari.'
      },
      marketArea: 'Bandung',
      suppliers: 'Petani Lereng Puntang',
      partners: 'Koperasi Kopi Lokal',
      dataConfidenceLevel: 75,
      completeness: 65
    },
    capabilities: [
      { name: 'Keuangan', score: 60, target: 80, recommendation: 'Pisahkan keuangan pribadi dan usaha secara konsisten.' }
    ],
    actionPlans: [],
    developmentCard: {
      strengths: ['Bahan baku berkualitas tinggi', 'Penguasaan proses pasca panen'],
      weaknesses: ['Pemasaran digital sangat terbatas', 'Belum memiliki perizinan lengkap'],
      recommendation30Days: 'Selesaikan verifikasi status binaan untuk membuka akses pembinaan penuh.',
      recommendation60Days: 'Ajukan pendampingan sertifikasi halal.',
      recommendation90Days: 'Mulai jualan online di Tokopedia.',
      smexpoReadiness: 'Belum Siap',
      aggregatorReadiness: 'Belum Siap'
    },
    tjslStatus: 'Perlu Klarifikasi',
    tjslVerificationStatus: 'Menunggu Klarifikasi',
    tjslClaim: {
      isBinaan: 'Pernah',
      programAsal: 'Rumah BUMN Pertamina',
      rumahBumn: 'Rumah BUMN Bandung',
      region: 'Jawa Barat',
      tahun: 2024,
      mitraId: 'RB-Bdg-412',
      picName: 'Pak Dedi',
      statusProgram: 'Alumni',
      evidenceFile: 'kartu_rumah_bumn_ahmad.jpg',
      notes: 'Pernah terdaftar mengikuti pembinaan kemasan di Rumah BUMN Pertamina Bandung tahun 2024.',
      consent: true,
      dbMatchStatus: 'Partial',
      dbMatchDetails: 'Database Match Result: NIK tidak ditemukan langsung di database pusat SMEPP, namun nama usaha "Kopi Lereng" terdaftar di Rumah BUMN Bandung atas nama "Ahmad H." dengan nomor telepon lama "0812-1122-3344". Perlu verifikasi ulang NIK dan nomor telepon.'
    },
    tjslLogs: [
      { date: '2026-06-21 11:00', action: 'Submit Pendaftaran', pic: 'Ahmad Hidayat', notes: 'Mengisi klaim afiliasi program Rumah BUMN.' },
      { date: '2026-06-22 09:15', action: 'Pemeriksaan Otomatis', pic: 'Sistem SMEPP', notes: 'Pencocokan nama usaha parsial ditemukan. NIK tidak cocok langsung.' },
      { date: '2026-06-23 15:40', action: 'Butuh Klarifikasi', pic: 'Dra. Sri Wahyuni (Fasilitator)', notes: 'Klaim diset sebagai Perlu Klarifikasi. Menunggu unggahan nomor telepon lama atau konfirmasi kepemilikan.' }
    ]
  },
  {
    id: 'P007',
    name: 'Maria Lestari',
    businessName: 'Tenun Lestari',
    sector: 'Fesyen & Wastra',
    region: 'Nusa Tenggara Timur',
    stage: 'Verifikasi Status Binaan TJSL',
    status: 'Aktif',
    riskStatus: 'Aman',
    lastLogin: '2026-06-26 08:34',
    challengePoints: 420,
    learningProgress: 40,
    attendanceRate: 85,
    overallScore: 70,
    passport: {
      ownerName: 'Maria Lestari',
      ownerIdentity: {
        nik: '5303125211840003',
        email: 'maria.lestari@tenunlestari.id',
        phone: '0813-5544-3322',
        address: 'Jl. Raya Kupang - Baa No. 24, Rote Ndao, NTT',
        gender: 'Perempuan'
      },
      businessName: 'Tenun Lestari',
      sector: 'Fesyen & Wastra',
      subsector: 'Kain Tenun Ikat Pewarna Alami',
      region: 'Nusa Tenggara Timur',
      establishedYear: 2021,
      description: 'Tenun ikat tradisional Rote Ndao menggunakan pewarna alami tumbuhan pesisir pantai.',
      mainProducts: ['Selendang Tenun Rote', 'Sarung Tenun Ikat'],
      financials: {
        revenueBaseline: 10000000,
        revenueCurrent: 11200000,
        profitBaseline: 3500000,
        profitCurrent: 4200000,
        employeesBaseline: 5,
        employeesCurrent: 6,
        digitalChannelsBaseline: 1,
        digitalChannelsCurrent: 2,
        loanSource: 'None',
        loanAmount: 0,
        hasBankAccount: true,
        useQRIS: false,
        usePOS: false
      },
      certifications: [
        { name: 'NIB (Nomor Induk Berusaha)', status: 'Terverifikasi', expiryDate: 'Seumur Hidup', number: '9120038271011', evidenceUrl: 'nib_maria.pdf' }
      ],
      sustainability: {
        wasteManagement: 'Air sisa pewarnaan alami tumbuhan aman dibuang ke tanah kebun.',
        ecoMaterials: 'Benang katun organik dengan zat pewarna daun bakau dan kunyit.',
        energySaving: 'Alat tenun bukan mesin (ATBM) manual.'
      },
      marketArea: 'Kupang',
      suppliers: 'Kelompok Ibu-ibu Penenun Rote',
      partners: 'Dinas Koperasi dan UMKM Rote Ndao',
      dataConfidenceLevel: 80,
      completeness: 70
    },
    capabilities: [
      { name: 'Keuangan', score: 65, target: 80, recommendation: 'Mulai lakukan pembukuan kas digital sederhana.' }
    ],
    actionPlans: [],
    developmentCard: {
      strengths: ['Konsep ramah lingkungan murni', 'Produk bernilai budaya tinggi'],
      weaknesses: ['Akses internet dan pengiriman barang mahal', 'Kurang pengetahuan legalitas nasional'],
      recommendation30Days: 'Dapatkan persetujuan SMEPP untuk program eksternal.',
      recommendation60Days: 'Daftarkan merek usaha ke HKI.',
      recommendation90Days: 'Mulai tawarkan ke pasar ekspatriat Bali.',
      smexpoReadiness: 'Belum Siap',
      aggregatorReadiness: 'Belum Siap'
    },
    tjslStatus: 'Perlu Persetujuan SMEPP',
    tjslVerificationStatus: 'Menunggu Persetujuan',
    tjslClaim: {
      isBinaan: 'Pernah',
      programAsal: 'Program Pertamina lainnya',
      programAsalLainnya: 'Binaan CSR Subholding Hulu Pertamina Sumbagsel (Program Eksternal Wilayah Terpencil)',
      subholding: 'Pertamina Hulu Energi',
      region: 'Sumatera Bagian Selatan',
      tahun: 2023,
      mitraId: 'CSR-PHE-2023-09',
      picName: 'Ibu Anita (CSR PHE)',
      statusProgram: 'Alumni',
      evidenceFile: 'surat_keterangan_csr_phe.pdf',
      notes: 'Pernah dibina dalam program pemberdayaan perempuan tenun pesisir oleh CSR Pertamina Hulu Energi (PHE) Wilayah Rote Ndao (wilayah operasi penunjang eksplorasi lepas pantai). Data tidak di-upload ke server database utama SMEPP karena bersifat program sosial lokal.',
      consent: true,
      dbMatchStatus: 'No History',
      dbMatchDetails: 'Database Match Result: NIK tidak ditemukan dalam database utama pusat SMEPP. Namun bukti surat keterangan berstempel basah dari PHE terlampir lengkap dan tanda tangan PIC valid. Memerlukan persetujuan administrator SMEPP Pusat.'
    },
    tjslLogs: [
      { date: '2026-06-22 14:00', action: 'Submit Pendaftaran', pic: 'Maria Lestari', notes: 'Mengisi klaim pembinaan via CSR PHE.' },
      { date: '2026-06-23 10:10', action: 'Pemeriksaan Otomatis', pic: 'Sistem SMEPP', notes: 'Pencarian database pusat gagal (No History).' },
      { date: '2026-06-24 16:30', action: 'Eskalasi ke SMEPP', pic: 'Dra. Sri Wahyuni (Fasilitator)', notes: 'Fasilitator memeriksa dokumen pendukung eksternal, validitas terbukti. Dieksalasi ke Tim SMEPP Pusat untuk persetujuan final status bersyarat (Perlu Persetujuan SMEPP).' }
    ]
  },
  {
    id: 'P008',
    name: 'Deni Saputra',
    businessName: 'Dapur Deni',
    sector: 'Food & Beverage',
    region: 'Jawa Timur',
    stage: 'Verifikasi Status Binaan TJSL',
    status: 'Pasif',
    riskStatus: 'Berisiko',
    lastLogin: '2026-06-20 09:30',
    challengePoints: 100,
    learningProgress: 10,
    attendanceRate: 40,
    overallScore: 35,
    passport: {
      ownerName: 'Deni Saputra',
      ownerIdentity: {
        nik: '3578011210920004',
        email: 'deni.dapur@gmail.com',
        phone: '0812-4433-2211',
        address: 'Jl. Dupak No. 120, Surabaya, Jawa Timur',
        gender: 'Laki-laki'
      },
      businessName: 'Dapur Deni',
      sector: 'Food & Beverage',
      subsector: 'Aneka Sambal Goreng Kentang',
      region: 'Jawa Timur',
      establishedYear: 2023,
      description: 'Memproduksi sambal goreng kentang kering untuk lauk praktis keluarga.',
      mainProducts: ['Kentang Kering Pedas'],
      financials: {
        revenueBaseline: 5000000,
        revenueCurrent: 5000000,
        profitBaseline: 1500000,
        profitCurrent: 1500000,
        employeesBaseline: 1,
        employeesCurrent: 1,
        digitalChannelsBaseline: 0,
        digitalChannelsCurrent: 0,
        loanSource: 'None',
        loanAmount: 0,
        hasBankAccount: false,
        useQRIS: false,
        usePOS: false
      },
      certifications: [
        { name: 'NIB (Nomor Induk Berusaha)', status: 'Proses', expiryDate: '-', number: '-', evidenceUrl: '' }
      ],
      sustainability: {
        wasteManagement: 'Dibuang langsung ke bak sampah warga.',
        ecoMaterials: 'Kemasan mika plastik bening tipis sekali pakai.',
        energySaving: 'Kompor minyak biasa.'
      },
      marketArea: 'Surabaya',
      suppliers: 'Pasar Dupak',
      partners: 'Warung makan sekitar',
      dataConfidenceLevel: 40,
      completeness: 35
    },
    capabilities: [
      { name: 'Keuangan', score: 35, target: 70, recommendation: 'Mulai catat pengeluaran dan pemasukan harian.' }
    ],
    actionPlans: [],
    developmentCard: {
      strengths: ['Rasa produk disukai warga sekitar'],
      weaknesses: ['Kemasan kurang aman dan menarik', 'Pencatatan nihil'],
      recommendation30Days: 'Lengkapi data identitas dan afiliasi dengan benar.',
      recommendation60Days: 'Ikuti webinar dasar keuangan.',
      recommendation90Days: 'Urus NIB.',
      smexpoReadiness: 'Belum Siap',
      aggregatorReadiness: 'Belum Siap'
    },
    tjslStatus: 'Tidak Eligible',
    tjslVerificationStatus: 'Tidak Terverifikasi',
    tjslClaim: {
      isBinaan: 'Ya',
      programAsal: 'Program PUMK Pertamina',
      region: 'Jawa Timur',
      tahun: 2024,
      mitraId: 'PUMK-JT-2024-998',
      picName: 'Bapak Rudi',
      statusProgram: 'Aktif',
      evidenceFile: 'bukti_pumk_palsu.jpg',
      notes: 'Mengajukan pinjaman lunak PUMK pada region Jawa Timur tahun lalu dan sudah disetujui.',
      consent: true,
      dbMatchStatus: 'Inconsistent',
      dbMatchDetails: 'Database Match Result: NIK 3578011210920004 terdaftar di sistem pusat atas nama orang lain "Hendra Wijaya". Sedangkan ID Mitra Binaan "PUMK-JT-2024-998" terdaftar untuk badan usaha kriya "Ganesha Art". Bukti unggahan sertifikat yang dilampirkan adalah hasil suntingan (mismatched/duplicate identity). Terdeteksi indikasi pemalsuan berkas.'
    },
    tjslLogs: [
      { date: '2026-06-23 15:00', action: 'Submit Pendaftaran', pic: 'Deni Saputra', notes: 'Mengisi klaim afiliasi program PUMK.' },
      { date: '2026-06-24 11:20', action: 'Pemeriksaan Otomatis', pic: 'Sistem SMEPP', notes: 'Terdeteksi bentrokan data NIK dan ID Mitra Binaan di database pusat.' },
      { date: '2026-06-25 10:45', action: 'Tolak Verifikasi', pic: 'Dra. Sri Wahyuni (Fasilitator)', notes: 'Klaim ditolak secara permanen karena ketidaksesuaian data identitas yang ekstrem (Inconsistent).' }
    ]
  }
];

export const INITIAL_MODULES: LearningModule[] = [
  {
    id: 'M01',
    title: 'Manajemen Keuangan Modern UMK',
    instructor: 'Ir. Handoko Wibowo, MBA',
    format: 'Video',
    duration: '45 Menit',
    track: 'Regional',
    progress: 100, // Completed by default for Siti
    deadline: '2026-07-05',
    status: 'Selesai',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Pelajari dasar-dasar pemisahan kas pribadi dan kas bisnis, menyusun laporan laba rugi sederhana, dan mengelola arus kas (cashflow) harian agar usaha mikro terhindar dari defisit modal.',
    quizQuestions: [
      {
        question: 'Mengapa kas pribadi dan kas usaha harus dipisahkan?',
        options: [
          'Agar tidak dituduh korupsi oleh keluarga.',
          'Agar kita bisa mengukur laba bersih usaha secara akurat tanpa terdistorsi pengeluaran konsumtif.',
          'Hanya sebagai syarat pendaftaran program Pertamina.',
          'Agar saldo di rekening bank terlihat banyak.'
        ],
        answerIndex: 1
      },
      {
        question: 'Komponen utama apa yang ada dalam laporan laba rugi sederhana?',
        options: [
          'Pendapatan kotor, Biaya operasional, dan Laba/Rugi bersih',
          'Daftar aset pribadi dan piutang tetangga',
          'Modal awal dan utang bank saja',
          'Sisa stok bahan baku dan harga jual pasar'
        ],
        answerIndex: 0
      }
    ]
  },
  {
    id: 'M02',
    title: 'Strategi Pasar dan Pemasaran Modern',
    instructor: 'Riana Lestari, S.Sos (Digital Strategist)',
    format: 'Webinar',
    duration: '90 Menit',
    track: 'Regional',
    progress: 100,
    deadline: '2026-07-08',
    status: 'Selesai',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Mengidentifikasi segmentasi pelanggan yang tepat, merancang Value Proposition yang unik, serta menentukan saluran pemasaran (bauran pemasaran 4P) yang paling efektif bagi produk UMK lokal.',
    quizQuestions: [
      {
        question: 'Apakah yang dimaksud dengan Value Proposition?',
        options: [
          'Nilai jual produk berdasarkan harga termurah di pasar.',
          'Nilai manfaat atau keunikan produk yang menyelesaikan masalah konsumen dan membedakannya dari kompetitor.',
          'Brosur promosi diskon produk.',
          'Kombinasi bahan baku berkualitas premium saja.'
        ],
        answerIndex: 1
      }
    ]
  },
  {
    id: 'M03',
    title: 'Dasar Manajemen Operasional & Standarisasi SOP',
    instructor: 'Suryo Putranto, M.T.',
    format: 'PDF',
    duration: '30 Halaman',
    track: 'Regional',
    progress: 50, // In progress
    deadline: '2026-07-12',
    status: 'Sedang Dipelajari',
    videoUrl: '',
    description: 'Panduan menyusun Standard Operating Procedure (SOP) produksi demi menjamin konsistensi kualitas rasa, warna, ukuran, dan keamanan produk kuliner, agribisnis, maupun kriya.',
    quizQuestions: [
      {
        question: 'Apa fungsi utama dari pembuatan dokumen SOP dalam bisnis?',
        options: [
          'Sebagai pajangan dinding saat ada kunjungan dinas.',
          'Menjadi panduan baku bagi pekerja agar kualitas produk tetap konsisten siapapun yang memproduksinya.',
          'Mempersulit proses pembuatan produk baru.',
          'Mengurangi biaya operasional secara langsung.'
        ],
        answerIndex: 1
      }
    ]
  },
  {
    id: 'M04',
    title: 'Legalitas, Perizinan, dan Sertifikasi Dasar Usaha',
    instructor: 'Dra. Sri Wahyuni (SMEPP Consultant)',
    format: 'Worksheet',
    duration: '15 Menit',
    track: 'Regional',
    progress: 0,
    deadline: '2026-07-15',
    status: 'Belum Mulai',
    videoUrl: '',
    description: 'Panduan praktis mengurus NIB melalui sistem OSS, syarat mengajukan sertifikasi Halal (Self Declare & Reguler), P-IRT dari Dinas Kesehatan, serta dasar pendaftaran Hak Kekayaan Intelektual (HKI).'
  },
  {
    id: 'M05',
    title: 'Digitalisasi Proses Bisnis dengan POS & QRIS',
    instructor: 'Andi Pratama (Business Accelerator)',
    format: 'Video',
    duration: '50 Menit',
    track: 'National',
    progress: 0,
    deadline: '2026-08-01',
    status: 'Terkunci',
    description: 'Langkah taktis merombak sistem pembayaran manual menjadi cashless dengan QRIS nasional, mengelola inventory real-time dengan aplikasi kasir digital (POS), serta membuat rekapan keuangan otomatis.'
  },
  {
    id: 'M06',
    title: 'Optimasi Marketplace & Iklan Berbayar',
    instructor: 'Yusuf Maulana (E-commerce Specialist)',
    format: 'Video',
    duration: '120 Menit',
    track: 'National',
    progress: 0,
    deadline: '2026-08-10',
    status: 'Terkunci',
    description: 'Strategi optimasi halaman toko Shopee & Tokopedia, teknik menulis deskripsi SEO-friendly, riset kata kunci, serta menjalankan iklan berbayar (Shopee Ads / Tokopedia Ads) yang mendatangkan profit berlipat.'
  },
  {
    id: 'M07',
    title: 'Ekonomi Sirkular & Implementasi Go Green UMK',
    instructor: 'Dr. Emil Salim Jr. (Green Activist)',
    format: 'Webinar',
    duration: '100 Menit',
    track: 'National',
    progress: 0,
    deadline: '2026-08-20',
    status: 'Terkunci',
    description: 'Memahami konsep produksi bersih tanpa limbah (zero waste), substitusi kemasan plastik dengan bahan ramah lingkungan, efisiensi energi kelistrikan, serta menggaet segmentasi pasar sadar lingkungan (eco-conscious).'
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'C01',
    title: 'Membuat SOP Produksi Sederhana',
    objective: 'Menyusun dokumen Standard Operating Procedure (SOP) tertulis untuk salah satu proses produksi paling krusial di usaha Anda.',
    instructions: '1. Tuliskan 1 alur proses produksi krusial (misal: pensterilan botol sambal atau pemilahan ceri kopi).\n2. Cantumkan alat & bahan, langkah-langkah detail, penanggung jawab, serta standar toleransi kegagalan.\n3. Unggah foto saat aktivitas tersebut dilakukan sesuai dengan SOP yang ditulis.\n4. Simpan dalam format PDF atau foto lembaran kertas SOP yang sudah ditandatangani pemilik.',
    evidenceExample: 'Dokumen PDF SOP setebal 1-2 halaman dilengkapi foto dapur produksi bersih.',
    deadline: '2026-07-08',
    points: 300,
    type: 'Wajib',
    status: 'Sedang Diverifikasi',
    submission: {
      textResponse: 'Berikut adalah draf dokumen SOP Sterilisasi Botol Kaca Kemasan untuk Rasa Nusantara. Kami menuangkan langkah sterilisasi dengan merebus botol dalam air mendidih 100 derajat Celcius selama 15 menit, lalu ditiriskan pada rak khusus anti-debu. SOP ini sudah diuji coba oleh staf dapur kami (Bu Minah).',
      fileUrl: 'sop_sterilisasi_rasanusantara.pdf',
      photoUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80',
      submittedAt: '2026-06-24 19:12'
    },
    facilitatorFeedback: 'SOP tertulis sudah sangat detail. Bagus sekali Ibu Siti! Tolong lampirkan foto saat lembar kertas SOP ditempel di dinding dapur dekat tempat sterilisasi sebagai bukti implementasi nyata.'
  },
  {
    id: 'C02',
    title: 'Mengunggah Laporan Keuangan Bulan Juni',
    objective: 'Mengisi data omzet, profit bersih, rincian biaya operasional, dan pengeluaran bahan baku untuk periode bulan berjalan di Business Passport.',
    instructions: '1. Lengkapi tab Keuangan pada menu Profil & Business Passport.\n2. Pastikan angka yang dimasukkan sesuai dengan catatan buku kas Anda.\n3. Lampirkan foto tangkapan layar (screenshot) aplikasi kasir digital Anda atau lembar buku kas tulis tangan sebagai bukti pendukung.',
    evidenceExample: 'Data Keuangan di-update dan screenshot rekap kasir digital / excel pembukuan.',
    deadline: '2026-06-30',
    points: 250,
    type: 'Wajib',
    status: 'Selesai',
    submission: {
      textResponse: 'Data keuangan bulan Juni sudah kami isi lengkap di tab keuangan. Omzet tercapai Rp18.500.000 dengan profit Rp5.800.000.',
      fileUrl: 'rekap_juni_rasanusantara.xlsx',
      photoUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      submittedAt: '2026-06-25 10:20'
    }
  },
  {
    id: 'C03',
    title: 'Mengaktifkan Pembayaran Cashless QRIS',
    objective: 'Menyediakan fasilitas metode pembayaran nontunai menggunakan kode QRIS standar nasional di kasir fisik / online Anda.',
    instructions: '1. Ajukan QRIS melalui Bank / Dompet Digital (ShopeePay/Gopay/OVO/DANA/Nobu Bank).\n2. Cetak kode QRIS dan letakkan di meja kasir toko Anda.\n3. Foto meja kasir yang menampilkan stiker QRIS berdampingan dengan produk Anda.\n4. Ceritakan kemudahan yang dirasakan konsumen pasca mengaktifkan QRIS.',
    evidenceExample: 'Foto produk usaha di samping stiker QRIS resmi berlogo nama UMK Anda.',
    deadline: '2026-07-15',
    points: 200,
    type: 'Pilihan',
    status: 'Draft'
  },
  {
    id: 'C04',
    title: 'Membuat 4 Konten Pemasaran di Media Sosial',
    objective: 'Membuat, mengunggah, dan mengoptimalkan 4 konten promosi kreatif di platform Instagram, TikTok, atau Facebook.',
    instructions: '1. Buat 4 postingan kreatif (bisa berupa foto produk estetik, video pendek proses pembuatan, carousell tips, atau edukasi manfaat bahan baku).\n2. Cantumkan tautan pemesanan (link bio) dan tagar resmi #PertaminaUMKAcademy2026 #UMKNaikKelas.\n3. Salin link postingan dan screenshot jumlah penayangan / likes konten setelah 2 hari diunggah.',
    evidenceExample: '4 link url postingan media sosial yang aktif beserta screenshot impresinya.',
    deadline: '2026-07-20',
    points: 200,
    type: 'Pilihan',
    status: 'Selesai',
    submission: {
      textResponse: 'Sudah kami buat di akun Instagram @rasa.nusantara. Kami mengangkat kisah di balik dapur produksi, higienitas cabai pilihan, cara penyajian dengan nasi hangat, dan promo akhir pekan. Respons pembeli sangat antusias!',
      videoLink: 'https://instagram.com/p/rasa_nusantara_video1',
      photoUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
      submittedAt: '2026-06-20 14:00'
    }
  },
  {
    id: 'C05',
    title: 'Implementasi Pengurangan Sampah Produksi (Go Green)',
    objective: 'Memulai aksi nyata pengurangan limbah plastik sekali pakai atau daur ulang sisa sampah proses produksi usaha Anda.',
    instructions: '1. Identifikasi limbah terbesar dari produksi Anda (misal: plastik kemasan, ampas kulit kopi, air sisa pencucian cabai).\n2. Lakukan inovasi daur ulang atau penggantian bahan bakar / kemasan ramah lingkungan.\n3. Foto bukti proses pengolahan atau penggunaan kemasan eco-friendly.\n4. Tulis deskripsi dampak kelestarian yang ditimbulkan.',
    evidenceExample: 'Foto proses pembuatan pupuk organik dari ampas kuliner / foto pengemasan kardus eco.',
    deadline: '2026-07-25',
    points: 350,
    type: 'Pilihan',
    status: 'Selesai',
    submission: {
      textResponse: 'Kami mengirimkan sisa ampas cabai dan bawang ke kelompok tani holtikultura Bandungan sebagai bahan baku pestisida nabati alami. Petani sangat terbantu menghemat biaya pupuk kimia. Di sisi lain, kami beralih menggunakan tas belanja kain goni untuk pengiriman grosir reseller.',
      photoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
      submittedAt: '2026-06-22 10:00'
    }
  }
];

export const INITIAL_AGENDA: AgendaEvent[] = [
  {
    id: 'E01',
    title: 'Webinar: Manajemen Keuangan & Arus Kas UMK',
    date: '2026-06-20',
    time: '09:00 - 11:30 WIB',
    speaker: 'Ir. Handoko Wibowo, MBA',
    type: 'Webinar',
    location: 'https://zoom.us/j/9876543210 (Password: SMEPP2026)',
    isOffline: false,
    registrationStatus: 'Terdaftar',
    attendanceStatus: 'Hadir',
    materialsUrl: 'materi_keuangan.pdf',
    recordingUrl: 'https://youtube.com/watch?v=rekaman_keuangan'
  },
  {
    id: 'E02',
    title: 'Sesi Coaching Kelompok #1: Bedah Masalah Operasional',
    date: '2026-06-25',
    time: '13:00 - 15:00 WIB',
    speaker: 'Andi Pratama (Business Accelerator)',
    type: 'Coaching',
    location: 'https://zoom.us/j/1234567890 (Password: COACHING)',
    isOffline: false,
    registrationStatus: 'Terdaftar',
    attendanceStatus: 'Hadir'
  },
  {
    id: 'E03',
    title: 'Webinar Wajib: Kupas Tuntas Legalitas Usaha Mikro',
    date: '2026-07-02',
    time: '09:00 - 11:00 WIB',
    speaker: 'Dra. Sri Wahyuni (SMEPP Consultant)',
    type: 'Webinar',
    location: 'https://zoom.us/j/1122334455',
    isOffline: false,
    registrationStatus: 'Terdaftar',
    attendanceStatus: 'Menunggu'
  },
  {
    id: 'E04',
    title: 'Sesi Mentoring 1-on-1: Finansial & POS Setup',
    date: '2026-07-05',
    time: '14:00 - 15:30 WIB',
    speaker: 'Andi Pratama (Business Accelerator)',
    type: 'Coaching',
    location: 'https://calendly.com/andi-coach/umk-academy-2026',
    isOffline: false,
    registrationStatus: 'Belum Terdaftar',
    attendanceStatus: 'Menunggu'
  },
  {
    id: 'E05',
    title: 'Pameran Regional & Temu Bisnis Kurasi SMEXPO',
    date: '2026-07-18',
    time: '08:00 - 17:00 WIB',
    speaker: 'Direktorat SMEPP Pertamina',
    type: 'Exhibition',
    location: 'Gedung Grha Pertamina, Jakarta Pusat',
    isOffline: true,
    registrationStatus: 'Terdaftar',
    attendanceStatus: 'Menunggu'
  }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'FP01',
    authorName: 'Ahmad Fauzi',
    authorRole: 'Peserta',
    authorBusiness: 'Tani Mandiri (Batu)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    content: 'Alhamdulillah, pupuk organik cair dari fermentasi limbah bayam & wortel afkir kami sudah diuji coba ke perkebunan sawi warga desa Sidomulyo. Daun sawi tumbuh lebih lebar dan bebas ulat tanpa kimia! Teman-teman agribisnis lain yang mau tahu resep fermentasinya bisa saya share lembar SOP-nya ya. Semangat naik kelas!',
    likes: 24,
    commentsCount: 8,
    createdAt: '2026-06-25 09:30',
    category: 'Kolaborasi',
    hasLiked: false
  },
  {
    id: 'FP02',
    authorName: 'Siti Rahmawati',
    authorRole: 'Peserta',
    authorBusiness: 'Rasa Nusantara (Semarang)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    content: 'Bagi teman-teman kuliner Jawa Tengah, ada yang tahu info laboratorium uji laboratorium terpercaya untuk uji masa kedaluwarsa (shelf life test) produk botolan di daerah Semarang atau Solo? Kami butuh ini sebagai berkas pendukung izin edar BPOM MD. Terima kasih banyak infonya!',
    likes: 12,
    commentsCount: 15,
    createdAt: '2026-06-24 16:15',
    category: 'Tips Bisnis',
    hasLiked: true
  },
  {
    id: 'FP03',
    authorName: 'Andi Pratama',
    authorRole: 'Fasilitator',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    content: 'Pengumuman Penting! Batas pengisian Laporan Keuangan Bulan Juni di Business Passport adalah tanggal 30 Juni 2026 pukul 23.59 WIB. Data ini sangat vital untuk mengukur SROI program dan melacak persentase kenaikan omzet UMK binaan regional Jawa Tengah. Jika ada kesulitan menggunakan aplikasi kasir BukuKas, silakan diskusikan di grup Telegram kelas masing-masing ya.',
    likes: 45,
    commentsCount: 3,
    createdAt: '2026-06-23 08:00',
    category: 'Info Program',
    hasLiked: false
  },
  {
    id: 'FP04',
    authorName: 'Rudi Hermawan',
    authorRole: 'Alumni',
    authorBusiness: 'Keripik Tempe Maicih (Bandung) - Alumni 2024',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    content: 'Kunci sukses lulus Kurasi Nasional dan tampil di SMEXPO adalah kepemilikan dokumen legalitas yang solid dan foto produk yang profesional. Pengalaman saya dua tahun lalu, Pertamina sangat menyukai UMK yang memiliki dampak sosial tinggi ke warga sekitarnya. Fokus pada "Story Telling" usaha Anda!',
    likes: 56,
    commentsCount: 11,
    createdAt: '2026-06-22 14:20',
    category: 'Prestasi',
    hasLiked: false
  }
];

export const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Siti Rahmawati', business: 'Rasa Nusantara', sector: 'Food & Beverage', points: 1250, badge: 'Gold Master' },
  { rank: 2, name: 'Ahmad Fauzi', business: 'Tani Mandiri', sector: 'Agribisnis', points: 1100, badge: 'Green Initiator' },
  { rank: 3, name: 'Budi Santoso', business: 'Kopi Lestari', sector: 'Agribisnis', points: 950, badge: 'Specialty Champion' },
  { rank: 4, name: 'Linda Wijaya', business: 'Nusa Woodwork', sector: 'Craft & Jewellery', points: 820, badge: 'Craft Artisan' },
  { rank: 5, name: 'Diana Putri', business: 'Hijab Cantik', sector: 'Fesyen & Wastra', points: 400, badge: 'Fashion Starter' },
  { rank: 6, name: 'Wayan Suka', business: 'Bali Crafty', sector: 'Craft & Jewellery', points: 150, badge: 'Local Carver' }
];

export const FAQ_LIST = [
  {
    q: 'Apakah pendaftaran sertifikasi Halal difasilitasi gratis?',
    a: 'Ya, bagi peserta Pertamina UMK Academy 2026 yang aktif, berkomitmen menyelesaikan seluruh tantangan wajib, dan terpilih dalam pembinaan regional, Pertamina akan memfasilitasi pendampingan dan pembiayaan sertifikasi Halal gratis melalui skema Self Declare maupun reguler.'
  },
  {
    q: 'Bagaimana cara mengisi data omzet bulanan?',
    a: 'Masuk ke menu "Profil & Business Passport", pilih tab "Keuangan". Klik tombol "Edit", isi angka omzet baseline dan omzet terkini Anda, lalu unggah dokumen pendukung (laporan keuangan excel / screenshot POS digital) sebelum menekan tombol simpan.'
  },
  {
    q: 'Apa itu SMEXPO dan bagaimana cara mengikutinya?',
    a: 'SMEXPO adalah pameran tahunan bergengsi Pertamina untuk memasarkan produk UMK binaan terbaik ke tingkat nasional dan global. Peserta yang lolos Kurasi Nasional, memperoleh sertifikat kelulusan "Naik Kelas", dan memiliki "Sertifikat Kelayakan SMEXPO" tinggi akan langsung diundang berpameran gratis.'
  },
  {
    q: 'Apa tugas utama seorang Fasilitator / Akselerator?',
    a: 'Fasilitator bertugas mendampingi proses belajar Anda, memverifikasi unggahan bukti tantangan (challenges), memberikan feedback/rekomendasi perbaikan kapasitas usaha, serta mengusulkan kelulusan peserta ke seleksi Kurasi Nasional.'
  }
];
