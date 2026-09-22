# Cahaya Kadiri
### Serat Sapta Keteladanan — Kisah Candra Kirana yang Nyaris Terlupakan

**Game Development Plan · Revisi 2.0**
`GDevelop 5` · `2D Pixel Art` · `Side-scroll / Platformer` · `8 Scene · ±45–60 menit` · `Edukasi & Penalaran`

Side-scrolling platformer naratif 2D pixel art. Pemain berperan sebagai Kirana, mahasiswi UKM Pendidikan & Penalaran yang tersedot ke Kadiri abad ke-11 dan harus menyusun kembali manuskrip yang hilang sebelum sebuah kisah — dan nilai-nilai di dalamnya — lenyap selamanya dari ingatan manusia.

---

## 01 · Ringkasan Perubahan

Versi lama bergerak lurus: terima manuskrip → cari pecahan → serahkan. Pemain lebih banyak *berjalan dan membaca* daripada *bermain*. Revisi ini mengubah tiga hal mendasar:

1. **Kutukan "dilupakan" dijadikan mekanik, bukan sekadar latar.** Dunia Kadiri benar-benar memudar di layar — platform, jembatan, bahkan NPC menjadi transparan dan tidak bisa dipijak. Pemain memegang **Pelita Ingatan** untuk memunculkannya kembali. Tema dan gameplay akhirnya berbicara hal yang sama.
2. **Manuskrip dipecah menjadi 7 serat bernilai.** Tiap serat membawa satu nilai keteladanan, membuka satu kemampuan gerak baru, dan memicu satu cutscene kilas balik kehidupan Candra Kirana. Progresi cerita = progresi kemampuan = penyampaian materi edukasi.
3. **Ditambahkan antagonis dengan argumen, bukan sekadar musuh.** **Ki Samar (Sang Lupa)** berpendapat kisah yang tak lagi diceritakan berhak beristirahat. Konfrontasi terakhir diselesaikan lewat penalaran, bukan kekerasan — sesuai identitas UKM Pendidikan & Penalaran.

Struktur scene berkembang dari 5 menjadi 8 area, setiap area punya identitas mekanik sendiri (kejar-kejaran, puzzle air, panjat vertikal, sembunyi, boss), sehingga tidak ada dua level yang terasa sama.

---

## 02 · Pilar Desain

| Pilar | Penjelasan |
|---|---|
| **Mengingat = Cahaya** | Kata kerja utama pemain bukan "menyerang", melainkan "menyinari". Semua kemampuan tumbuh dari satu benda: Pelita Ingatan. |
| **Diorama Hidup** | Setiap peta adalah potongan melintang bangunan/tebing yang memperlihatkan banyak lantai sekaligus, dengan parallax dalam dan pencahayaan hangat — persis bahasa visual pada referensi yang diberikan. |
| **Penalaran, Bukan Pedang** | Semua rintangan besar diselesaikan dengan observasi, logika, atau pengetahuan sejarah. Tidak ada darah, tidak ada senjata tajam. |
| **Kadiri yang Terasa Nyata** | Nama, arsitektur, dan properti diambil dari rujukan nyata: Dhaha/Daha, Sungai Brantas, Gunung Kelud & Klotok, Goa Selomangleng, Dewi Kilisuci, aksara Kawi, bunga Wijayakusuma. |
| **Sekali Duduk** | Total 45–60 menit. Dimainkan lewat browser, berakhir dengan tombol kembali ke situs UKM PP. Tidak ada mekanik yang butuh tutorial lebih dari 10 detik. |

---

## 03 · Arah Seni & Konsep Visual

### Bahasa visual yang diambil dari referensi

- **Potongan melintang (cutaway).** Bangunan dibelah sehingga interior dan eksterior terlihat bersamaan — pemain melihat ke mana ia akan pergi sebelum sampai ke sana.
- **Vertikalitas.** Layar dibagi menjadi 2–3 tingkat lantai yang saling terhubung tangga, tali, atau akar. Kamera bergerak horizontal *dan* vertikal.
- **Kontras suhu cahaya.** Interior hangat (obor, damar, oncor) melawan ambient dingin (malam, kabut, air). Ini yang membuat gambar referensi terasa "dalam".
- **Foreground rimbun.** Dedaunan, kain, atap, dan tiang gelap di lapisan paling depan membingkai aksi dan menyembunyikan jalur rahasia.

### Spesifikasi teknis

| Aspek | Detail |
|---|---|
| Resolusi internal | `480 × 270` px, di-upscale integer ke 1920×1080. Cukup padat untuk detail diorama, tetap ringan untuk browser. |
| Ukuran grid | `32 × 32` px (sesuai snap yang sudah dipakai di proyek). Karakter Kirana ±28 px tinggi, ±3.5 tile tinggi lompatan. |
| Palet | Terbatas 48 warna global + 1 ramp aksen per scene. Dithering hanya untuk kabut, air, dan gradasi langit. |
| Animasi | 8–12 fps untuk karakter (chunky, khas pixel art), 4–6 fps untuk elemen lingkungan (api, air, kain, dedaunan). |
| Pencahayaan | Extension *Lighting* GDevelop: `Light object` untuk obor/pelita, `Light obstacle` pada dinding dan tiang agar bayangan jatuh realistis. |
| Rasa gerak | Coyote time 0.12 s, jump buffer 0.1 s, screen-shake ringan saat mendarat berat. Kecil, tapi inilah yang membedakan platformer enak dan kaku. |

### Susunan lapisan parallax (standar semua peta)

| Lapisan | Kecepatan | Isi |
|---|---|---|
| L0 | 0.05× | **Langit & benda langit** — gradasi waktu, bulan/matahari, awan lambat. Satu gambar besar, nyaris statis. |
| L1 | 0.20× | **Siluet lanskap jauh** — Gunung Kelud & Klotok, kabut lembah, puncak candi kejauhan. Value paling rendah kontrasnya. |
| L2 | 0.45× | **Kompleks bangunan menengah** — atap-atap desa, menara gapura, tajuk pohon besar. Di sinilah kesan "kota" dari referensi dibangun. |
| L3 | 0.75× | **Struktur belakang panggung** — dinding dalam bangunan, rak, tirai, lorong gelap. Menerima cahaya dari lampu gameplay. |
| L4 | 1.00× | **Lapisan gameplay** — semua platform, tangga, NPC, musuh, item. Satu-satunya lapisan dengan collision. |
| L5 | 1.25× | **Foreground dekat** — dedaunan, tiang bambu, kain jemuran, tepi atap. Digelapkan 30–50% + blur ringan. |
| L6 | — | **Atmosfer** — partikel: debu, serbuk cahaya, percik air, serpihan aksara beterbangan, kabut lupa. |

