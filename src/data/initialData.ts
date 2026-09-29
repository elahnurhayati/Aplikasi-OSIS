import {
  SchoolProfile,
  PengurusOsis,
  ProgramKerja,
  TransaksiKas,
  ArsipDokumen,
  RapatNotulensi,
  AspirasiSiswa,
  InventarisBarang,
  PeminjamanBarang,
  JadwalPiket,
  BukuTamu,
  Ekstrakurikuler,
  KandidatPemilos,
} from '../types';

export const INITIAL_SCHOOL_PROFILE: SchoolProfile = {
  namaSekolah: 'SMA NEGERI 1 TELADAN NUSANTARA',
  npsn: '20245678',
  alamat: 'Jl. Pemuda Pendidikan No. 45, Kompleks Pendidikan Terpadu',
  kota: 'Kota Nusantara',
  provinsi: 'Jawa Barat',
  kodePos: '40115',
  telepon: '(022) 7208891',
  email: 'osis.sman1teladan@sch.id',
  website: 'https://sman1teladan.sch.id',
  akreditasi: 'A (Unggul)',
  masaBakti: '2026/2027',
  namaKabinet: 'KABINET NAWASENA KONOHA - SEMANGAT API',
  mottoKabinet: 'Pantang Menyerah, Kobarkan Semangat Api (Hi no Ishi), Mengabdi Demi Prestasi Madrasah',
  kepalaSekolah: 'Drs. H. Bambang Suryanegara, M.Pd.',
  nipKepalaSekolah: '19740512 199803 1 002',
  pembinaOsis: 'Siti Rahmawati, S.Pd., M.Si.',
  nipPembinaOsis: '19820719 200604 2 008',
  ketuaOsis: 'M. Rizky Pratama',
  nisnKetuaOsis: '0087492101',
  wakilKetuaOsis: 'Annisa Fitri Azzahra',
  nisnWakilKetuaOsis: '0086391042',
  visi: 'Mewujudkan OSIS/OSIM sebagai episentrum kepemimpinan berkarakter tangguh, memiliki tekad pantang menyerah seperti Shinobi Konoha, adaptif terhadap inovasi digital, serta berdaya saing global.',
  misi: [
    'Meningkatkan ketakwaan kepada Tuhan YME dan budi pekerti luhur dengan mengobarkan Semangat Api kebaikan.',
    'Mendorong akselerasi prestasi akademik dan non-akademik siswa melalui pendampingan kompetisi terpadu.',
    'Mengembangkan platform digital kesekretariatan dan transparansi tata kelola organisasi secara akuntabel.',
    'Menghidupkan iklim kewirausahaan siswa dan solidaritas persaudaraan antarkelas tanpa kenal putus asa.',
    'Menjadi jembatan aspirasi siswa yang proaktif, kritis, konstruktif, dan solutif bagi kemajuan madrasah/sekolah.'
  ],
  logoSekolahUrl: '/src/assets/images/konoha_council_emblem_1790708135100.jpg',
  logoOsisUrl: '/src/assets/images/konoha_council_emblem_1790708135100.jpg',
};

