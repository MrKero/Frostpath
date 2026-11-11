// ===== App =====
const KANTO=__KANTO__,FROSTKRONE=__FROSTKRONE__,NORDLICHT=__NORDLICHT__,GLETSCHER=__GLETSCHER__,STERNENFROST=__STERNENFROST__,ENDLOS=__ENDLOS__,POLARWIRBEL=__POLARWIRBEL__;
const MIN_LEVELS=10; // so viele lösbare Levels braucht ein Ort zum Übertragen
const BUILTIN=[KANTO,FROSTKRONE,NORDLICHT,GLETSCHER,STERNENFROST,ENDLOS,POLARWIRBEL]; // Standardwelt (von Kerem gebaut)
const SEED=KANTO.places.map(p=>[p.name,p.levels]);

const START_TOKENS=5;
const ARW=['↑','↓','←','→'],SPIN=[1,2,0,3];
const $=id=>document.getElementById(id);
const uid=()=>Date.now().toString(36)+Math.floor(Math.random()*1e4).toString(36);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let S={stars:{},bau:[],worlds:[],mute:false,intro:false};
try{Object.assign(S,JSON.parse(localStorage.getItem('eisrutsche2')||'{}'))}catch(e){}
LANG=S.lang||((navigator.language||'de').slice(0,2)==='tr'?'tr':(navigator.language||'de').startsWith('de')?'de':'en');if(!I18N[LANG])LANG='de';if(S.autoUpdate==null)S.autoUpdate=true;
try{const old=JSON.parse(localStorage.getItem('eisrutsche')||'{}');for(const k in old)if(!S.stars['w1-'+k])S.stars['w1-'+k]=old[k]}catch(e){}
if(S.mine){if(S.mine.length)S.bau.unshift({id:'mine',name:'Meine Levels',levels:S.mine});delete S.mine}
function seedBau(){S.seeded=1}// Bau-Modus startet leer (seit 2.8)
function seedBauOld(){SEED.forEach(([n,lv])=>S.bau.push({id:uid(),name:n,levels:lv.map((L,i)=>({id:uid(),name:L.name||('Level '+(i+1)),map:L.map.slice(),wrap:!!L.wrap,par:L.par,sec:L.sec,secret:L.secret}))}));S.seeded=1}
if(!S.seeded)seedBau();
// Einmalig: selbst importierte Kopie von „Kanto“ durch die eingebaute Welt ersetzen (Sterne werden übernommen)
S.extra=S.extra||{};S.gems=S.gems||{};S.portals=S.portals||{};
// 2.8: mitgelieferte Kopien der eingebauten Orte aus dem Bau-Modus entfernen (eigene Änderungen bleiben)

// Level-Reihenfolge eingebauter Orte geändert? Fortschritt per Karten-Hash an die neue Stelle übertragen
const mapHash=m=>{const s=m.join('|');let x=5381;for(let i=0;i<s.length;i++)x=((x*33)^s.charCodeAt(i))>>>0;return x.toString(36)};
{const OLD290={"fk1":["1f7ukpy","5wohiw","dylii","7lpgo5","141kq64","185dekn","nx8j9l","bg003a","vj1lg3","184ir7x"],"fk2":["7b35ov","1ynss76","7kyv14","1yx4mgr","d9etjc","12o6dtm","datj3i","6rm4ev","bzsie9","1g1tmpi"],"fk3":["1tx91q7","hl1e2a","10bm7a1","ngle58","zk7q73","1jagig7","1u66hwv","x4gh9e","13zzeqz","1w406qy"],"fk4":["18ruoud","2l8fu9","zw444p","aba9g4","1r22ln6","jbdxoi","1bxun6w","gobpsk","11hehwr","11hehwr"],"fk5":["1bjc3h7","lnijub","iznsjx","2wm4n0","585h21","nknyzf","283l4e","r2twq0","w9ef3q","1uxc1to"],"nord1":["wxucdm","pu3rj6","1fspwl2","1mxyphc","8xou5w","1q1vqzj","kimb4r","1qtztxr","1ezssqg","809rdb","j95c40"],"nord2":["1lnhovf","4ntd5i","124620o","124620o","1t85kxk","diauss","s8piu4","a5i9cy","104defk","bgngv","1gzdw2k"],"nord3":["urjbrb","16ad1qq","z9f8xp","15dn10s","13rgg9n","1p20oan","ae314i","1ifv61f","b0pusq","1osveu4","1b1duf2"],"nord4":["lp566z","62bbtm","1qajdfo","5dtrsr","11jfhkm","1wnl84q","1eroxdc","17z3a5l","17a4lw9","1gz0668","nmjr00"],"nord5":["19i3lzb","142xpr6","18fdxog","te880a","tcoglb","1jn6fg1","n2646g","kpo7ra","bqi8i7","1ne1y92","rwtg9y"],"gl1":["1ajzwbf","14iwntl","o5hwcn","1dfwqwa","8ohgsb","1hcjpib","1oh8761","4t92w7","1ocio1h","3zyatz","1bbsraw"],"gl2":["11x7kg4","1l175kc","1qp6oe5","ln8aap","wmadkh","1lh2od8","1rxqr3a","17nmflb","15eorq6","116djef","19efkhn"],"gl3":["1cmgc6k","zxclep","1tx2efz","1fjdftk","x2lo78","1asejfm","1nafu37","83xyqe","18xeygc","1buwmo4","30tk2g"],"gl4":["gr5gah","8ag8yp","1mm9zb2","14u72lu","1ap69sc","1ddzfnm","ckxnjh","1q0jp4f","19ijhfd","4o82z8","1py1nw1"],"gl5":["1un8ks4","9ogye5","1l0vnh3","1l0vnh3","1l0vnh3","1cl039u","12i0i8v","tv7pgg","vtaw8n","fps5gg","346m5l"],"st1":["reeo34","1pfogqu","xhea1k","kvt9t8","1c7x3e8","1lf4f5v","1bclcu7","11mvc2z","gqonph","tk4x2z","1an8nmo"],"st2":["13euzlm","1jdtw2k","ywbrt","13ieall","q1zljl","2xs6cb","haz878","1leexm9","1jkrlrs","18loygb","pi9xr4"],"st3":["19hjc0t","1uoxint","1dq8qem","z3zi1p","b2d5t8","5zzhcw","1j6915q","1d49bep","x9xfl2","b3f1hq","4swwmc"],"st4":["1a2sbjn","106dk6o","hrg8m6","1kamg83","1tc77d","mjsjsz","udomyv","19xb1vh","47mueh","1dhd2op","z10gph"],"st5":["9gz3c8","1ir3fdp","1qhwax4","be5ow","kbha8f","11aexfm","12bxzt7","s8bla1","1qijh95","gikry1","mghmn5"]};S.layout=S.layout||{};let moved=false;
  BUILTIN.forEach(w=>w.places.forEach(p=>{const cur=p.levels.map(l=>mapHash(l.map));const old=S.layout[p.id]||(!S.mig290&&OLD290[p.id]);
    if(old&&old.join()!==cur.join()){const nx=old.map(h=>cur.indexOf(h));const re=(obj,pre)=>{const add={};Object.keys(obj).forEach(k=>{if(!k.startsWith(pre))return;const rest=k.slice(pre.length),m=rest.match(/^(\d+)(.*)$/);if(!m)return;const ni=nx[+m[1]];const v=obj[k];delete obj[k];
          if(ni>=0){if(m[2]){const L=p.levels[ni];let pos=null;(L.sec||[]).forEach((row,r)=>[...row].forEach((x,c)=>{if(x==='J'&&!pos)pos=r+','+c}));if(!pos)return;add[pre+ni+'-'+pos]=v;return}add[pre+ni]=v}});Object.assign(obj,add)};
      if(!moved){backup('Levelreihenfolge');moved=true}re(S.stars,p.id+'-');re(S.clean||{},p.id+'-');re(S.gems,p.id+'-');re(S.portals,p.id+'-')}
    S.layout[p.id]=cur}));S.mig290=1}
if(!S.mig280){if(!S.mig232)S.fresh28=1;const BM=new Set();[KANTO,FROSTKRONE,NORDLICHT].forEach(w=>w.places.forEach(p=>p.levels.forEach(l=>BM.add(l.map.join('|')))));
  const copy=o=>o.levels.length>0&&o.levels.every(l=>l.map&&BM.has(l.map.join('|')));if(S.bau.some(copy)){backup('v2.8');S.bau=S.bau.filter(o=>!copy(o))}S.mig240=1;S.mig280=1}
if(!S.mig240){KANTO.places.filter(p=>/^kanto_[0-9]/.test(p.id)).forEach(p=>{if(!S.bau.some(o=>o.name===p.name))S.bau.push({id:uid(),name:p.name,levels:p.levels.map(l=>({id:uid(),name:l.name,map:l.map.slice(),wrap:!!l.wrap,par:l.par,sec:l.sec,secret:l.secret}))})});S.mig240=1}
if(!S.mig260){const a='kanto_5-1-6,7',b='kanto_5-1-5,8';if(S.gems[a]){S.gems[b]=1;delete S.gems[a]}S.mig260=1}
if(!S.mig241){const RP=[[".K#..u...|.k..Ku...|.k#.K%.k.|k.u...%.K|~...S.G_.|%...kk...|u#.k.....|.%o%...*#|.....K..%|..u....u.|u..O.%...",["%%.#...%u","....Ku...","......ku.","u....u..k","...KK..Kk",".G.oS_...","k..%kkK.u",".O.k.....","...*.ku.u","kK....k.k","uu.k..Kuk"],21,false],["..k%.~k..G|...u......|##..k.x_k.|A.u~.K%.#_|.*..%v..v.|k>..^*...o|x.%..#.K~>|.kSA.k%<.k|.....k.%_.|.KK.%._.xx",["#>~.kk*^A.","^....*#%..","...x%k....","k.xk..u.G.","#%K..oS..^","_%.K..K...",".xuK..k%..","x...._.^..",".^k.....k.",".x.Axk.k~_"],13,true],["<......Ak.|.%._......|.K~G#*....|.u#.._A..>|.~~Su#k...|....<..u..|..._..*...|.........o|......v._.|.K<.._....",[">..vv.~._S",".<._.....~",".A..#..G..","...._...<.","..._A_u.._","......._..","K#.u.*..k.","k...__..%_",".#~..u...^","..*.v.o..."],17,false],[".u.#.%.K%.|...#<..^..|x_.......o|o.......K*|...u.K....|.##.S_.^..|A.K_x.#...|u....>..#K|G.#.~#.*..|Kk...x....|.K..._.A._",["#....G..K.","..u...S...",".....K.._k","#..x..K._#",".K..x.....","._.<.xo...","*..#...#x.",".....#..A.",".K..Ax#..>","..o.u.....",".......*.."],20,false],["...#.S.#.%|*.._#<x<K.|.u##u.k.k.|...Kk.Ao%.|<.........|k..*o..#..|._^.#.##..|k.%.uKk..K|.#.....u.k|.......#u.|.Av.G~.u._",["#*.#....Kk","S.A...#..u","..v.u^..%.","k...<...u.","k_..#.v.K#","..%o.k....","^*_.uu...K","##..x.#K##","..o...v.xk","G#..k#A...","#k_..k...."],25,true],[".r.._u.r_..|.....ru..._|.r.......r.|...K.K..K._|_...r..r.m.|.K..K...KSn|.._.rr.s.l.|.........r.|e.e_....K._|.w#r._..m.G|r..#...r..#|.Ku._o.q.Km",["_K_r._K...#","n..q...._..","..._.rnr...","..K.rKu._.K","_...rr__...","..KK....._o","K.K....m__.",".r......#.n","l.Su..rK..r","...r.._..K.","...G..#.r..","r..._r....."],24,false]];const fix=l=>{const k=l.map&&l.map.join('|'),h=RP.find(x=>x[0]===k);if(h){l.map=h[1].slice();l.par=h[2];l.wrap=h[3]}};S.bau.forEach(o=>o.levels.forEach(fix));Object.values(S.extra||{}).forEach(a=>(Array.isArray(a)?a:[a]).forEach(p=>p&&p.levels&&p.levels.forEach(fix)));(S.worlds||[]).forEach(w=>(w.places||[]).forEach(p=>p.levels.forEach(fix)));S.mig241=1}
if(!S.mig232){const az=KANTO.places.find(p=>p.id==='kanto_az');if(az&&!S.fresh28&&!S.bau.some(o=>/azur/i.test(o.name)))S.bau.push({id:uid(),name:az.name,levels:az.levels.map(l=>({id:uid(),name:l.name,map:l.map.slice(),wrap:!!l.wrap,par:l.par}))});S.mig232=1}
if(!S.mig231){const ex=S.extra.kanto=S.extra.kanto||[];S.bau.filter(o=>/azur/i.test(o.name)&&o.levels.length&&!KANTO.places.some(q=>q.name===o.name)).forEach(o=>{if(ex.some(p=>p.id==='p'+o.id))return;
  ex.push({id:'p'+o.id,name:o.name,extra:true,pos:1,levels:o.levels.map(m=>{const s=solve(prep({map:m.map,wrap:m.wrap}),null,300000);return{name:m.name,map:m.map.slice(),wrap:!!m.wrap,par:s.path?s.path.length:null}})})});S.mig231=1}
if(!S.mig19){S.worlds=S.worlds.filter(w=>{if(w.name!=='Kanto')return true;w.places.forEach(p=>{const b=KANTO.places.find(q=>q.name===p.name);if(b)p.levels.forEach((_,i)=>{const v=S.stars[p.id+'-'+i];if(v)S.stars[b.id+'-'+i]=Math.max(S.stars[b.id+'-'+i]||0,v)})});return false});S.mig19=1}
if(S.tokens==null)S.tokens=START_TOKENS;
S.stats=S.stats||{};S.ach=S.ach||{};S.clean=S.clean||{};
S.shop=S.shop||{own:{'hat.beanie':1,'suit.blue':1,'shoes.grey':1,'hand.none':1},hat:'beanie',suit:'blue',shoes:'grey',hand:'none'};S.shop.face=S.shop.face||'none';S.shop.eyes=S.shop.eyes||'black';
if(S.goldSuit){S.shop.own['suit.gold']=1;S.shop.suit='gold';delete S.goldSuit}delete S.codesOn;delete S.egg2;
persist();
// Automatische Sicherungen (max. 6), getrennt vom Spielstand gespeichert
function backups(){try{return JSON.parse(localStorage.getItem('eisrutsche_bak')||'[]')}catch(e){return[]}}
function backup(reason){try{const b=backups();b.unshift({t:Date.now(),r:reason,d:JSON.stringify(S)});while(b.length>6)b.pop();localStorage.setItem('eisrutsche_bak',JSON.stringify(b))}catch(e){}}
function persist(){try{localStorage.setItem('eisrutsche2',JSON.stringify(S))}catch(e){}}
S.extra=S.extra||{};
// eingebaute Welten + eigene Orte, die in sie übertragen wurden (pos = Einfügestelle)
const allWorlds=()=>BUILTIN.map(w=>{const pl=w.places.slice();(S.extra[w.id]||[]).forEach(p=>{if(p.pos!=null&&p.pos<=pl.length)pl.splice(p.pos,0,p);else pl.push(p)});return{...w,places:pl}}).concat(S.worlds);
const findWorld=id=>allWorlds().find(w=>w.id===id);

function applyLook(){buildSprites({hat:S.shop.hat,face:S.shop.face,eyes:S.shop.eyes,suit:S.shop.suit,shoes:S.shop.shoes,hand:S.shop.hand,golden:!!S.golden});const p=$('ePal');if(p)p.innerHTML=''}
const coin=()=>`<img class="coin" src="${COIN_URL}" alt="">`;
// ---- Sound ----
let AC=null;
// eigene kleine „Schlüssel passt!“-Fanfare: schneller Glitzer-Lauf nach oben, dann ein heller Akkord
function wail(){if(S.mute)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const t0=AC.currentTime;
  const note=(f,at,d,type,v)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=type||'square';o.frequency.value=f;g.gain.setValueAtTime(.0001,t0+at);g.gain.exponentialRampToValueAtTime(v||.05,t0+at+.01);g.gain.exponentialRampToValueAtTime(.001,t0+at+d);o.connect(g).connect(AC.destination);o.start(t0+at);o.stop(t0+at+d+.02)};
  [523,659,784,988,1175,1397].forEach((f,i)=>note(f,i*.045,.09,'square',.04));
  [1047,1319,1568].forEach(f=>note(f,.3,.45,'triangle',.05));note(2093,.3,.25,'sine',.025);note(2637,.42,.2,'sine',.02)}catch(e){}}
function snd(type){if(type==='unlock'){wail();return}if(S.mute)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)()}catch(e){return}
  const seq={move:[[520,.035],[700,.045]],bump:[[130,.08]],win:[[523,.09],[659,.09],[784,.09],[1047,.22]],fall:[[420,.07],[260,.09],[150,.2]],tele:[[900,.05],[1500,.07]],place:[[660,.025]],ui:[[880,.03]],item:[[988,.05],[1319,.09]],spike:[[300,.06],[180,.06],[90,.15]],push:[[220,.05],[180,.06]],sink:[[300,.06],[160,.14]],key:[[1200,.04],[1600,.06]],ach:[[784,.08],[988,.08],[1175,.08],[1568,.2]],wall:[[160,.08],[120,.12]],crack:[[1800,.02],[900,.03]],spin:[[600,.03],[750,.03],[900,.03]]}[type];
  if(!seq)return;let t=AC.currentTime;for(const[f,d]of seq){const o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.value=f;g.gain.setValueAtTime(.05,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+d+.01);t+=d}}

// ---- UI-Helfer ----
function show(id){if(id!=='settings'){CODES_ON=false;keremN=0}if(id!=='home')EGG_ON=false;document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('on',s.id===id));closeDlg()}
function dialog(html,btns,cls){const ov=$('dlg');$('dlgBody').innerHTML=html;$('dlgBox').className='tbox'+(cls?' '+cls:'');const b=$('dlgBtns');b.innerHTML='';
  (btns||[{t:t('ok')}]).forEach(x=>{const e=document.createElement('button');e.className='pbtn'+(x.cls?' '+x.cls:'');if(x.h)e.innerHTML=x.h;else e.textContent=x.t;e.onclick=()=>{if(!x.keep)closeDlg();x.fn&&x.fn(e)};b.appendChild(e)});
  ov.classList.add('on')}
function closeDlg(){$('dlg').classList.remove('on')}
function say(msg){const t=$('say');t.innerHTML=msg+'<span class="tri">▼</span>';t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),2400)}
function icon(ch,sz){return`<img class="ico" src="${iconCanvas(ch).toDataURL()}" style="width:${sz||28}px;height:${sz||28}px">`}
function twoTap(b,label,fn){if(b.dataset.sure){backup('rDelete');fn()}else{b.dataset.sure=1;const old=b.textContent;b.textContent=t('sure');b.classList.add('red');setTimeout(()=>{if(b.isConnected){delete b.dataset.sure;b.textContent=old;b.classList.remove('red')}},2500)}}

