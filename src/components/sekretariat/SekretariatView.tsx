import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Printer,
  Calendar,
  UserCheck,
  BookOpen,
  Trash2,
  Edit2,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Users,
  Search,
  Sparkles,
} from 'lucide-react';
import { useOsis } from '../../context/OsisContext';
import { JadwalPiket, BukuTamu } from '../../types';
import { exportToCsv } from '../../utils/exportUtils';

export const SekretariatView: React.FC = () => {
  const { schoolProfile, piket, updatePiket, bukuTamu, addBukuTamu, deleteBukuTamu, pengurus } = useOsis();

  const [activeTab, setActiveTab] = useState<'piket' | 'tamu'>('piket');
  const [showTamuModal, setShowTamuModal] = useState(false);
  const [showPiketModal, setShowPiketModal] = useState(false);
  const [editingPiket, setEditingPiket] = useState<JadwalPiket | null>(null);

  // Form Buku Tamu
  const [tamuForm, setTamuForm] = useState<Omit<BukuTamu, 'id' | 'tanggal' | 'waktu'>>({
    nama: '',
    kelasInstansi: '',
    keperluan: '',
    ditemuiOleh: schoolProfile.ketuaOsis,
  });

  // Form Piket
  const [piketForm, setPiketForm] = useState<{
    koordinator: string;
    anggotaPiket: string;
    tugasRutin: string;
  }>({
    koordinator: '',
    anggotaPiket: '',
    tugasRutin: '',
  });

  const [searchTamu, setSearchTamu] = useState('');

  const filteredBukuTamu = bukuTamu.filter((t) => {
    return (
      t.nama.toLowerCase().includes(searchTamu.toLowerCase()) ||
      t.kelasInstansi.toLowerCase().includes(searchTamu.toLowerCase()) ||
      t.keperluan.toLowerCase().includes(searchTamu.toLowerCase()) ||
      t.ditemuiOleh.toLowerCase().includes(searchTamu.toLowerCase())
    );
  });

  const handleOpenEditPiket = (item: JadwalPiket) => {
    setEditingPiket(item);
    setPiketForm({
      koordinator: item.koordinator,
      anggotaPiket: item.anggotaPiket.join(', '),
      tugasRutin: item.tugasRutin,
    });
    setShowPiketModal(true);
  };

  const handleSavePiket = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPiket) {
      updatePiket(editingPiket.id, {
        koordinator: piketForm.koordinator,
        anggotaPiket: piketForm.anggotaPiket.split(',').map((s) => s.trim()).filter(Boolean),
        tugasRutin: piketForm.tugasRutin,
      });
      setShowPiketModal(false);
    }
  };

  const handleSaveTamu = (e: React.FormEvent) => {
    e.preventDefault();
    addBukuTamu(tamuForm);
    setTamuForm({
      nama: '',
      kelasInstansi: '',
      keperluan: '',
      ditemuiOleh: schoolProfile.ketuaOsis,
    });
    setShowTamuModal(false);
  };

  const handleExportTamuCsv = () => {
    const data = bukuTamu.map((t, idx) => ({
      No: idx + 1,
      Tanggal: t.tanggal,
      Waktu: t.waktu,
      'Nama Tamu': t.nama,
      'Kelas / Instansi': t.kelasInstansi,
      Keperluan: t.keperluan,
      'Diterima Oleh': t.ditemuiOleh,
    }));
    exportToCsv(data, `Buku_Tamu_Sekretariat_OSIS_${schoolProfile.namaSekolah.replace(/\s+/g, '_')}`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-200/80 pb-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-6 h-6 text-orange-600" />
              <span>Pusat Kendali Sekretariat OSIS</span>
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-orange-100 text-orange-800 border border-orange-200">
              Kedinasan Harian 🍃
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pengelolaan jadwal piket ruang sekretariat OSIS (Senin - Sabtu) dan buku tamu kunjungan siswa, guru, serta perwakilan organisasi.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {activeTab === 'piket' ? (
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Jadwal Piket</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleExportTamuCsv}
                className="px-3 py-2 bg-white hover:bg-orange-50 text-slate-700 text-xs font-bold rounded-xl border border-orange-200 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Unduh Buku Tamu CSV</span>
              </button>
              <button
                onClick={() => setShowTamuModal(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-xs font-extrabold rounded-xl transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Catat Tamu Baru</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-orange-200/80 no-print">
        <button
          onClick={() => setActiveTab('piket')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'piket'
              ? 'border-orange-600 text-orange-600 bg-orange-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Jadwal Piket Ruang OSIS (Senin - Sabtu)</span>
        </button>
        <button
          onClick={() => setActiveTab('tamu')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'tamu'
              ? 'border-orange-600 text-orange-600 bg-orange-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Buku Tamu Digital ({bukuTamu.length})</span>
        </button>
      </div>

      {/* TAB 1: JADWAL PIKET */}
      {activeTab === 'piket' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {piket.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-orange-200/80 shadow-xs p-5 flex flex-col justify-between hover:border-orange-400 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-orange-100 pb-2">
                  <span className="px-3 py-1 rounded-xl text-xs font-black bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-xs">
                    HARI {item.hari.toUpperCase()}
                  </span>
                  <button
                    onClick={() => handleOpenEditPiket(item)}
                    className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors no-print"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs space-y-2">
                  <div>
                    <span className="text-slate-400 text-[11px] font-bold block">Koordinator Piket:</span>
                    <strong className="text-slate-900 text-sm font-extrabold">{item.koordinator}</strong>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[11px] font-bold block mb-1">Anggota Petugas:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.anggotaPiket.map((nama, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-orange-50 text-orange-800 text-[11px] font-bold border border-orange-200"
                        >
                          {nama}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-400 text-[11px] font-bold block">Tugas Rutin Harian:</span>
                    <p className="text-[11.5px] text-slate-600 mt-0.5 leading-relaxed">{item.tugasRutin}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: BUKU TAMU */}
      {activeTab === 'tamu' && (
        <div className="space-y-4">
          <div className="bg-white p-3.5 rounded-2xl border border-orange-200/80 shadow-xs flex items-center justify-between no-print">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTamu}
                onChange={(e) => setSearchTamu(e.target.value)}
                placeholder="Cari nama tamu, instansi, keperluan..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-orange-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
              />
            </div>
            <div className="text-xs text-slate-500 font-semibold hidden sm:block">
              Total {bukuTamu.length} kunjungan tercatat
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-orange-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-orange-50/70 border-b border-orange-200/80 text-[11px] font-extrabold text-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Waktu & Tanggal</th>
                    <th className="py-3 px-4">Nama Tamu</th>
                    <th className="py-3 px-4">Kelas / Instansi</th>
                    <th className="py-3 px-4">Keperluan Kunjungan</th>
                    <th className="py-3 px-4">Diterima Oleh</th>
                    <th className="py-3 px-4 text-right no-print">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBukuTamu.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Belum ada catatan buku tamu yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filteredBukuTamu.map((t) => (
                      <tr key={t.id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="py-3 px-4 font-mono">
                          <div className="font-bold text-slate-900">{t.tanggal}</div>
                          <div className="text-[10.5px] text-slate-500">{t.waktu}</div>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {t.nama}
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">
                          {t.kelasInstansi}
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-xs">
                          {t.keperluan}
                        </td>
                        <td className="py-3 px-4 text-orange-800 font-semibold">
                          {t.ditemuiOleh}
                        </td>
                        <td className="py-3 px-4 text-right no-print">
                          <button
                            onClick={() => {
                              if (window.confirm('Hapus catatan tamu ini?')) {
                                deleteBukuTamu(t.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-ONLY: JADWAL PIKET RESMI RUANG SEKRETARIAT OSIS */}
      <div className="hidden print:block fixed inset-0 bg-white p-8 z-50 text-black">
        <div className="text-center pb-4 border-b-2 border-black">
          <h2 className="text-lg font-bold uppercase">{schoolProfile.namaSekolah}</h2>
          <h3 className="text-sm font-semibold tracking-wider">JADWAL PIKET HARIAN SEKRETARIAT OSIS {schoolProfile.masaBakti}</h3>
          <p className="text-xs">{schoolProfile.alamat}, {schoolProfile.kota} - Telp: {schoolProfile.telepon}</p>
        </div>

        <table className="w-full border-collapse border border-black my-6 text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-2 w-24">Hari</th>
              <th className="border border-black p-2">Koordinator Piket</th>
              <th className="border border-black p-2">Anggota Petugas</th>
              <th className="border border-black p-2">Tugas Rutin Kedinasan</th>
            </tr>
          </thead>
          <tbody>
            {piket.map((p) => (
              <tr key={p.id}>
                <td className="border border-black p-2 font-bold text-center uppercase">{p.hari}</td>
                <td className="border border-black p-2 font-bold">{p.koordinator}</td>
                <td className="border border-black p-2">{p.anggotaPiket.join(', ')}</td>
                <td className="border border-black p-2">{p.tugasRutin}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-2 pt-8 text-center text-xs">
          <div>
            <p>Mengetahui,</p>
            <p>Pembina OSIS,</p>
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

      {/* MODAL: EDIT PIKET */}
      {showPiketModal && editingPiket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-orange-200 shadow-2xl overflow-hidden animate-in fade-in duration-150">
            <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-5 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-sm md:text-base">
                Edit Jadwal Piket Hari {editingPiket.hari}
              </h3>
              <button
                onClick={() => setShowPiketModal(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePiket} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Koordinator Piket</label>
                <input
                  type="text"
                  required
                  value={piketForm.koordinator}
                  onChange={(e) => setPiketForm({ ...piketForm, koordinator: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Anggota Petugas (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Fadhil Naufal, Ahmad Raihan, Nabila Zahra"
                  value={piketForm.anggotaPiket}
                  onChange={(e) => setPiketForm({ ...piketForm, anggotaPiket: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tugas Rutin Harian</label>
                <textarea
                  rows={3}
                  required
                  value={piketForm.tugasRutin}
                  onChange={(e) => setPiketForm({ ...piketForm, tugasRutin: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPiketModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white rounded-xl font-extrabold shadow-md shadow-orange-500/20"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH TAMU */}
      {showTamuModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-orange-200 shadow-2xl overflow-hidden animate-in fade-in duration-150">
            <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-5 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-sm md:text-base">
                Catat Kunjungan Buku Tamu
              </h3>
              <button
                onClick={() => setShowTamuModal(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTamu} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Tamu</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama lengkap pengunjung"
                    value={tamuForm.nama}
                    onChange={(e) => setTamuForm({ ...tamuForm, nama: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas / Asal Instansi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Perwakilan Kelas XI-3 / Ekskul Rohis"
                    value={tamuForm.kelasInstansi}
                    onChange={(e) => setTamuForm({ ...tamuForm, kelasInstansi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Keperluan / Maksud Kunjungan</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contoh: Konsultasi proposal kegiatan peringatan Maulid Nabi / peminjaman aula"
                  value={tamuForm.keperluan}
                  onChange={(e) => setTamuForm({ ...tamuForm, keperluan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Diterima Oleh (Pengurus OSIS)</label>
                <input
                  type="text"
                  required
                  value={tamuForm.ditemuiOleh}
                  onChange={(e) => setTamuForm({ ...tamuForm, ditemuiOleh: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTamuModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white rounded-xl font-extrabold shadow-md shadow-orange-500/20"
                >
                  Simpan Catatan Tamu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