export const INITIAL_PENGURUS: PengurusOsis[] = [
  {
    id: 'pgr-01',
    nisn: '0087492101',
    nama: 'Muhammad Rizky Pratama',
    panggilan: 'Rizky',
    jenisKelamin: 'L',
    kelas: 'XI MIPA 1',
    jabatan: 'Ketua Umum',
    sekbid: 'Pengurus Inti',
    noHp: '081234567890',
    email: 'rizky.pratama@sman1teladan.sch.id',
    ttl: 'Bandung, 14 Mei 2009',
    alamat: 'Jl. Merdeka No. 12, Kota Nusantara',
    fotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    statusAktif: true,
    tanggalDilantik: '15 Juli 2026',
    catatanPrestasi: 'Juara 1 Debat Parlemen Remaja Tingkat Provinsi 2025'
  },
  {
    id: 'pgr-02',
    nisn: '0086391042',
    nama: 'Annisa Fitri Azzahra',
    panggilan: 'Annisa',
    jenisKelamin: 'P',
    kelas: 'XI MIPA 3',
    jabatan: 'Wakil Ketua Umum',
    sekbid: 'Pengurus Inti',
    noHp: '081398765432',
    email: 'annisa.fitri@sman1teladan.sch.id',
    ttl: 'Nusantara, 21 Agustus 2009',
    alamat: 'Kompleks Graha Asri Blok C-4',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    statusAktif: true,
    tanggalDilantik: '15 Juli 2026',
    catatanPrestasi: 'Duta Generasi Berencana (GenRe) Sekolah 2025'
  },
  {
    id: 'pgr-03',
    nisn: '0081293847',
    nama: 'Fadhil Naufal Ramadhan',
    panggilan: 'Fadhil',
    jenisKelamin: 'L',
    kelas: 'XI IPS 1',
    jabatan: 'Sekretaris Umum',
    sekbid: 'Pengurus Inti',
    noHp: '085712349876',
    email: 'fadhil.naufal@sman1teladan.sch.id',
    ttl: 'Nusantara, 03 September 2009',
    alamat: 'Jl. Cendrawasih No. 8',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    statusAktif: true,
    tanggalDilantik: '15 Juli 2026',
    catatanPrestasi: 'Sertifikasi Kejuruan Kesekretariatan Digital & Arsip'
  },
  {
    id: 'pgr-04',
    nisn: '0089201938',
    nama: 'Nabila Zahra Putri',
    panggilan: 'Nabila',
    jenisKelamin: 'P',
    kelas: 'X-2',
    jabatan: 'Sekretaris I',
    sekbid: 'Pengurus Inti',
    noHp: '087890123456',
    email: 'nabila.zahra@sman1teladan.sch.id',
    ttl: 'Nusantara, 18 Desember 2010',
    alamat: 'Perumahan Griya Indah No. 55',
    fotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    statusAktif: true,
    tanggalDilantik: '15 Juli 2026',
    catatanPrestasi: 'Juara 2 Lomba Menulis Essay Tingkat Kota'
  },
  {
    id: 'pgr-05',
    nisn: '0085432190',
    nama: 'Devan Arya Wibowo',
    panggilan: 'Devan',
    jenisKelamin: 'L',
    kelas: 'XI MIPA 2',
    jabatan: 'Bendahara Umum',
    sekbid: 'Pengurus Inti',
    noHp: '082155443322',
    email: 'devan.wibowo@sman1teladan.sch.id',
    ttl: 'Nusantara, 07 Januari 2009',
    alamat: 'Jl. Anggrek No. 19',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    statusAktif: true,
    tanggalDilantik: '15 Juli 2026',
    catatanPrestasi: 'Peraih Medali Perak Olimpiade Sains Ekonomi 2025'
  },
  {
    id: 'pgr-06',
    nisn: '0083321987',
    nama: 'Syifa Nur Salsabila',
    panggilan: 'Syifa',
    jenisKelamin: 'P',
    kelas: 'X-5',
    jabatan: 'Bendahara I',
    sekbid: 'Pengurus Inti',
    noHp: '081987654321',
    email: 'syifa.salsabila@sman1teladan.sch.id',
    ttl: 'Nusantara, 12 Maret 2010',
    alamat: 'Jl. Dahlia Barat No. 22',
    fotoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    statusAktif: true,
    tanggalDilantik: '15 Juli 2026',
    catatanPrestasi: 'Akuntan Muda Terbaik LDKS OSIS 2026'
  },
  {
    id: 'pgr-07',
    nisn: '0084439012',
    nama: 'Ahmad Raihan Alfathan',
    panggilan: 'Raihan',
    jenisKelamin: 'L',
    kelas: 'XI IPS 2',
    jabatan: 'Koordinator Sekbid',
    sekbid: 'Sekbid 1 - Ketaqwaan Terhadap Tuhan YME',
    noHp: '085811223344',
    email: 'raihan.alfathan@sman1teladan.sch.id',
    ttl: 'Nusantara, 10 Oktober 2009',
    alamat: 'Jl. Pesantren No. 3',
    fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300',
    statusAktif: true,
    tanggalDilantik: '15 Juli 2026',
    catatanPrestasi: 'Juara 1 Musabaqah Tilawatil Quran (MTQ) Siswa 2025'
  },
  {
    id: 'pgr-08',
    nisn: '0087765432',
    nama: 'Bagus Satrio Purnomo',
    panggilan: 'Bagus',
    jenisKelamin: 'L',
    kelas: 'XI MIPA 4',
    jabatan: 'Koordinator Sekbid',
    sekbid: 'Sekbid 3 - Wawasan Kebangsaan & Bela Negara',
    noHp: '081299887766',
    email: 'bagus.satrio@sman1teladan.sch.id',
    ttl: 'Nusantara, 05 Juli 2009',
    alamat: 'Jl. Sudirman No. 102',
    fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300',
    statusAktif: true,
    tanggalDilantik: '15 Juli 2026',
    catatanPrestasi: 'Duta Paskibraka Kota Nusantara 2025'
  },
  {
    id: 'pgr-09',
    nisn: '0081199228',
    nama: 'Kayla Jessica Gunawan',
    panggilan: 'Kayla',
    jenisKelamin: 'P',
    kelas: 'XI MIPA 1',
    jabatan: 'Koordinator Sekbid',
    sekbid: 'Sekbid 4 - Prestasi Akademik, Seni & Olahraga',
    noHp: '087722334455',
    email: 'kayla.jessica@sman1teladan.sch.id',
    ttl: 'Nusantara, 29 April 2009',
    alamat: 'Jl. Cemara Raya No. 4',
    fotoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300',
    statusAktif: true,
    tanggalDilantik: '15 Juli 2026',
    catatanPrestasi: 'Kapten Tim Basket Putri Juara DBL Regional'
  },
  {
    id: 'pgr-10',
    nisn: '0089988112',
    nama: 'Dimas Aditya Pratama',
    panggilan: 'Dimas',
    jenisKelamin: 'L',
    kelas: 'XI IPS 3',
    jabatan: 'Koordinator Sekbid',
    sekbid: 'Sekbid 6 - Kreativitas, Keterampilan & Kewirausahaan',
    noHp: '081344556677',
    email: 'dimas.aditya@sman1teladan.sch.id',
    ttl: 'Nusantara, 14 Februari 2009',
    alamat: 'Jl. Diponegoro No. 88',
    fotoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300',
    statusAktif: true,
    tanggalDilantik: '15 Juli 2026',
    catatanPrestasi: 'Founder Teladan Market & Bisnis Merchandise Sekolah'
  },
  {
    id: 'pgr-11',
    nisn: '0085566778',
    nama: 'Alifian Ezra Maulana',
    panggilan: 'Alif',
    jenisKelamin: 'L',
    kelas: 'XI MIPA 2',
    jabatan: 'Koordinator Sekbid',
    sekbid: 'Sekbid 9 - Teknologi Informasi & Komunikasi (TIK)',
    noHp: '085912345678',
    email: 'alifian.ezra@sman1teladan.sch.id',
    ttl: 'Nusantara, 17 November 2009',
    alamat: 'Jl. Melati Putih No. 16',
    fotoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300',
    statusAktif: true,
    tanggalDilantik: '15 Juli 2026',
    catatanPrestasi: 'Juara Web Design Competition Pelajar Nasional 2025'
  },
  {
    id: 'pgr-12',
    nisn: '0086677889',
    nama: 'Zalfa Maharani Putri',
    panggilan: 'Zalfa',
    jenisKelamin: 'P',
    kelas: 'X-1',
    jabatan: 'Koordinator Sekbid',
    sekbid: 'Sekbid 10 - Komunikasi Bahasa Asing & Literasi Global',
    noHp: '081233445566',
    email: 'zalfa.maharani@sman1teladan.sch.id',
    ttl: 'Nusantara, 09 Januari 2010',
    alamat: 'Jl. Teratai Indah No. 7',
    fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300',
    statusAktif: true,
    tanggalDilantik: '15 Juli 2026',
    catatanPrestasi: 'Best Speaker English Debate Championship 2025'
  }
];

