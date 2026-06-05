import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Clipboard, Activity, AlertCircle, Sparkle, ArrowRight, Check, RotateCcw, HelpCircle, GraduationCap, RefreshCw, XCircle, FileText
} from 'lucide-react';
import { Worksheet7Data } from '../types';

interface Worksheet7FormProps {
  onSubmit: (data: Worksheet7Data) => void;
  isLoading: boolean;
  ringkasanSop: string;
  setRingkasanSop: (val: string) => void;
  ringkasanPemahaman: string;
  setRingkasanPemahaman: (val: string) => void;
  ringkasanSikap: string;
  setRingkasanSikap: (val: string) => void;
  ringkasanEfektivitas: string;
  setRingkasanEfektivitas: (val: string) => void;
  keputusan: 'lanjut' | 'ganti_strategi' | 'stop' | null;
  setKeputusan: (val: 'lanjut' | 'ganti_strategi' | 'stop' | null) => void;
  catatanPenutup: string;
  setCatatanPenutup: (val: string) => void;
  childName: string;
  setChildName: (val: string) => void;

  // Interconnected States from Worksheet 1 - 6
  refleksiW1: any;
  indikatorW1: any;
  polaW1: any;
  caraBelajarW2: any;
  materiKesulitanW2: string;
  polaW2: any;
  auditW3: any;
  situasiRumahW3: string;
  polaW3: any;
  mentalW4: any;
  refleksiW4: string;
  rutinitasW5: any;
  konsistensiW5: 'sangat' | 'cukup' | 'kurang' | 'tidak' | null;
  bagianPalingSulitW5: string;
  rencanaPerbaikanW5: string;
  logsW6: any[];
  observasiW6: string;
  trenPemahamanW6: 'ya' | 'sebagian' | 'tidak' | null;
  trenSikapW6: 'positif' | 'netral' | 'negatif' | null;
  polaPalingTerlihatW6: string;
}

