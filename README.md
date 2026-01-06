# Pendaftaran Rudep – Sistem Antrian Rumah Tahanan

## Deskripsi Singkat
Aplikasi **Pendaftaran Rudep** adalah sistem antrian berbasis web yang dirancang khusus untuk **Rumah Tahanan Negara Kelas I Depok**. Menampilkan nomor antrian secara real‑time, memanggil nomor lewat speaker, dan mencetak tiket otomatis pada printer thermal. Seluruh proses dapat dioperasikan dengan **keyboard shortcuts**, sehingga petugas loket melayani warga dengan cepat tanpa menyentuh layar.

## Fitur Utama
- **Dua layanan**: Pendaftaran Kunjungan (A) dan Informasi & Pengaduan (B)
- **Panggilan loket otomatis** menggunakan Text‑to‑Speech
- **Cetak tiket** langsung ke printer thermal
- **Reset antrian** seluruh nomor dengan satu klik
- **Statistik menunggu** menampilkan jumlah orang yang menunggu tiap layanan
- **Keyboard shortcuts**:
  - `Enter` → Ambil nomor antrian **Layanan A** (Pendaftaran)
  - `.` atau `Delete` → Ambil nomor antrian **Layanan B** (Informasi)
  - `1`, `2`, `3` → Panggil nomor berikutnya untuk **Loket 1, 2, atau 3**
  - `4` → Panggil nomor berikutnya untuk **Loket 4** (Informasi)
  - `7`, `8`, `9` → **Panggil Ulang** nomor saat ini untuk **Loket 1, 2, atau 3**
  - `6` → **Panggil Ulang** nomor saat ini untuk **Loket 4**
  - `0` → Buka dialog **Reset Antrian** (kembali ke 0)
- **Desain modern**: animasi glow, dark mode, dan video profil

## Cara Kerja (High‑Level)
1. **Frontend** dibangun dengan **React**, **TypeScript**, dan **Vite** (folder `src/pages`).
2. **State antrian** dikelola di `src/lib/queueStore.ts`.
3. **Panggilan suara** di `src/lib/tts.ts` memakai Web Speech API.
4. **Cetak tiket** di `src/lib/printTicket.ts` berinteraksi dengan `node-thermal-printer` (via Electron).
5. **Keyboard listener** di `src/pages/Display.tsx` menangani semua shortcut dan memicu aksi di store.

## Instalasi & Menjalankan (Development)
### Prasyarat
- Node.js ≥ 18
- npm (tersedia bersama Node)
- Git

### Langkah‑langkah
```bash
# Clone repository
git clone <YOUR_GIT_URL>
cd "Pendaftaran Rudep"
# Install dependencies
npm i
# Jalankan server development
npm run dev
```
Aplikasi akan tersedia di `http://localhost:5173`.

## Build & Deploy (Production)
```bash
# Build aplikasi web
npm run build
# Jika menggunakan Electron, bangun installer
npm run electron:build   # sesuaikan dengan script di package.json
```
Hasil build berada di folder `dist/`.

## Panduan Penggunaan
- **Header**: logo Kementerian Imigrasi, nama lembaga, tanggal & jam real‑time.
- **Video profil**: diputar otomatis di pojok kanan atas.
- **Statistik**: menampilkan jumlah menunggu layanan A & B.
- **Kolom loket**: menampilkan nomor yang sedang dipanggil atau nomor terakhir.
- **Footer**: marquee teks informasi penting.
- **Dialog reset**: muncul saat menekan `0`; konfirmasi diperlukan sebelum reset.

## Kontribusi
1. Fork repository ini.
2. Buat branch baru (`git checkout -b fitur‑baru`).
3. Lakukan perubahan, pastikan linting bersih.
4. Buat Pull Request dengan deskripsi jelas.

## Lisensi
Proyek ini dilisensikan di bawah **MIT License** – lihat file `LICENSE` untuk detail.

---
*Dibuat dengan ❤️ oleh tim pengembang Pendaftaran Rudep*
