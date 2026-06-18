# Làsave — Vite + React + TypeScript + Firebase

## Setup

```bash
npm install
npm run dev        # development server (localhost:5173)
npm run build       # production build (cek tipe + bundle)
npm run typecheck   # cek tipe TypeScript saja, tanpa build
```

`.env` sudah berisi config Firebase project `lasave-a18ca`. Lihat `FIREBASE_SETUP.md` untuk langkah deploy Security Rules dan hal-hal yang **belum bisa diverifikasi otomatis** (lihat bagian "Yang belum diverifikasi" di bawah — penting dibaca sebelum anggap semua ini sudah pasti benar).

## Status

Backend sekarang Firebase sungguhan (Authentication + Firestore), bukan lagi mock data. Setiap akun punya datanya sendiri, terisolasi lewat Firestore Security Rules (`firestore.rules`) berdasarkan `uid` yang sedang login.

| Bagian | Status |
|---|---|
| Login Email/Password | Terhubung ke Firebase Auth |
| Login Google | Terhubung ke Firebase Auth (popup) |
| Register | Terhubung ke Firebase Auth + buat dokumen `users/{uid}` |
| Sesi persisten antar refresh | Ya, via `onAuthStateChanged` |
| Route guard | Ya — halaman app redirect ke `/login` jika belum masuk; halaman login/register redirect ke `/dashboard` jika sudah masuk |
| Wallets, Transactions, Goals, Budget | Semua baca/tulis ke Firestore, difilter per `uid` |
| Data mock lama | Dihapus seluruhnya (`src/services/mocks/`) — akun baru mulai kosong |

## Struktur Firestore (mengikuti PRD §31)

```
users/{uid}            — profil (name, email, photoURL, bio, phoneNumber)
wallets/{walletId}      — userId, type, name, balance, transactionCount, color
income/{incomeId}       — userId, walletId, category, amount, date, note
expenses/{expenseId}    — userId, walletId, category, amount, date, note
goals/{goalId}          — ownerId (bukan userId — sesuai PRD), name, targetAmount, monthlyTarget, currentAmount, deadline
goal_contributions/{id} — goalId, walletId, amount, date (immutable, tidak bisa diupdate)
budgets/{budgetId}      — userId, scope, category, limitAmount, period
```

PRD memisahkan `income` dan `expenses` jadi dua collection, bukan satu `transactions`. Kode aplikasi (`transaction.service.ts`) membaca dari keduanya dan menggabungkannya jadi satu array `Transaction[]` untuk UI — jadi komponen di `features/transactions/` tidak perlu tahu soal pemisahan ini.

## Perbaikan yang ikut dilakukan saat migrasi ini

Dua hal yang sebelumnya tidak konsisten secara nyata di mock, sekarang diperbaiki karena dengan database sungguhan ketidakkonsistenan ini jadi masalah nyata, bukan kosmetik:

1. **Membuat transaksi sekarang benar-benar mengurangi/menambah `balance` wallet terkait** (lewat `adjustWalletBalance`, dijalankan sebagai Firestore transaction agar atomic). Sebelumnya, mock cuma menambah transaksi ke daftar tanpa pernah menyentuh balance wallet — itu sebabnya angka di mock kelihatan konsisten, tapi cuma karena dikalibrasi manual, bukan dihitung dari relasi nyata.
2. **Kontribusi ke goal ("Setor Tabungan") sekarang mengurangi balance wallet asal**, bukan cuma menambah `currentAmount` goal tanpa sumber. Tanpa ini, secara logika user bisa "menciptakan" uang dari mana saja.

## Yang belum diverifikasi (penting)

Sandbox tempat kode ini ditulis **tidak punya akses jaringan ke domain Firebase apa pun** (`firebaseapp.com`, `googleapis.com`, dst). Artinya semua kode di atas sudah benar secara TypeScript (lolos `tsc --noEmit` dan `vite build`), tapi **belum pernah benar-benar dipanggil ke Firestore/Firebase Auth sungguhan**. Yang wajib dicek sendiri setelah deploy:

- Apakah login email/password, Google Sign-In, dan register benar-benar berhasil membuat user di Firebase Console > Authentication.
- Apakah dokumen `users/{uid}` benar-benar muncul di Firestore Console setelah register.
- Apakah Security Rules (lihat `FIREBASE_SETUP.md`) benar-benar memblokir akses ke data orang lain — coba login dua akun berbeda di browser berbeda, pastikan datanya benar-benar terpisah.
- Apakah ada error "The query requires an index" di console browser — kalau muncul, klik link yang Firebase berikan di error itu untuk membuat composite index secara otomatis (perlu dilakukan sekali per query kompleks; saya tidak bisa memprediksi pasti query mana yang akan butuh ini tanpa benar-benar menjalankannya).

## Catatan Arsitektur

- **Auth**: Firebase Authentication (Email/Password + Google). `AuthContext` membedakan `isInitializing` (saat Firebase mengecek sesi tersimpan pertama kali — dipakai route guard) dari `isLoading` (saat tombol login/register sedang diproses — dipakai disable tombol).
- **Database**: Firestore. Setiap service (`wallet.service.ts`, dst) memanggil `auth.currentUser?.uid` sendiri, bukan menerima `uid` sebagai parameter dari caller — supaya signature di `hooks/` tidak berubah.
- **Keamanan**: `firestore.rules` di root project ini bukan auto-deploy — lihat `FIREBASE_SETUP.md` untuk cara deploy ke project Firebase sungguhan.
- **Type safety**: Tidak ada satupun penggunaan `any` (`strict: true` + `noImplicitAny`, dikonfirmasi via grep). Data dari Firestore (`DocumentData`, tipenya longgar di SDK) selalu di-assert ke interface lokal (`*DocShape`) sebelum dipakai, bukan dibiarkan `any`.
- **Budget periode**: belum benar-benar memfilter transaksi berdasarkan bulan (`budget.period`) — semua expense dianggap masuk periode aktif. Ini gap yang sudah ada sejak versi mock, migrasi Firebase ini tidak otomatis memperbaikinya (lihat komentar di `budget.service.ts`).
