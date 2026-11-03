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
}

// Schreibt Coins gut und gibt die gutgeschriebene Menge zurück (ohne Browser-Speicher wären es 0)
function coinsGutschreiben(menge) {
  const gutschrift = Math.max(0, Math.floor(menge));
  if (!gutschrift) return 0;

  try {
    localStorage.setItem(COIN_KEY, String(coinsLesen() + gutschrift));
  } catch {
    return 0;
  }
  coinsAnzeigen();
  return gutschrift;
}

document.addEventListener("DOMContentLoaded", coinsAnzeigen);
window.addEventListener("storage", coinsAnzeigen);
