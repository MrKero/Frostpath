// Gemeinsame Werkzeuge für 2.9: Geheimnisse platzieren, Geheimlevel ableiten
const fs=require('fs'),path=require('path');
const X=new Function(fs.readFileSync(path.join(__dirname,'../src/engine.js'),'utf8')+';return{TELE,ARROW,DSPIKE,SBLOCK,prep,solve,step,initState,skey,nxt,generate,rng}')();
const len=L=>{const s=X.solve(X.prep(L),null,60000);return s.path?s.path.length:-1};
const sub=(L,f)=>len({...L,map:L.map.map(r=>[...r].map(f).join(''))});
const MECH={key:[/q/,ch=>ch==='l'?'.':ch],melt:[/m/,ch=>ch==='m'?'.':ch],big:[/O/,ch=>ch==='O'?'.':ch],cube:[/o/,ch=>ch==='o'?'.':ch],sblock:[/[1-4]/,ch=>ch in X.SBLOCK?'.':ch],
 dspike:[/[nsew]/,ch=>ch in X.DSPIKE?'#':ch],brittle:[/r/,ch=>ch==='r'?'#':ch],item:[/\*/,ch=>ch==='*'?'.':ch],arrow:[/[\^v<>]/,ch=>ch in X.ARROW?'.':ch],tele:[/[ABC]/,ch=>X.TELE.includes(ch)?'.':ch],
 crack:[/%/,ch=>ch==='%'?'.':ch],hole:[/u/,ch=>ch==='u'?'~':ch]};
const matters=(k,L,m)=>{if(k==='wrap')return!L.wrap||len({...L,wrap:false})!==m;return!MECH[k][0].test(L.map.join(''))||sub(L,MECH[k][1])!==m};
const used=L=>Object.keys(MECH).filter(k=>MECH[k][0].test(L.map.join('')));
// Wände mit Anlauf + wiederholbar; Anzahl der Startzustände = wie leicht man hinkommt
function runupInfo(L){const P=X.prep(L),st0=X.initState(P),ids=new Map([[X.skey(st0),0]]),SS=[st0],adj=[[]],launch=new Map();let qi=0;
  while(qi<SS.length&&qi<80000){const st=SS[qi];for(let d=0;d<4;d++){const s2=X.step(P,st,d);if(s2.res!=='move')continue;const k=X.skey(s2.st);let id=ids.get(k);if(id==null){id=SS.length;ids.set(k,id);SS.push(s2.st);adj.push([])}adj[qi].push(id);
    if(s2.path.length>1&&!s2.cube&&P.g[s2.st.r][s2.st.c]!=='_'){const nn=X.nxt(P,s2.st.r,s2.st.c,s2.path[s2.path.length-1].d);if(nn&&'#kK'.includes(P.g[nn[0]][nn[1]])){const kk=nn[0]+','+nn[1];if(!launch.has(kk))launch.set(kk,[]);launch.get(kk).push([qi,id])}}}qi++}
  const reach=(from,T)=>{const seen=new Set([from]),q=[from];while(q.length){const a=q.pop();if(T.has(a))return true;for(const b of adj[a])if(!seen.has(b)){seen.add(b);q.push(b)}}return false};
  const out=new Map();for(const[k,l]of launch){const fr=new Set(l.map(e=>e[0]));if(l.some(([a,h])=>reach(h,fr)))out.set(k,fr.size)}return out}
// Wände, gegen die die beste Lösung ohnehin rutscht
function solutionWalls(L){const P=X.prep(L),s=X.solve(P,null,200000);if(!s.path)return new Set();let st=X.initState(P);const out=new Set();
  for(const d of s.path){const r=X.step(P,st,d);if(r.res!=='move')break;if(r.path.length>1&&!r.cube&&P.g[r.st.r][r.st.c]!=='_'){const nn=X.nxt(P,r.st.r,r.st.c,r.path[r.path.length-1].d);if(nn&&'#kK'.includes(P.g[nn[0]][nn[1]]))out.add(nn[0]+','+nn[1])}st=r.st}return out}