### Ramp warna per babak

- **Prolog** — ungu malam
- **Pasar** — fajar jingga
- **Taman** — giok air
- **Bukit** — kabut biru
- **Gerbang** — bata senja
- **Kedaton** — abu sunyi
- **Finale** — emas hangat

---

## 04 · Mekanik Inti

### A. Pelita Ingatan

Benda kunci yang diberikan Ki Jati di Scene 2. Satu tombol, tiga fungsi — dipelajari bertahap:

| Aksi | Efek |
|---|---|
| **Sorot** (tahan) | Memancarkan kerucut cahaya. Platform yang memudar **kembali padat selama disinari**. Sumber seluruh puzzle platforming babak 2 dan 3. |
| **Kibas** (ketuk) | Letupan cahaya radius pendek. Membubarkan Kabut Lupa dan makhluk kecil, memantulkan proyektil, serta memicu saklar cahaya. |
| **Baca** (tahan + diam) | Mengungkap aksara Kawi tersembunyi di dinding, batu, dan patung. Kunci semua teka-teki pengetahuan. |

**Sumber daya: Minyak Ingatan.** Bar berbentuk pelita di HUD, terkuras saat Sorot digunakan dan saat berdiri di dalam kabut. Diisi ulang di **Damar Pengingat** (juga berfungsi sebagai checkpoint) dan dengan membaca *Serat Keteladanan* tersembunyi. Ini memaksa pemain bergerak efisien — bukan menyorot asal-asalan.

### B. Kabut Lupa

Bahaya lingkungan utama, bukan musuh. Wujudnya: geometri dunia yang di-render semi-transparan dengan dithering, disertai partikel huruf Kawi yang rontok. Tiga tingkat intensitas:

- **Tipis** — platform berkedip; masih bisa dipijak 2 detik sebelum lenyap.
- **Sedang** — platform tidak ada sama sekali sampai disorot.
- **Pekat** — layar meredup, Minyak Ingatan terkuras cepat, suara teredam. Hanya ada di Scene 6–7.

### C. Penghuni Kabut (musuh non-letal)

Kirana tidak pernah membunuh. Jika tersentuh, ia "tersapu" — layar memutih dan ia kembali ke Damar Pengingat terakhir, kehilangan sebagian Minyak. Framing ini menjaga game tetap layak untuk semua usia.

| Makhluk | Perilaku | Cara mengatasi | Muncul |
|---|---|---|---|
| **Kunang Sunyi** | Melayang pelan mengikuti pemain, memadamkan pelita saat menempel | Kibas, atau berlari ke area terang | Scene 2+ |
| **Rayap Aksara** | Merayap di platform, "memakan" huruf sehingga pijakan cepat memudar | Sorot untuk membekukannya, lalu lewati | Scene 3+ |
| **Tapak Hampa** | Jejak kaki tak bertuan yang mengejar dengan ritme tetap | Tidak bisa dilawan — harus dipancing ke jalur buntu | Scene 5 |
| **Bayang Galuh** | Mini-boss. Sisa rasa iri dari kisah asli; meniru gerakan pemain dengan jeda 1 detik | Manfaatkan jeda peniruan untuk menjebaknya di bawah lonceng | Scene 5 |
| **Ki Samar** | Boss akhir. Menghapus platform arena dan melontarkan argumen | Nyalakan 5 Pilar Ingatan + jawab tiga pertanyaan penalaran | Scene 7 |

### D. Serat Sapta Keteladanan

Tujuh pecahan manuskrip, masing-masing membawa satu nilai, satu kilas balik, dan satu kemampuan baru. Inilah tulang punggung progresi:

| # | Serat | Nilai | Kemampuan yang dibuka | Lokasi |
|---|---|---|---|---|
| 1 | Serat Asih | Welas asih | **Langkah Cepat** — lari & geser di bawah celah rendah | Scene 1 · Pasar |
| 2 | Serat Sabar | Kesabaran | **Pelita: Sorot** | Scene 2 · Petirtaan |
| 3 | Serat Jujur | Kejujuran | **Pelita: Baca** | Scene 2 · Petirtaan |
| 4 | Serat Wani | Keberanian | **Pijakan Cahaya** — satu platform cahaya di udara (lompat ganda) | Scene 3 · Bukit Klotok |
| 5 | Serat Andhap | Kerendahan hati | **Pelita: Kibas** | Scene 3 · Goa Selomangleng |
| 6 | Serat Setya | Kesetiaan | **Terjang Kabut** — dash menembus kabut tipis tanpa terkuras | Scene 4 · Gerbang Dhaha |
| 7 | Serat Wicaksana | Kebijaksanaan | **Sorot Jauh** — jangkauan sorot dua kali lipat | Scene 6 · Kedaton |

### E. Koleksi opsional

**12 Kidung Terlupa** — gulungan kecil tersembunyi di sudut sulit tiap peta. Tiap kidung membuka satu entri di *Jurnal Nusantara* (fakta sejarah Kadiri yang benar-benar terverifikasi). Mengumpulkan 12/12 membuka **Ending Emas**: epilog tambahan di mana Kirana kembali ke perpustakaan dan menemukan buku Keong Mas kini memiliki halaman yang sebelumnya kosong. Ini yang memberi alasan untuk memainkan ulang.

---

## 05 · Struktur Cerita

**Tiga Babak:**

