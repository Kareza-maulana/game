# Cahaya Kadiri

Kampanye platformer **Prolog sampai Epilog** berdasarkan [GDD v2.0](gdd-candra-kirana.md), dengan sembilan scene GDevelop. Versi 0.2 memperluas prototipe Petirtaan menjadi perjalanan lengkap; seni final, sinematik dan audio masih perlu penyempurnaan.

## Mainkan

Klik dua kali **mainkan.bat**, atau jalankan:

```powershell
npm.cmd start
```

Buka **http://127.0.0.1:3100**. Jangan membuka dist/index.html melalui file:// karena pemuatan aset memerlukan server lokal. Game berjalan tanpa internet setelah file tersedia. Server/build memakai Node.js 22.

**Ukuran game siap diunggah: 87,71 MB** (folder `dist/`, termasuk ilustrasi cerita baru). Cukup unggah isi `dist/` ke hosting; folder `assets/`, `karakter/`, `node_modules/`, laporan, dan hasil tes adalah berkas produksi, tidak ikut diunduh pemain. Sebanyak 94 gambar runtime menggunakan WebP lossless pada resolusi semula; setiap piksel RGBA diverifikasi identik. Tidak ada penurunan resolusi atau jumlah warna dalam optimasi ini. Sprite asli pengguna tetap di `karakter/`.

Build membuat ekspor baru, membersihkan berkas ekspor lama, dan menolak hasil yang mencapai 100.000.000 byte. Laporan ukuran: `docs/build-size.json`; perbandingan: `docs/optimization-report.json`. Raw generasi, PNG yang sudah diganti WebP, master objek besar yang telah digantikan aset runtime, dan preview/NPC lama telah dibersihkan; daftar lengkap beserta hash ada di `docs/asset-cleanup.json`. Prompt dan laporan generasi tetap disimpan.

Untuk mengedit visual, buka **cahaya-kadiri.json** di GDevelop 5. Gerak dan collision memakai behavior Platformer/Platform. Quest dan UI menggunakan JavaScript event. Resolusi dasar 480 × 270; area pandang menyesuaikan rasio jendela agar kanvas memenuhi layar tanpa meregangkan gambar.

## Kontrol

| Aksi | Keyboard |
|---|---|
| Bergerak | ← → / A D |
| Naik/turun tangga | ↑ ↓ / W S |
| Lompat | Z / Spasi |
| Turun menembus pijakan tipis | ↓ + Z |
| Lari setelah Asih | Shift + arah |
| Geser setelah Asih | ↓ + arah |
| Sorot setelah Sabar / baca sambil diam | Tahan X |
| Lompat ganda setelah Wani | Z lagi di udara |
| Kibas setelah Andhap | Ketuk X |
| Dash setelah Setya | Ketuk arah dua kali |
| Bicara / periksa | C / E |
| Jurnal / jeda | J / Esc |
| Layar penuh | Tombol ⛶ di kanan atas |

Untuk membaca pahatan, berdiri diam di dekatnya dan tahan X sampai isi muncul otomatis. Pahatan goa yang sudah terbaca dapat dibuka ulang dengan C, termasuk setelah melanjutkan save.

Quest goa memiliki empat langkah dan penunjuk tujuan yang mengikuti posisi pemain. **Damar Jurang** adalah obor emas berlabel di teras sebelum jembatan putus: mendekatinya menyimpan perjalanan dan mengisi minyak; C mengisi penuh. Dari teras itu, hadap kanan, tahan X sambil melompat dengan Z, lalu tetap tahan X dan tekan C di dekat Wani. Jika sudah sampai Kilisuci tanpa Wani, ikuti penunjuk ke bawah dan gunakan ↓ + Z untuk turun menembus lantai. Lima cerukan puzzle memakai bentuk lima lilin kecil, berbeda dari obor damar.

