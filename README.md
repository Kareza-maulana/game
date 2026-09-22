# Cahaya Kadiri

Kampanye platformer **Prolog sampai Epilog** berdasarkan [GDD v2.0](gdd-candra-kirana.md), dengan sembilan scene GDevelop. Versi 0.2 memperluas prototipe Petirtaan menjadi perjalanan lengkap; seni final, sinematik dan audio masih perlu penyempurnaan.

## Mainkan

Klik dua kali **mainkan.bat**, atau jalankan:

```powershell
npm.cmd start
```

Buka **http://127.0.0.1:3100**. Jangan membuka dist/index.html melalui file:// karena pemuatan aset memerlukan server lokal. Game berjalan tanpa internet setelah file tersedia. Server/build memakai Node.js 22.

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

Kontrol sentuh tersedia. Dialog memiliki Lanjut, Auto, dan Lewati setelah dua detik. Jurnal dan menu menjeda fisika. Tersapu kabut mengembalikan pemain ke damar tanpa kehilangan serat.

Menu jeda menyediakan volume **Suasana**, **Musik**, **Efek suara**, serta mute. Pengaturannya tersimpan terpisah dari progres. Audio aktif setelah interaksi pertama, memakai ambience per lokasi dan efek langkah, lompat, mendarat, pelita, serta penemuan serat. Kamera menahan lompatan biasa dan perubahan arah kecil, lalu mengikuti perpindahan lantai atau gerakan yang mendekati batas pandangan.

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

## Build dan pemeriksaan

```powershell
npm.cmd ci
npm.cmd run build
npm.cmd test
node tools/campaign-smoke.mjs
node tools/campaign-playthrough.mjs
node tools/mobile-check.mjs
node tools/cave-regression.mjs
node tools/polish-check.mjs
```

Uji browser membutuhkan server aktif dan Chrome pada lokasi standar Windows. Lihat [hasil validasi](docs/VALIDASI.md) dan [catatan produksi](docs/PRODUKSI.md) untuk cakupan serta batasan.

Build menghasilkan ulang cahaya-kadiri.json dan dist/. Simpan salinan jika mengedit JSON langsung di GDevelop agar perubahan editor tidak tertimpa generator.

- src/levels.mjs: sembilan peta.
- src/campaign-model.mjs: progres, save dan gerbang quest.
- src/campaign-runtime.js: input, puzzle dan integrasi engine.
- src/camera.mjs: kamera dengan area toleransi gerak.
- src/audio.js: ambience, musik, efek dan pengaturan volume.
- src/terrain-renderer.js: material jalan, sinkronisasi pijakan dinamis dan peralihan lukisan goa.
- assets/prompts/terrain-rich.json: manifest panorama dan sembilan material jalan GPT.
- tools/generate-rich-art.mjs: menjalankan generasi aset melalui sprite-gen.
- src/dialogues.json: dialog dan kilas balik.
- src/history.json: entri jurnal beserta sumber.
- tools/terrain-art.mjs: SVG sumber collision, tangga dan elemen pendukung.
- tools/build-campaign.mjs: generator proyek dan ekspor.
- src/site-config.json: data UKM.

File slice lama dipertahankan sebagai referensi; entry point produksi memakai campaign. GDD dan sprite asli tidak diubah. Runtime GDevelop menggunakan lisensi MIT.
