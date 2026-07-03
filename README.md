# 🇹🇭 Avi & Rivki's Thailand Trip Designer

A fun, mobile-first questionnaire that asks a couple **50 thematic multiple-choice questions** about how they like to travel — budget, pace, kosher needs, Shabbos observance, beaches vs. mountains, food, romance and more — and then generates a **fully customized, kosher-friendly Thailand itinerary**.

Built for **Avi & Rivki Barr**, a religious Jewish couple heading to Thailand together for the first time.

## ✨ What it does

- **50 themed questions** across 10 sections (The Basics, Budget & Comfort, Kosher & Observance, The Vacation Vibe, Nature, Culture, Beaches, Food, Wellness, and Just the Two of You).
- A **recommendation engine** scores answers against five real Thai destinations and builds a **day-by-day itinerary**, matched to trip length, pace and budget.
- Every stop includes **kosher food guidance** and **synagogue / Chabad locations** for Shabbos.
- A warm, **personalized note addressed to Avi & Rivki**, a travel-style breakdown, and a budget snapshot.
- Cute, colorful, Thai-inspired design — **built to feel great on a phone**.
- **Shareable results** — every finished quiz produces a `?trip=<code>` link (all 50 answers encoded) that opens the exact same itinerary for anyone. Copy, WhatsApp, or native-share buttons built in.
- **Social share card** — Open Graph + Twitter meta tags with a custom 1200×630 card, so the link previews beautifully on WhatsApp, iMessage and social media.
- **A recommended path** — every question pre-selects a "(recommended)" answer sketching our suggested trip: two full weeks, islands and water activities, resort stays, elephant days, evening shows (FantaSea, Muay Thai) and a daily fruit-shake-and-massage ritual. Tap through to accept, or change any answer.
- **Multi-select questions** — paid extras, elephant experiences, shopping wishlist, favorite foods and evening shows all support picking several answers, and the results recommend matching kosher restaurants and shopping venues.
- **Halachah-aware** — the trip is designed to avoid interacting with Thai temples entirely (no temple visits, photos or imagery), and assumes strictly kosher eating throughout.
- **Practical education built in** — supermarket kosher lists, fruit-and-ice smoothie stands, the durian hotel ban, Grab app setup, Airalo eSIMs and moped options.

## 🗂️ Structure

```
index.html            # app shell (welcome → quiz → loading → results)
css/styles.css        # Thai-inspired, mobile-first styling
js/questions.js       # the 50 questions + scoring
js/destinations.js    # Bangkok, Chiang Mai, Phuket, Koh Samui, Krabi — activities, kosher, shuls
js/engine.js          # scoring + itinerary builder
js/app.js             # UI flow & rendering
```

It's a **pure static site** — no build step, no dependencies. Open `index.html` locally or deploy anywhere.

## 🚀 Deploy

Already configured for **Vercel** (static, zero-config via `vercel.json`). Push to GitHub and import, or run `vercel`.

## 📝 Note on accuracy

Chabad houses, kosher restaurants and minyan times in Thailand change with the season. The itinerary reminds travelers to confirm current details directly with each Chabad before traveling.

---

Made with ❤️ for Avi & Rivki Barr. Created by **Jonathan Caras** using various AI tools.
