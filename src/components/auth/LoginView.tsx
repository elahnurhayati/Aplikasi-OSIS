import React, { useState } from 'react';
import { Lock, User, KeyRound, ShieldAlert, ArrowRight, School, Sparkles } from 'lucide-react';
import { useOsis } from '../../context/OsisContext';

export const LoginView: React.FC = () => {
  const { schoolProfile, login } = useOsis();
  const [username, setUsername] = useState('Admin');
  const [password, setPassword] = useState('Admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const success = login(username, password);
    if (!success) {
      setErrorMsg('Username atau Password salah. Silakan periksa kembali!');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center p-4 selection:bg-[#7B1113] selection:text-[#FFFDD0]">
      {/* Decorative subtle background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#7B1113]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#7B1113]/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Login Card */}
        <div className="bg-[#FFFDF9] rounded-3xl border-2 border-[#EADBCE] shadow-xl overflow-hidden">
          {/* Card Maroon Header */}
          <div className="bg-gradient-to-br from-[#7B1113] via-[#851316] to-[#5A0C0E] text-[#FFFDD0] p-7 text-center relative overflow-hidden">
            {/* Background seal watermark */}
            <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
              <img
                src={schoolProfile.logoOsisUrl}
                alt=""
                className="w-40 h-40 object-contain"
              />
            </div>

            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-[#FFFDD0]/10 border border-[#FFFDD0]/30 p-2 backdrop-blur-xs flex items-center justify-center shadow-md">
              <img
                src={schoolProfile.logoOsisUrl}
                alt="Logo OSIS / OSIM"
                className="w-full h-full object-contain"
              />
            </div>

            <h1 className="text-xl font-extrabold tracking-tight text-[#FFFDD0]">
              OSIS / OSIM 360
            </h1>
            <p className="text-xs text-[#F2D7B3] font-medium mt-1 truncate max-w-xs mx-auto">
              {schoolProfile.namaSekolah}
            </p>
            <div className="mt-2 inline-block px-3 py-0.5 rounded-full bg-[#FFFDD0]/15 text-[#FFFDD0] text-[10px] font-semibold tracking-wider uppercase border border-[#FFFDD0]/20">
              Masa Bakti {schoolProfile.masaBakti}
            </div>
          </div>

          {/* Form Container */}
          <div className="p-7 space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-base font-bold text-[#3D1416]">
                Masuk ke Panel Manajemen
              </h2>
              <p className="text-xs text-[#7A6158]">
                Silakan masukkan kredensial akun administrator
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-[#FDF2F2] border border-[#F5C2C7] rounded-xl flex items-center gap-2 text-xs text-[#842029]">
                <ShieldAlert className="w-4 h-4 shrink-0 text-[#842029]" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#3D1416] mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C6D62] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-[#FAF6F0] border border-[#E0D0C0] rounded-xl text-[#3D1416] font-medium focus:outline-none focus:ring-2 focus:ring-[#7B1113] focus:bg-white transition-colors"
                    placeholder="Masukkan username"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#3D1416] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#8C6D62] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FAF6F0] border border-[#E0D0C0] rounded-xl text-[#3D1416] font-medium focus:outline-none focus:ring-2 focus:ring-[#7B1113] focus:bg-white transition-colors"
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#8C6D62] hover:text-[#7B1113]"
                  >
                    {showPassword ? 'Sembunyi' : 'Lihat'}
                  </button>
                </div>
              </div>

              {/* Default Account Hint Box */}
              <div className="p-3 bg-[#F5ECE1] border border-[#E5D5C3] rounded-xl text-[11px] text-[#5C3D2E] space-y-0.5">
                <div className="font-bold flex items-center gap-1 text-[#7B1113]">
                  <Lock className="w-3 h-3" /> Akun Login Bawaan:
                </div>
                <div>User : <strong className="text-[#3D1416] font-mono">Admin</strong></div>
                <div>User P (Password) : <strong className="text-[#3D1416] font-mono">Admin123</strong></div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#7B1113] hover:bg-[#650E10] text-[#FFFDD0] font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Masuk ke Sistem OSIS 360</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          </div>

          {/* Footer note */}
          <div className="px-7 py-3 bg-[#FAF6F0] border-t border-[#EADBCE] text-center text-[11px] text-[#7A6158]">
            Sistem Tata Kelola 1 Tahun Jabatan Madrasah & Sekolah
          </div>
        </div>
      </div>
    </div>
  );
};
