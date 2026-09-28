import React, { useState } from 'react';
import {
  Award,
  Printer,
  Download,
  CheckCircle,
  Eye,
  Sparkles,
  Users,
} from 'lucide-react';
import { useOsis } from '../../context/OsisContext';
import { generateSertifikatHtml } from '../../utils/documentTemplates';
import { downloadFile, formatDateIndo } from '../../utils/exportUtils';

export const SertifikatView: React.FC = () => {
  const { schoolProfile, proker, pengurus, addDokumen } = useOsis();

  const [formData, setFormData] = useState({
    nomorSertifikat: `045/OSIS-SMAN1/SERTIF/${new Date().getFullYear()}`,
    namaPenerima: pengurus[0]?.nama || 'Muhammad Rizky Pratama',
    sebagai: 'Ketua Pelaksana / Panitia Inti',
    namaKegiatan: proker[0]?.namaProker || 'Masa Pengenalan Lingkungan Sekolah (MPLS) Ramah 2026',
    tanggalKegiatan: '16 s.d. 18 Juli 2026',
  });

  const [previewHtml, setPreviewHtml] = useState<string | null>(() => {
    return generateSertifikatHtml(schoolProfile, {
      nomorSertifikat: `045/OSIS-SMAN1/SERTIF/${new Date().getFullYear()}`,
      namaPenerima: pengurus[0]?.nama || 'Muhammad Rizky Pratama',
      sebagai: 'Ketua Pelaksana / Panitia Inti',
      namaKegiatan: proker[0]?.namaProker || 'Masa Pengenalan Lingkungan Sekolah (MPLS) Ramah 2026',
      tanggalKegiatan: '16 s.d. 18 Juli 2026',
    });
  });

  const handleUpdatePreview = (e: React.FormEvent) => {
    e.preventDefault();
    const html = generateSertifikatHtml(schoolProfile, formData);
    setPreviewHtml(html);
  };

  const handlePrint = () => {
    if (!previewHtml) return;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(previewHtml);
      win.document.close();
      win.print();
    }
  };

  const handleDownload = () => {
    if (!previewHtml) return;
    downloadFile(
      previewHtml,
      `Sertifikat_${formData.namaPenerima.replace(/\s+/g, '_')}.html`,
      'text/html;charset=utf-8'
    );
  };

  const handleSaveToArsip = () => {
    if (!previewHtml) return;
    const blob = new Blob([previewHtml], { type: 'text/html' });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      addDokumen({
        judul: `Sertifikat Penghargaan: ${formData.namaPenerima} (${formData.sebagai})`,
        nomorSurat: formData.nomorSertifikat,
        jenis: 'Sertifikat & Piagam',
        tanggal: new Date().toISOString().split('T')[0],
        sekbid: 'Pengurus Inti',
        fileName: `Sertifikat_${formData.namaPenerima.replace(/\s+/g, '_')}.html`,
        fileSize: '18 KB',
        fileType: 'text/html',
        fileData: reader.result as string,
        keterangan: `Sertifikat kegiatan "${formData.namaKegiatan}" untuk ${formData.namaPenerima}.`,
      });
      alert('Sertifikat berhasil didaftarkan ke Arsip Dokumen OSIS!');
    };
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Generator Piagam Penghargaan & Sertifikat Resmi OSIS
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Buat dan cetak sertifikat resmi untuk panitia, peserta lomba, pemateri, dan pengurus purna bakti
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-600 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Sertifikat (PDF)
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            Unduh Berkas (.html)
          </button>
          <button
            onClick={handleSaveToArsip}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Simpan ke Arsip
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Input Form */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Konfigurasi Piagam Sertifikat</h3>

          <form onSubmit={handleUpdatePreview} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Sertifikat Resmi *
              </label>
              <input
                type="text"
                required
                value={formData.nomorSertifikat}
                onChange={(e) => setFormData({ ...formData, nomorSertifikat: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Penerima Sertifikat *
              </label>
              <input
                type="text"
                required
                value={formData.namaPenerima}
                onChange={(e) => setFormData({ ...formData, namaPenerima: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium"
                placeholder="Nama Siswa / Guru / Tamu"
              />
              {/* Quick autofill from pengurus */}
              <div className="mt-1 flex items-center gap-1 overflow-x-auto py-1">
                <span className="text-[10px] text-slate-400 shrink-0">Pilih Cepat:</span>
                {pengurus.slice(0, 4).map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        namaPenerima: p.nama,
                        sebagai: `${p.jabatan} - ${p.sekbid}`,
                      })
                    }
                    className="text-[10px] text-slate-600 bg-slate-100 hover:bg-amber-100 px-1.5 py-0.5 rounded whitespace-nowrap"
                  >
                    {p.panggilan}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Atas Peran / Kontribusi Sebagai *
              </label>
              <input
                type="text"
                required
                value={formData.sebagai}
                onChange={(e) => setFormData({ ...formData, sebagai: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="Contoh: Juara 1 Lomba Debat / Panitia Pelaksana"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Kegiatan / Acara *
              </label>
              <input
                type="text"
                required
                value={formData.namaKegiatan}
                onChange={(e) => setFormData({ ...formData, namaKegiatan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
              {/* Quick select from proker */}
              <div className="mt-1 flex items-center gap-1 overflow-x-auto py-1">
                <span className="text-[10px] text-slate-400 shrink-0">Dari Proker:</span>
                {proker.slice(0, 3).map((pr) => (
                  <button
                    type="button"
                    key={pr.id}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        namaKegiatan: pr.namaProker,
                        tanggalKegiatan: formatDateIndo(pr.tanggalMulai),
                      })
                    }
                    className="text-[10px] text-slate-600 bg-slate-100 hover:bg-amber-100 px-1.5 py-0.5 rounded whitespace-nowrap truncate max-w-[120px]"
                    title={pr.namaProker}
                  >
                    {pr.namaProker}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Waktu / Tanggal Kegiatan
              </label>
              <input
                type="text"
                value={formData.tanggalKegiatan}
                onChange={(e) => setFormData({ ...formData, tanggalKegiatan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="16 s.d. 18 Juli 2026"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs mt-2"
            >
              <Eye className="w-4 h-4" />
              Perbarui Pratinjau Sertifikat
            </button>
          </form>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 space-y-1">
            <span className="font-semibold text-slate-800">Tanda Tangan Pengesahan:</span>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
              <li>Ketua Umum OSIS: {schoolProfile.ketuaOsis}</li>
              <li>Kepala Sekolah: {schoolProfile.kepalaSekolah}</li>
              <li>Pembina OSIS: {schoolProfile.pembinaOsis}</li>
            </ul>
          </div>
        </div>

        {/* Right: Certificate Live Landscape Preview */}
        <div className="lg:col-span-2 bg-slate-100 p-6 rounded-xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col items-center justify-center">
          {previewHtml && (
            <div className="w-full bg-white shadow-xl rounded-lg overflow-hidden border border-slate-300 aspect-[1.414/1] max-w-2xl">
              <iframe
                srcDoc={previewHtml}
                title="Pratinjau Sertifikat"
                className="w-full h-full border-0"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
