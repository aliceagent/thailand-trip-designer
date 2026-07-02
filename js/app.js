/* ============================================================
   APP — UI flow: welcome → 50 questions → reveal → itinerary
   ============================================================ */

const state = {
  index: 0,               // current question index
  answers: new Array(TOTAL_QUESTIONS).fill(null),
};
let sharedView = false;   // true when viewing a trip opened from a shared link

/* ---------- Shareable links ----------
   Every answer is an option index (0-3), so a full quiz encodes to a
   50-digit string. `?trip=<code>` reproduces the exact itinerary. */
function answersToCode(answers) {
  const digits = answers.map((a, i) => QUESTIONS[i].options.indexOf(a));
  return digits.some(d => d < 0) ? null : digits.join("");
}
function codeToAnswers(code) {
  if (typeof code !== "string" || code.length !== TOTAL_QUESTIONS) return null;
  const answers = [...code].map((c, i) => QUESTIONS[i].options[+c]);
  return answers.some(a => !a) ? null : answers;
}
function shareUrl(code) {
  return location.origin + location.pathname + "?trip=" + code;
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

function renderQuestion() {
  const i = state.index;
  const q = QUESTIONS[i];
  const sec = sectionFor(q);

  // Pre-select our recommended answer so the couple can breeze through,
  // confirming or changing each one as they go.
  if (!state.answers[i] && RECOMMENDED[i] !== undefined) {
    state.answers[i] = q.options[RECOMMENDED[i]];
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

  el("#q-emoji").textContent = q.emoji;
  el("#q-text").textContent = q.text;
  el("#q-hint").textContent = sec.blurb;

  const opts = el("#options");
  opts.innerHTML = "";
  q.options.forEach((opt, oi) => {
    const isRec = RECOMMENDED[i] === oi;
    const b = document.createElement("button");
    b.className = "option" + (state.answers[i] === opt ? " selected" : "");
    b.innerHTML =
      `<span class="opt-emoji">${opt.emoji || "•"}</span>` +
      `<span class="opt-label">${opt.label}${isRec ? ' <span class="opt-rec">(recommended)</span>' : ""}</span>` +
      `<span class="opt-check">✓</span>`;
    b.addEventListener("click", () => selectOption(oi));
    opts.appendChild(b);
  });

  // nav
  el("#nav-back").disabled = i === 0;
  el("#nav-hint").textContent = "Tap your choice to continue — our pick is pre-selected";
}

function selectOption(optIndex) {
  const i = state.index;
  const q = QUESTIONS[i];
  state.answers[i] = q.options[optIndex];

  // visually mark selection
  document.querySelectorAll("#options .option").forEach((o, idx) => {
    o.classList.toggle("selected", idx === optIndex);
  });

  // auto-advance for a snappy mobile feel
  setTimeout(() => {
    if (state.index < TOTAL_QUESTIONS - 1) {
      state.index++;
      renderQuestion();
    } else {
      finish();
    }
  }, 260);
}

el("#nav-back").addEventListener("click", () => {
  if (state.index > 0) { state.index--; renderQuestion(); }
});

/* ---------- Finish → loading → result ---------- */
const LOADING_LINES = [
  "Reading all 50 of your answers…",
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
    if (code) history.replaceState(null, "", "?trip=" + code); // URL bar is instantly shareable
    renderResult(rec, code);
    show("result");
  }, LOADING_LINES.length * 620 + 300);
}

/* ---------- Render the full itinerary ---------- */
function fmtMoney(n) { return "$" + n.toLocaleString("en-US"); }

function renderResult(rec, code) {
  const root = el("#result-content");
  const placeNames = rec.legs.map(l => l.destination.name).join(" → ");
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
      <h2>Avi &amp; Rivki, Your Thailand Journey is Ready!</h2>
      <p>${rec.meta.tripLength} days · ${placeNames}</p>
    </div>

    <div class="note-card">
      <div class="note-head">
        <div class="avi-avatar">🧑‍✈️</div>
        <div><b>A note for Avi &amp; Rivki</b><span>From your personal Thailand trip designer</span></div>
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

    <h3 style="margin:26px 4px 2px;color:var(--emerald-deep);font-size:1.25rem">🗺️ Your custom itinerary</h3>
    ${legsHtml}

    <div class="disclaimer">
      💡 <b>A quick note:</b> Chabad houses, kosher restaurants and minyan times in Thailand can change with the season.
      Please confirm current hours and Shabbos details directly with each Chabad before you travel — they're wonderfully welcoming and happy to help.
    </div>

    ${link ? `
    <div class="panel share-panel">
      <h3>📤 Share this trip</h3>
      <p class="share-sub">Send this exact itinerary to Rivki, family or friends — the link opens the full plan, answers and all.</p>
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
    <div class="footer">Made with ❤️ for <b>Avi &amp; Rivki Barr</b> · Your first Thailand adventure together awaits 🇹🇭</div>
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
    history.replaceState(null, "", location.pathname);
    show("welcome");
  });

  const ownBtn = el("#design-own-btn");
  if (ownBtn) ownBtn.addEventListener("click", () => {
    state.index = 0;
    state.answers = new Array(TOTAL_QUESTIONS).fill(null);
    sharedView = false;
    history.replaceState(null, "", location.pathname);
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
