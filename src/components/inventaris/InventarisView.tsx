import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  Trash2,
  Edit2,
  X,
  FileSpreadsheet,
  FileCheck,
  Shield,
  Layers,
  ArrowRightLeft,
  Flame,
} from 'lucide-react';
import { useOsis } from '../../context/OsisContext';
import { InventarisBarang, PeminjamanBarang, KategoriBarang } from '../../types';
import { exportToCsv, downloadFile } from '../../utils/exportUtils';

export const InventarisView: React.FC = () => {
  const {
    schoolProfile,
    inventaris,
    addInventaris,
    updateInventaris,
    deleteInventaris,
    peminjaman,
    addPeminjaman,
    updatePeminjamanStatus,
    deletePeminjaman,
  } = useOsis();

  const [activeSubTab, setActiveSubTab] = useState<'katalog' | 'peminjaman'>('katalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<string>('Semua');

  // Modals
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventarisBarang | null>(null);

  const [showPinjamModal, setShowPinjamModal] = useState(false);
  const [suratPinjamData, setSuratPinjamData] = useState<PeminjamanBarang | null>(null);

  // Form Item State
  const [itemForm, setItemForm] = useState<Omit<InventarisBarang, 'id'>>({
    kodeBarang: '',
    namaBarang: '',
    kategori: 'Sound & Elektronik',
    jumlahTotal: 1,
    kondisiBaik: 1,
    kondisiRusak: 0,
    sedangDipinjam: 0,
    lokasi: 'Ruang Sekretariat OSIS',
    keterangan: '',
  });

  // Form Pinjam State
  const [pinjamForm, setPinjamForm] = useState<Omit<PeminjamanBarang, 'id' | 'kodePinjam'>>({
    namaPeminjam: '',
    kontak: '',
    organisasiAtauKelas: '',
    namaBarang: '',
    jumlah: 1,
    tanggalPinjam: new Date().toISOString().split('T')[0],
    rencanaKembali: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    status: 'Aktif Dipinjam',
    petugasOsis: schoolProfile.ketuaOsis,
    catatan: '',
  });

  // KPI calculations
  const totalItemCount = inventaris.reduce((acc, curr) => acc + curr.jumlahTotal, 0);
  const totalBaikCount = inventaris.reduce((acc, curr) => acc + curr.kondisiBaik, 0);
  const totalRusakCount = inventaris.reduce((acc, curr) => acc + curr.kondisiRusak, 0);
  const totalDipinjamCount = peminjaman.filter((p) => p.status === 'Aktif Dipinjam').reduce((acc, curr) => acc + curr.jumlah, 0);

  // Filtered inventaris
  const filteredInventaris = inventaris.filter((item) => {
    const matchSearch =
      item.namaBarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kodeBarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKat = selectedKategori === 'Semua' || item.kategori === selectedKategori;
    return matchSearch && matchKat;
  });

  // Filtered peminjaman
  const filteredPeminjaman = peminjaman.filter((p) => {
    return (
      p.namaPeminjam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.namaBarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.organisasiAtauKelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.kodePinjam.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setItemForm({
      kodeBarang: `INV/LOG/${String(inventaris.length + 1).padStart(3, '0')}`,
      namaBarang: '',
      kategori: 'Sound & Elektronik',
      jumlahTotal: 1,
      kondisiBaik: 1,
      kondisiRusak: 0,
      sedangDipinjam: 0,
      lokasi: 'Ruang Sekretariat OSIS',
      keterangan: '',
    });
    setShowItemModal(true);
  };

  const handleOpenEditModal = (item: InventarisBarang) => {
    setEditingItem(item);
    setItemForm({
      kodeBarang: item.kodeBarang,
      namaBarang: item.namaBarang,
      kategori: item.kategori,
      jumlahTotal: item.jumlahTotal,
      kondisiBaik: item.kondisiBaik,
      kondisiRusak: item.kondisiRusak,
      sedangDipinjam: item.sedangDipinjam,
      lokasi: item.lokasi,
      keterangan: item.keterangan,
    });
    setShowItemModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateInventaris(editingItem.id, itemForm);
    } else {
      addInventaris(itemForm);
    }
    setShowItemModal(false);
  };

  const handleSavePinjam = (e: React.FormEvent) => {
    e.preventDefault();
    addPeminjaman(pinjamForm);
    setShowPinjamModal(false);
  };

  const handleExportInventarisCsv = () => {
    const data = inventaris.map((item, idx) => ({
      No: idx + 1,
      'Kode Barang': item.kodeBarang,
      'Nama Barang': item.namaBarang,
      Kategori: item.kategori,
      'Jumlah Total': item.jumlahTotal,
      'Kondisi Baik': item.kondisiBaik,
      'Kondisi Rusak': item.kondisiRusak,
      'Sedang Dipinjam': item.sedangDipinjam,
      Lokasi: item.lokasi,
      Keterangan: item.keterangan,
    }));
    exportToCsv(data, `Inventaris_OSIS_${schoolProfile.namaSekolah.replace(/\s+/g, '_')}`);
  };

  const handleExportPinjamCsv = () => {
    const data = peminjaman.map((p, idx) => ({
      No: idx + 1,
      'Kode Pinjam': p.kodePinjam,
      'Nama Peminjam': p.namaPeminjam,
      Kontak: p.kontak,
      'Kelas / Organisasi': p.organisasiAtauKelas,
      'Nama Barang': p.namaBarang,
      Jumlah: p.jumlah,
      'Tanggal Pinjam': p.tanggalPinjam,
      'Batas Rencana Kembali': p.rencanaKembali,
      'Tanggal Realisasi Kembali': p.tanggalKembaliNyata || '-',
      Status: p.status,
      'Petugas OSIS': p.petugasOsis,
      Catatan: p.catatan || '',
    }));
    exportToCsv(data, `Peminjaman_Aset_OSIS_${schoolProfile.namaSekolah.replace(/\s+/g, '_')}`);
  };

  const handlePrintSuratPinjam = (p: PeminjamanBarang) => {
    setSuratPinjamData(p);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-200/80 pb-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Package className="w-6 h-6 text-orange-600" />
              <span>Gudang Logistik & Sarana Aset</span>
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-orange-100 text-orange-800 border border-orange-200">
              Perlengkapan Misi 🍃
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manajemen inventaris perlengkapan, sound, panggung, bendera, serta pencatatan peminjaman sarana madrasah/sekolah.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {activeSubTab === 'katalog' ? (
            <>
              <button
                onClick={handleExportInventarisCsv}
                className="px-3 py-2 bg-white hover:bg-orange-50 text-slate-700 text-xs font-bold rounded-xl border border-orange-200 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Unduh CSV</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-2 bg-white hover:bg-orange-50 text-slate-700 text-xs font-bold rounded-xl border border-orange-200 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4 text-orange-600" />
                <span>Cetak Rekap</span>
              </button>
              <button
                onClick={handleOpenAddModal}
                className="px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Barang Baru</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleExportPinjamCsv}
                className="px-3 py-2 bg-white hover:bg-orange-50 text-slate-700 text-xs font-bold rounded-xl border border-orange-200 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Unduh Log Pinjam</span>
              </button>
              <button
                onClick={() => setShowPinjamModal(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Formulir Pinjam Baru</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 no-print">
        <div className="bg-white p-4 rounded-2xl border border-orange-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Jenis Barang</span>
            <div className="p-2 rounded-xl bg-orange-100/70 text-orange-700">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 mt-2 font-mono">
            {inventaris.length} <span className="text-xs font-normal text-slate-500">item ({totalItemCount} unit)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Kondisi Baik / Siap</span>
            <div className="p-2 rounded-xl bg-emerald-100/70 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-emerald-700 mt-2 font-mono">
            {totalBaikCount} <span className="text-xs font-normal text-slate-500">unit</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Sedang Dipinjam</span>
            <div className="p-2 rounded-xl bg-amber-100/70 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-amber-700 mt-2 font-mono">
            {totalDipinjamCount} <span className="text-xs font-normal text-slate-500">unit</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Rusak / Perlu Servis</span>
            <div className="p-2 rounded-xl bg-rose-100/70 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl md:text-2xl font-black text-rose-700 mt-2 font-mono">
            {totalRusakCount} <span className="text-xs font-normal text-slate-500">unit</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Katalog vs Peminjaman */}
      <div className="flex items-center gap-2 border-b border-orange-200/80 no-print">
        <button
          onClick={() => setActiveSubTab('katalog')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'katalog'
              ? 'border-orange-600 text-orange-600 bg-orange-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Katalog Barang & Sarana ({inventaris.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('peminjaman')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'peminjaman'
              ? 'border-orange-600 text-orange-600 bg-orange-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Buku Catatan Peminjaman ({peminjaman.length})</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-3.5 rounded-2xl border border-orange-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 no-print">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeSubTab === 'katalog' ? 'Cari nama barang, kode, lokasi...' : 'Cari peminjam, barang, kelas...'}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-orange-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
          />
        </div>

        {activeSubTab === 'katalog' && (
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Kategori:</span>
            {['Semua', 'Sound & Elektronik', 'Dokumentasi & Pubdekdok', 'Olahraga & Lomba', 'Tenda & Lapangan', 'Kesekretariatan & ATK'].map((kat) => (
              <button
                key={kat}
                onClick={() => setSelectedKategori(kat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedKategori === kat
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-orange-100 hover:text-orange-900'
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SUBTAB 1: KATALOG INVENTARIS */}
      {activeSubTab === 'katalog' && (
        <div className="bg-white rounded-2xl border border-orange-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-orange-50/70 border-b border-orange-200/80 text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Kode & Nama Sarana</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4 text-center">Total Unit</th>
                  <th className="py-3 px-4 text-center">Kondisi Baik</th>
                  <th className="py-3 px-4 text-center">Rusak</th>
                  <th className="py-3 px-4 text-center">Dipinjam</th>
                  <th className="py-3 px-4">Lokasi Penyimpanan</th>
                  <th className="py-3 px-4 text-right no-print">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInventaris.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      Tidak ada barang inventaris yang sesuai dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredInventaris.map((item) => (
                    <tr key={item.id} className="hover:bg-orange-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{item.namaBarang}</div>
                        <div className="text-[10.5px] font-mono text-orange-700 font-semibold">{item.kodeBarang}</div>
                        {item.keterangan && (
                          <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.keterangan}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[11px]">
                          {item.kategori}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-900">
                        {item.jumlahTotal}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-emerald-700">
                        {item.kondisiBaik}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-rose-600">
                        {item.kondisiRusak}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-amber-600">
                        {item.sedangDipinjam}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {item.lokasi}
                      </td>
                      <td className="py-3 px-4 text-right no-print">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            title="Edit data barang"
                            className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus barang "${item.namaBarang}" dari daftar inventaris?`)) {
                                deleteInventaris(item.id);
                              }
                            }}
                            title="Hapus barang"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: PEMINJAMAN SARANA */}
      {activeSubTab === 'peminjaman' && (
        <div className="bg-white rounded-2xl border border-orange-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-orange-50/70 border-b border-orange-200/80 text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">No. Registrasi</th>
                  <th className="py-3 px-4">Peminjam / Kelas / Ekskul</th>
                  <th className="py-3 px-4">Barang & Jumlah</th>
                  <th className="py-3 px-4">Tgl Pinjam & Batas</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Petugas OSIS</th>
                  <th className="py-3 px-4 text-right no-print">Aksi & Surat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPeminjaman.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Belum ada catatan peminjaman barang.
                    </td>
                  </tr>
                ) : (
                  filteredPeminjaman.map((p) => {
                    const isReturned = p.status === 'Sudah Dikembalikan';
                    return (
                      <tr key={p.id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="py-3 px-4 font-mono font-semibold text-orange-800">
                          {p.kodePinjam}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{p.namaPeminjam}</div>
                          <div className="text-[11px] text-slate-500">{p.organisasiAtauKelas} · {p.kontak}</div>
                          {p.catatan && (
                            <div className="text-[10.5px] text-slate-400 italic mt-0.5">Keperluan: {p.catatan}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{p.namaBarang}</div>
                          <span className="text-[11px] font-mono font-bold text-orange-700 bg-orange-100/60 px-1.5 py-0.5 rounded">
                            {p.jumlah} Unit
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[11.5px]">
                          <div>Pinjam: <strong className="text-slate-800">{p.tanggalPinjam}</strong></div>
                          <div>Batas: <strong className="text-amber-800">{p.rencanaKembali}</strong></div>
                          {p.tanggalKembaliNyata && (
                            <div className="text-emerald-700 text-[10.5px]">Kembali: {p.tanggalKembaliNyata}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide inline-flex items-center gap-1 ${
                              p.status === 'Aktif Dipinjam'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : p.status === 'Sudah Dikembalikan'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-rose-100 text-rose-900 border border-rose-300'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {p.petugasOsis}
                        </td>
                        <td className="py-3 px-4 text-right no-print">
                          <div className="flex items-center justify-end gap-1.5">
                            {!isReturned && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Tandai barang "${p.namaBarang}" telah dikembalikan dalam kondisi baik?`)) {
                                    updatePeminjamanStatus(p.id, 'Sudah Dikembalikan');
                                  }
                                }}
                                title="Tandai telah dikembalikan"
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-200 transition-colors flex items-center gap-1"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Kembali</span>
                              </button>
                            )}

                            <button
                              onClick={() => handlePrintSuratPinjam(p)}
                              title="Cetak Surat Bukti Tanda Terima Peminjaman"
                              className="p-1.5 text-slate-500 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm('Hapus riwayat peminjaman ini?')) {
                                  deletePeminjaman(p.id);
                                }
                              }}
                              title="Hapus riwayat"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH / EDIT BARANG */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-orange-200 shadow-2xl overflow-hidden animate-in fade-in duration-150">
            <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                <h3 className="font-extrabold text-sm md:text-base">
                  {editingItem ? 'Edit Data Barang Sarana' : 'Tambah Barang Inventaris Baru'}
                </h3>
              </div>
              <button
                onClick={() => setShowItemModal(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Barang</label>
                  <input
                    type="text"
                    required
                    value={itemForm.kodeBarang}
                    onChange={(e) => setItemForm({ ...itemForm, kodeBarang: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={itemForm.kategori}
                    onChange={(e) => setItemForm({ ...itemForm, kategori: e.target.value as KategoriBarang })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                  >
                    <option value="Sound & Elektronik">Sound & Elektronik</option>
                    <option value="Dokumentasi & Pubdekdok">Dokumentasi & Pubdekdok</option>
                    <option value="Olahraga & Lomba">Olahraga & Lomba</option>
                    <option value="Kesekretariatan & ATK">Kesekretariatan & ATK</option>
                    <option value="Tenda & Lapangan">Tenda & Lapangan</option>
                    <option value="Bendera & Atribut">Bendera & Atribut</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Barang & Tipe/Merk</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Mic Wireless Shure SVX288 / Handy Talkie"
                  value={itemForm.namaBarang}
                  onChange={(e) => setItemForm({ ...itemForm, namaBarang: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jumlah Total</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={itemForm.jumlahTotal}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setItemForm({
                        ...itemForm,
                        jumlahTotal: val,
                        kondisiBaik: Math.max(0, val - itemForm.kondisiRusak),
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kondisi Baik</label>
                  <input
                    type="number"
                    min={0}
                    value={itemForm.kondisiBaik}
                    onChange={(e) => setItemForm({ ...itemForm, kondisiBaik: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-emerald-700 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rusak</label>
                  <input
                    type="number"
                    min={0}
                    value={itemForm.kondisiRusak}
                    onChange={(e) => setItemForm({ ...itemForm, kondisiRusak: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-rose-700 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lokasi Penyimpanan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Lemari Kaca Rak 2 / Gudang Sarpras"
                  value={itemForm.lokasi}
                  onChange={(e) => setItemForm({ ...itemForm, lokasi: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Keterangan / Kelengkapan</label>
                <textarea
                  rows={2}
                  placeholder="Kelengkapan adapter, baterai, kabel, tas, dll."
                  value={itemForm.keterangan}
                  onChange={(e) => setItemForm({ ...itemForm, keterangan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white rounded-xl font-extrabold shadow-md shadow-orange-500/20"
                >
                  Simpan Barang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: FORMULIR PINJAM BARANG */}
      {showPinjamModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-orange-200 shadow-2xl overflow-hidden animate-in fade-in duration-150">
            <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5" />
                <h3 className="font-extrabold text-sm md:text-base">
                  Formulir Peminjaman Sarana OSIS
                </h3>
              </div>
              <button
                onClick={() => setShowPinjamModal(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePinjam} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Peminjam</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama siswa / panitia"
                    value={pinjamForm.namaPeminjam}
                    onChange={(e) => setPinjamForm({ ...pinjamForm, namaPeminjam: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas / Ekskul / Instansi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ekskul Pramuka / Kelas XI-2"
                    value={pinjamForm.organisasiAtauKelas}
                    onChange={(e) => setPinjamForm({ ...pinjamForm, organisasiAtauKelas: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={pinjamForm.kontak}
                    onChange={(e) => setPinjamForm({ ...pinjamForm, kontak: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Petugas OSIS Penerima</label>
                  <input
                    type="text"
                    required
                    value={pinjamForm.petugasOsis}
                    onChange={(e) => setPinjamForm({ ...pinjamForm, petugasOsis: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Pilih Barang yang Dipinjam</label>
                  <select
                    required
                    value={pinjamForm.namaBarang}
                    onChange={(e) => setPinjamForm({ ...pinjamForm, namaBarang: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                  >
                    <option value="">-- Pilih Barang Dari Inventaris --</option>
                    {inventaris.map((item) => (
                      <option key={item.id} value={item.namaBarang}>
                        {item.namaBarang} (Tersedia: {item.kondisiBaik})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jumlah Unit</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={pinjamForm.jumlah}
                    onChange={(e) => setPinjamForm({ ...pinjamForm, jumlah: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Peminjaman</label>
                  <input
                    type="date"
                    required
                    value={pinjamForm.tanggalPinjam}
                    onChange={(e) => setPinjamForm({ ...pinjamForm, tanggalPinjam: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Batas Rencana Kembali</label>
                  <input
                    type="date"
                    required
                    value={pinjamForm.rencanaKembali}
                    onChange={(e) => setPinjamForm({ ...pinjamForm, rencanaKembali: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tujuan / Keperluan Peminjaman</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Digunakan untuk gladi kotor lomba debat / latihan upacara"
                  value={pinjamForm.catatan}
                  onChange={(e) => setPinjamForm({ ...pinjamForm, catatan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinjamModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white rounded-xl font-extrabold shadow-md shadow-orange-500/20"
                >
                  Daftarkan Peminjaman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT-ONLY: SURAT BUKTI TANDA TERIMA PEMINJAMAN SARANA */}
      {suratPinjamData && (
        <div className="hidden print:block fixed inset-0 bg-white p-8 z-50 text-black">
          <div className="text-center pb-4 border-b-2 border-black">
            <h2 className="text-lg font-bold uppercase">{schoolProfile.namaSekolah}</h2>
            <h3 className="text-sm font-semibold tracking-wider">ORGANISASI SISWA INTRA SEKOLAH (OSIS)</h3>
            <p className="text-xs">{schoolProfile.alamat}, {schoolProfile.kota} - Telp: {schoolProfile.telepon}</p>
          </div>

          <div className="text-center my-6">
            <h4 className="text-base font-bold underline uppercase">SURAT BUKTI PEMINJAMAN SARANA & INVENTARIS</h4>
            <p className="text-xs font-mono">Nomor: {suratPinjamData.kodePinjam}</p>
          </div>

          <div className="space-y-4 text-xs leading-relaxed">
            <p>Pada hari ini telah diserahterimakan barang sarana OSIS untuk keperluan kegiatan sekolah dengan rincian berikut:</p>
            
            <table className="w-full border-collapse border border-black my-3">
              <tbody>
                <tr>
                  <td className="border border-black p-2 font-bold w-48">Nama Peminjam</td>
                  <td className="border border-black p-2">{suratPinjamData.namaPeminjam}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Kelas / Organisasi / Ekskul</td>
                  <td className="border border-black p-2">{suratPinjamData.organisasiAtauKelas}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">No. Kontak / WA</td>
                  <td className="border border-black p-2">{suratPinjamData.kontak}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Barang yang Dipinjam</td>
                  <td className="border border-black p-2 font-bold">{suratPinjamData.namaBarang}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Jumlah Unit</td>
                  <td className="border border-black p-2 font-bold">{suratPinjamData.jumlah} Unit</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Tanggal Peminjaman</td>
                  <td className="border border-black p-2">{suratPinjamData.tanggalPinjam}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Batas Pengembalian</td>
                  <td className="border border-black p-2 font-bold">{suratPinjamData.rencanaKembali}</td>
                </tr>
                <tr>
                  <td className="border border-black p-2 font-bold">Keperluan Penggunaan</td>
                  <td className="border border-black p-2">{suratPinjamData.catatan || '-'}</td>
                </tr>
              </tbody>
            </table>

            <p className="italic text-[11px]">
              *Peminjam bersedia menjaga dan bertanggung jawab penuh mengembalikan barang dalam kondisi bersih, utuh, dan berfungsi baik seperti semula tepat waktu.
            </p>

            <div className="grid grid-cols-2 pt-8 text-center">
              <div>
                <p>Pihak Peminjam,</p>
                <div className="h-16" />
                <p className="font-bold underline">{suratPinjamData.namaPeminjam}</p>
              </div>
              <div>
                <p>{schoolProfile.kota}, {suratPinjamData.tanggalPinjam}</p>
                <p>Petugas Inventaris OSIS,</p>
                <div className="h-16" />
                <p className="font-bold underline">{suratPinjamData.petugasOsis}</p>
              </div>
            </div>

            <div className="pt-8 text-center text-[10px] text-gray-500 border-t border-gray-300">
              Dokumen resmi OSIS 360 · Aplikasi dikembangkan oleh Nandi Achdarizal Sutisna
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
