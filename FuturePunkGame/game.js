/**
 * Dialogue & Choice System ,  Order's End (Roguelike)
 * - Parses embedded Scenes markdown into a scene graph
 * - Roguelike runs: seeded RNG, random event modifiers, reset per run
 * - Choices always advance toward a FINALE; FINALE ends the run with an epilogue based on stats
 */

/**
 * @typedef {Object} Choice
 * @property {string} id
 * @property {string} label
 * @property {string} nextId
 * @property {{ military?: number, education?: number, economy?: number }=} statDelta
 */

/**
 * @typedef {Object} SceneNode
 * @property {string} id
 * @property {string} title
 * @property {string} speaker
 * @property {string} text
 * @property {Choice[]} choices
 * @property {boolean=} isFinale
 */

/**
 * @typedef {Object} GameState
 * @property {string} currentNodeId
 * @property {{ military: number, education: number, economy: number }} stats
 * @property {string[]} history
 * @property {number} runNumber
 * @property {number} seed
 */

// RNG (mulberry32)
const mulberry32 = (seed) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const clamp = (v, min, max) => (v < min ? min : v > max ? max : v);
const formatPercent = (n) => `${Math.round(n)}%`;

/** @type {Record<string, SceneNode>} */
let sceneGraph = {};

/** @type {GameState} */
const gameState = {
  currentNodeId: "",
  stats: {
    // Core Stats
    military: 45,
    education: 40,
    economy: 42,
    diplomacy: 50,
    stability: 50,
  },

  // International relationships (affect diplomacy and choices)
  relationships: {
    china: 50,
    russia: 50,
    eu: 60,
    globalSouth: 45,
  },

  history: [],
  runNumber: 1,
  seed: Math.floor(Math.random() * 2 ** 31),
  declineModifier: 1.0,
  turnCount: 0,
};

let random = mulberry32(gameState.seed);

// DOM references
const sceneTitleEl = /** @type {HTMLHeadingElement} */ (
  document.getElementById("sceneTitle")
);
const backButtonEl = /** @type {HTMLButtonElement} */ (
  document.getElementById("backButton")
);
const dialogueRegionEl = /** @type {HTMLDivElement} */ (
  document.getElementById("dialogueRegion")
);
const speakerEl = /** @type {HTMLParagraphElement} */ (
  document.getElementById("speaker")
);
const dialogueTextEl = /** @type {HTMLParagraphElement} */ (
  document.getElementById("dialogueText")
);
const choicesListEl = /** @type {HTMLUListElement} */ (
  document.getElementById("choicesList")
);
const newRunButtonEl = /** @type {HTMLButtonElement} */ (
  document.getElementById("newRunButton")
);
const runNumberEl = /** @type {HTMLSpanElement} */ (
  document.getElementById("runNumber")
);
const runSeedEl = /** @type {HTMLSpanElement} */ (
  document.getElementById("runSeed")
);

// About/Instructions UI
const aboutButtonEl = /** @type {HTMLButtonElement} */ (
  document.getElementById("aboutButton")
);
const instructionsButtonEl = /** @type {HTMLButtonElement} */ (
  document.getElementById("instructionsButton")
);
const aboutModalEl = /** @type {HTMLDivElement} */ (
  document.getElementById("aboutModal")
);
const instructionsModalEl = /** @type {HTMLDivElement} */ (
  document.getElementById("instructionsModal")
);
const aboutCloseButtonEl = /** @type {HTMLButtonElement} */ (
  document.getElementById("aboutCloseButton")
);
const instructionsCloseButtonEl = /** @type {HTMLButtonElement} */ (
  document.getElementById("instructionsCloseButton")
);

// Modal helpers
let lastFocusedBeforeModal = null;
const isHidden = (el) => !el || el.classList.contains("hidden");
const showModal = (el) => {
  if (!el) return;
  lastFocusedBeforeModal = /** @type {HTMLElement|null} */ (
    document.activeElement
  );
  el.classList.remove("hidden");
  // Focus the first focusable element inside (prefer the close button)
  const focusTarget = /** @type {HTMLElement|null} */ (
    el.querySelector(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
    )
  );
  if (focusTarget) focusTarget.focus();
};
const hideModal = (el) => {
  if (!el) return;
  el.classList.add("hidden");
  if (
    lastFocusedBeforeModal &&
    typeof lastFocusedBeforeModal.focus === "function"
  ) {
    lastFocusedBeforeModal.focus();
  }
};

