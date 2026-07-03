/* ============================================================
   THE RECOMMENDATION ENGINE
   Turns 50 answers into: a traveler profile, a set of matched
   destinations, a day-by-day itinerary, a budget estimate, and
   a warm personal note addressed to Avi & Rivki.
   ============================================================ */

const DIMENSIONS = [
  "budget","luxury","pace","adventure","relax","culture","nature",
  "beach","city","food","wellness","shopping","romance","crowds",
  "kosherStrict","observance","heat","nightlife",
];

function emptyProfile() {
  const p = {};
  DIMENSIONS.forEach(d => (p[d] = 0));
  return p;
}

/* Aggregate all answer scores + pull out meta values.
   Multi-select answers arrive as arrays — every chosen option counts. */
function buildProfile(answers) {
  const profile = emptyProfile();
  const meta = { tripLength: 8 };
  answers.forEach((opt) => {
    const opts = Array.isArray(opt) ? opt : [opt];
    opts.forEach((o) => {
      if (!o) return;
      if (o.scores) {
        for (const k in o.scores) profile[k] += o.scores[k];
      }
      if (o.meta) Object.assign(meta, o.meta);
    });
  });
  // The couple is assumed strictly kosher — every itinerary keeps kosher
  // infrastructure in reach regardless of individual answers.
  profile.kosherStrict += 3;
  return { profile, meta };
}

/* Normalize a raw profile score to 0..1 for display bars */
function norm(v, max) { return Math.max(0, Math.min(1, (v + max) / (max * 2))); }

/* Budget tier from accumulated budget/luxury points */
function budgetTier(profile) {
  const b = profile.budget + profile.luxury * 0.6;
  if (b >= 18) return { tier: "Luxury", perDay: [350, 600], key: "luxury" };
  if (b >= 7)  return { tier: "Upscale", perDay: [200, 350], key: "upscale" };
  if (b >= 3)  return { tier: "Comfortable mid-range", perDay: [110, 200], key: "mid" };
  return { tier: "Value-savvy", perDay: [60, 110], key: "value" };
}

