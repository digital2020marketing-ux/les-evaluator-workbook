import React from 'react';
import { Calendar, Clock, BookOpen, Brain, Scale, Copy, RefreshCw, Layers } from 'lucide-react';
import { 
  RefleksiAwalAnswers, 
  IndicatorSelection, 
  PolaTerlihat, 
  Worksheet2CaraBelajar, 
  Worksheet2Pola,
  Worksheet3Audit,
  Worksheet3Pola,
  Worksheet4MentalModel,
  Worksheet5Rutinitas,
  DayLogEntry
} from '../types';

interface BalanceScaleProps {
  worksheetType: 'worksheet1' | 'worksheet2' | 'worksheet3' | 'worksheet4' | 'worksheet5' | 'worksheet6' | 'worksheet7';
  // Worksheet 1 Props
  refleksi?: RefleksiAwalAnswers;
  indikator?: IndicatorSelection;
  pola?: PolaTerlihat;
  // Worksheet 2 Props
  caraBelajar?: Worksheet2CaraBelajar;
  polaW2?: Worksheet2Pola;
  // Worksheet 3 Props
  auditW3?: Worksheet3Audit;
  polaW3?: Worksheet3Pola;
  // Worksheet 4 Props
  mentalModelW4?: Worksheet4MentalModel;
  // Worksheet 5 Props
  rutinitasW5?: Worksheet5Rutinitas;
  konsistensiW5?: 'sangat' | 'cukup' | 'kurang' | 'tidak' | null;
  // Worksheet 6 Props
  logsW6?: DayLogEntry[];
  trenPemahamanW6?: 'ya' | 'sebagian' | 'tidak' | null;
  trenSikapW6?: 'positif' | 'netral' | 'negatif' | null;
  // Worksheet 7 Props
  keputusanW7?: 'lanjut' | 'ganti_strategi' | 'stop' | null;
}

