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

- Ilustrasi cerita (25 Oktober 2026): 27 adegan dan 8 potret GPT, termasuk tujuh kilas balik Serat. `node tools/story-check.mjs` lulus: seluruh 35 WebP dapat didecode, setiap beat storyboard memilih gambar yang benar, potret Kirana berada di kanan dan NPC di kiri. Kontrol dapat dijangkau pada 1280 × 800, 844 × 390 dan 568 × 320. Uji actual game memeriksa fisika berhenti saat dialog, Skip terkunci dua detik, Auto maju, Skip kembali bermain, serta nol request ilustrasi cerita pada layar judul. Reduced motion menonaktifkan fade dan gambar dilepas setelah dialog berakhir. Hasil: `test-results/story-report.json`; screenshot `story-kirana-<width>.png` dan `story-jati-<width>.png`.
- Seluruh adegan/potret diperiksa melalui contact sheet. Kilas balik Asih dikoreksi agar hanya Mbok yang hadir sebagai manusia; Putri berada dalam wujud keong emas. Native transparency delapan potret, SHA gambar, hash RGBA runtime dan file ekspor diperiksa oleh `python tools/verify-assets.py`. Aset lama serta sprite pengguna tidak berubah. Seluruh 2.460 instance tetap identik dengan geometri sebelum revisi sinematik. Ukuran build akhir sekitar **87,71 MB**, di bawah 100 MB; 35 gambar ini disalin secara terpisah ke `dist/story/` dan tidak masuk preload awal engine.
- Setelah integrasi ilustrasi, `node tools/campaign-smoke.mjs` lulus untuk sembilan scene tanpa error JavaScript/resource. Pegangan observasi snapshot dibersihkan ketika scene dibuang agar pengujian tidak membaca kamera scene lama saat transisi. `node tools/feedback-check.mjs` juga kembali lulus untuk ending biasa/emas, tiga viewport mobile, penyimpanan lokal diblokir, RLS menolak, jaringan gagal, dan navigasi beranda. Pengujian formulir ini menggunakan respons simulasi; tidak menambah komentar ke Supabase. Seluruh 14 tes logika tetap lulus.
- Pembaruan 25 Oktober 2026: formulir ending menggunakan POST REST ke Supabase tabel `komentar`, hanya mengirim kolom `komentar` dengan `Prefer: return=minimal`. URL dan anon key publik dikonfigurasi dalam `src/site-config.json`. Pemeriksaan tanpa baris memastikan kolom `id`, `created_at`, dan `komentar` tersedia; metadata OpenAPI dibatasi oleh server. Percobaan INSERT pertama ditolak RLS `42501`. Setelah pengguna menerapkan `supabase/komentar-insert.sql`, satu INSERT berlabel `[UJI INTEGRASI CAHAYA KADIRI]` berhasil dengan HTTP 201. Tidak ada komentar pemain yang diambil/dicatat. Hasil langsung: `test-results/feedback-live.json`.
- `node tools/feedback-check.mjs` menguji UI dan memakai intersepsi request Supabase agar tidak menambah data uji pada server. Cakupannya: ending biasa/emas, keyboard, payload satu kolom, header API, respons 201/401, jaringan terputus, draf bertahan, localStorage diblokir, pencegahan pengiriman ulang teks yang sama, focus trap/Escape, navigasi beranda, dan tiga viewport sentuh. Respons gagal tidak ditampilkan sebagai sukses; tidak ada retry otomatis. Laporan: `test-results/feedback-report.json`.
- Build integrasi Supabase: **49,50 MB**, 9 scene, 2.460 instance, 151 resource. Seluruh 14 tes logika lulus. Draf lokal versi lama dimuat sebagai belum terkirim dan hanya dikirim ketika pemain menekan tombol Kirim.

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

## Penghalusan fade ilustrasi dan perpindahan map

