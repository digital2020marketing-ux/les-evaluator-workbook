import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Clipboard, Activity, AlertCircle, Sparkle, ArrowRight, BookOpen, Check, ThumbsUp, HelpCircle, Flame, ListFilter, RotateCcw
} from 'lucide-react';
import { Worksheet6Data, DayLogEntry } from '../types';

interface Worksheet6FormProps {
  onSubmit: (data: Worksheet6Data) => void;
  isLoading: boolean;
  logs: DayLogEntry[];
  setLogs: React.Dispatch<React.SetStateAction<DayLogEntry[]>>;
  observasi: string;
  setObservasi: (val: string) => void;
  dataBukti: string;
  setDataBukti: (val: string) => void;
  trenPemahaman: 'ya' | 'sebagian' | 'tidak' | null;
  setTrenPemahaman: (val: 'ya' | 'sebagian' | 'tidak' | null) => void;
  trenSikap: 'positif' | 'netral' | 'negatif' | null;
  setTrenSikap: (val: 'positif' | 'netral' | 'negatif' | null) => void;
  polaPalingTerlihat: string;
  setPolaPalingTerlihat: (val: string) => void;
  childName: string;
  setChildName: (val: string) => void;
}

const FILLER_PRESETS = [
  {
    materi: "Persamaan Linear Satu Variabel",
    paham: "ya" as const,
    sikap: "positif" as const,
    catatan: "Selesai 5 soal lancar."
  },
  {
    materi: "Konsep FPB dan KPK",
    paham: "sebagian" as const,
    sikap: "netral" as const,
    catatan: "Sering terbalik antara kelipatan & faktor."
  },
  {
    materi: "Struktur Sel Tumbuhan/Hewan",
    paham: "ya" as const,
    sikap: "positif" as const,
    catatan: "Sangat antusias menggambar sel."
  },
  {
    materi: "Penjumlahan Pecahan Berbeda Penyebut",
    paham: "tidak" as const,
    sikap: "negatif" as const,
    catatan: "Anak jenuh di menit ke-10, menolak latihan."
  },
  {
    materi: "Gaya Gravitasi & Magnet",
    paham: "ya" as const,
    sikap: "positif" as const,
    catatan: "Bisa berdiskusi dengan baik paska les."
  },
  {
    materi: "Kosa Kata Bahasa Inggris - Adjective",
    paham: "ya" as const,
    sikap: "positif" as const,
    catatan: "Bisa menyebutkan 10 kosa kata."
  },
  {
    materi: "Metode Eliminasi Aljabar",
    paham: "sebagian" as const,
    sikap: "netral" as const,
    catatan: "Butuh bimbingan di baris terakhir."
  },
  {
    materi: "Rasio dan Perbandingan Senilai",
    paham: "sebagian" as const,
    sikap: "netral" as const,
    catatan: "Masih bingung konsep perbandingan berbalik nilai."
  },
  {
    materi: "Siklus Air & Presipitasi",
    paham: "ya" as const,
    sikap: "positif" as const,
    catatan: "Menjelaskan siklus air dengan gembira."
  },
  {
    materi: "Operasi Hitung Desimal",
    paham: "tidak" as const,
    sikap: "negatif" as const,
    catatan: "Mengantuk sepulang sekolah & les berturut-turut."
  },
  {
    materi: "Tenses: Simple Present Tense",
    paham: "ya" as const,
    sikap: "positif" as const,
    catatan: "Membuat kalimat lisan sederhana."
  },
  {
    materi: "Pecahan Campuran & Pembagian",
    paham: "sebagian" as const,
    sikap: "netral" as const,
    catatan: "Konsep dasarnya benar tapi kurang teliti hitung."
  },
  {
    materi: "Energi Kinetik dan Potensial",
    paham: "ya" as const,
    sikap: "positif" as const,
    catatan: "Paham korelasi tinggi benda & gravitasi."
  },
  {
    materi: "Review Kisi-Kisi Ujian Semester",
    paham: "ya" as const,
    sikap: "positif" as const,
    catatan: "Kilas balik berjalan sangat interaktif."
  }
];

