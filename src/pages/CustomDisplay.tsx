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
    ThemeMode
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
import { ThemeBackground } from "@/components/ThemeElements";
import { themes } from "@/lib/themes";
import "@/Themes.css";

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
    const [currentThemeId, setCurrentThemeId] = useState<ThemeMode>("DEFAULT");

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
        for (let i = 1; i <= 11; i++) newLastTickets[i] = "---";
        lastTicketRef.current = newLastTickets;
        setCalledByLoket({});
        setShowResetDialog(false);
    };

    const handleKeyPress = useCallback(async (e: KeyboardEvent) => {
        if (!settings.isConfigured) return;

        const key = e.key;
        const code = e.code;

        if (code === "Digit0" || code === "Numpad0") {
            setShowResetDialog(true);
            return;
        }

        if (isAnnouncingRef.current) return;

        // --- CALLING SHORTCUTS ---
        const callMap: { [key: string]: number } = {
            "Numpad1": 1, "Numpad2": 2, "Numpad3": 3, "Numpad4": 4, "Numpad5": 5, "Numpad6": 6, "Numpad7": 7, "Numpad8": 8, "Numpad9": 9,
            "Digit1": 1, "Digit2": 2, "Digit3": 3, "Digit4": 4, "Digit5": 5, "Digit6": 6, "Digit7": 7, "Digit8": 8, "Digit9": 9
        };

        // Call (Direct press or Numpad)
        if (callMap[code] && !e.shiftKey && callMap[code] <= settings.registrationCount) {
            await processCall(callMap[code], 'A');
            return;
        }

        // Loket 10 (+)
        if ((code === "NumpadAdd" || key === "+") && !e.shiftKey && settings.registrationCount >= 10) {
            await processCall(10, 'A');
            return;
        }

        // Information Call (*)
        if ((code === "NumpadMultiply" || key === "*") && !e.shiftKey && settings.showInfoLoket) {
            await processCall(11, 'B');
            return;
        }

        // --- RECALL SHORTCUTS (Shift + Key/Code) ---
        if (e.shiftKey) {
            if (callMap[code] && callMap[code] <= settings.registrationCount) {
                await processRecall(callMap[code]);
                return;
            }
            if ((code === "NumpadAdd" || key === "+") && settings.registrationCount >= 10) {
                await processRecall(10);
                return;
            }
            if ((code === "NumpadMultiply" || key === "*") && settings.showInfoLoket) {
                await processRecall(11);
                return;
            }
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
        setCurrentThemeId(state.config.theme || 'DEFAULT');

        const initialLastTickets: { [key: number]: string } = {};
        for (let i = 1; i <= 11; i++) {
            initialLastTickets[i] = state.calledByLoket[i]?.formattedNumber || "---";
        }
        lastTicketRef.current = initialLastTickets;

        const unsubscribe = subscribeToChanges((state) => {
            setCalledByLoket(state.calledByLoket);
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
    }, [handleKeyPress, settings.isConfigured]);

    const theme = themes[currentThemeId];
    const primaryColor = theme.colors.primary;

    if (!settings.isConfigured) {
        return (
            <div className="h-screen flex items-center justify-center p-6 text-white font-['Poppins'] transition-colors duration-500" style={{ backgroundColor: theme.colors.background }}>
                <Card className="max-w-xl w-full shadow-2xl rounded-[2.5rem] overflow-hidden" style={{ backgroundColor: theme.colors.cardBg, borderColor: primaryColor + '40' }}>
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
                                <Label className="text-lg font-medium flex items-center gap-2" style={{ color: primaryColor + 'cc' }}>
                                    <Layout size={20} /> Jumlah Loket Pendaftaran
                                </Label>
                                <div className="flex items-center justify-between bg-black/20 p-4 rounded-2xl border border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold" style={{ color: primaryColor }}>{settings.registrationCount} Loket</span>
                                        <span className="text-sm text-white/70">Layanan Pendaftaran Kunjungan (A)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="icon"
                                            className="h-12 w-12 rounded-xl border-white/10 hover:bg-white/10 text-white"
                                            onClick={() => handleSaveSettings({ ...settings, registrationCount: Math.max(2, settings.registrationCount - 1) })}>
                                            <Minus size={20} />
                                        </Button>
                                        <Button variant="outline" size="icon"
                                            className="h-12 w-12 rounded-xl border-white/10 hover:bg-white/10 text-white"
                                            onClick={() => handleSaveSettings({ ...settings, registrationCount: Math.min(10, settings.registrationCount + 1) })}>
                                            <Plus size={20} />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-xs text-white/30 italic">Pilih antara 2 sampai 10 loket.</p>
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
                            className="w-full h-16 text-xl font-bold rounded-2xl transition-all duration-300 shadow-lg group"
                            style={{ backgroundColor: primaryColor, color: theme.colors.background }}
                            onClick={() => handleSaveSettings({ ...settings, isConfigured: true })}
                        >
                            Terapkan &amp; Mulai Display
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

        const activeBorderColor = isInfo ? '#10b981' : primaryColor;
        const activeTextColor = isInfo ? '#10b981' : primaryColor;
        const activeBgColor = isInfo ? '#10b981' : primaryColor;
        const isHighCount = (settings.registrationCount + (settings.showInfoLoket ? 1 : 0)) > 6;
        const blinkClass = isInfo ? 'animate-active-emerald-smooth' : 'animate-active-primary-smooth';

        return (
            <div
                className={`relative flex flex-row items-center justify-between rounded-xl border-[3px] transition-all duration-700 ${isHighCount ? 'px-3 py-1.5' : 'px-6 py-4'} ${isActive ? blinkClass : ''}`}
                style={{
                    borderColor: (isActive || hasData) ? activeBorderColor : 'rgba(255,255,255,0.05)',
                    backgroundColor: (isActive || hasData) ? 'rgba(30,41,59,0.8)' : 'rgba(30,41,59,0.1)',
                }}
            >
                <div className="flex flex-col">
                    <h3 className={`font-bold tracking-tight ${(isActive || hasData) ? "text-white" : "text-white/10"} uppercase`}
                        style={{ fontSize: isHighCount ? 'clamp(1rem, 3vh, 2.2rem)' : 'clamp(1.5rem, 4.5vh, 4rem)' }}>
                        {title}
                    </h3>
                </div>
                <div className="mx-1" style={{ color: (isActive || hasData) ? activeTextColor : 'rgba(255,255,255,0.05)' }}>
                    <ChevronRight size={isHighCount ? 20 : 32} strokeWidth={2.5} className="w-[2.5vh] h-[2.5vh]" />
                </div>
                <div
                    className="min-w-[80px] h-10 md:h-[6vh] flex items-center justify-center rounded-lg font-mono font-bold tracking-tighter"
                    style={{
                        ...(isActive || hasData)
                            ? { backgroundColor: activeBgColor, color: theme.colors.background }
                            : { backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.05)' },
                        fontSize: isHighCount ? 'clamp(1.2rem, 4.5vh, 3rem)' : 'clamp(2rem, 6vh, 4.5rem)'
                    }}
                >
                    {ticket ? ticket.formattedNumber : (lastTicketRef.current[loket] || "---")}
                </div>
            </div>
        );
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden text-white font-['Poppins'] selection:bg-gold/30 relative transition-colors duration-500" style={{ backgroundColor: theme.colors.background }}>
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

            <ThemeBackground theme={currentThemeId} />

            <header className="px-8 py-4 flex items-center justify-between border-b-2 z-10 shrink-0 relative" style={{ borderColor: primaryColor + '50', backgroundColor: theme.colors.background + 'ee' }}>
                <div className="flex items-center gap-6">
                    <InstitutionLogo size="lg" />
                    <div className="flex flex-col">
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight leading-tight opacity-90 uppercase">
                            KEMENTERIAN IMIGRASI DAN PEMASYARAKATAN
                        </h1>
                        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight leading-tight uppercase" style={{ color: primaryColor }}>
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
                        <p className="text-[10px] md:text-xs font-medium opacity-40 uppercase tracking-[0.2em] mb-1">
                            {format(currentTime, "EEEE, dd MMMM yyyy", { locale: id })}
                        </p>
                        <p className="text-4xl md:text-5xl lg:text-6xl font-mono font-bold tracking-tighter leading-none" style={{ color: primaryColor }}>
                            {format(currentTime, "HH:mm:ss")}
                        </p>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex p-6 gap-6 overflow-hidden relative z-10" style={{ background: `linear-gradient(to bottom, ${theme.colors.background}, ${theme.colors.background}cc)` }}>
                {/* VIDEO SECTION */}
                <div className="flex-[1.5] flex flex-col gap-6 h-full">
                    <div className="flex-1 rounded-3xl border p-1 overflow-hidden relative" style={{ backgroundColor: theme.colors.cardBg, borderColor: primaryColor + '60', boxShadow: `0 0 25px ${primaryColor}20` }}>
                        <video src="/VIDEO PROFILE RUTAN DEPOK 2025.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover rounded-[22px]" />
                        {/*<div className="absolute top-4 left-4 bg-navy-dark/80 backdrop-blur-md px-4 py-2 rounded-xl border border-gold/30 flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-xs font-bold tracking-widest uppercase">LIVE DISPLAY</span>
                        </div>*/}
                    </div>

                    <div className="grid grid-cols-2 gap-[2vh] h-[22vh] shrink-0">
                        <div className={`rounded-2xl border-2 flex flex-col justify-start items-center px-6 pt-[4vh] pb-[2vh] relative overflow-hidden group transition-all duration-500 ${!settings.showInfoLoket ? 'col-span-2' : ''}`}
                            style={{ backgroundColor: theme.colors.cardBg, borderColor: primaryColor }}>
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Users size={60} style={{ color: primaryColor }} />
                            </div>
                            <h4 className="font-bold uppercase mb-1 tracking-wider" style={{ fontSize: 'clamp(0.8rem, 2vh, 1.5rem)', color: primaryColor }}>ANTRIAN KUNJUNGAN</h4>
                            <div className="flex items-baseline gap-3">
                                <span className="font-bold tracking-tighter text-white" style={{ fontSize: 'clamp(3rem, 8vh, 6rem)' }}>{waitingA.length}</span>
                                <span className="text-[10px] md:text-xs font-medium opacity-40 uppercase tracking-widest">MENUNGGU</span>
                            </div>
                        </div>

                        {settings.showInfoLoket && (
                            <div className="bg-[#1e293b]/60 rounded-2xl border-2 border-emerald-500 flex flex-col justify-start items-center px-6 pt-[4vh] pb-[2vh] relative overflow-hidden group transition-all duration-500">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Users size={60} className="text-emerald-500" />
                                </div>
                                <h4 className="text-emerald-400 font-bold uppercase mb-1 tracking-wider" style={{ fontSize: 'clamp(0.8rem, 2vh, 1.5rem)' }}>ANTRIAN INFORMASI</h4>
                                <div className="flex items-baseline gap-3">
                                    <span className="font-bold tracking-tighter text-white" style={{ fontSize: 'clamp(3rem, 8vh, 6rem)' }}>{waitingB.length}</span>
                                    <span className="text-[10px] md:text-xs font-medium opacity-40 uppercase tracking-widest">MENUNGGU</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* LOKET LIST SECTION */}
                <div className="flex-[2.5] flex flex-col h-full overflow-hidden">
                    {/* Header with dynamic padding */}
                    <div className={`rounded-2xl flex items-center justify-center shrink-0 ${(settings.registrationCount + (settings.showInfoLoket ? 1 : 0)) > 6 ? 'py-2 mb-2' : 'py-6 mb-6'}`}
                        style={{ backgroundColor: primaryColor + '20', border: `1px solid ${primaryColor}60` }}>
                        <span className="font-bold uppercase tracking-[0.2em] px-4 text-center"
                            style={{ fontSize: (settings.registrationCount + (settings.showInfoLoket ? 1 : 0)) > 6 ? 'clamp(1rem, 2.5vh, 2rem)' : 'clamp(1.5rem, 4vh, 3rem)', color: primaryColor }}>
                            DAFTAR PEMANGGILAN LOKET
                        </span>
                    </div>

                    <div className={`grid h-full overflow-hidden 
                        ${(settings.registrationCount + (settings.showInfoLoket ? 1 : 0)) <= 3 ? 'grid-cols-1' : 'grid-cols-2'} 
                        ${(settings.registrationCount + (settings.showInfoLoket ? 1 : 0)) > 6 ? 'gap-x-4 gap-y-1' : 'gap-4'}`}>
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
                                loket={11}
                                title="LOKET INFORMASI"
                                isInfo
                            />
                        )}
                    </div>
                </div>
            </main>

            <footer className="h-10 flex items-center overflow-hidden shrink-0 relative z-10" style={{ backgroundColor: primaryColor }}>
                <div className="animate-marquee-full">
                    <span className="font-black uppercase tracking-widest py-1" style={{ fontSize: 'clamp(1rem, 2.5vh, 2rem)', color: theme.colors.background }}>
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