- Ilustrasi baru memudar masuk selama 900 ms di atas gambar lama yang tetap opak, sehingga pergantian tidak melewati jeda gelap. Fade memakai kurva percepatan/perlambatan yang lembut.
- Dialog masuk/keluar 600 ms, latar ilustrasi 720 ms, perpindahan map menutup 650 ms lalu membuka 800 ms setelah ilustrasi tujuan siap. Runtime menunggu durasi penutupan yang dikembalikan komponen, termasuk 0 ms untuk preferensi pengurangan animasi.
- `node tools/fade-check.mjs`: pengukuran opacity tiap frame pada viewport 1280×800 dan 844×390; memeriksa dasar gambar tetap opak, pelepasan gambar lama, klik lanjut berulang, pembukaan ulang ketika fade belum selesai, pergantian scene, serta reduced motion. Hasil tersimpan pada `test-results/fade-report.json`.
- Salinan visual dialog yang memudar keluar bersifat inert, tanpa ID kontrol ganda, dan dibersihkan setelah animasi. Tidak ada aset gambar baru untuk perubahan ini.

## Mask teks narasi/dialog dan efek suara

- Huruf dibuka bertahap dengan clip mask 100 ms; jeda koma/akhir kalimat dan tempo narasi lebih lambat. Seluruh teks disusun sejak awal agar tinggi kotak tetap stabil.
- Klik/tap Lanjut atau Enter/C/Spasi pertama melengkapi teks, input berikutnya berpindah baris. Auto menunggu pengungkapan selesai lalu memberi waktu membaca. Auto tidak mengulang animasi saat diaktifkan/dimatikan.
- Efek ketikan pendek dibuat melalui Web Audio, dibatasi satu suara per 70 ms, mengikuti volume efek dan mute. Tidak menambah unduhan aset suara. Pengungkapan/suara berhenti ketika dialog dilewati, scene dibuang, tab tersembunyi, atau kartu rotasi ponsel menutupi permainan.
- `node tools/text-check.mjs` memeriksa desktop 1280×800 serta mobile 844×390/568×320, ukuran target sentuh, tata letak tetap, mask parsial, kontrol lanjut, pembatalan suara, mute/volume nol, narasi, batas grapheme, tab tersembunyi, dan reduced motion. Teks utuh tersedia untuk pembaca layar, salinan visual disembunyikan dari pembaca layar.
- Reduced motion langsung menampilkan teks penuh tanpa rangkaian suara ketikan. Hasil pengujian tersimpan di `test-results/text-report.json`.

## Pengejaran lutung di Pasar Tandes

- Sprite lutung yang semula diam di dermaga kini mengikuti permukaan atap dan melompati celah, membawa bungkusan yang sudah ada pada aset. Gerakan baru tidak mengubah collision/terrain atau algoritma kamera.
- Lutung muncul setelah pesanan ketiga dan dialog pencurian selesai. Kecepatan/jaraknya mengikuti posisi pemain; lompatan yang sudah dimulai tetap berakhir di pijakan. Di dermaga, lutung turun ke posisi interaksi dan menunggu makanan.
- Reset ke checkpoint atap mengatur ulang posisi lutung. Checkpoint dermaga tetap dipertahankan saat melanjutkan save atau kembali ke damar. Save yang terputus antara pengantaran ketiga dan akhir dialog pencurian melanjutkan pemicu pengejaran.
- `npm.cmd test`: 17 tes lolos, termasuk lintasan lutung sepanjang seluruh atap, lompatan saat pemain berhenti, dan pemulihan checkpoint.
- `node tools/lutung-check.mjs`: pesanan ketiga dipicu melalui input; seluruh rute atap dilalui; makanan diberikan dan Serat Asih diperoleh; jeda, kegagalan pengejaran, save/checkpoint dermaga, serta gerakan melalui kontrol mobile diuji. Pada 2.990 sampel rute, koordinat horizontal lutung berada di area pandang kamera. Hasil: `test-results/lutung-report.json`.
- Pemeriksaan visual: `lutung-start.png`, `lutung-fed.png`, `lutung-mobile.png` dalam `test-results/`. Pengujian save pengantaran yang terputus juga lolos melalui fixture browser tersendiri.

## Belum divalidasi

Perangkat ponsel fisik, semua browser, kinerja laptop kelas menengah, aksesibilitas menyeluruh, seluruh rute pengambilan 12 Kidung/ending emas, serta durasi target 45–60 menit belum diuji. Hasil ini tidak menyatakan semua spesifikasi seni, sinematik, audio dan produksi GDD sudah lengkap; lihat [catatan produksi](PRODUKSI.md).