export default function Worksheet6Form({
  onSubmit,
  isLoading,
  logs,
  setLogs,
  observasi,
  setObservasi,
  dataBukti,
  setDataBukti,
  trenPemahaman,
  setTrenPemahaman,
  trenSikap,
  setTrenSikap,
  polaPalingTerlihat,
  setPolaPalingTerlihat,
  childName,
  setChildName
}: Worksheet6FormProps) {
  const [errorLocal, setErrorLocal] = useState('');

  // Auto-calculate trends based on 14 days log
  useEffect(() => {
    let countYa = 0;
    let countSebagian = 0;
    let countTidak = 0;

    let countPositif = 0;
    let countNetral = 0;
    let countNegatif = 0;

    let filledCount = 0;

    logs.forEach(log => {
      if (log.paham) {
        filledCount++;
        if (log.paham === 'ya') countYa++;
        else if (log.paham === 'sebagian') countSebagian++;
        else if (log.paham === 'tidak') countTidak++;
      }
      if (log.sikap) {
        if (log.sikap === 'positif') countPositif++;
        else if (log.sikap === 'netral') countNetral++;
        else if (log.sikap === 'negatif') countNegatif++;
      }
    });

    if (filledCount > 0) {
      // Set majority comprehension trend
      if (countYa >= countSebagian && countYa >= countTidak) {
        setTrenPemahaman('ya');
      } else if (countSebagian >= countYa && countSebagian >= countTidak) {
        setTrenPemahaman('sebagian');
      } else {
        setTrenPemahaman('tidak');
      }

      // Set majority attitude trend
      if (countPositif >= countNetral && countPositif >= countNegatif) {
        setTrenSikap('positif');
      } else if (countNetral >= countPositif && countNetral >= countNegatif) {
        setTrenSikap('netral');
      } else {
        setTrenSikap('negatif');
      }
    }
  }, [logs, setTrenPemahaman, setTrenSikap]);

  const handleApplyDemo = () => {
    setLogs(FILLER_PRESETS.map((p, idx) => ({
      materi: p.materi,
      paham: p.paham,
      sikap: p.sikap,
      catatan: p.catatan
    })));
    setObservasi("Anak menunjukkan pemahaman yang sangat bergantung pada tingkat kebugaran energinya di rumah. Saat lelah sepulang sekolah padat, les justru memicu penolakan.");
    setDataBukti("Pada 4 dari 14 hari audit, anak merasa kelelahan kognitif tinggi ('Tidak' / 'Negatif' pada hari-hari pecahan dan desimal). Sebaliknya, pada materi teori Sains, anak sangat unggul ('Ya' / 'Positif').");
    setPolaPalingTerlihat("Keuletan anak luntur ketika les diposisikan tepat setelah sekolah panjang tanpa jeda pemulihan mental (istirahat mendinginkan). Ada pola korelasi langsung antara kurangnya istirahat kotor dengan tidak tercernanya konsep.");
    if (!childName) {
      setChildName("Alifia");
    }
  };

  const handleClearLogs = () => {
    setLogs(Array(14).fill(null).map(() => ({
      materi: '',
      paham: null,
      sikap: null,
      catatan: ''
    })));
    setObservasi('');
    setDataBukti('');
    setPolaPalingTerlihat('');
  };

  const handleCellChange = (index: number, field: keyof DayLogEntry, value: any) => {
    setLogs(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value
      };
      return copy;
    });
  };

  const handleSubmitInternal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) {
      setErrorLocal('Mohon masukkan nama anak Anda terlebih dahulu.');
      return;
    }
    setErrorLocal('');
    onSubmit({
      id: Date.now().toString(),
      tanggal: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
      childName,
      logs,
      observasi,
      dataBukti,
      trenPemahaman,
      trenSikap,
      polaPalingTerlihat
    });
  };

  return (
    <form onSubmit={handleSubmitInternal} className="space-y-8">
      {/* Profile Connection Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bg-indigo-50 text-indigo-700 px-4 py-1 text-xs font-bold rounded-bl-xl uppercase tracking-wider">
          Nama Anak
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
            <Clipboard className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 text-sm">Nama Lengkap Anak (Tersinkronisasi)</h3>
            {childName ? (
              <p className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {childName}
              </p>
            ) : (
              <p className="text-sm font-medium text-amber-600 mt-1 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Belum diisi. Harap isi terlebih dahulu di Worksheet 1.
              </p>
            )}
          </div>
        </div>
        {errorLocal && (
          <p className="text-red-500 text-xs mt-3 flex items-center gap-1.5 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {errorLocal}
          </p>
        )}
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Activity className="w-24 h-24 text-white" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="p-3 bg-white/10 text-white rounded-xl h-fit">
              <Flame className="w-6 h-6 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-yellow-300">Worksheet 6</span>
              <h4 className="font-bold text-xl text-white mt-0.5 leading-snug">AUDIT 14 HARI KONSISTENSI</h4>
              <p className="text-slate-200 text-xs leading-relaxed mt-1 font-medium">
                Evaluasi terus-menerus selama 14 kali les untuk melacak pola nyata dan mengidentifikasi rintangan belajar harian anak Anda.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleApplyDemo}
              className="px-3.5 py-2 bg-yellow-500 hover:bg-yellow-450 text-blue-950 font-bold rounded-xl text-xs transition shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <Sparkle className="w-3.5 h-3.5 font-extrabold" />
              Isi Demo Otomatis
            </button>
            <button
              type="button"
              onClick={handleClearLogs}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition shrink-0 flex items-center gap-1"
              title="Bersihkan log"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: FORMAT LOG HARIAN RESMI */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base uppercase">FORMAT LOG HARIAN RESMI</h3>
              <p className="text-xs text-slate-400 font-medium">Catat log real-time selama 14 hari periode pengamatan les anak</p>
            </div>
          </div>
          <span className="bg-blue-50 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">14-Day Journal</span>
        </div>

        {/* 14 Days Scrollable Area */}
        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wide border-b border-slate-100 select-none">
              <tr>
                <th className="py-3.5 px-4 text-center w-12">Hari</th>
                <th className="py-3.5 px-3 min-w-[200px]">Materi Pelajaran</th>
                <th className="py-3.5 px-3 text-center w-[180px]">Bisa Jelaskan Kembali?</th>
                <th className="py-3.5 px-3 text-center w-[180px]">Sikap Belajar</th>
                <th className="py-3.5 px-3">Catatan Ringkas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition">
                  <td className="py-3.5 text-center font-bold text-slate-500 bg-slate-50/20">{index + 1}</td>
                  <td className="py-3.5 px-3">
                    <input
                      type="text"
                      value={log.materi}
                      onChange={(e) => handleCellChange(index, 'materi', e.target.value)}
                      placeholder={`Materi hari ke-${index + 1}...`}
                      className="w-full bg-slate-50/50 focus:bg-white border border-slate-150 focus:border-blue-500 rounded-lg px-2.5 py-1.5 focus:outline-none text-xs transition"
                    />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
                      {(['ya', 'sebagian', 'tidak'] as const).map(pVal => (
                        <button
                          key={pVal}
                          type="button"
                          onClick={() => handleCellChange(index, 'paham', pVal)}
                          className={`px-3 py-1 text-[10px] font-extrabold rounded-md uppercase transition ${
                            log.paham === pVal
                              ? pVal === 'ya'
                                ? 'bg-emerald-600 text-white'
                                : pVal === 'sebagian'
                                ? 'bg-amber-500 text-white'
                                : 'bg-rose-600 text-white'
                              : 'text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {pVal === 'ya' ? 'Ya' : pVal === 'sebagian' ? 'Sebagian' : 'Tidak'}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
                      {(['positif', 'netral', 'negatif'] as const).map(sVal => (
                        <button
                          key={sVal}
                          type="button"
                          onClick={() => handleCellChange(index, 'sikap', sVal)}
                          className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md uppercase transition ${
                            log.sikap === sVal
                              ? sVal === 'positif'
                                ? 'bg-emerald-600 text-white'
                                : sVal === 'netral'
                                ? 'bg-amber-500 text-white'
                                : 'bg-rose-600 text-white'
                              : 'text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {sVal === 'positif' ? '☺' : sVal === 'netral' ? '😐' : '☹'} {sVal}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <input
                      type="text"
                      value={log.catatan}
                      onChange={(e) => handleCellChange(index, 'catatan', e.target.value)}
                      placeholder="Catatan kecil..."
                      className="w-full bg-slate-50/50 focus:bg-white border border-slate-150 focus:border-blue-500 rounded-lg px-2.5 py-1.5 focus:outline-none text-xs transition"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* SECTION 2: ANALISIS POLA 14 HARI */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base uppercase">ANALISIS POLA 14 HARI</h3>
              <p className="text-xs text-slate-400 font-medium">Berdasarkan data log di atas, tentukan rangkuman tren & kesimpulan Anda</p>
            </div>
          </div>
          <span className="bg-blue-50 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Pola & Bukti</span>
        </div>

        {/* Multi-grid inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Observasi */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
              🔍 Observasi Utama
            </label>
            <textarea
              value={observasi}
              onChange={(e) => setObservasi(e.target.value)}
              rows={4}
              placeholder="Tuliskan hal-hal penting yang Anda amati selama 14 hari secara langsung..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-800 text-xs transition focus:outline-none leading-relaxed"
            />
          </div>

          {/* Data / Bukti */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
              📊 Data & Bukti Nyata
            </label>
            <textarea
              value={dataBukti}
              onChange={(e) => setDataBukti(e.target.value)}
              rows={4}
              placeholder="Tuliskan bukti nyata yang ditemui (misal: 'Pada hari ke-4 dan ke-10 anak menangis karena lelah, dst')"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-800 text-xs transition focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Automatic calculated trend previews */}
        <div className="p-4 rounded-xl border border-blue-50 bg-blue-50/15 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Comprehension trend Selector */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider block">
              Tren Pemahaman Mayoritas (Otomatis)
            </span>
            <div className="flex flex-col gap-1.5">
              {[
                { val: 'ya', label: 'Mayoritas Ya (Paham)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                { val: 'sebagian', label: 'Mayoritas Sebagian (Mengambang)', color: 'text-amber-700 bg-amber-50 border-amber-200' },
                { val: 'tidak', label: 'Mayoritas Tidak (Bingung)', color: 'text-rose-700 bg-rose-50 border-rose-200' }
              ].map(opt => {
                const isActive = trenPemahaman === opt.val;
                return (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setTrenPemahaman(opt.val as any)}
                    className={`px-3 py-2 text-xs rounded-lg border text-left font-semibold transition ${
                      isActive 
                        ? 'bg-blue-900 border-blue-900 text-white shadow-sm'
                        : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {isActive ? "✓ " : ""} {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Attitude trend Selector */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider block">
              Tren Sikap Belajar Mayoritas (Otomatis)
            </span>
            <div className="flex flex-col gap-1.5">
              {[
                { val: 'positif', label: 'Positif (Bersemangat & Kooperatif)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                { val: 'netral', label: 'Netral (Pasif/Mengikuti Saja)', color: 'text-amber-700 bg-amber-50 border-amber-200' },
                { val: 'negatif', label: 'Negatif (Stres, Jenuh, Menolak)', color: 'text-rose-700 bg-rose-50 border-rose-200' }
              ].map(opt => {
                const isActive = trenSikap === opt.val;
                return (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setTrenSikap(opt.val as any)}
                    className={`px-3 py-2 text-xs rounded-lg border text-left font-semibold transition ${
                      isActive 
                        ? 'bg-blue-900 border-blue-900 text-white shadow-sm'
                        : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {isActive ? "✓ " : ""} {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pola Paling Terlihat */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            🧩 Pola yang Paling Terlihat?
          </label>
          <textarea
            value={polaPalingTerlihat}
            onChange={(e) => setPolaPalingTerlihat(e.target.value)}
            rows={3}
            placeholder="Misal: Saat bimbingan diletakkan setelah les sore melebihi jam 6 sore kognitif anak anjlok total, sedangkan belajar pagi sangat kondusif..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-800 text-xs transition focus:outline-none leading-relaxed"
          />
        </div>

        {/* Visual Impikasi call-out matching style */}
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-xs space-y-2 text-amber-900 leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-amber-800 uppercase text-[10px]">
            <AlertCircle className="w-4 h-4 text-amber-600 animate-bounce" />
            Implikasi Strategis (Pohon Masalah)
          </div>
          <p>
            Jika tren grafik atau pemahaman anak tidak bergerak membaik secara konsisten selama 14 hari pengamatan les, <strong>masalahnya kemungkinan besar terletak pada cacatnya "Sistem Belajar" di rumah/sekolah</strong>, bukan sekedar kurangnya jam belajar les anak.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold uppercase">1. Evaluasi Sistem Belajar</span>
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold uppercase">2. Perbaiki Strategi Asuh</span>
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold uppercase">3. Tingkatkan Hasil Alami</span>
          </div>
        </div>
      </motion.div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 px-6 rounded-2xl font-extrabold text-white text-base shadow-lg flex items-center justify-center gap-3 transition-all duration-300 ${
          isLoading 
            ? 'bg-blue-900/60 cursor-not-allowed' 
            : 'bg-blue-950 hover:bg-blue-900 active:scale-98 shadow-blue-950/20 hover:shadow-xl'
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Sistem sedang merangkum hasil Audit 14 Hari...</span>
          </>
        ) : (
          <>
            <Sparkle className="w-5 h-5 text-yellow-300 animate-pulse" />
            <span>Simpan & Analisis Audit 14 Hari</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      {/* Footer */}
      <div className="border border-slate-150 rounded-2xl p-4 text-center bg-slate-50/50">
        <span className="text-blue-800 font-bold text-[10px] uppercase tracking-widest block mb-1">
          Insight: "Data kecil yang konsisten setiap hari menghasilkan lompatan kognitif yang besar."
        </span>
      </div>
    </form>
  );
}
