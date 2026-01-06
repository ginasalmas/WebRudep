import { useState, useEffect, useCallback, useRef } from "react";
import { InstitutionLogo } from "@/components/InstitutionLogo";
import { Button } from "@/components/ui/button";
import {
  takeNumber,
  getWaitingCount,
  subscribeToChanges,
  ServiceType,
} from "@/lib/queueStore";
import { printTicketDirectly } from "@/lib/printTicket";
import { UserPlus, MessageCircleQuestion, Users } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const Kiosk = () => {
  const [waitingCountA, setWaitingCountA] = useState(0);
  const [waitingCountB, setWaitingCountB] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

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
      if (e.key === ".") handleTakeNumber("B");
    },
    [handleTakeNumber]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [handleKeyboard]);

  useEffect(() => {
    setWaitingCountA(getWaitingCount("A"));
    setWaitingCountB(getWaitingCount("B"));

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
    });

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-dark via-navy to-navy-light flex flex-col">
      {/* ================= HEADER ================= */}
      <header className="bg-navy-dark/80 backdrop-blur border-b border-gold/30 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <InstitutionLogo className="h-10 sm:h-12 md:h-14 w-auto" />
            <div className="text-primary-foreground leading-tight">
              <h1 className="text-sm sm:text-base md:text-xl font-bold">
                KEMENTERIAN IMIGRASI DAN PEMASYARAKATAN
              </h1>
              <h2 className="text-gold text-sm sm:text-base md:text-xl font-bold">
                RUMAH TAHANAN NEGARA KELAS 1 DEPOK
              </h2>
            </div>
          </div>

          <div className="text-center md:text-right text-primary-foreground">
            <p className="text-xs sm:text-sm md:text-base">
              {format(currentTime, "EEEE, dd MMMM yyyy", { locale: id })}
            </p>
            <p className="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-gold">
              {format(currentTime, "HH:mm:ss")}
            </p>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-xl sm:max-w-2xl lg:max-w-3xl bg-card/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 lg:p-10 border border-gold/30 shadow-glow">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-foreground">
              PILIH LAYANAN
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-primary-foreground/70 mt-1">
              Silakan pilih layanan dan ambil nomor antrian
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* ===== SERVICE A ===== */}
            <div className="bg-card/10 rounded-xl p-4 sm:p-6 border border-gold/20">
              <Button
                onClick={() => handleTakeNumber("A")}
                className="w-full h-28 sm:h-32 md:h-40 text-sm sm:text-base md:text-xl font-bold bg-gradient-to-br from-gold to-gold-dark hover:from-gold-light hover:to-gold text-navy-dark rounded-xl flex flex-col gap-2 sm:gap-3"
              >
                <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                <span className="text-center leading-tight">
                  LAYANAN<br />PENDAFTARAN<br />KUNJUNGAN
                </span>
              </Button>

              <div className="mt-3 flex items-center justify-center gap-2 text-xs sm:text-sm text-primary-foreground/70">
                <Users className="w-4 h-4" />
                <span>
                  <strong className="text-gold">{waitingCountA}</strong> orang menunggu
                </span>
              </div>
              <p className="text-center text-[10px] sm:text-xs text-primary-foreground/50 mt-1">
                Loket 1, 2, 3
              </p>
            </div>

            {/* ===== SERVICE B ===== */}
            <div className="bg-card/10 rounded-xl p-4 sm:p-6 border border-gold/20">
              <Button
                onClick={() => handleTakeNumber("B")}
                className="w-full h-28 sm:h-32 md:h-40 text-sm sm:text-base md:text-xl font-bold bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white rounded-xl flex flex-col gap-2 sm:gap-3"
              >
                <MessageCircleQuestion className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                <span className="text-center leading-tight">
                  LAYANAN<br />INFORMASI &<br />PENGADUAN
                </span>
              </Button>

              <div className="mt-3 flex items-center justify-center gap-2 text-xs sm:text-sm text-primary-foreground/70">
                <Users className="w-4 h-4" />
                <span>
                  <strong className="text-emerald-400">{waitingCountB}</strong> orang menunggu
                </span>
              </div>
              <p className="text-center text-[10px] sm:text-xs text-primary-foreground/50 mt-1">
                Loket 4
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-navy-dark/50 border-t border-gold/20 px-4 py-3">
        <p className="text-center text-[10px] sm:text-xs md:text-sm text-primary-foreground/50">
          Sistem Antrian Digital - Kementerian Imigrasi dan Pemasyarakatan
        </p>
      </footer>
    </div>
  );
};

export default Kiosk;
