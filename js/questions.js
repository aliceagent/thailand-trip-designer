/* ============================================================
   THE 50 QUESTIONS
   Organized into 10 themed sections. Each option carries a
   `scores` object that feeds the recommendation engine
   (see js/engine.js). Dimensions used:
     budget, luxury, pace, adventure, relax, culture, nature,
     beach, city, food, wellness, shopping, romance, crowds,
     kosherStrict, observance, heat, nightlife
   Two special questions set `meta` values directly:
     q1 -> tripLength (days),  q6 -> partyMonth (season)
   ============================================================ */

const SECTIONS = [
  { id: "basics",    title: "The Basics",            emoji: "🧳", blurb: "First, the big-picture shape of your trip." },
  { id: "budget",    title: "Budget & Comfort",      emoji: "💰", blurb: "How you like to travel — and what feels right to spend." },
  { id: "kosher",    title: "Kosher & Observance",   emoji: "✡️", blurb: "So your itinerary keeps Shabbos and your kitchen in mind." },
  { id: "vibe",      title: "The Vacation Vibe",     emoji: "🌈", blurb: "Adventure seekers or slow-and-easy? Let's find out." },
  { id: "nature",    title: "Nature & Outdoors",     emoji: "🌿", blurb: "Mountains, jungles, elephants and open sky." },
  { id: "culture",   title: "Culture & Sightseeing", emoji: "🏮", blurb: "Markets, shows, shopping and local color." },
  { id: "beach",     title: "Beaches & Water",       emoji: "🏝️", blurb: "The islands are calling. How loud?" },
  { id: "food",      title: "Food & Flavors",        emoji: "🍜", blurb: "Even kosher travelers eat like kings in Thailand." },
  { id: "wellness",  title: "Wellness & Pace",       emoji: "💆", blurb: "Spa days, rest, and how full you like the calendar." },
  { id: "together",  title: "Just the Two of You",   emoji: "❤️", blurb: "The finishing touches for Avi & Rivki." },
];

