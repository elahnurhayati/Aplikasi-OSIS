import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  SchoolProfile,
  PengurusOsis,
  ProgramKerja,
  TransaksiKas,
  ArsipDokumen,
  RapatNotulensi,
  AspirasiSiswa,
  InventarisBarang,
  PeminjamanBarang,
  JadwalPiket,
  BukuTamu,
  Ekstrakurikuler,
} from '../types';
import {
  INITIAL_SCHOOL_PROFILE,
  INITIAL_PENGURUS,
  INITIAL_PROKER,
  INITIAL_KAS,
  INITIAL_DOKUMEN,
  INITIAL_RAPAT,
  INITIAL_ASPIRASI,
  INITIAL_INVENTARIS,
  INITIAL_PEMINJAMAN,
  INITIAL_PIKET,
  INITIAL_BUKU_TAMU,
  INITIAL_EKSKUL,
} from '../data/initialData';

const STORAGE_KEY = 'osis_360_management_data_v2';
const PWD_STORAGE_KEY = 'osis_admin_pwd_v1';

interface OsisContextType {
  schoolProfile: SchoolProfile;
  setSchoolProfile: React.Dispatch<React.SetStateAction<SchoolProfile>>;
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;

  pengurus: PengurusOsis[];
  addPengurus: (data: Omit<PengurusOsis, 'id'>) => void;
  updatePengurus: (id: string, data: Partial<PengurusOsis>) => void;
  deletePengurus: (id: string) => void;

  proker: ProgramKerja[];
  addProker: (data: Omit<ProgramKerja, 'id'>) => void;
  updateProker: (id: string, data: Partial<ProgramKerja>) => void;
  deleteProker: (id: string) => void;

  kas: TransaksiKas[];
  addKas: (data: Omit<TransaksiKas, 'id'>) => void;
  deleteKas: (id: string) => void;

  dokumen: ArsipDokumen[];
  addDokumen: (doc: Omit<ArsipDokumen, 'id'>) => void;
  deleteDokumen: (id: string) => void;

  rapat: RapatNotulensi[];
  addRapat: (data: Omit<RapatNotulensi, 'id'>) => void;
  updateRapat: (id: string, data: Partial<RapatNotulensi>) => void;
  deleteRapat: (id: string) => void;

  aspirasi: AspirasiSiswa[];
  addAspirasi: (data: Omit<AspirasiSiswa, 'id' | 'tanggal' | 'status'>) => void;
  updateAspirasiStatus: (id: string, status: AspirasiSiswa['status'], respon?: string, penanggap?: string) => void;
  deleteAspirasi: (id: string) => void;

  // Inventaris & Logistik
  inventaris: InventarisBarang[];
  addInventaris: (item: Omit<InventarisBarang, 'id'>) => void;
  updateInventaris: (id: string, data: Partial<InventarisBarang>) => void;
  deleteInventaris: (id: string) => void;

  // Peminjaman Sarana
  peminjaman: PeminjamanBarang[];
  addPeminjaman: (data: Omit<PeminjamanBarang, 'id' | 'kodePinjam'>) => void;
  updatePeminjamanStatus: (id: string, status: PeminjamanBarang['status'], tglKembaliNyata?: string) => void;
  deletePeminjaman: (id: string) => void;

  // Ekstrakurikuler
  ekskul: Ekstrakurikuler[];
  addEkskul: (data: Omit<Ekstrakurikuler, 'id'>) => void;
  updateEkskul: (id: string, data: Partial<Ekstrakurikuler>) => void;
  deleteEkskul: (id: string) => void;

  // Jadwal Piket & Buku Tamu
  piket: JadwalPiket[];
  updatePiket: (id: string, data: Partial<JadwalPiket>) => void;
  bukuTamu: BukuTamu[];
  addBukuTamu: (data: Omit<BukuTamu, 'id' | 'tanggal' | 'waktu'>) => void;
  deleteBukuTamu: (id: string) => void;

