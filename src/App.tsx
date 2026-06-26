import React, { useState } from 'react';
import { Participant, LearningModule, Challenge, AgendaEvent } from './types';
import { INITIAL_PARTICIPANTS, INITIAL_MODULES, INITIAL_CHALLENGES, INITIAL_AGENDA } from './data/initialData';

// Component imports
import LoginOnboarding from './components/LoginOnboarding';
import ParticipantDashboard from './components/ParticipantDashboard';
import BusinessPassport from './components/BusinessPassport';
import LearningCenter from './components/LearningCenter';
import ChallengeSection from './components/ChallengeSection';
import AgendaCalendar from './components/AgendaCalendar';
import CoachingSection from './components/CoachingSection';
import ReportCard from './components/ReportCard';
import Certificates from './components/Certificates';
import CommunitySection from './components/CommunitySection';
import ProgramImpact from './components/ProgramImpact';
import HelpdeskSupport from './components/HelpdeskSupport';
import FacilitatorDashboard from './components/FacilitatorDashboard';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import TJSLStatusView from './components/TJSLStatusView';
import ReportsWorkspace from './components/ReportsWorkspace';

// Lucide Icons
import {
  Menu, Bell, ChevronDown, User, LogOut, LayoutDashboard, FileText, BookOpen,
  Trophy, Calendar, Users, Award, ShieldAlert, HeartHandshake, HelpCircle, Key,
  Sparkles, CheckCircle2, ChevronRight, ShieldCheck, BarChart3
} from 'lucide-react';

// Map & enrich participants so they satisfy the full type requirements (challenges list, SROI / curation flags)
const enrichedParticipantsList: Participant[] = INITIAL_PARTICIPANTS.map(p => ({
  ...p,
  challenges: p.id === 'P001' ? INITIAL_CHALLENGES : INITIAL_CHALLENGES.map(c => ({
    ...c,
    status: c.id === 'C01' ? 'Selesai' : 'Draft',
  })),
  isRecommendedSMEXPO: p.id === 'P001' || p.id === 'P002',
  isRecommendedAggregator: p.id === 'P002',
  isUMKMTroopers: false,
  isExportReady: p.stage === 'Graduation',
  tjslStatus: p.tjslStatus || 'Belum Diperiksa',
  tjslVerificationStatus: p.tjslVerificationStatus || 'Draft',
  tjslClaim: p.tjslClaim || { isBinaan: 'Belum' },
  tjslLogs: p.tjslLogs || []
}));

