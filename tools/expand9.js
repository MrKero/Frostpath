// Jedes normale Level bekommt ein Juwel, ein Portal und ein eigenes Geheimlevel (Reihenfolge: n1, ✦1, n2, ✦2, …)
const fs=require('fs');const L9=require(require('path').join(__dirname,'lib9.js'));const T0=Date.now();
for(const file of process.argv.slice(2)){const J=JSON.parse(fs.readFileSync(file));const R=L9.X.rng(file.length*977);
  for(const p of J.places){if(p.levels.length>=20&&p.levels.every((l,i)=>!!l.secret===(i%2===1)))continue;const t1=Date.now();const lv=p.levels;const normals=[],oldSec={};let lastN=-1;
    lv.forEach((l,i)=>{if(l.secret){if(lastN>=0)oldSec[lastN]=l}else{lastN=normals.length;normals.push(l)}});
    // vorhandene Geheimlevel gehören zu dem Level mit dem alten Portal
    const portalOwner={};lv.forEach((l,i)=>{if(!l.secret&&l.sec&&l.sec.join('').includes('Y')){const ni=normals.indexOf(l);const s=lv.slice(i+1).find(x=>x.secret);if(s)portalOwner[ni]=s}});
    const out=[];
    normals.forEach((N,ni)=>{let sec=L9.placeSecrets(N,R);let NN=N;
      if(!sec){// zu wenige Brocken mit Anlauf: Level neu erzeugen (gleiche Mechaniken, gleicher Par)
        const o=L9.specFrom(N,N.par,N.par+2,1);const G=L9.gen(o,9000+ni*31+p.id.length,N.par-1,40000,L=>L9.runupInfo(L).size>=2);if(G){NN={name:N.name,map:G.map,wrap:!!G.wrap,par:G.par};sec=L9.placeSecrets(NN,R)}console.error('  neu erzeugt',p.name,ni+1,N.par,'->',NN.par,sec?'':'(ohne Geheimnis)')}
      const o={name:p.name+' '+(ni+1),map:NN.map,wrap:!!NN.wrap,par:NN.par};if(sec)o.sec=sec;out.push(o);
      let S=portalOwner[ni];if(S){S={name:S.name&&S.name.startsWith('Kerems')?S.name:p.name+' '+(ni+1)+' ✦',map:S.map,wrap:!!S.wrap,par:S.par,secret:true}}
      else{const G=L9.secretFor(NN,20000+ni*131+p.id.length*7);S={name:p.name+' '+(ni+1)+' ✦',map:G.map,wrap:!!G.wrap,par:G.par,secret:true}}
      out.push(S)});
    p.levels=out;fs.writeFileSync(file,JSON.stringify(J));
    console.error(file,p.name,out.map(l=>(l.secret?'✦':'')+l.par).join(' '),((Date.now()-t1)/1000|0)+'s',((Date.now()-T0)/60000).toFixed(1)+'min')}}
console.error('FERTIG expand');
