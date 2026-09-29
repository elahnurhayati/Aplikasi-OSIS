import React, { useState, useEffect, useRef } from 'react';
import {
  FileSignature,
  Download,
  Printer,
  Eye,
  CheckCircle,
  Clock,
  BookOpen,
  ArrowRight,
  FileCheck2,
  Calculator,
  Plus,
  Trash2,
  FileSpreadsheet,
  Layers,
  Save,
  Flame,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useOsis } from '../../context/OsisContext';
import { ProgramKerja, RabItem } from '../../types';
import { generateProposalHtml, generateLpjHtml, generateKopSuratHtml } from '../../utils/documentTemplates';
import { downloadFile, formatRupiah, formatDateIndo, exportToCsv, angkaKeTerbilang, printHtmlDocument } from '../../utils/exportUtils';

// Helper to generate default realistic RAB items based on proker budget
const getDefaultRabItems = (proker: ProgramKerja): RabItem[] => {
  const budget = proker.anggaranBiaya || 5000000;
  return [
    {
      id: `rab-init-1-${proker.id}`,
      namaItem: `Snack Kotak & Air Mineral Peserta ${proker.namaProker}`,
      divisi: 'Konsumsi',
      volume: 100,
      satuan: 'Kotak',
      hargaSatuan: Math.max(10000, Math.round((budget * 0.25) / 100)),
      realisasiVolume: 100,
      realisasiHargaSatuan: Math.max(9000, Math.round((budget * 0.24) / 100)),
    },
    {
      id: `rab-init-2-${proker.id}`,
      namaItem: 'Makan Siang Prasmanan Panitia & Tamu Pembina',
      divisi: 'Konsumsi',
      volume: 25,
      satuan: 'Porsi',
      hargaSatuan: Math.max(20000, Math.round((budget * 0.15) / 25)),
      realisasiVolume: 25,
      realisasiHargaSatuan: Math.max(20000, Math.round((budget * 0.15) / 25)),
    },
    {
      id: `rab-init-3-${proker.id}`,
      namaItem: 'Cetak Banner Backdrop Panggung & Spanduk Selamat Datang',
      divisi: 'Pubdekdok & Media',
      volume: 2,
      satuan: 'Buah',
      hargaSatuan: Math.max(150000, Math.round((budget * 0.12) / 2)),
      realisasiVolume: 2,
      realisasiHargaSatuan: Math.max(140000, Math.round((budget * 0.11) / 2)),
    },
    {
      id: `rab-init-4-${proker.id}`,
      namaItem: 'Sewa Paket Sound System & Microphone Lapangan',
      divisi: 'Perlengkapan & Sound',
      volume: 1,
      satuan: 'Paket',
      hargaSatuan: Math.max(300000, Math.round(budget * 0.2)),
      realisasiVolume: 1,
      realisasiHargaSatuan: Math.max(300000, Math.round(budget * 0.2)),
    },
    {
      id: `rab-init-5-${proker.id}`,
      namaItem: 'Piala Tropi Kejuaraan & Piagam Penghargaan Berbingkai',
      divisi: 'Hadiah & Piagam',
      volume: 3,
      satuan: 'Set',
      hargaSatuan: Math.max(150000, Math.round((budget * 0.18) / 3)),
      realisasiVolume: 3,
      realisasiHargaSatuan: Math.max(150000, Math.round((budget * 0.18) / 3)),
    },
    {
      id: `rab-init-6-${proker.id}`,
      namaItem: 'Pengadaan Modul Kegiatan, ATK, Name Tag & Id Card Panitia',
      divisi: 'Kesekretariatan & ATK',
      volume: 1,
      satuan: 'Paket',
      hargaSatuan: Math.max(100000, Math.round(budget * 0.1)),
      realisasiVolume: 1,
      realisasiHargaSatuan: Math.max(90000, Math.round(budget * 0.09)),
    },
  ];
};

