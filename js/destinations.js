/* ============================================================
   THAILAND DESTINATIONS
   Each destination carries an `affinity` vector scored against
   the traveler's answers, plus rich human content: activities,
   the kosher-food situation, and where the shul / Chabad is.

   NOTE ON ACCURACY: Chabad houses, kosher restaurants and minyan
   times in Thailand do change. Details below reflect what is
   generally well-established, but the itinerary reminds Avi to
   confirm current details with each Chabad before travel.
   ============================================================ */

const DESTINATIONS = {
  bangkok: {
    key: "bangkok",
    name: "Bangkok",
    tagline: "The dazzling capital — and the kosher heart of Thailand.",
    emoji: "🏙️",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
    region: "Central",
    // affinity dimensions mirror the scores in questions.js
    affinity: { city: 3, culture: 3, food: 3, shopping: 2, observance: 3, kosherStrict: 3, crowds: 1, nightlife: 1, beach: -2, nature: -2, relax: -1 },
    bestFor: "Kosher dining, an easy first Shabbos, shopping and big-city energy.",
    highlights: [
      "A longtail boat through the old khlongs (canals) of Thonburi, ending at a floating market",
      "ICONSIAM, Siam Paragon & the mega-malls for air-conditioned shopping — sneakers, fashion, electronics (MBK & Pantip Plaza)",
      "Chatuchak Weekend Market — 15,000 stalls, including the astonishing animal market of puppies, exotic birds and more",
      "A sunset cruise on the Chao Phraya River as the city lights up",
      "An electrifying Muay Thai fight night at one of Bangkok's legendary stadiums",
      "A jaw-dropping show at the world-famous Bangkok snake farm",
      "A glittering cabaret or Thai cultural show",
      "Neon-lit night markets for evening strolling",
    ],
    kosher: {
      level: "Excellent",
      summary:
        "Bangkok is the easiest place in Thailand to keep kosher. The Chabad houses run kosher restaurants and there are kosher grocery options, so you can eat well all week and stock up before heading elsewhere.",
      spots: [
        "Chabad House of Bangkok — kosher restaurant & takeaway near Khao San Road",
        "Beit Chabad Sukhumvit (Soi 22 area) — kosher dining in the heart of the modern city",
        "Kosher groceries, wine and Shabbos supplies available through the Chabad centers",
      ],
    },
    shul: {
      summary:
        "Bangkok has real, established Jewish infrastructure — the best in the country for davening with a minyan.",
      places: [
        "Even Chen Synagogue (Beth Elisheva) — the Chabad-run shul on Soi Sukhumvit, regular minyanim",
        "Chabad of Bangkok near Khao San Road — Shabbos meals and a warm crowd of travelers",
        "The Jewish Association of Thailand community shul",
      ],
    },
  },

  chiangmai: {
    key: "chiangmai",
    name: "Chiang Mai",
    tagline: "Cool mountain air, elephants and gentle northern charm.",
    emoji: "⛰️",
    image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1200&q=80",
    region: "North",
    affinity: { nature: 3, culture: 3, wellness: 2, relax: 2, heat: -2, adventure: 2, crowds: -1, observance: 2, kosherStrict: 2, city: 1, beach: -3 },
    bestFor: "Nature lovers, elephant encounters, crafts and anyone who wilts in the heat.",
    highlights: [
      "The full elephant day — ride through the jungle, feed and bathe them, and watch them paint on stage",
      "ATV and quad-bike trails through jungle countryside",
      "Misty mountain viewpoints and emerald rice terraces",
      "The Sunday Walking Street night market for crafts and color",
      "Handmade teak, wood décor and furniture at the Baan Tawai craft villages",
      "Doi Inthanon National Park — Thailand's highest peak and waterfalls",
    ],
    kosher: {
      level: "Good",
      summary:
        "Chiang Mai's Chabad is a beloved traveler hub with a kosher restaurant — a genuine oasis in the north. Fresh tropical fruit and produce are abundant for self-catering too.",
      spots: [
        "Chabad House of Chiang Mai — kosher restaurant, takeaway and a famous warm welcome",
        "Local markets brimming with fresh fruit and vegetables for kosher self-catering",
      ],
    },
    shul: {
      summary:
        "The Chiang Mai Chabad is the center of Jewish life in the north, with Shabbos meals and davening.",
      places: [
        "Chabad House of Chiang Mai — Shabbos meals, minyan when travelers are in town, near the Old City / Loi Kroh area",
      ],
    },
  },

  phuket: {
    key: "phuket",
    name: "Phuket",
    tagline: "Thailand's biggest island — beaches, island-hopping, and a full kosher Chabad.",
    emoji: "🏖️",
    image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1200&q=80",
    region: "Andaman Coast",
    affinity: { beach: 3, relax: 2, romance: 2, luxury: 2, observance: 2, kosherStrict: 2, nature: 1, adventure: 1, wellness: 1, city: 1, nightlife: 1, heat: 2 },
    bestFor: "Beach days, island boat trips and a comfortable kosher beach base.",
    highlights: [
      "Day trips by boat to the Phi Phi Islands and James Bond Island",
      "Jet-ski runs and parasailing over the bay",
      "Khao Phra Thaeo National Park — hike through real rainforest to the Bang Pae and Ton Sai waterfalls",
      "An overnight side-trip to Khao Sok's floating bungalows on Cheow Lan Lake — sleeping on the water among jungle cliffs",
      "Charming, colorful Phuket Old Town (Sino-Portuguese streets)",
      "Beautiful beaches — Kata, Karon and quieter southern coves",
      "Luxurious beachfront resorts and world-class spas",
      "Sunset at Promthep Cape",
      "Ringside seats at a Muay Thai boxing night — a true Thai spectacle",
      "Phuket FantaSea — Thailand's most spectacular evening show",
      "A thrilling cobra & snake show, or a dazzling cabaret night",
    ],
    kosher: {
      level: "Good",
      summary:
        "Phuket has a well-run Chabad with a kosher restaurant — rare and wonderful for a beach destination, making a beach-based kosher vacation genuinely easy.",
      spots: [
        "Chabad House of Phuket — kosher restaurant and takeaway, popular with Israeli travelers",
        "Supermarkets with packaged goods; fresh fish and produce for self-catering",
      ],
    },
    shul: {
      summary:
        "Chabad of Phuket anchors Jewish life on the island with Shabbos hospitality.",
      places: [
        "Chabad House of Phuket — Shabbos meals and davening, near the main beach areas",
      ],
    },
  },

  kohsamui: {
    key: "kohsamui",
    name: "Koh Samui",
    tagline: "A lush, laid-back island of palm-fringed beaches and serene resorts.",
    emoji: "🌴",
    image: "https://images.unsplash.com/photo-1537956965359-7573183d1f57?auto=format&fit=crop&w=1200&q=80",
    region: "Gulf Coast",
    affinity: { beach: 3, relax: 3, romance: 2, wellness: 2, luxury: 2, observance: 1, kosherStrict: 1, nature: 1, heat: 2, crowds: -1, city: -1 },
    bestFor: "Pure relaxation, romance and wellness on a softer, quieter island.",
    highlights: [
      "Long, gentle beaches like Chaweng and quieter Choeng Mon",
      "The colorful Fisherman's Village and its lively night market",
      "World-renowned wellness and spa resorts",
      "A boat trip to the stunning Ang Thong Marine Park",
      "Jet-ski and parasailing fun over Chaweng bay",
      "A hike to the Na Muang jungle waterfalls — cool pools deep in the green",
      "A jungle ATV safari to island viewpoints",
      "Calm, palm-lined coves perfect for slow days",
      "A beachfront fire show under the stars after dinner",
    ],
    kosher: {
      level: "Seasonal",
      summary:
        "Koh Samui has a Chabad presence that is most active in high season; it's wise to bring supplies and self-cater, with fresh fruit, fish and produce readily available.",
      spots: [
        "Chabad of Koh Samui — Shabbos meals and kosher help in season (confirm ahead)",
        "Supermarkets and markets for self-catering and fresh produce",
      ],
    },
    shul: {
      summary:
        "Jewish life centers on the seasonal Chabad; plan a self-made Shabbos as a backup.",
      places: [
        "Chabad of Koh Samui — hospitality and Shabbos in high season (verify current status)",
      ],
    },
  },

  krabi: {
    key: "krabi",
    name: "Krabi & Railay",
    tagline: "Dramatic limestone cliffs, emerald water and hidden-lagoon boat trips.",
    emoji: "🪨",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80",
    region: "Andaman Coast",
    affinity: { beach: 3, nature: 3, adventure: 3, romance: 2, relax: 1, crowds: -1, heat: 2, luxury: 1, observance: -1, kosherStrict: -1, city: -2 },
    bestFor: "Jaw-dropping scenery, gentle adventure and unforgettable boat days.",
    highlights: [
      "Longtail boat trips to Railay Beach and hidden lagoons",
      "The famous 7-island sunset tour — snorkeling, hidden lagoons and glowing plankton after dark",
      "The Hong Islands day trip by speedboat",
      "Towering limestone karsts rising straight from the sea",
      "Ao Nang's relaxed beachfront promenade",
      "Kayaking through mangroves and sea caves",
      "Some of Thailand's most photogenic scenery",
    ],
    kosher: {
      level: "Self-catering",
      summary:
        "Krabi has no permanent Chabad, so it's best visited as a scenic add-on with your own supplies (stock up in Bangkok or Phuket) — fresh fruit, fish and produce are easy to find.",
      spots: [
        "No dedicated kosher restaurant — plan to self-cater",
        "Supermarkets in Ao Nang and Krabi Town for packaged goods and fresh produce",
      ],
    },
    shul: {
      summary:
        "No local shul — pair Krabi with nearby Phuket for Shabbos, or make a beautiful private Shabbos.",
      places: [
        "Nearest Chabad is in Phuket — ideal to spend Shabbos there and day-trip the Krabi scenery",
      ],
    },
  },
};

/* Ordered list for iteration */
const DESTINATION_ORDER = ["bangkok", "chiangmai", "phuket", "kohsamui", "krabi"];
