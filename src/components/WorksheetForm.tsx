import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  HelpCircle, Eye, CheckSquare, Target, Clipboard, AlertCircle, 
  Lightbulb, Sparkles, User, FileText, ArrowRight, BookOpen, Plus, Sparkle
} from 'lucide-react';
import { RefleksiAwalAnswers, IndicatorSelection, PolaTerlihat, WorksheetData } from '../types';

interface WorksheetFormProps {
  onSubmit: (data: WorksheetData) => void;
  isLoading: boolean;
  refleksi: RefleksiAwalAnswers;
  setRefleksi: React.Dispatch<React.SetStateAction<RefleksiAwalAnswers>>;
  indikator: IndicatorSelection;
  setIndikator: React.Dispatch<React.SetStateAction<IndicatorSelection>>;
  pola: PolaTerlihat;
  setPola: React.Dispatch<React.SetStateAction<PolaTerlihat>>;
  observasiRumah: string;
  setObservasiRumah: (val: string) => void;
  childName: string;
  setChildName: (val: string) => void;
}

const OBSERVATION_PRESETS = [
  "Anak sering menguap atau mengeluh lelah sepulang sekolah dan sebelum berangkat les.",
  "Anak bisa mengerjakan PR atau latihan dengan bimbingan guru les, tetapi kesulitan luar biasa jika mengerjakan tugas mandiri sejenis.",
  "Anak mengikuti les 4-5 kali seminggu sampai malam, tapi saat ditanya apa yang dipelajari ia hanya menjawab 'biasa saja' atau lupa.",
  "Sering ada ketegangan antara orang tua dan anak saat membahas nilai ujian yang masih di bawah target meskipun porsi les sudah ditambah.",
  "Guru les sering memuji keaktifan sosial anak di kelas les, namun hasil evaluasi tertulis menunjukkan konsep dasarnya belum matang."
];

