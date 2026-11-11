// Gibt jedem Level einen passenden Namen (de/en/tr), abhängig von Mechanik und Schwierigkeit.
// Eigene Namen (nicht "Ort 3" o. ä.) bleiben erhalten.
const fs=require('fs');
// Nomen: [deutsch, Geschlecht m/f/n, englisch, türkisch]
const N={
 base:[['Pfad','m','Path','Patika'],['Gang','m','Passage','Geçit'],['Halle','f','Hall','Salon'],['Grotte','f','Grotto','Mağara'],['Kammer','f','Chamber','Oda'],['Ebene','f','Plain','Ova'],['Spalte','f','Crevice','Yarık'],['Tal','n','Valley','Vadi'],['Feld','n','Field','Alan'],['Becken','n','Basin','Havza'],['Hof','m','Court','Avlu'],['Steig','m','Trail','Keçiyolu'],['Nische','f','Nook','Köşe'],['Gewölbe','n','Vault','Kemer']],
 item:[['Schatz','m','Treasure','Hazine'],['Fund','m','Find','Buluntu'],['Funkeln','n','Sparkle','Pırıltı'],['Kristallnest','n','Crystal Nest','Kristal Yuvası'],['Schimmer','m','Glimmer','Işıltı']],
 key:[['Tresor','m','Safe','Kasa'],['Riegel','m','Bolt','Sürgü'],['Pforte','f','Gate','Kapı'],['Schlüsselloch','n','Keyhole','Anahtar Deliği'],['Verlies','n','Dungeon','Zindan']],
 cube:[['Schiebung','f','Shove','İtiş'],['Blockade','f','Blockade','Barikat'],['Lager','n','Depot','Depo'],['Rampe','f','Ramp','Rampa'],['Stapel','m','Stack','Yığın']],
 hole:[['Kluft','f','Chasm','Uçurum'],['Brunnen','m','Well','Kuyu'],['Senke','f','Hollow','Çukur'],['Abgrund','m','Abyss','Derinlik']],
 melt:[['Tauwasser','n','Meltwater','Erime Suyu'],['Pfütze','f','Puddle','Su Birikintisi'],['Schmelze','f','Thaw','Çözülme'],['Quelle','f','Spring','Pınar']],
 spike:[['Stachelgrat','m','Spike Ridge','Diken Sırtı'],['Dornhecke','f','Thorn Hedge','Dikenli Çit'],['Zacke','f','Spike','Sivri Uç'],['Klinge','f','Blade','Bıçak']],
 brittle:[['Bruch','m','Fracture','Kırık'],['Splitter','m','Shard','Kıymık'],['Riss','m','Rift','Çatlak'],['Scherbe','f','Fragment','Parça']],
 arrow:[['Kreuzung','f','Crossing','Kavşak'],['Wirbel','m','Whirl','Girdap'],['Weiche','f','Switch','Makas'],['Strömung','f','Current','Akıntı']],
 tele:[['Spiegel','m','Mirror','Ayna'],['Tor','n','Gateway','Geçit Kapısı'],['Sprung','m','Leap','Sıçrayış'],['Echo','n','Echo','Yankı']],
 wrap:[['Schleife','f','Loop','Döngü'],['Ring','m','Ring','Halka'],['Kreis','m','Circle','Çember'],['Strudel','m','Swirl','Burgaç']]};