// Stats DOM
const statMilitaryBarEl = /** @type {HTMLDivElement} */ (
  document.getElementById("statMilitaryBar")
);
const statEducationBarEl = /** @type {HTMLDivElement} */ (
  document.getElementById("statEducationBar")
);
const statEconomyBarEl = /** @type {HTMLDivElement} */ (
  document.getElementById("statEconomyBar")
);
const statMilitaryLabelEl = /** @type {HTMLSpanElement} */ (
  document.getElementById("statMilitaryLabel")
);
const statEducationLabelEl = /** @type {HTMLSpanElement} */ (
  document.getElementById("statEducationLabel")
);
const statEconomyLabelEl = /** @type {HTMLSpanElement} */ (
  document.getElementById("statEconomyLabel")
);

// Helpers
const getCurrentNode = () => sceneGraph[gameState.currentNodeId];

const applyStatDelta = (delta, relationshipDelta) => {
  if (!delta) return;

  // Apply stat changes with decline modifier
  const s = { ...gameState.stats };
  const avgStat = (s.military + s.education + s.economy) / 3;

  Object.keys(delta).forEach((stat) => {
    let change = delta[stat];

    if (change < 0) {
      // Negative effects amplified by decline
      change = Math.floor(change * gameState.declineModifier);
    } else if (change > 0) {
      // Positive effects diminished in decline
      if (avgStat < 35) {
        change = Math.floor(change * 0.6); // Severe decline
      } else if (avgStat < 45) {
        change = Math.floor(change * 0.8); // Moderate decline
      }
    }

    if (s[stat] !== undefined) {
      s[stat] = clamp(s[stat] + change, 0, 100);
    }
  });

  gameState.stats = s;

  // Apply relationship changes
  if (relationshipDelta) {
    Object.keys(relationshipDelta).forEach((country) => {
      if (gameState.relationships[country] !== undefined) {
        gameState.relationships[country] = clamp(
          gameState.relationships[country] + relationshipDelta[country],
          0,
          100
        );
      }
    });
  }

  // Update decline modifier
  const newAvg =
    (s.military + s.education + s.economy + s.diplomacy + s.stability) / 5;
  if (newAvg < 30) {
    gameState.declineModifier = Math.min(2.0, gameState.declineModifier + 0.12);
  } else if (newAvg < 40) {
    gameState.declineModifier = Math.min(1.7, gameState.declineModifier + 0.06);
  } else if (newAvg > 60) {
    gameState.declineModifier = Math.max(1.0, gameState.declineModifier - 0.05);
  }
};

const renderStats = () => {
  const s = gameState.stats;

  // Core stats
  statMilitaryBarEl.style.width = `${s.military}%`;
  statEducationBarEl.style.width = `${s.education}%`;
  statEconomyBarEl.style.width = `${s.economy}%`;
  statMilitaryLabelEl.textContent = formatPercent(s.military);
  statEducationLabelEl.textContent = formatPercent(s.education);
  statEconomyLabelEl.textContent = formatPercent(s.economy);
  statMilitaryBarEl.parentElement?.setAttribute(
    "aria-valuenow",
    String(Math.round(s.military))
  );
  statEducationBarEl.parentElement?.setAttribute(
    "aria-valuenow",
    String(Math.round(s.education))
  );
  statEconomyBarEl.parentElement?.setAttribute(
    "aria-valuenow",
    String(Math.round(s.economy))
  );

  // Update diplomacy and stability
  updateStat("Diplomacy", s.diplomacy);
  updateStat("Stability", s.stability);
};

