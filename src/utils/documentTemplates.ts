import { SchoolProfile, PengurusOsis, ProgramKerja, TransaksiKas, RapatNotulensi, RabItem } from '../types';
import { formatDateIndo, formatRupiah, angkaKeTerbilang } from './exportUtils';

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
  pengurus: PengurusOsis[],
  customRabItems?: RabItem[]
): string => {
  const kop = generateKopSuratHtml(school);

  const items: RabItem[] = (customRabItems && customRabItems.length > 0)
    ? customRabItems
    : (proker.rabItems && proker.rabItems.length > 0)
      ? proker.rabItems
      : [
          {
            id: 'd-1',
            namaItem: 'Pengadaan ATK, Modul, Name Tag & Kesekretariatan',
            divisi: 'Kesekretariatan & ATK',
            volume: 1,
            satuan: 'Paket',
            hargaSatuan: Math.round(proker.anggaranBiaya * 0.2),
          },
          {
            id: 'd-2',
            namaItem: 'Konsumsi Panitia, Peserta & Tamu Undangan',
            divisi: 'Konsumsi',
            volume: 1,
            satuan: 'Paket',
            hargaSatuan: Math.round(proker.anggaranBiaya * 0.4),
          },
          {
            id: 'd-3',
            namaItem: 'Sewa Sound System, Panggung, Perlengkapan',
            divisi: 'Perlengkapan & Sound',
            volume: 1,
            satuan: 'Paket',
            hargaSatuan: Math.round(proker.anggaranBiaya * 0.25),
          },
          {
            id: 'd-4',
            namaItem: 'Hadiah, Tropi, Sertifikat & Dokumentasi',
            divisi: 'Hadiah & Piagam',
            volume: 1,
            satuan: 'Paket',
            hargaSatuan: Math.round(proker.anggaranBiaya * 0.15),
          },
        ];

  const totalAnggaran = items.reduce((acc, curr) => acc + curr.volume * curr.hargaSatuan, 0);

  // Group by divisi for subtotal summary
  const divisiSummary: Record<string, number> = {};
  items.forEach((item) => {
    const subtotal = item.volume * item.hargaSatuan;
    divisiSummary[item.divisi] = (divisiSummary[item.divisi] || 0) + subtotal;
  });

  const rowsHtml = items.map((item, idx) => `
    <tr>
      <td style="text-align: center; font-family: monospace;">${idx + 1}</td>
      <td><strong>${item.namaItem}</strong></td>
      <td style="text-align: center;"><span style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 8.5pt;">${item.divisi}</span></td>
      <td style="text-align: center; font-family: monospace;">${item.volume} ${item.satuan}</td>
      <td style="text-align: right; font-family: monospace;">${formatRupiah(item.hargaSatuan)}</td>
      <td style="text-align: right; font-family: monospace; font-weight: bold;">${formatRupiah(item.volume * item.hargaSatuan)}</td>
    </tr>
  `).join('');

  const rekapDivisiHtml = Object.entries(divisiSummary).map(([divisi, nominal], idx) => `
    <tr>
      <td style="text-align: center; font-family: monospace;">${idx + 1}</td>
      <td>Pos ${divisi}</td>
      <td style="text-align: right; font-family: monospace; font-weight: bold;">${formatRupiah(nominal)}</td>
      <td style="text-align: right; font-family: monospace; font-size: 9pt;">${totalAnggaran > 0 ? ((nominal / totalAnggaran) * 100).toFixed(1) : 0}%</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <title>Proposal Kegiatan: ${proker.namaProker}</title>
      <style>
        * { box-sizing: border-box; }
        body { font-family: 'Times New Roman', serif; font-size: 11.5pt; line-height: 1.5; color: #111; padding: 30px; background: #fff; margin: 0; }
        h1, h2, h3 { font-family: 'Times New Roman', serif; }
        .cover { text-align: center; padding: 50px 20px; page-break-after: always; }
        .cover-title { font-size: 20pt; font-weight: bold; margin: 25px 0 10px; text-transform: uppercase; letter-spacing: 1px; }
        .cover-sub { font-size: 15pt; margin-bottom: 25px; }
        .section-title { font-size: 12.5pt; font-weight: bold; margin-top: 22px; border-bottom: 1.5px solid #1e3a8a; padding-bottom: 4px; color: #1e3a8a; }
        table.meta-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        table.meta-table td { padding: 4px 6px; vertical-align: top; }
        table.budget { width: 100%; border-collapse: collapse; margin: 12px 0; }
        table.budget th, table.budget td { border: 1px solid #444; padding: 5px 8px; font-size: 10pt; }
        table.budget th { background: #f1f5f9; text-align: center; font-weight: bold; }
        .terbilang-box { font-size: 9.5pt; font-style: italic; margin: 8px 0 16px; padding: 6px 10px; background: #f8fafc; border: 1px dashed #94a3b8; }
        .ttd-box { display: flex; justify-content: space-between; margin-top: 35px; text-align: center; page-break-inside: avoid; }
        .ttd-col { width: 45%; }
        .ttd-line { border-bottom: 1px solid #111; display: inline-block; min-width: 180px; font-weight: bold; margin-top: 55px; }
        @media print {
          body { padding: 0; }
          @page { size: A4 portrait; margin: 15mm; }
          .cover { page-break-after: always; }
          .ttd-box { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="cover">
        <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 20px;">
          <img src="${school.logoOsisUrl}" style="width: 80px; height: 80px; object-fit: contain;" />
          <img src="${school.logoSekolahUrl}" style="width: 80px; height: 80px; object-fit: contain;" />
        </div>
        <div class="cover-title">PROPOSAL KEGIATAN</div>
        <div class="cover-sub" style="font-weight: bold; color: #1e3a8a;">${proker.namaProker}</div>
        <div style="font-size: 11pt; color: #475569; font-weight: 600; text-transform: uppercase; margin-bottom: 10px;">
          SEKSI BIDANG: ${proker.sekbid}
        </div>
        <div style="font-size: 12pt; margin-bottom: 40px; font-style: italic; color: #334155;">
          "${school.mottoKabinet}"
        </div>
        <div style="margin-top: 60px;">
          <div style="font-weight: bold; font-size: 11pt; letter-spacing: 0.5px;">ORGANISASI SISWA INTRA SEKOLAH (OSIS)</div>
          <div style="font-weight: bold; font-size: 15pt; color: #1e3a8a; margin: 4px 0;">${school.namaSekolah}</div>
          <div style="font-size: 11pt; color: #334155;">${school.namaKabinet}</div>
          <div style="font-size: 10.5pt; font-weight: bold; margin-top: 4px;">TAHUN PELAJARAN ${school.masaBakti}</div>
        </div>
      </div>

      ${kop}

      <div class="section-title">I. LATAR BELAKANG</div>
      <p style="text-align: justify; text-indent: 30px;">
        Organisasi Siswa Intra Sekolah (OSIS) merupakan wadah pembinaan kesiswaan di lingkungan sekolah yang bertujuan mengembangkan potensi, bakat, serta kepemimpinan siswa. Sejalan dengan program kerja tahunan <strong>${school.namaKabinet}</strong> periode <strong>${school.masaBakti}</strong>, kami bermaksud menyelenggarakan kegiatan <strong>"${proker.namaProker}"</strong> sebagai sarana aktualisasi diri, penguatan profil pelajar berakhlak mulia, dan peningkatan mutu karakter siswa.
      </p>

      <div class="section-title">II. NAMA & TEMA KEGIATAN</div>
      <p>
        <strong>Nama Kegiatan:</strong> ${proker.namaProker}<br/>
        <strong>Seksi Bidang:</strong> ${proker.sekbid}<br/>
        <strong>Status Misi:</strong> Program Kerja Tahunan Resmi OSIS Periode ${school.masaBakti}
      </p>

      <div class="section-title">III. TUJUAN KEGIATAN</div>
      <p style="text-align: justify;">
        ${proker.tujuan}
      </p>

      <div class="section-title">IV. SASARAN & TARGET INDIKATOR KINERJA (KPI)</div>
      <p>
        <strong>Sasaran Peserta:</strong> ${proker.sasaran}<br/>
        <strong>Target KPI:</strong> ${proker.kpiTarget}
      </p>

      <div class="section-title">V. WAKTU & TEMPAT PELAKSANAAN</div>
      <table class="meta-table">
        <tr><td style="width: 160px;">Tanggal Pelaksanaan</td><td style="width: 15px;">:</td><td>${formatDateIndo(proker.tanggalMulai)} s.d. ${formatDateIndo(proker.tanggalSelesai)}</td></tr>
        <tr><td>Tempat / Lokasi</td><td>:</td><td><strong>${proker.tempat}</strong></td></tr>
        <tr><td>Penanggung Jawab</td><td>:</td><td>${proker.penanggungJawab}</td></tr>
        <tr><td>Sumber Pendanaan</td><td>:</td><td>${proker.sumberDana}</td></tr>
      </table>

      <div class="section-title">VI. RENCANA ANGGARAN BIAYA (RAB) SESUAI KALKULATOR RESMI</div>
      <p>
        Rencana Anggaran Biaya (RAB) di bawah ini disusun secara rinci berdasarkan perhitungan kalkulator kebutuhan operasional panitia pelaksana. Total estimasi kebutuhan anggaran adalah sebesar <strong>${formatRupiah(totalAnggaran)}</strong> yang bersumber dari <strong>${proker.sumberDana}</strong>.
      </p>
      
      <table class="budget">
        <thead>
          <tr>
            <th style="width: 35px;">No</th>
            <th>Uraian Kebutuhan & Spesifikasi</th>
            <th style="width: 140px;">Divisi / Pos</th>
            <th style="width: 90px;">Volume</th>
            <th style="width: 110px;">Harga Satuan</th>
            <th style="width: 120px;">Subtotal Biaya</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
          <tr style="font-weight: bold; background: #f8fafc;">
            <td colspan="5" style="text-align: right; padding-right: 10px; font-size: 10.5pt;">TOTAL ESTIMASI ANGGARAN (RAB):</td>
            <td style="text-align: right; color: #1e3a8a; font-family: monospace; font-size: 11pt;">${formatRupiah(totalAnggaran)}</td>
          </tr>
        </tbody>
      </table>

      <div class="terbilang-box">
        <strong>Total Anggaran Terbilang:</strong> ${angkaKeTerbilang(totalAnggaran)}
      </div>

      <div style="margin-top: 10px; font-weight: bold; font-size: 10.5pt; color: #334155;">Rekapitulasi Alokasi Per Divisi / Pos:</div>
      <table class="budget" style="max-width: 520px;">
        <thead>
          <tr>
            <th style="width: 35px;">No</th>
            <th>Divisi Pelaksana</th>
            <th style="width: 140px;">Total Alokasi</th>
            <th style="width: 70px;">Proporsi</th>
          </tr>
        </thead>
        <tbody>
          ${rekapDivisiHtml}
        </tbody>
      </table>

      <div class="section-title">VII. LEMBAR PENGESAHAN PROPOSAL</div>
      <p style="text-align: justify;">
        Demikian proposal kegiatan <strong>"${proker.namaProker}"</strong> ini kami susun dengan penuh tanggung jawab sebagai bahan pertimbangan, pedoman pelaksanaan, dan permohonan persetujuan anggaran.
      </p>

      <div style="text-align: right; margin-top: 20px;">
        ${school.kota}, ${formatDateIndo(new Date().toISOString().split('T')[0])}
      </div>

      <div class="ttd-box">
        <div class="ttd-col">
          Ketua Pelaksana Kegiatan,<br/>
          <div class="ttd-line">${proker.penanggungJawab}</div><br/>
          Pengurus OSIS
        </div>
        <div class="ttd-col">
          Ketua Umum OSIS,<br/>
          <div class="ttd-line">${school.ketuaOsis}</div><br/>
          NISN. ${school.nisnKetuaOsis}
        </div>
      </div>

      <div class="ttd-box" style="margin-top: 25px;">
        <div class="ttd-col">
          Menyetujui,<br/>
          <strong>Pembina OSIS</strong><br/>
          <div class="ttd-line">${school.pembinaOsis}</div><br/>
          NIP. ${school.nipPembinaOsis}
        </div>
        <div class="ttd-col">
          Mengesahkan,<br/>
          <strong>Kepala Sekolah / Madrasah</strong><br/>
          <div class="ttd-line">${school.kepalaSekolah}</div><br/>
          NIP. ${school.nipKepalaSekolah}
        </div>
      </div>
    </body>
    </html>
  `;
};

export const generateLpjHtml = (
  school: SchoolProfile,
  proker: ProgramKerja,
  pengurus: PengurusOsis[],
  customRabItems?: RabItem[]
): string => {
  const kop = generateKopSuratHtml(school);

  const items: RabItem[] = (customRabItems && customRabItems.length > 0)
    ? customRabItems
    : (proker.rabItems && proker.rabItems.length > 0)
      ? proker.rabItems
      : [
          {
            id: 'd-1',
            namaItem: 'Pengadaan ATK, Modul, Name Tag & Kesekretariatan',
            divisi: 'Kesekretariatan & ATK',
            volume: 1,
            satuan: 'Paket',
            hargaSatuan: Math.round(proker.anggaranBiaya * 0.2),
            realisasiVolume: 1,
            realisasiHargaSatuan: Math.round(proker.anggaranBiaya * 0.19),
          },
          {
            id: 'd-2',
            namaItem: 'Konsumsi Panitia, Peserta & Tamu Undangan',
            divisi: 'Konsumsi',
            volume: 1,
            satuan: 'Paket',
            hargaSatuan: Math.round(proker.anggaranBiaya * 0.4),
            realisasiVolume: 1,
            realisasiHargaSatuan: Math.round(proker.anggaranBiaya * 0.39),
          },
          {
            id: 'd-3',
            namaItem: 'Sewa Sound System, Panggung, Perlengkapan',
            divisi: 'Perlengkapan & Sound',
            volume: 1,
            satuan: 'Paket',
            hargaSatuan: Math.round(proker.anggaranBiaya * 0.25),
            realisasiVolume: 1,
            realisasiHargaSatuan: Math.round(proker.anggaranBiaya * 0.25),
          },
          {
            id: 'd-4',
            namaItem: 'Hadiah, Tropi, Sertifikat & Dokumentasi',
            divisi: 'Hadiah & Piagam',
            volume: 1,
            satuan: 'Paket',
            hargaSatuan: Math.round(proker.anggaranBiaya * 0.15),
            realisasiVolume: 1,
            realisasiHargaSatuan: Math.round(proker.anggaranBiaya * 0.14),
          },
        ];

  let totalRencana = 0;
  let totalRealisasi = 0;

  const rowsHtml = items.map((item, idx) => {
    const volRencana = item.volume;
    const hargaRencana = item.hargaSatuan;
    const subtotalRencana = volRencana * hargaRencana;

    const volRealisasi = item.realisasiVolume !== undefined ? item.realisasiVolume : item.volume;
    const hargaRealisasi = item.realisasiHargaSatuan !== undefined ? item.realisasiHargaSatuan : item.hargaSatuan;
    const subtotalRealisasi = volRealisasi * hargaRealisasi;

    totalRencana += subtotalRencana;
    totalRealisasi += subtotalRealisasi;

    const selisih = subtotalRencana - subtotalRealisasi;
    let statusBadge = '<span style="color: #166534; font-weight: bold;">Sesuai</span>';
    if (selisih > 0) {
      statusBadge = `<span style="color: #15803d; font-weight: bold;">Hemat (${formatRupiah(selisih)})</span>`;
    } else if (selisih < 0) {
      statusBadge = `<span style="color: #b91c1c; font-weight: bold;">Defisit (${formatRupiah(Math.abs(selisih))})</span>`;
    }

    return `
      <tr>
        <td style="text-align: center; font-family: monospace;">${idx + 1}</td>
        <td>
          <strong>${item.namaItem}</strong>
          <div style="font-size: 8pt; color: #555;">Pos: ${item.divisi}</div>
        </td>
        <td style="text-align: center; font-family: monospace; font-size: 9pt;">
          ${volRencana} ${item.satuan} @ ${formatRupiah(hargaRencana)}
        </td>
        <td style="text-align: right; font-family: monospace;">
          ${formatRupiah(subtotalRencana)}
        </td>
        <td style="text-align: center; font-family: monospace; font-size: 9pt;">
          ${volRealisasi} ${item.satuan} @ ${formatRupiah(hargaRealisasi)}
        </td>
        <td style="text-align: right; font-family: monospace; font-weight: bold; color: #1e3a8a;">
          ${formatRupiah(subtotalRealisasi)}
        </td>
        <td style="text-align: center; font-size: 8.5pt;">
          ${statusBadge}
        </td>
      </tr>
    `;
  }).join('');

  const totalSelisih = totalRencana - totalRealisasi;

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <title>LPJ Kegiatan: ${proker.namaProker}</title>
      <style>
        * { box-sizing: border-box; }
        body { font-family: 'Times New Roman', serif; font-size: 11.5pt; line-height: 1.5; color: #111; padding: 30px; background: #fff; margin: 0; }
        h1, h2, h3 { font-family: 'Times New Roman', serif; }
        .cover { text-align: center; padding: 50px 20px; page-break-after: always; }
        .cover-title { font-size: 20pt; font-weight: bold; margin: 25px 0 10px; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; }
        .cover-sub { font-size: 15pt; margin-bottom: 25px; }
        .section-title { font-size: 12.5pt; font-weight: bold; margin-top: 22px; border-bottom: 1.5px solid #047857; padding-bottom: 4px; color: #047857; }
        table.meta-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        table.meta-table td { padding: 4px 6px; vertical-align: top; }
        table.budget { width: 100%; border-collapse: collapse; margin: 12px 0; }
        table.budget th, table.budget td { border: 1px solid #444; padding: 5px 7px; font-size: 9.5pt; }
        table.budget th { background: #f1f5f9; text-align: center; font-weight: bold; }
        .terbilang-box { font-size: 9.5pt; font-style: italic; margin: 8px 0 16px; padding: 6px 10px; background: #f8fafc; border: 1px dashed #94a3b8; }
        .ttd-box { display: flex; justify-content: space-between; margin-top: 35px; text-align: center; page-break-inside: avoid; }
        .ttd-col { width: 45%; }
        .ttd-line { border-bottom: 1px solid #111; display: inline-block; min-width: 180px; font-weight: bold; margin-top: 55px; }
        .kpi-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 12px; margin: 10px 0; }
        @media print {
          body { padding: 0; }
          @page { size: A4 portrait; margin: 15mm; }
          .cover { page-break-after: always; }
          .ttd-box { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="cover">
        <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 20px;">
          <img src="${school.logoOsisUrl}" style="width: 80px; height: 80px; object-fit: contain;" />
          <img src="${school.logoSekolahUrl}" style="width: 80px; height: 80px; object-fit: contain;" />
        </div>
        <div class="cover-title">LAPORAN PERTANGGUNGJAWABAN (LPJ)</div>
        <div style="font-size: 13pt; font-weight: bold; text-transform: uppercase; color: #475569; margin-bottom: 6px;">
          PELAKSANAAN MISI PROGRAM KERJA
        </div>
        <div class="cover-sub" style="font-weight: bold; color: #047857;">${proker.namaProker}</div>
        <div style="font-size: 11pt; color: #475569; font-weight: 600; text-transform: uppercase; margin-bottom: 10px;">
          SEKSI BIDANG: ${proker.sekbid}
        </div>
        <div style="font-size: 12pt; margin-bottom: 40px; font-style: italic; color: #334155;">
          "${school.mottoKabinet}"
        </div>
        <div style="margin-top: 60px;">
          <div style="font-weight: bold; font-size: 11pt; letter-spacing: 0.5px;">ORGANISASI SISWA INTRA SEKOLAH (OSIS)</div>
          <div style="font-weight: bold; font-size: 15pt; color: #047857; margin: 4px 0;">${school.namaSekolah}</div>
          <div style="font-size: 11pt; color: #334155;">${school.namaKabinet}</div>
          <div style="font-size: 10.5pt; font-weight: bold; margin-top: 4px;">TAHUN PELAJARAN ${school.masaBakti}</div>
        </div>
      </div>

      ${kop}

      <div class="section-title">I. PENDAHULUAN & LATAR BELAKANG</div>
      <p style="text-align: justify; text-indent: 30px;">
        Puji syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa atas terselenggaranya seluruh rangkaian program kerja <strong>"${proker.namaProker}"</strong>. Laporan Pertanggungjawaban (LPJ) ini disusun sebagai bentuk transparansi, akuntabilitas, dan bahan evaluasi menyeluruh atas pelaksanaan misi program kerja Seksi Bidang <strong>${proker.sekbid}</strong> OSIS ${school.namaKabinet} masa bakti ${school.masaBakti}.
      </p>

      <div class="section-title">II. NAMA, TEMA & PELAKSANAAN KEGIATAN</div>
      <table class="meta-table">
        <tr><td style="width: 160px;">Nama Program Kerja</td><td style="width: 15px;">:</td><td><strong>${proker.namaProker}</strong></td></tr>
        <tr><td>Seksi Bidang</td><td>:</td><td>${proker.sekbid}</td></tr>
        <tr><td>Tanggal Pelaksanaan</td><td>:</td><td>${formatDateIndo(proker.tanggalMulai)} s.d. ${formatDateIndo(proker.tanggalSelesai)}</td></tr>
        <tr><td>Tempat / Lokasi</td><td>:</td><td>${proker.tempat}</td></tr>
        <tr><td>Penanggung Jawab</td><td>:</td><td>${proker.penanggungJawab}</td></tr>
        <tr><td>Status Pelaksanaan</td><td>:</td><td><strong>${proker.status} (${proker.persentaseProgress}%)</strong></td></tr>
      </table>

      <div class="section-title">III. REALISASI PARTISIPAN & CAPAIAN TARGET KPI</div>
      <div class="kpi-card">
        <div style="font-size: 10.5pt; font-weight: bold; color: #166534; margin-bottom: 4px;">
          Indikator Kinerja Utama (KPI Target):
        </div>
        <div style="font-size: 10pt; color: #1e293b; margin-bottom: 8px;">
          ${proker.kpiTarget}
        </div>
        <div style="font-size: 10.5pt; font-weight: bold; color: #166534; margin-bottom: 4px;">
          Ringkasan Hasil & Ketercapaian:
        </div>
        <div style="font-size: 10pt; color: #1e293b;">
          ${proker.laporanRingkas || 'Kegiatan berhasil diselesaikan dengan baik sesuai jadwal, partisipasi aktif peserta, dan mencapai indikator target yang telah direncanakan sebelumnya.'}
        </div>
      </div>

      <div class="section-title">IV. LAPORAN REALISASI ANGGARAN KEUANGAN (RAB VS REALISASI AKTUAL)</div>
      <p>
        Berdasarkan kalkulator Rencana Anggaran Biaya (RAB) yang telah ditetapkan dan bukti kuitansi belanja riil panitia, berikut perbandingan terperinci antara estimasi anggaran awal dan realisasi aktual:
      </p>

      <table class="budget">
        <thead>
          <tr>
            <th style="width: 30px;">No</th>
            <th>Uraian Pengeluaran</th>
            <th style="width: 130px;">Rencana (Vol x Tarif)</th>
            <th style="width: 100px;">Subtotal Rencana</th>
            <th style="width: 130px;">Realisasi Riil</th>
            <th style="width: 100px;">Subtotal Aktual</th>
            <th style="width: 90px;">Efisiensi</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
          <tr style="font-weight: bold; background: #f8fafc;">
            <td colspan="3" style="text-align: right; padding-right: 8px;">TOTAL KESELURUHAN:</td>
            <td style="text-align: right; font-family: monospace;">${formatRupiah(totalRencana)}</td>
            <td style="text-align: right; padding-right: 8px;">TOTAL REALISASI:</td>
            <td style="text-align: right; font-family: monospace; color: #15803d; font-size: 10.5pt;">${formatRupiah(totalRealisasi)}</td>
            <td style="text-align: center; font-size: 8.5pt;">
              ${totalSelisih >= 0 ? `<span style="color: #15803d; font-weight: bold;">Sisa: ${formatRupiah(totalSelisih)}</span>` : `<span style="color: #b91c1c; font-weight: bold;">Defisit: ${formatRupiah(Math.abs(totalSelisih))}</span>`}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="terbilang-box">
        <strong>Total Realisasi Anggaran Terbilang:</strong> ${angkaKeTerbilang(totalRealisasi)}
        <br/>
        <span style="font-size: 8.5pt; color: #475569;">
          Sumber Pendanaan: <strong>${proker.sumberDana}</strong> · Sisa Kas / Efisiensi Anggaran: <strong>${formatRupiah(Math.max(0, totalSelisih))}</strong> dikembalikan ke Kas Umum OSIS.
        </span>
      </div>

      <div class="section-title">V. EVALUASI, KENDALA & REKOMENDASI</div>
      <p style="text-align: justify;">
        <strong>1. Faktor Pendukung:</strong> Dukungan penuh dari Kepala Sekolah, Pembina OSIS, kerja sama solid seluruh panitia pelaksana, antusiasme peserta, serta ketepatan koordinasi logistik.<br/>
        <strong>2. Kendala yang Dihadapi:</strong> Penyesuaian waktu kegiatan dengan jadwal akademik siswa dan pergeseran durasi sesi pada hari pelaksanaan.<br/>
        <strong>3. Rekomendasi Solusi:</strong> Untuk kepanitiaan periode berikutnya, disarankan melakukan gladi resik satu hari sebelum kegiatan dan koordinasi teknis lebih awal dengan seksi perlengkapan.
      </p>

      <div class="section-title">VI. PENUTUP & LEMBAR PENGESAHAN</div>
      <p style="text-align: justify;">
        Demikian Laporan Pertanggungjawaban (LPJ) ini dibuat dengan sebenar-benarnya sebagai bukti pelaksanaan amanah dan akuntabilitas kegiatan OSIS.
      </p>

      <div style="text-align: right; margin-top: 20px;">
        ${school.kota}, ${formatDateIndo(new Date().toISOString().split('T')[0])}
      </div>

      <div class="ttd-box">
        <div class="ttd-col">
          Ketua Pelaksana Kegiatan,<br/>
          <div class="ttd-line">${proker.penanggungJawab}</div><br/>
          Pengurus OSIS
        </div>
        <div class="ttd-col">
          Ketua Umum OSIS,<br/>
          <div class="ttd-line">${school.ketuaOsis}</div><br/>
          NISN. ${school.nisnKetuaOsis}
        </div>
      </div>

      <div class="ttd-box" style="margin-top: 25px;">
        <div class="ttd-col">
          Menyetujui,<br/>
          <strong>Pembina OSIS</strong><br/>
          <div class="ttd-line">${school.pembinaOsis}</div><br/>
          NIP. ${school.nipPembinaOsis}
        </div>
        <div class="ttd-col">
          Mengesahkan,<br/>
          <strong>Kepala Sekolah / Madrasah</strong><br/>
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

export const generateLaporanKasHtml = (
  school: SchoolProfile,
  kasList: TransaksiKas[],
  totalMasuk: number,
  totalKeluar: number,
  saldo: number,
  periodeJudul?: string,
  namaBendahara?: string
): string => {
  const kop = generateKopSuratHtml(school);

  const sortedKas = [...kasList].sort(
    (a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
  );

  let runningBalance = 0;
  const rowsHtml = sortedKas.map((t, idx) => {
    if (t.tipe === 'masuk') {
      runningBalance += t.jumlah;
    } else {
      runningBalance -= t.jumlah;
    }

    return `
      <tr>
        <td style="text-align: center; font-family: monospace;">${idx + 1}</td>
        <td style="white-space: nowrap; text-align: center;">${formatDateIndo(t.tanggal)}</td>
        <td style="font-family: monospace; font-size: 8.5pt; text-align: center;">${t.noKwitansi}</td>
        <td>
          <strong>${t.deskripsi}</strong>
          <div style="font-size: 8pt; color: #555;">Kategori: ${t.kategori} · PJ: ${t.penanggungJawab}</div>
        </td>
        <td style="text-align: right; font-family: monospace; color: #15803d; font-weight: 500;">
          ${t.tipe === 'masuk' ? formatRupiah(t.jumlah) : '-'}
        </td>
        <td style="text-align: right; font-family: monospace; color: #b91c1c; font-weight: 500;">
          ${t.tipe === 'keluar' ? formatRupiah(t.jumlah) : '-'}
        </td>
        <td style="text-align: right; font-family: monospace; font-weight: bold; background: #fafafa;">
          ${formatRupiah(runningBalance)}
        </td>
      </tr>
    `;
  }).join('');

  const bendaharaVal =
    namaBendahara ||
    kasList.find((k) => k.penanggungJawab.toLowerCase().includes('bendahara'))?.penanggungJawab ||
    'Bendahara Umum OSIS';

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <title>Buku Kas Umum (BKU) OSIS - ${school.namaSekolah}</title>
      <style>
        * { box-sizing: border-box; }
        body {
          font-family: 'Times New Roman', serif;
          font-size: 10pt;
          line-height: 1.35;
          color: #111;
          padding: 24px;
          background: #fff;
          margin: 0;
        }
        .doc-title {
          text-align: center;
          margin: 12px 0 2px;
          font-size: 13pt;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .doc-sub {
          text-align: center;
          margin-bottom: 16px;
          font-size: 10pt;
          color: #333;
          font-weight: 500;
        }
        .summary-box {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 12px;
        }
        .summary-box td {
          padding: 6px 10px;
          border: 1px solid #333;
          text-align: center;
        }
        .summary-box th {
          padding: 6px 10px;
          border: 1px solid #333;
          background: #f1f5f9;
          font-size: 9pt;
          text-transform: uppercase;
        }
        .terbilang-box {
          font-size: 9.5pt;
          font-style: italic;
          margin-bottom: 14px;
          padding: 6px 10px;
          background: #f8fafc;
          border: 1px dashed #94a3b8;
        }
        table.ledger {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
          font-size: 8.5pt;
        }
        table.ledger th, table.ledger td {
          border: 1px solid #333;
          padding: 4px 6px;
          vertical-align: middle;
        }
        table.ledger th {
          background: #f1f5f9;
          text-align: center;
          font-weight: bold;
        }
        .ttd-section {
          margin-top: 25px;
          page-break-inside: avoid;
        }
        .ttd-row {
          display: flex;
          justify-content: space-between;
          text-align: center;
          margin-bottom: 25px;
        }
        .ttd-col {
          width: 45%;
        }
        .ttd-line {
          border-bottom: 1px solid #111;
          display: inline-block;
          min-width: 180px;
          font-weight: bold;
          margin-top: 45px;
        }
        .watermark {
          margin-top: 20px;
          text-align: center;
          font-size: 7.5pt;
          color: #666;
          border-top: 1px dashed #ccc;
          padding-top: 5px;
        }
        @media print {
          body {
            padding: 0;
            background: #fff;
          }
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
          table.ledger {
            page-break-inside: auto;
          }
          table.ledger tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          .ttd-section {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      ${kop}

      <div class="doc-title">BUKU KAS UMUM (BKU) & LAPORAN REALISASI KEUANGAN OSIS</div>
      <div class="doc-sub">
        ${periodeJudul || `Periode Masa Bakti ${school.masaBakti} · ${school.namaKabinet}`}
      </div>

      <table class="summary-box">
        <tr>
          <th style="width: 33.3%;">TOTAL PENERIMAAN (KAS MASUK)</th>
          <th style="width: 33.3%;">TOTAL PENGELUARAN (KAS KELUAR)</th>
          <th style="width: 33.3%;">SALDO KAS SAAT INI</th>
        </tr>
        <tr>
          <td style="font-family: monospace; font-size: 11pt; font-weight: bold; color: #15803d;">
            ${formatRupiah(totalMasuk)}
          </td>
          <td style="font-family: monospace; font-size: 11pt; font-weight: bold; color: #b91c1c;">
            ${formatRupiah(totalKeluar)}
          </td>
          <td style="font-family: monospace; font-size: 12pt; font-weight: bold; color: #1e3a8a;">
            ${formatRupiah(saldo)}
          </td>
        </tr>
      </table>

      <div class="terbilang-box">
        <strong>Saldo Kas Akhir Terbilang:</strong> ${angkaKeTerbilang(saldo)}
      </div>

      <table class="ledger">
        <thead>
          <tr>
            <th style="width: 4%;">No</th>
            <th style="width: 12%;">Tanggal</th>
            <th style="width: 15%;">No. Bukti / Kwitansi</th>
            <th>Uraian Transaksi & Kategori</th>
            <th style="width: 15%;">Pemasukan (Rp)</th>
            <th style="width: 15%;">Pengeluaran (Rp)</th>
            <th style="width: 16%;">Saldo Berjalan (Rp)</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || '<tr><td colspan="7" style="text-align: center; padding: 15px;">Belum ada catatan transaksi kas pada periode ini.</td></tr>'}
          <tr style="background: #f1f5f9; font-weight: bold;">
            <td colspan="4" style="text-align: right; padding-right: 10px;">TOTAL KESELURUHAN:</td>
            <td style="text-align: right; font-family: monospace; color: #15803d;">${formatRupiah(totalMasuk)}</td>
            <td style="text-align: right; font-family: monospace; color: #b91c1c;">${formatRupiah(totalKeluar)}</td>
            <td style="text-align: right; font-family: monospace; color: #1e3a8a;">${formatRupiah(saldo)}</td>
          </tr>
        </tbody>
      </table>

      <div class="ttd-section">
        <!-- Baris 1: Ketua OSIS & Bendahara OSIS -->
        <div class="ttd-row">
          <div class="ttd-col">
            Mengetahui,<br/>
            <strong>Ketua Umum OSIS</strong><br/>
            <div class="ttd-line">${school.ketuaOsis}</div><br/>
            NISN. ${school.nisnKetuaOsis}
          </div>
          <div class="ttd-col">
            ${school.kota}, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br/>
            <strong>Bendahara Umum OSIS</strong><br/>
            <div class="ttd-line">${bendaharaVal}</div><br/>
            Pengurus Harian OSIS
          </div>
        </div>

        <!-- Baris 2: Pembina OSIS & Kepala Madrasah -->
        <div class="ttd-row" style="margin-bottom: 0;">
          <div class="ttd-col">
            Menyetujui,<br/>
            <strong>Pembina OSIS</strong><br/>
            <div class="ttd-line">${school.pembinaOsis}</div><br/>
            NIP. ${school.nipPembinaOsis}
          </div>
          <div class="ttd-col">
            Mengesahkan,<br/>
            <strong>Kepala Sekolah / Madrasah</strong><br/>
            <div class="ttd-line">${school.kepalaSekolah}</div><br/>
            NIP. ${school.nipKepalaSekolah}
          </div>
        </div>
      </div>

      <div class="watermark">
        Dokumen Resmi OSIS KONOHA 360 · Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })} · Hak Cipta & Rancang Bangun: Nandi Achdarizal Sutisna
      </div>
    </body>
    </html>
  `;
};
