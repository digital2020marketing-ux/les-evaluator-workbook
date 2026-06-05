import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Clipboard, Activity, AlertCircle, Sparkle, ArrowRight, BookOpen, Check, ThumbsUp, HelpCircle
} from 'lucide-react';
import { Worksheet5Rutinitas, Worksheet5Data } from '../types';

interface Worksheet5FormProps {
  onSubmit: (data: Worksheet5Data) => void;
  isLoading: boolean;
  rutinitas: Worksheet5Rutinitas;
  setRutinitas: React.Dispatch<React.SetStateAction<Worksheet5Rutinitas>>;
  konsistensi: 'sangat' | 'cukup' | 'kurang' | 'tidak' | null;
  setKonsistensi: (val: 'sangat' | 'cukup' | 'kurang' | 'tidak' | null) => void;
  bagianPalingSulit: string;
  setBagianPalingSulit: (val: string) => void;
  rencanaPerbaikan: string;
  setRencanaPerbaikan: (val: string) => void;
  childName: string;
  setChildName: (val: string) => void;
}

const HABIT_ITEMS = [
  {
    key: 'istirahatMendinginkan',
    catatanKey: 'istirahatCatatan',
    title: '1. Istirahat 15–30 menit',
    tujuan: 'Menyegarkan pikiran dan mengurangi kelelahan agar anak kembali fresh.',
    placeholder: 'Contoh: Minum susu hangat, rebahan, cuci muka, dsb.'
  },
  {
    key: 'diskusiSingkat',
    catatanKey: 'diskusiCatatan',
    title: '2. Diskusi singkat (10–15 menit)',
    tujuan: 'Memahami inti materi yang baru dipelajari dan mengklarifikasi perasaan anak.',
    placeholder: 'Contoh: Diskusi 2 soal tersulit hari ini secara santai.'
  },
  {
    key: 'reviewMateri',
    catatanKey: 'reviewCatatan',
    title: '3. Review materi les (15–20 menit)',
    tujuan: 'Memperkuat pemahaman konsep dasar sebelum memorinya memudar.',
    placeholder: 'Contoh: Baca sekilas modul les, coret-coret rumus di whiteboard.'
  },
  {
    key: 'kerjakanLatihan',
    catatanKey: 'kerjakanCatatan',
    title: '4. Kerjakan latihan / PR',
    tujuan: 'Mengaplikasikan langsung konsep-konsep yang dipelajari secara mandiri.',
    placeholder: 'Contoh: Kerjakan 2-3 latihan mandiri tanpa didekte.'
  },
  {
    key: 'rencanaBesok',
    catatanKey: 'rencanaCatatan',
    title: '5. Rencana belajar esok hari',
    tujuan: 'Membentuk ritme, kedisiplinan belajar, dan agenda yang terencana.',
    placeholder: 'Contoh: Cek jadwal pelajaran esok, siapkan buku di tas.'
  }
];

