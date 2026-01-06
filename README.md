# Pendaftaran Rudep – Sistem Antrian Rumah Tahanan

## Deskripsi Singkat
Aplikasi **Pendaftaran Rudep** adalah sistem antrian berbasis web yang dirancang khusus untuk **Rumah Tahanan Negara Kelas I Depok**. Aplikasi ini menampilkan nomor antrian secara real‑time, memanggil nomor lewat speaker, dan mencetak tiket secara otomatis pada printer thermal. Semua proses dapat dioperasikan dengan **keyboard shortcuts**, sehingga petugas loket dapat melayani warga dengan cepat dan tanpa harus menyentuh layar.

## Fitur Utama
- **Dua layanan utama**: 
  - **Layanan Pendaftaran Kunjungan (A)**
  - **Layanan Informasi & Pengaduan (B)**
- **Panggilan loket otomatis** dengan suara (Text‑to‑Speech).
- **Cetak tiket** langsung ke printer thermal.
- **Reset antrian** seluruh nomor dengan satu klik.
- **Statistik menunggu** menampilkan jumlah orang yang sedang menunggu tiap layanan.
- **Keyboard shortcuts**:
  - `Enter` → ambil nomor layanan **A**
  - `.` atau `Delete` → ambil nomor layanan **B**
  - `1‑3` → panggil nomor di loket 1‑3
  - `4` → panggil nomor di loket informasi
  - `0` → buka dialog reset antrian
- **Desain modern** dengan animasi glow, dark mode, dan tampilan video profil.

## Cara Kerja (High‑Level)
1. **Frontend** dibangun dengan **React**, **TypeScript**, dan **Vite**. Semua UI berada di folder `src/pages`.
2. **State antrian** dikelola di `src/lib/queueStore.ts` yang menyimpan nomor antrian, status, dan layanan.
3. **Panggilan suara** menggunakan modul `tts.ts` yang memanfaatkan Web Speech API.
4. **Cetak tiket** dipanggil lewat `printTicket.ts` yang berkomunikasi dengan library `node-thermal-printer` (pada proses Electron).
5. **Keyboard listener** di `Display.tsx` menangani semua shortcut dan men-trigger aksi di store.

## Instalasi & Menjalankan (Development)
### Prasyarat
- **Node.js** versi **18** atau lebih baru
- **npm** (biasanya sudah terpasang bersama Node)
- **Git** untuk meng‑clone repository

### Langkah‑langkah
```bash
# 1. Clone repository
git clone <YOUR_GIT_URL>
cd "Pendaftaran Rudep"

# 2. Install dependencies
npm i

# 3. Jalankan server development dengan hot‑reload
npm run dev
```
Aplikasi akan terbuka di `http://localhost:5173` (atau port yang ditunjukkan pada terminal).

## Build & Deploy (Production)
Untuk menghasilkan bundle produksi yang dapat dijalankan secara mandiri (misalnya dengan Electron):
```bash
# Build aplikasi web
npm run build

# Jika menggunakan Electron, jalankan builder
npm run electron:build   # perintah ini tergantung pada script yang ada di package.json
```
File hasil build berada di folder `dist/`.

## Panduan Penggunaan
- **Header** menampilkan logo Kementerian Imigrasi, nama lembaga, tanggal & jam real‑time.
- **Video profil** diputar otomatis di bagian atas kanan.
- **Kotak statistik** menampilkan jumlah orang yang menunggu layanan A & B.
- **Kolom loket** menampilkan nomor yang sedang dipanggil atau nomor terakhir yang selesai.
- **Footer** berisi marquee teks informasi penting.
- **Dialog reset** muncul ketika menekan tombol `0`; konfirmasi diperlukan sebelum semua nomor di‑reset ke 0.

## Kontribusi
1. Fork repository ini.
2. Buat branch baru untuk fitur atau perbaikan (`git checkout -b fitur‑baru`).
3. Lakukan perubahan, pastikan linting dan format tetap bersih.
4. Buat pull request dengan deskripsi jelas.

## Lisensi
Proyek ini dilisensikan di bawah **MIT License** – lihat file `LICENSE` untuk detail lebih lanjut.

---
*Dibuat dengan ❤️ oleh tim pengembang Pendaftaran Rudep*
