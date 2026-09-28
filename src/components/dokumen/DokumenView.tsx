import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Printer,
  Search,
  Filter,
  Trash2,
  X,
  FileSignature,
  FilePlus,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { useOsis } from '../../context/OsisContext';
import { ArsipDokumen, JenisDokumen, SekbidType } from '../../types';
import { exportToCSV, downloadFile, fileToBase64, formatDateIndo } from '../../utils/exportUtils';
import { generateSuratResmiHtml } from '../../utils/documentTemplates';

export const DokumenView: React.FC = () => {
  const { schoolProfile, dokumen, addDokumen, deleteDokumen, pengurus } = useOsis();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJenis, setSelectedJenis] = useState<string>('all');

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    judul: '',
    nomorSurat: '',
    jenis: 'Surat Masuk' as JenisDokumen,
    tanggal: new Date().toISOString().split('T')[0],
    sekbid: 'Pengurus Inti',
    keterangan: '',
    fileName: '',
    fileSize: '',
    fileType: '',
    fileData: '',
  });

  // Letter generator modal state
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [letterData, setLetterData] = useState({
    nomorSurat: `0${dokumen.length + 12}/OSIS-SMAN1/UND/${new Date().toLocaleString('id-ID', { month: '2-digit' })}/${new Date().getFullYear()}`,
    lampiran: '-',
    perihal: 'Undangan Menghadiri Rapat Koordinasi Program Kerja',
    tanggalSurat: new Date().toISOString().split('T')[0],
    tujuanNama: 'Bapak/Ibu Pembina Ekstrakurikuler',
    tujuanInstansi: schoolProfile.namaSekolah,
    isiPembuka: 'Sehubungan dengan akan dilaksanakannya rangkaian program kerja OSIS semester ganjil, bersama surat ini kami mengundang Bapak/Ibu untuk berkenan hadir pada rapat koordinasi yang akan diselenggarakan pada:',
    isiAcara: {
      hariTanggal: 'Senin, 12 Oktober 2026',
      waktu: '14.00 WIB s.d. Selesai',
      tempat: 'Ruang Rapat OSIS SMA Negeri 1 Teladan',
      agenda: 'Koordinasi Pelaksanaan Kegiatan Kesiswaan & Sinkronisasi Jadwal',
    },
    isiPenutup: 'Mengingat pentingnya agenda rapat koordinasi tersebut, kami sangat mengharapkan kehadiran Bapak/Ibu tepat pada waktunya. Atas perhatian, arahan, dan kerjasamanya kami ucapkan terima kasih.',
    namaKetua: schoolProfile.ketuaOsis,
    nisnKetua: schoolProfile.nisnKetuaOsis,
    namaSekretaris: pengurus.find((p) => p.jabatan.includes('Sekretaris'))?.nama || 'Fadhil Naufal',
    nisnSekretaris: pengurus.find((p) => p.jabatan.includes('Sekretaris'))?.nisn || '0081293847',
    namaPembina: schoolProfile.pembinaOsis,
    nipPembina: schoolProfile.nipPembinaOsis,
    namaKepsek: schoolProfile.kepalaSekolah,
    nipKepsek: schoolProfile.nipKepalaSekolah,
    tembusan: [
      'Kepala Sekolah SMA Negeri 1 Teladan',
      'Wakil Kepala Sekolah Bidang Kesiswaan',
      'Arsip Kesekretariatan OSIS'
    ],
  });

  // Preview generated letter in modal
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  const jenisOptions: JenisDokumen[] = [
    'Surat Undangan',
    'Surat Permohonan Izin',
    'Surat Dispensasi',
    'Surat Keputusan (SK)',
    'Proposal Kegiatan',
    'Laporan Pertanggungjawaban (LPJ)',
    'Notulensi Rapat',
    'Sertifikat & Piagam',
    'Foto & Dokumentasi',
    'Arsip Lainnya',
  ];

  // Filtering
  const filteredDokumen = dokumen.filter((d) => {
    const matchesSearch =
      d.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.keterangan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJenis = selectedJenis === 'all' || d.jenis === selectedJenis;
    return matchesSearch && matchesJenis;
  });

  // Handle local file selection for upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await fileToBase64(file);
        const sizeFormatted = file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

        setUploadData((prev) => ({
          ...prev,
          fileName: file.name,
          fileSize: sizeFormatted,
          fileType: file.type || 'application/octet-stream',
          fileData: base64,
          judul: prev.judul || file.name.replace(/\.[^/.]+$/, ''),
        }));
      } catch (err) {
        alert('Gagal membaca file dari perangkat.');
      }
    }
  };

  const handleSaveUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.judul) {
      alert('Judul dokumen wajib diisi.');
      return;
    }
    addDokumen({
      judul: uploadData.judul,
      nomorSurat: uploadData.nomorSurat || '-',
      jenis: uploadData.jenis,
      tanggal: uploadData.tanggal,
      sekbid: uploadData.sekbid,
      fileName: uploadData.fileName || 'dokumen_osis.pdf',
      fileSize: uploadData.fileSize || '350 KB',
      fileType: uploadData.fileType || 'application/pdf',
      fileData: uploadData.fileData || '',
      keterangan: uploadData.keterangan,
    });
    setIsUploadOpen(false);
  };

  // Download stored document
  const handleDownloadDoc = (doc: ArsipDokumen) => {
    if (doc.fileData && doc.fileData.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = doc.fileData;
      a.download = doc.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Generate clean text/html export if no raw binary attached
      const textContent = `DOKUMEN RESMI OSIS - ${schoolProfile.namaSekolah}\n` +
        `Judul: ${doc.judul}\nNomor: ${doc.nomorSurat}\nJenis: ${doc.jenis}\nTanggal: ${doc.tanggal}\nKeterangan: ${doc.keterangan}\n\n` +
        `Masa Bakti: ${schoolProfile.masaBakti} - ${schoolProfile.namaKabinet}`;
      downloadFile(textContent, doc.fileName.replace(/\.pdf$/, '.txt'), 'text/plain;charset=utf-8');
    }
  };

  // Generate letter action
  const handleGenerateLetter = (e: React.FormEvent) => {
    e.preventDefault();
    const html = generateSuratResmiHtml(schoolProfile, letterData);
    setPreviewHtml(html);
  };

  const handleSaveGeneratedLetterToArsip = () => {
    if (!previewHtml) return;
    const blob = new Blob([previewHtml], { type: 'text/html' });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      addDokumen({
        judul: letterData.perihal,
        nomorSurat: letterData.nomorSurat,
        jenis: 'Surat Undangan',
        tanggal: letterData.tanggalSurat,
        sekbid: 'Pengurus Inti',
        fileName: `Surat_${letterData.nomorSurat.replace(/[\/\\]/g, '_')}.html`,
        fileSize: '15 KB',
        fileType: 'text/html',
        fileData: reader.result as string,
        keterangan: `Surat resmi tujuan: ${letterData.tujuanNama} (${letterData.tujuanInstansi})`,
      });
      alert('Surat resmi berhasil disimpan ke dalam Arsip Dokumen OSIS!');
      setIsGeneratorOpen(false);
      setPreviewHtml(null);
    };
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            Arsip Dokumen, Surat & Berkas Resmi OSIS {schoolProfile.masaBakti}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pusat penyimpanan surat keluar/masuk, proposal, LPJ, dan generator surat resmi bertandatangan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-600 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileSignature className="w-3.5 h-3.5 text-indigo-200" />
            Buat Surat Resmi (Kop OSIS)
          </button>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            Upload File / Berkas
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul, nomor surat, keterangan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={selectedJenis}
            onChange={(e) => setSelectedJenis(e.target.value)}
            className="w-full sm:w-60 py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">Semua Jenis Dokumen ({dokumen.length})</option>
            {jenisOptions.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Document Grid / Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Nama Dokumen & Nomor Surat</th>
                <th className="py-3 px-4">Jenis Dokumen</th>
                <th className="py-3 px-4">Tanggal Arsip</th>
                <th className="py-3 px-4">Seksi Bidang</th>
                <th className="py-3 px-4">Ukuran</th>
                <th className="py-3 px-4 text-right no-print">Aksi Unduh / Hapus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDokumen.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{doc.judul}</div>
                    <div className="text-[11px] font-mono text-slate-500">{doc.nomorSurat}</div>
                    {doc.keterangan && (
                      <div className="text-[11px] text-slate-400 mt-0.5 max-w-md line-clamp-1">
                        {doc.keterangan}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="text-[11px] font-medium bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {doc.jenis}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-700">
                    {formatDateIndo(doc.tanggal)}
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-[180px] truncate">
                    {doc.sekbid}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {doc.fileSize}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap no-print">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleDownloadDoc(doc)}
                        className="px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-md transition-colors flex items-center gap-1 shadow-2xs"
                        title="Download file ini ke komputer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Unduh
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus arsip dokumen "${doc.judul}"?`)) {
                            deleteDokumen(doc.id);
                          }
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                        title="Hapus Dokumen"
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

        {filteredDokumen.length === 0 && (
          <div className="p-12 text-center text-slate-500 text-xs">
            Belum ada arsip dokumen yang sesuai dengan pencarian atau filter.
          </div>
        )}
      </div>

      {/* Upload Berkas Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-base font-bold text-slate-900">Upload Dokumen / Berkas ke Arsip OSIS</h2>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUpload} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih Berkas dari Komputer *
                </label>
                <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition-colors text-center cursor-pointer">
                  <label className="cursor-pointer block">
                    <Upload className="w-7 h-7 text-amber-500 mx-auto mb-2" />
                    <span className="font-semibold text-slate-800">Pilih Dokumen / Foto</span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Mendukung PDF, DOCX, XLSX, JPG, PNG (Maks 15MB)
                    </p>
                    <input
                      type="file"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  {uploadData.fileName && (
                    <div className="mt-3 p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between text-left">
                      <span className="font-medium text-slate-900 truncate max-w-[280px]">
                        {uploadData.fileName}
                      </span>
                      <span className="font-mono text-slate-500 text-[10px]">{uploadData.fileSize}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul / Nama Dokumen *
                </label>
                <input
                  type="text"
                  required
                  value={uploadData.judul}
                  onChange={(e) => setUploadData({ ...uploadData, judul: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                  placeholder="Contoh: Proposal Sponsor Teladan Vaganza 2027"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor Surat / Berkas
                  </label>
                  <input
                    type="text"
                    value={uploadData.nomorSurat}
                    onChange={(e) => setUploadData({ ...uploadData, nomorSurat: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs"
                    placeholder="012/OSIS-SMAN1/..."
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jenis Dokumen
                  </label>
                  <select
                    value={uploadData.jenis}
                    onChange={(e) => setUploadData({ ...uploadData, jenis: e.target.value as JenisDokumen })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    {jenisOptions.map((j) => (
                      <option key={j} value={j}>
                        {j}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan / Keterangan Berkas
                </label>
                <textarea
                  rows={2}
                  value={uploadData.keterangan}
                  onChange={(e) => setUploadData({ ...uploadData, keterangan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Ringkasan isi dokumen atau peruntukannya..."
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                >
                  Simpan ke Arsip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generator Surat Resmi Modal */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Generator Surat Resmi OSIS (Format Kop Standar Nasional)
                </h2>
                <p className="text-xs text-slate-500">
                  Surat resmi otomatis dengan Kop Sekolah, nomor surat, dan 4 kolom tanda tangan sah
                </p>
              </div>
              <button
                onClick={() => {
                  setIsGeneratorOpen(false);
                  setPreviewHtml(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!previewHtml ? (
              <form onSubmit={handleGenerateLetter} className="p-6 overflow-y-auto space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nomor Surat Resmi *
                    </label>
                    <input
                      type="text"
                      required
                      value={letterData.nomorSurat}
                      onChange={(e) => setLetterData({ ...letterData, nomorSurat: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Lampiran
                    </label>
                    <input
                      type="text"
                      value={letterData.lampiran}
                      onChange={(e) => setLetterData({ ...letterData, lampiran: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      placeholder="1 (Satu) Berkas / -"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tanggal Surat
                    </label>
                    <input
                      type="date"
                      value={letterData.tanggalSurat}
                      onChange={(e) => setLetterData({ ...letterData, tanggalSurat: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Perihal Surat *
                  </label>
                  <input
                    type="text"
                    required
                    value={letterData.perihal}
                    onChange={(e) => setLetterData({ ...letterData, perihal: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium"
                    placeholder="Contoh: Permohonan Izin Peminjaman Ruang Aula"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tujuan Surat (Nama / Jabatan)
                    </label>
                    <input
                      type="text"
                      required
                      value={letterData.tujuanNama}
                      onChange={(e) => setLetterData({ ...letterData, tujuanNama: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                      placeholder="Bapak Kepala Sekolah / Pembina"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Instansi / Tempat
                    </label>
                    <input
                      type="text"
                      value={letterData.tujuanInstansi}
                      onChange={(e) => setLetterData({ ...letterData, tujuanInstansi: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Paragraf Pembuka
                  </label>
                  <textarea
                    rows={2}
                    value={letterData.isiPembuka}
                    onChange={(e) => setLetterData({ ...letterData, isiPembuka: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                {/* Acara details */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                    Rincian Waktu, Tempat & Agenda Kegiatan
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Hari & Tanggal</label>
                      <input
                        type="text"
                        value={letterData.isiAcara.hariTanggal}
                        onChange={(e) =>
                          setLetterData({
                            ...letterData,
                            isiAcara: { ...letterData.isiAcara, hariTanggal: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Waktu Pelaksanaan</label>
                      <input
                        type="text"
                        value={letterData.isiAcara.waktu}
                        onChange={(e) =>
                          setLetterData({
                            ...letterData,
                            isiAcara: { ...letterData.isiAcara, waktu: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Tempat</label>
                      <input
                        type="text"
                        value={letterData.isiAcara.tempat}
                        onChange={(e) =>
                          setLetterData({
                            ...letterData,
                            isiAcara: { ...letterData.isiAcara, tempat: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-0.5">Agenda Kegiatan</label>
                      <input
                        type="text"
                        value={letterData.isiAcara.agenda}
                        onChange={(e) =>
                          setLetterData({
                            ...letterData,
                            isiAcara: { ...letterData.isiAcara, agenda: e.target.value },
                          })
                        }
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Paragraf Penutup
                  </label>
                  <textarea
                    rows={2}
                    value={letterData.isiPenutup}
                    onChange={(e) => setLetterData({ ...letterData, isiPenutup: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsGeneratorOpen(false)}
                    className="px-4 py-2 font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-semibold text-white bg-indigo-700 hover:bg-indigo-600 rounded-lg shadow-xs flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Pratinjau Surat Resmi
                  </button>
                </div>
              </form>
            ) : (
              /* Preview Mode */
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-3 bg-amber-50 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900">
                  <span>Pratinjau Surat Resmi Siap Cetak / Unduh</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewHtml(null)}
                      className="px-3 py-1 bg-white border border-amber-300 hover:bg-amber-100 rounded-md font-medium text-slate-700"
                    >
                      ← Ubah Form
                    </button>
                    <button
                      onClick={() => {
                        const win = window.open('', '_blank');
                        if (win) {
                          win.document.write(previewHtml);
                          win.document.close();
                          win.print();
                        }
                      }}
                      className="px-3 py-1 bg-indigo-700 hover:bg-indigo-600 text-white rounded-md font-semibold flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Cetak / Simpan PDF
                    </button>
                    <button
                      onClick={() =>
                        downloadFile(
                          previewHtml,
                          `Surat_${letterData.nomorSurat.replace(/[\/\\]/g, '_')}.html`,
                          'text/html;charset=utf-8'
                        )
                      }
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      Unduh File Surat (.html)
                    </button>
                    <button
                      onClick={handleSaveGeneratedLetterToArsip}
                      className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-md font-semibold flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Simpan ke Arsip
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1 bg-slate-100 flex justify-center">
                  <div className="w-full max-w-3xl bg-white shadow-md p-8 rounded-lg">
                    <iframe
                      srcDoc={previewHtml}
                      title="Pratinjau Surat"
                      className="w-full min-h-[750px] border-0"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
