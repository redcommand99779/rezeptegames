const SYMBOLE = ["🍎", "🍌", "🍇", "🍓", "🥕", "🍕", "🧁", "🍪"];

let karten = [];
let offen = [];
let gefunden = new Set();
let zuege = 0;
let gesperrt = false;

const feld = document.getElementById("feld");
const zuegeAnzeige = document.getElementById("zuege");
const meldung = document.getElementById("meldung");

function mischen(liste) {
  const kopie = [...liste];
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

function neuesSpiel() {
  karten = mischen([...SYMBOLE, ...SYMBOLE]);
  offen = [];
  gefunden = new Set();
  zuege = 0;
  gesperrt = false;
  zuegeAnzeige.textContent = "0";
  meldung.textContent = "";
  zeichnen();
}

function zeichnen() {
  feld.innerHTML = karten.map((symbol, i) => {
    const sichtbar = offen.includes(i) || gefunden.has(i);
    const klasse = gefunden.has(i) ? "gefunden" : offen.includes(i) ? "offen" : "";
    return `<button type="button" class="memory-karte ${klasse}" data-index="${i}" aria-label="${sichtbar ? symbol : "Verdeckte Karte"}">${sichtbar ? symbol : "?"}</button>`;
  }).join("");
}

function gewonnen() {
  // 5 Coins fürs Durchspielen, bis zu 10 weitere für wenige Züge (16 Karten brauchen mindestens 8 Züge)
  const bonus = Math.min(10, Math.max(0, 20 - zuege));
  const coins = coinsGutschreiben(5 + bonus);
  spielRunde("memory");
  meldung.textContent = `Geschafft in ${zuege} Zügen! +${coins} Coins`;
}

feld.addEventListener("click", e => {
  const knopf = e.target.closest(".memory-karte");
  if (!knopf || gesperrt) return;

  const index = Number(knopf.dataset.index);
  if (offen.includes(index) || gefunden.has(index)) return;

  offen.push(index);
  zeichnen();
  if (offen.length < 2) return;

  zuege += 1;
  zuegeAnzeige.textContent = zuege;
  const [a, b] = offen;

  if (karten[a] === karten[b]) {
    gefunden.add(a);
    gefunden.add(b);
    offen = [];
    zeichnen();
    if (gefunden.size === karten.length) gewonnen();
  } else {
    gesperrt = true;
    setTimeout(() => {
      offen = [];
      gesperrt = false;
      zeichnen();
    }, 900);
  }
});

document.getElementById("neu").addEventListener("click", neuesSpiel);
neuesSpiel();
