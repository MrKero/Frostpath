// Baut das Spiel zu einer einzigen HTML-Datei.
//   node tools/build.js          -> dist/frostpath.html (eine Datei, läuft überall)
//   node tools/build.js --pwa    -> docs/ (GitHub Pages: installierbar, offline spielbar)
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'),src=f=>fs.readFileSync(path.join(root,'src',f),'utf8'),lvl=f=>fs.readFileSync(path.join(root,'levels',f),'utf8').trim();
const WORLDS={__KANTO__:'kanto.json',__FROSTKRONE__:'frostkrone.json',__NORDLICHT__:'nordlicht.json',__GLETSCHER__:'gletscher.json',__STERNENFROST__:'sternenfrost.json',__ENDLOS__:'endlos.json',__POLARWIRBEL__:'polarwirbel.json'};
let app=src('app.js');for(const[k,f]of Object.entries(WORLDS))app=app.replace(k,()=>lvl(f));
let html=src('shell.html').replace('__ENGINE__',()=>src('engine.js')).replace('__TILES__',()=>src('tiles.js')+'\n'+src('i18n.js')).replace('__APP__',()=>app);
const ver=(src('i18n.js').match(/APP_VERSION='([^']+)'/)||[])[1]||'dev';
const pwa=process.argv.includes('--pwa');
if(pwa){
  html=html.replace('</head>',`<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="icon-192.png"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="theme-color" content="#0b1222">\n</head>`)
    .replace('</body>',`<script>if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))</script>\n</body>`);
  const out=path.join(root,'docs');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'index.html'),html);
  fs.writeFileSync(path.join(out,'manifest.webmanifest'),JSON.stringify({name:'Frostpath – Der Weg durch das Eis',short_name:'Frostpath',start_url:'./',scope:'./',display:'standalone',orientation:'portrait',background_color:'#0b1222',theme_color:'#0b1222',
    icons:[{src:'icon-192.png',sizes:'192x192',type:'image/png'},{src:'icon-512.png',sizes:'512x512',type:'image/png'},{src:'icon-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]},null,2));
  fs.writeFileSync(path.join(out,'sw.js'),`// Offline-Cache: Version ${ver}
const C='frostpath-${ver}',F=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))))});
`);
  for(const f of['icon-192.png','icon-512.png'])fs.copyFileSync(path.join(root,'assets',f),path.join(out,f));
  fs.writeFileSync(path.join(out,'.nojekyll'),'');
  console.log('docs/ gebaut – Version',ver,(html.length/1024|0)+' KB');
}else{const out=path.join(root,'dist');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'frostpath.html'),html);console.log('dist/frostpath.html gebaut – Version',ver,(html.length/1024|0)+' KB')}