Di ponsel, tombol arah berbentuk silang berada di kiri, dengan **Lompat** dan **Interaksi** di kanan. Ketuk **Pelita** untuk menyalakan/mematikan Sorot sehingga dua jari tetap bisa dipakai bergerak dan melompat. **Lari** juga memakai sakelar ketuk setelah Asih; **Kibas** mendapat tombol terpisah setelah Andhap. Turun + Lompat menembus pijakan tipis, dan ketuk arah dua kali untuk dash setelah Setya. Jurnal, jeda, perubahan orientasi, dan sentuhan terputus melepas input agar karakter tidak berjalan sendiri.

Game mencoba mengunci **landscape** ketika dibuka pada perangkat sentuh, lalu meminta layar penuh dan landscape lewat ketukan pertama. Dukungan rotasi mengikuti browser/perangkat: jika API ditolak atau tidak tersedia (termasuk sebagian browser iPhone), petunjuk memiringkan ponsel ditampilkan. Permainan dijeda selama portrait dan dilanjutkan lewat menu setelah kembali landscape. Manifest aplikasi juga menggunakan landscape. Kontrol memperhitungkan safe area/notch; tombol sentuh minimal 44 piksel.

Dialog memiliki Lanjut, Auto, dan Lewati setelah dua detik. Jurnal dan menu menjeda fisika. Tersapu kabut mengembalikan pemain ke damar tanpa kehilangan serat.

Menu jeda menyediakan volume **Suasana**, **Musik**, **Efek suara**, serta mute. Pengaturannya tersimpan terpisah dari progres. Audio aktif setelah interaksi pertama, memakai ambience per lokasi dan efek langkah, lompat, mendarat, pelita, serta penemuan serat. Kamera menahan lompatan biasa dan perubahan arah kecil, lalu mengikuti perpindahan lantai atau gerakan yang mendekati batas pandangan.

Setelah menamatkan epilog, pop-up **Komentar atau tanggapan** muncul otomatis, termasuk setelah dialog ending emas. Pemain dapat mengirim tanggapan (maksimal 1.500 karakter) ke tabel Supabase `komentar`, melewati formulir, atau membukanya lagi lewat **Tulis tanggapan** pada layar penutup. Payload hanya `{komentar: teks}`; `id` dan `created_at` menggunakan default database. Tidak ada library tambahan: browser memakai REST POST dengan `Prefer: return=minimal`, sehingga tidak memerlukan akses baca komentar. Setelah berhasil, teks yang sama tidak dikirim ulang; komentar berbeda dikirim sebagai tanggapan baru. Tombol **Kembali ke beranda** pada pop-up dan layar penutup membuka `https://login.ukmpp.or.id` di tab yang sama.

Draf tetap disimpan di perangkat sampai server mengonfirmasi sukses. Saat jaringan gagal atau izin RLS menolak, komentar tetap tersedia untuk dicoba lagi; UI tidak menampilkan sukses palsu. Pengiriman tetap bekerja jika localStorage diblokir. Draf lama dari versi lokal dapat dikirim melalui tombol **Kirim tanggapan**; tidak ada pengiriman diam-diam. Timeout 12 detik, tanpa retry otomatis. Penyimpanan lokal memakai `cahayakadiri_feedback` (konfirmasi kirim) dan `cahayakadiri_feedback_draft`.

Konfigurasi Supabase ada di `src/site-config.json`: URL, **anon key publik**, tabel, dan kolom isi. Sebelum digunakan, jalankan `supabase/komentar-insert.sql` di SQL Editor Supabase untuk memberi `anon` kebijakan INSERT komentar nonkosong maksimal 1.500 karakter. RLS tetap aktif; skrip ini tidak memberi akses baca/edit/hapus. Jangan menggunakan service-role key di game. Setelah SQL diterapkan, pengiriman nyata berhasil (HTTP 201). Satu baris berlabel `[UJI INTEGRASI CAHAYA KADIRI]` tersimpan sebagai verifikasi; pengujian browser berikutnya memakai respons simulasi agar tidak menambah komentar uji. Panduan izin: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

