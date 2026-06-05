import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileSpreadsheet, ClipboardCheck, Award, GraduationCap, Clock, 
  HelpCircle, Eye, AlertCircle, History, Trash2, CheckCircle, Lightbulb, BookOpen, ChevronRight, RefreshCw, Star, Home, Brain, Activity,
  LogIn, LogOut, Check, Save, Cloud, ShieldAlert, Sparkles, User, CloudLightning
} from 'lucide-react';
import { 
  RefleksiAwalAnswers, 
  IndicatorSelection, 
  PolaTerlihat, 
  WorksheetData, 
  AnalysisResponse,
  Worksheet2CaraBelajar,
  Worksheet2Pola,
  Worksheet2Data,
  Worksheet3Audit,
  Worksheet3Pola,
  Worksheet3Data,
  Worksheet4MentalModel,
  Worksheet4Data,
  Worksheet5Rutinitas,
  Worksheet5Data,
  Worksheet6Data,
  Worksheet7Data,
  DayLogEntry
} from './types';
import { evaluateWorksheet } from './lib/evaluator';
import { onAuthStateChanged, User as AuthUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, loginWithGoogle, logoutUser, handleFirestoreError, OperationType } from './lib/firebase';

import WorksheetForm from './components/WorksheetForm';
import Worksheet2Form from './components/Worksheet2Form';
import Worksheet3Form from './components/Worksheet3Form';
import Worksheet4Form from './components/Worksheet4Form';
import Worksheet5Form from './components/Worksheet5Form';
import Worksheet6Form from './components/Worksheet6Form';
import Worksheet7Form from './components/Worksheet7Form';
import BalanceScale from './components/BalanceScale';
import AnalysisResultView from './components/AnalysisResultView';

const DEFAULT_W6_LOGS: DayLogEntry[] = Array.from({ length: 14 }, (_, i) => ({
  materi: '',
  paham: null,
  sikap: null,
  catatan: ''
}));

const DEFAULT_REFLEKSI: RefleksiAwalAnswers = {
  pendidikanAnak: null,
  jadwalPadat: null,
  tambahLesNilaiTurun: null,
  jarangCekPaham: null,
  fokusAktivitas: null
};

const DEFAULT_INDIKATOR: IndicatorSelection = {
  anakRajinLes: false,
  nilaiPrBagus: false,
  jadwalPenuh: false,
  guruBilangAktif: false,
  anakBisaMenjelaskan: false
};

const DEFAULT_W2_CARA_BELAJAR: Worksheet2CaraBelajar = {
  menjelaskanUlang: null,
  memahamiKonsep: null,
  soalBerbeda: null,
  materiSelaras: null
};

const DEFAULT_W2_POLA: Worksheet2Pola = {
  lebihBanyakMeniru: false,
  mulaiPahamKonsep: false,
  bergantungArahanGuru: false
};

const DEFAULT_W3_AUDIT: Worksheet3Audit = {
  rutinitasBelajar: null,
  diskusiSetelahLes: null,
  tahuMateri: null,
  istirahatCukup: null,
  berakhirEmosi: null
};

const DEFAULT_W3_POLA: Worksheet3Pola = {
  rumahAktif: false,
  rumahPasif: false,
  seringTekanan: false
};

const DEFAULT_W4_MENTAL: Worksheet4MentalModel = {
  pentingAnakSudahLes: null,
  harapBimbelSelesaikanMasalah: null,
  jarangEvaluasiEfektivitas: null,
  pahamRumahPusatSistem: null
};

const DEFAULT_W5_RUTINITAS: Worksheet5Rutinitas = {
  istirahatMendinginkan: null,
  istirahatCatatan: '',
  diskusiSingkat: null,
  diskusiCatatan: '',
  reviewMateri: null,
  reviewCatatan: '',
  kerjakanLatihan: null,
  kerjakanCatatan: '',
  rencanaBesok: null,
  rencanaCatatan: ''
};

