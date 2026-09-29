import React, { useState } from 'react';
import { OsisProvider, useOsis } from './context/OsisContext';
import { LoginView } from './components/auth/LoginView';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { PengurusView } from './components/pengurus/PengurusView';
import { ProkerView } from './components/proker/ProkerView';
import { KeuanganView } from './components/keuangan/KeuanganView';
import { DokumenView } from './components/dokumen/DokumenView';
import { ProposalView } from './components/proposal/ProposalView';
import { RapatView } from './components/rapat/RapatView';
import { SertifikatView } from './components/sertifikat/SertifikatView';
import { AspirasiView } from './components/aspirasi/AspirasiView';
import { ProfilSekolahView } from './components/profil/ProfilSekolahView';
import { LaporanAkhirView } from './components/laporan/LaporanAkhirView';
import { InventarisView } from './components/inventaris/InventarisView';
import { EkskulView } from './components/ekskul/EkskulView';
import { SekretariatView } from './components/sekretariat/SekretariatView';

function MainApp() {
  const { isAuthenticated } = useOsis();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // If user is not logged in, show the Maroon & Cream Login View
  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView setActiveTab={setActiveTab} />;
      case 'pengurus':
        return <PengurusView />;
      case 'proker':
        return <ProkerView />;
      case 'keuangan':
        return <KeuanganView />;
      case 'dokumen':
        return <DokumenView />;
      case 'proposal':
        return <ProposalView />;
      case 'rapat':
        return <RapatView />;
      case 'inventaris':
        return <InventarisView />;
      case 'ekskul':
        return <EkskulView />;
      case 'sekretariat':
        return <SekretariatView />;
      case 'sertifikat':
        return <SertifikatView />;
      case 'aspirasi':
        return <AspirasiView />;
      case 'profil':
        return <ProfilSekolahView />;
      case 'laporan':
        return <LaporanAkhirView />;
      default:
        return <DashboardView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5EB] text-[#0F172A] flex selection:bg-[#F97316] selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 print:pl-0 print:m-0 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto print:p-0 print:m-0 print:max-w-full">
          {renderActiveView()}
        </main>

        {/* Footer */}
        <footer className="border-t border-orange-200/60 bg-white/90 py-3.5 px-6 text-center text-xs text-slate-500 no-print flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Aplikasi resmi OSIS KONOHA 360</span>
            <span className="text-orange-400">·</span>
            <span className="text-orange-600 font-bold">Semangat Api (Hi no Ishi) 🍃</span>
          </div>
          <div className="text-slate-600 font-semibold flex items-center gap-1 text-[11px]">
            <span>Karya & Ciptaan:</span>
            <strong className="text-orange-600 font-bold">Nandi Achdarizal Sutisna</strong>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <OsisProvider>
      <MainApp />
    </OsisProvider>
  );
}
