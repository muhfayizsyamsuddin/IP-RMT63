<!--
README Documentation: Sportify Court

Sportify Court adalah aplikasi web untuk booking lapangan olahraga (futsal, badminton, basket, dll) secara online. Fitur utama meliputi pencarian lapangan, booking jadwal, pembayaran digital, rekomendasi AI, notifikasi realtime, dan dashboard admin. Stack teknologi: Express.js, React + Redux, PostgreSQL, Stripe/Midtrans, OpenAI/Gemini, Socket.IO, Nodemailer.

Struktur folder backend dan frontend dijelaskan lengkap, beserta ERD database (Users, Categories, Courts, Bookings, Payments) dan relasi antar tabel. Terdapat rencana kerja harian, flow API booking & payment, serta dokumentasi endpoint RESTful (auth, users, categories, courts, bookings, upload, AI, webhook).

Disediakan juga contoh prompt AI, user flow end-to-end, setup project (Express, Sequelize, Vite, React), konfigurasi environment (.env), dan instruksi deploy ke Vercel/Render/Firebase Hosting.

Dokumentasi ini menjadi panduan lengkap untuk pengembangan, setup, dan deployment aplikasi Sportify Court.
-->

### IP-RMT63

# Sportify Court

**SportifyCourt** adalah aplikasi berbasis web yang memungkinkan pengguna untuk mencari, melihat jadwal, dan melakukan pemesanan lapangan olahraga seperti futsal, mini soccer, badminton, basket, dan lainnya secara online. Aplikasi ini membantu pengguna menemukan lapangan yang tersedia, melakukan pembayaran, dan menerima notifikasi serta rekomendasi berbasis AI secara efisien dan real-time. Aplikasi ini dibangun dengan stack modern JavaScript (Express.js, React + Redux) dan dilengkapi dengan fitur-fitur cerdas seperti:
SportifyCourt
Pemecahan Nama:
Sportify
Gabungan dari:

Sport → olahraga
Akhiran -ify → artinya "membuat menjadi", seperti dalam simplify, clarify, beautify.

➤ Jadi, “Sportify” bisa diartikan sebagai:
“membuat sesuatu menjadi olahraga” atau “menjadikan kegiatan olahraga lebih mudah”.

**Kategori Tambahan (opsional):**

- Rent (penyewaan lapangan)
- Service (layanan booking digital)
- Community (jika ditambahkan fitur tim/turnamen)

**Alasan:**\
Aplikasi ini fokus pada **booking lapangan olahraga** seperti futsal, badminton, dan basket. Pengguna dapat memilih waktu, lokasi, dan jenis olahraga yang diinginkan. Fungsionalitas utama adalah menyewa fasilitas olahraga secara efisien berbasis web — sehingga termasuk kategori **Sport** dan subkategori **Rent/Service**.

## Fitur Utama

### User

- Login & Register (dengan Google/Github)
- Lihat dan filter daftar lapangan (dengan kategori & lokasi)
- Booking lapangan berdasarkan tanggal & jam
- Pembayaran digital melalui Midtrans/Stripe
- Upload bukti pembayaran
- Rekomendasi lapangan & jadwal dengan AI (OpenAI/Gemini)
- Riwayat booking
- Notifikasi realtime & email konfirmasi

- Registrasi & Login (dengan Google)
- Lihat & filter daftar lapangan olahraga
- Booking lapangan berdasarkan tanggal & jam
- Pembayaran digital (Stripe/Midtrans)
- Upload bukti pembayaran
- Rekomendasi lapangan & waktu dengan AI
- Notifikasi booking real-time
- Email konfirmasi otomatis
- Dashboard Admin (kelola lapangan & booking)

### Admin

- Kelola data lapangan (CRUD)
- Kelola pemesanan dan verifikasi pembayaran
- Upload gambar lapangan
- Kirim notifikasi & email ke user

| Fitur            | Keputusan                                     |
| ---------------- | --------------------------------------------- |
| Upload Bukti     | ❌ Tidak pakai `multer`                       |
| Socket.IO        | ⚠️ Opsional (di akhir)                        |
| Payments Table   | ✅ Digunakan                                  |
| Categories Table | ✅ Direkomendasikan (tidak digabung ke Court) |
| Seeding          | ✅ Untuk user admin dan kategori              |
| Nodemailer       | ⚠️ Opsional, bagus jika sempat ditambahkan    |

