import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  CreditCard,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Award,
  Upload,
  X,
  CheckCircle,
} from 'lucide-react';
import { useOsis } from '../../context/OsisContext';
import { PengurusOsis, SekbidType, JabatanType } from '../../types';
import { KtaCardModal } from './KtaCardModal';
import { exportToCSV, fileToBase64 } from '../../utils/exportUtils';

export const PengurusView: React.FC = () => {
  const { schoolProfile, pengurus, addPengurus, updatePengurus, deletePengurus } = useOsis();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSekbid, setSelectedSekbid] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // KTA modal state
  const [selectedForKta, setSelectedForKta] = useState<PengurusOsis | null>(null);
  const [isBulkKta, setIsBulkKta] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Omit<PengurusOsis, 'id'>>({
    nisn: '',
    nama: '',
    panggilan: '',
    jenisKelamin: 'L',
    kelas: 'XI MIPA 1',
    jabatan: 'Koordinator Sekbid',
    sekbid: 'Sekbid 1 - Ketaqwaan Terhadap Tuhan YME',
    noHp: '',
    email: '',
    ttl: '',
    alamat: '',
    fotoUrl: '',
    statusAktif: true,
    tanggalDilantik: '15 Juli 2026',
    catatanPrestasi: '',
  });

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

  const jabatanOptions: JabatanType[] = [
    'Ketua Umum',
    'Wakil Ketua Umum',
    'Sekretaris Umum',
    'Sekretaris I',
    'Bendahara Umum',
    'Bendahara I',
    'Koordinator Sekbid',
    'Anggota Sekbid',
  ];

  // Filtering
  const filteredPengurus = pengurus.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nisn.includes(searchQuery) ||
      item.jabatan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSekbid = selectedSekbid === 'all' || item.sekbid === selectedSekbid;
    return matchesSearch && matchesSekbid;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      nisn: '',
      nama: '',
      panggilan: '',
      jenisKelamin: 'L',
      kelas: 'XI MIPA 1',
      jabatan: 'Koordinator Sekbid',
      sekbid: 'Sekbid 1 - Ketaqwaan Terhadap Tuhan YME',
      noHp: '',
      email: '',
      ttl: '',
      alamat: '',
      fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      statusAktif: true,
      tanggalDilantik: '15 Juli 2026',
      catatanPrestasi: '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: PengurusOsis) => {
    setEditingId(item.id);
    setFormData({
      nisn: item.nisn,
      nama: item.nama,
      panggilan: item.panggilan,
      jenisKelamin: item.jenisKelamin,
      kelas: item.kelas,
      jabatan: item.jabatan,
      sekbid: item.sekbid,
      noHp: item.noHp,
      email: item.email,
      ttl: item.ttl,
      alamat: item.alamat,
      fotoUrl: item.fotoUrl,
      statusAktif: item.statusAktif,
      tanggalDilantik: item.tanggalDilantik,
      catatanPrestasi: item.catatanPrestasi,
    });
    setIsFormOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        setFormData((prev) => ({ ...prev, fotoUrl: base64 }));
      } catch (err) {
        alert('Gagal memproses foto.');
      }
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nisn) {
      alert('Nama lengkap dan NISN wajib diisi.');
      return;
    }
    if (editingId) {
      updatePengurus(editingId, formData);
    } else {
      addPengurus(formData);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, nama: string) => {
    if (window.confirm(`Yakin ingin menghapus data pengurus "${nama}"?`)) {
      deletePengurus(id);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'NISN',
      'Nama Lengkap',
      'Panggilan',
      'Gender',
      'Kelas',
      'Jabatan',
      'Seksi Bidang',
      'No WhatsApp',
      'Email',
      'TTL',
      'Alamat',
      'Status',
      'Prestasi',
    ];
    const rows = pengurus.map((p) => [
      p.nisn,
      p.nama,
      p.panggilan,
      p.jenisKelamin,
      p.kelas,
      p.jabatan,
      p.sekbid,
      p.noHp,
      p.email,
      p.ttl,
      p.alamat,
      p.statusAktif ? 'Aktif' : 'Non-Aktif',
      p.catatanPrestasi,
    ]);
    exportToCSV(
      headers,
      rows,
      `DATA_PENGURUS_OSIS_${schoolProfile.masaBakti.replace('/', '_')}.csv`
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            Data Induk Pengurus & KTA Masa Bakti {schoolProfile.masaBakti}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {pengurus.length} anggota resmi terdaftar dan terverifikasi di database OSIS
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
            title="Download database pengurus format Excel CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Unduh CSV
          </button>
          <button
            onClick={() => {
              setIsBulkKta(true);
              setSelectedForKta(null);
            }}
            className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors flex items-center gap-1.5"
            title="Cetak seluruh Kartu Tanda Anggota pengurus sekaligus"
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-700" />
            Cetak KTA Massal ({pengurus.length})
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5 text-amber-400" />
            Tambah Pengurus
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, NISN, atau jabatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedSekbid}
            onChange={(e) => setSelectedSekbid(e.target.value)}
            className="w-full sm:w-64 py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">Semua Seksi Bidang ({pengurus.length})</option>
            {sekbidOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pengurus Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPengurus.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-all shadow-2xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-14 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                <img
                  src={item.fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                  alt={item.nama}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
                  }}
                />
              </div>

              <div className="overflow-hidden flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-mono text-slate-400">NISN: {item.nisn}</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {item.kelas}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 truncate" title={item.nama}>
                  {item.nama}
                </h3>
                <div className="text-xs font-semibold text-amber-600 truncate">{item.jabatan}</div>
                <div className="text-[11px] text-slate-500 truncate" title={item.sekbid}>
                  {item.sekbid}
                </div>
              </div>
            </div>

            {/* Quick Contacts */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 truncate">
                <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                {item.noHp || '-'}
              </span>
              <span className="flex items-center gap-1 truncate">
                <Mail className="w-3 h-3 text-blue-600 shrink-0" />
                {item.email || '-'}
              </span>
            </div>

            {/* Card Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setSelectedForKta(item);
                  setIsBulkKta(false);
                }}
                className="px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors flex items-center gap-1"
                title="Lihat dan Cetak Kartu KTA"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Cetak KTA
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                  title="Edit Data Pengurus"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.nama)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                  title="Hapus Data Pengurus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPengurus.length === 0 && (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-700">Tidak ada pengurus yang sesuai filter</p>
          <p className="text-xs text-slate-400 mt-1">Coba ubah kata kunci pencarian atau kategori Seksi Bidang.</p>
        </div>
      )}

      {/* Add / Edit Pengurus Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">
                {editingId ? 'Edit Biodata Pengurus OSIS' : 'Tambah Pengurus OSIS Baru'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                    placeholder="Contoh: Muhammad Rizky Pratama"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NISN Siswa *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                    placeholder="Contoh: 0087492101"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Panggilan
                  </label>
                  <input
                    type="text"
                    value={formData.panggilan}
                    onChange={(e) => setFormData({ ...formData, panggilan: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                    placeholder="Rizky"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as 'L' | 'P' })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kelas
                  </label>
                  <input
                    type="text"
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                    placeholder="XI MIPA 1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jabatan OSIS
                  </label>
                  <select
                    value={formData.jabatan}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value as JabatanType })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                  >
                    {jabatanOptions.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seksi Bidang (Sekbid)
                  </label>
                  <select
                    value={formData.sekbid}
                    onChange={(e) => setFormData({ ...formData, sekbid: e.target.value as SekbidType })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                  >
                    {sekbidOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Photo Upload & Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upload Foto Profil Resmi Pengurus (Untuk KTA & Biodata)
                </label>
                <div className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="w-14 h-16 rounded bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                    {formData.fotoUrl ? (
                      <img src={formData.fotoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                        Foto
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-slate-600" />
                      Pilih Foto dari Komputer
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Mendukung format JPG, PNG. Foto akan otomatis terpasang pada Kartu KTA.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    No. HP / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.noHp}
                    onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                    placeholder="081234567890"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                    placeholder="nama@sekolah.sch.id"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tempat, Tanggal Lahir (TTL)
                </label>
                <input
                  type="text"
                  value={formData.ttl}
                  onChange={(e) => setFormData({ ...formData, ttl: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                  placeholder="Bandung, 14 Mei 2009"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Prestasi / Pengalaman Organisasi
                </label>
                <textarea
                  rows={2}
                  value={formData.catatanPrestasi}
                  onChange={(e) => setFormData({ ...formData, catatanPrestasi: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                  placeholder="Riwayat lomba, kejuaraan, atau pencapaian kepemimpinan siswa..."
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                >
                  {editingId ? 'Simpan Perubahan' : 'Tambahkan Pengurus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KTA Modal */}
      {(selectedForKta || isBulkKta) && (
        <KtaCardModal
          pengurus={selectedForKta}
          allPengurus={pengurus}
          isBulkMode={isBulkKta}
          school={schoolProfile}
          onClose={() => {
            setSelectedForKta(null);
            setIsBulkKta(false);
          }}
        />
      )}
    </div>
  );
};