interface HistoricalRecord {
  worksheetType: 'worksheet1' | 'worksheet2' | 'worksheet3' | 'worksheet4' | 'worksheet5' | 'worksheet6' | 'worksheet7';
  data: any; // Can be WorksheetData, Worksheet2Data, Worksheet3Data, Worksheet4Data, Worksheet5Data, Worksheet6Data, or Worksheet7Data
  result: AnalysisResponse;
}

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'worksheet1' | 'worksheet2' | 'worksheet3' | 'worksheet4' | 'worksheet5' | 'worksheet6' | 'worksheet7'>('worksheet1');

  // Shared state
  const [childName, setChildName] = useState('');

  // Worksheet 1 states
  const [refleksi, setRefleksi] = useState<RefleksiAwalAnswers>(DEFAULT_REFLEKSI);
  const [observasiRumah, setObservasiRumah] = useState('');
  const [indikator, setIndikator] = useState<IndicatorSelection>(DEFAULT_INDIKATOR);
  const [pola, setPola] = useState<PolaTerlihat>('belum_yakin');

  // Worksheet 2 states
  const [caraBelajar, setCaraBelajar] = useState<Worksheet2CaraBelajar>(DEFAULT_W2_CARA_BELAJAR);
  const [materiKesulitan, setMateriKesulitan] = useState('');
  const [polaW2, setPolaW2] = useState<Worksheet2Pola>(DEFAULT_W2_POLA);

  // Worksheet 3 states
  const [auditW3, setAuditW3] = useState<Worksheet3Audit>(DEFAULT_W3_AUDIT);
  const [situasiRumah, setSituasiRumah] = useState('');
  const [polaW3, setPolaW3] = useState<Worksheet3Pola>(DEFAULT_W3_POLA);

  // Worksheet 4 states
  const [mentalW4, setMentalW4] = useState<Worksheet4MentalModel>(DEFAULT_W4_MENTAL);
  const [refleksiW4, setRefleksiW4] = useState('');

  // Worksheet 5 states
  const [rutinitasW5, setRutinitasW5] = useState<Worksheet5Rutinitas>(DEFAULT_W5_RUTINITAS);
  const [konsistensiW5, setKonsistensiW5] = useState<'sangat' | 'cukup' | 'kurang' | 'tidak' | null>(null);
  const [bagianPalingSulitW5, setBagianPalingSulitW5] = useState('');
  const [rencanaPerbaikanW5, setRencanaPerbaikanW5] = useState('');

  // Worksheet 6 states
  const [logsW6, setLogsW6] = useState<DayLogEntry[]>(DEFAULT_W6_LOGS);
  const [observasiW6, setObservasiW6] = useState('');
  const [dataBuktiW6, setDataBuktiW6] = useState('');
  const [trenPemahamanW6, setTrenPemahamanW6] = useState<'ya' | 'sebagian' | 'tidak' | null>(null);
  const [trenSikapW6, setTrenSikapW6] = useState<'positif' | 'netral' | 'negatif' | null>(null);
  const [polaPalingTerlihatW6, setPolaPalingTerlihatW6] = useState('');

  // Worksheet 7 states
  const [ringkasanSopW7, setRingkasanSopW7] = useState('');
  const [ringkasanPemahamanW7, setRingkasanPemahamanW7] = useState('');
  const [ringkasanSikapW7, setRingkasanSikapW7] = useState('');
  const [ringkasanEfektivitasW7, setRingkasanEfektivitasW7] = useState('');
  const [keputusanW7, setKeputusanW7] = useState<'lanjut' | 'ganti_strategi' | 'stop' | null>(null);
  const [catatanPenutupW7, setCatatanPenutupW7] = useState('');

  // Backend / AI states
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [activeResultType, setActiveResultType] = useState<'worksheet1' | 'worksheet2' | 'worksheet3' | 'worksheet4' | 'worksheet5' | 'worksheet6' | 'worksheet7'>('worksheet1');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Firebase Auth & Cloud Sync States
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cloudSaving, setCloudSaving] = useState(false);
  const [cloudSavedSuccess, setCloudSavedSuccess] = useState(false);

  // History state
  const [history, setHistory] = useState<HistoricalRecord[]>([]);

  // Listen to Auth changes & load profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Populate states securely if they exist
            if (data.childName !== undefined) setChildName(data.childName);
            if (data.history) setHistory(data.history);
            
            if (data.worksheets) {
              const w = data.worksheets;
              if (w.worksheet1) {
                if (w.worksheet1.refleksi) setRefleksi(w.worksheet1.refleksi);
                if (w.worksheet1.observasiRumah !== undefined) setObservasiRumah(w.worksheet1.observasiRumah);
                if (w.worksheet1.indikator) setIndikator(w.worksheet1.indikator);
                if (w.worksheet1.pola) setPola(w.worksheet1.pola);
              }
              if (w.worksheet2) {
                if (w.worksheet2.caraBelajar) setCaraBelajar(w.worksheet2.caraBelajar);
                if (w.worksheet2.materiKesulitan !== undefined) setMateriKesulitan(w.worksheet2.materiKesulitan);
                if (w.worksheet2.pola) setPolaW2(w.worksheet2.pola);
              }
              if (w.worksheet3) {
                if (w.worksheet3.auditLingkungan) setAuditW3(w.worksheet3.auditLingkungan);
                if (w.worksheet3.situasiRumah !== undefined) setSituasiRumah(w.worksheet3.situasiRumah);
                if (w.worksheet3.pola) setPolaW3(w.worksheet3.pola);
              }
              if (w.worksheet4) {
                if (w.worksheet4.mentalModel) setMentalW4(w.worksheet4.mentalModel);
                if (w.worksheet4.refleksiPerubahan !== undefined) setRefleksiW4(w.worksheet4.refleksiPerubahan);
              }
              if (w.worksheet5) {
                if (w.worksheet5.rutinitas) setRutinitasW5(w.worksheet5.rutinitas);
                if (w.worksheet5.konsistensi !== undefined) setKonsistensiW5(w.worksheet5.konsistensi);
                if (w.worksheet5.bagianPalingSulit !== undefined) setBagianPalingSulitW5(w.worksheet5.bagianPalingSulit);
                if (w.worksheet5.rencanaPerbaikan !== undefined) setRencanaPerbaikanW5(w.worksheet5.rencanaPerbaikan);
              }
              if (w.worksheet6) {
                if (w.worksheet6.logs) setLogsW6(w.worksheet6.logs);
                if (w.worksheet6.observasi !== undefined) setObservasiW6(w.worksheet6.observasi);
                if (w.worksheet6.dataBukti !== undefined) setDataBuktiW6(w.worksheet6.dataBukti);
                if (w.worksheet6.trenPemahaman !== undefined) setTrenPemahamanW6(w.worksheet6.trenPemahaman);
                if (w.worksheet6.trenSikap !== undefined) setTrenSikapW6(w.worksheet6.trenSikap);
                if (w.worksheet6.polaPalingTerlihat !== undefined) setPolaPalingTerlihatW6(w.worksheet6.polaPalingTerlihat);
              }
              if (w.worksheet7) {
                if (w.worksheet7.ringkasanSop !== undefined) setRingkasanSopW7(w.worksheet7.ringkasanSop);
                if (w.worksheet7.ringkasanPemahaman !== undefined) setRingkasanPemahamanW7(w.worksheet7.ringkasanPemahaman);
                if (w.worksheet7.ringkasanSikap !== undefined) setRingkasanSikapW7(w.worksheet7.ringkasanSikap);
                if (w.worksheet7.ringkasanEfektivitas !== undefined) setRingkasanEfektivitasW7(w.worksheet7.ringkasanEfektivitas);
                if (w.worksheet7.keputusan !== undefined) setKeputusanW7(w.worksheet7.keputusan);
                if (w.worksheet7.catatanPenutup !== undefined) setCatatanPenutupW7(w.worksheet7.catatanPenutup);
              }
            }
          }
        } catch (error) {
          console.error("Gagal memuat data dari Firestore:", error);
        }
      } else {
        const saved = localStorage.getItem('les_evaluator_history');
        if (saved) {
          try {
            setHistory(JSON.parse(saved));
          } catch (e) {
            console.error("Failed to parse historical logs", e);
          }
        }
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const saveUserDataToFirestore = async (overrideData?: {
    newHistory?: HistoricalRecord[];
    newChildName?: string;
  }) => {
    if (!auth.currentUser) return;
    setCloudSaving(true);
    setCloudSavedSuccess(false);

    try {
      const docRef = doc(db, 'users', auth.currentUser.uid);
      
      const currentWorksheets = {
        worksheet1: {
          refleksi,
          observasiRumah,
          indikator,
          pola
        },
        worksheet2: {
          caraBelajar,
          materiKesulitan,
          pola: polaW2
        },
        worksheet3: {
          auditLingkungan: auditW3,
          situasiRumah,
          pola: polaW3
        },
        worksheet4: {
          mentalModel: mentalW4,
          refleksiPerubahan: refleksiW4
        },
        worksheet5: {
          rutinitas: rutinitasW5,
          konsistensi: konsistensiW5,
          bagianPalingSulit: bagianPalingSulitW5,
          rencanaPerbaikan: rencanaPerbaikanW5
        },
        worksheet6: {
          logs: logsW6,
          observasi: observasiW6,
          dataBukti: dataBuktiW6,
          trenPemahaman: trenPemahamanW6,
          trenSikap: trenSikapW6,
          polaPalingTerlihat: polaPalingTerlihatW6
        },
        worksheet7: {
          ringkasanSop: ringkasanSopW7,
          ringkasanPemahaman: ringkasanPemahamanW7,
          ringkasanSikap: ringkasanSikapW7,
          ringkasanEfektivitas: ringkasanEfektivitasW7,
          keputusan: keputusanW7,
          catatanPenutup: catatanPenutupW7
        }
      };

      const finalChildName = overrideData?.newChildName !== undefined ? overrideData.newChildName : childName;
      const finalHistory = overrideData?.newHistory !== undefined ? overrideData.newHistory : history;

      await setDoc(docRef, {
        userId: auth.currentUser.uid,
        childName: finalChildName,
        worksheets: currentWorksheets,
        history: finalHistory,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setCloudSavedSuccess(true);
      setTimeout(() => setCloudSavedSuccess(false), 3000);
    } catch (error) {
      console.error("Gagal sinkronisasi data ke Firebase:", error);
      handleFirestoreError(error, OperationType.WRITE, `users/${auth.currentUser.uid}`);
    } finally {
      setCloudSaving(false);
    }
  };

  // Save historical analysis
  const saveToHistory = async (newRecord: HistoricalRecord) => {
    const updated = [newRecord, ...history].slice(0, 5); // Keep last 5 records
    setHistory(updated);
    localStorage.setItem('les_evaluator_history', JSON.stringify(updated));
    if (auth.currentUser) {
      await saveUserDataToFirestore({ newHistory: updated });
    }
  };

  const clearHistory = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat diagnosis?')) {
      setHistory([]);
      localStorage.removeItem('les_evaluator_history');
      if (auth.currentUser) {
        await saveUserDataToFirestore({ newHistory: [] });
      }
    }
  };

   const handleGeneralSubmit = async (type: 'worksheet1' | 'worksheet2' | 'worksheet3' | 'worksheet4' | 'worksheet5' | 'worksheet6' | 'worksheet7', payload: any) => {
    setIsLoading(true);
    setApiError('');
    setAnalysisResult(null);
    setActiveResultType(type);

    try {
      // Simulate processing delay for transition animation smoothness
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const analyzedJson = evaluateWorksheet(type, payload.childName || childName, payload);
      setAnalysisResult(analyzedJson);
      
      await saveToHistory({
        worksheetType: type,
        data: payload,
        result: analyzedJson
      });

      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('analysis-result-view')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err: any) {
      console.error(err);
      setApiError(err.message || 'Gagal memproses analisis evaluasi. Silakan lengkapi formulir terlebih dahulu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorksheet1Submit = async (data: WorksheetData) => {
    await handleGeneralSubmit('worksheet1', data);
  };

  const handleWorksheet2Submit = async (data: Worksheet2Data) => {
    await handleGeneralSubmit('worksheet2', data);
  };

  const handleWorksheet3Submit = async (data: Worksheet3Data) => {
    await handleGeneralSubmit('worksheet3', data);
  };

  const handleWorksheet4Submit = async (data: Worksheet4Data) => {
    await handleGeneralSubmit('worksheet4', data);
  };

  const handleWorksheet5Submit = async (data: Worksheet5Data) => {
    await handleGeneralSubmit('worksheet5', data);
  };

  const handleWorksheet6Submit = async (data: Worksheet6Data) => {
    await handleGeneralSubmit('worksheet6', data);
  };

  const handleWorksheet7Submit = async (data: Worksheet7Data) => {
    await handleGeneralSubmit('worksheet7', data);
  };

  const handleResetForm = () => {
    setChildName('');
    setRefleksi(DEFAULT_REFLEKSI);
    setObservasiRumah('');
    setIndikator(DEFAULT_INDIKATOR);
    setPola('belum_yakin');
    
    setCaraBelajar(DEFAULT_W2_CARA_BELAJAR);
    setMateriKesulitan('');
    setPolaW2(DEFAULT_W2_POLA);

    setAuditW3(DEFAULT_W3_AUDIT);
    setSituasiRumah('');
    setPolaW3(DEFAULT_W3_POLA);

    setMentalW4(DEFAULT_W4_MENTAL);
    setRefleksiW4('');

    setRutinitasW5(DEFAULT_W5_RUTINITAS);
    setKonsistensiW5(null);
    setBagianPalingSulitW5('');
    setRencanaPerbaikanW5('');

    setLogsW6(DEFAULT_W6_LOGS);
    setObservasiW6('');
    setDataBuktiW6('');
    setTrenPemahamanW6(null);
    setTrenSikapW6(null);
    setPolaPalingTerlihatW6('');

    setRingkasanSopW7('');
    setRingkasanPemahamanW7('');
    setRingkasanSikapW7('');
    setRingkasanEfektivitasW7('');
    setKeputusanW7(null);
    setCatatanPenutupW7('');

    setAnalysisResult(null);
    setApiError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadFromHistory = (record: HistoricalRecord) => {
    setChildName(record.data.childName);
    setActiveTab(record.worksheetType);
    setActiveResultType(record.worksheetType);
    
    if (record.worksheetType === 'worksheet2') {
      setCaraBelajar(record.data.caraBelajar);
      setMateriKesulitan(record.data.materiKesulitan);
      setPolaW2(record.data.pola);
    } else if (record.worksheetType === 'worksheet3') {
      setAuditW3(record.data.auditLingkungan);
      setSituasiRumah(record.data.situasiRumah);
      setPolaW3(record.data.pola);
    } else if (record.worksheetType === 'worksheet4') {
      setMentalW4(record.data.mentalModel);
      setRefleksiW4(record.data.refleksiPerubahan);
    } else if (record.worksheetType === 'worksheet5') {
      setRutinitasW5(record.data.rutinitas);
      setKonsistensiW5(record.data.konsistensi);
      setBagianPalingSulitW5(record.data.bagianPalingSulit);
      setRencanaPerbaikanW5(record.data.rencanaPerbaikan);
    } else if (record.worksheetType === 'worksheet6') {
      setLogsW6(record.data.logs);
      setObservasiW6(record.data.observasi);
      setDataBuktiW6(record.data.dataBukti);
      setTrenPemahamanW6(record.data.trenPemahaman);
      setTrenSikapW6(record.data.trenSikap);
      setPolaPalingTerlihatW6(record.data.polaPalingTerlihat);
    } else if (record.worksheetType === 'worksheet7') {
      setRingkasanSopW7(record.data.ringkasanSop);
      setRingkasanPemahamanW7(record.data.ringkasanPemahaman);
      setRingkasanSikapW7(record.data.ringkasanSikap);
      setRingkasanEfektivitasW7(record.data.ringkasanEfektivitas);
      setKeputusanW7(record.data.keputusan);
      setCatatanPenutupW7(record.data.catatanPenutup);
    } else {
      setRefleksi(record.data.refleksi);
      setObservasiRumah(record.data.observasiRumah);
      setIndikator(record.data.indikator);
      setPola(record.data.pola);
    }
    setAnalysisResult(record.result);
    setApiError('');
    setTimeout(() => {
      document.getElementById('analysis-result-view')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      {/* Top Brand Header */}
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-950 text-white rounded-2xl shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-display font-black tracking-tight text-lg text-blue-950">
                  LES EVALUATOR WORKBOOK
                </span>
                <span className="bg-blue-100 text-blue-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Smart Learning System
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Evaluasi Efektivitas Les Anak & Sinkronisasi Pembelajaran Berbasis AI
              </p>
            </div>
          </div>
          
          {/* Authentication & Sync status bar */}
          <div className="flex flex-wrap items-center gap-3 font-medium">
            {authLoading ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Mempersiapkan Database...</span>
              </div>
            ) : user ? (
              <div className="flex flex-wrap items-center gap-3">
                {/* Cloud Saving Indicator */}
                <div className={`text-xs flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-300 ${
                  cloudSavedSuccess 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}>
                  {cloudSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                      <span>Mensinkronisasi...</span>
                    </>
                  ) : cloudSavedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 check-success text-emerald-600" />
                      <span>Data Tersimpan ke Cloud!</span>
                    </>
                  ) : (
                    <>
                      <Cloud className="w-3.5 h-3.5 text-slate-400" />
                      <span>Tersinkronisasi</span>
                    </>
                  )}
                </div>

                {/* Manual Save Button */}
                <button
                  onClick={() => saveUserDataToFirestore()}
                  disabled={cloudSaving}
                  className="bg-blue-950 hover:bg-blue-900 disabled:opacity-50 text-white text-xs px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm cursor-pointer"
                  title="Simpan lembar kerja yang sedang diisi ke cloud"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Progres</span>
                </button>

                {/* User avatar and profile name */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'User'} 
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full border border-slate-200 shadow-inner"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{user.displayName || 'Akun Pengguna'}</p>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{user.email}</p>
                  </div>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={logoutUser}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition active:scale-95 cursor-pointer"
                  title="Keluar Akun"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="hidden lg:inline text-xs text-slate-400">Database offline. Hubungkan akun:</span>
                <button
                  onClick={loginWithGoogle}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition hover:shadow-sm active:scale-95 cursor-pointer"
                >
                  {/* Google Custom Minimalist Icon */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  <span>Mulai Hubungkan Database Pribadi</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-10">
        
        {/* Intro Hero Sheet */}
        <section className="bg-blue-950 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl shadow-blue-950/20">
          <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-blue-900/30 blur-3xl -mr-20 -mt-20 pointer-events-none" />
          
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-900/60 text-blue-300 font-extrabold text-[11px] px-3.5 py-1 rounded-full uppercase tracking-widest border border-blue-800/50">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              SISTEM EVALUASI DIGITAL 2.0 (INDONESIA)
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight leading-tight">
              Audit Kualitas Pembelajaran Anak Anda Secara Menyeluruh
            </h1>
            <div className="space-y-4">
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-medium">
                Gunakan perangkat analisis <strong className="text-white">Les Evaluator Workbook</strong> ini untuk mengoptimalkan sistem belajar anak Anda secara objektif dan terstruktur:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 text-xs sm:text-sm text-slate-200 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5 font-bold">✓</span>
                  <span><strong className="text-white">Worksheet 1:</strong> Menghindari jebakan rutinitas harian tanpa peningkatan kognitif batin anak.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5 font-bold">✓</span>
                  <span><strong className="text-white">Worksheet 2:</strong> Memastikan sinkronisasi materi sekolah & bimbingan les agar sejalan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5 font-bold">✓</span>
                  <span><strong className="text-white">Worksheet 3:</strong> Mengevaluasi sistem & iklim belajar yang suportif di rumah.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5 font-bold">✓</span>
                  <span><strong className="text-white">Worksheet 4:</strong> Meluruskan mental model kesadaran peran bimbingan belajar luar.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5 font-bold">✓</span>
                  <span><strong className="text-white">Worksheet 5:</strong> Mengevaluasi konsistensi SOP paska-les agar ingatan anak bertahan lama.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5 font-bold">✓</span>
                  <span><strong className="text-white">Worksheet 6:</strong> Mengaudit 14 hari konsistensi & pola kelelahan belajar berkala.</span>
                </li>
                <li className="flex items-start gap-2 md:col-span-2">
                  <span className="text-yellow-400 mt-0.5 font-bold">✓</span>
                  <span><strong className="text-white">Worksheet 7:</strong> Mengambil keputusan strategis akhir demi masa depan belajar anak secara bijak.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {!user && !authLoading && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-xl mt-0.5 animate-bounce">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Mode Tamu Aktif (Database Belum Terhubung)</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Pekerjaan Anda saat ini hanya disimpan sementara di browser Anda. Hubungkan akun Google Anda secara gratis untuk membuat database pribadi Firebase Anda sendiri, menyinkronkan data antar-perangkat secara instan, dan melindunginya dari risiko terhapus secara sengaja.
                </p>
              </div>
            </div>
            <button
              onClick={loginWithGoogle}
              className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white text-xs font-black px-5 py-3 rounded-xl transition duration-200 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shadow-sm shadow-amber-600/10"
            >
              <LogIn className="w-4 h-4" />
              <span>Hubungkan Database Sekarang (Gratis)</span>
            </button>
          </motion.div>
        )}

        {/* Worksheet Selector Tabs */}
        <div className="flex flex-col sm:flex-row bg-slate-200/60 p-1.5 rounded-2xl w-full max-w-5xl mx-auto print:hidden border border-slate-200 gap-1">
          <button
            onClick={() => {
              setActiveTab('worksheet1');
              setAnalysisResult(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-extrabold rounded-xl transition duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'worksheet1'
                ? 'bg-blue-950 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-850 hover:bg-slate-100/55'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Worksheet 1</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('worksheet2');
              setAnalysisResult(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-extrabold rounded-xl transition duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'worksheet2'
                ? 'bg-blue-950 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-850 hover:bg-slate-100/55'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Worksheet 2</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('worksheet3');
              setAnalysisResult(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-extrabold rounded-xl transition duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'worksheet3'
                ? 'bg-blue-950 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-850 hover:bg-slate-100/55'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Worksheet 3</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('worksheet4');
              setAnalysisResult(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-extrabold rounded-xl transition duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'worksheet4'
                ? 'bg-blue-950 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-850 hover:bg-slate-100/55'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Worksheet 4</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('worksheet5');
              setAnalysisResult(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-extrabold rounded-xl transition duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'worksheet5'
                ? 'bg-blue-950 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-850 hover:bg-slate-100/55'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Worksheet 5</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('worksheet6');
              setAnalysisResult(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-extrabold rounded-xl transition duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'worksheet6'
                ? 'bg-blue-950 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-850 hover:bg-slate-100/55'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Worksheet 6</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('worksheet7');
              setAnalysisResult(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-extrabold rounded-xl transition duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'worksheet7'
                ? 'bg-blue-950 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-850 hover:bg-slate-100/55'
            }`}
          >
            <Award className="w-4 h-4 text-yellow-500" />
            <span>Worksheet 7</span>
          </button>
        </div>

        {/* Dual pane section: Left (Input Form), Right (Balance Indicator Preview & History) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Forms) */}
          <div className="lg:col-span-8 space-y-8 print:col-span-12">
            {activeTab === 'worksheet1' ? (
              <WorksheetForm 
                onSubmit={handleWorksheet1Submit}
                isLoading={isLoading}
                refleksi={refleksi}
                setRefleksi={setRefleksi}
                indikator={indikator}
                setIndikator={setIndikator}
                pola={pola}
                setPola={setPola}
                observasiRumah={observasiRumah}
                setObservasiRumah={setObservasiRumah}
                childName={childName}
                setChildName={setChildName}
              />
            ) : activeTab === 'worksheet2' ? (
              <Worksheet2Form
                onSubmit={handleWorksheet2Submit}
                isLoading={isLoading}
                caraBelajar={caraBelajar}
                setCaraBelajar={setCaraBelajar}
                pola={polaW2}
                setPola={setPolaW2}
                materiKesulitan={materiKesulitan}
                setMateriKesulitan={setMateriKesulitan}
                childName={childName}
                setChildName={setChildName}
              />
            ) : activeTab === 'worksheet3' ? (
              <Worksheet3Form
                onSubmit={handleWorksheet3Submit}
                isLoading={isLoading}
                auditLingkungan={auditW3}
                setAuditLingkungan={setAuditW3}
                pola={polaW3}
                setPola={setPolaW3}
                situasiRumah={situasiRumah}
                setSituasiRumah={setSituasiRumah}
                childName={childName}
                setChildName={setChildName}
              />
            ) : activeTab === 'worksheet4' ? (
              <Worksheet4Form
                onSubmit={handleWorksheet4Submit}
                isLoading={isLoading}
                mentalModel={mentalW4}
                setMentalModel={setMentalW4}
                refleksiPerubahan={refleksiW4}
                setRefleksiPerubahan={setRefleksiW4}
                childName={childName}
                setChildName={setChildName}
              />
            ) : activeTab === 'worksheet5' ? (
              <Worksheet5Form
                onSubmit={handleWorksheet5Submit}
                isLoading={isLoading}
                rutinitas={rutinitasW5}
                setRutinitas={setRutinitasW5}
                konsistensi={konsistensiW5}
                setKonsistensi={setKonsistensiW5}
                bagianPalingSulit={bagianPalingSulitW5}
                setBagianPalingSulit={setBagianPalingSulitW5}
                rencanaPerbaikan={rencanaPerbaikanW5}
                setRencanaPerbaikan={setRencanaPerbaikanW5}
                childName={childName}
                setChildName={setChildName}
              />
            ) : activeTab === 'worksheet6' ? (
              <Worksheet6Form
                onSubmit={handleWorksheet6Submit}
                isLoading={isLoading}
                logs={logsW6}
                setLogs={setLogsW6}
                observasi={observasiW6}
                setObservasi={setObservasiW6}
                dataBukti={dataBuktiW6}
                setDataBukti={setDataBuktiW6}
                trenPemahaman={trenPemahamanW6}
                setTrenPemahaman={setTrenPemahamanW6}
                trenSikap={trenSikapW6}
                setTrenSikap={setTrenSikapW6}
                polaPalingTerlihat={polaPalingTerlihatW6}
                setPolaPalingTerlihat={setPolaPalingTerlihatW6}
                childName={childName}
                setChildName={setChildName}
              />
            ) : (
              <Worksheet7Form
                onSubmit={handleWorksheet7Submit}
                isLoading={isLoading}
                ringkasanSop={ringkasanSopW7}
                setRingkasanSop={setRingkasanSopW7}
                ringkasanPemahaman={ringkasanPemahamanW7}
                setRingkasanPemahaman={setRingkasanPemahamanW7}
                ringkasanSikap={ringkasanSikapW7}
                setRingkasanSikap={setRingkasanSikapW7}
                ringkasanEfektivitas={ringkasanEfektivitasW7}
                setRingkasanEfektivitas={setRingkasanEfektivitasW7}
                keputusan={keputusanW7}
                setKeputusan={setKeputusanW7}
                catatanPenutup={catatanPenutupW7}
                setCatatanPenutup={setCatatanPenutupW7}
                childName={childName}
                setChildName={setChildName}

                // Pass the interconnected states
                refleksiW1={refleksi}
                indikatorW1={indikator}
                polaW1={pola}
                caraBelajarW2={caraBelajar}
                materiKesulitanW2={materiKesulitan}
                polaW2={polaW2}
                auditW3={auditW3}
                situasiRumahW3={situasiRumah}
                polaW3={polaW3}
                mentalW4={mentalW4}
                refleksiW4={refleksiW4}
                rutinitasW5={rutinitasW5}
                konsistensiW5={konsistensiW5}
                bagianPalingSulitW5={bagianPalingSulitW5}
                rencanaPerbaikanW5={rencanaPerbaikanW5}
                logsW6={logsW6}
                observasiW6={observasiW6}
                trenPemahamanW6={trenPemahamanW6}
                trenSikapW6={trenSikapW6}
                polaPalingTerlihatW6={polaPalingTerlihatW6}
              />
            )}
          </div>

          {/* Right Column (Balance preview & helper guide) */}
          <div className="lg:col-span-4 space-y-8 sticky top-24 print:hidden">
            {/* dynamic interactive indicator balance scale */}
            <BalanceScale 
              worksheetType={activeTab}
              refleksi={refleksi}
              indikator={indikator}
              pola={pola}
              caraBelajar={caraBelajar}
              polaW2={polaW2}
              auditW3={auditW3}
              polaW3={polaW3}
              mentalModelW4={mentalW4}
              rutinitasW5={rutinitasW5}
              konsistensiW5={konsistensiW5}
              logsW6={logsW6}
              trenPemahamanW6={trenPemahamanW6}
              trenSikapW6={trenSikapW6}
              keputusanW7={keputusanW7}
            />

            {/* Quick Helper Guide Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-3.5">
              <div className="flex items-center gap-2 text-slate-800">
                <BookOpen className="w-5 h-5 text-blue-950" />
                <h4 className="font-bold text-sm">
                  {activeTab === 'worksheet1' ? 'Pedoman Lembar Kerja 1' : activeTab === 'worksheet2' ? 'Pedoman Lembar Kerja 2' : activeTab === 'worksheet3' ? 'Pedoman Lembar Kerja 3' : activeTab === 'worksheet4' ? 'Pedoman Lembar Kerja 4' : activeTab === 'worksheet5' ? 'Pedoman Lembar Kerja 5' : activeTab === 'worksheet6' ? 'Pedoman Lembar Kerja 6' : 'Pedoman Lembar Kerja 7'}
                </h4>
              </div>
              <ul className="text-xs text-slate-500 space-y-2.5 leading-relaxed">
                {activeTab === 'worksheet1' ? (
                  <>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">1.</span>
                      <span>Isi nama anak Anda agar saran yang dihasilkan AI disesuaikan secara personal.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">2.</span>
                      <span>Jawab 5 pertanyaan refleksi yang menggambarkan pola pengasuhan belajar Anda saat ini.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">3.</span>
                      <span>Tulis catatan observasi harian atau gunakan tombol preset kami untuk mempercepat pemuatan data.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">4.</span>
                      <span>Evaluasi indikator keberhasilan. Catat: pilar "Anak bisa menjelaskan ulang" adalah kunci pemahaman mendalam.</span>
                    </li>
                  </>
                ) : activeTab === 'worksheet2' ? (
                  <>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">1.</span>
                      <span>Tulis nama lengkap buah hati Anda pada formulir Worksheet 2 di samping.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">2.</span>
                      <span>Tentukan skala Ya, Sebagian, atau Tidak untuk 4 indikator pedagogis cara belajar mandiri anak.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">3.</span>
                      <span>Tulis materi pelajaran spesifik yang sering membuahkan kemacetan atau klik preset cepat kami.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">4.</span>
                      <span>Centang tipe sinkronisasi belajar. Temukan rekomendasi taktis agar tidak mengandalkan metode hafalan sempit.</span>
                    </li>
                  </>
                ) : activeTab === 'worksheet3' ? (
                  <>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">1.</span>
                      <span>Tentukan skala Ya atau Tidak untuk 5 pertanyaan audit lingkungan kenyamanan rumah.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">2.</span>
                      <span>Catat / pilih situasi harian di rumah yang berpotensi menghalangi penyerapan ilmu les.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">3.</span>
                      <span>Tandai pola sistem rumah (Aktif, Pasif, atau Tekanan). Rekomendasi khusus akan disesuaikan instan.</span>
                    </li>
                  </>
                ) : activeTab === 'worksheet4' ? (
                  <>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">1.</span>
                      <span>Ketahui mental model Anda dengan mengidentifikasi jawaban Ya atau Tidak pada 4 butir audit mental model.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">2.</span>
                      <span>Pilih komitmen baru atau ungkapkan refleksi orisinal Anda mengenai pergeseran paradigma harian les anak Anda.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">3.</span>
                      <span>Gunakan AI untuk melahirkan nasehat mindful parenting terintegrasi mengenai letak rumah sebagai raja sistem belajar.</span>
                    </li>
                  </>
                ) : activeTab === 'worksheet5' ? (
                  <>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">1.</span>
                      <span>Audit 5 elemen rutinitas pasca-les yang dijalankan anak Anda rill di rumah hari ini.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">2.</span>
                      <span>Tentukan peringkat konsistensi pengawalan SOP pulang les (Sangat, Cukup, Kurang, atau Tidak).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">3.</span>
                      <span>Tuliskan bagian tersulit rutinitas paska-les dan rancang rencana perbaikan konstruktif untuk memulihkan kebugaran mental anak.</span>
                    </li>
                  </>
                ) : activeTab === 'worksheet6' ? (
                  <>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">1.</span>
                      <span>Log harian materi les, pemahaman, dan sikap belajar anak selama 14 hari penuh.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">2.</span>
                      <span>Tulis kesimpulan observasi utama dan tunjukkan bukti pendukung dari aktivitas belajar anak.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">3.</span>
                      <span>Gunakan fitur auto-tren untuk mengukur kestabilan memori dan tingkat kelelahan anak.</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">1.</span>
                      <span>Tuliskan ringkasan audit belajar meliputi SOP rumah, pemahaman anak, sikap, dan efektivitas les.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">2.</span>
                      <span>Pilih salah satu opsi keputusan strategis (Lanjut, Ganti Strategi, atau Stop Les) berdasarkan data indikator penyeimbang.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-950 font-bold">3.</span>
                      <span>Tuliskan Rencana Implementasi Keputusan Anda dan kirimkan ke AI untuk memvalidasi langkah strategi makro Anda.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* LOADING SCREEN BACKDROP */}
        {isLoading && (
          <div className="bg-slate-900/15 backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 border border-slate-100 animate-fade-in">
              <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-blue-950 border-t-transparent rounded-full animate-spin" />
                <GraduationCap className="w-8 h-8 text-blue-950 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-slate-800 text-lg">Membangun Diagnosis AI...</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {activeTab === 'worksheet1' 
                    ? 'AI sedang mengevaluasi keseimbangan porsi aktivitas les vs pembentukan pemahaman mandiri di rumah...'
                    : activeTab === 'worksheet2'
                    ? 'AI sedang menganalisis keselarasan silabus, tantangan materi pelajaran spesifik, serta memformat langkah-langkah sinkronisasi konseptual...'
                    : activeTab === 'worksheet3'
                    ? 'AI sedang menganalisis kenyamanan suasana rumah, pemicu emosi belajar, dan strategi asuh optimal yang mendukung hasil les...'
                    : activeTab === 'worksheet4'
                    ? 'AI sedang mengevaluasi mental model, paradigma asuh, serta meluruskan peran bimbingan belajar dengan perspektif positif...'
                    : activeTab === 'worksheet5'
                    ? 'AI sedang menganalisis konsistensi SOP paska-les, rintangan emosi jenuh harian, serta merancang peta remedial terstruktur...'
                    : 'AI sedang mendiagnosis audit berkala 14 hari, merangkum pola belajar kumulatif, serta merekomendasikan peta perbaikan energi kognitif...'}
                </p>
              </div>
              <div className="bg-blue-50 text-blue-700 rounded-xl p-3 text-xs leading-relaxed font-semibold">
                {activeTab === 'worksheet1'
                  ? '"Tujuan utama les bukanlah membuat anak sibuk, melainkan melatih anak mandiri berpikir."'
                  : activeTab === 'worksheet2'
                  ? '"Pastikan materi les selaras dengan kebutuhan anak dan cara belajarnya."'
                  : activeTab === 'worksheet3'
                  ? '"Rumah yang mendukung akan membuat hasil les lebih kuat, bermakna, dan bertahan lebih lama."'
                  : activeTab === 'worksheet4'
                  ? '"Bimbel adalah alat bantu. Sistem belajar yang kuat selalu dibangun di rumah."'
                  : activeTab === 'worksheet5'
                  ? '"SOP pasca-les yang teratur, konsisten, dan memulihkan energi emosional menjadi kunci utama agar daya sarap otak anak tetap prima."'
                  : '"Data kecil yang dikumpulkan konsisten selama 14 hari mengekspos rintangan mental yang selama ini tidak terlihat."'}
              </div>
            </div>
          </div>
        )}

        {/* ERROR BOX */}
        {apiError && (
          <div className="bg-red-50 border border-red-200/60 rounded-2xl p-5 text-red-700 flex items-start gap-3.5 shadow-sm">
            <AlertCircle className="w-5 h-5 mt-0.5 text-red-500 flex-shrink-0" />
            <div>
              <h5 className="font-bold text-sm">Gagal Menghubungi Analis AI</h5>
              <p className="text-xs text-red-600 leading-relaxed mt-1">{apiError}</p>
              <button
                onClick={() => handleResetForm()}
                className="mt-3 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                Isi Ulang Form
              </button>
            </div>
          </div>
        )}

        {/* DIAGNOSTIC OUTPUT CONTAINER */}
        <AnimatePresence>
          {analysisResult && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              id="analysis-result-view"
              className="scroll-mt-24"
            >
              <AnalysisResultView 
                analysis={analysisResult}
                worksheetType={activeResultType}
                worksheetData={
                  activeResultType === 'worksheet2' 
                    ? {
                        childName,
                        tanggal: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
                      }
                    : activeResultType === 'worksheet3'
                    ? {
                        childName,
                        tanggal: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
                        auditLingkungan: auditW3,
                        situasiRumah,
                        pola: polaW3
                      }
                    : activeResultType === 'worksheet4'
                    ? {
                        childName,
                        tanggal: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
                        mentalModel: mentalW4,
                        refleksiPerubahan: refleksiW4
                      }
                    : activeResultType === 'worksheet5'
                    ? {
                        childName,
                        tanggal: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
                        rutinitas: rutinitasW5,
                        konsistensi: konsistensiW5,
                        bagianPalingSulit: bagianPalingSulitW5,
                        rencanaPerbaikan: rencanaPerbaikanW5
                      }
                    : activeResultType === 'worksheet6'
                    ? {
                        childName,
                        tanggal: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
                        logs: logsW6,
                        observasi: observasiW6,
                        dataBukti: dataBuktiW6,
                        trenPemahaman: trenPemahamanW6,
                        trenSikap: trenSikapW6,
                        polaPalingTerlihat: polaPalingTerlihatW6
                      }
                    : activeResultType === 'worksheet7'
                    ? {
                        childName,
                        tanggal: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
                        ringkasanSop: ringkasanSopW7,
                        ringkasanPemahaman: ringkasanPemahamanW7,
                        ringkasanSikap: ringkasanSikapW7,
                        ringkasanEfektivitas: ringkasanEfektivitasW7,
                        keputusan: keputusanW7,
                        catatanPenutup: catatanPenutupW7
                      }
                    : {
                        id: Date.now().toString(),
                        tanggal: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
                        childName,
                        refleksi,
                        observasiRumah,
                        indikator,
                        pola
                      }
                }
                onReset={handleResetForm}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* HISTORIK EVALUASI TERBARU */}
        {history.length > 0 && (
          <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 print:hidden">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-slate-400" />
                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                  Riwayat Audit & Diagnosis Terakhir (Maksimal 5)
                </h4>
              </div>
              <button
                onClick={clearHistory}
                className="text-slate-400 hover:text-red-500 transition text-xs flex items-center gap-1 font-semibold border-0 bg-transparent cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Bersihkan Riwayat
              </button>
            </div>

            <div className="divide-y divide-slate-50">
              {history.map((record, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3.5 first:pt-1 last:pb-1 group hover:bg-slate-50/50 rounded-lg px-2 transition-colors duration-150"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-sm text-slate-700 flex-wrap">
                      <span>{record.data.childName}</span>
                      <span className="bg-blue-50 text-blue-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-blue-100 uppercase">
                        Worksheet {record.worksheetType === 'worksheet7' ? '7' : record.worksheetType === 'worksheet6' ? '6' : record.worksheetType === 'worksheet5' ? '5' : record.worksheetType === 'worksheet4' ? '4' : record.worksheetType === 'worksheet3' ? '3' : record.worksheetType === 'worksheet2' ? '2' : '1'}
                      </span>
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-extrabold ${
                        record.result.category.toLowerCase().includes('paham') || record.result.category.toLowerCase().includes('mandiri') || record.result.category.toLowerCase().includes('selaras') || record.result.category.toLowerCase().includes('konsisten') || record.result.category.toLowerCase().includes('stabil') || record.result.category.toLowerCase().includes('lanjut') || record.result.category.toLowerCase().includes('strategi')
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {record.result.category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
                      <span>Tanggal: {record.data.tanggal || 'Hari ini'}</span>
                      <span>Skor Audit: <strong>{record.result.efficiencyScore}/100</strong></span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleLoadFromHistory(record)}
                    className="mt-2.5 sm:mt-0 text-xs font-bold text-blue-900 group-hover:text-blue-700 flex items-center gap-1 hover:underline bg-transparent border-0 cursor-pointer"
                  >
                    Buka Laporan
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Footer Banner */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-16 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            Didesain untuk <strong>Smart Learning System (SLS) Indonesia</strong>
          </p>
          <div className="flex gap-4">
            <span>Metodologi: <strong>Les Evaluator Workbook</strong></span>
            <span>AI Model: <strong>Gemini 3.5 Flash</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
