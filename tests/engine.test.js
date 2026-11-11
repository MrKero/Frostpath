const fs=require('fs');const E=new Function(fs.readFileSync(''+require('path').join(__dirname,'../src/engine.js')+'','utf8')+';return{prep,step,initState,solve,pushCube,skey,nxt,generate}')();
const {prep,step,initState}=E;let fails=0,n=0;
function run(map,moves,check,name){n++;const P=prep({map});let st=initState(P),last;for(const d of moves){last=step(P,st,d);if(last.res==='move')st=last.st;else if(last.res!=='none')break}
  let ok;try{ok=check(st,last,P)}catch(e){ok=false;console.log(e)}if(!ok){fails++;console.log('FAIL',name,JSON.stringify(last&&{res:last.res,kind:last.kind}),st.r,st.c,'cb',st.cb,st.cb2,st.cb3)}}
const U=0,D=1,L=2,R=3;
// Block vor Kristall
run(['#######','S.o.*.#','#######'],[R],(s)=>s.cb[0]===10&&s.it[0]===0,'Block stoppt vor Kristall');
run(['#######','S.o.q.#','#######'],[R],(s)=>s.cb[0]===10,'Block stoppt vor Schlüssel');
run(['#######','S.O.*.#','#######'],[R],(s)=>s.cb2[0]===10,'großer Block stoppt vor Kristall');
run(['#######','S.4.*.#','#######'],[R],(s)=>(s.cb3[0]>>2)===10,'Stachelblock stoppt vor Kristall');
run(['#######','So*...#','#######'],[R],(s,l)=>l.res==='none','Block direkt vor Kristall: nicht schiebbar');
// Kristall eingesammelt -> Block darf drüber
run(['#######','S*o...#','#######'],[R,R],(s)=>s.it[0]===1,'Kristall einsammeln');
// Pfeil: Block bleibt nicht auf Pfeil liegen
run(['#######','S.o.>#.','#######'],[R],(s)=>s.cb[0]===10,'Block hält vor Pfeil (Pfeil zeigt in Wand)');
run(['########','S.o.v..#','####.###','####.###','########'],[R],(s)=>s.cb[0]===28,'Block folgt Pfeil nach unten');
// Teleporter
run(['########','S.o.A#.#','######A#','#......#','########'],[R],(s,l,P)=>{const t=P.g[Math.floor(s.cb[0]/8)][s.cb[0]%8];return!'A'.includes(t)},'Block liegt nicht auf Teleporter');
// Schloss
run(['#######','S.o.l.#','#######'],[R],(s)=>s.cb[0]===10,'Block stoppt vor Schloss');
run(['########','Sq.l.o.#','########'],[R],(s)=>s.lk[0]===1&&s.kh===0,'Schlüssel öffnet Schloss');
// Bröckelwand
run(['######','S..r.#','######'],[R],(s,l)=>s.rb[0]===1&&s.c===2,'Bröckelwand zerbröselt, Spieler stoppt davor');
run(['######','S..r.#','######'],[R,R],(s,l)=>l.res==='fall'&&l.kind==='spike','2. Stoß an Bröckelwand = Tod');
run(['######','So.r.#','######'],[R],(s)=>s.cb[0]===8&&s.rb[0]===0,'Block bricht Bröckelwand nicht');
// Stachelblock
run(['######','S.4..#','######'],[R],(s,l)=>l.res==='move','Stachelblock (Stachel rechts) schiebbar von links');
run(['######','S.3..#','######'],[R],(s,l)=>l.res==='fall'&&l.kind==='spike','Stachelblock (Stachel links) tötet');
run(['######','S.u..#','.....#','######'],[],()=>true,'dummy');
run(['#######','S.4.u.#','#######'],[R],(s)=>s.fl[0]===1&&s.cb3.length===0,'Stachelblock füllt flaches Loch');
run(['#######','S.O.u.#','#######'],[R],(s)=>s.fl[0]===2&&s.cb2.length===0,'großer Block -> Mauer im flachen Loch');
run(['#######','S.O.~.#','#######'],[R],(s)=>s.cb2.length===0,'großer Block im tiefen Loch weg');
// Risseis
run(['#######','S.o%..#','#######'],[R],(s)=>s.br[0]===1&&s.cb[0]===12,'Block bricht Risseis');
// Schmelzeis
run(['#######','S.....#','#.m...#','#######'],[R,L,R,L,R,L],(s,l)=>s.mv===6,'Schmelzeis zählt');
// Richtungsstacheln vs. Block
run(['#######','S.o.w.#','#######'],[R],(s)=>s.cb[0]===10,'Block stoppt vor Richtungsstachel');
// Ziel gesperrt bis alle Kristalle
run(['#######','S...G*#','#######'],[R],(s,l)=>l.res!=='win','Ziel braucht Kristalle');
// Spikes + Pfeil
function runW(map,moves,check,name){n++;const P=prep({map});let st=initState(P),last;for(const d of moves){last=step(P,st,d,true);if(last.res==='move')st=last.st;else break}if(!check(st,last)){fails++;console.log('FAIL',name,st.r,st.c,last&&last.res)}}
runW(['S>....'],[R],(s)=>s.c===2,'Spikes: Pfeil schiebt genau 1 Feld');
runW(['Sv....','......','......'],[R],(s)=>s.r===1&&s.c===1,'Spikes: Pfeil nach unten 1 Feld');
runW(['S>>...'],[R],(s)=>s.c===3,'Spikes: Pfeilkette schiebt weiter bis Eis');
runW(['S>>>#.'],[R],(s)=>s.c===3,'Spikes: Pfeilkette bis Wand');
runW(['S>v...','..>...','......'],[R],(s)=>s.r===1&&s.c===3,'Spikes: Pfeilkette mit Richtungswechsel');
runW(['S><...'],[R],(s,l)=>l.res==='loop','Spikes: Pfeile im Kreis = gefangen');
runW(['S>#...'],[R],(s)=>s.c===1,'Spikes: Pfeil gegen Wand – bleibt auf Pfeil');
runW(['S>x...'],[R],(s,l)=>l.res==='fall','Spikes: Pfeil in Stacheln');
runW(['S.....'],[R],(s)=>s.c===1,'Spikes: normaler Schritt');
console.log(n-fails+'/'+n+' ok');
if(fails)process.exitCode=1;