// ---- Einmalige Erklärung ----
let INTRO_I=-1;
function intro(i){i=i||0;const dir=INTRO_I<0?0:i>INTRO_I?1:i<INTRO_I?-1:0;INTRO_I=i;const lg=(ic,k)=>`<div class="lg">${ic}<div>${t(k)}</div></div>`,wi=x=>`<span class="wico">${x}</span>`;const pages=[
  `<div class="dt">${t('i0t')}</div>${t('i0')}${lg(icon('G'),'i0b')}`,
  `<div class="dt">${t('i1t')}</div>${lg(icon('#'),'i1a')}${lg(icon('_'),'i1b')}${lg(icon('o'),'i1c')}${lg(icon('u'),'i1d')}`,
  `<div class="dt">${t('i2t')}</div>${lg(icon('~'),'i2a')}${lg(icon('x'),'i2b')}${lg(icon('>'),'i2c')}${lg(wi('∞'),'i2d')}`,
  `<div class="dt">${t('i3t')}</div>${t('i3',{n:MIN_LEVELS})}`,
  `<div class="dt">${t('i4t')}</div><div class="lg">${wi('💡')}<div>${t('i4a',{n:START_TOKENS})}</div></div>${lg(wi('★'),'i4b')}${t('i4c')}`];
  const last=i===pages.length-1;
  dialog(pages[i]+`<div class="dots">${pages.map((_,k)=>`<span class="${k===i?'on':''}"></span>`).join('')}</div>`,
    [...(i>0?[{t:'‹',keep:true,fn:()=>intro(i-1)}]:[]),...(last?[]:[{t:t('skip'),fn:()=>{S.intro=true;persist()}}]),{t:last?t('letsgo'):t('next'),cls:'gold',fn:()=>{if(last){S.intro=true;persist()}else intro(i+1)}}],'center intro');const bd=$('dlgBody');bd.classList.remove('slL','slR');void bd.offsetWidth;if(dir)bd.classList.add(dir>0?'slL':'slR')}
(function(){const bx=$('dlgBox');let sx=null,sy=null;bx.addEventListener('pointerdown',e=>{if(bx.classList.contains('intro')){sx=e.clientX;sy=e.clientY}});
  bx.addEventListener('pointerup',e=>{if(sx===null||!bx.classList.contains('intro'))return;const dx=e.clientX-sx,dy=e.clientY-sy;sx=null;if(Math.abs(dx)<40||Math.abs(dx)<Math.abs(dy))return;
    if(dx<0&&INTRO_I<4)intro(INTRO_I+1);else if(dx>0&&INTRO_I>0)intro(INTRO_I-1)})})();

// ---- Spielen: Welten → Orte → Levels ----
let NAV={world:null,place:null};
function visLv(p){return p.levels.filter((L,i)=>!L.secret||S.stars[p.id+'-'+i])}
function placeStars(p){return p.levels.reduce((a,_,i)=>a+(S.stars[p.id+'-'+i]||0),0)}
function buildWorlds(){$('wTok').innerHTML=coin()+' '+S.tokens;const l=$('wList');l.innerHTML='';
  allWorlds().forEach(w=>{const tot=w.places.reduce((a,p)=>a+visLv(p).length*3,0),got=w.places.reduce((a,p)=>a+placeStars(p),0);
    const b=document.createElement('button');b.className='card';b.innerHTML=`<div class="ct">${esc(w.name)}</div><div class="cs">${t('nPlaces',{n:w.places.length})} · <span class="gold">★${got}/${tot}</span>${w.builtin?'':' · '+t('ownWorld')}</div>`;
    b.onclick=()=>{snd('ui');NAV.world=w.id;buildPlaces();show('places')};l.appendChild(b)});
  const z=document.createElement('button');z.className='card alt';z.innerHTML=`<div class="ct">${t('random')}</div><div class="cs">${t('randomSub')}</div>`;z.onclick=()=>{snd('ui');rndDlg()};l.appendChild(z);
  if(!allWorlds().length){const h=document.createElement('div');h.className='hint';h.innerHTML=t('noWorlds',{n:MIN_LEVELS});l.prepend(h)}}
function buildPlaces(){const w=findWorld(NAV.world);if(!w){buildWorlds();show('worlds');return}$('pTitle').textContent=w.name;const l=$('pList');l.innerHTML='';
  w.places.forEach((p,pi)=>{const got=placeStars(p),done=p.levels.filter((_,i)=>S.stars[p.id+'-'+i]).length;
    const row=document.createElement('div');row.className='cardrow';
    const b=document.createElement('button');b.className='card';const nv=visLv(p).length;b.innerHTML=`<div class="ct">${esc(p.name)}</div><div class="cs">${t('doneOf',{a:done,b:nv})} · <span class="gold">★${got}/${nv*3}</span></div><div class="bar2"><i style="width:${done/nv*100}%"></i></div>`;
    b.onclick=()=>{snd('ui');NAV.place=p.id;buildLevels();show('levels')};row.appendChild(b);
    if(w.builtin&&p.extra){const d=document.createElement('button');d.className='pbtn sm';d.textContent='🗑';d.onclick=()=>twoTap(d,'',()=>{S.extra[w.id]=(S.extra[w.id]||[]).filter(x=>x.id!==p.id);persist();buildPlaces()});row.appendChild(d)}
    if(!w.builtin){const d=document.createElement('button');d.className='pbtn sm';d.textContent='🗑';d.onclick=()=>twoTap(d,'',()=>{w.places.splice(pi,1);if(!w.places.length)S.worlds=S.worlds.filter(x=>x!==w);persist();buildPlaces()});row.appendChild(d)}
    l.appendChild(row)})}
function curPlace(){const w=findWorld(NAV.world);return w&&w.places.find(p=>p.id===NAV.place)}
const isSecretFound=(p,i)=>!!S.portals[p.id+'-'+i];
function prevNormal(p,i){for(let k=i-1;k>=0;k--)if(!p.levels[k].secret)return k;return -1}
function nextNormal(p,i){for(let k=i+1;k<p.levels.length;k++)if(!p.levels[k].secret)return k;return -1}
let LSEL={};
function lvOpen(p,i){const L=p.levels[i];if(L.secret)return!!S.stars[p.id+'-'+i];const pv=prevNormal(p,i);return S.allOpen||pv<0||!!S.stars[p.id+'-'+pv]}
function buildLevels(){const p=curPlace();if(!p){buildPlaces();show('places');return}$('lTitle').textContent=p.name;const gr=$('lGrid');gr.innerHTML='';let num=0;const nums={};
  // Geheimlevel erscheinen erst in der Liste, wenn sie geschafft wurden
  const vis=p.levels.map((L,i)=>i).filter(i=>!p.levels[i].secret||!!S.stars[p.id+'-'+i]);
  let sel=null;{sel=vis.find(i=>!p.levels[i].secret&&lvOpen(p,i)&&!S.stars[p.id+'-'+i]);if(sel==null)sel=vis.filter(i=>lvOpen(p,i)).pop();if(sel==null)sel=vis[0]}
  LSEL[p.id]=sel;
  vis.forEach(i=>{const L=p.levels[i];if(!L.secret)num++;nums[i]=L.secret?'✦':num;const b=document.createElement('button');const open=lvOpen(p,i),st=S.stars[p.id+'-'+i]||0;
    b.className='lv'+(L.secret?' secret':'')+(open?'':' locked')+(i===sel?' sel':'');
    b.innerHTML=`<span>${open?nums[i]:'🔒'}</span><small>${open?'★'.repeat(st)+'·'.repeat(3-st):''}</small>`;
    b.onclick=()=>{if(!open){const pv=prevNormal(p,i);snd('bump');toast('🔒 '+t('lvLocked',{n:nums[pv]!=null?nums[pv]:pv+1}));return}
      if(LSEL[p.id]===i){snd('ui');playPlace(i);return}snd('ui');LSEL[p.id]=i;gr.querySelectorAll('.lv.sel').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');lvPreview(p,i,nums[i])};
    gr.appendChild(b)});
  lvPreview(p,sel,nums[sel])}
function lvPreview(p,i,n){const L=p.levels[i],cv=$('lPv'),st=S.stars[p.id+'-'+i]||0;if(!L){$('lPrev').classList.add('hide');return}$('lPrev').classList.remove('hide');
  drawBoard(cv,L.map.map(r=>r.split('')),{wrap:L.wrap});const sc=Math.min(300/cv.width,190/cv.height);cv.style.width=Math.round(cv.width*sc)+'px';cv.style.height=Math.round(cv.height*sc)+'px';
  $('lPrev').classList.toggle('secret',!!L.secret);$('lPvName').textContent=(L.secret?'✦ ':n+'. ')+lvName(L,p,i);
  const fs=[];if(L.sec){let gk=null;L.sec.forEach((row,r)=>[...row].forEach((v,c)=>{if(v==='J'&&!gk)gk=p.id+'-'+i+'-'+r+','+c}));if(gk&&S.gems[gk])fs.push(`<img class="coin" src="${GEM_URL}" alt=""> ${t('pvGem')}`);
    if(L.sec.join('').includes('Y')){const si=secretAfter(p.levels,i);if(si>=0&&S.portals[p.id+'-'+si])fs.push('🌀 '+t('pvPortal'))}}
  $('lPvInfo').innerHTML=`Par ${L.par||'?'} · <span class="lpst">${'★'.repeat(st)}${'☆'.repeat(3-st)}</span>`+(fs.length?`<span class="lpsec">${fs.join(' · ')}</span>`:'');$('lStart').onclick=()=>{snd('ui');playPlace(i)}}
function lvName(L,p,i){return(L.nm&&(L.nm[LANG]||L.nm.de))||L.name||(p.name+' '+(i+1))}
function playPlace(i){const p=curPlace();const L=p.levels[i];play(L,{mode:'play',li:i,title:lvName(L,p,i)})}
// Geheimlevel hinter einem Portal: das nächste als geheim markierte Level nach dem aktuellen
function secretAfter(levels,i){for(let k=i+1;k<levels.length;k++){if(levels[k].secret)return k;}return -1}

// ---- Spiel ----
let G=null,T=32;
const canUndo=()=>G&&(G.meta.mode==='test'||G.meta.mode==='bau');
function play(L,meta){const P=prep(L);let par=meta.mode==='play'?L.par:null;if(par==null){const s=solve(P);par=s.path?s.path.length:null}
  const spk=S.shop.shoes==='spikes',solvedLv=meta.mode==='play'&&curPlace()&&!!S.stars[curPlace().id+'-'+meta.li];
  G={walk:spk&&solvedLv,prints:[],sec:L.sec||null,hits:{},L,P,meta,par,st:initState(P),hist:[],busy:false,won:false,dead:false,trapped:false,dir:1,auto:null,deaths:0,restarts:0,hints:0,lastHint:null,tok:0,mask:document.createElement('canvas')};
  $('gTitle').textContent=meta.title;$('gPar').textContent=par??'?';$('gMoves').textContent=0;
  $('gWrap').textContent=L.wrap?t('wrapOpen'):'';$('gWrap').style.visibility=L.wrap?'visible':'hidden';$('gBoard').classList.toggle('wrapon',!!L.wrap);
  $('gUndo').style.display=canUndo()?'':'none';hintLabel();hideDeath();gStats();gNextBtn();
  clearFx();if(spk)setTimeout(()=>toast(G&&G.walk?'👟 '+t('spikeOn'):'👟 '+t('spikeOff')),350);$('say').classList.remove('on');$('game').classList.toggle('snowy',!!S.snow);$('game').classList.toggle('secretlv',!!L.secret);mystSparks($('gBoard'),!!L.secret);show('game');requestAnimationFrame(()=>{gFit();gDraw()})}
// Spike-Spuren: nur die letzten 3 Felder, verblassen langsam
const PRINT=[0,1,2,3].map(d=>{const c=mk(),x=c.getContext('2d');const dots=[[5,3],[4,5],[6,5],[5,7],[4,9],[6,9],[10,6],[9,8],[11,8],[10,10],[9,12],[11,12]];
  dots.forEach(([a,b])=>{const[px,py]=d===0?[a,b]:d===1?[15-a,15-b]:d===2?[b,15-a]:[15-b,a];x.fillStyle='rgba(20,60,110,.8)';x.fillRect(px,py,1,1);x.fillStyle='rgba(255,255,255,.75)';x.fillRect(px+1>15?px:px+1,py,1,1)});return c});
function spikePrint(r,c,d,box,tz,list){if(!box){if(!G)return;box=$('gIn');tz=T;list=G.prints}const cv=document.createElement('canvas');cv.width=cv.height=16;cv.className='sprint';cv.getContext('2d').drawImage(PRINT[d],0,0);
  Object.assign(cv.style,{left:c*tz+'px',top:r*tz+'px',width:tz+'px',height:tz+'px'});box.appendChild(cv);list.push(cv);setTimeout(()=>{cv.remove();const k=list.indexOf(cv);if(k>=0)list.splice(k,1)},3200);
  while(list.length>3){const o=list.shift();o.classList.add('gone');setTimeout(()=>o.remove(),600)}}
function clearFx(){document.querySelectorAll('.harrow,.splash,.cubefx,.crumblefx,.sprint').forEach(x=>x.remove())}
function fitT(area,W,H,max){const r=area.getBoundingClientRect();return Math.max(8,Math.floor(Math.min((r.width-10)/(W+(ML+MR)/16),(r.height-10)/(H+(MT+MB)/16),max)))}
function layBoard(b,cv,inn,W,H,T){const s=T/16;b.style.width=(W*16+ML+MR)*s+'px';b.style.height=(H*16+MT+MB)*s+'px';cv.style.width=b.style.width;cv.style.height=b.style.height;Object.assign(inn.style,{left:ML*s+'px',top:MT*s+'px',width:W*T+'px',height:H*T+'px'})}
function gFit(){if(!G)return;const{W,H}=G.P;T=fitT($('gArea'),W,H,56);layBoard($('gBoard'),$('gCv'),$('gIn'),W,H,T);$('gFg').style.width=$('gCv').style.width;$('gFg').style.height=$('gCv').style.height;
  const pl=$('gPl');pl.style.width=pl.style.height=T+'px';const rf=$('gRef');rf.width=W*16;rf.height=H*16;rf.style.width=W*T+'px';rf.style.height=H*T+'px';setPl(G.st.r,G.st.c)}
function gDraw(opt){drawBoard($('gCv'),G.P.g,Object.assign({P:G.P,st:G.st,wrap:G.L.wrap,mask:G.mask,fg:$('gFg'),hits:G.hits},opt||{}));if(!opt){plDir(G.dir);setPl(G.st.r,G.st.c)}gHud(opt&&opt.got)}
function gHud(got){$('gMoves').textContent=G.hist.length;const n=G.P.items.size,el=$('gItems');
  if(!n){el.style.display='none';return}const have=G.st.it.filter(x=>x).length+(got?got.size:0);el.style.display='';el.textContent=`◆ ${have}/${n}`;el.classList.toggle('done',have===n)}
let vdir=1,plPos=[0,0,1,1];
const curSpr=d=>(G&&(G.vk!=null?G.vk:G.st.kh)>0?SPRK:SPR)[d];
function plDir(d){vdir=d;const c=$('gPl'),x=c.getContext('2d');x.clearRect(0,0,16,16);x.drawImage(curSpr(d),0,0);drawRef()}
function place(el,r,c,sc,al){const oy=(el._oy||0)*T/16;el.style.transform=`translate3d(${c*T}px,${r*T-oy}px,0) scale(${sc??1})`;el.style.opacity=al??1;if(el.id==='gPl'){plPos=[r,c,sc??1,al??1];drawRef();if(S.rainbow&&G&&G.busy)rainbowDot(r,c)}}
let rbT=0,rbH=0;function rainbowDot(r,c){const n=performance.now();if(n-rbT<30)return;rbT=n;rbH=(rbH+24)%360;const d=document.createElement('div');d.className='rb';Object.assign(d.style,{left:(c+.3)*T+'px',top:(r+.55)*T+'px',width:T*.4+'px',height:T*.4+'px',background:`hsl(${rbH},90%,65%)`});$('gIn').appendChild(d);setTimeout(()=>d.remove(),600)}
// Spiegelung der Figur: nur auf spiegelnden Feldern (Maske), wandert pixelgenau mit
function drawRef(){if(!G)return;const cv=$('gRef'),x=cv.getContext('2d'),[r,c,sc,al]=plPos;x.clearRect(0,0,cv.width,cv.height);if(al<=0.02)return;
  x.save();x.globalAlpha=Math.min(1,al);x.translate(0,(r+1)*32);x.scale(1,-1);const s=16*sc;x.drawImage(curSpr(vdir),c*16+(16-s)/2,r*16+(16-s)/2,s,s);x.restore();
  x.globalCompositeOperation='destination-in';x.drawImage(G.mask,0,0);x.globalCompositeOperation='source-over'}
function setPl(r,c,sc,al){place($('gPl'),r,c,sc,al)}
// Weiches Rutschen: eine durchgehende Zeitachse (keine Ruckler an Feldgrenzen), sanftes Anfahren und Abbremsen
const easeSlide=u=>.55*(1-Math.cos(Math.PI*u))/2+.45*u;
function buildSegs(path){const segs=[];let prev=path[0];
  for(let i=1;i<path.length;i++){const p=path[i],d=p.d;
    if(p.respawn)segs.push({respawn:true,to:[p.r,p.c],from:[prev.r,prev.c]});
    else if(p.tele)segs.push({tele:true,to:[p.r,p.c],from:[prev.r,prev.c],d,p});
    else if(p.wrap){segs.push({a:[prev.r,prev.c],b:[prev.r+DR[d],prev.c+DC[d]],d,p:{spin:p.spin}});segs.push({a:[p.r-DR[d],p.c-DC[d]],b:[p.r,p.c],d,p})}
    else segs.push({a:[prev.r,prev.c],b:[p.r,p.c],d,p});prev=p}
  // in Blöcke gruppieren: Rutsch-Strecken (mit Easing) und Sonderfälle (Teleport, Stacheln)
  const blocks=[];let run=null;const SEG=50;
  segs.forEach(sg=>{if(sg.tele||sg.respawn){run=null;blocks.push({segs:[sg],dur:sg.tele?220:650,special:true})}else{if(!run){run={segs:[],dur:0};blocks.push(run)}run.segs.push(sg);run.dur=run.segs.length*SEG+(run.segs.length>1?50:30)}});
  return{blocks,last:prev}}
function animPath(el,path,hooks,done){const{blocks,last}=buildSegs(path);const g0=G,tok=G.tok,lin=!!hooks.linear;
  let t0=null,bi=0,bStart=0,entered=-1,doneSegs=0;
  function fr(ts){if(G!==g0||G.tok!==tok||(hooks.alive&&!hooks.alive()))return;if(t0===null)t0=ts;const t=ts-t0;
    while(bi<blocks.length&&t>=bStart+blocks[bi].dur){const B=blocks[bi];B.segs.forEach((sg,j)=>{if(j>entered){hooks.start&&hooks.start(sg)}if(j>=doneSegs){hooks.end&&hooks.end(sg)}});bStart+=B.dur;bi++;entered=-1;doneSegs=0}
    if(bi>=blocks.length){el.style.filter='';place(el,last.r,last.c);done();return}
    const B=blocks[bi],u=(t-bStart)/B.dur;
    if(B.special){const s=B.segs[0],k=u;if(entered<0){entered=0;hooks.start&&hooks.start(s)}
      if(s.respawn){if(k<.45){el.style.filter='brightness(2) sepia(1) hue-rotate(-50deg) saturate(5)';place(el,s.from[0],s.from[1],1+k*.6,1-k*2)}else{el.style.filter='';place(el,s.to[0],s.to[1],Math.min(1,(k-.45)*2.2),Math.min(1,(k-.45)*2.5))}}
      else{const at=k<.5?s.from:s.to;place(el,at[0],at[1],Math.max(Math.abs(1-2*k),.05))}}
    else{const n=B.segs.length,f=(lin?u:easeSlide(u))*n,j=Math.min(n-1,Math.floor(f)),k=f-j;
      for(let q=entered+1;q<=j;q++){hooks.start&&hooks.start(B.segs[q]);entered=q}
      for(let q=doneSegs;q<j;q++){hooks.end&&hooks.end(B.segs[q]);doneSegs=q+1}
      const s=B.segs[j];if(hooks.spin&&s.p&&s.p.spin){const d=SPIN[Math.floor(ts/70)%4];if(d!==vdir)plDir(d)}
      place(el,s.a[0]+(s.b[0]-s.a[0])*k,s.a[1]+(s.b[1]-s.a[1])*k)}
    requestAnimationFrame(fr)}
  requestAnimationFrame(fr)}
function bump(d){setPl(G.st.r+DR[d]*.15,G.st.c+DC[d]*.15);const g0=G,tok=G.tok;setTimeout(()=>{if(G===g0&&G.tok===tok&&!G.busy)setPl(G.st.r,G.st.c)},90)}
const plHooks=got=>({spin:true,start:sg=>{if(sg.d!=null&&!sg.respawn&&!(sg.p&&sg.p.spin))plDir(sg.d);if(sg.p&&sg.p.spin&&!sg.p._s){snd('spin')}if(sg.tele)snd('tele');if(sg.respawn)snd('spike')},
  end:sg=>{if(!got)return;let redraw=false;const from=sg.a||sg.from;
    if(from&&from[0]>=0&&from[1]>=0&&from[0]<G.P.H&&from[1]<G.P.W&&G.P.g[from[0]][from[1]]==='%'){got.brk.add(from[0]*G.P.W+from[1]);redraw=true;snd('crack')}
    if(sg.p&&sg.p.item!=null){got.add(sg.p.item);snd('item');spark(sg.p.r,sg.p.c);redraw=true;if(!G.ghost)stat('crystals')}
    if(sg.p&&sg.p.key!=null){got.gotK.add(sg.p.key);G.vk=(G.vk??G.st.kh)+1;snd('key');spark(sg.p.r,sg.p.c);plDir(vdir);redraw=true}
    if(sg.p&&sg.p.unlock!=null){unlockFx(sg.p.unlock,got);redraw=true}
    if(redraw)gDraw({got,brk:got.brk,gotK:got.gotK,open:got.open})}});
function gMove(d,fromAuto){if(!G||G.busy||G.won||G.dead||G.trapped)return;if(G.ghost&&!fromAuto)return;
  const walk=G.walk&&!G.ghost,from=[G.st.r,G.st.c];const s=step(G.P,G.st,d,walk);G.dir=d;plDir(d);if(walk&&s.res==='move'&&s.path.length>1)spikePrint(from[0],from[1],d);
  if(s.res==='none'){bump(d);snd('bump');missHint(G.st.r,G.st.c,d);return}
  if(s.res==='loop'){gTrap(s);return}
  G.hist.push({st:G.st,dir:G.dir});$('gMoves').textContent=G.hist.length;G.busy=true;snd('move');
  const g0=G,tok=G.tok,got=new Set(),alive=()=>G===g0&&G.tok===tok;got.brk=new Set();got.gotK=new Set();got.open=new Set();G.vk=G.st.kh;if(!G.ghost)stat('moves');
  if(s.path[0].unlock!=null){unlockFx(s.path[0].unlock,got);gDraw({got,brk:got.brk,gotK:got.gotK,open:got.open})}
  animPath($('gPl'),s.path,plHooks(got),()=>{if(!alive())return;
    const last=s.path[s.path.length-1];
    const fin=()=>{if(!alive())return;G.st=s.st;G.vk=null;G.busy=false;G.dir=s.res==='spike'?1:last.d;gDraw();
      if(s.res==='win')gWin();else if(s.res==='fall')gFall(s.kind);
      else{if(!s.cube){if(s.path.length>1&&G.P.g[G.st.r][G.st.c]!=='_')secretBump(G.st.r,G.st.c,last.d);missHint(G.st.r,G.st.c,last.d)}if(s.crumble!=null){snd('crack');crumbleFx(s.crumble)}if(G.auto)setTimeout(()=>alive()&&autoNext(),260)}};
    if(s.cube){const c0=s.cube.path[0],cv=document.createElement('canvas'),big=s.cube.big,spr=big===3?SBLK[s.cube.sdir]:big?BIG:CUBE;cv.width=16;cv.height=spr.height;cv._oy=spr.height-16;cv.className='cubefx';cv.getContext('2d').drawImage(spr,0,0);
      Object.assign(cv.style,{width:T+'px',height:T*spr.height/16+'px'});$('gIn').appendChild(cv);place(cv,c0.r,c0.c);
      gDraw({hide:c0.r*G.P.W+c0.c,got,brk:got.brk,gotK:got.gotK,open:got.open});G.dir=last.d;plDir(G.dir);setPl(s.st.r,s.st.c);snd('push');
      animPath(cv,s.cube.path,{end:sg=>{const f=sg.a;if(f&&f[0]>=0&&f[1]>=0&&f[0]<G.P.H&&f[1]<G.P.W&&G.P.g[f[0]][f[1]]==='%'&&!(f[0]===c0.r&&f[1]===c0.c&&false)){got.brk.add(f[0]*G.P.W+f[1]);gDraw({hide:c0.r*G.P.W+c0.c,got,brk:got.brk});snd('crack')}}},()=>{if(!alive()){cv.remove();return}if(s.cube.sunk){snd(s.cube.sunk==='fill'?'sink':s.cube.sunk==='wall'?'wall':'fall');if(s.cube.sunk!=='deep'&&!G.ghost)stat('fills');const e=s.cube.path[s.cube.path.length-1];place(cv,e.r,e.c,.6,.4);setTimeout(()=>{cv.remove();fin()},180)}else{cv.remove();fin()}})}
    else fin()})}
// Bröckelwand zerfällt: der Block springt in Bruchstücke, die herunterfallen, liegen bleiben und langsam verblassen
function crumbleFx(i){const W=G.P.W,r=Math.floor(i/W),c=i%W,o=objImg('r',hsh(r,c,5)),PX=10,PY=4,cw=o.c.width+2*PX,chh=o.c.height+PY+6;
  const cv=document.createElement('canvas');cv.width=cw;cv.height=chh;cv.className='crumblefx';const sc=T/16;
  Object.assign(cv.style,{left:(c*16-o.ox-PX)*sc+'px',top:(r*16-o.oy-PY)*sc+'px',width:cw*sc+'px',height:chh*sc+'px'});$('gIn').appendChild(cv);
  const src=o.c.getContext('2d').getImageData(0,0,o.c.width,o.c.height),R=rng(i*7+3),pcs=[],floor=o.c.height+PY,cx=o.c.width/2;
  for(let y=0;y<o.c.height;y+=3)for(let xx=0;xx<o.c.width;xx+=3){const w=2+Math.floor(R()*2),h=2+Math.floor(R()*2);let any=false;for(let a=0;a<h;a++)for(let b=0;b<w;b++){const k=((y+a)*o.c.width+xx+b)*4;if(y+a<o.c.height&&xx+b<o.c.width&&src.data[k+3]>0)any=true}
    if(!any)continue;const pc=mkc(w,h);pc.getContext('2d').drawImage(o.c,xx,y,w,h,0,0,w,h);
    pcs.push({pc,x:xx+PX,y:y+PY,vx:(xx+w/2-cx)*.028+(R()-.5)*.3,vy:-.4-R()*.9,rest:floor-h-Math.floor(R()*7),bounce:.25+R()*.2,done:false})}
  const g0=G,tok=G.tok,x=cv.getContext('2d');x.imageSmoothingEnabled=false;let t0=null,last=0;
  function fr(ts){if(G!==g0||G.tok!==tok||!cv.isConnected){cv.remove();return}if(t0===null){t0=ts;last=ts}const t=ts-t0,dt=Math.min(3,(ts-last)/16.7);last=ts;x.clearRect(0,0,cw,chh);
    if(t<110){const j=t<55?1:-1;x.drawImage(o.c,PX+j,PY);x.globalAlpha=1;requestAnimationFrame(fr);return}
    const fade=t<700?1:Math.max(0,1-(t-700)/1300);x.globalAlpha=fade;
    pcs.forEach(p=>{if(!p.done){p.vy+=.22*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.y>=p.rest){p.y=p.rest;if(Math.abs(p.vy)<.9){p.done=true;p.vx=0}else{p.vy=-p.vy*p.bounce;p.vx*=.5}}}
      x.drawImage(p.pc,Math.round(p.x),Math.round(p.y))});
    if(fade<=0){cv.remove();return}requestAnimationFrame(fr)}
  requestAnimationFrame(fr)}