export const ProposalView: React.FC = () => {
  const { schoolProfile, proker, updateProker, pengurus, addDokumen } = useOsis();

  const [activeMainTab, setActiveMainTab] = useState<'generator' | 'rab'>('generator');
  const [selectedProkerId, setSelectedProkerId] = useState<string>(proker[0]?.id || '');
  const [docType, setDocType] = useState<'proposal' | 'lpj'>('proposal');
  const [rabMode, setRabMode] = useState<'estimasi' | 'realisasi'>('estimasi');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const currentProker = proker.find((p) => p.id === selectedProkerId) || proker[0];

  // RAB Items State (Interactive budget calculator per active proker)
  const [rabItems, setRabItems] = useState<RabItem[]>(() => {
    if (currentProker?.rabItems && currentProker.rabItems.length > 0) {
      return currentProker.rabItems;
    }
    return currentProker ? getDefaultRabItems(currentProker) : [];
  });

  const [previewHtml, setPreviewHtml] = useState<string | null>(() => {
    if (!currentProker) return null;
    const initialItems =
      currentProker.rabItems && currentProker.rabItems.length > 0
        ? currentProker.rabItems
        : getDefaultRabItems(currentProker);
    return generateProposalHtml(schoolProfile, currentProker, pengurus, initialItems);
  });

  // Whenever selected proker changes, load its items and refresh preview
  useEffect(() => {
    if (currentProker) {
      const items =
        currentProker.rabItems && currentProker.rabItems.length > 0
          ? currentProker.rabItems
          : getDefaultRabItems(currentProker);
      setRabItems(items);
      const html =
        docType === 'proposal'
          ? generateProposalHtml(schoolProfile, currentProker, pengurus, items)
          : generateLpjHtml(schoolProfile, currentProker, pengurus, items);
      setPreviewHtml(html);
    }
  }, [selectedProkerId]);

  // Keep preview synced when docType or rabItems change
  useEffect(() => {
    if (currentProker) {
      const html =
        docType === 'proposal'
          ? generateProposalHtml(schoolProfile, currentProker, pengurus, rabItems)
          : generateLpjHtml(schoolProfile, currentProker, pengurus, rabItems);
      setPreviewHtml(html);
    }
  }, [docType, rabItems, schoolProfile]);

  // Form New RAB Item
  const [newItem, setNewItem] = useState<Omit<RabItem, 'id'>>({
    namaItem: '',
    divisi: 'Acara & Lomba',
    volume: 1,
    satuan: 'Paket',
    hargaSatuan: 50000,
    realisasiVolume: 1,
    realisasiHargaSatuan: 50000,
  });

  // Financial Calculations
  const totalRencana = rabItems.reduce((acc, curr) => acc + curr.volume * curr.hargaSatuan, 0);
  const totalRealisasi = rabItems.reduce((acc, curr) => {
    const vol = curr.realisasiVolume !== undefined ? curr.realisasiVolume : curr.volume;
    const harga = curr.realisasiHargaSatuan !== undefined ? curr.realisasiHargaSatuan : curr.hargaSatuan;
    return acc + vol * harga;
  }, 0);
  const totalSelisih = totalRencana - totalRealisasi;

  const handleAddRabItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.namaItem.trim()) return;
    const item: RabItem = {
      ...newItem,
      id: `rab-${Date.now()}`,
      realisasiVolume: newItem.realisasiVolume || newItem.volume,
      realisasiHargaSatuan: newItem.realisasiHargaSatuan || newItem.hargaSatuan,
    };
    const updated = [...rabItems, item];
    setRabItems(updated);

    // Auto-sync with current proker
    if (currentProker) {
      const newTotal = updated.reduce((acc, curr) => acc + curr.volume * curr.hargaSatuan, 0);
      updateProker(currentProker.id, {
        anggaranBiaya: newTotal,
        rabItems: updated,
      });
    }

    setNewItem({
      namaItem: '',
      divisi: 'Acara & Lomba',
      volume: 1,
      satuan: 'Paket',
      hargaSatuan: 50000,
      realisasiVolume: 1,
      realisasiHargaSatuan: 50000,
    });
  };

  const handleDeleteRabItem = (id: string) => {
    const updated = rabItems.filter((item) => item.id !== id);
    setRabItems(updated);
    if (currentProker) {
      const newTotal = updated.reduce((acc, curr) => acc + curr.volume * curr.hargaSatuan, 0);
      updateProker(currentProker.id, {
        anggaranBiaya: newTotal,
        rabItems: updated,
      });
    }
  };

  const handleUpdateItemValue = (id: string, field: keyof RabItem, value: any) => {
    const updated = rabItems.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    setRabItems(updated);
    if (currentProker) {
      const newTotal = updated.reduce((acc, curr) => acc + curr.volume * curr.hargaSatuan, 0);
      updateProker(currentProker.id, {
        anggaranBiaya: newTotal,
        rabItems: updated,
      });
    }
  };

  const handleApplyRabToProker = () => {
    if (!currentProker) return;
    updateProker(currentProker.id, {
      anggaranBiaya: totalRencana,
      rabItems: rabItems,
    });
    setSaveSuccessMsg(`Berhasil menyinkronkan kalkulator RAB (${formatRupiah(totalRencana)}) ke naskah ${currentProker.namaProker}!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleResetToDefaultRab = () => {
    if (!currentProker) return;
    if (window.confirm('Kembalikan rincian kalkulator ke estimasi standar proporsional untuk program ini?')) {
      const defaults = getDefaultRabItems(currentProker);
      setRabItems(defaults);
      const newTotal = defaults.reduce((acc, curr) => acc + curr.volume * curr.hargaSatuan, 0);
      updateProker(currentProker.id, {
        anggaranBiaya: newTotal,
        rabItems: defaults,
      });
      setPreviewHtml(null);
    }
  };

  const handleExportRabCsv = () => {
    const data = rabItems.map((r, idx) => ({
      No: idx + 1,
      'Uraian Kebutuhan': r.namaItem,
      Divisi: r.divisi,
      'Volume Rencana': r.volume,
      Satuan: r.satuan,
      'Harga Satuan Rencana (Rp)': r.hargaSatuan,
      'Subtotal Rencana (Rp)': r.volume * r.hargaSatuan,
      'Volume Realisasi': r.realisasiVolume ?? r.volume,
      'Harga Realisasi (Rp)': r.realisasiHargaSatuan ?? r.hargaSatuan,
      'Subtotal Realisasi (Rp)': (r.realisasiVolume ?? r.volume) * (r.realisasiHargaSatuan ?? r.hargaSatuan),
      'Selisih / Efisiensi (Rp)': r.volume * r.hargaSatuan - (r.realisasiVolume ?? r.volume) * (r.realisasiHargaSatuan ?? r.hargaSatuan),
    }));
    exportToCsv(data, `RAB_${currentProker ? currentProker.namaProker.replace(/\s+/g, '_') : 'OSIS'}`);
  };

  const handleGenerateDocument = () => {
    if (!currentProker) return;
    const html =
      docType === 'proposal'
        ? generateProposalHtml(schoolProfile, currentProker, pengurus, rabItems)
        : generateLpjHtml(schoolProfile, currentProker, pengurus, rabItems);
    setPreviewHtml(html);
    setSaveSuccessMsg(`Naskah ${docType.toUpperCase()} berhasil dimuat ulang dengan data kalkulator terkini.`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handlePrintDocument = (customHtml?: string) => {
    let content = customHtml || previewHtml;
    if (!content && currentProker) {
      content =
        docType === 'proposal'
          ? generateProposalHtml(schoolProfile, currentProker, pengurus, rabItems)
          : generateLpjHtml(schoolProfile, currentProker, pengurus, rabItems);
      setPreviewHtml(content);
    }
    if (!content) return;
    printHtmlDocument(content);
  };

  const handleDownloadDoc = () => {
    let content = previewHtml;
    if (!content && currentProker) {
      content =
        docType === 'proposal'
          ? generateProposalHtml(schoolProfile, currentProker, pengurus, rabItems)
          : generateLpjHtml(schoolProfile, currentProker, pengurus, rabItems);
      setPreviewHtml(content);
    }
    if (!content || !currentProker) return;
    const fileName = `${docType === 'proposal' ? 'Proposal' : 'LPJ'}_${currentProker.namaProker.replace(/\s+/g, '_')}.html`;
    downloadFile(content, fileName, 'text/html;charset=utf-8');
    setSaveSuccessMsg(`File dokumen ${fileName} berhasil diunduh ke komputer Anda!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const getRabHtmlContent = () => {
    if (!currentProker) return '';
    const kop = generateKopSuratHtml(schoolProfile);
    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <title>RAB ${currentProker.namaProker} - OSIS ${schoolProfile.namaSekolah}</title>
  <style>
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.4; color: #111; padding: 25px; margin: 0; background: #fff; }
    .title { text-align: center; font-size: 13pt; font-weight: bold; text-transform: uppercase; margin: 15px 0 3px; }
    .sub { text-align: center; font-size: 10.5pt; color: #333; margin-bottom: 15px; }
    table.meta { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 10pt; }
    table.meta td { padding: 3px 5px; vertical-align: top; }
    table.budget { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 9.5pt; }
    table.budget th, table.budget td { border: 1px solid #333; padding: 5px 7px; }
    table.budget th { background: #f1f5f9; text-align: center; font-weight: bold; }
    .terbilang-box { font-size: 9pt; font-style: italic; margin: 10px 0 20px; padding: 6px 10px; background: #f8fafc; border: 1px dashed #94a3b8; }
    .ttd-box { display: flex; justify-content: space-between; margin-top: 35px; text-align: center; page-break-inside: avoid; }
    .ttd-col { width: 45%; }
    .ttd-line { border-bottom: 1px solid #111; display: inline-block; min-width: 170px; font-weight: bold; margin-top: 55px; }
    @media print {
      body { padding: 0; }
      @page { size: A4 portrait; margin: 12mm; }
    }
  </style>
</head>
<body>
  ${kop}
  <div class="title">LEMBAR RINCIAN ANGGARAN BIAYA (RAB) OPERASIONAL</div>
  <div class="sub">Misi Program Kerja: <strong>${currentProker.namaProker}</strong></div>

  <table class="meta">
    <tr><td style="width: 140px;">Seksi Bidang</td><td style="width: 10px;">:</td><td>${currentProker.sekbid}</td></tr>
    <tr><td>Penanggung Jawab</td><td>:</td><td>${currentProker.penanggungJawab}</td></tr>
    <tr><td>Jadwal & Lokasi</td><td>:</td><td>${formatDateIndo(currentProker.tanggalMulai)} · ${currentProker.tempat}</td></tr>
    <tr><td>Sumber Pembiayaan</td><td>:</td><td>${currentProker.sumberDana}</td></tr>
  </table>

  <table class="budget">
    <thead>
      <tr>
        <th style="width: 35px;">No</th>
        <th>Uraian Kebutuhan & Spesifikasi</th>
        <th style="width: 130px;">Divisi / Pos</th>
        <th style="width: 80px;">Volume</th>
        <th style="width: 110px;">Harga Satuan</th>
        <th style="width: 120px;">Subtotal Biaya</th>
      </tr>
    </thead>
    <tbody>
      ${rabItems
        .map(
          (item, idx) => `
        <tr>
          <td style="text-align: center; font-family: monospace;">${idx + 1}</td>
          <td><strong>${item.namaItem}</strong></td>
          <td style="text-align: center;">${item.divisi}</td>
          <td style="text-align: center; font-family: monospace;">${item.volume} ${item.satuan}</td>
          <td style="text-align: right; font-family: monospace;">${formatRupiah(item.hargaSatuan)}</td>
          <td style="text-align: right; font-family: monospace; font-weight: bold;">${formatRupiah(item.volume * item.hargaSatuan)}</td>
        </tr>
      `
        )
        .join('')}
      <tr style="font-weight: bold; background: #f8fafc;">
        <td colspan="5" style="text-align: right; padding-right: 10px;">TOTAL KEBUTUHAN ANGGARAN (RAB):</td>
        <td style="text-align: right; font-family: monospace; font-size: 10.5pt; color: #1e3a8a;">${formatRupiah(totalRencana)}</td>
      </tr>
    </tbody>
  </table>

  <div class="terbilang-box">
    <strong>Total Anggaran Terbilang:</strong> ${angkaKeTerbilang(totalRencana)}
  </div>

  <div class="ttd-box">
    <div class="ttd-col">
      Mengetahui,<br/>
      <strong>Ketua Pelaksana Kegiatan</strong><br/>
      <div class="ttd-line">${currentProker.penanggungJawab}</div><br/>
      Pengurus OSIS
    </div>
    <div class="ttd-col">
      ${schoolProfile.kota}, ${formatDateIndo(new Date().toISOString().split('T')[0])}<br/>
      <strong>Bendahara Panitia Pelaksana</strong><br/>
      <div class="ttd-line">Bendahara OSIS</div><br/>
      Pengurus Harian OSIS
    </div>
  </div>

  <div class="ttd-box" style="margin-top: 25px;">
    <div class="ttd-col">
      Menyetujui,<br/>
      <strong>Pembina OSIS</strong><br/>
      <div class="ttd-line">${schoolProfile.pembinaOsis}</div><br/>
      NIP. ${schoolProfile.nipPembinaOsis}
    </div>
    <div class="ttd-col">
      Mengesahkan,<br/>
      <strong>Kepala Sekolah / Madrasah</strong><br/>
      <div class="ttd-line">${schoolProfile.kepalaSekolah}</div><br/>
      NIP. ${schoolProfile.nipKepalaSekolah}
    </div>
  </div>
</body>
</html>`;
  };

  const handlePrintRabDoc = () => {
    const html = getRabHtmlContent();
    if (html) printHtmlDocument(html);
  };

  const handleDownloadRabDoc = () => {
    const html = getRabHtmlContent();
    if (!html || !currentProker) return;
    const fileName = `RAB_${currentProker.namaProker.replace(/\s+/g, '_')}.html`;
    downloadFile(html, fileName, 'text/html;charset=utf-8');
    setSaveSuccessMsg(`File Lembar RAB ${fileName} berhasil diunduh ke komputer Anda!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleSaveToArsip = () => {
    let content = previewHtml;
    if (!content && currentProker) {
      content =
        docType === 'proposal'
          ? generateProposalHtml(schoolProfile, currentProker, pengurus, rabItems)
          : generateLpjHtml(schoolProfile, currentProker, pengurus, rabItems);
      setPreviewHtml(content);
    }
    if (!content || !currentProker) return;
    const blob = new Blob([content], { type: 'text/html' });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      addDokumen({
        judul: `${docType === 'proposal' ? 'Proposal' : 'LPJ'} Resmi: ${currentProker.namaProker}`,
        nomorSurat: `0${Math.floor(Math.random() * 80 + 10)}/OSIS-SMAN1/${docType.toUpperCase()}/2026`,
        jenis: docType === 'proposal' ? 'Proposal Kegiatan' : 'Laporan Pertanggungjawaban (LPJ)',
        tanggal: new Date().toISOString().split('T')[0],
        sekbid: currentProker.sekbid,
        fileName: `${docType === 'proposal' ? 'Proposal' : 'LPJ'}_${currentProker.namaProker.replace(/\s+/g, '_')}.html`,
        fileSize: '24 KB',
        fileType: 'text/html',
        fileData: reader.result as string,
        keterangan: `Dokumen resmi ${docType} sinkron kalkulator RAB. Total: ${formatRupiah(totalRencana)}`,
      });
      setSaveSuccessMsg(`Dokumen ${docType.toUpperCase()} berhasil disimpan ke dalam Arsip Dokumen OSIS!`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    };
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-orange-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs no-print">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base md:text-lg font-black text-slate-900 flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-orange-600" />
              <span>Generator Proposal, LPJ & Kalkulator RAB Misi</span>
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-orange-100 text-orange-800 border border-orange-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-orange-600" />
              <span>100% Sinkron Kalkulator</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Penyusunan naskah proposal resmi, LPJ kegiatan misi tahunan, serta kalkulator rincian anggaran biaya (RAB) yang terhubung presisi ke dokumen.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-orange-50/70 border border-orange-200/60 rounded-xl text-xs">
            <button
              onClick={() => setActiveMainTab('generator')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMainTab === 'generator'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-orange-900'
              }`}
            >
              <FileSignature className="w-3.5 h-3.5" />
              <span>Generator Dokumen</span>
            </button>
            <button
              onClick={() => setActiveMainTab('rab')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeMainTab === 'rab'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-orange-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Kalkulator RAB ({rabItems.length})</span>
            </button>
          </div>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-xs animate-fadeIn no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* MAIN TAB 1: GENERATOR PROPOSAL & LPJ */}
      {activeMainTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Selector & Details */}
          <div className="bg-white p-5 rounded-2xl border border-orange-200/80 shadow-xs space-y-4 no-print">
            <div className="flex items-center justify-between border-b border-orange-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">1. Pengaturan Dokumen</h3>
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <button
                  onClick={() => {
                    setDocType('proposal');
                    setPreviewHtml(null);
                  }}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    docType === 'proposal'
                      ? 'bg-orange-600 text-white shadow-xs font-extrabold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Proposal
                </button>
                <button
                  onClick={() => {
                    setDocType('lpj');
                    setPreviewHtml(null);
                  }}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    docType === 'lpj'
                      ? 'bg-emerald-700 text-white shadow-xs font-extrabold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  LPJ Kegiatan
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Pilih Program Kerja Misi:
              </label>
              <select
                value={selectedProkerId}
                onChange={(e) => {
                  setSelectedProkerId(e.target.value);
                  setPreviewHtml(null);
                }}
                className="w-full px-3 py-2 text-xs border border-orange-200 rounded-xl bg-slate-50 text-slate-900 font-semibold focus:ring-2 focus:ring-orange-500 cursor-pointer"
              >
                {proker.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.namaProker} ({formatRupiah(p.anggaranBiaya)})
                  </option>
                ))}
              </select>
            </div>

            {currentProker && (
              <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200/60 space-y-2.5 text-xs">
                <div>
                  <span className="text-[10.5px] text-slate-500 font-bold uppercase">Seksi Bidang:</span>
                  <p className="font-bold text-slate-900">{currentProker.sekbid}</p>
                </div>
                <div>
                  <span className="text-[10.5px] text-slate-500 font-bold uppercase">Penanggung Jawab:</span>
                  <p className="font-semibold text-slate-800">{currentProker.penanggungJawab}</p>
                </div>
                <div>
                  <span className="text-[10.5px] text-slate-500 font-bold uppercase">Jadwal & Tempat:</span>
                  <p className="text-slate-800">
                    {formatDateIndo(currentProker.tanggalMulai)} · {currentProker.tempat}
                  </p>
                </div>
                <div>
                  <span className="text-[10.5px] text-slate-500 font-bold uppercase">
                    Anggaran Rencana (Kalkulator RAB):
                  </span>
                  <p className="font-mono font-black text-sm text-orange-700">{formatRupiah(totalRencana)}</p>
                  <p className="text-[10.5px] text-slate-500 font-medium">
                    Terdiri dari {rabItems.length} rincian item pengeluaran riil
                  </p>
                </div>
                {docType === 'lpj' && (
                  <div className="pt-2 border-t border-orange-200/60">
                    <span className="text-[10.5px] text-emerald-800 font-bold uppercase">
                      Realisasi Belanja Riil LPJ:
                    </span>
                    <p className="font-mono font-black text-sm text-emerald-700">{formatRupiah(totalRealisasi)}</p>
                    <p className="text-[10.5px] text-emerald-800 font-medium">
                      {totalSelisih >= 0
                        ? `Efisiensi Kas: Hemat ${formatRupiah(totalSelisih)}`
                        : `Defisit: ${formatRupiah(Math.abs(totalSelisih))}`}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-[10.5px] text-slate-500 font-bold uppercase">Sasaran Kegiatan:</span>
                  <p className="text-slate-700">{currentProker.sasaran}</p>
                </div>
              </div>
            )}

            {/* Dedicated Direct Print & Download Action Box */}
            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50/80 rounded-2xl border-2 border-orange-300/80 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-orange-950 flex items-center gap-1.5">
                  <Printer className="w-4 h-4 text-orange-600" />
                  <span>2. Aksi Cetak & Simpan Dokumen</span>
                </span>
                <span className="text-[10px] font-bold text-orange-700 bg-orange-100/90 px-2 py-0.5 rounded-full border border-orange-200">
                  Resmi A4
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                Langsung cetak ke printer fisik atau simpan naskah <strong>{docType === 'proposal' ? 'Proposal' : 'LPJ'}</strong> sebagai file PDF.
              </p>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => handlePrintDocument()}
                  className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 cursor-pointer"
                  title="Klik untuk membuka jendela cetak atau Simpan sebagai PDF"
                >
                  <Printer className="w-4 h-4 text-white" />
                  <span>Cetak / Simpan PDF Langsung</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadDoc}
                    className="py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    title="Unduh file dokumen HTML untuk dibuka di browser atau Microsoft Word"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Unduh File</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveToArsip}
                    className="py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    title="Simpan salinan naskah ini ke menu Arsip Dokumen OSIS"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Simpan ke Arsip</span>
                  </button>
                </div>
              </div>

              {/* Step-by-step Tip for PDF Saving */}
              <div className="p-2.5 bg-white/90 rounded-xl border border-orange-200 text-[10.5px] text-slate-700 space-y-1">
                <div className="font-bold text-orange-900 flex items-center gap-1">
                  <span>💡 Cara Menyimpan Menjadi PDF:</span>
                </div>
                <ol className="list-decimal pl-4 space-y-0.5 text-slate-600">
                  <li>Klik tombol <strong>Cetak / Simpan PDF Langsung</strong> di atas.</li>
                  <li>Pada jendela cetak browser, ubah <strong>Tujuan (Destination)</strong> ke <strong>"Simpan sebagai PDF" (Save as PDF)</strong>.</li>
                  <li>Klik tombol <strong>Simpan (Save)</strong>.</li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => setActiveMainTab('rab')}
              className="w-full py-2 bg-white hover:bg-orange-50 border border-orange-200 text-orange-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-orange-600" />
              <span>Kelola Rincian di Menu Kalkulator RAB</span>
            </button>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
              <strong>Standar Resmi Administrasi:</strong> Naskah {docType === 'proposal' ? 'Proposal' : 'LPJ'} mencakup Kop Surat Resmi, Cover OSIS, Latar Belakang, Rincian RAB dari Kalkulator, Rekapitulasi Divisi, serta 4 Kolom Lembar Pengesahan Sah (Ketua Pelaksana, Ketos, Pembina OSIS, dan Kepala Sekolah/Madrasah).
            </div>
          </div>

          {/* Right 2 Columns: Live Preview / Print Canvas */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-orange-200/80 overflow-hidden shadow-xs flex flex-col min-h-[650px]">
            {previewHtml ? (
              <>
                {/* Preview Bar */}
                <div className="p-3.5 bg-orange-50/70 border-b border-orange-200/80 flex flex-wrap items-center justify-between gap-3 text-xs no-print">
                  <span className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-orange-200 text-orange-900">
                      {docType.toUpperCase()}
                    </span>
                    <span>{currentProker?.namaProker}</span>
                  </span>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handlePrintDocument()}
                      className="px-3 py-1.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak / Simpan PDF</span>
                    </button>
                    <button
                      onClick={() =>
                        downloadFile(
                          previewHtml,
                          `${docType === 'proposal' ? 'Proposal' : 'LPJ'}_${currentProker?.namaProker.replace(/\s+/g, '_')}.html`,
                          'text/html;charset=utf-8'
                        )
                      }
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Unduh Dokumen</span>
                    </button>
                    <button
                      onClick={handleSaveToArsip}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Simpan ke Arsip</span>
                    </button>
                  </div>
                </div>

                {/* Document Frame */}
                <div className="p-6 bg-slate-100 flex-1 overflow-y-auto flex justify-center">
                  <div className="w-full max-w-3xl bg-white shadow-md p-6 rounded-2xl border border-slate-200">
                    <iframe
                      srcDoc={previewHtml}
                      title="Pratinjau Dokumen"
                      className="w-full min-h-[850px] border-0"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                <FileSignature className="w-12 h-12 text-orange-300 mb-3" />
                <p className="text-sm font-bold text-slate-700">Naskah Dokumen Belum Dibuat</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Pilih program kerja di panel kiri dan klik tombol <strong>"Generate & Pratinjau Naskah"</strong> untuk memuat proposal atau LPJ lengkap dengan rincian biaya persis dari menu kalkulator.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN TAB 2: KALKULATOR RENCANA ANGGARAN BIAYA (RAB) & REALISASI */}
      {activeMainTab === 'rab' && (
        <div className="space-y-6">
          {/* Top Control Bar */}
          <div className="bg-white p-5 rounded-2xl border border-orange-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 no-print">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Program Kerja Terpilih:</span>
                <select
                  value={selectedProkerId}
                  onChange={(e) => setSelectedProkerId(e.target.value)}
                  className="px-2 py-1 bg-slate-50 border border-orange-200 rounded-lg text-xs font-bold text-slate-800"
                >
                  {proker.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.namaProker}
                    </option>
                  ))}
                </select>
              </div>
              <div className="font-extrabold text-base text-slate-900 flex items-center gap-2 flex-wrap">
                <span>{currentProker?.namaProker}</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-orange-100 text-orange-800 rounded-md">
                  Anggaran Awal: {formatRupiah(currentProker ? currentProker.anggaranBiaya : 0)}
                </span>
              </div>
            </div>

            {/* Mode Switch: Estimasi Proposal vs Realisasi LPJ */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl text-xs">
                <button
                  onClick={() => setRabMode('estimasi')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    rabMode === 'estimasi'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Mode Rencana (Proposal)
                </button>
                <button
                  onClick={() => setRabMode('realisasi')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    rabMode === 'realisasi'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Mode Realisasi (LPJ)
                </button>
              </div>

              <button
                onClick={handleExportRabCsv}
                className="px-3 py-2 bg-white hover:bg-orange-50 text-slate-700 text-xs font-bold rounded-xl border border-orange-200 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Unduh CSV</span>
              </button>
              <button
                onClick={handlePrintRabDoc}
                className="px-3 py-2 bg-white hover:bg-orange-50 text-slate-700 text-xs font-bold rounded-xl border border-orange-200 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4 text-orange-600" />
                <span>Cetak Lembar RAB</span>
              </button>
              <button
                onClick={handleApplyRabToProker}
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan ke Proker</span>
              </button>
              <button
                onClick={() => {
                  handleApplyRabToProker();
                  setActiveMainTab('generator');
                  handleGenerateDocument();
                }}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Lihat di Naskah</span>
              </button>
            </div>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
            <div className="bg-white p-4 rounded-2xl border border-orange-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase text-slate-500">Total Rencana Anggaran (RAB)</span>
              <p className="text-lg font-mono font-black text-orange-700 mt-1">{formatRupiah(totalRencana)}</p>
              <p className="text-[10px] text-slate-500 mt-1 truncate">
                {angkaKeTerbilang(totalRencana)}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase text-slate-500">Total Realisasi Belanja (LPJ)</span>
              <p className="text-lg font-mono font-black text-emerald-700 mt-1">{formatRupiah(totalRealisasi)}</p>
              <p className="text-[10px] text-slate-500 mt-1 truncate">
                {angkaKeTerbilang(totalRealisasi)}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-blue-200/80 shadow-xs">
              <span className="text-[11px] font-bold uppercase text-slate-500">Efisiensi / Saldo Sisa Anggaran</span>
              <p className={`text-lg font-mono font-black mt-1 ${totalSelisih >= 0 ? 'text-blue-700' : 'text-rose-700'}`}>
                {totalSelisih >= 0 ? `+ ${formatRupiah(totalSelisih)}` : `- ${formatRupiah(Math.abs(totalSelisih))}`}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                {totalSelisih >= 0 ? 'Penghematan kas (efisiensi)' : 'Over budget (defisit biaya)'}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-500">Jumlah Pos Rincian</span>
                <p className="text-lg font-mono font-black text-slate-900 mt-1">{rabItems.length} Rincian</p>
                <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Sinkron Otomatis ke Dokumen</span>
                </p>
              </div>
              <button
                onClick={handleResetToDefaultRab}
                title="Reset ke perkiraan awal standar"
                className="p-2 text-slate-400 hover:text-orange-600 rounded-xl hover:bg-orange-50 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Form Tambah Item RAB Baru */}
          <div className="bg-white p-5 rounded-2xl border border-orange-200/80 shadow-xs space-y-3 no-print">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-orange-600" />
              <span>Tambah Rincian Anggaran Baru</span>
            </h3>

            <form onSubmit={handleAddRabItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
              <div className="lg:col-span-2">
                <label className="block font-bold text-slate-600 mb-1">Uraian / Kebutuhan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Cetak Backdrop / Konsumsi Panitia"
                  value={newItem.namaItem}
                  onChange={(e) => setNewItem({ ...newItem, namaItem: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Divisi / Pos</label>
                <select
                  value={newItem.divisi}
                  onChange={(e) => setNewItem({ ...newItem, divisi: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Acara & Lomba">Acara & Lomba</option>
                  <option value="Konsumsi">Konsumsi</option>
                  <option value="Pubdekdok & Media">Pubdekdok & Media</option>
                  <option value="Perlengkapan & Sound">Perlengkapan & Sound</option>
                  <option value="Hadiah & Piagam">Hadiah & Piagam</option>
                  <option value="Kesekretariatan & ATK">Kesekretariatan & ATK</option>
                  <option value="Lain-lain">Lain-lain</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Volume Rencana</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={newItem.volume}
                  onChange={(e) => {
                    const vol = parseInt(e.target.value) || 1;
                    setNewItem({
                      ...newItem,
                      volume: vol,
                      realisasiVolume: vol,
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Satuan</label>
                <input
                  type="text"
                  required
                  placeholder="Porsi/Kotak/Paket"
                  value={newItem.satuan}
                  onChange={(e) => setNewItem({ ...newItem, satuan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Harga Satuan (Rp)</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    required
                    value={newItem.hargaSatuan}
                    onChange={(e) => {
                      const harga = parseInt(e.target.value) || 0;
                      setNewItem({
                        ...newItem,
                        hargaSatuan: harga,
                        realisasiHargaSatuan: harga,
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer"
                    title="Tambah item"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Table RAB Items */}
          <div className="bg-white rounded-2xl border border-orange-200/80 shadow-xs overflow-hidden">
            <div className="p-4 bg-orange-50/50 border-b border-orange-100 flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="font-extrabold text-slate-800">
                Tabel Rincian Kalkulator RAB ({rabMode === 'estimasi' ? 'Mode Rencana Proposal' : 'Mode Realisasi LPJ'})
              </span>
              <span className="text-[11px] text-slate-500 italic">
                * Kolom tabel ini dicetak persis ke dalam naskah Proposal & LPJ resmi.
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-orange-50/70 border-b border-orange-200/80 text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">No</th>
                    <th className="py-3 px-4 min-w-[200px]">Uraian Kebutuhan</th>
                    <th className="py-3 px-3 min-w-[130px]">Divisi / Pos</th>
                    <th className="py-3 px-3 text-center min-w-[90px]">Volume</th>
                    <th className="py-3 px-3 min-w-[80px]">Satuan</th>
                    <th className="py-3 px-4 text-right min-w-[120px]">Tarif Rencana</th>
                    <th className="py-3 px-4 text-right min-w-[130px]">Subtotal Rencana</th>

                    {/* Additional columns when in Realisasi LPJ Mode */}
                    {rabMode === 'realisasi' && (
                      <>
                        <th className="py-3 px-3 text-center min-w-[90px] bg-emerald-100/50 text-emerald-900">Vol Riil</th>
                        <th className="py-3 px-4 text-right min-w-[120px] bg-emerald-100/50 text-emerald-900">Tarif Riil</th>
                        <th className="py-3 px-4 text-right min-w-[130px] bg-emerald-100/50 text-emerald-900">Subtotal Riil</th>
                        <th className="py-3 px-3 text-center min-w-[100px] bg-blue-100/50 text-blue-900">Efisiensi</th>
                      </>
                    )}

                    <th className="py-3 px-3 text-right no-print w-14">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rabItems.map((item, idx) => {
                    const subtotalRencana = item.volume * item.hargaSatuan;
                    const volRiil = item.realisasiVolume !== undefined ? item.realisasiVolume : item.volume;
                    const tarifRiil = item.realisasiHargaSatuan !== undefined ? item.realisasiHargaSatuan : item.hargaSatuan;
                    const subtotalRiil = volRiil * tarifRiil;
                    const selisih = subtotalRencana - subtotalRiil;

                    return (
                      <tr key={item.id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <input
                            type="text"
                            value={item.namaItem}
                            onChange={(e) => handleUpdateItemValue(item.id, 'namaItem', e.target.value)}
                            className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-orange-500 focus:bg-white px-1 py-0.5 rounded outline-none font-bold text-slate-900"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={item.divisi}
                            onChange={(e) => handleUpdateItemValue(item.id, 'divisi', e.target.value as any)}
                            className="bg-transparent border border-slate-200 hover:border-orange-300 rounded px-1.5 py-0.5 text-[11px] font-semibold text-slate-700"
                          >
                            <option value="Acara & Lomba">Acara & Lomba</option>
                            <option value="Konsumsi">Konsumsi</option>
                            <option value="Pubdekdok & Media">Pubdekdok & Media</option>
                            <option value="Perlengkapan & Sound">Perlengkapan & Sound</option>
                            <option value="Hadiah & Piagam">Hadiah & Piagam</option>
                            <option value="Kesekretariatan & ATK">Kesekretariatan & ATK</option>
                            <option value="Lain-lain">Lain-lain</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <input
                            type="number"
                            min={1}
                            value={item.volume}
                            onChange={(e) => handleUpdateItemValue(item.id, 'volume', parseInt(e.target.value) || 1)}
                            className="w-16 text-center font-mono font-bold border border-slate-200 hover:border-orange-300 focus:border-orange-500 rounded px-1 py-0.5 text-slate-900"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            value={item.satuan}
                            onChange={(e) => handleUpdateItemValue(item.id, 'satuan', e.target.value)}
                            className="w-16 border border-slate-200 hover:border-orange-300 focus:border-orange-500 rounded px-1 py-0.5 text-slate-600 text-center"
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <input
                            type="number"
                            min={0}
                            value={item.hargaSatuan}
                            onChange={(e) => handleUpdateItemValue(item.id, 'hargaSatuan', parseInt(e.target.value) || 0)}
                            className="w-24 text-right font-mono border border-slate-200 hover:border-orange-300 focus:border-orange-500 rounded px-1 py-0.5 text-slate-800"
                          />
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-900">
                          {formatRupiah(subtotalRencana)}
                        </td>

                        {/* Editable Realisasi in Realisasi LPJ Mode */}
                        {rabMode === 'realisasi' && (
                          <>
                            <td className="py-3 px-3 text-center bg-emerald-50/50">
                              <input
                                type="number"
                                min={0}
                                value={volRiil}
                                onChange={(e) => handleUpdateItemValue(item.id, 'realisasiVolume', parseInt(e.target.value) || 0)}
                                className="w-16 text-center font-mono font-bold border border-emerald-300 rounded px-1 py-0.5 text-emerald-950 bg-white"
                              />
                            </td>
                            <td className="py-3 px-4 text-right bg-emerald-50/50">
                              <input
                                type="number"
                                min={0}
                                value={tarifRiil}
                                onChange={(e) => handleUpdateItemValue(item.id, 'realisasiHargaSatuan', parseInt(e.target.value) || 0)}
                                className="w-24 text-right font-mono border border-emerald-300 rounded px-1 py-0.5 text-emerald-950 bg-white"
                              />
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-extrabold text-emerald-800 bg-emerald-50/50">
                              {formatRupiah(subtotalRiil)}
                            </td>
                            <td className="py-3 px-3 text-center bg-blue-50/40 text-[11px] font-bold">
                              {selisih > 0 ? (
                                <span className="text-emerald-700">+{formatRupiah(selisih)}</span>
                              ) : selisih < 0 ? (
                                <span className="text-rose-700">-{formatRupiah(Math.abs(selisih))}</span>
                              ) : (
                                <span className="text-slate-500">Pas (0)</span>
                              )}
                            </td>
                          </>
                        )}

                        <td className="py-3 px-3 text-right no-print">
                          <button
                            onClick={() => handleDeleteRabItem(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Hapus rincian"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Summary Totals Row */}
                  <tr className="bg-orange-50/80 font-black text-slate-900 border-t-2 border-orange-200">
                    <td colSpan={6} className="py-3.5 px-4 text-right uppercase tracking-wider text-xs">
                      TOTAL ESTIMASI ANGGARAN (RAB):
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-sm text-orange-700">
                      {formatRupiah(totalRencana)}
                    </td>

                    {rabMode === 'realisasi' && (
                      <>
                        <td colSpan={2} className="py-3.5 px-4 text-right uppercase tracking-wider text-xs text-emerald-900 bg-emerald-100/70">
                          REALISASI RIIL:
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-sm text-emerald-800 bg-emerald-100/70">
                          {formatRupiah(totalRealisasi)}
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono text-xs text-blue-900 bg-blue-100/70">
                          {totalSelisih >= 0 ? `+${formatRupiah(totalSelisih)}` : `-${formatRupiah(Math.abs(totalSelisih))}`}
                        </td>
                      </>
                    )}

                    <td className="no-print" />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
