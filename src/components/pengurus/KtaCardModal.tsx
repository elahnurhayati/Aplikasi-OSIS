import React, { useRef } from 'react';
import { X, Printer, Download, QrCode } from 'lucide-react';
import { PengurusOsis, SchoolProfile } from '../../types';

interface KtaCardModalProps {
  pengurus: PengurusOsis | null;
  allPengurus?: PengurusOsis[];
  isBulkMode?: boolean;
  school: SchoolProfile;
  onClose: () => void;
}

export const KtaCardModal: React.FC<KtaCardModalProps> = ({
  pengurus,
  allPengurus,
  isBulkMode = false,
  school,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const renderSingleCard = (item: PengurusOsis) => (
    <div
      key={item.id}
      className="w-[340px] h-[520px] bg-gradient-to-b from-slate-950 via-slate-900 to-[#1A2634] text-white rounded-2xl shadow-2xl border-2 border-orange-500/80 p-5 flex flex-col justify-between relative overflow-hidden shrink-0 print-card-page"
      style={{ pageBreakInside: 'avoid' }}
    >
      {/* Decorative background watermark */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
        <img src={school.logoOsisUrl} alt="" className="w-80 h-80 object-contain" />
      </div>

      {/* Top Card Header with Konoha Hitai-ate forehead protector motif */}
      <div className="relative z-10 text-center border-b border-orange-500/40 pb-2.5">
        <div className="mx-auto max-w-[190px] bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 text-slate-800 rounded py-0.5 px-2 border border-slate-400 shadow-inner flex items-center justify-between mb-1.5 text-[8.5px] font-black tracking-widest uppercase">
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span>KONOHAGAKURE 🍃</span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-0.5">
          <img
            src={school.logoOsisUrl}
            alt="Logo OSIS"
            className="w-7 h-7 object-contain"
          />
          <div className="text-left">
            <div className="text-[9px] font-black text-amber-400 tracking-wider uppercase leading-none">
              KARTU TANDA PENGURUS SHINOBI
            </div>
            <div className="text-[12px] font-extrabold text-white truncate max-w-[210px]">
              {school.namaSekolah}
            </div>
          </div>
        </div>
        <div className="text-[8.5px] text-orange-200/80 font-bold tracking-wide">
          {school.namaKabinet} · {school.masaBakti}
        </div>
      </div>

      {/* Photo and Badges */}
      <div className="relative z-10 flex flex-col items-center my-auto py-1">
        <div className="w-28 h-36 rounded-xl border-2 border-orange-500 overflow-hidden bg-slate-800 shadow-xl mb-2.5 shrink-0 relative">
          <img
            src={item.fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
            alt={item.nama}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
            }}
          />
          <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-xs text-[8px] font-mono text-amber-400 px-1 py-0.5 rounded font-bold">
            RANK-A
          </div>
        </div>

        <h3 className="text-sm font-black text-white text-center tracking-tight leading-tight px-2">
          {item.nama}
        </h3>
        <div className="text-[11px] font-mono text-amber-400 font-bold tracking-wider mt-0.5">
          NISN: {item.nisn}
        </div>
        <div className="mt-1 px-3 py-0.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10.5px] font-black rounded-full tracking-wide uppercase shadow-md shadow-orange-500/30">
          {item.jabatan}
        </div>
        <div className="text-[10px] text-slate-300 text-center max-w-[260px] truncate mt-1">
          {item.sekbid}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          Kelas: <span className="text-white font-bold">{item.kelas}</span>
        </div>
      </div>

      {/* Card Footer: Signature & QR Barcode */}
      <div className="relative z-10 border-t border-slate-700/80 pt-2 flex items-center justify-between text-[9px] text-slate-300">
        <div className="space-y-0.5">
          <div className="text-[8px] text-slate-400">Ditetapkan di {school.kota}</div>
          <div className="font-bold text-white">Pembina OSIS/OSIM</div>
          <div className="h-3" />
          <div className="font-bold underline text-amber-300">{school.pembinaOsis}</div>
        </div>

        <div className="flex flex-col items-center gap-0.5">
          <div className="w-10 h-10 bg-white p-1 rounded-md text-slate-900 flex items-center justify-center shadow-xs">
            <QrCode className="w-8 h-8" />
          </div>
          <span className="font-mono text-[7.5px] tracking-widest text-orange-400 font-bold">KONOHA-VERIFIED</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 no-print">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isBulkMode ? 'Cetak Kartu Tanda Anggota (KTA) Massal' : `KTA Pengurus: ${pengurus?.nama}`}
            </h2>
            <p className="text-xs text-slate-500">
              Format Kartu Resmi OSIS Siap Print & Simpan PDF
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              Cetak / Simpan PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Printable Canvas */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-100 flex flex-wrap items-center justify-center gap-6" ref={printRef}>
          {isBulkMode && allPengurus ? (
            allPengurus.map((item) => renderSingleCard(item))
          ) : pengurus ? (
            renderSingleCard(pengurus)
          ) : null}
        </div>

        {/* Modal Footer Note */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white text-xs text-slate-500 flex items-center justify-between no-print">
          <span>Tips: Pada dialog print browser, pilih orientasi Portrait dan set margins ke "None" atau "Minimum".</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-300"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
