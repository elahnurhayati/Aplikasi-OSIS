import React from 'react';
import {
  Users,
  CalendarCheck,
  Wallet,
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  FileSignature,
  Award,
  MessageSquare,
  PlusCircle,
  Download,
  AlertCircle,
  Package,
  Compass,
  Clock as ClockIcon,
  Flame,
} from 'lucide-react';
import { useOsis } from '../../context/OsisContext';
import { ActiveTab } from '../layout/Sidebar';
import { formatRupiah, formatDateIndo } from '../../utils/exportUtils';

interface DashboardViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab }) => {
  const {
    schoolProfile,
    pengurus,
    proker,
    kas,
    dokumen,
    rapat,
    aspirasi,
    inventaris,
    peminjaman,
    ekskul,
    totalKasMasuk,
    totalKasKeluar,
    saldoKas,
    persentaseProkerSelesai,
    exportBackupJson,
  } = useOsis();

  const prokerSelesaiCount = proker.filter((p) => p.status === 'Selesai').length;
  const prokerBerjalanCount = proker.filter((p) => p.status === 'Sedang Berjalan').length;
  const aspirasiPendingCount = aspirasi.filter((a) => a.status === 'Menunggu Review' || a.status === 'Diteruskan ke Pembina').length;

  // Recent proker items
  const sortedProker = [...proker].sort((a, b) => new Date(a.tanggalMulai).getTime() - new Date(b.tanggalMulai).getTime());
  const upcomingProker = sortedProker.slice(0, 4);

  // Recent transactions
  const recentKas = [...kas].slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Banner / Hero Masa Bakti - Epic Konohagakure Anime Aesthetic */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 md:p-8 shadow-xl border-2 border-orange-500/40">
        {/* Konoha Village Background Art */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/konoha_village_banner_1790708149172.jpg"
            alt="Konohagakure Landscape"
            className="w-full h-full object-cover opacity-35 filter saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-[#EA580C]/35" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-black text-amber-300 tracking-wider uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
              <span>Sistem Tata Kelola 1 Tahun · Semangat Api Konoha</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{schoolProfile.namaKabinet}</span>
              <span className="text-orange-400 text-xl">🍃</span>
            </h1>
            <p className="text-xs md:text-sm text-orange-100/90 leading-relaxed font-medium">
              "{schoolProfile.mottoKabinet}"
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span>Ketua: <strong className="text-amber-300 font-bold">{schoolProfile.ketuaOsis}</strong></span>
              <span>·</span>
              <span>Wakil: <strong className="text-amber-300 font-bold">{schoolProfile.wakilKetuaOsis}</strong></span>
              <span>·</span>
              <span>Pembina: <strong className="text-amber-300 font-bold">{schoolProfile.pembinaOsis}</strong></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('dokumen')}
              className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 cursor-pointer"
            >
              <FileSignature className="w-4 h-4 text-white" />
              Buat Gulungan Surat
            </button>
            <button
              onClick={() => setActiveTab('pengurus')}
              className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-amber-200 text-xs font-bold rounded-xl transition-colors border border-orange-500/40 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Users className="w-4 h-4 text-orange-400" />
              Cetak KTA Shinobi
            </button>
          </div>
        </div>

