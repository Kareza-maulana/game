# Validasi kampanye Cahaya Kadiri

Pemeriksaan visual/build terbaru dilakukan 28 September 2026 di Windows, Chrome headless lokal, ekspor GDevelop 5.6.269. Pengujian rute kampanye dan perangkat sentuh di bawah juga mencakup sesi sebelumnya.

## Build dan logika

- Optimasi ukuran: ekspor bersih `dist/` berukuran **49.416.145 byte (49,42 MB)**, dari 64.029.188 byte. Build menetapkan batas kurang dari 100.000.000 byte. `docs/optimization-report.json` mencatat perbandingan; `docs/build-size.json` mencatat build terbaru.
- `python tools/verify-assets.py`: 94 gambar lossless lolos hash piksel RGBA dan ukuran; 20 frame Kirana asli serta tiga spritesheet NPC tetap cocok dengan hash sumber. Seluruh 151 resource tersedia. Tidak ada resize, pengurangan warna, atau perubahan alpha dalam konversi WebP ini. Semua 2.460 instance tetap identik sebelum/sesudah optimasi.
- Pembersihan menghapus 163 file aset tergantikan/intermediate (207.073.480 byte) dan 119 berkas lama di ekspor. Prompt, laporan generasi, source code, GDD, dan seluruh sprite asli pengguna dipertahankan. PNG dan raw yang disebut laporan lama bersifat arsip provenance; berkas produksi aktual dipetakan di `assets/optimized-manifest.json`. Build ulang setelah penghapusan berhasil dan 14 tes logika tetap lulus.
- Smoke sembilan scene memakai WebP berhasil tanpa error JavaScript/resource, dengan pergerakan, lompatan dan kanvas penuh. Verifikasi pixel-identical dilakukan terhadap data gambar hasil decode, bukan perbandingan screenshot yang berubah karena animasi.
- Setelah file sumber tergantikan dibersihkan dan build diulang, `node tools/mobile-check.mjs` tetap lulus: gerak sentuh, interaksi buku, layout mobile, dan jeda fisika.
- `npm.cmd run build`: berhasil mengekspor 9 scene, 2.460 instance dan 151 resource. Generator utama: `tools/build-campaign.mjs`.
- `npm.cmd test`: 14 pengujian lulus, meliputi progres, minyak, puzzle, save, 12 Kidung, serta kamera pada lompatan berulang, perubahan arah, perpindahan lantai dan resize.
- Sprite asli pengguna tidak diubah. Sembilan gambar material jalan digunakan sesuai map; Prolog/Epilog berbagi material, sementara Pasar memiliki material atap dan dermaga terpisah.
- Perbandingan seluruh posisi dan ukuran collision sebelum/sesudah revisi visual identik pada sembilan scene, termasuk pijakan memudar, rakit, tangga, peti dan penghalang.
- Revisi objek: 31 ilustrasi transparan diperiksa melalui laporan alpha dan preview visual. Tidak ada RGB tersisa pada piksel yang sepenuhnya transparan; semua siluet memiliki isi yang terukur. Tiga raw awal yang sudah transparan diproses ulang melalui jalur native resmi sprite-gen, bukan hasil chroma yang menghapus badan objek.
- Ekstraksi NPC: 6 + 10 + 6 frame. Semua batas ekstraksi berada pada kolom transparan, jumlah piksel terlihat dipertahankan, semua frame terisi, dan hash file sumber tidak berubah. Dua pengujian browser paralel sempat timeout saat pemuatan gambar besar; pengujian sembilan scene berhasil saat dijalankan sendiri. Objek runtime kemudian diperkecil dari 43,8 MB menjadi 7,7 MB.

## Pengujian browser

