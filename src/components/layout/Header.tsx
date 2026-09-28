import React from 'react';
import { Menu, Printer, Download, Sparkles, LogOut, User } from 'lucide-react';
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
        return 'Dashboard & Ringkasan 1 Tahun';
      case 'pengurus':
        return 'Data Biodata Pengurus & Cetak KTA';
      case 'proker':
        return 'Matriks Program Kerja 1 Tahun';
      case 'keuangan':
        return 'Buku Kas Umum & Laporan Keuangan';
      case 'dokumen':
        return 'Arsip Surat Masuk/Keluar & Generator Surat';
      case 'proposal':
        return 'Generator Proposal & LPJ Resmi';
      case 'rapat':
        return 'Notulensi & Presensi Kehadiran Rapat';
      case 'sertifikat':
        return 'Generator Sertifikat & Piagam Penghargaan';
      case 'aspirasi':
        return 'Kotak Aspirasi & Suara Siswa';
      case 'profil':
        return 'Profil & Logo Madrasah';
      case 'laporan':
        return 'Laporan Pertanggungjawaban Akhir 1 Tahun';
      default:
        return 'OSIS / OSIM 360';
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
    <header className="sticky top-0 z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#EADBCE] px-4 md:px-8 py-3.5 flex items-center justify-between no-print shadow-2xs">
      {/* Left: Mobile Menu & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-1.5 text-[#580B0D] hover:text-[#7B1113] rounded-lg hover:bg-[#F5ECE1] md:hidden"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs md:text-sm">
          <span className="font-extrabold text-[#7B1113] tracking-tight">OSIS 360</span>
          <span className="text-[#C4AFA5]">/</span>
          <span className="font-semibold text-[#543834] truncate max-w-[200px] md:max-w-md">
            {getBreadcrumbTitle(activeTab)}
          </span>
        </div>
      </div>

      {/* Right: Quick KPIs & Functional Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Compact Stats for Desktop */}
        <div className="hidden lg:flex items-center gap-4 px-3.5 py-1 bg-[#F7EFE5] border border-[#EADBCE] rounded-xl text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-[#7A6158]">Saldo Kas:</span>
            <span className="font-bold font-mono text-[#0F6B43] tabular-nums">
              {formatRupiah(saldoKas)}
            </span>
          </div>
          <span className="text-[#D8C6B6]">·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#7A6158]">Pengurus:</span>
            <span className="font-bold font-mono text-[#7B1113] tabular-nums">
              {pengurus.length} Siswa
            </span>
          </div>
          <span className="text-[#D8C6B6]">·</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[#7A6158]">Proker:</span>
            <span className="font-bold font-mono text-[#9C4E0A] tabular-nums">
              {proker.length} Agenda
            </span>
          </div>
        </div>

        {/* Print / Save PDF View Action */}
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#543834] bg-white border border-[#D9C7B6] hover:bg-[#FAF6F0] rounded-xl transition-colors shadow-2xs whitespace-nowrap"
          title="Cetak Tampilan / Simpan ke PDF"
        >
          <Printer className="w-3.5 h-3.5 text-[#7B1113] shrink-0" />
          <span className="hidden sm:inline">Cetak / PDF</span>
        </button>

        {/* Backup JSON Button */}
        <button
          onClick={exportBackupJson}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#FFFDD0] bg-[#7B1113] hover:bg-[#650E10] rounded-xl transition-colors shadow-2xs whitespace-nowrap"
          title="Download file arsip backup JSON"
        >
          <Download className="w-3.5 h-3.5 text-[#FFFDD0] shrink-0" />
          <span className="hidden sm:inline">Backup Data</span>
        </button>

        {/* Admin Badge & Logout */}
        <div className="flex items-center gap-1.5 pl-1 border-l border-[#EADBCE]">
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-[#F5ECE1] rounded-lg text-xs font-bold text-[#7B1113]">
            <User className="w-3 h-3 text-[#7B1113]" />
            <span>Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-[#7B1113] hover:text-[#52090B] hover:bg-[#F5ECE1] rounded-lg transition-colors"
            title="Keluar (Logout)"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
