// ===== Grafik: Eis-Arena (eigene Pixel-Art, 16px pro Feld) =====
const ML=12,MR=12,MT=20,MB=10;            // Rand (Eiswand) in Pixeln
function hsh(a,b,c){let h=(a*374761393+b*668265263+c*1274126177)|0;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return(h>>>0)/4294967296}
function mkc(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function mk(){return mkc(16,16)}
function pen(x,ox,oy){ox=ox||0;oy=oy||0;return(px,py,col,w,h)=>{x.fillStyle=col;x.fillRect(ox+px,oy+py,w||1,h||1)}}
const isStone=ch=>'_SG'.includes(ch);
const OBJ='#kKox*qOnsew1234r';
const TCOL={A:['#d050c8','#f6a8ee'],B:['#38b850','#a8f0b0'],C:['#ec9020','#ffd890']};
const CACHE={};
function cached(k,fn){return CACHE[k]||(CACHE[k]=fn())}

// --- spiegelnder Eisboden: durchgehendes Diagonal-Muster ---
const ICE_PAT=(()=>{const c=mkc(64,64),x=c.getContext('2d'),P=pen(x);P(0,0,'#bde5f6',64,64);
  for(let y=0;y<64;y++)for(let xx=0;xx<64;xx++){const v=(xx+y)%64;let col=null;
    if(v<12)col=(v===0||v===11)?'#cdeefb':'#d8f3fd';else if(v===16||v===17)col='#cbecfa';else if(v>=38&&v<41)col='#c7e9f8';
    if(col)P(xx,y,col)}
  [[9,20],[40,7],[27,50],[55,33],[14,43]].forEach(([a,b])=>P(a,b,'#ffffff'));return c})();
// --- Steinboden ---
function stoneImg(v){return cached('st'+v,()=>{const c=mk(),x=c.getContext('2d'),P=pen(x);
  P(0,0,'#6c7587',16,16);P(1,1,'#a2abba',14,14);P(1,1,'#c6cdd8',14,1);P(1,1,'#b8c0cd',1,14);P(1,14,'#8992a3',14,1);P(14,1,'#8d96a6',1,14);
  for(let py=2;py<14;py++)for(let px=2;px<14;px++){const d=Math.hypot(px-7.5,py-7.5);if(d>3.3&&d<4.5)P(px,py,'#959eaf');else if(d<=3.3)P(px,py,'#a9b2c0')}
  for(let i=0;i<3;i++)P(2+Math.floor(hsh(v,i,1)*12),2+Math.floor(hsh(v,i,2)*12),'#e4ecf6');return c})}
// --- flache Overlays (16x16) ---
function circ(P,fn){for(let py=0;py<16;py++)for(let px=0;px<16;px++){const col=fn(Math.hypot(px-7.5,py-7.5),px,py);if(col)P(px,py,col)}}
function deepHole(P){P(0,0,'#060c18',16,16);const w=['#d8f2ff','#7fb3d6','#6497c0','#4e7fab','#3a6792','#2a4f78','#1b375a','#10243e'];w.forEach((col,i)=>P(0,i,col,16,1));
  P(0,0,'#3a6792',1,16);P(15,0,'#2a4f78',1,16);P(0,15,'#a6d4ec',16,1);P(3,11,'#0e1a30',10,2)}
function flatImg(ch,va){return cached('f'+ch+va,()=>{const c=mk(),x=c.getContext('2d'),P=pen(x);
  switch(ch){
    case 'S':circ(P,d=>d>4.4&&d<5.8?'#4a8ad0':d>=5.8&&d<6.4?'#9cc8f0':null);P(7,7,'#4a8ad0',2,2);break;
    case 'G':P(3,3,'#4e5a74',10,10);P(4,4,'#121828',8,9);P(5,2,'#6e4422',1,12);P(10,2,'#6e4422',1,12);for(const ry of[4,7,10])P(5,ry,'#c48a4e',6,1);P(5,2,'#a06a38');P(10,2,'#a06a38');
      if(va==='L'){for(const y of[3,6,9])P(3,y,'#bfe6f8',10,3);for(const y of[5,8,11])P(3,y,'#6aa6d0',10,1);P(3,3,'#eefaff',10,1);P(7,6,'#f8d030',2,3);P(7,6,'#7a5a10',2,1)}break;
    case '~':deepHole(P);break;
    case 'u':if(va==='f'){P(0,0,'#8cc6e4',16,16);P(1,1,'#cbedfb',14,14);P(1,1,'#e8f8ff',14,1);P(1,14,'#a6d4ec',14,1);P(3,3,'#f4fcff',4,1);P(3,3,'#f4fcff',1,3)}
      else{P(0,0,'#5f92b8',16,16);['#e4f6ff','#86b8da','#76a8ce','#6a9cc4'].forEach((col,i)=>P(0,i,col,16,1));P(0,0,'#76a8ce',1,16);P(15,0,'#6a9cc4',1,16);P(0,15,'#b4def2',16,1);
        for(let i=0;i<5;i++)P(2+Math.floor(hsh(i,4,4)*12),6+Math.floor(hsh(i,5,5)*8),'#7aa8cc')}break;
    case '%':if(va==='b'){deepHole(P);break}
      [[3,4],[4,5],[5,5],[6,6],[7,7],[7,8],[8,9],[9,9],[10,10],[11,11],[12,11],[8,7],[9,6],[10,5],[11,4],[6,7],[5,8],[4,9],[4,10]].forEach(([a,b])=>{P(a,b,'#5a8fb6');P(a+1,b,'#eefaff')});break;
    case '^':case 'v':case '<':case '>':{const d={'^':0,'v':1,'<':2,'>':3}[ch];const rot=(px,py)=>d===0?[px,py]:d===1?[px,15-py]:d===2?[py,px]:[15-py,px];
      const pts=[[7,2],[8,2]];for(let i=6;i<=9;i++)pts.push([i,3]);for(let i=5;i<=10;i++)pts.push([i,4]);for(let i=4;i<=11;i++)pts.push([i,5]);for(let i=3;i<=12;i++)pts.push([i,6]);for(let y=7;y<=13;y++)for(let i=6;i<=9;i++)pts.push([i,y]);
      const set=new Set(pts.map(p=>p.join()));pts.forEach(([a,b])=>[[1,0],[-1,0],[0,1],[0,-1]].forEach(([u,w])=>{if(!set.has([a+u,b+w].join())){const[p,q]=rot(a+u,b+w);P(p,q,'#2f6fae')}}));
      pts.forEach(([a,b])=>{const[p,q]=rot(a,b);P(p,q,(a===7||a===8)&&b>4?'#ffffff':'#8fd2fa')});break}
    case 'A':case 'B':case 'C':{const[c1,c2]=TCOL[ch];circ(P,d=>d>6.8?null:d>6?'#24406a':d>4.3?c1:d>3.3?c2:d>2?'#eefaff':'#ffffff');break}
    case 'm':{if(va==='h'){deepHole(P);break}const s=+va||0;
      P(0,0,s===0?'#d6f2fc':s===1?'#c6ecfa':'#b4e2f4',16,16);P(0,0,'#eefaff',16,1);P(0,15,'#9ccbe3',16,1);
      if(s===0){[[3,4],[10,3],[6,10],[12,11]].forEach(([a,b])=>{P(a,b,'#ffffff',2,1);P(a,b+1,'#a6d8f0',1,1)})}
      if(s>=1){P(3,4,'#8cc6e4',4,2);P(2,5,'#8cc6e4',1,1);P(10,9,'#8cc6e4',3,2);P(4,4,'#b8e6fa',2,1)}
      if(s>=2){P(5,8,'#6aa8d0',6,4);P(4,9,'#6aa8d0',1,2);P(11,9,'#6aa8d0',1,2);P(6,8,'#9cd4f0',3,1);P(11,2,'#6aa8d0',3,3);P(2,12,'#6aa8d0',2,2);P(12,12,'#8cc6e4',2,1)}
      for(let i=0;i<3;i++)P(1+i*2,1,i<3-s?'#4f8fb8':'#b4d8ec',1,1);break}
    case 'l':{P(4,2,'#0a0e18',8,1);P(3,3,'#0a0e18',10,6);P(4,9,'#0a0e18',8,1);P(6,10,'#0a0e18',4,3);P(5,13,'#0a0e18',6,2);
      P(5,3,'#232a3e',2,1);P(4,4,'#232a3e',1,2);P(2,4,'#7fb2d0',1,4);P(13,4,'#e8f8ff',1,4);P(5,15,'#e8f8ff',6,1);break}
    case 'z':if(va==='mk'){for(let i=-16;i<16;i+=5)for(let k=0;k<16;k++){const x0=i+k;if(x0>=0&&x0<16)P(x0,k,'rgba(255,150,40,.55)')}P(0,0,'#ff9a28',16,1);P(0,15,'#ff9a28',16,1);P(0,0,'#ff9a28',1,16);P(15,0,'#ff9a28',1,16)}else return null;break;
    default:return null}
  return c})}
// --- Objekte (dürfen nach oben überstehen) ---
function droplet(P,cx,bottom,h,hw,pal,seed){const top=bottom-h;
  for(let y=top;y<=bottom;y++){const t=(y-top)/h;let half=hw*Math.pow(Math.sin(Math.min(1,t*1.22)*Math.PI/2),.8);if(t>.8)half*=Math.sqrt(Math.max(0,1-Math.pow((t-.8)/.2,2)*.5));
    const a=Math.round(cx-half),b=Math.round(cx+half);for(let xx=a;xx<=b;xx++){const rel=(xx-cx)/Math.max(half,.6);let col=pal.base;
      if(xx===a||xx===b||y===top||y===bottom)col=pal.out;else if(rel<-.3&&t<.75)col=pal.light;else if(rel>.4||t>.86)col=pal.dark;
      if(col!==pal.out&&rel>-.7&&rel<-.15&&t>.22&&t<.5)col=pal.hi;P(xx,y,col)}}
  for(let i=0;i<3;i++){const sx=Math.round(cx+(hsh(seed,i,9)-.3)*hw),sy=Math.round(top+h*(.45+hsh(seed,i,8)*.35));P(sx,sy,pal.spot,2,1)}}
const PAL_ICE={out:'#1d4a88',dark:'#3576c0',base:'#52a2e2',light:'#84c6f4',hi:'#e2f6ff',spot:'#9fd6f8'};
function shard(P,cx,top,bottom,hw){for(let y=top;y<=bottom;y++){const half=hw*Math.pow((y-top)/(bottom-top),.85);const a=Math.round(cx-half),b=Math.round(cx+half);
  for(let xx=a;xx<=b;xx++){let col=xx<cx-.5?'#bde9ff':xx<=cx+.5?'#f2fbff':'#66ade6';if(xx===a||xx===b||y===top)col='#24589a';P(xx,y,col)}}}
function objImg(ch,v){return cached('o'+ch+v,()=>{let c,x,P,ox=0,oy=0;
  switch(ch){
    case 'k':c=mkc(16,16);x=c.getContext('2d');P=pen(x);P(3,14,'#8fc0dc',10,1);droplet(P,7.5,14,10,4.6,PAL_ICE,v);break;
    case '#':c=mkc(16,24);x=c.getContext('2d');P=pen(x);oy=8;P(1,22,'#8fc0dc',14,1);droplet(P,7.5,22,20,7,PAL_ICE,v+3);break;
    case 'K':{c=mkc(24,32);x=c.getContext('2d');P=pen(x);ox=4;oy=16;P(1,30,'#8fc0dc',22,1);
      const hv=Math.floor(v*2);shard(P,14,0+hv,28,7.5);shard(P,7,7-hv,28,6);shard(P,19,10,29,5);
      for(let y=24;y<=30;y++){const half=10.5*Math.sqrt(Math.max(0,1-Math.pow((y-27)/3.6,2)));const a=Math.round(11.5-half),b=Math.round(11.5+half);for(let xx=a;xx<=b;xx++)P(xx,y,xx===a||xx===b||y===30?'#24589a':y<26?'#9ad8fa':xx<12?'#7cc2f2':'#4e98da')}
      P(9,26,'#e2f6ff',3,1);break}
    case 'o':c=CUBE;oy=2;break;
    case 'x':{c=mkc(16,20);x=c.getContext('2d');P=pen(x);oy=4;P(1,19,'#8fc0dc',14,1);
      for(const[cx,top,hw]of[[4,10,3],[8,4,3.6],[12,11,2.8]]){shard(P,cx,top,18,hw);P(cx,top,'#e83c5c');P(cx,top+1,'#ff8aa0')}break}
    case '*':{c=mkc(16,18);x=c.getContext('2d');P=pen(x);oy=2;P(4,16,'#8fc0dc',8,1);
      const rows=[[3,7,8],[4,6,9],[5,5,10],[6,4,11],[7,4,11],[8,5,10],[9,6,9],[10,7,8],[11,7,8]];
      rows.forEach(([y,a,b])=>{P(a-1,y,'#6a1850');P(b+1,y,'#6a1850');for(let xx=a;xx<=b;xx++)P(xx,y,y<=5?'#ffd0f0':xx<8?'#ff6ec8':'#c03898')});
      P(7,2,'#6a1850',2,1);P(7,12,'#6a1850',2,1);P(6,4,'#fff');P(13,3,'#fff');P(2,9,'#fff');break}
    case 'q':{c=mkc(16,18);x=c.getContext('2d');P=pen(x);oy=2;P(4,16,'#8fc0dc',8,1);
      const K=[[3,4,5,1],[2,5,1,4],[6,5,1,4],[3,9,3,1],[7,6,6,2],[11,8,1,2],[13,8,1,3],[9,8,1,2]];
      P(3,5,'#b08810',3,4);P(4,6,'#8fc0dc',1,2);P(7,6,'#f8d030',6,2);P(11,8,'#f8d030',1,2);P(13,8,'#f8d030',1,3);P(3,4,'#f8d030',3,1);P(2,5,'#f8d030',1,4);P(6,5,'#f8d030',1,4);P(3,9,'#f8d030',3,1);
      P(7,7,'#b08810',6,1);P(4,4,'#fff6c0',1,1);P(8,6,'#fff6c0',3,1);P(1,5,'#5a4008',1,4);P(2,4,'#5a4008',1,1);P(2,9,'#5a4008',1,1);P(3,3,'#5a4008',3,1);P(3,10,'#5a4008',3,1);P(6,4,'#5a4008',1,1);P(13,6,'#5a4008',1,1);break}
    case 'O':c=BIG;oy=BIG.height-16;break;
    case '1':case '2':case '3':case '4':{c=SBLK[+ch-1];oy=4;ox=0;break}
    case 'r':{c=mkc(16,22);x=c.getContext('2d');P=pen(x);oy=6;
      P(0,1,'#2a5a88',16,21);P(1,2,'#b4def2',14,9);P(1,2,'#d8f2fc',14,2);P(1,11,'#7ab2d4',14,9);P(1,11,'#9cccE6'.toLowerCase(),14,1);P(1,20,'#2a5a88',14,1);
      [[3,3],[4,4],[4,5],[5,6],[6,6],[7,7],[7,8],[8,9],[9,9],[10,10],[11,10],[12,11],[7,12],[6,13],[6,14],[5,15],[10,12],[11,13],[11,14],[12,15],[12,16],[3,16],[4,17],[9,4],[10,3],[11,3]].forEach(([a,b])=>P(a,b,'#1f4a70'));
      P(13,2,'#2a5a88',2,2);P(1,17,'#2a5a88',2,3);P(14,15,'#2a5a88',1,3);P(5,3,'#ffffff',2,1);P(2,12,'#a8d4ec',2,1);
      P(2,21,'#9cc8e0',3,1);P(11,21,'#9cc8e0',2,1);break}
    case 'W':{c=mkc(16,16);x=c.getContext('2d');P=pen(x);oy=0; // großer Block, tief im flachen Loch eingefroren
      P(0,4,'#24589a',16,12);P(1,5,'#3f7fb6',14,10);
      P(1,1,'#1f4a80',14,12);P(0,2,'#1f4a80',16,10);P(2,2,'#ffffff',12,2);P(1,4,'#ffffff',14,1);P(1,5,'#9ad6f6',14,6);P(1,3,'#ffffff',1,1);P(14,3,'#ffffff',1,1);
      P(3,6,'#c8ecfc',4,1);P(3,6,'#c8ecfc',1,2);P(10,6,'#bfe6f8',3,1);P(6,5,'#ffffff',2,1);P(3,2,'#e4f4ff',3,1);
      P(0,9,'#4f93c8',16,6);P(1,9,'#a8dcf6',14,1);P(2,10,'#7fc0ea',3,1);P(9,10,'#7fc0ea',4,1);P(5,12,'#6aaedc',3,1);P(11,13,'#6aaedc',2,1);P(3,13,'#6aaedc',2,1);
      P(0,9,'#24589a',1,6);P(15,9,'#24589a',1,6);P(0,15,'#24589a',16,1);P(0,8,'#cdeefc',1,1);P(15,8,'#cdeefc',1,1);break}
    case 'n':case 's':case 'w':case 'e':{c=mk();x=c.getContext('2d');P=pen(x);const d=DSPIKE[ch];
      const rot=(px,py)=>d===0?[px,py]:d===1?[px,15-py]:d===2?[py,px]:[15-py,px];const Q=(px,py,col)=>{const[a,b]=rot(px,py);P(a,b,col)};
      for(let y=7;y<16;y++)for(let xx=1;xx<15;xx++)Q(xx,y,y===7?'#eefaff':y>13?'#5a8fb6':xx<3?'#cdeefc':xx>12?'#8cc6e4':'#b4e2f4');
      for(let xx=1;xx<15;xx++){Q(xx,15,'#24589a')}for(let y=7;y<16;y++){Q(0,y,'#24589a');Q(15,y,'#24589a')}
      for(const sx of[3,8,13])for(let y=1;y<7;y++){const h=Math.round((y-1)/6*2);for(let xx=sx-h;xx<=sx+h;xx++)Q(xx,y,xx<sx?'#f4fcff':xx===sx?'#d8f0fc':'#9cc8e0');Q(sx-h-1,y,'#24589a');Q(sx+h+1,y,'#24589a')}
      for(const sx of[3,8,13]){Q(sx,1,'#e83c5c');Q(sx,0,'#24589a')}break}
    default:return null}
  return{c,ox,oy}})}
// Glatter Schiebeblock (weiß/lavendel, abgerundet)
const CUBE=(()=>{const c=mkc(16,18),x=c.getContext('2d'),P=pen(x);
  P(2,17,'#8fc0dc',12,1);P(1,2,'#5a6890',14,15);P(2,1,'#5a6890',12,17);
  P(2,2,'#eef2fd',12,10);P(9,3,'#dfe5f7',5,8);P(2,12,'#b6c2e2',12,4);P(2,15,'#97a3c8',12,1);P(2,12,'#c8d2ee',12,1);
  P(3,3,'#ffffff',6,1);P(3,3,'#ffffff',1,4);P(4,4,'#f8faff',2,1);P(12,13,'#a6b2d6',1,2);return c})();
// Stachelblock (schiebbar): weißer Block, an einer Seite Eisstacheln mit roten Spitzen
const SBLK=[0,1,2,3].map(d=>{const c=mkc(16,20),x=c.getContext('2d'),P=pen(x),oy=4;
  P(2,19,'#8fc0dc',12,1);P(2,oy+2,'#5a6890',12,13);P(3,oy+1,'#5a6890',10,15);P(3,oy+2,'#eef2fd',10,9);P(3,oy+11,'#b6c2e2',10,3);P(3,oy+14,'#97a3c8',10,1);P(4,oy+3,'#ffffff',4,1);P(4,oy+3,'#ffffff',1,3);
  const sp=(px,py)=>{x.fillStyle='#24589a';x.fillRect(px,py,1,1)};const Q=(a,b,col)=>{x.fillStyle=col;x.fillRect(a,b,1,1)};
  for(const k of[4,8,12]){for(let s=0;s<4;s++){const w=s;for(let u=-Math.floor(w/2);u<=Math.floor(w/2);u++){
    let px,py;if(d===0){px=k-1+u;py=oy+1-3+s}else if(d===1){px=k-1+u;py=oy+15+3-s}else if(d===2){px=2-3+s;py=oy+k-1+u}else{px=13+3-s;py=oy+k-1+u}
    Q(px,py,s===0?'#e83c5c':u<0?'#f4fcff':'#9cc8e0')}}}
  return c});
// Großer glatter Eisblock (schiebbar): breiter und höher als der kleine, hinterlässt im flachen Loch eine Mauer
const BIG=(()=>{const c=mkc(16,22),x=c.getContext('2d'),P=pen(x);
  P(1,21,'#7fb0cc',14,1);P(0,3,'#1f4a80',16,18);P(1,2,'#1f4a80',14,20);
  P(1,4,'#9ad6f6',14,10);P(1,14,'#5fa6d8',14,6);P(1,19,'#3f86bc',14,1);P(1,14,'#7fc0ea',14,1);
  P(3,6,'#c8ecfc',4,1);P(3,6,'#c8ecfc',1,5);P(9,8,'#bfe6f8',3,1);P(11,9,'#bfe6f8',1,3);P(6,11,'#7fc0ea',5,1);P(12,15,'#4a94c8',2,3);P(3,16,'#4a94c8',3,1);
  P(1,2,'#ffffff',14,3);P(2,1,'#ffffff',12,1);P(1,5,'#ffffff',3,1);P(6,5,'#ffffff',2,2);P(11,5,'#ffffff',3,1);P(14,5,'#ffffff',1,2);P(3,1,'#e4f4ff',3,1);
  P(0,2,'#1f4a80',1,1);P(15,2,'#1f4a80',1,1);P(1,1,'#1f4a80',1,1);P(14,1,'#1f4a80',1,1);P(2,0,'#1f4a80',12,1);return c})();
// --- Eiswand als Map-Rand (zu = Eiswand mit Eisperlen, offen = Durchgang ins Nichts) ---
// Eckpfeiler: gleiche Eis-Optik wie die Wand, mit großer Eisperle und (oben) derselben Vorderkante
function cornerPx(lx,ly,w,h,top,wrap){const FACE=9;
  // Farbsatz: geschlossener Rand = helles Eis, offener Rand = dunkles Portal-Eis mit leuchtender Perle
  const C=wrap?{face:['#0f2448','#173a66','#1f4a7a','#24578c'],lip:'#7ffcff',seam:'#2a7fa8',bo:'#2a7fa8',bh:'#ffffff',bs:'#3ad0f0',bm:'#9ffcff',b1:'#24578c',b2:'#1f4a7a',b3:'#173a66',hi:'#2f6ca8',lo:'#0f2448',dot:'#7ffcff'}
                :{face:['#2f6fae','#4e9cd6','#64b0e2','#88ccf0'],lip:'#c4eefc',seam:'#3d86c2',bo:'#4f9cd6',bh:'#ffffff',bs:'#8fd2f4',bm:'#d6f5ff',b1:'#c4eefc',b2:'#a8e4fa',b3:'#8cd4f4',hi:'#d2f3ff',lo:'#6ebfea',dot:'#5fb0e2'};
  if(top&&ly>=h-FACE){const k=(h-1-ly)/(FACE-1);let col=k<.15?C.face[0]:k<.4?C.face[1]:k<.7?C.face[2]:C.face[3];if(ly===h-FACE)col=C.lip;if(lx===0||lx===w-1)col=C.seam;return col}
  const bh=top?h-FACE:h,cx=(w-1)/2,cy=(bh-1)/2,u=lx-cx,v=ly-cy,rr=u*u+v*v;
  if(rr<=9.5){if(rr>7)return C.bo;if(u+v<-2)return C.bh;if(u+v>1.5)return C.bs;return C.bm}
  let col=ly<bh*.3?C.b1:ly<bh*.6?C.b2:C.b3;if(lx<=1)col=C.hi;if(lx>=w-2||ly>=bh-2)col=C.lo;
  if((lx===1||lx===w-2)&&(ly===1||ly===bh-2))col=C.dot;if(wrap&&(lx===0||lx===w-1||ly===0||(!top&&ly===h-1)))col='#3a8ac4';return col}
function frameImg(W,H,wrap){return cached('fr'+W+'x'+H+wrap,()=>{const FW=W*16+ML+MR,FH=H*16+MT+MB,c=mkc(FW,FH),x=c.getContext('2d'),P=pen(x);
  const x0=ML,y0=MT,x1=ML+W*16,y1=MT+H*16,FACE=9;
  const bead=(u,v)=>{const rr=u*u+v*v;if(rr>7.6)return null;if(rr>5.4)return'#4f9cd6';if(u+v<-1.6)return'#ffffff';if(u+v>1.4)return'#8fd2f4';return'#d6f5ff'};
  for(let y=0;y<FH;y++)for(let xx=0;xx<FW;xx++){
    if(xx>=x0&&xx<x1&&y>=y0&&y<y1)continue;
    const dx=xx<x0?x0-xx:xx>=x1?xx-x1+1:0,dy=y<y0?y0-y:y>=y1?y-y1+1:0,corner=dx>0&&dy>0;let col;
    if(wrap&&!corner){
      const d=Math.max(dx,dy),th=dx?ML:(y<y0?MT:MB);col=d<3?'#1f4a7a':d<6?'#173a66':'#0f2448';if(((xx+y)%9)===0&&d>2)col='#24578c';
      if(d===1)col=((dx?y:xx)%6)<3?'#7ffcff':'#2a7fa8';if(d===th)col='#3a8ac4';
    }else if(y<y0&&!corner&&dy<=FACE){ // Vorderseite der oberen Wand
      const k=(dy-1)/(FACE-1);col=k<.15?'#2f6fae':k<.4?'#4e9cd6':k<.7?'#64b0e2':'#88ccf0';const s=(xx-x0)%16;if(s===0)col='#3d86c2';else if(s===1&&k>.15)col='#b8e8fc';if(dy===FACE)col='#c4eefc';
    }else{
      // Eiswand-Körper mit Perlenreihe an der Innenkante
      const th=corner?Math.max(dx,dy):dx?ML:(y<y0?MT-FACE:MB);const d=corner?99:(dx||(y<y0?dy-FACE:dy));const along=dx?y:xx;
      const t=Math.min(1,Math.max(0,(d-6)/Math.max(1,th-6)));col=t<.33?'#a8e4fa':t<.66?'#8cd4f4':'#6ebfea';
      if(((along*5+(dx?1:3))%11)===0&&d>6)col='#d2f3ff';
      if(d<=6){col='#5fb0e2';const b=bead(((along+300)%6)-2.5,d-3.5);if(b)col=b}
    }
    if(corner)col=cornerPx(xx<x0?xx:xx-x1,y<y0?y:y-y1,xx<x0?ML:MR,y<y0?MT:MB,y<y0,wrap);
    if(xx===0||y===0||xx===FW-1||y===FH-1)col=wrap&&!corner?'#3a8ac4':'#1f5a98';
    P(xx,y,col)}
  if(wrap){const ch='#7ffcff';
    for(let r=0;r<H;r++){const yc=y0+r*16+7;for(let k=0;k<3;k++){P(x0-7+k,yc-k,ch);P(x0-7+k,yc+1+k,ch);P(x1+6-k,yc-k,ch);P(x1+6-k,yc+1+k,ch)}}
    for(let c=0;c<W;c++){const xc=x0+c*16+7;for(let k=0;k<3;k++){P(xc-k,y0-9+k,ch);P(xc+1+k,y0-9+k,ch);P(xc-k,y1+6-k,ch);P(xc+1+k,y1+6-k,ch)}}}
  return c})}
// --- Spielfigur (eigene Figur mit Mütze) ---
const SPR_MAP=["......kkkk......",".....kwwwwk.....","....kkrrrrkk....","...krrrrrrrrk...","..krrrrrrrrrrk..","..kRRRRRRRRRRk..","..kssssssssssk..","..kssssssssssk..","..kssssssssssk..","...kssssssssk...","..kbbkSSSSkbbk..",".kbbbbbbbbbbbbk.",".kbBbbbbbbbbBbk.","..kkbbbbbbbbkk..","...kggk..kggk...","...kkkk..kkkk..."];
const SPR_COL={k:'#1c2030',w:'#f8f8f8',r:'#e04848',R:'#a02838',s:'#f8c8a0',S:'#d8a080',b:'#3870d0',B:'#2850a0',g:'#5a6070'};
const HATS={
 beanie:{rows:["......kkkk......",".....kwwwwk.....","....kkrrrrkk....","...krrrrrrrrk...","..krrrrrrrrrrk..","..kRRRRRRRRRRk.."],col:{w:'#f8f8f8',r:'#e04848',R:'#a02838'}},
 tophat:{rows:["....kkkkkkkk....","....kHhHHHHk....","....kHhHHHHk....","....kHhHHHHk....","....krrrrrrk....","..kkHHHHHHHHkk.."],col:{H:'#262a3a',h:'#4a5070',r:'#c83a3a'}},
 crown:{rows:["................","...k..k..k..k...","..kYk.kYYk.kYk..","..kYYkYjYYkYYk..","..kyyyyyyyyyyk..","..knnnnnnnnnnk.."],col:{Y:'#f8d030',y:'#b08810',j:'#e04848',n:'#6a3a1a'}},
 party:{rows:[".......kw.......","......kPPk......","......kppk......",".....kPPPPk.....","....kppppppk....","..kkPPPPPPPPkk.."],col:{w:'#fff6c0',P:'#ff6ec8',p:'#7fd4ff'}},
 cowboy:{rows:["................",".....kkkkkk.....","....kCCCCCCk....","....kCcCCcCk....","....kxxxxxxk....","kkkkCCCCCCCCkkkk"],col:{C:'#a0602a',c:'#c88040',x:'#3a2410'}},

 cap:{rows:["................",".......kk.......","....kkkCCkkk....","...kCCCCCCCCk...","..kCCCCwCCCCCk..","..kVVVVVVVVVVk.."],col:{C:'#3a7ad8',V:'#24508c',w:'#f8f8f8'}},
 headband:{rows:["................","................","....knnnnnnk....","...knnnnnnnnk...","..knnnnnnnnnnk..","..kRRRRwwRRRRk.."],col:{n:'#6a3a1a',R:'#e04848',w:'#f8f8f8'}},
 wizard:{rows:[".......kk.......","......kZZk......",".....kZyZZk.....","....kZZZZyZk....","...kZZZZZZZZk...","kkkkZZZZZZZZkkkk"],col:{Z:'#5a3ab0',y:'#f8d030'}},
 santa:{rows:["............kw..","..........kkRk..","......kkkkRRk...","....kRRRRRRk....","...kRRRRRRRRk...","..kwwwwwwwwwwk.."],col:{R:'#d83a3a',w:'#f8f8f8'}},
 helmet:{rows:["......kkkk......","....kMMMMMMk....","...kMmMMMMMMk...","..kMmMMMMMMMMk..","..kMMMMMMMMMMk..","..kddddddddddk.."],col:{M:'#b8c0d0',m:'#e8eef8',d:'#7a8496'}},
 flowers:{rows:["................","................","....knnnnnnk....","...knnnnnnnnk...","..kfgfpgfgpfgk..","..knnnnnnnnnnk.."],col:{n:'#6a3a1a',f:'#ff6ec8',p:'#f8d030',g:'#40b858'}},
 bear:{rows:["..kkk......kkk..","..kWPk....kPWk..","..kWWkkkkkkWWk..","..kWWWWWWWWWWk..","..kWWWWWWWWWWk..","..kddddddddddk.."],col:{W:'#f4f8ff',P:'#f0a0b0',d:'#c8d4e4'}}};
const SUITS={blue:['#3870d0','#2850a0'],green:['#3aa050','#2a7a3a'],purple:['#8a50d0','#6a38a8'],black:['#363a46','#1a1d24'],red:['#d04848','#a02838'],gold:['#f8d030','#b08810'],rainbow:null};
const SHOES={grey:['#5a6070'],red:['#c83a3a'],yellow:['#e8c030'],skates:['#e8eef8','#a8b8cc'],barefoot:['#f8c8a0','#d8a080'],spikes:['#30343e','#dfe8f2']};
SUITS.tie=['#3a3e4a','#262a34'];SUITS.doctor=['#f4f8fc','#c8d4e4'];
// Zusatzpixel für Anzüge (vorne/seitlich)
const SUIT_OVER={tie:[[6,11,'#f8f8f8'],[9,11,'#f8f8f8'],[7,11,'#d83a3a'],[8,11,'#d83a3a'],[7,12,'#d83a3a'],[8,12,'#b02838'],[7,13,'#b02838'],[6,10,'#f8f8f8'],[9,10,'#f8f8f8']],
 doctor:[[7,11,'#7fb0e0'],[8,11,'#7fb0e0'],[7,12,'#7fb0e0'],[8,12,'#5a8fc8'],[5,11,'#3a3e4a'],[10,11,'#3a3e4a'],[5,12,'#3a3e4a'],[10,12,'#3a3e4a'],[6,13,'#3a3e4a'],[9,13,'#3a3e4a'],[7,13,'#8a96a8'],[11,12,'#3870d0'],[11,11,'#3870d0'],[3,12,'#e04848']]};
const EYES={black:null,blue:'#3a8ae8',red:'#e03838',green:'#38b858',yellow:'#f0c820'};
// Gegenstände für die (rechte) Hand: [x,y,Farbe]
const HAND={none:[],
 fish:[[11,11,'#4a8ad8'],[12,11,'#6aa8f0'],[13,11,'#6aa8f0'],[14,11,'#4a8ad8'],[12,12,'#4a8ad8'],[13,12,'#4a8ad8'],[15,10,'#4a8ad8'],[15,12,'#4a8ad8'],[12,10,'#1c2030']],
 flag:[[15,4,'#7a4c26'],[15,5,'#7a4c26'],[15,6,'#7a4c26'],[15,7,'#7a4c26'],[15,8,'#7a4c26'],[15,9,'#7a4c26'],[15,10,'#7a4c26'],[15,11,'#7a4c26'],[12,4,'#e04848'],[13,4,'#e04848'],[14,4,'#e04848'],[12,5,'#f8f8f8'],[13,5,'#f8f8f8'],[14,5,'#f8f8f8'],[12,6,'#e04848'],[13,6,'#e04848'],[14,6,'#e04848']],
 icicle:[[14,6,'#f4fcff'],[15,6,'#bde9ff'],[14,7,'#f4fcff'],[15,7,'#9cd4f0'],[14,8,'#d6f2fc'],[15,8,'#9cd4f0'],[14,9,'#d6f2fc'],[15,9,'#6aa8d0'],[14,10,'#bde9ff'],[15,10,'#6aa8d0'],[14,11,'#9cd4f0'],[14,12,'#6aa8d0']],
 lolly:[[14,9,'#f8f8f8'],[14,10,'#f8f8f8'],[14,11,'#f8f8f8'],[13,6,'#ff6ec8'],[14,6,'#fff'],[15,6,'#ff6ec8'],[13,7,'#fff'],[14,7,'#ff6ec8'],[15,7,'#fff'],[13,8,'#ff6ec8'],[14,8,'#fff'],[15,8,'#ff6ec8']],
 balloon:[[13,0,'#e04848'],[14,0,'#e04848'],[12,1,'#e04848'],[13,1,'#ff8080'],[14,1,'#e04848'],[15,1,'#e04848'],[12,2,'#e04848'],[13,2,'#e04848'],[14,2,'#e04848'],[15,2,'#a02838'],[13,3,'#e04848'],[14,3,'#a02838'],[14,4,'#a02838'],[14,5,'#f8f8f8'],[14,6,'#f8f8f8'],[14,7,'#f8f8f8'],[14,8,'#f8f8f8'],[14,9,'#f8f8f8'],[14,10,'#f8f8f8']],
 snowball:[[13,10,'#f4f8ff'],[14,10,'#ffffff'],[15,10,'#d8e4f0'],[13,11,'#ffffff'],[14,11,'#f4f8ff'],[15,11,'#c8d4e4'],[14,12,'#c8d4e4'],[13,12,'#d8e4f0']],
 wand:[[12,12,'#3a2410'],[13,11,'#3a2410'],[14,10,'#3a2410'],[15,9,'#f8d030'],[14,8,'#f8d030'],[15,8,'#fff6c0'],[15,7,'#f8d030'],[13,9,'#fff6c0']],
 key:[[12,11,'#f8d030'],[13,11,'#f8d030'],[14,11,'#f8d030'],[15,10,'#f8d030'],[15,11,'#b08810'],[15,12,'#f8d030'],[13,12,'#b08810'],[12,12,'#b08810']]};
const FACE={none:[],
 mustache:[[5,9,'#5a3418'],[6,9,'#5a3418'],[7,9,'#5a3418'],[8,9,'#5a3418'],[9,9,'#5a3418'],[10,9,'#5a3418'],[4,8,'#5a3418'],[11,8,'#5a3418']],
 goatee:[[7,9,'#5a3418'],[8,9,'#5a3418'],[7,10,'#5a3418'],[8,10,'#5a3418']],
 beard:[[3,8,'#6a3a1a'],[12,8,'#6a3a1a'],[3,9,'#6a3a1a'],[4,9,'#6a3a1a'],[5,9,'#6a3a1a'],[6,9,'#8a5028'],[7,9,'#6a3a1a'],[8,9,'#6a3a1a'],[9,9,'#8a5028'],[10,9,'#6a3a1a'],[11,9,'#6a3a1a'],[12,9,'#6a3a1a'],[6,10,'#6a3a1a'],[7,10,'#6a3a1a'],[8,10,'#6a3a1a'],[9,10,'#6a3a1a']],
 glasses:[[4,7,'#1c2030'],[5,7,'#1c2030'],[6,7,'#1c2030'],[7,7,'#1c2030'],[8,7,'#1c2030'],[9,7,'#1c2030'],[10,7,'#1c2030'],[11,7,'#1c2030'],[4,8,'#1c2030'],[5,8,'#2a3a5a'],[6,8,'#1c2030'],[9,8,'#1c2030'],[10,8,'#2a3a5a'],[11,8,'#1c2030'],[4,7,'#1c2030'],[5,7,'#5a7aa8']],
 bigglasses:(()=>{const o=[],F='#7a3a1a',L='rgba(200,235,255,.0)';for(const lx of[3,8]){for(let x=lx+1;x<lx+4;x++){o.push([x,6,F]);o.push([x,9,F])}o.push([lx,7,F],[lx,8,F],[lx+4,7,F],[lx+4,8,F])}o.push([2,7,F],[13,7,F]);return o})(),
 eyepatch:[[3,6,'#1c2030'],[4,6,'#1c2030'],[5,6,'#1c2030'],[6,6,'#1c2030'],[7,6,'#1c2030'],[8,6,'#1c2030'],[9,6,'#1c2030'],[10,6,'#1c2030'],[11,6,'#1c2030'],[12,6,'#1c2030'],[9,7,'#1c2030'],[10,7,'#1c2030'],[11,7,'#1c2030'],[9,8,'#1c2030'],[10,8,'#1c2030'],[11,8,'#1c2030'],[10,9,'#1c2030'],[9,7,'#3a3e4a']],
 scarf:[[2,10,'#e04848'],[3,10,'#f8f8f8'],[4,10,'#e04848'],[5,10,'#f8f8f8'],[6,10,'#e04848'],[7,10,'#f8f8f8'],[8,10,'#e04848'],[9,10,'#f8f8f8'],[10,10,'#e04848'],[11,10,'#f8f8f8'],[12,10,'#e04848'],[13,10,'#f8f8f8'],[11,11,'#e04848'],[11,12,'#f8f8f8'],[11,13,'#e04848']]};
// eine Figur zeichnen (cfg = Ausrüstung), d = Blickrichtung
function makeSprite(cfg,d,withKey){const cv=mk(),x=cv.getContext('2d');cfg=cfg||{};
  const hat=HATS[cfg.hat]||HATS.beanie,suit=cfg.suit==='rainbow'?null:(SUITS[cfg.suit]||SUITS.blue),sh=SHOES[cfg.shoes]||SHOES.grey;
  const hcol=Object.assign({},hat.col,cfg.hat==='beanie'&&cfg.golden?{r:'#f8d030',R:'#b08810',w:'#fff6c0'}:{});
  const RB=['#e04848','#f8a030','#f8d030','#40b858'];
  SPR_MAP.forEach((row,y)=>{const src=y<6?hat.rows[y]:row;[...src].forEach((ch,px)=>{if(ch==='.')return;let col;
    if(y<6)col=ch==='k'?'#1c2030':hcol[ch];else{col=SPR_COL[ch];if(ch==='b'||ch==='B')col=suit?suit[ch==='b'?0:1]:(ch==='b'?RB[(y-10)%4]:'#3870d0');if(ch==='g')col=sh[0];if(y===15&&ch==='k'&&sh[1])col=sh[1]}
    if(d===0&&ch==='s'&&y>=6&&y<=8)col='#8a4a2a';if(col){x.fillStyle=col;x.fillRect(px,y,1,1)}})});
  const so=SUIT_OVER[cfg.suit];if(so&&d!==0){const o=d===2?-1:d===3?1:0;so.forEach(([px,py,col])=>{x.fillStyle=col;x.fillRect(Math.max(1,Math.min(14,px+(d===1?0:o))),py,1,1)})}
  if(cfg.shoes==='spikes'){x.fillStyle='#262a34';[3,4,5,6,9,10,11,12].forEach(px=>x.fillRect(px,14,1,1));x.fillStyle='#4a5266';[4,10].forEach(px=>x.fillRect(px,14,1,1));[3,4,5,6,9,10,11,12].forEach(px=>x.clearRect(px,15,1,1));x.fillStyle='#6a7590';[3,5,10,12].forEach(px=>x.fillRect(px,15,1,1))}
  if(d!==0){const o=d===2?-1:d===3?1:0,ec=EYES[cfg.eyes];x.fillStyle=ec||'#1c2030';[5,9].forEach(ex=>x.fillRect(ex+o,7,2,2));if(ec){x.fillStyle='#1c2030';[5,9].forEach(ex=>x.fillRect(ex+o+1,8,1,1))}x.fillStyle='#fff';[5,9].forEach(ex=>x.fillRect(ex+o,7,1,1));
    x.fillStyle='#f0a0a0';if(d===1){x.fillRect(4,9,1,1);x.fillRect(11,9,1,1)}}
  const fc=FACE[cfg.face]||[];if(d!==0||cfg.face==='scarf'){const o=d===2?-1:d===3?1:0;fc.forEach(([px,py,col])=>{x.fillStyle=col;x.fillRect(Math.max(0,Math.min(15,px+(cfg.face==='scarf'?0:o))),py,1,1)})}
  const item=withKey?HAND.key:(HAND[cfg.hand]||[]);if(d!==0)item.forEach(([px,py,col])=>{x.fillStyle=col;x.fillRect(d===2?15-px:px,py,1,1)});
  return cv}
const SPR=[],SPRK=[];let LOOK={};
function buildSprites(cfg){LOOK=cfg||{};[0,1,2,3].forEach(d=>{SPR[d]=makeSprite(LOOK,d);SPRK[d]=makeSprite(LOOK,d,true)});delete CACHE.icS}
buildSprites({});
// Geheimes Juwel (rot) und geheimes Portal (lila Wirbel) – nur im Editor sichtbar
const GEM=(()=>{const c=mk(),x=c.getContext('2d'),P=pen(x);const rows=[[4,6,9],[5,5,10],[6,4,11],[7,4,11],[8,5,10],[9,6,9],[10,7,8]];
  rows.forEach(([y,a,b])=>{P(a-1,y,'#4a0810');P(b+1,y,'#4a0810');for(let xx=a;xx<=b;xx++)P(xx,y,y<=5?'#ff9aa8':xx<8?'#e8283c':'#a0101e')});P(6,3,'#4a0810',4,1);P(7,11,'#4a0810',2,1);P(6,5,'#ffffff');P(12,3,'#ffffff');return c})();
const PORTAL=(()=>{const c=mk(),x=c.getContext('2d'),P=pen(x);for(let y=0;y<16;y++)for(let xx=0;xx<16;xx++){const dx=xx-7.5,dy=y-7.5,d=Math.hypot(dx,dy),a=Math.atan2(dy,dx);if(d>6.5)continue;
  const sw=Math.sin(a*3+d*1.3);P(xx,y,d>5.6?'#2a0a50':sw>.3?'#d8a8ff':sw>-.3?'#8a4ad8':'#4a1a90')}P(7,7,'#ffffff',2,2);return c})();
// Risse in der Wand (1. und 2. Stoß), 16x22 passend zu überstehenden Brocken
const CRACKS=[1,2].map(n=>{const c=mkc(16,22),x=c.getContext('2d'),P=pen(x),col='#0e1a30';
  const a=[[8,6],[7,7],[7,8],[8,9],[9,10],[9,11],[8,12],[8,13]],b=[[4,9],[5,10],[6,10],[7,11],[10,8],[11,8],[12,9],[12,10],[13,11],[6,14],[5,15],[10,14],[11,15],[11,16],[8,14],[8,15],[9,16]];
  a.forEach(([u,v])=>{P(u,v,col);P(u+1,v,'#ffffff')});if(n===2)b.forEach(([u,v])=>{P(u,v,col);P(u,v-1,'#e8f8ff')});return c});
// Risse passend zur Brockenform: mittlerer Brocken = Original, klein/groß = gleiches Muster auf die Form umgerechnet und auf den Brocken zugeschnitten
const CRK_A=[[8,0],[7,1],[7,2],[8,3],[9,4],[9,5],[8,6],[8,7]],CRK_B=[[[7,5],[6,4],[5,4],[4,3]],[[9,3],[10,2],[11,2],[12,3],[12,4],[13,5]],[[7,7],[6,8],[5,9]],[[8,7],[8,8],[8,9],[9,10]],[[9,6],[10,8],[11,9],[11,10]]];
function crackOver(ch,v,n){if(ch==='#')return{c:CRACKS[n-1],ox:0,oy:6};return cached('cr'+ch+v+n,()=>{const o=objImg(ch,v);const c=mkc(o.c.width,o.c.height),x=c.getContext('2d'),P=pen(x);
  const B=ch==='k'?{x0:3,w:9.5,y0:4.5,h:10}:{x0:-3.5,w:23,y0:-15,h:29};const map=([u,v2])=>[Math.round(B.x0+(u-.5)/14*B.w)+o.ox,Math.round(B.y0+(v2+6)/20*B.h)+o.oy];
  const line=(pts,hi,col)=>{for(let i=0;i<pts.length-1;i++){let[x0,y0]=map(pts[i]);const[x1,y1]=map(pts[i+1]);const dx=Math.abs(x1-x0),dy=Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx-dy;
    for(;;){if(hi)P(x0+hi[0],y0+hi[1],hi[1]?'#e8f8ff':'#ffffff');P(x0,y0,col);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>-dy){e-=dy;x0+=sx}if(e2<dx){e+=dx;y0+=sy}}}};
  const D='#0e1a30';
  if(ch==='k'){const px=(pts,hx,hy,hc)=>pts.forEach(([u,w])=>{P(u+o.ox+hx,w+o.oy+hy,hc);P(u+o.ox,w+o.oy,D)});
    px([[8,6],[7,7],[7,8],[8,9],[8,10],[7,11]],1,0,'#ffffff');if(n===2){px([[6,9],[5,10]],0,-1,'#e8f8ff');px([[9,8],[10,9]],0,-1,'#e8f8ff');px([[8,12]],1,0,'#e8f8ff')}}
  else{line(CRK_A,[1,0],D);line([[8,7],[8,10],[7,12]],[1,0],D);
    if(n===2)[CRK_B[0],CRK_B[1],CRK_B[3]].forEach(b=>line(b,[0,-1],D))}
  x.globalCompositeOperation='destination-in';x.drawImage(o.c,0,0);return{c,ox:o.ox,oy:o.oy}})}
