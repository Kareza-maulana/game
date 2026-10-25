import test from 'node:test';
import assert from 'node:assert/strict';
import levels from '../src/levels.mjs';
import {createLutungChase} from '../src/lutung-chase.mjs';
const market=levels.find(l=>l.id==='Pasar');

test('moving target follows every roof jump and lands at the interactive dock',()=>{
  const chase=createLutungChase(market);chase.reset({playerX:768,active:true});
  let previous=chase.snapshot(),jumpFrames=0,walkFrames=0,maxDelta=0;
  for(let i=0;i<60*50;i++){
    const playerX=Math.min(5360,768+i*104/60);chase.step(1/60,{playerX,active:true});const p=chase.snapshot();
    assert.ok(p.visible&&Number.isFinite(p.feet));assert.ok(p.x>=previous.x);
    assert.ok(p.x-playerX<210,'Target stays near the player');
    maxDelta=Math.max(maxDelta,Math.abs(p.feet-previous.feet));
    if(p.jumping)jumpFrames++;else if(p.moving)walkFrames++;previous=p;
  }
  assert.ok(jumpFrames>300&&walkFrames>300);assert.ok(maxDelta<8,'No teleport between roof surfaces');
  assert.equal(previous.arrived,true);assert.equal(previous.x,5360);assert.equal(previous.feet,544);
});
test('an airborne lutung lands before waiting for a stopped player',()=>{
  const chase=createLutungChase(market);chase.reset({playerX:768,active:true});
  for(let i=0;i<180;i++)chase.step(1/60,{playerX:768,active:true});
  assert.equal(chase.snapshot().jumping,false);assert.equal(chase.snapshot().moving,false);
  const x=chase.snapshot().x;chase.step(1,{playerX:768,active:false});assert.equal(chase.snapshot().x,x);
});
test('start, checkpoint retry and dock resume share the correct target position',()=>{
  const chase=createLutungChase(market);chase.reset({playerX:56});assert.equal(chase.snapshot().visible,false);
  chase.reset({playerX:992,active:true});const roof=chase.snapshot();assert.ok(roof.x>992&&roof.x<1152);assert.equal(roof.jumping,false);
  chase.reset({playerX:5312,active:true,atDock:true});assert.equal(chase.snapshot().arrived,true);assert.equal(chase.snapshot().feet,544);
});
