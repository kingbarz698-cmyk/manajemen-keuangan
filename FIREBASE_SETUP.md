# Setup Firebase — Langkah Manual yang Wajib Dilakukan

Kode aplikasi sudah terhubung ke Firebase, tapi ada bagian yang **tidak bisa otomatis** karena harus dilakukan lewat Firebase Console atau CLI di komputermu sendiri.

## 1. Deploy Firestore Security Rules

File `firestore.rules` di root project ini **belum aktif** di project Firebase-mu sampai kamu deploy secara manual. Tanpa ini, database masih memakai rule default (yang kamu pilih "production mode" — defaultnya menolak SEMUA akses, jadi app tidak akan bisa baca/tulis apa pun sampai rules ini di-deploy).

Cara paling mudah, lewat Firebase Console (tanpa install CLI):

1. Buka https://console.firebase.google.com, pilih project `lasave-a18ca`.
2. Sidebar kiri: **Build > Firestore Database**.
3. Klik tab **Rules** di bagian atas.
4. Hapus semua isi editor, lalu salin-tempel seluruh isi file `firestore.rules` dari project ini.
5. Klik **Publish**.

Cara alternatif lewat Firebase CLI (kalau nanti mau otomatisasi):
```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # pilih project lasave-a18ca, pakai firestore.rules yang sudah ada
firebase deploy --only firestore:rules
```

## 2. Aktifkan Google Sign-In (kalau belum)

Kalau sebelumnya cuma mengaktifkan Email/Password saja:

1. **Build > Authentication > Sign-in method**.
2. Klik provider **Google**, toggle Enable, pilih support email, Save.

## 3. Tambahkan domain ke Authorized Domains (kalau deploy ke hosting)

Kalau nanti app ini di-deploy ke domain selain `localhost` (misal Vercel, Netlify, Firebase Hosting), Google Sign-In akan gagal kecuali domain itu didaftarkan:

1. **Build > Authentication > Settings > Authorized domains**.
2. Klik **Add domain**, masukkan domain produksimu.

`localhost` sudah otomatis ada di daftar ini secara default, jadi development di komputermu seharusnya langsung bisa.

## 4. Composite Index (mungkin perlu, tergantung penggunaan nyata)

Firestore butuh index khusus untuk beberapa kombinasi query. Query yang dipakai aplikasi ini saat ini semuanya `where("userId", "==", uid)` tunggal (atau `where("ownerId", "==", uid)` untuk goals) tanpa `orderBy` tambahan — ini **biasanya** tidak butuh composite index karena Firestore otomatis membuat single-field index.

Tapi saya tidak punya akses untuk benar-benar menjalankan query ini melawan project Firebase-mu, jadi tidak bisa memastikan 100%. Kalau nanti muncul error seperti ini di console browser saat memakai app:

```
FirebaseError: The query requires an index. You can create it here: https://console.firebase.google.com/...
```

Klik link di error itu — Firebase akan otomatis membuka halaman pembuatan index dengan konfigurasi yang sudah terisi benar, tinggal klik **Create**. Tunggu beberapa menit sampai status index jadi "Enabled", lalu coba lagi.

## 5. Verifikasi manual yang wajib dilakukan (checklist)

Karena saya tidak bisa menjalankan kode ini melawan Firebase sungguhan dari sandbox, tolong cek satu per satu setelah `npm run dev`:

- [ ] Register akun baru dengan email/password → cek di **Authentication > Users**, akun baru harus muncul di sana.
- [ ] Cek di **Firestore Database > Data**, collection `users` harus punya dokumen baru dengan `uid` yang sama.
- [ ] Login dengan Google → popup Google muncul, setelah pilih akun, harus langsung masuk ke Dashboard.
- [ ] Tambah satu wallet, satu transaksi, satu goal → cek masing-masing collection (`wallets`, `income`/`expenses`, `goals`) di Firestore Console, dokumennya harus muncul dengan `userId`/`ownerId` yang cocok dengan uid akun yang login.
- [ ] Logout, lalu register akun KEDUA dengan email berbeda → akun kedua ini harus melihat dashboard kosong (tidak ada wallet/transaksi/goal dari akun pertama). Ini yang paling penting untuk membuktikan isolasi data per akun benar-benar bekerja.
- [ ] Refresh halaman (F5) saat sedang login → seharusnya tetap di halaman yang sama, tidak ter-redirect ke login (membuktikan sesi persisten).
- [ ] Coba akses `/dashboard` langsung dari address bar tanpa login (mode incognito) → harus ter-redirect ke `/login`.

Kalau salah satu dari ini gagal, kemungkinan besar penyebabnya rules belum di-deploy (langkah 1) atau ada typo di `.env`. Beri tahu saya pesan error yang muncul di console browser (F12 > Console) supaya saya bisa bantu diagnosis lebih lanjut.