## 🧱 Teknologi yang Digunakan

| Stack    | Tools                                                 |
| -------- | ----------------------------------------------------- |
| Frontend | React, Vite, Redux Toolkit, Axios, Bootstrap/Tailwind |
| Backend  | Node.js, Express.js, Sequelize, PostgreSQL            |
| Auth     | JWT, Google OAuth                                     |
| Upload   | Multer                                                |
| AI       | OpenAI / Gemini API                                   |
| Payment  | Stripe / Midtrans                                     |
| Realtime | Socket.IO                                             |
| Mail     | Nodemailer(`optional`)                                |
| Deploy   | Vercel (FE), Render/Railway (BE)                      |

## 🗂 Struktur Folder Project Fullstack

### 📁 Backend (Express.js)

```
backend/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── seeders/
├── migrations/
├── config/
├── helpers/
├── uploads/ (untuk multer)
├── .env
├── app.js
└── server.js
```

```
backend/
├── config/
│   └── config.js           # Konfigurasi database Sequelize
├── controllers/
│   └── authController.js   # Login, register, google login
│   └── courtController.js  # Get courts, detail, add/edit/delete (admin)
│   └── bookingController.js
│   └── paymentController.js
├── helpers/
│   └── hash.js             # hashPassword, comparePassword
│   └── jwt.js              # signToken, verifyToken
├── middlewares/
│   └── auth.js             # auth middleware (JWT check)
│   └── errorHandler.js     # error handling
├── migrations/             # Otomatis oleh Sequelize
├── models/
│   └── index.js
│   └── user.js
│   └── court.js
│   └── booking.js
│   └── payment.js
├── routes/
│   └── auth.js             # /auth/login, /auth/register
│   └── courts.js           # /courts
│   └── bookings.js
│   └── payments.js
│   └── index.js            # Gabungkan semua router
├── seeders/                # Untuk data dummy awal
├── uploads/                # (kalau pakai multer, tapi kamu skip)
├── .env                    # Isi dengan DB_HOST, DB_NAME, dll
├── .gitignore              # ⛔️ Jangan push node_modules, .env
├── package.json
├── app.js                  # App Express utama (pakai di server.js)
└── server.js               # Jalankan app.listen()
```

### 📁 Frontend (React + Vite + Redux)

```
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── features/ (Redux slice)
│   ├── pages/
│   ├── services/ (axios instance)
│   ├── store/
│   ├── App.jsx
│   └── main.jsx
├── .env
└── vite.config.js
```

---

## 🧩 Struktur Database & ERD Detail

### 1. Users

- id (PK)
- name
- email (unique)
- password
- role ("user" | "admin")
- createdAt
- updatedAt

### 2. Categories

- id (PK)
- name (e.g., Futsal, Badminton, Basket)
- createdAt
- updatedAt

### 3. Courts

- id (PK)
- name
- location
- pricePerHour
- description
- imageUrl
- categoryId (FK → Categories)
- createdAt
- updatedAt

### 4. Bookings

- id (PK)
- userId (FK → Users)
- courtId (FK → Courts)
- date
- timeStart
- timeEnd
- status ("pending" | "paid" | "cancelled")
- paymentUrl (dari Midtrans/Stripe)
- createdAt
- updatedAt

### 5. Payments _(opsional jika detail payment dipisah)_

- id (PK)
- bookingId (FK) ✅
- amount ✅
- method (e.g., Midtrans, Stripe)
- status ✅
- proofImageUrl (jika manual transfer)
- createdAt
- updatedAt

### Relasi Antar Tabel

- One-to-Many: **Users → Bookings**
- One-to-Many: **Categories → Courts**
- One-to-Many: **Courts → Bookings**
- One-to-One: **Bookings → Payments**

  🔗 Relasi:
  1 Category → banyak Courts
  🔗 Relasi:
  1 Court → banyak Booking
  1 Court → milik 1 Category
  🔗 Relasi:
  1 Booking → milik 1 User
  1 Booking → milik 1 Court
  🔗 Relasi:
  1 Payment → milik 1 Booking

```bash
Users 1 ─────< N Bookings
Categories 1 ─────< N Courts
Courts 1 ─────< N Bookings
Bookings 1 ───── 1 Payments
```

---

## Rencana Kerja 5 Hari (Senin–Jumat)

