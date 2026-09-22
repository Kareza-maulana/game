# Catatan produksi Cahaya Kadiri

Rujukan: [GDD v2.0](../gdd-candra-kirana.md), tidak diubah. Versi 0.2 memperluas slice Petirtaan menjadi sembilan scene dengan progres, kemampuan, jurnal dan save bersama.

## Implementasi kampanye

Prolog memuat buku, lampu, tangga dan portal. Pasar memuat pesanan, pengejaran lutung, Asih dan dakon. Petirtaan memuat air, Sabar dan Jujur. Bukit/Goa memuat Wani, Kilisuci, pahatan, lima cerukan, Andhap dan pelarian. Gerbang memuat empat petunjuk, DAHA dan Setya. Kedaton memuat Tapak Hampa, peniruan Bayang Galuh dengan jeda satu detik, lonceng dan pusaka. Bangsal memuat pilar, Wicaksana dan tiga pertanyaan Ki Samar. Putri memuat manuskrip kronologis, lalu Epilog menutup cerita.

## Keputusan untuk kontradiksi GDD

- Prolog + Scene 1–8 berarti sembilan adegan.
- Target 12 Kidung dipertahankan, dengan distribusi 1, 2, 2, 2, 1, 2, 1, 1, 0. Gerbang mendapat satu agar total tidak 13.
- Ki Jati mendampingi pembacaan relief sebelum Jujur; Baca umum terbuka setelah Jujur.
- Wicaksana diperoleh di Bangsal, mengikuti rincian boss dan alur cerita. Sorot Jauh memakai radius dua kali Sorot biasa.
- Urutan manuskrip: Setya, Jujur, Wani, Sabar, Asih, Andhap, Wicaksana; berbeda dari urutan perolehan.
- Alamat situs UKM dan tanggal kegiatan ditunda sesuai permintaan pengguna. Tidak ada URL atau tanggal rekaan.

## Material pijakan per map

Sembilan gambar material GPT berada di `assets/art/road-*.png`, dengan permukaan atas, sisi depan, tekstur dan bayangan yang membentuk kedalaman. Prolog dan epilog berbagi material perpustakaan; Pasar memiliki material terpisah untuk atap dan dermaga. Prompt dan laporan generasi disimpan bersama proyek.

Kayu tua untuk perpustakaan; rumbia dan batu dermaga untuk pasar; andesit berlumut untuk Petirtaan; batu alam berlapis untuk bukit; bata merah untuk gerbang; kayu ukir untuk kedaton; batu gelap dengan motif cahaya untuk Bangsal; kayu bertatahan emas untuk kamar putri. Gambar diulang sebagai modul 144 × 48 melalui TiledSprite, dengan sisi bawah tersendiri untuk lantai yang tebal.

`src/terrain-renderer.js` memasangkan dekorasi dengan collision lama yang disembunyikan. Posisi dan ukuran collision tetap sama. Pijakan memudar mengikuti opacity objek fisika, rakit mengikuti ketinggian air, dan penghalang Gerbang mengikuti status puzzle. SVG di `assets/terrain/` masih dipakai untuk sumber collision, tangga dan elemen pendukung.

## Perbaikan keterjangkauan dan interaksi

Goa memiliki dua pijakan batu perantara di atas Kilisuci, sehingga jalur menuju lorong atas bisa dicapai dengan lompatan biasa. Wani tetap diperlukan untuk progres cerukan; objective dan Kilisuci memberi petunjuk lokasinya bila belum diambil. Setelah Andhap diperoleh, memasuki lorong atas otomatis memulai pelarian.

Istilah ambigu “damar tengah” di quest goa diganti menjadi **Damar Jurang**. Ketiga obor diberi nama di dunia: Damar Lereng, Damar Jurang, Damar Kilisuci. Penunjuk tujuan tetap terlihat di tepi layar bila objek berada di luar kamera. Panduan empat langkah berubah menurut serat, pembacaan, dan posisi pemain; memuat kontrol turun, isi minyak, Sorot + lompat, ambil Wani, baca pahatan, lilin, dan keluar. Cerukan memakai aset SVG lima lilin terpisah dari bentuk damar. Pembaruan panduan bekerja untuk save yang sudah mencapai Kilisuci tanpa Wani.

Pahatan membuka petunjuk setelah satu detik berdiri diam sambil menahan X. Status pembacaan goa tersimpan dan C dapat membuka ulang petunjuk tanpa menahan X. Puzzle relief Petirtaan dan aksara terlupa di Gerbang memakai respons baca otomatis yang sama.