/* Score each destination against the profile via a weighted dot product */
function scoreDestinations(profile) {
  const scored = DESTINATION_ORDER.map((key) => {
    const d = DESTINATIONS[key];
    let score = 0;
    for (const dim in d.affinity) {
      score += (d.affinity[dim] || 0) * (profile[dim] || 0);
    }
    // Observance nudge: if a strong shul/kosher need, boost places with infrastructure
    if (profile.observance >= 4 || profile.kosherStrict >= 5) {
      score += (d.affinity.observance || 0) * 2;
    }
    return { key, d, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored;
}

/* Decide how many destinations based on trip length + pace */
function destinationCount(meta, profile) {
  const days = meta.tripLength;
  let n;
  if (days <= 5) n = profile.pace > 3 ? 2 : 1;
  else if (days <= 8) n = profile.pace > 4 ? 3 : 2;
  else if (days <= 11) n = profile.pace > 2 ? 3 : 2;
  else n = profile.pace > 0 ? 4 : 3;
  return Math.max(1, Math.min(4, n));
}

/* Ensure at least one strong-kosher base if the couple needs it */
function ensureKosherBase(chosen, ranked, profile) {
  if (profile.observance < 3 && profile.kosherStrict < 4) return chosen;
  const hasStrong = chosen.some(c => (c.d.affinity.observance || 0) >= 2);
  if (hasStrong) return chosen;
  const base = ranked.find(r => (r.d.affinity.observance || 0) >= 2);
  if (base && !chosen.includes(base)) {
    chosen[chosen.length - 1] = base; // swap weakest for a kosher base
  }
  return chosen;
}

/* Bangkok is Thailand's main international gateway AND its strongest kosher /
   minyan hub. For any realistic first-timer trip of a few days or more — and
   especially for observant travelers — a Bangkok stop belongs in the plan.
   Include it (as the arrival city) when the trip is long enough to warrant it. */
function ensureGateway(chosen, ranked, profile, meta) {
  const bkk = ranked.find(r => r.key === "bangkok");
  if (!bkk) return chosen;
  const already = chosen.some(c => c.key === "bangkok");
  const wantsBangkok =
    meta.tripLength >= 6 || profile.observance >= 2 || profile.kosherStrict >= 3 ||
    profile.city >= 3 || profile.culture >= 6;
  if (already || !wantsBangkok) return chosen;

  // Prefer to ADD Bangkok only when the trip is long enough (≈3 nights per base)
  // and the couple isn't strongly relaxation-paced (don't fragment a slow trip).
  const canAdd = chosen.length < 4 &&
                 meta.tripLength >= (chosen.length + 1) * 3 &&
                 profile.pace >= 0;
  if (canAdd) {
    chosen.push(bkk);
  } else if (chosen.length >= 2) {
    // Swap the weakest existing leg for Bangkok — but never strip a solo,
    // strong-fit trip (e.g. a short pure-beach getaway) of its one destination.
    chosen[chosen.length - 1] = bkk;
  }
  return chosen;
}

/* Distribute days across chosen destinations, weighted by fit score */
function allocateDays(chosen, totalDays) {
  const weights = chosen.map(c => Math.max(1, c.score));
  const sum = weights.reduce((a, b) => a + b, 0);
  let alloc = weights.map(w => Math.max(2, Math.round((w / sum) * totalDays)));
  // fix rounding drift
  let diff = totalDays - alloc.reduce((a, b) => a + b, 0);
  let i = 0;
  while (diff !== 0 && alloc.length) {
    const idx = i % alloc.length;
    if (diff > 0) { alloc[idx]++; diff--; }
    else if (alloc[idx] > 2) { alloc[idx]--; diff++; }
    else { i++; if (i > 100) break; continue; }
    i++;
  }
  return alloc;
}

/* Build a per-destination day plan drawing on its highlights.
   Evening spectacles (Muay Thai nights, shows) are kept aside and woven
   in as after-dark plans so they never crowd out the daytime sights. */
function buildDayPlan(dest, days, profile) {
  const evenings = dest.highlights.filter(x => /muay thai|show/i.test(x));
  const h = dest.highlights.filter(x => !evenings.includes(x));
  const plan = [];
  // opening day
  plan.push(`Arrive in ${dest.name}, settle in, and take a gentle first evening to find your feet${profile.romance > 4 ? " — a quiet dinner for the two of you" : ""}.`);
  let hi = 0;
  for (let day = 2; day <= days; day++) {
    const picks = [];
    picks.push(h[hi % h.length]); hi++;
    if (profile.pace > 2 && day < days) { picks.push(h[hi % h.length]); hi++; }
    let line = picks.join("; then ");
    if (profile.relax > 5 && day % 3 === 0) line = "A slow, unstructured day — pool, rest, and wander at your own pace.";
    // the daily ritual: spa-loving couples get a shake + massage every day
    if (profile.wellness >= 4) line += ". End the day with a fresh fruit shake and a Thai massage.";
    else if (profile.wellness > 1 && day % 2 === 0) line += ". End with a relaxing Thai massage.";
    plan.push(line);
  }
  // weave the evening spectacles into the middle of the leg
  let ei = 0;
  [2, days - 1].forEach(d => {
    if (d >= 2 && d <= days && ei < evenings.length && plan[d - 1]) {
      const ev = evenings[ei++];
      plan[d - 1] = plan[d - 1].replace(/\.?$/, "") + `. In the evening: ${ev.charAt(0).toLowerCase() + ev.slice(1)}.`;
    }
  });
  return plan;
}

/* Estimate a budget range for the trip */
function estimateBudget(meta, tier) {
  const days = meta.tripLength;
  const low = days * tier.perDay[0] * 2;   // two people
  const high = days * tier.perDay[1] * 2;
  return { low, high, tier: tier.tier };
}

/* Identify the top themes to describe the couple's style */
function topThemes(profile) {
  const themeMap = [
    { key: "relax", label: "Relaxation & rest", emoji: "🧘" },
    { key: "adventure", label: "Adventure & exploration", emoji: "🚀" },
    { key: "culture", label: "Markets & local culture", emoji: "🏮" },
    { key: "nature", label: "Nature & the outdoors", emoji: "🌿" },
    { key: "beach", label: "Beaches & islands", emoji: "🏝️" },
    { key: "city", label: "City energy", emoji: "🏙️" },
    { key: "food", label: "Food & flavors", emoji: "🍜" },
    { key: "wellness", label: "Wellness & spa", emoji: "💆" },
    { key: "romance", label: "Romance & togetherness", emoji: "❤️" },
    { key: "observance", label: "Torah & Shabbos life", emoji: "✡️" },
  ];
  return themeMap
    .map(t => ({ ...t, value: profile[t.key] }))
    .sort((a, b) => b.value - a.value)
    .filter(t => t.value > 0)
    .slice(0, 4);
}

/* A warm note addressed to Avi & Rivki from their trip designer */
function aviNote(profile, meta, chosen) {
  const places = chosen.map(c => c.d.name);
  const placeList =
    places.length === 1 ? places[0] :
    places.slice(0, -1).join(", ") + " and " + places[places.length - 1];
  const styleBits = [];
  if (profile.relax > profile.adventure) styleBits.push("unwind and truly rest");
  else styleBits.push("explore and soak up everything");
  if (profile.observance >= 3) styleBits.push("keep a beautiful Shabbos with a warm community");
  if (profile.romance >= 5) styleBits.push("enjoy real quality time, just the two of you");
  if (profile.food >= 5) styleBits.push("eat wonderfully well — kosher and all");

  return `Shalom, Avi & Rivki! 🌏\n\n` +
    `I read every one of your ${TOTAL_QUESTIONS} answers, and I have to say — you two are going to *love* Thailand. ` +
    `Based on everything you told me, I've built you a ${meta.tripLength}-day journey through ${placeList}, ` +
    `designed so you can ${styleBits.join(", ")}.\n\n` +
    `Everything below keeps kosher and Shabbos front-and-center, so the two of you can relax and just enjoy each other and this magical country. ` +
    `Wishing you an unforgettable first trip together — nesiah tovah!\n\n— Your Thailand trip designer`;
}

/* MAIN: produce the full recommendation object */
function generateRecommendation(answers) {
  const { profile, meta } = buildProfile(answers);
  const ranked = scoreDestinations(profile);
  const n = destinationCount(meta, profile);
  let chosen = ranked.slice(0, n);
  chosen = ensureKosherBase(chosen, ranked, profile);
  chosen = ensureGateway(chosen, ranked, profile, meta);

  // Order the trip: Bangkok opens it (arrival gateway + easy first Shabbos);
  // otherwise a strong-kosher base leads for observant couples.
  chosen.sort((a, b) => {
    if (a.key === "bangkok") return -1;
    if (b.key === "bangkok") return 1;
    const ao = (a.d.affinity.observance || 0), bo = (b.d.affinity.observance || 0);
    if (bo !== ao && (profile.observance >= 3)) return bo - ao;
    return b.score - a.score;
  });

  const dayAlloc = allocateDays(chosen, meta.tripLength);
  const tier = budgetTier(profile);
  const budget = estimateBudget(meta, tier);

  const legs = chosen.map((c, i) => ({
    destination: c.d,
    days: dayAlloc[i],
    plan: buildDayPlan(c.d, dayAlloc[i], profile),
  }));

  return {
    profile,
    meta,
    themes: topThemes(profile),
    tier,
    budget,
    legs,
    note: aviNote(profile, meta, chosen),
    normalized: DIMENSIONS.reduce((acc, d) => {
      acc[d] = norm(profile[d], 10);
      return acc;
    }, {}),
  };
}