// In der Endlosschleife gefangen: Figur kreist für immer, nur Neustart hilft
function gTrap(s){G.busy=true;G.trapped=true;G.auto=null;G.hist.push({st:G.st,dir:G.dir});$('gMoves').textContent=G.hist.length;snd('move');
  const g0=G,tok=G.tok,alive=()=>G===g0&&G.trapped&&G.tok===tok,hk=Object.assign(plHooks(null),{alive,linear:true});let laps=0;
  const lap=()=>{if(!alive())return;laps++;if(laps===2){snd('fall');G.deaths++;gStats();stat('traps');showDeath('deathTrap')}animPath($('gPl'),s.cyc,hk,lap)};
  animPath($('gPl'),s.path,hk,lap)}
function spark(r,c){const sp=document.createElement('div');sp.className='splash pink';Object.assign(sp.style,{left:c*T+'px',top:r*T+'px',width:T+'px',height:T+'px'});$('gIn').appendChild(sp);setTimeout(()=>sp.remove(),650)}
function autoNext(){if(!G||!G.auto)return;const d=G.auto.shift();if(d==null){G.auto=null;return}gMove(d,true)}
function stopAnim(){G.tok++;clearFx();G.busy=false;G.trapped=false;$('gPl').style.filter=''}
// Zurück: bricht laufende Animationen sauber ab (nur im Bau-Modus)
function gUndo(){if(!G||!canUndo()||!G.hist.length||G.ghost)return;stopAnim();hideDeath();const h=G.hist.pop();G.st=h.st;G.dir=h.dir;G.dead=false;G.won=false;G.auto=null;closeDlg();gDraw();snd('ui')}
function gReset(manual){if(!G)return;if(G.ghost){G.ghost=false;endGhostUI()}G.vk=null;if(manual===true&&!G.dead&&!G.trapped&&G.hist.length)G.restarts++;stopAnim();hideDeath();gStats();G.st=initState(G.P);G.hist=[];G.dead=false;G.won=false;G.auto=null;G.dir=1;closeDlg();gDraw()}
const freeHints=()=>G&&(G.meta.mode==='test'||G.meta.mode==='bau');
// „Weiter“ während des Spielens, wenn das Level schon einmal geschafft wurde
function gNextBtn(){const M=G&&G.meta,b=$('gNext');let nx=-1;if(M&&M.mode==='play'){const p=curPlace();if(p&&S.stars[p.id+'-'+M.li]){nx=nextNormal(p,M.li);if(nx>=0&&!lvOpen(p,nx))nx=-1}}
  b.classList.toggle('hide',nx<0);b.textContent=t('nextLv');b.onclick=()=>{snd('ui');playPlace(nx)}}
function hintLabel(){$('gHint').innerHTML=freeHints()?t('hint'):`${t('hint')} · ${coin()}${S.tokens}`;$('gHint').classList.toggle('dim',!freeHints()&&S.tokens<=0)}
function gHint(){if(!G||G.busy||G.won||G.dead||G.trapped||G.ghost)return;if(G.walk){toast('👟 '+t('spikeNoHint'));return}const key=skey(G.st),repeat=G.lastHint===key;
  if(!freeHints()&&!repeat&&S.tokens<=0){say(t('noTokens'));snd('bump');return}
  const s=solve(G.P,G.st,200000);
  if(s.capped){say(t('hintHard'));return}
  if(!s.path){say(canUndo()?t('deadEndUndo'):t('deadEnd'));return}
  if(!repeat){G.lastHint=key;if(!freeHints()){S.tokens--;persist()}G.hints++;hintLabel();snd('ui')}
  const d=s.path[0],a=document.createElement('div');a.className='harrow';a.textContent=ARW[d];
  const hx=Math.min(Math.max(G.st.c+DC[d]*.8,0),G.P.W-1),hy=Math.min(Math.max(G.st.r+DR[d]*.8,0),G.P.H-1);Object.assign(a.style,{left:hx*T+'px',top:hy*T+'px',width:T+'px',height:T+'px',fontSize:T*.7+'px',lineHeight:T+'px'});
  $('gIn').appendChild(a);setTimeout(()=>a.remove(),2000);say(t('movesLeft',{n:s.path.length})+(freeHints()?'':t('hintStar')))}
// Tod (tiefes Loch, flaches Loch, Stacheln): kurze Animation, dann „Tippe irgendwo“ → ganzes Level neu
function gFall(kind){G.dead=true;G.auto=null;G.deaths++;gStats();if(!G.ghost)stat(kind==='spike'?'spikes':'falls');if(G.ghost)endGhostUI();const pl=$('gPl');
  if(kind==='pit'){snd('sink');pl.style.clipPath='inset(0 0 44% 0)';place(pl,G.st.r+.44,G.st.c);pl.style.transform+=' translateY(0)';$('gRef').style.opacity=0}
  else if(kind==='spike'){snd('spike');pl.style.filter='brightness(1.6) sepia(1) hue-rotate(-50deg) saturate(6)';$('gBoard').classList.add('shake')}
  else{snd('fall');setPl(G.st.r,G.st.c,.15,.3);const sp=document.createElement('div');sp.className='splash';Object.assign(sp.style,{left:G.st.c*T+'px',top:G.st.r*T+'px',width:T+'px',height:T+'px'});$('gIn').appendChild(sp);setTimeout(()=>sp.remove(),700)}
  const g0=G,tok=G.tok;setTimeout(()=>{if(G===g0&&G.tok===tok&&G.dead)showDeath(kind==='pit'?'deathPit':kind==='spike'?'deathSpike':'deathDeep')},kind==='pit'?250:420)}
function showDeath(k){const o=$('death');o.querySelector('b').textContent=t(k);o.querySelector('small').textContent=t('tapRestart')+(canUndo()?' · '+t('orUndo'):'');o.classList.add('on');o._t=Date.now()}
function hideDeath(){$('death').classList.remove('on');$('gBoard').classList.remove('shake');const pl=$('gPl');pl.style.clipPath='';pl.style.filter='';$('gRef').style.opacity=''}
function gStats(){if(!G)return;$('gStats').textContent=t('statLine',{d:G.deaths,r:G.restarts})}
function gWin(){G.won=true;G.auto=null;snd('win');setPl(G.st.r,G.st.c,.2,0);const m=G.hist.length,par=G.par||m;
  if(G.ghost){endGhostUI();const M=G.meta,b=[{t:t('again'),fn:gReset}];if(M.mode==='play'){const p=curPlace(),nx=nextNormal(p,M.li);if(nx>=0)b.push({t:t('nextLv'),cls:'gold',fn:()=>playPlace(nx)});else b.push({t:t('placeDone'),cls:'gold',fn:gBack})}else b.push({t:t('ok'),cls:'gold',fn:gBack});
    const g0=G;setTimeout(()=>G===g0&&dialog(`<div class="dt">👻 ${t('ghostT')}</div>${t('ghostDone',{n:par})}`,b,'center'),350);return}
  if(G.walk){const M=G.meta,p=curPlace(),nx=p?nextNormal(p,M.li):-1,b=[{t:t('again'),fn:gReset},nx>=0?{t:t('nextLv'),cls:'gold',fn:()=>playPlace(nx)}:{t:t('ok'),cls:'gold',fn:gBack}];
    const g0=G;setTimeout(()=>G===g0&&dialog(`<div class="dt">👟 ${t('spikeWinT')}</div>${t('spikeWin',{n:m})}`,b,'center'),350);return}
  if(G.meta.mode==='play'||G.meta.mode==='endless')stat('wins');
  let st=m<=par?3:m<=par+2?2:1;if(G.hints)st=1;const M=G.meta;let bonus='';
  const btns=[{t:t('again'),fn:gReset}];
  if(M.mode==='play'){const p=curPlace();const k=p.id+'-'+M.li;if(!G.hints)S.clean[k]=1;if(st===3&&(S.stars[k]||0)<3){S.tokens++;bonus=`<div class="bonus">${coin()} ${t('tokenBonus')}</div>`}S.stars[k]=Math.max(S.stars[k]||0,st);persist();gNextBtn();
    const nx=nextNormal(p,M.li);btns.push(nx>=0?{t:t('nextLv'),cls:'gold',fn:()=>playPlace(nx)}:{t:t('placeDone'),cls:'gold',fn:gBack})}
  else if(M.mode==='endless'){btns.push({t:'💾 '+t('rndSaveBtn'),keep:true,fn:rndSave});btns.push({t:t('newLv'),cls:'gold',fn:()=>endless(M.n+1)});btns.push({t:'⚙ '+t('rndOptBtn'),fn:rndDlg})}
  else if(M.mode==='test')btns.push({t:t('toEditor'),cls:'gold',fn:gBack});
  else btns.push({t:t('toPlace'),cls:'gold',fn:gBack});
  btns.splice(1,0,{h:`👻 ${t('ghostBtn')}${freeHints()?'':` · 3 ${coin()}`}`,fn:startGhost});checkAch();
  const g0=G;setTimeout(()=>G===g0&&dialog(`<div class="dt">${t('wellDone')}</div><div class="stars">${[0,1,2].map(i=>`<span class="${i<st?'':'off'}">★</span>`).join('')}</div>${t('winLine',{m,p:par})}<br>${t('hintsUsed',{n:G.hints})}${G.hints&&!freeHints()?t('max1'):''}<br>${t('winStats',{d:G.deaths,r:G.restarts})}${bonus}`,btns,'center'),350)}