- Revisi kontrol mobile: `node tools/mobile-check.mjs` lulus dengan kontrol baru (gerak, interaksi buku, jeda). `node tools/mobile-regression.mjs` memeriksa ukuran 844 × 390, 667 × 375, 568 × 320, 932 × 430, dan 1024 × 768; target tombol minimal 44 piksel, tidak saling bertumpuk, dan tidak melewati viewport. Pengujian multi-touch menggerakkan Kirana sambil melompat, termasuk dengan Sorot aktif. Kibas mengurangi minyak; jurnal melepas sakelar Pelita/Lari. Pointer cancel dan perubahan orientasi tidak meninggalkan tombol tertahan. Portrait memblokir kontrol dan membekukan posisi/waktu permainan sampai kembali landscape dan dilanjutkan.
- Jalur Screen Orientation diuji melalui kontrak API yang menerima/menolak permintaan: percobaan landscape otomatis, permintaan fullscreen setelah ketukan, serta petunjuk rotasi manual ketika ditolak. Chrome mobile diemulasikan, **belum pengujian rotasi fisik pada Android/iPhone**. Browser dapat membatasi fullscreen/orientation lock; game tidak menjanjikan rotasi paksa pada semua browser. Screenshot: `mobile-portrait.png`, `mobile-<width>x<height>.png`, `mobile-cave-controls.png`, `mobile-cave-small.png`; hasil: `mobile-regression.json`.
- Setelah integrasi kontrol mobile, smoke desktop sembilan scene tetap lulus tanpa error JavaScript/resource. Kontrol keyboard tetap memakai gerakan dan fisika yang sama.
- `node tools/npc-check.mjs`: animasi Ki Jati (6), Kilisuci (10) dan penjaga (6) memainkan seluruh frame dan melewati akhir loop. Selama pengambilan sampel, posisi dasar dan ukuran kanvas tetap. Ki Jati memberikan Pelita, Kilisuci membuka dialog, penjaga menambah hitungan percakapan; tanpa error JavaScript. Screenshot tiap tokoh tersedia di `npc-<Scene>.png`, hasil di `npc-report.json`.
- Setelah objek bertekstur dipasang dan diperkecil, rute keyboard/pointer dari save Gerbang berhasil menyelesaikan petunjuk, empat batu putar, lonceng, pusaka, pilar, manuskrip dan Epilog. Pengujian ini mendahului pemasangan animasi NPC; interaksi NPC diuji terpisah seperti di atas.

- `node tools/campaign-smoke.mjs`: semua sembilan scene dimuat, menjalankan fisika dan memenuhi viewport 1280 × 800; tanpa error JavaScript atau kegagalan resource.
- `node tools/mobile-check.mjs`: viewport sentuh 844 × 390. Input sentuh menggerakkan Kirana dan mengembalikan buku pertama; jeda membekukan posisi; halaman tidak meluber horizontal.
- `node tools/cave-regression.mjs`: fixture save di checkpoint Kilisuci tanpa Wani menunjukkan petunjuk lokasi Wani. Menahan X sambil diam membuka pahatan otomatis, tanpa C. Setelah X dilepas, C membuka ulang petunjuk; status ini tetap ada setelah reload.
- Uji regresi tersebut juga memeriksa ukuran kanvas pada 1440 × 900, 844 × 390, 390 × 844 dan 1280 × 800, serta masuk/keluar layar penuh melalui tombol ⛶.
- Relief Petirtaan diuji terpisah dengan fixture save setelah air surut: tahan X membuka puzzle otomatis, urutan benar memberikan Jujur.
- Uji panduan goa: save di Kilisuci tanpa Wani menampilkan langkah 1/4 dan penunjuk Damar Jurang di bawah kamera. Input ↓ + Z berhasil turun ke teras; mendekati obor menyimpan checkpoint dan C mengisi minyak menjadi 100%. Input X + Z melewati jembatan, X + C mengambil Wani; jalur naik dan lima cerukan kemudian menghasilkan Andhap serta panduan langkah 4/4. Screenshot label obor, petunjuk arah, dan bentuk lima lilin diperiksa secara visual.

## Rute permainan

`tools/campaign-playthrough.mjs` menjalankan input keyboard/pointer dan mengamati snapshot baca-saja. Gerak, lompatan, collision, interaksi dan transisi menggunakan runtime game; tidak memindahkan karakter atau memberikan serat lewat API uji.

Rute kampanye diuji melalui beberapa sesi dengan melanjutkan save hasil sesi sebelumnya, bukan satu sesi baru tanpa putus:

- Prolog: tiga buku, tangga, portal.
- Pasar: tiga pesanan, pengejaran di atap, turun dengan ↓ + Z, memberi makanan pada lutung, Asih.
- Petirtaan: konfigurasi tuas, menunggu Sabar, menguras air, jembatan pelita, relief, Jujur.
- Bukit/Goa: mengambil Wani di tonjolan kanan, menemui Kilisuci, membaca pahatan, lima cerukan, Andhap, lorong pelarian dan transisi ke Gerbang.
- Gerbang: empat petunjuk, mengambil kunci sambil merunduk, DAHA, Setya.
- Kedaton: Tapak Hampa, tiga lonceng Bayang Galuh, pusaka.
- Bangsal: empat pilar, Wicaksana, tiga argumen, pilar kelima.
- Putri/Epilog: menyusun manuskrip, buku terakhir, poster, ending biasa dengan tujuh serat.

Pengujian ulang dari `save-Bukit.json` memeriksa pijakan perantara baru di atas Kilisuci menggunakan lompatan biasa, lalu seluruh pelarian sampai Gerbang. Pahatan dan aksara Gerbang dibaca dengan respons otomatis yang baru. Kelanjutan Kedaton sampai ending diuji dengan melanjutkan save; hasil akhir memiliki tujuh serat dan lima Kidung. Titik awal lompatan alat uji menuju loteng pusaka diperbaiki agar mendekati tepi platform terlebih dahulu.

## Kamera, audio dan jalur keluar goa

`node tools/polish-check.mjs` menggunakan fixture save setelah Andhap, lalu menjalankan input fisika nyata. Kamera vertikal tetap pada posisi yang sama dalam pengamatan lompatan berulang (hasil rinci di `polish-report.json`). Musik, ambience, langkah dan pendaratan menghasilkan sinyal audio terukur; mute menyenyapkannya, volume efek 35% dan mute tetap tersimpan setelah reload. Jalur 14 pijakan keluar goa dilalui sampai Gerbang Dhaha; profil audio berubah dari goa ke lembah lalu gerbang tanpa menambah loop ambience antarscene. Tidak ada error browser.

Pemandangan awal, tengah dan ujung pelarian diperiksa melalui screenshot, termasuk panorama GPT baru dan jalan bertekstur. Material pijakan setiap lokasi juga diperiksa pada screenshot browser. Uji ini memastikan keluaran audio dan kontrolnya, bukan penilaian kualitas rekaman/instrumen; penilaian keseimbangan dengan speaker/headphone nyata masih diperlukan.

## Bukti

Berkas di `test-results/`:

- `campaign-<Scene>.png`: sembilan map.
- `props-all.jpg` dan `props-contact.jpg`: pemeriksaan bentuk, transparansi dan detail objek baru sebelum dipasang.
- `cave-reading-resume.png`: pahatan yang tetap bisa dibaca setelah melanjutkan save.
- `cave-guide-return.png`, `cave-guide-damar.png`, `cave-guide-candles.png`: penunjuk dari Kilisuci, identitas/fungsi Damar Jurang, dan cerukan yang berbeda bentuk dari obor.
- `relief-automatic.png`: hasil puzzle Petirtaan melalui pembacaan otomatis.
- `mobile.png`: kontrol sentuh.
- `escape-scenery-1.png`, `escape-scenery-7.png`, `escape-scenery-13.png`: pemandangan sepanjang rute pelarian.
- `audio-settings.png` dan `polish-report.json`: pengaturan serta pengukuran kamera/audio.
- `campaign-route.png` dan `save-completed.json`: akhir rute kampanye.
- `save-<Scene>.json`: progres hasil input untuk melanjutkan pengujian bab.

Fixture uji regresi dibuat khusus dalam profil browser pengujian. Save pemain di browser sehari-hari tidak diubah.

## Belum divalidasi

Perangkat ponsel fisik, semua browser, kinerja laptop kelas menengah, aksesibilitas menyeluruh, seluruh rute pengambilan 12 Kidung/ending emas, serta durasi target 45–60 menit belum diuji. Hasil ini tidak menyatakan semua spesifikasi seni, sinematik, audio dan produksi GDD sudah lengkap; lihat [catatan produksi](PRODUKSI.md).