export const INITIAL_PROKER: ProgramKerja[] = [
  {
    id: 'proker-01',
    namaProker: 'Masa Pengenalan Lingkungan Sekolah (MPLS) Ramah 2026',
    sekbid: 'Pengurus Inti',
    penanggungJawab: 'M. Rizky Pratama & Fadhil Naufal',
    sasaran: 'Seluruh Siswa Baru Kelas X (360 Siswa)',
    tujuan: 'Mengenalkan kultur belajar positif, tata tertib, organisasi sekolah, dan pencegahan bullying.',
    anggaranBiaya: 8500000,
    sumberDana: 'Sekolah / BOS',
    bulanPelaksanaan: 1, // Juli
    tanggalMulai: '2026-07-16',
    tanggalSelesai: '2026-07-18',
    tempat: 'Auditorium & Lapangan Utama SMA Teladan',
    status: 'Selesai',
    persentaseProgress: 100,
    kpiTarget: 'Tingkat kepuasan peserta >90%, zero perpeloncoan/kekerasan.',
    laporanRingkas: 'Terlaksana sukses dengan kehadiran 100% siswa baru dan apresiasi dinas pendidikan.'
  },
  {
    id: 'proker-02',
    namaProker: 'Latihan Dasar Kepemimpinan Siswa (LDKS) Mandiri',
    sekbid: 'Sekbid 3 - Wawasan Kebangsaan & Bela Negara',
    penanggungJawab: 'Bagus Satrio Purnomo',
    sasaran: 'Calon Pengurus OSIS & MPK (80 Siswa)',
    tujuan: 'Membentuk integritas, kepemimpinan adaptif, public speaking, dan ketahanan mental.',
    anggaranBiaya: 12000000,
    sumberDana: 'Kombinasi',
    bulanPelaksanaan: 2, // Agustus
    tanggalMulai: '2026-08-21',
    tanggalSelesai: '2026-08-23',
    tempat: 'Bumi Perkemahan Karang Pawitan',
    status: 'Selesai',
    persentaseProgress: 100,
    kpiTarget: 'Kelulusan sertifikasi LDKS 100% dengan predikat minimal Baik.',
    laporanRingkas: 'LDKS berlangsung lancar dipandu Koramil dan instruktur kepemimpinan daerah.'
  },
  {
    id: 'proker-03',
    namaProker: 'Peringatan Hari Kemerdekaan RI Ke-81 & Porseni Sekolah',
    sekbid: 'Sekbid 4 - Prestasi Akademik, Seni & Olahraga',
    penanggungJawab: 'Kayla Jessica Gunawan',
    sasaran: 'Seluruh Siswa, Guru, dan Staf TU (1200 Orang)',
    tujuan: 'Memupuk nasionalisme, sportivitas, dan solidaritas antarkelas.',
    anggaranBiaya: 6500000,
    sumberDana: 'Kas OSIS',
    bulanPelaksanaan: 2, // Agustus
    tanggalMulai: '2026-08-15',
    tanggalSelesai: '2026-08-17',
    tempat: 'Kompleks Olahraga SMA Teladan',
    status: 'Selesai',
    persentaseProgress: 100,
    kpiTarget: 'Partisipasi 30 kelas penuh dalam 8 cabang lomba.',
    laporanRingkas: '30 kelas berpartisipasi aktif. Juara umum diraih oleh kelas XII IPS 2.'
  },
  {
    id: 'proker-04',
    namaProker: 'Bulan Bahasa & Festival Budaya Nusantara',
    sekbid: 'Sekbid 8 - Sastra, Budaya & Apresiasi Seni',
    penanggungJawab: 'Zalfa Maharani Putri',
    sasaran: 'Warga Sekolah dan Sekolah Mitra se-Kota',
    tujuan: 'Mengembangkan literasi sastra daerah, puisi, drama monolog, dan pameran kuliner.',
    anggaranBiaya: 9000000,
    sumberDana: 'Dana Usaha (Danus)',
    bulanPelaksanaan: 4, // Oktober
    tanggalMulai: '2026-10-24',
    tanggalSelesai: '2026-10-26',
    tempat: 'Gedung Kesenian & Selasar Utama',
    status: 'Sedang Berjalan',
    persentaseProgress: 65,
    kpiTarget: 'Menerbitkan 1 antologi cerpen ber-ISBN karya siswa dan pentas 5 ragam tarian.',
    laporanRingkas: 'Tahap pengumpulan naskah antologi cerpen sudah selesai, latihan tari tengah berjalan.'
  },
  {
    id: 'proker-05',
    namaProker: 'Classmeeting Semester Ganjil (Teladan Cup Esports & Futsal)',
    sekbid: 'Sekbid 7 - Kualitas Jasmani, Kesehatan & Gizi',
    penanggungJawab: 'Devan Arya & Kayla Jessica',
    sasaran: 'Perwakilan Kelas X, XI, XII',
    tujuan: 'Penyegaran pasca Penilaian Akhir Semester (PAS) ganjil.',
    anggaranBiaya: 4500000,
    sumberDana: 'Kas OSIS',
    bulanPelaksanaan: 6, // Desember
    tanggalMulai: '2026-12-14',
    tanggalSelesai: '2026-12-18',
    tempat: 'Lapangan Olahraga & Lab Komputer',
    status: 'Disetujui Pembina',
    persentaseProgress: 30,
    kpiTarget: 'Turnamen futsal, basket 3x3, dan turnamen Mobile Legends antarkelas.',
    laporanRingkas: 'Petunjuk teknis dan bagan pertandingan telah diverifikasi kesiswaan.'
  },
  {
    id: 'proker-06',
    namaProker: 'Pentas Seni Akbar & Expo Kreativitas Teladan VAGANZA',
    sekbid: 'Sekbid 6 - Kreativitas, Keterampilan & Kewirausahaan',
    penanggungJawab: 'Dimas Aditya & M. Rizky Pratama',
    sasaran: 'Siswa, Alumni, dan Pelajar se-Jabodetabek (3000 Pengunjung)',
    tujuan: 'Wadah ekspresi bakat musik, bazar wirausaha siswa, dan penggalangan dana amal.',
    anggaranBiaya: 35000000,
    sumberDana: 'Sponsorship',
    bulanPelaksanaan: 8, // Februari
    tanggalMulai: '2027-02-20',
    tanggalSelesai: '2027-02-21',
    tempat: 'Stadion Mini / Plaza Utama',
    status: 'Perencanaan',
    persentaseProgress: 20,
    kpiTarget: 'Menghadirkan 2 guest star nasional dan 40 booth bazar makanan kreatif.',
    laporanRingkas: 'Proposal sponsor telah disebar ke 12 perusahaan multinasional dan BUMN.'
  },
  {
    id: 'proker-07',
    namaProker: 'Pesantren Kilat Ramadhan & Bakti Sosial Siswa',
    sekbid: 'Sekbid 1 - Ketaqwaan Terhadap Tuhan YME',
    penanggungJawab: 'Ahmad Raihan Alfathan',
    sasaran: 'Warga Sekolah dan Masyarakat Dhuafa Sekitar',
    tujuan: 'Mempertebal keimanan spiritual dan mendistribusikan 500 paket sembako berkah.',
    anggaranBiaya: 14000000,
    sumberDana: 'Sponsorship & Donasi',
    bulanPelaksanaan: 9, // Maret
    tanggalMulai: '2027-03-18',
    tanggalSelesai: '2027-03-24',
    tempat: 'Masjid Al-Ikhlas & Lingkungan Warga RW 04',
    status: 'Perencanaan',
    persentaseProgress: 10,
    kpiTarget: 'Tersalurkan 500 paket sembako dan 100% siswa tuntas tadarus Al-Quran.',
    laporanRingkas: 'Panitia telah berkoordinasi dengan pengurus DKM dan RT setempat.'
  },
  {
    id: 'proker-08',
    namaProker: 'Pemilihan Umum Ketua OSIS (Pemilos Digital) 2027/2028',
    sekbid: 'Sekbid 5 - Demokrasi, HAM & Pendidikan Politik',
    penanggungJawab: 'Annisa Fitri & Alifian Ezra',
    sasaran: 'Seluruh Siswa, Guru, dan Staf Sekolah (E-Voting)',
    tujuan: 'Edukasi demokrasi langsung melalui sistem e-voting terenkripsi dan debat terbuka.',
    anggaranBiaya: 5000000,
    sumberDana: 'Sekolah / BOS',
    bulanPelaksanaan: 12, // Juni
    tanggalMulai: '2027-06-08',
    tanggalSelesai: '2027-06-12',
    tempat: 'Auditorium & Portal Web Sekolah',
    status: 'Perencanaan',
    persentaseProgress: 5,
    kpiTarget: 'Tingkat partisipasi pemilih >95% tanpa golput teknis.',
    laporanRingkas: 'Sistem aplikasi e-voting internal sedang dipersiapkan oleh Sekbid TIK.'
  }
];

