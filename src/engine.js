// ===== Engine =====
const DR=[-1,1,0,0],DC=[0,0,-1,1],OPP=[1,0,3,2]; // 0 hoch,1 runter,2 links,3 rechts
const ARROW={'^':0,'v':1,'<':2,'>':3};
const DSPIKE={n:0,s:1,w:2,e:3};               // Richtungsstacheln: Spitzen zeigen in diese Richtung
const TELE='ABC',WALL='#kK';
const MELT=6;                                 // schmelzendes Eis: nach so vielen Zügen ist es ein Loch
const VALID='#._SG~u%^v<>ABCkKox*mqlOnsewz1234r';
const SBLOCK={'1':0,'2':1,'3':2,'4':3}; // Stachelblock: Stacheln zeigen nach oben/unten/links/rechts
// Felder: # k K Eisbrocken, . Eis, _ Stein, S Start, G Ziel, ~ tiefes Loch, u flaches Loch, % rissiges Eis,
// ^v<> Pfeile, ABC Teleporter, o Eisblock, O großer Eisblock, x Stacheln, nsew Richtungsstacheln,
// * Kristall, m schmelzendes Eis, q Schlüssel, l Schloss, z markierter Boden (nur Bau-Modus, wirkt wie Eis)
// 1-4 schiebbarer Stachelblock (Stacheln oben/unten/links/rechts), r Bröckelwand (zerbröselt beim Anstoßen zu Stacheln)
function prep(L){
  const g=L.map.map(r=>r.split(''));const H=g.length,W=g[0].length;
  let start=null,goal=null;const tp={},crack=new Map(),items=new Map(),water=new Map(),keys=new Map(),locks=new Map(),brittle=new Map(),melt=new Set(),cubes=[],cubes2=[],cubes3=[];
  for(let r=0;r<H;r++)for(let c=0;c<W;c++){const ch=g[r][c],i=r*W+c;
    if(ch==='S')start=[r,c];else if(ch==='G')goal=[r,c];
    else if(TELE.includes(ch))(tp[ch]=tp[ch]||[]).push([r,c]);
    else if(ch==='%')crack.set(i,crack.size);
    else if(ch==='*')items.set(i,items.size);
    else if(ch==='u')water.set(i,water.size);
    else if(ch==='q')keys.set(i,keys.size);
    else if(ch==='l')locks.set(i,locks.size);
    else if(ch==='m')melt.add(i);
    else if(ch==='o'){cubes.push(i);g[r][c]='.'}
    else if(ch==='O'){cubes2.push(i);g[r][c]='.'}
    else if(ch in SBLOCK){cubes3.push(i*4+SBLOCK[ch]);g[r][c]='.'}
    else if(ch==='r')brittle.set(i,brittle.size);
    else if(ch==='z')g[r][c]='.'}
  const partner=new Map();
  for(const k in tp)if(tp[k].length===2){const[a,b]=tp[k];partner.set(a[0]*W+a[1],b);partner.set(b[0]*W+b[1],a)}
  cubes3.sort((a,b)=>a-b);return{g,H,W,wrap:!!L.wrap,start,goal,partner,crack,items,water,keys,locks,brittle,melt,cubes0:cubes,cubes20:cubes2,cubes30:cubes3,tp};
}
const z=n=>new Array(n).fill(0);
function initState(P){return{r:P.start[0],c:P.start[1],br:z(P.crack.size),it:z(P.items.size),fl:z(P.water.size),ky:z(P.keys.size),lk:z(P.locks.size),rb:z(P.brittle.size),kh:0,mv:0,cb:P.cubes0.slice(),cb2:P.cubes20.slice(),cb3:P.cubes30.slice()}}
function cloneSt(s){return{r:s.r,c:s.c,br:s.br.slice(),it:s.it.slice(),fl:s.fl.slice(),ky:s.ky.slice(),lk:s.lk.slice(),rb:s.rb.slice(),kh:s.kh,mv:s.mv,cb:s.cb.slice(),cb2:s.cb2.slice(),cb3:s.cb3.slice()}}
function skey(s){return s.r+','+s.c+'|'+s.br.join('')+s.it.join('')+s.fl.join('')+s.ky.join('')+s.lk.join('')+s.rb.join('')+s.kh+'|'+s.mv+'|'+s.cb.join(',')+'|'+s.cb2.join(',')+'|'+s.cb3.join(',')}
function nxt(P,r,c,d){let nr=r+DR[d],nc=c+DC[d],wrap=false;
  if(nr<0||nc<0||nr>=P.H||nc>=P.W){if(!P.wrap)return null;nr=(nr+P.H)%P.H;nc=(nc+P.W)%P.W;wrap=true}return[nr,nc,wrap]}
