// v2.8: zwei neue Welten (Gletscherland, Sternenfrost) – je 5 Orte × 10 Level + 1 Geheimlevel
const fs=require('fs');const {TELE,ARROW,DSPIKE,SBLOCK,WALL,DR,DC,prep,solve,step,initState,skey,nxt,generate,rng}=new Function(fs.readFileSync(require('path').join(__dirname,'../src/engine.js'),'utf8')+';return{TELE,ARROW,DSPIKE,SBLOCK,WALL,DR,DC,prep,solve,step,initState,skey,nxt,generate,rng}')();
const len=L=>{const s=solve(prep(L),null,60000);return s.path?s.path.length:-1};
const sub=(L,f)=>len({...L,map:L.map.map(r=>[...r].map(f).join(''))});
const has=(L,re)=>re.test(L.map.join(''));
// "Mechanik zählt": ohne sie wäre die Lösung anders
const M={key:(L,m)=>!has(L,/q/)||sub(L,ch=>ch==='l'?'.':ch)!==m,melt:(L,m)=>!has(L,/m/)||sub(L,ch=>ch==='m'?'.':ch)!==m,
 big:(L,m)=>!has(L,/O/)||(sub(L,ch=>ch==='O'?'.':ch)!==m&&sub(L,ch=>ch==='O'?'#':ch)!==m),cube:(L,m)=>!has(L,/o/)||sub(L,ch=>ch==='o'?'.':ch)!==m,
 sblock:(L,m)=>!has(L,/[1-4]/)||sub(L,ch=>ch in SBLOCK?'.':ch)!==m,dspike:(L,m)=>!has(L,/[nsew]/)||sub(L,ch=>ch in DSPIKE?'#':ch)!==m,
 brittle:(L,m)=>!has(L,/r/)||sub(L,ch=>ch==='r'?'#':ch)!==m,item:(L,m)=>!has(L,/\*/)||sub(L,ch=>ch==='*'?'.':ch)<m,
 arrow:(L,m)=>!has(L,/[\^v<>]/)||sub(L,ch=>ch in ARROW?'.':ch)!==m,tele:(L,m)=>!has(L,/[ABC]/)||sub(L,ch=>TELE.includes(ch)?'.':ch)!==m,
 crack:(L,m)=>!has(L,/%/)||sub(L,ch=>ch==='%'?'.':ch)!==m,hole:(L,m)=>!has(L,/u/)||sub(L,ch=>ch==='u'?'~':ch)!==m,
 wrap:(L,m)=>!L.wrap||len({...L,wrap:false})!==m};
const all=(...ks)=>(L,m)=>ks.every(k=>M[k](L,m));
const some=(n,...ks)=>(L,m)=>ks.filter(k=>M[k](L,m)).length>=n; // mindestens n der Mechaniken zählen
// Wände, gegen die man mit Anlauf und beliebig oft rutschen kann (für Juwelen/Portale)
function runupWalls(L){const P=prep(L),st0=initState(P),ids=new Map([[skey(st0),0]]),SS=[st0],adj=[[]],launch=new Map();let qi=0;
  while(qi<SS.length&&qi<60000){const st=SS[qi];for(let d=0;d<4;d++){const s2=step(P,st,d);if(s2.res!=='move')continue;const k=skey(s2.st);let id=ids.get(k);if(id==null){id=SS.length;ids.set(k,id);SS.push(s2.st);adj.push([])}adj[qi].push(id);
    if(s2.path.length>1&&!s2.cube&&P.g[s2.st.r][s2.st.c]!=='_'){const nn=nxt(P,s2.st.r,s2.st.c,s2.path[s2.path.length-1].d);if(nn&&'#kK'.includes(P.g[nn[0]][nn[1]])){const kk=nn[0]+','+nn[1];if(!launch.has(kk))launch.set(kk,[]);launch.get(kk).push([qi,id])}}}qi++}
  const reach=(from,T)=>{const seen=new Set([from]),q=[from];while(q.length){const a=q.pop();if(T.has(a))return true;for(const b of adj[a])if(!seen.has(b)){seen.add(b);q.push(b)}}return false};
  return[...launch].filter(([k,l])=>{const fr=new Set(l.map(e=>e[0]));return l.some(([a,h])=>reach(h,fr))}).map(([k])=>k)}
const T0=Date.now();
function gen(o,seed,minFloor,cap){let L=null;const t0=Date.now();while(!L){L=generate({...o,tries:100,limit:60000},seed++);if(!L&&Date.now()-t0>cap){o={...o,minM:Math.max(minFloor,o.minM-1)}}}return L}
function makePlace(id,name,spec,seedBase,secretFixed){const lv=[];
  for(let i=0;i<10;i++){const t0=Date.now();const L=gen(spec(i),seedBase+i*977,12,90000);lv.push(L);console.error(name,i+1,'par',L.par,((Date.now()-t0)/1000).toFixed(0)+'s',((Date.now()-T0)/60000).toFixed(1)+'min')}
  lv.sort((a,b)=>a.par-b.par);
  let S=secretFixed;if(!S){const o=spec(9);S=gen({...o,minM:o.minM+3,maxM:42,check:o.loose||o.check},seedBase+99991,o.minM-4,120000)}
  const R=rng(seedBase),gemLv=[2,5,8],portalLv=6;
  const out=lv.map((L,i)=>{const H=L.map.length,W=L.map[0].length,sec=Array.from({length:H},()=>Array(W).fill('.'));let walls=runupWalls(L);
    const pick=()=>{const w=walls.filter(w=>{const[r,c]=w.split(',').map(Number);return sec[r][c]==='.'});if(!w.length)return null;return w[Math.floor(R()*w.length)].split(',').map(Number)};
    if(i===portalLv){const p=pick();if(p)sec[p[0]][p[1]]='Y';else console.error('!! kein Portalplatz',name,i)}
    if(gemLv.includes(i)){const p=pick();if(p)sec[p[0]][p[1]]='J';else console.error('!! kein Juwelplatz',name,i)}
    const o={name:name+' '+(i+1),map:L.map,wrap:!!L.wrap,par:L.par};if(sec.some(r=>r.some(x=>x!=='.')))o.sec=sec.map(r=>r.join(''));return o});
  out.splice(portalLv+1,0,{name:secretFixed?secretFixed.name:name+' ✦',map:S.map,wrap:!!S.wrap,par:S.par,secret:true});
  console.error(name,'Geheimlevel par',S.par);return{id,name,levels:out}}
