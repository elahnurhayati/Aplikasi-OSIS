import { SchoolProfile, PengurusOsis, ProgramKerja, TransaksiKas, RapatNotulensi } from '../types';
import { formatDateIndo, formatRupiah } from './exportUtils';

export const generateKopSuratHtml = (school: SchoolProfile): string => {
  return `
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 3px double #000; padding-bottom: 8px; margin-bottom: 20px; font-family: 'Times New Roman', serif;">
      <div style="width: 70px; text-align: center;">
        <img src="${school.logoOsisUrl}" alt="Logo OSIS" style="width: 65px; height: 65px; object-fit: contain;" />
      </div>
      <div style="text-align: center; flex: 1; padding: 0 10px;">
        <div style="font-size: 11pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">ORGANISASI SISWA INTRA SEKOLAH (OSIS)</div>
        <div style="font-size: 14pt; font-weight: bold; text-transform: uppercase; color: #1e3a8a;">${school.namaSekolah}</div>
        <div style="font-size: 9pt; font-style: italic; color: #374151;">${school.namaKabinet} - MASA BAKTI ${school.masaBakti}</div>
        <div style="font-size: 8.5pt; color: #4b5563; margin-top: 2px;">
          ${school.alamat}, ${school.kota}, ${school.provinsi} ${school.kodePos}
        </div>
        <div style="font-size: 8pt; color: #6b7280;">
          Telp: ${school.telepon} | Email: ${school.email} | Web: ${school.website}
        </div>
      </div>
      <div style="width: 70px; text-align: center;">
        <img src="${school.logoSekolahUrl}" alt="Logo Sekolah" style="width: 65px; height: 65px; object-fit: contain;" />
      </div>
    </div>
  `;
};