export default function WorksheetForm({
  onSubmit,
  isLoading,
  refleksi,
  setRefleksi,
  indikator,
  setIndikator,
  pola,
  setPola,
  observasiRumah,
  setObservasiRumah,
  childName,
  setChildName
}: WorksheetFormProps) {
  const [errorLocal, setErrorLocal] = useState('');

  const handleRefleksiChange = (key: keyof RefleksiAwalAnswers, value: boolean) => {
    setRefleksi(prev => ({ ...prev, [key]: value }));
  };

  const handleIndikatorChange = (key: keyof IndicatorSelection) => {
    setIndikator(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePresetSelect = (preset: string) => {
    if (observasiRumah) {
      setObservasiRumah(observasiRumah + "\n- " + preset);
    } else {
      setObservasiRumah("- " + preset);
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
      refleksi,
      observasiRumah,
      indikator,
      pola
    });
  };

  return (
    <form onSubmit={handleSubmitInternal} className="space-y-8">
      {/* Profil Anak Input */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bg-blue-50 text-blue-600 px-4 py-1 text-xs font-bold rounded-bl-xl uppercase tracking-wider">
          Informasi Dasar
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Nama Lengkap Anak</h3>
            <p className="text-xs text-slate-400">Masukkan nama anak untuk menyesuaikan analisis laporan</p>
          </div>
        </div>
        <input
          type="text"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          placeholder="Isi nama anak disini (misal: Rian, Shania)..."
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-800 transition shadow-inner focus:outline-none"
        />
        {errorLocal && (
          <p className="text-red-500 text-xs mt-2 flex items-center gap-1.5 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {errorLocal}
          </p>
        )}
      </div>

      {/* Quote Banner */}
      <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200/60 flex gap-4">
        <div className="p-3 bg-amber-100 text-amber-600 rounded-xl h-fit">
          <Lightbulb className="w-6 h-6 animate-pulse" />
        </div>
        <div className="flex-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700">Prinsip Evaluasi</span>
          <p className="text-amber-900 font-medium text-sm leading-relaxed mt-1">
            "Langkah pertama adalah jujur melihat kenyataan, bukan membuktikan bahwa kita sudah benar."
          </p>
        </div>
      </div>

      {/* SECTION 1: REFLEKSI AWAL */}
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
              <h3 className="font-bold text-slate-800 text-base">REFLEKSI AWAL</h3>
              <p className="text-xs text-slate-400">Jawab jujur sejauh mana kondisi ini terjadi pada Anda</p>
            </div>
          </div>
          <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Refleksi</span>
        </div>

        <div className="space-y-3.5 mt-4">
          {[
            { key: 'pendidikanAnak', text: 'Saya merasa sudah melakukan segalanya untuk pendidikan anak' },
            { key: 'jadwalPadat', text: 'Jadwal les anak cukup padat' },
            { key: 'tambahLesNilaiTurun', text: 'Saya sering menambah les saat nilai turun' },
            { key: 'jarangCekPaham', text: 'Saya jarang mengecek apakah anak benar-benar paham' },
            { key: 'fokusAktivitas', text: 'Saya lebih fokus pada aktivitas daripada hasil nyata' }
          ].map((item, idx) => {
            const key = item.key as keyof RefleksiAwalAnswers;
            const currentVal = refleksi[key];

            return (
              <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50/60 rounded-xl border border-slate-100 hover:bg-slate-50 transition gap-3">
                <span className="text-sm font-medium text-slate-700 max-w-lg">{idx + 1}. {item.text}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleRefleksiChange(key, true)}
                    className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold border transition ${
                      currentVal === true 
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Ya
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRefleksiChange(key, false)}
                    className={`flex-1 md:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold border transition ${
                      currentVal === false 
                        ? 'bg-red-500 text-white border-red-500 shadow-sm' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Tidak
                  </button>
                </div>
              </div>
            );
          })}
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
              <h3 className="font-bold text-slate-800 text-base">OBSERVASI RUMAH</h3>
              <p className="text-xs text-slate-400">Tuliskan kondisi yang paling sering terjadi di rumah</p>
            </div>
          </div>
          <span className="bg-violet-50 text-violet-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Kondisi</span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Klik Preset Untuk Mempercepat Pengisian & Edit Sesuka Anda:
          </label>
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {OBSERVATION_PRESETS.map((preset, idx) => (
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
            value={observasiRumah}
            onChange={(e) => setObservasiRumah(e.target.value)}
            rows={4}
            placeholder="Tuliskan keluhan anak, rutinitas les, perjuangan membuat anak belajar, atau klik tombol preset diatas..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-800 font-normal transition placeholder-slate-400 focus:outline-none"
          />
        </div>
      </motion.div>

      {/* SECTION 3: DATA / BUKTI */}
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
              <h3 className="font-bold text-slate-800 text-base">DATA / BUKTI KEBERHASILAN</h3>
              <p className="text-xs text-slate-400">Apa indikator yang selama ini Anda gunakan untuk menilai les berhasil?</p>
            </div>
          </div>
          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Indikator</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {[
            { key: 'anakRajinLes', text: 'Anak rajin datang & tertib les' },
            { key: 'nilaiPrBagus', text: 'Nilai PR atau LK selalu bagus' },
            { key: 'jadwalPenuh', text: 'Jadwal belajar penuh tanpa kosong' },
            { key: 'guruBilangAktif', text: 'Guru les melapor anak aktif bersosialisasi' },
            { key: 'anakBisaMenjelaskan', text: 'Bisa menjelaskan materi konsep (paham sejati)', isGolden: true }
          ].map((item, idx) => {
            const key = item.key as keyof IndicatorSelection;
            const isChecked = indikator[key];

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleIndikatorChange(key)}
                className={`flex items-start text-left p-4 rounded-xl border transition ${
                  isChecked 
                    ? item.isGolden 
                      ? 'bg-emerald-500 border-emerald-600 text-white shadow-sm'
                      : 'bg-blue-600 border-blue-700 text-white shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                } ${item.isGolden && !isChecked ? 'border-dashed border-emerald-300' : ''}`}
              >
                <div className="flex items-center justify-center mt-0.5 mr-3">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    readOnly
                    className="accent-white h-4 w-4 rounded pointer-events-none"
                  />
                </div>
                <div>
                  <span className="text-sm font-bold block leading-snug">
                    {item.text}
                  </span>
                  <span className={`text-[10px] block mt-0.5 ${isChecked ? 'text-white/80' : 'text-slate-400'}`}>
                    {item.isGolden ? '🌟 Pilar Utama Pemahaman' : 'Pilar Aktivitas/Hasil Instan'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* SECTION 4: POLA YANG TERLIHAT */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-950 text-white flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">POLA YANG TERLIHAT</h3>
              <p className="text-xs text-slate-400">Menurut Anda, pola mana yang saat ini lebih mendominasi?</p>
            </div>
          </div>
          <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">Pola</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {[
            { id: 'aktivitas', text: 'Fokus lebih banyak ke Aktivitas', sub: 'Kesibukan, porsi jadwal padat, rutinitas les harian' },
            { id: 'pemahaman', text: 'Fokus lebih banyak ke Pemahaman', sub: 'Kedalaman konsep dasar, kemampuan menjelaskan mandiri' },
            { id: 'belum_yakin', text: 'Belum yakin / Ragu', sub: 'Masih bingung membedakan antara sibuk dengan belajar' }
          ].map((item, idx) => {
            const isSelected = pola === item.id;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setPola(item.id as PolaTerlihat)}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition ${
                  isSelected 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div>
                  <span className="text-sm font-bold block">{item.text}</span>
                  <span className={`text-[11px] block mt-1.5 ${isSelected ? 'text-slate-300' : 'text-slate-400'} leading-relaxed`}>
                    {item.sub}
                  </span>
                </div>
                {isSelected && (
                  <div className="self-end mt-4 bg-emerald-500 text-white rounded-full p-1">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>

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
            <span>Menganalisis Lembar Kerja secara Komprehensif...</span>
          </>
        ) : (
          <>
            <Sparkle className="w-5 h-5 text-amber-400 rotate-12" />
            <span>Kirim & Evaluasi Berbasis Data</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}