const melted=(P,st,i)=>P.melt.has(i)&&st.mv>=MELT;
// Eisblock (klein oder groß) rutscht, bis ihn etwas stoppt. Ergebnis sunk: deep (weg), fill (Loch wird Boden), wall (großer Block wird zur Mauer)
function pushCube(P,st,cr,cc,d,big){ // big: false=klein, true=groß, 3=Stachelblock
  const{g,W}=P,i0=cr*W+cc,c3=st.cb3.find(x=>(x>>2)===i0),others=new Set([...st.cb,...st.cb2,...st.cb3.map(x=>x>>2)].filter(x=>x!==i0));
  let r=cr,c=cc,moved=false,sunk=false;const path=[{r,c,d}],seen=new Set();
  for(;;){
    const sk=(r*W+c)*4+d;if(seen.has(sk))return null;seen.add(sk);
    const n=nxt(P,r,c,d);if(!n)break;const[nr,nc,wrap]=n,idx=nr*W+nc,t=g[nr][nc];
    if(WALL.includes(t)||t==='G'||t==='S'||t==='x'||t in DSPIKE||others.has(idx)||(nr===st.r&&nc===st.c))break;
    if(t==='l'&&!st.lk[P.locks.get(idx)])break;
    if(t==='u'&&st.fl[P.water.get(idx)]===2)break;
    if(t==='r')break;
    if(t==='*'&&!st.it[P.items.get(idx)])break;   // Blöcke verdecken nie Kristalle
    if(t==='q'&&!st.ky[P.keys.get(idx)])break;    // ... und nie Schlüssel
    r=nr;c=nc;moved=true;path.push({r,c,d,wrap});
    if(t==='~'||melted(P,st,idx)){sunk='deep';break}
    if(t==='u'){const wi=P.water.get(idx);if(!st.fl[wi]){st.fl[wi]=big===true?2:1;sunk=big===true?'wall':'fill';break}continue}
    if(t==='%'){const ci=P.crack.get(idx);if(st.br[ci]===1){sunk='deep';break}st.br[ci]=1;path[path.length-1].crack=1;continue}
    if(t==='_')break;
    if(t in ARROW){d=ARROW[t];continue}
    if(TELE.includes(t)){const p=P.partner.get(idx);if(p){const pi=p[0]*W+p[1];if(!others.has(pi)&&!(p[0]===st.r&&p[1]===st.c)){r=p[0];c=p[1];path.push({r,c,d,tele:true})}}continue}
  }
  // Blöcke bleiben nie auf Pfeilen oder Teleportern liegen: sie halten davor an
  if(!sunk)while(path.length>1&&(g[r][c] in ARROW||TELE.includes(g[r][c]))){path.pop();const q=path[path.length-1];r=q.r;c=q.c}
  if(path.length<2)return null;
  if(big===3){const rest=st.cb3.filter(x=>x!==c3);if(!sunk)rest.push((r*W+c)*4+(c3&3));rest.sort((a,b)=>a-b);st.cb3=rest;return{path,sunk,big:3,sdir:c3&3}}
  const mine=big?st.cb2:st.cb,rest=mine.filter(x=>x!==i0);if(!sunk)rest.push(r*W+c);rest.sort((a,b)=>a-b);if(big)st.cb2=rest;else st.cb=rest;
  return{path,sunk,big:!!big};
}
// Nach jedem Zug: schmelzendes Eis taut weiter; wer darauf steht, fällt
function afterMove(P,st,res){if(!P.melt.size||res.res==='win')return res;st.mv=Math.min(MELT,st.mv+1);
  if(st.mv>=MELT){const W=P.W;st.cb=st.cb.filter(i=>!P.melt.has(i));st.cb2=st.cb2.filter(i=>!P.melt.has(i));st.cb3=st.cb3.filter(x=>!P.melt.has(x>>2));
    if(res.res==='move'&&P.melt.has(st.r*W+st.c))return{...res,res:'fall',kind:'deep',melt:true}}
  return res}
