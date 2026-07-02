# 🇹🇭 Avi Barr's Thailand Trip Designer

A fun, mobile-first questionnaire that asks a couple **50 thematic multiple-choice questions** about how they like to travel — budget, pace, kosher needs, Shabbos observance, beaches vs. mountains, food, romance and more — and then generates a **fully customized, kosher-friendly Thailand itinerary**.

Built for a religious Jewish couple heading to Thailand for the first time. Hosted by **Avi Barr**, their personal trip designer.

## ✨ What it does

- **50 themed questions** across 10 sections (The Basics, Budget & Comfort, Kosher & Observance, The Vacation Vibe, Nature, Culture, Beaches, Food, Wellness, and Just the Two of You).
- A **recommendation engine** scores answers against five real Thai destinations and builds a **day-by-day itinerary**, matched to trip length, pace and budget.
- Every stop includes **kosher food guidance** and **synagogue / Chabad locations** for Shabbos.
- A warm, **personalized note "from Avi Barr"**, a travel-style breakdown, and a budget snapshot.
- Cute, colorful, Thai-inspired design — **built to feel great on a phone**.

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

Made with ❤️ by Avi Barr.
