import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Wallet,
  FileText,
  FileSignature,
  ClipboardList,
  Award,
  MessageSquareHeart,
  School,
  FileCheck2,
  HardDriveDownload,
  ShieldCheck,
  LogOut,
  Flame,
  Package,
  Compass,
  Clock,
} from 'lucide-react';
import { useOsis } from '../../context/OsisContext';

export type ActiveTab =
  | 'dashboard'
  | 'pengurus'
  | 'proker'
  | 'keuangan'
  | 'dokumen'
  | 'proposal'
  | 'rapat'
  | 'inventaris'
  | 'ekskul'
  | 'sekretariat'
  | 'sertifikat'
  | 'aspirasi'
  | 'profil'
  | 'laporan';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { schoolProfile, exportBackupJson, logout } = useOsis();

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Balai Utama Konoha', icon: LayoutDashboard },
    { id: 'pengurus', label: 'Registrasi Shinobi & KTA', icon: Users },
    { id: 'proker', label: 'Misi & Program Kerja', icon: CalendarDays },
    { id: 'keuangan', label: 'Perbendaharaan Kas', icon: Wallet },
    { id: 'dokumen', label: 'Gulungan Surat & Berkas', icon: FileText },
    { id: 'proposal', label: 'Proposal & LPJ Misi', icon: FileSignature },
    { id: 'rapat', label: 'Dewan Rapat & Presensi', icon: ClipboardList },
    { id: 'inventaris', label: 'Gudang Logistik & Sarana', icon: Package },
    { id: 'ekskul', label: 'Aliansi Ekstrakurikuler', icon: Compass },
    { id: 'sekretariat', label: 'Piket & Buku Tamu', icon: Clock },
    { id: 'sertifikat', label: 'Piagam Kehormatan', icon: Award },
    { id: 'aspirasi', label: 'Kotak Suara Warga', icon: MessageSquareHeart },
    { id: 'profil', label: 'Profil Madrasah & Lambang', icon: School },
    { id: 'laporan', label: 'LPJ Akhir 1 Tahun', icon: FileCheck2 },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar (logout)?')) {
      logout();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container: Naruto Ninja Flak Navy & Chakra Orange Theme */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-gradient-to-b from-[#0F172A] via-[#111C33] to-[#0A0F1D] text-slate-100 border-r border-orange-500/20 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } no-print shadow-2xl`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-orange-500/20 flex items-center gap-3 bg-[#0B1120]/80">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 p-0.5 shadow-lg shadow-orange-500/20 shrink-0">
            <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center overflow-hidden p-1">
              <img
                src={schoolProfile.logoOsisUrl}
                alt="Logo OSIS"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="overflow-hidden">
            <h1 className="text-sm font-black text-white tracking-wide truncate flex items-center gap-1">
              <span>OSIS KONOHA</span>
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-pulse" />
            </h1>
            <div className="text-[11px] text-orange-400 font-bold truncate">
              {schoolProfile.masaBakti} · {schoolProfile.namaKabinet}
            </div>
          </div>
        </div>

        {/* School Name Notice */}
        <div className="px-4 py-2 bg-[#090E1A] border-b border-slate-800/80 text-[11px] text-slate-400 truncate flex items-center gap-1.5">
          <span className="text-emerald-400">🍃</span>
          <span className="text-slate-200 font-semibold truncate">{schoolProfile.namaSekolah}</span>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-2 pb-1.5 text-[10px] font-extrabold text-orange-400/80 uppercase tracking-wider flex items-center justify-between">
            <span>Navigasi Shinobi</span>
            <span className="text-[9px] text-slate-500">1 TAHUN</span>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-xl transition-all text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white font-extrabold shadow-md shadow-orange-500/20'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-orange-300'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions & Backup */}
        <div className="p-3 border-t border-slate-800/80 bg-[#090E1A] space-y-2">
          <button
            onClick={exportBackupJson}
            title="Download seluruh data OSIS dalam file JSON"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700/80 shadow-xs"
          >
            <HardDriveDownload className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="truncate">Gulungan Backup (.json)</span>
          </button>

          <button
            onClick={handleLogout}
            title="Keluar dari akun admin"
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-rose-300 hover:bg-slate-800/60 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Keluar (Logout)</span>
          </button>

          <div className="flex items-center justify-between text-[10px] text-slate-500 px-1 pt-1 border-t border-slate-800">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3" /> Status: Hokage Admin
            </span>
            <span className="font-mono text-orange-400">Konoha v3.0</span>
          </div>

          <div className="text-[9.5px] text-slate-400 text-center pt-1 font-medium border-t border-slate-800/60">
            Dibuat oleh: <strong className="text-orange-400 font-bold">Nandi Achdarizal Sutisna</strong>
          </div>
        </div>
      </aside>
    </>
  );
};
