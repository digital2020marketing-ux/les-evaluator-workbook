import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Lightbulb, AlertCircle, HelpCircle, BookOpen, Brain, 
  ArrowRight, Sparkles, Scale, RefreshCw, PenTool, CheckCircle, Sparkle
} from 'lucide-react';
import { Worksheet2CaraBelajar, Worksheet2Pola, Worksheet2Data, JawabanTigaSkala } from '../types';

interface Worksheet2FormProps {
  onSubmit: (data: Worksheet2Data) => void;
  isLoading: boolean;
  caraBelajar: Worksheet2CaraBelajar;
  setCaraBelajar: React.Dispatch<React.SetStateAction<Worksheet2CaraBelajar>>;
  pola: Worksheet2Pola;
  setPola: React.Dispatch<React.SetStateAction<Worksheet2Pola>>;
  materiKesulitan: string;
  setMateriKesulitan: (val: string) => void;
  childName: string;
  setChildName: (val: string) => void;
}

const MATERI_PRESETS = [
  "Matematika: Soal cerita pecahan, pembagian desimal, atau persen.",
  "Sains/IPA: Pemahaman konsep siklus air, listrik dinamis, atau gaya gesek.",
  "Bahasa Inggris: Struktur tatanan bahasa (Grammar & Tenses) & memahami bacaan panjang.",
  "IPS/Sejarah: Menghafal tanggal dan tokoh tanpa memahami konteks sebab-akibat peristiwa.",
  "Matematika Aljabar: Mengubah variabel abstrak menjadi persamaan bilangan nyata."
];