Ilustrasi cerita kini hadir saat memasuki sembilan scene, pada aksi/pertemuan penting, dan pada tujuh kilas balik Serat. **27 ilustrasi dan 8 potret** ada di `assets/story/`. Potret Kirana berada di kanan dialog; NPC di kiri; narasi tanpa potret. Bayang Galuh menggunakan potret Putri dengan efek bayangan. Gambar berganti dengan crossfade, map berganti melalui fade singkat, dan preferensi reduced motion mematikan animasi fade. Lanjut, Auto, dan Lewati setelah dua detik tetap tersedia; gameplay berhenti selama dialog. Debat Ki Samar juga memakai potret.

Ilustrasi dimuat sesuai kebutuhan, dengan prefetch hanya gambar berikutnya. Tidak ada unduhan ilustrasi cerita pada layar judul. Ekspor baru berupa WebP lossless pada kanvas maksimum 1280 × 720 untuk adegan dan 384 × 512 untuk potret; semua gambar map/sprite lama dipertahankan. Potret baru adalah satu pose per tokoh, belum empat ekspresi GDD. Cakupan lukisan diperluas atas permintaan pengguna dari batas tujuh gambar pada GDD awal. Sumber urutan: `src/storyboard.json`; prompt: `assets/prompts/story/`; catatan hasil: `assets/prompts/story/generated.json`. Gambar dibuat melalui GPT bawaan `image_gen`, diekspor dengan fungsi fit sprite-gen. Jalur CLI sprite-gen sempat ditolak karena model akun; hasil akhir menggunakan jalur GPT bawaan, bukan API berbayar lain.

## Isi kampanye

| Area | Quest utama | Material pijakan |
|---|---|---|
| Perpustakaan | Buku, lampu, tangga dan portal | Kayu tua |
| Pasar | Pesanan Mbok, lutung, Asih, dakon | Atap rumbia dan batu dermaga |
| Petirtaan | Air, Sabar, relief, Jujur | Andesit berlumut |
| Bukit/Goa | Wani, Kilisuci, cerukan, Andhap, pelarian | Batu alam berlapis |
| Gerbang | Empat petunjuk, DAHA, Setya | Bata merah |
| Kedaton | Tapak Hampa, Bayang Galuh, lonceng, pusaka | Kayu ukir |
| Bangsal | Pilar, Wicaksana, argumen Ki Samar | Batu ungu beraksen cahaya |
| Kamar Putri | Manuskrip tujuh serat | Kayu dengan tatahan emas |
| Epilog | Buku pulih, poster dan ending | Kayu perpustakaan |

Dua belas Kidung memiliki sumber dalam jurnal. Save lokal mendukung migrasi prototipe Petirtaan. Tab Perjalanan memungkinkan kunjungan kembali ke area terbuka.

Sprite Kirana memakai animasi asli pengguna; gerak kiri memakai flip. Pose geser sementara diturunkan dari animasi East tanpa mengubah file asli. Latar, NPC dan sembilan material jalan dibuat melalui **sprite-gen dengan GPT**, dengan prompt/laporan di assets/. Pijakan menampilkan permukaan atas dan sisi bertekstur sesuai lokasi, diulang secara modular tanpa meregangkan seluruh platform. Panorama keluar goa menampilkan sungai, sawah, pepohonan, air terjun dan permukiman berlapis.

Alamat UKM dan tanggal kegiatan **dikosongkan sesuai permintaan pengguna**. Isi src/site-config.json lalu build ulang ketika datanya siap.

Objek lingkungan kini memakai cutout bertekstur: relief khusus tiap lokasi, gerbang batu dan pintu kayu, damar, cerukan, lonceng, pilar, buku, rak, keranjang, tangga, kendi, cermin, dakon, lemari pusaka dan meja manuskrip. Bentuk objek mengikuti fungsinya; posisi interaksi dan collision tetap mengacu pada data level. Prompt, gambar raw, serta laporan transparansi disimpan bersama aset di `assets/`.

