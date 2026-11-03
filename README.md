# Rezepte-Spiele

Minispiele zur Rezeptseite (`redcommand99779/websiterezepte`). Statisch, nur HTML/CSS/vanilla JS, gehostet auf GitHub Pages unter `https://redcommand99779.github.io/rezeptegames/`.

- `index.html`: Startseite mit Münzstand und Spielkarten
- `spiele/`: `memory`, `2048`, `snake` (je `.html` + `.js`), alle am Handy bedienbar (Tippen, Wischen, Steuerkreuz)
- `coins.js`: Münzstand. Liegt im Browser (`localStorage`, Schlüssel `rezeptecoins`). Beide Seiten liegen unter derselben Hauptadresse (`redcommand99779.github.io`) und können ihn gemeinsam lesen. Der Wert ist nicht fälschungssicher, es ist ein Spiel.
- `stats.js`: GoatCounter-Zählung, dasselbe Konto (`theredcommand`) wie die Rezeptseite. Aufrufe heißen dort `rezeptegames/<Seite>`, Spielrunden `runde/<Spiel>` (die Spiele rufen am Rundenende `spielRunde("name")` auf). Der Admin-Modus der Rezeptseite (`localStorage` `adminModus`) zählt nicht mit.
- `schriften/typodermic/`: Nasalization mit Lizenz-PDF (selbst gehostet, wie auf der Rezeptseite)

## Coins pro Runde

| Spiel | Coins |
|---|---|
| Memory | 5 fürs Durchspielen, bis +10 für wenige Züge |
| 2048 | 1 pro 100 Punkte, höchstens 25 (Auszahlung beim Ende oder bei "Neue Runde") |
| Snake | 1 pro Apfel, höchstens 30 |

## Lokal testen

Beide Seiten brauchen einen Webserver. Im Rezeptseiten-Ordner definiert `.claude/launch.json` die Konfiguration `rezeptegames` (`python -m http.server 8124 --directory ..\rezeptegames`). Lokal haben beide Seiten verschiedene Ports und teilen den Münzstand nicht, erst online.
