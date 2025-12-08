let metiers = [];
let formations = [];
let entreprises = [];
let relations = null;

async function loadData() {
  const [m, f, e, r] = await Promise.all([
    fetch("metiers.json").then((res) => res.json()),
    fetch("formations.json").then((res) => res.json()),
    fetch("entreprises.json").then((res) => res.json()),
    fetch("relations.json").then((res) => res.json())
  ]);

  metiers = m;
  formations = f;
  entreprises = e;
  relations = r;

  console.log("Données chargées :", {
    metiers: metiers.length,
    formations: formations.length,
    entreprises: entreprises.length,
    metierFormation: relations.metierFormation.length,
    entrepriseMetier: relations.entrepriseMetier.length
  });
}

/* ---------- AUTO-COMPLÉTION ---------- */

function populateDatalists() {
  const metierList = document.getElementById("options-metier");
  const formationList = document.getElementById("options-formation");
  const entrepriseList = document.getElementById("options-entreprise");

  metierList.innerHTML = "";
  formationList.innerHTML = "";
  entrepriseList.innerHTML = "";

  metiers.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m.nom;
    metierList.appendChild(opt);
  });

  formations.forEach((f) => {
    const opt = document.createElement("option");
    opt.value = f.nom;
    formationList.appendChild(opt);
  });

  entreprises.forEach((e) => {
    const opt = document.createElement("option");
    opt.value = e.nom;
    entrepriseList.appendChild(opt);
  });
}

/* ---------- UTILITAIRES GÉNÉRAUX ---------- */