### Hari 1 (Senin)

- Tentukan tema & fitur utama ✅
- Buat ERD & struktur tabel ✅
- Setup project backend + database PostgreSQL
- Setup project frontend (Vite + React + Tailwind/Bootstrap)
- Mulai setup auth user (register/login)

### ✅ Hari 2 (Selasa)

- Selesaikan CRUD user, court, category (BE)
- Integrasi Redux + Fetch lapangan dari backend (FE)
- Implementasi auth frontend (login/register)
- Rancang halaman Home dan List Lapangan

### ✅ Hari 3 (Rabu)

- CRUD booking
- Halaman booking (form pilih tanggal & jam)
- Fitur upload bukti bayar (multer)
- Kirim email konfirmasi (nodemailer)

### ✅ Hari 4 (Kamis)

- Integrasi OpenAI/Gemini (rekomendasi)
- Integrasi Stripe/Midtrans (simulasi payment)
- Integrasi realtime (Socket.IO untuk notif)
- Admin dashboard (manajemen booking + upload lapangan)

### ✅ Hari 5 (Jumat)

- Finalisasi fitur
- Deploy frontend (Vercel) & backend (Render)
- Buat README & dokumentasi PDF
- Latihan demo presentasi ke hiring partner

---

## 🔁 Flow API

1. Client mengirim permintaan booking ke server
2. Server cek ketersediaan lapangan (validasi jadwal)
3. Jika tersedia, booking dibuat dan status = "pending"
4. User melakukan pembayaran via payment gateway
5. Callback webhook → update status jadi "paid"
6. Email dikirim ke user
7. Notifikasi dikirim realtime (Socket.IO)

---

## 📘 Dokumentasi Endpoint API (RESTful)

### Auth

- `POST /register` → Register user baru
- `POST /login` → Login dan generate access token

### Users

- `GET /users` → Get semua user (admin only)
- `GET /users/:id` → Detail user by ID
- `DELETE /users/:id` → Hapus user (admin)

### Categories

- `GET /categories` → Ambil semua kategori olahraga
- `POST /categories` → Tambah kategori (admin)
- `PUT /categories/:id` → Edit kategori (admin)
- `DELETE /categories/:id` → Hapus kategori (admin)

### Courts

- `GET /courts` → Ambil semua lapangan (filter by kategori/area)
- `GET /courts/:id` → Detail lapangan
- `POST /courts` → Tambah lapangan (admin)
- `PUT /courts/:id` → Edit lapangan (admin)
- `DELETE /courts/:id` → Hapus lapangan (admin)

### Bookings

- `GET /bookings` → Get semua booking milik user login
- `POST /bookings` → Booking lapangan
- `PUT /bookings/:id/pay` → Update status booking jadi "paid"
- `DELETE /bookings/:id` → Batalkan booking

### Upload (Bukti Pembayaran)

- `POST /upload` → Upload bukti transfer (multer)

### AI Recommendation

- `POST /recommend` → Kirim prompt ke AI, return rekomendasi lapangan

### Webhook

- `POST /payment/webhook` → Callback Midtrans/Stripe untuk update status pembayaran

---

## 💡 AI Prompt Example (OpenAI)

**Prompt:**

> "Saya ingin main futsal besok sore jam 5 di Jakarta, lapangan apa yang tersedia?"

**Response AI (berbasis data court + booking):**

> "Lapangan Futsal Senayan masih tersedia pukul 17.00 - 18.00. Ingin saya bookingkan?"

---

### 🧭 User Flow (End-to-End)

1️⃣ User membuka halaman utama

Melihat daftar lapangan

Filter berdasarkan kategori/lokasi/harga

2️⃣ Register atau Login

Form input email & password

Simpan JWT token ke localStorage

3️⃣ Pilih Lapangan & Booking

Isi form tanggal & jam

Kirim booking ke backend

Status booking: "pending"

4️⃣ Pembayaran

Upload bukti bayar atau redirect ke Midtrans

Status berubah jadi "paid"

5️⃣ Konfirmasi

Kirim email ke user

Notifikasi realtime (Socket.IO)

Booking muncul di halaman "My Booking"

6️⃣ Pembatalan (opsional)

Bisa cancel booking jika belum dibayar

7️⃣ Admin Panel

Melihat & mengelola data: user, booking, lapangan

# Setup Project

