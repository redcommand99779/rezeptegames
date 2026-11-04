// Münzstand der Rezepte-Spiele.
// Er liegt im Browser (localStorage, Schlüssel "rezeptecoins"). Die Rezeptseite (/websiterezepte/) liegt unter
// derselben Hauptadresse und kann ihn deshalb lesen. Wer sich auskennt, kann den Wert ändern: es geht hier nur
// um ein Spiel, nichts Wichtiges darf an den Coins hängen.
const COIN_KEY = "rezeptecoins";

function coinsLesen() {
  try {
    const zahl = parseInt(localStorage.getItem(COIN_KEY), 10);
    return zahl > 0 ? zahl : 0;
  } catch {
    return 0;
  }
}

function coinsAnzeigen() {
  document.querySelectorAll("[data-coins]").forEach(el => { el.textContent = coinsLesen(); });
  abzeichenAnzeigen();
}

// Insgesamt gesammelte Coins für das Abzeichen (Ausgaben auf der Rezeptseite senken sie nicht)
const GESAMT_KEY = "rezeptecoinsGesamt";

function coinsGesamt() {
  try {
    return Math.max(parseInt(localStorage.getItem(GESAMT_KEY), 10) || 0, coinsLesen());
  } catch {
    return coinsLesen();
  }
}

// Abzeichen nach gesammelten Coins. Dieselbe Liste steht in websiterezepte/app.js.
const ABZEICHEN = [[0, "Küchenneuling"], [30, "Küchenhilfe"], [100, "Hobbykoch"], [250, "Backprofi"], [600, "Küchenchef"], [1500, "Meisterkoch"]];

function abzeichenAnzeigen() {
  const gesamt = coinsGesamt();
  const aktuell = [...ABZEICHEN].reverse().find(a => gesamt >= a[0]);
  const naechstes = ABZEICHEN.find(a => a[0] > gesamt);

  document.querySelectorAll("[data-abzeichen]").forEach(el => {
    el.textContent = aktuell[1];
    el.title = naechstes ? `Noch ${naechstes[0] - gesamt} Coins bis „${naechstes[1]}“` : "Höchster Titel erreicht";
  });
}

// Schreibt Coins gut und gibt die gutgeschriebene Menge zurück (ohne Browser-Speicher wären es 0)
function coinsGutschreiben(menge) {
  const gutschrift = Math.max(0, Math.floor(menge));
  if (!gutschrift) return 0;

  const gesamtNeu = coinsGesamt() + gutschrift;
  try {
    localStorage.setItem(COIN_KEY, String(coinsLesen() + gutschrift));
    localStorage.setItem(GESAMT_KEY, String(gesamtNeu));
  } catch {
    return 0;
  }
  coinsAnzeigen();
  return gutschrift;
}

document.addEventListener("DOMContentLoaded", coinsAnzeigen);
window.addEventListener("storage", coinsAnzeigen);