function unlockFx(i,got){got.open.add(i);G.vk=(G.vk??G.st.kh)-1;snd('unlock');plDir(vdir);if(!G.ghost)stat('unlocks');
  const W=G.P.W,r=Math.floor(i/W),c=i%W,f=document.createElement('canvas');f.width=f.height=16;f.className='keyfx';f.getContext('2d').drawImage(flatImg('l',''),0,0);
  Object.assign(f.style,{left:c*T+'px',top:r*T+'px',width:T+'px',height:T+'px'});$('gIn').appendChild(f);setTimeout(()=>f.remove(),700)}
// Geheimnisse in Wänden: 3× dagegen stoßen → Juwel frei bzw. Portal öffnet sich
function levelKey(){const M=G.meta;if(M.mode==='play'){const p=curPlace();return p?p.id+'-'+M.li:null}if(M.mode==='bau'||M.mode==='test')return'bau';return null}
// Erklärt, warum es nicht weitergeht (fehlende Kristalle / kein Schlüssel)
function missHint(r,c,d){if(!G||G.ghost||G.auto)return;const nn=nxt(G.P,r,c,d);if(!nn)return;const ch=G.P.g[nn[0]][nn[1]],now=Date.now();if(G.lastMiss&&now-G.lastMiss<1800)return;
  if(ch==='G'||G.P.g[r][c]==='G'){const n=G.st.it.filter(x=>!x).length;if(n){G.lastMiss=now;toast('💎 '+t('missItems',{n}))}}
  else if(ch==='l'&&!G.st.lk[G.P.locks.get(nn[0]*G.P.W+nn[1])]&&!G.st.kh){G.lastMiss=now;toast('🔑 '+t(G.P.keys.size?'missKey':'missKeyNone'))}}
// --- Geheimlevel: geheimnisvoller Übergang, eigenes Design ---
function mystSnd(){if(S.mute)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)()}catch(e){return}const t0=AC.currentTime,out=AC.createGain();out.gain.setValueAtTime(0,t0);out.gain.linearRampToValueAtTime(.07,t0+.5);out.gain.linearRampToValueAtTime(.05,t0+1.4);out.gain.exponentialRampToValueAtTime(.001,t0+2.6);out.connect(AC.destination);
  const lfo=AC.createOscillator(),lg=AC.createGain();lfo.frequency.value=5.5;lg.gain.value=4;lfo.connect(lg);lfo.start(t0);lfo.stop(t0+2.7);
  [[220,330],[261.6,311.1],[329.6,466.2],[440,622.3]].forEach(([f1,f2],i)=>{const o=AC.createOscillator();o.type=i%2?'triangle':'sine';o.frequency.setValueAtTime(f1,t0+i*.12);o.frequency.exponentialRampToValueAtTime(f2,t0+1.6);lg.connect(o.frequency);o.connect(out);o.start(t0+i*.12);o.stop(t0+2.7)})}
function secretTrans(go){const ov=document.createElement('div');ov.id='mystOv';const cv=document.createElement('canvas'),W=96,H=Math.round(96*innerHeight/innerWidth);cv.width=W;cv.height=H;ov.appendChild(cv);document.body.appendChild(ov);
  const x=cv.getContext('2d'),R=rng(77),cells=[];for(let y=0;y<H;y+=4)for(let xx=0;xx<W;xx+=4)cells.push([xx,y,R()]);const stars=Array.from({length:40},()=>[R()*W,R()*H,R()]);mystSnd();let t0=null,switched=false;
  function fr(ts){if(t0===null)t0=ts;const t=(ts-t0)/1000;x.clearRect(0,0,W,H);
    const cx=W/2,cy=H/2,cover=t<1.1?Math.min(1,t/0.9):Math.max(0,1-(t-1.25)/0.85);
    // Pixel-Auflösung: Felder füllen sich in zufälliger Reihenfolge mit Dunkelviolett
    cells.forEach(([a,b,r])=>{const dd=Math.hypot(a-cx,b-cy)/Math.hypot(cx,cy);if(r*.5+dd*.5<cover*1.05){x.fillStyle=r<.08?'#2a0e4a':r<.5?'#160628':'#1d0a36';x.fillRect(a,b,4,4)}});
    // Wirbel
    const rot=t*5,arms=5;for(let i=0;i<arms;i++)for(let k=0;k<36;k++){const rr=k*1.25*Math.min(1.4,t*1.6)*cover,an=rot+i*2*Math.PI/arms+k*.22;const px=Math.round(cx+Math.cos(an)*rr),py=Math.round(cy+Math.sin(an)*rr*.85);
      x.fillStyle=k<6?'#f2d8ff':k<16?'#c47cff':'#7a3ad0';x.globalAlpha=Math.max(0,cover*(1-k/40));x.fillRect(px,py,k<10?2:1,k<10?2:1)}
    x.globalAlpha=cover;stars.forEach(([a,b,r])=>{if(Math.sin(t*6+r*20)>.3){x.fillStyle=r>.5?'#ffffff':'#e0b8ff';x.fillRect(Math.round(a),Math.round(b),1,1)}});x.globalAlpha=1;
    if(!switched&&t>=1.1){switched=true;try{go()}catch(e){console.error(e)}toast('✦ '+t2('portalFound'))}
    if(t<2.15)requestAnimationFrame(fr);else ov.remove()}
  requestAnimationFrame(fr)}
const t2=k=>t(k);
function mystSparks(board,on){board.querySelectorAll('.myst').forEach(e=>e.remove());if(!on)return;const R=rng(5);
  for(let i=0;i<14;i++){const sp=document.createElement('i');sp.className='myst';sp.style.left=(R()*100)+'%';sp.style.top=(R()*100)+'%';sp.style.animationDelay=(-R()*6)+'s';sp.style.animationDuration=(4+R()*4)+'s';board.appendChild(sp)}}
function secretBump(r,c,d){if(!G||!G.sec||G.ghost)return;const nn=nxt(G.P,r,c,d);if(!nn)return;const[nr,nc]=nn;const v=G.sec[nr]&&G.sec[nr][nc];
  if(v!=='J'&&v!=='Y')return;if(!WALL.includes(G.P.g[nr][nc]))return;const k=nr+','+nc;if((G.hits[k]||0)>=3)return;
  G.hits[k]=(G.hits[k]||0)+1;snd('crack');$('gBoard').classList.remove('shake');void $('gBoard').offsetWidth;$('gBoard').classList.add('shake');
  if(G.hits[k]<3){gDraw();return}
  const lk=levelKey(),cell=$('gIn'),fx=document.createElement('canvas');fx.width=fx.height=16;fx.className=v==='J'?'gemfx':'portalfx2';fx.getContext('2d').drawImage(v==='J'?GEM:PORTAL,0,0);
  Object.assign(fx.style,{left:nc*T+'px',top:nr*T+'px',width:T+'px',height:T+'px'});cell.appendChild(fx);gDraw();
  if(v==='J'){snd('item');setTimeout(()=>fx.remove(),1400);const gk=lk&&lk!=='bau'?lk+'-'+k:null;
    if(gk&&!S.gems[gk]){S.gems[gk]=1;stat('gems');persist();buildGemBtn()}toast(`<img class="coin" src="${GEM_URL}" alt=""> ${t('gemFound')}`);return}
  // Portal
  snd('tele');setTimeout(()=>snd('win'),250);G.busy=true;const M=G.meta,g0=G;
  setTimeout(()=>{if(G!==g0)return;fx.remove();
    if(M.mode==='play'){const p=curPlace(),si=secretAfter(p.levels,M.li);if(si<0){G.busy=false;toast(t('portalNoTarget'));return}
      if(!S.portals[p.id+'-'+si]){S.portals[p.id+'-'+si]=1;stat('portals');persist()}secretTrans(()=>playPlace(si))}
    else{const o=M.mode==='test'?S.bau.find(x=>x.id===E.ortId):curOrt();const li=o?o.levels.findIndex(m=>m.id===(M.mode==='test'?E.id:M.lid)):-1,si=o&&li>=0?secretAfter(o.levels,li):-1;
      if(si<0){G.busy=false;toast(t('portalNoTarget'));return}const m=o.levels[si];secretTrans(()=>play({map:m.map,wrap:m.wrap,sec:m.sec,secret:true},{mode:'bau',lid:m.id,title:m.name}))}},900)}
// Geisterlauf: die kürzeste Lösung wird als Geist vorgespielt (kostet 3 Eistaler, beim Bauen gratis)
function startGhost(){if(!G)return;if(!freeHints()){if(S.tokens<3){dialog(t('noCoins'));return}S.tokens-=3;persist();hintLabel()}
  gReset();const s=solve(G.P);if(!s.path)return;G.ghost=true;stat('ghosts');$('gPl').classList.add('ghost');$('gRef').classList.add('ghost');say('👻 '+t('ghostT'));G.auto=s.path.slice();setTimeout(()=>G&&G.ghost&&autoNext(),500)}
function endGhostUI(){$('gPl').classList.remove('ghost');$('gRef').classList.remove('ghost')}
function gBack(){const M=G&&G.meta;if(G)G.tok++;G=null;
  if(!M)return home();if(M.mode==='test')openEditor();else if(M.mode==='bau'){buildOrt();show('ort')}else if(M.mode==='play'){buildLevels();show('levels')}else{buildWorlds();show('worlds')}}
// ---- Zufallslevel: Items, randlos und Schwierigkeit wählen, im Hintergrund erzeugen ----
const RND_MECH=[['item','*'],['key','q'],['cube','o'],['big','O'],['sblock','4'],['crack','%'],['melt','m'],['brittle','r'],['hole','u'],['spike','e'],['arrow','>'],['tele','A']];
const RND_DIFF=[{min:7,max:12,W:7,H:8},{min:13,max:18,W:8,H:9},{min:19,max:28,W:9,H:10}];
function rndCfg(){S.rnd=S.rnd||{mech:['item','cube'],wrap:false,diff:1};return S.rnd}
function rndDlg(){const c=rndCfg();
  const chips=RND_MECH.map(([k,ch])=>`<button class="rchip${c.mech.includes(k)?' on':''}" data-k="${k}">${icon(ch,18)}<span>${t('rm_'+k)}</span></button>`).join('');
  dialog(`<div class="dt">∞ ${t('rndT')}</div><div class="rlab">${t('rndItems')}</div><div class="rchips">${chips}</div>
    <div class="rlab">${t('rndDiff')}</div><div class="rseg">${[0,1,2].map(i=>`<button class="rdiff${c.diff===i?' on':''}" data-d="${i}">${t('rd'+i)}</button>`).join('')}</div>
    <label class="chk rwrap"><input type="checkbox" id="rWrap" ${c.wrap?'checked':''}> ⇄ ${t('rndWrap')}</label>`,
    [{t:t('cancel')},{t:'🎲 '+t('rndGo'),cls:'gold',fn:()=>{c.wrap=$('rWrap').checked;persist();endless(1)}}]);
  document.querySelectorAll('.rchip').forEach(b=>b.onclick=()=>{const k=b.dataset.k,i=c.mech.indexOf(k);if(i>=0)c.mech.splice(i,1);else c.mech.push(k);b.classList.toggle('on');snd('ui')});
  document.querySelectorAll('.rdiff').forEach(b=>b.onclick=()=>{c.diff=+b.dataset.d;document.querySelectorAll('.rdiff').forEach(x=>x.classList.toggle('on',x===b));snd('ui')})}
function rndOpts(){const c=rndCfg(),D=RND_DIFF[c.diff],m=c.mech,p={'#':.06,k:.05,K:.04,'_':.04};
  if(m.length<2){p['#']=.1;p.k=.05}
  if(m.includes('crack'))p['%']=.05;if(m.includes('melt'))p.m=.06;if(m.includes('brittle'))p.r=.05;if(m.includes('hole')){p.u=.05;p['~']=.03}if(m.includes('spike')){p.x=.02;p.dspike=.04}if(m.includes('arrow'))p.arrow=.05;
  if(m.includes('big')&&!p.u)p.u=.04;
  return{W:D.W,H:D.H,p,wrap:!!c.wrap,items:m.includes('item')?1+(c.diff>0):0,keys:m.includes('key')?1:0,cubes:m.includes('cube')?1:0,cubes2:m.includes('big')?1:0,cubes3:m.includes('sblock')?1:0,tele:m.includes('tele')?1:0,minM:D.min,maxM:D.max}}
const RND_RE={item:/\*/,key:/q/,cube:/o/,big:/O/,sblock:/[1-4]/,crack:/%/,melt:/m/,brittle:/r/,hole:/[u~]/,spike:/[xnsew]/,arrow:/[\^v<>]/,tele:/[ABC]/};
function rndLen(L){const s=solve(prep(L),null,30000);return s.path?s.path.length:-1}
function rndOk(L,m){const c=rndCfg();if(c.wrap&&rndLen({...L,wrap:false})===m)return false;return c.mech.every(k=>RND_RE[k].test(L.map.join('')))}
// erzeugt in kleinen Häppchen, damit die Oberfläche flüssig bleibt; zu leichte Kandidaten werden Feld für Feld schwerer gemacht
function rndGen(done,prog){const o=rndOpts(),t0=Date.now();let best=null,seed=Math.random()*1e9|0,phase=0,g=null,cur=0,R=rng(seed);const pal=['.','.','.','.','#','k','K','_'];for(const k in o.p)if(!'#kK_'.includes(k)&&k!=='dspike'&&k!=='arrow')pal.push(k);if(o.p.arrow)pal.push('^','v','<','>');if(o.p.dspike)pal.push('n','s','e','w');
  const fixed=/[SGoO1234q\*ABCl]/;
  function chunk(){const ts=Date.now();
    while(Date.now()-ts<35){
      if(phase===0){const L=generate({...o,minM:Math.max(5,o.minM-6),tries:12,limit:20000},seed++);if(L&&rndOk(L,L.par)){if(!best||L.par>best.par)best=L;if(L.par>=o.minM&&L.par<=o.maxM){done(L);return}}
        if(Date.now()-t0>2500&&best){phase=1;g=best.map.map(r=>[...r]);cur=best.par}}
      else{const H=g.length,W=g[0].length,ch=[];for(let j=0;j<1+Math.floor(R()*2);j++){const r=Math.floor(R()*H),c=Math.floor(R()*W);if(fixed.test(g[r][c]))continue;const nv=pal[Math.floor(R()*pal.length)];if(nv===g[r][c])continue;ch.push([r,c,g[r][c]]);g[r][c]=nv}
        if(!ch.length)continue;const L={map:g.map(r=>r.join('')),wrap:o.wrap};const m=rndLen(L);
        if(m>0&&m<=o.maxM&&(m>cur||(m===cur&&R()<.5))&&rndOk(L,m)){cur=m;if(m>best.par)best={...L,par:m};if(m>=o.minM){done({...L,par:m});return}}else ch.reverse().forEach(([r,c,v])=>g[r][c]=v)}
      if(Date.now()-t0>14000){if(best){done(best);return}done(null);return}}
    prog(Math.min(99,Math.round((Date.now()-t0)/140)),best?best.par:0);setTimeout(chunk,0)}
  setTimeout(chunk,30)}
function endless(n){n=n||1;let stop=false;dialog(`<b>🎲 ${t('rndBusy')}</b><div class="fixprog"><div id="rBar"></div></div><div id="rTxt" style="font-size:8px;margin-top:6px"></div>`,[{t:t('cancel'),fn:()=>{stop=true}}]);
  rndGen(L=>{if(stop)return;closeDlg();if(!L){dialog(t('rndNone'),[{t:t('ok'),fn:rndDlg}]);return}play({map:L.map,wrap:!!L.wrap,par:L.par},{mode:'endless',n,title:t('randomTitle',{n})})},
    (pc,bp)=>{if($('rBar')){$('rBar').style.width=pc+'%';$('rTxt').textContent=bp?t('rndBest',{n:bp}):''}})}
// gefundenes Zufallslevel im Bau-Modus speichern (Ort „Zufallsfunde“)
function rndSave(){const L=G.L;let o=S.bau.find(x=>x.rnd);if(!o){o={id:uid(),name:t('rndPlace'),rnd:true,levels:[]};S.bau.push(o)}
  if(o.levels.some(m=>m.map.join('|')===L.map.join('|'))){toast(t('rndSavedAlready'));return}
  o.levels.push({id:uid(),name:t('randomTitle',{n:o.levels.length+1}),map:L.map.slice(),wrap:!!L.wrap,par:G.par});persist();snd('item');toast('💾 '+t('rndSaved',{p:o.name}))}
// ---- Eingabe ----
const KEYS={ArrowUp:0,ArrowDown:1,ArrowLeft:2,ArrowRight:3,w:0,s:1,a:2,d:3};
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  if($('home').classList.contains('on')&&e.key in KEYS){e.preventDefault();homeMove(KEYS[e.key]);return}
  if($('game').classList.contains('on')&&$('death').classList.contains('on')&&!(e.key==='z'&&canUndo())){gReset();return}
  if($('game').classList.contains('on')){if(e.key in KEYS){e.preventDefault();gMove(KEYS[e.key])}else if(e.key==='z'&&canUndo())gUndo();else if(e.key==='r')gReset(true);else if(e.key==='h')gHint()}
  else if($('editor').classList.contains('on')&&(e.ctrlKey||e.metaKey)&&e.key==='z'){e.preventDefault();e.shiftKey?edRedo():edUndo()}});
(function(){const a=$('gArea');let sx=null,sy=null;
  a.addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY});
  a.addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx,dy=e.clientY-sy;sx=null;if(Math.max(Math.abs(dx),Math.abs(dy))<22)return;gMove(Math.abs(dx)>Math.abs(dy)?(dx>0?3:2):(dy>0?1:0))});
  a.addEventListener('pointercancel',()=>sx=null)})();

