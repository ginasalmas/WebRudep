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

          {/* Comprehensive System Guide Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-10 flex items-center gap-4">
              <span className="w-12 h-1.5 bg-gold rounded-full"></span>
              Manual & Panduan Operasional Sistem
            </h2>

            <div className="grid grid-cols-1 gap-12">
              {/* 1. Kiosk & Display Utama */}
              <div className="grid md:grid-cols-2 gap-12">
                {/* Kiosk Instructions */}
                <Card className="bg-[#1e293b]/50 border-white/10 backdrop-blur-sm p-6 rounded-[2rem]">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gold/10 rounded-2xl text-gold"><Ticket size={24} /></div>
                    <CardTitle className="text-2xl text-white">Unit Kiosk</CardTitle>
                  </div>
                  <div className="space-y-6">
                    <p className="text-sm text-primary-foreground/60 leading-relaxed">Digunakan pengunjung untuk mencetak nomor antrian mandiri.</p>
                    <div className="bg-black/30 rounded-2xl p-5 border border-white/5 space-y-4">
                      <div className="flex justify-between items-center group">
                        <span className="text-xs text-white/80">Cetak Pendaftaran (A)</span>
                        <kbd className="px-3 py-1 bg-white/10 rounded-lg border border-white/20 font-mono text-white text-xs">Enter</kbd>
                      </div>
                      <div className="flex justify-between items-center group">
                        <span className="text-xs text-white/80">Cetak Informasi (B)</span>
                        <kbd className="px-3 py-1 bg-white/10 rounded-lg border border-white/20 font-mono text-white text-xs">.</kbd>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Main Display Instructions */}
                <Card className="bg-[#1e293b]/50 border-white/10 backdrop-blur-sm p-6 rounded-[2rem]">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400"><Monitor size={24} /></div>
                    <CardTitle className="text-2xl text-white">Display Utama</CardTitle>
                  </div>
                  <div className="space-y-6">
                    <p className="text-sm text-primary-foreground/60 leading-relaxed">Operasional standar untuk petugas di layanan utama rutan.</p>
                    <div className="grid grid-cols-2 gap-3 text-[10px] bg-black/30 p-4 rounded-2xl border border-white/5">
                      <div className="space-y-1">
                        <p className="text-gold uppercase font-bold">Panggil: 1-4</p>
                        <p className="text-blue-400 uppercase font-bold">Ulang: 7-9, 6</p>
                      </div>
                      <div className="text-right flex flex-col justify-center">
                        <p className="text-red-400 uppercase font-bold">Reset: 0</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* 2. Detailed Antrian Khusus Workflow */}
              <section className="bg-[#1e293b]/30 rounded-[2.5rem] border border-emerald-500/10 p-8 md:p-12 backdrop-blur-md">
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="lg:w-1/3">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6">
                      <Settings size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Layar Antrian Khusus</h3>
                    <p className="text-sm text-primary-foreground/60 leading-relaxed mb-8">
                      Fitur fleksibel untuk mengatur 2 sampai 6 loket pendaftaran sekaligus. Sangat berguna saat terjadi lonjakan pengunjung.
                    </p>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Alur Penggunaan:</h4>
                      <ul className="space-y-3">
                        {[
                          "Buka halaman Antrian Khusus",
                          "Atur jumlah loket aktif (2-6)",
                          "Aktifkan/nonaktifkan loket informasi",
                          "Gunakan Numpad keyboard untuk kontrol"
                        ].map((text, i) => (
                          <li key={i} className="flex gap-3 text-xs text-white/80 items-center">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                            {text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex-1 space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-black/30 rounded-3xl p-6 border border-white/5">
                        <h4 className="text-xs font-bold text-gold flex items-center gap-2 mb-6 uppercase tracking-wider">
                          <Keyboard size={14} /> Pintasan Pendaftaran (A)
                        </h4>
                        <div className="space-y-4 text-xs">
                          <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl">
                            <span>Panggil Tiket Baru</span>
                            <kbd className="bg-gold text-navy-dark px-2 rounded-lg font-bold">1 - 6</kbd>
                          </div>
                          <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl">
                            <span>Panggil Ulang (Recall)</span>
                            <kbd className="bg-blue-500 text-white px-2 rounded-lg font-bold">7-9 / * -</kbd>
                          </div>
                        </div>
                      </div>

                      <div className="bg-emerald-500/5 rounded-3xl p-6 border border-emerald-500/10">
                        <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2 mb-6 uppercase tracking-wider">
                          <Info size={14} /> Pintasan Informasi (B)
                        </h4>
                        <div className="space-y-4 text-xs">
                          <div className="flex justify-between items-center bg-emerald-500/10 p-3 rounded-2xl">
                            <span>Panggil Tiket Baru</span>
                            <kbd className="bg-emerald-400 text-emerald-950 px-2 rounded-lg font-bold text-sm">+</kbd>
                          </div>
                          <div className="flex justify-between items-center bg-emerald-500/10 p-3 rounded-2xl">
                            <span>Panggil Ulang (Recall)</span>
                            <kbd className="bg-emerald-300 text-emerald-950 px-2 rounded-lg font-bold text-[9px]">ScrollLock</kbd>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                        <h4 className="text-xs font-bold text-white/40 flex items-center gap-2 mb-4 uppercase tracking-wider">
                          <Printer size={14} /> Cetak dari Display
                        </h4>
                        <div className="flex gap-4">
                          <div className="flex-1 bg-black/20 p-3 rounded-2xl flex flex-col items-center">
                            <span className="text-[10px] mb-2">Tiket Registrasi A</span>
                            <kbd className="bg-white/10 px-3 py-1 rounded-lg">Enter</kbd>
                          </div>
                          <div className="flex-1 bg-black/20 p-3 rounded-2xl flex flex-col items-center">
                            <span className="text-[10px] mb-2">Tiket Info B</span>
                            <kbd className="bg-white/10 px-3 py-1 rounded-lg">Titik .</kbd>
                          </div>
                        </div>
                      </div>

                      <div className="bg-red-500/5 rounded-3xl p-6 border border-red-500/10 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">Reset Semua Antrian</p>
                          <p className="text-[10px] text-red-100/40 uppercase">Hanya Awal Hari Kerja</p>
                        </div>
                        <kbd className="bg-red-600 text-white w-10 h-10 flex items-center justify-center rounded-xl font-bold border-2 border-red-500/50 text-xl shadow-lg shadow-red-900/40">0</kbd>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

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
