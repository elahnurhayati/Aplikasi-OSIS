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
      className="w-[340px] h-[520px] bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl shadow-xl border-2 border-amber-400/60 p-5 flex flex-col justify-between relative overflow-hidden shrink-0 print-card-page"
      style={{ pageBreakInside: 'avoid' }}
    >
      {/* Decorative background watermark */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
        <img src={school.logoOsisUrl} alt="" className="w-80 h-80 object-contain" />
      </div>

      {/* Top Card Header */}
      <div className="relative z-10 text-center border-b border-amber-400/40 pb-3">
        <div className="flex items-center justify-center gap-2 mb-1">
          <img
            src={school.logoOsisUrl}
            alt="Logo OSIS"
            className="w-8 h-8 object-contain"
          />
          <div className="text-left">
            <div className="text-[10px] font-bold text-amber-300 tracking-wider uppercase leading-none">
              KARTU TANDA ANGGOTA OSIS
            </div>
            <div className="text-[12px] font-extrabold text-white truncate max-w-[220px]">
              {school.namaSekolah}
            </div>
          </div>
        </div>
        <div className="text-[9px] text-slate-300 font-medium tracking-wide">
          {school.namaKabinet} · MASA BAKTI {school.masaBakti}
        </div>
      </div>

      {/* Photo and Badges */}
      <div className="relative z-10 flex flex-col items-center my-auto py-2">
        <div className="w-28 h-36 rounded-xl border-2 border-amber-400 overflow-hidden bg-slate-800 shadow-md mb-3 shrink-0">
          <img
            src={item.fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
            alt={item.nama}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
            }}
          />
        </div>

        <h3 className="text-sm font-bold text-white text-center tracking-tight leading-tight px-2">
          {item.nama}
        </h3>
        <div className="text-[11px] font-mono text-amber-300 font-semibold tracking-wider mt-0.5">
          NISN: {item.nisn}
        </div>
        <div className="mt-1 px-3 py-0.5 bg-amber-400 text-slate-950 text-[11px] font-extrabold rounded-full tracking-wide uppercase">
          {item.jabatan}
        </div>
        <div className="text-[10px] text-slate-300 text-center max-w-[260px] truncate mt-1">
          {item.sekbid}
        </div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          Kelas: <span className="text-white font-medium">{item.kelas}</span>
        </div>
      </div>

      {/* Card Footer: Signature & QR Barcode */}
      <div className="relative z-10 border-t border-slate-700/80 pt-2 flex items-center justify-between text-[9px] text-slate-300">
        <div className="space-y-0.5">
          <div className="text-[8px] text-slate-400">Ditetapkan di {school.kota}</div>
          <div className="font-semibold text-white">Pembina OSIS</div>
          <div className="h-4" />
          <div className="font-medium underline text-amber-300">{school.pembinaOsis}</div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="w-10 h-10 bg-white p-1 rounded-md text-slate-900 flex items-center justify-center">
            <QrCode className="w-8 h-8" />
          </div>
          <span className="font-mono text-[8px] tracking-widest text-slate-400">RESMI-OSIS</span>
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
