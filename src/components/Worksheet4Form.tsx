import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Home, Brain, ShieldAlert, AlertCircle, Sparkles, ArrowRight, Sparkle,
  CheckCircle, Plus, Calendar, BookOpen, Clock, Heart, Users
} from 'lucide-react';
import { Worksheet4MentalModel, Worksheet4Data } from '../types';

interface Worksheet4FormProps {
  onSubmit: (data: Worksheet4Data) => void;
  isLoading: boolean;
  mentalModel: Worksheet4MentalModel;
  setMentalModel: React.Dispatch<React.SetStateAction<Worksheet4MentalModel>>;
  refleksiPerubahan: string;
  setRefleksiPerubahan: (val: string) => void;
  childName: string;
  setChildName: (val: string) => void;
}

const REFLEKSI_PRESETS = [
  "Bimbel hanyalah alat bantu tambahan. Pusat kendali & pilar utama sistem belajar ada pada kenyamanan serta rutinitas di rumah.",
  "Ternyata menjejalkan jadwal les tiada henti justru membuat anak jenuh dan menghilangkan nalar kritis berpikirnya.",
  "Saya menyadari pentingnya menanyakan 'bagaimana perasaanmu hari ini?' setelah les daripada 'ada tugas PR apa?' secara menuntut.",
  "Berkomitmen meluangkan waktu 5-10 menit untuk mendengarkan anak menceritakan ulang konsep belajarnya secara gembira."
];

