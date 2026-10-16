# Forum Mahasiswa

Aplikasi Forum Mahasiswa berbasis Flutter untuk mobile dan didukung oleh RESTful API Backend berbasis Node.js & Express.

---

## API Backend

Backend aplikasi ini dibangun menggunakan **Node.js**, **Express**, dan basis data **MySQL**. Struktur backend telah menerapkan **Layered Architecture (MVC)** yang bersih:
- `controllers/` : Menghandle request dan response HTTP.
- `services/` : Berisi business logic dan eksekusi query database.
- `routes/` : Mendefinisikan endpoint routing.
- `middlewares/` : Global error handler dan 404 not found handler.
- `utils/` : `ApiError` class dan `asyncHandler` wrapper.
- `config/` : Konfigurasi koneksi MySQL pool.

### Fitur Database & Skema
- **Users**: Mendukung registrasi dan login user dengan hashing password `bcrypt`.
- **Communities**: Mendukung data komunitas dan keanggotaan (`community_members`).
- **Posts**: Mendukung postingan forum dengan counter otomatis untuk votes (`post_votes`) dan komentar (`comments`).
- **Comments**: Mendukung komentar berantai / nested replies (`parent_id`) dan votes komentar (`comment_votes`).
- **Migrasi Otomatis**: Dilengkapi script `migrate.js` untuk membuat seluruh tabel dan menyuntikkan data awal (*seed data*) secara instan.

---

## Cara Menjalankan Backend Secara Lokal

### 1. Setup Database
Pastikan **MySQL** aktif (misalnya melalui XAMPP atau Laragon).
Buat database bernama `forum_db` di MySQL jika belum ada:
```sql
CREATE DATABASE IF NOT EXISTS forum_db;
```

Lalu jalankan migrasi database otomatis dari folder `API Backend/`:
```bash
cd "API Backend"
npm run migrate
```
> Atau alternatifnya, Anda dapat meng-import file `API Backend/forum_db.sql` langsung melalui phpMyAdmin.

### 2. Konfigurasi Environment Variables
Pastikan file `.env` di folder `API Backend/` sudah sesuai dengan kredensial MySQL lokal Anda:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=forum_db
PORT=8080
```

### 3. Install Dependencies & Jalankan Server
```bash
npm install
npm start
```
Server akan berjalan di **`http://localhost:8080`**.

---

## Panduan Endpoint & Contoh Testcase API

Semua route saat ini bersifat terbuka dan siap diuji melalui Postman / Thunder Client tanpa memerlukan header token Bearer.

### Info & Health Check
- `GET http://localhost:8080/` : Informasi ringkasan API & daftar endpoint
- `GET http://localhost:8080/health` : Cek status kesehatan server

---

### 1. Auth Endpoints

#### Register User
- **Method & URL**: `POST http://localhost:8080/auth/register`
- **Body** (JSON):
```json
{
  "username": "mahasiswa_baru",
  "email": "mahasiswa@kampus.ac.id",
  "password": "password123"
}
```

#### Login User
- **Method & URL**: `POST http://localhost:8080/auth/login`
- **Body** (JSON):
```json
{
  "username": "emilys",
  "password": "emilyspass"
}
```
*Catatan: Akun bawaan `emilys` / `emilyspass` sudah tersedia otomatis dari seed data.*

---

### 2. Posts Endpoints

#### Get All Posts
- **Method & URL**: `GET http://localhost:8080/posts`
- Mengembalikan daftar seluruh postingan forum beserta jumlah `upvotes` dan `comments`.

#### Get Post By ID
- **Method & URL**: `GET http://localhost:8080/posts/1`

#### Create Post
- **Method & URL**: `POST http://localhost:8080/posts`
- **Body** (JSON):
```json
{
  "title": "Tips Belajar Pemrograman Mobile",
  "content": "Gunakan Flutter dan Express untuk fullstack yang cepat",
  "user_id": 1
}
```
*(Mendukung juga alias `judul` untuk title dan `kategori` untuk content)*

#### Update Post (PUT)
- **Method & URL**: `PUT http://localhost:8080/posts/1`
- **Body** (JSON):
```json
{
  "title": "Tips Belajar Pemrograman Mobile (Revisi)",
  "content": "Materi telah diupdate secara menyeluruh"
}
```

#### Update Post Parsial (PATCH)
- **Method & URL**: `PATCH http://localhost:8080/posts/1`
- **Body** (JSON):
```json
{
  "title": "Judul Baru Saja"
}
```

#### Delete Post
- **Method & URL**: `DELETE http://localhost:8080/posts/1`

---

### 3. Users Endpoints

#### Get All Users
- **Method & URL**: `GET http://localhost:8080/users`

#### Get User By ID
- **Method & URL**: `GET http://localhost:8080/users/1`

#### Create User
- **Method & URL**: `POST http://localhost:8080/users`
- **Body** (JSON):
```json
{
  "username": "budi_santoso",
  "email": "budi@kampus.ac.id",
  "password": "password123"
}
```

#### Update User (PUT)
- **Method & URL**: `PUT http://localhost:8080/users/1`
- **Body** (JSON):
```json
{
  "username": "emilys_updated",
  "email": "emilys.new@dummyjson.com",
  "password": "newpassword123"
}
```

#### Update User Parsial (PATCH)
- **Method & URL**: `PATCH http://localhost:8080/users/1`
- **Body** (JSON):
```json
{
  "email": "emilys.updateonly@dummyjson.com"
}
```

#### Delete User
- **Method & URL**: `DELETE http://localhost:8080/users/1`
