import React, { useState, useRef, useMemo } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Filter,
  Download,
  Printer,
  Receipt,
  Upload,
  Trash2,
  X,
  Eye,
  FileSpreadsheet,
  CheckCircle,
  FileText,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useOsis } from '../../context/OsisContext';
import { TransaksiKas, KategoriKas, TipeTransaksi } from '../../types';
import { exportToCSV, formatRupiah, formatDateIndo, fileToBase64, downloadFile } from '../../utils/exportUtils';
import { generateLaporanKasHtml } from '../../utils/documentTemplates';

export const KeuanganView: React.FC = () => {
  const { schoolProfile, kas, addKas, deleteKas, totalKasMasuk, totalKasKeluar, saldoKas, pengurus } = useOsis();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<string>('all');
  const [selectedTipe, setSelectedTipe] = useState<'all' | 'masuk' | 'keluar'>('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  // Print Report Modal State
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printPeriodType, setPrintPeriodType] = useState<'semua' | 'bulan_ini' | 'pilih_bulan'>('semua');
  const [printSelectedMonth, setPrintSelectedMonth] = useState<string>(
    String(new Date().getMonth() + 1).padStart(2, '0')
  );
  const [printSelectedYear, setPrintSelectedYear] = useState<string>(String(new Date().getFullYear()));
  const [printFilterTipe, setPrintFilterTipe] = useState<'all' | 'masuk' | 'keluar'>('all');

  const printIframeRef = useRef<HTMLIFrameElement>(null);

  const [formData, setFormData] = useState<Omit<TransaksiKas, 'id'>>({
    tanggal: new Date().toISOString().split('T')[0],
    tipe: 'masuk',
    kategori: 'Iuran Kas Rutin',
    jumlah: 100000,
    deskripsi: '',
    penanggungJawab: pengurus.find((p) => p.jabatan.includes('Bendahara'))?.nama || pengurus[0]?.nama || 'Bendahara OSIS',
    noKwitansi: `KW/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(kas.length + 1).padStart(3, '0')}`,
    buktiNotaUrl: '',
  });

  const kategoriOptions: KategoriKas[] = [
    'Iuran Kas Rutin',
    'Alokasi Dana BOS / Sekolah',
    'Sponsorship & Donasi',
    'Dana Usaha Siswa',
    'Pengadaan ATK & Dokumen',
    'Konsumsi & Logistik',
    'Perlengkapan & Sound System',
    'Hadiah, Piala & Piagam',
    'Transportasi & Operasional',
    'Lain-lain',
  ];

  // Filtering for table display
  const filteredKas = kas.filter((item) => {
    const matchesSearch =
      item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.noKwitansi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.penanggungJawab.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKategori = selectedKategori === 'all' || item.kategori === selectedKategori;
    const matchesTipe = selectedTipe === 'all' || item.tipe === selectedTipe;
    return matchesSearch && matchesKategori && matchesTipe;
  });

  // Calculate filtered transactions for printable report
  const { reportKasList, reportTotalMasuk, reportTotalKeluar, reportSaldo, reportTitle } = useMemo(() => {
    let list = [...kas];

    // Filter by period
    if (printPeriodType === 'bulan_ini') {
      const now = new Date();
      const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      list = list.filter((item) => item.tanggal.startsWith(currentYearMonth));
    } else if (printPeriodType === 'pilih_bulan') {
      const targetPrefix = `${printSelectedYear}-${printSelectedMonth}`;
      list = list.filter((item) => item.tanggal.startsWith(targetPrefix));
    }

    // Filter by type
    if (printFilterTipe !== 'all') {
      list = list.filter((item) => item.tipe === printFilterTipe);
    }

    // Sort chronologically
    list.sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

    const masuk = list.filter((k) => k.tipe === 'masuk').reduce((acc, curr) => acc + curr.jumlah, 0);
    const keluar = list.filter((k) => k.tipe === 'keluar').reduce((acc, curr) => acc + curr.jumlah, 0);
    const saldo = masuk - keluar;

    let titlePeriod = `Tahun Pelajaran ${schoolProfile.masaBakti} · ${schoolProfile.namaKabinet}`;
    if (printPeriodType === 'bulan_ini') {
      const bulanNama = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date());
      titlePeriod = `Periode Bulan ${bulanNama} · Masa Bakti ${schoolProfile.masaBakti}`;
    } else if (printPeriodType === 'pilih_bulan') {
      const dateObj = new Date(parseInt(printSelectedYear), parseInt(printSelectedMonth) - 1, 1);
      const bulanNama = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(dateObj);
      titlePeriod = `Periode Bulan ${bulanNama} · Masa Bakti ${schoolProfile.masaBakti}`;
    }

    if (printFilterTipe === 'masuk') {
      titlePeriod += ' (Khusus Rekapitulasi Kas Masuk)';
    } else if (printFilterTipe === 'keluar') {
      titlePeriod += ' (Khusus Rekapitulasi Kas Keluar)';
    }

    return {
      reportKasList: list,
      reportTotalMasuk: masuk,
      reportTotalKeluar: keluar,
      reportSaldo: saldo,
      reportTitle: titlePeriod,
    };
  }, [kas, printPeriodType, printSelectedMonth, printSelectedYear, printFilterTipe, schoolProfile]);

  const bendaharaName = useMemo(() => {
    return (
      pengurus.find((p) => p.jabatan.toLowerCase().includes('bendahara'))?.nama ||
      kas[0]?.penanggungJawab ||
      'Bendahara Umum OSIS'
    );
  }, [pengurus, kas]);

  // Generate printable HTML
  const reportHtml = useMemo(() => {
    return generateLaporanKasHtml(
      schoolProfile,
      reportKasList,
      reportTotalMasuk,
      reportTotalKeluar,
      reportSaldo,
      reportTitle,
      bendaharaName
    );
  }, [schoolProfile, reportKasList, reportTotalMasuk, reportTotalKeluar, reportSaldo, reportTitle, bendaharaName]);

  const handleOpenAdd = (defaultTipe: TipeTransaksi = 'masuk') => {
    setFormData({
      tanggal: new Date().toISOString().split('T')[0],
      tipe: defaultTipe,
      kategori: defaultTipe === 'masuk' ? 'Iuran Kas Rutin' : 'Pengadaan ATK & Dokumen',
      jumlah: 50000,
      deskripsi: '',
      penanggungJawab: pengurus.find((p) => p.jabatan.includes('Bendahara'))?.nama || pengurus[0]?.nama || 'Bendahara OSIS',
      noKwitansi: `KW/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(kas.length + 1).padStart(3, '0')}`,
      buktiNotaUrl: '',
    });
    setIsFormOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        setFormData((prev) => ({ ...prev, buktiNotaUrl: base64 }));
      } catch (err) {
        alert('Gagal membaca file nota.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.deskripsi || formData.jumlah <= 0) {
      alert('Deskripsi dan jumlah kas harus diisi dengan benar.');
      return;
    }
    addKas(formData);
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, deskripsi: string) => {
    if (window.confirm(`Yakin ingin menghapus catatan kas "${deskripsi}"?`)) {
      deleteKas(id);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'No Kwitansi',
      'Tanggal',
      'Tipe',
      'Kategori',
      'Deskripsi / Uraian',
      'Pemasukan (Rp)',
      'Pengeluaran (Rp)',
      'Penanggung Jawab',
    ];
    const rows = kas.map((t) => [
      t.noKwitansi,
      t.tanggal,
      t.tipe.toUpperCase(),
      t.kategori,
      t.deskripsi,
      t.tipe === 'masuk' ? t.jumlah : 0,
      t.tipe === 'keluar' ? t.jumlah : 0,
      t.penanggungJawab,
    ]);
    exportToCSV(
      headers,
      rows,
      `BUKU_KAS_UMUM_OSIS_${schoolProfile.namaSekolah.replace(/\s+/g, '_')}_${schoolProfile.masaBakti.replace('/', '_')}.csv`
    );
  };

  // Safe printing execution from iframe
  const handlePrintDocument = () => {
    if (printIframeRef.current && printIframeRef.current.contentWindow) {
      try {
        printIframeRef.current.contentWindow.focus();
        printIframeRef.current.contentWindow.print();
        return;
      } catch (err) {
        console.warn('Iframe print failed, falling back to window.print', err);
      }
    }
    window.print();
  };

  // Download Standalone HTML report
  const handleDownloadHtml = () => {
    const fileName = `BUKU_KAS_UMUM_OSIS_${schoolProfile.namaSekolah.replace(/\s+/g, '_')}_${schoolProfile.masaBakti.replace('/', '_')}.html`;
    downloadFile(reportHtml, fileName, 'text/html;charset=utf-8');
  };

  return (
    <>
      {/* NATIVE PRINT TARGET (Displays only when printing the main window) */}
      <div
        className="hidden print:block printable-document"
        dangerouslySetInnerHTML={{ __html: reportHtml }}
      />

      {/* REGULAR WEB APPLICATION VIEW */}
      <div className="space-y-6 no-print">
        {/* Top Banner & Balance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current Balance */}
          <div className="bg-white p-5 rounded-2xl border border-orange-200/80 shadow-xs hover:border-orange-300 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Saldo Kas Riil Saat Ini</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-slate-900 tabular-nums">
              {formatRupiah(saldoKas)}
            </div>
            <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1 font-medium">
              <span>Kas Bendahara OSIS {schoolProfile.namaKabinet}</span>
            </div>
          </div>

          {/* Total Inflow */}
          <div className="bg-white p-5 rounded-2xl border border-orange-200/80 shadow-xs hover:border-orange-300 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Total Pemasukan Kas</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-emerald-600 tabular-nums">
              {formatRupiah(totalKasMasuk)}
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              Dari iuran rutin, BOS sekolah, sponsor & danus
            </div>
          </div>

          {/* Total Outflow */}
          <div className="bg-white p-5 rounded-2xl border border-orange-200/80 shadow-xs hover:border-orange-300 transition-all">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Total Pengeluaran Kas</span>
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-rose-600 tabular-nums">
              {formatRupiah(totalKasKeluar)}
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              Untuk operasional sekretariat, logistik & kegiatan
            </div>
          </div>
        </div>

        {/* Action Header */}
        <div className="bg-white p-5 rounded-2xl border border-orange-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-600" />
              Buku Kas Umum (BKU) OSIS {schoolProfile.masaBakti}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pencatatan keuangan kas transparan, akuntabel, disertai kwitansi resmi dan cetak dokumen dinas
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Download pembukuan kas format Excel CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              Unduh CSV
            </button>
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/20"
              title="Buka Pratinjau & Cetak Buku Kas Umum Resmi"
            >
              <Printer className="w-4 h-4 text-white" />
              Cetak Laporan Kas
            </button>
            <button
              onClick={() => handleOpenAdd('masuk')}
              className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              + Pemasukan
            </button>
            <button
              onClick={() => handleOpenAdd('keluar')}
              className="px-3.5 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-600 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              - Pengeluaran
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-orange-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari uraian, kwitansi, penanggung jawab..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Tipe filter */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-xl text-xs">
              <button
                onClick={() => setSelectedTipe('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  selectedTipe === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setSelectedTipe('masuk')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  selectedTipe === 'masuk' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Pemasukan
              </button>
              <button
                onClick={() => setSelectedTipe('keluar')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  selectedTipe === 'keluar' ? 'bg-white text-rose-800 shadow-2xs' : 'text-slate-600'
                }`}
              >
                Pengeluaran
              </button>
            </div>

            {/* Kategori filter */}
            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium"
            >
              <option value="all">Semua Kategori Kas</option>
              {kategoriOptions.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Kas Ledger Table */}
        <div className="bg-white rounded-2xl border border-orange-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">No. Kwitansi</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Kategori & Uraian</th>
                  <th className="py-3 px-4">Penanggung Jawab</th>
                  <th className="py-3 px-4 text-center">Nota / Bukti</th>
                  <th className="py-3 px-4 text-right">Jumlah</th>
                  <th className="py-3 px-4 text-right no-print">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredKas.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-600 whitespace-nowrap">
                      {t.noKwitansi}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-700">
                      {formatDateIndo(t.tanggal)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{t.deskripsi}</div>
                      <div className="text-[11px] text-slate-500">{t.kategori}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                      {t.penanggungJawab}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {t.buktiNotaUrl ? (
                        <button
                          onClick={() => setSelectedReceipt(t.buktiNotaUrl || null)}
                          className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100"
                        >
                          <Eye className="w-3 h-3" />
                          Lihat Nota
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Tanpa Nota</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div
                        className={`font-mono font-bold text-sm tabular-nums ${
                          t.tipe === 'masuk' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {t.tipe === 'masuk' ? '+' : '-'} {formatRupiah(t.jumlah)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap no-print">
                      <button
                        onClick={() => handleDelete(t.id, t.deskripsi)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Transaksi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredKas.length === 0 && (
            <div className="p-12 text-center text-slate-500 text-xs">
              Belum ada catatan transaksi kas yang sesuai kriteria.
            </div>
          )}
        </div>

        {/* Add Transaction Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h2 className="text-base font-bold text-slate-900">
                  {formData.tipe === 'masuk' ? 'Catat Pemasukan Kas' : 'Catat Pengeluaran Kas'}
                </h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Jenis Transaksi
                    </label>
                    <select
                      value={formData.tipe}
                      onChange={(e) => setFormData({ ...formData, tipe: e.target.value as TipeTransaksi })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-orange-500 font-medium"
                    >
                      <option value="masuk">Pemasukan (+)</option>
                      <option value="keluar">Pengeluaran (-)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tanggal Transaksi
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.tanggal}
                      onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-orange-500"
                    >
                    </input>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori Kas
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as KategoriKas })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-orange-500"
                  >
                    {kategoriOptions.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nominal Jumlah (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={formData.jumlah}
                    onChange={(e) => setFormData({ ...formData, jumlah: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-orange-500 font-mono text-sm font-bold"
                    placeholder="Contoh: 150000"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Uraian / Deskripsi Pengeluaran/Pemasukan *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-1 focus:ring-orange-500"
                    placeholder="Contoh: Pembelian kertas sertifikat A4 & tinta stempel OSIS"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      No. Kwitansi
                    </label>
                    <input
                      type="text"
                      value={formData.noKwitansi}
                      onChange={(e) => setFormData({ ...formData, noKwitansi: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Penanggung Jawab (PJ)
                    </label>
                    <input
                      type="text"
                      value={formData.penanggungJawab}
                      onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Upload Nota Fisik */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Upload Foto Bukti Nota / Kwitansi Fisik (Opsional)
                  </label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-slate-600" />
                      Pilih File Foto Nota
                      <input type="file" accept="image/*,application/pdf" onChange={handleFileUpload} className="hidden" />
                    </label>
                    {formData.buktiNotaUrl ? (
                      <span className="text-[11px] text-emerald-600 font-semibold">✓ Nota Terlampir</span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Belum ada nota</span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 font-bold text-slate-700 hover:bg-slate-100 rounded-xl border border-slate-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs"
                  >
                    Simpan Transaksi
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Nota Preview Modal */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-4 flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <h3 className="text-sm font-bold text-slate-900">Bukti Nota / Kwitansi Transaksi</h3>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-auto rounded-lg border border-slate-200 p-2">
                <img src={selectedReceipt} alt="Bukti Nota" className="max-w-full h-auto object-contain" />
              </div>
              <div className="w-full pt-3 mt-3 border-t border-slate-200 flex justify-end gap-2">
                <a
                  href={selectedReceipt}
                  download="nota_kwitansi_osis.jpg"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  Unduh File Nota
                </a>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL PRATINJAU & CETAK LAPORAN KAS RESMI (BUKU KAS UMUM) */}
        {isPrintModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
              {/* Modal Header */}
              <div className="px-6 py-4 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-600/30 border border-orange-500/40 flex items-center justify-center text-orange-400">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold flex items-center gap-2">
                      <span>Cetak & Pratinjau Buku Kas Umum (BKU) OSIS</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30 font-semibold">
                        Standar Dinas Sekolah
                      </span>
                    </h2>
                    <p className="text-xs text-slate-300">
                      Laporan keuangan resmi lengkap dengan Kop Surat, tabel arus kas, saldo terbilang, dan lembar pengesahan 4 tanda tangan
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Controls Toolbar */}
              <div className="p-4 bg-orange-50/70 border-b border-orange-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Filter Options */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-orange-600" />
                      Periode:
                    </span>
                    <select
                      value={printPeriodType}
                      onChange={(e) => setPrintPeriodType(e.target.value as any)}
                      className="px-2.5 py-1.5 bg-white border border-orange-200 rounded-lg font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 shadow-2xs"
                    >
                      <option value="semua">Semua (Masa Bakti Penuh)</option>
                      <option value="bulan_ini">Bulan Berjalan Saat Ini</option>
                      <option value="pilih_bulan">Pilih Bulan Tertentu</option>
                    </select>
                  </div>

                  {printPeriodType === 'pilih_bulan' && (
                    <div className="flex items-center gap-1.5">
                      <select
                        value={printSelectedMonth}
                        onChange={(e) => setPrintSelectedMonth(e.target.value)}
                        className="px-2 py-1.5 bg-white border border-orange-200 rounded-lg font-medium text-slate-800"
                      >
                        <option value="01">Januari</option>
                        <option value="02">Februari</option>
                        <option value="03">Maret</option>
                        <option value="04">April</option>
                        <option value="05">Mei</option>
                        <option value="06">Juni</option>
                        <option value="07">Juli</option>
                        <option value="08">Agustus</option>
                        <option value="09">September</option>
                        <option value="10">Oktober</option>
                        <option value="11">November</option>
                        <option value="12">Desember</option>
                      </select>
                      <select
                        value={printSelectedYear}
                        onChange={(e) => setPrintSelectedYear(e.target.value)}
                        className="px-2 py-1.5 bg-white border border-orange-200 rounded-lg font-medium text-slate-800"
                      >
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                      </select>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-700">Tipe Kas:</span>
                    <select
                      value={printFilterTipe}
                      onChange={(e) => setPrintFilterTipe(e.target.value as any)}
                      className="px-2.5 py-1.5 bg-white border border-orange-200 rounded-lg font-medium text-slate-800 shadow-2xs"
                    >
                      <option value="all">Semua Arus Kas</option>
                      <option value="masuk">Hanya Pemasukan</option>
                      <option value="keluar">Hanya Pengeluaran</option>
                    </select>
                  </div>
                </div>

                {/* Print & Download Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadHtml}
                    className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                    title="Unduh berkas dokumen HTML mandiri (bisa dibuka di browser apa pun untuk dicetak kapan saja)"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>Unduh HTML Cetak</span>
                  </button>
                  <button
                    onClick={handlePrintDocument}
                    className="px-4 py-1.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white rounded-xl font-extrabold flex items-center gap-2 transition-all shadow-md shadow-orange-500/20"
                    title="Cetak langsung ke printer atau simpan sebagai PDF"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Sekarang (Print / PDF)</span>
                  </button>
                </div>
              </div>

              {/* Document Frame / Live Preview */}
              <div className="p-4 md:p-6 bg-slate-100/90 flex-1 overflow-y-auto flex justify-center">
                <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-slate-300 overflow-hidden min-h-[500px]">
                  <iframe
                    ref={printIframeRef}
                    srcDoc={reportHtml}
                    title="Pratinjau Dokumen BKU Kas OSIS"
                    className="w-full min-h-[750px] border-0"
                  />
                </div>
              </div>

              {/* Modal Footer Info */}
              <div className="px-6 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>
                    Menampilkan <strong>{reportKasList.length}</strong> transaksi kas · Total Saldo: <strong>{formatRupiah(reportSaldo)}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">
                    Jika dialog printer browser tidak muncul di iframe, gunakan tombol <strong>Unduh HTML Cetak</strong>.
                  </span>
                  <button
                    onClick={() => setIsPrintModalOpen(false)}
                    className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