// ---- Bauen: Orte ----
let ORT=null; // id des offenen Orts
const curOrt=()=>S.bau.find(o=>o.id===ORT);
function pubWorldOf(o){for(const w of S.worlds)if(w.places.some(p=>p.id==='p'+o.id))return w;for(const id in S.extra)if(S.extra[id].some(p=>p.id==='p'+o.id))return findWorld(id);return null}
function buildBau(){const wl=$('bWorlds');wl.innerHTML='';
  if(S.worlds.length){wl.innerHTML=`<div class="sec">${t('myWorlds')}</div>`;S.worlds.forEach(w=>{const row=document.createElement('div');row.className='wrow';
    row.innerHTML=`<div class="minfo"><b>${esc(w.name)}</b><small>${t('nPlaces',{n:w.places.length})}: ${w.places.map(p=>esc(p.name)).join(', ')||'–'}</small></div>`;
    const r=document.createElement('button');r.className='pbtn sm';r.textContent='✎';r.onclick=()=>renameDlg(t('renameWorld'),w.name,v=>{w.name=v;persist();buildBau()});
    const x=document.createElement('button');x.className='pbtn sm';x.textContent='⇪';x.onclick=()=>codeDlg(t('exportWorld'),worldCode(w));
    const d=document.createElement('button');d.className='pbtn sm';d.textContent='🗑';d.onclick=()=>twoTap(d,'',()=>{S.worlds=S.worlds.filter(x=>x!==w);persist();buildBau()});
    row.append(r,x,d);wl.appendChild(row)});const h=document.createElement('div');h.className='sec';h.textContent=t('myPlaces');wl.appendChild(h)}
  const l=$('bList');l.innerHTML='';
  if(!S.bau.length)l.innerHTML=`<div class="empty">${t('noPlaces')}</div>`;
  S.bau.forEach(o=>{const b=document.createElement('button');b.className='card';const pw=pubWorldOf(o);
    b.innerHTML=`<div class="ct">${esc(o.name)}</div><div class="cs">${t('nLevels',{n:o.levels.length})}${pw?` · <span class="ok">${t('inGame',{w:esc(pw.name)})}</span>`:o.levels.length>=MIN_LEVELS?' · '+t('readyCheck'):' · '+t('moreToGo',{n:MIN_LEVELS-o.levels.length})}</div>`;
    b.onclick=()=>{snd('ui');ORT=o.id;buildOrt();show('ort')};l.appendChild(b)})}
function renameDlg(title,cur,cb){dialog(`<div class="dt">${title}</div><input id="rnm" class="tin" maxlength="40" value="${esc(cur)}">`,[{t:t('cancel')},{t:t('save'),cls:'gold',keep:true,fn:()=>{const v=$('rnm').value.trim();if(!v){$('rnm').classList.add('bad');return}closeDlg();cb(v)}}]);setTimeout(()=>{try{$('rnm').focus();$('rnm').select()}catch(e){}},50)}
function syncPub(o){const w=pubWorldOf(o);if(w){const p=w.places.find(p=>p.id==='p'+o.id);if(p)p.name=o.name}}
function newOrt(){dialog(`<div class="dt">${t('newPlaceT')}</div>${t('newPlaceQ')}<input id="onm" class="tin" maxlength="30" value="${esc(t('placeDefault',{n:S.bau.length+1}))}">`,[{t:t('cancel')},{t:t('create'),cls:'gold',fn:()=>{const n=$('onm').value.trim()||t('newPlaceT');const o={id:uid(),name:n,levels:[]};S.bau.unshift(o);persist();ORT=o.id;buildOrt();show('ort')}}]);setTimeout(()=>{try{$('onm').select()}catch(e){}},50)}
function buildOrt(){const o=curOrt();if(!o){buildBau();show('bau');return}$('oName').value=o.name;const l=$('oList');l.innerHTML='';
  const n=o.levels.length,pw=pubWorldOf(o);const nn=o.levels.filter(m=>!m.secret).length;$('oPub').textContent=pw?t('pubUpdate'):t('pub',{a:Math.min(nn,MIN_LEVELS),b:MIN_LEVELS});$('oPub').classList.toggle('dim',n<MIN_LEVELS);
  if(!n)l.innerHTML=`<div class="empty">${t('noLevels')}</div>`;
  o.levels.forEach((m,i)=>{const row=document.createElement('div');row.className='mrow';const cv=document.createElement('canvas');cv.className='mini'+(m.secret?' secretcv':'');drawBoard(cv,m.map.map(r=>r.split('')),{ghost:true,wrap:m.wrap,sec:m.sec?m.sec.map(r=>r.split('')):undefined});
    const sc=Math.min(64/cv.width,48/cv.height);cv.style.width=cv.width*sc+'px';cv.style.height=cv.height*sc+'px';
    const info=document.createElement('div');info.className='minfo click';info.onclick=()=>{renameDlg(t('renameLevel'),m.name,v=>{m.name=v;m.secret=$('rsec').checked;persist();buildOrt()});const lb=document.createElement('label');lb.className='chk';lb.innerHTML=`<input type="checkbox" id="rsec" ${m.secret?'checked':''}> ${t('secretLv')}`;$('dlgBody').appendChild(lb)};info.innerHTML=`<b>${m.secret?'✦':i+1+'.'} ${esc(m.name)} <span class="pen">✎</span></b><small>${m.map[0].length}×${m.map.length}${m.wrap?' · ⇄':''}${m.par?' · Par '+m.par:m.par===0?' · '+t('unsolvableTag'):''}</small>`;
    const bt=document.createElement('div');bt.className='mbtns';
    const mkb=(t,fn)=>{const b=document.createElement('button');b.className='pbtn sm';b.textContent=t;b.onclick=()=>fn(b);bt.appendChild(b)};
    mkb('▶',()=>{const j=m.map.join('');if(!j.includes('S')||!j.includes('G')){dialog(t('missingSG'));return}play({map:m.map,wrap:m.wrap,par:m.par||undefined,sec:m.sec,secret:!!m.secret},{mode:'bau',lid:m.id,title:m.name})});
    mkb('▲',()=>{if(i>0){[o.levels[i-1],o.levels[i]]=[o.levels[i],o.levels[i-1]];persist();buildOrt()}});
    mkb('⇪',()=>shareDlg(m,true));
    mkb('✎',()=>edLoad(o,m));
    mkb('▼',()=>{if(i<n-1){[o.levels[i+1],o.levels[i]]=[o.levels[i],o.levels[i+1]];persist();buildOrt()}});
    mkb('🗑',b=>twoTap(b,'',()=>{o.levels.splice(i,1);persist();buildOrt()}));
    const cw=document.createElement('div');cw.className='mcw';cw.appendChild(cv);cw.onclick=()=>previewDlg(m);row.append(cw,info,bt);l.appendChild(row)});
  const pb=$('oPaste');if(S.clip){pb.style.display='';pb.textContent=t('pasteLv',{n:S.clip.name})}else pb.style.display='none'}
function previewDlg(m){dialog(`<div class="dt">${esc(m.name)}</div><canvas id="pvc" class="pvc"></canvas><div class="pvi">${m.map[0].length}×${m.map.length}${m.wrap?' · '+t('edgeOpen'):''}${m.par?' · Par '+m.par:''}</div>`,[{t:t('close')}],'center');$('pvc').classList.toggle('secretcv',!!m.secret);drawBoard($('pvc'),m.map.map(r=>r.split('')),{ghost:true,wrap:m.wrap,sec:m.sec?m.sec.map(r=>r.split('')):undefined})}
// Übertragen ins Spiel: mindestens MIN_LEVELS Levels, alle lösbar
function publishOrt(){const o=curOrt();if(!o)return;const n=o.levels.filter(m=>!m.secret).length;
  if(n<MIN_LEVELS){dialog(t('needMore',{n:MIN_LEVELS,m:MIN_LEVELS-n}));return}
  const N=o.levels.length;dialog(`${t('checking')} <span id="pp">0/${N}</span>`,[]);const bad=[],pars=[];let i=0;
  const next=()=>{if(i>=N)return done();const m=o.levels[i],j=m.map.join('');let ok=false;
    if(j.includes('S')&&j.includes('G')){const s=solve(prep({map:m.map,wrap:m.wrap}),null,400000);if(s.path){ok=true;pars[i]=s.path.length;m.par=s.path.length}else{m.par=s.capped?null:0;bad.push(`${i+1}. ${esc(m.name)} – ${s.capped?t('tooComplex'):t('notSolvable')}`)}}
    else bad.push(`${i+1}. ${esc(m.name)} – ${t('missingSG2')}`);
    i++;const pp=$('pp');if(pp)pp.textContent=i+'/'+N;setTimeout(next,10)};
  const done=()=>{persist();buildOrt();
    if(bad.length){dialog(`${t('notReady')}<div class="badl">${bad.join('<br>')}</div>`);return}
    const pw=pubWorldOf(o);if(pw){doPublish(o,pw,pars);return}chooseWorld(w=>doPublish(o,w,pars))};
  setTimeout(next,30)}
function chooseWorld(cb){const ws=allWorlds();
  dialog(`<div class="dt">${t('whichWorld')}</div>${t('allSolvable')}${ws.length?'':'<br><br>'+t('noOwnWorld')}<input id="wnm" class="tin" maxlength="30" placeholder="${t('newWorldPh')}">`,
    [...ws.map(w=>({t:w.name,fn:()=>cb(w)})),{t:t('newWorld'),cls:'gold',keep:true,fn:()=>{const n=$('wnm').value.trim();if(!n){$('wnm').classList.add('bad');$('wnm').focus();return}const w={id:'u'+uid(),name:n,places:[]};S.worlds.push(w);closeDlg();cb(w)}}])}
function doPublish(o,w,pars){const id='p'+o.id;const place={id,name:o.name,levels:o.levels.map((m,i)=>Object.assign({name:m.name,map:m.map.slice(),wrap:!!m.wrap,par:pars[i]},m.sec?{sec:m.sec.slice()}:{},m.secret?{secret:true}:{}))};
  if(w.builtin){const L=S.extra[w.id]=S.extra[w.id]||[];place.extra=true;const k=L.findIndex(p=>p.id===id);if(k>=0){place.pos=L[k].pos;L[k]=place}else L.push(place);stat('pubs');persist();buildOrt();snd('win');
    dialog(`<div class="dt">${t('transferred')}</div>${t('transferredTxt',{o:esc(o.name),w:esc(w.name)})}`,[{t:t('ok')},{t:t('playNow'),cls:'gold',fn:()=>{NAV.world=w.id;NAV.place=id;buildLevels();show('levels')}}],'center');return}
  const k=w.places.findIndex(p=>p.id===id);if(k>=0)w.places[k]=place;else w.places.push(place);stat('pubs');persist();buildOrt();snd('win');
  dialog(`<div class="dt">${t('transferred')}</div>${t('transferredTxt',{o:esc(o.name),w:esc(w.name)})}`,[{t:t('ok')},{t:t('playNow'),cls:'gold',fn:()=>{NAV.world=w.id;NAV.place=id;buildLevels();show('levels')}}],'center')}

