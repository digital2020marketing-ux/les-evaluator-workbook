import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Home, ShieldAlert, AlertCircle, Sparkles, ArrowRight, Sparkle,
  CheckCircle, Plus, Calendar, BookOpen, Clock, Heart, Users
} from 'lucide-react';
import { Worksheet3Audit, Worksheet3Pola, Worksheet3Data } from '../types';

interface Worksheet3FormProps {
  onSubmit: (data: Worksheet3Data) => void;
  isLoading: boolean;
  auditLingkungan: Worksheet3Audit;
  setAuditLingkungan: React.Dispatch<React.SetStateAction<Worksheet3Audit>>;
  pola: Worksheet3Pola;
  setPola: React.Dispatch<React.SetStateAction<Worksheet3Pola>>;
  situasiRumah: string;
  setSituasiRumah: (val: string) => void;
  childName: string;
  setChildName: (val: string) => void;
}

const SITUASI_PRESETS = [
  "Belajar mandiri namun sering terdistraksi gawai (gadget) atau media sosial.",
  "Didampingi belajar oleh orang tua, namun sering berakhir emosi / kemarahan.",
  "Anak langsung belajar / pergi les setelah sekolah tanpa jeda istirahat & makan siang.",
  "Suasana rumah bising / kurang kondusif (misalnya suara TV atau keramaian keluarga).",
  "Orang tua terlalu sibuk bekerja sehingga jarang berdiskusi atau memantau hasil les."
];

export default function Worksheet3Form({
  onSubmit,
  isLoading,
  auditLingkungan,
  setAuditLingkungan,
  pola,
  setPola,
  situasiRumah,
  setSituasiRumah,
  childName,
  setChildName
}: Worksheet3FormProps) {
  const [errorLocal, setErrorLocal] = useState('');

  const handleAuditChange = (key: keyof Worksheet3Audit, val: boolean) => {
    setAuditLingkungan(prev => ({ ...prev, [key]: val }));
  };

  const handlePolaToggle = (key: keyof Worksheet3Pola) => {
    setPola(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePresetSelect = (preset: string) => {
    if (situasiRumah) {
      setSituasiRumah(situasiRumah + "\n- " + preset);
    } else {
      setSituasiRumah("- " + preset);
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
      auditLingkungan,
      situasiRumah,
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
            <Home className="w-5 h-5" />
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
          <Heart className="w-6 h-6 animate-pulse text-red-500" />
        </div>
        <div className="flex-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700">Audit Sistem Rumah</span>
          <p className="text-blue-950 font-semibold text-sm leading-relaxed mt-1">
            "Lingkungan rumah sangat berpengaruh terhadap keberhasilan les anak."
          </p>
        </div>
      </div>

      {/* SECTION 1: AUDIT LINGKUNGAN BELAJAR */}
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
              <h3 className="font-bold text-slate-800 text-base uppercase">AUDIT LINGKUNGAN BELAJAR</h3>
              <p className="text-xs text-slate-400 font-medium">Tentukan Ya atau Tidak untuk menilai ekosistem rumah</p>
            </div>
          </div>
          <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Audit</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase font-extrabold tracking-wide">
                <th className="py-3 text-left">Pertanyaan</th>
                <th className="py-3 text-center w-24">Ya</th>
                <th className="py-3 text-center w-24">Tidak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70">
              {[
                { key: 'rutinitasBelajar', text: 'Rumah punya rutinitas belajar jelas' },
                { key: 'diskusiSetelahLes', text: 'Ada diskusi singkat setelah les' },
                { key: 'tahuMateri', text: 'Orang tua tahu materi yang dipelajari' },
                { key: 'istirahatCukup', text: 'Anak punya waktu istirahat cukup' },
                { key: 'berakhirEmosi', text: 'Belajar di rumah sering berakhir emosi' }
              ].map((item, idx) => {
                const key = item.key as keyof Worksheet3Audit;
                const value = auditLingkungan[key];

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
                        onClick={() => handleAuditChange(key, true)}
                        className={`w-10 h-10 mx-auto rounded-xl border flex items-center justify-center transition-all ${
                          value === true 
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' 
                            : 'bg-white text-slate-300 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full ${value === true ? 'bg-white' : 'border border-slate-300 bg-slate-50'}`} />
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
              <h3 className="font-bold text-slate-800 text-base uppercase">OBSERVASI SITUASI RUMAH</h3>
              <p className="text-xs text-slate-400 font-medium">Situasi belajar di rumah yang paling sering terjadi</p>
            </div>
          </div>
          <span className="bg-violet-50 text-violet-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Situasi</span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Klik Contoh Situasi Rumah atau Tambah Catatan Mandiri:
          </label>
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {SITUASI_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition text-left leading-normal"
              >
                + Contoh {idx + 1}
              </button>
            ))}
          </div>

          <textarea
            value={situasiRumah}
            onChange={(e) => setSituasiRumah(e.target.value)}
            rows={4}
            placeholder="Tuliskan suasana harian belajar anak di rumah saat les maupun di waktu mandiri..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-800 font-normal transition placeholder-slate-400 focus:outline-none"
          />
        </div>
      </motion.div>

      {/* SECTION 3: POLA SISTEM RUMAH */}
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
              <h3 className="font-bold text-slate-800 text-base uppercase">POLA SISTEM RUMAH</h3>
              <p className="text-xs text-slate-400 font-medium">Pilih satu atau lebih kondisi yang mencerminkan keadaan saat ini</p>
            </div>
          </div>
          <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Pola Rumah</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
          {[
            { key: 'rumahAktif', title: 'Rumah Aktif Mendukung Belajar', desc: 'Menyediakan fasilitas, waktu khusus, dan kenyamanan emosional yang menguatkan nalar.' },
            { key: 'rumahPasif', title: 'Rumah Masih Pasif', desc: 'Kurang terstruktur, menyerahkan bimbingan 100% pada guru les tanpa keterlibatan emosional.' },
            { key: 'seringTekanan', title: 'Belajar Sering Dipenuhi Tekanan', desc: 'Berorientasi ketat pada target nilai secara kaku, disertai ancaman atau amarah berlebih.' }
          ].map((item, idx) => {
            const key = item.key as keyof Worksheet3Pola;
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
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-widest block">Hukum Hubungan Rumah & Les</span>
          <p className="text-rose-900 text-xs leading-relaxed mt-1 font-semibold">
            "Jika rumah pasif: hasil les sulit bertahan lama."
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
            <span>Mengevaluasi Ekosistem Rumah...</span>
          </>
        ) : (
          <>
            <Sparkle className="w-5 h-5 text-amber-400 rotate-12" />
            <span>Simpan & Diagnosis Sistem Rumah</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      {/* Footer Quote Bottom Accent */}
      <div className="border border-slate-100 rounded-2xl py-4 px-5 text-center bg-slate-50/50 flex flex-col sm:flex-row items-center justify-center gap-2">
        <span className="text-slate-700 font-semibold text-xs">
          "Rumah yang mendukung akan membuat hasil les lebih kuat, bermakna, dan bertahan lebih lama."
        </span>
        <span className="text-xs text-slate-400">
          - Smart Learning System
        </span>
      </div>
    </form>
  );
}
