import { useState, useEffect, useRef, useCallback } from "react";
import { InstitutionLogo } from "@/components/InstitutionLogo";
import {
    subscribeToChanges,
    getInitialState,
    QueueTicket,
    CalledByLoket,
    callNext,
    markServed,
    getCalledByLoket,
    takeNumber,
    recallCurrent,
    resetQueue,
} from "@/lib/queueStore";
import { printTicketDirectly } from "@/lib/printTicket";
import { announceQueue, announceQueueEmpty } from "@/lib/tts";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Users, ChevronRight, Settings, Plus, Minus, Monitor, Layout, ArrowRight } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const SETTINGS_KEY = 'custom_display_settings_v2';

interface DisplaySettings {
    registrationCount: number;
    showInfoLoket: boolean;
    isConfigured: boolean;
}

const CustomDisplay = () => {
    const [calledByLoket, setCalledByLoket] = useState<CalledByLoket>({});
    const [waitingA, setWaitingA] = useState<QueueTicket[]>([]);
    const [waitingB, setWaitingB] = useState<QueueTicket[]>([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showResetDialog, setShowResetDialog] = useState(false);
    const [runningText, setRunningTextState] = useState("");

    // Settings state
    const [settings, setSettings] = useState<DisplaySettings>(() => {
        const stored = localStorage.getItem(SETTINGS_KEY);
        const base = stored ? JSON.parse(stored) : { registrationCount: 3, showInfoLoket: true };
        return { ...base, isConfigured: false };
    });

    const lastPressRef = useRef(0);
    const isAnnouncingRef = useRef(false);
    const lastTicketRef = useRef<{ [key: number]: string }>({});

    const handleSaveSettings = (newSettings: DisplaySettings) => {
        setSettings(newSettings);
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    };

    const handleResetConfirm = () => {
        resetQueue();
        const newLastTickets: { [key: number]: string } = {};
        for (let i = 1; i <= 10; i++) newLastTickets[i] = "---";
        lastTicketRef.current = newLastTickets;
        setCalledByLoket({});
        setShowResetDialog(false);
    };

    const handleKeyPress = useCallback(async (e: KeyboardEvent) => {
        if (!settings.isConfigured) return;

        const key = e.key;
        if (key === "0") {
            setShowResetDialog(true);
            return;
        }

        if (isAnnouncingRef.current) return;

        // --- CALILING SHORTCUTS (Numpad 1-6) ---
        const callMap: { [key: string]: number } = {
            "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6
        };

        if (callMap[key] && callMap[key] <= settings.registrationCount) {
            await processCall(callMap[key], 'A');
            return;
        }

        // --- RECALL SHORTCUTS (Numpad 7, 8, 9, /, *, -) ---
        const recallMap: { [key: string]: number } = {
            "7": 1, "8": 2, "9": 3, "/": 4, "*": 5, "-": 6
        };

        if (recallMap[key] && recallMap[key] <= settings.registrationCount) {
            await processRecall(recallMap[key]);
            return;
        }

        // --- INFORMATION SHORTCUTS ---
        if ((key === "+" || key === "9") && settings.showInfoLoket) {
            // Priority to + for info call
            if (key === "+" || key === "9") await processCall(9, 'B');
            return;
        }

        if (key === "ScrollLock" && settings.showInfoLoket) {
            await processRecall(9);
            return;
        }

        // --- PRINTING SHORTCUTS ---
        if (key === "Enter") {
            const ticket = takeNumber("A");
            printTicketDirectly(ticket);
            return;
        }

        if (key === ".") {
            const ticket = takeNumber("B");
            printTicketDirectly(ticket);
            return;
        }

    }, [settings]);

    const processCall = async (loket: number, serviceType: 'A' | 'B') => {
        if (isAnnouncingRef.current) return;

        const current = getInitialState().calledByLoket[loket];
        if (current) markServed(loket);

        const ticket = callNext(loket, serviceType);

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
    };

    const processRecall = async (loket: number) => {
        if (isAnnouncingRef.current) return;

        const ticket = recallCurrent(loket);
        if (ticket) {
            isAnnouncingRef.current = true;
            try {
                await announceQueue(ticket.formattedNumber, loket);
            } finally {
                isAnnouncingRef.current = false;
            }
        }
    };

    useEffect(() => {
        if (!settings.isConfigured) return;

        const state = getInitialState();
        setCalledByLoket(state.calledByLoket);
        setRunningTextState(state.config.runningText);

        const initialLastTickets: { [key: number]: string } = {};
        for (let i = 1; i <= 10; i++) {
            initialLastTickets[i] = state.calledByLoket[i]?.formattedNumber || "---";
        }
        lastTicketRef.current = initialLastTickets;

        const unsubscribe = subscribeToChanges((state) => {
            setCalledByLoket(state.calledByLoket);
            setRunningTextState(state.config.runningText);
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
    }, [handleKeyPress, settings.isConfigured]);

    if (!settings.isConfigured) {
        return (
            <div className="h-screen bg-[#0a1120] flex items-center justify-center p-6 text-white font-['Poppins']">
                <Card className="max-w-xl w-full bg-[#1e293b] border-gold/30 shadow-2xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="text-center pt-10 pb-6">
                        <div className="flex justify-center mb-6">
                            <InstitutionLogo size="lg" />
                        </div>
                        <CardTitle className="text-3xl font-bold text-white mb-2">Konfigurasi Antrian Khusus</CardTitle>
                        <CardDescription className="text-white/50 text-lg">
                            Atur tata letak loket sebelum memulai sesi display.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-10 pb-10 space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <Label className="text-lg font-medium text-gold/80 flex items-center gap-2">
                                    <Layout size={20} /> Jumlah Loket Pendaftaran
                                </Label>
                                <div className="flex items-center justify-between bg-black/20 p-4 rounded-2xl border border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold text-gold">{settings.registrationCount} Loket</span>
                                        <span className="text-sm text-white/70">Layanan Pendaftaran Kunjungan (A)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-12 w-12 rounded-xl border-gold/20 hover:bg-gold/10 text-gold"
                                            onClick={() => handleSaveSettings({ ...settings, registrationCount: Math.max(2, settings.registrationCount - 1) })}
                                        >
                                            <Minus size={20} />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-12 w-12 rounded-xl border-gold/20 hover:bg-gold/10 text-gold"
                                            onClick={() => handleSaveSettings({ ...settings, registrationCount: Math.min(6, settings.registrationCount + 1) })}
                                        >
                                            <Plus size={20} />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-xs text-white/30 italic">Pilih antara 2 sampai 6 loket.</p>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                                <div className="space-y-1">
                                    <Label className="text-lg font-medium text-emerald-400">Layanan Informasi</Label>
                                    <p className="text-xs text-white/70">Aktifkan loket khusus informasi & pengaduan (B).</p>
                                </div>
                                <Switch
                                    checked={settings.showInfoLoket}
                                    onCheckedChange={(val) => handleSaveSettings({ ...settings, showInfoLoket: val })}
                                    className="data-[state=checked]:bg-emerald-500 scale-125 mr-2"
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full h-16 bg-gold hover:bg-yellow-500 text-navy-dark text-xl font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-gold/20 group"
                            onClick={() => handleSaveSettings({ ...settings, isConfigured: true })}
                        >
                            Terapkan & Mulai Display
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const LoketCard = ({ loket, title, isInfo }: { loket: number; title: string; isInfo?: boolean }) => {
        const ticket = calledByLoket[loket];
        const hasData = lastTicketRef.current[loket] && lastTicketRef.current[loket] !== "---";
        const isActive = !!ticket;

        const baseBorderColor = isInfo ? 'border-emerald-500' : 'border-gold';
        const textTheme = isInfo ? "text-emerald-400" : "text-gold";
        const bgTheme = isInfo ? "bg-emerald-500" : "bg-gold";
        const blinkClass = isInfo ? 'animate-active-emerald-smooth' : 'animate-active-gold-smooth';

        return (
            <div className={`
        relative flex flex-row items-center justify-between px-6 py-4 rounded-2xl border-[3px] transition-all duration-700
        ${(isActive || hasData)
                    ? `bg-[#1e293b]/80 ${baseBorderColor}`
                    : 'bg-[#1e293b]/10 border-white/5'}
        ${isActive ? blinkClass : ''}
      `}>
                <div className="flex flex-col">
                    <h3 className={`text-xl font-bold tracking-tight ${(isActive || hasData) ? "text-white" : "text-white/10"} uppercase`}>
                        {title}
                    </h3>
                </div>

                <div className={`mx-2 ${(isActive || hasData) ? textTheme : "text-white/5"}`}>
                    <ChevronRight size={32} strokeWidth={2.5} />
                </div>

                <div className={`
          min-w-[120px] h-14 flex items-center justify-center rounded-xl font-mono text-4xl font-bold tracking-tighter
          ${(isActive || hasData)
                        ? `${bgTheme} text-[#0f172a]`
                        : 'bg-white/5 text-white/5'}
        `}>
                    {ticket ? ticket.formattedNumber : (lastTicketRef.current[loket] || "---")}
                </div>
            </div>
        );
    };

    return (
        <div className="h-screen bg-[#0a1120] flex flex-col overflow-hidden text-white font-['Poppins'] selection:bg-gold/30">
            <style jsx global>{`
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
        
        @keyframes active-gold-smooth {
          0%, 100% { 
            border-color: #D4AF37; 
            box-shadow: 0 0 10px rgba(212, 175, 55, 0.1);
            background-color: rgba(30, 41, 59, 0.8);
          }
          50% { 
            border-color: #FFD700; 
            box-shadow: 0 0 40px rgba(212, 175, 55, 0.4);
            background-color: rgba(212, 175, 55, 0.15);
          }
        }
        .animate-active-gold-smooth { animation: active-gold-smooth 1.5s ease-in-out infinite; }

        @keyframes active-emerald-smooth {
          0%, 100% { 
            border-color: #10B981; 
            box-shadow: 0 0 10px rgba(16, 185, 129, 0.1);
            background-color: rgba(30, 41, 59, 0.8);
          }
          50% { 
            border-color: #34D399; 
            box-shadow: 0 0 40px rgba(16, 185, 129, 0.4);
            background-color: rgba(16, 185, 129, 0.15);
          }
        }
        .animate-active-emerald-smooth { animation: active-emerald-smooth 1.5s ease-in-out infinite; }
      `}</style>

            <header className="px-8 py-4 flex items-center justify-between border-b-2 border-gold/30 bg-[#070d19] z-10 shrink-0">
                <div className="flex items-center gap-6">
                    <InstitutionLogo size="lg" />
                    <div className="flex flex-col">
                        <h1 className="text-xl font-semibold tracking-tight leading-tight opacity-90 uppercase">
                            KEMENTERIAN IMIGRASI DAN PEMASYARAKATAN
                        </h1>
                        <h1 className="text-gold text-xl font-bold tracking-tight leading-tight uppercase">
                            RUMAH TAHANAN NEGARA KELAS I DEPOK
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/20 hover:text-gold hover:bg-gold/10 rounded-full"
                        onClick={() => handleSaveSettings({ ...settings, isConfigured: false })}
                    >
                        <Settings size={24} />
                    </Button>
                    <div className="text-right border-l-2 border-white/10 pl-8">
                        <p className="text-[10px] font-medium opacity-40 uppercase tracking-[0.2em] mb-1">
                            {format(currentTime, "EEEE, dd MMMM yyyy", { locale: id })}
                        </p>
                        <p className="text-4xl font-mono font-bold text-gold tracking-tighter leading-none">
                            {format(currentTime, "HH:mm:ss")}
                        </p>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex p-6 gap-6 overflow-hidden bg-gradient-to-b from-[#0a1120] to-[#0f172a]">
                {/* VIDEO SECTION */}
                <div className="flex-[1.5] flex flex-col gap-6 h-full">
                    <div className="flex-1 rounded-3xl bg-[#1e293b]/60 border border-gold shadow-[0_0_25px_rgba(212,175,55,0.1)] p-1 overflow-hidden relative">
                        <video src="/VIDEO PROFILE RUTAN DEPOK 2025.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover rounded-[22px]" />
                        {/*<div className="absolute top-4 left-4 bg-navy-dark/80 backdrop-blur-md px-4 py-2 rounded-xl border border-gold/30 flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-xs font-bold tracking-widest uppercase">LIVE DISPLAY</span>
                        </div>*/}
                    </div>

                    <div className="grid grid-cols-2 gap-6 h-32 shrink-0">
                        <div className={`bg-[#1e293b]/60 rounded-2xl border-2 border-gold flex flex-col justify-center items-center px-6 relative overflow-hidden group transition-all duration-500 ${!settings.showInfoLoket ? 'col-span-2' : ''}`}>
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Users size={60} className="text-gold" />
                            </div>
                            <h4 className="text-gold text-sm font-bold uppercase mb-1 tracking-wider">ANTRIAN KUNJUNGAN</h4>
                            <div className="flex items-baseline gap-3">
                                <span className="text-5xl font-bold tracking-tighter text-white">{waitingA.length}</span>
                                <span className="text-[10px] font-medium opacity-40 uppercase tracking-widest">MENUNGGU</span>
                            </div>
                        </div>

                        {settings.showInfoLoket && (
                            <div className="bg-[#1e293b]/60 rounded-2xl border-2 border-emerald-500 flex flex-col justify-center items-center px-6 relative overflow-hidden group transition-all duration-500">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Users size={60} className="text-emerald-500" />
                                </div>
                                <h4 className="text-emerald-400 text-sm font-bold uppercase mb-1 tracking-wider">ANTRIAN INFORMASI</h4>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-5xl font-bold tracking-tighter text-white">{waitingB.length}</span>
                                    <span className="text-[10px] font-medium opacity-40 uppercase tracking-widest">MENUNGGU</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* LOKET LIST SECTION */}
                <div className="flex-[2.5] flex flex-col h-full overflow-hidden">
                    <div className="bg-gold/10 border border-gold/40 rounded-2xl py-3 mb-4 flex items-center justify-center shrink-0">
                        <span className="text-gold text-lg font-bold uppercase tracking-[0.2em]">DAFTAR PEMANGGILAN LOKET</span>
                    </div>

                    <div className={`grid gap-4 h-full overflow-y-auto pr-2 custom-scrollbar ${settings.registrationCount <= 4 ? 'grid-cols-1' : 'grid-cols-2'
                        }`}>
                        {/* Service A Lokets */}
                        {Array.from({ length: settings.registrationCount }).map((_, i) => (
                            <LoketCard
                                key={i + 1}
                                loket={i + 1}
                                title={`LOKET ${i + 1}`}
                            />
                        ))}

                        {/* Service B Loket */}
                        {settings.showInfoLoket && (
                            <LoketCard
                                loket={9}
                                title="LOKET INFORMASI"
                                isInfo
                            />
                        )}
                    </div>
                </div>
            </main>

            <footer className="bg-gold h-10 flex items-center overflow-hidden shrink-0 relative">
                <div className="animate-marquee-full">
                    <span className="text-navy-dark font-black text-lg uppercase tracking-widest py-1">
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

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
      `}</style>
        </div>
    );
};

export default CustomDisplay;