export const generateSuratResmiHtml = (
  school: SchoolProfile,
  data: {
    nomorSurat: string;
    lampiran: string;
    perihal: string;
    tanggalSurat: string;
    tujuanNama: string;
    tujuanInstansi: string;
    isiPembuka: string;
    isiAcara: {
      hariTanggal: string;
      waktu: string;
      tempat: string;
      agenda: string;
    };
    isiPenutup: string;
    namaKetua: string;
    nisnKetua: string;
    namaSekretaris: string;
    nisnSekretaris: string;
    namaPembina: string;
    nipPembina: string;
    namaKepsek: string;
    nipKepsek: string;
    tembusan?: string[];
  }
): string => {
  const kop = generateKopSuratHtml(school);
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${data.perihal} - ${data.nomorSurat}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; color: #111; margin: 0; padding: 25px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 15px; }
        .meta-table { border-collapse: collapse; margin-bottom: 20px; }
        .meta-table td { padding: 2px 4px; vertical-align: top; }
        .ttd-box { display: flex; justify-content: space-between; margin-top: 35px; text-align: center; }
        .ttd-col { width: 45%; }
        .ttd-line { border-bottom: 1px solid #111; display: inline-block; min-width: 170px; font-weight: bold; margin-top: 60px; }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      ${kop}
      
      <div style="text-align: right; margin-bottom: 15px;">
        ${school.kota}, ${formatDateIndo(data.tanggalSurat)}
      </div>

      <table class="meta-table">
        <tr><td style="width: 90px;">Nomor</td><td style="width: 10px;">:</td><td>${data.nomorSurat}</td></tr>
        <tr><td>Lampiran</td><td>:</td><td>${data.lampiran || '-'}</td></tr>
        <tr><td>Perihal</td><td>:</td><td><strong>${data.perihal}</strong></td></tr>
      </table>

      <div style="margin-bottom: 20px;">
        Kepada Yth.<br/>
        <strong>${data.tujuanNama}</strong><br/>
        ${data.tujuanInstansi}<br/>
        di Tempat
      </div>

      <p style="text-align: justify; margin-bottom: 12px;">
        Dengan hormat,<br/>
        ${data.isiPembuka}
      </p>

      ${
        data.isiAcara.hariTanggal
          ? `
        <table style="margin-left: 20px; margin-bottom: 15px;">
          <tr><td style="width: 130px;">Hari, Tanggal</td><td style="width: 15px;">:</td><td><strong>${data.isiAcara.hariTanggal}</strong></td></tr>
          <tr><td>Waktu</td><td>:</td><td>${data.isiAcara.waktu}</td></tr>
          <tr><td>Tempat</td><td>:</td><td>${data.isiAcara.tempat}</td></tr>
          <tr><td>Acara / Agenda</td><td>:</td><td><strong>${data.isiAcara.agenda}</strong></td></tr>
        </table>
      `
          : ''
      }

      <p style="text-align: justify; margin-bottom: 20px;">
        ${data.isiPenutup}
      </p>

      <div class="ttd-box">
        <div class="ttd-col">
          Mengetahui,<br/>
          <strong>Ketua OSIS</strong><br/>
          <div class="ttd-line">${data.namaKetua}</div><br/>
          NISN. ${data.nisnKetua}
        </div>
        <div class="ttd-col">
          <br/>
          <strong>Sekretaris OSIS</strong><br/>
          <div class="ttd-line">${data.namaSekretaris}</div><br/>
          NISN. ${data.nisnSekretaris}
        </div>
      </div>

      <div class="ttd-box" style="margin-top: 25px;">
        <div class="ttd-col">
          Menyetujui,<br/>
          <strong>Pembina OSIS</strong><br/>
          <div class="ttd-line">${data.namaPembina}</div><br/>
          NIP. ${data.nipPembina}
        </div>
        <div class="ttd-col">
          Mengesahkan,<br/>
          <strong>Kepala Sekolah</strong><br/>
          <div class="ttd-line">${data.namaKepsek}</div><br/>
          NIP. ${data.nipKepsek}
        </div>
      </div>

      ${
        data.tembusan && data.tembusan.length > 0
          ? `
        <div style="margin-top: 30px; font-size: 10pt; color: #4b5563;">
          <strong>Tembusan:</strong>
          <ol style="margin-top: 2px; padding-left: 18px;">
            ${data.tembusan.map((item) => `<li>${item}</li>`).join('')}
          </ol>
        </div>
      `
          : ''
      }
    </body>
    </html>
  `;
};

export const generateProposalHtml = (
  school: SchoolProfile,
  proker: ProgramKerja,
  pengurus: PengurusOsis[]
): string => {
  const kop = generateKopSuratHtml(school);
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Proposal Kegiatan: ${proker.namaProker}</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; color: #111; padding: 30px; }
        h1, h2, h3 { font-family: 'Times New Roman', serif; }
        .cover { text-align: center; padding: 60px 20px; page-break-after: always; }
        .cover-title { font-size: 18pt; font-weight: bold; margin: 30px 0 10px; text-transform: uppercase; }
        .cover-sub { font-size: 14pt; margin-bottom: 40px; }
        .section-title { font-size: 13pt; font-weight: bold; margin-top: 20px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
        table.budget { width: 100%; border-collapse: collapse; margin: 15px 0; }
        table.budget th, table.budget td { border: 1px solid #444; padding: 6px 10px; font-size: 11pt; }
        table.budget th { background: #f3f4f6; }
        .ttd-box { display: flex; justify-content: space-between; margin-top: 40px; text-align: center; }
        .ttd-col { width: 45%; }
        .ttd-line { border-bottom: 1px solid #111; display: inline-block; min-width: 180px; font-weight: bold; margin-top: 65px; }
      </style>
    </head>
    <body>
      <div class="cover">
        <img src="${school.logoOsisUrl}" style="width: 120px; height: 120px; object-fit: contain; margin-bottom: 20px;" />
        <div class="cover-title">PROPOSAL KEGIATAN</div>
        <div class="cover-sub" style="font-weight: bold; color: #1e3a8a;">${proker.namaProker}</div>
        <div style="font-size: 12pt; margin-bottom: 50px; font-style: italic;">
          "${school.mottoKabinet}"
        </div>
        <div style="margin-top: 80px;">
          <div>ORGANISASI SISWA INTRA SEKOLAH (OSIS)</div>
          <div style="font-weight: bold; font-size: 13pt;">${school.namaSekolah}</div>
          <div>${school.namaKabinet}</div>
          <div>TAHUN PELAJARAN ${school.masaBakti}</div>
        </div>
      </div>

      ${kop}

      <div class="section-title">I. LATAR BELAKANG</div>
      <p style="text-align: justify;">
        Organisasi Siswa Intra Sekolah (OSIS) merupakan wadah pembinaan kesiswaan di lingkungan sekolah yang bertujuan mengembangkan potensi, bakat, serta kepemimpinan siswa. Sejalan dengan program kerja tahunan <strong>${school.namaKabinet}</strong> periode ${school.masaBakti}, kami bermaksud menyelenggarakan kegiatan <strong>"${proker.namaProker}"</strong> sebagai sarana aktualisasi diri dan peningkatan mutu karakter siswa.
      </p>

      <div class="section-title">II. NAMA & TEMA KEGIATAN</div>
      <p>
        <strong>Nama Kegiatan:</strong> ${proker.namaProker}<br/>
        <strong>Seksi Bidang:</strong> ${proker.sekbid}
      </p>

      <div class="section-title">III. TUJUAN KEGIATAN</div>
      <p style="text-align: justify;">
        ${proker.tujuan}
      </p>

      <div class="section-title">IV. SASARAN & TARGET PESERTA</div>
      <p>
        <strong>Sasaran:</strong> ${proker.sasaran}<br/>
        <strong>Target KPI:</strong> ${proker.kpiTarget}
      </p>

      <div class="section-title">V. WAKTU & TEMPAT PELAKSANAAN</div>
      <table style="margin-left: 10px;">
        <tr><td style="width: 130px;">Tanggal Mulai</td><td style="width: 15px;">:</td><td>${formatDateIndo(proker.tanggalMulai)}</td></tr>
        <tr><td>Tanggal Selesai</td><td>:</td><td>${formatDateIndo(proker.tanggalSelesai)}</td></tr>
        <tr><td>Tempat / Lokasi</td><td>:</td><td><strong>${proker.tempat}</strong></td></tr>
        <tr><td>Penanggung Jawab</td><td>:</td><td>${proker.penanggungJawab}</td></tr>
      </table>

      <div class="section-title">VI. RENCANA ANGGARAN BIAYA (RAB)</div>
      <p>Total estimasi pembiayaan yang dibutuhkan adalah sebesar <strong>${formatRupiah(proker.anggaranBiaya)}</strong> yang bersumber dari <strong>${proker.sumberDana}</strong>.</p>
      
      <table class="budget">
        <thead>
          <tr>
            <th style="width: 40px;">No</th>
            <th>Uraian Kebutuhan</th>
            <th>Kategori</th>
            <th style="text-align: right; width: 140px;">Jumlah Biaya</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: center;">1</td>
            <td>Pengadaan ATK, Modul, Name Tag & Kesekretariatan</td>
            <td>Kesekretariatan</td>
            <td style="text-align: right;">${formatRupiah(proker.anggaranBiaya * 0.2)}</td>
          </tr>
          <tr>
            <td style="text-align: center;">2</td>
            <td>Konsumsi Panitia, Peserta & Tamu Undangan</td>
            <td>Logistik Konsumsi</td>
            <td style="text-align: right;">${formatRupiah(proker.anggaranBiaya * 0.4)}</td>
          </tr>
          <tr>
            <td style="text-align: center;">3</td>
            <td>Sewa Sound System, Panggung, Perlengkapan</td>
            <td>Sarana Prasarana</td>
            <td style="text-align: right;">${formatRupiah(proker.anggaranBiaya * 0.25)}</td>
          </tr>
          <tr>
            <td style="text-align: center;">4</td>
            <td>Hadiah, Tropi, Sertifikat & Dokumentasi</td>
            <td>Apresiasi / Pubdok</td>
            <td style="text-align: right;">${formatRupiah(proker.anggaranBiaya * 0.15)}</td>
          </tr>
          <tr style="font-weight: bold; background: #fafafa;">
            <td colspan="3" style="text-align: right;">TOTAL ESTIMASI ANGGARAN</td>
            <td style="text-align: right; color: #1e3a8a;">${formatRupiah(proker.anggaranBiaya)}</td>
          </tr>
        </tbody>
      </table>

      <div class="section-title">VII. LEMBAR PENGESAHAN</div>
      <p style="text-align: justify;">Demikian proposal kegiatan ini kami susun dengan sebenarnya untuk dijadikan bahan pertimbangan dan acuan pelaksanaan kegiatan.</p>

      <div style="text-align: right; margin-top: 20px;">
        ${school.kota}, ${formatDateIndo(new Date().toISOString().split('T')[0])}
      </div>

      <div class="ttd-box">
        <div class="ttd-col">
          Ketua Pelaksana / Koordinator,<br/>
          <div class="ttd-line">${proker.penanggungJawab}</div><br/>
          Pengurus OSIS
        </div>
        <div class="ttd-col">
          Ketua Umum OSIS,<br/>
          <div class="ttd-line">${school.ketuaOsis}</div><br/>
          NISN. ${school.nisnKetuaOsis}
        </div>
      </div>

      <div class="ttd-box" style="margin-top: 30px;">
        <div class="ttd-col">
          Menyetujui,<br/>
          <strong>Pembina OSIS</strong><br/>
          <div class="ttd-line">${school.pembinaOsis}</div><br/>
          NIP. ${school.nipPembinaOsis}
        </div>
        <div class="ttd-col">
          Mengesahkan,<br/>
          <strong>Kepala Sekolah</strong><br/>
          <div class="ttd-line">${school.kepalaSekolah}</div><br/>
          NIP. ${school.nipKepalaSekolah}
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateSertifikatHtml = (
  school: SchoolProfile,
  data: {
    nomorSertifikat: string;
    namaPenerima: string;
    sebagai: string;
    namaKegiatan: string;
    tanggalKegiatan: string;
  }
): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Sertifikat - ${data.namaPenerima}</title>
      <style>
        body { margin: 0; padding: 25px; background: #fff; font-family: 'Times New Roman', serif; text-align: center; }
        .certificate-border {
          border: 12px double #1e3a8a;
          padding: 35px 30px;
          outline: 3px solid #d97706;
          outline-offset: -8px;
          background: #ffffff;
        }
        .cert-header { font-size: 11pt; font-weight: bold; letter-spacing: 2px; color: #475569; text-transform: uppercase; }
        .cert-school { font-size: 16pt; font-weight: bold; color: #1e3a8a; margin-top: 4px; }
        .cert-title { font-size: 28pt; font-weight: bold; color: #d97706; margin: 20px 0 5px; font-family: 'Times New Roman', serif; letter-spacing: 3px; }
        .cert-no { font-size: 10pt; color: #64748b; margin-bottom: 25px; }
        .cert-body { font-size: 12pt; color: #334155; margin-bottom: 10px; }
        .cert-name { font-size: 24pt; font-weight: bold; color: #0f172a; margin: 15px 0; border-bottom: 2px solid #e2e8f0; display: inline-block; padding: 0 40px; }
        .cert-role { font-size: 14pt; color: #1e3a8a; font-weight: bold; margin-bottom: 15px; }
        .cert-desc { font-size: 11pt; color: #475569; max-width: 650px; margin: 0 auto 35px; line-height: 1.5; }
        .ttd-box { display: flex; justify-content: space-around; margin-top: 30px; }
        .ttd-col { width: 35%; text-align: center; }
        .ttd-line { border-bottom: 1px solid #111; display: inline-block; min-width: 170px; font-weight: bold; margin-top: 55px; }
        @media print {
          @page { size: landscape; }
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="certificate-border">
        <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 10px;">
          <img src="${school.logoOsisUrl}" style="width: 60px; height: 60px; object-fit: contain;" />
          <div>
            <div class="cert-header">ORGANISASI SISWA INTRA SEKOLAH (OSIS)</div>
            <div class="cert-school">${school.namaSekolah}</div>
          </div>
          <img src="${school.logoSekolahUrl}" style="width: 60px; height: 60px; object-fit: contain;" />
        </div>

        <div class="cert-title">PIAGAM PENGHARGAAN</div>
        <div class="cert-no">Nomor: ${data.nomorSertifikat}</div>

        <div class="cert-body">Diberikan dengan penuh apresiasi dan kehormatan kepada:</div>
        <div class="cert-name">${data.namaPenerima}</div>
        <div class="cert-role">Atas Peran dan Kontribusinya Sebagai: ${data.sebagai}</div>

        <div class="cert-desc">
          Dalam rangka menyukseskan program kerja <strong>"${data.namaKegiatan}"</strong> yang diselenggarakan oleh OSIS ${school.namaKabinet} Periode ${school.masaBakti} pada tanggal ${data.tanggalKegiatan}.
        </div>

        <div class="ttd-box">
          <div class="ttd-col">
            Ketua Umum OSIS,<br/>
            <div class="ttd-line">${school.ketuaOsis}</div><br/>
            NISN. ${school.nisnKetuaOsis}
          </div>
          <div class="ttd-col">
            Mengetahui,<br/>
            Kepala Sekolah,<br/>
            <div class="ttd-line">${school.kepalaSekolah}</div><br/>
            NIP. ${school.nipKepalaSekolah}
          </div>
          <div class="ttd-col">
            Pembina OSIS,<br/>
            <div class="ttd-line">${school.pembinaOsis}</div><br/>
            NIP. ${school.nipPembinaOsis}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
