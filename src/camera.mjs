// Follow the route, not every jump or change in facing direction.
export function followCamera(c, p) {
  const {x,y,onFloor,viewW,viewH,width,height,dt,snap=false}=p;
  const clamp=(v,lo,hi)=>Math.max(lo,Math.min(Math.max(lo,hi),v));
  const hw=viewW/2,hh=viewH/2,focus=y-16;
  if(snap||!Number.isFinite(c.anchorY)){
    c.x=clamp(x+16,hw,width-hw);c.y=clamp(focus,hh,height-hh);c.anchorY=focus;c.airY=focus;
  }
  // A new floor establishes a resting camera height. Ignore one-pixel floor noise.
  if(onFloor&&Math.abs(focus-c.anchorY)>20)c.anchorY=focus;
  if(onFloor)c.airY=c.anchorY;
  const upper=c.y-hh+36,lower=c.y+hh-44;
  if(!onFloor&&y+16<upper)c.airY=Math.min(c.airY,y+16+hh-36);
  if(!onFloor&&y+32>lower)c.airY=Math.max(c.airY,y+32-hh+44);
  const targetY=onFloor?c.anchorY:c.airY;
  // Horizontal dead zone has no facing-based offset, so tapping left/right cannot shake the world.
  const dx=x+16-c.x,dead=Math.min(64,viewW*.14);
  const targetX=c.x+(Math.abs(dx)>dead?dx-Math.sign(dx)*dead:0);
  const blend=1-Math.exp(-5*Math.min(.05,Math.max(0,dt)));
  c.x=clamp(c.x+(targetX-c.x)*blend,hw,width-hw);
  c.y=clamp(c.y+(clamp(targetY,hh,height-hh)-c.y)*blend,hh,height-hh);
  return c;
}
