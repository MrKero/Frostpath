const fs=require('fs');const E=new Function(fs.readFileSync(''+require('path').join(__dirname,'../src/engine.js')+'','utf8')+';return{prep,step,initState,solve,skey,nxt,WALL,DR,DC}')();
const path=require('path');let files=process.argv.slice(2);if(!files.length){const d=path.join(__dirname,'../levels');files=fs.readdirSync(d).filter(f=>f.endsWith('.json')).map(f=>path.join(d,f))}let bad=0;const out=[];
for(const f of files){let J=JSON.parse(fs.readFileSync(f,'utf8'));const worlds=Array.isArray(J)?J:(J.places?[J]:J.worlds||[J]);
 for(const w of worlds)for(const p of (w.places||[])){p.levels.forEach((L,i)=>{const P=E.prep(L);const s=E.solve(P,null,400000);const m=s.path?s.path.length:null;
   let gem='';if(L.sec){// erreichbare Zustände
     const st0=E.initState(P),seen=new Set([E.skey(st0)]),q=[st0];let qi=0;const need=[];L.sec.forEach((row,r)=>[...row].forEach((v,c)=>{if(v!=='.')need.push([r,c,v])}));const ok=new Set();
     while(qi<q.length&&qi<300000){const st=q[qi++];for(let d=0;d<4;d++){const n=E.nxt(P,st.r,st.c,d);if(n){const k=n[0]+','+n[1];if(need.some(x=>x[0]===n[0]&&x[1]===n[1])&&E.step(P,st,d).res==='none')ok.add(k)}
       const s2=E.step(P,st,d);if(s2.res!=='move')continue;const k2=E.skey(s2.st);if(seen.has(k2))continue;seen.add(k2);q.push(s2.st)}}
     const bad=need.filter(x=>!ok.has(x[0]+','+x[1])||!E.WALL.includes(P.g[x[0]][x[1]]));if(bad.length)gem=' GEM-UNREACHABLE '+JSON.stringify(bad)}
   const flag=(m!==L.par)||gem;out.push({f,place:p.name,pid:p.id,i,old:L.par,neu:m,capped:!!s.capped,gem,secret:!!L.secret});
   if(flag){bad++;console.log(f.split('/').pop(),p.name,i,L.secret?'✦':'','par',L.par,'->',m,s.capped?'CAPPED':'',gem)}})}}
console.log('Level geprüft:',out.length,'Probleme:',bad);if(bad)process.exitCode=1;