export default function App() {
  // Session authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Active Role and Page controllers
  const [activeRole, setActiveRole] = useState<'Peserta' | 'Fasilitator' | 'Admin'>('Peserta');
  const [activePage, setActivePage] = useState<string>('dashboard');

  // Sidebar collapsible state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dynamic Central States (Shared across views)
  const [participant, setParticipant] = useState<Participant>(enrichedParticipantsList[0]);
  const [learningModules, setLearningModules] = useState<LearningModule[]>(INITIAL_MODULES);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [agendaEvents, setAgendaEvents] = useState<AgendaEvent[]>(INITIAL_AGENDA);
  const [allParticipants, setAllParticipants] = useState<Participant[]>(enrichedParticipantsList);

  // Notification panel state
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Tantangan SOP Produksi Sederhana memerlukan revisi bukti.', unread: true, category: 'Challenge' },
    { id: 2, text: 'Webinar: Strategi Ekspor UMK Modern dijadwalkan besok.', unread: true, category: 'Agenda' },
    { id: 3, text: 'Andi Pratama menambahkan catatan pendampingan baru.', unread: false, category: 'Coaching' }
  ]);

  // Handler callbacks for state sync
  const handleUpdateParticipant = (updated: Participant) => {
    setParticipant(updated);
    // Sync within the multi-participant listing for facilitator/admin
    const updatedAll = allParticipants.map(p => p.id === updated.id ? updated : p);
    setAllParticipants(updatedAll);
  };

  const handleUpdateAllParticipants = (updatedList: Participant[]) => {
    setAllParticipants(updatedList);
    // Sync current logged in participant if updated
    const current = updatedList.find(p => p.id === participant.id);
    if (current) {
      setParticipant(current);
    }
  };

  const handleMarkModuleComplete = (moduleId: string) => {
    const updatedModules = learningModules.map(m => {
      if (m.id === moduleId) {
        return { ...m, status: 'Selesai' };
      }
      return m;
    });
    setLearningModules(updatedModules);

    // Recalculate learning progress
    const completedCount = updatedModules.filter(m => m.status === 'Selesai').length;
    const totalCount = updatedModules.length;
    const nextProgress = Math.round((completedCount / totalCount) * 100);

    handleUpdateParticipant({
      ...participant,
      learningProgress: nextProgress
    });
  };

  const handleSubmitChallenge = (challengeId: string, submission: any) => {
    const updatedChallenges = challenges.map(c => {
      if (c.id === challengeId) {
        return {
          ...c,
          status: 'Sedang Diverifikasi',
          submission: submission
        };
      }
      return c;
    });
    setChallenges(updatedChallenges);

    // Sync in participant object
    const updatedPartChallenges = participant.challenges.map(c => {
      if (c.id === challengeId) {
        return {
          ...c,
          status: 'Sedang Diverifikasi',
          submission: submission
        };
      }
      return c;
    });

    handleUpdateParticipant({
      ...participant,
      challenges: updatedPartChallenges
    });
  };

  const handleConfirmAttendance = (eventId: string) => {
    const updatedEvents = agendaEvents.map(e => {
      if (e.id === eventId) {
        return { ...e, attendanceStatus: 'Hadir' };
      }
      return e;
    });
    setAgendaEvents(updatedEvents);
  };

  const handleRoleChange = (role: 'Peserta' | 'Fasilitator' | 'Admin') => {
    setActiveRole(role);
    // Default the landing tab based on role selected
    setActivePage('dashboard');
  };

  const markNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  // Logged-out gating
  if (!isLoggedIn) {
    return (
      <LoginOnboarding
        onLoginSuccess={() => setIsLoggedIn(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-sans text-[#16365C] flex flex-col">
      
      {/* 1. TOP NAVBAR HEADER */}
      <header className="bg-white border-b border-gray-200 text-[#16365C] px-4 md:px-6 py-3 flex justify-between items-center sticky top-0 z-40 shadow-sm shrink-0">
        
        {/* Left branding logo placeholder */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition hidden md:block"
          >
            <Menu className="h-5 w-5 text-gray-500" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-[#ED1B2F] rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <span className="text-white font-black text-base">P</span>
            </div>
            <div className="flex flex-col">
              <h1 className="font-extrabold text-xs md:text-sm tracking-tight text-[#0072BC] uppercase leading-none">
                PERTAMINA UMK ACADEMY 2026
              </h1>
              <p className="text-[8px] md:text-[9px] text-gray-400 font-bold tracking-wider mt-1 uppercase leading-none">
                Learning & Impact Management System
              </p>
            </div>
          </div>
        </div>

        {/* Right profile widgets & Role switcher */}
        <div className="flex items-center space-x-4">
          
          {/* ROLE SWITCHER DROPDOWN (STRICT REQUIREMENT) */}
          <div className="relative group">
            <button className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-[#16365C] font-bold text-[10px] md:text-xs py-1.5 px-3 rounded-xl flex items-center space-x-1.5 transition">
              <span className="w-2 h-2 rounded-full bg-[#A8C61F]"></span>
              <span>Ganti Role: <span className="font-extrabold">{activeRole === 'Peserta' ? 'Peserta UMK' : activeRole === 'Fasilitator' ? 'Fasilitator' : 'Admin SMEPP'}</span></span>
              <ChevronDown className="h-3 w-3 text-gray-500" />
            </button>
            
            {/* Interactive Switcher Menu */}
            <div className="absolute right-0 mt-1 bg-white border rounded-xl shadow-lg w-48 py-1 text-gray-800 hidden group-hover:block z-50 text-xs font-semibold">
              <button
                onClick={() => handleRoleChange('Peserta')}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between ${activeRole === 'Peserta' ? 'text-[#0072BC] font-bold' : ''}`}
              >
                <span>Peserta UMK</span>
                {activeRole === 'Peserta' && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
              </button>
              <button
                onClick={() => handleRoleChange('Fasilitator')}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between ${activeRole === 'Fasilitator' ? 'text-[#0072BC] font-bold' : ''}`}
              >
                <span>Fasilitator / Coach</span>
                {activeRole === 'Fasilitator' && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
              </button>
              <button
                onClick={() => handleRoleChange('Admin')}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between ${activeRole === 'Admin' ? 'text-[#0072BC] font-bold' : ''}`}
              >
                <span>Admin SMEPP / PTC</span>
                {activeRole === 'Admin' && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
              </button>
            </div>
          </div>

          {/* NOTIFICATION CENTER */}
          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); markNotificationsRead(); }}
              className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-lg transition relative"
            >
              <Bell className="h-4 w-4" />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#ED1B2F] rounded-full"></span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 bg-white border text-gray-800 rounded-xl shadow-xl w-64 md:w-80 py-2.5 z-50 text-xs font-semibold">
                <div className="px-4 pb-2 border-b flex justify-between items-center text-gray-400">
                  <span>Notifikasi</span>
                  <button onClick={() => setNotifOpen(false)} className="hover:text-gray-600">✕</button>
                </div>
                <div className="divide-y max-h-60 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`p-3 hover:bg-gray-50 flex items-start space-x-2 ${n.unread ? 'bg-blue-50/50' : ''}`}>
                      <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded mt-0.5 uppercase ${
                        n.category === 'Challenge' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {n.category}
                      </span>
                      <p className="text-gray-600 font-sans leading-normal">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* USER AVATAR & LOGOUT */}
          <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0072BC] to-[#16365C] flex items-center justify-center text-white font-extrabold text-xs border-2 border-white shadow-sm shrink-0">
              SR
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <span className="font-extrabold text-[11px] block text-[#16365C]">Siti Rahmawati</span>
              <span className="text-[9px] text-gray-400 block font-semibold">Rasa Nusantara</span>
            </div>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="p-1.5 hover:bg-red-50 hover:text-[#ED1B2F] text-gray-500 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>

        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        
        {/* 2. COLLAPSIBLE LEFT SIDEBAR FOR DESKTOP */}
        <aside className={`bg-[#16365C] text-gray-300 text-xs font-semibold font-sans py-4 transition-all duration-300 z-30 shrink-0 hidden md:flex flex-col justify-between ${
          sidebarOpen ? 'w-[220px]' : 'w-16'
        }`}>
          <div className="flex flex-col h-full justify-between overflow-y-auto scrollbar-none">
            {/* Menus based on Role Selection */}
            <div className="space-y-1 px-3">
              {sidebarOpen && (
                <div className="text-[10px] uppercase tracking-widest text-gray-400 font-extrabold px-3 py-2 mb-2">
                  Menu Utama
                </div>
              )}
              
              {/* ROLE A: PESERTA UMK */}
              {activeRole === 'Peserta' && (
                <>
                  <button
                    onClick={() => setActivePage('dashboard')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activePage === 'dashboard' ? 'bg-[#0072BC] text-white font-bold shadow-sm' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="h-4.5 w-4.5 shrink-0" />
                    {sidebarOpen && <span>Dashboard Peserta</span>}
                  </button>

                  <button
                    onClick={() => setActivePage('passport')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activePage === 'passport' ? 'bg-[#0072BC] text-white font-bold shadow-sm' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <FileText className="h-4.5 w-4.5 shrink-0" />
                    {sidebarOpen && <span>Profil & Passport</span>}
                  </button>

                  <button
                    onClick={() => setActivePage('tjsl_verification')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                      activePage === 'tjsl_verification' ? 'bg-[#0072BC] text-white font-bold shadow-sm' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
                      {sidebarOpen && <span>Status Verifikasi TJSL</span>}
                    </div>
                    {sidebarOpen && participant.tjslVerificationStatus === 'Perlu Klarifikasi' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                    )}
                  </button>

                  <button
                    onClick={() => setActivePage('kelas')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activePage === 'kelas' ? 'bg-[#0072BC] text-white font-bold shadow-sm' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <BookOpen className="h-4.5 w-4.5 shrink-0" />
                    {sidebarOpen && <span>Kelas Saya</span>}
                  </button>

                  <button
                    onClick={() => setActivePage('challenge')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activePage === 'challenge' ? 'bg-[#0072BC] text-white font-bold shadow-sm' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Trophy className="h-4.5 w-4.5 shrink-0" />
                    {sidebarOpen && <span>Challenge Bisnis</span>}
                  </button>

                  <button
                    onClick={() => setActivePage('agenda')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activePage === 'agenda' ? 'bg-[#0072BC] text-white font-bold shadow-sm' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Calendar className="h-4.5 w-4.5 shrink-0" />
                    {sidebarOpen && <span>Agenda & Kehadiran</span>}
                  </button>

                  <button
                    onClick={() => setActivePage('coaching')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activePage === 'coaching' ? 'bg-[#0072BC] text-white font-bold shadow-sm' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Users className="h-4.5 w-4.5 shrink-0" />
                    {sidebarOpen && <span>Coaching & Mentoring</span>}
                  </button>

                  <button
                    onClick={() => setActivePage('rapor')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activePage === 'rapor' ? 'bg-[#0072BC] text-white font-bold shadow-sm' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Award className="h-4.5 w-4.5 shrink-0" />
                    {sidebarOpen && <span>Rapor & Development</span>}
                  </button>

                  <button
                    onClick={() => setActivePage('sertifikat')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activePage === 'sertifikat' ? 'bg-[#0072BC] text-white font-bold shadow-sm' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Award className="h-4.5 w-4.5 shrink-0" />
                    {sidebarOpen && <span>Sertifikat</span>}
                  </button>

                  <button
                    onClick={() => setActivePage('komunitas')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activePage === 'komunitas' ? 'bg-[#0072BC] text-white font-bold shadow-sm' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <HeartHandshake className="h-4.5 w-4.5 shrink-0" />
                    {sidebarOpen && <span>Komunitas UMK</span>}
                  </button>

                  <button
                    onClick={() => setActivePage('dampak')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activePage === 'dampak' ? 'bg-[#0072BC] text-white font-bold shadow-sm' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                    {sidebarOpen && <span>Dampak SROI</span>}
                  </button>
                </>
              )}

              {/* ROLE B: FASILITATOR */}
              {activeRole === 'Fasilitator' && (
                <>
                  <button
                    onClick={() => setActivePage('dashboard')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activePage === 'dashboard' ? 'bg-[#0072BC] text-white font-bold shadow-sm' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="h-4.5 w-4.5 shrink-0" />
                    {sidebarOpen && <span>Dashboard Fasilitator</span>}
                  </button>

                  <button
                    onClick={() => setActivePage('komunitas')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activePage === 'komunitas' ? 'bg-[#0072BC] text-white font-bold shadow-sm' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <HeartHandshake className="h-4.5 w-4.5 shrink-0" />
                    {sidebarOpen && <span>Forum Komunitas</span>}
                  </button>
                </>
              )}

              {/* ROLE C: EXECUTIVE ADMIN */}
              {activeRole === 'Admin' && (
                <>
                  <button
                    onClick={() => setActivePage('dashboard')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activePage === 'dashboard' ? 'bg-[#0072BC] text-white font-bold shadow-sm' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="h-4.5 w-4.5 shrink-0" />
                    {sidebarOpen && <span>Dashboard Eksekutif</span>}
                  </button>

                  <button
                    onClick={() => setActivePage('reports_export')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activePage === 'reports_export' ? 'bg-[#0072BC] text-white font-bold shadow-sm' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <BarChart3 className="h-4.5 w-4.5 shrink-0" />
                    {sidebarOpen && <span>Laporan & Export</span>}
                  </button>

                  <button
                    onClick={() => setActivePage('komunitas')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                      activePage === 'komunitas' ? 'bg-[#0072BC] text-white font-bold shadow-sm' : 'hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <HeartHandshake className="h-4.5 w-4.5 shrink-0" />
                    {sidebarOpen && <span>Forum Komunitas</span>}
                  </button>
                </>
              )}

              {/* SHARED HELP MENU */}
              <button
                onClick={() => setActivePage('helpdesk')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  activePage === 'helpdesk' ? 'bg-[#0072BC] text-white font-bold shadow-sm' : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <HelpCircle className="h-4.5 w-4.5 shrink-0" />
                {sidebarOpen && <span>Pusat Bantuan</span>}
              </button>
            </div>

            {/* Bottom Section of Sidebar */}
            {sidebarOpen ? (
              <div className="mt-auto p-4 space-y-4">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Progres Pembinaan</p>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-xs font-bold text-white">{participant.stage || 'Regional'}</span>
                    <span className="text-[10px] text-[#A8C61F]">{participant.learningProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#A8C61F]" style={{ width: `${participant.learningProgress}%` }}></div>
                  </div>
                </div>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                >
                  <LogOut className="h-4.5 w-4.5 shrink-0" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <div className="mt-auto px-2.5 space-y-4">
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full flex justify-center py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Keluar"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* 3. MAIN PAGE CANVAS CONTAINER */}
        <main className="flex-grow p-4 md:p-6 overflow-y-auto max-h-[calc(100vh-64px)]">
          
          {/* ROLE PESERTA PAGES ROUTER */}
          {activeRole === 'Peserta' && (
            <>
              {activePage === 'dashboard' && (
                <ParticipantDashboard
                  participant={participant}
                  modules={learningModules}
                  challenges={challenges}
                  agendaEvents={agendaEvents}
                  onTabChange={(tab) => setActivePage(tab)}
                  onMarkModuleComplete={handleMarkModuleComplete}
                />
              )}
              {activePage === 'passport' && (
                <BusinessPassport
                  participant={participant}
                  onUpdateParticipant={handleUpdateParticipant}
                />
              )}
              {activePage === 'tjsl_verification' && (
                <TJSLStatusView
                  participant={participant}
                  onUpdateParticipant={handleUpdateParticipant}
                />
              )}
              {activePage === 'kelas' && (
                <LearningCenter
                  modules={learningModules}
                  onMarkModuleComplete={handleMarkModuleComplete}
                />
              )}
              {activePage === 'challenge' && (
                <ChallengeSection
                  challenges={challenges}
                  onSubmitChallenge={handleSubmitChallenge}
                  points={participant.challengePoints}
                />
              )}
              {activePage === 'agenda' && (
                <AgendaCalendar
                  agendaEvents={agendaEvents}
                  onConfirmAttendance={handleConfirmAttendance}
                />
              )}
              {activePage === 'coaching' && (
                <CoachingSection
                  participant={participant}
                  onUpdateParticipant={handleUpdateParticipant}
                />
              )}
              {activePage === 'rapor' && (
                <ReportCard participant={participant} />
              )}
              {activePage === 'sertifikat' && (
                <Certificates participant={participant} />
              )}
              {activePage === 'komunitas' && (
                <CommunitySection />
              )}
              {activePage === 'dampak' && (
                <ProgramImpact />
              )}
              {activePage === 'helpdesk' && (
                <HelpdeskSupport />
              )}
            </>
          )}

          {/* ROLE FASILITATOR PAGES ROUTER */}
          {activeRole === 'Fasilitator' && (
            <>
              {activePage === 'dashboard' && (
                <FacilitatorDashboard
                  participants={allParticipants}
                  onUpdateParticipants={handleUpdateAllParticipants}
                />
              )}
              {activePage === 'komunitas' && (
                <CommunitySection />
              )}
              {activePage === 'helpdesk' && (
                <HelpdeskSupport />
              )}
            </>
          )}

          {/* ROLE EXECUTIVE ADMIN PAGES ROUTER */}
          {activeRole === 'Admin' && (
            <>
              {activePage === 'dashboard' && (
                <ExecutiveDashboard
                  participants={allParticipants}
                  onUpdateParticipants={handleUpdateAllParticipants}
                  onNavigate={(page) => setActivePage(page)}
                />
              )}
              {activePage === 'reports_export' && (
                <ReportsWorkspace
                  participants={allParticipants}
                  onUpdateParticipants={handleUpdateAllParticipants}
                  onTabChange={(tab) => setActivePage(tab)}
                />
              )}
              {activePage === 'komunitas' && (
                <CommunitySection />
              )}
              {activePage === 'helpdesk' && (
                <HelpdeskSupport />
              )}
            </>
          )}

        </main>
      </div>

      {/* Sleek Interface Bottom Bar (Desktop Only) */}
      <div className="hidden md:flex h-8 bg-gray-50 items-center justify-between px-6 text-[9px] text-gray-400 font-semibold shrink-0 border-t border-gray-200">
        <div>© 2026 PT Pertamina (Persero). SMEPP & PTC Collaboration.</div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#A8C61F] rounded-full animate-pulse"></span>
            Server Utama Terhubung
          </div>
          <div>v1.0.4-build.762</div>
        </div>
      </div>

      {/* 4. RESPONSIVE MOBILE BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 py-2.5 flex justify-around items-center z-40 md:hidden shadow-lg text-[10px] font-bold font-sans text-gray-400">
        <button
          onClick={() => setActivePage('dashboard')}
          className={`flex flex-col items-center space-y-1 ${activePage === 'dashboard' ? 'text-[#0072BC]' : ''}`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Mulai</span>
        </button>

        {activeRole === 'Peserta' && (
          <>
            <button
              onClick={() => setActivePage('passport')}
              className={`flex flex-col items-center space-y-1 ${activePage === 'passport' ? 'text-[#0072BC]' : ''}`}
            >
              <FileText className="h-5 w-5" />
              <span>Passport</span>
            </button>
            <button
              onClick={() => setActivePage('kelas')}
              className={`flex flex-col items-center space-y-1 ${activePage === 'kelas' ? 'text-[#0072BC]' : ''}`}
            >
              <BookOpen className="h-5 w-5" />
              <span>Kelas</span>
            </button>
            <button
              onClick={() => setActivePage('challenge')}
              className={`flex flex-col items-center space-y-1 ${activePage === 'challenge' ? 'text-[#0072BC]' : ''}`}
            >
              <Trophy className="h-5 w-5" />
              <span>Tantangan</span>
            </button>
          </>
        )}

        {activeRole === 'Admin' && (
          <button
            onClick={() => setActivePage('reports_export')}
            className={`flex flex-col items-center space-y-1 ${activePage === 'reports_export' ? 'text-[#0072BC]' : ''}`}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Laporan</span>
          </button>
        )}

        <button
          onClick={() => setActivePage('helpdesk')}
          className={`flex flex-col items-center space-y-1 ${activePage === 'helpdesk' ? 'text-[#0072BC]' : ''}`}
        >
          <HelpCircle className="h-5 w-5" />
          <span>Bantuan</span>
        </button>
      </nav>

    </div>
  );
}
