import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit2,
  Trash2,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { useOsis } from '../../context/OsisContext';
import { ProgramKerja, SekbidType, ProkerStatus } from '../../types';
import { exportToCSV, formatRupiah, formatDateIndo } from '../../utils/exportUtils';

export const ProkerView: React.FC = () => {
  const { schoolProfile, proker, addProker, updateProker, deleteProker, pengurus } = useOsis();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSekbid, setSelectedSekbid] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<'all' | 'ganjil' | 'genap'>('all');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<ProgramKerja, 'id'>>({
    namaProker: '',
    sekbid: 'Sekbid 1 - Ketaqwaan Terhadap Tuhan YME',
    penanggungJawab: '',
    sasaran: '',
    tujuan: '',
    anggaranBiaya: 0,
    sumberDana: 'Kas OSIS',
    bulanPelaksanaan: 1,
    tanggalMulai: new Date().toISOString().split('T')[0],
    tanggalSelesai: new Date().toISOString().split('T')[0],
    tempat: 'Aula SMA Teladan',
    status: 'Perencanaan',
    persentaseProgress: 0,
    kpiTarget: '',
    laporanRingkas: '',
  });

  const monthsMap = [
    { num: 1, name: 'Juli (Bln 1)', sem: 'ganjil' },
    { num: 2, name: 'Agustus (Bln 2)', sem: 'ganjil' },
    { num: 3, name: 'September (Bln 3)', sem: 'ganjil' },
    { num: 4, name: 'Oktober (Bln 4)', sem: 'ganjil' },
    { num: 5, name: 'November (Bln 5)', sem: 'ganjil' },
    { num: 6, name: 'Desember (Bln 6)', sem: 'ganjil' },
    { num: 7, name: 'Januari (Bln 7)', sem: 'genap' },
    { num: 8, name: 'Februari (Bln 8)', sem: 'genap' },
    { num: 9, name: 'Maret (Bln 9)', sem: 'genap' },
    { num: 10, name: 'April (Bln 10)', sem: 'genap' },
    { num: 11, name: 'Mei (Bln 11)', sem: 'genap' },
    { num: 12, name: 'Juni (Bln 12)', sem: 'genap' },
  ];

  const sekbidOptions: SekbidType[] = [
    'Pengurus Inti',
    'Sekbid 1 - Ketaqwaan Terhadap Tuhan YME',
    'Sekbid 2 - Budi Pekerti & Karakter Mulia',
    'Sekbid 3 - Wawasan Kebangsaan & Bela Negara',
    'Sekbid 4 - Prestasi Akademik, Seni & Olahraga',
    'Sekbid 5 - Demokrasi, HAM & Pendidikan Politik',
    'Sekbid 6 - Kreativitas, Keterampilan & Kewirausahaan',
    'Sekbid 7 - Kualitas Jasmani, Kesehatan & Gizi',
    'Sekbid 8 - Sastra, Budaya & Apresiasi Seni',
    'Sekbid 9 - Teknologi Informasi & Komunikasi (TIK)',
    'Sekbid 10 - Komunikasi Bahasa Asing & Literasi Global',
  ];

  const statusOptions: ProkerStatus[] = [
    'Perencanaan',
    'Disetujui Pembina',
    'Sedang Berjalan',
    'Selesai',
    'Dievaluasi',
    'Dibatalkan',
  ];

  // Filtering
  const filteredProker = proker.filter((item) => {
    const matchesSearch =
      item.namaProker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.penanggungJawab.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tempat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSekbid = selectedSekbid === 'all' || item.sekbid === selectedSekbid;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesSemester =
      selectedSemester === 'all'
        ? true
        : selectedSemester === 'ganjil'
        ? item.bulanPelaksanaan <= 6
        : item.bulanPelaksanaan > 6;
    return matchesSearch && matchesSekbid && matchesStatus && matchesSemester;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      namaProker: '',
      sekbid: 'Sekbid 1 - Ketaqwaan Terhadap Tuhan YME',
      penanggungJawab: pengurus[0]?.nama || '',
      sasaran: 'Seluruh Siswa',
      tujuan: '',
      anggaranBiaya: 3000000,
      sumberDana: 'Kas OSIS',
      bulanPelaksanaan: 1,
      tanggalMulai: new Date().toISOString().split('T')[0],
      tanggalSelesai: new Date().toISOString().split('T')[0],
      tempat: 'Lingkungan Sekolah',
      status: 'Perencanaan',
      persentaseProgress: 0,
      kpiTarget: '',
      laporanRingkas: '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: ProgramKerja) => {
    setEditingId(item.id);
    setFormData({
      namaProker: item.namaProker,
      sekbid: item.sekbid,
      penanggungJawab: item.penanggungJawab,
      sasaran: item.sasaran,
      tujuan: item.tujuan,
      anggaranBiaya: item.anggaranBiaya,
      sumberDana: item.sumberDana,
      bulanPelaksanaan: item.bulanPelaksanaan,
      tanggalMulai: item.tanggalMulai,
      tanggalSelesai: item.tanggalSelesai,
      tempat: item.tempat,
      status: item.status,
      persentaseProgress: item.persentaseProgress,
      kpiTarget: item.kpiTarget,
      laporanRingkas: item.laporanRingkas,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaProker) {
      alert('Nama Program Kerja wajib diisi.');
      return;
    }
    if (editingId) {
      updateProker(editingId, formData);
    } else {
      addProker(formData);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, nama: string) => {
    if (window.confirm(`Yakin ingin menghapus program kerja "${nama}"?`)) {
      deleteProker(id);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'No',
      'Nama Program Kerja',
      'Seksi Bidang',
      'Penanggung Jawab',
      'Sasaran',
      'Tujuan',
      'Anggaran Biaya',
      'Sumber Dana',
      'Bulan Pelaksanaan',
      'Tanggal Mulai',
      'Tanggal Selesai',
      'Tempat',
      'Status',
      'Progress (%)',
      'Target KPI',
    ];
    const rows = proker.map((p, idx) => [
      idx + 1,
      p.namaProker,
      p.sekbid,
      p.penanggungJawab,
      p.sasaran,
      p.tujuan,
      p.anggaranBiaya,
      p.sumberDana,
      monthsMap.find((m) => m.num === p.bulanPelaksanaan)?.name || p.bulanPelaksanaan,
      p.tanggalMulai,
      p.tanggalSelesai,
      p.tempat,
      p.status,
      `${p.persentaseProgress}%`,
      p.kpiTarget,
    ]);
    exportToCSV(
      headers,
      rows,
      `MATRIKS_PROKER_OSIS_${schoolProfile.masaBakti.replace('/', '_')}.csv`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-600" />
            Matriks & Kalender Program Kerja 1 Tahun Jabatan ({schoolProfile.masaBakti})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen siklus program kerja dari perencanaan hingga laporan pertanggungjawaban (LPJ)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Download jadwal program kerja dalam Excel CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Unduh CSV Matriks
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Cetak matriks program kerja"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            Cetak Matriks
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            Tambah Proker Baru
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-3 shadow-2xs">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari program kerja, PJ, tempat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Semester Selector */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setSelectedSemester('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedSemester === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Semua Semester
            </button>
            <button
              onClick={() => setSelectedSemester('ganjil')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedSemester === 'ganjil' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Sem. Ganjil (Bln 1-6)
            </button>
            <button
              onClick={() => setSelectedSemester('genap')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedSemester === 'genap' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Sem. Genap (Bln 7-12)
            </button>
          </div>

          {/* Sekbid filter */}
          <select
            value={selectedSekbid}
            onChange={(e) => setSelectedSekbid(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 max-w-[200px]"
          >
            <option value="all">Semua Sekbid</option>
            {sekbidOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">Semua Status</option>
            {statusOptions.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Proker Table / List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Nama Program & Sekbid</th>
                <th className="py-3 px-4">Jadwal & Tempat</th>
                <th className="py-3 px-4">Penanggung Jawab</th>
                <th className="py-3 px-4 text-right">Anggaran</th>
                <th className="py-3 px-4 text-center">Progress</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right no-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProker.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.namaProker}</div>
                    <div className="text-[11px] text-slate-500">{item.sekbid}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 italic">Target: {item.kpiTarget}</div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-medium text-slate-800">
                      {formatDateIndo(item.tanggalMulai)}
                    </div>
                    <div className="text-[11px] text-slate-500">{item.tempat}</div>
                    <div className="text-[10px] text-amber-700 font-medium">
                      {monthsMap.find((m) => m.num === item.bulanPelaksanaan)?.name}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{item.penanggungJawab}</div>
                    <div className="text-[11px] text-slate-500">Sasaran: {item.sasaran}</div>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="font-mono font-semibold text-slate-900 tabular-nums">
                      {formatRupiah(item.anggaranBiaya)}
                    </div>
                    <div className="text-[10px] text-slate-400">{item.sumberDana}</div>
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-500 h-1.5 rounded-full"
                          style={{ width: `${item.persentaseProgress}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-slate-700 tabular-nums">
                        {item.persentaseProgress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${
                        item.status === 'Selesai'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Sedang Berjalan'
                          ? 'bg-blue-100 text-blue-800'
                          : item.status === 'Disetujui Pembina'
                          ? 'bg-amber-100 text-amber-800'
                          : item.status === 'Dibatalkan'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap no-print">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md"
                        title="Edit Proker"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.namaProker)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md"
                        title="Hapus Proker"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProker.length === 0 && (
          <div className="p-12 text-center text-slate-500 text-xs">
            Tidak ada program kerja yang ditemukan dengan filter ini.
          </div>
        )}
      </div>

      {/* Add / Edit Proker Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">
                {editingId ? 'Edit Program Kerja' : 'Tambah Program Kerja Baru'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Program Kerja *
                </label>
                <input
                  type="text"
                  required
                  value={formData.namaProker}
                  onChange={(e) => setFormData({ ...formData, namaProker: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                  placeholder="Contoh: Pentas Seni Akbar Teladan Vaganza 2027"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Seksi Bidang (Sekbid)
                  </label>
                  <select
                    value={formData.sekbid}
                    onChange={(e) => setFormData({ ...formData, sekbid: e.target.value as SekbidType })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                  >
                    {sekbidOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Penanggung Jawab (PJ)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.penanggungJawab}
                    onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                    placeholder="Nama pengurus penanggung jawab"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Bulan Pelaksanaan
                  </label>
                  <select
                    value={formData.bulanPelaksanaan}
                    onChange={(e) => setFormData({ ...formData, bulanPelaksanaan: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                  >
                    {monthsMap.map((m) => (
                      <option key={m.num} value={m.num}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={formData.tanggalMulai}
                    onChange={(e) => setFormData({ ...formData, tanggalMulai: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    value={formData.tanggalSelesai}
                    onChange={(e) => setFormData({ ...formData, tanggalSelesai: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estimasi Anggaran Biaya (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.anggaranBiaya}
                    onChange={(e) => setFormData({ ...formData, anggaranBiaya: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Sumber Dana
                  </label>
                  <select
                    value={formData.sumberDana}
                    onChange={(e) => setFormData({ ...formData, sumberDana: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Kas OSIS">Kas OSIS</option>
                    <option value="Sekolah / BOS">Sekolah / BOS</option>
                    <option value="Sponsorship">Sponsorship</option>
                    <option value="Dana Usaha (Danus)">Dana Usaha (Danus)</option>
                    <option value="Kombinasi">Kombinasi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tempat / Lokasi
                  </label>
                  <input
                    type="text"
                    value={formData.tempat}
                    onChange={(e) => setFormData({ ...formData, tempat: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                    placeholder="Aula / Lapangan"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Proker
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ProkerStatus })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                  >
                    {statusOptions.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Progress Realisasi ({formData.persentaseProgress}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.persentaseProgress}
                    onChange={(e) => setFormData({ ...formData, persentaseProgress: Number(e.target.value) })}
                    className="w-full mt-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sasaran Peserta / Penerima Manfaat
                </label>
                <input
                  type="text"
                  value={formData.sasaran}
                  onChange={(e) => setFormData({ ...formData, sasaran: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                  placeholder="Contoh: Siswa Kelas X dan Seluruh Pengurus Ekstrakurikuler"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tujuan & KPI Ketercapaian
                </label>
                <textarea
                  rows={2}
                  value={formData.tujuan}
                  onChange={(e) => setFormData({ ...formData, tujuan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                  placeholder="Deskripsi tujuan kegiatan dan indikator keberhasilan..."
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
                  className="px-5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                >
                  {editingId ? 'Simpan Perubahan' : 'Tambahkan Program Kerja'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