function normalize(str) {
  return str
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Cherche d'abord une correspondance EXACTE sur le nom,
 * puis en fallback une correspondance "contient".
 */
function findByName(list, term) {
  const q = normalize(term);

  let exact = list.find((item) => normalize(item.nom) === q);
  if (exact) return exact;

  return list.find((item) => normalize(item.nom).includes(q)) || null;
}

function renderSummary(html) {
  document.getElementById("summary").innerHTML = html;
}

function renderResults(html) {
  document.getElementById("results").innerHTML = html;
}

function noResult(msg = "Aucun résultat trouvé.") {
  renderSummary(`<p>${msg}</p>`);
  renderResults("");
}

/* ---------- DÉFINITION DES SECTEURS ---------- */

const SECTORS = {
  SN: "Construction & maintenance navale",
  PA: "Pêche & aquaculture",
  NT: "Navigation & transport maritime",
  RE: "Recherche & environnement marin",
  SD: "Sécurité & défense maritime"
};

/**
 * Déduit un secteur à partir du nom du métier.
 */
function inferSectorFromMetier(metier) {
  const name = normalize(metier.nom || "");
  if (!name) return null;

  // Construction & maintenance navale
  if (
    name.includes("soudeur") ||
    name.includes("chaudron") ||
    name.includes("charpentier") ||
    name.includes("structure") ||
    name.includes("coque") ||
    name.includes("maintenance") ||
    name.includes("électricien") ||
    name.includes("electricien") ||
    name.includes("mécanicien") ||
    name.includes("mecanicien") ||
    name.includes("atelier") ||
    name.includes("industri")
  ) {
    return SECTORS.SN;
  }

  // Pêche & aquaculture
  if (
    name.includes("pêche") ||
    name.includes("peche") ||
    name.includes("pêcheur") ||
    name.includes("pecheur") ||
    name.includes("aquaculture") ||
    name.includes("ostréi") ||
    name.includes("ostrei") ||
    name.includes("conchylicult") ||
    name.includes("mytili")
  ) {
    return SECTORS.PA;
  }

  // Navigation & transport maritime
  if (
    name.includes("matelot") ||
    name.includes("officier") ||
    name.includes("quart") ||
    name.includes("navigation") ||
    name.includes("marine marchande") ||
    name.includes("capitaine") ||
    name.includes("logistique portuaire") ||
    name.includes("portuaire") ||
    name.includes("port")
  ) {
    return SECTORS.NT;
  }

  // Recherche & environnement marin
  if (
    name.includes("océanograph") ||
    name.includes("oceanograph") ||
    name.includes("biolog") ||
    name.includes("environnement") ||
    name.includes("environnem") ||
    name.includes("sciences de la mer") ||
    name.includes("science de la mer") ||
    name.includes("hydrograph") ||
    name.includes("chercheur")
  ) {
    return SECTORS.RE;
  }

  // Sécurité & défense maritime
  if (
    name.includes("marine nationale") ||
    name.includes("armée") ||
    name.includes("armee") ||
    name.includes("défense") ||
    name.includes("defense") ||
    name.includes("sécurité") ||
    name.includes("securite") ||
    name.includes("sauvetage") ||
    name.includes("sauveteur") ||
    name.includes("douane") ||
    name.includes("gendarmerie")
  ) {
    return SECTORS.SD;
  }

  return null;
}

/**
 * Déduit un secteur pour une entreprise, à partir du nom + activités.
 */
function inferSectorFromEntreprise(entreprise) {
  const raw = [
    entreprise.nom,
    entreprise.activites,
    entreprise.activite,
    entreprise.Activites,
    entreprise.Activite,
    entreprise.secteur,
    entreprise.Secteur
  ]
    .filter(Boolean)
    .join(" ");

  const text = normalize(raw);

  if (!text) return null;

  // Construction & maintenance navale
  if (
    text.includes("chantier") ||
    text.includes("construction navale") ||
    text.includes("naval") ||
    text.includes("navale") ||
    text.includes("chaudron") ||
    text.includes("soudure") ||
    text.includes("métallurgie") ||
    text.includes("metallurgie")
  ) {
    return SECTORS.SN;
  }

  // Pêche & aquaculture
  if (
    text.includes("pêche") ||
    text.includes("peche") ||
    text.includes("armement de pêche") ||
    text.includes("aquaculture") ||
    text.includes("conchylicult") ||
    text.includes("mytili") ||
    text.includes("ostréi") ||
    text.includes("ostrei")
  ) {
    return SECTORS.PA;
  }

  // Navigation & transport maritime
  if (
    text.includes("armateur") ||
    text.includes("transport maritime") ||
    text.includes("fret maritime") ||
    text.includes("logistique portuaire") ||
    text.includes("port") ||
    text.includes("terminal")
  ) {
    return SECTORS.NT;
  }

  // Recherche & environnement marin
  if (
    text.includes("ifremer") ||
    text.includes("recherche") ||
    text.includes("laboratoire") ||
    text.includes("environnement") ||
    text.includes("biodiversité") ||
    text.includes("biodiversite") ||
    text.includes("océanograph") ||
    text.includes("oceanograph")
  ) {
    return SECTORS.RE;
  }

  // Sécurité & défense maritime
  if (
    text.includes("marine nationale") ||
    text.includes("ministère des armées") ||
    text.includes("ministere des armees") ||
    text.includes("défense") ||
    text.includes("defense") ||
    text.includes("gendarmerie maritime") ||
    text.includes("sauvetage en mer") ||
    text.includes("sns") || // SNSM, etc.
    text.includes("douane")
  ) {
    return SECTORS.SD;
  }

  return null;
}

/* ---------- UTILITAIRES ENTREPRISES ---------- */

function getEntreprisesForMetiers(metiersList) {
  if (!metiersList || metiersList.length === 0) return [];

  const metierIds = new Set(metiersList.map((m) => m.id));

  const rels = relations.entrepriseMetier.filter((rel) =>
    metierIds.has(rel.metierId)
  );

  const entreprisesAssociees = entreprises.filter((e) =>
    rels.some((rel) => rel.entrepriseId === e.id)
  );

  const seen = new Set();
  const unique = [];
  for (const e of entreprisesAssociees) {
    if (!seen.has(e.id)) {
      seen.add(e.id);
      unique.push(e);
    }
  }
  return unique;
}

/**
 * Entreprises du même secteur qu'un libellé de secteur donné.
 */
function guessEntreprisesBySectorLabel(sectorLabel, excludeIds) {
  if (!sectorLabel) return [];
  const excluded = excludeIds || new Set();

  const candidates = entreprises.filter((e) => {
    if (excluded.has(e.id)) return false;
    const sec = inferSectorFromEntreprise(e);
    return sec === sectorLabel;
  });

  const seen = new Set();
  const unique = [];
  for (const e of candidates) {
    if (!seen.has(e.id)) {
      seen.add(e.id);
      unique.push(e);
    }
  }
  return unique;
}

/* ---------- AFFICHAGE CARTES ---------- */

function createCards(list, extraField) {
  if (!list || list.length === 0) {
    return "<p>Aucun résultat.</p>";
  }

  const seen = new Set();
  const unique = [];
  for (const item of list) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      unique.push(item);
    }
  }

  let html = '<div class="cards">';
  unique.forEach((item) => {
    const extraValue =
      extraField && item[extraField]
        ? String(item[extraField])
        : "";

    html += `
      <div class="card">
        <strong>${item.nom}</strong><br>
        ${extraValue ? `<small>${extraValue}</small>` : ""}
      </div>
    `;
  });
  html += "</div>";
  return html;
}

