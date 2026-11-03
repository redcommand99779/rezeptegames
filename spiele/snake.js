const FELD = 16;
const ZELLE = 20;
const TAKT = 140;

const RICHTUNGEN = {
  oben: { x: 0, y: -1 },
  unten: { x: 0, y: 1 },
  links: { x: -1, y: 0 },
  rechts: { x: 1, y: 0 }
};

const leinwand = document.getElementById("leinwand");
const ctx = leinwand.getContext("2d");
const aepfelAnzeige = document.getElementById("aepfel");
const bestAnzeige = document.getElementById("best");
const meldung = document.getElementById("meldung");
const startKnopf = document.getElementById("start");

let schlange = [];
let richtung = RICHTUNGEN.rechts;
let naechsteRichtung = RICHTUNGEN.rechts;
let apfel = { x: 0, y: 0 };
let aepfel = 0;
let timer = null;

function bestLesen() {
  try {
    return parseInt(localStorage.getItem("rc_snake_best"), 10) || 0;
  } catch {
    return 0;
  }
}

function bestSpeichern(wert) {
  try {
    localStorage.setItem("rc_snake_best", String(wert));
  } catch {
    // Ohne Browser-Speicher gilt der Bestwert nur bis zum Neuladen
  }
}

function neuerApfel() {
  do {
    apfel = { x: Math.floor(Math.random() * FELD), y: Math.floor(Math.random() * FELD) };
  } while (schlange.some(s => s.x === apfel.x && s.y === apfel.y));
}

function zeichnen() {
  ctx.fillStyle = "#0d1220";
  ctx.fillRect(0, 0, FELD * ZELLE, FELD * ZELLE);

  ctx.fillStyle = "#ff3b4e";
  ctx.shadowColor = "#ff3b4e";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(apfel.x * ZELLE + ZELLE / 2, apfel.y * ZELLE + ZELLE / 2, ZELLE / 2 - 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  schlange.forEach((teil, i) => {
    ctx.fillStyle = i === 0 ? "#5dff8a" : "#2fbf5f";
    ctx.fillRect(teil.x * ZELLE + 1, teil.y * ZELLE + 1, ZELLE - 2, ZELLE - 2);
  });
}

// 1 Coin pro Apfel, höchstens 30
function beenden() {
  clearInterval(timer);
  timer = null;
  const coins = coinsGutschreiben(Math.min(30, aepfel));
  if (aepfel > bestLesen()) bestSpeichern(aepfel);
  bestAnzeige.textContent = bestLesen();
  meldung.textContent = `Game Over mit ${aepfel} ${aepfel === 1 ? "Apfel" : "Äpfeln"}. +${coins} ${coins === 1 ? "Coin" : "Coins"}`;
  startKnopf.textContent = "Nochmal";
}

function schritt() {
  richtung = naechsteRichtung;
  const kopf = { x: schlange[0].x + richtung.x, y: schlange[0].y + richtung.y };
  const treffer = kopf.x < 0 || kopf.y < 0 || kopf.x >= FELD || kopf.y >= FELD ||
    schlange.some(s => s.x === kopf.x && s.y === kopf.y);
  if (treffer) {
    beenden();
    return;
  }

  schlange.unshift(kopf);
  if (kopf.x === apfel.x && kopf.y === apfel.y) {
    aepfel += 1;
    aepfelAnzeige.textContent = aepfel;
    neuerApfel();
  } else {
    schlange.pop();
  }
  zeichnen();
}

function starten() {
  clearInterval(timer);
  schlange = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }];
  richtung = naechsteRichtung = RICHTUNGEN.rechts;
  aepfel = 0;
  aepfelAnzeige.textContent = "0";
  meldung.textContent = "";
  neuerApfel();
  zeichnen();
  timer = setInterval(schritt, TAKT);
  startKnopf.textContent = "Neustart";
}

function lenken(name) {
  const neu = RICHTUNGEN[name];
  // Nicht direkt umdrehen
  if (neu.x + richtung.x !== 0 || neu.y + richtung.y !== 0) naechsteRichtung = neu;
}

const TASTEN = {
  ArrowUp: "oben", ArrowDown: "unten", ArrowLeft: "links", ArrowRight: "rechts",
  w: "oben", s: "unten", a: "links", d: "rechts"
};

document.addEventListener("keydown", e => {
  const name = TASTEN[e.key];
  if (!name) return;
  e.preventDefault();
  if (timer) lenken(name);
});

document.querySelector(".steuerkreuz").addEventListener("click", e => {
  const knopf = e.target.closest("[data-richtung]");
  if (knopf && timer) lenken(knopf.dataset.richtung);
});

let beruehrung = null;
leinwand.addEventListener("touchstart", e => { beruehrung = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: true });
leinwand.addEventListener("touchend", e => {
  if (!beruehrung || !timer) return;
  const dx = e.changedTouches[0].clientX - beruehrung.x;
  const dy = e.changedTouches[0].clientY - beruehrung.y;
  beruehrung = null;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
  if (Math.abs(dx) > Math.abs(dy)) lenken(dx > 0 ? "rechts" : "links");
  else lenken(dy > 0 ? "unten" : "oben");
}, { passive: true });

// Läuft das Spiel im Hintergrund weiter, wäre die Runde ohne Zutun vorbei: lieber pausieren und beenden
document.addEventListener("visibilitychange", () => {
  if (document.hidden && timer) beenden();
});

startKnopf.addEventListener("click", starten);
bestAnzeige.textContent = bestLesen();
schlange = [{ x: 8, y: 8 }];
neuerApfel();
zeichnen();
