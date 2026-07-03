/* ============================================================
   APP — UI flow: welcome → 50 questions → reveal → itinerary
   ============================================================ */

const state = {
  index: 0,               // current question index
  answers: new Array(TOTAL_QUESTIONS).fill(null),
};
let sharedView = false;   // true when viewing a trip opened from a shared link

/* ---------- Personalization ----------
   The couple's names come from the URL — ?n1=Avi&n2=Rivki — so the
   same site can be sent to any couple by just editing the link.
   Names are length-capped and always HTML-escaped before injection. */
function cleanName(v, fallback) {
  if (!v) return fallback;
  const s = v.trim().slice(0, 24);
  return s || fallback;
}
const URL_PARAMS = new URLSearchParams(location.search);
const COUPLE = (() => {
  const n1 = cleanName(URL_PARAMS.get("n1"), "Avi");
  const n2 = cleanName(URL_PARAMS.get("n2"), "Rivki");
  const custom = URL_PARAMS.has("n1") || URL_PARAMS.has("n2");
  return { n1, n2, both: `${n1} & ${n2}`, custom };
})();
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
/* Replace {n1}/{n2} placeholders in question text (plain text contexts) */
function personalize(str) {
  return str.replace(/\{n1\}/g, COUPLE.n1).replace(/\{n2\}/g, COUPLE.n2);
}
/* Fill every element marked with a data-names role on the static page */
function applyNames() {
  const both = COUPLE.both;
  const welcomeName = COUPLE.custom ? both : "Avi & Rivki Barr";
  document.querySelectorAll("[data-names]").forEach(elm => {
    elm.textContent = elm.dataset.names === "welcome" ? welcomeName : both;
  });
  document.querySelectorAll("[data-qcount]").forEach(elm => { elm.textContent = TOTAL_QUESTIONS; });
  document.title = `${both}'s Thailand Trip Designer 🇹🇭`;
}
applyNames();

/* ---------- Shareable links ----------
   Single-choice answers encode as their option index (0-3); multi-select
   answers encode as a base36 bitmask of the chosen options (supports up
   to 5 options per question). One character per question, so a full quiz
   is a 50-char code. `?trip=<code>` reproduces the exact itinerary. */
function answersToCode(answers) {
  const digits = answers.map((a, i) => {
    const q = QUESTIONS[i];
    if (q.multi) {
      if (!Array.isArray(a)) return null;
      let mask = 0;
      for (const o of a) {
        const k = q.options.indexOf(o);
        if (k < 0) return null;
        mask |= 1 << k;
      }
      return mask.toString(36);
    }
    const k = q.options.indexOf(a);
    return k < 0 ? null : String(k);
  });
  return digits.some(d => d === null) ? null : digits.join("");
}
function codeToAnswers(code) {
  if (typeof code !== "string" || code.length !== TOTAL_QUESTIONS) return null;
  const answers = [...code].map((c, i) => {
    const q = QUESTIONS[i];
    if (q.multi) {
      const mask = parseInt(c, 36);
      if (isNaN(mask) || mask >= (1 << q.options.length)) return null;
      return q.options.filter((_, k) => mask & (1 << k));
    }
    return q.options[+c] ?? null;
  });
  return answers.some(a => a === null) ? null : answers;
}
function shareUrl(code) {
  let url = location.origin + location.pathname + "?trip=" + code;
  if (COUPLE.custom) {
    url += "&n1=" + encodeURIComponent(COUPLE.n1) + "&n2=" + encodeURIComponent(COUPLE.n2);
  }
  return url;
}

const el = (sel) => document.querySelector(sel);
const screens = {
  welcome: el("#screen-welcome"),
  quiz: el("#screen-quiz"),
  loading: el("#screen-loading"),
  result: el("#screen-result"),
};