        {/* 1 Year Tenure Progress Meter */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="text-slate-200">
            <span className="font-extrabold text-amber-300">Target Kinerja 1 Tahun:</span>{' '}
            {prokerSelesaiCount} dari {proker.length} Misi Kerja Tuntas ({persentaseProkerSelesai}%)
          </div>
          <div className="w-full md:w-64 bg-slate-950/80 rounded-full h-2.5 overflow-hidden border border-orange-500/40">
            <div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, persentaseProkerSelesai))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kas Card */}
        <div
          onClick={() => setActiveTab('keuangan')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Saldo Kas OSIS</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
            {formatRupiah(saldoKas)}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="text-emerald-600 flex items-center gap-0.5 font-medium">
              <ArrowDownLeft className="w-3 h-3" /> {formatRupiah(totalKasMasuk)}
            </span>
            <span className="text-rose-600 flex items-center gap-0.5 font-medium">
              <ArrowUpRight className="w-3 h-3" /> {formatRupiah(totalKasKeluar)}
            </span>
          </div>
        </div>

        {/* Proker Card */}
        <div
          onClick={() => setActiveTab('proker')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Program Kerja Tahunan</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
            {proker.length} <span className="text-xs font-normal text-slate-500">Program</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="text-emerald-700 font-medium">{prokerSelesaiCount} Tuntas</span>
            <span>·</span>
            <span className="text-amber-700 font-medium">{prokerBerjalanCount} Berjalan</span>
            <span>·</span>
            <span className="text-slate-500">{proker.length - prokerSelesaiCount - prokerBerjalanCount} Terencana</span>
          </div>
        </div>

        {/* Pengurus Card */}
        <div
          onClick={() => setActiveTab('pengurus')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Pengurus & KTA Aktif</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
            {pengurus.length} <span className="text-xs font-normal text-slate-500">Siswa Dilantik</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>10 Seksi Bidang</span>
            <span className="text-blue-600 font-medium">Semua KTA Siap Cetak →</span>
          </div>
        </div>

        {/* Dokumen & Aspirasi Card */}
        <div
          onClick={() => setActiveTab('dokumen')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Arsip Surat & Berkas</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">
            {dokumen.length} <span className="text-xs font-normal text-slate-500">Berkas Tersimpan</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">{rapat.length} Notulen Rapat</span>
            <span className="text-amber-600 font-medium">{aspirasiPendingCount} Aspirasi Baru</span>
          </div>
        </div>
      </div>

      {/* Quick Action Dock */}
      <div className="bg-white border border-orange-200/80 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span>Akses Cepat 1 Tahun Jabatan:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('dokumen')}
            className="px-3 py-1.5 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-950 text-xs font-semibold rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-orange-600" />
            Surat Keluar / Masuk
          </button>
          <button
            onClick={() => setActiveTab('proposal')}
            className="px-3 py-1.5 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-950 text-xs font-semibold rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <FileSignature className="w-3.5 h-3.5 text-indigo-600" />
            Buat Proposal / LPJ
          </button>
          <button
            onClick={() => setActiveTab('keuangan')}
            className="px-3 py-1.5 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-950 text-xs font-semibold rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
            Catat Kas Baru
          </button>
          <button
            onClick={() => setActiveTab('inventaris')}
            className="px-3 py-1.5 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-950 text-xs font-semibold rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Package className="w-3.5 h-3.5 text-amber-600" />
            Gudang Logistik ({inventaris.length})
          </button>
          <button
            onClick={() => setActiveTab('ekskul')}
            className="px-3 py-1.5 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-950 text-xs font-semibold rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            Ekskul ({ekskul.length})
          </button>
          <button
            onClick={() => setActiveTab('sekretariat')}
            className="px-3 py-1.5 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-950 text-xs font-semibold rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <ClockIcon className="w-3.5 h-3.5 text-slate-600" />
            Piket & Buku Tamu
          </button>
          <button
            onClick={() => setActiveTab('sertifikat')}
            className="px-3 py-1.5 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-950 text-xs font-semibold rounded-xl transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            Cetak Piagam
          </button>
        </div>
      </div>

      {/* Two Column Layout: Proker Timeline & Recent Cash/Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Agenda Program Kerja 1 Tahun */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Agenda Kerja Terdekat</h2>
              <p className="text-xs text-slate-500">Jadwal pelaksanaan program kerja OSIS periode 1 tahun</p>
            </div>
            <button
              onClick={() => setActiveTab('proker')}
              className="text-xs font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              Lihat Kalender Penuh →
            </button>
          </div>

          <div className="space-y-3">
            {upcomingProker.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">{item.sekbid}</span>
                    <span>·</span>
                    <span>{formatDateIndo(item.tanggalMulai)}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 leading-snug">{item.namaProker}</h3>
                  <div className="text-[11px] text-slate-500">
                    PJ: <span className="font-medium text-slate-700">{item.penanggungJawab}</span> · Tempat:{' '}
                    <span className="font-medium text-slate-700">{item.tempat}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                      item.status === 'Selesai'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'Sedang Berjalan'
                        ? 'bg-blue-100 text-blue-800'
                        : item.status === 'Disetujui Pembina'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-800 tabular-nums">
                    {formatRupiah(item.anggaranBiaya)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Kas Terbaru & Aspirasi Siswa */}
        <div className="space-y-6">
          {/* Kas Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Arus Kas Terkini</h2>
              <button
                onClick={() => setActiveTab('keuangan')}
                className="text-xs font-medium text-amber-600 hover:text-amber-700"
              >
                Buku Kas →
              </button>
            </div>

            <div className="space-y-2.5">
              {recentKas.map((t) => (
                <div key={t.id} className="flex items-start justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                  <div className="overflow-hidden pr-2">
                    <div className="font-medium text-slate-800 truncate">{t.deskripsi}</div>
                    <div className="text-[11px] text-slate-400">
                      {formatDateIndo(t.tanggal)} · {t.kategori}
                    </div>
                  </div>
                  <div
                    className={`font-mono font-semibold tabular-nums shrink-0 ${
                      t.tipe === 'masuk' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {t.tipe === 'masuk' ? '+' : '-'} {formatRupiah(t.jumlah)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Aspirasi Box */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">Suara & Aspirasi Siswa</h2>
              <button
                onClick={() => setActiveTab('aspirasi')}
                className="text-xs font-medium text-amber-600 hover:text-amber-700"
              >
                Kelola ({aspirasi.length}) →
              </button>
            </div>

            <div className="space-y-3">
              {aspirasi.slice(0, 2).map((a) => (
                <div key={a.id} className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">{a.namaSiswa} ({a.kelas})</span>
                    <span className="text-amber-600 font-medium">{a.status}</span>
                  </div>
                  <p className="font-medium text-slate-900 line-clamp-2">{a.judul}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
