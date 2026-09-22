import test from 'node:test';
import assert from 'node:assert/strict';
import {newCampaign,awardSerat,transition,canLeave,VALUES,SCENES,answerArgument,argumentScore,assembleManuscript,MANUSCRIPT} from '../src/campaign-model.mjs';
import levels from '../src/levels.mjs';
import history from '../src/history.json' with {type:'json'};
test('nine distinct scenes form one gated campaign',()=>{
 const s=newCampaign();assert.equal(transition(s,'Pasar'),false);s.quests.books=[0,1,2];assert.equal(transition(s,'Pasar'),true);
 assert.equal(transition(s,'Petirtaan'),false);s.quests.chaseWon=true;awardSerat(s,'Asih');assert.equal(transition(s,'Petirtaan'),true);
 assert.equal(transition(s,'Epilog'),false);assert.deepEqual(s.visited,['Prolog','Pasar','Petirtaan']);
 assert.deepEqual(levels.map(l=>l.id),SCENES);for(let i=0;i<8;i++)assert.equal(levels[i].next,levels[i+1].id);
});
test('abilities cannot be acquired out of narrative order',()=>{
 const s=newCampaign();assert.equal(awardSerat(s,'Wani'),false);for(const v of VALUES)assert.equal(awardSerat(s,v),true);
 assert.equal(awardSerat(s,'Asih'),false);assert.deepEqual(s.serat,VALUES);assert.equal(s.jujur,true);
});
test('debate accepts different viewpoints without losing and scores tone',()=>{
 const s=newCampaign();assert.equal(answerArgument(s,1),false);s.quests.pillars=[0,1,2,3];for(const answer of [1,0,2])assert.equal(answerArgument(s,answer),true);
 assert.equal(s.quests.debate,true);assert.equal(s.quests.pillars.length,5);assert.equal(argumentScore(s),3);assert.equal(answerArgument(s,2),false);
 const other=newCampaign();other.quests.pillars=[0,1,2,3];[0,0,0].forEach(a=>answerArgument(other,a));assert.equal(other.quests.debate,true);assert.equal(argumentScore(other),1);
});
test('manuscript uses story chronology, not ability collection order',()=>{
 const s=newCampaign();assert.equal(assembleManuscript(s,MANUSCRIPT.map(r=>r.id)),false);VALUES.forEach(v=>awardSerat(s,v));s.quests.debate=true;
 assert.equal(assembleManuscript(s,VALUES),false);assert.equal(s.quests.manuscriptAttempts,1);assert.equal(assembleManuscript(s,MANUSCRIPT.map(r=>r.id)),true);assert.equal(canLeave(s,'Putri'),true);
});
test('save roundtrip preserves repeated answers, migration keeps slice progress',()=>{
 const s=newCampaign();VALUES.forEach(v=>awardSerat(s,v));s.scene='Putri';s.pelita=true;s.quests.answers=[0,0,0];s.quests.pillars=[0,1,2,3,4];s.quests.debate=true;s.kidung=[1,12];
 const restored=newCampaign(JSON.parse(JSON.stringify(s)));assert.deepEqual(restored.quests.answers,[0,0,0]);assert.equal(restored.scene,'Putri');assert.deepEqual(restored.serat,VALUES);
 const old=newCampaign({version:1,scene:'Petirtaan',pelita:true,sabar:true,jujur:true,drained:true});assert.deepEqual(old.serat,VALUES.slice(0,3));assert.equal(old.quests.chaseWon,true);assert.equal(old.drained,true);
 const bad=newCampaign({version:2,scene:'invalid',serat:['Wani'],kidung:[12,12,99],oil:NaN});assert.equal(bad.scene,'Prolog');assert.deepEqual(bad.serat,[]);assert.deepEqual(bad.kidung,[12]);assert.equal(bad.oil,100);
});
test('twelve optional Kidung have unique placements and primary sources',()=>{
 assert.deepEqual(levels.flatMap(l=>l.kidung.map(k=>k[0])).sort((a,b)=>a-b),Array.from({length:12},(_,i)=>i+1));
 assert.equal(history.length,12);for(const h of history)assert.match(h.source,/^https:\/\/(www\.unesco\.org|dpm\.kedirikota\.go\.id)\//);
});
