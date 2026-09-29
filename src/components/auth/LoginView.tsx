import React, { useState } from 'react';
import { Lock, User, KeyRound, ShieldAlert, ArrowRight, Flame, ScrollText } from 'lucide-react';
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
      setErrorMsg('Kredensial Shinobi tidak cocok. Silakan periksa kembali!');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] relative flex items-center justify-center p-4 selection:bg-[#F97316] selection:text-white overflow-hidden">
      {/* Anime / Naruto Energy Chakra Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#F97316]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#EA580C]/25 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0284C7]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Naruto Shinobi Card */}
        <div className="bg-[#1E293B] rounded-3xl border-2 border-[#F97316]/60 shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Top Banner: Naruto Konoha Fire Header */}
          <div className="bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#C2410C] text-white p-7 text-center relative overflow-hidden">
            {/* Konoha Headband Plate Metallic Simulation */}
            <div className="mx-auto max-w-[220px] bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 text-slate-800 rounded-lg py-1 px-3 border border-slate-400 shadow-inner flex items-center justify-between mb-3 text-[10px] font-black tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              <span>KONOHAGAKURE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            </div>

            <div className="w-20 h-20 mx-auto mb-2 rounded-2xl bg-white/10 border-2 border-white/40 p-1.5 backdrop-blur-xs flex items-center justify-center shadow-lg">
              <img
                src={schoolProfile.logoOsisUrl}
                alt="Lambang Konoha OSIS"
                className="w-full h-full object-contain"
              />
            </div>

            <h1 className="text-xl font-black tracking-tight text-white flex items-center justify-center gap-1.5">
              <span>OSIS KONOHA 360</span>
              <Flame className="w-5 h-5 text-amber-300 fill-amber-300 animate-bounce" />
            </h1>
            <p className="text-xs text-orange-100 font-medium mt-0.5 truncate max-w-xs mx-auto">
              {schoolProfile.namaSekolah}
            </p>
            <div className="mt-2 inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-black/25 text-amber-200 text-[10px] font-bold tracking-wider uppercase border border-white/20">
              <span>Semangat Api (Hi no Ishi)</span>
              <span>·</span>
              <span>{schoolProfile.masaBakti}</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-7 space-y-5 bg-[#0F172A]/90">
            <div className="text-center space-y-1">
              <h2 className="text-base font-extrabold text-white flex items-center justify-center gap-1.5">
                <ScrollText className="w-4 h-4 text-[#F97316]" />
                Portal Masuk Dewan Shinobi
              </h2>
              <p className="text-xs text-slate-400">
                Akses panel kendali administrasi 1 tahun kepengurusan
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/60 rounded-xl flex items-center gap-2 text-xs text-rose-200 font-medium">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-200 mb-1.5">
                  User
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-orange-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-colors"
                    placeholder="Masukkan nama user"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1.5">
                  User P (Password)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-orange-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2.5 bg-[#1E293B] border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-[#F97316] transition-colors"
                    placeholder="Masukkan password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-amber-400"
                  >
                    {showPassword ? 'Tutup' : 'Lihat'}
                  </button>
                </div>
              </div>

              {/* Default Account Hint Box */}
              <div className="p-3 bg-[#1E293B] border border-[#F97316]/30 rounded-xl text-[11px] text-slate-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-400">
                  <Lock className="w-3.5 h-3.5 text-[#F97316]" /> Kredensial Awal Akun:
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>User : <strong className="text-white font-mono bg-black/30 px-1.5 py-0.5 rounded">Admin</strong></span>
                  <span>User P : <strong className="text-white font-mono bg-black/30 px-1.5 py-0.5 rounded">Admin123</strong></span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#EA580C] to-[#F97316] hover:from-[#C2410C] hover:to-[#EA580C] text-white font-extrabold rounded-xl transition-all shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Buka Segel & Masuk</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Footer note */}
          <div className="px-7 py-3 bg-[#0B1120] border-t border-slate-800 text-center text-[11px] text-slate-400 space-y-0.5">
            <div>"Pantang Menyerah, Itulah Jalan Ninjaku!" · OSIS Shinobi Edition</div>
            <div className="text-[10.5px] text-orange-400 font-semibold">
              Aplikasi Ciptaan: <strong>Nandi Achdarizal Sutisna</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
