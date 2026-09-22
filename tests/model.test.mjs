import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createState,stepWater,solveRelief,stepOil,isLit} from '../src/model.mjs';
test('Sabar requires correct valves and eight uninterrupted seconds at the basin',()=>{
  const s=createState();s.levers=[true,false,true];
  for(let i=0;i<200;i++)stepWater(s,.05,false);
  assert.equal(s.sabar,false);assert.equal(s.water,1);
  for(let i=0;i<80;i++)stepWater(s,.05,true);
  stepWater(s,.05,false);assert.equal(s.waiting,0);
  for(let i=0;i<162;i++)stepWater(s,.05,true);
  assert.equal(s.sabar,true);assert.deepEqual(s.serat,['Asih','Sabar']);
  stepWater(s,10,true);assert.equal(s.serat.filter(n=>n==='Sabar').length,1);
});
test('water rerouting and relief progression prevent early Jujur',()=>{
  const s=createState(),correct=['putri','kutukan','mbok','pulang'];
  assert.equal(solveRelief(s,correct),'locked');
  s.levers=[false,true,false];stepWater(s,1,true);assert.equal(s.drained,false);
  s.sabar=true;s.serat.push('Sabar');stepWater(s,1,true);assert.equal(s.drained,true);
  assert.equal(solveRelief(s,['mbok','putri','kutukan','pulang']),'flood');assert.equal(s.attempts,1);
  assert.equal(solveRelief(s,correct),'solved');solveRelief(s,correct);assert.equal(s.serat.filter(n=>n==='Jujur').length,1);
});
test('oil never becomes negative and checkpoint recovery works from empty',()=>{
  const s=createState();stepOil(s,60,true,true,false);assert.equal(s.oil,0);
  stepOil(s,5,true,true,true);assert.equal(s.oil,100);
});
test('faded collision uses direction, range and actual lamp activation',()=>{
  assert.equal(isLit(100,100,1,180,125,155,true),true);
  assert.equal(isLit(100,100,-1,180,125,155,true),false);
  assert.equal(isLit(100,100,1,180,125,155,false),false);
  assert.equal(isLit(100,100,1,260,100,155,true),false);
  assert.equal(isLit(100,100,1,110,200,155,true),false);
});
test('loading corrupted or foreign saves does not skip progression',()=>{
  assert.equal(createState({version:2,completed:true}).completed,false);
  const s=createState({version:1,scene:'Petirtaan',sabar:false,jujur:true,oil:-10,checkpoint:90,kidung:[4,4,5,99],completed:true});
  assert.equal(s.jujur,false);assert.equal(s.completed,false);assert.equal(s.oil,25);assert.equal(s.checkpoint,0);assert.deepEqual(s.kidung,[4,5]);
});