const QUESTIONS = [
  /* ---------- SECTION 1: THE BASICS ---------- */
  { section: "basics", emoji: "📅", text: "How long is this Thailand adventure?",
    options: [
      { label: "A short taste — about 5 days", emoji: "⏳", meta: { tripLength: 5 }, scores: { pace: 1 } },
      { label: "A proper week — 7 to 8 days",  emoji: "🗓️", meta: { tripLength: 8 }, scores: {} },
      { label: "Ten to twelve days",           emoji: "📖", meta: { tripLength: 11 }, scores: { relax: 1 } },
      { label: "The big one — two weeks or more", emoji: "🌏", meta: { tripLength: 15 }, scores: { adventure: 1, relax: 1 } },
    ] },
  { section: "basics", emoji: "✈️", text: "How do you feel about internal flights and moving between places?",
    options: [
      { label: "Happy to hop around — more places, more memories", emoji: "🛫", scores: { adventure: 2, pace: 2 } },
      { label: "One or two moves is fine", emoji: "🚗", scores: { pace: 1 } },
      { label: "I'd rather settle into a base and do day trips", emoji: "🏡", scores: { relax: 2, pace: -1 } },
      { label: "Pick one perfect spot and don't make me pack twice", emoji: "🧘", scores: { relax: 3, pace: -2 } },
    ] },
  { section: "basics", emoji: "🌡️", text: "Thailand is hot and humid. How's that for the two of you?",
    options: [
      { label: "We love the heat — bring the sun", emoji: "☀️", scores: { heat: 2, beach: 1 } },
      { label: "Fine in moderation, we'll find the shade", emoji: "⛱️", scores: { heat: 1 } },
      { label: "We wilt — cooler mountain air sounds lovely", emoji: "⛰️", scores: { heat: -2, nature: 1 } },
      { label: "Air conditioning is a love language", emoji: "❄️", scores: { heat: -1, luxury: 1 } },
    ] },
  { section: "basics", emoji: "👣", text: "On a normal vacation day, how much walking feels right?",
    options: [
      { label: "Miles and miles — we're explorers", emoji: "🥾", scores: { adventure: 2, pace: 1 } },
      { label: "A good stroll, then a sit-down", emoji: "🚶", scores: { culture: 1 } },
      { label: "Light and easy, plenty of breaks", emoji: "🪑", scores: { relax: 2 } },
      { label: "Get us there by car, thank you", emoji: "🚕", scores: { luxury: 1, relax: 1 } },
    ] },
  { section: "basics", emoji: "🧭", text: "First time in Thailand — what are you most nervous about?",
    options: [
      { label: "Finding kosher food", emoji: "🍽️", scores: { kosherStrict: 2, observance: 1 } },
      { label: "Being too far from a shul on Shabbos", emoji: "🕍", scores: { observance: 3 } },
      { label: "The heat and the crowds", emoji: "😅", scores: { crowds: -2, heat: -1 } },
      { label: "Honestly? Nothing — we're excited!", emoji: "🎉", scores: { adventure: 1 } },
    ] },

  /* ---------- SECTION 2: BUDGET & COMFORT ---------- */
  { section: "budget", emoji: "🏨", text: "Where do you want to lay your head at night?",
    options: [
      { label: "Clean, simple and cheap is perfect", emoji: "🛏️", scores: { budget: 1 } },
      { label: "Comfortable mid-range with a nice pool", emoji: "🏊", scores: { budget: 2 } },
      { label: "Four-star comfort, no surprises", emoji: "⭐", scores: { budget: 3, luxury: 1 } },
      { label: "Five-star luxury — this is a special trip", emoji: "🥂", scores: { budget: 4, luxury: 3 } },
    ] },
  { section: "budget", emoji: "💵", text: "What's your comfortable total budget for the two of you (flights aside)?",
    options: [
      { label: "Value-minded — under $2,000", emoji: "🪙", scores: { budget: 1 } },
      { label: "Mid-range — $2,000 to $4,500", emoji: "💳", scores: { budget: 2 } },
      { label: "Generous — $4,500 to $8,000", emoji: "💎", scores: { budget: 3, luxury: 1 } },
      { label: "The sky's the limit — over $8,000", emoji: "🌟", scores: { budget: 4, luxury: 2 } },
    ] },
  { section: "budget", emoji: "🍷", text: "When it comes to kosher dining (Chabad restaurants and the like), you'd rather…",
    options: [
      { label: "Keep it simple and stretch every dollar", emoji: "🥙", scores: { budget: 1 } },
      { label: "A nice sit-down kosher dinner most nights", emoji: "🍲", scores: { budget: 2, food: 1 } },
      { label: "Treat ourselves — the best kosher table in town", emoji: "🍾", scores: { budget: 3, food: 2, luxury: 1 } },
    ] },
  { section: "budget", emoji: "🛎️", text: "Which of these would you happily pay extra for?", multi: true,
    options: [
      { label: "A private driver and guide", emoji: "🚙", scores: { luxury: 2, relax: 1 } },
      { label: "A room with a jaw-dropping view", emoji: "🌅", scores: { luxury: 2, romance: 1 } },
      { label: "Skip-the-line and first-class experiences", emoji: "🎟️", scores: { luxury: 2, culture: 1 } },
      { label: "We'd rather save it and do more", emoji: "📦", scores: { budget: -1, adventure: 1 } },
    ] },
  { section: "budget", emoji: "🛍️", text: "Shopping and souvenirs — where do you land?",
    options: [
      { label: "Bargain the markets, it's half the fun", emoji: "🧧", scores: { shopping: 2, culture: 1, crowds: 1 } },
      { label: "A few nice gifts and we're done", emoji: "🎁", scores: { shopping: 1 } },
      { label: "Air-conditioned malls and boutiques, please", emoji: "🛒", scores: { shopping: 2, city: 1, luxury: 1 } },
      { label: "We don't really shop on vacation", emoji: "🙅", scores: { shopping: -1 } },
    ] },

  /* ---------- SECTION 3: KOSHER & OBSERVANCE ---------- */
  { section: "kosher", emoji: "🥤",
    info: "💡 Good to know: eating strictly kosher in Thailand is easier than you'd think. Markets overflow with fresh tropical fruit, the local Chabad publishes a list of supermarket products that are kosher even without a printed symbol, and the fresh juice & smoothie stands — just fruit and ice — are considered kosher by the local Chabad. This whole trip assumes strictly kosher: no non-kosher restaurants, no non-kosher cooked food.",
    text: "Fresh-fruit juice & smoothie stands are everywhere (and kosher, per the local Chabad). How often will you stop?",
    options: [
      { label: "Constantly — the mango shakes are calling", emoji: "🥭", scores: { food: 2, heat: 1 } },
      { label: "Whenever one looks inviting", emoji: "🍹", scores: { food: 1 } },
      { label: "Once in a while", emoji: "🙂", scores: {} },
    ] },
  { section: "kosher", emoji: "🕍", text: "How important is being walking-distance from a shul on Shabbos?",
    options: [
      { label: "Essential — we won't stay anywhere else", emoji: "🎯", scores: { observance: 3, kosherStrict: 1 } },
      { label: "Very important, we'll plan around it", emoji: "🗺️", scores: { observance: 2 } },
      { label: "Nice to have for at least one Shabbos", emoji: "🌇", scores: { observance: 1 } },
      { label: "We're comfortable making our own Shabbos anywhere", emoji: "🕯️", scores: { observance: 0, adventure: 1 } },
    ] },
  { section: "kosher", emoji: "🍷", text: "Shabbos meals — how do you two want to do them?",
    options: [
      { label: "Join the big, warm, lively communal meals at Chabad", emoji: "👨‍👩‍👧‍👦", scores: { observance: 2, crowds: 1 } },
      { label: "Order Shabbos catering and enjoy it quietly at our hotel", emoji: "🕯️", scores: { observance: 1, romance: 2, relax: 1 } },
      { label: "Mix and match — one meal out with the crowd, one just us", emoji: "🌙", scores: { observance: 2, relax: 1 } },
    ] },
  { section: "kosher", emoji: "🧼", text: "How do you feel about a kitchenette in your room?",
    options: [
      { label: "Must-have — we'll prepare our own food", emoji: "🍳", scores: { kosherStrict: 2, budget: 1 } },
      { label: "Handy for making our own breakfasts and Shabbos prep", emoji: "☕", scores: { kosherStrict: 1 } },
      { label: "Not needed if kosher food is nearby", emoji: "📍", scores: { observance: 1 } },
      { label: "We'd rather eat out every meal", emoji: "🍴", scores: { food: 2, budget: 2 } },
    ] },
  { section: "kosher", emoji: "📿", text: "Weekday davening — what works for you two on the road?",
    options: [
      { label: "A minyan whenever possible", emoji: "🔟", scores: { observance: 2, city: 1 } },
      { label: "Chabad when it's around, on our own otherwise", emoji: "🧎", scores: { observance: 1 } },
      { label: "We daven privately and keep our schedule flexible", emoji: "🌄", scores: { adventure: 1 } },
    ] },
  { section: "kosher", emoji: "🛒", text: "Bangkok has real kosher groceries. Want to stock up there before heading out?",
    options: [
      { label: "Definitely — we'll leave with a full cooler", emoji: "🧊", scores: { kosherStrict: 2, city: 1 } },
      { label: "A quick stop for the essentials", emoji: "🧺", scores: { kosherStrict: 1 } },
      { label: "We'll manage with fruit and local finds", emoji: "🥭", scores: { adventure: 1 } },
    ] },

  /* ---------- SECTION 4: THE VACATION VIBE ---------- */
  { section: "vibe", emoji: "🌈", text: "Close your eyes — the perfect vacation day is…",
    options: [
      { label: "An adventure we'll talk about for years", emoji: "🚀", scores: { adventure: 3 } },
      { label: "A rich day of sightseeing and culture", emoji: "🏛️", scores: { culture: 3 } },
      { label: "Sun, a book, and absolutely no agenda", emoji: "📚", scores: { relax: 3, beach: 1 } },
      { label: "A little of everything, balanced and easy", emoji: "🎨", scores: { relax: 1, culture: 1, adventure: 1 } },
    ] },
  { section: "vibe", emoji: "🎢", text: "How do you feel about trying something a little daring?",
    options: [
      { label: "Sign us up — zip-lines, rafting, the works", emoji: "🪂", scores: { adventure: 3 } },
      { label: "ATVs and quad-bike trails — let's ride", emoji: "🏍️", scores: { adventure: 2, nature: 1 } },
      { label: "Gentle thrills, nothing crazy", emoji: "🚣", scores: { adventure: 1, nature: 1 } },
      { label: "We'll watch, thanks — with a cold drink", emoji: "🍹", scores: { relax: 2 } },
    ] },
  { section: "vibe", emoji: "🕰️", text: "Your ideal daily rhythm looks like…",
    options: [
      { label: "Up early, pack it full, collapse happy at night", emoji: "🌄", scores: { pace: 3, adventure: 1 } },
      { label: "A couple of highlights, plenty of downtime", emoji: "☕", scores: { relax: 1 } },
      { label: "Slow mornings, easy afternoons", emoji: "🛌", scores: { relax: 3, pace: -2 } },
    ] },
  { section: "vibe", emoji: "👫", text: "Crowds and buzz — how much do you want around you?",
    options: [
      { label: "We love a lively, buzzing atmosphere", emoji: "🎆", scores: { city: 2, crowds: 2, nightlife: 1 } },
      { label: "Some energy is nice, then somewhere calm to retreat", emoji: "🌆", scores: { city: 1 } },
      { label: "Peace and quiet, away from the masses", emoji: "🍃", scores: { crowds: -2, nature: 1, relax: 1 } },
    ] },
  { section: "vibe", emoji: "📸", text: "The photo you most want to bring home is…",
    options: [
      { label: "The two of us on a stunning beach at sunset", emoji: "🌅", scores: { beach: 2, romance: 2 } },
      { label: "A colorful floating market from a longtail boat", emoji: "🛶", scores: { culture: 2 } },
      { label: "Us with a gentle elephant in the jungle", emoji: "🐘", scores: { nature: 2, adventure: 1 } },
      { label: "A dazzling city skyline at night", emoji: "🌃", scores: { city: 2, nightlife: 1 } },
    ] },

  /* ---------- SECTION 5: NATURE & OUTDOORS ---------- */
  { section: "nature", emoji: "🐘", id: "elephants", multi: true,
    text: "Elephants are Thailand's superstars. How do you want to meet them?",
    options: [
      { label: "Ride one through the jungle", emoji: "🌴", scores: { nature: 2, adventure: 2 } },
      { label: "Feed and bathe them up close", emoji: "💧", scores: { nature: 2 } },
      { label: "Watch an elephant show — they even paint!", emoji: "🎨", scores: { nature: 1, crowds: 1 } },
      { label: "We'll admire them from a distance", emoji: "👀", scores: { nature: 1 } },
    ] },
  { section: "nature", emoji: "⛰️", text: "Misty mountains, rice terraces and cool jungle air — how appealing?",
    options: [
      { label: "Deeply — that's the Thailand we dream of", emoji: "🏔️", scores: { nature: 3, culture: 1, heat: -1 } },
      { label: "A day or two up north would be lovely", emoji: "🌄", scores: { nature: 2 } },
      { label: "We'll take the beach over the mountains", emoji: "🏖️", scores: { beach: 2, nature: -1 } },
    ] },
  { section: "nature", emoji: "🌊", text: "Waterfalls, national parks and nature walks?",
    options: [
      { label: "Yes please — we love the outdoors", emoji: "🥾", scores: { nature: 2, adventure: 1 } },
      { label: "An easy, scenic one here and there", emoji: "🍃", scores: { nature: 1 } },
      { label: "We prefer our nature from a comfy chair", emoji: "🪑", scores: { relax: 1 } },
    ] },
  { section: "nature", emoji: "🌅", text: "A sunrise viewpoint that needs an early, mildly tough hike — worth it?",
    options: [
      { label: "100% — the view is the reward", emoji: "📷", scores: { adventure: 2, nature: 1, pace: 1 } },
      { label: "If it's not too hard, sure", emoji: "🙂", scores: { nature: 1 } },
      { label: "We'll enjoy the sunrise from the balcony", emoji: "🛎️", scores: { relax: 2, luxury: 1 } },
    ] },
  { section: "nature", emoji: "🦋", text: "Which natural setting speaks to you most?",
    options: [
      { label: "Lush green jungle and rivers", emoji: "🌴", scores: { nature: 2 } },
      { label: "Turquoise sea and limestone cliffs", emoji: "🪨", scores: { beach: 2, nature: 1 } },
      { label: "Cool highland forests and gardens", emoji: "🌲", scores: { nature: 2, heat: -1 } },
      { label: "Honestly, a beautiful pool will do", emoji: "🏊", scores: { relax: 2, luxury: 1 } },
    ] },

  /* ---------- SECTION 6: CULTURE & SIGHTSEEING ---------- */
  { section: "culture", emoji: "🛍️", id: "shopping", multi: true,
    text: "Thailand is a shopper's paradise — what would you love to hunt for?",
    options: [
      { label: "Brand-name sneakers & sportswear", emoji: "👟", scores: { shopping: 1, city: 1 } },
      { label: "Clothing & fashion", emoji: "👗", scores: { shopping: 1, city: 1 } },
      { label: "Handmade wood décor & furniture for the house", emoji: "🪵", scores: { shopping: 1, culture: 1 } },
      { label: "Electronics & gadgets", emoji: "🎧", scores: { shopping: 1, city: 1 } },
      { label: "Just small gifts and souvenirs", emoji: "🎁", scores: { shopping: 1 } },
    ] },
  { section: "culture", emoji: "🎭", id: "shows", multi: true,
    text: "Thailand's evening entertainment is world-class. What sounds fun?",
    options: [
      { label: "A grand spectacular — Phuket FantaSea-style", emoji: "🎆", scores: { crowds: 1, nightlife: 1, luxury: 1 } },
      { label: "A dazzling cabaret or cultural show", emoji: "💃", scores: { crowds: 1, nightlife: 1 } },
      { label: "A Muay Thai boxing night", emoji: "🥊", scores: { adventure: 1, nightlife: 1 } },
      { label: "A snake show — thrilling and wild", emoji: "🐍", scores: { adventure: 1, crowds: 1 } },
      { label: "Quiet evenings are more our speed", emoji: "🌙", scores: { relax: 1 } },
    ] },
  { section: "culture", emoji: "🧶", text: "Local culture — markets, crafts and village traditions. How hands-on?",
    options: [
      { label: "Immerse us — craft villages, workshops, the real Thailand", emoji: "🪡", scores: { culture: 2, adventure: 1 } },
      { label: "A guided tour with a great storyteller", emoji: "🧭", scores: { culture: 1, luxury: 1 } },
      { label: "We prefer to keep things relaxed", emoji: "🍹", scores: { relax: 1 } },
    ] },
  { section: "culture", emoji: "🛶",
    text: "In Bangkok you can ride a longtail boat through the old canals, past stilt houses, to a floating market where vendors sell fruit right from their boats. Interested?",
    options: [
      { label: "Yes — the longtail and the floating market, all of it", emoji: "🚤", scores: { culture: 2, adventure: 1 } },
      { label: "We'd prefer a big, comfortable riverboat ride instead", emoji: "⛴️", scores: { culture: 1, relax: 1, romance: 1 } },
      { label: "We'll pass on the boats", emoji: "🙅", scores: {} },
    ] },
  { section: "culture", emoji: "🌃", text: "How do you feel about a city's evening energy — night markets, lights, bustle?",
    options: [
      { label: "We adore an evening stroll through the buzz", emoji: "🏮", scores: { city: 2, crowds: 1, shopping: 1 } },
      { label: "A calm evening walk is our speed", emoji: "🌙", scores: { relax: 1, romance: 1 } },
      { label: "After dark we're back at the hotel", emoji: "🛌", scores: { relax: 2 } },
    ] },

  /* ---------- SECTION 7: BEACHES & WATER ---------- */
  { section: "beach", emoji: "🏖️", text: "Be honest — how much beach do you want?",
    options: [
      { label: "Loads of it — sand between our toes daily", emoji: "🌴", scores: { beach: 3, relax: 1 } },
      { label: "A few good beach days in the mix", emoji: "⛱️", scores: { beach: 2 } },
      { label: "One or two is plenty", emoji: "🩴", scores: { beach: 1 } },
      { label: "We're not really beach people", emoji: "🏙️", scores: { beach: -2, city: 1 } },
    ] },
  { section: "beach", emoji: "🐠", text: "Snorkeling in clear water among the fish?",
    options: [
      { label: "Yes! Show us the coral", emoji: "🤿", scores: { beach: 2, adventure: 2, nature: 1 } },
      { label: "A gentle float and a look, sure", emoji: "🌊", scores: { beach: 1, adventure: 1 } },
      { label: "We'll keep our feet on the sand", emoji: "🏖️", scores: { relax: 1 } },
    ] },
  { section: "beach", emoji: "🛥️", text: "Island-hopping by boat to hidden lagoons?",
    options: [
      { label: "A private long-tail, just us — dreamy", emoji: "💕", scores: { beach: 2, romance: 2, luxury: 1 } },
      { label: "A small group day-trip is great", emoji: "⛵", scores: { beach: 2, adventure: 1 } },
      { label: "We'd rather stay put on one nice beach", emoji: "🧘", scores: { relax: 2 } },
    ] },
  { section: "beach", emoji: "🏝️", text: "Your ideal beach scene is…",
    options: [
      { label: "Lively, with music and a buzzing beachfront", emoji: "🎶", scores: { beach: 1, city: 1, crowds: 1 } },
      { label: "Postcard-perfect and peaceful", emoji: "🌅", scores: { beach: 2, relax: 1, romance: 1 } },
      { label: "Remote and untouched, if we can reach it", emoji: "🧭", scores: { beach: 1, adventure: 2, crowds: -1 } },
    ] },

  /* ---------- SECTION 8: FOOD & FLAVORS ---------- */
  { section: "food", emoji: "🍽️", id: "foods", multi: true,
    info: "😋 Yes, really — all of this exists KOSHER in Thailand, plus a few kosher bakeries and ice cream shops.",
    text: "What do you two love to eat? (All available kosher!)",
    options: [
      { label: "Real Thai food — pad thai, curries, noodle soups", emoji: "🍜", scores: { food: 2 } },
      { label: "Burgers & steaks", emoji: "🥩", scores: { food: 1 } },
      { label: "Israeli classics — breakfasts, salads, shakshuka", emoji: "🍳", scores: { food: 1 } },
      { label: "Sushi & fresh fish", emoji: "🍣", scores: { food: 1 } },
      { label: "Pizza, waffles & sweet treats", emoji: "🍕", scores: { food: 1 } },
    ] },
  { section: "food", emoji: "🥭",
    info: "🍈 Durian tip: the famous 'king of fruits' is delicious — but so pungent that hotels ban it. Enjoy it fresh at the market; just don't bring it back to your room!",
    text: "Tropical fruit — mango, mangosteen, dragonfruit, durian, fresh coconut…",
    options: [
      { label: "A highlight of the whole trip!", emoji: "🍈", scores: { food: 2, nature: 1 } },
      { label: "We'll happily enjoy them", emoji: "🍉", scores: { food: 1 } },
      { label: "Take them or leave them", emoji: "🙂", scores: {} },
    ] },
  { section: "food", emoji: "⚖️", text: "What's the right balance between making your own food and eating out kosher?",
    options: [
      { label: "Eat out for almost every meal", emoji: "🍷", scores: { food: 2, city: 1, observance: 1, budget: 1 } },
      { label: "About half and half", emoji: "🍳", scores: { food: 1 } },
      { label: "Mostly our own, eating out as a treat", emoji: "🥫", scores: { budget: 1, adventure: 1 } },
    ] },
  { section: "food", emoji: "☕", text: "A slow morning — good coffee, your own kosher breakfast, and a beautiful view?",
    options: [
      { label: "Our favorite way to start the day", emoji: "🥐", scores: { relax: 2, romance: 1 } },
      { label: "Nice sometimes", emoji: "☕", scores: { relax: 1 } },
      { label: "We'd rather be out and doing", emoji: "🏃", scores: { adventure: 1, pace: 1 } },
    ] },

  /* ---------- SECTION 9: WELLNESS & PACE ---------- */
  { section: "wellness", emoji: "💆", text: "Thai massage and spa treatments are famously wonderful. You're thinking…",
    options: [
      { label: "Yes please — daily if we can", emoji: "🧖", scores: { wellness: 3, relax: 2, luxury: 1 } },
      { label: "A treat once or twice", emoji: "💅", scores: { wellness: 2, relax: 1 } },
      { label: "Maybe one, we'll see", emoji: "🤔", scores: { wellness: 1 } },
      { label: "Not for us", emoji: "🙂", scores: {} },
    ] },
  { section: "wellness", emoji: "🧘", text: "Wellness resorts, yoga, and quiet gardens — how much of the trip?",
    options: [
      { label: "We'd love a wellness-focused stay", emoji: "🌸", scores: { wellness: 3, relax: 2 } },
      { label: "A relaxing element woven throughout", emoji: "🍵", scores: { wellness: 1, relax: 1 } },
      { label: "We recharge by exploring, not by resting", emoji: "🗺️", scores: { adventure: 2, pace: 1 } },
    ] },
  { section: "wellness", emoji: "🏊", text: "A resort with a gorgeous pool you'd never want to leave?",
    options: [
      { label: "That alone could make the trip", emoji: "🍹", scores: { relax: 3, luxury: 2 } },
      { label: "A lovely bonus between outings", emoji: "😎", scores: { relax: 1 } },
      { label: "We'd barely use it", emoji: "🚶", scores: { adventure: 1 } },
    ] },
  { section: "wellness", emoji: "🗓️", text: "By the end, you want to come home feeling…",
    options: [
      { label: "Deeply rested and restored", emoji: "😌", scores: { relax: 3, wellness: 1 } },
      { label: "Amazed by everything we saw and did", emoji: "🤩", scores: { adventure: 2, culture: 1, pace: 1 } },
      { label: "A perfect balance of both", emoji: "☯️", scores: { relax: 1, adventure: 1 } },
    ] },

  /* ---------- SECTION 10: JUST THE TWO OF YOU ---------- */
  { section: "together", emoji: "❤️", text: "This trip is, at heart, about…",
    options: [
      { label: "Reconnecting and romance, just us two", emoji: "💑", scores: { romance: 3, relax: 1 } },
      { label: "Shared adventure and new experiences", emoji: "🤝", scores: { adventure: 2 } },
      { label: "Rest, healing and quiet time together", emoji: "🕊️", scores: { relax: 2, wellness: 1 } },
      { label: "Celebrating a milestone in style", emoji: "🎊", scores: { luxury: 2, romance: 1 } },
    ] },
  { section: "together", emoji: "🌇", text: "A splurge-worthy romantic moment you'd both love?",
    options: [
      { label: "A private sunset dinner overlooking the sea", emoji: "🌅", scores: { romance: 3, luxury: 1, beach: 1 } },
      { label: "A couples' spa afternoon", emoji: "💆‍♀️", scores: { romance: 2, wellness: 2 } },
      { label: "A quiet boat ride just for the two of us", emoji: "🛶", scores: { romance: 2, nature: 1 } },
      { label: "A grand suite with an unforgettable view", emoji: "🏙️", scores: { romance: 1, luxury: 3 } },
    ] },
  { section: "together", emoji: "🧗", text: "When you travel together, who's the planner?",
    options: [
      { label: "We love a detailed plan for every day", emoji: "📋", scores: { pace: 1, culture: 1 } },
      { label: "A loose outline, room to wander", emoji: "🧭", scores: { adventure: 1 } },
      { label: "Just tell us where to be and when", emoji: "🛎️", scores: { luxury: 1, relax: 1 } },
    ] },
  { section: "together", emoji: "🎁", text: "Avi — which surprise would delight Rivki the most?",
    options: [
      { label: "Flowers and a beachfront table under the stars", emoji: "🌹", scores: { romance: 2, beach: 1 } },
      { label: "A pampering spa day", emoji: "🌺", scores: { wellness: 2, relax: 1 } },
      { label: "A once-in-a-lifetime elephant morning", emoji: "🐘", scores: { nature: 2, adventure: 1 } },
      { label: "A luxury shopping afternoon", emoji: "👜", scores: { shopping: 2, city: 1, luxury: 1 } },
    ] },
  { section: "together", emoji: "🚕",
    info: "💡 Getting-around tips: Grab is Thailand's Uber — install it, attach your credit card, and verify your phone number before you leave Israel. And load the Airalo eSIM app before you fly for the cheapest data plans in Thailand.",
    text: "Getting around a city — your preference?",
    options: [
      { label: "A private car and driver, stress-free", emoji: "🚙", scores: { luxury: 2, relax: 1 } },
      { label: "Grab rides and the odd tuk-tuk for fun", emoji: "🛺", scores: { adventure: 1, culture: 1 } },
      { label: "Rent a moped (or hire a moped driver) — quick and fun", emoji: "🛵", scores: { adventure: 2 } },
      { label: "Walk when we can, it's how we see a place", emoji: "🚶‍♂️", scores: { adventure: 1, pace: 1 } },
    ] },
  { section: "together", emoji: "🧳", text: "How much of the itinerary do you want pre-booked before you fly?",
    options: [
      { label: "Everything — we like certainty", emoji: "🔒", scores: { luxury: 1, pace: 1 } },
      { label: "The big things; leave room for spontaneity", emoji: "🎲", scores: { adventure: 1 } },
      { label: "As little as possible — go with the flow", emoji: "🍃", scores: { adventure: 2, relax: 1 } },
    ] },
  { section: "together", emoji: "🌏", text: "Last one! If this trip is a huge hit, you'd…",
    options: [
      { label: "Come straight back to explore more of Thailand", emoji: "🔁", scores: { adventure: 2 } },
      { label: "Return to the exact same peaceful spot", emoji: "📍", scores: { relax: 2, romance: 1 } },
      { label: "Feel we saw it all and cross it off happily", emoji: "✅", scores: { culture: 1, pace: 1 } },
    ] },
];

