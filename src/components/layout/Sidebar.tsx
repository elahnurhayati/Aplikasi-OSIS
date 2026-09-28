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
    { id: 'dashboard', label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'pengurus', label: 'Data Pengurus & KTA', icon: Users },
    { id: 'proker', label: 'Program Kerja (1 Thn)', icon: CalendarDays },
    { id: 'keuangan', label: 'Buku Kas & Keuangan', icon: Wallet },
    { id: 'dokumen', label: 'Arsip Surat & Berkas', icon: FileText },
    { id: 'proposal', label: 'Proposal & LPJ Kegiatan', icon: FileSignature },
    { id: 'rapat', label: 'Notulensi & Presensi', icon: ClipboardList },
    { id: 'sertifikat', label: 'Generator Sertifikat', icon: Award },
    { id: 'aspirasi', label: 'Aspirasi Siswa', icon: MessageSquareHeart },
    { id: 'profil', label: 'Profil & Logo Madrasah', icon: School },
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
          className="fixed inset-0 z-40 bg-[#3D080A]/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container: Rich Merah Marun & Cream Palette */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-gradient-to-b from-[#580B0D] via-[#650E10] to-[#450709] text-[#FFFDD0] border-r border-[#7B1113] flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } no-print shadow-xl`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-[#7B1113]/80 flex items-center gap-3 bg-[#4E090B]/60">
          <div className="w-10 h-10 rounded-xl bg-[#FFFDD0]/15 border border-[#FFFDD0]/30 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
            <img
              src={schoolProfile.logoOsisUrl}
              alt="Logo OSIS / OSIM"
              className="w-8 h-8 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-sm font-extrabold text-[#FFFDD0] tracking-wide truncate">
              OSIS / OSIM 360
            </h1>
            <div className="text-xs text-[#F2D7B3] font-medium truncate">
              {schoolProfile.masaBakti} · {schoolProfile.namaKabinet}
            </div>
          </div>
        </div>

        {/* School Name Notice */}
        <div className="px-4 py-2 bg-[#3A0507]/60 border-b border-[#7B1113]/50 text-[11px] text-[#E8D4C0] truncate">
          <span className="text-[#FFFDD0] font-medium">{schoolProfile.namaSekolah}</span>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-2 pb-1.5 text-[10px] font-bold text-[#E2BFA3] uppercase tracking-wider">
            Menu Kepengurusan
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
                    ? 'bg-[#FFFDD0] text-[#7B1113] font-bold shadow-md'
                    : 'text-[#F5E6D3] hover:bg-[#7B1113]/60 hover:text-[#FFFDD0]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#7B1113]' : 'text-[#E8D4C0]'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions & Backup */}
        <div className="p-3 border-t border-[#7B1113]/80 bg-[#3A0507]/70 space-y-2">
          <button
            onClick={exportBackupJson}
            title="Download seluruh data OSIS dalam file JSON"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-[#FFFDD0] bg-[#6E1114] hover:bg-[#7D1518] rounded-xl transition-colors border border-[#8C1B1F]/60 shadow-2xs"
          >
            <HardDriveDownload className="w-3.5 h-3.5 text-[#FFFDD0] shrink-0" />
            <span className="truncate">Backup Data (.json)</span>
          </button>

          <button
            onClick={handleLogout}
            title="Keluar dari akun admin"
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#F2D7B3] hover:text-[#FFFDD0] hover:bg-[#52090B] rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Keluar (Logout)</span>
          </button>

          <div className="flex items-center justify-between text-[10px] text-[#D8BFA8] px-1 pt-1 border-t border-[#6B1013]/60">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#A8E6CF]" /> Akun: Admin
            </span>
            <span>v2.5.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