- **Babak I — Terlempar** (Prolog, Scene 1–2). Kirana tidak memilih tugas ini; tugas yang memilihnya. Ia belajar bergerak, belajar bahwa dunia ini sedang sakit, dan menerima Pelita. Pertanyaan yang ditanam: *mengapa aku?*
- **Babak II — Memahami** (Scene 3–5). Dewi Kilisuci menjelaskan bahwa kutukan itu bukan sihir, melainkan akibat. Ki Samar muncul pertama kali dan melontarkan keraguan: mungkin melupakan itu wajar. Kirana mulai ragu pada tugasnya sendiri — titik terendahnya.
- **Babak III — Memilih** (Scene 6–8). Kirana menolak argumen Ki Samar bukan dengan kekuatan, tapi dengan menunjukkan tujuh nilai yang ia kumpulkan. Manuskrip disatukan, Putri pulih, dan Kirana dikembalikan — dengan amanat untuk menceritakan ulang dengan caranya sendiri, di zamannya sendiri.

### Tambahan plot yang memperkuat alur

- **Ibu penjual di pasar adalah Mbok Rondo Dadapan.** Dalam kisah asli, dialah yang menemukan keong emas. Di akhir game terungkap ia tinggal sebagai kenangan yang paling keras bertahan — penjelasan alami mengapa dialah yang bisa menyerahkan serat pertama. Ditanam di Scene 1, dibayar di Scene 8.
- **Ki Jati punya alasan pribadi.** Ia abdi dalem yang sudah mulai lupa nama anaknya sendiri. Ia menolong Kirana karena tahu kutukan itu juga memakan dirinya. Memberi taruhan emosional pada NPC pemandu.
- **Ki Samar bukan penjahat murni.** Ia adalah "penjaga arsip" yang lelah — dulu seorang pujangga yang karyanya tak pernah dibaca siapa pun. Argumennya masuk akal, dan itulah yang membuatnya berbahaya. Di akhir ia tidak dimusnahkan, melainkan *diingat*: Kirana menuliskan namanya di lembar kosong manuskrip.
- **Nama yang sama bukan kebetulan.** Kirana dan Candra Kirana. Disinggung ringan di Scene 6, dibiarkan tanpa penjelasan berlebihan — pemain yang menyimpulkan sendiri.

---

## 06 · Rancangan Per Scene

### Prolog · Perpustakaan Tua
**Tutorial · ±4 menit** · Kediri masa kini, malam hujan · Palet: ungu-biru dingin + kuning lampu baca

**Konsep peta:** Potongan melintang gedung perpustakaan tiga lantai — peta yang paling literal meniru referensi. Lantai 1: meja sirkulasi dan pintu kaca yang memantulkan hujan. Lantai 2: lorong rak buku tinggi dengan tangga geser. Lantai 3 (loteng): ruang arsip berdebu dengan jendela bundar. Ketiga lantai terhubung tangga besi di sisi kanan layar. Latar belakang: siluet kota Kediri modern — lampu jalan, papan reklame, atap seng, menara masjid — dengan hujan sebagai partikel foreground.

**Aksi & interaktivitas:**
- Tutorial terselubung: tiga buku dikembalikan ke rak yang benar di tiga lantai berbeda — mengajarkan gerak, lompat, panjat tangga, interaksi, tanpa satu pun teks instruksi kaku.
- Rak buku bisa didorong menjadi pijakan.
- Saklar lampu tiap lantai: mematikan lampu mengungkap Kidung Terlupa #1 di balik rak.
- Objek yang bisa diperiksa memberi monolog pendek yang membangun karakter Kirana.

**Cutscene P-1 — "Halaman yang Hilang"** *(in-engine, kamera dolly-in, 35 detik)*
Kirana membuka buku Keong Mas. Huruf-huruf di halaman mulai terlepas dan melayang naik. Kirana mengulurkan tangan; cahaya putih meledak dari lipatan buku. Layar putih, suara hujan berubah menjadi suara pasar.

> **Kirana** *(membaca pelan)*: "…dan Putri Candra Kirana dikutuk menjadi keong emas." *(menguap)* "Kenapa nggak ada satu pun anak sekarang yang tahu cerita ini, ya?"
> *(Huruf-huruf di halaman mulai rontok.)*
> **Kirana**: "…Lho. Tulisannya—"

---

### Scene 1 · Pasar Tandes, Tepi Brantas
**Aksi & Pengenalan · ±7 menit** · Kadiri, fajar · Palet: jingga fajar, cokelat bambu, hijau lumut

**Konsep peta:** Pasar bertingkat di tepi sungai. Lantai bawah: deretan warung beratap ijuk, tumpukan gerabah, keranjang ikan, kerbau penarik gerobak. Lantai atas: panggung bambu tempat penyimpanan padi, dihubungkan tangga bambu dan jembatan tali. Atap: jalur ketiga berupa atap sirap miring — dipakai untuk sekuens kejar-kejaran. Latar belakang: dermaga kayu, perahu-perahu di Sungai Brantas, siluet Gunung Kelud tertimpa cahaya fajar. Foreground: kain jemuran warna-warni, untaian bawang, jaring ikan tergantung.

Di sudut kiri peta ada satu warung yang **berkedip transparan** — perkenalan visual pertama pada Kabut Lupa, tanpa penjelasan apa pun.

**Quest utama — "Sarapan yang Berhutang":**
1. Kirana lapar dan tak punya uang kepeng. Mbok penjual menawarkan tukar tenaga: antar tiga pesanan ke tiga pelanggan di tiga ketinggian berbeda (bawah, panggung, atap). Tutorial traversal yang menyamar sebagai narasi.
2. Saat pesanan ketiga diantar, seekor lutung pasar menyambar bungkusan berisi Serat Asih.
3. **Sekuens kejar-kejaran atap (±50 detik).** Kamera bergerak paksa ke kanan, pemain melompati atap, menghindari tiang jemuran, menerobos gerobak, memanjat jaring. Berakhir di dermaga: lutung terpojok, Kirana tidak merebut paksa — ia menyerahkan sisa makanannya. Lutung menukar bungkusan itu sukarela. *Nilai welas asih disampaikan lewat aksi, bukan khotbah.*

**Interaktivitas tambahan:**
- 9 NPC pasar dengan dialog satu-dua baris; tiga di antaranya menyebut Putri Candra Kirana dengan nada ragu, menanam misteri.
- Mini-game dakon (congklak) melawan anak kecil. Menang = Kidung Terlupa #2.
- Tumpukan keranjang bisa dijatuhkan jadi pijakan; gerobak bisa didorong.
- Jalur rahasia di bawah dermaga (butuh geser/slide) → Kidung Terlupa #3.