function createEntrepriseCards(list) {
  if (!list || list.length === 0) {
    return "<p>Aucun résultat.</p>";
  }

  const seen = new Set();
  const unique = [];
  for (const e of list) {
    if (!seen.has(e.id)) {
      seen.add(e.id);
      unique.push(e);
    }
  }

  let html = '<div class="cards">';
  unique.forEach((e) => {
    const localisation = e.localisation || e.ville || "";
    const secteurLabel = inferSectorFromEntreprise(e);

    html += `
      <div class="card">
        <strong>${e.nom}</strong><br>
        ${localisation ? `<small>${localisation}</small><br>` : ""}
        ${secteurLabel ? `<small><em>${secteurLabel}</em></small>` : ""}
      </div>
    `;
  });
  html += "</div>";
  return html;
}

/* ---------- RECHERCHE MÉTIER ---------- */

function searchMetier(term) {
  const metier = findByName(metiers, term);
  if (!metier) {
    return noResult("Aucun métier ne correspond à cette recherche.");
  }

  const secteurMetier = inferSectorFromMetier(metier);

  const mf = relations.metierFormation.filter(
    (rel) => rel.metierId === metier.id
  );

  const formationsAssociees = formations.filter((f) =>
    mf.some((rel) => rel.formationId === f.id)
  );

  const em = relations.entrepriseMetier.filter(
    (rel) => rel.metierId === metier.id
  );

  const entreprisesAssociees = entreprises.filter((e) =>
    em.some((rel) => rel.entrepriseId === e.id)
  );

  const directEntrepriseIds = new Set(entreprisesAssociees.map((e) => e.id));
  const entreprisesParSecteur = secteurMetier
    ? guessEntreprisesBySectorLabel(secteurMetier, directEntrepriseIds)
    : [];

  renderSummary(`
    <h2>Métier : ${metier.nom}</h2>
    ${secteurMetier ? `<p><strong>Secteur :</strong> ${secteurMetier}</p>` : ""}
    <p>Formations et entreprises en lien avec ce métier.</p>
  `);

  let html = "";

  html += `<div class="section-title">Formations associées</div>`;
  html += createCards(formationsAssociees, "ville");

  html += `<div class="section-title">Entreprises associées (liens directs)</div>`;
  html += createEntrepriseCards(entreprisesAssociees);

  if (entreprisesParSecteur.length > 0) {
    html += `<div class="section-title">Autres entreprises du même secteur (approximation)</div>`;
    html += createEntrepriseCards(entreprisesParSecteur);
  }

  renderResults(html);
}

/* ---------- RECHERCHE FORMATION ---------- */

