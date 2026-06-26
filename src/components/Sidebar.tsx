import React from 'react';
import { Role } from '../types';
import {
  Home, Briefcase, BookOpen, Trophy, Calendar, Users, BarChart3, Award, MessagesSquare, HelpCircle,
  ChevronLeft, ChevronRight, CheckSquare, TrendingUp, Download, FileCheck, ShieldAlert
} from 'lucide-react';

interface SidebarProps {
  currentRole: Role;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

export default function Sidebar({
  currentRole,
  activeTab,
  onTabChange,
  isCollapsed,
  setIsCollapsed
}: SidebarProps) {

  // Dynamic menu based on roles
  const getMenuItems = (): MenuItem[] => {
    switch (currentRole) {
      case 'PESERTA':
        return [
          { id: 'dashboard', label: 'Dashboard Utama', icon: Home },
          { id: 'passport', label: 'Business Passport', icon: Briefcase },
          { id: 'classes', label: 'Kelas Saya', icon: BookOpen },
          { id: 'challenges', label: 'Challenge Bisnis', icon: Trophy },
          { id: 'agenda', label: 'Agenda & Kehadiran', icon: Calendar },
          { id: 'coaching', label: 'Coaching & Pendampingan', icon: Users },
          { id: 'scorecard', label: 'Rapor Perkembangan', icon: BarChart3 },
          { id: 'certificates', label: 'Sertifikat', icon: Award },
          { id: 'community', label: 'Komunitas UMK', icon: MessagesSquare },
          { id: 'helpdesk', label: 'Helpdesk & FAQ', icon: HelpCircle }
        ];
      case 'FASILITATOR':
        return [
          { id: 'f_dashboard', label: 'Dashboard Ringkasan', icon: Home },
          { id: 'f_participants', label: 'Kelola Peserta Dampingan', icon: Users },
          { id: 'f_coaching', label: 'Jadwal & Action Plan', icon: Calendar },
          { id: 'f_challenges', label: 'Verifikasi Tantangan', icon: FileCheck },
          { id: 'f_impact', label: 'SROI & Dampak', icon: TrendingUp }
        ];
      case 'ADMIN':
        return [
          { id: 'a_dashboard', label: 'Dashboard Eksekutif', icon: Home },
          { id: 'a_curation', label: 'Manajemen & Kurasi', icon: FileCheck },
          { id: 'a_impact', label: 'Dampak SROI Nasional', icon: TrendingUp },
          { id: 'a_reports', label: 'Laporan & Export', icon: Download }
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col bg-[#16365C] text-white border-r border-gray-800 transition-all duration-300 h-[calc(100vh-57px)] sticky top-[57px] ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Collapse Button */}
        <div className="flex justify-end p-2 border-b border-white/10">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-grow py-4 space-y-1 overflow-y-auto px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center p-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#0072BC] text-white shadow-md'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer info at the bottom of Sidebar */}
        {!isCollapsed && (
          <div className="p-4 border-t border-white/10 bg-white/5 text-[10px] text-white/50 text-center">
            <p className="font-bold text-white/70">TJSL PT Pertamina</p>
            <p className="mt-1">Program Satu Data SMEPP © 2026</p>
          </div>
        )}
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR (CORE SCREENS) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-[#16365C] border-t border-gray-800 flex justify-around items-center py-2 px-1 z-40 shadow-lg">
        {menuItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center p-1 rounded-lg transition-all ${
                isActive ? 'text-[#A8C61F] font-bold' : 'text-white/60 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] mt-1 tracking-tight truncate max-w-[64px]">
                {item.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