export const INITIAL_KAS: TransaksiKas[] = [
  {
    id: 'kas-01',
    tanggal: '2026-07-10',
    tipe: 'masuk',
    kategori: 'Iuran Kas Rutin',
    jumlah: 2400000,
    deskripsi: 'Iuran kas awal tahun seluruh pengurus OSIS & MPK (40 anggota x Rp 60.000)',
    penanggungJawab: 'Devan Arya Wibowo',
    noKwitansi: 'KW/2026/07/001'
  },
  {
    id: 'kas-02',
    tanggal: '2026-07-14',
    tipe: 'masuk',
    kategori: 'Alokasi Dana BOS / Sekolah',
    jumlah: 8500000,
    deskripsi: 'Pencairan subsidi kegiatan kesiswaan untuk MPLS Ramah 2026 dari Sekolah',
    penanggungJawab: 'Devan Arya Wibowo',
    noKwitansi: 'KW/2026/07/002'
  },
  {
    id: 'kas-03',
    tanggal: '2026-07-19',
    tipe: 'keluar',
    kategori: 'Pengadaan ATK & Dokumen',
    jumlah: 1450000,
    deskripsi: 'Pembelian ID card peserta MPLS, modul panduan siswa, dan spanduk selamat datang',
    penanggungJawab: 'Fadhil Naufal Ramadhan',
    noKwitansi: 'KW/2026/07/003'
  },
  {
    id: 'kas-04',
    tanggal: '2026-07-19',
    tipe: 'keluar',
    kategori: 'Konsumsi & Logistik',
    jumlah: 4200000,
    deskripsi: 'Konsumsi snackbox dan makan siang panitia & pemateri MPLS 3 hari',
    penanggungJawab: 'Syifa Nur Salsabila',
    noKwitansi: 'KW/2026/07/004'
  },
  {
    id: 'kas-05',
    tanggal: '2026-08-05',
    tipe: 'masuk',
    kategori: 'Dana Usaha Siswa',
    jumlah: 3200000,
    deskripsi: 'Keuntungan penjualan merchandise sekolah (gantungan kunci, pin, totebag teladan)',
    penanggungJawab: 'Dimas Aditya Pratama',
    noKwitansi: 'KW/2026/08/001'
  },
  {
    id: 'kas-06',
    tanggal: '2026-08-16',
    tipe: 'keluar',
    kategori: 'Hadiah, Piala & Piagam',
    jumlah: 2100000,
    deskripsi: 'Pembelian piala juara umum dan piagam penghargaan Porseni HUT RI Ke-81',
    penanggungJawab: 'Kayla Jessica Gunawan',
    noKwitansi: 'KW/2026/08/002'
  },
  {
    id: 'kas-07',
    tanggal: '2026-09-02',
    tipe: 'masuk',
    kategori: 'Sponsorship & Donasi',
    jumlah: 5000000,
    deskripsi: 'Sponsorship tahap 1 dari Bank BJB Cabang Pelajar untuk Event Bulan Bahasa',
    penanggungJawab: 'Annisa Fitri Azzahra',
    noKwitansi: 'KW/2026/09/001'
  },
  {
    id: 'kas-08',
    tanggal: '2026-09-15',
    tipe: 'keluar',
    kategori: 'Perlengkapan & Sound System',
    jumlah: 850000,
    deskripsi: 'Perbaikan kabel mic wireless ruang rapat OSIS dan baterai cadangan',
    penanggungJawab: 'Alifian Ezra Maulana',
    noKwitansi: 'KW/2026/09/002'
  }
];