const KONSISTENSI_OPTIONS = [
  { value: 'sangat', label: 'Sangat konsisten (80–100%)', bg: 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100/50', activeBg: 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-600/25', emoji: '😊' },
  { value: 'cukup', label: 'Cukup konsisten (50–79%)', bg: 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100/50', activeBg: 'bg-amber-500 border-amber-500 text-white shadow-amber-500/25', emoji: '😐' },
  { value: 'kurang', label: 'Kurang konsisten (20–49%)', bg: 'bg-orange-50 border-orange-200 text-orange-850 hover:bg-orange-100/50', activeBg: 'bg-orange-500 border-orange-500 text-white shadow-orange-500/25', emoji: '😕' },
  { value: 'tidak', label: 'Tidak konsisten (0–19%)', bg: 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100/50', activeBg: 'bg-rose-600 border-rose-600 text-white shadow-rose-600/25', emoji: '😡' }
] as const;

export default function Worksheet5Form({
  onSubmit,
  isLoading,
  rutinitas,
  setRutinitas,
  konsistensi,
  setKonsistensi,
  bagianPalingSulit,
  setBagianPalingSulit,
  rencanaPerbaikan,
  setRencanaPerbaikan,
  childName,
  setChildName
}: Worksheet5FormProps) {
  const [errorLocal, setErrorLocal] = useState('');

  const handleYNChange = (key: keyof Worksheet5Rutinitas, val: boolean) => {
    setRutinitas(prev => ({ ...prev, [key]: val }));
  };

  const handleNotesChange = (key: keyof Worksheet5Rutinitas, val: string) => {
    setRutinitas(prev => ({ ...prev, [key]: val }));
  };

  const handlePresetSulit = (val: string) => {
    setBagianPalingSulit(bagianPalingSulit ? bagianPalingSulit + "; " + val : val);
  };

  const handlePresetPerbaikan = (val: string) => {
    setRencanaPerbaikan(rencanaPerbaikan ? rencanaPerbaikan + "; " + val : val);
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
      rutinitas,
      konsistensi,
      bagianPalingSulit,
      rencanaPerbaikan
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

      {/* Quote Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Activity className="w-24 h-24 text-white" />
        </div>
        <div className="flex gap-4">
          <div className="p-3 bg-white/10 text-white rounded-xl h-fit">
            <Activity className="w-6 h-6 text-emerald-300 animate-pulse" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200">Sistem SOP Belajar</span>
            <h4 className="font-bold text-lg text-white mt-1 leading-snug">SOP RUMAH SETELAH ANAK PULANG LES</h4>
            <p className="text-slate-200 text-xs leading-relaxed mt-2.5 font-medium">
              "Les membangun pengetahuan, tetapi rumah menguatkan pemahaman. SOP yang baik hari ini = hasil yang lebih baik esok hari."
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: RUTINITAS SETELAH ANAK PULANG LES */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-900 text-white flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base uppercase">RUTINITAS SETELAH PULANG LES</h3>
              <p className="text-xs text-slate-400 font-medium">Centang Ya atau Tidak serta isi detail cara melaksanakannya</p>
            </div>
          </div>
          <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">SOP Checklist</span>
        </div>

        {/* List of 5 Habit Items */}
        <div className="space-y-6">
          {HABIT_ITEMS.map((item, idx) => {
            const yKey = item.key as keyof Worksheet5Rutinitas;
            const cKey = item.catatanKey as keyof Worksheet5Rutinitas;
            const yesNoVal = rutinitas[yKey];
            const noteVal = rutinitas[cKey] as string;

            return (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition duration-150 space-y-3.5">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-bold text-sm text-slate-800">{item.title}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.tujuan}</p>
                  </div>

                  {/* Y/N Selector Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleYNChange(yKey, true)}
                      className={`flex-1 md:flex-initial px-4 py-2 text-xs font-bold rounded-lg border transition ${
                        yesNoVal === true 
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' 
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100/55'
                      }`}
                    >
                      Ya
                    </button>
                    <button
                      type="button"
                      onClick={() => handleYNChange(yKey, false)}
                      className={`flex-1 md:flex-initial px-4 py-2 text-xs font-bold rounded-lg border transition ${
                        yesNoVal === false 
                          ? 'bg-rose-500 border-rose-500 text-white shadow-sm' 
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100/55'
                      }`}
                    >
                      Tidak
                    </button>
                  </div>
                </div>

                {/* Optional Catatan field */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Catatan Pelaksanaan</span>
                  <input
                    type="text"
                    value={noteVal}
                    onChange={(e) => handleNotesChange(cKey, e.target.value)}
                    placeholder={item.placeholder}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* SECTION 2: EVALUASI KONSISTENSI */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-900 text-white flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base uppercase">EVALUASI RUTINITAS</h3>
              <p className="text-xs text-slate-400 font-medium">Seberapa konsisten SOP ini berjalan di lingkungan keluarga Anda?</p>
            </div>
          </div>
          <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Evaluasi</span>
        </div>

        {/* Consolidated selector options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {KONSISTENSI_OPTIONS.map((opt) => {
            const isSelected = konsistensi === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setKonsistensi(opt.value)}
                className={`p-4 border rounded-xl font-bold text-sm flex items-center gap-3 text-left transition duration-200 leading-normal ${
                  isSelected 
                    ? `${opt.activeBg} scale-[1.02] shadow-md` 
                    : `${opt.bg} cursor-pointer`
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-xs leading-relaxed">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* SECTION 3: CATATAN & PERBAIKAN */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-900 text-white flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base uppercase">CATATAN & RENCANA PERBAIKAN</h3>
              <p className="text-xs text-slate-400 font-medium">Petakan tantangan harian dan cara termudah untuk mengatasinya</p>
            </div>
          </div>
          <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Perbaikan</span>
        </div>

        {/* Input 1: Paling Sulit */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
            Bagian mana yang paling sulit dijalankan?
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {[
              "Mematikan gadget pasca les",
              "Sikap anak jenuh karena tidak ada transisi istirahat",
              "Fokus mereview kembali materi les",
              "Review secara menyenangkan tanpa terkesan menguji"
            ].map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handlePresetSulit(p)}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded-lg px-2.5 py-1 transition"
              >
                + {p}
              </button>
            ))}
          </div>
          <textarea
            value={bagianPalingSulit}
            onChange={(e) => setBagianPalingSulit(e.target.value)}
            rows={3}
            placeholder="Misal: Diskusi materi les terasa terlalu menegangkan, anak menolak karena lelah, dsb."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-800 text-xs transition placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Input 2: Rencana Perbaikan */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
            Apa yang akan Anda lakukan untuk memperbaikinya?
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {[
              "Memulai santai sambil minum teh/emoticon gembira",
              "Setel alarm transisi istirahat agar terjaga",
              "Apresiasi usaha anak daripada sekadar menuntut kelancaran",
              "Kerja sama kompak dengan pasangan paska-pulang les"
            ].map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handlePresetPerbaikan(p)}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 rounded-lg px-2.5 py-1 transition"
              >
                + {p}
              </button>
            ))}
          </div>
          <textarea
            value={rencanaPerbaikan}
            onChange={(e) => setRencanaPerbaikan(e.target.value)}
            rows={3}
            placeholder="Misal: Membuat transisi istirahat 30 menit penuh tanpa gadget, kemudian mendengarkan cerita belajarnya dengan bumbu gembira..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-800 text-xs transition placeholder-slate-400 focus:outline-none"
          />
        </div>
      </motion.div>

      {/* SUBMIT W5 BUTTON */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 px-6 rounded-2xl font-extrabold text-white text-base shadow-lg flex items-center justify-center gap-3 transition-all duration-300 ${
          isLoading 
            ? 'bg-teal-900/60 cursor-not-allowed' 
            : 'bg-teal-950 hover:bg-teal-900 active:scale-98 shadow-teal-950/20 hover:shadow-xl'
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Menganalisis Konsistensi SOP...</span>
          </>
        ) : (
          <>
            <Sparkle className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>Simpan & Analisis SOP</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      {/* Consistency Footer */}
      <div className="border border-slate-100 rounded-2xl p-4 text-center bg-slate-50/50">
        <span className="text-teal-700 font-extrabold text-[10px] uppercase tracking-widest block mb-1">
          Konsistensi kecil setiap hari &gt; usaha besar tapi tidak teratur
        </span>
      </div>
    </form>
  );
}