// ---- Editor ----
const PAL='kKox*u#._SG~%^v<>ABCmqlOnsewz1234rJY'.split('').map(ch=>[ch]);const palName=ch=>t('p'+ch);
let E=null,ET=32;
function edNew(){const o=curOrt();if(!o)return;stat('builds');dialog(`<div class="dt">${t('newLevel')}</div>
  <div class="fld"><span>${t('width')}</span><input type="range" id="nw" min="3" max="24" value="8"><b id="nwV">8</b></div>
  <div class="fld"><span>${t('height')}</span><input type="range" id="nh" min="3" max="24" value="10"><b id="nhV">10</b></div>
  <div class="fld"><span>${t('floor')}</span><div class="seg" id="nf"><button class="pbtn sm on" data-f=".">${t('ice')}</button><button class="pbtn sm" data-f="_">${t('stone')}</button></div></div>
  <label class="chk"><input type="checkbox" id="nb"> ${t('borderRocks')}</label>`,
  [{t:t('cancel')},{t:t('createBtn'),cls:'gold',fn:()=>{
    const w=+$('nw').value,h=+$('nh').value,f=$('nf').querySelector('.on').dataset.f,bd=$('nb').checked;
    const g=[];for(let r=0;r<h;r++){g.push([]);for(let c=0;c<w;c++)g[r].push(bd&&(r===0||c===0||r===h-1||c===w-1)?'#':f)}
    const q=bd&&w>2&&h>2?1:0;g[q][q]='S';g[h-1-q][w-1-q]='G';
    const m={id:uid(),name:t('levelDefault',{n:o.levels.length+1}),map:g.map(r=>r.join('')),wrap:false,par:null};o.levels.push(m);persist();edLoad(o,m,f)}}]);
  $('nw').oninput=e=>$('nwV').textContent=e.target.value;$('nh').oninput=e=>$('nhV').textContent=e.target.value;
  $('nf').querySelectorAll('button').forEach(b=>b.onclick=()=>{$('nf').querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on')})}
function edLoad(o,m,f){const g0=m.map.map(r=>r.split('')),mk=g0.map((row,r)=>row.map((ch,c)=>m.mk&&m.mk[r]?m.mk[r][c]==='1':ch==='z'));g0.forEach(row=>row.forEach((ch,c)=>{if(ch==='z')row[c]='.'}));
  const sec=g0.map((row,r)=>row.map((_,c)=>m.sec&&m.sec[r]?m.sec[r][c]:'.'));
  E={mk,sec,ortId:o.id,id:m.id,name:m.name,g:g0,wrap:!!m.wrap,par:m.par??null,tool:(E&&E.tool)||'#',mode:(E&&E.mode)||'pen',undo:[],redo:[],under:{S:f||'.',G:f||'.'}};openEditor()}
function edLevel(){return{map:E.g.map(r=>r.join('')),wrap:E.wrap,par:E.par||undefined,sec:E.sec.some(r=>r.some(v=>v!=='.'))?E.sec.map(r=>r.join('')):undefined}}
function edEntry(){const o=S.bau.find(x=>x.id===E.ortId);return o&&o.levels.find(m=>m.id===E.id)}
function edSave(){const m=edEntry();if(!m)return;m.name=E.name;m.map=E.g.map(r=>r.join(''));m.sec=E.sec.some(r=>r.some(v=>v!=='.'))?E.sec.map(r=>r.join('')):undefined;m.mk=E.mk.some(r=>r.some(v=>v))?E.mk.map(r=>r.map(v=>v?'1':'0').join('')):undefined;m.wrap=E.wrap;m.par=E.par;persist()}
function openEditor(){palOpen=false;E.fix=null;fixBar();const en=edEntry();$('editor').classList.toggle('secretlv',!!(en&&en.secret));show('editor');$('eName').value=E.name;buildPal();edModeBtn();$('eWrap').classList.toggle('on',E.wrap);requestAnimationFrame(()=>{palSize();edFit();edDraw();edStat()})}
const PAL_DEFAULT=['#','.','_','S','G','k','K','o','x','*','~','u','%','m','q','l','O','^','v','<','>','n','s','e','w','A','B','C','z','1','2','3','4','r','J','Y'],PAL_VIS=14;
let palOpen=false;
function palOrder(){let o=(S.palOrder||[]).filter(c=>PAL_DEFAULT.includes(c));PAL_DEFAULT.forEach(c=>{if(!o.includes(c))o.push(c)});S.palOrder=o;return o}
const PAL_CATS=[['catFloor','._%m'],['catObst','#kKroOl'],['catSpikeB','1234'],['catHaz','~uxnsew'],['catGoal','SG*q'],['catArrow','^v<>'],['catTele','ABC'],['catSecret','JY'],['catBuild','z']];
function buildCats(){const c=$('eCat');c.innerHTML='';PAL_CATS.forEach(([k,chs])=>{const sec=document.createElement('div');sec.className='pcat';sec.innerHTML=`<div class="pch">${t(k)}</div>`;const g=document.createElement('div');g.className='pcg';
  [...chs].forEach(ch=>{const b=document.createElement('button');b.className='pci'+(E.tool===ch?' on':'');b.innerHTML=icon(ch,34)+`<span>${palName(ch)}</span>`;b.onclick=()=>pickTool(ch);g.appendChild(b)});sec.appendChild(g);c.appendChild(sec)})}
function buildPal(){const p=$('ePal'),order=palOrder();
  if(!p.children.length)PAL.forEach(([ch,n])=>{const b=document.createElement('button');b.className='pal';b.dataset.t=ch;b.innerHTML=icon(ch,30)+(TELE.includes(ch)?`<i>${ch}</i>`:'');b.title=palName(ch);b.onclick=()=>pickTool(ch);p.appendChild(b)});
  const byT={};[...p.children].forEach(b=>byT[b.dataset.t]=b);order.forEach(ch=>p.appendChild(byT[ch]));
  [...p.children].forEach(b=>b.classList.toggle('on',b.dataset.t===E.tool));
  $('eToolName').textContent=palName(E.tool);$('eToolDesc').textContent=t('d'+E.tool);buildCats();palSize()}
function palSize(){const p=$('ePal'),clip=$('ePalClip'),w=$('palWrap');const first=p.children[0];if(!first)return;
  const pad=parseFloat(getComputedStyle(clip).paddingTop)||0,rowH=first.offsetHeight,gap=6,lab=$('eRecent').offsetHeight,col=lab+rowH*2+gap+pad*2,full=Math.min(clip.scrollHeight,innerHeight*.62);
  clip.style.height=(palOpen?full:col)+'px';clip.classList.toggle('open',palOpen);if(!palOpen)clip.scrollTop=0;
  $('palSpace').style.height=(w.offsetHeight-clip.offsetHeight+col+6)+'px';$('palChev').textContent=palOpen?t('palLess'):t('palMore');w.classList.toggle('open',palOpen)}
function togglePal(v){palOpen=v==null?!palOpen:v;palSize();snd('ui')}
function flip(fn){const els=[...$('ePal').children],bef=new Map(els.map(e=>[e,e.getBoundingClientRect()]));fn();
  els.forEach(e=>{const a=bef.get(e),b=e.getBoundingClientRect(),dx=a.left-b.left,dy=a.top-b.top;if(!dx&&!dy)return;
    e.style.transition='none';e.style.transform=`translate(${dx}px,${dy}px)`;e.offsetWidth;e.style.transition='transform .4s cubic-bezier(.2,.8,.2,1)';e.style.transform=''})}
// Zuletzt benutzte nach oben: Feld aus den versteckten Zeilen tauscht mit dem am längsten unbenutzten sichtbaren
function pickTool(ch){const o=palOrder(),i=o.indexOf(ch);S.palUse=S.palUse||{};
  if(i>=PAL_VIS){let j=o.indexOf(E.tool);if(j<0||j>=PAL_VIS){j=0;let min=Infinity;for(let k=0;k<PAL_VIS;k++){const u=S.palUse[o[k]]||0;if(u<min){min=u;j=k}}}[o[i],o[j]]=[o[j],o[i]]}
  S.palUse[ch]=Date.now();E.tool=ch;persist();snd('ui');flip(buildPal)}
function edFit(){const H=E.g.length,W=E.g[0].length;ET=fitT($('eArea'),W,H,48);const b=$('eBoard');layBoard(b,$('eCv'),$('eIn'),W,H,ET);$('eIn').style.setProperty('--T',ET+'px');b.classList.toggle('wrapon',E.wrap)}
function edDraw(){const F=E.fix&&E.fix.list[E.fix.i];drawBoard($('eCv'),F?F.g:E.g,{ghost:true,wrap:E.wrap,marks:E.mk,sec:E.sec});fixMarks()}
// --- Lösungs-Helfer: sucht kleine Änderungen, die ein unlösbares Level lösbar machen (nur Vorschau, bis man übernimmt) ---
const FIX_RM='#kKx~u%rnsew_1234oOl';
function fixSearch(){if(E.fix)fixClose();const g0=E.g.map(r=>r.slice()),H=g0.length,W=g0[0].length,base=edLevel(),cands=[];
  for(let r=0;r<H;r++)for(let c=0;c<W;c++){const ch=g0[r][c];if(E.sec[r][c]!=='.')continue;
    if(ch==='.'){cands.push([[r,c,'.','k']]);cands.push([[r,c,'.','_']])}else if(FIX_RM.includes(ch))cands.push([[r,c,ch,'.']])}
  const found=[],t0=Date.now(),adds=cands.filter(x=>x[0][2]==='.');let i=0,phase=1,pairs=0,stop=false;const R=rng(H*131+W);
  const tryC=ch=>{const g=g0.map(r=>r.slice());ch.forEach(([r,c,,n])=>g[r][c]=n);const s=solve(prep({...base,map:g.map(r=>r.join(''))}),null,25000);if(s.path&&s.path.length>0)found.push({g,ch,par:s.path.length})};
  dialog(`<b>🪄 ${t('fixT')}</b><div class="fixprog"><div id="fixBar"></div></div><div id="fixTxt" style="font-size:8px;margin-top:6px">0%</div>`,[{t:t('cancel'),fn:()=>{stop=true}}]);
  function chunk(){if(stop||!E)return;const ts=Date.now();
    while(Date.now()-ts<45){if(phase===1){if(i>=cands.length){phase=found.length?3:2;break}tryC(cands[i++])}
      else if(phase===2){if(pairs>=900||Date.now()-t0>25000||found.length>=4||adds.length<2){phase=3;break}const a=adds[Math.floor(R()*adds.length)],b2=adds[Math.floor(R()*adds.length)];
        if(a[0][0]===b2[0][0]&&a[0][1]===b2[0][1])continue;pairs++;tryC([a[0],b2[0]])}else break}
    const pct=phase===1?Math.round(i/cands.length*(found.length?100:60)):phase===2?60+Math.round(Math.min(1,pairs/900)*40):100;
    if($('fixBar')){$('fixBar').style.width=pct+'%';$('fixTxt').textContent=pct+'% · '+t('fixFound',{n:found.length})}
    if(phase<3){setTimeout(chunk,0);return}
    if(!found.length){dialog(t('fixNone'));return}
    const seen=new Set();const list=found.sort((a,b)=>a.ch.length-b.ch.length||b.par-a.par||a.ch.filter(x=>x[3]==='.').length-b.ch.filter(x=>x[3]==='.').length).filter(f=>{const k=f.ch.map(x=>x.join()).sort().join('|');if(seen.has(k))return false;seen.add(k);return true}).slice(0,5);
    closeDlg();E.fix={list,i:0,show:true};fixBar();edDraw()}
  setTimeout(chunk,60)}
function portalInfo(){const o=S.bau.find(x=>x.id===E.ortId);if(!o)return;const i=o.levels.findIndex(m=>m.id===E.id);const j=o.levels.findIndex((m,k)=>k>i&&m.secret);
  if(j>=0)toast(t('portalTo',{n:o.levels[j].name}));else dialog(t('portalHow'))}
function buildHelp(){const H=t('bh');dialog(`<b>${t('bhT')}</b><div class="bhelp">${H.map(([q,a],i)=>`<details${i===0?' open':''}><summary>${q}</summary><div>${a}</div></details>`).join('')}</div>`,[{t:t('close')}])}
function fixMarks(){document.querySelectorAll('#eIn .fixmark').forEach(e=>e.remove());const F=E.fix&&E.fix.list[E.fix.i];if(!F||!E.fix.show)return;
  F.ch.forEach(([r,c,o,n])=>{const d=document.createElement('div');d.className='fixmark '+(n==='.'?'rm':'add');d.textContent=n==='.'?'−':'+';Object.assign(d.style,{left:c*ET+'px',top:r*ET+'px',width:ET+'px',height:ET+'px'});$('eIn').appendChild(d)})}
function fixBar(){const F=E.fix&&E.fix.list[E.fix.i],b=$('eFix');if(!F){b.classList.add('hide');return}
  b.classList.remove('hide');
  $('eFixTxt').innerHTML=`🪄 ${t('fixSug',{i:E.fix.i+1,n:E.fix.list.length})} · Par ${F.par} · ${t('fixCh',{n:F.ch.length})}`;$('eFixEye').classList.toggle('on',E.fix.show)}
function fixStep(d){E.fix.i=(E.fix.i+d+E.fix.list.length)%E.fix.list.length;fixBar();edDraw()}
function fixClose(){E.fix=null;fixBar();edDraw()}
function fixApply(){const F=E.fix.list[E.fix.i];pushUndo();E.g=F.g.map(r=>r.slice());E.par=F.par;E.fix=null;fixBar();edSave();edStat();edDraw();toast(t('fixApplied'))}
function edStat(){const g=E.g,W=g[0].length,H=g.length,flat=g.flat();const w=[];
  if(!flat.includes('S'))w.push(t('startMissing'));if(!flat.includes('G'))w.push(t('goalMissing'));
  for(const tt of TELE){const n=flat.filter(x=>x===tt).length;if(n===1)w.push(t('teleNeeds',{t:tt}))}
  const nk=flat.filter(x=>x==='q').length,nl=flat.filter(x=>x==='l').length;if(nl>nk)w.push(t('lockNoKey'));if(nk>nl)w.push(t('keyNoLock'));
  if(E.sec&&E.sec.some(r=>r.includes('Y'))){const o=S.bau.find(x=>x.id===E.ortId),i=o?o.levels.findIndex(m=>m.id===E.id):-1;if(o&&!o.levels.some((m,k)=>k>i&&m.secret))w.push(t('portalNoGoal'))}
  $('eStat').innerHTML=`${W}×${H} · ${E.wrap?t('edgeOpen'):t('edgeClosed')}${E.par?` · Par ${E.par}`:''}${w.length?` · <span class="warn">${w.join(' · ')}</span>`:''}`}
function snap(){return{g:E.g.map(r=>r.slice()),mk:E.mk.map(r=>r.slice()),sec:E.sec.map(r=>r.slice()),wrap:E.wrap,under:{...E.under}}}
function restore(s){E.g=s.g;E.mk=s.mk;E.sec=s.sec;E.wrap=s.wrap;E.under=s.under}
function pushUndo(){E.undo.push(snap());if(E.undo.length>150)E.undo.shift();E.redo=[]}
function afterEdit(){E.par=null;edSave();edStat()}
function edUndo(){if(!E.undo.length)return;E.redo.push(snap());restore(E.undo.pop());edRefresh()}
function edRedo(){if(!E.redo.length)return;E.undo.push(snap());restore(E.redo.pop());edRefresh()}
function edRefresh(){edFit();edDraw();afterEdit();$('eWrap').classList.toggle('on',E.wrap)}
function setCell(r,c,t){const g=E.g,cur=g[r][c];if(cur===t)return false;if(E.sec&&E.sec[r][c]!=='.'&&!WALL.includes(t))E.sec[r][c]='.';
  if(t==='S'||t==='G'){for(let rr=0;rr<g.length;rr++)for(let cc=0;cc<g[0].length;cc++)if(g[rr][cc]===t)g[rr][cc]=E.under[t]||'.';
    E.under[t]=('SG'+TELE).includes(cur)?'.':cur;g[r][c]=t;return true}
  if(TELE.includes(t)){const list=[];g.forEach((row,rr)=>row.forEach((x,cc)=>{if(x===t)list.push([rr,cc])}));if(list.length>=2)g[list[0][0]][list[0][1]]='.'}
  g[r][c]=t;return true}
function flood(r,c,t){const g=E.g,from=g[r][c];if(from===t)return;const q=[[r,c]];g[r][c]=t;
  while(q.length){const[a,b]=q.pop();for(let d=0;d<4;d++){const na=a+DR[d],nb=b+DC[d];if(na>=0&&nb>=0&&na<g.length&&nb<g[0].length&&g[na][nb]===from){g[na][nb]=t;q.push([na,nb])}}}}
function cellAt(e){const r=$('eIn').getBoundingClientRect();const c=Math.floor((e.clientX-r.left)/ET),rr=Math.floor((e.clientY-r.top)/ET);if(rr<0||c<0||rr>=E.g.length||c>=E.g[0].length)return null;return[rr,c]}
function cellsBetween(a,b){const out=[];let[r0,c0]=a;const[r1,c1]=b;const dr=Math.abs(r1-r0),dc=Math.abs(c1-c0),sr=r0<r1?1:-1,sc=c0<c1?1:-1;let err=dc-dr;
  for(;;){out.push([r0,c0]);if(r0===r1&&c0===c1)break;const e2=2*err;if(e2>-dr){err-=dr;c0+=sc}if(e2<dc){err+=dc;r0+=sr}}return out}
(function(){const b=$('eBoard');let painting=false,last=null,before=null;
  b.addEventListener('pointerdown',e=>{if(!E)return;e.preventDefault();const cell=cellAt(e);if(!cell)return;if(E.fix){toast(t('fixFirst'));return}try{b.setPointerCapture(e.pointerId)}catch(_){}
    before=JSON.stringify(E.g)+JSON.stringify(E.mk)+JSON.stringify(E.sec);pushUndo();
    if(E.tool==='J'||E.tool==='Y'){const[r,c]=cell;if(!WALL.includes(E.g[r][c])){E.undo.pop();dialog(t('onlyWall'));return}
      if(E.sec[r][c]===E.tool)E.sec[r][c]='.';else{if(E.tool==='Y')E.sec.forEach(row=>row.forEach((v,cc,ar)=>{if(v==='Y')ar[cc]='.'}));E.sec[r][c]=E.tool;if(E.tool==='Y')portalInfo()}edDraw();afterEdit();return}
    if(E.tool==='z'){painting=true;last=cell;b._mv=!E.mk[cell[0]][cell[1]];E.mk[cell[0]][cell[1]]=b._mv;edDraw();return}snd('place');S.palUse=S.palUse||{};S.palUse[E.tool]=Date.now();if(palOpen)togglePal(false);
    if(E.mode==='fill'&&!('SG'+TELE).includes(E.tool)){flood(cell[0],cell[1],E.tool);edDraw();end();return}
    painting=true;last=cell;setCell(cell[0],cell[1],E.tool);edDraw()});
  b.addEventListener('pointermove',e=>{if(!painting)return;const cell=cellAt(e);if(!cell||(cell[0]===last[0]&&cell[1]===last[1]))return;
    const pts=('SG'.includes(E.tool))?[cell]:cellsBetween(last,cell);let ch=false;
    if(E.tool==='z'){pts.forEach(p=>{if(E.mk[p[0]][p[1]]!==b._mv){E.mk[p[0]][p[1]]=b._mv;ch=true}});last=cell;if(ch)edDraw();return}
    pts.forEach(p=>{ch=setCell(p[0],p[1],E.tool)||ch});last=cell;if(ch)edDraw()});
  function end(){painting=false;if(before===JSON.stringify(E.g)+JSON.stringify(E.mk)+JSON.stringify(E.sec))E.undo.pop();else afterEdit()}
  b.addEventListener('pointerup',()=>{if(painting)end()});b.addEventListener('pointercancel',()=>{if(painting)end()})})();
function edModeBtn(){$('eMode').innerHTML=E.mode==='pen'?`✏️<small>${t('pen')}</small>`:`🪣<small>${t('fill')}</small>`}
function resize(side,d){resizeGrid(E.mk,side,d,false);resizeGrid(E.sec,side,d,'.');resizeGrid(E.g,side,d,'.')}
function resizeGrid(g,side,d,fill){const H=g.length,W=g[0].length;
  if(side==='top'||side==='bottom'){if(d>0){if(H>=24)return;const row=Array(W).fill(fill);side==='top'?g.unshift(row):g.push(row)}else{if(H<=3)return;side==='top'?g.shift():g.pop()}}
  else{if(d>0){if(W>=24)return;g.forEach(row=>side==='left'?row.unshift(fill):row.push(fill))}else{if(W<=3)return;g.forEach(row=>side==='left'?row.shift():row.pop())}}}
function sizeDlg(){const sides=['top','bottom','left','right'].map(k=>[k,t(k)]);
  dialog(`<div class="dt">${t('sizeTitle')} <span id="szV"></span></div><div class="szg">${sides.map(([s,n])=>`<span>${n}</span><button class="pbtn sm" data-s="${s}" data-d="-1">${t('minusRow')}</button><button class="pbtn sm" data-s="${s}" data-d="1">${t('plusRow')}</button>`).join('')}</div>
  <div class="row"><button class="pbtn sm" id="szB">${t('borderBtn')}</button><button class="pbtn sm" id="szC">${t('allIce')}</button></div>`,[{t:t('done'),cls:'gold'}],'sheet');
  const upd=()=>{$('szV').textContent=`${E.g[0].length}×${E.g.length}`};upd();
  document.querySelectorAll('.szg button').forEach(b=>b.onclick=()=>{pushUndo();resize(b.dataset.s,+b.dataset.d);edRefresh();upd();snd('ui')});
  $('szB').onclick=()=>{pushUndo();const g=E.g,H=g.length,W=g[0].length;for(let r=0;r<H;r++)for(let c=0;c<W;c++)if((r===0||c===0||r===H-1||c===W-1)&&!'SG'.includes(g[r][c]))g[r][c]='#';edRefresh()};
  $('szC').onclick=()=>{pushUndo();E.g=E.g.map(r=>r.map(x=>'SG'.includes(x)?x:'.'));edRefresh()}}
function edErrors(){const f=E.g.flat(),e=[];if(!f.includes('S'))e.push(t('errStart'));if(!f.includes('G'))e.push(t('errGoal'));return e}
// Geheimnisse müssen mit Anlauf (≥1 Feld rutschen) und beliebig oft erreichbar sein
function secretIssues(L){if(!L.sec)return[];const P=prep(L),need=[];L.sec.forEach((row,r)=>[...row].forEach((v,c)=>{if(v!=='.')need.push([r,c])}));if(!need.length)return[];
  const st0=initState(P),ids=new Map([[skey(st0),0]]),SS=[st0],adj=[[]],launch=need.map(()=>[]);let qi=0;
  while(qi<SS.length&&qi<60000){const st=SS[qi];for(let d=0;d<4;d++){const s2=step(P,st,d);if(s2.res!=='move')continue;const k=skey(s2.st);let id=ids.get(k);if(id==null){id=SS.length;ids.set(k,id);SS.push(s2.st);adj.push([])}adj[qi].push(id);
    if(s2.path.length>1&&!s2.cube&&P.g[s2.st.r][s2.st.c]!=='_'){const nn=nxt(P,s2.st.r,s2.st.c,s2.path[s2.path.length-1].d);if(nn)need.forEach((x,j)=>{if(x[0]===nn[0]&&x[1]===nn[1])launch[j].push([qi,id])})}}qi++}
  const reach=(from,T)=>{const seen=new Set([from]),q=[from];while(q.length){const a=q.pop();if(T.has(a))return true;for(const b of adj[a]||[])if(!seen.has(b)){seen.add(b);q.push(b)}}return false};
  return need.filter((x,j)=>{const l=launch[j],fr=new Set(l.map(e=>e[0]));return!l.some(([a,h])=>reach(h,fr))})}
function edCheck(){const er=edErrors();if(er.length){dialog(er.join('<br>'));return}
  dialog(t('checkingPaths'),[]);setTimeout(()=>{const s=solve(prep(edLevel()),null,400000);
    if(s.capped)dialog(t('tooBig'));
    else if(!s.path){E.par=0;edSave();edStat();dialog(t('notSolvableDlg'),[{t:t('ok')},{t:'🪄 '+t('fixBtn'),cls:'gold',fn:fixSearch}])}
    else{E.par=s.path.length;edSave();edStat();const si=secretIssues(edLevel());dialog(`<b>${t('solvableIn',{n:E.par})}</b><div class="sol">${s.path.map(d=>ARW[d]).join(' ')}</div>${si.length?`<div class="warn" style="margin-top:8px">⚠ ${t('secNoRun',{n:si.length})}</div>`:''}`,[{t:t('ok')},{t:t('showSolution'),cls:'gold',fn:()=>edTest(s.path)}])}},40)}
function edTest(auto){const er=edErrors();if(er.length){dialog(er.join('<br>'));return}play({...edLevel(),secret:!!(edEntry()||{}).secret},{mode:'test',title:E.name});if(auto){G.auto=auto.slice();setTimeout(autoNext,600)}}
async function copyText(txt){try{await navigator.clipboard.writeText(txt);return true}catch(e){}
  try{const ta=document.createElement('textarea');ta.value=txt;ta.style.cssText='position:fixed;top:0;left:0;opacity:0;font-size:16px';document.body.appendChild(ta);ta.focus();ta.setSelectionRange(0,txt.length);const ok=document.execCommand('copy');ta.remove();return ok}catch(e){return false}}
const findCode=(v,pre)=>{const m=String(v).replace(/\s/g,'').match(new RegExp(pre+'[A-Za-z0-9+/=]+'));return m?m[0]:''};
// Orte & Welten als Code exportieren / importieren
const b64e=o=>btoa(unescape(encodeURIComponent(JSON.stringify(o)))),b64d=s=>JSON.parse(decodeURIComponent(escape(atob(s))));
const packLv=m=>Object.assign({n:m.name,m:m.map.join('/'),x:m.wrap?1:0},m.sec?{s:m.sec.join('/')}:{},m.secret?{h:1}:{});
function unpackLv(o){const map=String(o.m).split('/');const W=map[0].length;if(map.length<3||map.length>24||W<3||W>24)throw 0;if(!map.every(r=>r.length===W&&[...r].every(ch=>VALID.includes(ch))))throw 0;const sec=o.s?String(o.s).split('/'):undefined;return{id:uid(),name:String(o.n||'Level').slice(0,40),map,wrap:!!o.x,par:null,sec:sec&&sec.length===map.length?sec:undefined,secret:!!o.h}}
const ortCode=o=>'EISO1:'+b64e({n:o.name,l:o.levels.map(packLv)});
function worldCode(w){return'EISW1:'+b64e({n:w.name,p:w.places.map(p=>({n:p.name,l:p.levels.map(packLv)}))})}
function codeDlg(title,code){dialog(`<div class="dt">${title}</div>${t('codeTxt')}<textarea id="shc" readonly>${code}</textarea>`,
  [{t:t('close')},{t:t('copy'),cls:'gold',keep:true,fn:async b=>{if(await copyText(code))b.textContent=t('copied');else{const x=$('shc');x.focus();x.setSelectionRange(0,x.value.length);b.textContent=t('marked')}}}])}
function importAny(){dialog(`<div class="dt">${t('importAnyT')}</div>${t('importAnyTxt')}<textarea id="imc" placeholder="EISW1:… / EISO1:…"></textarea>`,[{t:t('cancel')},{t:t('importBtn'),cls:'gold',keep:true,fn:()=>{
  const raw=$('imc').value,c=findCode(raw,'EISW1:')||findCode(raw,'EISO1:')||findCode(raw,'EIS1:');try{
    if(c.startsWith('EISO1:')){const o=b64d(c.slice(6));S.bau.unshift({id:uid(),name:String(o.n||'Ort').slice(0,30),levels:o.l.map(unpackLv)})}
    else if(c.startsWith('EISW1:')){const o=b64d(c.slice(6));const w={id:'u'+uid(),name:String(o.n||'Welt').slice(0,30),places:[]};
      o.p.forEach(p=>{const ort={id:uid(),name:String(p.n||'Ort').slice(0,30),levels:p.l.map(unpackLv)};ort.levels.forEach(m=>{m.par=solve(prep({map:m.map,wrap:m.wrap}),null,300000).path?.length??null});
        S.bau.unshift(ort);w.places.push({id:'p'+ort.id,name:ort.name,levels:ort.levels.map(m=>({name:m.name,map:m.map.slice(),wrap:m.wrap,par:m.par}))})});S.worlds.push(w)}
    else if(c.startsWith('EIS1:')){const m=decode(c);if(!m)throw 0;S.bau.unshift({id:uid(),name:m.name,levels:[m]})}
    else throw 0}catch(e){$('imc').classList.add('bad');return}
  persist();closeDlg();buildBau()}}])}

// Teilen per Code
function encode(m){return'EIS1:'+btoa(unescape(encodeURIComponent(JSON.stringify({n:m.name,m:m.map.join('/'),x:m.wrap?1:0}))))}
function decode(code){try{code=findCode(code,'EIS1:');if(!code)return null;const o=JSON.parse(decodeURIComponent(escape(atob(code.slice(5)))));
  const map=String(o.m).split('/');const W=map[0].length;if(map.length<3||map.length>24||W<3||W>24)return null;
  if(!map.every(r=>r.length===W&&[...r].every(ch=>VALID.includes(ch))))return null;return{id:uid(),name:String(o.n||'Import').slice(0,40),map,wrap:!!o.x,par:null}}catch(e){return null}}
function shareDlg(m,canClip){const code=encode(m);dialog(`<div class="dt">${t('shareTitle')}</div>${t('shareTxt')}<textarea id="shc">${code}</textarea>`,
  [{t:t('close')},...(canClip?[{t:t('copyInApp'),fn:()=>{S.clip={name:m.name,map:m.map.slice(),wrap:!!m.wrap};persist();buildOrt();dialog(t('lvCopied'))}}]:[]),{t:t('copy'),cls:'gold',keep:true,fn:async b=>{if(await copyText(code))b.textContent=t('copied');else{const x=$('shc');x.focus();x.setSelectionRange(0,x.value.length);b.textContent=t('marked')}}}])}
function importDlg(){dialog(`<div class="dt">${t('importTitle')}</div>${t('importTxt')}<textarea id="imc" placeholder="EIS1:…"></textarea>`,[{t:t('cancel')},{t:t('importBtn'),cls:'gold',keep:true,fn:()=>{
  const m=decode($('imc').value);if(!m){$('imc').classList.add('bad');return}curOrt().levels.push(m);persist();closeDlg();buildOrt()}}])}

// ---- Einstellungen ----
function buildSettings(){const l=$('langs');l.innerHTML='';
  LANGS.forEach(([c,f,n])=>{const b=document.createElement('button');b.className='langb'+(c===LANG?' on':'');b.innerHTML=`<span class="flag">${f}</span><span>${n}</span>${c===LANG?'<span class="chk2">✓</span>':''}`;
    b.onclick=()=>{LANG=c;S.lang=c;persist();applyLang();buildSettings();snd('ui')};l.appendChild(b)});
  $('sAuto').classList.toggle('on',!!S.autoUpdate);$('sAuto').setAttribute('aria-checked',S.autoUpdate?'true':'false');
  $('sCodes').classList.toggle('on',CODES_ON);$('sCodeMsg').textContent='';$('sCodeIn').value='';buildBak();$('sVer').textContent=APP_VERSION;$('sDate').textContent=new Date(APP_DATE+'T12:00:00').toLocaleDateString(LANG==='en'?'en-GB':LANG==='tr'?'tr-TR':'de-DE',{day:'2-digit',month:'long',year:'numeric'});
  $('sMade').innerHTML=`<span>${t('madeBy',{k:'<button class="kerem" id="kerem">Kerem</button>'})}</span>`;$('kerem').onclick=keremAnim;
  const h=I18N[LANG].hist||I18N.de.hist;$('sHist').innerHTML=VHIST.map((v,i)=>({v,txt:h[i]})).reverse().map(x=>`<div class="hv"><b>${x.v}</b><span>${x.txt}</span></div>`).join('')}
// Update-Prüfung: lädt die eigene Seite neu vom Server und vergleicht die Versionsnummer
const vnum=v=>v.split('.').map(Number).reduce((a,x)=>a*1000+x,0);
function checkUpdate(manual){const st=$('sUpd');if(manual){st.textContent=t('searching');st.className='sstat'}
  fetch(location.href.split('#')[0],{cache:'no-store'}).then(r=>r.text()).then(txt=>{const m=txt.match(/APP_VERSION='([\d.]+)'/);if(!m)throw 0;const v=m[1];
    if(vnum(v)>vnum(APP_VERSION)){if(!manual&&S.autoUpdate&&!G){location.reload();return}
      if(manual){st.innerHTML=`${t('newVer',{v})} <button class="pbtn sm gold" id="sLoad">${t('loadNow')}</button>`;$('sLoad').onclick=()=>location.reload()}}
    else if(manual){st.textContent=t('upToDate',{v:APP_VERSION});st.className='sstat ok'}})
  .catch(()=>{if(manual){st.innerHTML=`${t('checkFail')} <button class="pbtn sm" id="sLoad">${t('reload')}</button>`;$('sLoad').onclick=()=>location.reload()}})}
// Speicherstand zurücksetzen – Bestätigen erst nach Countdown möglich
function resetDlg(){let n=5;dialog(t('resetDlg'),[{t:t('cancel')},{t:t('resetConfirm',{n}),cls:'red',fn:()=>{if(n>0)return;
    try{localStorage.removeItem('eisrutsche2');localStorage.removeItem('eisrutsche')}catch(e){}
    const keep={lang:S.lang,mute:S.mute,autoUpdate:S.autoUpdate};S={stars:{},bau:[],worlds:[],intro:true,tokens:START_TOKENS,...keep};seedBau();persist();home();setTimeout(()=>dialog(t('resetDone')),200)}}]);
  const b=$('dlgBtns').lastChild;b.disabled=true;b.classList.add('wait');
  const tick=setInterval(()=>{n--;if(!b.isConnected){clearInterval(tick);return}b.textContent=t('resetConfirm',{n});if(n<=0){clearInterval(tick);b.disabled=false;b.classList.remove('wait')}},1000);
  b.onclick=()=>{if(n>0)return;closeDlg();clearInterval(tick);b._fn()};b._fn=()=>{backup('rReset');try{localStorage.removeItem('eisrutsche2');localStorage.removeItem('eisrutsche')}catch(e){}
    const keep={lang:S.lang,mute:S.mute,autoUpdate:S.autoUpdate};S={stars:{},bau:[],worlds:[],intro:true,tokens:START_TOKENS,...keep};seedBau();persist();home();setTimeout(()=>dialog(t('resetDone')),200)}}
// Codes einlösen
const CODES={H6y7sDp52f:'tok',iB295gLUag:'suit',p0k3m0n:'egg',r3g3nb0g3n:'rainbow',schn33fall:'snow',alles0ffen:'open'};
let CODES_ON=false,EGG_NEXT=false,EGG_ON=false;
function redeem(){const v=$('sCodeIn').value.trim(),k=CODES[v],m=$('sCodeMsg');m.className='sstat';
  if(!k){m.textContent=t('codeBad');m.classList.add('bad');const i=$('sCodeIn');i.classList.remove('shake');void i.offsetWidth;i.classList.add('shake');snd('bump');return}
  if(k==='tok'){S.tokens+=100;m.textContent=t('codeTok')}
  else if(k==='suit'){const on=S.shop.suit!=='gold';S.shop.own['suit.gold']=1;S.shop.suit=on?'gold':'blue';applyLook();m.textContent=on?t('codeSuitOn'):t('codeSuitOff')}
  else if(k==='egg'){EGG_NEXT=true;m.textContent=t('codeEggOn')}
  else if(k==='rainbow'){S.rainbow=!S.rainbow;m.textContent=S.rainbow?t('codeRainOn'):t('codeRainOff')}
  else if(k==='snow'){S.snow=!S.snow;m.textContent=S.snow?t('codeSnowOn'):t('codeSnowOff')}
  else if(k==='open'){S.allOpen=!S.allOpen;m.textContent=S.allOpen?t('codeOpenOn'):t('codeOpenOff')}
  m.classList.add('ok');$('sCodeIn').value='';persist();snd('item')}
// Backup-Code (kompletter Spielstand) und Wiederherstellen
function loadState(json){const o=JSON.parse(json);if(!o||typeof o!=='object'||!Array.isArray(o.bau))throw 0;S=o;persist();applyLook();LANG=S.lang||LANG;applyLang();home();setTimeout(()=>dialog(t('bakDone')),200)}
function bakExport(){codeDlg(t('bakCodeTitle'),'EISB1:'+b64e(S))}
function bakImport(){dialog(`<div class="dt">${t('bakImport')}</div>${t('bakImportTxt')}<textarea id="imc" placeholder="EISB1:…"></textarea>`,[{t:t('cancel')},{t:t('bakImport'),cls:'gold',keep:true,fn:()=>{
  const c=findCode($('imc').value,'EISB1:');try{if(!c)throw 0;const o=b64d(c.slice(6));if(!o||!Array.isArray(o.bau))throw 0;backup('rImport');closeDlg();loadState(JSON.stringify(o))}catch(e){$('imc').classList.add('bad')}}}])}
function buildBak(){const l=$('sBakList'),b=backups();l.innerHTML=b.length?'':`<small class="ssub">${t('bakNone')}</small>`;
  b.forEach((x,i)=>{const row=document.createElement('div');row.className='kv bakrow';const d=new Date(x.t);
    row.innerHTML=`<span>${d.toLocaleDateString(LANG==='en'?'en-GB':LANG==='tr'?'tr-TR':'de-DE')} ${d.toLocaleTimeString(LANG==='en'?'en-GB':LANG==='tr'?'tr-TR':'de-DE',{hour:'2-digit',minute:'2-digit'})}<br><small>${t(x.r)}</small></span>`;
    const btn=document.createElement('button');btn.className='pbtn sm';btn.textContent=t('bakRestore');btn.onclick=()=>{if(btn.dataset.sure){const keep=backups()[i];backup('rRestore');loadState(keep.d)}else{btn.dataset.sure=1;btn.textContent=t('sure');btn.classList.add('red');setTimeout(()=>{if(btn.isConnected){delete btn.dataset.sure;btn.textContent=t('bakRestore');btn.classList.remove('red')}},2500)}};
    row.appendChild(btn);l.appendChild(row)})}
// Kleine Animation beim Tippen auf „Kerem“
let keremN=0,keremT=null;
function keremAnim(){keremN++;clearTimeout(keremT);keremT=setTimeout(()=>keremN=0,2500);if(keremN>=14&&!CODES_ON){CODES_ON=true;$('sCodes').classList.add('on','reveal')}
  const k=$('kerem');k.classList.remove('wow');void k.offsetWidth;k.classList.add('wow');
  const r=k.getBoundingClientRect(),em=['❤️','💙','❄️','✨','💎','❤️','⭐'];
  for(let i=0;i<26;i++){const p=document.createElement('span');p.className='burst';p.textContent=em[i%em.length];
    const a=Math.random()*Math.PI*2,d=60+Math.random()*110;p.style.left=(r.left+r.width/2)+'px';p.style.top=(r.top+r.height/2)+'px';
    p.style.setProperty('--dx',Math.cos(a)*d+'px');p.style.setProperty('--dy',(Math.sin(a)*d-70)+'px');p.style.setProperty('--rot',(Math.random()*360-180)+'deg');p.style.animationDelay=(Math.random()*.15)+'s';
    document.body.appendChild(p);setTimeout(()=>p.remove(),1700)}
  if(!S.mute)[[659,.08],[784,.08],[988,.08],[1319,.16],[1047,.2]].reduce((tt,[f,d])=>{try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.06,AC.currentTime+tt);g.gain.exponentialRampToValueAtTime(.001,AC.currentTime+tt+d);o.connect(g).connect(AC.destination);o.start(AC.currentTime+tt);o.stop(AC.currentTime+tt+d+.02)}catch(e){}return tt+d},0)}

// ---- Easter Egg: 7× schnell aufs Logo tippen → Schneesturm + goldene Mütze (an/aus) ----
let eggTaps=0,eggTimer=null;
function logoTap(){const l=$('hLogo');l.classList.remove('tap');void l.offsetWidth;l.classList.add('tap');eggTaps++;snd('place');
  clearTimeout(eggTimer);eggTimer=setTimeout(()=>eggTaps=0,1500);if(eggTaps>=7){eggTaps=0;easterEgg()}}
function easterEgg(){S.golden=!S.golden;persist();applyLook();$('ePal').innerHTML='';$('hLogo').classList.toggle('gold',!!S.golden);
  const f=document.createElement('div');f.className='flash';document.body.appendChild(f);setTimeout(()=>f.remove(),700);
  const fl=['❄','❅','❆','✦','✧'];for(let i=0;i<60;i++){const p=document.createElement('span');p.className='snow';p.textContent=S.golden&&i%5===0?'★':fl[i%fl.length];
    p.style.left=Math.random()*100+'vw';p.style.fontSize=(10+Math.random()*16)+'px';p.style.setProperty('--dx',(Math.random()*160-40)+'px');p.style.setProperty('--r',(Math.random()*540)+'deg');
    if(S.golden&&i%5===0)p.style.color='#f8d030';p.style.animationDuration=(1.6+Math.random()*1.8)+'s';p.style.animationDelay=(Math.random()*.9)+'s';document.body.appendChild(p);setTimeout(()=>p.remove(),4600)}
  if(!S.mute){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();[523,659,784,1047,1319,1568].forEach((fq,i)=>{const o=AC.createOscillator(),g=AC.createGain(),tt=AC.currentTime+i*.09;o.type='square';o.frequency.value=fq;g.gain.setValueAtTime(.05,tt);g.gain.exponentialRampToValueAtTime(.001,tt+.18);o.connect(g).connect(AC.destination);o.start(tt);o.stop(tt+.2)})}catch(e){}}
  if(HM){hFace(HM.dir)}setTimeout(()=>dialog(`<div class="dt">${S.golden?'✨ '+t('eggOn'):t('eggOff')}</div>${S.golden?t('eggOnTxt'):''}`,[{t:t('ok')}],'center'),900)}