// Adjektive: [deutscher Stamm, englisch, türkisch]
const A={
 easy:[['still','Quiet','Sessiz'],['klein','Little','Küçük'],['hell','Bright','Aydınlık'],['sanft','Gentle','Yumuşak'],['frisch','Fresh','Taze'],['klar','Clear','Berrak']],
 mid:[['eisig','Icy','Buzlu'],['glatt','Slick','Kaygan'],['kalt','Cold','Soğuk'],['blau','Blue','Mavi'],['frostig','Frosty','Ayazlı'],['verschneit','Snowy','Karlı'],['weit','Wide','Geniş'],['schief','Crooked','Eğri']],
 hard:[['tückisch','Treacherous','Hain'],['verflixt','Tricky','Çetrefilli'],['wild','Wild','Vahşi'],['finster','Gloomy','Kasvetli'],['eisern','Iron','Demir'],['steil','Steep','Dik'],['bitterkalt','Bitter','Dondurucu']],
 secret:[['verborgen','Hidden','Gizli'],['geheim','Secret','Gizemli'],['vergessen','Forgotten','Unutulmuş'],['verwunschen','Enchanted','Büyülü'],['versunken','Sunken','Batık'],['schimmernd','Shimmering','Parıldayan'],['stumm','Silent','Dilsiz']]};
const END={m:'er',f:'e',n:'es'};const cap=s=>s[0].toUpperCase()+s.slice(1);
const deAdj=(stem,g)=>{let s=stem;if(/er$/.test(s)&&!/^(bitterkalt)$/.test(s)&&s!=='verborgen')s=s.replace(/er$/,'r');return cap(s)+END[g]}; // finster -> Finstrer? (s. unten)
function deName(adj,noun){const[w,g]=noun;let a=adj[0];let form;
  if(a==='finster')form={m:'Finsterer',f:'Finstere',n:'Finsteres'}[g];else if(a==='eisern')form={m:'Eiserner',f:'Eiserne',n:'Eisernes'}[g];
  else form=cap(a)+END[g];return form+' '+w}
const themeOf=L=>{const s=L.map.join('');const t=[];if(/q/.test(s))t.push('key');if(/[\^v<>]/.test(s))t.push('arrow');if(/[ABC]/.test(s))t.push('tele');if(/r|%/.test(s))t.push('brittle');if(/[nsew1234x]/.test(s))t.push('spike');
  if(/m/.test(s))t.push('melt');if(/[oO]/.test(s))t.push('cube');if(/[u~]/.test(s))t.push('hole');if(/\*/.test(s))t.push('item');if(L.wrap)t.push('wrap');return t};
const generic=(name,place)=>!name||new RegExp('^'+place.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'( \\d+)?( ✦)?$').test(name)||/^Level \d+$/.test(name);
let seedc=1;const rnd=()=>{seedc=(seedc*1103515245+12345)&0x7fffffff;return seedc/0x7fffffff};
const SPECIAL={'Kerems Geheimnis ✦':{de:'Kerems Pfad',en:'Kerem’s Path',tr:'Kerem’in Yolu'}};
for(const f of process.argv.slice(2)){const J=JSON.parse(fs.readFileSync(f));seedc=f.length*7919;const used=new Set();
  for(const p of J.places){const norm=p.levels.filter(l=>!l.secret),pars=norm.map(l=>l.par).sort((a,b)=>a-b);
    p.levels.forEach((L,i)=>{if(SPECIAL[L.name]){L.nm=SPECIAL[L.name];L.name=L.nm.de;return}
      if(!generic(L.name,p.name)){if(!L.nm)L.nm={de:L.name,en:L.name,tr:L.name};return}
      const th=themeOf(L);const tier=L.secret?'secret':(L.par<=pars[3]?'easy':L.par<=pars[6]?'mid':'hard');
      let nm=null;for(let k=0;k<400&&!nm;k++){const pool=(rnd()<.7&&th.length)?N[th[Math.floor(rnd()*th.length)]]:N.base;const noun=pool[Math.floor(rnd()*pool.length)];const adj=A[tier][Math.floor(rnd()*A[tier].length)];
        const de=deName(adj,noun);if(used.has(de))continue;used.add(de);nm={de,en:adj[1]+' '+noun[2],tr:adj[2]+' '+noun[3]}}
      L.nm=nm;L.name=nm.de})}
  fs.writeFileSync(f,JSON.stringify(J));const ex=J.places[0].levels.slice(0,4).map(l=>l.nm.de+' / '+l.nm.en+' / '+l.nm.tr);console.log(f,'→',ex.join(' | '))}