export default function BalanceScale({ 
  worksheetType, 
  refleksi, 
  indikator, 
  pola, 
  caraBelajar, 
  polaW2,
  auditW3,
  polaW3,
  mentalModelW4,
  rutinitasW5,
  konsistensiW5,
  logsW6,
  trenPemahamanW6,
  trenSikapW6,
  keputusanW7
}: BalanceScaleProps) {
  // Calculate weights based on active worksheet type
  let aktivitasWeight = 0;
  let pemahamanWeight = 0;

  if (worksheetType === 'worksheet1' && refleksi && indikator) {
    // Worksheet 1 scoring
    if (refleksi.jadwalPadat === true) aktivitasWeight += 1;
    if (refleksi.tambahLesNilaiTurun === true) aktivitasWeight += 2;
    if (refleksi.fokusAktivitas === true) aktivitasWeight += 2;
    if (refleksi.jarangCekPaham === true) aktivitasWeight += 1.5;

    if (refleksi.jarangCekPaham === false) pemahamanWeight += 1.5;
    if (refleksi.fokusAktivitas === false) pemahamanWeight += 1.5;

    if (indikator.anakRajinLes) aktivitasWeight += 1;
    if (indikator.jadwalPenuh) aktivitasWeight += 1;
    if (indikator.nilaiPrBagus) aktivitasWeight += 0.5;
    if (indikator.guruBilangAktif) aktivitasWeight += 0.5;

    if (indikator.anakBisaMenjelaskan) pemahamanWeight += 4.5; // Kunci pilar

    if (pola === 'aktivitas') aktivitasWeight += 2;
    if (pola === 'pemahaman') pemahamanWeight += 2;

  } else if (worksheetType === 'worksheet2' && caraBelajar && polaW2) {
    // Worksheet 2 scoring
    if (caraBelajar.menjelaskanUlang === 'tidak') aktivitasWeight += 1.5;
    if (caraBelajar.menjelaskanUlang === 'sebagian') aktivitasWeight += 0.5;
    if (caraBelajar.memahamiKonsep === 'tidak') aktivitasWeight += 1.5;
    if (caraBelajar.memahamiKonsep === 'sebagian') aktivitasWeight += 0.5;
    if (caraBelajar.soalBerbeda === 'tidak') aktivitasWeight += 1.5;
    if (caraBelajar.soalBerbeda === 'sebagian') aktivitasWeight += 0.5;

    if (caraBelajar.menjelaskanUlang === 'ya') pemahamanWeight += 1.5;
    if (caraBelajar.memahamiKonsep === 'ya') pemahamanWeight += 2.5;
    if (caraBelajar.soalBerbeda === 'ya') pemahamanWeight += 2.5;
    if (caraBelajar.materiSelaras === 'ya') pemahamanWeight += 1.5;

    if (polaW2.lebihBanyakMeniru) aktivitasWeight += 2.5;
    if (polaW2.bergantungArahanGuru) aktivitasWeight += 2.5;
    if (polaW2.mulaiPahamKonsep) pemahamanWeight += 3.0;

  } else if (worksheetType === 'worksheet3' && auditW3 && polaW3) {
    // Worksheet 3 scoring (Passive/Stress vs Active support)
    if (auditW3.rutinitasBelajar === false) aktivitasWeight += 1.5;
    if (auditW3.diskusiSetelahLes === false) aktivitasWeight += 1.0;
    if (auditW3.tahuMateri === false) aktivitasWeight += 1.0;
    if (auditW3.istirahatCukup === false) aktivitasWeight += 1.5;
    if (auditW3.berakhirEmosi === true) aktivitasWeight += 2.5;

    if (auditW3.rutinitasBelajar === true) pemahamanWeight += 1.5;
    if (auditW3.diskusiSetelahLes === true) pemahamanWeight += 1.0;
    if (auditW3.tahuMateri === true) pemahamanWeight += 1.0;
    if (auditW3.istirahatCukup === true) pemahamanWeight += 1.5;
    if (auditW3.berakhirEmosi === false) pemahamanWeight += 1.5;

    if (polaW3.rumahPasif) aktivitasWeight += 2.5;
    if (polaW3.seringTekanan) aktivitasWeight += 2.5;
    if (polaW3.rumahAktif) pemahamanWeight += 3.0;
  } else if (worksheetType === 'worksheet4' && mentalModelW4) {
    // Worksheet 4 scoring (Bimbel-centric vs. Home-centric system)
    if (mentalModelW4.pentingAnakSudahLes === true) aktivitasWeight += 2.5;
    if (mentalModelW4.harapBimbelSelesaikanMasalah === true) aktivitasWeight += 2.5;
    if (mentalModelW4.jarangEvaluasiEfektivitas === true) aktivitasWeight += 2.5;
    if (mentalModelW4.pahamRumahPusatSistem === false) aktivitasWeight += 1.5;

    if (mentalModelW4.pentingAnakSudahLes === false) pemahamanWeight += 1.5;
    if (mentalModelW4.harapBimbelSelesaikanMasalah === false) pemahamanWeight += 1.5;
    if (mentalModelW4.jarangEvaluasiEfektivitas === false) pemahamanWeight += 1.5;
    if (mentalModelW4.pahamRumahPusatSistem === true) pemahamanWeight += 3.5;
  } else if (worksheetType === 'worksheet5' && rutinitasW5) {
    // Worksheet 5 scoring (Inconsistent/Chaotic vs Consistent SOP)
    if (rutinitasW5.istirahatMendinginkan === false) aktivitasWeight += 1.2;
    if (rutinitasW5.diskusiSingkat === false) aktivitasWeight += 2.0;
    if (rutinitasW5.reviewMateri === false) aktivitasWeight += 2.0;
    if (rutinitasW5.kerjakanLatihan === false) aktivitasWeight += 1.2;
    if (rutinitasW5.rencanaBesok === false) aktivitasWeight += 0.8;

    if (rutinitasW5.istirahatMendinginkan === true) pemahamanWeight += 1.2;
    if (rutinitasW5.diskusiSingkat === true) pemahamanWeight += 2.2;
    if (rutinitasW5.reviewMateri === true) pemahamanWeight += 2.2;
    if (rutinitasW5.kerjakanLatihan === true) pemahamanWeight += 1.5;
    if (rutinitasW5.rencanaBesok === true) pemahamanWeight += 0.8;

    if (konsistensiW5 === 'sangat') pemahamanWeight += 2.5;
    if (konsistensiW5 === 'cukup') pemahamanWeight += 1.5;
    if (konsistensiW5 === 'kurang') aktivitasWeight += 1.5;
    if (konsistensiW5 === 'tidak') aktivitasWeight += 2.5;
  } else if (worksheetType === 'worksheet6' && logsW6) {
    // 14 day audit log calculations
    logsW6.forEach(log => {
      if (log.paham === 'ya') pemahamanWeight += 0.5;
      if (log.paham === 'sebagian') {
        pemahamanWeight += 0.25;
        aktivitasWeight += 0.25;
      }
      if (log.paham === 'tidak') aktivitasWeight += 0.5;

      if (log.sikap === 'positif') pemahamanWeight += 0.3;
      if (log.sikap === 'netral') aktivitasWeight += 0.15;
      if (log.sikap === 'negatif') aktivitasWeight += 0.45;
    });

    if (trenPemahamanW6 === 'ya') pemahamanWeight += 2.0;
    if (trenPemahamanW6 === 'sebagian') {
      pemahamanWeight += 1.0;
      aktivitasWeight += 1.0;
    }
    if (trenPemahamanW6 === 'tidak') aktivitasWeight += 2.0;

    if (trenSikapW6 === 'positif') pemahamanWeight += 2.0;
    if (trenSikapW6 === 'netral') aktivitasWeight += 1.0;
    if (trenSikapW6 === 'negatif') aktivitasWeight += 2.5;
  } else if (worksheetType === 'worksheet7' && keputusanW7) {
    if (keputusanW7 === 'lanjut') {
      pemahamanWeight += 6.0;
      aktivitasWeight += 1.5;
    } else if (keputusanW7 === 'ganti_strategi') {
      pemahamanWeight += 4.0;
      aktivitasWeight += 4.0;
    } else if (keputusanW7 === 'stop') {
      pemahamanWeight += 1.5;
      aktivitasWeight += 6.5;
    }
  }

  // Determine angle of the balance beam (max 20 degrees tilt either way)
  const total = aktivitasWeight + pemahamanWeight;
  let angle = 0;
  if (total > 0) {
    const diff = pemahamanWeight - aktivitasWeight; // positive tilts right towards pemahaman
    angle = (diff / Math.max(total, 6)) * 25; // Scale the tilt
    angle = Math.max(-20, Math.min(20, angle));
  }

  const isAktivitasHeavier = aktivitasWeight > pemahamanWeight;
  const isPerfectlyBalanced = Math.abs(aktivitasWeight - pemahamanWeight) < 0.5 && total > 0;

  return (
    <div id="balance-scale-container" className="bg-slate-50 rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-between h-full">
      <div className="w-full text-center mb-6">
        <h4 className="text-sm font-semibold tracking-wide text-slate-500 uppercase flex items-center justify-center gap-1.5">
          <Layers className="w-4 h-4 text-blue-900" />
          Timbangan Indikator {worksheetType === 'worksheet1' ? 'W1' : worksheetType === 'worksheet2' ? 'W2' : worksheetType === 'worksheet3' ? 'W3' : worksheetType === 'worksheet4' ? 'W4' : worksheetType === 'worksheet5' ? 'W5' : worksheetType === 'worksheet6' ? 'W6' : 'W7'}
        </h4>
        <p className="text-xs text-slate-400 mt-1">
          {worksheetType === 'worksheet1' 
            ? 'Memantau keseimbangan Kesiapan vs Pemahaman Pokok'
            : worksheetType === 'worksheet2'
            ? 'Menimbang kemampuan Konseptual vs Ketergantungan Hafalan'
            : worksheetType === 'worksheet3'
            ? 'Mengukur Kesiapan Suasana Rumah vs Pengaruh Pasif & Emosi'
            : worksheetType === 'worksheet4'
            ? 'Menimbang Paradigma Alat Bantu vs Ketergantungan Kuat'
            : worksheetType === 'worksheet5'
            ? 'Menimbang Konsistensi SOP Rumah vs Transisi Kacau & Jenuh'
            : worksheetType === 'worksheet6'
            ? 'Menimbang Tren Grafik 14 Hari vs Kelelahan Belajar'
            : 'Menimbang Konsistensi Sistem Baru vs Dampak Stres Belajar'}
        </p>
      </div>

      {/* SVG & HTML Animated Balance Scale */}
      <div className="relative w-full max-w-sm h-64 flex flex-col justify-end items-center">
        {/* The Balance Frame & Stand */}
        <div className="absolute bottom-0 w-8 h-32 bg-slate-400 rounded-t-lg shadow" id="scale-column" />
        <div className="absolute bottom-0 w-28 h-3 bg-slate-500 rounded shadow" id="scale-base" />

        {/* Pivot Point */}
        <div className="absolute bottom-28 w-4 h-4 bg-slate-600 rounded-full z-20 border border-white" />

        {/* Horizontal Rotating Beam */}
        <div
          className="absolute bottom-29 w-72 h-3 bg-slate-500 rounded-full z-10 origin-center transition-all duration-700 ease-out"
          style={{ transform: `rotate(${angle}deg)` }}
          id="scale-beam"
        >
          {/* Left String & Pan Connector */}
          <div className="absolute left-0 bottom-0 origin-top" style={{ transform: `rotate(${-angle}deg)` }}>
            {/* Thread */}
            <div className="w-0.5 h-16 bg-slate-300 mx-auto" />
            
            {/* Left Pan */}
            <div 
              className={`w-28 -ml-13 bg-white border-2 rounded-lg p-2 shadow-md flex flex-col items-center transition-all duration-500 ${
                isAktivitasHeavier ? 'border-amber-500 ring-2 ring-amber-100 bg-amber-50/50' : 'border-slate-200'
              }`}
            >
              <div className="flex gap-1.5 justify-center mb-1 text-amber-600">
                <Calendar className="w-4 h-4" />
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block text-center truncate w-full">
                {worksheetType === 'worksheet1' ? 'Aktivitas / Sibuk' : worksheetType === 'worksheet2' ? 'Hafalan / Meniru' : worksheetType === 'worksheet3' ? 'Pasif / Tekanan' : worksheetType === 'worksheet4' ? 'Melimpahkan Beban' : worksheetType === 'worksheet5' ? 'Kacau / Menolak' : worksheetType === 'worksheet6' ? 'Kelelahan / Jenuh' : 'Rintangan Belajar'}
              </span>
              <span className="text-xs font-extrabold text-amber-600 mt-0.5">
                {aktivitasWeight.toFixed(1)} Pts
              </span>
            </div>
          </div>

          {/* Center Indicator (Un-equality operator) */}
          <div className="absolute left-1/2 -top-12 -translate-x-1/2 flex flex-col items-center justify-center bg-slate-100 w-8 h-8 rounded-full border border-slate-300">
            <span className="text-red-500 font-extrabold text-sm select-none">
              {isPerfectlyBalanced ? '=' : '≠'}
            </span>
          </div>

          {/* Right String & Pan Connector */}
          <div className="absolute right-0 bottom-0 origin-top" style={{ transform: `rotate(${-angle}deg)` }}>
            {/* Thread */}
            <div className="w-0.5 h-16 bg-slate-300 mx-auto" />
            
            {/* Right Pan */}
            <div 
              className={`w-28 -ml-14 bg-white border-2 rounded-lg p-2 shadow-md flex flex-col items-center transition-all duration-500 ${
                !isAktivitasHeavier && total > 0 && !isPerfectlyBalanced ? 'border-emerald-500 ring-2 ring-emerald-100 bg-emerald-50/50' : 'border-slate-200'
              }`}
            >
              <div className="flex gap-1.5 justify-center mb-1 text-emerald-600">
                <Brain className="w-4 h-4" />
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block text-center truncate w-full">
                {worksheetType === 'worksheet1' ? 'Paham Sejati' : worksheetType === 'worksheet2' ? 'Nalar Mandiri' : worksheetType === 'worksheet3' ? 'Aktif Suportif' : worksheetType === 'worksheet4' ? 'Rumah Pusat Sistem' : worksheetType === 'worksheet5' ? 'SOP Rumah Mapan' : worksheetType === 'worksheet6' ? 'Sikap & Paham Alami' : 'Keputusan Strategis'}
              </span>
              <span className="text-xs font-extrabold text-emerald-600 mt-0.5">
                {pemahamanWeight.toFixed(1)} Pts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Summary Note */}
      <div className="w-full mt-6 text-center">
        {total === 0 ? (
          <div className="bg-slate-100 text-slate-500 text-xs rounded-lg p-3">
            Isi atau centang opsi di sebelah kiri untuk mengamati distribusi keseimbangan tumbuh kembang berpikir anak secara instan.
          </div>
        ) : isPerfectlyBalanced ? (
          <div className="bg-sky-50 border border-sky-100 text-sky-700 text-xs rounded-lg p-2.5 font-medium leading-relaxed">
            {worksheetType === 'worksheet7'
              ? 'Keputusan Ganti Strategi! Anda mengambil langkah taktis jalan tengah untuk menyesuaikan jadwal, durasi, atau metode les agar ramah kondisi anak.'
              : 'Seimbang secara matematis! Jaga keselarasan ini agar motivasi harian anak bertemu dengan bimbingan konseptual yang tepat.'}
          </div>
        ) : isAktivitasHeavier ? (
          <div className="bg-amber-50 border border-amber-100 text-amber-800 text-xs rounded-lg p-2.5 font-medium leading-relaxed text-left">
            <span className="text-amber-700 font-bold block mb-1">
              ⚠️ Dominasi {worksheetType === 'worksheet1' ? 'Aktivitas Padat' : worksheetType === 'worksheet2' ? 'Metode Hafalan/Tiru' : worksheetType === 'worksheet3' ? 'Suasana Rumah Pasif/Tekanan' : worksheetType === 'worksheet4' ? 'Paradigma Pasif (Melepas Beban)' : worksheetType === 'worksheet5' ? 'Rutinitas SOP Belum Mapan / Kacau' : worksheetType === 'worksheet6' ? 'Kelelahan Kognitif / Jenuh Jangka Panjang' : 'Beban & Konflik Sistem Sesaat'}:
            </span>
            {worksheetType === 'worksheet1' 
              ? 'Anak Anda berisiko mengalami kelelahan belajar tanpa memahami substansi penting dari materi les.'
              : worksheetType === 'worksheet2'
              ? 'Konsep dasar belum kuat. Anak rentan membeo rumus atau bergantung penuh pada instruktor tanpa pemahaman dasar.'
              : worksheetType === 'worksheet3'
              ? 'Ekosistem rumah kurang kondusif atau penuh tekanan emosional. Ini berdampak nyata membuat hasil belajar les sulit diserap.'
              : worksheetType === 'worksheet4'
              ? 'Anda cenderung bergantung penuh pada bimbingan luar sebagai pilar utama pendidikan anak. Kembalilah memegang kendali sistem di rumah.'
              : worksheetType === 'worksheet5'
              ? 'SOP setelah les belum berjalan konsisten atau dilewati. Anak berisiko jenuh atau melupakan materi berharga yang didapat.'
              : worksheetType === 'worksheet6'
              ? 'Tren menunjukkan tingginya tingkat kelelahan kognitif atau sikap belajar pasif/negatif. Waspadai jenuh belajar akut paska-les.'
              : 'Keputusan menghentikan / menjeda les (STOP) didasarkan pada minimnya kontribusi riil dan meningkatnya stres belajar anak. Fokus pada pemulihan kesehatan mental anak.'}
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-lg p-2.5 font-medium leading-relaxed text-left">
            <span className="text-emerald-700 font-bold block mb-1">
              ✅ Unggul di Sisi {worksheetType === 'worksheet1' ? 'Pemahaman Kokoh' : worksheetType === 'worksheet2' ? 'Keaktifan Bernalar mandiri' : worksheetType === 'worksheet3' ? 'Rumah Hack/Suportif' : worksheetType === 'worksheet4' ? 'Cara Pandang Konstruktif' : worksheetType === 'worksheet5' ? 'SOP Rumah Konsisten & Rapi' : worksheetType === 'worksheet6' ? 'Kebugaran Sistem & Progresif' : 'Stabilitas & Solusi Positif'}:
            </span>
            {worksheetType === 'worksheet4'
              ? 'Luar biasa! Anda memosisikan bimbingan belajar dengan proporsional sebagai "asisten pelengkap" dan menjaga rumah sebagai pusat kemandirian berpikir anak.'
              : worksheetType === 'worksheet3'
              ? 'Selamat! Suasana rumah yang damai, terstruktur, dan suportif emosi memberikan pondasi kokoh bagi keberlangsungan jangka panjang pelajaran anak.'
              : worksheetType === 'worksheet5'
              ? 'Hebat! SOP rumah berjalan dengan teratur dan gembira. Kebiasaan kecil ini melipatgandakan ingatan materi les secara efisien.'
              : worksheetType === 'worksheet6'
              ? 'Luar biasa! Audit 14 hari membuktikan anak Anda bugar secara kognitif dan stabil menikmati materi les dengan metode alami yang produktif.'
              : 'Luar biasa! Keputusan melanjutkan (LANJUT) bimbingan les didukung oleh kemajuan kognitif yang nyata, kemandirian anak, serta SOP rumah yang sudah mapan.'}
          </div>
        )}
      </div>
    </div>
  );
}
