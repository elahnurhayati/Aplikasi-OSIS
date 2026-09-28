import React, { useState } from 'react';
import {
  Wallet,
  PlusCircle,
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
} from 'lucide-react';
import { useOsis } from '../../context/OsisContext';
import { TransaksiKas, KategoriKas, TipeTransaksi } from '../../types';
import { exportToCSV, formatRupiah, formatDateIndo, fileToBase64 } from '../../utils/exportUtils';

export const KeuanganView: React.FC = () => {
  const { schoolProfile, kas, addKas, deleteKas, totalKasMasuk, totalKasKeluar, saldoKas, pengurus } = useOsis();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<string>('all');
  const [selectedTipe, setSelectedTipe] = useState<'all' | 'masuk' | 'keluar'>('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

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

  // Filtering
  const filteredKas = kas.filter((item) => {
    const matchesSearch =
      item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.noKwitansi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.penanggungJawab.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKategori = selectedKategori === 'all' || item.kategori === selectedKategori;
    const matchesTipe = selectedTipe === 'all' || item.tipe === selectedTipe;
    return matchesSearch && matchesKategori && matchesTipe;
  });

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
      `BUKU_KAS_UMUM_OSIS_${schoolProfile.masaBakti.replace('/', '_')}.csv`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Balance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Balance */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Saldo Kas Riil Saat Ini</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {formatRupiah(saldoKas)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Kas Bendahara OSIS {schoolProfile.namaKabinet}
          </div>
        </div>

        {/* Total Inflow */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Pemasukan Kas</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
            {formatRupiah(totalKasMasuk)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Dari iuran, BOS sekolah, sponsor & danus
          </div>
        </div>

        {/* Total Outflow */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Pengeluaran Kas</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 tabular-nums">
            {formatRupiah(totalKasKeluar)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            Untuk operasional, logistik & kegiatan
          </div>
        </div>
      </div>

      {/* Action Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600" />
            Buku Kas Umum (BKU) OSIS {schoolProfile.masaBakti}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan keuangan transparan, akuntabel, dan dilengkapi bukti nota fisik
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Download pembukuan kas format Excel CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Unduh CSV Kas
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Cetak Laporan Keuangan"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            Cetak Laporan Kas
          </button>
          <button
            onClick={() => handleOpenAdd('masuk')}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            + Pemasukan
          </button>
          <button
            onClick={() => handleOpenAdd('keluar')}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-600 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            - Pengeluaran
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari uraian, kwitansi, penanggung jawab..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Tipe filter */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setSelectedTipe('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedTipe === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setSelectedTipe('masuk')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedTipe === 'masuk' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Pemasukan
            </button>
            <button
              onClick={() => setSelectedTipe('keluar')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
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
            className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
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
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
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
                    <div className="font-semibold text-slate-900">{t.deskripsi}</div>
                    <div className="text-[11px] text-slate-500">{t.kategori}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                    {t.penanggungJawab}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {t.buktiNotaUrl ? (
                      <button
                        onClick={() => setSelectedReceipt(t.buktiNotaUrl || null)}
                        className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-2 py-0.5 rounded"
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
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md"
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
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 font-medium"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kategori Kas
                </label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value as KategoriKas })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 font-mono text-sm font-bold"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Upload Nota Fisik */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Upload Foto Bukti Nota / Kwitansi Fisik (Opsional)
                </label>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
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
                  className="px-4 py-2 font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
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
    </div>
  );
};
