// Juwel/Portal: mit Anlauf (≥1 Feld rutschen) erreichbar UND beliebig oft wiederholbar
const fs=require('fs');const E=new Function(fs.readFileSync(''+require('path').join(__dirname,'../src/engine.js')+'','utf8')+';return{prep,step,initState,skey,nxt,WALL}')();
const path=require('path');const bad=[];let n=0;let files=process.argv.slice(2);if(!files.length){const d=path.join(__dirname,'../levels');files=fs.readdirSync(d).filter(f=>f.endsWith('.json')).map(f=>path.join(d,f))}
for(const f of files){const J=JSON.parse(fs.readFileSync(f));for(const p of J.places)p.levels.forEach((L,li)=>{if(!L.sec)return;const P=E.prep(L);
  const need=[];L.sec.forEach((row,r)=>[...row].forEach((v,c)=>{if(v!=='.')need.push([r,c,v])}));n+=need.length;
  const st0=E.initState(P),ids=new Map([[E.skey(st0),0]]),S=[st0],adj=[[]];let qi=0;const launch=need.map(()=>[]);// [from,to]
  while(qi<S.length&&qi<200000){const st=S[qi];for(let d=0;d<4;d++){const s2=E.step(P,st,d);if(s2.res!=='move')continue;const k=E.skey(s2.st);let id=ids.get(k);if(id==null){id=S.length;ids.set(k,id);S.push(s2.st);adj.push([])}adj[qi].push(id);
      if(s2.path.length>1&&!s2.cube&&P.g[s2.st.r][s2.st.c]!=='_'){const nn=E.nxt(P,s2.st.r,s2.st.c,s2.path[s2.path.length-1].d);if(nn)need.forEach((x,j)=>{if(x[0]===nn[0]&&x[1]===nn[1]&&E.WALL.includes(P.g[x[0]][x[1]]))launch[j].push([qi,id])})}}qi++}
  const reach=(from,targets)=>{const seen=new Set([from]),q=[from];while(q.length){const a=q.pop();if(targets.has(a))return true;for(const b of adj[a]||[])if(!seen.has(b)){seen.add(b);q.push(b)}}return false};
  need.forEach((x,j)=>{const L2=launch[j];const froms=new Set(L2.map(e=>e[0]));const ok=L2.some(([a,h])=>reach(h,froms));if(!ok)bad.push({f,place:p.name,pid:p.id,li,cell:x,launches:L2.length})})})}
console.log('Geheimnisse geprüft:',n,'Probleme:',bad.length);bad.forEach(b=>console.log(JSON.stringify(b)));if(bad.length)process.exitCode=1;