function searchFormation(term) {
  const formation = findByName(formations, term);
  if (!formation) {
    return noResult(
      "Aucune formation ne correspond à cette recherche. Utilise la liste de suggestions si besoin."
    );
  }

  const mf = relations.metierFormation.filter(
    (rel) => rel.formationId === formation.id
  );

  const metiersAssocies = metiers.filter((m) =>
    mf.some((rel) => rel.metierId === m.id)
  );

  console.log(
    "Recherche formation",
    formation.nom,
    "→",
    mf.length,
    "liens MF",
    "→",
    metiersAssocies.length,
    "métiers"
  );

  if (metiersAssocies.length === 0) {
    renderSummary(`
      <h2>Formation : ${formation.nom}</h2>
      <p>Cette formation est bien référencée dans la base, mais aucun métier n’y est encore rattaché.</p>
    `);

    renderResults(`
      <p>
        Pour enrichir l’outil, il faudra ajouter les métiers liés à cette formation
        dans le fichier de données (Excel / JSON).
      </p>
    `);
    return;
  }

  const entreprisesAssociees = getEntreprisesForMetiers(metiersAssocies);

  // Entreprises supplémentaires par secteur
  const secteurLabels = new Set(
    metiersAssocies
      .map((m) => inferSectorFromMetier(m))
      .filter(Boolean)
  );

  const excludeIds = new Set(entreprisesAssociees.map((e) => e.id));
  const entreprisesParSecteur = [];

  secteurLabels.forEach((label) => {
    const guessed = guessEntreprisesBySectorLabel(label, excludeIds);
    guessed.forEach((e) => {
      if (!excludeIds.has(e.id)) {
        excludeIds.add(e.id);
        entreprisesParSecteur.push(e);
      }
    });
  });

  renderSummary(`
    <h2>Formation : ${formation.nom}</h2>
    <p>Métiers et entreprises en lien avec cette formation.</p>
  `);

  let html = "";
  html += `<div class="section-title">Métiers accessibles avec cette formation</div>`;
  html += createCards(metiersAssocies);

  html += `<div class="section-title">Entreprises associées (via les métiers liés)</div>`;
  html += createEntrepriseCards(entreprisesAssociees);

  if (entreprisesParSecteur.length > 0) {
    html += `<div class="section-title">Autres entreprises du même secteur (approximation)</div>`;
    html += createEntrepriseCards(entreprisesParSecteur);
  }

  renderResults(html);
}

/* ---------- RECHERCHE ENTREPRISE ---------- */

function searchEntreprise(term) {
  const entreprise = findByName(entreprises, term);
  if (!entreprise) {
    return noResult("Aucune entreprise ne correspond à cette recherche.");
  }

  const secteur = inferSectorFromEntreprise(entreprise);

  const em = relations.entrepriseMetier.filter(
    (rel) => rel.entrepriseId === entreprise.id
  );

  const metiersAssocies = metiers.filter((m) =>
    em.some((rel) => rel.metierId === m.id)
  );

  renderSummary(`
    <h2>Entreprise : ${entreprise.nom}</h2>
    ${secteur ? `<p><strong>Secteur :</strong> ${secteur}</p>` : ""}
    <p>Métiers en lien avec cette entreprise.</p>
  `);

  let html = "";
  html += `<div class="section-title">Métiers présents dans cette entreprise</div>`;
  html += createCards(metiersAssocies);

  renderResults(html);
}

/* ---------- INIT ---------- */

function init() {
  const btn = document.getElementById("searchBtn");
  const input = document.getElementById("query");
  const typeSelect = document.getElementById("type");

  const updateListAttribute = () => {
    const type = typeSelect.value;
    if (type === "metier") {
      input.setAttribute("list", "options-metier");
    } else if (type === "formation") {
      input.setAttribute("list", "options-formation");
    } else if (type === "entreprise") {
      input.setAttribute("list", "options-entreprise");
    }
  };

  const runSearch = () => {
    const type = typeSelect.value;
    const term = input.value.trim();
    if (!term) return noResult("Merci de saisir un terme de recherche.");

    if (type === "metier") return searchMetier(term);
    if (type === "formation") return searchFormation(term);
    if (type === "entreprise") return searchEntreprise(term);
  };

  btn.addEventListener("click", runSearch);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") runSearch();
  });

  typeSelect.addEventListener("change", updateListAttribute);
  updateListAttribute();
}

/* ---------- LANCEMENT ---------- */

loadData()
  .then(() => {
    populateDatalists();
    init();
  })
  .catch((err) => {
    console.error("Erreur de chargement des données :", err);
    noResult("Erreur de chargement des données. Vérifie les fichiers JSON.");
  });