function portal(){HM.busy=true;EGG_ON=false;snd('tele');const f=document.createElement('div');f.className='portalfx';document.body.appendChild(f);
  setTimeout(()=>{home(true);snd('win')},650);setTimeout(()=>f.remove(),1400)}
function secretBox(){const rows=[['H6y7sDp52f','c1'],['iB295gLUag','c2'],['p0k3m0n','c3'],['r3g3nb0g3n','c4'],['schn33fall','c5'],['alles0ffen','c6']];
  return`<div class="sbox secretcodes"><div class="sh"><span class="si">✦</span><span>${t('secretCodes')}</span></div>${rows.map(([c,k])=>`<div class="kv"><span>${t(k)}</span><b class="code">${c}</b></div>`).join('')}</div>`}

// ---- Juwelen-Übersicht ----
function gemTotals(){let tot=0,found=0,pt=0,pf=0;const per=[];allWorlds().forEach(w=>w.places.forEach(p=>{let a=0,b=0,c=0,d=0;p.levels.forEach((l,i)=>{if(l.sec)l.sec.forEach((row,r)=>[...row].forEach((v,cc)=>{if(v==='J'){a++;if(S.gems[p.id+'-'+i+'-'+r+','+cc])b++}if(v==='Y'){c++;const si=secretAfter(p.levels,i);if(si>=0&&S.portals[p.id+'-'+si])d++}}))});
  tot+=a;found+=b;pt+=c;pf+=d;if(a||c)per.push([w.name,p.name,b,a,d,c])}));return{tot,found,pt,pf,per}}
function buildGemBtn(){const g=gemTotals();$('hGems').innerHTML=`<img class="coin" src="${GEM_URL}" alt=""> ${g.found}`}
function gemsDlg(){const g=gemTotals();dialog(`<div class="dt"><img class="coin" src="${GEM_URL}" alt=""> ${t('gemsT')}</div>${t('gemsTxt')}<div class="kv" style="margin:10px 0"><span>${t('gemsT')}</span><b>${g.found}/${g.tot}</b></div><div class="kv"><span>✦ ${t('portalsT')}</span><b>${g.pf}/${g.pt}</b></div>
  ${g.per.map(x=>`<div class="kv gemrow"><span>${esc(x[0])} · ${esc(x[1])}</span><b>${x[2]}/${x[3]} · ✦${x[4]}/${x[5]}</b></div>`).join('')}`,[{t:t('ok')}])}
// ---- Erfolge ----
const n3=()=>Object.values(S.stars).filter(v=>v===3).length;
const ACH=[['win1','wins',1,2],['win10','wins',10,3],['win50','wins',50,8],['star1',n3,1,2],['star20',n3,20,6],['clean',()=>allWorlds().some(w=>w.places.some(p=>p.levels.every((_,i)=>S.clean[p.id+'-'+i])))?1:0,1,5],
  ['trap10','traps',10,2],['fall10','falls',10,2],['cry25','crystals',25,3],['fill5','fills',5,3],['key1','unlocks',1,2],['build1','builds',1,2],['pub1','pubs',1,5],['shop1','buys',1,2],['ghost1','ghosts',1,1],['move500','moves',500,4],
  ['solved10',()=>Object.values(S.stars).filter(v=>v>0).length,10,3],['solved50',()=>Object.values(S.stars).filter(v=>v>0).length,50,8],['solved100',()=>Object.values(S.stars).filter(v=>v>0).length,100,15],
  ['perfect10',n3,10,4],['perfect50',n3,50,12],['gem1','gems',1,3],['gem5','gems',5,6],['gem15','gems',15,15],['portal1','portals',1,4],['portal3','portals',3,10],['spike10','spikes',10,2]];