// Helper function to update any stat
const updateStat = (statName, value) => {
  const barEl = document.getElementById(`stat${statName}Bar`);
  const labelEl = document.getElementById(`stat${statName}Label`);
  if (barEl) barEl.style.width = `${value}%`;
  if (labelEl) labelEl.textContent = formatPercent(value);
};

// Keyword mapping for stat targeting
const statKeywords = {
  military: [
    "security",
    "threat",
    "alliance",
    "naval",
    "mobiliz",
    "military",
    "contain",
    "sanction",
    "defense",
  ],
  education: [
    "education",
    "training",
    "retraining",
    "skills",
    "college",
    "learn",
    "innovation",
  ],
  economy: [
    "trade",
    "econom",
    "market",
    "infrastructure",
    "investment",
    "debt",
    "tariff",
    "jobs",
    "industry",
    "summit",
    "currency",
    "reserve",
  ],
};

const chooseStatTargets = (text) => {
  const lower = text.toLowerCase();
  const weights = { military: 0, education: 0, economy: 0 };
  for (const k of statKeywords.military)
    if (lower.includes(k)) weights.military += 1;
  for (const k of statKeywords.education)
    if (lower.includes(k)) weights.education += 1;
  for (const k of statKeywords.economy)
    if (lower.includes(k)) weights.economy += 1;
  const entries = Object.entries(weights).sort((a, b) => b[1] - a[1]);
  const top =
    entries[0][1] > 0
      ? entries.filter(([, w]) => w === entries[0][1]).map(([k]) => k)
      : ["economy"];
  return top;
};

// INTELLIGENT CHOICE ANALYSIS SYSTEM
// Analyzes choice text and context to determine logical stat changes

