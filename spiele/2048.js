const FARBEN = {
  2: "#2a4a5e", 4: "#2f6a7d", 8: "#00a8b8", 16: "#00c9d4", 32: "#00f0ff",
  64: "#5dff8a", 128: "#ffe14d", 256: "#ffb020", 512: "#ff6a00", 1024: "#ff3b4e", 2048: "#ff2ea6"
};

let raster = [];
let punkte = 0;
let vorbei = false;
let ausgezahlt = false;

const feld = document.getElementById("feld");
const punkteAnzeige = document.getElementById("punkte");
const bestAnzeige = document.getElementById("best");
const meldung = document.getElementById("meldung");

function bestLesen() {
  try {
    return parseInt(localStorage.getItem("rc_2048_best"), 10) || 0;
  } catch {
    return 0;
  }
}

function bestSpeichern(wert) {
  try {
    localStorage.setItem("rc_2048_best", String(wert));
  } catch {
    // Ohne Browser-Speicher gilt der Bestwert nur bis zum Neuladen
  }
}

function neueKachel() {
  const leer = [];
  raster.forEach((zeile, r) => zeile.forEach((wert, c) => { if (!wert) leer.push([r, c]); }));
  if (!leer.length) return;
  const [r, c] = leer[Math.floor(Math.random() * leer.length)];
  raster[r][c] = Math.random() < 0.9 ? 2 : 4;
}

// 1 Coin pro 100 Punkte, höchstens 25. Wird pro Runde nur einmal ausgezahlt.
function auszahlen() {
  if (ausgezahlt) return 0;
  ausgezahlt = true;
  return coinsGutschreiben(Math.min(25, Math.floor(punkte / 100)));
}

function neuesSpiel() {
  const coins = vorbei ? 0 : auszahlen();
  raster = Array.from({ length: 4 }, () => Array(4).fill(0));
  punkte = 0;
  vorbei = false;
  ausgezahlt = false;
  neueKachel();
  neueKachel();
  meldung.textContent = coins ? `+${coins} Coins aus der letzten Runde` : "";
  zeichnen();
}

function zeichnen() {
  feld.innerHTML = raster.flat().map(wert =>
    `<div class="kachel" style="${wert ? `background: ${FARBEN[wert] || "#ff2ea6"}; color: ${wert <= 4 ? "#E8E9FF" : "#0a0c16"}` : ""}">${wert || ""}</div>`
  ).join("");
  punkteAnzeige.textContent = punkte;
  bestAnzeige.textContent = bestLesen();
}

function zeileSchieben(zeile) {
  const zahlen = zeile.filter(Boolean);
  const ergebnis = [];
  for (let i = 0; i < zahlen.length; i++) {
    if (zahlen[i] === zahlen[i + 1]) {
      ergebnis.push(zahlen[i] * 2);
      punkte += zahlen[i] * 2;
      i += 1;
    } else {
      ergebnis.push(zahlen[i]);
    }
  }
  while (ergebnis.length < 4) ergebnis.push(0);
  return ergebnis;
}

function bewegen(richtung) {
  if (vorbei) return;
  const vorher = JSON.stringify(raster);

  const drehen = () => raster[0].map((_, c) => raster.map(zeile => zeile[c]));
  if (richtung === "links") raster = raster.map(zeileSchieben);
  else if (richtung === "rechts") raster = raster.map(z => zeileSchieben([...z].reverse()).reverse());
  else if (richtung === "oben") raster = drehen().map(zeileSchieben), raster = drehen();
  else raster = drehen().map(z => zeileSchieben([...z].reverse()).reverse()), raster = drehen();

  if (JSON.stringify(raster) === vorher) return;
  neueKachel();
  if (punkte > bestLesen()) bestSpeichern(punkte);

  const gehtWeiter = raster.flat().includes(0) ||
    raster.some((z, r) => z.some((w, c) => w === z[c + 1] || (raster[r + 1] && w === raster[r + 1][c])));
  if (!gehtWeiter) {
    vorbei = true;
    meldung.textContent = `Keine Züge mehr! +${auszahlen()} Coins`;
  }
  zeichnen();
}

const TASTEN = {
  ArrowLeft: "links", ArrowRight: "rechts", ArrowUp: "oben", ArrowDown: "unten",
  a: "links", d: "rechts", w: "oben", s: "unten"
};

document.addEventListener("keydown", e => {
  const richtung = TASTEN[e.key];
  if (!richtung) return;
  e.preventDefault();
  bewegen(richtung);
});

let start = null;
feld.addEventListener("touchstart", e => { start = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: true });
feld.addEventListener("touchend", e => {
  if (!start) return;
  const dx = e.changedTouches[0].clientX - start.x;
  const dy = e.changedTouches[0].clientY - start.y;
  start = null;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
  if (Math.abs(dx) > Math.abs(dy)) bewegen(dx > 0 ? "rechts" : "links");
  else bewegen(dy > 0 ? "unten" : "oben");
}, { passive: true });

document.getElementById("neu").addEventListener("click", neuesSpiel);
neuesSpiel();
