import { Link } from "react-router-dom";
import { InstitutionLogo } from "@/components/InstitutionLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Monitor, ArrowRight, Keyboard, Printer, RefreshCw, Volume2, Settings, Edit2 } from "lucide-react";
import { getInitialState, setRunningText, subscribeToChanges, setTheme, ThemeMode } from "@/lib/queueStore";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Save, Info, Palette } from "lucide-react";
import { ThemeBackground } from "@/components/ThemeElements";
import { themes, ThemeConfig } from "@/lib/themes";
import "@/Themes.css";

const themeList: ThemeConfig[] = Object.values(themes);

const themeEmojis: Record<ThemeMode, string> = {
  DEFAULT: '🌑',
  LEBARAN: '🕌',
  NATAL: '🎄',
  TAHUN_BARU: '🎆',
  NASIONAL: '🇮🇩',
};

const Index = () => {
  const [runningText, setUpdateRunningText] = useState("");
  const [tempText, setTempText] = useState("");
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>("DEFAULT");

  useEffect(() => {
    const state = getInitialState();
    setUpdateRunningText(state.config.runningText);
    setTempText(state.config.runningText);
    setCurrentTheme(state.config.theme || "DEFAULT");

    const unsubscribe = subscribeToChanges((state) => {
      setUpdateRunningText(state.config.runningText);
      setCurrentTheme(state.config.theme || "DEFAULT");
    });
    return () => unsubscribe();
  }, []);

  const handleSaveText = () => {
    setRunningText(tempText);
  };

  const handleSetTheme = (theme: ThemeMode) => {
    setTheme(theme);
    setCurrentTheme(theme);
  };

  const theme = themes[currentTheme];

  // Dynamic styles based on theme
  const bgStyle = currentTheme === 'DEFAULT'
    ? { backgroundColor: '#0a1120' }
    : { backgroundColor: theme.colors.background };

  const primaryColor = theme.colors.primary;
  const primaryColorStyle = { color: primaryColor };
  const primaryBorderStyle = { borderColor: primaryColor + '40' };
  const primaryBgStyle = { backgroundColor: primaryColor + '20' };

  return (
    <div className="min-h-screen text-white font-sans transition-colors duration-500" style={bgStyle}>
      {/* Thematic background */}
      <ThemeBackground theme={currentTheme} />

      <div className="relative z-10">
        {/* Header / Hero Section */}
        <header className="pt-16 pb-12 px-6 text-center">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
            <InstitutionLogo size="xl" className="shadow-[0_0_30px_rgba(212,175,55,0.2)] rounded-full p-2" style={{ backgroundColor: theme.colors.cardBg }} />
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-medium tracking-widest opacity-80 uppercase">
                Sistem Antrian Digital Terpadu
              </h2>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                KEMENTERIAN IMIGRASI DAN PEMASYARAKATAN
              </h1>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mt-2 pb-2"
                style={{ color: primaryColor }}>
                RUTAN KELAS 1 DEPOK
              </h1>
            </div>
            <p className="mt-4 opacity-60 max-w-2xl text-base md:text-lg leading-relaxed">
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
              <div className="h-full relative overflow-hidden rounded-3xl border transition-all duration-500 hover:-translate-y-2"
                style={{ backgroundColor: theme.colors.cardBg, borderColor: primaryColor + '30' }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                  style={{ background: `radial-gradient(circle at top left, ${primaryColor}20, transparent 60%)` }} />
                <div className="p-8 md:p-10 relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
                      style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}88)` }}>
                      <Ticket className="w-10 h-10" style={{ color: theme.colors.background }} />
                    </div>
                    <div className="w-12 h-12 rounded-full border flex items-center justify-center transition-colors"
                      style={{ borderColor: primaryColor + '40' }}>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" style={primaryColorStyle} />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">Kiosk Antrian</h3>
                  <p className="opacity-70 text-lg mb-6 flex-1">Layar sentuh mandiri untuk pengunjung mengambil tiket antrian layanan pendaftaran kunjungan dan pengaduan.</p>
                  <div className="inline-flex items-center font-semibold text-lg group-hover:tracking-wide transition-all" style={primaryColorStyle}>
                    Buka Kiosk <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Display Card */}
            <Link to="/display" className="group block">
              <div className="h-full relative overflow-hidden rounded-3xl border transition-all duration-500 hover:-translate-y-2"
                style={{ backgroundColor: theme.colors.cardBg, borderColor: primaryColor + '30' }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                  style={{ background: `radial-gradient(circle at top left, ${primaryColor}20, transparent 60%)` }} />
                <div className="p-8 md:p-10 relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500"
                      style={{ background: 'linear-gradient(135deg, #60a5fa, #3b82f6)' }}>
                      <Monitor className="w-10 h-10 text-white" />
                    </div>
                    <div className="w-12 h-12 rounded-full border border-blue-400/30 flex items-center justify-center group-hover:bg-blue-400/10 transition-colors">
                      <ArrowRight className="w-6 h-6 text-blue-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">Display Antrian</h3>
                  <p className="opacity-70 text-lg mb-6 flex-1">Layar informasi utama di ruang tunggu yang menampilkan pemanggilan nomor antrian dan video profil rutan.</p>
                  <div className="inline-flex items-center text-blue-400 font-semibold text-lg group-hover:tracking-wide transition-all">
                    Buka Display <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Custom Display Card */}
            <Link to="/custom-display" className="group block">
              <div className="h-full relative overflow-hidden rounded-3xl border transition-all duration-500 hover:-translate-y-2"
                style={{ backgroundColor: theme.colors.cardBg, borderColor: '#10b98130' }}>
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
                  <p className="opacity-70 text-lg mb-6 flex-1">Layar display fleksibel yang dapat dikonfigurasi jumlah loketnya secara mandiri (2 sampai 6 loket).</p>
                  <div className="inline-flex items-center text-emerald-400 font-semibold text-lg group-hover:tracking-wide transition-all">
                    Konfigurasi <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Theme Selector */}
          <div className="mb-12">
            <Card className="border backdrop-blur-md rounded-[2rem] overflow-hidden shadow-2xl"
              style={{ backgroundColor: theme.colors.cardBg, borderColor: primaryColor + '30' }}>
              <CardHeader className="border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={primaryBgStyle}>
                    <Palette size={24} style={primaryColorStyle} />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">Tema Tampilan</CardTitle>
                    <CardDescription className="text-white/40">Ubah tema warna dan dekorasi semua layar secara real-time.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 px-8 pb-8">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {themeList.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleSetTheme(t.id)}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 group ${currentTheme === t.id ? 'scale-105 shadow-lg' : 'hover:scale-[1.02] opacity-70 hover:opacity-100'}`}
                      style={{
                        borderColor: currentTheme === t.id ? t.colors.primary : 'rgba(255,255,255,0.1)',
                        backgroundColor: currentTheme === t.id ? t.colors.primary + '20' : 'rgba(255,255,255,0.03)',
                      }}
                    >
                      {currentTheme === t.id && (
                        <div className="absolute inset-0 rounded-2xl opacity-10 blur-md" style={{ backgroundColor: t.colors.primary }} />
                      )}
                      <span className="text-3xl relative z-10">{themeEmojis[t.id]}</span>
                      <span className="text-xs font-semibold text-center relative z-10 text-white/80">{t.name}</span>
                      {/* Color swatches */}
                      <div className="flex gap-1 mt-1 relative z-10">
                        <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: t.colors.primary }} />
                        <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: t.colors.secondary }} />
                        <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: t.colors.accent }} />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Preview of selected theme */}
                <div className="mt-6 p-4 rounded-2xl border flex items-center gap-4" style={{ borderColor: primaryColor + '30', backgroundColor: primaryColor + '10' }}>
                  <span className="text-3xl">{themeEmojis[currentTheme]}</span>
                  <div>
                    <p className="font-semibold text-white">Tema Aktif: <span style={primaryColorStyle}>{theme.name}</span></p>
                    <p className="text-xs text-white/40">Tema akan diterapkan ke semua layar (Kiosk, Display, Antrian Khusus).</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Running Text Editor Section */}
          <div className="mb-16">
            <Card className="border backdrop-blur-md rounded-[2rem] overflow-hidden shadow-2xl"
              style={{ backgroundColor: theme.colors.cardBg, borderColor: primaryColor + '30' }}>
              <CardHeader className="border-b border-white/5 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={primaryBgStyle}>
                      <MessageSquare size={24} style={primaryColorStyle} />
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
                        className="min-h-[100px] w-full bg-black/30 border-white/10 rounded-2xl p-6 text-lg font-medium text-white placeholder:text-white/10 transition-all resize-none custom-scrollbar focus:outline-none"
                        style={{ focusBorderColor: primaryColor }}
                      />
                      <div className="absolute right-4 bottom-4 text-[10px] text-white/20 font-mono tracking-tighter uppercase pointer-events-none">
                        Live Preview Mode
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/30 italic px-2">
                      <Info size={12} style={{ color: primaryColor + '80' }} />
                      Tip: Gunakan simbol ✯ ✧ ☆ untuk pemisah pesan agar tampilan lebih elegan.
                    </div>
                  </div>
                  <Button
                    onClick={handleSaveText}
                    className="w-full md:w-auto h-[100px] md:aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-95 group"
                    style={{ backgroundColor: primaryColor, color: theme.colors.background }}
                  >
                    <Save size={28} className="group-hover:bounce" />
                    <span className="text-xs uppercase tracking-widest">Update</span>
                  </Button>
                </div>
              </CardContent>
              {/* Mini Preview Bar */}
              <div className="bg-black/40 border-t border-white/5 py-3 px-8 flex items-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-widest shrink-0" style={{ color: primaryColor + '80' }}>Current:</span>
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

          {/* Comprehensive System Guide */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-10 flex items-center gap-4">
              <span className="w-12 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></span>
              Panduan Penggunaan Sistem (Untuk Pemula)
            </h2>

            <div className="grid grid-cols-1 gap-12">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Kiosk Instructions */}
                <Card className="border backdrop-blur-sm p-6 rounded-[2rem]"
                  style={{ backgroundColor: theme.colors.cardBg, borderColor: 'rgba(255,255,255,0.1)' }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl" style={primaryBgStyle}><Ticket size={24} style={primaryColorStyle} /></div>
                    <CardTitle className="text-2xl text-white">Layar Kiosk (Mesin Tiket)</CardTitle>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm text-white/80 leading-relaxed">
                      Layar ini diletakkan di depan agar <strong>pengunjung</strong> bisa mencetak nomor antrian mereka sendiri.
                    </p>
                    <div className="bg-black/30 rounded-2xl p-4 border border-white/5 space-y-4">
                      <p className="text-xs text-white/60 mb-2">Jika layar disentuh tidak bisa, gunakan keyboard ini:</p>
                      <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                        <span className="text-sm text-white/90">Ambil Tiket <strong>Pendaftaran (A)</strong></span>
                        <kbd className="px-3 py-1 bg-blue-600 rounded-lg font-bold text-white text-xs shadow-md">Tombol Enter</kbd>
                      </div>
                      <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                        <span className="text-sm text-white/90">Ambil Tiket <strong>Informasi (B)</strong></span>
                        <kbd className="px-3 py-1 bg-emerald-600 rounded-lg font-bold text-white text-xs shadow-md">Tombol Titik (.)</kbd>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Main Display Instructions */}
                <Card className="border backdrop-blur-sm p-6 rounded-[2rem]"
                  style={{ backgroundColor: theme.colors.cardBg, borderColor: 'rgba(255,255,255,0.1)' }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400"><Monitor size={24} /></div>
                    <CardTitle className="text-2xl text-white">TV Ruang Tunggu Panggilan</CardTitle>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm text-white/80 leading-relaxed">
                      Layar TV besar ini menampilkan nomor antrian. <strong>Petugas Loket</strong> menggunakan keyboard komputer untuk memanggil pengunjung.
                    </p>
                    <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                      <p className="text-xs text-white/60 mb-3">Tekan tombol angka di atas huruf pada keyboard Anda:</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-white/5 p-2 px-3 rounded-lg">
                          <span className="text-xs">Panggil Orang Berikutnya di Loket 1, 2, 3, 4</span>
                          <kbd className="bg-blue-600 text-white px-2 py-1 rounded text-[10px] font-bold">Angka 1, 2, 3, 4</kbd>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-2 px-3 rounded-lg">
                          <span className="text-xs">Ulangi Panggilan Loket 1, 2, 3</span>
                          <kbd className="bg-emerald-600 text-white px-2 py-1 rounded text-[10px] font-bold">Angka 7, 8, 9</kbd>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-2 px-3 rounded-lg">
                          <span className="text-xs">Ulangi Panggilan Loket 4</span>
                          <kbd className="bg-emerald-600 text-white px-2 py-1 rounded text-[10px] font-bold">Angka 6</kbd>
                        </div>
                        <div className="flex justify-between items-center bg-red-500/10 p-2 px-3 rounded-lg border border-red-500/20">
                          <span className="text-xs text-red-100">Kembalikan Antrian ke 0 (Dipagi Hari)</span>
                          <kbd className="bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold">Angka 0</kbd>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Antrian Khusus */}
              <section className="border rounded-[2.5rem] p-8 md:p-12 backdrop-blur-md"
                style={{ backgroundColor: theme.colors.cardBg, borderColor: '#10b98120' }}>
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="lg:w-1/3">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6">
                      <Settings size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Layar Antrian Khusus (Banyak Loket)</h3>
                    <div className="space-y-4 text-sm text-white/80">
                      <p>
                        Gunakan menu ini jika Anda butuh lebih dari 4 loket. Anda bisa mengatur berapa jumlah loket yang beroperasi hari ini dengan bebas.
                      </p>
                      <div className="bg-black/20 p-4 rounded-xl">
                        <h4 className="font-bold text-white/90 mb-2">Langkah Penggunaan:</h4>
                        <ol className="list-decimal pl-4 space-y-2 text-white/80">
                          <li>Klik tombol <strong>"Konfigurasi"</strong> pada kotak warna hijau di bagian atas.</li>
                          <li>Isi berapa loket yang sedang buka.</li>
                          <li>Pilih apakah Loket Informasi (B) dipakai atau tidak.</li>
                          <li>Gunakan tombol angka di sebelah kanan pojok keyboard (Numpad) untuk memanggil.</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-6">
                    <div className="bg-black/30 rounded-3xl p-6 border border-white/5">
                      <h4 className="text-sm font-bold flex items-center gap-2 mb-4" style={primaryColorStyle}>
                        <Keyboard size={16} /> Cara Memanggil Pakai Numpad (Keyboard Kanan)
                      </h4>
                      <p className="text-xs text-white/60 mb-4">Pastikan lampu "Num Lock" di keyboard Anda menyala. Gunakan tombol angka di deretan paling kanan.</p>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h5 className="text-xs font-semibold text-white bg-white/10 px-3 py-1 rounded-full inline-block">Loket Layanan (Tiket A)</h5>
                          <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                            <span className="text-xs text-white/90">Panggil <strong>Baru</strong> (Loket 1-9)</span>
                            <kbd className="px-2 py-1 bg-blue-600 rounded text-[10px] font-bold text-white">Angka 1-9</kbd>
                          </div>
                          <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                            <span className="text-xs text-white/90">Panggil <strong>Baru</strong> (Loket 10)</span>
                            <kbd className="px-2 py-1 bg-blue-600 rounded text-[10px] font-bold text-white">Tombol Plus (+)</kbd>
                          </div>
                          <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border-l-2 border-blue-400">
                            <span className="text-xs text-white/90">Panggil <strong>Ulang</strong></span>
                            <kbd className="px-2 py-1 bg-indigo-600 rounded text-[10px] font-bold text-white">Tahan Shift + Angka</kbd>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h5 className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full inline-block">Loket Informasi (Tiket B)</h5>
                          <div className="flex justify-between items-center bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                            <span className="text-xs text-white/90">Panggil <strong>Baru</strong></span>
                            <kbd className="px-2 py-1 bg-emerald-600 rounded text-[10px] font-bold text-white">Bintang (*)</kbd>
                          </div>
                          <div className="flex justify-between items-center bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 border-l-2">
                            <span className="text-xs text-white/90">Panggil <strong>Ulang</strong></span>
                            <kbd className="px-2 py-1 bg-teal-600 rounded text-[10px] font-bold text-white">Shift + Bintang (*)</kbd>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-500/10 rounded-2xl p-5 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-red-100 flex items-center gap-2">
                          <RefreshCw size={16} /> Ulang Semua Nomor ke Nol (0)
                        </p>
                        <p className="text-xs text-red-100/70 mt-1">Lakukan ini setiap pagi hari agar antrian dimulai kembali dari A-001.</p>
                      </div>
                      <kbd className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold border-b-4 border-red-800 text-lg shadow-lg shrink-0">Tombol Angka 0</kbd>
                    </div>
                  </div>
                </div>
              </section>

              {/* Features */}
              <div className="mt-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
                  <span className="w-8 h-1 rounded-full" style={{ backgroundColor: primaryColor }}></span>
                  Fitur Unggulan
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {[
                    { icon: Printer, title: "Cetak Thermal", desc: "Dukungan cetak tiket otomatis via ESC/POS 58mm/80mm" },
                    { icon: Volume2, title: "Panggilan Suara", desc: "Pengumuman nomor otomatis dengan suara Bahasa Indonesia (TTS)" },
                    { icon: RefreshCw, title: "Sinkronisasi Realtime", desc: "Data terupdate seketika antara layar Kiosk dan Display via LocalStorage" },
                    { icon: Monitor, title: "Desain Responsif", desc: "Tampilan profesional disesuaikan untuk berbagai ukuran layar" }
                  ].map((feature, i) => (
                    <div key={i} className="border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
                      style={{ backgroundColor: theme.colors.cardBg }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={primaryBgStyle}>
                        <feature.icon className="w-6 h-6" style={primaryColorStyle} />
                      </div>
                      <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                      <p className="text-sm text-white/60 leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 backdrop-blur-md py-8" style={{ backgroundColor: theme.colors.background + 'cc' }}>
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 opacity-50">
              <InstitutionLogo className="h-8 w-8 grayscale" />
              <div>
                <p className="text-white text-sm font-semibold">Sistem Antrian Digital</p>
                <p className="text-xs">Rutan Kelas 1 Depok</p>
              </div>
            </div>
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} Kementerian Imigrasi dan Pemasyarakatan
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
