import { useState, useEffect, useRef, useCallback } from "react";
import { InstitutionLogo } from "@/components/InstitutionLogo";
import {
  subscribeToChanges,
  getInitialState,
  QueueTicket,
  CalledByLoket,
  callNext,
  recallCurrent,
  markServed,
  getCalledByLoket,
  resetQueue,
  takeNumber,
  setQueueMode,
  QueueMode,
  ThemeMode
} from "@/lib/queueStore";
import { printTicketDirectly } from "@/lib/printTicket";
import { announceQueue, announceQueueEmpty } from "@/lib/tts";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Users, ChevronRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ThemeBackground } from "@/components/ThemeElements";
import { themes } from "@/lib/themes";
import "@/Themes.css";

const Display = () => {
  const [calledByLoket, setCalledByLoket] = useState<CalledByLoket>({ 1: null, 2: null, 3: null, 4: null });
  const [waitingA, setWaitingA] = useState<QueueTicket[]>([]);
  const [waitingB, setWaitingB] = useState<QueueTicket[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [mode, setMode] = useState<QueueMode>("SIMPLIFIED");
  const [runningText, setRunningTextState] = useState("");
  const [currentThemeId, setCurrentThemeId] = useState<ThemeMode>("DEFAULT");

  const lastPressRef = useRef(0);
  const lastCallPressRef = useRef(0);
  const isAnnouncingRef = useRef(false);
  const lastTicketRef = useRef<{ [key: number]: string }>({ 1: "---", 2: "---", 3: "---", 4: "---" });

  const handleResetConfirm = () => {
    resetQueue();
    lastTicketRef.current = { 1: "---", 2: "---", 3: "---", 4: "---" };
    setCalledByLoket({ 1: null, 2: null, 3: null, 4: null });
    setShowResetDialog(false);
  };

  const handleKeyPress = useCallback(async (e: KeyboardEvent) => {
    const key = e.key;
    const throttle = (delay: number) => {
      const now = Date.now();
      if (now - lastPressRef.current < delay) return false;
      lastPressRef.current = now;
      return true;
    };

    if (key === "Enter" && throttle(1000)) {
      const ticket = takeNumber("A");
      printTicketDirectly(ticket);
      return;
    }

    if (key === "." && throttle(1000) && mode === "NORMAL") {
      const ticket = takeNumber("B");
      printTicketDirectly(ticket);
      return;
    }


    if (key === "0") {
      setShowResetDialog(true);
      return;
    }

    if (key === "*") {
      const state = getInitialState();
      const newMode = state.config.mode === 'NORMAL' ? 'SIMPLIFIED' : 'NORMAL';
      setQueueMode(newMode);
      setMode(newMode);
      return;
    }

    if (["1", "2", "3", "4"].includes(key)) {
      if (isAnnouncingRef.current) return;

      const loket = parseInt(key) as 1 | 2 | 3 | 4;
      const current = getCalledByLoket(loket);
      if (current) markServed(loket);
      const ticket = callNext(loket);

      isAnnouncingRef.current = true;
      try {
        if (ticket) {
          lastTicketRef.current[loket] = ticket.formattedNumber;
          await announceQueue(ticket.formattedNumber, loket);
        } else {
          await announceQueueEmpty();
        }
      } finally {
        isAnnouncingRef.current = false;
      }
    }

    if (["7", "8", "9", "6"].includes(key)) {
      if (isAnnouncingRef.current) return;

      let loket: 1 | 2 | 3 | 4;
      if (key === "6") {
        loket = 4;
      } else {
        loket = (parseInt(key) - 6) as 1 | 2 | 3;
      }

      const ticket = recallCurrent(loket);
      if (ticket) {
        isAnnouncingRef.current = true;
        try {
          await announceQueue(ticket.formattedNumber, loket);
        } finally {
          isAnnouncingRef.current = false;
        }
      }
    }
  }, [mode]);

  useEffect(() => {
    const state = getInitialState();
    setCalledByLoket(state.calledByLoket);
    setMode(state.config.mode);
    setRunningTextState(state.config.runningText);
    setCurrentThemeId(state.config.theme || 'DEFAULT');

    Object.keys(state.calledByLoket).forEach((key) => {
      const k = parseInt(key);
      if (state.calledByLoket[k]) lastTicketRef.current[k] = state.calledByLoket[k]!.formattedNumber;
    });

    const unsubscribe = subscribeToChanges((state) => {
      setCalledByLoket(state.calledByLoket);
      setMode(state.config.mode);
      setRunningTextState(state.config.runningText);
      setCurrentThemeId(state.config.theme || 'DEFAULT');
      Object.keys(state.calledByLoket).forEach((key) => {
        const k = parseInt(key);
        if (state.calledByLoket[k]) lastTicketRef.current[k] = state.calledByLoket[k]!.formattedNumber;
      });
      setWaitingA(state.tickets.filter((t) => t.status === "waiting" && t.serviceType === "A"));
      setWaitingB(state.tickets.filter((t) => t.status === "waiting" && t.serviceType === "B"));
    });

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      unsubscribe();
      clearInterval(timer);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const theme = themes[currentThemeId];
  const primaryColor = theme.colors.primary;

  const LoketCard = ({ loket, ticket }: { loket: number; ticket: QueueTicket | null }) => {
    const hasData = lastTicketRef.current[loket] !== "---";
    const isActive = !!ticket;
    const isInfoLoket = mode === "NORMAL" && loket === 4;

    const activeBorderColor = isInfoLoket ? '#10b981' : primaryColor;
    const activeTextColor = isInfoLoket ? '#10b981' : primaryColor;
    const activeBgColor = isInfoLoket ? '#10b981' : primaryColor;

    return (
      <div
        className={`relative flex flex-row items-center justify-between px-8 rounded-2xl border-[3px] transition-all duration-700 h-full ${isActive ? (isInfoLoket ? 'animate-active-emerald-smooth' : 'animate-active-primary-smooth') : ''
          }`}
        style={{
          borderColor: (isActive || hasData) ? activeBorderColor : 'rgba(255,255,255,0.05)',
          backgroundColor: (isActive || hasData) ? 'rgba(30,41,59,0.8)' : 'rgba(30,41,59,0.1)',
        }}
      >
        <div className="flex flex-col">
          <h3 className={`text-3xl font-semibold tracking-tight ${(isActive || hasData) ? 'text-white' : 'text-white/10'}`}>
            LOKET {loket}
          </h3>
        </div>
        <div style={{ color: (isActive || hasData) ? activeTextColor : 'rgba(255,255,255,0.05)' }} className="mx-2">
          <ChevronRight size={48} strokeWidth={2} />
        </div>
        <div
          className="min-w-[150px] h-[75%] flex items-center justify-center rounded-2xl font-mono text-6xl font-bold tracking-tighter"
          style={(isActive || hasData) ? { backgroundColor: activeBgColor, color: theme.colors.background } : { backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.05)' }}
        >
          {ticket ? ticket.formattedNumber : lastTicketRef.current[loket]}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden text-white font-['Poppins'] relative transition-colors duration-500" style={{ backgroundColor: theme.colors.background }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Poppins', sans-serif; overflow: hidden; }
        
        @keyframes marquee-full {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee-full {
          display: inline-block;
          white-space: nowrap;
          animation: marquee-full 35s linear infinite;
        }
        
        @keyframes active-primary-smooth {
          0%, 100% { box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          50% { box-shadow: 0 0 40px 4px ${primaryColor}66; }
        }
        .animate-active-primary-smooth { animation: active-primary-smooth 1.5s ease-in-out infinite; }

        @keyframes active-emerald-smooth {
          0%, 100% { 
            border-color: #10B981; 
            box-shadow: 0 0 10px rgba(16, 185, 129, 0.1);
          }
          50% { 
            border-color: #34D399; 
            box-shadow: 0 0 40px rgba(16, 185, 129, 0.4);
          }
        }
        .animate-active-emerald-smooth { animation: active-emerald-smooth 1.5s ease-in-out infinite; }
      `}</style>

      {/* Thematic background decorations */}
      <ThemeBackground theme={currentThemeId} />

      <header className="px-8 py-4 flex items-center justify-between border-b-2 z-10 shrink-0 relative" style={{ borderColor: primaryColor + '50', backgroundColor: theme.colors.background + 'ee' }}>
        <div className="flex items-center gap-6">
          <div className="flex items-center justify-center">
            <InstitutionLogo size="lg" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold tracking-tight leading-tight opacity-90 uppercase">
              KEMENTERIAN IMIGRASI DAN PEMASYARAKATAN
            </h1>
            <h1 className="text-2xl font-bold tracking-tight leading-tight uppercase" style={{ color: primaryColor }}>
              RUMAH TAHANAN NEGARA KELAS I DEPOK
            </h1>
          </div>
        </div>
        <div className="text-right border-l-2 border-white/10 pl-8">
          <p className="text-xs font-medium opacity-40 uppercase tracking-[0.2em] mb-1">
            {format(currentTime, "EEEE, dd MMMM yyyy", { locale: id })}
          </p>
          <p className="text-5xl font-mono font-bold tracking-tighter leading-none" style={{ color: primaryColor }}>
            {format(currentTime, "HH:mm:ss")}
          </p>
        </div>
      </header>

      <main className="flex-1 flex p-6 gap-6 overflow-hidden relative z-10" style={{ background: `linear-gradient(to bottom, ${theme.colors.background}, ${theme.colors.background}cc)` }}>
        <div className="flex-[2.5] flex flex-col gap-6 h-full">
          <div className="flex-1 rounded-2xl border p-1 overflow-hidden" style={{ backgroundColor: theme.colors.cardBg, borderColor: primaryColor + '60', boxShadow: `0 0 25px ${primaryColor}20` }}>
            <video src="/VIDEO PROFILE RUTAN DEPOK 2025.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover rounded-2xl" />
          </div>

          <div className={mode === "NORMAL" ? "grid grid-cols-2 gap-6 h-40 shrink-0" : "flex gap-6 h-40 shrink-0"}>
            <div className={`rounded-2xl border-2 flex flex-col justify-center items-center px-6 ${mode === "SIMPLIFIED" ? "flex-1" : ""}`}
              style={{ backgroundColor: theme.colors.cardBg, borderColor: primaryColor }}>
              <h4 className="text-xl font-semibold uppercase mb-2" style={{ color: primaryColor }}>PENDAFTARAN KUNJUNGAN</h4>
              <div className="flex items-center gap-6">
                <Users className="w-12 h-12" strokeWidth={2.5} style={{ color: primaryColor }} />
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-bold tracking-tighter text-white">{waitingA.length}</span>
                  <span className="text-sm font-medium opacity-40 uppercase">MENUNGGU</span>
                </div>
              </div>
            </div>

            {mode === "NORMAL" && (
              <div className="bg-[#1e293b]/60 rounded-2xl border-2 border-emerald-500 flex flex-col justify-center items-center px-6">
                <h4 className="text-emerald-400 text-xl font-semibold uppercase mb-2">INFORMASI DAN PENGADUAN</h4>
                <div className="flex items-center gap-6">
                  <Users className="w-12 h-12 text-emerald-500 opacity-100" strokeWidth={2.5} />
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-bold tracking-tighter text-white">{waitingB.length}</span>
                    <span className="text-sm font-medium opacity-40 uppercase">MENUNGGU</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-[580px] flex flex-col h-full">
          <div className={`grid h-full gap-3 ${mode === "NORMAL" ? "grid-rows-[64px_1fr_1fr_1fr_64px_1fr]" : "grid-rows-[64px_1fr_1fr_1fr_1fr]"}`}>
            <div className="rounded-2xl flex items-center justify-center" style={{ backgroundColor: primaryColor + '20', border: `1px solid ${primaryColor}60` }}>
              <span className="text-2xl font-semibold uppercase tracking-tight text-center" style={{ color: primaryColor }}>LAYANAN PENDAFTARAN KUNJUNGAN</span>
            </div>

            <LoketCard loket={1} ticket={calledByLoket[1]} />
            <LoketCard loket={2} ticket={calledByLoket[2]} />
            <LoketCard loket={3} ticket={calledByLoket[3]} />

            {mode === "NORMAL" ? (
              <>
                <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl flex items-center justify-center mt-1">
                  <span className="text-emerald-400 text-2xl font-semibold uppercase tracking-tight text-center">LAYANAN INFORMASI DAN PENGADUAN</span>
                </div>
                <LoketCard loket={4} ticket={calledByLoket[4]} />
              </>
            ) : (
              <LoketCard loket={4} ticket={calledByLoket[4]} />
            )}
          </div>
        </div>
      </main>

      <footer className="h-12 flex items-center overflow-hidden shrink-0 relative z-10" style={{ backgroundColor: primaryColor }}>
        <div className="animate-marquee-full">
          <span className="font-bold text-xl uppercase tracking-widest py-1" style={{ color: theme.colors.background }}>
            {runningText}
          </span>
        </div>
      </footer>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent className="bg-[#1e293b] border-white/10 text-white rounded-3xl font-['Poppins']">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold">Reset Antrian?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">Seluruh nomor antrian akan kembali ke awal (0).</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-none text-white">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetConfirm} className="bg-red-600 hover:bg-red-700">Ya, Reset Sekarang</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Display;