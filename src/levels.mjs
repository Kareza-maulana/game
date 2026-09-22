import petirtaan from './level.mjs';
const node=(id,type,x,y,label,extra={})=>({id,type,x,y,label,...extra});
const defaults={width:960,height:512,platforms:[],faded:[],levers:[],damars:[],kidung:[],flowers:[],ladders:[],nodes:[],fog:[-100,-50],checkpoints:[[56,320]],palette:'jade'};
const library={width:960,height:608,platforms:[[0,544,960,64],[0,384,896,12],[0,224,896,12]],ladders:[[832,224,24,320]],checkpoints:[[56,512],[768,352],[768,192]],damars:[[80,544],[784,384],[784,224]],background:'library',backgroundBox:[0,0,960,608],backgroundLayer:'L3Walls'};
export default [
  {...defaults,...library,id:'Prolog',name:'Perpustakaan Tua',chapter:'PROLOG · KEDIRI MASA KINI',quest:'Halaman yang Hilang',palette:'purple',next:'Pasar',exit:[112,192],
    nodes:[node('book0','book',176,512,'Rak cerita rakyat',{index:0}),node('book1','book',400,352,'Rak pengetahuan',{index:1}),node('book2','book',672,192,'Rak arsip',{index:2}),
      ...[512,352,192].map((y,i)=>node('lamp'+i,'lamp',752,y,'Saklar lampu lantai '+(i+1),{index:i})),node('keong','portal',112,192,'Buku Keong Mas'),node('poster','lore',80,512,'Papan UKM'),node('shelf','push',560,512,'Rak beroda')],kidung:[[1,480,338]]},
  {...defaults,id:'Pasar',name:'Pasar Tandes · Tepi Brantas',chapter:'BABAK I · TERLEMPAR',quest:'Sarapan yang Berhutang',width:2048,height:608,background:'market',palette:'orange',next:'Petirtaan',exit:[1952,512],checkpoints:[[56,512],[992,320],[1856,512]],damars:[[80,544],[1008,352],[1872,544]],
    platforms:[[0,544,2048,64],[192,448,416,12],[416,352,448,12],[896,352,256,12],[1216,352,192,12],[1472,352,192,12],[1728,448,192,12]],ladders:[[288,448,24,96],[688,352,24,192]],
    nodes:[node('mbok','mbok',128,512,'Mbok penjual'),node('order0','order',352,512,'Antar pesanan · pembuat gerabah',{index:0}),node('order1','order',496,416,'Antar pesanan · pengangkut padi',{index:1}),node('order2','order',768,320,'Antar pesanan · penjaga atap',{index:2}),node('lutung','lutung',1904,512,'Lutung di dermaga'),node('dakon','dakon',240,512,'Anak pemain dakon'),node('basket','push',160,512,'Keranjang'),node('slide','slide',1776,512,'Celah di bawah dermaga'),...['Tukang perahu','Penjual kain','Penganyam','Pembeli ikan','Penjaga dermaga'].map((n,i)=>node('npc'+i,'lore',576+i*96,512,n))],kidung:[[2,256,518],[3,1808,518]]},
  {...defaults,...petirtaan,id:'Petirtaan',chapter:'BABAK I · TERLEMPAR',quest:'Air yang Mengingat',background:'petirtaan',next:'Bukit',nodes:[node('jati','jati',132,320,'Ki Jati'),node('relief','relief',1216,320,'Relief yang aus')]},
  {...defaults,id:'Bukit',name:'Bukit Klotok & Goa Selomangleng',chapter:'BABAK II · MEMAHAMI',quest:'Naik ke Tempat Sunyi',width:960,height:1184,background:'hill',backgroundBox:[-20,-40,1000,1320],backgroundLayer:'L3Walls',palette:'blue',next:'Gerbang',exit:[848,160],
    checkpoints:[[56,1088],[464,704],[560,384]],damars:[[80,1120],[480,736],[576,416]],
    platforms:[[0,1120,960,64],[160,1024,128,12],[288,928,128,12],[416,832,128,12],[416,736,256,12],[288,640,128,12],[160,544,128,12],[320,448,128,12],[512,416,384,12],[576,304,192,12],[768,192,192,12]],
    faded:[[688,688,48,12],[752,656,48,12]],ladders:[[416,736,24,192]],
    nodes:[node('wani','wani',816,624,'Cahaya di ujung jurang'),node('kilisuci','kilisuci',560,384,'Dewi Kilisuci'),node('carving','carving',640,384,'Pahatan pertapaan'),node('candles','candles',752,384,'Lima cerukan lilin'),node('escape','escape',640,272,'Lorong yang memudar')],kidung:[[6,352,618],[7,704,282]],flowers:[[432,736],[544,416],[816,192]]},
  {...defaults,id:'Gerbang',name:'Gerbang Dhaha',chapter:'BABAK II · MEMAHAMI',quest:'Nama Sejati Kerajaan',width:1280,background:'gate',palette:'brick',next:'Kedaton',exit:[1184,320],checkpoints:[[56,320],[1008,320]],damars:[[80,352],[1024,352]],
    platforms:[[0,352,1280,160],[128,256,192,12],[384,224,224,12],[800,256,288,12]],ladders:[[240,224,24,128],[1008,224,24,128]],
    nodes:[node('guard','guard',112,320,'Penjaga gerbang'),node('jug','jug',176,224,'Kendi air'),node('moss','moss',352,320,'Aksara berlumut'),node('mirror','mirror',480,192,'Cermin perunggu'),node('sleeper','sleeper',848,224,'Penjaga tertidur'),node('store','store',736,320,'Gudang terkunci'),node('lost','lost',960,320,'Batu yang terlupa'),node('gate','gate',608,320,'Empat batu putar'),node('roots','lore',1136,320,'Akar tembok')],kidung:[[8,1056,234]],flowers:[[384,352],[640,352],[992,352]]},
  {...defaults,id:'Kedaton',name:'Kedaton Dhaha · Pendapa & Gandok',chapter:'BABAK II · MEMAHAMI',quest:'Istana yang Melupakan Dirinya',width:1440,height:704,background:'palace',backgroundBox:[0,0,1440,704],backgroundLayer:'L3Walls',palette:'grey',next:'Bangsal',exit:[1312,160],checkpoints:[[56,576],[448,416],[1088,256]],damars:[[80,608],[464,448],[1104,288]],
    platforms:[[0,608,1440,96],[192,512,128,12],[384,448,256,12],[704,448,160,12],[1056,448,192,12],[1056,288,288,12],[1248,192,160,12]],
    faded:[[864,416,48,12],[928,384,48,12],[992,352,48,12]],ladders:[[1088,288,24,160]],
    nodes:[node('deadend','trap',272,576,'Bilik buntu'),node('bell0','bell',448,416,'Lonceng barat',{index:0}),node('bell1','bell',736,416,'Lonceng tengah',{index:1}),node('bell2','bell',1136,256,'Lonceng timur',{index:2}),node('pusaka','pusaka',1296,160,'Lemari pusaka')],kidung:[[9,576,426],[10,1200,266]],fog:[840,1056],flowers:[[432,448],[720,448],[1072,288]]},
  {...defaults,id:'Bangsal',name:'Bangsal Sunyi',chapter:'BABAK III · MEMILIH',quest:'Nama di Lembar Kosong',width:1152,height:704,background:null,palette:'void',next:'Putri',exit:[1056,576],checkpoints:[[48,576],[512,416],[1008,576]],damars:[[72,608],[528,448],[1024,608]],
    platforms:[[0,608,256,96],[448,448,224,12],[928,608,224,96]],faded:[[256,560,64,12],[352,496,64,12],[704,496,64,12],[800,560,64,12]],
    nodes:[node('pillar0','pillar',176,576,'Pilar pertama',{index:0}),node('pillar1','pillar',480,416,'Pilar kedua',{index:1}),node('pillar2','pillar',608,416,'Pilar ketiga',{index:2}),node('pillar3','pillar',992,576,'Pilar keempat',{index:3}),node('samar','samar',1056,576,'Ki Samar')],kidung:[[11,576,426]],fog:[256,928]},
  {...defaults,id:'Putri',name:'Kamar Tuan Putri',chapter:'BABAK III · MEMILIH',quest:'Cahaya yang Pulang',width:960,background:'bedroom',palette:'gold',next:'Epilog',exit:[848,320],checkpoints:[[64,320]],damars:[[80,352]],platforms:[[0,352,960,160]],nodes:[node('putri','putri',656,320,'Candra Kirana'),node('manuscript','manuscript',400,320,'Susun manuskrip')],kidung:[[12,256,330]],flowers:[[176,352],[592,352],[800,352]]},
  {...defaults,...library,id:'Epilog',name:'Kembali ke Perpustakaan',chapter:'EPILOG · MENJELANG SUBUH',quest:'Kisah yang Diteruskan',palette:'dawn',next:null,exit:[112,512],checkpoints:[[56,512]],damars:[[80,544]],nodes:[node('lastbook','lastbook',336,512,'Buku Keong Mas'),node('poster','poster',112,512,'Poster UKM Pendidikan & Penalaran')]}
].map(l=>{
  if(l.id==='Pasar'){
    l.width=5504;l.exit=[5408,512];l.checkpoints[2]=[5312,512];l.damars[2]=[5328,544];
    l.platforms[0]=[0,544,5504,64];l.platforms=l.platforms.filter(p=>p[0]<896||p[1]===544);
    for(let i=0;i<17;i++)l.platforms.push([896+i*256,352+(i%3)*16,192,12]);
    l.platforms.push([5248,448,192,12]);l.nodes.find(n=>n.id==='lutung').x=5360;
    l.nodes.find(n=>n.id==='slide').x=5248;l.kidung[1]=[3,5280,518];
  }
  if(l.id==='Bukit'){
    // Intermediate ledges make the route above Kilisuci readable and reachable
    // with ordinary jumps; Wani remains useful throughout the escape sequence.
    l.platforms.push([800,656,96,12],[800,352,96,12],[784,256,112,12]);l.width=4608;l.exit=[4496,160];
    for(let i=0;i<14;i++)l.platforms.push([1024+i*256,192,192,12]);
  }
  if(l.id==='Bangsal')l.nodes.push(node('pillar4','pillar',560,416,'Pilar nama Ki Samar',{index:4}));
  return l;
});
