import { useRef } from "react";
import { InstitutionLogo } from "./InstitutionLogo";
import { QueueTicket as QueueTicketType, ThemeMode, getInitialState } from "@/lib/queueStore";
import { themes } from "@/lib/themes";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Barcode from "react-barcode";
import { Button } from "./ui/button";
import { Printer } from "lucide-react";
import { ThemeTicketDecoration, IslamicPattern, BatikPattern } from "./ThemeElements";

interface QueueTicketProps {
  ticket: QueueTicketType;
  onPrint?: () => void;
  themeId?: ThemeMode;
}

export const QueueTicket = ({ ticket, onPrint, themeId }: QueueTicketProps) => {
  const ticketRef = useRef<HTMLDivElement>(null);
  const currentThemeId = themeId || getInitialState().config.theme || 'DEFAULT';
  const theme = themes[currentThemeId];

  const handlePrint = () => {
    if (ticketRef.current) {
      const printContent = ticketRef.current.innerHTML;
      const printWindow = window.open('', '', 'width=302,height=500');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Tiket Antrian</title>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                  font-family: 'Inter', sans-serif; 
                  width: 80mm; 
                  padding: 4mm;
                  background: white;
                }
                .ticket { text-align: center; position: relative; }
                .header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
                .logo { width: 40px; height: 40px; }
                .institution { text-align: left; }
                .institution-name { font-size: 9px; font-weight: 700; line-height: 1.2; }
                .branch { font-size: 8px; font-weight: 500; }
                .datetime { font-size: 10px; margin: 8px 0; color: #666; }
                .title { font-size: 12px; font-weight: 600; margin: 8px 0; }
                .number { font-family: 'JetBrains Mono', monospace; font-size: 56px; font-weight: 700; letter-spacing: 4px; margin: 8px 0; }
                .barcode { margin: 8px 0; }
                .barcode svg { width: 100%; max-width: 180px; height: 40px; }
                .service { font-size: 11px; font-weight: 600; margin: 8px 0; letter-spacing: 1px; }
                .thanks { font-size: 9px; font-style: italic; color: #888; margin-top: 8px; }
                .divider { border-top: 1px dashed #ccc; margin: 8px 0; }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
    onPrint?.();
  };

  const getTicketBackground = () => {
    switch (currentThemeId) {
      case 'LEBARAN': return 'bg-emerald-950';
      case 'NATAL': return 'bg-emerald-900';
      case 'TAHUN_BARU': return 'bg-slate-900';
      case 'NASIONAL': return 'bg-white';
      case 'IMLEK': return 'bg-red-700';
      default: return 'bg-card';
    }
  };

  const getTextColor = () => {
    return currentThemeId === 'NASIONAL' ? 'text-black' : 'text-white';
  };

  const getMutedTextColor = () => {
    return currentThemeId === 'NASIONAL' ? 'text-gray-500' : 'text-white/60';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={ticketRef}
        className={`${getTicketBackground()} ${getTextColor()} p-4 rounded-lg shadow-elevated w-[302px] ticket relative overflow-hidden transition-all duration-500`}
        style={{
          fontFamily: "'Inter', sans-serif",
          border: currentThemeId === 'LEBARAN' ? `2px solid ${theme.colors.primary}` : undefined
        }}
      >
        {/* Background Patterns */}
        {currentThemeId === 'LEBARAN' && (
          <IslamicPattern className="absolute inset-0 opacity-[0.05] text-[#FFD700]" />
        )}
        {currentThemeId === 'NASIONAL' && (
          <BatikPattern className="absolute inset-0 opacity-[0.03] text-red-900" />
        )}

        {/* Corner Decorations */}
        <ThemeTicketDecoration theme={currentThemeId} position="top-right" />
        <ThemeTicketDecoration theme={currentThemeId} position="bottom-left" />

        {/* Header with logo and institution name */}
        <div className="header flex items-center gap-3 mb-3 relative z-10">
          <div className="logo w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none">
              <path d="M50 5 L85 25 L85 60 Q85 85 50 95 Q15 85 15 60 L15 25 Z" fill="hsl(213 55% 18%)" stroke="hsl(43 75% 40%)" strokeWidth="2" />
              <path d="M50 20 L53 30 L64 30 L55 37 L59 48 L50 41 L41 48 L45 37 L36 30 L47 30 Z" fill="hsl(43 70% 50%)" />
              <rect x="35" y="52" width="30" height="28" fill="hsl(43 70% 50%)" rx="2" />
              <rect x="40" y="57" width="6" height="8" fill="hsl(213 55% 18%)" rx="1" />
              <rect x="54" y="57" width="6" height="8" fill="hsl(213 55% 18%)" rx="1" />
              <rect x="45" y="68" width="10" height="12" fill="hsl(213 55% 18%)" rx="1" />
              <path d="M30 54 L50 40 L70 54" stroke="hsl(43 70% 50%)" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <div className="institution text-left flex-1">
            <div className={`institution-name text-[10px] font-bold leading-tight ${getTextColor()}`}>
              KEMENTERIAN IMIGRASI
            </div>
            <div className={`institution-name text-[10px] font-bold leading-tight ${getTextColor()}`}>
              DAN PEMASYARAKATAN
            </div>
            <div className={`branch text-[9px] font-medium ${getMutedTextColor()} mt-0.5`}>
              RUTAN KELAS I DEPOK
            </div>
          </div>
        </div>

        {/* Date and Time */}
        <div className={`datetime text-xs ${getMutedTextColor()} mb-2 relative z-10`}>
          {format(ticket.createdAt, "EEEE, dd MMMM yyyy", { locale: id })}
          <br />
          {format(ticket.createdAt, "HH:mm:ss")} WIB
        </div>

        <div className={`divider border-t border-dashed ${currentThemeId === 'NASIONAL' ? 'border-gray-200' : 'border-white/10'} my-3 relative z-10`} />

        {/* Queue Number Title */}
        <div className={`title text-sm font-semibold ${getTextColor()} relative z-10`}>
          Nomor Antrian
        </div>

        {/* Queue Number */}
        <div
          className="number font-mono text-6xl font-bold tracking-[4px] my-2 relative z-10"
          style={{ color: currentThemeId === 'NASIONAL' ? '#ef4444' : theme.colors.primary }}
        >
          {ticket.formattedNumber}
        </div>

        {/* Barcode */}
        <div className="barcode flex justify-center my-3 relative z-10 invert brightness-200 contrast-200 opacity-80">
          <Barcode
            value={ticket.id}
            width={1.5}
            height={40}
            displayValue={false}
            background="transparent"
            lineColor={currentThemeId === 'NASIONAL' ? '#000000' : '#FFFFFF'}
          />
        </div>

        <div className={`divider border-t border-dashed ${currentThemeId === 'NASIONAL' ? 'border-gray-200' : 'border-white/10'} my-3 relative z-10`} />

        {/* Service Type */}
        <div
          className="service text-xs font-semibold tracking-wider relative z-10"
          style={{ color: currentThemeId === 'NASIONAL' ? '#ef4444' : theme.colors.primary }}
        >
          {ticket.serviceType === 'A' ? 'LAYANAN KUNJUNGAN' : 'INFORMASI & PENGADUAN'}
        </div>

        {/* Thanks message */}
        <div className={`thanks text-[10px] italic ${getMutedTextColor()} mt-2 relative z-10`}>
          ~Terimakasih Telah Menunggu~
        </div>
      </div>

      <Button
        onClick={handlePrint}
        className="no-print bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        style={{ backgroundColor: theme.colors.primary }}
      >
        <Printer className="w-4 h-4" />
        Cetak Tiket
      </Button>
    </div>
  );
};
