import React, { useState } from 'react';
import { AgendaEvent } from '../types';
import { Calendar, Clock, MapPin, Users, HelpCircle, CheckCircle2, ChevronRight, QrCode, PlayCircle, FileDown, ShieldAlert } from 'lucide-react';

interface AgendaCalendarProps {
  agendaEvents: AgendaEvent[];
  onConfirmAttendance: (eventId: string) => void;
}

export default function AgendaCalendar({ agendaEvents, onConfirmAttendance }: AgendaCalendarProps) {
  const [filterType, setFilterType] = useState<string>('Semua');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  // Month Calendar Mock Layout for June/July 2026
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);

  const handleOpenScan = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsQrModalOpen(true);
    setScanning(true);
    setScanSuccess(false);

    // Simulate scanning camera for 2.5 seconds
    setTimeout(() => {
      setScanning(false);
      setScanSuccess(true);
      // Automatically confirm attendance in parent state
      onConfirmAttendance(eventId);
    }, 2000);
  };

  const filteredEvents = agendaEvents.filter(e => {
    if (filterType === 'Semua') return true;
    if (filterType === 'Webinar') return e.type === 'Webinar';
    if (filterType === 'Coaching') return e.type === 'Coaching';
    if (filterType === 'Offline') return e.isOffline;
    return true;
  });

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'Webinar':
        return 'bg-blue-100 text-[#0072BC]';
      case 'Coaching':
        return 'bg-purple-100 text-purple-700';
      case 'Mentoring':
        return 'bg-pink-100 text-pink-700';
      case 'Exhibition':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div id="agenda-calendar-container" className="space-y-6 font-sans text-[#16365C] pb-20 md:pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black">Agenda & Kehadiran Kelas</h2>
          <p className="text-xs text-gray-500">Jadwal pelatihan interaktif wajib, pembinaan regional harian, dan monitoring kehadiran</p>
        </div>

        {/* Filters */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl border space-x-1">
          {['Semua', 'Webinar', 'Coaching', 'Offline'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filterType === type ? 'bg-[#16365C] text-white shadow' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout: Calendar display on left, List of events on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Calendar Mock (Left 5 Cols) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Kalender Kegiatan Juni 2026</h4>
            <span className="text-xs font-bold">Juni 2026</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-gray-400 uppercase mb-1">
            <span>Se</span><span>Se</span><span>Ra</span><span>Ka</span><span>Ju</span><span>Sa</span><span>Mi</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-xs font-semibold">
            {/* Empty days to align correct start */}
            <span className="text-gray-200 py-1.5">1</span>
            <span className="text-gray-200 py-1.5">2</span>
            <span className="text-gray-200 py-1.5">3</span>
            <span className="text-gray-200 py-1.5">4</span>
            <span className="text-gray-200 py-1.5">5</span>
            {calendarDays.map((day) => {
              // Highlight specific dates matching mock events
              const isEventDay = [20, 25].includes(day);
              const isFutureEventDay = [2, 5, 18].includes(day);

              let bgClass = 'text-gray-700 hover:bg-gray-100';
              if (isEventDay) bgClass = 'bg-[#0072BC] text-white rounded-lg shadow-sm font-bold';
              if (isFutureEventDay) bgClass = 'bg-amber-100 text-amber-800 rounded-lg font-bold border border-amber-200';

              return (
                <button key={day} className={`py-1.5 transition text-center ${bgClass}`}>
                  {day}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col space-y-1.5 pt-3 border-t text-[10px] text-gray-500 font-medium">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-[#0072BC] rounded-md block"></span>
              <span>Sesi Kelas Selesai / Dilewati</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-amber-100 border border-amber-200 rounded-md block"></span>
              <span>Sesi Kelas Mendatang (Wajib)</span>
            </div>
          </div>
        </div>

        {/* Event Lists (Right 7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {filteredEvents.map((event) => {
            const isHadir = event.attendanceStatus === 'Hadir';
            const isWaiting = event.attendanceStatus === 'Menunggu';
            const isOffline = event.isOffline;

            return (
              <div key={event.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-start gap-2 text-xs">
                  <div>
                    <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded uppercase ${getEventBadge(event.type)}`}>
                      {event.type}
                    </span>
                    <h4 className="font-black text-sm text-gray-800 mt-2 leading-snug">{event.title}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">Narasumber: <strong>{event.speaker}</strong></p>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded ${
                    isHadir ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {event.attendanceStatus}
                  </span>
                </div>

                {/* Date & Location Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600 leading-normal bg-gray-50 p-3 rounded-xl font-sans">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-[#0072BC]" />
                    <span>{event.date} • {event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-[#ED1B2F]" />
                    <span className="truncate">{isOffline ? event.location : 'Streaming Zoom / Calendly'}</span>
                  </div>
                </div>

                {/* Action buttons footer inside event card */}
                <div className="pt-3 border-t flex flex-wrap gap-2 justify-between items-center text-xs">
                  {/* Download Materials / Recording if finished */}
                  <div className="flex space-x-1.5">
                    {event.materialsUrl && (
                      <button className="flex items-center space-x-1 text-[#0072BC] hover:underline font-bold">
                        <FileDown className="h-3.5 w-3.5" />
                        <span>Materi PDF</span>
                      </button>
                    )}
                    {event.recordingUrl && (
                      <button className="flex items-center space-x-1 text-[#0072BC] hover:underline font-bold">
                        <PlayCircle className="h-3.5 w-3.5" />
                        <span>Rekaman Video</span>
                      </button>
                    )}
                  </div>

                  {/* Dynamic Action Buttons */}
                  <div className="flex space-x-2">
                    {isWaiting && (
                      <>
                        {isOffline ? (
                          <button
                            onClick={() => handleOpenScan(event.id)}
                            className="bg-[#A8C61F] hover:bg-[#A8C61F]/90 text-[#16365C] font-black text-xs px-3.5 py-1.5 rounded-xl shadow-sm transition flex items-center space-x-1"
                          >
                            <QrCode className="h-3.5 w-3.5" />
                            <span>Scan Absensi QR</span>
                          </button>
                        ) : (
                          <a
                            href={event.location}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#0072BC] hover:bg-[#0072BC]/95 text-white font-bold text-xs px-4 py-1.5 rounded-xl shadow-sm transition inline-block text-center"
                          >
                            Gabung Sesi Zoom
                          </a>
                        )}
                      </>
                    )}
                    {isHadir && (
                      <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2.5 py-1 rounded flex items-center space-x-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Kehadiran Terverifikasi</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR CAMERA SCANNING MODAL */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden font-sans text-xs flex flex-col">
            <div className="bg-[#16365C] text-white p-4 flex justify-between items-center">
              <span className="font-bold text-sm">Simulasi Scan Kehadiran QR</span>
              <button onClick={() => setIsQrModalOpen(false)} className="text-white/60 hover:text-white">✕</button>
            </div>

            <div className="p-6 flex flex-col items-center text-center space-y-4">
              {scanning ? (
                /* Simulated Scanner Loop */
                <div className="space-y-4 w-full flex flex-col items-center">
                  <div className="w-48 h-48 bg-gray-900 border-4 border-[#0072BC] rounded-2xl relative overflow-hidden flex items-center justify-center">
                    {/* Pulsing red scanline */}
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-[#ED1B2F] animate-bounce"></div>
                    <QrCode className="h-20 w-20 text-white/30 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-gray-700">Membuka Kamera HP...</p>
                    <p className="text-[10px] text-gray-400">Posisikan kode QR pameran di dalam kotak pembidik.</p>
                  </div>
                </div>
              ) : (
                /* Success Screen */
                <div className="space-y-4 w-full flex flex-col items-center">
                  <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                    <CheckCircle2 className="h-12 w-12 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-green-600">Kehadiran Berhasil Diabsen!</h4>
                    <p className="text-gray-500">Kehadiran Anda telah terverifikasi oleh panitia SMEPP regional pada tanggal 25 Juni 2026.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 border-t text-center">
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="bg-[#16365C] hover:bg-[#16365C]/95 text-white font-bold py-1.5 px-6 rounded-lg shadow-md transition"
              >
                Tutup Sesi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
