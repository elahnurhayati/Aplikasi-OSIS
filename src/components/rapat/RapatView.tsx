import React, { useState } from 'react';
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  Printer,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  UserCheck,
  Edit2,
  Trash2,
  X,
  Eye,
} from 'lucide-react';
import { useOsis } from '../../context/OsisContext';
import { RapatNotulensi, PesertaPresensi } from '../../types';
import { exportToCSV, formatDateIndo, downloadFile } from '../../utils/exportUtils';
import { generateKopSuratHtml } from '../../utils/documentTemplates';

export const RapatView: React.FC = () => {
  const { schoolProfile, rapat, addRapat, updateRapat, deleteRapat, pengurus } = useOsis();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJenis, setSelectedJenis] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRapatDetail, setSelectedRapatDetail] = useState<RapatNotulensi | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<RapatNotulensi, 'id'>>({
    nomorNotulen: `NTL/OSIS/0${rapat.length + 1}/${new Date().toLocaleString('id-ID', { month: '2-digit' })}/${new Date().getFullYear()}`,
    judulRapat: '',
    jenisRapat: 'Rapat Pengurus Harian',
    tanggal: new Date().toISOString().split('T')[0],
    waktuMulai: '15:30',
    waktuSelesai: '17:00',
    tempat: 'Ruang Sekretariat OSIS',
    pimpinanRapat: schoolProfile.ketuaOsis,
    notulis: pengurus.find((p) => p.jabatan.includes('Sekretaris'))?.nama || 'Sekretaris OSIS',
    agenda: '',
    pembahasan: '',
    kesimpulanKeputusan: '',
    daftarPresensi: pengurus.map((p) => ({
      pengurusId: p.id,
      nama: p.nama,
      jabatan: p.jabatan,
      status: 'Hadir',
    })),
  });

  const jenisRapatOptions: RapatNotulensi['jenisRapat'][] = [
    'Rapat Pleno',
    'Rapat Pengurus Harian',
    'Rapat Koordinasi Sekbid',
    'Rapat Evaluasi Bulanan',
    'Rapat Kepanitiaan Event',
  ];

  // Filtering
  const filteredRapat = rapat.filter((item) => {
    const matchesSearch =
      item.judulRapat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.agenda.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pimpinanRapat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJenis = selectedJenis === 'all' || item.jenisRapat === selectedJenis;
    return matchesSearch && matchesJenis;
  });

  const handleOpenAdd = () => {
    setFormData({
      nomorNotulen: `NTL/OSIS/0${rapat.length + 1}/${new Date().toLocaleString('id-ID', { month: '2-digit' })}/${new Date().getFullYear()}`,
      judulRapat: '',
      jenisRapat: 'Rapat Pengurus Harian',
      tanggal: new Date().toISOString().split('T')[0],
      waktuMulai: '15:30',
      waktuSelesai: '17:00',
      tempat: 'Ruang Sekretariat OSIS',
      pimpinanRapat: schoolProfile.ketuaOsis,
      notulis: pengurus.find((p) => p.jabatan.includes('Sekretaris'))?.nama || 'Sekretaris OSIS',
      agenda: '',
      pembahasan: '',
      kesimpulanKeputusan: '',
      daftarPresensi: pengurus.map((p) => ({
        pengurusId: p.id,
        nama: p.nama,
        jabatan: p.jabatan,
        status: 'Hadir',
      })),
    });
    setIsFormOpen(true);
  };

  const handlePresensiChange = (index: number, status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa', catatan?: string) => {
    const updated = [...formData.daftarPresensi];
    updated[index] = {
      ...updated[index],
      status,
      catatan: catatan !== undefined ? catatan : updated[index].catatan,
    };
    setFormData({ ...formData, daftarPresensi: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judulRapat || !formData.agenda) {
      alert('Judul rapat dan agenda wajib diisi.');
      return;
    }
    addRapat(formData);
    setIsFormOpen(false);
  };

  const printNotulensiHtml = (r: RapatNotulensi) => {
    const kop = generateKopSuratHtml(schoolProfile);
    const hadirCount = r.daftarPresensi.filter((p) => p.status === 'Hadir').length;
    const totalCount = r.daftarPresensi.length;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Notulensi: ${r.judulRapat}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.5; padding: 25px; color: #111; }
          .title { text-align: center; font-size: 14pt; font-weight: bold; margin: 15px 0 5px; text-transform: uppercase; }
          .no { text-align: center; font-size: 10pt; color: #555; margin-bottom: 20px; }
          .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          .meta-table td { padding: 3px 5px; vertical-align: top; }
          .section-title { font-weight: bold; font-size: 11pt; border-bottom: 1px solid #333; margin: 15px 0 5px; padding-bottom: 2px; }
          table.presensi { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 10pt; }
          table.presensi th, table.presensi td { border: 1px solid #444; padding: 4px 6px; }
          table.presensi th { background: #f3f4f6; text-align: left; }
          .ttd-box { display: flex; justify-content: space-between; margin-top: 35px; text-align: center; }
          .ttd-col { width: 30%; }
          .ttd-line { border-bottom: 1px solid #111; display: inline-block; min-width: 150px; font-weight: bold; margin-top: 50px; }
        </style>
      </head>
      <body>
        ${kop}
        <div class="title">BERITA ACARA & NOTULENSI RAPAT OSIS</div>
        <div class="no">Nomor: ${r.nomorNotulen}</div>

        <table class="meta-table">
          <tr><td style="width: 130px;">Hari, Tanggal</td><td style="width: 10px;">:</td><td>${formatDateIndo(r.tanggal)}</td></tr>
          <tr><td>Waktu</td><td>:</td><td>${r.waktuMulai} - ${r.waktuSelesai} WIB</td></tr>
          <tr><td>Tempat</td><td>:</td><td>${r.tempat}</td></tr>
          <tr><td>Pimpinan Rapat</td><td>:</td><td>${r.pimpinanRapat}</td></tr>
          <tr><td>Notulis</td><td>:</td><td>${r.notulis}</td></tr>
          <tr><td>Kehadiran</td><td>:</td><td><strong>${hadirCount} dari ${totalCount} Pengurus Hadir (${Math.round((hadirCount / totalCount) * 100)}%)</strong></td></tr>
        </table>

        <div class="section-title">I. AGENDA RAPAT</div>
        <pre style="font-family: inherit; white-space: pre-wrap; margin: 5px 0;">${r.agenda}</pre>

        <div class="section-title">II. PEMBAHASAN RAPAT</div>
        <pre style="font-family: inherit; white-space: pre-wrap; margin: 5px 0; text-align: justify;">${r.pembahasan}</pre>

        <div class="section-title">III. HASIL KEPUTUSAN & TINDAK LANJUT</div>
        <pre style="font-family: inherit; white-space: pre-wrap; margin: 5px 0; text-align: justify;">${r.kesimpulanKeputusan}</pre>

        <div class="section-title">IV. DAFTAR PRESENSI KEHADIRAN PENGURUS</div>
        <table class="presensi">
          <thead>
            <tr>
              <th style="width: 30px; text-align: center;">No</th>
              <th>Nama Pengurus</th>
              <th>Jabatan</th>
              <th style="width: 70px; text-align: center;">Status</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            ${r.daftarPresensi
              .map(
                (p, idx) => `
              <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td><strong>${p.nama}</strong></td>
                <td>${p.jabatan}</td>
                <td style="text-align: center;">${p.status}</td>
                <td>${p.catatan || '-'}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="ttd-box">
          <div class="ttd-col">
            Pimpinan Rapat,<br/>
            <div class="ttd-line">${r.pimpinanRapat}</div>
          </div>
          <div class="ttd-col">
            Mengetahui,<br/>
            Pembina OSIS,<br/>
            <div class="ttd-line">${schoolProfile.pembinaOsis}</div>
          </div>
          <div class="ttd-col">
            Notulis Rapat,<br/>
            <div class="ttd-line">${r.notulis}</div>
          </div>
        </div>
      </body>
      </html>
    `;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      win.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-amber-500" />
            Notulensi & Presensi Rapat OSIS Masa Bakti {schoolProfile.masaBakti}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dokumentasi rapat pleno, koordinasi sekbid, evaluasi berkala, dan absensi digital pengurus
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-amber-400" />
          Catat Rapat & Presensi Baru
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul rapat, agenda, pimpinan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
          />
        </div>

        <select
          value={selectedJenis}
          onChange={(e) => setSelectedJenis(e.target.value)}
          className="w-full sm:w-60 py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          <option value="all">Semua Jenis Rapat ({rapat.length})</option>
          {jenisRapatOptions.map((j) => (
            <option key={j} value={j}>
              {j}
            </option>
          ))}
        </select>
      </div>

      {/* Rapat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRapat.map((r) => {
          const hadirCount = r.daftarPresensi.filter((p) => p.status === 'Hadir').length;
          const totalCount = r.daftarPresensi.length;
          const hadirPct = totalCount > 0 ? Math.round((hadirCount / totalCount) * 100) : 0;

          return (
            <div
              key={r.id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-all shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span className="font-mono">{r.nomorNotulen}</span>
                  <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {r.jenisRapat}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{r.judulRapat}</h3>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDateIndo(r.tanggal)} ({r.waktuMulai})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{r.tempat}</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span>Pimpinan: <strong className="text-slate-800">{r.pimpinanRapat}</strong></span>
                    <span className="font-semibold text-emerald-700">
                      Kehadiran: {hadirCount}/{totalCount} ({hadirPct}%)
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Keputusan: </span>
                  <p className="line-clamp-2 mt-0.5 text-slate-600 italic">
                    {r.kesimpulanKeputusan}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedRapatDetail(r)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Presensi & Detail
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => printNotulensiHtml(r)}
                    className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors flex items-center gap-1"
                    title="Cetak Berita Acara Notulensi"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Cetak Notulensi
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus notulensi "${r.judulRapat}"?`)) {
                        deleteRapat(r.id);
                      }
                    }}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md"
                    title="Hapus Rapat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRapat.length === 0 && (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200 text-xs text-slate-500">
          Belum ada catatan notulensi rapat yang sesuai filter.
        </div>
      )}

      {/* Add Rapat & Presensi Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">Catat Rapat & Presensi Kehadiran Pengurus</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Judul / Topik Rapat *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.judulRapat}
                    onChange={(e) => setFormData({ ...formData, judulRapat: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                    placeholder="Contoh: Rapat Koordinasi Teknis Pentas Seni 2027"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jenis Rapat
                  </label>
                  <select
                    value={formData.jenisRapat}
                    onChange={(e) => setFormData({ ...formData, jenisRapat: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    {jenisRapatOptions.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    required
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Waktu Mulai</label>
                  <input
                    type="text"
                    value={formData.waktuMulai}
                    onChange={(e) => setFormData({ ...formData, waktuMulai: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                    placeholder="15:30"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Waktu Selesai</label>
                  <input
                    type="text"
                    value={formData.waktuSelesai}
                    onChange={(e) => setFormData({ ...formData, waktuSelesai: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                    placeholder="17:00"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tempat</label>
                  <input
                    type="text"
                    value={formData.tempat}
                    onChange={(e) => setFormData({ ...formData, tempat: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg"
                    placeholder="Sekretariat OSIS"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pimpinan Rapat</label>
                  <input
                    type="text"
                    required
                    value={formData.pimpinanRapat}
                    onChange={(e) => setFormData({ ...formData, pimpinanRapat: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Notulis</label>
                  <input
                    type="text"
                    required
                    value={formData.notulis}
                    onChange={(e) => setFormData({ ...formData, notulis: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Agenda Rapat *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.agenda}
                  onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Poin-poin agenda yang dibahas..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pembahasan & Diskusi</label>
                <textarea
                  rows={3}
                  value={formData.pembahasan}
                  onChange={(e) => setFormData({ ...formData, pembahasan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Ringkasan jalannya diskusi dan pandangan peserta..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kesimpulan & Keputusan Tindak Lanjut</label>
                <textarea
                  rows={2}
                  value={formData.kesimpulanKeputusan}
                  onChange={(e) => setFormData({ ...formData, kesimpulanKeputusan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Kesepakatan bersama dan PIC penanggung jawab tugas..."
                />
              </div>

              {/* Presensi Checklist Table */}
              <div className="pt-2">
                <div className="font-semibold text-slate-800 text-xs mb-2">
                  Daftar Presensi Kehadiran Pengurus OSIS ({formData.daftarPresensi.length} Orang)
                </div>
                <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                      <tr>
                        <th className="py-2 px-3">Nama Pengurus</th>
                        <th className="py-2 px-3">Jabatan</th>
                        <th className="py-2 px-3 text-center">Status Kehadiran</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formData.daftarPresensi.map((peserta, idx) => (
                        <tr key={peserta.pengurusId} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-medium text-slate-900">{peserta.nama}</td>
                          <td className="py-2 px-3 text-slate-500 text-[11px]">{peserta.jabatan}</td>
                          <td className="py-2 px-3 text-center">
                            <div className="inline-flex items-center gap-1 p-0.5 bg-slate-100 rounded-md">
                              {(['Hadir', 'Izin', 'Sakit', 'Alpa'] as const).map((st) => (
                                <button
                                  type="button"
                                  key={st}
                                  onClick={() => handlePresensiChange(idx, st)}
                                  className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                                    peserta.status === st
                                      ? st === 'Hadir'
                                        ? 'bg-emerald-600 text-white'
                                        : st === 'Izin'
                                        ? 'bg-amber-600 text-white'
                                        : st === 'Sakit'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-rose-600 text-white'
                                      : 'text-slate-600 hover:text-slate-900'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                  Simpan Notulensi & Presensi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rapat Detail & Presensi Modal */}
      {selectedRapatDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedRapatDetail.judulRapat}</h3>
                <div className="text-xs text-slate-500 font-mono">{selectedRapatDetail.nomorNotulen}</div>
              </div>
              <button
                onClick={() => setSelectedRapatDetail(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700">
                <div>
                  <span className="font-semibold text-slate-900">Tanggal & Waktu:</span>{' '}
                  {formatDateIndo(selectedRapatDetail.tanggal)} ({selectedRapatDetail.waktuMulai} - {selectedRapatDetail.waktuSelesai})
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Tempat:</span> {selectedRapatDetail.tempat}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Pimpinan:</span> {selectedRapatDetail.pimpinanRapat}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Notulis:</span> {selectedRapatDetail.notulis}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Agenda Rapat:</h4>
                <div className="p-3 bg-slate-50 rounded-lg text-slate-700 whitespace-pre-wrap">
                  {selectedRapatDetail.agenda}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Hasil Pembahasan & Keputusan:</h4>
                <div className="p-3 bg-slate-50 rounded-lg text-slate-700 whitespace-pre-wrap">
                  {selectedRapatDetail.kesimpulanKeputusan}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">
                  Daftar Hadir Presensi ({selectedRapatDetail.daftarPresensi.filter((p) => p.status === 'Hadir').length}/{selectedRapatDetail.daftarPresensi.length} Hadir)
                </h4>
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                      <tr>
                        <th className="py-2 px-3">Nama</th>
                        <th className="py-2 px-3">Jabatan</th>
                        <th className="py-2 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedRapatDetail.daftarPresensi.map((p) => (
                        <tr key={p.pengurusId}>
                          <td className="py-2 px-3 font-medium text-slate-900">{p.nama}</td>
                          <td className="py-2 px-3 text-slate-500 text-[11px]">{p.jabatan}</td>
                          <td className="py-2 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                p.status === 'Hadir'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : p.status === 'Izin'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => printNotulensiHtml(selectedRapatDetail)}
                  className="px-4 py-2 font-semibold text-white bg-indigo-700 hover:bg-indigo-600 rounded-lg flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak Berita Acara Lengkap
                </button>
                <button
                  onClick={() => setSelectedRapatDetail(null)}
                  className="px-4 py-2 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
