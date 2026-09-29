import React, { useState } from 'react';
import {
  School,
  Save,
  Upload,
  Plus,
  Trash2,
  CheckCircle,
  Building2,
  Award,
  Users2,
  BookOpen,
  Lock,
  KeyRound,
  ShieldCheck,
  Flame,
  Sparkles,
} from 'lucide-react';
import { useOsis } from '../../context/OsisContext';
import { SchoolProfile } from '../../types';
import { fileToBase64 } from '../../utils/exportUtils';

export const ProfilSekolahView: React.FC = () => {
  const { schoolProfile, updateSchoolProfile, changePassword, adminUsername } = useOsis();
  const [formData, setFormData] = useState<SchoolProfile>(schoolProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMessage, setPwdMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMessage(null);
    if (newPassword !== confirmPassword) {
      setPwdMessage({ text: 'Konfirmasi password baru tidak cocok!', isError: true });
      return;
    }
    const res = changePassword(oldPassword, newPassword);
    setPwdMessage({ text: res.message, isError: !res.success });
    if (res.success) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logoSekolahUrl' | 'logoOsisUrl') => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        setFormData((prev) => ({ ...prev, [field]: base64 }));
      } catch (err) {
        alert('Gagal memproses file logo.');
      }
    }
  };

  const handleAddMisi = () => {
    setFormData((prev) => ({
      ...prev,
      misi: [...prev.misi, 'Misi baru pengurus OSIS...'],
    }));
  };

  const handleUpdateMisi = (index: number, val: string) => {
    const updated = [...formData.misi];
    updated[index] = val;
    setFormData((prev) => ({ ...prev, misi: updated }));
  };

  const handleDeleteMisi = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      misi: prev.misi.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-[#FFFDF9] p-5 rounded-2xl border border-[#EADBCE] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-[#7B1113] flex items-center gap-2">
            <School className="w-5 h-5 text-[#7B1113]" />
            Pengaturan Nama Madrasah / Sekolah, Logo & Identitas Organisasi
          </h2>
          <p className="text-xs text-[#7A6158] mt-0.5">
            Konfigurasi nama resmi madrasah, logo madrasah & OSIM/OSIS, nama kabinet, serta pejabat penandatangan surat/dokumen
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="px-5 py-2.5 bg-[#7B1113] hover:bg-[#650E10] text-[#FFFDD0] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
        >
          <Save className="w-4 h-4 text-[#FFFDD0]" />
          Simpan Seluruh Pengaturan
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-[#F5ECE1] border border-[#7B1113]/30 rounded-xl text-xs text-[#7B1113] font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#7B1113]" />
          Pengaturan nama madrasah, logo, dan identitas kepengurusan berhasil diperbarui ke seluruh sistem!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identitas Madrasah & Logo */}
        <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#EADBCE] shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-[#7B1113] flex items-center gap-2 border-b border-[#EADBCE] pb-2">
            <Building2 className="w-4 h-4 text-[#7B1113]" />
            1. Pengaturan Nama Madrasah / Sekolah & Logo Resmi
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Madrasah / Sekolah */}
            <div className="p-5 bg-orange-50/50 border-2 border-dashed border-orange-300 rounded-2xl flex flex-col sm:flex-row items-center gap-4 hover:border-orange-500 transition-colors">
              <div className="w-20 h-20 rounded-2xl bg-white border border-orange-200 p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                <img
                  src={formData.logoSekolahUrl}
                  alt="Logo Madrasah / Sekolah"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1.5 text-center sm:text-left flex-1">
                <div className="text-xs font-black text-slate-900">Logo Resmi Madrasah / Sekolah</div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Dipasang pada Kop Surat, lembar pengesahan proposal & LPJ, dan dokumen resmi.
                </p>
                <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 px-3.5 py-1.5 rounded-xl shadow-xs transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih Logo dari HP / Komputer</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLogoUpload(e, 'logoSekolahUrl')}
                    className="hidden"
                  />
                </label>
                <div className="text-[10px] text-slate-400">
                  Langsung pilih file gambar tanpa perlu link internet.
                </div>
              </div>
            </div>

            {/* Logo OSIS / OSIM */}
            <div className="p-5 bg-orange-50/50 border-2 border-dashed border-orange-300 rounded-2xl flex flex-col sm:flex-row items-center gap-4 hover:border-orange-500 transition-colors">
              <div className="w-20 h-20 rounded-2xl bg-white border border-orange-200 p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                <img
                  src={formData.logoOsisUrl}
                  alt="Logo OSIS / OSIM"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1.5 text-center sm:text-left flex-1">
                <div className="text-xs font-black text-slate-900">Logo Resmi OSIS / OSIM</div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Dipasang pada Kop Surat, Kartu KTA Shinobi, dan Piagam Sertifikat siswa.
                </p>
                <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 px-3.5 py-1.5 rounded-xl shadow-xs transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih Logo OSIS dari HP / Komputer</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLogoUpload(e, 'logoOsisUrl')}
                    className="hidden"
                  />
                </label>
                <div className="text-[10px] text-slate-400">
                  Langsung pilih file gambar tanpa perlu link internet.
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-[#3D1416] mb-1">
                Nama Resmi Madrasah / Sekolah *
              </label>
              <input
                type="text"
                required
                value={formData.namaSekolah}
                onChange={(e) => setFormData({ ...formData, namaSekolah: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#D9C7B6] rounded-xl font-bold text-[#7B1113] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7B1113]"
                placeholder="Contoh: MAN 1 Teladan / MAS Al-Hikmah / SMA Negeri 1..."
              />
            </div>
            <div>
              <label className="block font-bold text-[#3D1416] mb-1">NSM / NPSN & Akreditasi</label>
              <input
                type="text"
                value={formData.npsn}
                onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#D9C7B6] rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#7B1113]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kota / Kabupaten</label>
              <input
                type="text"
                value={formData.kota}
                onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Telepon Sekolah</label>
              <input
                type="text"
                value={formData.telepon}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Resmi</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Website Sekolah</label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Masa Bakti & Kabinet */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Award className="w-4 h-4 text-amber-600" />
            2. Identitas 1 Tahun Masa Bakti & Nama Kabinet
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Masa Bakti Jabatan</label>
              <input
                type="text"
                required
                value={formData.masaBakti}
                onChange={(e) => setFormData({ ...formData, masaBakti: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                placeholder="2026/2027"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Nama Kabinet OSIS</label>
              <input
                type="text"
                required
                value={formData.namaKabinet}
                onChange={(e) => setFormData({ ...formData, namaKabinet: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
                placeholder="KABINET ADHIGANA NAWASENA"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">Motto / Slogan Kabinet</label>
            <input
              type="text"
              value={formData.mottoKabinet}
              onChange={(e) => setFormData({ ...formData, mottoKabinet: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg italic"
              placeholder="Satu Tekad, Nyata Bergerak, Mengukir Jejak Prestasi Masa Depan"
            />
          </div>
        </div>

        {/* Pejabat Penandatangan Dokumen */}
        <div className="bg-[#FFFDF9] p-6 rounded-2xl border border-[#EADBCE] shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-[#7B1113] flex items-center gap-2 border-b border-[#EADBCE] pb-2">
            <Users2 className="w-4 h-4 text-[#7B1113]" />
            3. Pejabat Pengesah Dokumen (Surat, Proposal, Sertifikat, KTA)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#3D1416] mb-1">Nama Kepala Madrasah / Sekolah</label>
              <input
                type="text"
                value={formData.kepalaSekolah}
                onChange={(e) => setFormData({ ...formData, kepalaSekolah: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#D9C7B6] rounded-xl font-semibold text-[#3D1416]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#3D1416] mb-1">NIP Kepala Madrasah / Sekolah</label>
              <input
                type="text"
                value={formData.nipKepalaSekolah}
                onChange={(e) => setFormData({ ...formData, nipKepalaSekolah: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#D9C7B6] rounded-xl font-mono text-[#3D1416]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#3D1416] mb-1">Nama Pembina OSIS / OSIM</label>
              <input
                type="text"
                value={formData.pembinaOsis}
                onChange={(e) => setFormData({ ...formData, pembinaOsis: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#D9C7B6] rounded-xl font-semibold text-[#3D1416]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#3D1416] mb-1">NIP Pembina OSIS / OSIM</label>
              <input
                type="text"
                value={formData.nipPembinaOsis}
                onChange={(e) => setFormData({ ...formData, nipPembinaOsis: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#D9C7B6] rounded-xl font-mono text-[#3D1416]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#3D1416] mb-1">Nama Ketua Umum OSIS / OSIM</label>
              <input
                type="text"
                value={formData.ketuaOsis}
                onChange={(e) => setFormData({ ...formData, ketuaOsis: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#D9C7B6] rounded-xl font-semibold text-[#3D1416]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#3D1416] mb-1">NISN Ketua Umum</label>
              <input
                type="text"
                value={formData.nisnKetuaOsis}
                onChange={(e) => setFormData({ ...formData, nisnKetuaOsis: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF6F0] border border-[#D9C7B6] rounded-xl font-mono text-[#3D1416]"
              />
            </div>
          </div>
        </div>

        {/* Visi & Misi */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <BookOpen className="w-4 h-4 text-amber-600" />
            4. Visi & Misi OSIS 1 Tahun
          </h3>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">Visi Organisasi</label>
            <textarea
              rows={3}
              value={formData.visi}
              onChange={(e) => setFormData({ ...formData, visi: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg leading-relaxed"
            />
          </div>

          <div className="text-xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">Misi Organisasi ({formData.misi.length} Butir)</label>
              <button
                type="button"
                onClick={handleAddMisi}
                className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Butir Misi
              </button>
            </div>

            {formData.misi.map((m, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-5 text-slate-400 font-bold text-center">{idx + 1}.</span>
                <input
                  type="text"
                  value={m}
                  onChange={(e) => handleUpdateMisi(idx, e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteMisi(idx)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                  title="Hapus Misi"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md shadow-orange-500/20 cursor-pointer"
          >
            <Save className="w-4 h-4 text-white" />
            Simpan Perubahan Data Lembaga & Profil
          </button>
        </div>
      </form>

      {/* 5. KEAMANAN & PENGATURAN PASSWORD LOGIN ADMIN */}
      <div className="bg-white p-6 rounded-2xl border border-orange-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-orange-100 pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-600" />
            <h3 className="text-sm font-bold text-slate-900">
              5. Keamanan & Pengaturan Password Login Administrator
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-orange-100 text-orange-800 border border-orange-200">
            Username: {adminUsername}
          </span>
        </div>

        <p className="text-xs text-slate-500">
          Ubah kata sandi login admin untuk mengamankan data dan arsip OSIS madrasah selama 1 tahun masa bakti. Kredensial mula-mula sistem adalah <strong className="font-mono text-slate-700">User: Admin</strong> dan <strong className="font-mono text-slate-700">Password: Admin123</strong>.
        </p>

        {pwdMessage && (
          <div
            className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
              pwdMessage.isError
                ? 'bg-rose-50 border border-rose-200 text-rose-700'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{pwdMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePasswordSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Password Saat Ini</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Masukkan password lama"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password Baru</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Minimal 4 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Ulangi Password Baru</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Ketik ulang password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors whitespace-nowrap shadow-xs cursor-pointer shrink-0"
              >
                Ubah Password
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 6. INFORMASI PENGEMBANG APLIKASI (HAK CIPTA & KARYA) */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 text-amber-200 text-xs font-black tracking-wide uppercase border border-white/20">
              <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
              <span>Semangat Api (Hi no Ishi) 🍃</span>
            </div>
            <h3 className="text-xl font-black tracking-tight">
              Sistem Manajemen OSIS 360 Terlengkap 1 Tahun
            </h3>
            <p className="text-xs text-orange-100 max-w-xl leading-relaxed">
              Aplikasi ini dirancang secara menyeluruh untuk mencakup seluruh kebutuhan operasional organisasi siswa dan madrasah selama 365 hari masa bakti: Surat-menyurat resmi, Proposal, LPJ, Keuangan Kas, Notulensi Rapat, Inventaris Sarana, Koordinasi Ekskul, Bilik Suara Pemilos, hingga Sertifikasi dan Piagam.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-4 text-center shrink-0 w-full md:w-auto">
            <div className="text-[11px] font-bold text-orange-200 uppercase tracking-widest">
              Aplikasi Ciptaan & Karya Asli
            </div>
            <div className="text-lg font-black text-white mt-0.5">
              Nandi Achdarizal Sutisna
            </div>
            <div className="text-[10px] text-amber-200 font-semibold mt-1">
              Hak Cipta Terlindungi · Edisi Shinobi 1 Tahun Penuh
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
