# Setup Google Apps Script

Spreadsheet ID sudah dikonfigurasi untuk:

`1QAOKvy8XGnN8YlFwdOQZcW3hxAG0V546EGu8dzwd_AM`

## Pemasangan

1. Login ke akun Google pemilik Sheet.
2. Buka Sheet, lalu pilih **Ekstensi → Apps Script**.
3. Hapus isi `Code.gs`, kemudian paste isi file `Code.gs` dari folder ini.
4. Buka **Project Settings → Script Properties**.
5. Tambahkan properti `API_TOKEN` dengan nilai acak yang panjang, minimal 32 karakter.
6. Pilih **Deploy → New deployment → Web app**.
7. Pilih **Execute as: Me** dan **Who has access: Anyone**.
8. Klik **Deploy**, selesaikan otorisasi, lalu salin URL Web App yang berakhiran `/exec`.

Jangan menyimpan `API_TOKEN` di kode frontend. Token dan URL Web App akan dipasang sebagai environment variable pada server/VPS.
# Deployment aktif

- Web App URL: `https://script.google.com/macros/s/AKfycbzPDvfeJwh6VTZrtD5CmMrPac6gylkKgOQS-AOreoVwFasGBWE9R_fNU6SwnWVuBsyl/exec`
- Jalankan sebagai: pemilik script
- Akses: Anyone

Website menggunakan dua environment variable berikut. Simpan nilainya hanya di server/VPS dan jangan masukkan token ke source control:

```env
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzPDvfeJwh6VTZrtD5CmMrPac6gylkKgOQS-AOreoVwFasGBWE9R_fNU6SwnWVuBsyl/exec
GOOGLE_APPS_SCRIPT_TOKEN=<nilai API_TOKEN dari Script Properties>
```