  // Global utilities
  exportBackupJson: () => void;
  importBackupJson: (file: File) => Promise<boolean>;
  resetToDefault: () => void;

  // Authentication & Security
  isAuthenticated: boolean;
  adminUsername: string;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  changePassword: (oldPass: string, newPass: string) => { success: boolean; message: string };

  // Computed metrics
  totalKasMasuk: number;
  totalKasKeluar: number;
  saldoKas: number;
  persentaseProkerSelesai: number;
}

const OsisContext = createContext<OsisContextType | undefined>(undefined);

export const OsisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(INITIAL_SCHOOL_PROFILE);
  const [pengurus, setPengurus] = useState<PengurusOsis[]>(INITIAL_PENGURUS);
  const [proker, setProker] = useState<ProgramKerja[]>(INITIAL_PROKER);
  const [kas, setKas] = useState<TransaksiKas[]>(INITIAL_KAS);
  const [dokumen, setDokumen] = useState<ArsipDokumen[]>(INITIAL_DOKUMEN);
  const [rapat, setRapat] = useState<RapatNotulensi[]>(INITIAL_RAPAT);
  const [aspirasi, setAspirasi] = useState<AspirasiSiswa[]>(INITIAL_ASPIRASI);
  const [inventaris, setInventaris] = useState<InventarisBarang[]>(INITIAL_INVENTARIS);
  const [peminjaman, setPeminjaman] = useState<PeminjamanBarang[]>(INITIAL_PEMINJAMAN);
  const [ekskul, setEkskul] = useState<Ekstrakurikuler[]>(INITIAL_EKSKUL);
  const [piket, setPiket] = useState<JadwalPiket[]>(INITIAL_PIKET);
  const [bukuTamu, setBukuTamu] = useState<BukuTamu[]>(INITIAL_BUKU_TAMU);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('osis_auth_session') === 'true';
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem(PWD_STORAGE_KEY) || 'Admin123';
  });

  const adminUsername = 'Admin';

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.schoolProfile) setSchoolProfile(parsed.schoolProfile);
        if (parsed.pengurus) setPengurus(parsed.pengurus);
        if (parsed.proker) setProker(parsed.proker);
        if (parsed.kas) setKas(parsed.kas);
        if (parsed.dokumen) setDokumen(parsed.dokumen);
        if (parsed.rapat) setRapat(parsed.rapat);
        if (parsed.aspirasi) setAspirasi(parsed.aspirasi);
        if (parsed.inventaris) setInventaris(parsed.inventaris);
        if (parsed.peminjaman) setPeminjaman(parsed.peminjaman);
        if (parsed.ekskul) setEkskul(parsed.ekskul);
        if (parsed.piket) setPiket(parsed.piket);
        if (parsed.bukuTamu) setBukuTamu(parsed.bukuTamu);
      }
    } catch (e) {
      console.error('Gagal membaca data dari penyimpanan lokal:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to LocalStorage on changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const dataToSave = {
        schoolProfile,
        pengurus,
        proker,
        kas,
        dokumen,
        rapat,
        aspirasi,
        inventaris,
        peminjaman,
        ekskul,
        piket,
        bukuTamu,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn('Penyimpanan lokal penuh atau tidak diizinkan:', e);
    }
  }, [
    isLoaded,
    schoolProfile,
    pengurus,
    proker,
    kas,
    dokumen,
    rapat,
    aspirasi,
    inventaris,
    peminjaman,
    ekskul,
    piket,
    bukuTamu,
  ]);

  // Auth actions
  const login = (user: string, pass: string): boolean => {
    const isUserValid = user.trim().toLowerCase() === adminUsername.toLowerCase();
    const isPassValid = pass === adminPassword;

    if (isUserValid && isPassValid) {
      setIsAuthenticated(true);
      localStorage.setItem('osis_auth_session', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('osis_auth_session');
  };

  const changePassword = (oldPass: string, newPass: string): { success: boolean; message: string } => {
    if (oldPass !== adminPassword) {
      return { success: false, message: 'Password saat ini tidak sesuai.' };
    }
    if (!newPass || newPass.trim().length < 4) {
      return { success: false, message: 'Password baru minimal 4 karakter.' };
    }
    setAdminPassword(newPass);
    localStorage.setItem(PWD_STORAGE_KEY, newPass);
    return { success: true, message: 'Password admin berhasil diperbarui!' };
  };

  // Profile actions
  const updateSchoolProfile = (updated: Partial<SchoolProfile>) => {
    setSchoolProfile((prev) => ({ ...prev, ...updated }));
  };

  // Pengurus actions
  const addPengurus = (data: Omit<PengurusOsis, 'id'>) => {
    const newPengurus: PengurusOsis = {
      ...data,
      id: `pgr-${Date.now()}`,
    };
    setPengurus((prev) => [newPengurus, ...prev]);
  };

  const updatePengurus = (id: string, data: Partial<PengurusOsis>) => {
    setPengurus((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  };

  const deletePengurus = (id: string) => {
    setPengurus((prev) => prev.filter((p) => p.id !== id));
  };

  // Proker actions
  const addProker = (data: Omit<ProgramKerja, 'id'>) => {
    const newProker: ProgramKerja = {
      ...data,
      id: `proker-${Date.now()}`,
    };
    setProker((prev) => [...prev, newProker]);
  };

  const updateProker = (id: string, data: Partial<ProgramKerja>) => {
    setProker((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  };

  const deleteProker = (id: string) => {
    setProker((prev) => prev.filter((p) => p.id !== id));
  };

  // Kas actions
  const addKas = (data: Omit<TransaksiKas, 'id'>) => {
    const newKas: TransaksiKas = {
      ...data,
      id: `kas-${Date.now()}`,
    };
    setKas((prev) => [newKas, ...prev]);
  };

  const deleteKas = (id: string) => {
    setKas((prev) => prev.filter((k) => k.id !== id));
  };

  // Dokumen actions
  const addDokumen = (doc: Omit<ArsipDokumen, 'id'>) => {
    const newDoc: ArsipDokumen = {
      ...doc,
      id: `dok-${Date.now()}`,
    };
    setDokumen((prev) => [newDoc, ...prev]);
  };

  const deleteDokumen = (id: string) => {
    setDokumen((prev) => prev.filter((d) => d.id !== id));
  };

  // Rapat actions
  const addRapat = (data: Omit<RapatNotulensi, 'id'>) => {
    const newRapat: RapatNotulensi = {
      ...data,
      id: `rpt-${Date.now()}`,
    };
    setRapat((prev) => [newRapat, ...prev]);
  };

  const updateRapat = (id: string, data: Partial<RapatNotulensi>) => {
    setRapat((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
  };

  const deleteRapat = (id: string) => {
    setRapat((prev) => prev.filter((r) => r.id !== id));
  };

  // Aspirasi actions
  const addAspirasi = (data: Omit<AspirasiSiswa, 'id' | 'tanggal' | 'status'>) => {
    const newAspirasi: AspirasiSiswa = {
      ...data,
      id: `asp-${Date.now()}`,
      tanggal: new Date().toISOString().split('T')[0],
      status: 'Menunggu Review',
    };
    setAspirasi((prev) => [newAspirasi, ...prev]);
  };

  const updateAspirasiStatus = (
    id: string,
    status: AspirasiSiswa['status'],
    respon?: string,
    penanggap?: string
  ) => {
    setAspirasi((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              ...(respon !== undefined ? { responOsis: respon } : {}),
              ...(penanggap !== undefined ? { ditanganiOleh: penanggap } : {}),
            }
          : a
      )
    );
  };

  const deleteAspirasi = (id: string) => {
    setAspirasi((prev) => prev.filter((a) => a.id !== id));
  };

  // Inventaris actions
  const addInventaris = (item: Omit<InventarisBarang, 'id'>) => {
    const newItem: InventarisBarang = {
      ...item,
      id: `inv-${Date.now()}`,
    };
    setInventaris((prev) => [newItem, ...prev]);
  };

  const updateInventaris = (id: string, data: Partial<InventarisBarang>) => {
    setInventaris((prev) => prev.map((inv) => (inv.id === id ? { ...inv, ...data } : inv)));
  };

  const deleteInventaris = (id: string) => {
    setInventaris((prev) => prev.filter((inv) => inv.id !== id));
  };

  // Peminjaman actions
  const addPeminjaman = (data: Omit<PeminjamanBarang, 'id' | 'kodePinjam'>) => {
    const seq = String(peminjaman.length + 1).padStart(3, '0');
    const newPinjam: PeminjamanBarang = {
      ...data,
      id: `pinjam-${Date.now()}`,
      kodePinjam: `PINJAM/${new Date().getFullYear()}/${seq}`,
    };
    setPeminjaman((prev) => [newPinjam, ...prev]);
  };

  const updatePeminjamanStatus = (
    id: string,
    status: PeminjamanBarang['status'],
    tglKembaliNyata?: string
  ) => {
    setPeminjaman((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status,
              tanggalKembaliNyata: tglKembaliNyata || (status === 'Sudah Dikembalikan' ? new Date().toISOString().split('T')[0] : p.tanggalKembaliNyata),
            }
          : p
      )
    );
  };

  const deletePeminjaman = (id: string) => {
    setPeminjaman((prev) => prev.filter((p) => p.id !== id));
  };

  // Ekstrakurikuler actions
  const addEkskul = (data: Omit<Ekstrakurikuler, 'id'>) => {
    const newEkskul: Ekstrakurikuler = {
      ...data,
      id: `eks-${Date.now()}`,
    };
    setEkskul((prev) => [...prev, newEkskul]);
  };

  const updateEkskul = (id: string, data: Partial<Ekstrakurikuler>) => {
    setEkskul((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
  };

  const deleteEkskul = (id: string) => {
    setEkskul((prev) => prev.filter((e) => e.id !== id));
  };

  // Piket actions
  const updatePiket = (id: string, data: Partial<JadwalPiket>) => {
    setPiket((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  };

  // Buku Tamu actions
  const addBukuTamu = (data: Omit<BukuTamu, 'id' | 'tanggal' | 'waktu'>) => {
    const now = new Date();
    const newTamu: BukuTamu = {
      ...data,
      id: `tamu-${Date.now()}`,
      tanggal: now.toISOString().split('T')[0],
      waktu: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
    };
    setBukuTamu((prev) => [newTamu, ...prev]);
  };

  const deleteBukuTamu = (id: string) => {
    setBukuTamu((prev) => prev.filter((t) => t.id !== id));
  };

  // Backup & Restore
  const exportBackupJson = () => {
    const payload = {
      appName: 'OSIS KONOHA 360 Backup',
      creator: 'Nandi Achdarizal Sutisna',
      exportDate: new Date().toISOString(),
      schoolProfile,
      pengurus,
      proker,
      kas,
      dokumen,
      rapat,
      aspirasi,
      inventaris,
      peminjaman,
      ekskul,
      piket,
      bukuTamu,
    };
    const jsonString = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OSIS_KONOHA_BACKUP_${schoolProfile.namaSekolah.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackupJson = async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (parsed.schoolProfile) setSchoolProfile(parsed.schoolProfile);
      if (parsed.pengurus && Array.isArray(parsed.pengurus)) setPengurus(parsed.pengurus);
      if (parsed.proker && Array.isArray(parsed.proker)) setProker(parsed.proker);
      if (parsed.kas && Array.isArray(parsed.kas)) setKas(parsed.kas);
      if (parsed.dokumen && Array.isArray(parsed.dokumen)) setDokumen(parsed.dokumen);
      if (parsed.rapat && Array.isArray(parsed.rapat)) setRapat(parsed.rapat);
      if (parsed.aspirasi && Array.isArray(parsed.aspirasi)) setAspirasi(parsed.aspirasi);
      if (parsed.inventaris && Array.isArray(parsed.inventaris)) setInventaris(parsed.inventaris);
      if (parsed.peminjaman && Array.isArray(parsed.peminjaman)) setPeminjaman(parsed.peminjaman);
      if (parsed.ekskul && Array.isArray(parsed.ekskul)) setEkskul(parsed.ekskul);
      if (parsed.piket && Array.isArray(parsed.piket)) setPiket(parsed.piket);
      if (parsed.bukuTamu && Array.isArray(parsed.bukuTamu)) setBukuTamu(parsed.bukuTamu);
      return true;
    } catch (e) {
      console.error('Gagal mengimpor file backup:', e);
      return false;
    }
  };

  const resetToDefault = () => {
    if (window.confirm('Apakah Anda yakin ingin mengatur ulang data ke template awal? Seluruh perubahan saat ini akan digantikan dengan data mula.')) {
      setSchoolProfile(INITIAL_SCHOOL_PROFILE);
      setPengurus(INITIAL_PENGURUS);
      setProker(INITIAL_PROKER);
      setKas(INITIAL_KAS);
      setDokumen(INITIAL_DOKUMEN);
      setRapat(INITIAL_RAPAT);
      setAspirasi(INITIAL_ASPIRASI);
      setInventaris(INITIAL_INVENTARIS);
      setPeminjaman(INITIAL_PEMINJAMAN);
      setEkskul(INITIAL_EKSKUL);
      setPiket(INITIAL_PIKET);
      setBukuTamu(INITIAL_BUKU_TAMU);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Computations
  const totalKasMasuk = kas
    .filter((k) => k.tipe === 'masuk')
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  const totalKasKeluar = kas
    .filter((k) => k.tipe === 'keluar')
    .reduce((acc, curr) => acc + curr.jumlah, 0);

  const saldoKas = totalKasMasuk - totalKasKeluar;

  const totalProker = proker.length;
  const prokerSelesai = proker.filter((p) => p.status === 'Selesai').length;
  const persentaseProkerSelesai = totalProker > 0 ? Math.round((prokerSelesai / totalProker) * 100) : 0;

  return (
    <OsisContext.Provider
      value={{
        schoolProfile,
        setSchoolProfile,
        updateSchoolProfile,
        pengurus,
        addPengurus,
        updatePengurus,
        deletePengurus,
        proker,
        addProker,
        updateProker,
        deleteProker,
        kas,
        addKas,
        deleteKas,
        dokumen,
        addDokumen,
        deleteDokumen,
        rapat,
        addRapat,
        updateRapat,
        deleteRapat,
        aspirasi,
        addAspirasi,
        updateAspirasiStatus,
        deleteAspirasi,
        inventaris,
        addInventaris,
        updateInventaris,
        deleteInventaris,
        peminjaman,
        addPeminjaman,
        updatePeminjamanStatus,
        deletePeminjaman,
        ekskul,
        addEkskul,
        updateEkskul,
        deleteEkskul,
        piket,
        updatePiket,
        bukuTamu,
        addBukuTamu,
        deleteBukuTamu,
        exportBackupJson,
        importBackupJson,
        resetToDefault,
        isAuthenticated,
        adminUsername,
        login,
        logout,
        changePassword,
        totalKasMasuk,
        totalKasKeluar,
        saldoKas,
        persentaseProkerSelesai,
      }}
    >
      {children}
    </OsisContext.Provider>
  );
};

export const useOsis = (): OsisContextType => {
  const context = useContext(OsisContext);
  if (!context) {
    throw new Error('useOsis must be used within an OsisProvider');
  }
  return context;
};