1. Init project express, install deps

```bash
npm init -y
npm install express cors dotenv pg sequelize bcryptjs jsonwebtoken
npm install --save-dev sequelize-cli nodemon jest supertest
```

2. Init sequelize, (ubah config nya untuk dev dan test environment) -> `postgres`

```bash
npx sequelize-cli init
touch .gitignore
```

a. membuat .env
Isi .env biasanya: - Password database - API key (contoh: OpenAI, Midtrans) - Secret JWT token - Konfigurasi server 3. bikin migration, model

```bash
npx sequelize-cli model:generate --name User --attributes name:string,email:string,password:string,role:string
npx sequelize-cli model:generate --name Court --attributes name:string,category:string,location:string,pricePerHour:integer,description:text,imageUrl:string
npx sequelize-cli model:generate --name Booking --attributes userId:integer,courtId:integer,date:dateOnly,timeStart:time,timeEnd:time,status:string
npx sequelize-cli model:generate --name Payment --attributes bookingId:integer,amount:integer,method:string,status:string,paymentUrl:string,paidAt:date
```

4. setup validation, constraint (optional)
   - tambahkan unique dan allowNull false
   - model validation
5. setup association
   - one to many
6. bikin seeders -> edit file seed

```bash
npx sequelize-cli seed:generate --name demo-users
npx sequelize-cli seed:generate --name demo-courts
```

colom tambahan:

```bash
npx sequelize migration:generate --name add-isPaid-to-bookings
```

7. migrate and seed

```bash
npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:seed:all
```

8. hello world express
9. Setup test -> samakan dengan development (`tambah "_test" di db`)

- package.json (script) :
  "test"-> "jest"
  "dev" -> "nodemon bin/www" (export app dari app.js)

10. testing

```bash
npx sequelize --env test db:create
npx sequelize --env test db:migrate
```

# Database Configuration

DB_USER=your_postgres_username
DB_PASS=your_postgres_password
DB_NAME=sportify_dev
DB_NAME_TEST=sportify_test
DB_NAME_PROD=sportify_prod
DB_HOST=127.0.0.1

# Server Configuration

PORT=3000

# JWT

JWT_SECRET=your_jwt_secret

# OpenAI API Key (optional jika pakai AI)

OPENAI_API_KEY=your_openai_key

# Midtrans (optional jika pakai pembayaran)

MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_SERVER_KEY=your_midtrans_server_key

amount status paiddate

### SETUP

```bash
npm create vite@latest
cd sportify-court
npm i axios react-router
npm run dev
```

```bash
npm install google-auth-library --save
npm install midtrans-client
```

Server Key=
Client Key =

### Deploy

```bash
npm run build (sesuaikan -> sejajar di package.json)
```

https://23c93f035a9f.ngrok-free.app/payments/midtrans/callback

create projek ke fire base

```bash
npm i -g firebase-tools
firebase login
n
n
login akun google
firebase init hosting
y
Use an existing project
pilih project
dist
y
n
n
firebase deploy
```

### RE- DEPLOY

```bash
npm run build
firebase deploy
```

# Setup Project SERVER

1. Init project express, install deps

```bash
npm init -y
npm i express sequelize pg bcryptjs jsonwebtoken
npm i -D jest supertest sequelize-cli nodemon
```

2. Init sequelize, (ubah config nya untuk dev dan test environment) -> `postgres`

```bash
npx sequelize init
touch .gitignore
```

3. bikin migration, model

```bash
npx sequelize model:create --name User --attributes email:string,password:string
npx sequelize model:create --name Grocery --attributes title:string,price:integer,tag:string,imageUrl:string,UserId:integer
```

4. setup validation, constraint (optional)
   - tambahkan unique dan allowNull false
   - model validation
5. setup association
   - one to many
6. bikin seeders -> edit file seed

```bash
npx sequelize seed:create --name data
```

7. migrate and seed

```bash
npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:seed:all
```

8. hello world express
9. Setup test -> samakan dengan development (`tambah "_test" di db`)

- package.json (script) :
  "test"-> "jest"
  "dev" -> "nodemon bin/www" (export app dari app.js)

10. testing

```bash
npx sequelize --env test db:create
npx sequelize --env test db:migrate
```

# SETUP CLIENT

```bash
npm create vite@latest
cd sportify-court
npm i axios react-router
npm run dev
```