// Sanity: expose count for the UI
const TOTAL_QUESTIONS = QUESTIONS.length;

/* ============================================================
   THE RECOMMENDED PATH
   One recommended option index per question (in order). Together
   they sketch the trip we'd suggest: two full weeks, island- and
   water-focused, based in beautiful resorts, with evening shows,
   a Muay Thai fight night, strictly kosher and Shabbos-aware.
   The UI pre-selects these and tags them "(recommended)".
   ============================================================ */
const RECOMMENDED = [
  // The Basics
  3, 0, 0, 1, 0,
  // Budget & Comfort (pay-extra is multi-select: driver+guide AND the view)
  2, 2, 1, [0, 1], 1,
  // Kosher & Observance
  0, 1, 2, 1, 1, 0,
  // The Vacation Vibe (gentle thrills; floating-market photo stays classic)
  3, 2, 1, 1, 0,
  // Nature & Outdoors (elephants: ride + feed & bathe + the show)
  [0, 1, 2], 2, 1, 2, 1,
  // Culture & Sightseeing (shopping: sneakers+clothing+wood décor; shows: FantaSea + Muay Thai)
  [0, 1, 2], [0, 2], 1, 0, 0,
  // Beaches & Water (island-hopping: the group day-trip)
  0, 0, 1, 1,
  // Food & Flavors (foods: try it ALL — every one exists kosher)
  [0, 1, 2, 3, 4], 0, 1, 0,
  // Wellness & Pace (massage: daily!)
  0, 1, 0, 2,
  // Just the Two of You
  0, 0, 1, 0, 1, 1, 0,
];
