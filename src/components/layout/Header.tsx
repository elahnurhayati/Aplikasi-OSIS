import React from 'react';
import { Menu, Printer, Download, Sparkles, LogOut, User, Flame } from 'lucide-react';
import { useOsis } from '../../context/OsisContext';
import { ActiveTab } from './Sidebar';
import { formatRupiah } from '../../utils/exportUtils';

interface HeaderProps {
  activeTab: ActiveTab;
  setIsMobileOpen: (open: boolean) => void;
  onOpenQuickAdd?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setIsMobileOpen,
}) => {
  const { schoolProfile, saldoKas, pengurus, proker, exportBackupJson, logout } = useOsis();

  const getBreadcrumbTitle = (tab: ActiveTab): string => {
    switch (tab) {
      case 'dashboard':
        return 'Balai Utama Konoha & Ikhtisar 1 Tahun';
      case 'pengurus':
        return 'Data Registrasi Shinobi & Cetak KTA';
      case 'proker':
        return 'Matriks Misi & Program Kerja 1 Tahun';
      case 'keuangan':
        return 'Buku Kas & Perbendaharaan Desa';
      case 'dokumen':
        return 'Gulungan Arsip Surat & Generator Dokumen';
      case 'proposal':
        return 'Proposal Misi & Lembar Pengesahan';
      case 'rapat':
        return 'Dewan Pertemuan Rapat & Presensi';
      case 'inventaris':
        return 'Gudang Logistik & Sarana Aset';
      case 'ekskul':
        return 'Aliansi & Dewan Ekstrakurikuler';
      case 'sekretariat':
        return 'Pusat Kendali Sekretariat OSIS';
      case 'sertifikat':
        return 'Piagam Kehormatan & Sertifikat';
      case 'aspirasi':
        return 'Kotak Aspirasi & Suara Siswa';
      case 'profil':
        return 'Profil Madrasah & Lambang Konoha';
      case 'laporan':
        return 'Laporan Pertanggungjawaban Akhir 1 Tahun';
      default:
        return 'OSIS KONOHA 360';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogout = () => {
    if (window.confirm('Keluar dari sesi administrator?')) {
      logout();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-orange-200/80 px-4 md:px-8 py-3.5 flex items-center justify-between no-print shadow-xs">
      {/* Left: Mobile Menu & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-1.5 text-slate-700 hover:text-orange-600 rounded-lg hover:bg-orange-50 md:hidden"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs md:text-sm">
          <div className="flex items-center gap-1 font-black text-orange-600 tracking-tight">
            <span>OSIS 360</span>
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
          </div>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-slate-800 truncate max-w-[200px] md:max-w-md">
            {getBreadcrumbTitle(activeTab)}
          </span>
        </div>
      </div>

      {/* Right: Quick KPIs & Functional Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Compact Stats for Desktop */}
        <div className="hidden lg:flex items-center gap-4 px-3.5 py-1.5 bg-orange-50/70 border border-orange-200/60 rounded-xl text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600">Perbendaharaan:</span>
            <span className="font-extrabold font-mono text-emerald-700 tabular-nums">
              {formatRupiah(saldoKas)}
            </span>
          </div>
          <span className="text-orange-200">·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600">Shinobi Pengurus:</span>
            <span className="font-extrabold font-mono text-orange-700 tabular-nums">
              {pengurus.length} Anggota
            </span>
          </div>
          <span className="text-orange-200">·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600">Misi Proker:</span>
            <span className="font-extrabold font-mono text-amber-700 tabular-nums">
              {proker.length} Agenda
            </span>
          </div>
        </div>

        {/* Print / Save PDF View Action */}
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-orange-50/50 rounded-xl transition-colors shadow-2xs whitespace-nowrap"
          title="Cetak Tampilan / Simpan ke PDF"
        >
          <Printer className="w-3.5 h-3.5 text-orange-600 shrink-0" />
          <span className="hidden sm:inline">Cetak / PDF</span>
        </button>

        {/* Backup JSON Button */}
        <button
          onClick={exportBackupJson}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-xl transition-all shadow-xs whitespace-nowrap"
          title="Download file arsip backup JSON"
        >
          <Download className="w-3.5 h-3.5 text-white shrink-0" />
          <span className="hidden sm:inline">Gulungan Backup</span>
        </button>

        {/* Admin Badge & Logout */}
        <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200">
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-slate-900 rounded-lg text-xs font-black text-amber-300 shadow-2xs">
            <User className="w-3 h-3 text-orange-400" />
            <span>Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Keluar (Logout)"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