export const INITIAL_DOKUMEN: ArsipDokumen[] = [
  {
    id: 'dok-01',
    judul: 'Surat Keputusan (SK) Kepala Sekolah tentang Susunan Pengurus OSIS 2026/2027',
    nomorSurat: '421.3/088-SMAN1/SK-OSIS/VII/2026',
    jenis: 'Surat Keputusan (SK)',
    tanggal: '2026-07-15',
    sekbid: 'Pengurus Inti',
    fileName: 'SK_Kepengurusan_OSIS_2026_2027.pdf',
    fileSize: '420 KB',
    fileType: 'application/pdf',
    keterangan: 'Legalitas resmi kepengurusan OSIS Masa Bakti 2026/2027 yang ditandatangani Kepala Sekolah.'
  },
  {
    id: 'dok-02',
    judul: 'Proposal Pelaksanaan Bulan Bahasa & Pentas Sastra Pelajar 2026',
    nomorSurat: '015/OSIS-SMAN1/PROP/IX/2026',
    jenis: 'Proposal Kegiatan',
    tanggal: '2026-09-10',
    sekbid: 'Sekbid 8 - Sastra, Budaya & Apresiasi Seni',
    fileName: 'Proposal_Bulan_Bahasa_2026.docx',
    fileSize: '890 KB',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    keterangan: 'Proposal lengkap dengan estimasi RAB dan persetujuan Wakasek Kesiswaan.'
  },
  {
    id: 'dok-03',
    judul: 'Laporan Pertanggungjawaban (LPJ) Pelaksanaan MPLS Ramah 2026',
    nomorSurat: '008/OSIS-SMAN1/LPJ/VII/2026',
    jenis: 'Laporan Pertanggungjawaban (LPJ)',
    tanggal: '2026-07-28',
    sekbid: 'Pengurus Inti',
    fileName: 'LPJ_Resmi_MPLS_2026_Verified.pdf',
    fileSize: '1.4 MB',
    fileType: 'application/pdf',
    keterangan: 'Dokumen evaluasi kegiatan, rekapitulasi presensi, dan bukti kwitansi riil.'
  },
  {
    id: 'dok-04',
    judul: 'Surat Dispensasi Siswa Delegasi Lomba Cerdas Cermat Provinsi',
    nomorSurat: '022/OSIS-SMAN1/DISP/IX/2026',
    jenis: 'Surat Dispensasi',
    tanggal: '2026-09-20',
    sekbid: 'Sekbid 4 - Prestasi Akademik, Seni & Olahraga',
    fileName: 'Dispensasi_Lomba_LCC_Provinsi.pdf',
    fileSize: '180 KB',
    fileType: 'application/pdf',
    keterangan: 'Dispensasi belajar untuk 6 orang peserta lomba cerdas cermat selama 2 hari.'
  }
];

export const INITIAL_RAPAT: RapatNotulensi[] = [
  {
    id: 'rpt-01',
    nomorNotulen: 'NTL/OSIS/01/VII/2026',
    judulRapat: 'Rapat Pleno Perdana: Penetapan Matriks Program Kerja Tahunan 2026/2027',
    jenisRapat: 'Rapat Pleno',
    tanggal: '2026-07-20',
    waktuMulai: '15:30',
    waktuSelesai: '17:45',
    tempat: 'Ruang Multimedia & Sekretariat OSIS',
    pimpinanRapat: 'M. Rizky Pratama (Ketua Umum)',
    notulis: 'Fadhil Naufal Ramadhan (Sekretaris Umum)',
    agenda: '1. Pemaparan Visi Misi Kabinet\n2. Sinkronisasi kalender akademik sekolah\n3. Pengesahan 8 Program Kerja Unggulan\n4. Pembagian seragam KTA dan jadwal piket harian',
    pembahasan: 'Seluruh perwakilan sekbid telah memaparkan draf program kerja. Pembina OSIS memberikan arahan agar anggaran berfokus pada program berdampak langsung bagi peningkatan prestasi siswa. Sekbid 9 bertanggung jawab penuh terhadap digitalisasi kesekretariatan.',
    kesimpulanKeputusan: '1. Matriks 1 Tahun resmi disepakati secara aklamasi.\n2. Jadwal piket sekretariat berlaku mulai Senin 27 Juli 2026.\n3. Pertemuan evaluasi kas rutin digelar setiap akhir bulan.',
    daftarPresensi: [
      { pengurusId: 'pgr-01', nama: 'Muhammad Rizky Pratama', jabatan: 'Ketua Umum', status: 'Hadir' },
      { pengurusId: 'pgr-02', nama: 'Annisa Fitri Azzahra', jabatan: 'Wakil Ketua Umum', status: 'Hadir' },
      { pengurusId: 'pgr-03', nama: 'Fadhil Naufal Ramadhan', jabatan: 'Sekretaris Umum', status: 'Hadir' },
      { pengurusId: 'pgr-04', nama: 'Nabila Zahra Putri', jabatan: 'Sekretaris I', status: 'Hadir' },
      { pengurusId: 'pgr-05', nama: 'Devan Arya Wibowo', jabatan: 'Bendahara Umum', status: 'Hadir' },
      { pengurusId: 'pgr-06', nama: 'Syifa Nur Salsabila', jabatan: 'Bendahara I', status: 'Hadir' },
      { pengurusId: 'pgr-07', nama: 'Ahmad Raihan Alfathan', jabatan: 'Koordinator Sekbid 1', status: 'Hadir' },
      { pengurusId: 'pgr-08', nama: 'Bagus Satrio Purnomo', jabatan: 'Koordinator Sekbid 3', status: 'Izin', catatan: 'Latihan Paskibra Kota' },
      { pengurusId: 'pgr-09', nama: 'Kayla Jessica Gunawan', jabatan: 'Koordinator Sekbid 4', status: 'Hadir' },
      { pengurusId: 'pgr-10', nama: 'Dimas Aditya Pratama', jabatan: 'Koordinator Sekbid 6', status: 'Hadir' },
      { pengurusId: 'pgr-11', nama: 'Alifian Ezra Maulana', jabatan: 'Koordinator Sekbid 9', status: 'Hadir' },
      { pengurusId: 'pgr-12', nama: 'Zalfa Maharani Putri', jabatan: 'Koordinator Sekbid 10', status: 'Hadir' }
    ]
  },
  {
    id: 'rpt-02',
    nomorNotulen: 'NTL/OSIS/02/IX/2026',
    judulRapat: 'Rapat Koordinasi: Persiapan Teknis Bulan Bahasa & Pemantapan Sponsor',
    jenisRapat: 'Rapat Koordinasi Sekbid',
    tanggal: '2026-09-18',
    waktuMulai: '14:00',
    waktuSelesai: '16:15',
    tempat: 'Ruang Rapat OSIS SMA Teladan',
    pimpinanRapat: 'Annisa Fitri Azzahra',
    notulis: 'Nabila Zahra Putri',
    agenda: '1. Progress antologi cerpen dan puisi\n2. Rekap konfirmasi sponsorship dan donatur\n3. Kebutuhan sound system dan panggung pentas seni',
    pembahasan: 'Sekbid Sastra mengonfirmasi telah menerima 78 naskah puisi dari siswa. Bank BJB sudah mencairkan dana sponsorship tahap 1 sebesar Rp 5.000.000 ke rekening bendahara OSIS.',
    kesimpulanKeputusan: '1. Gladi bersih pentas seni dilaksanakan H-1 pada 23 Oktober 2026.\n2. Undangan untuk kepala sekolah dan pembina dikirimkan paling lambat 10 Oktober 2026.',
    daftarPresensi: [
      { pengurusId: 'pgr-01', nama: 'Muhammad Rizky Pratama', jabatan: 'Ketua Umum', status: 'Hadir' },
      { pengurusId: 'pgr-02', nama: 'Annisa Fitri Azzahra', jabatan: 'Wakil Ketua Umum', status: 'Hadir' },
      { pengurusId: 'pgr-03', nama: 'Fadhil Naufal Ramadhan', jabatan: 'Sekretaris Umum', status: 'Hadir' },
      { pengurusId: 'pgr-04', nama: 'Nabila Zahra Putri', jabatan: 'Sekretaris I', status: 'Hadir' },
      { pengurusId: 'pgr-05', nama: 'Devan Arya Wibowo', jabatan: 'Bendahara Umum', status: 'Hadir' },
      { pengurusId: 'pgr-06', nama: 'Syifa Nur Salsabila', jabatan: 'Bendahara I', status: 'Hadir' },
      { pengurusId: 'pgr-10', nama: 'Dimas Aditya Pratama', jabatan: 'Koordinator Sekbid 6', status: 'Hadir' },
      { pengurusId: 'pgr-11', nama: 'Alifian Ezra Maulana', jabatan: 'Koordinator Sekbid 9', status: 'Hadir' },
      { pengurusId: 'pgr-12', nama: 'Zalfa Maharani Putri', jabatan: 'Koordinator Sekbid 10', status: 'Hadir' }
    ]
  }
];

