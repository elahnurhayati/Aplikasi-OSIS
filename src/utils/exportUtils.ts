/**
 * Utility functions for exporting data to CSV, downloading files,
 * and handling base64 uploads.
 */

export const downloadFile = (content: string | Blob, fileName: string, contentType: string) => {
  const blob = content instanceof Blob ? content : new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (headers: string[], rows: (string | number)[][], fileName: string) => {
  const escapeCell = (cell: string | number) => {
    const str = String(cell ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(',')),
  ].join('\r\n');

  downloadFile(`\uFEFF${csvContent}`, fileName, 'text/csv;charset=utf-8;');
};

export const exportToCsv = (data: Record<string, any>[], fileName: string) => {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((item) => headers.map((header) => item[header]));
  exportToCSV(headers, rows, fileName.endsWith('.csv') ? fileName : `${fileName}.csv`);
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDateIndo = (dateStr: string): string => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
};

export const angkaKeTerbilang = (n: number): string => {
  const bilangan = [
    '',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas',
  ];

  const num = Math.floor(Math.abs(n));
  if (num === 0) return 'Nol Rupiah';

  const sebut = (x: number): string => {
    if (x < 12) return bilangan[x];
    if (x < 20) return `${sebut(x - 10)} Belas`;
    if (x < 100) return `${sebut(Math.floor(x / 10))} Puluh ${sebut(x % 10)}`.trim();
    if (x < 200) return `Seratus ${sebut(x - 100)}`.trim();
    if (x < 1000) return `${sebut(Math.floor(x / 100))} Ratus ${sebut(x % 100)}`.trim();
    if (x < 2000) return `Seribu ${sebut(x - 1000)}`.trim();
    if (x < 1000000) return `${sebut(Math.floor(x / 1000))} Ribu ${sebut(x % 1000)}`.trim();
    if (x < 1000000000) return `${sebut(Math.floor(x / 1000000))} Juta ${sebut(x % 1000000)}`.trim();
    if (x < 1000000000000) return `${sebut(Math.floor(x / 1000000000))} Miliar ${sebut(x % 1000000000)}`.trim();
    return `${sebut(Math.floor(x / 1000000000000))} Triliun ${sebut(x % 1000000000000)}`.trim();
  };

  const hasil = sebut(num);
  return `${hasil.trim()} Rupiah`;
};

/**
 * Universal safe print utility for documents.
 * Works seamlessly inside browser iframes and desktop/mobile environments,
 * enabling immediate physical printing or "Save as PDF" (Simpan sebagai PDF).
 */
export const printHtmlDocument = (html: string) => {
  if (!html) return;

  // Ensure high quality print rendering with preserved background colors and borders
  const printReadyHtml = html.includes('print-color-adjust')
    ? html
    : html.replace(
        '</head>',
        `<style>
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        </style></head>`
      );

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.zIndex = '-9999';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  try {
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(printReadyHtml);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.warn('Iframe print execution fallback', e);
          const win = window.open('', '_blank');
          if (win) {
            win.document.write(printReadyHtml);
            win.document.close();
            win.print();
          } else {
            window.print();
          }
        }

        setTimeout(() => {
          try {
            document.body.removeChild(iframe);
          } catch {}
        }, 4000);
      }, 500);
      return;
    }
  } catch (err) {
    console.warn('Failed to access iframe document, fallback to window.print', err);
  }

  // Fallback
  try {
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(printReadyHtml);
      win.document.close();
      win.print();
    } else {
      window.print();
    }
  } catch {
    window.print();
  }
};
