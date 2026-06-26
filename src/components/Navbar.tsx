import React, { useState } from 'react';
import { Role } from '../types';
import { Bell, HelpCircle, User, LogOut, Sparkles, ChevronDown, Check, Menu, X, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  onLogout: () => void;
  onMobileToggle: () => void;
  isMobileOpen: boolean;
  points: number;
}

export default function Navbar({
  currentRole,
  onRoleChange,
  onLogout,
  onMobileToggle,
  isMobileOpen,
  points
}: NavbarProps) {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notiDropdownOpen, setNotiDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Fictional notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Tantangan SOP Produksi Sederhana sedang diverifikasi oleh Fasilitator.', read: false, time: '10 mnt lalu' },
    { id: 2, text: 'Rekomendasi Rapor Bulanan Juni Anda telah diterbitkan.', read: false, time: '2 jam lalu' },
    { id: 3, text: 'Webinar: Kupas Tuntas Legalitas Usaha dimulai 2 Juli 2026.', read: true, time: '1 hari lalu' }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'PESERTA':
        return 'bg-blue-100 text-[#0072BC]';
      case 'FASILITATOR':
        return 'bg-amber-100 text-amber-800';
      case 'ADMIN':
        return 'bg-red-100 text-[#ED1B2F]';
    }
  };

  const getRoleLabel = (role: Role) => {
    switch (role) {
      case 'PESERTA':
        return 'Peserta: Siti Rahmawati';
      case 'FASILITATOR':
        return 'Fasilitator: Andi Pratama';
      case 'ADMIN':
        return 'Admin: SMEPP / PTC';
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200/80 px-4 py-3 md:px-8 flex justify-between items-center shadow-sm font-sans">
      {/* Left side: Mobile menu & Logo */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMobileToggle}
          className="md:hidden p-1.5 text-gray-500 hover:text-gray-700 bg-gray-50 rounded-lg"
          aria-label="Toggle mobile menu"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Custom recreations of Pertamina UMK Academy 2026 Logo text */}
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

      {/* Right side controls */}
      <div className="flex items-center space-x-3">
        {/* Role Switcher Selector Dropdown (STRICT REQUIREMENT) */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 py-1.5 px-3 rounded-xl text-xs font-bold text-gray-700 transition"
          >
            <span className={`w-2 h-2 rounded-full ${currentRole === 'PESERTA' ? 'bg-[#0072BC]' : currentRole === 'FASILITATOR' ? 'bg-amber-500' : 'bg-[#ED1B2F]'}`}></span>
            <span className="hidden sm:inline">Ganti Role:</span>
            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${getRoleBadge(currentRole)}`}>
              {currentRole}
            </span>
            <ChevronDown className="h-3 w-3 text-gray-500" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
              <div className="px-3 py-1.5 border-b border-gray-100 mb-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Simulasi Alur Presentasi</span>
              </div>
              {(['PESERTA', 'FASILITATOR', 'ADMIN'] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    onRoleChange(r);
                    setRoleDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center justify-between font-medium"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold">{getRoleLabel(r)}</span>
                    <span className="text-[10px] text-gray-400">Tampilan {r.toLowerCase()}</span>
                  </div>
                  {currentRole === r && <Check className="h-4 w-4 text-green-500 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Gamification Point Indicator (Only for Peserta) */}
        {currentRole === 'PESERTA' && (
          <div className="hidden lg:flex items-center space-x-1.5 bg-[#A8C61F]/10 border border-[#A8C61F]/30 px-3 py-1.5 rounded-xl">
            <Sparkles className="h-4 w-4 text-[#A8C61F]" />
            <span className="text-xs font-black text-[#16365C]">{points.toLocaleString()} Poin</span>
          </div>
        )}

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotiDropdownOpen(!notiDropdownOpen);
              setUserDropdownOpen(false);
            }}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition relative"
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-[#ED1B2F] text-white text-[9px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notiDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-gray-100 flex justify-between items-center bg-[#F5F7FA]">
                <span className="text-xs font-bold text-gray-700">Notifikasi</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] text-[#0072BC] hover:underline font-semibold"
                  >
                    Tandai Semua Dibaca
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-gray-400">Tidak ada notifikasi baru</div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 border-b border-gray-100 text-xs transition cursor-pointer hover:bg-gray-50 ${!n.read ? 'bg-blue-50/40 font-medium' : ''}`}
                    >
                      <p className="text-gray-700 leading-normal">{n.text}</p>
                      <span className="text-[10px] text-gray-400 block mt-1">{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setUserDropdownOpen(!userDropdownOpen);
              setNotiDropdownOpen(false);
            }}
            className="flex items-center space-x-1.5 p-1 hover:bg-gray-100 rounded-xl transition"
          >
            <img
              src={
                currentRole === 'PESERTA'
                  ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
                  : currentRole === 'FASILITATOR'
                  ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
                  : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
              }
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-gray-200 object-cover"
            />
            <ChevronDown className="h-3.5 w-3.5 text-gray-500 hidden sm:block" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-800">
                  {currentRole === 'PESERTA' ? 'Siti Rahmawati' : currentRole === 'FASILITATOR' ? 'Andi Pratama' : 'Admin SMEPP'}
                </p>
                <p className="text-[10px] text-gray-400">{getRoleLabel(currentRole).split(':')[0]}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-semibold flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