const GEM_URL=(()=>{const c=mkc(12,12),x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(GEM,2,2,12,12,0,0,12,12);return c.toDataURL()})();
// Eistaler: Münz-Symbol
const COIN=(()=>{const c=mkc(12,12),x=c.getContext('2d'),P=pen(x);
  for(let y=0;y<12;y++)for(let xx=0;xx<12;xx++){const d=Math.hypot(xx-5.5,y-5.5);if(d<=5.8)P(xx,y,d>4.8?'#1f5a98':d>3.9?'#5ec8f0':'#bdeeff')}
  P(5,2,'#ffffff',2,8);P(2,5,'#ffffff',8,2);P(3,3,'#ffffff',1,1);P(8,3,'#ffffff',1,1);P(3,8,'#ffffff',1,1);P(8,8,'#ffffff',1,1);P(5,5,'#5ec8f0',2,2);return c})();
const COIN_URL=COIN.toDataURL();
// Kleines Vorschaubild (Palette, Legende)
function iconCanvas(ch){return cached('ic'+ch,()=>{const c=mk(),x=c.getContext('2d');x.imageSmoothingEnabled=false;
  if(isStone(ch))x.drawImage(stoneImg(0),0,0);else{x.fillStyle=x.createPattern(ICE_PAT,'repeat');x.fillRect(0,0,16,16)}
  const f=flatImg(ch,'');if(f)x.drawImage(f,0,0);
  const o=objImg(ch,.3);if(o){const s=Math.min(1,16/o.c.height,16/o.c.width),w=o.c.width*s,h=o.c.height*s;x.drawImage(o.c,(16-w)/2,16-h,w,h)}
  if(ch==='J'||ch==='Y'){x.drawImage(objImg('#',.3).c,0,8,16,16,0,0,16,16);x.drawImage(ch==='J'?GEM:PORTAL,0,0)}
  if(ch==='S')x.drawImage(SPR[1],0,0);if(ch==='z'){const f2=flatImg('z','mk');x.drawImage(f2,0,0)}if(ch==='m'){x.drawImage(flatImg('m','1'),0,0)}return c})}