export default function Worksheet4Form({
  onSubmit,
  isLoading,
  mentalModel,
  setMentalModel,
  refleksiPerubahan,
  setRefleksiPerubahan,
  childName,
  setChildName
}: Worksheet4FormProps) {
  const [errorLocal, setErrorLocal] = useState('');

  const handleAuditChange = (key: keyof Worksheet4MentalModel, val: boolean) => {
    setMentalModel(prev => ({ ...prev, [key]: val }));
  };

  const handlePresetSelect = (preset: string) => {
    if (refleksiPerubahan) {
      setRefleksiPerubahan(refleksiPerubahan + "\n- " + preset);
    } else {
      setRefleksiPerubahan("- " + preset);
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
      mentalModel,
      refleksiPerubahan
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
            <Users className="w-5 h-5" />
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
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Brain className="w-24 h-24 text-white" />
        </div>
        <div className="flex gap-4">
          <div className="p-3 bg-white/10 text-white rounded-xl h-fit">
            <Brain className="w-6 h-6 text-amber-300 animate-pulse" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-blue-200">Filosofi Inti Worksheet 4</span>
            <h4 className="font-bold text-lg text-white mt-1 leading-snug">BIMBEL ITU ALAT, BUKAN SISTEM</h4>
            <p className="text-blue-150 text-xs leading-relaxed mt-2.5 font-medium">
              "Memahami peran bimbel dengan perspektif yang tepat: alat bantu, bukan pengganti sistem belajar."
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: MENTAL MODEL AUDIT */}
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
              <h3 className="font-bold text-slate-800 text-base uppercase">MENTAL MODEL AUDIT</h3>
              <p className="text-xs text-slate-400 font-medium">Uji keyakinan dasar Anda sebagai orang tua mengenai bimbingan belajar</p>
            </div>
          </div>
          <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Audit</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase font-extrabold tracking-wide">
                <th className="py-3 text-left">Pernyataan Checklist</th>
                <th className="py-3 text-center w-24">Ya</th>
                <th className="py-3 text-center w-24">Tidak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70">
              {[
                { key: 'pentingAnakSudahLes', text: 'Saya pernah merasa "yang penting anak sudah les"' },
                { key: 'harapBimbelSelesaikanMasalah', text: 'Saya berharap bimbel menyelesaikan semua masalah belajar' },
                { key: 'jarangEvaluasiEfektivitas', text: 'Saya jarang mengevaluasi efektivitas les' },
                { key: 'pahamRumahPusatSistem', text: 'Saya mulai memahami bahwa rumah tetap pusat sistem' }
              ].map((item, idx) => {
                const key = item.key as keyof Worksheet4MentalModel;
                const value = mentalModel[key];

                return (
                  <tr key={idx} className="hover:bg-slate-50/50 transition duration-150">
                    <td className="py-4 text-sm font-semibold text-slate-700 flex items-center gap-3">
                      <span className="bg-slate-100 text-slate-500 w-5 h-5 text-[10px] rounded-full flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      {item.text}
                    </td>
                    
                    <td className="py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleAuditChange(key, true)}
                        className={`w-10 h-10 mx-auto rounded-xl border flex items-center justify-center transition-all ${
                          value === true 
                            ? 'bg-blue-950 border-blue-950 text-white shadow-sm' 
                            : 'bg-white text-slate-300 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full ${value === true ? 'bg-amber-400' : 'border border-slate-300 bg-slate-50'}`} />
                      </button>
                    </td>

                    <td className="py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleAuditChange(key, false)}
                        className={`w-10 h-10 mx-auto rounded-xl border flex items-center justify-center transition-all ${
                          value === false 
                            ? 'bg-rose-500 border-rose-500 text-white shadow-sm' 
                            : 'bg-white text-slate-300 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full ${value === false ? 'bg-white' : 'border border-slate-300 bg-slate-50'}`} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* SECTION 2: REFLEKSI */}
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
              <h3 className="font-bold text-slate-800 text-base uppercase">REFLEKSI MANDIRI PARENTIL</h3>
              <p className="text-xs text-slate-400 font-medium">Apa perubahan cara berpikir yang paling terasa setelah pengisian workbook ini?</p>
            </div>
          </div>
          <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Refleksi</span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Klik Pilihan Komitmen atau Tambah Catatan Pribadi:
          </label>
          <div className="flex flex-col gap-2 mb-4">
            {REFLEKSI_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className="text-xs text-left bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-slate-700 hover:bg-indigo-50 hover:text-indigo-800 hover:border-indigo-300 transition duration-150 leading-relaxed"
              >
                <span className="font-bold text-indigo-700 mr-1.5">+ Komitmen {idx + 1}:</span>
                {preset}
              </button>
            ))}
          </div>

          <textarea
            value={refleksiPerubahan}
            onChange={(e) => setRefleksiPerubahan(e.target.value)}
            rows={5}
            placeholder="Tuliskan di sini komitmen aksi nyata atau kesadaran baru Anda yang paling kuat..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-800 font-normal transition placeholder-slate-400 focus:outline-none"
          />
        </div>
      </motion.div>

      {/* CORE INTEGRATION IMPLICATION BANNER */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 flex gap-4">
        <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl h-fit">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block">Kesimpulan Akhir Sistem Belajar</span>
          <p className="text-amber-950 text-xs leading-relaxed mt-1 font-semibold">
            "Bimbel adalah alat bantu. Sistem belajar yang kuat selalu dibangun di rumah bersama orang tua."
          </p>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 px-6 rounded-2xl font-extrabold text-base text-white shadow-lg flex items-center justify-center gap-3 transition-all duration-300 ${
          isLoading 
            ? 'bg-indigo-900/60 cursor-not-allowed' 
            : 'bg-indigo-950 hover:bg-slate-900 active:scale-98 shadow-indigo-950/20 hover:shadow-xl'
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Menganalisis Pola Mental Model...</span>
          </>
        ) : (
          <>
            <Sparkle className="w-5 h-5 text-amber-300 rotate-12 animate-pulse" />
            <span>Simpan & Diagnosis Mental Model</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      {/* Final Brand Footer Accent */}
      <div className="border border-slate-100 rounded-2xl py-4 px-5 text-center bg-slate-50/50">
        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest block mb-1">
          Smart Learning System
        </span>
        <span className="text-slate-500 font-medium text-xs leading-relaxed max-w-lg mx-auto block">
          Workbook audit ini membantu Anda memetakan pendidikan anak secara rasional dan melahirkan kesiapan akademis mendalam yang berkelanjutan.
        </span>
      </div>
    </form>
  );
}
