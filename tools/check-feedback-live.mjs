// One labelled integration row; only runs when explicitly requested with --insert-test.
// Reads configuration locally and never logs API keys or existing comments.
import fs from 'node:fs';
const {feedback:c}=JSON.parse(fs.readFileSync('src/site-config.json','utf8'));
if(!process.argv.includes('--insert-test'))throw new Error('Pass --insert-test to insert one labelled integration comment.');
const comment='[UJI INTEGRASI CAHAYA KADIRI] Verifikasi pengiriman formulir tanggapan ke Supabase.';
const response=await fetch(`${c.url}/rest/v1/${encodeURIComponent(c.table)}`,{
  method:'POST',headers:{apikey:c.anonKey,Authorization:`Bearer ${c.anonKey}`,'Content-Type':'application/json',Prefer:'return=minimal'},
  body:JSON.stringify({[c.commentColumn]:comment}),signal:AbortSignal.timeout(15000)
});
const result={status:response.status,ok:response.ok,table:c.table,comment,testRow:true};
if(!response.ok)result.error=await response.json();
fs.mkdirSync('test-results',{recursive:true});fs.writeFileSync('test-results/feedback-live.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));if(!response.ok)process.exitCode=1;