const analyzeChoiceImpact = (choiceText, sceneContext) => {
  const text = (choiceText + " " + sceneContext).toLowerCase();
  const delta = {
    military: 0,
    education: 0,
    economy: 0,
    diplomacy: 0,
    stability: 0,
  };
  const relationshipDelta = { china: 0, russia: 0, eu: 0, globalSouth: 0 };

  // DIPLOMATIC ACTIONS
  if (
    text.includes("cooperat") ||
    text.includes("partnership") ||
    text.includes("together")
  ) {
    delta.diplomacy += 8 + Math.floor(random() * 6);
    delta.economy += 6 + Math.floor(random() * 5);
    delta.stability += 3 + Math.floor(random() * 3);
    delta.military -= 2 + Math.floor(random() * 2);

    // Improve relationships
    if (text.includes("china")) relationshipDelta.china += 10;
    if (text.includes("russia")) relationshipDelta.russia += 10;
    if (text.includes("eu")) relationshipDelta.eu += 8;
  }

  // AGGRESSIVE/MILITARY ACTIONS
  else if (
    text.includes("threat") ||
    text.includes("contain") ||
    (text.includes("respond to") && text.includes("threat"))
  ) {
    delta.military += 10 + Math.floor(random() * 6);
    delta.diplomacy -= 6 + Math.floor(random() * 4);
    delta.economy -= 4 + Math.floor(random() * 3);
    delta.stability -= 2 + Math.floor(random() * 2);

    // Damage relationships
    if (text.includes("china")) relationshipDelta.china -= 12;
    if (text.includes("russia")) relationshipDelta.russia -= 10;
  }

  // SANCTIONS
  else if (text.includes("sanction everyone")) {
    delta.economy -= 15 + Math.floor(random() * 6);
    delta.military += 6 + Math.floor(random() * 4);
    delta.diplomacy -= 12 + Math.floor(random() * 5);
    delta.stability -= 8 + Math.floor(random() * 4);
    relationshipDelta.china -= 15;
    relationshipDelta.russia -= 15;
    relationshipDelta.eu -= 12;
    relationshipDelta.globalSouth -= 12;
  } else if (text.includes("sanction")) {
    delta.economy -= 8 + Math.floor(random() * 5);
    delta.military += 4 + Math.floor(random() * 3);
    delta.diplomacy -= 6 + Math.floor(random() * 4);

    if (text.includes("china")) relationshipDelta.china -= 12;
    if (text.includes("russia")) relationshipDelta.russia -= 12;
  }

  // DOMESTIC INVESTMENT
  else if (
    text.includes("education") ||
    text.includes("training") ||
    text.includes("retraining") ||
    text.includes("skills")
  ) {
    delta.education += 12 + Math.floor(random() * 8);
    delta.economy -= 3 + Math.floor(random() * 3);
    delta.stability += 2 + Math.floor(random() * 3);
  } else if (text.includes("infrastructure") || text.includes("investment")) {
    delta.economy += 10 + Math.floor(random() * 6);
    delta.education += 4 + Math.floor(random() * 4);
    delta.military -= 2 + Math.floor(random() * 2);
  }

  // PROTECTIONISM
  else if (
    text.includes("protection") ||
    text.includes("tariff") ||
    text.includes("bring back")
  ) {
    delta.economy += 6 + Math.floor(random() * 5);
    delta.diplomacy -= 6 + Math.floor(random() * 4);
    delta.education -= 3 + Math.floor(random() * 3);
    relationshipDelta.china -= 8;
    relationshipDelta.eu -= 6;
  }

  // GLOBALIZATION/ADAPTATION
  else if (
    text.includes("adapt") ||
    text.includes("compete globally") ||
    text.includes("open")
  ) {
    delta.education += 8 + Math.floor(random() * 6);
    delta.economy += 5 + Math.floor(random() * 4);
    delta.military -= 3 + Math.floor(random() * 2);
    delta.stability -= 2 + Math.floor(random() * 2);
    relationshipDelta.globalSouth += 8;
  }

  // MILITARY BUILDUP
  else if (
    text.includes("military") ||
    text.includes("defense") ||
    text.includes("tech superiority") ||
    text.includes("alliance network")
  ) {
    delta.military += 12 + Math.floor(random() * 6);
    delta.economy -= 6 + Math.floor(random() * 4);
    delta.education -= 3 + Math.floor(random() * 2);
  }

  // APOLOGY/DE-ESCALATION
  else if (
    text.includes("apology") ||
    text.includes("de-escalate") ||
    text.includes("wrong") ||
    text.includes("backtrack")
  ) {
    delta.diplomacy += 10 + Math.floor(random() * 6);
    delta.military -= 6 + Math.floor(random() * 3);
    delta.economy += 4 + Math.floor(random() * 3);
    delta.stability -= 3 + Math.floor(random() * 3); // Domestic criticism

    if (text.includes("china")) relationshipDelta.china += 12;
    if (text.includes("russia")) relationshipDelta.russia += 12;
  }

  // MULTILATERAL/SUMMIT
  else if (
    text.includes("summit") ||
    text.includes("multilateral") ||
    text.includes("joint")
  ) {
    delta.diplomacy += 12 + Math.floor(random() * 6);
    delta.economy += 6 + Math.floor(random() * 5);
    delta.education += 4 + Math.floor(random() * 4);
    delta.military -= 3 + Math.floor(random() * 2);
    relationshipDelta.eu += 10;
    relationshipDelta.globalSouth += 8;
  }

  // TRANSPARENCY/OVERSIGHT
  else if (
    text.includes("transparent") ||
    text.includes("oversight") ||
    text.includes("democratic") ||
    text.includes("accountability")
  ) {
    delta.diplomacy += 6 + Math.floor(random() * 4);
    delta.education += 5 + Math.floor(random() * 4);
    delta.stability += 6 + Math.floor(random() * 4);
    delta.economy -= 3 + Math.floor(random() * 2); // Slower, more bureaucratic
  }

  // ISOLATIONISM
  else if (
    text.includes("alone") ||
    text.includes("isolation") ||
    text.includes("stand firm") ||
    text.includes("independent")
  ) {
    delta.military += 8 + Math.floor(random() * 5);
    delta.diplomacy -= 10 + Math.floor(random() * 6);
    delta.economy -= 6 + Math.floor(random() * 4);
    delta.stability -= 4 + Math.floor(random() * 3);
    relationshipDelta.china -= 10;
    relationshipDelta.russia -= 10;
    relationshipDelta.eu -= 10;
    relationshipDelta.globalSouth -= 8;
  }

  // DEFAULT: Analyze keywords to determine primary affected stat
  else {
    const keywords = {
      military: ["security", "defense", "force", "weapon", "naval", "army"],
      education: ["learn", "college", "university", "research", "innovation"],
      economy: ["trade", "market", "business", "industry", "jobs", "growth"],
      diplomacy: ["negotiate", "talk", "discuss", "alliance", "partner"],
      stability: ["unity", "cohesion", "trust", "support", "stability"],
    };

    let primaryStat = "economy"; // default
    let maxScore = 0;

    for (const [stat, words] of Object.entries(keywords)) {
      const score = words.filter((word) => text.includes(word)).length;
      if (score > maxScore) {
        maxScore = score;
        primaryStat = stat;
      }
    }

    // More balanced default changes
    delta[primaryStat] += 6 + Math.floor(random() * 6);
    delta[primaryStat === "economy" ? "military" : "economy"] -=
      2 + Math.floor(random() * 2);
  }

  return { delta, relationshipDelta };
};

