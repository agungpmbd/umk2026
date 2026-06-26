export type Role = 'PESERTA' | 'FASILITATOR' | 'ADMIN';

export interface OwnerIdentity {
  nik: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
}

export interface Certification {
  name: string;
  status: 'Belum Lengkap' | 'Proses' | 'Terverifikasi';
  expiryDate?: string;
  number?: string;
  evidenceUrl?: string;
}

export interface FinancialData {
  revenueBaseline: number;
  revenueCurrent: number;
  profitBaseline: number;
  profitCurrent: number;
  employeesBaseline: number;
  employeesCurrent: number;
  digitalChannelsBaseline: number;
  digitalChannelsCurrent: number;
  loanSource: string;
  loanAmount: number;
  hasBankAccount: boolean;
  useQRIS: boolean;
  usePOS: boolean;
}

export interface SustainabilityPractice {
  wasteManagement: string;
  ecoMaterials: string;
  energySaving: string;
}

export interface BusinessPassport {
  ownerName: string;
  ownerIdentity: OwnerIdentity;
  businessName: string;
  sector: string;
  subsector: string;
  region: string;
  establishedYear: number;
  description: string;
  mainProducts: string[];
  financials: FinancialData;
  certifications: Certification[];
  sustainability: SustainabilityPractice;
  marketArea: string;
  suppliers: string;
  partners: string;
  dataConfidenceLevel: number; // 0-100
  completeness: number; // 0-100
}

export interface LearningModule {
  id: string;
  title: string;
  instructor: string;
  format: 'Video' | 'PDF' | 'Webinar' | 'Worksheet';
  duration: string;
  track: 'Regional' | 'National';
  sector?: string; // e.g. 'Food & Beverage'
  progress: number; // 0 or 100
  deadline: string;
  status: 'Belum Mulai' | 'Sedang Dipelajari' | 'Selesai' | 'Terkunci';
  videoUrl?: string;
  description: string;
  quizQuestions?: {
    question: string;
    options: string[];
    answerIndex: number;
  }[];
}

export interface Challenge {
  id: string;
  title: string;
  objective: string;
  instructions: string;
  evidenceExample: string;
  deadline: string;
  points: number;
  type: 'Wajib' | 'Pilihan';
  status: 'Draft' | 'Dikirim' | 'Sedang Diverifikasi' | 'Perlu Revisi' | 'Terverifikasi' | 'Ditolak' | 'Selesai';
  facilitatorFeedback?: string;
  submission?: {
    textResponse: string;
    fileUrl?: string;
    photoUrl?: string;
    videoLink?: string;
    submittedAt: string;
  };
}

export interface AgendaEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  speaker: string;
  type: 'Webinar' | 'Coaching' | 'Mentoring' | 'Exhibition' | 'Business Visit';
  location: string; // Zoom link or offline address
  isOffline: boolean;
  registrationStatus: 'Terdaftar' | 'Belum Terdaftar';
  attendanceStatus: 'Hadir' | 'Tidak Hadir' | 'Menunggu';
  materialsUrl?: string;
  recordingUrl?: string;
}

export interface ActionPlan {
  id: string;
  area: string;
  activity: string;
  pic: string;
  deadline: string;
  status: 'Belum Mulai' | 'Dalam Proses' | 'Selesai';
}

export interface CapabilityScore {
  name: string; // e.g., 'Keuangan'
  score: number;
  target: number;
  recommendation: string;
}

export interface DevelopmentCard {
  strengths: string[];
  weaknesses: string[];
  recommendation30Days: string;
  recommendation60Days: string;
  recommendation90Days: string;
  smexpoReadiness: 'Belum Siap' | 'Proses Kurasi' | 'Siap';
  aggregatorReadiness: 'Belum Siap' | 'Proses Kurasi' | 'Siap';
}

export interface Participant {
  id: string;
  name: string;
  businessName: string;
  sector: string;
  region: string;
  stage: 'Pendaftaran' | 'Verifikasi' | 'Pembinaan Regional' | 'Kurasi Nasional' | 'Pembinaan Nasional' | 'Top 100 Champion' | 'Graduation' | 'Nasional' | string;
  status: 'Aktif' | 'Pasif' | 'Selesai';
  riskStatus: 'Aman' | 'Perlu Perhatian' | 'Berisiko' | 'Tidak Aktif';
  lastLogin: string;
  challengePoints: number;
  learningProgress: number;
  attendanceRate: number;
  passport: BusinessPassport;
  capabilities: CapabilityScore[];
  actionPlans: ActionPlan[];
  developmentCard: DevelopmentCard;
  overallScore: number;
  challenges?: Challenge[];
  isRecommendedSMEXPO?: boolean;
  isRecommendedAggregator?: boolean;
  isUMKMTroopers?: boolean;
  isExportReady?: boolean;
}

export interface ForumPost {
  id: string;
  authorName: string;
  authorRole: 'Peserta' | 'Fasilitator' | 'Alumni' | 'Admin';
  authorBusiness?: string;
  avatar: string;
  content: string;
  likes: number;
  commentsCount: number;
  createdAt: string;
  category: 'Kolaborasi' | 'Tips Bisnis' | 'Info Program' | 'Prestasi';
  hasLiked?: boolean;
}