export const INITIAL_ASPIRASI: AspirasiSiswa[] = [
  {
    id: 'asp-01',
    tanggal: '2026-09-12',
    namaSiswa: 'Arya Seno Wicaksono',
    kelas: 'XII MIPA 4',
    kategori: 'Fasilitas & Sarpras',
    judul: 'Penambahan Stopkontak dan Penguatan Wi-Fi di Koridor Belajar Lantai 2',
    isiAspirasi: 'Banyak teman-teman yang mengerjakan tugas kelompok di meja koridor namun kesulitan charging laptop, serta koneksi Wi-Fi sering terputus di area sayap timur.',
    status: 'Sedang Ditindaklanjuti',
    responOsis: 'Aspirasi telah disampaikan dalam rapat koordinasi kesiswaan bersama bagian sarpras. Teknisi sekolah dijadwalkan memasang repeater tambahan minggu depan.',
    ditanganiOleh: 'M. Rizky Pratama (Ketua Umum)'
  },
  {
    id: 'asp-02',
    tanggal: '2026-09-19',
    namaSiswa: 'Nadhira Kirana',
    kelas: 'X-4',
    kategori: 'Kegiatan & Event',
    judul: 'Usulan Penambahan Lomba Tari Kreasi Daerah pada Bulan Bahasa',
    isiAspirasi: 'Apakah mungkin panitia menambahkan kategori tari kreasi nusantara agar perwakilan kelas yang memiliki minat tari tradisi bisa menampilkan bakatnya?',
    status: 'Selesai Terealisasi',
    responOsis: 'Usulan diterima! Sekbid 8 telah resmi memasukkan Tari Kreasi Tradisional ke dalam juknis perlombaan Bulan Bahasa 2026.',
    ditanganiOleh: 'Zalfa Maharani (Sekbid 10 / Panitia Pelaksana)'
  },
  {
    id: 'asp-03',
    tanggal: '2026-09-24',
    namaSiswa: 'Kevin Maulana',
    kelas: 'XI IPS 1',
    kategori: 'Kebersihan & Kantin',
    judul: 'Pemisahan Tempat Sampah Organik & Daur Ulang Plastik di Area Kantin',
    isiAspirasi: 'Mohon OSIS menginisiasi gerakan pilah sampah botol plastik di kantin sekolah agar bisa disetor ke bank sampah sekolah binaan Adiwiyata.',
    status: 'Diteruskan ke Pembina',
    responOsis: 'Ide brilian! OSIS bersama Sekbid Budi Pekerti & Adiwiyata sedang menyusun proposal pengadaan drop-box botol plastik bekerjasama dengan bank sampah.',
    ditanganiOleh: 'Annisa Fitri (Wakil Ketua Umum)'
  }
];

export const INITIAL_INVENTARIS: InventarisBarang[] = [
  {
    id: 'inv-01',
    kodeBarang: 'INV/ELK/001',
    namaBarang: 'Wireless Microphone Shure Dual Handheld',
    kategori: 'Sound & Elektronik',
    jumlahTotal: 2,
    kondisiBaik: 2,
    kondisiRusak: 0,
    sedangDipinjam: 1,
    lokasi: 'Lemari Besi Sekretariat OSIS Rak 1',
    keterangan: 'Kelengkapan: 2 mic, receiver, 2 kabel XLR, adaptor asli.'
  },
  {
    id: 'inv-02',
    kodeBarang: 'INV/ELK/002',
    namaBarang: 'Portable Sound Speaker Active 12 Inch Trolley',
    kategori: 'Sound & Elektronik',
    jumlahTotal: 2,
    kondisiBaik: 2,
    kondisiRusak: 0,
    sedangDipinjam: 1,
    lokasi: 'Sudut Kiri Ruang Sekretariat',
    keterangan: 'Baterai tahan 6 jam, Bluetooth & USB playback.'
  },
  {
    id: 'inv-03',
    kodeBarang: 'INV/PUB/001',
    namaBarang: 'Kamera DSLR Canon EOS 200D II + Lensa 18-55mm',
    kategori: 'Dokumentasi & Pubdekdok',
    jumlahTotal: 1,
    kondisiBaik: 1,
    kondisiRusak: 0,
    sedangDipinjam: 0,
    lokasi: 'Dry Box Elektronik Sekbid TIK',
    keterangan: 'Kelengkapan: 2 baterai, charger, strap, tas selempang, SD Card 64GB.'
  },
  {
    id: 'inv-04',
    kodeBarang: 'INV/ATB/001',
    namaBarang: 'Bendera Pataka Resmi OSIS & Tiang Stainless',
    kategori: 'Bendera & Atribut',
    jumlahTotal: 3,
    kondisiBaik: 3,
    kondisiRusak: 0,
    sedangDipinjam: 0,
    lokasi: 'Ruang Protokoler',
    keterangan: 'Kain beludru bordir emas, rumbai premium.'
  },
  {
    id: 'inv-05',
    kodeBarang: 'INV/ELK/003',
    namaBarang: 'Handy Talkie (HT) Baofeng UV-5R Dual Band',
    kategori: 'Sound & Elektronik',
    jumlahTotal: 8,
    kondisiBaik: 7,
    kondisiRusak: 1,
    sedangDipinjam: 4,
    lokasi: 'Koper Komunikasi Sekbid Bela Negara',
    keterangan: '1 unit antena cadangan rusak, 7 unit siap pakai koordinasi event.'
  },
  {
    id: 'inv-06',
    kodeBarang: 'INV/OLR/001',
    namaBarang: 'Stopwatch Digital Presisi Seiko 100 Lap',
    kategori: 'Olahraga & Lomba',
    jumlahTotal: 4,
    kondisiBaik: 4,
    kondisiRusak: 0,
    sedangDipinjam: 0,
    lokasi: 'Kotak P3K & Olahraga',
    keterangan: 'Digunakan saat classmeeting dan porseni.'
  },
  {
    id: 'inv-07',
    kodeBarang: 'INV/TND/001',
    namaBarang: 'Tenda Sarnafil Kerucut Ukuran 3x3 Meter',
    kategori: 'Tenda & Lapangan',
    jumlahTotal: 4,
    kondisiBaik: 3,
    kondisiRusak: 1,
    sedangDipinjam: 0,
    lokasi: 'Gudang Sarpras Kesiswaan',
    keterangan: 'Rangka aluminium, terpal anti air tebal.'
  },
  {
    id: 'inv-08',
    kodeBarang: 'INV/ATK/001',
    namaBarang: 'Stempel Resmi Pengurus OSIS & Bak Tinta Otomatis',
    kategori: 'Kesekretariatan & ATK',
    jumlahTotal: 2,
    kondisiBaik: 2,
    kondisiRusak: 0,
    sedangDipinjam: 0,
    lokasi: 'Meja Sekretaris Umum',
    keterangan: 'Warna tinta ungu resmi madrasah/sekolah.'
  }
];