function show(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Welcome ---------- */
el("#start-btn").addEventListener("click", () => {
  show("quiz");
  renderQuestion();
});

/* ---------- Quiz ---------- */
function sectionFor(q) { return SECTIONS.find(s => s.id === q.section); }

/* Query string that preserves the couple's names (for restarts etc.) */
function namesQuery(lead) {
  if (!COUPLE.custom) return "";
  return lead + "n1=" + encodeURIComponent(COUPLE.n1) + "&n2=" + encodeURIComponent(COUPLE.n2);
}

function renderQuestion() {
  const i = state.index;
  const q = QUESTIONS[i];
  const sec = sectionFor(q);

  // Pre-select our recommended answer so the couple can breeze through,
  // confirming or changing each one as they go.
  if (!state.answers[i] && RECOMMENDED[i] !== undefined) {
    state.answers[i] = Array.isArray(RECOMMENDED[i])
      ? RECOMMENDED[i].map(k => q.options[k])
      : q.options[RECOMMENDED[i]];
  }

  // progress
  const answered = state.answers.filter(Boolean).length;
  const pct = Math.round(((i) / TOTAL_QUESTIONS) * 100);
  el("#progress-fill").style.width = `${Math.max(pct, 3)}%`;
  el("#progress-count").textContent = `Question ${i + 1} of ${TOTAL_QUESTIONS}`;
  el("#progress-label").textContent = `${answered} answered`;

  // section chip
  el("#section-chip").innerHTML = `<span>${sec.emoji}</span> ${sec.title}`;

  // card
  const card = el("#q-card");
  card.style.animation = "none";
  // force reflow to restart animation
  void card.offsetWidth;
  card.style.animation = "fadeUp .38s ease both";

  // section photo banner
  const qImage = el("#q-image");
  if (sec.image) {
    qImage.hidden = false;
    qImage.style.backgroundImage = `url('${sec.image}')`;
  } else {
    qImage.hidden = true;
  }

  el("#q-emoji").textContent = q.emoji;
  el("#q-text").textContent = personalize(q.text);
  el("#q-hint").textContent = q.multi ? "Select all that apply, then tap Next" : personalize(sec.blurb);

  // optional "good to know" info box above the options
  const infoBox = el("#q-info");
  infoBox.hidden = !q.info;
  infoBox.textContent = q.info || "";

  const opts = el("#options");
  opts.innerHTML = "";
  q.options.forEach((opt, oi) => {
    const isRec = Array.isArray(RECOMMENDED[i]) ? RECOMMENDED[i].includes(oi) : RECOMMENDED[i] === oi;
    const isSel = q.multi
      ? Array.isArray(state.answers[i]) && state.answers[i].includes(opt)
      : state.answers[i] === opt;
    const b = document.createElement("button");
    b.className = "option" + (isSel ? " selected" : "");
    b.innerHTML =
      `<span class="opt-emoji">${opt.emoji || "•"}</span>` +
      `<span class="opt-label">${opt.label}${isRec ? ' <span class="opt-rec">(recommended)</span>' : ""}</span>` +
      `<span class="opt-check">✓</span>`;
    b.addEventListener("click", () => selectOption(oi));
    opts.appendChild(b);
  });

  // multi-select questions advance via an explicit Next button
  const nextBtn = el("#multi-next");
  nextBtn.hidden = !q.multi;
  if (q.multi) nextBtn.disabled = !(Array.isArray(state.answers[i]) && state.answers[i].length);

  // nav
  el("#nav-back").disabled = i === 0;
  el("#nav-hint").textContent = q.multi
    ? "Pick as many as you like"
    : "Tap your choice to continue — our pick is pre-selected";
}

function advance() {
  if (state.index < TOTAL_QUESTIONS - 1) {
    state.index++;
    renderQuestion();
  } else {
    finish();
  }
}

function selectOption(optIndex) {
  const i = state.index;
  const q = QUESTIONS[i];

  if (q.multi) {
    // toggle this option in the selection set — advancing happens via Next
    const opt = q.options[optIndex];
    let arr = Array.isArray(state.answers[i]) ? state.answers[i] : [];
    arr = arr.includes(opt) ? arr.filter(o => o !== opt) : [...arr, opt];
    state.answers[i] = arr;
    document.querySelectorAll("#options .option").forEach((o, idx) => {
      o.classList.toggle("selected", arr.includes(q.options[idx]));
    });
    el("#multi-next").disabled = arr.length === 0;
    return;
  }

  state.answers[i] = q.options[optIndex];

  // visually mark selection
  document.querySelectorAll("#options .option").forEach((o, idx) => {
    o.classList.toggle("selected", idx === optIndex);
  });

  // auto-advance for a snappy mobile feel
  setTimeout(advance, 260);
}

el("#multi-next").addEventListener("click", advance);

el("#nav-back").addEventListener("click", () => {
  if (state.index > 0) { state.index--; renderQuestion(); }
});

/* ---------- Finish → loading → result ---------- */
const LOADING_LINES = [
  `Reading all ${TOTAL_QUESTIONS} of your answers…`,
  "Matching you to the perfect Thai cities…",
  "Checking kosher restaurants & Chabad houses…",
  "Locating the closest shuls for Shabbos…",
  "Balancing your budget and your dream days…",
  "Putting the finishing touches on it…",
];

function finish() {
  show("loading");
  const lineEl = el("#loading-line");
  let li = 0;
  lineEl.textContent = LOADING_LINES[0];
  const timer = setInterval(() => {
    li++;
    if (li < LOADING_LINES.length) lineEl.textContent = LOADING_LINES[li];
  }, 620);

  setTimeout(() => {
    clearInterval(timer);
    const rec = generateRecommendation(state.answers);
    const code = answersToCode(state.answers);
    if (code) history.replaceState(null, "", "?trip=" + code + namesQuery("&")); // URL bar is instantly shareable
    renderResult(rec, code);
    show("result");
  }, LOADING_LINES.length * 620 + 300);
}

/* ---------- Render the full itinerary ---------- */
function fmtMoney(n) { return "$" + n.toLocaleString("en-US"); }

/* Selected option indexes for a multi-select question, by its id */
function selectedIdx(id) {
  const qi = QUESTIONS.findIndex(q => q.id === id);
  const a = state.answers[qi];
  if (!Array.isArray(a)) return [];
  return a.map(o => QUESTIONS[qi].options.indexOf(o)).filter(k => k >= 0);
}

/* Where to actually get each kind of kosher food / each kind of shopping */
const FOOD_RECS = [
  "Real kosher Thai — pad thai, curries and noodle soups at the Chabad house restaurants in Bangkok, Phuket and Chiang Mai",
  "Kosher burgers & steaks — Bangkok's kosher grills in the Sukhumvit area do a proper steak night",
  "Israeli breakfasts, salads and shakshuka — the Israeli-style kosher spots clustered near the Chabad houses",
  "Kosher sushi & fresh fish — ask at the Chabad restaurants; fin-and-scale fish is easy to source all over Thailand",
  "Kosher pizza, waffles, bakeries and ice cream — Bangkok's kosher bakery scene will genuinely surprise you",
];
const SHOP_RECS = [
  "Brand-name sneakers & sportswear — Bangkok's mega-malls (Siam Paragon, CentralWorld) and their outlet floors",
  "Clothing & fashion — Platinum Fashion Mall and the whole Pratunam district are wholesale heaven",
  "Handmade wood décor & furniture — Chatuchak market in Bangkok and Chiang Mai's craft villages (Baan Tawai)",
  "Electronics & gadgets — MBK Center and Pantip Plaza in Bangkok",
  "Gifts & souvenirs — the glittering night markets in every city on your route",
];

function renderResult(rec, code) {
  const root = el("#result-content");
  const placeNames = rec.legs.map(l => l.destination.name).join(" → ");
  const foodPicks = selectedIdx("foods").map(k => FOOD_RECS[k]).filter(Boolean);
  const shopPicks = selectedIdx("shopping").map(k => SHOP_RECS[k]).filter(Boolean);
  if (code === undefined) code = answersToCode(state.answers);
  const link = code ? shareUrl(code) : null;
  const shareText = `🇹🇭 Check out our custom Thailand trip plan — ${rec.meta.tripLength} days: ${placeNames}!`;

  // note (light markdown: *word* -> em)
  const noteHtml = rec.note
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");

  const themesHtml = rec.themes.map(t =>
    `<span class="chip">${t.emoji} ${t.label}</span>`).join("");

  const barsHtml = rec.themes.map(t => {
    const pct = Math.round(Math.min(1, (t.value) / 12) * 100);
    return `<div class="bar-row"><div class="bar-top"><span>${t.emoji} ${t.label}</span><span>${pct}%</span></div>
      <div class="bar-track"><div class="bar-fill" data-w="${pct}"></div></div></div>`;
  }).join("");

  const legsHtml = rec.legs.map((leg, i) => {
    const d = leg.destination;
    const days = leg.plan.map((line, di) =>
      `<div class="day-item"><span class="day-badge">Day ${di + 1}</span><p>${line}</p></div>`).join("");
    const highlights = d.highlights.map(h => `<li>${h}</li>`).join("");
    const kosherSpots = d.kosher.spots.map(s => `<li>${s}</li>`).join("");
    const shulPlaces = d.shul.places.map(s => `<li>${s}</li>`).join("");
    return `
    <article class="leg">
      <div class="leg__img" style="background-image:linear-gradient(180deg,rgba(8,76,55,0) 30%,rgba(8,76,55,.4)),url('${d.image}')">
        <div class="leg__imgtext">
          <div class="leg__num">Stop ${i + 1} of ${rec.legs.length}</div>
          <h3>${d.emoji} ${d.name}<span class="leg__days">${leg.days} days</span></h3>
        </div>
      </div>
      <div class="leg__body">
        <p class="leg__tagline">${d.tagline}</p>

        <h4>🗓️ Your day-by-day</h4>
        <div class="day-list">${days}</div>

        <h4>✨ Don't miss</h4>
        <ul class="hl-list">${highlights}</ul>

        <div class="kosher-box">
          <span class="box-tag k">🍽️ Kosher food · ${d.kosher.level}</span>
          <p class="box-summary">${d.kosher.summary}</p>
          <ul class="info-list">${kosherSpots}</ul>
        </div>

        <div class="shul-box">
          <span class="box-tag s">🕍 Shabbos & shul</span>
          <p class="box-summary">${d.shul.summary}</p>
          <ul class="info-list">${shulPlaces}</ul>
        </div>
      </div>
    </article>`;
  }).join("");

  root.innerHTML = `
    ${sharedView ? `
    <div class="shared-banner">
      <span>💌 A custom Thailand trip plan was shared with you!</span>
      <button id="design-own-btn">✨ Design your own</button>
    </div>` : ""}
    <div class="result-hero">
      <div class="tada">🎉🇹🇭</div>
      <h2>${esc(COUPLE.both)}, Your Thailand Journey is Ready!</h2>
      <p>${rec.meta.tripLength} days · ${placeNames}</p>
    </div>

    <div class="note-card">
      <div class="note-head">
        <div class="avi-avatar">🧑‍✈️</div>
        <div><b>A note for ${esc(COUPLE.both)}</b><span>From your personal Thailand trip designer</span></div>
      </div>
      <div class="note-body">${noteHtml}</div>
    </div>

    <div class="panel">
      <h3>🧭 Your travel style</h3>
      <div class="chips">${themesHtml}</div>
      <div class="bars" style="margin-top:16px">${barsHtml}</div>
    </div>

    <div class="panel">
      <h3>💰 Budget snapshot</h3>
      <div class="stat-grid">
        <div class="stat"><div class="stat-label">Travel tier</div><div class="stat-value">${rec.tier.tier}</div></div>
        <div class="stat"><div class="stat-label">Trip length</div><div class="stat-value">${rec.meta.tripLength} days</div></div>
        <div class="stat"><div class="stat-label">Est. for two*</div><div class="stat-value">${fmtMoney(rec.budget.low)}–${fmtMoney(rec.budget.high)}</div></div>
        <div class="stat"><div class="stat-label">Per day (2 ppl)</div><div class="stat-value">${fmtMoney(rec.tier.perDay[0]*2)}–${fmtMoney(rec.tier.perDay[1]*2)}</div></div>
      </div>
      <p style="font-size:.78rem;color:var(--ink-soft);margin-top:10px">*On-the-ground costs (hotels, food, activities, local transport). International flights not included.</p>
    </div>

    <div class="panel">
      <h3>🍍 Eating kosher in Thailand — good to know</h3>
      <ul class="info-list">
        <li>This whole plan assumes strictly kosher — your meals come from Chabad restaurants, Shabbos catering, kosher groceries, or your own kitchen.</li>
        <li>Markets and street stalls overflow with fresh tropical fruit — mango, mangosteen, rambutan, fresh coconut — all yours to enjoy.</li>
        <li>The local Chabad publishes a list of supermarket products that are kosher even without a printed symbol — pick up the current list at any Chabad house.</li>
        <li>The fresh juice &amp; smoothie stands you'll see everywhere (just fruit and ice) are considered kosher by the local Chabad.</li>
        <li>Stock up on kosher meat, wine and staples in Bangkok before heading to the islands.</li>
      </ul>
    </div>

    ${foodPicks.length ? `
    <div class="panel">
      <h3>😋 Your kind of food — all kosher</h3>
      <ul class="info-list">${foodPicks.map(f => `<li>${f}</li>`).join("")}</ul>
      <p style="font-size:.8rem;color:var(--ink-soft);margin-top:10px">Ask each Chabad for the current list of kosher restaurants and caterers — it grows every year.</p>
    </div>` : ""}

    ${shopPicks.length ? `
    <div class="panel">
      <h3>🛍️ Where to shop for what you love</h3>
      <ul class="info-list">${shopPicks.map(s => `<li>${s}</li>`).join("")}</ul>
    </div>` : ""}

    <div class="panel">
      <h3>📱 Before you fly — three quick setups</h3>
      <ul class="info-list">
        <li><b>Grab</b> (Thailand's Uber) — install it, attach your credit card, and verify your phone number <b>before you leave Israel</b>. It's the easiest way to get around.</li>
        <li><b>Airalo eSIM</b> — load it on your phones before the flight; it has the cheapest data plans in Thailand.</li>
        <li><b>Mopeds</b> — everywhere and cheap: rent your own, or hire a moped-taxi driver for quick hops.</li>
      </ul>
    </div>

    <h3 style="margin:26px 4px 2px;color:var(--emerald-deep);font-size:1.25rem">🗺️ Your custom itinerary</h3>
    ${legsHtml}

    <div class="disclaimer">
      💡 <b>A quick note:</b> Chabad houses, kosher restaurants and minyan times in Thailand can change with the season.
      Please confirm current hours and Shabbos details directly with each Chabad before you travel — they're wonderfully welcoming and happy to help.
    </div>

    ${link ? `
    <div class="panel share-panel">
      <h3>📤 Share this trip</h3>
      <p class="share-sub">Send this exact itinerary to ${esc(COUPLE.n2)}, family or friends — the link opens the full plan, answers and all.</p>
      <div class="share-link-row">
        <input id="share-url" readonly value="${link}" />
        <button id="copy-btn">Copy</button>
      </div>
      <div class="share-btns">
        <button class="share-chip share-chip--wa" id="wa-btn">💬 WhatsApp</button>
        <button class="share-chip" id="native-share-btn">📱 Share…</button>
      </div>
    </div>` : ""}

    <button class="btn btn--emerald" id="restart-btn">↻ Start over / try different answers</button>
    <div class="credit-card">🤖 Created by <b>Jonathan Caras</b> using various AI tools</div>
    <div class="footer">Made with ❤️ for <b>${esc(COUPLE.custom ? COUPLE.both : "Avi & Rivki Barr")}</b> · Your first Thailand adventure together awaits 🇹🇭</div>
  `;

  // animate bars in
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.querySelectorAll(".bar-fill").forEach(b => { b.style.width = b.dataset.w + "%"; });
    }, 120);
  });

  el("#restart-btn").addEventListener("click", () => {
    state.index = 0;
    state.answers = new Array(TOTAL_QUESTIONS).fill(null);
    sharedView = false;
    history.replaceState(null, "", location.pathname + namesQuery("?"));
    show("welcome");
  });

  const ownBtn = el("#design-own-btn");
  if (ownBtn) ownBtn.addEventListener("click", () => {
    state.index = 0;
    state.answers = new Array(TOTAL_QUESTIONS).fill(null);
    sharedView = false;
    history.replaceState(null, "", location.pathname + namesQuery("?"));
    show("welcome");
  });

  if (link) {
    el("#copy-btn").addEventListener("click", () => copyLink(link));
    el("#share-url").addEventListener("click", (e) => e.target.select());
    el("#wa-btn").addEventListener("click", () => {
      window.open("https://wa.me/?text=" + encodeURIComponent(shareText + "\n" + link), "_blank");
    });
    const nativeBtn = el("#native-share-btn");
    if (navigator.share) {
      nativeBtn.addEventListener("click", () => {
        navigator.share({ title: "Our Thailand Trip Plan 🇹🇭", text: shareText, url: link }).catch(() => {});
      });
    } else {
      nativeBtn.style.display = "none";
    }
  }
}

/* ---------- Copy helper + toast ---------- */
function copyLink(link) {
  const done = () => toast("Link copied! 🎉 Send it to anyone");
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link).then(done).catch(() => legacyCopy(link, done));
  } else {
    legacyCopy(link, done);
  }
}
function legacyCopy(link, done) {
  const input = el("#share-url");
  input.select(); input.setSelectionRange(0, 99999);
  try { document.execCommand("copy"); done(); }
  catch (e) { toast("Long-press the link to copy it"); }
}
let toastTimer = null;
function toast(msg) {
  let t = el("#toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- Open a shared trip link ---------- */
(function initFromUrl() {
  const code = new URLSearchParams(location.search).get("trip");
  const answers = codeToAnswers(code);
  if (!answers) return;
  state.answers = answers;
  sharedView = true;
  show("loading");
  el("#loading-line").textContent = "Unwrapping a shared trip plan… 💌";
  setTimeout(() => {
    const rec = generateRecommendation(answers);
    renderResult(rec, code);
    show("result");
  }, 900);
})();
