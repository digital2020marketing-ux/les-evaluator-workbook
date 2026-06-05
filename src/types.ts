export interface RefleksiAwalAnswers {
  pendidikanAnak: boolean | null; // Saya merasa sudah melakukan segalanya untuk pendidikan anak
  jadwalPadat: boolean | null;    // Jadwal les anak cukup padat
  tambahLesNilaiTurun: boolean | null; // Saya sering menambah les saat nilai turun
  jarangCekPaham: boolean | null; // Saya jarang mengecek apakah anak benar-benar paham
  fokusAktivitas: boolean | null; // Saya lebih fokus pada aktivitas daripada hasil nyata
}

export interface IndicatorSelection {
  anakRajinLes: boolean;
  nilaiPrBagus: boolean;
  jadwalPenuh: boolean;
  guruBilangAktif: boolean;
  anakBisaMenjelaskan: boolean;
}

export type PolaTerlihat = 'aktivitas' | 'pemahaman' | 'belum_yakin';

// --- TYPES FOR WORKSHEET 1 ---
export interface WorksheetData {
  id: string;
  tanggal: string;
  childName: string;
  refleksi: RefleksiAwalAnswers;
  observasiRumah: string;
  indikator: IndicatorSelection;
  pola: PolaTerlihat;
}

// --- TYPES FOR WORKSHEET 2 ---
export type JawabanTigaSkala = 'ya' | 'sebagian' | 'tidak' | null;

export interface Worksheet2CaraBelajar {
  menjelaskanUlang: JawabanTigaSkala;
  memahamiKonsep: JawabanTigaSkala;
  soalBerbeda: JawabanTigaSkala;
  materiSelaras: JawabanTigaSkala;
}

export interface Worksheet2Pola {
  lebihBanyakMeniru: boolean;
  mulaiPahamKonsep: boolean;
  bergantungArahanGuru: boolean;
}

export interface Worksheet2Data {
  id: string;
  tanggal: string;
  childName: string;
  caraBelajar: Worksheet2CaraBelajar;
  materiKesulitan: string;
  pola: Worksheet2Pola;
}

// --- TYPES FOR WORKSHEET 3 ---
export interface Worksheet3Audit {
  rutinitasBelajar: boolean | null;
  diskusiSetelahLes: boolean | null;
  tahuMateri: boolean | null;
  istirahatCukup: boolean | null;
  berakhirEmosi: boolean | null;
}

export interface Worksheet3Pola {
  rumahAktif: boolean;
  rumahPasif: boolean;
  seringTekanan: boolean;
}

export interface Worksheet3Data {
  id: string;
  tanggal: string;
  childName: string;
  auditLingkungan: Worksheet3Audit;
  situasiRumah: string;
  pola: Worksheet3Pola;
}

// --- TYPES FOR WORKSHEET 4 ---
export interface Worksheet4MentalModel {
  pentingAnakSudahLes: boolean | null;
  harapBimbelSelesaikanMasalah: boolean | null;
  jarangEvaluasiEfektivitas: boolean | null;
  pahamRumahPusatSistem: boolean | null;
}

export interface Worksheet4Data {
  id: string;
  tanggal: string;
  childName: string;
  mentalModel: Worksheet4MentalModel;
  refleksiPerubahan: string;
}

// --- TYPES FOR WORKSHEET 5 ---
export interface Worksheet5Rutinitas {
  istirahatMendinginkan: boolean | null;
  istirahatCatatan: string;
  diskusiSingkat: boolean | null;
  diskusiCatatan: string;
  reviewMateri: boolean | null;
  reviewCatatan: string;
  kerjakanLatihan: boolean | null;
  kerjakanCatatan: string;
  rencanaBesok: boolean | null;
  rencanaCatatan: string;
}

export interface Worksheet5Data {
  id: string;
  tanggal: string;
  childName: string;
  rutinitas: Worksheet5Rutinitas;
  konsistensi: 'sangat' | 'cukup' | 'kurang' | 'tidak' | null;
  bagianPalingSulit: string;
  rencanaPerbaikan: string;
}

// --- TYPES FOR WORKSHEET 6 ---
export interface DayLogEntry {
  materi: string;
  paham: 'ya' | 'sebagian' | 'tidak' | null;
  sikap: 'positif' | 'netral' | 'negatif' | null;
  catatan: string;
}

export interface Worksheet6Data {
  id: string;
  tanggal: string;
  childName: string;
  logs: DayLogEntry[];
  observasi: string;
  dataBukti: string;
  trenPemahaman: 'ya' | 'sebagian' | 'tidak' | null;
  trenSikap: 'positif' | 'netral' | 'negatif' | null;
  polaPalingTerlihat: string;
}

// --- TYPES FOR WORKSHEET 7 ---
export interface Worksheet7Data {
  id: string;
  tanggal: string;
  childName: string;
  ringkasanSop: string;
  ringkasanPemahaman: string;
  ringkasanSikap: string;
  ringkasanEfektivitas: string;
  keputusan: 'lanjut' | 'ganti_strategi' | 'stop' | null;
  catatanPenutup: string;
}

// --- GENERAL SCHEMAS FOR RESPONSE ---
export interface AnalysisResponse {
  title: string;
  category: string; // 'Aktivitas' | 'Pemahaman' | 'Belum Yakin' | 'Sinkronisasi Lemah' | 'Sinkronisasi Kuat' | dll
  efficiencyScore: number; // 0-100
  realityCheck: string;
  implications: string;
  recommendations: string[];
}

