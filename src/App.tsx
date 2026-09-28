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
    <div className="min-h-screen bg-[#FAF6F0] text-[#2C1810] flex selection:bg-[#7B1113] selection:text-[#FFFDD0]">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Footer */}
        <footer className="border-t border-[#EADBCE] bg-[#FFFDF9] py-4 px-6 text-center text-xs text-[#7A6158] no-print">
          OSIS / OSIM 360 · Sistem Tata Kelola Terpadu 1 Tahun Masa Bakti Madrasah & Sekolah
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
