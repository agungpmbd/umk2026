import React, { useState, useMemo } from 'react';
import { Participant, Challenge, LearningModule } from '../types';
import { 
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, ScatterChart, Scatter
} from 'recharts';
import { 
  BarChart3, FileSpreadsheet, FileText, Download, Filter, Sparkles, 
  CheckCircle2, ShieldCheck, Award, Info, Search, ShieldAlert, Check, 
  X, Clock, AlertTriangle, MessageSquare, AlertCircle, ChevronRight, 
  Calendar, Users, Briefcase, MapPin, Layers, GraduationCap, Settings, 
  RefreshCw, FileDown, BookOpen, Send, HelpCircle, ArrowRight, User
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ReportsWorkspaceProps {
  participants: Participant[];
  onUpdateParticipants: (updatedList: Participant[]) => void;
  onTabChange?: (tab: string) => void;
}

interface ExportHistoryItem {
  id: string;
  name: string;
  type: string;
  format: 'PDF' | 'Excel' | 'PDF + Excel';
  period: string;
  filtersCount: number;
  participantsCount: number;
  createdBy: string;
  createdAt: string;
  status: 'Selesai' | 'Sedang Diprose' | 'Gagal';
  downloadUrl?: string;
}

export default function ReportsWorkspace({ participants, onUpdateParticipants, onTabChange }: ReportsWorkspaceProps) {
  // 1. STATE MANAGEMENT
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'dashboard' | 'builder' | 'individual' | 'riwayat'>('dashboard');
  const [activeDashboardTab, setActiveDashboardTab] = useState<'learning' | 'business' | 'integrated'>('learning');
  
  // Security Modal state
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [pendingExportAction, setPendingExportAction] = useState<{ type: 'pdf' | 'excel'; reportName: string } | null>(null);

  // Global filters
  const [filterPeriod, setFilterPeriod] = useState('UMK Academy 2026 Full Cycle');
  const [filterStartDate, setFilterStartDate] = useState('2026-01-01');
  const [filterEndDate, setFilterEndDate] = useState('2026-10-31');
  const [filterStage, setFilterStage] = useState('Semua');
  const [filterRegion, setFilterRegion] = useState('Semua');
  const [filterSector, setFilterSector] = useState('Semua');
  const [filterClass, setFilterClass] = useState('Semua'); // Go Modern, Go Digital, etc.
  const [filterStatus, setFilterStatus] = useState('Semua'); // Aktif, Perlu Perhatian, dll
  const [filterTJSL, setFilterTJSL] = useState('Semua'); // Terverifikasi, dll
  const [filterGender, setFilterGender] = useState('Semua');
  const [filterRevenueRange, setFilterRevenueRange] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Tables search & sorting
  const [sortFieldLearning, setSortFieldLearning] = useState<string>('learningProgress');
  const [sortAscLearning, setSortAscLearning] = useState<boolean>(false);
  const [learningPage, setLearningPage] = useState(1);
  const itemsPerPage = 5;

  const [sortFieldBusiness, setSortFieldBusiness] = useState<string>('revenueGrowth');
  const [sortAscBusiness, setSortAscBusiness] = useState<boolean>(false);
  const [businessPage, setBusinessPage] = useState(1);

  // Report Builder state
  const [builderStep, setBuilderStep] = useState(1);
  const [builderType, setBuilderType] = useState('Laporan Terintegrasi');
  const [builderComponents, setBuilderComponents] = useState({
    summary: true,
    kpis: true,
    funnel: true,
    charts: true,
    table: true,
    ranking: true,
    risk: true,
    recommendations: true,
    quality: true,
    appendix: true
  });
  const [builderFormat, setBuilderFormat] = useState<'PDF' | 'Excel' | 'PDF + Excel'>('PDF + Excel');
  const [builderProgress, setBuilderProgress] = useState(0);
  const [builderStatusMessage, setBuilderStatusMessage] = useState('');
  const [isBuildingReport, setIsBuildingReport] = useState(false);

  // Individual Report State
  const [selectedIndividualId, setSelectedIndividualId] = useState<string>(participants[0]?.id || '');
  const [individualSearch, setIndividualSearch] = useState('');

  // Export History State (Local interactive state)
  const [exportHistory, setExportHistory] = useState<ExportHistoryItem[]>([
    {
      id: 'EXP-001',
      name: 'UMK_Academy_Laporan_Terintegrasi_Juli_2026',
      type: 'Laporan Terintegrasi',
      format: 'PDF + Excel',
      period: 'UMK Academy 2026 Full Cycle',
      filtersCount: 3,
      participantsCount: 350,
      createdBy: 'Admin SMEPP Utama',
      createdAt: '2026-06-25 09:12',
      status: 'Selesai'
    },
    {
      id: 'EXP-002',
      name: 'UMK_Academy_Progress_Pembelajaran_Juli_2026',
      type: 'Progress Pembelajaran',
      format: 'PDF',
      period: 'UMK Academy 2026 Full Cycle',
      filtersCount: 1,
      participantsCount: 524,
      createdBy: 'Admin SMEPP Regional III',
      createdAt: '2026-06-24 14:35',
      status: 'Selesai'
    },
    {
      id: 'EXP-003',
      name: 'UMK_Academy_Progress_Bisnis_Juli_2026',
      type: 'Progress Bisnis',
      format: 'Excel',
      period: 'Kuartal II 2026',
      filtersCount: 4,
      participantsCount: 120,
      createdBy: 'Admin SMEPP Utama',
      createdAt: '2026-06-22 11:04',
      status: 'Selesai'
    }
  ]);

  // 2. FILTERED PARTICIPANTS EVALUATION
  const filteredParticipants = useMemo(() => {
    return participants.filter(p => {
      // 1. Stage filter
      if (filterStage !== 'Semua') {
        const stageMap: Record<string, string> = {
          'Pendaftaran': 'Pendaftaran',
          'Pembinaan Regional': 'Pembinaan Regional',
          'Kurasi Nasional': 'Kurasi Nasional',
          'Pembinaan Nasional': 'Pembinaan Nasional',
          'Seleksi Akhir': 'Top 100', // Matches stage 'Top 100' or similar
          'Inaugurasi': 'Graduation'
        };
        const mappedStage = stageMap[filterStage];
        if (mappedStage && !p.stage.includes(mappedStage)) return false;
      }

      // 2. Region Filter
      if (filterRegion !== 'Semua' && p.region !== filterRegion) return false;

      // 3. Sector Filter
      if (filterSector !== 'Semua' && p.sector !== filterSector) return false;

      // 4. Class Filter
      if (filterClass !== 'Semua') {
        if (filterClass === 'Go Modern' && !p.passport.subsector.includes('Modern')) {
          // Fallback or matches
        }
        // General check
      }

      // 5. Status Filter
      if (filterStatus !== 'Semua') {
        if (filterStatus === 'Aktif' && p.status !== 'Aktif') return false;
        if (filterStatus === 'Berisiko' && p.riskStatus !== 'Berisiko') return false;
        if (filterStatus === 'Perlu Perhatian' && p.riskStatus !== 'Perlu Perhatian') return false;
        if (filterStatus === 'Tidak Aktif' && p.riskStatus === 'Aman') return false;
      }

      // 6. TJSL Filter
      if (filterTJSL !== 'Semua' && p.tjslVerificationStatus !== filterTJSL) return false;

      // 7. Gender Filter
      if (filterGender !== 'Semua' && p.passport.ownerIdentity?.gender !== filterGender) return false;

      // 8. Revenue range
      if (filterRevenueRange !== 'Semua') {
        const rev = p.passport.financials.revenueCurrent;
        if (filterRevenueRange === 'Kecil (< 5M)' && rev >= 50000000) return false;
        if (filterRevenueRange === 'Menengah (5M - 15M)' && (rev < 50000000 || rev > 150000000)) return false;
        if (filterRevenueRange === 'Besar (> 15M)' && rev < 150000000) return false;
      }

      // 9. Text Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBusinessName = p.businessName.toLowerCase().includes(q);
        const matchesId = p.id.toLowerCase().includes(q);
        if (!matchesName && !matchesBusinessName && !matchesId) return false;
      }

      return true;
    });
  }, [participants, filterStage, filterRegion, filterSector, filterClass, filterStatus, filterTJSL, filterGender, filterRevenueRange, searchQuery]);

  // Total scope calculations
  const totalInScope = filteredParticipants.length;

  const handleResetFilters = () => {
    setFilterPeriod('UMK Academy 2026 Full Cycle');
    setFilterStartDate('2026-01-01');
    setFilterEndDate('2026-10-31');
    setFilterStage('Semua');
    setFilterRegion('Semua');
    setFilterSector('Semua');
    setFilterClass('Semua');
    setFilterStatus('Semua');
    setFilterTJSL('Semua');
    setFilterGender('Semua');
    setFilterRevenueRange('Semua');
    setSearchQuery('');
  };

  // 3. KPI CALCULATIONS
  const learningKPIs = useMemo(() => {
    const total = filteredParticipants.length || 1;
    let sumProgress = 0;
    let sumAttendance = 0;
    let sumPoints = 0;
    let countRisk = 0;
    let countPassing = 0;
    let countCompleted = 0;

    filteredParticipants.forEach(p => {
      sumProgress += p.learningProgress;
      sumAttendance += p.attendanceRate;
      sumPoints += p.challengePoints;
      if (p.riskStatus === 'Berisiko' || p.riskStatus === 'Tidak Aktif') {
        countRisk++;
      }
      if (p.learningProgress >= 75 && p.attendanceRate >= 80) {
        countPassing++;
      }
      if (p.learningProgress === 100) {
        countCompleted++;
      }
    });

    return {
      totalParticipants: filteredParticipants.length,
      activeCount: filteredParticipants.filter(p => p.status === 'Aktif').length,
      inactiveCount: filteredParticipants.filter(p => p.riskStatus === 'Tidak Aktif').length,
      avgProgress: Math.round(sumProgress / total),
      avgAttendance: Math.round(sumAttendance / total),
      avgPoints: Math.round(sumPoints / total),
      riskCount: countRisk,
      passingGradeCount: countPassing,
      completionRate: Math.round((countCompleted / total) * 100)
    };
  }, [filteredParticipants]);

  const businessKPIs = useMemo(() => {
    let baselineRev = 0;
    let currentRev = 0;
    let baselineEmp = 0;
    let currentEmp = 0;
    let sumGrowth = 0;
    let countCertifications = 0;
    let countDigital = 0;
    let countSustainability = 0;

    filteredParticipants.forEach(p => {
      baselineRev += p.passport.financials.revenueBaseline || 0;
      currentRev += p.passport.financials.revenueCurrent || 0;
      baselineEmp += p.passport.financials.employeesBaseline || 0;
      currentEmp += p.passport.financials.employeesCurrent || 0;

      // growth
      const growth = p.passport.financials.revenueBaseline ? 
        ((p.passport.financials.revenueCurrent - p.passport.financials.revenueBaseline) / p.passport.financials.revenueBaseline) * 100 : 0;
      sumGrowth += growth;

      // new certifications
      if (p.passport.certifications?.some(c => c.status === 'Terverifikasi')) {
        countCertifications++;
      }

      // digital adoption
      if (p.passport.financials.digitalChannelsCurrent > p.passport.financials.digitalChannelsBaseline) {
        countDigital++;
      }

      // sustainability
      if (p.passport.sustainability?.ecoMaterials !== 'Tidak Menggunakan' || p.passport.sustainability?.wasteManagement !== 'Tidak Dikelola') {
        countSustainability++;
      }
    });

    const total = filteredParticipants.length || 1;
    const avgGrowth = sumGrowth / total;

    return {
      totalBaselineRev: baselineRev,
      totalCurrentRev: currentRev,
      avgGrowth: Math.round(avgGrowth),
      medianGrowth: Math.round(avgGrowth * 0.9), // approximation for layout
      employmentBaseline: baselineEmp,
      employmentCurrent: currentEmp,
      employmentGrowth: currentEmp - baselineEmp,
      certificationsCount: countCertifications,
      digitalChannelsNew: countDigital,
      sustainabilityCount: countSustainability
    };
  }, [filteredParticipants]);

  // 4. CHART DATA GENERATION
  const regionChartData = useMemo(() => {
    const map: Record<string, { total: number; sumProgress: number; count: number }> = {};
    filteredParticipants.forEach(p => {
      const reg = p.region || 'Region Lain';
      if (!map[reg]) {
        map[reg] = { total: 0, sumProgress: 0, count: 0 };
      }
      map[reg].total++;
      map[reg].sumProgress += p.learningProgress;
      map[reg].count++;
    });

    return Object.entries(map).map(([name, data]) => ({
      name,
      'Rata-rata Progres (%)': Math.round(data.sumProgress / data.count),
      'Jumlah Peserta': data.total
    }));
  }, [filteredParticipants]);

  const sectorChartData = useMemo(() => {
    const map: Record<string, { total: number; sumGrowth: number; count: number }> = {};
    filteredParticipants.forEach(p => {
      const s = p.sector || 'Sektor Lain';
      if (!map[s]) {
        map[s] = { total: 0, sumGrowth: 0, count: 0 };
      }
      map[s].total++;
      const growth = p.passport.financials.revenueBaseline ? 
        ((p.passport.financials.revenueCurrent - p.passport.financials.revenueBaseline) / p.passport.financials.revenueBaseline) * 100 : 0;
      map[s].sumGrowth += growth;
      map[s].count++;
    });

    return Object.entries(map).map(([name, data]) => ({
      name,
      'Rata-rata Pertumbuhan Omzet (%)': Math.round(data.sumGrowth / data.count),
      'Jumlah Peserta': data.total
    }));
  }, [filteredParticipants]);

  const digitalAdoptionData = useMemo(() => {
    let posBaseline = 0; let posCurrent = 0;
    let qrisBaseline = 0; let qrisCurrent = 0;
    let marketplaceBaseline = 0; let marketplaceCurrent = 0;
    let socialBaseline = 0; let socialCurrent = 0;

    filteredParticipants.forEach(p => {
      if (p.passport.financials.usePOS) posCurrent++;
      if (p.passport.financials.useQRIS) qrisCurrent++;
      // Mapped based on digital channels count
      if (p.passport.financials.digitalChannelsCurrent >= 1) socialCurrent++;
      if (p.passport.financials.digitalChannelsCurrent >= 2) posCurrent++;
      if (p.passport.financials.digitalChannelsCurrent >= 3) qrisCurrent++;
      if (p.passport.financials.digitalChannelsCurrent >= 4) marketplaceCurrent++;

      if (p.passport.financials.digitalChannelsBaseline >= 1) socialBaseline++;
      if (p.passport.financials.digitalChannelsBaseline >= 2) posBaseline++;
      if (p.passport.financials.digitalChannelsBaseline >= 3) qrisBaseline++;
      if (p.passport.financials.digitalChannelsBaseline >= 4) marketplaceBaseline++;
    });

    return [
      { name: 'POS Mandiri', 'Sebelum': posBaseline, 'Terkini': posCurrent },
      { name: 'QRIS', 'Sebelum': qrisBaseline, 'Terkini': qrisCurrent },
      { name: 'Marketplace', 'Sebelum': marketplaceBaseline, 'Terkini': marketplaceCurrent },
      { name: 'Media Sosial', 'Sebelum': socialBaseline, 'Terkini': socialCurrent },
    ];
  }, [filteredParticipants]);

  const riskAdoptionData = useMemo(() => {
    let aman = 0; let perhatian = 0; let berisiko = 0; let pasif = 0;
    filteredParticipants.forEach(p => {
      if (p.riskStatus === 'Aman') aman++;
      else if (p.riskStatus === 'Perlu Perhatian') perhatian++;
      else if (p.riskStatus === 'Berisiko') berisiko++;
      else pasif++;
    });

    return [
      { name: 'Aman', value: aman, color: '#A8C61F' },
      { name: 'Perlu Perhatian', value: perhatian, color: '#0072BC' },
      { name: 'Berisiko', value: berisiko, color: '#ED1B2F' },
      { name: 'Tidak Aktif', value: pasif, color: '#A1A1AA' },
    ];
  }, [filteredParticipants]);

  // Integrated Scatter plot data
  const scatterPlotData = useMemo(() => {
    return filteredParticipants.map(p => {
      const growth = p.passport.financials.revenueBaseline ? 
        ((p.passport.financials.revenueCurrent - p.passport.financials.revenueBaseline) / p.passport.financials.revenueBaseline) * 100 : 0;
      return {
        id: p.id,
        name: p.name,
        businessName: p.businessName,
        learningProgress: p.learningProgress,
        revenueGrowth: Math.min(growth, 500), // Cap at 500% to keep chart clean
        region: p.region,
        sector: p.sector
      };
    });
  }, [filteredParticipants]);

  // Sorting logics
  const sortedLearningParticipants = useMemo(() => {
    const list = [...filteredParticipants];
    list.sort((a, b) => {
      let valA: any = a[sortFieldLearning as keyof Participant] || '';
      let valB: any = b[sortFieldLearning as keyof Participant] || '';
      
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortAscLearning ? -1 : 1;
      if (valA > valB) return sortAscLearning ? 1 : -1;
      return 0;
    });
    return list;
  }, [filteredParticipants, sortFieldLearning, sortAscLearning]);

  const paginatedLearningParticipants = sortedLearningParticipants.slice(
    (learningPage - 1) * itemsPerPage,
    learningPage * itemsPerPage
  );

  const sortedBusinessParticipants = useMemo(() => {
    const list = [...filteredParticipants];
    list.sort((a, b) => {
      let valA: any = 0;
      let valB: any = 0;
      
      if (sortFieldBusiness === 'revenueGrowth') {
        valA = a.passport.financials.revenueBaseline ? ((a.passport.financials.revenueCurrent - a.passport.financials.revenueBaseline) / a.passport.financials.revenueBaseline) * 100 : 0;
        valB = b.passport.financials.revenueBaseline ? ((b.passport.financials.revenueCurrent - b.passport.financials.revenueBaseline) / b.passport.financials.revenueBaseline) * 100 : 0;
      } else if (sortFieldBusiness === 'revenueCurrent') {
        valA = a.passport.financials.revenueCurrent;
        valB = b.passport.financials.revenueCurrent;
      } else {
        valA = a[sortFieldBusiness as keyof Participant] || '';
        valB = b[sortFieldBusiness as keyof Participant] || '';
      }

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortAscBusiness ? -1 : 1;
      if (valA > valB) return sortAscBusiness ? 1 : -1;
      return 0;
    });
    return list;
  }, [filteredParticipants, sortFieldBusiness, sortAscBusiness]);

  const paginatedBusinessParticipants = sortedBusinessParticipants.slice(
    (businessPage - 1) * itemsPerPage,
    businessPage * itemsPerPage
  );

  // Selected Individual Participant
  const selectedIndividual = useMemo(() => {
    return participants.find(p => p.id === selectedIndividualId) || participants[0];
  }, [participants, selectedIndividualId]);

  // List of participants for autocomplete search
  const filteredIndividualList = useMemo(() => {
    if (!individualSearch) return participants.slice(0, 10);
    const q = individualSearch.toLowerCase();
    return participants.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.businessName.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [participants, individualSearch]);

  // 5. SECURITY EXPORT CONFIRMATION HANDLER
  const triggerExport = (type: 'pdf' | 'excel', reportName: string) => {
    setPendingExportAction({ type, reportName });
    setSecurityModalOpen(true);
  };

  const handleConfirmExport = () => {
    setSecurityModalOpen(false);
    if (!pendingExportAction) return;

    if (pendingExportAction.type === 'pdf') {
      generateRealPDF(pendingExportAction.reportName);
    } else {
      generateRealExcel(pendingExportAction.reportName);
    }
    
    // Add item to Riwayat export
    const newHistoryItem: ExportHistoryItem = {
      id: `EXP-${Date.now().toString().slice(-4)}`,
      name: pendingExportAction.reportName,
      type: pendingExportAction.reportName.includes('Pembelajaran') ? 'Progress Pembelajaran' : pendingExportAction.reportName.includes('Bisnis') ? 'Progress Bisnis' : 'Laporan Terintegrasi',
      format: pendingExportAction.type === 'pdf' ? 'PDF' : 'Excel',
      period: filterPeriod,
      filtersCount: [filterStage, filterRegion, filterSector, filterClass].filter(f => f !== 'Semua').length,
      participantsCount: filteredParticipants.length,
      createdBy: 'Admin SMEPP Utama',
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'Selesai'
    };
    setExportHistory(prev => [newHistoryItem, ...prev]);
    setPendingExportAction(null);
  };

  // 6. ACTUAL PDF GENERATION (JSPDF + JSPDF-AUTOTABLE)
  const generateRealPDF = (reportName: string) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const timestamp = new Date().toLocaleString('id-ID');
    
    // --- PAGE 1: COVER PAGE ---
    // Background colors and borders
    doc.setFillColor(22, 54, 92); // Deep blue theme #16365C
    doc.rect(0, 0, 210, 297, 'F');
    
    // White overlay box for accent
    doc.setFillColor(255, 255, 255);
    doc.rect(12, 12, 186, 273, 'F');
    
    // Header branding
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(0, 114, 188); // Pertamina Blue #0072BC
    doc.text('PERTAMINA UMK ACADEMY 2026', 20, 45);
    
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(168, 198, 31); // Pertamina Lime #A8C61F
    doc.text('LEARNING & IMPACT MANAGEMENT SYSTEM', 20, 52);
    
    // Thick line
    doc.setDrawColor(22, 54, 92);
    doc.setLineWidth(1.5);
    doc.line(20, 57, 190, 57);
    
    // Report Title
    doc.setFontSize(26);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(22, 54, 92);
    doc.text('LAPORAN EKSEKUTIF', 20, 95);
    
    doc.setFontSize(14);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text(reportName.replace(/_/g, ' '), 20, 105);
    
    // Info details
    doc.setFontSize(10);
    doc.text(`Periode: ${filterPeriod}`, 20, 140);
    doc.text(`Region Terpilih: ${filterRegion}`, 20, 146);
    doc.text(`Sektor Terpilih: ${filterSector}`, 20, 152);
    doc.text(`Tahap Program: ${filterStage}`, 20, 158);
    doc.text(`Jumlah Peserta Tercakup: ${filteredParticipants.length} Pelaku UMK`, 20, 164);
    
    // Bottom Disclaimer & Warning
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('DOKUMEN CONTEXT PROTOKOL SIMULASI PROTOTYPE', 20, 250);
    doc.text('Laporan ini memuat data program yang bersifat rahasia dan hanya ditujukan untuk keperluan internal.', 20, 255);
    doc.text(`Tanggal Cetak: ${timestamp} | Operator: Admin SMEPP Utama`, 20, 260);
    
    // --- PAGE 2: EXECUTIVE SUMMARY ---
    doc.addPage();
    doc.setFillColor(245, 247, 250);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Header
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(22, 54, 92);
    doc.text('EXECUTIVE SUMMARY & FUNNEL PROGRAM', 15, 20);
    
    doc.setFontSize(9);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Dihasilkan pada: ${timestamp} | Filter aktif: ${filterPeriod} | Region: ${filterRegion}`, 15, 25);
    
    // Horizontal divider
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(15, 28, 195, 28);
    
    // KPI Badges Grid (drawn manually)
    doc.setFillColor(255, 255, 255);
    doc.rect(15, 35, 55, 30, 'F');
    doc.rect(77, 35, 55, 30, 'F');
    doc.rect(139, 35, 55, 30, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('TOTAL PESERTA (SCOPE)', 20, 43);
    doc.text('AVG PROG BELAJAR', 82, 43);
    doc.text('PERTUMBUHAN OMZET', 144, 43);
    
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(0, 114, 188);
    doc.text(`${filteredParticipants.length} UMK`, 20, 53);
    doc.text(`${learningKPIs.avgProgress}%`, 82, 53);
    doc.text(`+${businessKPIs.avgGrowth}%`, 144, 53);
    
    // Narrative Box
    doc.setFillColor(230, 242, 250);
    doc.rect(15, 75, 179, 35, 'F');
    doc.setFontSize(10);
    doc.setTextColor(22, 54, 92);
    doc.text('TEMUAN DAN ANALISIS UTAMA (INSIGHT SIMULASI PROTOTYPE):', 20, 83);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    doc.text('- Berdasarkan filter terpilih, terdapat peningkatan adoptasi kanal digital sebanyak 4 item per-UMK.', 20, 91);
    doc.text('- Peserta dengan progres belajar > 75% mencapai target pertumbuhan omzet yang 2x lebih konsisten.', 20, 96);
    doc.text('- Evaluasi TJSL mencatatkan status terverifikasi prima untuk program prioritas Subholding Pertamina.', 20, 101);
    
    // Draw a nice table representing the participants list (Masking NIK as requested)
    const tableData = filteredParticipants.slice(0, 10).map((p, index) => [
      index + 1,
      p.id,
      p.name,
      p.businessName,
      p.region,
      p.sector,
      `${p.learningProgress}%`,
      `Rp ${(p.passport.financials.revenueCurrent / 1000000).toFixed(1)} jt`
    ]);
    
    autoTable(doc, {
      startY: 120,
      head: [['No', 'ID', 'Nama Peserta', 'Nama Usaha', 'Region', 'Sektor', 'Progres Belajar', 'Omzet Terkini']],
      body: tableData,
      theme: 'striped',
      styles: { fontSize: 8, font: 'Helvetica' },
      headStyles: { fillColor: [22, 54, 92], textColor: [255, 255, 255] }
    });
    
    // Add page numbers
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Halaman ${i} dari ${totalPages}`, 105, 287, { align: 'center' });
    }
    
    doc.save(`${reportName}_Juli_2026.pdf`);
  };

  // 7. ACTUAL EXCEL WORKBOOK GENERATION (XLSX - 18 MULTIPLE SHEETS)
  const generateRealExcel = (reportName: string) => {
    const wb = XLSX.utils.book_new();

    // SHEET 1: README
    const readmeData = [
      ['PERTAMINA UMK ACADEMY 2026 - MASTER DATA PACK'],
      ['================================================'],
      ['Laporan:', reportName.replace(/_/g, ' ')],
      ['Tanggal Dibuat:', new Date().toLocaleString('id-ID')],
      ['Oleh:', 'Admin SMEPP / PTC'],
      ['Status:', 'DOKUMEN INTEGRASI SIMULASI PROTOTYPE'],
      [''],
      ['DAFTAR SHEET DATA YANG TERSEDIA:'],
      ['1. README', 'Daftar isi dan metadata ekspor'],
      ['2. Executive_Summary', 'KPI utama pembelajaran & bisnis peserta'],
      ['3. Dashboard_Charts', 'Tabel visualisasi representatif grafis'],
      ['4. Participant_Master', 'Data profil lengkap & masking data sensitif'],
      ['5. Learning_Progress', 'Modul wajib, pretest, post-test & progres'],
      ['6. Attendance', 'Kehadiran webinar & webinar regional'],
      ['7. Challenges', 'Submission tugas & status verifikasi poin'],
      ['8. Assessments', 'Nilai uji pemahaman & kelayakan'],
      ['9. Business_Baseline_Endline', 'Perbandingan baseline & terkini omzet'],
      ['10. Monthly_Business_Update', 'Omzet bulanan, profit & kapasitas'],
      ['11. Certifications', 'Kepemilikan legalitas halal, PIRT, NIB'],
      ['12. Digital_Adoption', 'Adopsi POS, QRIS, Marketplace, Web'],
      ['13. Market_Access', 'Ekspansi lokal, regional, nasional, ekspor'],
      ['14. Sustainability', 'Penerapan green materials & limbah'],
      ['15. Facilitator_Performance', 'Peta pembimbing & akurasi modul'],
      ['16. Risk_Monitoring', 'Status risiko peserta & usulan intervensi'],
      ['17. Data_Quality', 'Akurasi evidence, timestamp & confidence'],
      ['18. Data_Dictionary', 'Kamus data kolom & tipe data terpakai'],
      [''],
      ['Disclaimer: Seluruh data dalam berkas ini merupakan hasil simulasi model untuk keperluan pengujian fungsionalitas sistem.'],
    ];
    const wsReadme = XLSX.utils.aoa_to_sheet(readmeData);
    XLSX.utils.book_append_sheet(wb, wsReadme, 'README');

    // SHEET 2: Executive Summary
    const execData = [
      ['METRIK UTAMA PROGRAM UMK ACADEMY 2026'],
      [''],
      ['Kategori Laporan', 'Nilai Pencapaian', 'Satuan', 'Keterangan'],
      ['Total Peserta Scope', filteredParticipants.length, 'UMK', 'Jumlah binaan aktif terfilter'],
      ['Rata-rata Progres Belajar', learningKPIs.avgProgress, '%', 'Penyelesaian kurikulum wajib'],
      ['Tingkat Kehadiran', learningKPIs.avgAttendance, '%', 'Sesi mentoring regional'],
      ['Peningkatan Rata-rata Omzet', businessKPIs.avgGrowth, '%', 'Komparasi baseline vs kondisi terkini'],
      ['Total Omzet Terkini Grup', businessKPIs.totalCurrentRev, 'IDR', 'Akumulasi total omzet terkini'],
      ['Sertifikasi Baru Lolos', businessKPIs.certificationsCount, 'UMK', 'Mendapatkan legalitas baru selama program'],
      ['Adopsi Digital Baru', businessKPIs.digitalChannelsNew, 'Kanal', 'Penambahan e-commerce & QRIS'],
      ['Implementasi Go Green', businessKPIs.sustainabilityCount, 'UMK', 'Mulai menggunakan produk eco'],
    ];
    const wsExec = XLSX.utils.aoa_to_sheet(execData);
    XLSX.utils.book_append_sheet(wb, wsExec, 'Executive_Summary');

    // SHEET 3: Dashboard_Charts
    const wsCharts = XLSX.utils.json_to_sheet(regionChartData);
    XLSX.utils.book_append_sheet(wb, wsCharts, 'Dashboard_Charts');

    // SHEET 4: Participant_Master (NIK Masked!)
    const masterData = filteredParticipants.map(p => ({
      ID_Peserta: p.id,
      Nama_Owner: p.name,
      Nama_Usaha: p.businessName,
      NIK: p.passport.ownerIdentity?.nik ? p.passport.ownerIdentity.nik.slice(0, 6) + '**********' : '3171**********',
      Gender: p.passport.ownerIdentity?.gender || 'Perempuan',
      No_HP: '081*********', // Masked
      Region: p.region,
      Sektor: p.sector,
      Stage_Program: p.stage,
      Status: p.status,
      Kab_Kota: 'Sesuai Domisili'
    }));
    const wsMaster = XLSX.utils.json_to_sheet(masterData);
    XLSX.utils.book_append_sheet(wb, wsMaster, 'Participant_Master');

    // SHEET 5: Learning Progress
    const learningData = filteredParticipants.map(p => ({
      ID_Peserta: p.id,
      Nama_Usaha: p.businessName,
      Learning_Progress: `${p.learningProgress}%`,
      Total_Modul_Wajib: 10,
      Modul_Selesai: Math.round(p.learningProgress / 10),
      Poin_Tantangan: p.challengePoints,
      Terakhir_Masuk: p.lastLogin
    }));
    const wsLearning = XLSX.utils.json_to_sheet(learningData);
    XLSX.utils.book_append_sheet(wb, wsLearning, 'Learning_Progress');

    // SHEET 6: Attendance
    const attData = filteredParticipants.map(p => ({
      ID_Peserta: p.id,
      Nama_Usaha: p.businessName,
      Kehadiran_Mentoring: `${p.attendanceRate}%`,
      Sesi_Wajib: 8,
      Sesi_Hadir: Math.round(p.attendanceRate / 12.5)
    }));
    const wsAtt = XLSX.utils.json_to_sheet(attData);
    XLSX.utils.book_append_sheet(wb, wsAtt, 'Attendance');

    // SHEET 7: Challenges
    const challengesData = filteredParticipants.map(p => ({
      ID_Peserta: p.id,
      Nama_Usaha: p.businessName,
      Challenge_Poin: p.challengePoints,
      SOP_Produksi: p.challengePoints > 150 ? 'Lolos' : 'Revisi',
      Pemasaran_Kreatif: p.challengePoints > 200 ? 'Lolos' : 'Belum Mulai'
    }));
    const wsChallenges = XLSX.utils.json_to_sheet(challengesData);
    XLSX.utils.book_append_sheet(wb, wsChallenges, 'Challenges');

    // SHEET 8: Assessments
    const assData = filteredParticipants.map(p => ({
      ID_Peserta: p.id,
      Nama_Usaha: p.businessName,
      Nilai_Pre_Test: 65,
      Nilai_Post_Test: p.learningProgress > 80 ? 90 : 75,
      Average_Score: p.overallScore || 82,
      Status_Kelulusan: p.learningProgress >= 75 ? 'Lulus' : 'Belum Lulus'
    }));
    const wsAss = XLSX.utils.json_to_sheet(assData);
    XLSX.utils.book_append_sheet(wb, wsAss, 'Assessments');

    // SHEET 9: Business_Baseline_Endline
    const busBaseData = filteredParticipants.map(p => ({
      ID_Peserta: p.id,
      Nama_Usaha: p.businessName,
      Omzet_Baseline: p.passport.financials.revenueBaseline,
      Omzet_Terkini: p.passport.financials.revenueCurrent,
      Pertumbuhan_Omzet: `${p.passport.financials.revenueBaseline ? (((p.passport.financials.revenueCurrent - p.passport.financials.revenueBaseline) / p.passport.financials.revenueBaseline) * 100).toFixed(1) : 0}%`
    }));
    const wsBusBase = XLSX.utils.json_to_sheet(busBaseData);
    XLSX.utils.book_append_sheet(wb, wsBusBase, 'Business_Baseline_Endline');

    // SHEET 10: Monthly_Business_Update
    const monthlyData = filteredParticipants.map(p => ({
      ID_Peserta: p.id,
      Nama_Usaha: p.businessName,
      Profit_Baseline: p.passport.financials.profitBaseline,
      Profit_Terkini: p.passport.financials.profitCurrent,
      Kapasitas_Baseline_Kg: 100,
      Kapasitas_Terkini_Kg: 150
    }));
    const wsMonthly = XLSX.utils.json_to_sheet(monthlyData);
    XLSX.utils.book_append_sheet(wb, wsMonthly, 'Monthly_Business_Update');

    // SHEET 11: Certifications
    const certsData = filteredParticipants.map(p => ({
      ID_Peserta: p.id,
      Nama_Usaha: p.businessName,
      Sertifikasi_Halal: p.passport.certifications?.some(c => c.name.includes('Halal')) ? 'Ada' : 'Proses',
      Sertifikasi_NIB: 'Ada',
      PIRT: p.passport.certifications?.some(c => c.name.includes('PIRT')) ? 'Ada' : 'Belum'
    }));
    const wsCerts = XLSX.utils.json_to_sheet(certsData);
    XLSX.utils.book_append_sheet(wb, wsCerts, 'Certifications');

    // SHEET 12: Digital Adoption
    const digData = filteredParticipants.map(p => ({
      ID_Peserta: p.id,
      Nama_Usaha: p.businessName,
      POS: p.passport.financials.usePOS ? 'Aktif' : 'Non-Aktif',
      QRIS: p.passport.financials.useQRIS ? 'Aktif' : 'Non-Aktif',
      Marketplace: p.passport.financials.digitalChannelsCurrent >= 3 ? 'Aktif' : 'Non-Aktif',
      Social_Commerce: p.passport.financials.digitalChannelsCurrent >= 1 ? 'Aktif' : 'Non-Aktif'
    }));
    const wsDig = XLSX.utils.json_to_sheet(digData);
    XLSX.utils.book_append_sheet(wb, wsDig, 'Digital_Adoption');

    // SHEET 13: Market Access
    const marketDataExcel = filteredParticipants.map(p => ({
      ID_Peserta: p.id,
      Nama_Usaha: p.businessName,
      Jangkauan_Pasar: p.passport.marketArea || 'Nasional',
      Buyer_Baru: p.id === 'P001' ? 3 : 1,
      Pameran_Terbuka: p.isRecommendedSMEXPO ? 'Ya (SMEXPO)' : 'Tidak'
    }));
    const wsMarket = XLSX.utils.json_to_sheet(marketDataExcel);
    XLSX.utils.book_append_sheet(wb, wsMarket, 'Market_Access');

    // SHEET 14: Sustainability
    const susData = filteredParticipants.map(p => ({
      ID_Peserta: p.id,
      Nama_Usaha: p.businessName,
      Waste_Management: p.passport.sustainability?.wasteManagement || 'Didaur ulang',
      Eco_Materials: p.passport.sustainability?.ecoMaterials || 'Ya',
      Energy_Saving: p.passport.sustainability?.energySaving || 'Ya'
    }));
    const wsSus = XLSX.utils.json_to_sheet(susData);
    XLSX.utils.book_append_sheet(wb, wsSus, 'Sustainability');

    // SHEET 15: Facilitator Performance
    const facData = filteredParticipants.map(p => ({
      ID_Peserta: p.id,
      Nama_Usaha: p.businessName,
      Fasilitator: 'Andi Pratama (Coach)',
      Feedback_Challenge: 'Sangat Baik, bukti legalitas lengkap',
      Akurasi_Review_Hari: 1.2
    }));
    const wsFac = XLSX.utils.json_to_sheet(facData);
    XLSX.utils.book_append_sheet(wb, wsFac, 'Facilitator_Performance');

    // SHEET 16: Risk Monitoring
    const riskData = filteredParticipants.map(p => ({
      ID_Peserta: p.id,
      Nama_Usaha: p.businessName,
      Status_Risiko: p.riskStatus,
      Alasan_Risiko: p.riskStatus === 'Berisiko' ? 'Kehadiran < 50% & modul terlambat' : 'Aman',
      Usulan_Intervensi: p.riskStatus === 'Berisiko' ? 'Panggilan Coach & pendampingan 1-on-1' : 'Lanjutkan'
    }));
    const wsRisk = XLSX.utils.json_to_sheet(riskData);
    XLSX.utils.book_append_sheet(wb, wsRisk, 'Risk_Monitoring');

    // SHEET 17: Data Quality
    const qualityData = filteredParticipants.map(p => ({
      ID_Peserta: p.id,
      Nama_Usaha: p.businessName,
      Data_Confidence_Level: `${p.passport.dataConfidenceLevel || 92}%`,
      Evidence_Kelayakan: 'Lengkap (PDF/NIB)',
      Timestamp_Last_Update: p.lastLogin
    }));
    const wsQuality = XLSX.utils.json_to_sheet(qualityData);
    XLSX.utils.book_append_sheet(wb, wsQuality, 'Data_Quality');

    // SHEET 18: Data Dictionary
    const dictData = [
      { Kolom: 'ID_Peserta', Definisi: 'ID unik pendaftaran peserta', Tipe: 'Alfanumerik', Nilai: 'P001 - P999' },
      { Kolom: 'Nama_Owner', Definisi: 'Nama lengkap pemilik UMK', Tipe: 'Teks', Nilai: 'Sesuai KTP' },
      { Kolom: 'Nama_Usaha', Definisi: 'Nama komersial entitas UMK', Tipe: 'Teks', Nilai: 'Bebas' },
      { Kolom: 'Learning_Progress', Definisi: 'Persentase penyelesaian modul belajar', Tipe: 'Persentase', Nilai: '0% - 100%' },
      { Kolom: 'Omzet_Terkini', Definisi: 'Omzet terbaru yang dilaporkan oleh peserta', Tipe: 'Mata Uang', Nilai: 'Indonesian Rupiah' },
      { Kolom: 'Status_Risiko', Definisi: 'Tingkat risiko kelangsungan keaktifan peserta', Tipe: 'Kategori', Nilai: 'Aman, Perlu Perhatian, Berisiko' },
    ];
    const wsDict = XLSX.utils.json_to_sheet(dictData);
    XLSX.utils.book_append_sheet(wb, wsDict, 'Data_Dictionary');

    // Write file
    XLSX.writeFile(wb, `${reportName}_Juli_2026.xlsx`);
  };

  // 8. REPORT BUILDER WORKFLOW SIMULATOR
  const runReportBuilderSimulation = () => {
    setIsBuildingReport(true);
    setBuilderStep(5); // Show progress step
    
    const messages = [
      'Menyiapkan data peserta...',
      'Membuat grafik pertumbuhan dan peta regional...',
      'Menyusun kerangka laporan...',
      'Menerapkan enkripsi masking data pribadi...',
      'Laporan siap diunduh!'
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setBuilderProgress(currentProgress);
      const msgIndex = Math.min(Math.floor(currentProgress / 20) - 1, messages.length - 1);
      setBuilderStatusMessage(messages[msgIndex]);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsBuildingReport(false);
      }
    }, 1000);
  };

  const downloadBuilderReport = (format: 'pdf' | 'excel') => {
    const safeName = `UMK_Academy_${builderType.replace(/\s+/g, '_')}_Laporan`;
    triggerExport(format, safeName);
  };

  return (
    <div className="space-y-6 font-sans text-[#16365C]">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-black flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-[#0072BC]" />
            Laporan & Export Data Program
          </h2>
          <p className="text-xs text-gray-500 mt-1">Konsol pelaporan komprehensif, ekspor instan data master pembelajaran & kemajuan bisnis pelaku UMK untuk Admin SMEPP / PTC</p>
        </div>

        {/* WORKSPACE SUB-TABS */}
        <div className="flex flex-wrap bg-gray-100 p-1.5 rounded-xl gap-1">
          <button
            onClick={() => setActiveWorkspaceTab('dashboard')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeWorkspaceTab === 'dashboard' ? 'bg-[#16365C] text-white shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Dashboard Laporan
          </button>
          <button
            onClick={() => setActiveWorkspaceTab('builder')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeWorkspaceTab === 'builder' ? 'bg-[#16365C] text-white shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Report Builder
          </button>
          <button
            onClick={() => setActiveWorkspaceTab('individual')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeWorkspaceTab === 'individual' ? 'bg-[#16365C] text-white shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Laporan Individual Peserta
          </button>
          <button
            onClick={() => setActiveWorkspaceTab('riwayat')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
              activeWorkspaceTab === 'riwayat' ? 'bg-[#16365C] text-white shadow' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span>Riwayat Export</span>
            <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-[9px] flex items-center justify-center font-bold">
              {exportHistory.length}
            </span>
          </button>
        </div>
      </div>

      {/* GLOBAL FILTER BAR */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-2.5">
          <div className="flex items-center space-x-2">
            <Filter className="h-4.5 w-4.5 text-[#0072BC]" />
            <h3 className="text-sm font-bold text-[#16365C]">Global Filter Pelaporan</h3>
          </div>
          <span className="text-[11px] font-bold text-[#A8C61F] bg-green-50 px-3 py-0.5 rounded-full border border-green-200">
            {totalInScope} UMK Terpilih dari {participants.length} Terdaftar
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="text-gray-400 font-bold block mb-1">Periode Program</label>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="w-full p-2 border rounded-xl bg-gray-50 text-gray-800 font-semibold focus:outline-none focus:border-[#0072BC]"
            >
              <option value="UMK Academy 2026 Full Cycle">UMK Academy 2026 Full</option>
              <option value="Kuartal I 2026">Kuartal I 2026</option>
              <option value="Kuartal II 2026">Kuartal II 2026</option>
              <option value="Kuartal III 2026">Kuartal III 2026</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 font-bold block mb-1">Tahap Program</label>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="w-full p-2 border rounded-xl bg-gray-50 text-gray-800 font-semibold focus:outline-none focus:border-[#0072BC]"
            >
              <option value="Semua">Semua Tahap</option>
              <option value="Pendaftaran">Pendaftaran & Verifikasi</option>
              <option value="Pembinaan Regional">Pembinaan Regional</option>
              <option value="Kurasi Nasional">Kurasi Nasional</option>
              <option value="Pembinaan Nasional">Pembinaan Nasional</option>
              <option value="Seleksi Akhir">Seleksi Akhir</option>
              <option value="Inaugurasi">Inaugurasi & Champions</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 font-bold block mb-1">Region</label>
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="w-full p-2 border rounded-xl bg-gray-50 text-gray-800 font-semibold focus:outline-none focus:border-[#0072BC]"
            >
              <option value="Semua">Semua Region</option>
              <option value="Jawa Tengah">Jawa Tengah</option>
              <option value="Jawa Barat">Jawa Barat</option>
              <option value="Jawa Timur">Jawa Timur</option>
              <option value="Sumatera">Sumatera</option>
              <option value="Kalimantan">Kalimantan</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 font-bold block mb-1">Sektor Usaha</label>
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="w-full p-2 border rounded-xl bg-gray-50 text-gray-800 font-semibold focus:outline-none focus:border-[#0072BC]"
            >
              <option value="Semua">Semua Sektor</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Fesyen & Tekstil">Fesyen & Tekstil</option>
              <option value="Craft / Kerajinan">Craft / Kerajinan</option>
              <option value="Agribisnis">Agribisnis</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 font-bold block mb-1">Status Keaktifan</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-2 border rounded-xl bg-gray-50 text-gray-800 font-semibold focus:outline-none focus:border-[#0072BC]"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Perlu Perhatian">Perlu Perhatian</option>
              <option value="Berisiko">Berisiko</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 font-bold block mb-1">Binaan TJSL</label>
            <select
              value={filterTJSL}
              onChange={(e) => setFilterTJSL(e.target.value)}
              className="w-full p-2 border rounded-xl bg-gray-50 text-gray-800 font-semibold focus:outline-none focus:border-[#0072BC]"
            >
              <option value="Semua">Semua Status Binaan</option>
              <option value="Terverifikasi">Terverifikasi</option>
              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              <option value="Perlu Klarifikasi">Perlu Klarifikasi</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center pt-2.5 border-t border-gray-100 gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari ID, Nama Owner, atau Nama Usaha..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 border rounded-xl bg-gray-50 text-xs focus:outline-none focus:border-[#0072BC]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleResetFilters}
              className="flex-1 sm:flex-initial px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs font-bold"
            >
              Reset Filter
            </button>
            <button
              onClick={() => triggerExport('pdf', 'UMK_Academy_Laporan_Eksekutif')}
              className="flex-1 sm:flex-initial px-4 py-2 bg-[#ED1B2F] hover:bg-[#ED1B2F]/90 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <FileDown className="h-4 w-4" />
              <span>Ekspor PDF</span>
            </button>
            <button
              onClick={() => triggerExport('excel', 'UMK_Academy_Integrated_Data_Pack')}
              className="flex-1 sm:flex-initial px-4 py-2 bg-[#A8C61F] hover:bg-[#A8C61F]/90 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Ekspor Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================================== */}
      {/* TAB A: DASHBOARD LAPORAN */}
      {/* ========================================================================================== */}
      {activeWorkspaceTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Dashboard Sub-tabs switcher */}
          <div className="flex border-b border-gray-200 gap-6">
            <button
              onClick={() => setActiveDashboardTab('learning')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                activeDashboardTab === 'learning' ? 'border-[#0072BC] text-[#0072BC]' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Progress Pembelajaran
            </button>
            <button
              onClick={() => setActiveDashboardTab('business')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                activeDashboardTab === 'business' ? 'border-[#0072BC] text-[#0072BC]' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Progress Bisnis Peserta
            </button>
            <button
              onClick={() => setActiveDashboardTab('integrated')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                activeDashboardTab === 'integrated' ? 'border-[#0072BC] text-[#0072BC]' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Ringkasan Terintegrasi
            </button>
          </div>

          {/* DYNAMIC VIEWPORTS */}
          {activeDashboardTab === 'learning' && (
            <div className="space-y-6">
              {/* Learning KPI cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Total Peserta</span>
                  <span className="text-xl font-extrabold text-[#16365C] block mt-1">{learningKPIs.totalParticipants}</span>
                  <span className="text-[9px] text-green-500 font-semibold flex items-center gap-0.5 mt-1">✓ Aktif Terfilter</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Avg Progress Belajar</span>
                  <span className="text-xl font-extrabold text-[#0072BC] block mt-1">{learningKPIs.avgProgress}%</span>
                  <div className="w-full h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#0072BC] h-full" style={{ width: `${learningKPIs.avgProgress}%` }}></div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Avg Kehadiran Kelas</span>
                  <span className="text-xl font-extrabold text-green-600 block mt-1">{learningKPIs.avgAttendance}%</span>
                  <div className="w-full h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: `${learningKPIs.avgAttendance}%` }}></div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Passing Grade UMK</span>
                  <span className="text-xl font-extrabold text-amber-500 block mt-1">{learningKPIs.passingGradeCount} UMK</span>
                  <span className="text-[9px] text-gray-400 font-medium block mt-1">Progres &gt;= 75%</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Tingkat Risiko</span>
                  <span className="text-xl font-extrabold text-red-500 block mt-1">{learningKPIs.riskCount} UMK</span>
                  <span className="text-[9px] text-gray-400 block mt-1">Perlu Intervensi</span>
                </div>
              </div>

              {/* Learning Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Progres per region */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase">Progres Pembelajaran per Region</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={regionChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Bar dataKey="Rata-rata Progres (%)" fill="#0072BC" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Progres per Sektor */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase">Omzet Growth vs Sektor Usaha</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sectorChartData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 9 }} />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={100} />
                        <Tooltip />
                        <Bar dataKey="Rata-rata Pertumbuhan Omzet (%)" fill="#A8C61F" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. Risk Levels */}
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase">Distribusi Risk Level Peserta</h4>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={riskAdoptionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {riskAdoptionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Learning Participant Table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50/50 border-b flex justify-between items-center flex-wrap gap-2">
                  <span className="text-xs font-bold text-[#16365C]">Data Mentah Pembelajaran Peserta</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={sortFieldLearning}
                      onChange={(e) => setSortFieldLearning(e.target.value)}
                      className="p-1 border rounded-lg text-[11px] bg-white text-gray-700"
                    >
                      <option value="learningProgress">Urut Progress Belajar</option>
                      <option value="attendanceRate">Urut Kehadiran</option>
                      <option value="challengePoints">Urut Poin Tantangan</option>
                    </select>
                    <button
                      onClick={() => setSortAscLearning(!sortAscLearning)}
                      className="p-1 border rounded-lg text-gray-500 bg-white"
                      title="Balik Urutan"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100/60 text-gray-400 font-bold uppercase text-[9px] border-b">
                      <tr>
                        <th className="p-3">ID / Nama Usaha</th>
                        <th className="p-3">Pemilik</th>
                        <th className="p-3">Region / Sektor</th>
                        <th className="p-3 text-center">Progress Belajar</th>
                        <th className="p-3 text-center">Kehadiran</th>
                        <th className="p-3 text-center">Tantangan</th>
                        <th className="p-3">Fasilitator</th>
                        <th className="p-3 text-center">Risiko</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-gray-700 font-medium">
                      {paginatedLearningParticipants.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50/50">
                          <td className="p-3">
                            <span className="font-bold text-[#16365C] block">{p.businessName}</span>
                            <span className="text-[9px] text-gray-400 font-mono block">{p.id}</span>
                          </td>
                          <td className="p-3">{p.name}</td>
                          <td className="p-3">
                            <span className="block text-gray-600">{p.region}</span>
                            <span className="text-[10px] text-gray-400 block">{p.sector}</span>
                          </td>
                          <td className="p-3 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              p.learningProgress === 100 ? 'bg-green-100 text-green-800' :
                              p.learningProgress >= 50 ? 'bg-blue-100 text-[#0072BC]' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {p.learningProgress}%
                            </span>
                          </td>
                          <td className="p-3 text-center font-bold text-gray-600">{p.attendanceRate}%</td>
                          <td className="p-3 text-center font-bold text-green-600">{p.challengePoints} Poin</td>
                          <td className="p-3 text-gray-500">Andi Pratama</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                              p.riskStatus === 'Aman' ? 'bg-green-100 text-green-800' :
                              p.riskStatus === 'Perlu Perhatian' ? 'bg-blue-100 text-[#0072BC]' :
                              p.riskStatus === 'Berisiko' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {p.riskStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 border-t bg-gray-50/20 flex justify-between items-center text-xs">
                  <span className="text-gray-400">
                    Menampilkan {Math.min(learningPage * itemsPerPage, totalInScope)} dari {totalInScope} data
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLearningPage(prev => Math.max(prev - 1, 1))}
                      disabled={learningPage === 1}
                      className="px-2 py-1 border rounded bg-white text-gray-600 disabled:opacity-40"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={() => setLearningPage(prev => prev + 1)}
                      disabled={learningPage * itemsPerPage >= totalInScope}
                      className="px-2 py-1 border rounded bg-white text-gray-600 disabled:opacity-40"
                    >
                      Lanjut
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDashboardTab === 'business' && (
            <div className="space-y-6">
              {/* Business KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Avg Pertumbuhan Omzet</span>
                  <span className="text-xl font-extrabold text-[#A8C61F] block mt-1">+{businessKPIs.avgGrowth}%</span>
                  <span className="text-[9px] text-green-500 font-semibold block mt-1">✓ Berdasarkan Baseline</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Penyerapan Tenaga Kerja</span>
                  <span className="text-xl font-extrabold text-[#16365C] block mt-1">+{businessKPIs.employmentGrowth} Orang</span>
                  <span className="text-[9px] text-gray-400 font-medium block mt-1">Total {businessKPIs.employmentCurrent} Karyawan</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Adopsi Digital Baru</span>
                  <span className="text-xl font-extrabold text-[#0072BC] block mt-1">{businessKPIs.digitalChannelsNew} UMK</span>
                  <span className="text-[9px] text-gray-400 font-medium block mt-1">POS & QRIS Baru</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">UMK Go Green</span>
                  <span className="text-xl font-extrabold text-green-600 block mt-1">{businessKPIs.sustainabilityCount} UMK</span>
                  <span className="text-[9px] text-gray-400 block mt-1">Eco-materials & limbah</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <span className="text-[10px] text-gray-400 block font-bold uppercase">Sertifikasi Legalitas</span>
                  <span className="text-xl font-extrabold text-[#ED1B2F] block mt-1">{businessKPIs.certificationsCount} UMK</span>
                  <span className="text-[9px] text-gray-400 block mt-1">Halal, PIRT, NIB</span>
                </div>
              </div>

              {/* Business Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase">Rencana Adopsi Fitur Digital (Sebelum vs Terkini)</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={digitalAdoptionData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Sebelum" fill="#A1A1AA" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Terkini" fill="#0072BC" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase">Pertumbuhan Omzet Terkini vs Sektor</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sectorChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Bar dataKey="Jumlah Peserta" fill="#A8C61F" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Business Progress Table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50/50 border-b flex justify-between items-center flex-wrap gap-2">
                  <span className="text-xs font-bold text-[#16365C]">Data Perkembangan Bisnis UMK</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={sortFieldBusiness}
                      onChange={(e) => setSortFieldBusiness(e.target.value)}
                      className="p-1 border rounded-lg text-[11px] bg-white text-gray-700"
                    >
                      <option value="revenueGrowth">Urut Pertumbuhan Omzet</option>
                      <option value="revenueCurrent">Urut Omzet Terkini</option>
                    </select>
                    <button
                      onClick={() => setSortAscBusiness(!sortAscBusiness)}
                      className="p-1 border rounded-lg text-gray-500 bg-white"
                    >
                      <RefreshCw className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100/60 text-gray-400 font-bold uppercase text-[9px] border-b">
                      <tr>
                        <th className="p-3">Nama Usaha / ID</th>
                        <th className="p-3">Region / Sektor</th>
                        <th className="p-3 text-right">Omzet Baseline</th>
                        <th className="p-3 text-right">Omzet Terkini</th>
                        <th className="p-3 text-center">Pertumbuhan</th>
                        <th className="p-3 text-center">TK (B/C)</th>
                        <th className="p-3 text-center">Sertifikasi</th>
                        <th className="p-3 text-center">Go Green</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y text-gray-700 font-medium">
                      {paginatedBusinessParticipants.map(p => {
                        const growth = p.passport.financials.revenueBaseline ? 
                          ((p.passport.financials.revenueCurrent - p.passport.financials.revenueBaseline) / p.passport.financials.revenueBaseline) * 100 : 0;
                        return (
                          <tr key={p.id} className="hover:bg-gray-50/50">
                            <td className="p-3">
                              <span className="font-bold text-[#16365C] block">{p.businessName}</span>
                              <span className="text-[9px] text-gray-400 font-mono block">{p.id}</span>
                            </td>
                            <td className="p-3">
                              <span className="block text-gray-600">{p.region}</span>
                              <span className="text-[10px] text-gray-400 block">{p.sector}</span>
                            </td>
                            <td className="p-3 text-right text-gray-500">Rp {(p.passport.financials.revenueBaseline / 1000000).toFixed(1)} jt</td>
                            <td className="p-3 text-right font-bold text-[#16365C]">Rp {(p.passport.financials.revenueCurrent / 1000000).toFixed(1)} jt</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                growth >= 20 ? 'bg-green-100 text-green-800' :
                                growth > 0 ? 'bg-blue-100 text-[#0072BC]' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                +{growth.toFixed(1)}%
                              </span>
                            </td>
                            <td className="p-3 text-center font-bold">{p.passport.financials.employeesBaseline} / {p.passport.financials.employeesCurrent}</td>
                            <td className="p-3 text-center text-[10px]">
                              {p.passport.certifications?.some(c => c.status === 'Terverifikasi') ? '✓ Terverifikasi' : 'Dalam Proses'}
                            </td>
                            <td className="p-3 text-center">
                              <span className="text-green-600 font-extrabold">✓</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 border-t bg-gray-50/20 flex justify-between items-center text-xs">
                  <span className="text-gray-400">
                    Menampilkan {Math.min(businessPage * itemsPerPage, totalInScope)} dari {totalInScope} data
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBusinessPage(prev => Math.max(prev - 1, 1))}
                      disabled={businessPage === 1}
                      className="px-2 py-1 border rounded bg-white text-gray-600 disabled:opacity-40"
                    >
                      Kembali
                    </button>
                    <button
                      onClick={() => setBusinessPage(prev => prev + 1)}
                      disabled={businessPage * itemsPerPage >= totalInScope}
                      className="px-2 py-1 border rounded bg-white text-gray-600 disabled:opacity-40"
                    >
                      Lanjut
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDashboardTab === 'integrated' && (
            <div className="space-y-6">
              {/* Laporan Terintegrasi Main Panel */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-[#16365C]">Analisis Korelasi: Progres Pembelajaran vs Pertumbuhan Omzet</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Analisis kuantitatif mengukur keterkaitan antara kurikulum kelas dengan performansi bisnis UMK di lapangan</p>
                </div>

                <div className="h-80 w-full bg-gray-50 rounded-xl p-3 border">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid />
                      <XAxis type="number" dataKey="learningProgress" name="Progres Belajar" unit="%" />
                      <YAxis type="number" dataKey="revenueGrowth" name="Pertumbuhan Omzet" unit="%" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="UMK Academy 2026" data={scatterPlotData} fill="#0072BC" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>

                {/* Insight Panel (Insight Simulasi Prototype) */}
                <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-100 space-y-1">
                  <h5 className="text-xs font-bold text-[#0072BC] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    Insight Simulasi Prototype
                  </h5>
                  <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                    Peserta dengan progres pembelajaran di atas 75% menunjukkan rata-rata pertumbuhan omzet yang 42% lebih tinggi dibanding peserta dengan progres di bawah 50%. Hal ini mensimulasikan korelasi positif yang nyata antara kepatuhan modul pembelajaran UMK Academy 2026 terhadap kinerja profit usaha.
                  </p>
                </div>
              </div>

              {/* Comprehensive integrated details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase">Metrik Kelayakan & SROI Readiness</h4>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-gray-500 font-bold">Kesiapan Data SROI</span>
                      <span className="text-green-600 font-extrabold">95% (Sangat Layak)</span>
                    </div>
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-gray-500 font-bold">Rata-rata Tingkat Kepercayaan Data</span>
                      <span className="text-[#0072BC] font-extrabold">92.4%</span>
                    </div>
                    <div className="flex justify-between border-b pb-1.5">
                      <span className="text-gray-500 font-bold">Kelengkapan Bukti Fisik (Evidence)</span>
                      <span className="text-gray-700 font-bold">88.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold">Proyeksi Kelulusan (Passing Grade)</span>
                      <span className="text-amber-500 font-extrabold">120 Peserta Regional</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-gray-500 uppercase">Intervensi Tambahan Peserta Berisiko</h4>
                  <div className="space-y-2">
                    <p className="text-[11px] text-gray-400">Daftar region dengan tingkat ketidakaktifan tinggi yang memerlukan pemanggilan khusus:</p>
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg text-xs font-semibold text-red-800">
                      <span>Kalimantan - Avg Attendance 54%</span>
                      <span>3 UMK Berisiko</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg text-xs font-semibold text-orange-800">
                      <span>Sumatera - Progres Modul Lambat</span>
                      <span>2 UMK Perhatian</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================================== */}
      {/* TAB B: REPORT BUILDER */}
      {/* ========================================================================================== */}
      {activeWorkspaceTab === 'builder' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="border-b pb-4">
            <h3 className="text-base font-bold text-[#16365C]">Interactive Report Builder</h3>
            <p className="text-xs text-gray-400 mt-1">Konfigurasikan dan bangun bundel ekspor laporan kustom secara instan</p>
          </div>

          {/* Steps tracker */}
          <div className="flex justify-between items-center max-w-lg mx-auto">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center space-x-1.5">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  builderStep === s ? 'bg-[#0072BC] text-white ring-2 ring-blue-100' :
                  builderStep > s ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                }`}>
                  {builderStep > s ? '✓' : s}
                </div>
                {s < 5 && <div className="h-0.5 w-6 md:w-12 bg-gray-200"></div>}
              </div>
            ))}
          </div>

          {/* STEP 1: Pilih Jenis Laporan */}
          {builderStep === 1 && (
            <div className="space-y-4 pt-4 max-w-xl mx-auto">
              <h4 className="text-sm font-bold text-[#16365C] text-center">Langkah 1: Pilih Jenis Laporan Utama</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { title: 'Laporan Terintegrasi', desc: 'Gabungan data pembelajaran dan omset bisnis' },
                  { title: 'Progress Pembelajaran', desc: 'KPI modul, kehadiran & performa fasilitator' },
                  { title: 'Progress Bisnis', desc: 'Baseline vs omzet terkini, digitalisasi & sertifikasi' },
                  { title: 'Laporan Individual Peserta', desc: 'Rapor lengkap performa satu pelaku UMK' }
                ].map((t) => (
                  <button
                    key={t.title}
                    onClick={() => setBuilderType(t.title)}
                    className={`p-4 rounded-xl border text-left transition ${
                      builderType === t.title ? 'border-[#0072BC] bg-blue-50/25 shadow-sm ring-1 ring-[#0072BC]' : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xs font-bold text-gray-800 block">{t.title}</span>
                    <span className="text-[10px] text-gray-400 block mt-1">{t.desc}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setBuilderStep(2)}
                  className="px-4 py-2 bg-[#0072BC] hover:bg-[#0072BC]/90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Lanjutkan</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Pilih Periode dan Filter */}
          {builderStep === 2 && (
            <div className="space-y-4 pt-4 max-w-xl mx-auto">
              <h4 className="text-sm font-bold text-[#16365C] text-center">Langkah 2: Konfirmasi Cakupan Filter</h4>
              <div className="bg-gray-50 p-4 rounded-xl border space-y-2.5 text-xs text-gray-600">
                <p className="font-semibold text-gray-700">Filter Aktif Saat Ini:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div><strong>Periode:</strong> {filterPeriod}</div>
                  <div><strong>Region:</strong> {filterRegion}</div>
                  <div><strong>Sektor:</strong> {filterSector}</div>
                  <div><strong>Tahap Program:</strong> {filterStage}</div>
                </div>
                <p className="text-[11px] text-gray-400 pt-1.5">Laporan akan secara dinamis menyertakan <strong>{filteredParticipants.length} pelaku UMK</strong> yang lolos kriteria di atas.</p>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setBuilderStep(1)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-gray-500"
                >
                  Kembali
                </button>
                <button
                  onClick={() => setBuilderStep(3)}
                  className="px-4 py-2 bg-[#0072BC] hover:bg-[#0072BC]/90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Lanjutkan</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Pilih Komponen Laporan */}
          {builderStep === 3 && (
            <div className="space-y-4 pt-4 max-w-xl mx-auto">
              <h4 className="text-sm font-bold text-[#16365C] text-center">Langkah 3: Pilih Komponen Konten Laporan</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.keys(builderComponents).map((key) => (
                  <label key={key} className="flex items-center space-x-2 p-2.5 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={builderComponents[key as keyof typeof builderComponents]}
                      onChange={(e) => setBuilderComponents({ ...builderComponents, [key]: e.target.checked })}
                      className="rounded border-gray-300 text-[#0072BC] focus:ring-[#0072BC]"
                    />
                    <span className="capitalize font-semibold text-gray-700">{key.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setBuilderStep(2)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-gray-500"
                >
                  Kembali
                </button>
                <button
                  onClick={() => setBuilderStep(4)}
                  className="px-4 py-2 bg-[#0072BC] hover:bg-[#0072BC]/90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Lanjutkan</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Pilih Format & Run */}
          {builderStep === 4 && (
            <div className="space-y-4 pt-4 max-w-xl mx-auto text-center">
              <h4 className="text-sm font-bold text-[#16365C]">Langkah 4: Pilih Format Ekspor Akhir</h4>
              
              <div className="flex justify-center gap-4">
                {['PDF', 'Excel', 'PDF + Excel'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setBuilderFormat(f as any)}
                    className={`px-6 py-4 rounded-xl border font-bold text-xs transition ${
                      builderFormat === f ? 'border-[#0072BC] bg-blue-50 text-[#0072BC] shadow-sm' : 'border-gray-200 hover:bg-gray-50 text-gray-500'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 text-[11px] text-amber-800 text-left leading-relaxed">
                <strong>Catatan Keamanan:</strong> Laporan yang dihasilkan memuat NIK dan data omset yang di-masking untuk keamanan publik. Pastikan dokumen hanya didistribusikan kepada pihak berwenang di lingkungan Pertamina SMEPP.
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setBuilderStep(3)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-gray-500"
                >
                  Kembali
                </button>
                <button
                  onClick={runReportBuilderSimulation}
                  className="px-6 py-2.5 bg-[#ED1B2F] hover:bg-[#ED1B2F]/90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <Send className="h-4 w-4" />
                  <span>Generate Laporan</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Progress State & Downloads */}
          {builderStep === 5 && (
            <div className="space-y-6 pt-4 max-w-md mx-auto text-center">
              <h4 className="text-sm font-bold text-[#16365C]">Penyusunan Berkas Laporan Kustom</h4>
              
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#A8C61F] h-full transition-all duration-500"
                  style={{ width: `${builderProgress}%` }}
                ></div>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p className="font-bold text-gray-700">{builderStatusMessage}</p>
                <p>Status: {builderProgress}% Selesai</p>
              </div>

              {builderProgress >= 100 && (
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 space-y-3 animate-fade-in">
                  <p className="text-xs text-green-800 font-bold">✓ Laporan Kustom Berhasil Disusun!</p>
                  <div className="flex gap-2 justify-center">
                    {(builderFormat === 'PDF' || builderFormat === 'PDF + Excel') && (
                      <button
                        onClick={() => downloadBuilderReport('pdf')}
                        className="px-4 py-2 bg-[#ED1B2F] hover:bg-[#ED1B2F]/90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <FileDown className="h-4 w-4" />
                        <span>Unduh PDF</span>
                      </button>
                    )}
                    {(builderFormat === 'Excel' || builderFormat === 'PDF + Excel') && (
                      <button
                        onClick={() => downloadBuilderReport('excel')}
                        className="px-4 py-2 bg-[#A8C61F] hover:bg-[#A8C61F]/90 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <FileSpreadsheet className="h-4 w-4" />
                        <span>Unduh Excel</span>
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => { setBuilderStep(1); setBuilderProgress(0); }}
                    className="text-[11px] text-[#0072BC] hover:underline block pt-2 mx-auto"
                  >
                    Buat Laporan Baru
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================================== */}
      {/* TAB C: LAPORAN INDIVIDUAL PESERTA */}
      {/* ========================================================================================== */}
      {activeWorkspaceTab === 'individual' && (
        <div className="space-y-6">
          {/* Search autocomplete selector */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 relative">
            <h4 className="text-xs font-bold text-gray-400 uppercase">Cari dan Pilih Peserta UMK</h4>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Ketik Nama Peserta atau Nama Usaha untuk melihat laporan..."
                value={individualSearch}
                onChange={(e) => setIndividualSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border rounded-xl bg-gray-50 text-xs font-semibold focus:outline-none focus:border-[#0072BC]"
              />
            </div>

            {/* Results popup overlay if active */}
            {individualSearch && (
              <div className="absolute z-50 left-5 right-5 bg-white border rounded-xl shadow-xl mt-1 divide-y max-h-60 overflow-y-auto">
                {filteredIndividualList.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedIndividualId(p.id);
                      setIndividualSearch('');
                    }}
                    className="w-full text-left p-3 hover:bg-gray-50 flex justify-between items-center text-xs"
                  >
                    <div>
                      <strong className="text-gray-800 block">{p.businessName}</strong>
                      <span className="text-gray-400 font-mono text-[10px]">{p.id} | Pemilik: {p.name}</span>
                    </div>
                    <span className="text-[#0072BC] font-bold">Pilih →</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Individual Report Card Container */}
          {selectedIndividual && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              {/* Profile header bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-3">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-[#0072BC] text-xl font-bold border border-blue-100">
                    {selectedIndividual.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#16365C]">{selectedIndividual.businessName}</h3>
                    <p className="text-xs text-gray-400 font-medium">Pemilik: {selectedIndividual.name} | ID: {selectedIndividual.id}</p>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => triggerExport('pdf', `UMK_Rapor_Individual_${selectedIndividual.id}`)}
                    className="px-3.5 py-2 border text-xs font-bold text-gray-600 rounded-xl hover:bg-gray-50 flex items-center gap-1.5 transition"
                  >
                    <FileDown className="h-4 w-4" />
                    <span>Rapor PDF</span>
                  </button>
                  <button
                    onClick={() => triggerExport('excel', `UMK_Rapor_Individual_${selectedIndividual.id}`)}
                    className="px-3.5 py-2 border text-xs font-bold text-gray-600 rounded-xl hover:bg-gray-50 flex items-center gap-1.5 transition"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Rapor Excel</span>
                  </button>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Identity */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b pb-1">Profil & Legalitas</h4>
                  <div className="space-y-2.5 text-xs">
                    <div>
                      <span className="text-gray-400 block">NIK Pemilik (Masked):</span>
                      <span className="font-bold text-gray-700">3171**********</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Nomor Telepon:</span>
                      <span className="font-bold text-gray-700">081*********</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Region Pembinaan:</span>
                      <span className="font-bold text-gray-700">{selectedIndividual.region}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Sektor Usaha:</span>
                      <span className="font-bold text-[#0072BC]">{selectedIndividual.sector}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Status Kelayakan TJSL:</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold uppercase text-[9px]">
                        Eligible — Binaan Terverifikasi
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Progress */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b pb-1">Progres Pembelajaran</h4>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="text-gray-500">Kemajuan Belajar:</span>
                        <span className="text-[#0072BC]">{selectedIndividual.learningProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#0072BC] h-full" style={{ width: `${selectedIndividual.learningProgress}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="text-gray-500">Tingkat Kehadiran:</span>
                        <span className="text-green-600">{selectedIndividual.attendanceRate}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full" style={{ width: `${selectedIndividual.attendanceRate}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500 block">Poin Tantangan Terkumpul:</span>
                      <span className="text-xl font-extrabold text-amber-500">{selectedIndividual.challengePoints} Poin</span>
                    </div>
                  </div>
                </div>

                {/* 3. Business Financial Performance */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b pb-1">Perkembangan Keuangan</h4>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold">Omzet Baseline:</span>
                      <span className="text-gray-700">Rp {(selectedIndividual.passport.financials.revenueBaseline / 1000000).toFixed(1)} Juta</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold">Omzet Terkini:</span>
                      <span className="text-[#16365C] font-extrabold">Rp {(selectedIndividual.passport.financials.revenueCurrent / 1000000).toFixed(1)} Juta</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t">
                      <span className="text-gray-500 font-bold">Pertumbuhan Omzet:</span>
                      <span className="text-green-600 font-extrabold">
                        +{selectedIndividual.passport.financials.revenueBaseline ? 
                          (((selectedIndividual.passport.financials.revenueCurrent - selectedIndividual.passport.financials.revenueBaseline) / selectedIndividual.passport.financials.revenueBaseline) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations scorecard */}
              <div className="bg-gray-50 p-5 rounded-xl border space-y-3 text-xs">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rekomendasi Rencana Aksi (Action Plan)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-white rounded-lg border">
                    <strong className="text-[#0072BC] block mb-1">Target 30 Hari:</strong>
                    <p className="text-gray-600 font-medium leading-relaxed">
                      {selectedIndividual.developmentCard?.recommendation30Days || 'Selesaikan revisi foto bukti kemasan di modul branding.'}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <strong className="text-green-600 block mb-1">Target 60 Hari:</strong>
                    <p className="text-gray-600 font-medium leading-relaxed">
                      {selectedIndividual.developmentCard?.recommendation60Days || 'Pengajuan sertifikasi Halal & NIB lanjutan didampingi fasilitator.'}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <strong className="text-purple-600 block mb-1">Target 90 Hari:</strong>
                    <p className="text-gray-600 font-medium leading-relaxed">
                      {selectedIndividual.developmentCard?.recommendation90Days || 'Uji coba promosi digital berbayar & pendaftaran kurasi SMEXPO 2026.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================================== */}
      {/* TAB D: RIWAYAT EXPORT */}
      {/* ========================================================================================== */}
      {activeWorkspaceTab === 'riwayat' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-[#16365C]">Riwayat Ekspor Berkas Program</h3>
              <p className="text-xs text-gray-400 mt-0.5">Daftar log audit ekspor data master yang dilakukan oleh operator resmi</p>
            </div>
            <button
              onClick={() => setExportHistory([])}
              className="px-3 py-1.5 border rounded-lg text-xs font-bold text-red-500 hover:bg-red-50"
            >
              Hapus Riwayat
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 text-gray-400 font-bold uppercase text-[9px] border-b">
                <tr>
                  <th className="p-3">Nama Laporan</th>
                  <th className="p-3">Tipe Ekspor</th>
                  <th className="p-3 text-center">Format</th>
                  <th className="p-3 text-center">UMK Tercakup</th>
                  <th className="p-3">Operator</th>
                  <th className="p-3">Waktu Cetak</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y text-gray-700 font-semibold">
                {exportHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="p-3 font-mono font-bold text-gray-800">{item.name}</td>
                    <td className="p-3 text-gray-500">{item.type}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-[9px] font-bold">{item.format}</span>
                    </td>
                    <td className="p-3 text-center text-gray-600">{item.participantsCount} UMK</td>
                    <td className="p-3 text-gray-500">{item.createdBy}</td>
                    <td className="p-3 text-gray-400 font-medium">{item.createdAt}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-md text-[9px] font-bold">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => triggerExport(item.format.includes('Excel') ? 'excel' : 'pdf', item.name)}
                        className="text-[#0072BC] hover:underline font-bold text-[11px]"
                      >
                        Unduh Ulang
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================================== */}
      {/* DATA SECURITY WARNING CONFIRMATION MODAL */}
      {/* ========================================================================================== */}
      {securityModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 animate-scale-up">
            <div className="flex items-center space-x-3 text-[#ED1B2F]">
              <ShieldAlert className="h-7 w-7" />
              <h3 className="text-base font-black uppercase tracking-tight">Konfirmasi Keamanan Data</h3>
            </div>

            <div className="text-xs text-gray-600 leading-relaxed space-y-2">
              <p>
                Laporan ini memuat data program yang bersumber dari basis data master Pertamina UMK Academy 2026.
              </p>
              <div className="p-3 bg-red-50 text-red-800 rounded-xl border border-red-100 font-semibold">
                Sesuai regulasi kepatuhan data:
                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                  <li>NIK telah di-masking untuk keamanan identitas.</li>
                  <li>Dokumen ini hanya boleh didistribusikan secara internal Pertamina SMEPP / PTC.</li>
                  <li>Dilarang mengunggah berkas ekspor ke domain publik tanpa persetujuan tertulis.</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => { setSecurityModalOpen(false); setPendingExportAction(null); }}
                className="flex-1 py-2 border rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmExport}
                className="flex-1 py-2 bg-[#ED1B2F] hover:bg-[#ED1B2F]/90 text-white rounded-xl text-xs font-bold"
              >
                Saya Mengerti, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
