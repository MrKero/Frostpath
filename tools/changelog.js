// Erzeugt CHANGELOG.md aus der Versionsliste im Spiel (src/i18n.js)
const fs=require('fs'),path=require('path');const root=path.join(__dirname,'..');
const {I18N,VHIST,APP_DATE}=new Function(fs.readFileSync(path.join(root,'src/i18n.js'),'utf8')+';return{I18N,VHIST,APP_DATE:typeof APP_DATE!=="undefined"?APP_DATE:""}')();
const h=I18N.de.hist;let md='# Changelog\n\nAlle Versionen von Frostpath (bis 2.8 „Eisrutsche“), neueste zuerst.\n\n';
for(let i=VHIST.length-1;i>=0;i--)md+=`## ${VHIST[i]}\n\n- ${h[i]}\n\n`;
fs.writeFileSync(path.join(root,'CHANGELOG.md'),md);console.log('CHANGELOG.md:',VHIST.length,'Versionen');
