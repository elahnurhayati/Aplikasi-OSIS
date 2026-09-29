import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Users,
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Phone,
  Trash2,
  Edit2,
  X,
  FileSpreadsheet,
  Award,
  Sparkles,
} from 'lucide-react';
import { useOsis } from '../../context/OsisContext';
import { Ekstrakurikuler } from '../../types';
import { exportToCsv } from '../../utils/exportUtils';

export const EkskulView: React.FC = () => {
  const { schoolProfile, ekskul, addEkskul, updateEkskul, deleteEkskul } = useOsis();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<string>('Semua');
  const [showModal, setShowModal] = useState(false);
  const [editingEkskul, setEditingEkskul] = useState<Ekstrakurikuler | null>(null);

  const [formData, setFormData] = useState<Omit<Ekstrakurikuler, 'id'>>({
    namaEkskul: '',
    kategori: 'Olahraga',
    pembinaGuru: '',
    ketuaEkskul: '',
    kontakKetua: '',
    hariLatihan: 'Jumat',
    waktuLatihan: '15.30 - 17.00 WIB',
    lokasiLatihan: 'Lapangan Sekolah',
    jumlahAnggota: 30,
    prestasiUnggulan: '',
  });

  const categories = [
    'Semua',
    'Kepemimpinan & Bela Negara',
    'Olahraga',
    'Seni & Budaya',
    'Keagamaan',
    'Sains & TIK',
    'Bahasa & Literasi',
  ];

  const filteredEkskul = ekskul.filter((item) => {
    const matchSearch =
      item.namaEkskul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pembinaGuru.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ketuaEkskul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hariLatihan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKat = selectedKategori === 'Semua' || item.kategori === selectedKategori;
    return matchSearch && matchKat;
  });

  const totalAnggotaEkskul = ekskul.reduce((acc, curr) => acc + curr.jumlahAnggota, 0);

  const handleOpenAdd = () => {
    setEditingEkskul(null);
    setFormData({
      namaEkskul: '',
      kategori: 'Kepemimpinan & Bela Negara',
      pembinaGuru: '',
      ketuaEkskul: '',
      kontakKetua: '',
      hariLatihan: 'Jumat',
      waktuLatihan: '15.30 - 17.00 WIB',
      lokasiLatihan: 'Lapangan Sekolah',
      jumlahAnggota: 25,
      prestasiUnggulan: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item: Ekstrakurikuler) => {
    setEditingEkskul(item);
    setFormData({
      namaEkskul: item.namaEkskul,
      kategori: item.kategori,
      pembinaGuru: item.pembinaGuru,
      ketuaEkskul: item.ketuaEkskul,
      kontakKetua: item.kontakKetua,
      hariLatihan: item.hariLatihan,
      waktuLatihan: item.waktuLatihan,
      lokasiLatihan: item.lokasiLatihan,
      jumlahAnggota: item.jumlahAnggota,
      prestasiUnggulan: item.prestasiUnggulan,
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEkskul) {
      updateEkskul(editingEkskul.id, formData);
    } else {
      addEkskul(formData);
    }
    setShowModal(false);
  };

  const handleExportCsv = () => {
    const data = ekskul.map((e, idx) => ({
      No: idx + 1,
      'Nama Ekstrakurikuler': e.namaEkskul,
      Kategori: e.kategori,
      'Pembina Guru': e.pembinaGuru,
      'Ketua Ekskul': e.ketuaEkskul,
      'Kontak Ketua': e.kontakKetua,
      'Hari Latihan': e.hariLatihan,
      'Waktu Latihan': e.waktuLatihan,
      'Lokasi Latihan': e.lokasiLatihan,
      'Jumlah Anggota': e.jumlahAnggota,
      'Prestasi Unggulan': e.prestasiUnggulan,
    }));
    exportToCsv(data, `Data_Ekstrakurikuler_OSIS_${schoolProfile.namaSekolah.replace(/\s+/g, '_')}`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-200/80 pb-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Compass className="w-6 h-6 text-orange-600" />
              <span>Aliansi & Dewan Ekstrakurikuler</span>
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-orange-100 text-orange-800 border border-orange-200">
              Sub-Organisasi OSIS 🍃
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Koordinasi seluruh unit ekstrakurikuler, pembina guru, jadwal latihan mingguan, dan rekapitulasi prestasi.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleExportCsv}
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
            <span>Cetak Jadwal Mingguan</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Ekskul Baru</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 no-print">
        <div className="bg-white p-4 rounded-2xl border border-orange-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Unit Ekstrakurikuler</span>
          <div className="text-xl md:text-2xl font-black text-slate-900 mt-1 font-mono">
            {ekskul.length} <span className="text-xs font-normal text-slate-500">Cabang</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-orange-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Siswa Terdaftar Ekskul</span>
          <div className="text-xl md:text-2xl font-black text-orange-700 mt-1 font-mono">
            {totalAnggotaEkskul} <span className="text-xs font-normal text-slate-500">Anggota</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-orange-200/80 shadow-xs col-span-2 md:col-span-1">
          <span className="text-xs font-semibold text-slate-500">Status Koordinasi OSIS</span>
          <div className="text-sm font-black text-emerald-700 mt-1 flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Aktif & Terintegrasi</span>
          </div>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="bg-white p-3.5 rounded-2xl border border-orange-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 no-print">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ekskul, pembina, ketua, hari..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-orange-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {categories.map((kat) => (
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
      </div>

      {/* Grid of Ekstrakurikuler Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEkskul.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-orange-200/80 shadow-xs p-5 flex flex-col justify-between hover:border-orange-400 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-orange-50 text-orange-800 border border-orange-200 inline-block mb-1">
                    {item.kategori}
                  </span>
                  <h3 className="font-extrabold text-sm md:text-base text-slate-900 leading-snug group-hover:text-orange-700 transition-colors">
                    {item.namaEkskul}
                  </h3>
                </div>
                <div className="flex items-center gap-1 no-print">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus ekskul "${item.namaEkskul}"?`)) {
                        deleteEkskul(item.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Pembina: <strong className="text-slate-800">{item.pembinaGuru}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>Ketua: <strong className="text-slate-800">{item.ketuaEkskul}</strong> ({item.jumlahAnggota} Anggota)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Kontak: <strong className="font-mono text-slate-700">{item.kontakKetua}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Jadwal: <strong className="text-slate-800">{item.hariLatihan}</strong> ({item.waktuLatihan})</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>Lokasi: <span className="text-slate-700">{item.lokasiLatihan}</span></span>
                </div>
              </div>

              {/* Prestasi */}
              {item.prestasiUnggulan && (
                <div className="p-2.5 rounded-xl bg-orange-50/80 border border-orange-200/60 flex items-start gap-2 text-[11px] text-orange-950 font-medium mt-2">
                  <Trophy className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{item.prestasiUnggulan}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* PRINT-ONLY SECTION: MATRIKS JADWAL MINGGUAN SELURUH EKSKUL */}
      <div className="hidden print:block fixed inset-0 bg-white p-8 z-50 text-black">
        <div className="text-center pb-4 border-b-2 border-black">
          <h2 className="text-lg font-bold uppercase">{schoolProfile.namaSekolah}</h2>
          <h3 className="text-sm font-semibold tracking-wider">MATRIKS JADWAL LATIHAN EKSTRAKURIKULER TAHUN PELAJARAN {schoolProfile.masaBakti}</h3>
          <p className="text-xs">{schoolProfile.alamat}, {schoolProfile.kota} - Telp: {schoolProfile.telepon}</p>
        </div>

        <table className="w-full border-collapse border border-black my-6 text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 text-center w-8">No</th>
              <th className="border border-black p-2">Nama Ekstrakurikuler</th>
              <th className="border border-black p-2">Pembina Guru</th>
              <th className="border border-black p-2">Ketua Ekskul</th>
              <th className="border border-black p-2">Hari & Waktu Latihan</th>
              <th className="border border-black p-2">Lokasi</th>
              <th className="border border-black p-2 text-center">Anggota</th>
            </tr>
          </thead>
          <tbody>
            {ekskul.map((item, idx) => (
              <tr key={item.id}>
                <td className="border border-black p-2 text-center font-mono">{idx + 1}</td>
                <td className="border border-black p-2 font-bold">{item.namaEkskul}</td>
                <td className="border border-black p-2">{item.pembinaGuru}</td>
                <td className="border border-black p-2">{item.ketuaEkskul}</td>
                <td className="border border-black p-2">{item.hariLatihan}, {item.waktuLatihan}</td>
                <td className="border border-black p-2">{item.lokasiLatihan}</td>
                <td className="border border-black p-2 text-center font-mono">{item.jumlahAnggota}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-2 pt-8 text-center text-xs">
          <div>
            <p>Mengetahui,</p>
            <p>Wakasek Kesiswaan / Pembina OSIS,</p>
            <div className="h-16" />
            <p className="font-bold underline">{schoolProfile.pembinaOsis}</p>
            <p>NIP. {schoolProfile.nipPembinaOsis}</p>
          </div>
          <div>
            <p>{schoolProfile.kota}, {new Date().toLocaleDateString('id-ID')}</p>
            <p>Ketua Umum OSIS,</p>
            <div className="h-16" />
            <p className="font-bold underline">{schoolProfile.ketuaOsis}</p>
            <p>NISN. {schoolProfile.nisnKetuaOsis}</p>
          </div>
        </div>

        <div className="pt-8 text-center text-[10px] text-gray-500 border-t border-gray-300">
          Dokumen resmi OSIS 360 · Aplikasi dikembangkan oleh Nandi Achdarizal Sutisna
        </div>
      </div>

      {/* MODAL: TAMBAH / EDIT EKSKUL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-orange-200 shadow-2xl overflow-hidden animate-in fade-in duration-150">
            <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5" />
                <h3 className="font-extrabold text-sm md:text-base">
                  {editingEkskul ? 'Edit Ekstrakurikuler' : 'Tambah Ekstrakurikuler Baru'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Ekstrakurikuler</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Paskibra Garda Teladan / Robotika Club"
                  value={formData.namaEkskul}
                  onChange={(e) => setFormData({ ...formData, namaEkskul: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                  >
                    <option value="Kepemimpinan & Bela Negara">Kepemimpinan & Bela Negara</option>
                    <option value="Olahraga">Olahraga</option>
                    <option value="Seni & Budaya">Seni & Budaya</option>
                    <option value="Keagamaan">Keagamaan</option>
                    <option value="Sains & TIK">Sains & TIK</option>
                    <option value="Bahasa & Literasi">Bahasa & Literasi</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jumlah Anggota</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.jumlahAnggota}
                    onChange={(e) => setFormData({ ...formData, jumlahAnggota: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pembina Guru</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap & Gelar Guru"
                    value={formData.pembinaGuru}
                    onChange={(e) => setFormData({ ...formData, pembinaGuru: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ketua Ekskul (Siswa)</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Siswa Ketua"
                    value={formData.ketuaEkskul}
                    onChange={(e) => setFormData({ ...formData, ketuaEkskul: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kontak WhatsApp Ketua</label>
                  <input
                    type="text"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={formData.kontakKetua}
                    onChange={(e) => setFormData({ ...formData, kontakKetua: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hari Latihan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Selasa & Kamis / Jumat"
                    value={formData.hariLatihan}
                    onChange={(e) => setFormData({ ...formData, hariLatihan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Waktu Latihan</label>
                  <input
                    type="text"
                    required
                    placeholder="15.30 - 17.30 WIB"
                    value={formData.waktuLatihan}
                    onChange={(e) => setFormData({ ...formData, waktuLatihan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lokasi Latihan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Lapangan Utama / Lab Komputer"
                    value={formData.lokasiLatihan}
                    onChange={(e) => setFormData({ ...formData, lokasiLatihan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Prestasi Unggulan / Riwayat Kejuaraan</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Juara 1 Tingkat Provinsi Tahun 2025"
                  value={formData.prestasiUnggulan}
                  onChange={(e) => setFormData({ ...formData, prestasiUnggulan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white rounded-xl font-extrabold shadow-md shadow-orange-500/20"
                >
                  Simpan Data Ekskul
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
