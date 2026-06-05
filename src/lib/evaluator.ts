import { AnalysisResponse, Worksheet7Data } from '../types';

export function evaluateWorksheet(
  type: 'worksheet1' | 'worksheet2' | 'worksheet3' | 'worksheet4' | 'worksheet5' | 'worksheet6' | 'worksheet7',
  childName: string,
  payload: any
): AnalysisResponse {
  let category = 'Belum Yakin';
  let efficiencyScore = 50;
  let title = `Laporan Hasil Evaluasi Belajar ${childName}`;
  let realityCheck = '';
  let implications = '';
  let recommendations: string[] = [];

  const nameVal = childName || 'Anak';

  if (type === 'worksheet1') {
    const { refleksi = {}, indikator = {}, pola = 'belum_yakin' } = payload;
    const isBisaMenjelaskan = !!indikator.anakBisaMenjelaskan;
    const isRajinLes = !!indikator.anakRajinLes;
    const isJadwalPenuh = !!indikator.jadwalPenuh;
    const isJarangCek = !!refleksi.jarangCekPaham;
    const isFokusAktivitas = !!refleksi.fokusAktivitas;

    if (!isBisaMenjelaskan && (isRajinLes || isJadwalPenuh)) {
      category = 'Perangkap Aktivitas';
      efficiencyScore = 35;
      title = `Diagnosis Efektivitas Belajar ${nameVal}: Terjebak Rutinitas Tanpa Pemahaman`;
    } else if (isBisaMenjelaskan && !isJarangCek) {
      category = 'Pemahaman Mandiri';
      efficiencyScore = 85;
      title = `Diagnosis Efektivitas Belajar ${nameVal}: Fokus pada Kemandirian Kognitif`;
    } else {
      category = 'Transisi Fleksibel';
      efficiencyScore = 60;
      title = `Diagnosis Efektivitas Belajar ${nameVal}: Perlu Penyelarasan Sistem Rumah`;
    }

    realityCheck = [
      `• **Pola Belajar Dominan:** ${nameVal} saat ini terlihat ${isJadwalPenuh ? 'memiliki jadwal belajar yang sangat padat dwi-mingguan' : 'memiliki ritme belajar menengah'}. Namun, ada indikasi bahwa kesibukan fisik les belum berbanding lurus dengan kedalaman pemahaman materi sekolah yang sesungguhnya.`,
      `• **Celah Pemantauan:** ${isJarangCek ? 'Sikap jarang memeriksa ulang pemahaman anak di rumah' : 'Meskipun Anda sudah berupaya mengecek pemahaman,'} berisiko membuat kita tertipu oleh tumpukan nilai PR bagus yang dikerjakan langsung di bawah bimbingan guru les tanpa asimilasi memori sejati.`,
      `• **Indikator Nalar:** Terpantau ${isBisaMenjelaskan ? 'anak mampu menjelaskan materi pelajaran pertanda asimilasi kognitif bugar.' : `anak kesulitan menjelaskan ulang konsep dasar dengan susunan kalimat sendiri. Ini menunjukkan "kemampuan imitasi mekanikal" (meniru cara pengerjaan tanpa memahami logika di balik angka).`}`
    ].join('\n\n');

    implications = [
      `• **Ketergantungan Mentor:** ${nameVal} berisiko memiliki mentalitas "kemandirian semu", di mana ia terlihat pintar hanya saat didampingi guru les tetapi mogok nalar ketika menghadapi ujian mandiri di kelas.`,
      `• **Kelelahan Mental Akut:** Menumpuk jadwal les tanpa jeda pendinginan emosi menurunkan kebugaran mental batin anak, membuat anak terbiasa belajar mekanis dan cepat bosan demi sekadar menyenangkan orang tua.`
    ].join('\n\n');

    recommendations = [
      "Lakukan diskusi santai 5-10 menit paska les dengan metode 'Feynman': mintalah anak menceritakan kembali satu hal terseru yang dipelajarinya hari ini dengan bahasanya sendiri.",
      "Ubah parameter keberhasilan dari 'seberapa lama anak sibuk di kelas' menjadi 'seberapa lancar anak memecahkan variasi soal berbeda bentuk tanpa panduan'.",
      "Sediakan waktu jeda pendinginan kognitif minimal 15-30 menit (jam bebas belajar) setelah pulang les sebelum ia menyentuh pelajaran rumah kembali."
    ];

  } else if (type === 'worksheet2') {
    const { caraBelajar = {}, materiKesulitan = '', pola = {} } = payload;
    const isPahamKonsep = caraBelajar.memahamiKonsep === 'ya';
    const isMenjelaskanUlang = caraBelajar.menjelaskanUlang === 'ya';
    const isLebihMeniru = !!pola.lebihBanyakMeniru;
    const isBergantungGuru = !!pola.bergantungArahanGuru;

    if (isLebihMeniru || isBergantungGuru) {
      category = 'Ketergantungan Metode Imitasi';
      efficiencyScore = 40;
      title = `Diagnosis Keselarasan Pembelajaran ${nameVal}: Dominasi Pola Meniru Langkah`;
    } else if (isPahamKonsep && isMenjelaskanUlang) {
      category = 'Konseptual Mandiri';
      efficiencyScore = 90;
      title = `Diagnosis Keselarasan Pembelajaran ${nameVal}: Struktur Nalar Konseptual Kokoh`;
    } else {
      category = 'Keselarasan Menengah';
      efficiencyScore = 65;
      title = `Diagnosis Keselarasan Pembelajaran ${nameVal}: Transisi Pemahaman Konseptual`;
    }

    realityCheck = [
      `• **Tinjauan Kognisi:** ${nameVal} menunjukkan kecenderungan ${isLebihMeniru ? 'belajar dengan pola imitasi (menyalin cara pengerjaan tutor) daripada memahami esensi materi.' : 'berusaha mengasimilasi materi secara bertahap.'}`,
      `• **Evaluasi Kurikulum:** Materi les dinilai ${caraBelajar.materiSelaras === 'ya' ? 'sudah selaras dan membantu kebutuhan harian mata pelajaran sekolah' : 'masih kurang sinkron dengan ujian sekolah harian'}.`,
      `• **Kesulitan Khusus:** Terdeteksi hambatan rill yang berulang pada area: "${materiKesulitan || 'Tidak ada catatan kesulitan khusus'}". Hal ini membutuhkan penyederhanaan instruksi dari mentor.`
    ].join('\n\n');

    implications = [
      `• **Guncangan Soal Baru:** Anak akan langsung menyerah atau kebingungan saat model pertanyaan dimodifikasi sedikit dari contoh soal yang ada di catatan les.`,
      `• **Penumpukan Beban Pikiran:** Pembelajaran metode hafalan mekanis mempercepat kepenuhan memori jangka pendek, memicu frustrasi belajar dwi-mingguan.`
    ].join('\n\n');

    recommendations = [
      "Komunikasikan kepada mentor les agar memprioritaskan asimilasi konsep dasar materi daripada melimpahkan setumpuk lembar latihan PR.",
      "Latih anak di rumah menggunakan 'Metode Dua Sisi': berikan satu soal yang serupa tetapi dengan narasi cerita yang berbalik, uji apakah nalar mandirinya berfungsi.",
      "Batasi durasi pengerjaan soal hafalan mekanis, ganti dengan diskusi tanya jawab gambar/diagram logika."
    ];

  } else if (type === 'worksheet3') {
    const { auditLingkungan = {}, situasiRumah = '', pola = {} } = payload;
    const isEmosi = !!auditLingkungan.berakhirEmosi;
    const isPasif = !!pola.rumahPasif;
    const isTekanan = !!pola.seringTekanan;

    if (isEmosi || isTekanan || isPasif) {
      category = 'Iklim Rumah Penuh Tekanan / Pasif';
      efficiencyScore = 45;
      title = `Diagnosis Ekosistem Rumah ${nameVal}: Butuh Rekonstruksi Iklim Pendukung`;
    } else {
      category = 'Suasana Rumah Kondusif & Suportif';
      efficiencyScore = 88;
      title = `Diagnosis Ekosistem Rumah ${nameVal}: Harmonisasi Sistem Belajar Mandiri Tangguh`;
    }

    realityCheck = [
      `• **Iklim Belajar Rumah:** Ekosistem belajar di rumah pasca pulang les teridentifikasi ${isEmosi ? 'kerap dilingkupi tegangan emosional atau konflik asuh antara orang tua dan anak.' : 'sudah cukup sejuk, tenang, dan tertata hangat.'}`,
      `• **Rutinitas Keseimbangan:** Orang tua ${auditLingkungan.rutinitasBelajar ? 'telah memetakan rutinitas harian yang jelas.' : 'belum memiliki jadwal penunjang yang konsisten.'} Situasi rill di rumah terpantau: "${situasiRumah || 'Tidak ada situasi khusus yang menonjol'}".`,
      `• **Peran Rumah:** Suasana rumah adalah jangkar asimilasi memori jangka panjang. Jika rumah pasif, asimilasi kognisi di les akan langsung luntur dalam 24 jam.`
    ].join('\n\n');

    implications = [
      `• **Resistensi Emosional Belajar:** Anak mengasosiasikan buku dan proses belajar sebagai pemicu stres/amarah orang tua, melumpuhkan gairah belajar alaminya.`,
      `• **Kelemahan Retensi Memori:** Hasil les bernilai mahal di luar rumah menguap sia-sia karena tidak disambut dengan rutinitas tenang pasca-les di dalam rumah.`
    ].join('\n\n');

    recommendations = [
      "Hentikan segera kebiasaan mengajar dengan nada tinggi atau amarah di rumah. Jika suasana mulai memanas, liburkan belajar mandiri 15 menit.",
      "Bangun rutinitas diskusi santai tanpa buku (bincang batin hangat) sambil menikmati cemilan setelah anak pulang dari les.",
      "Fasilitasi ruang belajar yang tenang, bebas dari gangguan gawai/televisi anggota keluarga lain untuk melatih fokus batin anak."
    ];

  } else if (type === 'worksheet4') {
    const { mentalModel = {}, refleksiPerubahan = '' } = payload;
    const isLepasBeban = !!mentalModel.pentingAnakSudahLes;
    const isHarapBimbel = !!mentalModel.harapBimbelSelesaikanMasalah;

    if (isLepasBeban || isHarapBimbel) {
      category = 'Paradigma Lepas Tanggung Jawab';
      efficiencyScore = 50;
      title = `Audit Mental Model Pendidikan ${nameVal}: Menempatkan Les Sebagai Pusat Sistem`;
    } else {
      category = 'Paradigma Rumah Pusat Sistem';
      efficiencyScore = 92;
      title = `Audit Mental Model Pendidikan ${nameVal}: Les Sebagai Alat Bantu Taktis`;
    }

    realityCheck = [
      `• **Peta Keyakinan Asuh:** Keyakinan orang tua menunjukkan bahwa ${isLepasBeban ? 'masih ada sisa-sisa mental model melegasikan kebugaran belajar sepenuhnya pada pihak luar.' : 'Anda menyadari penuh bahwa andil rumah adalah kunci sistem utama.'}`,
      `• **Refleksi Perubahan:** Pemikiran rill orang tua yang tercantum: "${refleksiPerubahan || 'Belum merefleksikan perubahan cara pandang secara utuh'}" menggambarkan proses transisi yang logis.`
    ].join('\n\n');

    implications = [
      `• **Pemborosan Anggaran Belajar:** Orang tua terus menambah jadwal les baru saat nilai anak turun, padahal yang bocor adalah fondasi asimilasi di rumah.`,
      `• **Kelemahan Koneksi Emosi:** Kehilangan momen kebersamaan mendampingi tumbuh kembang nalar anak secara bertahap.`
    ].join('\n\n');

    recommendations = [
      "Posisikan bimbingan les dwi-mingguan secara proporsional sebagai 'asisten pelengkap taktis' saja, bukan penanggung jawab mutlak masa depan anak.",
      "Uji kualitas mentor belajar anak secara objektif berdasarkan kemampuan mereka memantik kegembiraan nalar mandiri anak.",
      "Tingkatkan kolaborasi komunikasi dengan mentor les dwi-minggu sekali untuk menyinkronkan strategi asuh rumah."
    ];

  } else if (type === 'worksheet5') {
    const { rutinitas = {}, konsistensi = 'kurang', bagianPalingSulit = '', rencanaPerbaikan = '' } = payload;

    if (konsistensi === 'kurang' || konsistensi === 'tidak') {
      category = 'SOP Rumah Belum Konsisten';
      efficiencyScore = 40;
      title = `Evaluasi SOP Paska Pulang Les ${nameVal}: Fluktuasi Rutinitas Asimilasi`;
    } else {
      category = 'SOP Rumah Sangat Konsisten';
      efficiencyScore = 85;
      title = `Evaluasi SOP Paska Pulang Les ${nameVal}: Struktur Pembiasaan Refleksi Kokoh`;
    }

    realityCheck = [
      `• **Kestabilan Ritme Belajar:** Penerapan SOP penunjang paska les berada pada kategori **${konsistensi === 'sangat' ? 'Sangat Teratur' : konsistensi === 'cukup' ? 'Cukup Teratur' : 'Belum Konsisten'}**.`,
      `• **Analisis Langkah Crucial:** Hambatan utama yang dihadapi di lapangan: "${bagianPalingSulit || 'Belum diisi'}". Rencana penanganannya: "${rencanaPerbaikan || 'Belum dirumuskan'}".`,
      `• **Faktor Kelelahan:** Jika asimilasi memori (seperti review materi 15 menit) dilewati karena anak terlampau lelah, maka ingatan berharga selama 2 jam les akan luntur kembali secara cepat.`
    ].join('\n\n');

    implications = [
      `• **Amnesia Kognitif Sebagian:** Anak lupa hampir 70% materi les setelah 24 jam karena ditiadakannya pengulangan ringan berdurasi pendek pasca belajar luar.`,
      `• **Siklus Belajar Sia-sia:** Jam belajar les yang lama dan mahal menguap karena rumah gagal menyegel ingatan anak ke memori jangka panjang.`
    ].join('\n\n');

    recommendations = [
      "Terapkan SOP minimalis: prioritaskan 15-30 menit jam mendinginkan otak (istirahat tulus), dilanjutkan diskusi santai 10 menit tanpa paksaan.",
      "Permudah eksekusi pengerjaan latihan harian di rumah dengan mendampingi anak secara gembira sambil menyuguhkan kudapan kesukaan.",
      "Gunakan isyarat lingkungan teratur (seperti 'jam diskusi manis' sehabis mandi malam) untuk membangun ritme otomatis harian anak."
    ];

  } else if (type === 'worksheet6') {
    const { logs = [], observasi = '', dataBukti = '', trenPemahaman = 'tidak', trenSikap = 'negatif', polaPalingTerlihat = '' } = payload;

    if (trenPemahaman === 'tidak' || trenSikap === 'negatif') {
      category = 'Sistem Kelelahan Belajar Akut';
      efficiencyScore = 38;
      title = `Audit 14 Hari Konsistensi ${nameVal}: Pola Penurunan Stamina Kognitif`;
    } else if (trenPemahaman === 'ya' && trenSikap === 'positif') {
      category = 'Sistem Belajar Bugar & Optimal';
      efficiencyScore = 88;
      title = `Audit 14 Hari Konsistensi ${nameVal}: Kemajuan Kognitif Stabil Berkelanjutan`;
    } else {
      category = 'Fluktuasi Kinerja Belajar';
      efficiencyScore = 62;
      title = `Audit 14 Hari Konsistensi ${nameVal}: Konsistensi Menengah Menuju Seimbang`;
    }

    realityCheck = [
      `• **Grafik Pembelajaran Dwi-mingguan:** Melalui pencatatan dwi-mingguan harian, ${nameVal} terdeteksi memiliki tren pemahaman **${trenPemahaman === 'ya' ? 'Sangat Baik' : trenPemahaman === 'sebagian' ? 'Parsial/Mengambang' : 'Kurang Memuaskan'}** dengan gairah mental harian yang **${trenSikap === 'positif' ? 'Sangat Positif & Bugar' : trenSikap === 'netral' ? 'Netral/Normal' : 'Resisten/Kelelahan Tinggi'}**.`,
      `• **Temuan Pola Rill:** Pola harian yang paling jelas terlihat menurut Anda: "${polaPalingTerlihat || 'Belum dituangkan secara detail'}".`,
      `• **Analisis Data Bukti:** Bukti konkret kecurigaan belajar anak Anda: "${dataBukti || 'Belum mencatat data bukti rill'}".`
    ].join('\n\n');

    implications = [
      `• **Kejenuhan Kognitif Sistemis:** Memaksakan les berkepanjangan pada anak yang mengalami resistensi mental terekam melumpuhkan asimilasi struktur nalar konseptual alami.`,
      `• **Penurunan Kinerja Nilai Utama:** Kelelahan batin berakumulasi merusak daya fokus anak saat ujian sekolah utama berlangsung.`
    ].join('\n\n');

    recommendations = [
      "Jadwalkan satu hari penuh tanpa aktivitas les/sekolah tambahan sebagai 'Hari Istirahat Jiwa Kognitif' bagi anak.",
      "Segera lakukan pemangkasan waktu les (paling ideal dwi-mingguan) jika grafik konsistensi menunjukkan tren pemahaman negatif beruntun.",
      "Ganti arah bimbingan harian ke metode permainan logika edukasi yang ramah batin anak."
    ];

  } else if (type === 'worksheet7') {
    const { ringkasanSop = '', ringkasanPemahaman = '', ringkasanSikap = '', ringkasanEfektivitas = '', keputusan = 'ganti_strategi', catatanPenutup = '' } = payload as Worksheet7Data;

    if (keputusan === 'stop') {
      category = 'Keputusan Strategis: STOP LES (Jeda Pemulihan Batin)';
      efficiencyScore = 75; // high score reflects strategic courage
      title = `Validasi Keputusan Strategis Akhir ${nameVal}: Penjeda Belajar Ramah Mental`;
    } else if (keputusan === 'ganti_strategi') {
      category = 'Keputusan Strategis: ADAPTASI/GANTI STRATEGI (Taktis Berimbang)';
      efficiencyScore = 80;
      title = `Validasi Keputusan Strategis Akhir ${nameVal}: Modifikasi Format & Pendekatan Terarah`;
    } else {
      category = 'Keputusan Strategis: LANJUTKAN LES (Akselerasi Berkelanjutan)';
      efficiencyScore = 85;
      title = `Validasi Keputusan Strategis Akhir ${nameVal}: Pertahanan Rutinitas Berdasarkan Bukti`;
    }

    realityCheck = [
      `• **Verifikasi Rencana Aksi Pemulihan:** Anda memantapkan diri mengambil keputusan strategis **${keputusan === 'stop' ? 'MENGHENTIKAN/MENJEDA LES' : keputusan === 'ganti_strategi' ? 'MELAKUKAN ADAPTASI STRATEGI' : 'MELANJUTKAN LES DENGAN EVALUASI'}** demi masa depan belajar ${nameVal}.`,
      `• **Audit Kumulatif Pilar Belajar:** Ringkasan efektivitas sop rumah dinilai: "${ringkasanSop || 'Belum dirangkum'}". Status pemahaman anak: "${ringkasanPemahaman || 'Belum terdata'}" dengan kondisi emosi: "${ringkasanSikap || 'Belum terekam'}".`,
      `• **Analisis Implementasi Rill:** Langkah mitigasi asuh yang Anda rencanakan: "${catatanPenutup || 'Belum dideskripsikan secara lengkap'}".`
    ].join('\n\n');

    implications = [
      `• **Keberanian Pengasuhan:** Keputusan yang kokoh berbasis data ini menghindarkan kita dari perangkap membuang anggaran waktu & uang untuk sistem belajar yang tidak efisien.`,
      `• **Pemulihan Alami:** Menyiapkan ruang tumbuh kembang nalar batin ${nameVal} secara lebih bermartabat, gembira, dan berbobot kedisiplinan alami.`
    ].join('\n\n');

    recommendations = [
      "Bagikan keputusan strategis ini kepada pihak keluarga dan guru bimbingan dengan tenang, objektif, tanpa ada rasa bersalah.",
      "Pantau kestabilan suasana emosi anak di rumah secara berangsur-angsur dalam 14 hari ke depan pasca-keputusan dijalankan.",
      "Gunakan kembali workbook dwi-mingguan ini di masa mendatang untuk menguji kesiapan kognitif anak menyerap tantangan belajar baru."
    ];
  }

  return {
    title,
    category,
    efficiencyScore,
    realityCheck,
    implications,
    recommendations
  };
}
