import test from 'node:test';
import assert from 'node:assert/strict';
import {followCamera} from '../src/camera.mjs';
const base={x:500,y:700,onFloor:true,viewW:480,viewH:270,width:4608,height:1184,dt:1/60};
test('repeated ordinary jumps and short direction reversals leave camera still',()=>{
 const c={};followCamera(c,{...base,snap:true});const origin={x:c.x,y:c.y};
 for(let j=0;j<5;j++)for(let i=0;i<=60;i++){followCamera(c,{...base,x:500+(i%2?2:-2),y:700-110*Math.sin(i/60*Math.PI),onFloor:i===60});assert.ok(Math.abs(c.x-origin.x)<.01);assert.ok(Math.abs(c.y-origin.y)<.01);}
});
test('high jumps track ascent then descent without oscillation and follow new floors',()=>{
 const c={};followCamera(c,{...base,snap:true});let previous=c.y,lastSign=0,turns=0;
 for(let i=0;i<90;i++){followCamera(c,{...base,y:700-220*Math.sin(i/90*Math.PI),onFloor:false});const delta=c.y-previous,sign=Math.abs(delta)>.01?Math.sign(delta):0;if(sign&&lastSign&&sign!==lastSign)turns++;if(sign)lastSign=sign;assert.ok(Math.abs(delta)<10);previous=c.y;}
 assert.ok(turns<=1,'camera may reverse once to follow a long fall, never oscillate');
 for(let i=0;i<120;i++)followCamera(c,{...base,y:500});assert.ok(Math.abs(c.y-484)<1);
});
test('respawn snaps to destination; camera remains inside scene bounds after resize',()=>{
 const c={};followCamera(c,{...base,snap:true});followCamera(c,{...base,x:4400,y:160,snap:true});assert.equal(c.x,4368);assert.equal(c.y,144);
 followCamera(c,{...base,viewW:700,viewH:400});assert.ok(c.x<=4258&&c.y>=200);
});
