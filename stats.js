// Besucherstatistik über GoatCounter, dasselbe Konto wie die Rezeptseite (kostenlos, ohne Cookies).
// Aufrufe stehen dort als "rezeptegames/<Seite>", Spielrunden als "runde/<Spiel>". Leerer Code = es wird nichts gezählt.
const GOATCOUNTER_CODE = "theredcommand";

// Die Spiele melden damit das Ende einer Runde; ohne Statistik bleibt es wirkungslos
window.spielRunde = function () {};

(function () {
  if (!GOATCOUNTER_CODE) return;

  // Der eigene Admin-Modus der Rezeptseite (gleiche Herkunft) zählt nicht mit
  function adminModus() {
    try {
      return localStorage.getItem("adminModus") === "1";
    } catch {
      return false;
    }
  }

  function zaehlen(daten) {
    if (adminModus() || !window.goatcounter || !window.goatcounter.count) return;
    window.goatcounter.count(daten);
  }

  window.spielRunde = function (spiel) {
    zaehlen({ path: `runde/${spiel}`, title: `Spielrunde ${spiel}`, event: true });
  };

  window.goatcounter = { no_onload: true };

  const skript = document.createElement("script");
  skript.async = true;
  skript.src = "https://gc.zgo.at/count.js";
  skript.dataset.goatcounter = `https://${GOATCOUNTER_CODE}.goatcounter.com/count`;
  skript.addEventListener("load", () => {
    const datei = location.pathname.split("/").pop() || "index.html";
    zaehlen({ path: `rezeptegames/${datei}` });
  });
  document.head.appendChild(skript);
})();