export const INITIAL_PEMINJAMAN: PeminjamanBarang[] = [
  {
    id: 'pinjam-01',
    kodePinjam: 'PINJAM/2026/09/001',
    namaPeminjam: 'Bagus Satrio (Ekskul Paskibra)',
    kontak: '081299887766',
    organisasiAtauKelas: 'Paskibra Sekolah',
    namaBarang: 'Portable Sound Speaker Active 12 Inch Trolley',
    jumlah: 1,
    tanggalPinjam: '2026-09-28',
    rencanaKembali: '2026-10-02',
    status: 'Aktif Dipinjam',
    petugasOsis: 'Fadhil Naufal (Sekretaris)',
    catatan: 'Untuk latihan pengibaran bendera hari besar.'
  },
  {
    id: 'pinjam-02',
    kodePinjam: 'PINJAM/2026/09/002',
    namaPeminjam: 'Alifian Ezra (Panitia Bulan Bahasa)',
    kontak: '085912345678',
    organisasiAtauKelas: 'Seksi Pubdekdok',
    namaBarang: 'Handy Talkie (HT) Baofeng UV-5R Dual Band',
    jumlah: 4,
    tanggalPinjam: '2026-09-25',
    rencanaKembali: '2026-09-29',
    status: 'Aktif Dipinjam',
    petugasOsis: 'M. Rizky Pratama (Ketua Umum)',
    catatan: 'Gladi kotor panggung auditorium.'
  }
];

export const INITIAL_PIKET: JadwalPiket[] = [
  {
    id: 'pkt-01',
    hari: 'Senin',
    koordinator: 'M. Rizky Pratama',
    anggotaPiket: ['Fadhil Naufal', 'Ahmad Raihan', 'Nabila Zahra'],
    tugasRutin: 'Pengawasan apel bendera, rekap presensi kelas, persiapan notulensi pekanan.'
  },
  {
    id: 'pkt-02',
    hari: 'Selasa',
    koordinator: 'Annisa Fitri Azzahra',
    anggotaPiket: ['Devan Arya', 'Bagus Satrio', 'Syifa Nur'],
    tugasRutin: 'Pemeriksaan kebersihan sekretariat, rekap iuran kas harian, monitoring mading.'
  },
  {
    id: 'pkt-03',
    hari: 'Rabu',
    koordinator: 'Devan Arya Wibowo',
    anggotaPiket: ['Kayla Jessica', 'Dimas Aditya', 'Zalfa Maharani'],
    tugasRutin: 'Pengecekan perlengkapan inventaris, melayani peminjaman barang ekskul.'
  },
  {
    id: 'pkt-04',
    hari: 'Kamis',
    koordinator: 'Fadhil Naufal Ramadhan',
    anggotaPiket: ['Alifian Ezra', 'Ahmad Raihan', 'Syifa Nur'],
    tugasRutin: 'Pengarsipan surat masuk & keluar, update portal mading digital sekolah.'
  },
  {
    id: 'pkt-05',
    hari: 'Jumat',
    koordinator: 'Ahmad Raihan Alfathan',
    anggotaPiket: ['M. Rizky Pratama', 'Bagus Satrio', 'Kayla Jessica'],
    tugasRutin: 'Koordinasi sholat Jumat & keputrian, inventarisasi kotak infaq amal.'
  },
  {
    id: 'pkt-06',
    hari: 'Sabtu',
    koordinator: 'Kayla Jessica Gunawan',
    anggotaPiket: ['Dimas Aditya', 'Alifian Ezra', 'Zalfa Maharani'],
    tugasRutin: 'Monitoring kegiatan ekstrakurikuler sabtu, evaluasi sarana olahraga.'
  }
];

export const INITIAL_BUKU_TAMU: BukuTamu[] = [
  {
    id: 'tamu-01',
    tanggal: '2026-09-28',
    waktu: '10:15 WIB',
    nama: 'Farhan Dwi Putra',
    kelasInstansi: 'Ketua Ekskul Rohis',
    keperluan: 'Konsultasi proposal peringatan Maulid Nabi 1448 H',
    ditemuiOleh: 'Ahmad Raihan (Sekbid 1)'
  },
  {
    id: 'tamu-02',
    tanggal: '2026-09-29',
    waktu: '13:30 WIB',
    nama: 'Salma Zahirah',
    kelasInstansi: 'Perwakilan Kelas XI-3',
    keperluan: 'Pengajuan aspirasi perbaikan kipas angin kelas',
    ditemuiOleh: 'Fadhil Naufal (Sekretaris)'
  }
];

