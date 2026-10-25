// Lutung follows the same roof surfaces as Kirana; only its visual pose is animated.
export function createLutungChase(level){
  const dock=level.nodes.find(n=>n.type==='lutung'),end=dock.x,ground=dock.y+32;
  const roofs=level.platforms.filter(([x,,w,h])=>h<=12&&x>=416&&x<end&&w>=96).sort((a,b)=>a[0]-b[0]);
  const jumps=roofs.slice(0,-1).map((p,i)=>({from:p[0]+p[2]-24,to:roofs[i+1][0]+24,y0:p[1],y1:roofs[i+1][1],height:54}));
  jumps.push({from:end-72,to:end,y0:roofs.at(-1)[1],y1:ground,height:26});
  let x=end,phase=0,moving=false,visible=false;
  function reset({playerX,active=false,atDock=false}){
    x=atDock?end:Math.min(end,Math.max(roofs[0][0]+24,playerX+84));
    // Resume/respawn on a roof, rather than frozen halfway through a jump.
    const jump=jumps.find(j=>x>j.from&&x<j.to);if(jump)x=jump.from;
    if(atDock)x=end;phase=0;moving=false;visible=active||atDock;
  }
  function step(dt,{playerX,active}){
    if(!visible||!active){moving=false;return;}
    dt=Math.min(.05,Math.max(0,dt));let target=Math.min(end,playerX+84);
    const jump=jumps.find(j=>x>=j.from&&x<j.to);
    if(jump)target=Math.max(target,jump.to); // Once airborne, always finish the jump.
    const next=Math.min(end,Math.max(x,Math.min(target,x+dt*(110+Math.max(0,playerX+56-x)*2))));
    moving=next>x+.001;phase+=(next-x)*.16;x=next;
  }
  function snapshot(){
    const arrived=x>=end-.01,jump=jumps.find(j=>x>j.from&&x<j.to);
    let feet=ground;
    if(jump){const t=(x-jump.from)/(jump.to-jump.from);feet=jump.y0+(jump.y1-jump.y0)*t-Math.sin(Math.PI*t)*jump.height;}
    else if(!arrived){const roof=roofs.find(p=>x>=p[0]&&x<=p[0]+p[2]);feet=(roof?.[1]??roofs[0][1])-(moving?Math.max(0,Math.sin(phase))*2:0);}
    return {x,feet,visible,moving,jumping:!!jump,arrived,angle:moving?(jump?-8+Math.sin((x-jump.from)/(jump.to-jump.from)*Math.PI)*12:Math.sin(phase)*3):0};
  }
  return {reset,step,snapshot};
}