**Cutscene 1-A — "Titah dari Warung"** *(dialog box + potret, kamera statis, 40 detik, diakhiri satu layar lukis)*

> **Mbok Penjual**: "Nduk, kowe katon luwe. Mampir warung mbok dhisik."
> **Kirana**: "Terima kasih, Mbok… tapi saya tidak punya uang. Dan sejujurnya saya juga tidak tahu saya ada di mana."
> **Mbok Penjual** *(tersenyum, sama sekali tidak terkejut)*: "Mbok ngerti. Wong sing teka saka adoh pancen ngono. Bantu mbok telu wae, mengko mbok wenehi sing luwih penting tinimbang sega."
> *(Setelah tiga pesanan selesai)*
> **Mbok Penjual**: "Iki. Gawanen menyang Tuan Putri Candra Kirana ing Kedaton Dhaha. Aja ditolak, Nduk — dalem mung wong cilik. Kowe sing diparingi titah."
> **Kirana**: "Kenapa harus saya? Saya bahkan bukan dari sini."
> **Mbok Penjual**: "Justru mula saka kuwi. Sing isih éling, mung kowe."

---

### Scene 2 · Petirtaan & Taman Wijayakusuma
**Puzzle Lingkungan · ±8 menit** · Taman luar istana, pagi berkabut · Palet: giok, batu andesit basah, putih bunga

**Konsep peta:** Taman air berteras empat tingkat yang menurun ke kanan, mengikuti model petirtaan Jawa Timur. Tiap teras punya kolam, pancuran batu berkepala makara, saluran air terbuka. Platform utama: batu pijakan di tengah kolam, akar beringin melintang, papan kayu yang naik-turun mengikuti ketinggian air. Dinding belakang berupa relief batu panjang yang menceritakan kisah Candra Kirana — sebagian sudah aus dan kosong. Latar: tembok luar istana dengan gapura paduraksa, pohon beringin raksasa, kabut pagi tipis. Foreground: rumpun bunga Wijayakusuma putih yang memancarkan cahaya lembut dan berfungsi sebagai penanda jalur.

**Quest utama — "Air yang Mengingat":**
1. **Puzzle pintu air (3 tuas).** Tiga tuas batu mengarahkan air ke teras berbeda. Menaikkan air di teras 2 menaikkan papan kayu ke ketinggian yang bisa dilompati; tapi juga merendam jalur di teras 3. Diselesaikan dua tahap berurutan — mengajarkan bahwa tindakan punya konsekuensi berantai.
2. **Serat Sabar** didapat setelah menunggu kolam terisi penuh — satu-satunya momen di game di mana pemain harus benar-benar diam dan menunggu ±8 detik sambil relief dinding menyala satu per satu.
3. **Puzzle relief aus.** Empat panel relief kosong. Dengan *Pelita: Baca* (baru didapat), aksara Kawi tersembunyi muncul. Pemain menyusun empat panel sesuai urutan kisah yang benar. Jawaban salah membuat air pasang, memaksa mengulang dari teras atas. Hadiah: **Serat Jujur**.

