// 2.9: zwei randlose Welten (offener Rand), Par ab 20, je 5 Orte × (10 Level + 10 Geheimlevel), Juwel + Portal in jedem Level
const fs=require('fs');const L9=require(require('path').join(__dirname,'lib9.js')),{X,matters}=L9;const T0=Date.now();
const some=(n,...ks)=>(L,m)=>matters('wrap',L,m)&&ks.filter(k=>matters(k,L,m)).length>=n;
const sz=i=>({W:7+(i>3)+(i>7),H:8+(i>2)+(i>6)});
const W={
 '1':{id:'endlos',name:'Endloses Eis',out:'endlos.json',places:[
  ['ee1','Nebelring',i=>({...sz(i),minM:20+Math.floor(i*.6),maxM:30,p:{'#':.07,k:.05,K:.03,'_':.04},items:1+(i>4),cubes:i>2?1:0,check:some(1,'item','cube')}),9100],
  ['ee2','Kreiselfjord',i=>({...sz(i),minM:20+Math.floor(i*.7),maxM:31,p:{'#':.06,k:.05,K:.03,'_':.03,arrow:.05},tele:i>3?1:0,check:some(1,'arrow','tele')}),9200],
  ['ee3','Schlüsselschleife',i=>({...sz(i),minM:21+Math.floor(i*.7),maxM:32,p:{'#':.07,k:.05,K:.04,'_':.03,'%':.04},keys:1,items:i>4?1:0,check:some(1,'key','crack','item')}),9300],
  ['ee4','Tauwirbel',i=>({...sz(i),minM:21+Math.floor(i*.8),maxM:33,p:{'#':.06,k:.05,K:.03,'_':.03,m:.07,u:.04,'~':.02},cubes:1,check:some(1,'melt','cube','hole')}),9400],
  ['ee5','Dornenring',i=>({...sz(i),minM:22+Math.floor(i*.8),maxM:34,p:{'#':.06,k:.04,K:.04,'_':.03,dspike:.05,r:.04},cubes3:1,check:some(1,'dspike','sblock','brittle')}),9500]]},
 '2':{id:'polarwirbel',name:'Polarwirbel',out:'polarwirbel.json',places:[
  ['pw1','Sturmspirale',i=>({...sz(i),minM:22+Math.floor(i*.8),maxM:34,p:{'#':.06,k:.05,K:.03,'_':.03,arrow:.04},tele:1,items:1,check:some(2,'arrow','tele','item')}),9600],
  ['pw2','Echohalle',i=>({...sz(i),minM:22+Math.floor(i*.8),maxM:34,p:{'#':.06,k:.04,K:.04,'_':.03,u:.06,'~':.02},cubes:1,cubes2:1,check:some(2,'cube','big','hole')}),9700],
  ['pw3','Splitterkreis',i=>({...sz(i),minM:23+Math.floor(i*.8),maxM:35,p:{'#':.05,k:.04,K:.04,'_':.03,r:.05,'%':.05},keys:1,cubes:i>3?1:0,check:some(2,'brittle','crack','key','cube')}),9800],
  ['pw4','Schmelzkreis',i=>({...sz(i),minM:23+Math.floor(i*.9),maxM:36,p:{'#':.06,k:.05,K:.03,'_':.03,m:.06,dspike:.04},keys:1,items:1,check:some(2,'melt','dspike','key','item')}),9900],
  ['pw5','Wirbelkrone',i=>({...sz(i),minM:24+Math.floor(i*.9),maxM:38,p:{'#':.05,k:.04,K:.04,'_':.03,'%':.03,m:.03,arrow:.03,dspike:.03,r:.03,u:.03},items:1,keys:i>2?1:0,cubes:1,tele:i>5?1:0,cubes3:i>6?1:0,check:some(2,'item','cube','key','arrow','tele','melt')}),9950]]}};
const w=W[process.argv[2]];const world={id:w.id,name:w.name,builtin:true,places:[]};
if(fs.existsSync(w.out)&&process.argv[3]==='resume')world.places=JSON.parse(fs.readFileSync(w.out)).places;
for(const[id,name,spec,sd]of w.places){if(world.places.some(p=>p.id===id))continue;const t1=Date.now();const R=X.rng(sd);const lv=[];
  for(let i=0;i<10;i++){const o={...spec(i),wrap:true};const ex=L=>L9.runupInfo(L).size>=2;let L=null;
    for(let k=0;!L;k++){const start=L9.gen({...o,minM:12,maxM:o.maxM,check:some(0)},sd+i*977+k*53,10,20000);if(!start)continue;
      if(start.par>=o.minM&&o.check(start,start.par)&&ex(start)){L=start;break}
      const pal=['.','.','.','.','#','k','K','_'];for(const ch of'~u%xmrnsew^v<>')if(start.map.join('').includes(ch))pal.push(ch);
      L=L9.climb(start,o.minM,{seed:sd+i*31+k,pal,ms:40000,check:k<3?o.check:some(0),extra:ex})}
    lv.push(L)}
  lv.sort((a,b)=>a.par-b.par);const out=[];
  lv.forEach((L,i)=>{const n={name:name+' '+(i+1),map:L.map,wrap:true,par:L.par};const sec=L9.placeSecrets(n,R);if(sec)n.sec=sec;out.push(n);
    const S=L9.secretFor(n,sd*7+i*131);out.push({name:name+' '+(i+1)+' ✦',map:S.map,wrap:!!S.wrap,par:S.par,secret:true})});
  world.places.push({id,name,levels:out});fs.writeFileSync(w.out,JSON.stringify(world));
  console.error(w.name,name,out.map(l=>(l.secret?'✦':'')+l.par).join(' '),((Date.now()-t1)/1000|0)+'s',((Date.now()-T0)/60000).toFixed(1)+'min')}
console.error('FERTIG',w.name);
