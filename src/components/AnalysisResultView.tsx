import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, AlertTriangle, Eye, ArrowLeft, Printer, RefreshCw, 
  CheckSquare, MessageSquare, Award, Compass, HelpCircle, Target, Square, CheckCircle2
} from 'lucide-react';
import { AnalysisResponse, WorksheetData } from '../types';

interface AnalysisResultViewProps {
  analysis: AnalysisResponse;
  worksheetData: any;
  worksheetType?: 'worksheet1' | 'worksheet2' | 'worksheet3' | 'worksheet4' | 'worksheet5' | 'worksheet6' | 'worksheet7';
  onReset: () => void;
}

export default function AnalysisResultView({ 
  analysis, 
  worksheetData, 
  worksheetType = 'worksheet1', 
  onReset 
}: AnalysisResultViewProps) {
  const [checkedRecs, setCheckedRecs] = useState<Record<number, boolean>>({});

  const toggleRecommendation = (index: number) => {
    setCheckedRecs(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // Determine score colors
  const getScoreColor = (score: number) => {
    if (score >= 80) return { text: 'text-emerald-600', ring: 'stroke-emerald-500', bg: 'bg-emerald-50' };
    if (score >= 60) return { text: 'text-amber-600', ring: 'stroke-amber-500', bg: 'bg-amber-50' };
    return { text: 'text-rose-600', ring: 'stroke-rose-500', bg: 'bg-rose-50' };
  };

  const scoreColor = getScoreColor(analysis.efficiencyScore);
  const strokeDashoffset = 251 - (251 * Math.min(100, Math.max(0, analysis.efficiencyScore))) / 100;

  const handlePrint = () => {
    window.print();
  };

  const isPemahamanOriented = analysis.category.toLowerCase().includes('paham') || 
                              analysis.category.toLowerCase().includes('mandiri') || 
                              analysis.category.toLowerCase().includes('selaras') ||
                              analysis.category.toLowerCase().includes('aktif') ||
                              analysis.category.toLowerCase().includes('suportif') ||
                              analysis.category.toLowerCase().includes('lanjut') ||
                              analysis.category.toLowerCase().includes('strategis') ||
                              analysis.category.toLowerCase().includes('strategi');

  const isAktivitasOriented = analysis.category.toLowerCase().includes('aktivitas') || 
                              analysis.category.toLowerCase().includes('meniru') || 
                              analysis.category.toLowerCase().includes('gantung') ||
                              analysis.category.toLowerCase().includes('lemah') ||
                              analysis.category.toLowerCase().includes('pasif') ||
                              analysis.category.toLowerCase().includes('tekanan') ||
                              analysis.category.toLowerCase().includes('tidak');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      id="printable-report"
      className="space-y-8 print:p-0 print:bg-white"
    >
      {/* Top Action Row (Hidden on print) */}
      <div className="flex justify-between items-center print:hidden">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Isi Ulang Lembar Kerja
        </button>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition text-sm font-bold"
          >
            <Printer className="w-4 h-4" />
            Cetak Laporan
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 bg-blue-950 hover:bg-blue-900 text-white px-4 py-2 rounded-xl transition text-sm font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Mulai Baru
          </button>
        </div>
      </div>

      {/* Header Info Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-md">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12">
          <Sparkles className="w-56 h-56" />
        </div>
        <div className="relative">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-950 px-3 py-1 rounded-full">
            Hasil Diagnosis Les Evaluator
          </span>
          <h2 className="text-xl md:text-2xl font-black mt-3 text-white leading-snug">
            {analysis.title}
          </h2>
          <div className="flex flex-wrap items-center mt-6 gap-y-2 gap-x-6 text-sm text-slate-300">
            <div>
              <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider">Nama Anak</span>
              <span className="font-semibold text-white">{worksheetData.childName}</span>
            </div>
            <div className="h-4 w-px bg-slate-700 hidden sm:block" />
            <div>
              <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider">Tanggal Evaluasi</span>
              <span>{worksheetData.tanggal}</span>
            </div>
            <div className="h-4 w-px bg-slate-700 hidden sm:block" />
            <div>
              <span className="text-slate-400 block text-[11px] font-bold uppercase tracking-wider">Kategori Dominan</span>
              <span className={`inline-flex items-center gap-1.5 font-bold px-2 py-0.5 rounded-lg text-xs mt-0.5 ${
                isPemahamanOriented 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : isAktivitasOriented 
                  ? 'bg-amber-500/20 text-amber-400' 
                  : 'bg-slate-500/20 text-slate-400'
              }`}>
                {analysis.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top grid with Score Gauge & KPI indicators */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Score & Gauge Box */}
        <div className="md:col-span-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            Efektivitas Sistem Belajar
          </h3>
          
          <div className="relative flex items-center justify-center">
            {/* Circular progress bar SVG */}
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="40"
                className="stroke-slate-100 fill-none"
                strokeWidth="8"
              />
              <circle
                cx="72"
                cy="72"
                r="40"
                className={`fill-none transition-all duration-1000 ease-out ${scoreColor.ring}`}
                strokeWidth="8"
                strokeDasharray="251"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className={`text-4xl font-extrabold tracking-tight ${scoreColor.text}`}>
                {analysis.efficiencyScore}
              </span>
              <span className="text-xs text-slate-400 block font-medium mt-0.5">/ 100</span>
            </div>
          </div>

          <div className={`mt-4 px-4 py-1.5 rounded-full text-xs font-bold ${scoreColor.bg} ${scoreColor.text}`}>
            {analysis.efficiencyScore >= 80 
              ? "Sistem Sangat Efektif" 
              : analysis.efficiencyScore >= 60 
              ? "Perlu Penyesuaian Sedang" 
              : "Risiko Tinggi Rutinitas Kosong"}
          </div>
        </div>

        {/* Short Executive summary */}
        <div className="md:col-span-8 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1 px-2.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-extrabold uppercase tracking-wide">
                Ikhtisar Eksekutif
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              {worksheetType === 'worksheet6' ? (
                <>
                  Analisis ini mengevaluasi tren berkala 14 hari belajar <strong>{worksheetData.childName}</strong>. 
                  {isPemahamanOriented ? (
                    <span> Hebat! Grafik harian menunjukkan kestabilan energi intelektual, konsistensi motivasi yang andal, dan nalar mandiri yang mengakar secara mantap.</span>
                  ) : (
                    <span> Audit 14 hari ini mendeteksi pemicu kelelahan kognitif harian yang tinggi dan sikap belajar pasif/negatif. Silakan merestrukturisasi pilar pemulihan energi setelah les.</span>
                  )}
                </>
              ) : worksheetType === 'worksheet5' ? (
                <>
                  Analisis ini mengevaluasi konsistensi Standard Operating Procedure (SOP) paska-les untuk <strong>{worksheetData.childName}</strong> di rumah. 
                  {isPemahamanOriented ? (
                    <span> Hebat! SOP rumah Anda berjalan dengan <strong>Sangat Teratur & Seimbang</strong>. Pembagian porsi istirahat, diskusi emosional santai, serta pengulangan konsep berjalan sinergis melindungi hasil les dari kelupaan.</span>
                  ) : (
                    <span> Audit mendeteksi adanya <strong>ketidakkonsistenan atau langkah-langkah kritis yang terlewati</strong> pada rutinitas pulang les anak Anda. Lakukan penyesuaian porsi rekreasi/istirahat agar motivasinya tetap bugar.</span>
                  )}
                </>
              ) : worksheetType === 'worksheet4' ? (
                <>
                  Analisis ini mengevaluasi keselarasan paradigma berpikir dan mental model Anda mengenai bimbingan belajar untuk <strong>{worksheetData.childName}</strong>. 
                  {isPemahamanOriented ? (
                    <span> Luar biasa! Anda memiliki <strong>cara pandang yang sehat & konstruktif (Home-centric)</strong>. Anda melihat bimbel secara proporsional sebagai "asisten pelengkap" dan menjaga rumah serta keteladanan sebagai pusat kemandirian berpikir anak.</span>
                  ) : (
                    <span> Hasil audit mendeteksi adanya <strong>ketergantungan paradigma pasif (Bimbel-oriented)</strong>, di mana Anda cenderung melimpahkan seluruh beban pilar pendidikan anak ke pihak eksternal. Ingatlah bahwa rumah adalah raja dari semua sistem belajar anak.</span>
                  )}
                </>
              ) : worksheetType === 'worksheet3' ? (
                <>
                  Analisis ini memformulasikan sistem rumah dan iklim emosional pendukung belajar untuk <strong>{worksheetData.childName}</strong>. 
                  {isPemahamanOriented ? (
                    <span> Selamat! Ekosistem rumah Anda tergolong <strong>sangat aktif mendukung belajar</strong>. Kedamaian emosi, rutinitas yang mantap, dan diskusi santai memberikan landasan yang kokoh agar hasil les anak tahan lama.</span>
                  ) : (
                    <span> Evaluasi mendeteksi adanya suasana rumah yang pasif atau belajar di rumah yang sering berakhir dengan tekanan emosional. Perang emosi atau suasana pasif ini berisiko melemahkan efektivitas les anak.</span>
                  )}
                </>
              ) : worksheetType === 'worksheet2' ? (
                <>
                  Hasil ini berfokus pada sinkronisasi pelajaran dengan cara belajar anak Anda di rumah. 
                  {!isPemahamanOriented ? (
                    <span> Evaluasi menunjukkan adanya risiko ketergantungan mengulang/meniru materi secara mekanis (hafalan) tanpa pemahaman nalar mandiri yang mengakar kuat.</span>
                  ) : (
                    <span> Selamat! Sistem pemahaman anak Anda telah selaras. Anak menunjukkan kemauan melatih konsep mandiri di rumah demi menumbuhkan kekokohan nalar yang prima.</span>
                  )}
                </>
              ) : (
                <>
                  Analisis ini memformulasikan relasi antara jadwal les <strong>{worksheetData.childName}</strong> yang padat dengan indikator pemahaman mandiri di rumah. 
                  {analysis.category === 'Aktivitas' ? (
                    <span> Berdasarkan data rill, anak Anda berisiko terjebak pada format <em>pembelajaran pasif</em> yang seolah-olah sibuk (Aktivitas) namun menyisakan sedikit ruang untuk pemahaman sejati yang tahan lama.</span>
                  ) : analysis.category === 'Pemahaman' ? (
                    <span> Selamat! Fokus pendidikan yang Anda berikan telah mengarah ke <em>pembelajaran bermakna (active learning)</em>, di mana anak dapat menjelaskan kembali materi dengan bahasanya sendiri sebagai pilar penalarannya.</span>
                  ) : (
                    <span> Keseimbangan sistem les anak Anda masih membutuhkan penegasan indikator secara konsisten agar tidak bergeser menjadi sekadar rutinitas harian tak terarah.</span>
                  )}
                </>
              )}
            </p>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-6 flex flex-wrap gap-y-2 justify-between items-center text-xs text-slate-400">
            <span>Metodologi: <strong>Smart Learning System (SLS) Indonesia</strong></span>
            <span>Didukung oleh Gemini 3.5 Flash</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: REALITY CHECK */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base uppercase tracking-wide">Reality Check (Melihat Kenyataan)</h3>
            <p className="text-xs text-slate-400">Konfrontasi objektif antara porsi les dan tingkat pemahaman konsep anak</p>
          </div>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-medium bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-100">
          {analysis.realityCheck}
        </p>
      </div>

      {/* SECTION 2: IMPLICATIONS */}
      <div className="bg-rose-50/60 rounded-2xl p-6 md:p-8 border border-rose-100 space-y-4">
        <div className="flex items-center gap-3 border-b border-rose-100/60 pb-3">
          <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-rose-900 text-base uppercase tracking-wide">Implikasi Jangka Panjang</h3>
            <p className="text-xs text-rose-700/80">Konsekuensi psikologis dan kemampuan bernalar Mandiri anak jika pola ini dilupakan</p>
          </div>
        </div>
        <p className="text-rose-900 text-sm leading-relaxed whitespace-pre-line font-semibold">
          {analysis.implications}
        </p>
      </div>

      {/* SECTION 3: RECOMMENDATIONS AS WORKBOOK COMMITMENTS */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base uppercase tracking-wide">Rencana Aksi & Komitmen Pengasuhan</h3>
            <p className="text-xs text-slate-400">Rekomendasi taktis untuk beralih dari fokus jadwal ke pemahaman mandiri</p>
          </div>
        </div>

        <p className="text-xs text-slate-500 italic mb-3">
          💡 Centang rekomendasi di bawah ini untuk menunjukkan komitmen Anda dalam melakukan transisi sistem belajar anak di rumah:
        </p>

        <div className="space-y-3">
          {analysis.recommendations.map((rec, idx) => {
            const isChecked = !!checkedRecs[idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleRecommendation(idx)}
                className={`w-full flex items-start text-left p-4 rounded-xl border transition-all ${
                  isChecked 
                    ? 'bg-emerald-50 border-emerald-200 text-slate-800 shadow-inner' 
                    : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="mr-3.5 mt-0.5 text-emerald-500 flex-shrink-0">
                  {isChecked ? (
                    <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-white" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-300" />
                  )}
                </div>
                <div>
                  <span className={`text-sm font-bold block ${isChecked ? 'line-through text-slate-400' : ''}`}>
                    Langkah {idx + 1}
                  </span>
                  <span className={`text-sm mt-0.5 block leading-relaxed ${isChecked ? 'text-slate-400' : 'text-slate-600'}`}>
                    {rec}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Commitment Badge */}
        {Object.values(checkedRecs).filter(Boolean).length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500 text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>Anda menyetujui {Object.values(checkedRecs).filter(Boolean).length} rencana aksi terbaik untuk {worksheetData.childName}!</span>
          </motion.div>
        )}
      </div>

      {/* Printable Footnote */}
      <div className="hidden print:block text-center border-t border-slate-200 pt-8 mt-12 text-xs text-slate-400">
        <p>Laporan dihasilkan secara aman oleh Modul SLS Les Evaluator.</p>
        <p className="mt-1">© {new Date().getFullYear()} Smart Learning System - Semua Hak Dilindungi.</p>
      </div>
    </motion.div>
  );
}
