import fs from 'node:fs';
const {feedback:c}=JSON.parse(fs.readFileSync('src/site-config.json','utf8'));
const headers={apikey:c.anonKey,Authorization:`Bearer ${c.anonKey}`};
const response=await fetch(`${c.url}/rest/v1/`,{headers:{...headers,Accept:'application/openapi+json'},signal:AbortSignal.timeout(15000)});
const body=await response.json();
console.log('Schema status:',response.status);
if(!response.ok){
  console.log(body);
  const probe=await fetch(`${c.url}/rest/v1/${encodeURIComponent(c.table)}?select=*&limit=0`,{headers,signal:AbortSignal.timeout(15000)});
  console.log('Table metadata probe (zero rows):',probe.status,await probe.text());
  const claims=JSON.parse(Buffer.from(c.anonKey.split('.')[1],'base64url').toString());
  console.log('Public key scope:',{role:claims.role,ref:claims.ref,urlRef:new URL(c.url).hostname.split('.')[0]});
  const columns={};
  for(const name of ['komentar','comment','isi','nama','user_id','id','created_at']){
    const r=await fetch(`${c.url}/rest/v1/${encodeURIComponent(c.table)}?select=${name}&limit=0`,{headers,signal:AbortSignal.timeout(15000)});
    columns[name]={status:r.status};if(!r.ok)columns[name].error=await r.json();
  }
  fs.mkdirSync('test-results',{recursive:true});fs.writeFileSync('test-results/feedback-schema.json',JSON.stringify({metadataStatus:response.status,tableStatus:probe.status,columns},null,2));
  console.log('Column probes (zero rows):',columns);
  process.exitCode=1;
}
else{
  const schema=body.definitions?.[c.table],route=body.paths?.['/'+c.table];
  console.log(JSON.stringify({schema,methods:route?Object.keys(route):[],exists:!!route},null,2));
  fs.mkdirSync('test-results',{recursive:true});fs.writeFileSync('test-results/feedback-schema.json',JSON.stringify({schema,route},null,2));
}
