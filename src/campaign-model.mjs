// Pure progression rules shared by all nine GDevelop layouts.
export const SCENES=['Prolog','Pasar','Petirtaan','Bukit','Gerbang','Kedaton','Bangsal','Putri','Epilog'];
export const VALUES=['Asih','Sabar','Jujur','Wani','Andhap','Setya','Wicaksana'];
export const MANUSCRIPT=[
  {id:'Setya',title:'Janji di kedaton',text:'Candra Kirana menjaga janji sebelum perpisahan datang.'},
  {id:'Jujur',title:'Tuduhan yang keliru',text:'Ia tetap memegang kebenaran ketika iri hati mengusirnya.'},
  {id:'Wani',title:'Meninggalkan istana',text:'Sang putri menghadapi jalan asing di luar kedaton.'},
  {id:'Sabar',title:'Di dalam cangkang',text:'Menjadi keong emas, ia menunggu tanpa kehilangan harapan.'},
  {id:'Asih',title:'Tangan Mbok Rondo',text:'Mbok Rondo menemukan keong dan membawanya pulang.'},
  {id:'Andhap',title:'Membalas pertolongan',text:'Putri membantu pekerjaan rumah tanpa menuntut penghormatan.'},
  {id:'Wicaksana',title:'Kisah yang diteruskan',text:'Pertemuan kembali membuka jalan untuk meneruskan kisahnya.'}
];
export const ARGUMENTS=[
  {question:'Sebuah kisah diceritakan ulang sampai berubah dari aslinya. Apakah kisah itu masih kisah yang sama?',options:['Tidak. Yang berubah berarti sudah mati.','Ya, selama nilainya bertahan. Bentuk boleh berganti.','Tidak penting. Yang penting ada yang menceritakan.'],aligned:1,value:'Wicaksana'},
  {question:'Versi Bayang Galuh tak pernah didengar. Haruskah kita memberi ruang untuknya?',options:['Dengarkan pengalamannya tanpa membenarkan tindakan yang melukai.','Hapus saja agar kisah sang putri tetap utuh.','Anggap semua tindakannya benar karena ia pernah terluka.'],aligned:0,value:'Asih dan Jujur'},
  {question:'Jika tak seorang pun meminta kisah ini, mengapa kau masih membawanya?',options:['Agar semua orang wajib mengingat versi yang sama.','Supaya namaku lebih dikenal daripada tokoh-tokohnya.','Aku bisa menawarkan cerita dan merawatnya, sambil memberi orang pilihan.'],aligned:2,value:'Setya dan Andhap'}
];
export function newCampaign(saved){
  const state={version:2,scene:'Prolog',serat:[],kidung:[],pelita:false,oil:100,checkpoint:0,visited:['Prolog'],completed:false,golden:false,
    levers:[false,false,false],water:0,waiting:0,sabar:false,jujur:false,drained:false,attempts:0,
    quests:{books:[],lamps:[true,true,true],orders:[],marketStarted:false,chase:false,chaseWon:false,dakon:false,
      candles:[],caveRead:false,escaped:false,clues:[],jug:false,key:false,guardTalk:0,gate:false,tapakTrapped:false,bells:[],pusaka:false,
      pillars:[],answers:[],debate:false,manuscript:false,manuscriptAttempts:0,epilogueRead:false},playSeconds:0};
  if(!saved||![1,2].includes(saved.version))return state;
  if(saved.version===1&&saved.scene==='Petirtaan'){
    state.scene='Petirtaan';state.serat=['Asih',...(saved.sabar?['Sabar']:[]),...(saved.sabar&&saved.jujur?['Jujur']:[])];
    state.visited=['Prolog','Pasar','Petirtaan'];state.quests.books=[0,1,2];state.quests.orders=[0,1,2];state.quests.marketStarted=true;state.quests.chaseWon=true;
  }else if(saved.version===2){
    state.scene=SCENES.includes(saved.scene)?saved.scene:'Prolog';
    const owned=new Set(Array.isArray(saved.serat)?saved.serat:[]);for(const name of VALUES){if(!owned.has(name))break;state.serat.push(name);}
    state.visited=SCENES.filter(n=>Array.isArray(saved.visited)&&saved.visited.includes(n));if(!state.visited.includes('Prolog'))state.visited.unshift('Prolog');
    if(saved.quests&&typeof saved.quests==='object')for(const key of Object.keys(state.quests)){
      const original=state.quests[key],v=saved.quests[key];
      if(Array.isArray(original)&&Array.isArray(v))state.quests[key]=key==='lamps'?Array.from({length:3},(_,i)=>v[i]!==false):[...new Set(v.filter(n=>Number.isInteger(n)&&n>=0&&n< (key==='pillars'?5:key==='candles'?5:key==='clues'?4:3)))];
      else if(typeof original==='boolean')state.quests[key]=v===true;
      else if(typeof original==='number'&&Number.isFinite(v))state.quests[key]=Math.max(0,Math.floor(v));
    }
    // Answers may repeat, unlike collectible indices.
    state.quests.answers=Array.isArray(saved.quests?.answers)?saved.quests.answers.slice(0,3).map(n=>[0,1,2].includes(n)?n:0):[];
  }
  state.pelita=saved.pelita===true&&state.serat.includes('Asih');state.sabar=state.serat.includes('Sabar');state.jujur=state.serat.includes('Jujur');
  state.drained=state.sabar&&saved.drained===true;state.water=state.sabar?1:0;
  state.levers=Array.isArray(saved.levers)?Array.from({length:3},(_,i)=>saved.levers[i]===true):state.levers;
  state.oil=Number.isFinite(saved.oil)?Math.max(25,Math.min(100,saved.oil)):100;
  state.checkpoint=Number.isInteger(saved.checkpoint)&&saved.checkpoint>=0&&saved.checkpoint<10?saved.checkpoint:0;
  state.kidung=Array.isArray(saved.kidung)?[...new Set(saved.kidung.filter(n=>Number.isInteger(n)&&n>=1&&n<=12))]:[];
  state.playSeconds=Number.isFinite(saved.playSeconds)?Math.max(0,saved.playSeconds):0;
  state.completed=saved.completed===true&&state.scene==='Epilog'&&state.serat.length===7&&state.quests.manuscript;
  state.golden=state.completed&&state.kidung.length===12;
  return state;
}
export function awardSerat(s,name){
  if(s.serat.includes(name))return false;
  if(VALUES[s.serat.length]!==name)return false;
  s.serat.push(name);s.sabar=s.serat.includes('Sabar');s.jujur=s.serat.includes('Jujur');s.oil=100;return true;
}
export function canLeave(s,scene){const q=s.quests;return ({Prolog:q.books.length===3,Pasar:q.chaseWon&&s.serat.includes('Asih'),Petirtaan:s.jujur,Bukit:q.escaped&&s.serat.includes('Andhap'),Gerbang:q.gate&&s.serat.includes('Setya'),Kedaton:q.bells.length===3&&q.tapakTrapped&&q.pusaka,Bangsal:q.debate&&s.serat.length===7,Putri:q.manuscript,Epilog:q.epilogueRead})[scene]===true;}
export function transition(s,next){const i=SCENES.indexOf(s.scene);if(SCENES[i+1]!==next||!canLeave(s,s.scene))return false;s.scene=next;s.checkpoint=0;s.oil=100;if(!s.visited.includes(next))s.visited.push(next);return true;}
export function answerArgument(s,index){if(s.quests.pillars.length<4||s.quests.answers.length>=3||![0,1,2].includes(index))return false;s.quests.answers.push(index);if(s.quests.answers.length===3){s.quests.debate=true;if(!s.quests.pillars.includes(4))s.quests.pillars.push(4);}return true;}
export function argumentScore(s){return s.quests.answers.reduce((n,a,i)=>n+(ARGUMENTS[i]?.aligned===a?1:0),0);}
export function assembleManuscript(s,ids){if(s.serat.length!==7||!s.quests.debate)return false;if(ids.length===7&&MANUSCRIPT.every((m,i)=>m.id===ids[i])){s.quests.manuscript=true;return true;}s.quests.manuscriptAttempts++;return false;}