// Old function removed - now using analyzeChoiceImpact() instead

const normalizeId = (raw) => raw.trim(); // Keep exact for mapping, e.g., "Scene 3A1", "FINALE 1"

const parseScenesMarkdown = (mdText) => {
  /** @type {Record<string, SceneNode>} */
  const graph = {};
  const lines = mdText.split(/\r?\n/);
  let currentId = null;
  let currentTitle = "";
  let buffer = [];
  let collectingChoices = false;
  /** @type {Choice[]} */
  let choices = [];

  const flush = () => {
    if (!currentId) return;
    const text = buffer.join("\n").trim();
    graph[currentId] = {
      id: currentId,
      title: currentTitle || currentId,
      speaker: /\*\*Location:\*\*/.test(text) ? "Narrator" : "Speaker",
      text,
      choices,
      isFinale: currentId.startsWith("FINALE"),
    };
  };

  for (let i = 0; i < lines.length; i++) {
    // Trim indentation so the parser tolerates pretty-printed/indented markdown
    const line = lines[i].trim();

    const sceneMatch = line.match(/^##\s+(Scene\s+[^:]+):\s*(.*)$/);
    const finaleMatch = line.match(/^##\s+(FINALE\s+[^:]+):\s*(.*)$/);

    if (sceneMatch || finaleMatch) {
      // new section
      if (currentId) flush();
      const id = normalizeId((sceneMatch || finaleMatch)[1]);
      currentId = id;
      currentTitle = (sceneMatch || finaleMatch)[2] || id;
      buffer = [];
      choices = [];
      collectingChoices = false;
      continue;
    }

    if (/^\*\*Choices:\*\*/.test(line)) {
      collectingChoices = true;
      continue;
    }

    if (collectingChoices && /^-\s+\*\*Choice/i.test(line)) {
      // Example: - **Choice A1:** "Label" [Health +15] → Go to Scene 3A2
      const m = line.match(
        /^-\s+\*\*Choice[^:]*:\*\*\s*(.+?)\s*\u2192\s*Go to\s+(Scene\s+[^\s]+|FINALE\s+\S+)/i
      );
      if (m) {
        const rawLabel = m[1].trim().replace(/^"|"$/g, "");
        const next = normalizeId(m[2]);
        const analysis = analyzeChoiceImpact(
          rawLabel,
          currentTitle + " " + buffer.join(" ")
        );
        choices.push({
          id: `${currentId}_choice_${choices.length + 1}`,
          label: rawLabel,
          nextId: next,
          statDelta: analysis.delta,
          relationshipDelta: analysis.relationshipDelta,
        });
      }
      continue;
    }

    // separate blocks with blank line kept
    buffer.push(line);
  }
  if (currentId) flush();

  // Ensure all scenes lead to valid finales - no uncharted outcomes
  for (const node of Object.values(graph)) {
    if (!node.isFinale && node.choices) {
      node.choices.forEach((choice) => {
        if (!(choice.nextId in graph)) {
          console.warn(
            `Choice "${choice.label}" leads to non-existent scene: ${choice.nextId}`
          );
        }
      });
    }
  }

  return graph;
};

const renderChoices = (choices) => {
  choicesListEl.innerHTML = "";

  choices.forEach((choice, index) => {
    const li = document.createElement("li");
    li.setAttribute("role", "listitem");

    const button = document.createElement("button");
    button.type = "button";
    button.className =
      "w-full text-left rounded-lg border border-neutral-700/70 bg-neutral-800/70 px-4 py-3 text-neutral-100 hover:bg-neutral-700/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors";
    button.textContent = choice.label;
    button.dataset.choiceId = choice.id;
    button.setAttribute("aria-label", `Choose: ${choice.label}`);
    button.tabIndex = 0;

    button.addEventListener("click", () => handleChoiceActivate(choice));
    button.addEventListener("keydown", (event) =>
      handleChoiceKeyDown(event, index)
    );

    li.appendChild(button);
    choicesListEl.appendChild(li);
  });

  const firstButton = /** @type {HTMLButtonElement|null} */ (
    choicesListEl.querySelector("button")
  );
  if (firstButton) firstButton.focus();
};

const renderFinale = (node) => {
  sceneTitleEl.textContent = node.title || "Finale";
  speakerEl.textContent = node.speaker || "Narrator";

  // Ensure no stat is exactly 0 - minimum 5
  Object.keys(gameState.stats).forEach((stat) => {
    if (gameState.stats[stat] < 5) {
      gameState.stats[stat] = 5;
    }
  });

  // Build finale summary
  const s = gameState.stats;
  const avg = Math.floor(
    (s.military + s.education + s.economy + s.diplomacy + s.stability) / 5
  );

  let summaryText = `\n\n**Final National Stats:**\n`;
  summaryText += `- Military: ${Math.round(s.military)}%\n`;
  summaryText += `- Education: ${Math.round(s.education)}%\n`;
  summaryText += `- Economy: ${Math.round(s.economy)}%\n`;
  summaryText += `- Diplomacy: ${Math.round(s.diplomacy)}%\n`;
  summaryText += `- Stability: ${Math.round(s.stability)}%\n`;
  summaryText += `- **Overall: ${avg}%**\n`;

  const fullText = `${node.text}${summaryText}\n\nRun ${gameState.runNumber} concluded. Start a new run to explore another path.`;
  dialogueTextEl.innerHTML = formatDialogueText(fullText);
  choicesListEl.innerHTML = "";
  backButtonEl.disabled = true;
  newRunButtonEl?.classList.remove("hidden");

  // Update stats display one final time
  renderStats();
};

// Basic markdown to HTML converter for dialogue text
const formatDialogueText = (text) => {
  if (!text) return "";

  // Split into paragraphs (double line breaks)
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim());

  return paragraphs
    .map((paragraph) => {
      // Handle bold text (**text**)
      let formatted = paragraph.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-semibold text-neutral-100">$1</strong>'
      );

      // Handle italics (*text* or _text_)
      formatted = formatted.replace(
        /(?<!\*)\*([^*]+)\*(?!\*)/g,
        '<em class="italic text-neutral-200">$1</em>'
      );
      formatted = formatted.replace(
        /(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g,
        '<em class="italic text-neutral-200">$1</em>'
      );

      // Convert single line breaks to <br> tags
      formatted = formatted.replace(/(?<!\n)\n(?!\n)/g, "<br>");

      // Wrap in paragraph if it contains actual content
      if (formatted.trim()) {
        return `<p class="mb-4 leading-relaxed text-neutral-100 last:mb-0">${formatted}</p>`;
      }
      return "";
    })
    .join("");
};

const renderCurrentNode = () => {
  const node = getCurrentNode();

  // Handle missing scenes gracefully
  if (!node) {
    console.error(`Scene not found: ${gameState.currentNodeId}`);
    sceneTitleEl.textContent = "Error: Scene Not Found";
    speakerEl.textContent = "System";
    dialogueTextEl.innerHTML = formatDialogueText(
      `The scene "${gameState.currentNodeId}" could not be found. This may be an incomplete story path.`
    );

    // Provide recovery options
    choicesListEl.innerHTML = "";
    const li = document.createElement("li");
    li.setAttribute("role", "listitem");
    const button = document.createElement("button");
    button.type = "button";
    button.className =
      "w-full text-left rounded-lg border border-neutral-700/70 bg-neutral-800/70 px-4 py-3 text-neutral-100 hover:bg-neutral-700/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors";
    button.textContent = "Return to Start";
    button.addEventListener("click", () => {
      gameState.currentNodeId =
        Object.keys(sceneGraph).find((k) =>
          k.toLowerCase().startsWith("scene 1")
        ) || Object.keys(sceneGraph)[0];
      gameState.history = [];
      renderCurrentNode();
    });
    li.appendChild(button);
    choicesListEl.appendChild(li);

    backButtonEl.disabled = gameState.history.length === 0;
    newRunButtonEl?.classList.remove("hidden");
    renderStats();
    return;
  }

  if (node.isFinale) {
    renderFinale(node);
    renderStats();
    return;
  }

  sceneTitleEl.textContent = node.title || node.id;
  speakerEl.textContent = node.speaker || "Narrator";
  dialogueTextEl.innerHTML = formatDialogueText(node.text);

  renderChoices(node.choices || []);
  backButtonEl.disabled = gameState.history.length === 0;
  newRunButtonEl?.classList.add("hidden");
  renderStats();
};

const handleChoiceActivate = (choice) => {
  // Validate that the next scene exists before proceeding
  if (!sceneGraph[choice.nextId]) {
    console.error(
      `Invalid choice nextId: ${choice.nextId}. Scene does not exist.`
    );
    alert(
      `Error: The scene "${choice.nextId}" has not been implemented yet. Please choose a different option or start a new run.`
    );
    return; // Don't proceed with invalid choice
  }

  gameState.history.push(gameState.currentNodeId);
  applyStatDelta(choice.statDelta, choice.relationshipDelta);

  // PASSIVE DECLINE: Very light erosion per turn (only if stats are actually declining)
  const avgStat =
    (gameState.stats.military +
      gameState.stats.education +
      gameState.stats.economy +
      gameState.stats.diplomacy +
      gameState.stats.stability) /
    5;

  // Only apply passive decline if average is below 50
  if (avgStat < 50) {
    const passiveDecline = {
      military: -1,
      education: -1,
      economy: -1,
      diplomacy: 0,
      stability: 0,
    };

    applyStatDelta(passiveDecline);
  }

  gameState.currentNodeId = choice.nextId;
  renderCurrentNode();
};

const handleChoiceKeyDown = (event, index) => {
  const buttons = /** @type {HTMLButtonElement[]} */ (
    Array.from(choicesListEl.querySelectorAll("button"))
  );
  if (buttons.length === 0) return;
  const lastIndex = buttons.length - 1;
  switch (event.key) {
    case "ArrowDown": {
      event.preventDefault();
      const nextIndex = index >= lastIndex ? 0 : index + 1;
      buttons[nextIndex].focus();
      return;
    }
    case "ArrowUp": {
      event.preventDefault();
      const prevIndex = index <= 0 ? lastIndex : index - 1;
      buttons[prevIndex].focus();
      return;
    }
    case "Home": {
      event.preventDefault();
      buttons[0].focus();
      return;
    }
    case "End": {
      event.preventDefault();
      buttons[lastIndex].focus();
      return;
    }
    case "Enter":
    case " ": {
      event.preventDefault();
      buttons[index].click();
      return;
    }
    default:
      return;
  }
};

const resetRun = (seed) => {
  gameState.runNumber += gameState.currentNodeId ? 1 : 0;
  gameState.seed = seed != null ? seed : Math.floor(Math.random() * 2 ** 31);
  random = mulberry32(gameState.seed);

  // Start in slight decline - reflecting "Principles for Dealing with a Changing World Order"
  gameState.stats = {
    military: 45,
    education: 40,
    economy: 42,
    diplomacy: 50,
    stability: 50,
  };

  gameState.declineModifier = 1.0;
  gameState.history = [];
  gameState.turnCount = 0;

  // Reset relationships
  gameState.relationships = {
    china: 50,
    russia: 50,
    eu: 60,
    globalSouth: 45,
  };

  gameState.currentNodeId =
    Object.keys(sceneGraph).find((k) =>
      k.toLowerCase().startsWith("scene 1")
    ) || Object.keys(sceneGraph)[0];
  runNumberEl && (runNumberEl.textContent = String(gameState.runNumber));
  runSeedEl && (runSeedEl.textContent = String(gameState.seed));
  renderCurrentNode();
};

const validateSceneGraph = () => {
  const issues = [];
  const allSceneIds = Object.keys(sceneGraph);

  for (const [sceneId, scene] of Object.entries(sceneGraph)) {
    if (!scene.choices || scene.choices.length === 0) {
      if (!scene.isFinale) {
        issues.push(
          `Scene "${sceneId}" has no choices and is not marked as finale`
        );
      }
      continue;
    }

    for (const choice of scene.choices) {
      if (!choice.nextId) {
        issues.push(
          `Choice "${choice.label}" in scene "${sceneId}" has no nextId`
        );
      } else if (!sceneGraph[choice.nextId]) {
        issues.push(
          `Choice "${choice.label}" in scene "${sceneId}" points to non-existent scene "${choice.nextId}"`
        );
      }
    }
  }

  if (issues.length > 0) {
    console.warn("Scene graph validation issues found:");
    issues.forEach((issue) => console.warn(`  - ${issue}`));
  } else {
    console.log(
      `Scene graph validated successfully. ${allSceneIds.length} scenes loaded.`
    );
  }

  return issues;
};

const initializeGame = () => {
  // Parse embedded markdown scenes
  const mdEl = /** @type {HTMLScriptElement|null} */ (
    document.getElementById("scenesMd")
  );
  if (mdEl) {
    sceneGraph = parseScenesMarkdown(mdEl.textContent || "");
  } else {
    sceneGraph = {};
  }

  // Validate scene graph
  validateSceneGraph();

  backButtonEl.addEventListener("click", () => {
    if (gameState.history.length === 0) return;
    const previousId = gameState.history.pop();
    if (!previousId) return;
    gameState.currentNodeId = previousId;
    renderCurrentNode();
  });

  newRunButtonEl?.addEventListener("click", () => resetRun());

  // About/Instructions wiring
  aboutButtonEl?.addEventListener("click", () => showModal(aboutModalEl));
  instructionsButtonEl?.addEventListener("click", () =>
    showModal(instructionsModalEl)
  );
  aboutCloseButtonEl?.addEventListener("click", () => hideModal(aboutModalEl));
  instructionsCloseButtonEl?.addEventListener("click", () =>
    hideModal(instructionsModalEl)
  );

  // Backdrop clicks
  document.addEventListener("click", (e) => {
    const target = /** @type {HTMLElement} */ (e.target);
    const backdropType = target?.dataset?.backdrop;
    if (!backdropType) return;
    if (backdropType === "about" && !isHidden(aboutModalEl))
      hideModal(aboutModalEl);
    if (backdropType === "instructions" && !isHidden(instructionsModalEl))
      hideModal(instructionsModalEl);
  });

  // Escape to close
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!isHidden(instructionsModalEl)) {
      hideModal(instructionsModalEl);
      return;
    }
    if (!isHidden(aboutModalEl)) {
      hideModal(aboutModalEl);
      return;
    }
  });

  // First run
  gameState.runNumber = 1;
  runNumberEl && (runNumberEl.textContent = String(gameState.runNumber));
  runSeedEl && (runSeedEl.textContent = String(gameState.seed));

  const startSceneId =
    Object.keys(sceneGraph).find((k) =>
      k.toLowerCase().startsWith("scene 1")
    ) || Object.keys(sceneGraph)[0];
  if (!startSceneId) {
    console.error("No starting scene found!");
    return;
  }

  gameState.currentNodeId = startSceneId;
  renderCurrentNode();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeGame);
} else {
  initializeGame();
}