const achVal=a=>typeof a[1]==='function'?a[1]():(S.stats[a[1]]||0);
function stat(k,n){S.stats[k]=(S.stats[k]||0)+(n||1);checkAch()}
function checkAch(){let got=false;ACH.forEach(a=>{if(!S.ach[a[0]]&&achVal(a)>=a[2]){S.ach[a[0]]=Date.now();S.tokens+=a[3];got=true;toast(`🏆 ${t('a_'+a[0])} · +${a[3]} ${coin()}`);snd('ach')}});persist();if(got&&G)hintLabel()}
function toast(html){const d=document.createElement('div');d.className='toast';d.innerHTML=html;$('toasts').appendChild(d);setTimeout(()=>d.classList.add('out'),2600);setTimeout(()=>d.remove(),3200)}
function buildAch(){const l=$('aList');l.innerHTML='';const done=ACH.filter(a=>S.ach[a[0]]).length;$('aSum').textContent=`${done}/${ACH.length}`;
  ACH.forEach(a=>{const ok=!!S.ach[a[0]],v=Math.min(achVal(a),a[2]),row=document.createElement('div');row.className='arow'+(ok?' ok':'');
    row.innerHTML=`<div class="aic">${ok?'🏆':'🔒'}</div><div class="atx"><b>${t('a_'+a[0])}</b><small>${t('ad_'+a[0])}</small>${!ok&&a[2]>1?`<div class="bar2"><i style="width:${v/a[2]*100}%"></i></div><small>${v}/${a[2]}</small>`:''}</div><div class="arw">+${a[3]} ${coin()}</div>`;l.appendChild(row)})}
// ---- Shop ----
const SHOP={hat:[['beanie',0],['headband',4],['cap',6],['party',8],['tophat',10],['flowers',10],['cowboy',12],['santa',12],['bear',15],['wizard',18],['helmet',20],['crown',25]],face:[['none',0],['mustache',4],['goatee',4],['scarf',5],['glasses',6],['bigglasses',6],['eyepatch',6],['beard',7]],eyes:[['black',0],['blue',4],['green',4],['red',4],['yellow',4]],suit:[['blue',0],['green',5],['purple',5],['red',6],['black',8],['tie',10],['doctor',10],['rainbow',20],['gold',40]],shoes:[['grey',0],['barefoot',2],['red',3],['yellow',3],['skates',12],['spikes',100]],hand:[['none',0],['snowball',3],['lolly',5],['balloon',6],['fish',6],['flag',8],['icicle',8],['wand',10]]};
let SHOP_TAB='hat',shopSpin=null;
function previewCfg(cat,id){const c={hat:S.shop.hat,face:S.shop.face,eyes:S.shop.eyes,suit:S.shop.suit,shoes:S.shop.shoes,hand:S.shop.hand,golden:!!S.golden};if(cat)c[cat]=id;return c}
function buildShop(){$('shTok').innerHTML=coin()+' '+S.tokens;document.querySelectorAll('.stab').forEach(b=>b.classList.toggle('on',b.dataset.tab===SHOP_TAB));
  const pv=$('shPrev'),px=pv.getContext('2d');let d=1;clearInterval(shopSpin);const drawP=()=>{px.clearRect(0,0,16,16);px.drawImage(makeSprite(previewCfg(),d),0,0)};drawP();shopSpin=setInterval(()=>{if(!$('shop').classList.contains('on')){clearInterval(shopSpin);return}d=[1,2,0,3][([1,2,0,3].indexOf(d)+1)%4];drawP()},900);
  const g=$('shGrid');g.innerHTML='';SHOP[SHOP_TAB].forEach(([id,price])=>{const key=SHOP_TAB+'.'+id,own=!!S.shop.own[key]||price===0,on=S.shop[SHOP_TAB]===id;
    const b=document.createElement('button');b.className='sitem'+(on?' on':'');const c=document.createElement('canvas');c.width=c.height=16;c.getContext('2d').drawImage(makeSprite(previewCfg(SHOP_TAB,id),SHOP_TAB==='hand'?3:1),0,0);
    b.appendChild(c);const lab=document.createElement('div');lab.className='sname';lab.textContent=t('it_'+SHOP_TAB+'_'+id);b.appendChild(lab);
    const pr=document.createElement('div');pr.className='sprice';pr.innerHTML=on?t('equipped'):own?t('equip'):`${coin()} ${price}`;b.appendChild(pr);
    b.onclick=()=>{if(own){S.shop[SHOP_TAB]=id;persist();applyLook();snd('ui');buildShop();if(SHOP_TAB==='shoes'&&id==='spikes')toast('👟 '+t('spikeInfo'));return}
      if(S.tokens<price){dialog(t('noCoins'));return}
      dialog(t('buyQ',{n:t('it_'+SHOP_TAB+'_'+id),p:price}),[{t:t('cancel')},{h:`${t('buy')} · ${price} ${coin()}`,cls:'gold',fn:()=>{S.tokens-=price;S.shop.own[key]=1;S.shop[SHOP_TAB]=id;stat('buys');persist();applyLook();snd('win');buildShop()}}])};g.appendChild(b)})}

// ---- Startbildschirm & Verdrahtung ----
const SPK='<svg viewBox="0 0 16 16" width="16" height="16" shape-rendering="crispEdges"><rect x="1" y="6" width="3" height="4" fill="#fff"/><rect x="4" y="5" width="1" height="6" fill="#fff"/><rect x="5" y="4" width="1" height="8" fill="#fff"/><rect x="6" y="3" width="1" height="10" fill="#fff"/><rect x="7" y="2" width="1" height="12" fill="#fff"/>',
  MIC=SPK+'<rect x="9" y="6" width="1" height="4" fill="#bde5f6"/><rect x="11" y="4" width="1" height="2" fill="#bde5f6"/><rect x="12" y="6" width="1" height="4" fill="#bde5f6"/><rect x="11" y="10" width="1" height="2" fill="#bde5f6"/><rect x="13" y="3" width="1" height="2" fill="#bde5f6"/><rect x="14" y="5" width="1" height="6" fill="#bde5f6"/><rect x="13" y="11" width="1" height="2" fill="#bde5f6"/></svg>',
  MIC_OFF=SPK+'<g fill="#ff6a6a"><rect x="9" y="5" width="2" height="2"/><rect x="13" y="5" width="2" height="2"/><rect x="11" y="7" width="2" height="2"/><rect x="9" y="9" width="2" height="2"/><rect x="13" y="9" width="2" height="2"/></g></svg>';
function home(secret){G=null;SECRET=!!secret;EGG_ON=!SECRET&&EGG_NEXT;EGG_NEXT=false;$('home').classList.toggle('secret',SECRET);mystSparks($('hBoard'),SECRET);buildGemBtn();$('hSecret').innerHTML=SECRET?secretBox():'';$('hLogo').classList.toggle('gold',!!S.golden);$('mute').innerHTML=S.mute?MIC_OFF:MIC;$('mute').setAttribute('aria-label',S.mute?t('soundOff'):t('soundOn'));show('home');requestAnimationFrame(()=>homeInit())}
// Titelbild: kleine Spielwiese – die Figur wird selbst gesteuert (Wischen über das Bild oder Pfeiltasten)
const HOME_MAP={map:['K#.#.#K','_.....k','.......','#k.S.K#'],wrap:true},HOME_EGG={map:['K#.#.#K','_....*k','.......','#k.S.K#'],wrap:true},HOME_SECRET={map:['K.A..#K','O_.<v.k','*..>..*','#k.S.A#'],wrap:true};
let SECRET=false;
let HM=null;
function homeInit(){const P=prep(SECRET?HOME_SECRET:EGG_ON?HOME_EGG:HOME_MAP),W=P.W,H=P.H,area=$('hArt').getBoundingClientRect(),tz=Math.max(16,Math.floor(Math.min((area.width-4)/(W+(ML+MR)/16),52)));
  document.querySelectorAll('#hIn .sprint').forEach(e=>e.remove());HM={prints:[],P,st:initState(P),t:tz,tok:(HM?HM.tok:0)+1,busy:false,trapped:false,dir:1};
  layBoard($('hBoard'),$('hCv'),$('hIn'),W,H,tz);$('hFg').style.width=$('hCv').style.width;$('hFg').style.height=$('hCv').style.height;drawBoard($('hCv'),P.g,{P,st:HM.st,wrap:true,fg:$('hFg')});const pl=$('hPl');pl.style.width=pl.style.height=tz+'px';
  hFace(1);hPut(HM.st.r,HM.st.c,1);$('hMsg').textContent=SECRET?t('secretHint'):t('homeHint');$('hMsg').classList.remove('warn')}
function hFace(d){HM.dir=d;const x=$('hPl').getContext('2d');x.clearRect(0,0,16,16);x.drawImage(SPR[d],0,0)}
function hPut(r,c,sc){$('hPl').style.transform=`translate3d(${c*HM.t}px,${r*HM.t}px,0) scale(${sc??1})`}
function hSegs(p){const out=[];for(let i=1;i<p.length;i++){const a=p[i-1],q=p[i],d=q.d;
  if(q.tele||q.respawn){out.push({jump:[q.r,q.c],d});continue}
  if(q.wrap){out.push({a:[a.r,a.c],b:[a.r+DR[d],a.c+DC[d]],d,spin:q.spin});out.push({a:[q.r-DR[d],q.c-DC[d]],b:[q.r,q.c],d,spin:q.spin})}else out.push({a:[a.r,a.c],b:[q.r,q.c],d,spin:q.spin})}return out}
function hRun(segs,done,lin){const tok=HM.tok,n=segs.length,D=n*55+(lin?0:50);let t0=null,cur=-1;
  const fr=ts=>{if(!HM||HM.tok!==tok||!$('home').classList.contains('on'))return;if(t0===null)t0=ts;const u=Math.min(1,(ts-t0)/D);
    if(!n){done();return}const f=(lin?u:easeSlide(u))*n,j=Math.min(n-1,Math.floor(f)),k=f-j,s=segs[j];
    if(j!==cur){cur=j;if(!s.spin)hFace(s.d)}if(s.spin){const d=SPIN[Math.floor(ts/70)%4];if(d!==HM.dir)hFace(d)}
    if(s.jump)hPut(s.jump[0],s.jump[1]);else hPut(s.a[0]+(s.b[0]-s.a[0])*k,s.a[1]+(s.b[1]-s.a[1])*k);
    if(u>=1){done();return}requestAnimationFrame(fr)};requestAnimationFrame(fr)}
function homeMove(d){if(!HM)return;if(HM.trapped){homeInit();snd('ui');return}if(HM.busy)return;
  const walk=S.shop.shoes==='spikes',s=step(HM.P,HM.st,d,walk);hFace(d);
  // verstecktes Portal: im Felsen oben links – nur mit Spikes erreicht man das Feld darunter
  if(s.res==='none'){snd('bump');if(walk&&!SECRET&&EGG_ON&&HM.P.items.size&&HM.st.it.every(x=>x)&&HM.st.r===1&&HM.st.c===1&&d===0)portal();return}
  if(walk&&s.res==='move'&&s.path.length>1)spikePrint(HM.st.r,HM.st.c,d,$('hIn'),HM.t,HM.prints);
  HM.busy=true;snd('move');
  if(s.res==='loop'){HM.trapped=true;$('hMsg').textContent=t('trapped');$('hMsg').classList.add('warn');const cyc=hSegs(s.cyc),lap=()=>hRun(cyc,lap,true);hRun(hSegs(s.path),lap,true);return}
  const from=[HM.st.r,HM.st.c],gotIt=s.st.it.some(x=>x)&&!HM.st.it.some(x=>x);
  hRun(hSegs(s.path),()=>{HM.st=s.st;HM.busy=false;hPut(s.st.r,s.st.c);
    if(gotIt){snd('item');drawBoard($('hCv'),HM.P.g,{P:HM.P,st:HM.st,wrap:true,fg:$('hFg')})}
    // unsichtbares Portal: Kristall eingesammelt, dann vom oberen Steinfeld hinunter zum Felsen links unten
if(s.res==='win'||s.res==='fall'||s.res==='spike'){snd(s.res==='win'?'win':'fall');setTimeout(homeInit,500)}})}
(function(){const a=$('hArt');let sx=null,sy=null;
  a.addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY});
  a.addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx,dy=e.clientY-sy;sx=null;if(Math.max(Math.abs(dx),Math.abs(dy))<20){if(HM&&HM.trapped)homeMove(0);return}homeMove(Math.abs(dx)>Math.abs(dy)?(dx>0?3:2):(dy>0?1:0))});
  a.addEventListener('pointercancel',()=>sx=null)})();
$('hPlay').onclick=()=>{snd('ui');buildWorlds();show('worlds')};
$('hBuild').onclick=()=>{snd('ui');buildBau();show('bau')};
$('hHelp').onclick=()=>intro(0);
$('hShop').onclick=()=>{snd('ui');buildShop();show('shop')};$('shBack').onclick=()=>home();document.querySelectorAll('.stab').forEach(b=>b.onclick=()=>{SHOP_TAB=b.dataset.tab;snd('ui');buildShop()});
$('hGems').onclick=()=>{snd('ui');gemsDlg()};
$('hAch').onclick=()=>{snd('ui');buildAch();show('achv')};$('aBack').onclick=()=>home();
$('hLogo').onclick=logoTap;
$('hSet').onclick=()=>{snd('ui');buildSettings();show('settings')};$('sBack').onclick=()=>home();
$('mute').onclick=()=>{const was=S.mute;S.mute=false;snd(was?'item':'bump');S.mute=!was;persist();$('mute').innerHTML=S.mute?MIC_OFF:MIC;$('mute').setAttribute('aria-label',S.mute?t('soundOff'):t('soundOn'))};
$('wBack').onclick=()=>home();$('pBack').onclick=()=>{buildWorlds();show('worlds')};$('lBack').onclick=()=>{buildPlaces();show('places')};
$('gBack').onclick=gBack;$('gUndo').onclick=gUndo;$('gReset').onclick=()=>gReset(true);
$('death').addEventListener('pointerup',e=>{if(Date.now()-($('death')._t||0)<350)return;gReset()});$('gHint').onclick=gHint;
$('bBack').onclick=()=>home();$('bImp').onclick=importAny;$('oPaste').onclick=()=>{const o=curOrt();if(!o||!S.clip)return;o.levels.push({id:uid(),name:S.clip.name,map:S.clip.map.slice(),wrap:S.clip.wrap,par:null});persist();buildOrt();snd('place')};
$('oShare').onclick=()=>{const o=curOrt();if(o)codeDlg(t('exportOrt'),ortCode(o))};
$('sBakEx').onclick=bakExport;$('sBakIm').onclick=bakImport;$('sRedeem').onclick=redeem;$('sCodeIn').addEventListener('keydown',e=>{if(e.key==='Enter')redeem()});
$('sAuto').onclick=()=>{S.autoUpdate=!S.autoUpdate;persist();buildSettings();snd('ui')};$('sCheck').onclick=()=>checkUpdate(true);$('sReset').onclick=resetDlg;$('bNew').onclick=newOrt;
$('oBack').onclick=()=>{buildBau();show('bau')};$('oNew').onclick=edNew;$('oImp').onclick=importDlg;$('oPub').onclick=publishOrt;
$('oName').oninput=e=>{const o=curOrt();if(o){o.name=e.target.value.slice(0,30)||t('noName');syncPub(o);persist()}};
$('oDel').onclick=()=>twoTap($('oDel'),'',()=>{S.bau=S.bau.filter(o=>o.id!==ORT);persist();buildBau();show('bau')});
$('eBack').onclick=()=>{buildOrt();show('ort')};
$('eName').oninput=e=>{E.name=e.target.value.slice(0,40)||t('noName');edSave()};
$('eMode').onclick=()=>{E.mode=E.mode==='pen'?'fill':'pen';edModeBtn();snd('ui')};
(function(){const h=$('palHandle');let y0=null;h.addEventListener('pointerdown',e=>{y0=e.clientY});h.addEventListener('pointerup',e=>{if(y0===null)return;const dy=e.clientY-y0;y0=null;if(dy<-12)togglePal(true);else if(dy>12)togglePal(false);else togglePal()})})();
$('eUndo').onclick=edUndo;$('eRedo').onclick=edRedo;$('eSize').onclick=sizeDlg;
$('eWrap').onclick=()=>{pushUndo();E.wrap=!E.wrap;edRefresh();snd('ui')};
$('eCheck').onclick=edCheck;['bHelp','oHelp'].forEach(id=>{if($(id))$(id).onclick=buildHelp});$('eFixPrev').onclick=()=>fixStep(-1);$('eFixNext').onclick=()=>fixStep(1);$('eFixEye').onclick=()=>{E.fix.show=!E.fix.show;fixBar();fixMarks()};$('eFixTest').onclick=()=>{const F=E.fix.list[E.fix.i];play({...edLevel(),secret:!!(edEntry()||{}).secret,map:F.g.map(r=>r.join(''))},{mode:'test',title:E.name+' 🪄'})};$('eFixOk').onclick=fixApply;$('eFixNo').onclick=fixClose;$('eTest').onclick=()=>edTest();$('eShare').onclick=()=>{edSave();shareDlg(edEntry())};
$('dlg').addEventListener('click',e=>{if(e.target.id==='dlg'&&$('dlgBtns').children.length===1&&!$('dlgBox').classList.contains('center'))closeDlg()});
addEventListener('resize',()=>{if($('home').classList.contains('on'))homeInit();if($('game').classList.contains('on')&&G){gFit();gDraw()}if($('editor').classList.contains('on')&&E){palSize();edFit()}});
applyLook();applyLang();home();{const b=backups();if(!b.length||Date.now()-b[0].t>20*3600e3)backup('rDaily')}if(!S.intro)setTimeout(()=>intro(0),300);if(S.autoUpdate)setTimeout(()=>checkUpdate(false),2500);

// Kein Zoomen (Pinch, Doppeltippen, Strg+Mausrad)
['gesturestart','gesturechange','gestureend'].forEach(ev=>document.addEventListener(ev,e=>e.preventDefault(),{passive:false}));
document.addEventListener('touchmove',e=>{if(e.touches.length>1)e.preventDefault()},{passive:false});
let lastTouch=0;document.addEventListener('touchend',e=>{const n=Date.now();if(n-lastTouch<320&&!e.target.closest('input,textarea'))e.preventDefault();lastTouch=n},{passive:false});
addEventListener('wheel',e=>{if(e.ctrlKey)e.preventDefault()},{passive:false});
addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&['+','-','=','0'].includes(e.key))e.preventDefault()});
