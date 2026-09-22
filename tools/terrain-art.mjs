import fs from 'node:fs';

// Small, reusable, pixel-aligned pieces. Each location owns its material and
// construction, rather than recolouring one universal masonry texture.
const rect=(x,y,w,h,c)=>`<path fill="${c}" d="M${x} ${y}h${w}v${h}h-${w}z"/>`;
const palettes={
 library:{kind:'wood',base:'#553c2c',dark:'#291e22',mid:'#805a3c',light:'#b08b5b',cap:'#d0b781',accent:'#544658'},
 market:{kind:'thatch',base:'#624c2c',dark:'#332b20',mid:'#9a743e',light:'#c8a765',cap:'#dfc486',accent:'#756738'},
 petirtaan:{kind:'moss',base:'#354b46',dark:'#1a302e',mid:'#506b5c',light:'#85947c',cap:'#b1b891',accent:'#6e873e'},
 hill:{kind:'rock',base:'#394350',dark:'#202834',mid:'#56616b',light:'#80909b',cap:'#a3acaf',accent:'#56796f'},
 gate:{kind:'brick',base:'#754733',dark:'#3d302c',mid:'#a26545',light:'#ca8c61',cap:'#d5ad7d',accent:'#987442'},
 palace:{kind:'carved',base:'#4d3833',dark:'#28252b',mid:'#805544',light:'#b88356',cap:'#d1b178',accent:'#bd9550'},
 void:{kind:'rune',base:'#36334d',dark:'#1b2032',mid:'#57566e',light:'#8891a3',cap:'#c0bea7',accent:'#b6a776'},
 bedroom:{kind:'inlay',base:'#66503a',dark:'#372d2e',mid:'#977046',light:'#c2a073',cap:'#e6d2a3',accent:'#d3b866'}
};
export function makeTerrain(){
 fs.mkdirSync('assets/terrain',{recursive:true});const all={};
 for(const[name,p]of Object.entries(palettes)){
  const write=(part,h,body)=>{const file=`assets/terrain/${name}-${part}.svg`;fs.writeFileSync(file,`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="${h}" viewBox="0 0 32 ${h}" shape-rendering="crispEdges">${body}</svg>`);return file;};
  function body(h,variant=0){let b=rect(0,0,32,h,p.base);
   if(['wood','carved','inlay'].includes(p.kind)){
    for(let y=1;y<h;y+=8){b+=rect(0,y,32,1,p.mid)+rect(0,y+6,32,2,p.dark);const x=(y*3+variant*11)%25;b+=rect(x,y+2,6,1,p.light)+rect((x+9)%28,y+4,4,1,p.mid);}
    b+=rect(2,2,2,2,p.dark)+rect(28,2,2,2,p.dark);
    if(p.kind==='carved')b+=`<path fill="none" stroke="${p.accent}" d="M4 5h24v4H4zM8 6v2m8-2v2m8-2v2"/>`;
    if(p.kind==='inlay')b+=`<path fill="none" stroke="${p.accent}" d="M0 3h32M0 10h32M8 3l4 4-4 3-4-3zm16 0l4 4-4 3-4-3z"/>`;
   }else if(p.kind==='thatch'){
    for(let x=-4;x<36;x+=4)b+=`<path stroke="${x%8===0?p.light:p.mid}" stroke-width="2" d="M${x} 0l-3 ${h}"/>`;
    b+=rect(0,Math.min(h-3,8),32,2,p.dark)+rect(0,Math.min(h-2,9),32,1,p.mid);
   }else if(p.kind==='rock'){
    b+=`<path fill="${p.mid}" d="M0 2h11l4 5h12l5-4v5H20l-5 5H0z"/><path fill="${p.dark}" d="M3 14h13l6 5h10v3H20l-6-5H3zM8 0h2l3 6h-2z"/>`;
    b+=rect(3,4,5,1,p.light)+rect(22,10,7,1,p.light)+rect(3,h-3,11,2,p.accent);
   }else{
    for(let y=0;y<h;y+=8){const shift=(y/8+variant)%2?8:0;b+=rect(0,y,32,1,p.dark);for(let x=shift;x<32;x+=16)b+=rect(x,y,1,8,p.dark)+rect(x+2,y+2,10,1,p.mid)+rect(x+10,y+5,4,1,p.light);}
    if(p.kind==='moss')b+=rect(0,1,7,2,p.accent)+rect(3,3,2,4,p.accent)+rect(24,0,8,3,p.accent)+rect(27,3,3,2,p.accent);
    if(p.kind==='rune')b+=`<path stroke="${p.accent}" fill="none" d="M13 3h6v5h-6zm3 5v3m-4-1h8"/>`;
   }return b;
  }
  const cap=rect(0,0,32,2,p.cap)+rect(0,2,32,2,p.light)+rect(0,4,32,1,p.dark);
  const earth=rect(0,0,32,32,p.dark)+rect(1,3,14,11,p.base)+rect(17,3,15,11,p.mid)+rect(0,16,8,13,p.mid)+rect(10,16,20,13,p.base)+rect(3,5,8,1,p.light)+rect(18,19,8,1,p.light);
  const ground=write('ground',32,(p.kind==='thatch'?earth:body(32))+cap),fill=write('fill',32,p.kind==='thatch'?earth:body(32,1));
  const upper=write('ledge',12,body(12)+cap+rect(0,11,32,1,p.dark));
  const ghost=write('faded',12,body(12)+rect(0,0,32,2,p.cap)+[2,8,14,20,26].map(x=>rect(x,4,3,1,p.accent)).join(''));
  const rail=name==='library'?{dark:'#26343c',mid:'#5e6b70',light:'#9fa9a8'}:p;
  const ladder=write('ladder',32,rect(3,0,3,32,rail.dark)+rect(25,0,3,32,rail.dark)+rect(3,0,1,32,rail.light)+rect(25,0,1,32,rail.light)+[4,14,24].map(y=>rect(5,y,21,3,rail.mid)+rect(5,y,21,1,rail.light)).join(''));
  all[name]={ground,fill,upper,ghost,ladder};
 }
 return all;
}
export const TERRAIN_BY_SCENE={Prolog:'library',Pasar:'market',Petirtaan:'petirtaan',Bukit:'hill',Gerbang:'gate',Kedaton:'palace',Bangsal:'void',Putri:'bedroom',Epilog:'library'};