const sz=(i,w)=>({W:8+(i>3)+(i>7)+w,H:9+(i>2)+(i>6)+w});
const kerem={name:'Kerems Geheimnis ✦',map:'S..u...../.O..u..o_/_o..u..o./.o..u..o_/_o..u..o./.o..u..o_/_o..u..o./.o..u..o_/_o..u..o./...uGu.._'.split('/'),wrap:false,par:15};
const W1=[ // Gletscherland – Einstieg in die Mischungen, Par ~14–25
 ['gl1','Spiegelsee',i=>({...sz(i,0),minM:14+Math.floor(i*.8),maxM:28,p:{'#':.06,k:.05,K:.03,'_':.04,u:.07,'~':.02},cubes:1+(i>5),cubes2:i>2?1:0,items:i>4?1:0,check:all('cube','big','hole')}),7100,kerem],
 ['gl2','Pfeilpass',i=>({...sz(i,0),minM:15+Math.floor(i*.8),maxM:28,p:{'#':.07,k:.05,K:.03,'_':.03,arrow:.06},tele:i>3?1:0,wrap:i%3===1,items:i>6?1:0,check:all('arrow','tele','wrap')}),7200],
 ['gl3','Kristallmine',i=>({...sz(i,0),minM:15+Math.floor(i*.9),maxM:30,p:{'#':.07,k:.05,K:.04,'_':.04,'%':.05},items:1+(i>3),keys:i>2?1:0,check:all('item','key','crack')}),7300],
 ['gl4','Schmelzbach',i=>({...sz(i,0),minM:16+Math.floor(i*.9),maxM:30,p:{'#':.06,k:.05,K:.04,'_':.03,m:.08,'~':.03,u:.03},cubes2:i>3?1:0,cubes:i>6?1:0,check:all('melt','big','cube')}),7400],
 ['gl5','Dornenkamm',i=>({...sz(i,0),minM:16+Math.floor(i*1),maxM:32,p:{'#':.06,k:.04,K:.04,'_':.04,dspike:.05,r:.05},cubes3:1+(i>5),check:all('dspike','sblock','brittle')}),7500]];
const W2=[ // Sternenfrost – viele Mechaniken gemischt, Par ~17–30
 ['st1','Irrlichtwald',i=>({...sz(i,1),minM:17+Math.floor(i*.9),maxM:32,p:{'#':.06,k:.05,K:.03,'_':.03,arrow:.04},tele:1+(i>5),items:1,cubes:i>2?1:0,check:all('tele','arrow','item','cube')}),8100],
 ['st2','Splitterhalle',i=>({...sz(i,1),minM:17+Math.floor(i*.9),maxM:32,p:{'#':.05,k:.04,K:.04,'_':.03,r:.05,'%':.05},cubes:1,keys:i>3?1:0,check:all('brittle','crack','cube','key')}),8200],
 ['st3','Frostlabyrinth',i=>({...sz(i,1),minM:18+Math.floor(i*.9),maxM:34,p:{'#':.07,k:.05,K:.04,'_':.03,m:.05,dspike:.04},keys:1,wrap:i%2===1,check:some(3,'key','melt','dspike','wrap'),loose:some(2,'key','melt','dspike','wrap')}),8300],
 ['st4','Blocksturm',i=>({...sz(i,1),minM:18+Math.floor(i*1),maxM:34,p:{'#':.05,k:.04,K:.04,'_':.03,u:.06,'~':.03},cubes:1,cubes2:1,cubes3:i>4?1:0,check:some(3,'cube','big','sblock','hole'),loose:some(2,'cube','big','sblock','hole')}),8400],
 ['st5','Polarkrone',i=>({...sz(i,1),minM:19+Math.floor(i*1.1),maxM:36,p:{'#':.05,k:.04,K:.04,'_':.03,'%':.03,m:.03,arrow:.03,dspike:.03,r:.03,u:.03},items:1,keys:i>2?1:0,cubes:1,tele:i>5?1:0,cubes2:i>6?1:0,check:some(2,'item','cube','key','tele','arrow'),loose:some(2,'item','cube','key','tele','arrow')}),8500]];
const which=process.argv[2],list=which==='1'?W1:W2,out=which==='1'?'gletscher.json':'sternenfrost.json';
const world={id:which==='1'?'gletscher':'sternenfrost',name:which==='1'?'Gletscherland':'Sternenfrost',builtin:true,places:[]};
if(process.argv[3]==='resume'&&fs.existsSync(out)){world.places=JSON.parse(fs.readFileSync(out)).places;console.error('fortsetzen nach',world.places.map(p=>p.name).join(', '))}
for(const[id,n,sp,sd,fixed]of list){if(world.places.some(p=>p.id===id))continue;world.places.push(makePlace(id,n,sp,sd,fixed));fs.writeFileSync(out,JSON.stringify(world))}
console.error('FERTIG',which,((Date.now()-T0)/60000).toFixed(1),'min');
