# Pendaftaran Rudep – Sistem Antrian Rumah Tahanan

![Project Banner](https://img.shields.io/badge/Pendaftaran%20Rudep-Sistem%20Antrian-0f172a?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📖 Deskripsi Singkat
Aplikasi **Pendaftaran Rudep** adalah sistem antrian interaktif dan responsif berbasis web yang dirancang khusus untuk **Rumah Tahanan Negara Kelas I Depok**. Aplikasi ini memfasilitasi pelayanan kunjungan serta informasi dan pengaduan melalui alur terstruktur yang modern. 

Keunggulan utama sistem ini adalah antarmuka yang elegan dengan dukungan animasi, mode layar ganda (Simplified/Normal), sistem *Text-to-Speech* untuk memanggil antrian secara otomatis, serta dukungan integrasi alat seperti *thermal printer* untuk langsung mencetak tiket antrian. Semuanya dapat dioperasikan tanpa menyentuh mouse/layar menggunakan dukungan *keyboard shortcuts* sepenuhnya.

## ✨ Fitur Utama
- **Dua Layanan Utama**: Pendaftaran Kunjungan (Layanan A) dan Informasi & Pengaduan (Layanan B).
- **Mode Fleksibel (Simplified & Normal)**: Memungkinkan penyesuaian tampilan antrian khusus untuk 1 layanan (Pendaftaran saja) atau 2 layanan sekaligus.
- **Panggilan Suara Otomatis**: Menggunakan fitur *Text-to-Speech* terintegrasi.
- **Cetak Tiket Otomatis**: Tiket langsung dicetak ke *thermal printer* via *node-thermal-printer*.
- **Holiday Themes (Tema Hari Raya)**: Desain UI otomatis beradaptasi dengan perayaan hari besar (Lebaran, Natal, Tahun Baru, Hari Nasional, Imlek) melalui sistem tematik terpadu.
- **Custom Display / Antrian Khusus**: Opsi untuk memisahkan dan memusatkan tampilan antrian sesuai kebutuhan perangkat keras spesifik.
- **Statistik Antrian Real-Time**: Memantau dan menampilkan jumlah pengguna yang sedang menunggu.
- **Desain Modern & Profesional**: Animasi *glow*, tata letak responsif, dukungan video profil otomatis, dan kustomisasi *running text*. 

## ⌨️ Keyboard Shortcuts (Penggunaan Cepat)
Sistem ini dirancang untuk dioperasikan oleh operator dengan cepat menggunakan *keyboard*:

| Tombol | Fungsi | Layanan / Deskripsi |
| :---: | :--- | :--- |
| `Enter` | **Ambil Nomor Antrian** | **Daftar Kunjungan (Layanan A)** - Mencetak tiket otomatis |
| `.` / `Delete` | **Ambil Nomor Antrian** | **Info & Pengaduan (Layanan B)** (Khusus Mode Normal) |
| `1` | **Panggil Antrian** | Loket 1 |
| `2` | **Panggil Antrian** | Loket 2 |
| `3` | **Panggil Antrian** | Loket 3 |
| `4` | **Panggil Antrian** | Loket 4 (Informasi) |
| `7` | **Panggil Ulang (Recall)** | Loket 1 |
| `8` | **Panggil Ulang (Recall)** | Loket 2 |
| `9` | **Panggil Ulang (Recall)** | Loket 3 |
| `6` | **Panggil Ulang (Recall)** | Loket 4 (Informasi) |
| `0` | **Reset Dialog** | Membuka konfirmasi untuk mengatur ulang (reset) semua antrian ke-0. |
| `*` | **Ubah Mode Layar** | Berpindah antara mode `NORMAL` (2 Layanan) dan `SIMPLIFIED` (1 Layanan). |

## 🛠️ Teknologi yang Digunakan
* **Frontend Framework**: React 18, TypeScript, Vite
* **Styling**: Tailwind CSS, Shadcn UI / Radix UI
* **Icons**: Lucide React
* **Data Management**: React State Management (`queueStore.ts`)
* **Utilities**: `date-fns` (pemformatan waktu), `react-router-dom` (navigasi)

## ⚙️ Cara Kerja Aplikasi (High-Level)
1. **Frontend Architecture**: Komponen UI tersusun di folder `src/pages` (seperti `Display.tsx`, `Kiosk.tsx`, `CustomDisplay.tsx`, `Dashboard.tsx`).
2. **State Management**: Seluruh status antrean (nomor aktif, daftar tunggu, mode, tema) dikelola secara terpusat di `src/lib/queueStore.ts`.
3. **Panggilan Suara**: Dikelola oleh modul `src/lib/tts.ts` yang memanggil Web Speech API.
4. **Cetak Tiket**: Ditangani di `src/lib/printTicket.ts` berinteraksi dengan API printer.
5. **Keyboard Event Listener**: Di-bind pada level global di UI operator untuk memicu *action* tanpa harus menekan tombol UI di layar.

## 🚀 Instalasi & Menjalankan (Development)
### Prasyarat:
- [Node.js](https://nodejs.org/) (versi ≥ 18 disarankan)
- npm (termasuk di dalam instalasi Node.js)
- Git (opsional)

### Langkah-Langkah:
1. **Clone Repository**
   ```bash
   git clone <URL_REPOSITORY_ANDA>
   cd "Pendaftaran Rudep Web 2/Pendaftaran Rudep Web"
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Jalankan Development Server**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan otomatis dan dapat diakses melalui `http://localhost:5173`.

## 📦 Build & Deploy (Production)
Untuk menggunakan aplikasi di komputer operasional:
```bash
# Membangun file statis web
npm run build
```
File hasil *build* akan tersedia di direktori `dist/` dan dapat di-*serve* menggunakan *web server* seperti IIS, Nginx, atau Apache.

## 🤝 Kontribusi (Contributing)
1. Fork repository ini
2. Buat branch baru untuk fitur Anda (`git checkout -b fitur/TemaBaru`)
3. Lakukan commit dari perubahan yang Anda buat (`git commit -m 'Menambahkan fitur TemaBaru'`)
4. Push ke branch Anda (`git push origin fitur/TemaBaru`)
5. Buat Pull Request dengan deskripsi jelas.

## 📄 Lisensi
Proyek ini dilisensikan di bawah **MIT License** – lihat file `LICENSE` untuk detail lanjutan.

---
*Dibuat dengan ❤️ oleh tim pengembang Pendaftaran Rudep - 2026*