export default function Worksheet7Form({
  onSubmit,
  isLoading,
  ringkasanSop,
  setRingkasanSop,
  ringkasanPemahaman,
  setRingkasanPemahaman,
  ringkasanSikap,
  setRingkasanSikap,
  ringkasanEfektivitas,
  setRingkasanEfektivitas,
  keputusan,
  setKeputusan,
  catatanPenutup,
  setCatatanPenutup,
  childName,
  setChildName,

  // Destructure interconnected states
  refleksiW1,
  indikatorW1,
  polaW1,
  caraBelajarW2,
  materiKesulitanW2,
  polaW2,
  auditW3,
  situasiRumahW3,
  polaW3,
  mentalW4,
  refleksiW4,
  rutinitasW5,
  konsistensiW5,
  bagianPalingSulitW5,
  rencanaPerbaikanW5,
  logsW6,
  observasiW6,
  trenPemahamanW6,
  trenSikapW6,
  polaPalingTerlihatW6
}: Worksheet7FormProps) {
  const [errorLocal, setErrorLocal] = useState('');

  const handleApplyDemo = () => {
    setRingkasanSop("SOP rumah berjalan cukup tangguh di akhir minggu pertama, namun anak sering kali melewatkan bagian review mandiri jika dipaksa belajar di malam hari.");
    setRingkasanPemahaman("Anak mampu memahami konsep dasar matematika jika dibantu alat peraga visual, namun masih kesulitan menjelaskan materi yang sangat teoritis tanpa analogi konkret.");
    setRingkasanSikap("Sikap anak sangat kooperatif di pagi-siang hari, tapi menunjukkan resistensi/jenuh jika jadwal les berhimpitan langsung setelah jam pulang sekolah.");
    setRingkasanEfektivitas("Program les memberikan dampak positif yang nyata untuk melatih kedisiplinan dasar, namun belum efisien secara kognitif karena minimnya asimilasi mandiri di rumah.");
    setKeputusan("ganti_strategi");
    setCatatanPenutup("Keputusan terbaik kami adalah menyesuaikan jadwal les menjadi hari Sabtu pagi saat kondisi energi anak prima, serta memangkas frekuensi les dari 3x menjadi 1x seminggu demi memulihkan energi rumah.");
    if (!childName) {
      setChildName("Alifia");
    }
  };

  const handleClearForm = () => {
    setRingkasanSop('');
    setRingkasanPemahaman('');
    setRingkasanSikap('');
    setRingkasanEfektivitas('');
    setKeputusan(null);
    setCatatanPenutup('');
  };

  const handleAutoSyncW1W6 = () => {
    // Rangkuman SOP Rumah
    let sopText = "";
    if (konsistensiW5 === 'sangat') {
      sopText = "SOP rumah paska-les berjalan sangat konsisten. Anak teratur melakukan penenangan diri, diskusi singkat, dan pengerjaan latihan terpilih.";
    } else if (konsistensiW5 === 'cukup') {
      sopText = "SOP rumah paska-les berjalan cukup konsisten, meskipun masih kadang terlewat atau jam pelaksanaannya berubah-ubah.";
    } else if (konsistensiW5 === 'kurang') {
      sopText = "SOP rumah paska-les dinilai kurang konsisten. Anak sering melewatkan review materi penting paska pulang les.";
    } else if (konsistensiW5 === 'tidak') {
      sopText = "SOP rumah belum berjalan secara teratur. Sering kali anak langsung tidur atau beristirahat terlalu lama tanpa asimilasi memori.";
    } else {
      sopText = "SOP rumah paska-les belum terstruktur secara matang. Butuh pembiasaan bertahap dari orang tua untuk menjaga asimilasi ingatan.";
    }
    if (bagianPalingSulitW5) {
      sopText += ` Hambatan utama: ${bagianPalingSulitW5}.`;
    }
    if (rencanaPerbaikanW5) {
      sopText += ` Solusi asuh yang diusulkan: ${rencanaPerbaikanW5}.`;
    }
    setRingkasanSop(sopText);

    // Rangkuman Pemahaman
    let pahamText = "";
    if (trenPemahamanW6 === 'ya') {
      pahamText = "Anak menunjukkan daya serap kognitif yang kokoh. Dari audit 14 hari terakhir, sebagian besar materi les terkonfirmasi mampu dipahami dengan bugar.";
    } else if (trenPemahamanW6 === 'sebagian') {
      pahamText = "Pemahaman materi masih parsial/sebagian. Anak mampu mengerjakan PR tetapi jika jenis soal diganti sedikit atau diminta menjelaskan ulang kognisinya mulai goyah.";
    } else if (trenPemahamanW6 === 'tidak') {
      pahamText = "Daya serap kognitif sangat kritis. Anak berisiko mengalami kelelahan belajar akut, di mana informasi hanya tertimbun sementara di memori jangka pendek tanpa pemahaman sejati.";
    } else {
      pahamText = "Pemahaman materi bervariatif. Perlu pengujian berkala melalui pilar nalar mandiri daripada metode sekadar meniru bimbingan les.";
    }
    if (caraBelajarW2 && caraBelajarW2.menjelaskanUlang === 'tidak') {
      pahamText += " Anak masih kesulitan jika diminta menjelaskan ulang materi les dengan kalimatnya sendiri.";
    }
    if (materiKesulitanW2) {
      pahamText += ` Kesulitan spesifik terpantau pada: ${materiKesulitanW2}.`;
    }
    if (polaW2 && polaW2.lebihBanyakMeniru) {
      pahamText += " Cenderung terjebak dalam pola belajar mekanis hafalan atau imitasi cara kerja guru.";
    }
    setRingkasanPemahaman(pahamText);

    // Rangkuman Sikap & Motivasi
    let sikapText = "";
    if (trenSikapW6 === 'positif') {
      sikapText = "Kondisi gairah belajar anak sangat bugar dan positif. Anak menikmati proses belajar dengan tulus dan minim paksaan batin.";
    } else if (trenSikapW6 === 'netral') {
      sikapText = "Sikap anak terpantau netral dan kooperatif. Ia patuh pada jadwal harian, namun antusiasmenya masih perlu dirangsang lewat penataan iklim rumah.";
    } else if (trenSikapW6 === 'negatif') {
      sikapText = "Anak berada dalam tingkat kelelahan belajar yang tinggi (resistensi mental). Ia sering mengekspresikan enggan berangkat les atau murung paska pulang belajar.";
    } else {
      sikapText = "Mood anak cenderung berfluktuasi sejalan dengan padatnya aktivitas harian di sekolah dan les tambahan.";
    }
    if (auditW3 && auditW3.berakhirEmosi) {
      sikapText += " Sesi belajar mandiri di rumah sering kali diwarnai konflik emosional yang meningkatkan stres kognitif anak.";
    }
    setRingkasanSikap(sikapText);

    // Efektivitas Les Kumulatif
    let efektivitasText = "";
    if (mentalW4 && mentalW4.lepasBeban) {
      efektivitasText = "Sistem les saat ini rentan dijadikan tameng 'melepas beban'. Orang tua cenderung bergantung penuh pada les luar tanpa memegang kendali iklim pendidikan mandiri di rumah.";
    } else if (mentalW4 && mentalW4.partnerMandiri) {
      efektivitasText = "Sistem les diposisikan secara proporsional sebagai asisten taktis pelengkap, sementara kendali ekosistem belajar utama tetap kokoh dipegang oleh orang tua di rumah.";
    } else {
      efektivitasText = "Kontribusi les dinilai bervariasi. Program les melatih kedisiplinan eksternal, namun belum melahirkan nalar mandiri yang solid karena asimilasi paska-les sering longgar.";
    }
    if (refleksiW4) {
      efektivitasText += ` Refleksi peran: ${refleksiW4}`;
    }
    setRingkasanEfektivitas(efektivitasText);

    // Suggest a decision (Keputusan)
    let scoreLanjut = 0;
    let scoreStop = 0;
    let scoreGanti = 0;

    if (konsistensiW5 === 'sangat') scoreLanjut += 3;
    if (konsistensiW5 === 'kurang' || konsistensiW5 === 'tidak') scoreGanti += 2;
    if (trenPemahamanW6 === 'ya') scoreLanjut += 3;
    if (trenPemahamanW6 === 'tidak') scoreStop += 3;
    if (trenSikapW6 === 'positif') scoreLanjut += 2;
    if (trenSikapW6 === 'negatif') scoreStop += 3;
    if (auditW3 && auditW3.berakhirEmosi) scoreGanti += 2;
    if (mentalW4 && mentalW4.lepasBeban) scoreGanti += 2;
    if (polaW2 && polaW2.lebihBanyakMeniru) scoreGanti += 2;

    if (scoreStop >= 4) {
      setKeputusan('stop');
      setCatatanPenutup(`Menimbang tingginya stres belajar, resistensi mental anak, serta nihilnya efisiensi kognitif batin, kami memutuskan untuk menjeda / menghentikan (STOP) les luar dwi-minggu ini. Kami akan memprioritaskan pemulihan kesehatan mental belajar ${childName || 'anak'}, dilanjutkan penataan sistem asuh yang ramah emosi di rumah.`);
    } else if (scoreGanti >= 3 || scoreStop >= 2) {
      setKeputusan('ganti_strategi');
      setCatatanPenutup(`Berdasarkan data audit penengah, kami memilih untuk melakukan ADAPTASI / GANTI STRATEGI. Jadwal les perlu dipangkas atau dipindah ke waktu prima anak (misalnya Sabtu pagi), dan tutor les dikomunikasikan secara taktis untuk mengubah pendekatan mengajar agar lebih fokus pada nalar konseptual, bukan sekadar menuntaskan tumpukan PR.`);
    } else {
      setKeputusan('lanjut');
      setCatatanPenutup(`Hasil evaluasi kumulatif menunjukkan kontribusi logis positif. Kami memutuskan untuk MELANJUTKAN les dengan komitmen tetap memperkuat SOP Rumah paska-les secara gembira sebagai akselerator utama memori ${childName || 'anak'}.`);
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
      ringkasanSop,
      ringkasanPemahaman,
      ringkasanSikap,
      ringkasanEfektivitas,
      keputusan,
      catatanPenutup
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
          <FileText className="w-24 h-24 text-white" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="p-3 bg-white/10 text-white rounded-xl h-fit">
              <GraduationCap className="w-6 h-6 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-yellow-300">Worksheet 7</span>
              <h4 className="font-bold text-xl text-white mt-0.5 leading-snug">KEPUTUSAN AKHIR</h4>
              <p className="text-slate-200 text-xs leading-relaxed mt-1 font-medium">
                Gunakan rangkuman data dan evaluasi 14 hari sebelumnya untuk mengambil keputusan rasional dan strategis demi kebaikan masa depan belajar anak Anda.
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
              onClick={handleClearForm}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition shrink-0 flex items-center gap-1"
              title="Bersihkan form"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* SMART INTERCONNECTION FEEDBACK PANEL */}
      <div className="bg-blue-50/50 border border-blue-200/60 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-blue-900 text-white rounded-xl shadow-sm mt-0.5 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-blue-950 text-sm tracking-wide uppercase">
                ⚡ Dasbor Interkoneksi Pintar (Worksheet 1 - 6)
              </h4>
              <p className="text-slate-500 text-xs mt-1 font-medium leading-relaxed">
                Sistem Evaluasi mendeteksi data tumbuh kembang kognitif <strong className="text-blue-900">{childName || 'anak Anda'}</strong> secara rill dari Lembar Kerja sebelumnya. Tekan tombol sinkronisasi untuk merangkum hasil evaluasi secara otomatis.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAutoSyncW1W6}
            className="px-4 py-3 bg-blue-950 hover:bg-blue-900 text-yellow-300 hover:text-white font-extrabold rounded-xl text-xs transition duration-300 flex items-center justify-center gap-2 shadow-md shrink-0 border border-blue-850 animate-pulse hover:animate-none"
          >
            <Sparkle className="w-4 h-4 text-yellow-300" />
            <span>🔮 Sinkronkan Data (W1 - W6)</span>
          </button>
        </div>

        {/* Diagnostic Feeds */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          {/* 1. SOP RUMAH STATUS */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-150 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base" role="img" aria-label="home">🏡</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">SOP Rumah (W5)</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase text-[9px] w-fit ${
                konsistensiW5 === 'sangat' || konsistensiW5 === 'cukup'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : konsistensiW5 === 'kurang' || konsistensiW5 === 'tidak'
                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                  : 'bg-slate-50 text-slate-400 border border-slate-100'
              }`}>
                {konsistensiW5 === 'sangat' ? 'Sangat Konsisten' : konsistensiW5 === 'cukup' ? 'Cukup Konsisten' : konsistensiW5 === 'kurang' ? 'Kurang Konsisten' : konsistensiW5 === 'tidak' ? 'Tidak Konsisten' : 'Belum Ditentukan'}
              </span>
              <p className="text-[10px] text-slate-400 leading-relaxed truncate">
                {bagianPalingSulitW5 ? `Kendala: ${bagianPalingSulitW5}` : 'Tidak ada catatan hambatan rill.'}
              </p>
            </div>
          </div>

          {/* 2. PEMAHAMAN KOGNITIF */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-150 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base" role="img" aria-label="brain">🧠</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Pemahaman (W2 & W6)</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase text-[9px] w-fit ${
                trenPemahamanW6 === 'ya'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : trenPemahamanW6 === 'sebagian'
                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                  : trenPemahamanW6 === 'tidak'
                  ? 'bg-rose-50 text-rose-700 border border-rose-100'
                  : 'bg-slate-50 text-slate-400 border border-slate-100'
              }`}>
                {trenPemahamanW6 === 'ya' ? 'Paham Utuh / Bugar' : trenPemahamanW6 === 'sebagian' ? 'Parsial / Mengambang' : trenPemahamanW6 === 'tidak' ? 'Kritis / Kelelahan' : 'Belum Ditentukan'}
              </span>
              <p className="text-[10px] text-slate-400 leading-relaxed truncate">
                {materiKesulitanW2 ? `Sulit: ${materiKesulitanW2}` : 'Tidak ada catatan kesulitan.'}
              </p>
            </div>
          </div>

          {/* 3. MOTIVASI & SIKAP */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-150 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base" role="img" aria-label="happy">😊</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Motivasi & Sikap (W6)</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase text-[9px] w-fit ${
                trenSikapW6 === 'positif'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : trenSikapW6 === 'netral'
                  ? 'bg-blue-50 text-blue-700 border border-blue-100'
                  : trenSikapW6 === 'negatif'
                  ? 'bg-rose-50 text-rose-700 border border-rose-100'
                  : 'bg-slate-50 text-slate-400 border border-slate-100'
              }`}>
                {trenSikapW6 === 'positif' ? 'Sangat Positif' : trenSikapW6 === 'netral' ? 'Netral / Stabil' : trenSikapW6 === 'negatif' ? 'Negatif / Resisten' : 'Belum Ditentukan'}
              </span>
              <p className="text-[10px] text-slate-400 leading-relaxed truncate">
                {polaPalingTerlihatW6 ? `Pola: ${polaPalingTerlihatW6}` : 'Belum mengidentifikasi pola harian.'}
              </p>
            </div>
          </div>

          {/* 4. PARADIGMA LES */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-150 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base" role="img" aria-label="key">🔑</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Paradigma Les (W4)</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase text-[9px] w-fit ${
                mentalW4 && mentalW4.pahamRumahPusatSistem
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : mentalW4 && (mentalW4.pentingAnakSudahLes || mentalW4.harapBimbelSelesaikanMasalah)
                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                  : 'bg-slate-50 text-slate-400 border border-slate-100'
              }`}>
                {mentalW4 && mentalW4.pahamRumahPusatSistem ? 'Partner Taktis & Mandiri' : mentalW4 && (mentalW4.pentingAnakSudahLes || mentalW4.harapBimbelSelesaikanMasalah) ? 'Melimpahkan Beban' : 'Belum Ditentukan'}
              </span>
              <p className="text-[10px] text-slate-400 leading-relaxed truncate">
                {refleksiW4 ? `Refleksi W4: ${refleksiW4}` : 'Belum merefleksikan peran les.'}
              </p>
            </div>
          </div>
        </div>

        {/* Warning if previous worksheets are entirely default */}
        {(!konsistensiW5 && !trenPemahamanW6 && !trenSikapW6) && (
          <p className="text-[10px] text-slate-400 italic bg-white p-2.5 rounded-lg border border-slate-150">
            💡 <strong>Catatan Keterlibatan:</strong> Data audit terdahulu Anda masih kosong. Masukkan data di menu bincang batin Worksheet 1 &mdash; 6 di atas untuk melihat bagaimana evaluasi dwi-mingguan terintegrasi dan bersatu membentuk rujukan keputusan yang tepat!
          </p>
        )}
      </div>

      {/* SECTION 1: RINGKASAN AUDIT */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base uppercase">RINGKASAN AUDIT BELAJAR</h3>
            <p className="text-xs text-slate-400 font-medium">Rangkum temuan utama Anda berdasarkan audit 14 hari sebelumnya</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Row 1: Konsistensi SOP Rumah */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              🏡 Konsistensi SOP Rumah
            </label>
            <textarea
              value={ringkasanSop}
              onChange={(e) => setRingkasanSop(e.target.value)}
              rows={3}
              placeholder="Tuliskan temuan utama mengenai keteraturan SOP paska-les (misal: 'Anak gembira menjalankan diskusi tetapi review sering mampet karena anak mengantuk', dll)..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-850 text-xs transition focus:outline-none leading-relaxed"
            />
          </div>

          {/* Row 2: Pemahaman Anak */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              🧠 Pemahaman Anak (Daya Serap)
            </label>
            <textarea
              value={ringkasanPemahaman}
              onChange={(e) => setRingkasanPemahaman(e.target.value)}
              rows={3}
              placeholder="Rangkum tingkat pemahaman anak sesungguhnya (misal: 'Pemahaman konsep awal masih mengambang, anak sering menyalin materi tanpa mengerti polanya', dll)..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-850 text-xs transition focus:outline-none leading-relaxed"
            />
          </div>

          {/* Row 3: Sikap Belajar */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              😊 Sikap & Motivasi Belajar
            </label>
            <textarea
              value={ringkasanSikap}
              onChange={(e) => setRingkasanSikap(e.target.value)}
              rows={3}
              placeholder="Rangkum kestabilan mood, emosi seputar les, dan resistensi harian (misal: 'Anak rentan jenuh di hari-hari yang padat, emosinya labil saat banyak PR', dll)..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-850 text-xs transition focus:outline-none leading-relaxed"
            />
          </div>

          {/* Row 4: Efektivitas Les */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              📈 Efektivitas Les Kumulatif
            </label>
            <textarea
              value={ringkasanEfektivitas}
              onChange={(e) => setRingkasanEfektivitas(e.target.value)}
              rows={3}
              placeholder="Rangkum kontribusi riil dari bimbingan les (misal: 'Les melatih struktur kedisiplinan tetapi kurang menyentuh nalar mandiri sehingga anak terbebani', dll)..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-850 text-xs transition focus:outline-none leading-relaxed"
            />
          </div>
        </div>
      </motion.div>

      {/* SECTION 2: OPSI KEPUTUSAN */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base uppercase">OPSI KEPUTUSAN STRATEGIS</h3>
            <p className="text-xs text-slate-400 font-medium">Bandingkan indikator dan tentukan opsi keputusan terbaik Anda saat ini</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Option 1: LANJUT */}
          <div 
            onClick={() => setKeputusan('lanjut')}
            className={`cursor-pointer border-2 rounded-2xl p-5 flex flex-col justify-between transition gap-4 relative overflow-hidden hover:shadow-md ${
              keputusan === 'lanjut'
                ? 'bg-emerald-50/50 border-emerald-600 ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <Check className="w-3.5 h-3.5 font-bold" />
                  1. LANJUT
                </div>
                {keputusan === 'lanjut' && (
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">✓</span>
                )}
              </div>
              
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wide">Indikator Sukses:</span>
                <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
                  <li className="flex items-start gap-1">
                    <span className="text-emerald-600 font-bold mr-1">•</span>
                    <span>Ada peningkatan / perubahan kognitif nyata.</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-emerald-600 font-bold mr-1">•</span>
                    <span>Sistem belajar di rumah berjalan mapan.</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-emerald-600 font-bold mr-1">•</span>
                    <span>Anak mulai mandiri dan menyukai prosesnya.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className={`mt-2 py-2 w-full text-center rounded-xl text-xs font-bold transition ${
              keputusan === 'lanjut'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}>
              {keputusan === 'lanjut' ? 'Pilihan Terpilih' : 'Pilih Lanjut'}
            </div>
          </div>

          {/* Option 2: GANTI STRATEGI */}
          <div 
            onClick={() => setKeputusan('ganti_strategi')}
            className={`cursor-pointer border-2 rounded-2xl p-5 flex flex-col justify-between transition gap-4 relative overflow-hidden hover:shadow-md ${
              keputusan === 'ganti_strategi'
                ? 'bg-amber-50/50 border-amber-500 ring-2 ring-amber-400/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <RefreshCw className="w-3.5 h-3.5 font-bold" />
                  2. STRATEGI BAru
                </div>
                {keputusan === 'ganti_strategi' && (
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">✓</span>
                )}
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wide">Indikator Penyesuaian:</span>
                <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
                  <li className="flex items-start gap-1">
                    <span className="text-amber-600 font-bold mr-1">•</span>
                    <span>Anak punya potensi tetapi metode saat ini kurang cocok.</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-amber-600 font-bold mr-1">•</span>
                    <span>Ritme dan waktu les belum selaras dengan kondisi anak.</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-amber-600 font-bold mr-1">•</span>
                    <span>Butuh penyesuaian kurikulum / durasi / cara mentor mengajar.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className={`mt-2 py-2 w-full text-center rounded-xl text-xs font-bold transition ${
              keputusan === 'ganti_strategi'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}>
              {keputusan === 'ganti_strategi' ? 'Pilihan Terpilih' : 'Pilih Ganti Strategi'}
            </div>
          </div>

          {/* Option 3: STOP */}
          <div 
            onClick={() => setKeputusan('stop')}
            className={`cursor-pointer border-2 rounded-2xl p-5 flex flex-col justify-between transition gap-4 relative overflow-hidden hover:shadow-md ${
              keputusan === 'stop'
                ? 'bg-rose-50/50 border-rose-600 ring-2 ring-rose-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="bg-rose-100 text-rose-800 text-xs font-extrabold px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  <XCircle className="w-3.5 h-3.5 font-bold" />
                  3. STOP LES
                </div>
                {keputusan === 'stop' && (
                  <span className="w-5 h-5 rounded-full bg-rose-650 text-white flex items-center justify-center text-xs font-bold">✓</span>
                )}
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wide">Indikator Berhenti:</span>
                <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
                  <li className="flex items-start gap-1">
                    <span className="text-rose-600 font-bold mr-1">•</span>
                    <span>Tidak ada kontribusi kognitif & pemahaman yang signifikan.</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-rose-600 font-bold mr-1">•</span>
                    <span>Konflik emosional anak & orang tua meningkat tajam.</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <span className="text-rose-600 font-bold mr-1">•</span>
                    <span>Sistem batin & rutinitas rumah terganggu kronis.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className={`mt-2 py-2 w-full text-center rounded-xl text-xs font-bold transition ${
              keputusan === 'stop'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}>
              {keputusan === 'stop' ? 'Pilihan Terpilih' : 'Pilih Stop'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* SECTION 3: CATATAN PENUTUP */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base uppercase">CATATAN PENUTUP & REFLEKSI JANGKA PANJANG</h3>
            <p className="text-xs text-slate-400 font-medium font-semibold text-slate-500">
              "Keputusan terbaik bukan keputusan tercepat. Tenangkan pikiran, hindari rasa takut, bangun sistem secara rasional."
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            📝 Rencana Implementasi Keputusan
          </label>
          <textarea
            value={catatanPenutup}
            onChange={(e) => setCatatanPenutup(e.target.value)}
            rows={4}
            placeholder="Tuliskan bagaimana Anda akan mengomunikasikan keputusan ini dengan anak dan mentor les, serta langkah perbaikan yang akan Anda pantau mulai besok pagi..."
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-850 text-xs transition focus:outline-none leading-relaxed"
          />
        </div>
      </motion.div>

      {/* SECTION 4: PRINSIP TERAKHIR (Visual Presentation Card) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
        <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 text-center">
          📌 3 PRINSIP BELAJAR UTAMA SMART LEARNING SYSTEM
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-150 flex items-center gap-3">
            <span className="text-xl">🏃‍♂️</span>
            <div>
              <h5 className="font-bold text-xs text-slate-800">Aktivitas</h5>
              <p className="text-[10px] text-slate-500 mt-0.5">Aktivitas fisik semata bukanlah jaminan hasil kognitif sejati.</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-150 flex items-center gap-3">
            <span className="text-xl">⏰</span>
            <div>
              <h5 className="font-bold text-xs text-slate-800">Kesibukan</h5>
              <p className="text-[10px] text-slate-500 mt-0.5">Sangat sibuk bukanlah jaminan adanya kemajuan berpikir anak.</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-150 flex items-center gap-3">
            <span className="text-xl">📊</span>
            <div>
              <h5 className="font-bold text-xs text-slate-800">Data harian</h5>
              <p className="text-[10px] text-slate-500 mt-0.5">Keputusan objektif berbasis data jauh lebih penting dari sekadar asumsi.</p>
            </div>
          </div>
        </div>
      </div>

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
            <span>Sistem sedang merumuskan Keputusan Akhir...</span>
          </>
        ) : (
          <>
            <Sparkle className="w-5 h-5 text-yellow-300 animate-pulse" />
            <span>Simpan & Analisis Keputusan Akhir</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}