export default function Worksheet2Form({
  onSubmit,
  isLoading,
  caraBelajar,
  setCaraBelajar,
  pola,
  setPola,
  materiKesulitan,
  setMateriKesulitan,
  childName,
  setChildName
}: Worksheet2FormProps) {
  const [errorLocal, setErrorLocal] = useState('');

  const handleCaraBelajarChange = (key: keyof Worksheet2CaraBelajar, val: JawabanTigaSkala) => {
    setCaraBelajar(prev => ({ ...prev, [key]: val }));
  };

  const handlePolaToggle = (key: keyof Worksheet2Pola) => {
    setPola(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePresetSelect = (preset: string) => {
    if (materiKesulitan) {
      setMateriKesulitan(materiKesulitan + "\n- " + preset);
    } else {
      setMateriKesulitan("- " + preset);
    }
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
      caraBelajar,
      materiKesulitan,
      pola
    });
  };

  return (
    <form onSubmit={handleSubmitInternal} className="space-y-8">
      {/* Profile Name Connection */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bg-blue-50 text-blue-600 px-4 py-1 text-xs font-bold rounded-bl-xl uppercase tracking-wider">
          Nama Anak
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <BookOpen className="w-5 h-5" />
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
      <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 flex gap-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl h-fit">
          <Lightbulb className="w-6 h-6 animate-pulse" />
        </div>
        <div className="flex-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700">Prinsip Sinkronisasi</span>
          <p className="text-blue-950 font-semibold text-sm leading-relaxed mt-1">
            "Pastikan materi les selaras dengan kebutuhan anak dan cara belajarnya."
          </p>
        </div>
      </div>

      {/* SECTION 1: EVALUASI CARA BELAJAR */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-950 text-white flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base uppercase">EVALUASI CARA ANAK BELAJAR</h3>
              <p className="text-xs text-slate-400 font-medium">Pilih tingkat kesesuaian indikator di bawah ini</p>
            </div>
          </div>
          <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Evaluasi</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase font-extrabold tracking-wide">
                <th className="py-3 text-left">Indikator</th>
                <th className="py-3 text-center w-24">Ya</th>
                <th className="py-3 text-center w-24">Sebagian</th>
                <th className="py-3 text-center w-24">Tidak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70">
              {[
                { key: 'menjelaskanUlang', text: 'Anak mampu menjelaskan ulang materi' },
                { key: 'memahamiKonsep', text: 'Anak memahami konsep, bukan hanya hafalan' },
                { key: 'soalBerbeda', text: 'Anak bisa mengerjakan soal berbeda bentuk' },
                { key: 'materiSelaras', text: 'Materi les selaras dengan kebutuhan sekolah' }
              ].map((item, idx) => {
                const key = item.key as keyof Worksheet2CaraBelajar;
                const value = caraBelajar[key];

                return (
                  <tr key={idx} className="hover:bg-slate-50/50 transition duration-150">
                    <td className="py-4 text-sm font-semibold text-slate-700 flex items-center gap-3">
                      <span className="bg-slate-100 text-slate-500 w-5 h-5 text-[10px] rounded-full flex items-center justify-center">
                        {idx + 1}
                      </span>
                      {item.text}
                    </td>
                    
                    <td className="py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleCaraBelajarChange(key, 'ya')}
                        className={`w-10 h-10 mx-auto rounded-xl border flex items-center justify-center transition-all ${
                          value === 'ya' 
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' 
                            : 'bg-white text-slate-300 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full ${value === 'ya' ? 'bg-white' : 'border border-slate-300 bg-slate-50'}`} />
                      </button>
                    </td>

                    <td className="py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleCaraBelajarChange(key, 'sebagian')}
                        className={`w-10 h-10 mx-auto rounded-xl border flex items-center justify-center transition-all ${
                          value === 'sebagian' 
                            ? 'bg-amber-500 border-amber-500 text-white shadow-sm' 
                            : 'bg-white text-slate-300 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full ${value === 'sebagian' ? 'bg-white' : 'border border-slate-300 bg-slate-50'}`} />
                      </button>
                    </td>

                    <td className="py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleCaraBelajarChange(key, 'tidak')}
                        className={`w-10 h-10 mx-auto rounded-xl border flex items-center justify-center transition-all ${
                          value === 'tidak' 
                            ? 'bg-rose-500 border-rose-500 text-white shadow-sm' 
                            : 'bg-white text-slate-300 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full ${value === 'tidak' ? 'bg-white' : 'border border-slate-300 bg-slate-50'}`} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* SECTION 2: OBSERVASI */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-950 text-white flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base uppercase">OBSERVASI TANTANGAN KONSEPTUAL</h3>
              <p className="text-xs text-slate-400 font-medium">Materi yang paling sering membuat anak kesulitan</p>
            </div>
          </div>
          <span className="bg-violet-50 text-violet-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Materi</span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Klik Contoh Pelajaran Sulit atau Tambah Karya Mandiri:
          </label>
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {MATERI_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition text-left leading-normal"
              >
                + Preset {idx + 1}
              </button>
            ))}
          </div>

          <textarea
            value={materiKesulitan}
            onChange={(e) => setMateriKesulitan(e.target.value)}
            rows={4}
            placeholder="Tuliskan materi pelajaran spesifik dan letak kemacetan pemahamannya..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-800 font-normal transition placeholder-slate-400 focus:outline-none"
          />
        </div>
      </motion.div>

      {/* SECTION 3: POLA BELAJAR ANAK (SINKRONISASI) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-950 text-white flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base uppercase">POLA SINKRONISASI YANG TERLIHAT</h3>
              <p className="text-xs text-slate-400 font-medium">Beri centang pada pola-pola yang saat ini kerap terjadi</p>
            </div>
          </div>
          <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Pola Belajar</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
          {[
            { key: 'lebihBanyakMeniru', title: 'Anak Lebih Banyak Meniru', desc: 'Hanya bisa menyalin rumus dan menyalin jawaban persis contoh soal tanpa bernalar.' },
            { key: 'mulaiPahamKonsep', title: 'Mulai Memahami Konsep', desc: 'Bisa mengaitkan materi sekolah dengan kehidupan nyata dan mengerti dasar rumus.' },
            { key: 'bergantungArahanGuru', title: 'Bergantung Arahan Guru', desc: 'Tidak akan belajar atau mengerjakan tugas mandiri jika tidak ada tutor yang menuntun.' }
          ].map((item, idx) => {
            const key = item.key as keyof Worksheet2Pola;
            const isChecked = pola[key];

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handlePolaToggle(key)}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  isChecked 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div>
                  <span className="text-sm font-bold block">{item.title}</span>
                  <span className={`text-[11px] block mt-1.5 leading-relaxed ${isChecked ? 'text-slate-300' : 'text-slate-400'}`}>
                    {item.desc}
                  </span>
                </div>
                
                {isChecked && (
                  <div className="self-end mt-4 bg-emerald-500 text-white rounded-full p-1">
                    <CheckCircle className="w-3.5 h-3.5 fill-white text-emerald-500" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* IMPLIKASI BANNER */}
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex gap-4">
        <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl max-h-11">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest block">Implikasi Jangka Panjang</span>
          <p className="text-rose-900 text-xs leading-relaxed mt-1 font-semibold">
            "Jika anak hanya mengikuti pola meniru/menghafal: kemungkinan besar pemahaman konsep dasar belum kuat. Aktivitas padat tapi pemahaman rendah."
          </p>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 px-6 rounded-2xl font-extrabold text-base text-white shadow-lg flex items-center justify-center gap-3 transition-all duration-300 ${
          isLoading 
            ? 'bg-blue-900/60 cursor-not-allowed' 
            : 'bg-blue-950 hover:bg-blue-900 active:scale-98 shadow-blue-900/10 hover:shadow-xl'
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Mengevaluasi Keselarasan Cara Belajar...</span>
          </>
        ) : (
          <>
            <Sparkle className="w-5 h-5 text-amber-400 rotate-12" />
            <span>Simpan & Diagnosis Keselarasan</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      {/* Footer Quote Bottom Accent */}
      <div className="border border-slate-100 rounded-2xl py-4 px-5 text-center bg-slate-50/50 flex flex-col sm:flex-row items-center justify-center gap-2">
        <span className="text-slate-700 font-semibold text-xs">
          "Fokuskan pada pemahaman, bukan sekadar menyelesaikan banyak les."
        </span>
        <span className="text-xs text-slate-400">
          - Smart Learning System
        </span>
      </div>
    </form>
  );
}
