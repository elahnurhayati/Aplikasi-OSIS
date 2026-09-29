import React, { useRef, useState } from 'react';
import {
  FileCheck2,
  Printer,
  Download,
  Upload,
  HardDriveDownload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Award,
  Wallet,
  CalendarCheck,
  Users,
} from 'lucide-react';
import { useOsis } from '../../context/OsisContext';
import { formatRupiah, formatDateIndo, downloadFile } from '../../utils/exportUtils';
import { generateKopSuratHtml } from '../../utils/documentTemplates';

export const LaporanAkhirView: React.FC = () => {
  const {
    schoolProfile,
    pengurus,
    proker,
    kas,
    dokumen,
    rapat,
    aspirasi,
    totalKasMasuk,
    totalKasKeluar,
    saldoKas,
    persentaseProkerSelesai,
    exportBackupJson,
    importBackupJson,
    resetToDefault,
  } = useOsis();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const prokerSelesai = proker.filter((p) => p.status === 'Selesai');
  const prokerBerjalan = proker.filter((p) => p.status === 'Sedang Berjalan');
  const aspirasiSelesai = aspirasi.filter((a) => a.status === 'Selesai Terealisasi');

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const success = await importBackupJson(file);
      if (success) {
        setImportStatus('Berhasil merestore seluruh data OSIS dari file backup!');
        setTimeout(() => setImportStatus(null), 4000);
      } else {
        alert('Format file backup tidak valid. Pastikan memilih file .json backup OSIS 360.');
      }
    }
  };

  const handlePrintLpjAkhir = () => {
    const kop = generateKopSuratHtml(schoolProfile);
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>LPJ Akhir Masa Jabatan - ${schoolProfile.namaKabinet}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 11pt; line-height: 1.5; padding: 30px; color: #111; }
          .title { text-align: center; font-size: 15pt; font-weight: bold; margin: 15px 0 5px; text-transform: uppercase; }
          .sub { text-align: center; font-size: 11pt; font-style: italic; color: #444; margin-bottom: 25px; }
          .section { margin-top: 20px; }
          .section-title { font-size: 12pt; font-weight: bold; border-bottom: 2px solid #222; padding-bottom: 3px; margin-bottom: 8px; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 10pt; }
          table th, table td { border: 1px solid #444; padding: 5px 8px; }
          table th { background: #f3f4f6; text-align: left; }
          .ttd-box { display: flex; justify-content: space-between; margin-top: 40px; text-align: center; }
          .ttd-col { width: 45%; }
          .ttd-line { border-bottom: 1px solid #111; display: inline-block; min-width: 170px; font-weight: bold; margin-top: 60px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        ${kop}
        <div class="title">LAPORAN PERTANGGUNGJAWABAN (LPJ) AKHIR MASA JABATAN</div>
        <div class="sub">${schoolProfile.namaKabinet} · PERIODE MASA BAKTI ${schoolProfile.masaBakti}</div>

        <div class="section">
          <div class="section-title">I. KATA PENGANTAR & CAPAIAN UMUM</div>
          <p style="text-align: justify;">
            Puji syukur kehadirat Tuhan Yang Maha Esa, atas limpahan rahmat-Nya kepengurusan OSIS <strong>${schoolProfile.namaSekolah}</strong> periode <strong>${schoolProfile.masaBakti}</strong> (${schoolProfile.namaKabinet}) telah menuntaskan seluruh amanah jabatan selama satu tahun penuh dengan penuh tanggung jawab, dedikasi, dan transparansi.
          </p>
        </div>

        <div class="section">
          <div class="section-title">II. REKAPITULASI PROGRAM KERJA TAHUNAN</div>
          <p>
            Dari total <strong>${proker.length}</strong> program kerja yang direncanakan dalam matriks kerja 1 tahun, sebanyak <strong>${prokerSelesai.length}</strong> program terlaksana tuntas (${persentaseProkerSelesai}%), <strong>${prokerBerjalan.length}</strong> program berjalan, dan seluruh dokumentasi telah diarsipkan.
          </p>
          <table>
            <thead>
              <tr>
                <th style="width: 30px;">No</th>
                <th>Nama Program Kerja</th>
                <th>Seksi Bidang</th>
                <th>Status</th>
                <th style="text-align: right;">Realisasi Biaya</th>
              </tr>
            </thead>
            <tbody>
              ${proker
                .map(
                  (p, idx) => `
                <tr>
                  <td style="text-align: center;">${idx + 1}</td>
                  <td><strong>${p.namaProker}</strong></td>
                  <td>${p.sekbid}</td>
                  <td>${p.status}</td>
                  <td style="text-align: right;">${formatRupiah(p.anggaranBiaya)}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <div class="section-title">III. REKAPITULASI KEUANGAN KAS 1 TAHUN</div>
          <table>
            <tr>
              <td style="width: 250px;">Total Pemasukan Kas</td>
              <td>: <strong>${formatRupiah(totalKasMasuk)}</strong></td>
            </tr>
            <tr>
              <td>Total Pengeluaran & Realisasi Kegiatan</td>
              <td>: <strong>${formatRupiah(totalKasKeluar)}</strong></td>
            </tr>
            <tr>
              <td>Saldo Sisa Kas yang Diserahterimakan</td>
              <td>: <strong style="color: #047857;">${formatRupiah(saldoKas)}</strong></td>
            </tr>
          </table>
          <p style="font-size: 9.5pt; color: #555; margin-top: 4px;">
            *Seluruh bukti nota kwitansi fisik telah diverifikasi oleh Bendahara Umum dan Pembina OSIS.
          </p>
        </div>

        <div class="section">
          <div class="section-title">IV. EVALUASI, SARAN & SERAH TERIMA JABATAN</div>
          <p style="text-align: justify;">
            Demikian laporan pertanggungjawaban akhir ini kami susun sebagai bentuk akuntabilitas publik kepengurusan. Kami merekomendasikan kepengurusan periode selanjutnya untuk terus mengoptimalkan sistem digitalisasi kesekretariatan dan menjaga kesinambungan kemitraan pihak eksternal.
          </p>
        </div>

        <div style="text-align: right; margin-top: 25px;">
          ${schoolProfile.kota}, ${formatDateIndo(new Date().toISOString().split('T')[0])}
        </div>

        <div class="ttd-box">
          <div class="ttd-col">
            Ketua Umum OSIS Demisioner,<br/>
            <div class="ttd-line">${schoolProfile.ketuaOsis}</div><br/>
            NISN. ${schoolProfile.nisnKetuaOsis}
          </div>
          <div class="ttd-col">
            Sekretaris Umum Demisioner,<br/>
            <div class="ttd-line">${pengurus.find((p) => p.jabatan.includes('Sekretaris'))?.nama || 'Fadhil Naufal'}</div><br/>
            NISN. ${pengurus.find((p) => p.jabatan.includes('Sekretaris'))?.nisn || '0081293847'}
          </div>
        </div>

        <div class="ttd-box" style="margin-top: 30px;">
          <div class="ttd-col">
            Menyetujui,<br/>
            <strong>Pembina OSIS</strong><br/>
            <div class="ttd-line">${schoolProfile.pembinaOsis}</div><br/>
            NIP. ${schoolProfile.nipPembinaOsis}
          </div>
          <div class="ttd-col">
            Mengesahkan,<br/>
            <strong>Kepala Sekolah</strong><br/>
            <div class="ttd-line">${schoolProfile.kepalaSekolah}</div><br/>
            NIP. ${schoolProfile.nipKepalaSekolah}
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
    } else {
      const printIframe = document.createElement('iframe');
      printIframe.style.position = 'fixed';
      printIframe.style.right = '0';
      printIframe.style.bottom = '0';
      printIframe.style.width = '0';
      printIframe.style.height = '0';
      printIframe.style.border = '0';
      document.body.appendChild(printIframe);
      printIframe.contentWindow?.document.write(html);
      printIframe.contentWindow?.document.close();
      setTimeout(() => {
        printIframe.contentWindow?.focus();
        printIframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(printIframe), 2000);
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-600" />
            Laporan Pertanggungjawaban (LPJ) Akhir Masa Jabatan 1 Tahun
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluasi kinerja 1 tahun penuh, serah terima jabatan (Sertijab), serta backup & restore database
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintLpjAkhir}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            Cetak LPJ Akhir 1 Tahun (PDF)
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {importStatus}
        </div>
      )}

      {/* 1 Year Performance Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Ketercapaian Proker</span>
            <CalendarCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {persentaseProkerSelesai}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {prokerSelesai.length} dari {proker.length} kegiatan selesai
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Saldo Akhir Kas</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 tabular-nums">
            {formatRupiah(saldoKas)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Diserahterimakan ke kepengurusan baru
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Pengurus Purna Bakti</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {pengurus.length} Siswa
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            100% tuntas bertugas 1 tahun
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Arsip Dokumen Legal</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {dokumen.length + rapat.length} Berkas
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Surat, proposal, LPJ & notulensi
          </div>
        </div>
      </div>

      {/* Backup and Restore Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
              <HardDriveDownload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Backup Seluruh Database OSIS</h3>
              <p className="text-xs text-slate-500">
                Simpan file cadangan lengkap berisi semua data pengurus, proker, kas, arsip dokumen, notulensi rapat, dan aspirasi.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-lg text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800">Isi Berkas Backup:</div>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
              <li>{pengurus.length} Data Pribadi Pengurus & Foto KTA</li>
              <li>{proker.length} Program Kerja Tahunan & Timeline</li>
              <li>{kas.length} Buku Kas Umum beserta Nota Fisik</li>
              <li>{dokumen.length} Arsip Dokumen & Berkas Terlampir</li>
              <li>{rapat.length} Notulensi & Presensi Kehadiran</li>
              <li>{aspirasi.length} Aspirasi & Tanggapan Siswa</li>
            </ul>
          </div>

          <button
            onClick={exportBackupJson}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4 text-amber-400" />
            Download File Cadangan (.json)
          </button>
        </div>

        {/* Restore Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pulihkan Data (Restore Backup)</h3>
              <p className="text-xs text-slate-500">
                Pindahkan data OSIS ke komputer sekretariat lain atau pulihkan data dari file .json yang sudah diunduh sebelumnya.
              </p>
            </div>
          </div>

          <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-center cursor-pointer hover:bg-slate-100/70 transition-colors">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-800 shadow-2xs"
            >
              <Upload className="w-4 h-4 text-indigo-600" />
              Pilih File Backup (.json)
            </button>
            <p className="text-[11px] text-slate-400 mt-2">
              Hanya menerima file JSON hasil backup resmi sistem OSIS 360.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Ingin mulai periode baru dari template awal?</span>
            <button
              onClick={resetToDefault}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reset ke Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
