export type SekbidType =
  | 'Pengurus Inti'
  | 'Sekbid 1 - Ketaqwaan Terhadap Tuhan YME'
  | 'Sekbid 2 - Budi Pekerti & Karakter Mulia'
  | 'Sekbid 3 - Wawasan Kebangsaan & Bela Negara'
  | 'Sekbid 4 - Prestasi Akademik, Seni & Olahraga'
  | 'Sekbid 5 - Demokrasi, HAM & Pendidikan Politik'
  | 'Sekbid 6 - Kreativitas, Keterampilan & Kewirausahaan'
  | 'Sekbid 7 - Kualitas Jasmani, Kesehatan & Gizi'
  | 'Sekbid 8 - Sastra, Budaya & Apresiasi Seni'
  | 'Sekbid 9 - Teknologi Informasi & Komunikasi (TIK)'
  | 'Sekbid 10 - Komunikasi Bahasa Asing & Literasi Global';

export type JabatanType =
  | 'Ketua Umum'
  | 'Wakil Ketua Umum'
  | 'Sekretaris Umum'
  | 'Sekretaris I'
  | 'Bendahara Umum'
  | 'Bendahara I'
  | 'Koordinator Sekbid'
  | 'Anggota Sekbid';

export interface SchoolProfile {
  namaSekolah: string;
  npsn: string;
  alamat: string;
  kota: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  email: string;
  website: string;
  akreditasi: string;
  masaBakti: string; // e.g. "2026/2027"
  namaKabinet: string; // e.g. "Adhigana Nawasena"
  mottoKabinet: string;
  kepalaSekolah: string;
  nipKepalaSekolah: string;
  pembinaOsis: string;
  nipPembinaOsis: string;
  ketuaOsis: string;
  nisnKetuaOsis: string;
  wakilKetuaOsis: string;
  nisnWakilKetuaOsis: string;
  visi: string;
  misi: string[];
  logoSekolahUrl: string;
  logoOsisUrl: string;
}

export interface PengurusOsis {
  id: string;
  nisn: string;
  nama: string;
  panggilan: string;
  jenisKelamin: 'L' | 'P';
  kelas: string;
  jabatan: JabatanType;
  sekbid: SekbidType;
  noHp: string;
  email: string;
  ttl: string;
  alamat: string;
  fotoUrl: string;
  statusAktif: boolean;
  tanggalDilantik: string;
  catatanPrestasi: string;
}

export type ProkerStatus = 'Perencanaan' | 'Disetujui Pembina' | 'Sedang Berjalan' | 'Selesai' | 'Dievaluasi' | 'Dibatalkan';

export interface ProgramKerja {
  id: string;
  namaProker: string;
  sekbid: SekbidType;
  penanggungJawab: string;
  sasaran: string;
  tujuan: string;
  anggaranBiaya: number;
  sumberDana: 'Kas OSIS' | 'Sekolah / BOS' | 'Sponsorship' | 'Sponsorship & Donasi' | 'Dana Usaha (Danus)' | 'Kombinasi';
  bulanPelaksanaan: number; // 1 - 12 (1 = Juli, 2 = Agustus, ... 12 = Juni)
  tanggalMulai: string;
  tanggalSelesai: string;
  tempat: string;
  status: ProkerStatus;
  persentaseProgress: number;
  kpiTarget: string;
  laporanRingkas: string;
}

export type TipeTransaksi = 'masuk' | 'keluar';

export type KategoriKas =
  | 'Iuran Kas Rutin'
  | 'Alokasi Dana BOS / Sekolah'
  | 'Sponsorship & Donasi'
  | 'Dana Usaha Siswa'
  | 'Pengadaan ATK & Dokumen'
  | 'Konsumsi & Logistik'
  | 'Perlengkapan & Sound System'
  | 'Hadiah, Piala & Piagam'
  | 'Transportasi & Operasional'
  | 'Lain-lain';

export interface TransaksiKas {
  id: string;
  tanggal: string;
  tipe: TipeTransaksi;
  kategori: KategoriKas;
  jumlah: number;
  deskripsi: string;
  penanggungJawab: string;
  noKwitansi: string;
  buktiNotaUrl?: string; // base64 or image url
  programKerjaId?: string;
}

export type JenisDokumen =
  | 'Surat Undangan'
  | 'Surat Permohonan Izin'
  | 'Surat Dispensasi'
  | 'Surat Keputusan (SK)'
  | 'Proposal Kegiatan'
  | 'Laporan Pertanggungjawaban (LPJ)'
  | 'Notulensi Rapat'
  | 'Sertifikat & Piagam'
  | 'Foto & Dokumentasi'
  | 'Arsip Lainnya';

export interface ArsipDokumen {
  id: string;
  judul: string;
  nomorSurat: string;
  jenis: JenisDokumen;
  tanggal: string;
  sekbid: string;
  fileData?: string; // Data URL or text
  fileName: string;
  fileSize: string;
  fileType: string;
  keterangan: string;
}

export interface PesertaPresensi {
  pengurusId: string;
  nama: string;
  jabatan: string;
  status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
  catatan?: string;
}

export interface RapatNotulensi {
  id: string;
  nomorNotulen: string;
  judulRapat: string;
  jenisRapat: 'Rapat Pleno' | 'Rapat Pengurus Harian' | 'Rapat Koordinasi Sekbid' | 'Rapat Evaluasi Bulanan' | 'Rapat Kepanitiaan Event';
  tanggal: string;
  waktuMulai: string;
  waktuSelesai: string;
  tempat: string;
  pimpinanRapat: string;
  notulis: string;
  agenda: string;
  pembahasan: string;
  kesimpulanKeputusan: string;
  daftarPresensi: PesertaPresensi[];
  fotoDokumentasiUrl?: string;
}

export interface AspirasiSiswa {
  id: string;
  tanggal: string;
  namaSiswa: string;
  kelas: string;
  kategori: 'Fasilitas & Sarpras' | 'Kegiatan & Event' | 'Ekstrakurikuler' | 'Kebersihan & Kantin' | 'Akademik & Ujian' | 'Lainnya';
  judul: string;
  isiAspirasi: string;
  status: 'Menunggu Review' | 'Diteruskan ke Pembina' | 'Sedang Ditindaklanjuti' | 'Selesai Terealisasi';
  responOsis?: string;
  ditanganiOleh?: string;
}
