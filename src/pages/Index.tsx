import { Link } from "react-router-dom";
import { InstitutionLogo } from "@/components/InstitutionLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Monitor, ArrowRight, Keyboard, Printer, RefreshCw, Volume2, Settings, Edit2 } from "lucide-react";
import { getInitialState, setRunningText, subscribeToChanges } from "@/lib/queueStore";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Save, Info } from "lucide-react";

const Index = () => {
  const [runningText, setUpdateRunningText] = useState("");
  const [tempText, setTempText] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    const state = getInitialState();
    setUpdateRunningText(state.config.runningText);
    setTempText(state.config.runningText);

    const unsubscribe = subscribeToChanges((state) => {
      setUpdateRunningText(state.config.runningText);
    });
    return () => unsubscribe();
  }, []);

  const handleSaveText = () => {
    setRunningText(tempText);
    setShowEditDialog(false);
  };

  return (
    <div className="min-h-screen bg-[#0a1120] text-primary-foreground font-sans selection:bg-gold/30">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10">
        {/* Header / Hero Section */}
        <header className="pt-16 pb-12 px-6 text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
            <InstitutionLogo size="xl" className="shadow-[0_0_30px_rgba(212,175,55,0.2)] rounded-full p-2 bg-navy-dark/50" />
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-medium tracking-widest text-primary-foreground/80 uppercase">
                Sistem Antrian Digital Terpadu
              </h2>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                KEMENTERIAN IMIGRASI DAN PEMASYARAKATAN
              </h1>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold mt-2 pb-2">
                RUTAN KELAS 1 DEPOK
              </h1>
            </div>
            <p className="mt-4 text-primary-foreground/60 max-w-2xl text-base md:text-lg leading-relaxed">
              Platform manajemen antrian cerdas yang dirancang untuk memberikan pelayanan publik yang lebih cepat, tertib, dan transparan.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 pb-20">

          {/* Main Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Kiosk Card */}
            <Link to="/kiosk" className="group block">
              <div className="h-full relative overflow-hidden rounded-3xl bg-gradient-to-b from-navy-light/40 to-navy-dark/60 border border-gold/20 hover:border-gold/50 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(212,175,55,0.3)] hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-8 md:p-10 relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      <Ticket className="w-10 h-10 text-navy-dark" />
                    </div>
                    <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                      <ArrowRight className="w-6 h-6 text-gold group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">Kiosk Antrian</h3>
                  <p className="text-primary-foreground/70 text-lg mb-6 flex-1">
                    Layar sentuh mandiri untuk pengunjung mengambil tiket antrian layanan pendaftaran kunjungan dan pengaduan.
                  </p>
                  <div className="inline-flex items-center text-gold font-semibold text-lg group-hover:tracking-wide transition-all">
                    Buka Kiosk <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Display Card */}
            <Link to="/display" className="group block">
              <div className="h-full relative overflow-hidden rounded-3xl bg-gradient-to-b from-navy-light/40 to-navy-dark/60 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.3)] hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-8 md:p-10 relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                      <Monitor className="w-10 h-10 text-white" />
                    </div>
                    <div className="w-12 h-12 rounded-full border border-blue-400/30 flex items-center justify-center group-hover:bg-blue-400/10 transition-colors">
                      <ArrowRight className="w-6 h-6 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">Display Antrian</h3>
                  <p className="text-primary-foreground/70 text-lg mb-6 flex-1">
                    Layar informasi utama di ruang tunggu yang menampilkan pemanggilan nomor antrian dan video profil rutan.
                  </p>
                  <div className="inline-flex items-center text-blue-400 font-semibold text-lg group-hover:tracking-wide transition-all">
                    Buka Display <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Custom Display Card */}
            <Link to="/custom-display" className="group block">
              <div className="h-full relative overflow-hidden rounded-3xl bg-gradient-to-b from-navy-light/40 to-navy-dark/60 border border-emerald-500/20 hover:border-emerald-400/50 transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.3)] hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-8 md:p-10 relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                      <Settings className="w-10 h-10 text-white" />
                    </div>
                    <div className="w-12 h-12 rounded-full border border-emerald-400/30 flex items-center justify-center group-hover:bg-emerald-400/10 transition-colors">
                      <ArrowRight className="w-6 h-6 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">Antrian Khusus</h3>
                  <p className="text-primary-foreground/70 text-lg mb-6 flex-1">
                    Layar display fleksibel yang dapat dikonfigurasi jumlah loketnya secara mandiri (2 sampai 6 loket).
                  </p>
                  <div className="inline-flex items-center text-emerald-400 font-semibold text-lg group-hover:tracking-wide transition-all">
                    Konfigurasi <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Running Text Editor Section */}
          <div className="mb-16">
            <Card className="bg-[#1e293b]/40 border-gold/20 backdrop-blur-md rounded-[2rem] overflow-hidden shadow-2xl">
              <CardHeader className="border-b border-white/5 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">Konfigurasi Pesan Berjalan</CardTitle>
                      <CardDescription className="text-white/40">Ubah pesan yang muncul di semua layar display secara real-time.</CardDescription>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-400 text-xs font-semibold">
                    <Info size={14} /> Terhubung ke Semua Display
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8 px-8 md:px-10 pb-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-1 w-full space-y-4">
                    <div className="relative group">
                      <Textarea
                        value={tempText}
                        onChange={(e) => setTempText(e.target.value)}
                        placeholder="Contoh: ✯✧☆ SELAMAT DATANG DI RUTAN DEPOK ✯✧☆"
                        className="min-h-[100px] w-full bg-black/30 border-white/10 rounded-2xl p-6 text-lg font-medium text-white placeholder:text-white/10 focus:border-gold/50 focus:ring-gold/20 transition-all resize-none custom-scrollbar"
                      />
                      <div className="absolute right-4 bottom-4 text-[10px] text-white/20 font-mono tracking-tighter uppercase pointer-events-none">
                        Live Preview Mode
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/30 italic px-2">
                      <Info size={12} className="text-gold/50" />
                      Tip: Gunakan simbol ✯ ✧ ☆ untuk pemisah pesan agar tampilan lebih elegan.
                    </div>
                  </div>
                  <Button
                    onClick={handleSaveText}
                    className="w-full md:w-auto h-[100px] md:aspect-square bg-gold hover:bg-yellow-500 text-navy-dark rounded-2xl flex flex-col items-center justify-center gap-2 font-bold shadow-lg shadow-gold/10 transition-all hover:scale-[1.02] active:scale-95 group"
                  >
                    <Save size={28} className="group-hover:bounce" />
                    <span className="text-xs uppercase tracking-widest">Update</span>
                  </Button>
                </div>
              </CardContent>
              {/* Mini Preview Bar */}
              <div className="bg-black/40 border-t border-white/5 py-3 px-8 flex items-center gap-4">
                <span className="text-[10px] font-bold text-gold/60 uppercase tracking-widest shrink-0">Current:</span>
                <div className="flex-1 overflow-hidden">
                  <div className="flex animate-marquee-full whitespace-nowrap">
                    <span className="text-[11px] font-medium text-white/50 uppercase tracking-widest">
                      {runningText}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Detailed Instructions Section */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-8 h-1 bg-gold rounded-full"></span>
              Panduan Penggunaan Sistem
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Kiosk Instructions */}
              <Card className="bg-[#1e293b]/50 border-white/10 backdrop-blur-sm">
                <CardHeader className="border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gold/10 rounded-lg text-gold"><Ticket className="w-5 h-5" /></div>
                    <CardTitle className="text-xl text-white">Cara Penggunaan Kiosk</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4 text-primary-foreground/80">
                  <p className="leading-relaxed">Kiosk digunakan oleh pengunjung untuk mencetak nomor antrian. Layar ini disarankan menggunakan monitor layar sentuh <em>(touchscreen)</em>.</p>

                  <div className="bg-black/30 rounded-xl p-4 mt-4 border border-white/5">
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2"><Keyboard className="w-4 h-4 text-gold" /> Shortcut Keyboard Kiosk:</h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-3">
                        <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono text-white text-xs shadow-sm">Enter</kbd>
                        <span>Mencetak nomor antrian <strong>Layanan Pendaftaran Kunjungan</strong> (Antrian A).</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono text-white text-xs shadow-sm">.</kbd>
                        <span>Mencetak nomor antrian <strong>Layanan Informasi & Pengaduan</strong> (Antrian B).</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Display & Petugas Instructions */}
              <Card className="bg-[#1e293b]/50 border-white/10 backdrop-blur-sm">
                <CardHeader className="border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Monitor className="w-5 h-5" /></div>
                    <CardTitle className="text-xl text-white">Cara Pemanggilan (Petugas)</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4 text-primary-foreground/80">
                  <p className="leading-relaxed">Gunakan keyboard jenis <em>Numpad / Numeric Pad</em> yang terhubung ke PC Display untuk melakukan pemanggilan antrian oleh petugas loket.</p>

                  <div className="bg-black/30 rounded-xl p-4 mt-4 border border-white/5">
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2"><Keyboard className="w-4 h-4 text-blue-400" /> Shortcut Numpad Petugas:</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-3">
                        <p className="font-medium text-gold/80 text-xs uppercase mb-1">Panggil Nomor Baru</p>
                        <li className="flex items-center gap-2 text-white/90">
                          <kbd className="min-w-[24px] text-center py-1 bg-white/10 rounded border border-white/20 font-mono text-xs">1</kbd> Panggil ke Loket 1
                        </li>
                        <li className="flex items-center gap-2 text-white/90">
                          <kbd className="min-w-[24px] text-center py-1 bg-white/10 rounded border border-white/20 font-mono text-xs">2</kbd> Panggil ke Loket 2
                        </li>
                        <li className="flex items-center gap-2 text-white/90">
                          <kbd className="min-w-[24px] text-center py-1 bg-white/10 rounded border border-white/20 font-mono text-xs">3</kbd> Panggil ke Loket 3
                        </li>
                        <li className="flex items-center gap-2 text-white/90">
                          <kbd className="min-w-[24px] text-center py-1 bg-white/10 rounded border border-white/20 font-mono text-xs">4</kbd> Panggil ke Loket 4
                        </li>
                      </div>
                      <div className="space-y-3">
                        <p className="font-medium text-blue-400/80 text-xs uppercase mb-1">Panggil Ulang (Recall)</p>
                        <li className="flex items-center gap-2 text-white/90">
                          <kbd className="min-w-[24px] text-center py-1 bg-white/10 rounded border border-white/20 font-mono text-xs">7</kbd> Recall Loket 1
                        </li>
                        <li className="flex items-center gap-2 text-white/90">
                          <kbd className="min-w-[24px] text-center py-1 bg-white/10 rounded border border-white/20 font-mono text-xs">8</kbd> Recall Loket 2
                        </li>
                        <li className="flex items-center gap-2 text-white/90">
                          <kbd className="min-w-[24px] text-center py-1 bg-white/10 rounded border border-white/20 font-mono text-xs">9</kbd> Recall Loket 3
                        </li>
                        <li className="flex items-center gap-2 text-white/90">
                          <kbd className="min-w-[24px] text-center py-1 bg-white/10 rounded border border-white/20 font-mono text-xs">6</kbd> Recall Loket 4
                        </li>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10">
                      <li className="flex items-start gap-3">
                        <kbd className="px-2 py-1 bg-red-500/20 text-red-200 rounded border border-red-500/30 font-mono text-xs">0</kbd>
                        <span className="text-sm">Reset seluruh antrian kembali ke 0 (Gunakan pada awal hari).</span>
                      </li>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features Section */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
              <span className="w-8 h-1 bg-gold rounded-full"></span>
              Fitur Unggulan
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { icon: Printer, title: "Cetak Thermal", desc: "Dukungan cetak tiket otomatis via ESC/POS 58mm/80mm" },
                { icon: Volume2, title: "Panggilan Suara", desc: "Pengumuman nomor otomatis dengan suara Bahasa Indonesia (TTS)" },
                { icon: RefreshCw, title: "Sinkronisasi Realtime", desc: "Data terupdate seketika antara layar Kiosk dan Display via LocalStorage" },
                { icon: Monitor, title: "Desain Responsif", desc: "Tampilan profesional disesuaikan untuk berbagai ukuran layar" }
              ].map((feature, i) => (
                <div key={i} className="bg-[#1e293b]/40 border border-white/5 rounded-2xl p-6 hover:bg-[#1e293b]/60 transition-colors">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 text-gold">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-primary-foreground/60 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </main>

        {/* Info Footer */}
        <footer className="border-t border-white/10 bg-[#070d19]/80 backdrop-blur-md py-8">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 opacity-50">
              <InstitutionLogo className="h-8 w-8 grayscale" />
              <div>
                <p className="text-white text-sm font-semibold">Sistem Antrian Digital</p>
                <p className="text-xs">Rutan Kelas 1 Depok</p>
              </div>
            </div>
            <p className="text-primary-foreground/40 text-sm">
              © {new Date().getFullYear()} Kementerian Imigrasi dan Pemasyarakatan
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
