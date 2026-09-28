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
} from 'lucide-react';
import { useOsis } from '../../context/OsisContext';
import { SchoolProfile } from '../../types';
import { fileToBase64 } from '../../utils/exportUtils';

export const ProfilSekolahView: React.FC = () => {
  const { schoolProfile, updateSchoolProfile } = useOsis();
  const [formData, setFormData] = useState<SchoolProfile>(schoolProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);

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
            <div className="p-4 bg-[#FAF6F0] border border-[#E5D5C3] rounded-2xl flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white border border-[#D9C7B6] p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                <img
                  src={formData.logoSekolahUrl}
                  alt="Logo Madrasah / Sekolah"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#3D1416]">Logo Resmi Madrasah / Sekolah</div>
                <p className="text-[11px] text-[#7A6158]">
                  Logo instansi pada Kop Surat, lembar pengesahan proposal, dan dokumen resmi.
                </p>
                <label className="cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold text-[#7B1113] bg-white border border-[#D9C7B6] px-3 py-1 rounded-lg hover:bg-[#F5ECE1] shadow-2xs">
                  <Upload className="w-3 h-3" />
                  Ganti Logo Madrasah
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLogoUpload(e, 'logoSekolahUrl')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Logo OSIS / OSIM */}
            <div className="p-4 bg-[#FAF6F0] border border-[#E5D5C3] rounded-2xl flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white border border-[#D9C7B6] p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                <img
                  src={formData.logoOsisUrl}
                  alt="Logo OSIS / OSIM"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#3D1416]">Logo Resmi OSIS / OSIM</div>
                <p className="text-[11px] text-[#7A6158]">
                  Digunakan pada Kop Surat, Kartu KTA, dan Piagam Sertifikat siswa.
                </p>
                <label className="cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold text-[#7B1113] bg-white border border-[#D9C7B6] px-3 py-1 rounded-lg hover:bg-[#F5ECE1] shadow-2xs">
                  <Upload className="w-3 h-3" />
                  Ganti Logo OSIS/OSIM
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLogoUpload(e, 'logoOsisUrl')}
                    className="hidden"
                  />
                </label>
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
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-xs"
          >
            <Save className="w-4 h-4 text-amber-400" />
            Simpan Perubahan Data Lembaga
          </button>
        </div>
      </form>
    </div>
  );
};