// Juwel: leicht (auf dem Lösungsweg, viele Anläufe) – Portal: schwer (abseits, wenige Anläufe)
function placeSecrets(L,R){const info=runupInfo(L);if(info.size<2)return null;const sol=solutionWalls(L);const ks=[...info.keys()];
  const easy=ks.filter(k=>sol.has(k));const pool=easy.length?easy:ks;pool.sort((a,b)=>info.get(b)-info.get(a));const jw=pool[Math.floor(R()*Math.min(2,pool.length))];
  const rest=ks.filter(k=>k!==jw);const off=rest.filter(k=>!sol.has(k));const pp=(off.length?off:rest).sort((a,b)=>info.get(a)-info.get(b));const pw=pp[Math.floor(R()*Math.min(2,pp.length))];
  const H=L.map.length,W=L.map[0].length,g=Array.from({length:H},()=>Array(W).fill('.'));const[jr,jc]=jw.split(',').map(Number),[pr,pc]=pw.split(',').map(Number);g[jr][jc]='J';g[pr][pc]='Y';return g.map(r=>r.join(''))}
// Generator-Vorgaben aus einem bestehenden Level ableiten
function specFrom(L,minM,maxM,need){const H=L.map.length,W=L.map[0].length,all=L.map.join(''),N=H*W,cnt=re=>[...all].filter(x=>re.test(x)).length;
  const p={};for(const k of['#','k','K','_','~','u','%','x','m','r'])p[k]=cnt(new RegExp('\\'+k))/N;p.dspike=cnt(/[nsew]/)/N;p.arrow=cnt(/[\^v<>]/)/N;
  const us=used(L);const nd=Math.min(need,us.length);
  return{W,H,p,wrap:!!L.wrap,tele:new Set([...all].filter(x=>'ABC'.includes(x))).size,cubes:cnt(/o/),cubes2:cnt(/O/),cubes3:cnt(/[1-4]/),items:cnt(/\*/),keys:cnt(/q/),minM,maxM,
    check:(L2,m)=>(!L.wrap||matters('wrap',L2,m))&&us.filter(k=>matters(k,L2,m)).length>=nd}}
function gen(o,seed,floor,cap,extra){let L=null;const t0=Date.now();let last=t0;while(!L){L=X.generate({...o,tries:120,limit:60000},seed++);if(L&&extra&&!extra(L))L=null;if(!L&&Date.now()-last>cap&&o.minM>floor){o={...o,minM:o.minM-1};last=Date.now()}if(!L&&Date.now()-t0>cap*8)return null}return L}
// Bergsteigen: ein Level Feld für Feld verändern, bis der Par hoch genug ist (Zähl-Objekte bleiben unangetastet)
function climb(L0,target,o){o=o||{};const R=X.rng(o.seed||1),H=L0.map.length,W=L0.map[0].length;const pal=o.pal||['.','.','.','#','k','K','_'];const fixed=/[SGoO1234q\*ABCl]/;
  let g=L0.map.map(r=>[...r]),cur=L0.par||len(L0),best=null;const t0=Date.now();
  for(let it=0;Date.now()-t0<(o.ms||40000);it++){const k=1+Math.floor(R()*2),ch=[];for(let j=0;j<k;j++){const r=Math.floor(R()*H),c=Math.floor(R()*W);if(fixed.test(g[r][c]))continue;const nv=pal[Math.floor(R()*pal.length)];if(nv===g[r][c])continue;ch.push([r,c,g[r][c]]);g[r][c]=nv}
    if(!ch.length)continue;const L={...L0,map:g.map(r=>r.join(''))};const m=len(L);
    if(m>0&&(m>cur||(m===cur&&R()<.5))){cur=m;if(m>=target&&(!o.check||o.check(L,m))&&(!o.extra||o.extra(L))){best={...L,par:m};break}}else ch.reverse().forEach(([r,c,v])=>g[r][c]=v)}
  return best}
// Geheimlevel zu einem normalen Level: gleiche Mechaniken, schwerer
function secretFor(L,seed){const o=specFrom(L,L.par+3,L.par+12,1);const pal=paletteOf(L);
  for(let k=0;k<6;k++){const start=gen({...o,minM:Math.max(10,L.par-6),maxM:L.par+12,check:()=>true},seed+k*101,8,15000);if(!start)continue;
    if(start.par>=L.par+3&&o.check(start,start.par))return start;const c=climb(start,L.par+3,{seed:seed+k,pal,ms:30000,check:o.check});if(c)return c}
  return gen({...o,minM:L.par,check:()=>true},seed+5,L.par,30000)}
function paletteOf(L){const all=L.map.join('');const pal=['.','.','.','.','#','k','K','_'];for(const ch of'~u%xmrnsew^v<>')if(all.includes(ch))pal.push(ch);return pal}
module.exports={X,len,MECH,matters,used,runupInfo,solutionWalls,placeSecrets,specFrom,gen,secretFor,climb,paletteOf};