export const INITIAL_EKSKUL: Ekstrakurikuler[] = [
  {
    id: 'eks-01',
    namaEkskul: 'Paskibra Garda Teladan',
    kategori: 'Kepemimpinan & Bela Negara',
    pembinaGuru: 'Drs. Supriyadi, M.Pd.',
    ketuaEkskul: 'Bagus Satrio Purnomo',
    kontakKetua: '081299887766',
    hariLatihan: 'Selasa & Kamis',
    waktuLatihan: '15.30 - 17.30 WIB',
    lokasiLatihan: 'Lapangan Upacara Utama',
    jumlahAnggota: 48,
    prestasiUnggulan: 'Juara 1 LKBB Tingkat Provinsi 2025'
  },
  {
    id: 'eks-02',
    namaEkskul: 'Pramuka Ambalan Soekarno - Fatmawati',
    kategori: 'Kepemimpinan & Bela Negara',
    pembinaGuru: 'Irwan Setiawan, S.Pd.',
    ketuaEkskul: 'Muhammad Naufal',
    kontakKetua: '085811223399',
    hariLatihan: 'Jumat',
    waktuLatihan: '14.00 - 17.00 WIB',
    lokasiLatihan: 'Halaman Belakang & Selasar',
    jumlahAnggota: 65,
    prestasiUnggulan: 'Juara Umum Kemah Bakti Penegak Kota 2025'
  },
  {
    id: 'eks-03',
    namaEkskul: 'Palang Merah Remaja (PMR Wira)',
    kategori: 'Kepemimpinan & Bela Negara',
    pembinaGuru: 'dr. Hj. Nurjanah, M.Kes.',
    ketuaEkskul: 'Nabila Zahra Putri',
    kontakKetua: '087890123456',
    hariLatihan: 'Rabu',
    waktuLatihan: '15.30 - 17.00 WIB',
    lokasiLatihan: 'Ruang UKS & Lapangan',
    jumlahAnggota: 38,
    prestasiUnggulan: 'Peringkat 1 Pertolongan Pertama Remaja PMI'
  },
  {
    id: 'eks-04',
    namaEkskul: 'Futsal & Sepakbola Teladan FC',
    kategori: 'Olahraga',
    pembinaGuru: 'Budi Santoso, S.Pd.Jas.',
    ketuaEkskul: 'Rifki Hidayat',
    kontakKetua: '081388776655',
    hariLatihan: 'Senin & Sabtu',
    waktuLatihan: '16.00 - 18.00 WIB',
    lokasiLatihan: 'Lapangan Olahraga Tertutup',
    jumlahAnggota: 52,
    prestasiUnggulan: 'Juara 2 Turnamen Pelajar Piala Menpora Regional'
  },
  {
    id: 'eks-05',
    namaEkskul: 'TIK, Robotika & Cyber Shinobi Club',
    kategori: 'Sains & TIK',
    pembinaGuru: 'Rahmat Hidayat, S.Kom., M.T.',
    ketuaEkskul: 'Alifian Ezra Maulana',
    kontakKetua: '085912345678',
    hariLatihan: 'Rabu & Jumat',
    waktuLatihan: '15.30 - 17.30 WIB',
    lokasiLatihan: 'Laboratorium Komputer 2',
    jumlahAnggota: 35,
    prestasiUnggulan: 'Medali Emas National Youth Robotic Expo 2025'
  },
  {
    id: 'eks-06',
    namaEkskul: 'Seni Tari Nusantara & Teater Gelora',
    kategori: 'Seni & Budaya',
    pembinaGuru: 'Endang Sulastri, S.Sn.',
    ketuaEkskul: 'Zalfa Maharani Putri',
    kontakKetua: '081233445566',
    hariLatihan: 'Kamis & Sabtu',
    waktuLatihan: '15.30 - 17.30 WIB',
    lokasiLatihan: 'Ruang Kesenian & Auditorium',
    jumlahAnggota: 42,
    prestasiUnggulan: 'Penyaji Terbaik FLS2N Tingkat Kota 2025'
  }
];

export const INITIAL_PEMILOS: KandidatPemilos[] = [
  {
    id: 'knd-01',
    noUrut: 1,
    namaKetua: 'Bagus Satrio Purnomo',
    kelasKetua: 'XI MIPA 4',
    namaWakil: 'Zalfa Maharani Putri',
    kelasWakil: 'X-1',
    visi: 'Mewujudkan kepemimpinan madrasah berintegritas tinggi, berdisiplin ksatria, unggul dalam adab dan teknologi.',
    misi: [
      'Meningkatkan kedisiplinan dan jiwa kepemimpinan berwawasan kebangsaan.',
      'Memaksimalkan fasilitas pendukung ekstrakurikuler berprestasi.',
      'Membangun budaya literasi digital dan komunikasi multilingual.'
    ],
    programUnggulan: 'Shinobi Leadership Camp & Teladan Digital Hub',
    fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300',
    perolehanSuara: 342
  },
  {
    id: 'knd-02',
    noUrut: 2,
    namaKetua: 'Kayla Jessica Gunawan',
    kelasKetua: 'XI MIPA 1',
    namaWakil: 'Ahmad Raihan Alfathan',
    kelasWakil: 'XI IPS 2',
    visi: 'OSIS yang inklusif, kolaboratif, peduli lingkungan, dan berprestasi di tingkat nasional.',
    misi: [
      'Memperkuat sinergi antara OSIS, seluruh ekskul, dan guru pembina.',
      'Mengembangkan gerakan peduli lingkungan Adiwiyata dan kantin sehat.',
      'Menyelenggarakan pekan olahraga dan seni akbar antarmadrasah se-wilayah.'
    ],
    programUnggulan: 'Teladan Green Campus & Porseni Akbar Nusantara',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    perolehanSuara: 418
  },
  {
    id: 'knd-03',
    noUrut: 3,
    namaKetua: 'Dimas Aditya Pratama',
    kelasKetua: 'XI IPS 3',
    namaWakil: 'Alifian Ezra Maulana',
    kelasWakil: 'XI MIPA 2',
    visi: 'Membangun generasi wirausaha muda mandiri yang kreatif, adaptif, dan berjiwa sosial tinggi.',
    misi: [
      'Mendirikan inkubator bisnis siswa dan bazar kreatif bulanan.',
      'Digitalisasi penuh layanan presensi dan voting aspirasi siswa.',
      'Memperluas kemitraan beasiswa dan magang keterampilan industri.'
    ],
    programUnggulan: 'Teladan Business Incubator & E-Voting Pemilos 3.0',
    fotoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300',
    perolehanSuara: 289
  }
];

