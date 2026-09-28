import React, { useState } from 'react';
import {
  FileSignature,
  Download,
  Printer,
  Eye,
  CheckCircle,
  Clock,
  BookOpen,
  ArrowRight,
  FileCheck2,
} from 'lucide-react';
import { useOsis } from '../../context/OsisContext';
import { ProgramKerja } from '../../types';
import { generateProposalHtml } from '../../utils/documentTemplates';
import { downloadFile, formatRupiah, formatDateIndo } from '../../utils/exportUtils';

export const ProposalView: React.FC = () => {
  const { schoolProfile, proker, pengurus, addDokumen } = useOsis();

  const [selectedProkerId, setSelectedProkerId] = useState<string>(proker[0]?.id || '');
  const [docType, setDocType] = useState<'proposal' | 'lpj'>('proposal');
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  const currentProker = proker.find((p) => p.id === selectedProkerId) || proker[0];

  const handleGenerateDocument = () => {
    if (!currentProker) return;
    const html = generateProposalHtml(schoolProfile, currentProker, pengurus);
    setPreviewHtml(html);
  };

  const handleSaveToArsip = () => {
    if (!previewHtml || !currentProker) return;
    const blob = new Blob([previewHtml], { type: 'text/html' });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      addDokumen({
        judul: `${docType === 'proposal' ? 'Proposal' : 'LPJ'} Resmi: ${currentProker.namaProker}`,
        nomorSurat: `0${Math.floor(Math.random() * 80 + 10)}/OSIS-SMAN1/${docType.toUpperCase()}/2026`,
        jenis: docType === 'proposal' ? 'Proposal Kegiatan' : 'Laporan Pertanggungjawaban (LPJ)',
        tanggal: new Date().toISOString().split('T')[0],
        sekbid: currentProker.sekbid,
        fileName: `${docType === 'proposal' ? 'Proposal' : 'LPJ'}_${currentProker.namaProker.replace(/\s+/g, '_')}.html`,
        fileSize: '24 KB',
        fileType: 'text/html',
        fileData: reader.result as string,
        keterangan: `Dokumen resmi ${docType} bertandatangan Pembina dan Kepala Sekolah. Anggaran: ${formatRupiah(currentProker.anggaranBiaya)}`,
      });
      alert(`Dokumen ${docType.toUpperCase()} berhasil disimpan ke dalam Arsip Dokumen OSIS!`);
    };
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-indigo-600" />
            Generator Proposal & LPJ Kegiatan Standar Sekolah
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Susun proposal dan laporan pertanggungjawaban lengkap dengan RAB, lembar pengesahan sah 4 pilar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => {
                setDocType('proposal');
                setPreviewHtml(null);
              }}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                docType === 'proposal' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Proposal Kegiatan
            </button>
            <button
              onClick={() => {
                setDocType('lpj');
                setPreviewHtml(null);
              }}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                docType === 'lpj' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Laporan Pertanggungjawaban (LPJ)
            </button>
          </div>
        </div>
      </div>

      {/* Main Builder & Preview Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Selector & Details */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">1. Pilih Program Kerja</h3>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Daftar Program Kerja 1 Tahun:
            </label>
            <select
              value={selectedProkerId}
              onChange={(e) => {
                setSelectedProkerId(e.target.value);
                setPreviewHtml(null);
              }}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500"
            >
              {proker.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.namaProker} ({formatRupiah(p.anggaranBiaya)})
                </option>
              ))}
            </select>
          </div>

          {currentProker && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Seksi Bidang:</span>
                <p className="font-semibold text-slate-800">{currentProker.sekbid}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Penanggung Jawab:</span>
                <p className="font-semibold text-slate-800">{currentProker.penanggungJawab}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Jadwal & Tempat:</span>
                <p className="text-slate-800">
                  {formatDateIndo(currentProker.tanggalMulai)} · {currentProker.tempat}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Anggaran RAB:</span>
                <p className="font-mono font-bold text-slate-900">{formatRupiah(currentProker.anggaranBiaya)}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium">Sasaran:</span>
                <p className="text-slate-700">{currentProker.sasaran}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleGenerateDocument}
            className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Eye className="w-4 h-4" />
            Generate & Pratinjau Dokumen
          </button>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-relaxed">
            <strong>Struktur Baku Otomatis:</strong> Dokumen yang dihasilkan telah mencakup Cover Resmi OSIS, Latar Belakang, Maksud & Tujuan, Susunan Panitia, Rencana Anggaran Biaya (RAB), dan 4 Kolom Lembar Pengesahan (Ketua Pelaksana, Ketos, Pembina, Kepala Sekolah).
          </div>
        </div>

        {/* Right 2 Columns: Live Preview / Print Canvas */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col min-h-[600px]">
          {previewHtml ? (
            <>
              {/* Preview Bar */}
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-slate-800">
                  Pratinjau {docType === 'proposal' ? 'Proposal' : 'LPJ'}: {currentProker?.namaProker}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const win = window.open('', '_blank');
                      if (win) {
                        win.document.write(previewHtml);
                        win.document.close();
                        win.print();
                      }
                    }}
                    className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Cetak / PDF
                  </button>
                  <button
                    onClick={() =>
                      downloadFile(
                        previewHtml,
                        `${docType === 'proposal' ? 'Proposal' : 'LPJ'}_${currentProker?.namaProker.replace(/\s+/g, '_')}.html`,
                        'text/html;charset=utf-8'
                      )
                    }
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    Unduh Dokumen
                  </button>
                  <button
                    onClick={handleSaveToArsip}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-2xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Simpan ke Arsip
                  </button>
                </div>
              </div>

              {/* Document Frame */}
              <div className="p-6 bg-slate-100 flex-1 overflow-y-auto flex justify-center">
                <div className="w-full max-w-2xl bg-white shadow-md p-6 rounded-lg">
                  <iframe
                    srcDoc={previewHtml}
                    title="Pratinjau Dokumen"
                    className="w-full min-h-[750px] border-0"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <FileSignature className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-700">Dokumen Belum Di-generate</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Pilih program kerja di panel kiri dan klik tombol <strong>"Generate & Pratinjau Dokumen"</strong> untuk membuat proposal atau LPJ resmi.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