Kanvas menyesuaikan rasio jendela dengan resolusi dasar 480 × 270; kamera mengikuti area pandang aktual. Tombol ⛶ meminta layar penuh browser. Di Bangsal, Sorot memulihkan collision pijakan saat diarahkan; efek penghapusan tidak membatalkan pijakan yang sedang disorot.

## Poles pemandangan, kamera dan audio

Jalur keluar goa memakai panorama GPT `assets/art/escape-rich.png`: gunung bertingkat, sungai, sawah, pepohonan, air terjun, permukiman dan bangunan batu. Satu panorama lebar bergerak pada lapisan parallax dan menutup seluruh lintasan kamera tanpa pengulangan horizontal. Ujung lukisan goa lama memudar ke panorama baru melalui filter render. Lapisan dekorasi tidak memiliki collision. Sulur depan dibatasi ke bagian goa agar jalur terbuka tetap terbaca.

Kamera memakai toleransi horizontal tanpa offset arah hadap. Ketinggian lantai menjadi acuan vertikal; lompatan biasa tidak menggeser kamera. Lompatan tinggi/jatuh panjang tetap diikuti saat mendekati batas pandangan. Gerak diredam berdasarkan waktu frame, posisi render tiap layer dibulatkan, dan checkpoint mereset kamera agar tidak menyapu seluruh map saat respawn.

Audio Web Audio dibuat secara prosedural, tanpa unduhan atau sampel pihak ketiga: angin, aliran air/hujan, tetesan goa, burung, gesekan halus, musik nada lembut, langkah kaki, lompatan, pendaratan, pelita, dash/kibas, checkpoint, dan serat. Karakter bunyi berpindah perlahan antar lokasi; goa berubah menjadi lembah saat pemain keluar. Satu AudioContext dipakai bersama antarscene. Menu jeda meredam ambience/musik; tab tersembunyi dan mute menyenyapkan keluaran. Volume tiga kelompok dan mute disimpan di `cahayakadiri_audio`.

## Batas produksi

Kampanye gameplay ini belum berarti seluruh spesifikasi seni dan produksi GDD selesai.

- Platform memakai material raster GPT berulang; bentuk luar masih mengikuti platform persegi panjang. NPC tambahan masih pose statis dan beberapa tokoh kecil memakai ulang sprite. Bayang Galuh memakai varian warna Putri.
- Latar generatif belum menjadi tileset modular yang cocok persis dengan semua collision. Atlas, batas 48 warna, dan optimasi tekstur belum final.
- Kilas balik disampaikan lewat dialog dan efek cahaya. Lukisan tiap serat, hujan, koreografi kamera, tirai, dan animasi cutscene sesuai durasi GDD belum lengkap.
- Cahaya memakai sprite radial/kerucut, belum extension Lighting beserta Light obstacle. Dialog memakai DOM, belum Yarn.
- Puzzle cermin berupa pemulihan petunjuk melalui interaksi. Gerbang memakai transliterasi Latin DAHA. Siklus tidur penjaga disederhanakan menjadi merunduk dan menunggu dua detik.
- Pengejaran/pelarian memakai batas posisi dan waktu untuk menyapu pemain; variasi rute dan kamera sinematik masih dapat dikembangkan.
- Musik, ambience dan efek sudah tersedia dalam bentuk sintesis prosedural; belum memakai rekaman instrumen/lingkungan atau VO. Keseimbangan suara masih perlu playtest dengan speaker dan headphone nyata.
- Durasi 45–60 menit, keseimbangan minyak, keterbacaan semua usia dan 60 fps di perangkat menengah belum tervalidasi melalui playtest pengguna/perangkat nyata.

## Aset dan sejarah

Sprite pengguna tetap asli: IDLE 9 frame, East 8 frame, jump 3 frame terpisah. Gerak kiri memakai flip. Pose geser sementara dibuat dari East dalam kanvas 256 × 256 dengan collision kaki tetap; file sumber tidak diubah. Strip east jump.png belum digunakan. GPT melalui sprite-gen menghasilkan latar dan NPC tambahan; prompt serta laporan ada di assets/. Preferensi GPT dan tanpa galeri dipertahankan.

Kidung membedakan adaptasi fiksi dan catatan sejarah. Sumber: [UNESCO — Panji Tales Manuscripts](https://www.unesco.org/en/memory-world/panji-tales-manuscripts) dan [DPM Kota Kediri — Gunung Klotok](https://dpm.kedirikota.go.id/blog/11/gunung-klotok). Sumber muncul dalam jurnal setelah Kidung ditemukan. Visual merupakan interpretasi artistik, bukan rekonstruksi arkeologis.

Prioritas selanjutnya adalah playtest kampanye, keterbacaan rute, seni objek/NPC final, sinematik, audio, optimasi tekstur, dan uji perangkat.
