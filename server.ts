import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Real-world API route for worksheet explanation & analysis
  app.post("/api/analyze", async (req, res) => {
    try {
      const { worksheetType = 'worksheet1', childName } = req.body;

      if (!childName) {
        return res.status(400).json({ error: "Nama anak harus diisi." });
      }

      let prompt = "";
      let systemMsg = "Anda adalah konsultan pendidikan dan pakar tumbuh kembang anak dari Smart Learning System.";

      if (worksheetType === 'worksheet2') {
        const { caraBelajar, materiKesulitan, pola } = req.body;

        const caraBelajarText = [
          `Mampu menjelaskan ulang materi: ${caraBelajar.menjelaskanUlang || 'Belum diisi'}`,
          `Memahami konsep, bukan hanya hafalan: ${caraBelajar.memahamiKonsep || 'Belum diisi'}`,
          `Bisa mengerjakan soal berbeda bentuk: ${caraBelajar.soalBerbeda || 'Belum diisi'}`,
          `Materi les selaras dengan kebutuhan sekolah: ${caraBelajar.materiSelaras || 'Belum diisi'}`
        ].join("\n");

        const polaText = [
          `Anak lebih banyak meniru: ${pola.lebihBanyakMeniru ? 'Ya' : 'Tidak'}`,
          `Anak mulai memahami konsep: ${pola.mulaiPahamKonsep ? 'Ya' : 'Tidak'}`,
          `Anak masih bergantung pada arahan guru: ${pola.bergantungArahanGuru ? 'Ya' : 'Tidak'}`
        ].join("\n");

        prompt = `
=== LES EVALUATOR WORKSHEET 2 DATA ===
Nama Anak: ${childName}
Materi/Subjek evaluasi: Sinkronisasi Pembelajaran

1. EVALUASI CARA BELAJAR ANAK:
${caraBelajarText}

2. OBSERVASI (Materi yang paling sering membuat kesulitan):
"${materiKesulitan || 'Tidak ada catatan kesusahan khusus'}"

3. POLA BELAJAR YANG TERLIHAT:
${polaText}
=======================================

Tugas Anda adalah mengevaluasi data di atas berdasarkan metodologi "Smart Learning System - Les Evaluator Workbook Worksheet 2 (Sinkronisasi Pembelajaran)".
Pedoman Pedagogis Worksheet 2:
- Filosofi utama: "Pastikan materi les selaras dengan kebutuhan anak dan cara belajarnya."
- Jika "Anak lebih banyak meniru" = Ya atau "Anak masih bergantung pada arahan guru" = Ya, tetapi kemampuan "Bisa mengerjakan soal berbeda bentuk" = Tidak/Sebagian atau "Memahami konsep, bukan hanya hafalan" = Tidak/Sebagian, ini menunjukkan implikasi: "KEMUNGKINAN BESAR PEMAHAMAN BELUM KUAT" (Aktivitas belajar tinggi tetapi pemahaman rill masih sangat rendah).
- "Fokuskan pada pemahaman, bukan sekadar menyelesaikan banyak les. Pemahaman yang kuat akan membuat anak lebih mandiri dan percaya diri."

Berikan analisis yang jujur, suportif, berorientasi solusi, dan dalam format JSON terstruktur dengan Bahasa Indonesia yang elegan.
`;

        systemMsg = "Anda adalah konsultan pendidikan dari Smart Learning System yang berspesialisasi dalam sinkronisasi silabus sekolah dengan kurikulum bimbingan belajar anak (Worksheet 2).";

      } else if (worksheetType === 'worksheet3') {
        const { auditLingkungan, situasiRumah, pola } = req.body;

        const auditText = [
          `Rumah punya rutinitas belajar jelas: ${auditLingkungan.rutinitasBelajar === true ? 'Ya' : auditLingkungan.rutinitasBelajar === false ? 'Tidak' : 'Belum diisi'}`,
          `Ada diskusi singkat setelah les: ${auditLingkungan.diskusiSetelahLes === true ? 'Ya' : auditLingkungan.diskusiSetelahLes === false ? 'Tidak' : 'Belum diisi'}`,
          `Orang tua tahu materi yang dipelajari: ${auditLingkungan.tahuMateri === true ? 'Ya' : auditLingkungan.tahuMateri === false ? 'Tidak' : 'Belum diisi'}`,
          `Anak punya waktu istirahat cukup: ${auditLingkungan.istirahatCukup === true ? 'Ya' : auditLingkungan.istirahatCukup === false ? 'Tidak' : 'Belum diisi'}`,
          `Belajar di rumah sering berakhir emosi: ${auditLingkungan.berakhirEmosi === true ? 'Ya' : auditLingkungan.berakhirEmosi === false ? 'Tidak' : 'Belum diisi'}`
        ].join("\n");

        const polaText = [
          `Rumah aktif mendukung belajar: ${pola.rumahAktif ? 'Ya' : 'Tidak'}`,
          `Rumah masih pasif: ${pola.rumahPasif ? 'Ya' : 'Tidak'}`,
          `Belajar sering dipenuhi tekanan: ${pola.seringTekanan ? 'Ya' : 'Tidak'}`
        ].join("\n");

        prompt = `
=== LES EVALUATOR WORKSHEET 3 DATA ===
Nama Anak: ${childName}
Materi/Subjek evaluasi: Evaluasi Sistem Rumah (Lingkungan Belajar di Rumah)

1. AUDIT LINGKUNGAN BELAJAR:
${auditText}

2. OBSERVASI (Situasi belajar di rumah yang paling sering terjadi):
"${situasiRumah || 'Tidak ada catatan situasi spesifik'}"

3. POLA SISTEM RUMAH YANG DIIDENTIFIKASI:
${polaText}
=======================================

Tugas Anda adalah mengevaluasi data di atas berdasarkan Lembar Kerja 3 (Worksheet 3: Evaluasi Sistem Rumah) dalam metodologi "Smart Learning System - Les Evaluator Workbook".
Pedoman Pedagogis Worksheet 3:
- Filosofi utama: "Lingkungan rumah sangat berpengaruh terhadap keberhasilan les anak. Rumah yang mendukung akan membuat hasil les lebih kuat, bermakna, dan bertahan lebih lama."
- Jika "Rumah masih pasif" = Ya atau "Belajar di rumah sering berakhir emosi" = Ya atau "Rumah punya rutinitas belajar jelas" = Tidak, maka berlaku hukum implikasi utama: "JIKA RUMAH PASIF ATAU PENUH TEKANAN, MAKA HASIL LES SULIT BERTAHAN LAMA".
- Sediakan diagnosis solutif agar orang tua dapat membangun "Rumah yang aktif mendukung belajar" (menyediakan rutinitas yang teratur, diskusi santai setelah les, mengetahui materi singkat tanpa perlu mengajar penuh/menghakimi, menjaga kestabilan emosi anak dengan istirahat cukup).

Berikan analisis dalam Bahasa Indonesia dengan nada yang empati, penuh pengertian namun realistis, dan berikan rekomendasi aksi konkret bagi orang tua.
`;

        systemMsg = "Anda adalah konsultan pendidikan dan penasihat kehangatan pengasuhan belajar dari Smart Learning System, ahli dalam optimalisasi suasana belajar rumah yang tenang, kondusif, dan bebas stres emosional (Worksheet 3).";

      } else if (worksheetType === 'worksheet5') {
        const { rutinitas, konsistensi, bagianPalingSulit, rencanaPerbaikan } = req.body;

        const rutinitasText = [
          `1. Istirahat 15-30 menit (Menyegarkan pikiran): ${rutinitas.istirahatMendinginkan === true ? 'Ya' : rutinitas.istirahatMendinginkan === false ? 'Tidak' : 'Belum diisi'} (Catatan: ${rutinitas.istirahatCatatan || '-'})`,
          `2. Diskusi singkat 10-15 menit (Memahami inti materi): ${rutinitas.diskusiSingkat === true ? 'Ya' : rutinitas.diskusiSingkat === false ? 'Tidak' : 'Belum diisi'} (Catatan: ${rutinitas.diskusiCatatan || '-'})`,
          `3. Review materi les 15-20 menit (Memperkuat pemahaman): ${rutinitas.reviewMateri === true ? 'Ya' : rutinitas.reviewMateri === false ? 'Tidak' : 'Belum diisi'} (Catatan: ${rutinitas.reviewCatatan || '-'})`,
          `4. Kerjakan latihan / PR (Mengaplikasikan konsep): ${rutinitas.kerjakanLatihan === true ? 'Ya' : rutinitas.kerjakanLatihan === false ? 'Tidak' : 'Belum diisi'} (Catatan: ${rutinitas.kerjakanCatatan || '-'})`,
          `5. Rencana belajar esok hari 5-10 menit (Membentuk ritme): ${rutinitas.rencanaBesok === true ? 'Ya' : rutinitas.rencanaBesok === false ? 'Tidak' : 'Belum diisi'} (Catatan: ${rutinitas.rencanaCatatan || '-'})`
        ].join("\n");

        prompt = `
=== LES EVALUATOR WORKSHEET 5 DATA ===
Nama Anak: ${childName}
Materi/Subjek evaluasi: SOP Rumah Setelah Anak Pulang Les

1. RUTINITAS SETELAH ANAK PULANG LES:
${rutinitasText}

2. EVALUASI RUTINITAS (Seberapa konsisten SOP ini berjalan):
Konsistensi: ${konsistensi || 'Belum diisi'}

3. CATATAN & PERBAIKAN:
Bagian paling sulit dijalankan: "${bagianPalingSulit || 'Belum diisi'}"
Rencana perbaikan: "${rencanaPerbaikan || 'Belum diisi'}"
=======================================

Tugas Anda adalah mengevaluasi data di atas berdasarkan Lembar Kerja 5 (Worksheet 5: SOP Rumah Setelah Anak Pulang Les) dalam metodologi "Smart Learning System - Les Evaluator Workbook".
Pedoman Pedagogis Worksheet 5:
- Filosofi utama: "Les membangun pengetahuan, tetapi rumah menguatkan pemahaman. SOP yang baik hari ini = hasil yang lebih baik esok hari. Konsistensi kecil setiap hari > usaha besar tapi tidak teratur."
- Analisis implikasi: Jika konsistensi rendah (kurang konsisten atau tidak konsisten) atau jika langkah krusial seperti 'Diskusi singkat' atau 'Review materi' dilewati, ingatkan orang tua secara positif bahwa melewatkan peninjauan ini berisiko melunturkan kembali konsep-konsep berharga yang didapat anak selama jam bimbingan les dalam 24 jam pertama.
- Berikan saran yang ramah, taktis, dan aplikatif untuk merekatkan rutinitas harian setelah pulang les tanpa menjadikannya beban baru bagi anak (misal: menjaga suasana tetap gembira dan santai, mulai bertahap dari tantangan terkecil).

Berikan analisis dalam Bahasa Indonesia dengan nada yang mendukung perkembangan anak, mengapresiasi komitmen orang tua, taktis, dan solutif.
`;

        systemMsg = "Anda adalah konsultan pendidikan senior dan pakar produktivitas belajar anak dari Smart Learning System, ahli dalam menyusun SOP paska-les yang seimbang, ramah mental anak, dan optimal melipatgandakan retensi ingatan (Worksheet 5).";

      } else if (worksheetType === 'worksheet4') {
        const { mentalModel, refleksiPerubahan } = req.body;

        const mentalModelText = [
          `Saya pernah merasa "yang penting anak sudah les": ${mentalModel.pentingAnakSudahLes === true ? 'Ya' : mentalModel.pentingAnakSudahLes === false ? 'Tidak' : 'Belum diisi'}`,
          `Saya berharap bimbel menyelesaikan semua masalah belajar: ${mentalModel.harapBimbelSelesaikanMasalah === true ? 'Ya' : mentalModel.harapBimbelSelesaikanMasalah === false ? 'Tidak' : 'Belum diisi'}`,
          `Saya jarang mengevaluasi efektivitas les: ${mentalModel.jarangEvaluasiEfektivitas === true ? 'Ya' : mentalModel.jarangEvaluasiEfektivitas === false ? 'Tidak' : 'Belum diisi'}`,
          `Saya mulai memahami bahwa rumah tetap pusat sistem: ${mentalModel.pahamRumahPusatSistem === true ? 'Ya' : mentalModel.pahamRumahPusatSistem === false ? 'Tidak' : 'Belum diisi'}`
        ].join("\n");

        prompt = `
=== LES EVALUATOR WORKSHEET 4 DATA ===
Nama Anak: ${childName}
Materi/Subjek evaluasi: Mental Model - Bimbel Itu Alat, Bukan Sistem

1. MENTAL MODEL AUDIT (Pernyataan & Keyakinan Orang Tua):
${mentalModelText}

2. REFLEKSI PERUBAHAN (Perubahan cara berpikir yang paling terasa):
"${refleksiPerubahan || 'Tidak ada catatan refleksi atau perubahan cara berpikir yang ditulis.'}"
=======================================

Tugas Anda adalah mengevaluasi data di atas berdasarkan Lembar Kerja 4 (Worksheet 4: Bimbel itu Alat, Bukan Sistem) dalam metodologi "Smart Learning System - Les Evaluator Workbook".
Pedoman Pedagogis Worksheet 4:
- Filosofi utama: "Memahami peran bimbel dengan perspektif yang tepat: alat bantu, bukan pengganti sistem belajar. Sistem belajar yang kuat selalu dibangun di rumah."
- Analisis implikasi: Jika orang tua didominasi keyakinan pasif seperti melepaskan beban ("kunci utama anak sudah masuk les") atau berharap bimbingan belajar menyelesaikan seluruh rintangan emosi-intelektual anak, ingatkan dengan penuh kasih bahwa hal tersebut meletakkan bimbingan luar sebagai pusat sistem padahal rumah adalah rajanya.
- Berikan restorasi kepercayaan diri bagi orang tua agar memosisikan bimbel secara proporsional sebagai "asisten pelengkap" dan kembali memperkuat rutinitas internal keluarga dengan gembira dan konsisten.

Berikan analisis dalam Bahasa Indonesia dengan nada yang penuh pencerahan, kebijaksanaan, empati, serta solusi yang menggerakkan kesadaran orang tua.
`;

        systemMsg = "Anda adalah konsultan pendidikan senior dan mentor mindful parenting dari Smart Learning System, ahli dalam merekonstruksi mental model pengasuhan belajar anak agar bersandar pada kekuatan teladan dan sistem mandiri di rumah (Worksheet 4).";

      } else if (worksheetType === 'worksheet6') {
        const { logs, observasi, dataBukti, trenPemahaman, trenSikap, polaPalingTerlihat } = req.body;

        const logSummaries = (logs || []).map((log: any, idx: number) => {
          return `Hari ${idx + 1}: Materi = ${log.materi || '-'}, Bisa Jelaskan Kembali = ${log.paham || '-'}, Sikap Belajar = ${log.sikap || '-'}, Catatan = ${log.catatan || '-'}`;
        }).join("\n");

        prompt = `
=== LES EVALUATOR WORKSHEET 6 DATA ===
Nama Anak: ${childName}
Materi/Subjek evaluasi: Audit 14 Hari Konsistensi & Pola Belajar

1. LOG SEBELAS HINGGA EMPAT BELAS HARI:
${logSummaries}

2. ANALISIS ORANG TUA:
Observasi Utama: "${observasi || 'Belum diisi'}"
Data & Bukti Nyata: "${dataBukti || 'Belum diisi'}"
Pola yang Paling Terlihat: "${polaPalingTerlihat || 'Belum diisi'}"

3. TREN KONSISTENSI:
Tren Pemahaman: ${trenPemahaman || 'Belum diisi'}
Tren Sikap Belajar: ${trenSikap || 'Belum diisi'}
=======================================

Tugas Anda adalah mengevaluasi data berkala 14 hari di atas berdasarkan Lembar Kerja 6 (Worksheet 6: Audit 14 Hari) dalam metodologi "Smart Learning System - Les Evaluator Workbook".
Pedoman Pedagogis Worksheet 6:
- Filosofi utama: "Data kecil yang konsisten setiap hari akan menghasilkan perubahan atau lompatan besar. Catat, evaluasi, dan perbaiki."
- Analisis implikasi: Evaluasi apakah bimbingan belajar selama 14 hari ini efektif (pemahaman 'Ya' & sikap 'Positif') atau justru melelahkan (pemahaman 'Tidak'/'Sebagian' & sikap 'Negatif'). Jika banyak hari bermasalah, sampaikan dengan empati bahwa "masalah kemungkinan ada pada sistem belajar harian, bukan sekadar durasi belajar anak."
- Memberikan peta remedial yang taktis serta intervensi asuh yang harmonis untuk meredam kelelahan mental, menata interval istirahat, dan memperbagus kebiasaan asimilasi kognitif di rumah.

Berikan analisis dalam Bahasa Indonesia dengan nada yang berbobot data, empati, taktis, dan melahirkan solusi konkret.
`;

        systemMsg = "Anda adalah pakar psikologi belajar anak dan analis data sistem pendidikan rill dari Smart Learning System, pakar dalam mengaudit pola konsistensi belajar berkala 14 hari (Worksheet 6).";

      } else if (worksheetType === 'worksheet7') {
        const { ringkasanSop, ringkasanPemahaman, ringkasanSikap, ringkasanEfektivitas, keputusan, catatanPenutup } = req.body;

        prompt = `
=== LES EVALUATOR WORKSHEET 7 DATA ===
Nama Anak: ${childName}
Materi/Subjek evaluasi: KEPUTUSAN AKHIR (Final Decision)

1. RINGKASAN AUDIT BELAJAR:
- Ringkasan SOP Rumah: "${ringkasanSop || 'Belum diisi'}"
- Ringkasan Pemahaman Anak: "${ringkasanPemahaman || 'Belum diisi'}"
- Ringkasan Sikap & Motivasi: "${ringkasanSikap || 'Belum diisi'}"
- Ringkasan Efektivitas Les: "${ringkasanEfektivitas || 'Belum diisi'}"

2. KEPUTUSAN STRATEGIS:
Opsi Terpilih: ${keputusan ? keputusan.toUpperCase() : 'BELUM MEMILIH'}

3. RENCANA IMPLEMENTASI KEPUTUSAN:
"${catatanPenutup || 'Belum diisi'}"
=======================================

Tugas Anda adalah memvalidasi keputusan strategis di atas berdasarkan metodologi "Smart Learning System - Les Evaluator Workbook Worksheet 7 (Keputusan Akhir)".
Pedoman Pedagogis Worksheet 7:
- Filosofi utama: "Keputusan terbaik lahir dari data, bukan asumsi. Tugas kita bukan semata-mata membuat jadwal anak padat, melainkan memastikan sistem belajarnya efektif dan ramah mental anak."
- Jika keputusan adalah "LANJUT", validasi apakah SOP rumah dan pemahaman rill anak memang sudah berjalan optimal. Berikan dorongan taktis agar konsistensi dipertahankan secara positif.
- Jika keputusan adalah "GANTI STRATEGI", evaluasi bagian mana yang goyah (apakah penataan jam, frekuensi, atau metode tutor). Berikan peta aksi konseptual berimbang.
- Jika keputusan adalah "STOP", berikan ketenangan mental bagi orang tua agar tidak merasa bersalah. Tegaskan kembali bahwa "menghentikan les yang buruk dwi-minggu ini adalah langkah terpuji untuk memulihkan gairah belajar anak". Tunjukkan langkah asuh mandiri yang kuat di rumah.

Berikan analisis dalam Bahasa Indonesia dengan nada berwibawa, bijaksana, menenangkan, rasional, dan taktis dengan format JSON terstruktur.
`;

        systemMsg = "Anda adalah direktur konsultan pendidikan rill dan perancang kurikulum makro dari Smart Learning System, ahli dalam membuat keputusan strategis belajar anak (Worksheet 7).";

      } else {
        // Worksheet 1
        const { refleksi, observasiRumah, indikator, pola } = req.body;

        const refleksiText = [
          `Sudah lakukan segalanya untuk pendidikan anak: ${refleksi.pendidikanAnak ? 'Ya' : 'Tidak'}`,
          `Jadwal les anak cukup padat: ${refleksi.jadwalPadat ? 'Ya' : 'Tidak'}`,
          `Sering menambah les saat nilai turun: ${refleksi.tambahLesNilaiTurun ? 'Ya' : 'Tidak'}`,
          `Jarang mengecek apakah anak benar-benar paham: ${refleksi.jarangCekPaham ? 'Ya' : 'Tidak'}`,
          `Lebih fokus pada aktivitas daripada hasil nyata: ${refleksi.fokusAktivitas ? 'Ya' : 'Tidak'}`,
        ].join("\n");

        const indikatorText = [
          `Anak rajin les (indikator kesibukan?): ${indikator.anakRajinLes ? 'Ya' : 'Tidak'}`,
          `Nilai PR bagus (apakah dibantu guru les tanpa paham?): ${indikator.nilaiPrBagus ? 'Ya' : 'Tidak'}`,
          `Jadwal penuh (kesibukan): ${indikator.jadwalPenuh ? 'Ya' : 'Tidak'}`,
          `Guru bilang aktif (keaktifan sosial?): ${indikator.guruBilangAktif ? 'Ya' : 'Tidak'}`,
          `Anak benar-benar bisa menjelaskan materi (indikator pilar PEMAHAMAN): ${indikator.anakBisaMenjelaskan ? 'Ya' : 'Tidak'}`
        ].join("\n");

        const patternText = pola === 'aktivitas' 
          ? 'Fokus lebih banyak pada aktivitas fisik & jadwal (Aktivitas)'
          : pola === 'pemahaman'
          ? 'Fokus lebih banyak pada kedalaman & pemahaman mandiri (Pemahaman)'
          : 'Belum yakin atau ragu-ragu';

        prompt = `
=== LES EVALUATOR WORKSHEET 1 DATA ===
Nama Anak: ${childName}
Materi/Subjek evaluasi: Efektivitas Les (Aktivitas vs Pemahaman)

1. REFLEKSI AWAL PARENT:
${refleksiText}

2. OBSERVASI KONDISI DI RUMAH:
"${observasiRumah || 'Tidak ada catatan observasi'}"

3. INDIKATOR KEBERHASILAN LES YANG DIGUNAKAN SELAMA INI:
${indikatorText}

4. POLA YANG TERLIHAT MENURUT ORANG TUA:
${patternText}
================================

Tugas Anda adalah mengevaluasi data lembar kerja di atas berdasarkan metodologi "Smart Learning System - Les Evaluator Workbook Worksheet 1".
Pedoman Pedagogis:
- Jika orang tua memilih indikator seperti "anak rajin les", "nilai PR bagus", "jadwal penuh", "guru bilang aktif" namun NILAI "Anak benar-benar bisa menjelaskan materi" adalah TIDAK (false), maka ini adalah indikasi kuat anak terjebak dalam perangkap "Aktivitas" (kesibukan tanpa pemahaman sejati).
- "Langkah pertama adalah jujur melihat kenyataan, bukan membuktikan bahwa kita sudah benar."
- "Jika fokus masih pada aktivitas: les berisiko menjadi rutinitas, bukan sistem belajar."
- "Ingat: Tujuan utama bukan membuat anak sibuk, tetapi membuat anak paham dan bertumbuh."

Buatlah analisis yang komprehensif, rasional, berbasis data, namun tetap suportif dan memberikan solusi nyata bagi orang tua agar dapat beralih dari fokus aktivitas ke fokus pemahaman sejati.
`;

        systemMsg = "Anda adalah konsultan pendidikan dan pakar tumbuh kembang anak dari Smart Learning System. Tugas Anda menganalisis kelayakan metode les anak berdasarkan lembar kerja Les Evaluator Workbook. Selalu gunakan Bahasa Indonesia yang profesional, ramah, dan solutif.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemMsg,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "Judul analisis yang menggambarkan kondisi les anak, contoh: 'Diagnosis Keselarasan Belajar [Nama Anak]: Ketergantungan Metode Hafalan'"
              },
              category: {
                type: Type.STRING,
                description: "Kategori utama hasil evaluasi belajarnya. Contoh: 'Aktivitas', 'Pemahaman', 'Ketergantungan Meniru', 'Konseptual Mandiri', 'Tidak Sinkron', 'Sangat Selaras'"
              },
              efficiencyScore: {
                type: Type.INTEGER,
                description: "Skor efisiensi / efektivitas belajar anak (skala 0 - 100). Berikan nilai objektif rendah jika ketergantungan meniru tinggi, dan nilai tinggi jika pemahaman konsep kuat."
              },
              realityCheck: {
                type: Type.STRING,
                description: "Analisis kenyataan (Reality Check) yang kritis menghubungkan evaluasi belajar dengan situasi rill di rumah dan pola yang terlihat."
              },
              implications: {
                type: Type.STRING,
                description: "Implikasi jangka panjang jika terus mengikuti pola menyalin/meniru tanpa bimbingan konsep mandiri."
              },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Daftar rekomendasi berupa langkah-langkah konkret, aplikatif, dan bertahap untuk sinkronisasi materi dan melatih nalar mandiri (minimal 3 rekomendasi)."
              }
            },
            required: ["title", "category", "efficiencyScore", "realityCheck", "implications", "recommendations"]
          }
        }
      });

      const parsedResult = JSON.parse(response.text || "{}");
      res.json(parsedResult);
    } catch (error: any) {
      console.error("AI Analysis error:", error);
      res.status(500).json({
        error: "Gagal memproses analisis menggunakan AI.",
        details: error.message
      });
    }
  });

  // Serve static assets or use Vite dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
