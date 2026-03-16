import { useState, useEffect, useCallback, useRef } from "react";
import { InstitutionLogo } from "@/components/InstitutionLogo";
import { Button } from "@/components/ui/button";
import {
  takeNumber,
  getWaitingCount,
  subscribeToChanges,
  getInitialState,
  ServiceType,
  QueueMode,
  ThemeMode,
} from "@/lib/queueStore";
import { printTicketDirectly } from "@/lib/printTicket";
import { UserPlus, MessageCircleQuestion, Users } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ThemeBackground } from "@/components/ThemeElements";
import { themes } from "@/lib/themes";

const Kiosk = () => {
  const [waitingCountA, setWaitingCountA] = useState(0);
  const [waitingCountB, setWaitingCountB] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mode, setMode] = useState<QueueMode>("SIMPLIFIED");
  const [currentThemeId, setCurrentThemeId] = useState<ThemeMode>("DEFAULT");

  const lastPress = useRef(0);

  const throttle = (delay: number) => {
    const now = Date.now();
    if (now - lastPress.current < delay) return false;
    lastPress.current = now;
    return true;
  };

  const handleTakeNumber = useCallback((serviceType: ServiceType) => {
    const ticket = takeNumber(serviceType);
    printTicketDirectly(ticket);
  }, []);

  const handleKeyboard = useCallback(
    (e: KeyboardEvent) => {
      if (!throttle(300)) return;
      if (e.key === "Enter") handleTakeNumber("A");
      if (e.key === "." && mode === "NORMAL") handleTakeNumber("B");
    },
    [handleTakeNumber, mode]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [handleKeyboard]);

  useEffect(() => {
    const state = getInitialState();
    setWaitingCountA(getWaitingCount("A"));
    setWaitingCountB(getWaitingCount("B"));
    setMode(state.config.mode);
    setCurrentThemeId(state.config.theme || "DEFAULT");

    const unsubscribe = subscribeToChanges((state) => {
      setWaitingCountA(
        state.tickets.filter(
          (t) => t.status === "waiting" && t.serviceType === "A"
        ).length
      );
      setWaitingCountB(
        state.tickets.filter(
          (t) => t.status === "waiting" && t.serviceType === "B"
        ).length
      );
      setMode(state.config.mode);
      setCurrentThemeId(state.config.theme || "DEFAULT");
    });

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  const theme = themes[currentThemeId];
  const primaryColor = theme.colors.primary;

  return (
    <div className="min-h-screen text-primary-foreground font-sans selection:bg-gold/30 flex flex-col relative overflow-hidden transition-colors duration-500" style={{ backgroundColor: theme.colors.background }}>
      {/* Background patterns */}
      <ThemeBackground theme={currentThemeId} />

      {/* ================= HEADER ================= */}
      <header className="relative z-10 bg-[#070d19]/60 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <InstitutionLogo className="h-12 sm:h-14 md:h-16 w-auto drop-shadow-lg" />
            <div className="leading-tight text-center md:text-left">
              <h1 className="text-xs sm:text-sm md:text-base font-semibold tracking-wider text-primary-foreground/80 uppercase">
                Kementerian Imigrasi dan Pemasyarakatan
              </h1>
              <h2 className="text-sm sm:text-lg md:text-xl font-bold tracking-wide uppercase mt-0.5" style={{ color: primaryColor }}>
                Rumah Tahanan Negara Kelas 1 Depok
              </h2>
            </div>
          </div>

          <div className="text-center md:text-right border-l-0 md:border-l border-white/10 pl-0 md:pl-6">
            <p className="text-xs sm:text-sm font-medium opacity-60 uppercase tracking-[0.1em] mb-1">
              {format(currentTime, "EEEE, dd MMMM yyyy", { locale: id })}
            </p>
            <p className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold tracking-tighter leading-none shadow-black drop-shadow-md" style={{ color: primaryColor }}>
              {format(currentTime, "HH:mm:ss")}
            </p>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl sm:max-w-4xl lg:max-w-5xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Pilih Layanan Antrian
            </h2>
            <p className="text-base sm:text-lg text-primary-foreground/60 max-w-2xl mx-auto">
              Silakan sentuh tombol di bawah ini sesuai dengan layanan yang Anda butuhkan untuk mencetak tiket antrian.
            </p>
          </div>

          <div className={mode === "NORMAL" ? "grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8" : "flex justify-center"}>
            {/* ##### SERVICE A ##### */}
            <div className={`group relative w-full ${mode === "SIMPLIFIED" ? "max-w-2xl" : ""}`}>
              <div className="absolute -inset-0.5 rounded-3xl blur opacity-20 group-hover:opacity-50 transition duration-500" style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${theme.colors.accent})` }}></div>
              <Button
                onClick={() => handleTakeNumber("A")}
                className="relative w-full h-[60vh] md:h-[50vh] max-h-[400px] bg-[#1e293b]/60 hover:bg-[#1e293b]/80 border backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-6 transition-all duration-300 hover:-translate-y-2 shadow-2xl"
                style={{ borderColor: primaryColor + '40' }}
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}40, ${primaryColor}10)`, borderColor: primaryColor + '40' }}>
                  <UserPlus className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 drop-shadow-md" style={{ color: primaryColor }} />
                </div>
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center leading-tight mb-4 tracking-wide">
                  Pendaftaran<br />Kunjungan
                </span>
                <span className="text-xs sm:text-sm md:text-base font-medium px-4 py-1.5 rounded-full border uppercase tracking-widest shadow-lg"
                  style={{ color: primaryColor, backgroundColor: primaryColor + '15', borderColor: primaryColor + '30' }}>
                  {mode === "NORMAL" ? "Loket 1, 2, 3" : "Loket 1, 2, 3, 4"}
                </span>

                <div className="absolute top-6 left-6 flex items-center gap-2 bg-[#0a1120]/80 border px-4 py-2 rounded-2xl shadow-lg backdrop-blur-md" style={{ borderColor: primaryColor + '20' }}>
                  <Users className="w-5 h-5" style={{ color: primaryColor }} />
                  <span className="text-sm font-semibold text-white">
                    <strong className="text-lg mr-1" style={{ color: primaryColor }}>{waitingCountA}</strong>
                    <span className="opacity-70 font-normal uppercase text-xs tracking-wider">Menunggu</span>
                  </span>
                </div>
              </Button>
            </div>

            {/* ##### SERVICE B ##### */}
            {mode === "NORMAL" && (
              <div className="group relative">
                <div className="absolute -inset-0.5 rounded-3xl blur opacity-20 group-hover:opacity-50 transition duration-500" style={{ background: `linear-gradient(to bottom right, #10b981, #059669)` }}></div>
                <Button
                  onClick={() => handleTakeNumber("B")}
                  className="relative w-full h-[60vh] md:h-[50vh] max-h-[400px] bg-[#1e293b]/60 hover:bg-[#1e293b]/80 border border-emerald-500/30 hover:border-emerald-500/60 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-6 transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:-translate-y-2 shadow-2xl"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                    <MessageCircleQuestion className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-emerald-400 drop-shadow-md" />
                  </div>
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center leading-tight mb-4 tracking-wide">
                    Informasi &<br />Pengaduan
                  </span>
                  <span className="text-xs sm:text-sm md:text-base text-emerald-400 font-medium px-4 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 uppercase tracking-widest shadow-lg">
                    Loket 4
                  </span>

                  <div className="absolute top-6 left-6 flex items-center gap-2 bg-[#0a1120]/80 border border-emerald-500/20 px-4 py-2 rounded-2xl shadow-lg backdrop-blur-md">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-semibold text-white">
                      <strong className="text-emerald-400 text-lg mr-1">{waitingCountB}</strong>
                      <span className="opacity-70 font-normal uppercase text-xs tracking-wider">Menunggu</span>
                    </span>
                  </div>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 bg-[#070d19]/90 border-t border-white/5 px-6 py-4 mt-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-center opacity-50">
          <p className="text-center text-xs md:text-sm text-primary-foreground font-medium uppercase tracking-[0.1em]">
            © {new Date().getFullYear()} Sistem Antrian Digital — Rutan Kelas 1 Depok
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Kiosk;