Spritesheet NPC dari pengguna sudah digunakan: **Ki Jati 6 frame, Dewi Kilisuci 10 frame, penjaga 6 frame**. Setiap frame tersimpan terpisah di `assets/npc/` dengan ukuran kanvas yang sama dalam satu animasi. File sumber di `karakter/` tetap utuh. Penjaga Gerbang dan penjaga di Pasar memakai sprite penjaga sendiri.

## Build dan pemeriksaan

```powershell
npm.cmd ci
npm.cmd run build
npm.cmd test
python tools/verify-assets.py
node tools/campaign-smoke.mjs
node tools/campaign-playthrough.mjs
node tools/mobile-check.mjs
node tools/mobile-regression.mjs
node tools/feedback-check.mjs
node tools/story-check.mjs
node tools/cave-regression.mjs
node tools/polish-check.mjs
node tools/npc-check.mjs
```

Uji browser membutuhkan server aktif dan Chrome pada lokasi standar Windows. Lihat [hasil validasi](docs/VALIDASI.md) dan [catatan produksi](docs/PRODUKSI.md) untuk cakupan serta batasan.

Build menghasilkan ulang cahaya-kadiri.json dan dist/. Simpan salinan jika mengedit JSON langsung di GDevelop agar perubahan editor tidak tertimpa generator.

- src/levels.mjs: sembilan peta.
- src/campaign-model.mjs: progres, save dan gerbang quest.
- src/campaign-runtime.js: input, puzzle dan integrasi engine.
- src/mobile-controls.js dan src/mobile.css: kontrol sentuh, orientasi, safe area, dan tata letak mobile.
- src/camera.mjs: kamera dengan area toleransi gerak.
- src/audio.js: ambience, musik, efek dan pengaturan volume.
- src/terrain-renderer.js: material jalan, sinkronisasi pijakan dinamis dan peralihan lukisan goa.
- assets/prompts/terrain-rich.json: manifest panorama dan sembilan material jalan GPT.
- tools/generate-rich-art.mjs: menjalankan generasi aset melalui sprite-gen.
- tools/prop-art.mjs dan tools/generate-prop-art.mjs: rancangan dan generasi 31 ilustrasi objek statis.
- tools/verify-prop-alpha.py: verifikasi dan trim alpha menggunakan fungsi resmi sprite-gen; laporan akhir `*.verified.json`.
- tools/export-prop-art.py: ekspor objek berukuran maksimum 512 piksel ke assets/props-ready/.
- tools/extract-npc-sheets.py: ekstraksi sheet NPC pengguna; 22 frame di assets/npc/ beserta manifest sumber dan animasi.
- src/dialogues.json: dialog dan kilas balik.
- src/history.json: entri jurnal beserta sumber.
- tools/terrain-art.mjs: SVG sumber collision, tangga dan elemen pendukung.
- tools/build-campaign.mjs: generator proyek dan ekspor.
- src/site-config.json: data UKM.

Jika ada PNG baru hasil generasi: jalankan `npm.cmd run assets:optimize`, lalu `npm.cmd run build` dan `python tools/verify-assets.py`. Kompresi/verifikasi memerlukan Pillow dengan dukungan WebP; build biasa cukup Node.js. `assets/optimized-manifest.json` memetakan nama resource PNG yang stabil ke file WebP aktual, ukuran dan hash pikselnya. PNG baru yang berubah akan diprioritaskan daripada WebP lama sampai dikompres ulang. Pembersihan berikutnya bisa ditinjau dengan `python tools/clean-unused-assets.py`; tambahkan `--apply` hanya setelah build baru diperiksa.

File slice lama dipertahankan sebagai referensi; entry point produksi memakai campaign. GDD dan sprite asli tidak diubah. Runtime GDevelop menggunakan lisensi MIT.
