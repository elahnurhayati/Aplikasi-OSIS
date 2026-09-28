import React, { useState } from 'react';
import {
  MessageSquareHeart,
  Plus,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  Send,
  MessageCircle,
  X,
  Trash2,
} from 'lucide-react';
import { useOsis } from '../../context/OsisContext';
import { AspirasiSiswa } from '../../types';
import { exportToCSV, formatDateIndo } from '../../utils/exportUtils';

export const AspirasiView: React.FC = () => {
  const { schoolProfile, aspirasi, addAspirasi, updateAspirasiStatus, deleteAspirasi } = useOsis();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedForResponse, setSelectedForResponse] = useState<AspirasiSiswa | null>(null);

  // New aspiration form state
  const [formData, setFormData] = useState({
    namaSiswa: '',
    kelas: 'XI MIPA 1',
    kategori: 'Fasilitas & Sarpras' as AspirasiSiswa['kategori'],
    judul: '',
    isiAspirasi: '',
  });

  // Response form state
  const [responseText, setResponseText] = useState('');
  const [newStatus, setNewStatus] = useState<AspirasiSiswa['status']>('Sedang Ditindaklanjuti');
  const [responderName, setResponderName] = useState(schoolProfile.ketuaOsis);

  const kategoriOptions: AspirasiSiswa['kategori'][] = [
    'Fasilitas & Sarpras',
    'Kegiatan & Event',
    'Ekstrakurikuler',
    'Kebersihan & Kantin',
    'Akademik & Ujian',
    'Lainnya',
  ];

  const statusOptions: AspirasiSiswa['status'][] = [
    'Menunggu Review',
    'Diteruskan ke Pembina',
    'Sedang Ditindaklanjuti',
    'Selesai Terealisasi',
  ];

  // Filtering
  const filteredAspirasi = aspirasi.filter((item) => {
    const matchesSearch =
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.isiAspirasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.namaSiswa.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesKategori = selectedKategori === 'all' || item.kategori === selectedKategori;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesKategori && matchesStatus;
  });

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul || !formData.isiAspirasi) {
      alert('Judul dan isi aspirasi wajib diisi.');
      return;
    }
    addAspirasi({
      namaSiswa: formData.namaSiswa || 'Siswa Teladan (Anonim)',
      kelas: formData.kelas || '-',
      kategori: formData.kategori,
      judul: formData.judul,
      isiAspirasi: formData.isiAspirasi,
    });
    setFormData({
      namaSiswa: '',
      kelas: 'XI MIPA 1',
      kategori: 'Fasilitas & Sarpras',
      judul: '',
      isiAspirasi: '',
    });
    setIsFormOpen(false);
  };

  const handleOpenResponse = (item: AspirasiSiswa) => {
    setSelectedForResponse(item);
    setResponseText(item.responOsis || '');
    setNewStatus(item.status);
    setResponderName(item.ditanganiOleh || schoolProfile.ketuaOsis);
  };

  const handleSaveResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForResponse) return;
    updateAspirasiStatus(selectedForResponse.id, newStatus, responseText, responderName);
    setSelectedForResponse(null);
  };

  const handleExportCSV = () => {
    const headers = [
      'Tanggal',
      'Pengirim',
      'Kelas',
      'Kategori',
      'Judul Aspirasi',
      'Isi Pesan',
      'Status Tindak Lanjut',
      'Respon OSIS',
      'Ditangani Oleh',
    ];
    const rows = aspirasi.map((a) => [
      a.tanggal,
      a.namaSiswa,
      a.kelas,
      a.kategori,
      a.judul,
      a.isiAspirasi,
      a.status,
      a.responOsis || '-',
      a.ditanganiOleh || '-',
    ]);
    exportToCSV(
      headers,
      rows,
      `KOTAK_ASPIRASI_SISWA_${schoolProfile.masaBakti.replace('/', '_')}.csv`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MessageSquareHeart className="w-5 h-5 text-rose-500" />
            Kotak Aspirasi & Suara Siswa {schoolProfile.namaSekolah}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Wadah masukan, saran konstruktif, dan kritik positif siswa untuk kemajuan program OSIS & sekolah
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Download rekap aspirasi Excel CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Unduh CSV Aspirasi
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            Tulis Aspirasi / Masukan Baru
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari aspirasi, isi pesan, siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedKategori}
            onChange={(e) => setSelectedKategori(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">Semua Kategori</option>
            {kategoriOptions.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">Semua Status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Aspirasi Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAspirasi.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-all shadow-2xs flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span className="font-semibold text-slate-700">
                  {a.namaSiswa} ({a.kelas})
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    a.status === 'Selesai Terealisasi'
                      ? 'bg-emerald-100 text-emerald-800'
                      : a.status === 'Sedang Ditindaklanjuti'
                      ? 'bg-blue-100 text-blue-800'
                      : a.status === 'Diteruskan ke Pembina'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {a.status}
                </span>
              </div>

              <div className="text-[11px] font-medium text-amber-600 mb-1">{a.kategori}</div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">{a.judul}</h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                "{a.isiAspirasi}"
              </p>

              {/* Response Section */}
              {a.responOsis && (
                <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-emerald-800 font-semibold">
                    <span>Tanggapan Resmi OSIS:</span>
                    <span>{a.ditanganiOleh}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed italic">{a.responOsis}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{formatDateIndo(a.tanggal)}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenResponse(a)}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-800 bg-amber-100 hover:bg-amber-200 rounded-md transition-colors flex items-center gap-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  {a.responOsis ? 'Perbarui Tanggapan' : 'Beri Tanggapan OSIS'}
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Hapus aspirasi ini?')) {
                      deleteAspirasi(a.id);
                    }
                  }}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md"
                  title="Hapus Aspirasi"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAspirasi.length === 0 && (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-xs text-slate-500">
          Belum ada aspirasi siswa yang sesuai filter ini.
        </div>
      )}

      {/* New Aspirasi Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">Kirim Aspirasi / Suara Siswa</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNew} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Siswa (Bisa Anonim)
                  </label>
                  <input
                    type="text"
                    value={formData.namaSiswa}
                    onChange={(e) => setFormData({ ...formData, namaSiswa: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="Kosongkan jika ingin Anonim"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelas</label>
                  <input
                    type="text"
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    placeholder="XI MIPA 1"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kategori Aspirasi</label>
                <select
                  value={formData.kategori}
                  onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
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
                  Judul / Inti Aspirasi *
                </label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Contoh: Pengadaan Fasilitas Bola Basket Tambahan"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Isi Masukan / Saran / Usulan *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.isiAspirasi}
                  onChange={(e) => setFormData({ ...formData, isiAspirasi: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Tuliskan secara jelas kebutuhan atau saran yang ingin disampaikan kepada pengurus OSIS dan pihak sekolah..."
                />
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
                  className="px-5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  Kirimkan Aspirasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {selectedForResponse && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">Tanggapi Aspirasi Siswa</h2>
              <button
                onClick={() => setSelectedForResponse(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResponse} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="font-semibold text-slate-800">{selectedForResponse.judul}</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Dari: {selectedForResponse.namaSiswa} ({selectedForResponse.kelas})
                </div>
                <p className="text-slate-600 mt-2 italic">"{selectedForResponse.isiAspirasi}"</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Progres</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Petugas Penanggap
                </label>
                <input
                  type="text"
                  required
                  value={responderName}
                  onChange={(e) => setResponderName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tanggapan / Solusi Resmi OSIS *
                </label>
                <textarea
                  rows={4}
                  required
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Tuliskan tindakan yang telah diambil atau rencana penyelesaian aspirasi..."
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedForResponse(null)}
                  className="px-4 py-2 font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                >
                  Simpan Tanggapan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
