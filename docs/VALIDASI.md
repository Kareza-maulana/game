# Validasi kampanye Cahaya Kadiri

Pemeriksaan visual/build terbaru dilakukan 22 September 2026 di Windows, Chrome headless lokal, ekspor GDevelop 5.6.269. Pengujian rute kampanye dan perangkat sentuh di bawah juga mencakup sesi sebelumnya.

## Build dan logika

- `npm.cmd run build`: berhasil mengekspor 9 scene, 2.452 instance dan 114 resource. Generator utama: `tools/build-campaign.mjs`.
- `npm.cmd test`: 14 pengujian lulus, meliputi progres, minyak, puzzle, save, 12 Kidung, serta kamera pada lompatan berulang, perubahan arah, perpindahan lantai dan resize.
- Sprite asli pengguna tidak diubah. Sembilan gambar material jalan digunakan sesuai map; Prolog/Epilog berbagi material, sementara Pasar memiliki material atap dan dermaga terpisah.
- Perbandingan seluruh posisi dan ukuran collision sebelum/sesudah revisi visual identik pada sembilan scene, termasuk pijakan memudar, rakit, tangga, peti dan penghalang.

## Pengujian browser

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