// Ein Zug. res: none | move | win | fall | loop
function step(P,st0,d,walk){
  const{g,W}=P,st=cloneSt(st0),cubeSet=new Set(st.cb),cube2Set=new Set(st.cb2),cube3=new Map(st.cb3.map(x=>[x>>2,x&3]));let r=st.r,c=st.c,moved=false,cube=null,spin=false,crumble=null,nst=0,wmax=1;
  const path=[{r,c,d}],seen=new Map();
  for(;;){
    if(walk&&nst>=wmax)break; // Spike-Schuhe: ein Wisch = ein Schritt (ein Pfeil schiebt noch genau ein Feld weiter)
    const sk=(r*W+c)*4+d;if(seen.has(sk)){st.r=r;st.c=c;return{res:'loop',path,cyc:path.slice(seen.get(sk)),st}}seen.set(sk,path.length-1);
    const n=nxt(P,r,c,d);if(!n)break;const[nr,nc,wrap]=n,idx=nr*W+nc,t=g[nr][nc];
    if(WALL.includes(t))break;
    if(t==='u'&&st.fl[P.water.get(idx)]===2)break;
    if(t in DSPIKE){if(d===OPP[DSPIKE[t]]){path.push({r:nr,c:nc,d,wrap});st.r=nr;st.c=nc;return{res:'fall',kind:'spike',path,st}}break}
    if(t==='r'){const bi=P.brittle.get(idx);if(!st.rb[bi]){st.rb[bi]=1;crumble=idx;path[path.length-1].crumble=idx;break}path.push({r:nr,c:nc,d,wrap});st.r=nr;st.c=nc;return{res:'fall',kind:'spike',path,st}}
    if(cube3.has(idx)){if(cube3.get(idx)===OPP[d]){st.r=r;st.c=c;path[path.length-1].stab=idx;return{res:'fall',kind:'spike',path,st}}st.r=r;st.c=c;cube=pushCube(P,st,nr,nc,d,3);break}
    if(t==='l'&&!st.lk[P.locks.get(idx)]){if(st.kh>0&&!cubeSet.has(idx)&&!cube2Set.has(idx)){st.kh--;st.lk[P.locks.get(idx)]=1;path[path.length-1].unlock=idx}else break}
    if(cubeSet.has(idx)||cube2Set.has(idx)){st.r=r;st.c=c;cube=pushCube(P,st,nr,nc,d,cube2Set.has(idx));break}
    r=nr;c=nc;moved=true;nst++;path.push({r,c,d,wrap,spin});
    if(t==='~'||melted(P,st,idx)){st.r=r;st.c=c;return{res:'fall',kind:'deep',path,st}}
    if(t==='u'&&!st.fl[P.water.get(idx)]){st.r=r;st.c=c;return{res:'fall',kind:'pit',path,st}}
    if(t==='%'){const ci=P.crack.get(idx);if(st.br[ci]===1){st.r=r;st.c=c;return{res:'fall',kind:'deep',path,st}}if(st.br[ci]===0)st.br[ci]=1;continue}
    if(t==='x'){st.r=r;st.c=c;return{res:'fall',kind:'spike',path,st}} // Tod: ganzes Level startet neu
    if(t==='*'){const ii=P.items.get(idx);if(!st.it[ii]){st.it[ii]=1;path[path.length-1].item=idx}continue}
    if(t==='q'){const ki=P.keys.get(idx);if(!st.ky[ki]){st.ky[ki]=1;st.kh++;path[path.length-1].key=idx}continue}
    if(t==='G'){if(st.it.every(x=>x)){st.r=r;st.c=c;return{res:'win',path,st}}break}
    if(t==='_'||t==='S')break;
    if(t in ARROW){d=ARROW[t];spin=true;path[path.length-1].spin=true;if(walk)wmax=nst+1;continue}
    if(TELE.includes(t)){const p=P.partner.get(idx);if(p&&!cubeSet.has(p[0]*W+p[1])&&!cube2Set.has(p[0]*W+p[1])&&!cube3.has(p[0]*W+p[1])){r=p[0];c=p[1];path.push({r,c,d,tele:true,spin})}continue}
  }
  st.r=r;st.c=c;
  if(!moved&&!cube&&crumble==null)return{res:'none'};
  return afterMove(P,st,{res:'move',path,st,cube,crumble});
}
// Breitensuche über komplette Zustände
function solve(P,st0,limit){
  limit=limit||250000;if(!P.start||!P.goal)return{path:null};
  st0=st0||initState(P);const k0=skey(st0),prev=new Map([[k0,null]]),q=[[st0,k0]];let qi=0;
  while(qi<q.length){
    if(prev.size>limit)return{capped:true,path:null};
    const[st,k]=q[qi++];
    for(let d=0;d<4;d++){
      const s=step(P,st,d);
      if(s.res==='win'){const path=[d];let cur=k;while(prev.get(cur)){const p=prev.get(cur);path.unshift(p.d);cur=p.k}return{path}}
      if(s.res!=='move')continue;
      const nk=skey(s.st);if(prev.has(nk))continue;
      prev.set(nk,{k,d});q.push([s.st,nk]);
    }
  }
  return{path:null};
}
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
// o={W,H,p:{'#','k','K','_','~','u','%','x','m',dspike,arrow},tele,cubes,cubes2,items,keys,wrap,minM,maxM,tries,limit,check}
function generate(o,seed){
  const R=rng(seed),W=o.W,H=o.H,p=o.p;
  for(let t=0;t<(o.tries||20000);t++){
    const g=[];
    for(let r=0;r<H;r++){g.push([]);for(let c=0;c<W;c++){let x=R(),ch='.';
      for(const k of ['#','k','K','_','~','u','%','x','m','r','dspike','arrow']){const w=p[k]||0;if(x<w){ch=k==='arrow'?'^v<>'[Math.floor(R()*4)]:k==='dspike'?'nsew'[Math.floor(R()*4)]:k;break}x-=w}
      g[r].push(ch)}}
    const free=[];for(let r=0;r<H;r++)for(let c=0;c<W;c++)if(g[r][c]==='.'||g[r][c]==='_')free.push([r,c]);
    const nt=o.tele||0,nc=o.cubes||0,nc2=o.cubes2||0,nc3=o.cubes3||0,ni=o.items||0,nk=o.keys||0;if(free.length<2+2*nt+nc+nc2+nc3+ni+2*nk+3)continue;
    for(let i=free.length-1;i>0;i--){const j=Math.floor(R()*(i+1));[free[i],free[j]]=[free[j],free[i]]}
    let f=0;const put=ch=>{const[a,b]=free[f++];g[a][b]=ch};
    put('S');put('G');for(let i=0;i<nt;i++){put(TELE[i]);put(TELE[i])}for(let i=0;i<nc;i++)put('o');for(let i=0;i<nc2;i++)put('O');for(let i=0;i<nc3;i++)put('1234'[Math.floor(R()*4)]);for(let i=0;i<ni;i++)put('*');for(let i=0;i<nk;i++){put('q');put('l')}
    const L={map:g.map(r=>r.join('')),wrap:!!o.wrap};
    const s=solve(prep(L),null,o.limit||20000);if(!s.path)continue;
    const m=s.path.length;if(m<o.minM||m>(o.maxM||99))continue;
    if(o.check&&!o.check(L,m))continue;
    L.par=m;return L;
  }
  return null;
}