function drawCracks(x,cells,hits){for(const k in hits){const[r,c]=k.split(',').map(Number),n=hits[k];if(!(n>0&&n<3)||!cells[r]||!cells[r][c])continue;const ch=cells[r][c][0];if(!WALL.includes(ch))continue;
  const cr=crackOver(ch,hsh(r,c,5),n);x.drawImage(cr.c,c*16-cr.ox,r*16-cr.oy)}}
// --- Spielfeld zeichnen ---
// opt: {P, st (Spielzustand), ghost (Editor), hide (Würfel ausblenden), got (gerade gesammelt), wrap}
function drawBoard(cv,g,opt){opt=opt||{};const H=g.length,W=g[0].length,FW=W*16+ML+MR,FH=H*16+MT+MB;
  if(cv.width!==FW||cv.height!==FH){cv.width=FW;cv.height=FH;cv._pat=null}const x=cv.getContext('2d');x.imageSmoothingEnabled=false;
  const P=opt.P,st=opt.st,allIt=st?st.it.every(v=>v):true;
  const cells=[];for(let r=0;r<H;r++){cells.push([]);for(let c=0;c<W;c++){let ch=g[r][c],va='';const i=r*W+c;
    if(P&&st){if(ch==='%'){const b=st.br[P.crack.get(i)];va=(opt.brk&&opt.brk.has(i))||(b>=1&&!(st.r===r&&st.c===c))?'b':''}
      else if(ch==='u'&&st.fl[P.water.get(i)])va='f';
      else if(ch==='*'&&(st.it[P.items.get(i)]||(opt.got&&opt.got.has(i))))ch='.';
      else if(ch==='q'&&(st.ky[P.keys.get(i)]||(opt.gotK&&opt.gotK.has(i))))ch='.';
      else if(ch==='l'&&(st.lk[P.locks.get(i)]||(opt.open&&opt.open.has(i))))ch='.';
      else if(ch==='r'&&st.rb[P.brittle.get(i)])ch='x';
      else if(ch==='m'&&P.melt.has(i))va=st.mv>=MELT?'h':String(Math.floor(st.mv*3/MELT));
      else if(ch==='G'&&!allIt)va='L'}
    else if(ch==='G'&&opt.locked)va='L';
    if(ch==='z'&&opt.ghost)va='mk';if(ch==='m'&&!st)va='0';
    cells[r].push([ch,va])}}
  x.clearRect(0,0,FW,FH);x.drawImage(frameImg(W,H,!!opt.wrap),0,0);
  x.save();x.translate(ML,MT);const pat=cv._pat||(cv._pat=x.createPattern(ICE_PAT,'repeat'));const filled2=i=>P&&st&&P.water.has(i)&&st.fl[P.water.get(i)]===2;
  const stoneAt=(r,c)=>r>=0&&c>=0&&r<H&&c<W&&isStone(cells[r][c][0]);
  for(let r=0;r<H;r++)for(let c=0;c<W;c++){const[ch,va]=cells[r][c],X=c*16,Y=r*16,Pp=pen(x,X,Y);
    if(isStone(ch))x.drawImage(stoneImg(Math.floor(hsh(r,c,3)*4)),X,Y);
    else{x.fillStyle=pat;x.fillRect(X,Y,16,16);
      if(stoneAt(r-1,c))Pp(0,0,'#f2fbff',16,1);if(stoneAt(r+1,c)){Pp(0,14,'#9ccbe3',16,1);Pp(0,15,'#78acca',16,1)}
      if(stoneAt(r,c-1))Pp(0,0,'#e4f6ff',1,16);if(stoneAt(r,c+1))Pp(15,0,'#9ccbe3',1,16)}
    const f=flatImg(ch,va);if(f)x.drawImage(f,X,Y)}
  x.fillStyle='rgba(16,50,96,.16)';x.fillRect(0,0,W*16,3);x.fillRect(0,0,2,H*16);
  const cubeSet=new Set(st?st.cb.filter(i=>i!==opt.hide):[]),cube2Set=new Set(st?st.cb2.filter(i=>i!==opt.hide):[]);
  const refl=(r,c)=>{if(r<0||c<0||r>=H||c>=W)return false;const[ch,va]=cells[r][c];if(isStone(ch)||OBJ.includes(ch))return false;
    if(ch==='~'||(ch==='u'&&va!=='f')||(ch==='%'&&va==='b')||(ch==='m'&&va==='h'))return false;return!cubeSet.has(r*W+c)&&!cube2Set.has(r*W+c)&&!filled2(r*W+c)&&!(st&&st.cb3.some(v=>(v>>2)===r*W+c))};
  // Boden spiegelt auch unter Objekten (Objekt wird danach darübergezeichnet)
  const floorRefl=(r,c)=>{if(r<0||c<0||r>=H||c>=W)return false;const[ch,va]=cells[r][c];if(isStone(ch))return false;return!(ch==='~'||(ch==='u'&&va!=='f')||(ch==='%'&&va==='b')||(ch==='m'&&va==='h'))};
  const objs=[];for(let r=0;r<H;r++)for(let c=0;c<W;c++){const ch=cells[r][c][0];if(OBJ.includes(ch))objs.push([r,c,ch])}
  cubeSet.forEach(i=>objs.push([Math.floor(i/W),i%W,'o']));cube2Set.forEach(i=>objs.push([Math.floor(i/W),i%W,'O']));if(st)st.cb3.forEach(v=>{const i=v>>2;if(i!==opt.hide)objs.push([Math.floor(i/W),i%W,String((v&3)+1)])});
  if(P&&st)P.water.forEach((wi,i)=>{if(st.fl[wi]===2)objs.push([Math.floor(i/W),i%W,'W'])});
  objs.sort((a,b)=>a[0]-b[0]);
  objs.forEach(([r,c,ch])=>{const o=objImg(ch,hsh(r,c,5)),sx=c*16-o.ox,ex=sx+o.c.width;
    for(let cc=Math.floor(sx/16);cc<=Math.floor((ex-1)/16);cc++)for(let k=1;k<=2;k++){if(!floorRefl(r+k,cc))continue;
      const x0=Math.max(cc*16,sx),x1=Math.min(cc*16+16,ex);x.save();x.beginPath();x.rect(x0,(r+k)*16,x1-x0,16);x.clip();x.globalAlpha=(k===1?.24:.15)*(cc===c?1:.85);x.translate(0,(r+1)*32);x.scale(1,-1);x.drawImage(o.c,sx,r*16-o.oy);x.restore()}});
  objs.forEach(([r,c,ch])=>{const o=objImg(ch,hsh(r,c,5));x.drawImage(o.c,c*16-o.ox,r*16-o.oy)});
  // Vordergrund: der nach oben überstehende Teil von Felsen & Co. liegt über der Figur (verdeckt sie, wenn sie dahinter steht)
  if(opt.fg){const f=opt.fg;if(f.width!==FW||f.height!==FH){f.width=FW;f.height=FH}const fx=f.getContext('2d');fx.imageSmoothingEnabled=false;fx.clearRect(0,0,FW,FH);fx.save();fx.translate(ML,MT);
    objs.forEach(([r,c,ch])=>{const o=objImg(ch,hsh(r,c,5));if(o.oy>0)fx.drawImage(o.c,0,0,o.c.width,o.oy,c*16-o.ox,r*16-o.oy,o.c.width,o.oy)});if(opt.hits)drawCracks(fx,cells,opt.hits);fx.restore()}
  if(opt.mask){const m=opt.mask;if(m.width!==W*16||m.height!==H*16){m.width=W*16;m.height=H*16}const mx=m.getContext('2d');mx.clearRect(0,0,m.width,m.height);mx.fillStyle='#fff';
    for(let r=0;r<H;r++)for(let c=0;c<W;c++)if(refl(r,c))mx.fillRect(c*16,r*16,16,16)}
  if(opt.sec){for(let r=0;r<H;r++)for(let c=0;c<W;c++){const v=opt.sec[r]&&opt.sec[r][c];if(v==='J'||v==='Y')x.drawImage(v==='J'?GEM:PORTAL,c*16,r*16)}}
  if(opt.hits&&!opt.fg)drawCracks(x,cells,opt.hits);
  if(opt.marks){const mk=flatImg('z','mk');x.globalAlpha=.8;for(let r=0;r<H;r++)for(let c=0;c<W;c++)if(opt.marks[r]&&opt.marks[r][c])x.drawImage(mk,c*16,r*16);x.globalAlpha=1}
  if(opt.ghost)for(let r=0;r<H;r++)for(let c=0;c<W;c++)if(cells[r][c][0]==='S'){x.globalAlpha=.65;x.drawImage(SPR[1],c*16,r*16);x.globalAlpha=1}
  x.restore()}
