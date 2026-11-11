# ❄️ Frostpath

*Der Weg durch das Eis*

**Frostpath** ist ein Eis-Rutsch-Puzzlespiel für den Browser, angelehnt an Momento+ und die Eishöhlen klassischer Rollenspiele: Du rutschst über das Eis und hältst erst an, wenn dich etwas stoppt. Finde den kürzesten Weg zur Leiter.

Das ganze Spiel steckt in **einer einzigen HTML-Datei** – ohne Server, ohne Abhängigkeiten, ohne Netzverbindung. Alle Grafiken und Sounds sind selbst gemacht (Pixel-Art auf Canvas, Klänge über die Web-Audio-API).

## Spielen

- **Online:** https://mrkero.github.io/Frostpath/
- **Als App aufs Handy:** Seite in Safari öffnen → Teilen → **Zum Home-Bildschirm**. Danach startet Frostpath wie eine App und läuft **komplett offline**.
- **Lokal:** `npm run build` und `dist/frostpath.html` im Browser öffnen.

Der Spielstand liegt nur auf deinem Gerät (`localStorage`). In den Einstellungen gibt es einen Backup-Code, mit dem du ihn auf ein anderes Gerät mitnehmen kannst.

## Inhalt

- **7 Welten · 35 Orte · 652 Level**
  - Frosthafen · Frostkrone · Nordlicht · Gletscherland · Sternenfrost · Endloses Eis · Polarwirbel (die letzten beiden randlos, Par ab 20)
  - außerhalb von Frosthafen hat **jedes Level ein eigenes Geheimlevel**: ein leicht zu findendes Juwel und ein gut verstecktes Portal (dreimal mit Anlauf gegen den richtigen Eisbrocken rutschen)
  - jedes Level hat einen eigenen Namen auf Deutsch, Englisch und Türkisch
- **Zufallslevel** im Spiel: Items, Schwierigkeit und randlos wählen, gelungene Level im Bau-Modus speichern
- **Bau-Modus** mit Editor, Lösungsprüfung (Par), Lösungs-Helfer („Lösbar machen“), Teilen per Code
- **Shop** mit Mützen, Gesichtern, Augenfarben, Anzügen, Schuhen (inkl. Spike-Schuhen) und Handgegenständen
- **27 Erfolge**, Geisterlauf, Tipps, Statistiken, drei Sprachen (Deutsch, Englisch, Türkisch)

## Spielelemente

| Feld | Wirkung |
|---|---|
| Eis | man rutscht weiter |
| Schnee / Stein | man bleibt darauf stehen |
| Eisbrocken (klein, mittel, groß) | Hindernis – hier können Juwelen und Portale versteckt sein |
| Kristall | einsammeln, bevor die Leiter öffnet |
| Schlüssel & Schloss | Schlüssel öffnet beim Durchrutschen ein Schloss |
| Eisblock / großer Block / Stachelblock | verschiebbar; der große friert im flachen Loch ein, der Stachelblock sticht von einer Seite |
| Risseis | bricht nach dem Überqueren zum Loch |
| Schmelzeis | schmilzt nach einigen Zügen weg |
| Bröckelwand | zerfällt beim ersten Stoß zu Stacheln |
| Löcher (flach / tief) | flache lassen sich mit Blöcken füllen |
| Stacheln / Richtungsstacheln | tödlich (bzw. nur von einer Seite) |
| Pfeile | lenken dich um |
| Teleporter | bringen dich zum Partnerfeld |
| offener Rand | wer rausrutscht, kommt gegenüber wieder rein |

## Projektaufbau

```
src/
  engine.js     Spielregeln, Löser (Breitensuche über alle Zustände), Level-Generator
  tiles.js      Pixel-Art: Felder, Figur, Shop-Artikel, Spielfeld zeichnen
  i18n.js       Texte (de/en/tr), Version und Versionsverlauf
  app.js        Oberfläche: Menüs, Spiel, Editor, Shop, Erfolge, Speichern
  shell.html    HTML-Gerüst + CSS (Schrift „Press Start 2P“ eingebettet)
levels/         eingebaute Welten als JSON
assets/         App-Icons
tools/
  build.js      baut alles zu einer HTML-Datei (dist/) bzw. zur Offline-App (docs/)
  lib9.js       Generator-Werkzeuge: Bergsteigen auf Par, Juwelen/Portale platzieren
  genw7.js      Level-Generator für Gletscherland und Sternenfrost
  genw9.js      Level-Generator für die randlosen Welten
  expand9.js    gibt jedem Level ein Geheimlevel, ein Juwel und ein Portal
  names9.js     Levelnamen (de/en/tr) passend zu Mechanik und Schwierigkeit
  changelog.js  erzeugt CHANGELOG.md aus dem Versionsverlauf
tests/
  engine.test.js   Zusammenspiel der Spielelemente
  levels.test.js   alle Level lösbar, Par stimmt
  secrets.test.js  alle Juwelen/Portale mit Anlauf erreichbar
docs/           fertige Offline-App für GitHub Pages
```

## Entwickeln

Voraussetzung: [Node.js](https://nodejs.org) ab Version 18. Es gibt keine Abhängigkeiten – `npm install` ist nicht nötig.

```bash
npm test             # Engine-, Level- und Geheimnis-Tests
npm run build        # dist/frostpath.html
npm run build:pages  # docs/ für GitHub Pages (installierbar, offline)
npm run changelog    # CHANGELOG.md aktualisieren
```

### Neue Version veröffentlichen

1. Änderungen in `src/` oder `levels/` machen.
2. In `src/i18n.js` `APP_VERSION` erhöhen und in `VHIST` sowie `hist` (de/en/tr) einen Eintrag ergänzen.
3. `npm test && npm run build:pages && npm run changelog`
4. Committen und pushen – GitHub Pages zeigt die neue Version, die installierte App holt sie beim nächsten Start mit Netz.

### GitHub Pages einschalten

Repository → **Settings → Pages** → *Deploy from a branch* → Branch `main`, Ordner **`/docs`** → Save.

## Mitwirkende

- **Kerem** – Idee, Spieldesign, Leveldesign, Tests
- Programmiert mit Unterstützung von Claude (Anthropic)

## Lizenzen

- Schrift: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) von CodeMan38, SIL Open Font License 1.1 – eingebettet in `src/shell.html`.
- Alle übrigen Grafiken, Sounds und Level sind eigene Werke dieses Projekts.

## Wie entstehen die Level?

Ein Generator verteilt Felder zufällig nach festen Anteilen pro Ort. Derselbe Generator steckt im Spiel (Modus „∞ Zufall“). Der Löser aus dem Spiel prüft jedes Level per Breitensuche über alle Spielzustände und bestimmt den kürzesten Weg (Par). Level, die unlösbar oder zu leicht sind oder bei denen die Mechaniken des Orts keine Rolle spielen, werden verworfen. Für schwere Level wird ein Kandidat zusätzlich Feld für Feld verändert („Bergsteigen“), bis sein Par hoch genug ist.
