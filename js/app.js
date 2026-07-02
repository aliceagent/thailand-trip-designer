/* ============================================================
   APP — UI flow: welcome → 50 questions → reveal → itinerary
   ============================================================ */

const state = {
  index: 0,               // current question index
  answers: new Array(TOTAL_QUESTIONS).fill(null),
};

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
    const b = document.createElement("button");
    b.className = "option" + (state.answers[i] === opt ? " selected" : "");
    b.innerHTML =
      `<span class="opt-emoji">${opt.emoji || "•"}</span>` +
      `<span class="opt-label">${opt.label}</span>` +
      `<span class="opt-check">✓</span>`;
    b.addEventListener("click", () => selectOption(oi));
    opts.appendChild(b);
  });

  // nav
  el("#nav-back").disabled = i === 0;
  el("#nav-hint").textContent = state.answers[i]
    ? (i === TOTAL_QUESTIONS - 1 ? "Tap again or continue →" : "Nice — moving on…")
    : "Tap an answer to continue";
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
  "Avi is putting the finishing touches on it…",
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
    renderResult(rec);
    show("result");
  }, LOADING_LINES.length * 620 + 300);
}

/* ---------- Render the full itinerary ---------- */
function fmtMoney(n) { return "$" + n.toLocaleString("en-US"); }

function renderResult(rec) {
  const root = el("#result-content");
  const placeNames = rec.legs.map(l => l.destination.name).join(" → ");

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
    <div class="result-hero">
      <div class="tada">🎉🇹🇭</div>
      <h2>Your Thailand Journey is Ready!</h2>
      <p>${rec.meta.tripLength} days · ${placeNames}</p>
    </div>

    <div class="note-card">
      <div class="note-head">
        <div class="avi-avatar">🧑‍✈️</div>
        <div><b>A note from Avi Barr</b><span>Your personal Thailand trip designer</span></div>
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
      💡 <b>A quick note from Avi:</b> Chabad houses, kosher restaurants and minyan times in Thailand can change with the season.
      Please confirm current hours and Shabbos details directly with each Chabad before you travel — they're wonderfully welcoming and happy to help.
    </div>

    <button class="btn btn--emerald" id="restart-btn">↻ Start over / try different answers</button>
    <div class="footer">Made with ❤️ by <b>Avi Barr</b> · Your first Thailand adventure awaits 🇹🇭</div>
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
    show("welcome");
  });
}