**Interaktivitas tambahan:**
- Bunga Wijayakusuma mekar saat disorot pelita → lentera permanen kecil.
- Ikan-ikan menyebar saat Kirana masuk air; satu ikan emas selalu berenang ke jalan rahasia (petunjuk Kidung #4).
- Kunang Sunyi pertama muncul di teras terbawah.
- Damar Pengingat pertama ditempatkan di teras 2.

**Cutscene 2-A — "Abdi yang Lupa Nama Anaknya"** *(in-engine, pan lambat menyusuri relief lalu ke wajah Ki Jati, 55 detik)*

> **Ki Jati**: "Pakaianmu asing, Nak. Tapi tanganmu memegang sesuatu yang kukenal lebih baik daripada wajahku sendiri."
> **Kirana**: "Saya Kirana. Mbok penjual di pasar meminta saya menyerahkan ini pada Tuan Putri."
> **Ki Jati** *(mengamati, tangannya bergetar)*: "Pecahan Serat. Sudah tiga puluh tahun aku menjaga taman ini… dan tiga tahun terakhir, tembok ini mulai kosong sendiri." *(menyentuh relief yang aus)* "Dulu di sini ada gambar Putri memberi makan burung. Aku ingat pernah melihatnya. Tapi aku tidak lagi ingat bagaimana bentuknya."
> **Kirana**: "Ki… kenapa Ki Jati menangis?"
> **Ki Jati**: "Kemarin aku memanggil anakku. Lalu aku sadar aku tidak tahu nama yang kupanggil." *(menyerahkan pelita kuningan tua)* "Bawalah ini. Pelita Ingatan. Selama ia menyala, yang terlupa masih bisa dipijak. Tapi minyaknya terbatas, Nak — seperti ingatan."

---

### Scene 3 · Bukit Klotok & Goa Selomangleng
**Platforming Vertikal · ±9 menit** · Lereng hutan di belakang istana, siang berkabut · Palet: biru kabut, batu abu, emas ilahi

**Konsep peta:** Satu-satunya peta yang bergerak ke atas, bukan ke samping — kamera menanjak vertikal. Tiga bagian:
- **3A · Lereng Hutan.** Tebing berundak dengan akar beringin melintang, batu rapuh (runtuh 1 detik setelah dipijak), air terjun kecil. Kabut naik dari bawah dan perlahan menelan platform yang sudah dilewati.
- **3B · Mulut Goa Selomangleng.** Bukaan goa di dinding tebing, diapit relief pertapaan. Titik istirahat dan Damar Pengingat.
- **3C · Dalam Goa.** Ruang potongan melintang — beberapa bilik pertapaan bertingkat terlihat sekaligus, dihubungkan celah sempit dan tonjolan batu. Gelap total kecuali radius pelita.

Latar belakang lereng: lembah Kadiri terbentang di bawah, sawah berpetak, Sungai Brantas berkelok, kepulan Gunung Kelud di kejauhan.

**Quest utama — "Naik ke Tempat Sunyi":**
1. Panjatan berbatas waktu. Kabut naik konstan; menyentuhnya hanya menguras Minyak dan memburamkan layar.
2. **Serat Wani** di ujung tonjolan batu yang putus — satu-satunya cara mencapainya adalah melompat ke jurang yang tampak kosong dan memercayai pelita akan memunculkan pijakan. Membuka **Pijakan Cahaya**.
3. **Puzzle aksara di dalam goa.** Lima relief pertapaan menunjukkan lima simbol Kawi. Pemain menyalakan lima cerukan lilin sesuai urutan pahatan — pahatan hanya terbaca dengan *Pelita: Baca*, sementara menyalakan lilin butuh minyak. Hadiah: **Serat Andhap** dan kemampuan **Kibas**.
4. **Sekuens lari keluar goa (±40 detik).** Goa mulai dilupakan — dinding memudar dari belakang, mengejar pemain. Penutup babak II yang penuh adrenalin.

**Cutscene 3-A — "Yang Bercahaya di Batu"** *(layar lukis + in-engine, 70 detik — cutscene terpanjang di game)*

> **Dewi Kilisuci**: "Aku Kilisuci. Yang memilih menyepi agar tak menjadi rebutan. Dan kini aku hampir menjadi apa yang paling kutakuti — bukan dilupakan orang lain, melainkan tak punya siapa pun untuk diingat."
> **Kirana**: "Dewi… saya masih tidak mengerti. Kutukan apa sebenarnya yang menimpa Tuan Putri?"
> **Dewi Kilisuci**: "Bukan sihir hitam, Nak. Tidak ada penyihir yang bisa disalahkan kali ini." *(bayangan orang-orang masa kini muncul di dinding goa, menunduk menatap benda bercahaya di tangan mereka)* "Kutukannya bernama kelalaian. Di zamanmu, kisah beliau tak lagi diceritakan. Tanpa diceritakan, ia tak diingat. Tanpa diingat—" *(bayangan memudar)* "—ia tak ada."
> **Kirana**: "Jadi yang membuat Putri menghilang… adalah orang-orang seperti saya."
> **Dewi Kilisuci**: "Dan yang bisa mengembalikannya, juga orang seperti kamu. Itu sebabnya kau dipanggil, bukan pahlawan berpedang. Pedang tak bisa melawan lupa. Hanya cerita yang bisa."
> *(Menyerahkan pecahan. Lalu suaranya melembut.)*
> **Dewi Kilisuci**: "Satu hal lagi. Kau akan bertemu seseorang yang mengatakan bahwa membiarkan kisah mati adalah belas kasihan. Dengarkan dia baik-baik, Kirana. Karena ia tidak sepenuhnya salah."

---

### Scene 4 · Gerbang Dhaha
**Teka-teki & Siasat · ±7 menit** · Benteng luar kedaton, sore · Palet: bata merah, emas senja, bayangan panjang

**Konsep peta:** Satu arena tertutup, bukan level berjalan — peta paling padat interaksi. Gerbang paduraksa raksasa dari bata merah mendominasi tengah layar, diapit dua patung dwarapala. Kiri dan kanan ada struktur bertingkat: pos jaga, tangga benteng, gudang senjata, galeri beratap. Latar: dinding benteng memanjang, atap-atap kedaton di balik tembok, burung gagak, langit senja jingga pekat. Foreground: umbul-umbul, tombak tersandar, akar menjalar di bata.

**Quest utama — "Nama Sejati Kerajaan":**
1. Empat batu putar di dada patung dwarapala, masing-masing menampilkan aksara Kawi. Menyusun jadi nama lama kerajaan: `D–A–H–A`.
2. Petunjuknya tidak diberikan langsung — empat petunjuk tersebar di peta, masing-masing membutuhkan aksi berbeda:
   - *Aksara 1* — terpahat di bawah lumut, dibersihkan dengan air dari kendi yang dibawa dari pos jaga.
   - *Aksara 2* — hanya terlihat saat bayangan tiang mencapai posisi tertentu; putar cermin perunggu di menara untuk memantulkan cahaya senja.
   - *Aksara 3* — tertulis di gulungan di dalam gudang yang terkunci; kuncinya ada di sabuk penjaga yang sedang tidur — mini-stealth ±20 detik, satu-satunya di game.
   - *Aksara 4* — sudah dimakan Kabut Lupa. Hanya muncul dengan *Pelita: Baca*.
3. Setelah gerbang terbuka, Kabut menyeruak keluar dari dalam kedaton. **Serat Setya** didapat di sini, membuka **Terjang Kabut**.

**Interaktivitas tambahan:**
- Penjaga bisa diajak bicara berulang; memberi petunjuk makin jelas tiap 3 kali ditanya. Sistem anti-buntu wajib — tidak ada pemain yang boleh terjebak di sini lebih dari 5 menit.
- 6 dari 11 objek yang bisa diperiksa memberi lore, 1 menyembunyikan Kidung Terlupa #7.
- Jalur alternatif opsional: memanjat akar di sisi kanan tembok melewati gerbang sepenuhnya (penjaga menegur dengan humor; pemain kehilangan Serat Setya sampai kembali menyelesaikan teka-teki).

**Cutscene 4-A — "Pertemuan Pertama dengan Ki Samar"** *(in-engine, cahaya senja meredup mendadak, semua suara ambient berhenti kecuali satu, 45 detik)*

> *(Gerbang terbuka. Kabut mengalir keluar. Dari dalam kabut, sosok bertudung menulis di gulungan tanpa menoleh.)*
> **Ki Samar**: "Delapan ratus tahun aku mencatat nama-nama yang berhenti disebut. Kau tahu berapa banyak? Aku juga tidak. Aku berhenti menghitung."
> **Kirana**: "Siapa kamu?"
> **Ki Samar**: "Seseorang yang dulu menulis dan tak pernah dibaca. Sekarang aku hanya merapikan." *(menutup gulungan)* "Kau membawa pelita. Berarti kau berniat menahan sesuatu yang sudah waktunya berhenti."
> **Kirana**: "Saya membawa kembali sesuatu yang dilupakan."
> **Ki Samar**: "Dilupakan, atau dilepaskan? Katakan jujur, Nak — di duniamu, berapa orang yang *memilih* untuk tidak lagi menceritakan kisah ini? Bukankah lebih kejam memaksa sebuah kisah hidup di tempat yang tak menginginkannya?"
> *(Ia menghilang ke dalam kabut. Kirana berdiri diam. Pemain diberi kendali kembali, tapi tanpa musik selama 15 detik.)*

---

### Scene 5 · Kedaton Dhaha — Pendapa & Gandok
**Mini-boss & Ketegangan · ±8 menit** · Interior istana, sore menuju malam · Palet: abu sunyi, emas pudar, hitam bayang

**Konsep peta:** Peta yang paling mirip referensi. Potongan melintang bangunan istana dua-tiga lantai: pendapa terbuka dengan soko guru raksasa di lantai dasar, gandok (bilik samping) bertingkat di kanan, loteng penyimpanan pusaka di atas. Semua bilik terlihat sekaligus dari satu layar. Cahaya dari obor dinding jatuh membentuk kerucut tajam di lantai kayu. Latar belakang: halaman dalam dengan pohon sawo kecik, koridor berbayang, bukaan atap yang menampakkan langit menjadi malam. Foreground: tirai sutra tipis melambai, tiang kayu ukir, asap dupa.

Kondisi khusus: **Kabut Lupa tingkat sedang di seluruh peta.** Sekitar 40% lantai dan tangga tidak ada sampai disorot.

**Quest utama — "Istana yang Melupakan Dirinya":**
1. Traversal bersyarat — sorot untuk memadatkan lantai, Minyak terus terkuras. Level ini pada dasarnya puzzle rute: mana urutan tercepat menuju loteng.
2. **Tapak Hampa** mulai memburu di koridor sempit. Tidak bisa dilawan; harus dipancing ke bilik buntu lalu ditinggal.
3. **Mini-boss: Bayang Galuh.** Di pendapa utama. Meniru setiap gerakan Kirana dengan jeda satu detik. Solusi: berdiri tepat di bawah lonceng gantung, melompat pada saat terakhir, sehingga Bayang meniru posisi itu satu detik kemudian dan tertimpa dentang lonceng. Tiga kali pengulangan dengan posisi lonceng berbeda.
4. Setelah Bayang lenyap, ia meninggalkan satu kalimat yang mengubah nada cerita: "Aku hanya iri karena tak ada yang menceritakan versiku."

**Cutscene 5-A — "Ruang Pusaka"** *(in-engine, kamera naik menyusuri potongan melintang istana dari pendapa ke loteng, 30 detik)*
Kirana menemukan lemari pusaka berisi puluhan gulungan yang semuanya kosong. Satu-satunya yang masih bertulisan adalah namanya sendiri: *Candra Kirana*. Ia menyentuh huruf itu dan huruf itu ikut memudar di bawah jarinya. Layar gelap sesaat. Kirana menarik tangannya, lalu berlari.

---

### Scene 6 · Bangsal Sunyi
**Boss Akhir · ±9 menit** · Ruang tanpa tembok di balik kedaton · Palet: hitam-ungu, putih aksara, emas pilar

**Konsep peta:** Arena tunggal, simetris, mengambang di kehampaan. Lima **Pilar Ingatan** dari batu andesit berdiri melingkar, masing-masing di ketinggian berbeda. Di antaranya ada platform yang muncul dan hilang mengikuti ritme napas Ki Samar. Latar belakang bukan gambar, melainkan ruang gelap penuh huruf Kawi yang mengambang, membentuk dan membubarkan diri. Setiap kali satu pilar menyala, sebagian latar belakang "terisi" menjadi pemandangan Kadiri yang utuh.

**Struktur boss — tiga fase:**
1. **Fase 1 · Menghapus.** Ki Samar menghapus platform satu per satu. Pemain mencapai dan menyalakan 2 pilar dengan pelita. Menguji *Pijakan Cahaya* dan *Sorot*.
2. **Fase 2 · Menenggelamkan.** Kabut pekat naik dari bawah arena, menguras Minyak terus-menerus. Menyalakan 2 pilar lagi dengan Minyak terbatas. Menguji *Terjang Kabut*.
3. **Fase 3 · Berargumen.** Semua aksi berhenti. Ki Samar mengajukan tiga pertanyaan penalaran, masing-masing tiga pilihan jawaban tanpa jawaban "benar" yang sepele — tiap pilihan mencerminkan sikap berbeda terhadap memori dan warisan budaya. Jawaban konsisten dengan tujuh nilai yang dikumpulkan menyalakan pilar kelima. Jawaban tidak konsisten tidak membuat kalah — hanya membuat pilar menyala lebih redup, dan mengubah nuansa dialog penutup.

> **Contoh Pertanyaan Fase 3**
> **Ki Samar**: "Sebuah kisah diceritakan ulang sampai berubah dari aslinya. Apakah kisah itu masih kisah yang sama?"
> a. Tidak. Yang berubah berarti sudah mati. *(sikap pelestarian kaku)*
> b. Ya, selama nilainya bertahan. Bentuk boleh berganti. *(selaras dengan Serat Wicaksana)*
> c. Tidak penting. Yang penting ada yang menceritakan. *(sikap pragmatis)*

**Penyelesaian:** Ki Samar tidak dimusnahkan. Setelah pilar kelima menyala, Kirana menyodorkan lembar kosong di ujung manuskrip dan memintanya menuliskan namanya sendiri. Ia ragu, lalu menulis. Tudungnya jatuh — wajahnya wajah orang biasa. Ia berterima kasih, dan larut menjadi cahaya yang bergabung dengan pilar.

**Cutscene 6-A — "Nama di Lembar Kosong"**

> **Ki Samar**: "Kau menang. Tapi kau belum menjawab pertanyaanku yang sesungguhnya. Kenapa kisah *ini* layak diselamatkan, dan kisahku tidak?"
> **Kirana** *(membuka manuskrip, menunjuk lembar terakhir yang kosong)*: "Siapa bilang tidak? Manuskrip ini belum selesai. Tulis namamu."
> **Ki Samar**: "…Apa?"
> **Kirana**: "Kamu bilang kamu menulis dan tidak pernah dibaca. Sekarang ada yang membaca. Saya." *(menyodorkan pena)* "Tulis."
> *(Hening panjang. Tangan bertudung itu menulis empat aksara. Kabut di seluruh ruangan surut.)*
> **Ki Samar**: "Delapan ratus tahun… dan yang kubutuhkan hanya satu orang yang bertanya siapa namaku."

---

### Scene 7 · Kamar Tuan Putri
**Klimaks Emosional · ±5 menit** · Bilik dalam kedaton, malam · Palet: emas hangat, sutra gading, biru rembulan

**Konsep peta:** Ruang kecil dan tenang — kontras total setelah boss. Tidak ada musuh, tidak ada rintangan. Bilik dengan dipan berukir, tirai sutra, meja rias perunggu, jendela terbuka menghadap bulan. Cahaya bulan masuk membentuk satu kolam terang di lantai. Detail penting: separuh benda di kamar ini setengah transparan — Putri sudah hampir sepenuhnya terlupakan. Saat manuskrip disatukan, benda-benda itu kembali padat satu per satu dari kiri ke kanan.

**Interaksi utama — Minigame penyusunan manuskrip:** Tujuh serat ditampilkan sebagai kepingan yang bisa digeser. Pemain menyusunnya berdasarkan urutan kronologis kisah, bukan bentuk kepingannya — setiap serat menampilkan satu kalimat dan satu ilustrasi pixel art kecil. Tidak ada batas waktu, tidak ada kegagalan; jika salah tiga kali, Putri memberi petunjuk lembut. Ini momen di mana seluruh materi edukatif game "dibacakan" ulang secara ringkas oleh pemain sendiri.

**Cutscene 7-A — "Cahaya yang Pulang"** *(layar lukis penuh + in-engine, kamera menarik jauh ke belakang, 60 detik)*

> **Candra Kirana** *(terbangun, suaranya nyaris tak terdengar)*: "Siapa namamu, gadis muda? Sudah begitu lama tak ada yang memanggilku dengan nama itu."
> **Kirana**: "Kirana, Tuan Putri. Sama seperti nama Tuan Putri."
> **Candra Kirana** *(tersenyum samar)*: "Tentu saja."
> *(Kirana menyerahkan manuskrip yang utuh. Cahaya keemasan menjalar.)*
> **Candra Kirana**: "Kertas ini… bukan hanya kisahku. Ini ajaran yang dituliskan leluhurku agar ada yang meneruskan. Bagaimana kau menyatukannya?"
> **Kirana**: "Satu per satu. Ada yang saya dapat dari kebaikan seorang mbok penjual, ada yang dari kesabaran seorang abdi, ada yang harus saya ambil dengan berani." *(jeda)* "Dan yang terakhir diberikan oleh orang yang paling ingin semua ini dilupakan."
> **Candra Kirana**: "Maka kau tidak hanya mengumpulkan kertas. Kau menjalaninya." *(berdiri, tubuhnya kembali padat)* "Kembalilah ke tempat asalmu, Kirana. Jangan hanya simpan kisah ini. Ceritakan — dengan caramu, dengan bahasamu, di zamanmu. Kisah yang tidak diceritakan ulang akan mati dua kali."

---

### Scene 8 · Kembali ke Perpustakaan
**Epilog · ±2 menit** · Kediri masa kini, menjelang subuh · Palet: biru subuh berubah jingga

**Konsep peta:** Peta prolog digunakan ulang — hujan sudah reda, langit di balik jendela berubah dari ungu ke jingga subuh. Penggunaan ulang aset ini hemat produksi sekaligus bermakna: pemain langsung merasakan perubahan karena mengenali ruangnya.

**Aksi penutup:**
- Pemain berjalan ke meja, membuka kembali buku Keong Mas. Halaman yang tadinya rontok kini penuh — dan di lembar terakhir tertulis satu nama tambahan yang tidak ada di edisi mana pun.
- Poster UKM Pendidikan & Penalaran di papan pengumuman kini memuat tanggal kegiatan yang nyata. Berinteraksi dengannya memunculkan **tombol transisi ke situs UKM PP** dengan animasi cahaya yang sama seperti portal di prolog.
- **Layar Jurnal Nusantara** ditampilkan: daftar 7 Serat + Kidung Terlupa yang terkumpul, dengan persentase penyelesaian.
- **Ending Emas (12/12 Kidung):** adegan tambahan — seorang anak kecil masuk perpustakaan, mengambil buku yang sama, mulai membaca. Kamera menahan. Fade.

---

## 07 · Tabel Progresi

| Scene | Durasi | Identitas mekanik | Kemampuan baru | Serat | Kidung |
|---|---|---|---|---|---|
| Prolog · Perpustakaan | 4′ | Tutorial terselubung | Gerak dasar, interaksi | — | 1 |
| 1 · Pasar Tandes | 7′ | Kejar-kejaran atap | Langkah Cepat (lari & geser) | 1 | 2 |
| 2 · Petirtaan | 8′ | Puzzle air bertingkat | Pelita: Sorot & Baca | 2 | 2 |
| 3 · Bukit & Goa | 9′ | Panjat vertikal + escape | Pijakan Cahaya, Kibas | 2 | 2 |
| 4 · Gerbang Dhaha | 7′ | Teka-teki arena tertutup | Terjang Kabut | 1 | 2 |
| 5 · Kedaton | 8′ | Traversal kabut + mini-boss | — | — | 2 |
| 6 · Bangsal Sunyi | 9′ | Boss tiga fase + penalaran | Sorot Jauh | 1 | 1 |
| 7 · Kamar Putri | 5′ | Minigame penyusunan | — | — | 1 |
| 8 · Epilog | 2′ | Penutup & jurnal | — | — | — |

---

## 08 · Sistem Cutscene

Tiga format dipakai bergantian supaya cutscene tidak terasa monoton dan biaya produksi tetap terkendali:

| Tipe | Deskripsi |
|---|---|
| **A · In-engine** | Karakter bergerak di peta yang sama, kamera di-tween. Paling murah, dipakai untuk 70% cutscene. Kontrol pemain dinonaktifkan, tombol *skip* muncul setelah 2 detik. |
| **B · Dialog + potret** | Kotak dialog dengan potret pixel art setengah badan (4 ekspresi per karakter utama). Untuk percakapan panjang seperti 2-A dan 4-A. |
| **C · Layar lukis** | Ilustrasi pixel art penuh layar untuk momen puncak saja. Maksimal 7 gambar di seluruh game — satu per Serat, sebagai kilas balik kehidupan Candra Kirana. |

**Aturan Baku Cutscene:**
- Tidak ada cutscene lebih dari 70 detik. Yang lebih panjang dipecah dengan segmen bermain di tengahnya.
- Tombol *skip* dan *auto* selalu tersedia. Pemain yang mengulang tidak boleh dihukum.
- Setiap cutscene harus menjawab satu pertanyaan *dan* menimbulkan satu pertanyaan baru. Jika tidak, ia dipotong.
- Nilai moral tidak pernah disampaikan lewat dialog langsung ("kita harus jujur"). Selalu lewat tindakan karakter atau lewat mekanik yang harus dijalani pemain.

---

## 09 · UI, HUD, dan Jurnal

- **HUD minimal** (pojok kiri atas): ikon pelita kuningan yang nyalanya meredup seiring Minyak berkurang — tanpa angka, tanpa bar konvensional. Di bawahnya, 7 kotak kecil untuk Serat yang terisi satu per satu.
- **Tidak ada health bar.** Kondisi bahaya ditandai dengan vignette biru yang mengeras di tepi layar dan suara yang meredam.
- **Jurnal Nusantara** (tombol J / ikon buku): tiga tab — *Serat* (nilai yang sudah dikumpulkan), *Tokoh* (profil Candra Kirana, Kilisuci, Ki Jati, Ki Samar, Mbok Rondo), *Kadiri* (entri sejarah dari Kidung Terlupa). Menekan jeda di sini juga berfungsi sebagai pause menu.
- **Bantuan bertahap:** jika pemain diam di satu area lebih dari 90 detik tanpa progres, bunga Wijayakusuma terdekat berdenyut pelan ke arah tujuan.
- **Kontrol:** keyboard (panah/WASD + Z/X/C) dan sentuh (d-pad kiri, tiga tombol kanan) dengan tata letak yang sama.

---

## 10 · Catatan Implementasi GDevelop

| Aspek | Catatan |
|---|---|
| Behavior utama | `Platformer character` untuk Kirana, `Platform` untuk lantai, `Pathfinding` untuk Tapak Hampa, `Tween` untuk seluruh gerak kamera cutscene. |
| Extension | *Lighting* (pelita & obor), *Dialogue Tree* + Yarn (semua percakapan disimpan di satu berkas `.json`), *Inventory* (Serat & Kidung), *Screen shake*, *Fire bullet* (partikel kibas). |
| Kabut Lupa | Satu objek `PlatformFaded` dengan variabel `terlihat`. Event global: jika jarak ke pelita < radius dan pelita aktif → opacity 255 + behavior Platform aktif; jika tidak → opacity 60 + behavior nonaktif. Satu event sheet eksternal dipakai ulang di semua scene. |
| Parallax | 7 layer per scene dengan camera X/Y multiplier sesuai tabel di bagian 03. Simpan sebagai template scene supaya konsisten. |
| Penyimpanan | Extension *Storage* untuk progres scene, Serat, Kidung, dan checkpoint terakhir. Kunci tunggal `cahayakadiri_save` berisi satu struktur. |
| Performa web | Atlas tekstur maksimal 2048×2048, partikel dibatasi 120 per scene, matikan objek di luar kamera dengan behavior *Destroy outside screen* untuk partikel. Target 60 fps pada laptop kelas menengah. |
| Integrasi web UKM | Aksi `Open URL` pada tombol epilog. Simpan status penyelesaian di storage agar situs bisa menampilkan lencana bagi yang sudah tamat. |

---

## 11 · Roadmap Produksi

| Sprint | Fokus | Hasil yang bisa diuji |
|---|---|---|
| **1 · Fondasi** (2 minggu) | Gerak Kirana, sistem pelita, Kabut Lupa, template parallax 7 layer | Satu ruang kotak abu-abu tempat semua mekanik inti bisa dicoba (greybox) |
| **2 · Vertical slice** (3 minggu) | Scene 2 (Petirtaan) lengkap: seni final, puzzle air, Ki Jati, cutscene 2-A | Satu level yang terlihat dan terasa seperti produk jadi — validasi arah seni |
| **3 · Babak I & II** (4 minggu) | Prolog, Scene 1, 3, 4 | Alur main sampai gerbang Dhaha, siap uji pemain pertama |
| **4 · Babak III** (3 minggu) | Scene 5, 6, 7, 8 + sistem Jurnal | Game utuh dari awal sampai akhir (content complete) |
| **5 · Poles** (2 minggu) | Audio, umpan balik uji pemain, balancing Minyak, optimasi web, kontrol sentuh | Rilis |

---

## 12 · Prioritas Bila Waktu Terbatas

Jika jadwal menyempit, potong dengan urutan ini — dari yang paling aman dilepas:

1. Ending Emas dan 12 Kidung Terlupa (jadikan 6 saja).
2. Mini-stealth di Scene 4 → ganti dengan penjaga yang menyerahkan kunci setelah ditanya.
3. Scene 5 digabung ke Scene 6 (mini-boss Bayang Galuh menjadi fase 0 dari boss akhir).
4. Layar lukis dikurangi dari 7 menjadi 3 (Serat 1, 4, 7).

> **Jangan Dipotong:** Mekanik Pelita Ingatan + Kabut Lupa, fase argumen Ki Samar, dan minigame penyusunan manuskrip di Scene 7. Ketiganya adalah alasan game ini berbeda dari platformer edukatif biasa. Tanpa ketiganya, yang tersisa hanya cerita yang dibacakan sambil melompat.

---

*Cahaya Kadiri — Game Development Plan v2.0 · Dokumen kerja untuk UKM Pendidikan & Penalaran.*
*Dokumen ini mencakup storyline, konsep peta, rancangan quest, dan sistem cutscene. Tidak memuat prompt pembuatan aset.*
