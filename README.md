```markdown
# 🧮 MathCAPTCHA v1.0.0

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Vanilla JS](https://img.shields.io/badge/javascript-ES6-yellow.svg)

**Tinggalkan tebak-tebakan gambar bus yang membosankan.** 
MathCAPTCHA adalah sistem verifikasi Anti-Bot modern yang menggunakan **Logika Matematika Dinamis**. Dibuat menggunakan murni Vanilla JavaScript (ES6 Class), API ini menghasilkan soal secara prosedural *(real-time)*, mendukung *auto-scaling*, memiliki dukungan multibahasa (10 bahasa), dan mengembalikan data melalui sistem JSON callbacks yang profesional.

🌐 **[Lihat Live Preview & Dokumentasi](https://jproject-1.github.io/captcha-math/)**

---

## ✨ Fitur Utama

*   **Logika Matematika Dinamis:** Menghasilkan soal matematika dari Aritmatika Dasar hingga Kalkulus (7 Level Kesulitan).
*   **Tanpa Dependensi Eksternal yang Rumit:** Ditulis dengan Vanilla JS (ES6 Private Fields) untuk keamanan dan performa. *(Otomatis menginjeksi Tailwind & KaTeX hanya pada kontainernya).*
*   **Tema Kustomisable (UI/UX Modern):** Mendukung Light Mode, Dark Mode, atau Auto (mengikuti preferensi sistem/halaman pengguna).
*   **Multibahasa (i18n):** Mendukung 10 bahasa termasuk Bahasa Indonesia, English, Español, Français, Deutsch, Русский, العربية, 中文, 日本語, dan हिन्दी.
*   **JSON Callbacks:** Mengembalikan respon JSON terstruktur untuk verifikasi lanjutan di Backend Anda.
*   **Sistem Proteksi:** Membatasi jumlah percobaan yang gagal (*Max Attempts*) sebelum memblokir akses sementara.

---

## 🚀 Cara Pemasangan (Instalasi)

### 1. PENTING: Gunakan standar HTML5
API ini memerlukan standar HTML5 untuk merender fitur matematika (*KaTeX*) dengan baik. Pastikan file HTML Anda memiliki *doctype*:

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <!-- meta tags... -->
</head>

```

### 2. Inisialisasi Cepat

Siapkan *container* kosong berupa tag `<div>` di dalam form Anda, lalu panggil script API MathCAPTCHA.

```html
<!-- 1. Letakkan di dalam form Anda -->
<div id="my-captcha-box"></div>

<!-- 2. Masukkan Script API di bawah form / sebelum </body> -->
<script src="[https://jproject-1.github.io/captcha-math/api.js](https://jproject-1.github.io/captcha-math/api.js)"></script>
<script>
  const myCaptcha = new MathCAPTCHA({
    containerId: 'my-captcha-box',
    mode: 'auto',           // 'light', 'dark', atau 'auto'
    language: 'id',         // Kode bahasa (id, en, es, dll)
    level: 'random',        // Tingkat kesulitan (1-7) atau 'random'
    maxAttempts: 5,         // Batas maksimal gagal

    onSuccess: (response) => {
        console.log("Verifikasi Berhasil!", response);
        // TODO: Kirim 'response.data.token' ke backend Anda untuk divalidasi
    },
    onFail: (response) => {
        console.warn("Jawaban Salah:", response);
    },
    onBlocked: (response) => {
        console.error("Akses Diblokir sementara:", response);
    }
  });
</script>

```

---

## ⚙️ Referensi API (Parameter Konfigurasi)

| Parameter | Tipe Data | Default | Deskripsi |
| --- | --- | --- | --- |
| **`containerId`** (Wajib) | `String` | `null` | ID elemen `div` tempat CAPTCHA akan di-render. |
| **`mode`** | `String` | `'light'` | Menentukan tema antarmuka widget. Opsi: `'light'`, `'dark'`, `'auto'`. |
| **`language`** | `String` | `'auto-web'` | Bahasa UI instruksi. Bisa set statis (`'id'`, `'en'`, dll), `'auto-web'` (dari tag HTML lang), atau `'auto-user'` (dari browser user). |
| **`level`** | `Int/String` | `'random'` | Tingkat kesulitan soal matematika. Gunakan `1` s/d `7`, atau `'random'` untuk acak. |
| **`maxAttempts`** | `Integer` | `5` | Batas maksimal jumlah percobaan sebelum UI diblokir. |
| **`onSuccess`** (Wajib) | `Function` | `void` | Callback yang dieksekusi saat jawaban pengguna valid/benar. |
| **`onFail`** | `Function` | `void` | Callback yang dieksekusi saat jawaban salah atau modal ditutup. |
| **`onBlocked`** | `Function` | `void` | Callback yang dieksekusi saat pengguna mencapai batas `maxAttempts`. |

---

## 📊 Tingkat Kesulitan (Levels)

* **Level 1:** Aritmatika Dasar (Tambah, Kurang, Kali, Bagi)
* **Level 2:** Akar & Pangkat Eksponen
* **Level 3:** Aljabar Dasar & Persamaan Kuadrat
* **Level 4:** Trigonometri (Sin, Cos, Tan)
* **Level 5:** Peluang (Kombinasi) & Harapan
* **Level 6:** Vektor (Dot Product)
* **Level 7:** Kalkulus Dasar (Turunan & Integral)

---

## 💻 Struktur JSON Output (Callbacks)

### Output `onSuccess`

```json
{
  "status": "success",
  "data": {
    "levelPlayed": 4,
    "attemptsUsed": 1,
    "timestamp": "2026-08-25T12:00:00.000Z",
    "token": "eyJ2YWxpZCI6dHJ1ZSwidGltZXN0YW1wIjoxNzIzNjQ1..."
  }
}

```

> 🔒 **Tips Keamanan:** Jangan hanya mengandalkan *frontend*. Kirimkan `data.token` tersebut ke *Backend* (PHP/Node.js/Python) Anda untuk diamankan/divalidasi di sisi server.

### Output `onFail` / `onBlocked`

```json
{
  "status": "failed", 
  "reason": "wrong_answer", 
  "attemptsUsed": 2,
  "maxAttempts": 5,
  "levelPlayed": 4,
  "timestamp": "2026-08-25T12:00:15.000Z"
}

```

*(Catatan: `reason` bisa berupa `"wrong_answer"` atau `"closed_by_user"`).*

---

## 🧑‍💻 Hak Cipta & Kredit

Dibuat dengan ❤️ oleh **[Jasonpw](https://jasonpw.web.id/)**
Dikelola dan dipublikasikan di bawah naungan **[YCYL STUDIO](https://ycylstudio.web.id/)** (© 2026).

```

Semoga struktur *readme* ini mempermudah pengguna untuk memahami cara kerja, cara implementasi, dan nilai tambah dari API buatan Anda ini!

```
