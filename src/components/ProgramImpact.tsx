import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend, LineChart, Line } from 'recharts';
import { TrendingUp, ShieldAlert, CheckCircle2, Award, Info, Scale, ArrowUpRight } from 'lucide-react';

export default function ProgramImpact() {
  const [dataQuality, setDataQuality] = useState<'Complete' | 'Verified' | 'Review'>('Verified');

  // Before and after program statistics (SROI metrics)
  const compareData = [
    { name: 'Omzet Bulanan (Rata-rata)', Sebelum: 12.4, Sesudah: 24.8, unit: 'Juta' },
    { name: 'Laba Bersih Bulanan', Sebelum: 3.2, Sesudah: 6.8, unit: 'Juta' },
    { name: 'Tenaga Kerja Lokal', Sebelum: 3.0, Sesudah: 4.0, unit: 'Orang' },
    { name: 'Kapasitas Bulanan (SOP)', Sebelum: 800, Sesudah: 1500, unit: 'Botol/Pcs' }
  ];

  const monthlyTrend = [
    { month: 'Jan', Omzet: 12.4, Laba: 3.2 },
    { month: 'Feb', Omzet: 14.1, Laba: 3.8 },
    { month: 'Mar', Omzet: 15.6, Laba: 4.1 },
    { month: 'Apr', Omzet: 18.2, Laba: 4.9 },
    { month: 'Mei', Omzet: 21.4, Laba: 5.6 },
    { month: 'Jun', Omzet: 24.8, Laba: 6.8 }
  ];

  return (
    <div id="program-impact-container" className="space-y-6 font-sans text-[#16365C] pb-20 md:pb-10">
      
      {/* Page Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-black">SROI & Dampak Berkelanjutan</h2>
        <p className="text-xs text-gray-500">Kombinasi analisis finansial, sosial, dan kontribusi faktor eksternal dalam mendorong pertumbuhan UMK</p>
      </div>

      {/* OVERCLAIM WARNING (STRICT REQUIREMENT) */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-xs leading-relaxed text-amber-800">
        <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">Peringatan Integritas Data (Anti-Overclaim Mandate)</span>
          Pengukuran dampak ekonomi wajib berbasis bukti audit dan memperhitungkan kontribusi faktor eksternal (kondisi pasar makro, bantuan modal keluarga, pameran daerah dinas luar) untuk menghindari klaim sepihak. Kontribusi murni UMK Academy 2026 diestimasi berkisar pada rasio kontribusi murni 65%.
        </div>
      </div>

      {/* METRIC SUMMARIES GAUGE */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-[10px] text-gray-400 font-bold uppercase block">Rerata Pertumbuhan Omzet</span>
          <span className="text-2xl font-black text-[#0072BC] block mt-1">+100%</span>
          <p className="text-[10px] text-green-600 font-bold mt-1">Semenjak mengikuti modul Go Modern</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-[10px] text-gray-400 font-bold uppercase block">Serapan Tenaga Kerja Baru</span>
          <span className="text-2xl font-black text-green-600 block mt-1">+33.3%</span>
          <p className="text-[10px] text-gray-400 mt-1">Rerata penambahan 1 pekerja per UMK</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-[10px] text-gray-400 font-bold uppercase block">Tingkat Sertifikasi Baru</span>
          <span className="text-2xl font-black text-amber-500 block mt-1">85% Terbit</span>
          <p className="text-[10px] text-gray-400 mt-1">Target Halal, NIB, & PIRT terpenuhi</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <span className="text-[10px] text-gray-400 font-bold uppercase block">Status Kredibilitas Data</span>
          <span className="text-sm bg-green-50 text-green-600 font-bold px-2 py-0.5 rounded w-max mt-2 block">Verified (Audit Clean)</span>
        </div>
      </div>

      {/* COMPARATIVE CHART BEFORE VS AFTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Before After BarChart (Left 7 Cols) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-7 flex flex-col justify-between">
          <div className="border-b pb-2 mb-4">
            <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Perbandingan Sebelum vs Sesudah Pembinaan</h4>
            <p className="text-[10px] text-gray-400">Baseline (Januari) vs Midline (Juni) 2026</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis fontSize={9} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="Sebelum" fill="#A1A1AA" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Sesudah" fill="#0072BC" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Line Trend (Right 5 Cols) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm lg:col-span-5 flex flex-col justify-between">
          <div className="border-b pb-2 mb-4">
            <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Trend Keuangan Bulanan (Miliar Rupiah)</h4>
            <p className="text-[10px] text-gray-400">Total Akumulasi Regional Jawa Tengah</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={10} />
                <YAxis fontSize={9} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="Omzet" stroke="#ED1B2F" strokeWidth={2} />
                <Line type="monotone" dataKey="Laba" stroke="#A8C61F" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ATTRIBUTION & CONTRIBUTION SCORECARD (STRICT REQUIREMENT) */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 font-sans text-xs">
        <div className="border-b pb-2">
          <h3 className="font-black text-sm">Faktor Kontribusi & Attribution Breakdown</h3>
          <p className="text-[10px] text-gray-400">Pengukuran bobot kontribusi murni program dibanding faktor eksternal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-xl space-y-1">
            <span className="font-bold text-gray-700 block">Investasi & Kontribusi Mandiri</span>
            <p className="text-gray-500 leading-normal">
              Peserta mengeluarkan modal pribadi untuk pembelian wajan panggangan baru dan kemasan stiker botol (Bobot pengaruh: 15%).
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl space-y-1">
            <span className="font-bold text-gray-700 block">Kondisi Pasar & Inflasi Cabai</span>
            <p className="text-gray-500 leading-normal">
              Fluktuasi harga bumbu dapur segar di wilayah Semarang mempengaruhi laba bersih bulanan (Bobot pengaruh: 20%).
            </p>
          </div>

          <div className="p-4 bg-[#0072BC]/5 border border-[#0072BC]/10 rounded-xl space-y-1">
            <span className="font-bold text-[#0072BC] block">Estimasi Kontribusi UMK Academy</span>
            <p className="text-gray-600 leading-normal">
              Pengaruh mentoring standarisasi SOP, sertifikasi legalitas, adopsi QRIS/POS digital, dan pameran (Bobot pengaruh murni: 65%).
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
