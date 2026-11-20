// One-off data script: adds 6 destinations (2 each for Rajasthan, Kerala and
// Himachal Pradesh) plus their details. Safe to re-run: skips existing slugs.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const dp = path.join(ROOT, "data", "destinations.json");
const tp = path.join(ROOT, "data", "details.json");
const dests = JSON.parse(fs.readFileSync(dp, "utf8"));
const det = JSON.parse(fs.readFileSync(tp, "utf8"));

const add = [
  {
    slug: "udaipur", name: "Udaipur", state: "Rajasthan", type: "Lake city",
    overview: "The 'City of Lakes' in southern Rajasthan, known for palaces on Lake Pichola, old-town lanes and sunset boat rides.",
    airport: "Maharana Pratap Airport (UDR)", rail: "Udaipur City station",
    permit: null, sources: ["tourism", "ncrb", "imd", "aai", "irctc"],
  },
  {
    slug: "jodhpur", name: "Jodhpur", state: "Rajasthan", type: "Fort city",
    overview: "The 'Blue City' of western Rajasthan, dominated by the Mehrangarh Fort and an old town of blue-painted houses.",
    airport: "Jodhpur Airport (JDH)", rail: "Jodhpur Junction",
    permit: null, sources: ["tourism", "ncrb", "imd", "aai", "irctc"],
  },
  {
    slug: "munnar", name: "Munnar", state: "Kerala", type: "Hill station",
    overview: "Hill station in the Western Ghats covered in tea plantations, with cool air, viewpoints and a national park.",
    airport: "No airport in Munnar. Cochin International Airport (COK) is the usual gateway, followed by a long road journey of several hours.",
    rail: "No railway in Munnar. The nearest major railheads are around Kochi, followed by a road journey.",
    permit: null, sources: ["tourism", "imd", "aai", "irctc"],
  },
  {
    slug: "alappuzha", name: "Alappuzha (Alleppey)", state: "Kerala", type: "Backwaters",
    overview: "The gateway to Kerala's backwaters, with canals, lagoons, village life and traditional houseboats.",
    airport: "Cochin International Airport (COK), then a road transfer of roughly one and a half to two hours",
    rail: "Alappuzha station",
    permit: null, sources: ["tourism", "imd", "aai", "irctc"],
  },
  {
    slug: "manali", name: "Manali", state: "Himachal Pradesh", type: "Hill station / Adventure",
    overview: "Himalayan resort town in the Kullu valley, a base for adventure sports and for onward routes towards Lahaul, Spiti and Ladakh.",
    airport: "Kullu–Manali Airport at Bhuntar (KUU) has limited service. Many visitors fly to Chandigarh and continue by road.",
    rail: "No railway in Manali. Chandigarh is the usual rail connection point, followed by a long road journey.",
    permit: "Some high routes and border areas beyond Manali (towards Lahaul, Spiti and Ladakh) have permit or vehicle rules, and some are open only seasonally. Check current rules with the district administration and the Ministry of Home Affairs before you go.",
    sources: ["mha", "tourism", "imd", "aai"],
  },
  {
    slug: "dharamshala", name: "Dharamshala and McLeod Ganj", state: "Himachal Pradesh", type: "Hill town / Tibetan culture",
    overview: "Hill town in the Dhauladhar range, home to a large Tibetan community, monasteries and the seat of the Dalai Lama.",
    airport: "Kangra Airport at Gaggal (DHM) has limited service. Many visitors use Chandigarh or Delhi and continue by road or overnight bus.",
    rail: "Pathankot is the main railhead, followed by a road journey.",
    permit: null, sources: ["tourism", "imd", "aai", "irctc"],
  },
];
for (const a of add) if (!dests.find((d) => d.slug === a.slug)) dests.push(a);
fs.writeFileSync(dp, JSON.stringify(dests, null, 1));

const D = {
  udaipur: {
    highlights: ["City Palace complex on the shore of Lake Pichola", "Boat rides on Lake Pichola at sunset", "Jag Mandir and the Lake Palace seen from the water", "Saheliyon-ki-Bari gardens and Jagdish Temple", "Sajjangarh (Monsoon Palace) for views over the city", "Old-town lanes, miniature-painting studios and puppet shows"],
    bestTime: "October to March is cool and pleasant. Summers are very hot. The monsoon (July to September) fills the lakes and turns the hills green, but brings humid, rainy weather.",
    gettingAround: "The old town is walkable, though lanes are narrow and busy. Auto-rickshaws, app cabs and rented scooters cover the rest. Boats operate on the lakes, and some island palaces are reached only by boat.",
    safety: ["Commission shops are common: drivers and guides may steer you to shops or galleries. Compare prices and do not feel pressured to buy.", "Scooter hire is popular but traffic is dense and roads are uneven. Wear a helmet and carry a valid licence.", "Lake boats can be crowded in the evening. Wear the life jacket provided.", "Agree auto-rickshaw fares in advance or use an app."],
    health: ["Summer heat is intense. Carry water and avoid midday sightseeing.", "Choose clean, busy restaurants, especially for rooftop dining and street food.", "Mosquito numbers rise near the lakes after the monsoon, so use repellent."],
    tips: ["Palace and museum timings vary and some days are closed, so check before you go.", "Sunset boat rides and rooftop views are popular, so book ahead in peak season.", "Dress modestly at temples and in the old town."],
  },
  jodhpur: {
    highlights: ["Mehrangarh Fort, one of India's largest forts, with a museum and audio tour", "Jaswant Thada and the Umaid Bhawan Palace area", "The blue-painted old town below the fort", "Clock Tower and Sardar Market for spices, textiles and handicrafts", "Mandore Gardens and desert excursions", "Local food such as mirchi vada and makhaniya lassi"],
    bestTime: "October to March is the most comfortable. Summers are extremely hot. The monsoon is short and the city is dry for most of the year.",
    gettingAround: "The old city is walkable but hilly and crowded. Auto-rickshaws and app cabs link the fort, the markets and the palace area, and many visitors hire a car for desert and village trips.",
    safety: ["Touts and commission-based shops operate near the fort and the market. Be wary of high-value purchases (gems, rugs, antiques) on a guide's advice.", "Narrow lanes and traffic make the old town chaotic, so watch your belongings.", "Heat is the main physical risk in summer.", "Agree prices for auto-rickshaws and desert excursions before you start."],
    health: ["Carry water and sun protection. The fort involves a lot of walking and some steep ramps, though a lift is available.", "Avoid street food that has been sitting out.", "Desert dust can irritate people with asthma or allergies."],
    tips: ["Visit the fort early in the day to beat heat and crowds.", "Respect private homes in the blue old town and ask before photographing residents.", "Check opening hours of the palace and museum before you go."],
  },
  munnar: {
    highlights: ["Tea plantations and the tea museum", "Eravikulam National Park, home to the Nilgiri tahr", "Mattupetty Dam, Echo Point and Top Station viewpoints", "Spice plantations and cool misty valleys", "Walks and treks in the Western Ghats", "The neelakurinji flower, which blooms only about once every twelve years"],
    bestTime: "September to May is generally pleasant, with cool temperatures. The south-west monsoon (June to August) brings heavy rain, mist and landslide risk. Nights can be cold, particularly from December to February.",
    gettingAround: "Munnar is reached by long, winding mountain roads from Kochi and other towns. Local taxis and jeeps are the usual way to see viewpoints and plantations, and many visitors hire a driver for the trip.",
    safety: ["Heavy rain can cause landslides and road closures, so check conditions before you travel in the monsoon.", "Mountain roads are narrow and winding. Avoid night driving.", "Wild elephants can wander near plantations and roads, particularly at night. Follow local advice and do not approach wildlife.", "Dense mist can reduce visibility on roads and viewpoints."],
    health: ["The air is cool, so carry warm clothing and rain protection.", "Motion sickness is common on the winding approach, so carry remedies if you are prone.", "Use repellent against leeches and mosquitoes in the wet season."],
    tips: ["National park entry may be restricted or closed in certain seasons. Check current rules and timings before you go.", "Carry cash, as some places in hill areas may not accept cards.", "Allow more than one night to enjoy the area rather than rushing."],
  },
  alappuzha: {
    highlights: ["Backwater cruises on canals and Vembanad Lake", "Houseboat stays on traditional kettuvallam boats", "Village life in the Kuttanad rice-growing region", "Alappuzha Beach and nearby Marari Beach", "Coir-making and local craft demonstrations", "The Nehru Trophy Boat Race, usually held in August"],
    bestTime: "November to February is the most comfortable and the main season. Summers are hot and humid, and the monsoon brings heavy rain and rougher water.",
    gettingAround: "The town is linked by road and rail to Kochi and other Kerala towns. Boats, ferries and houseboats are the main way to see the backwaters, and local ferries are an inexpensive alternative to private cruises.",
    safety: ["Choose a houseboat from a registered operator and check life jackets, fire safety and what is included before you book.", "Weather and water conditions can change quickly in the monsoon, so confirm trips are running.", "Avoid swimming in the backwaters unless a guide says it is safe.", "Agree prices for boats, autos and tours in advance."],
    health: ["Humidity is high, so drink plenty of bottled or filtered water.", "Use mosquito repellent, particularly in the evening.", "Choose clean restaurants for seafood and make sure food is cooked well."],
    tips: ["Compare private and shared cruises and check whether meals and overnight stays are included.", "Book houseboats early during the peak winter season.", "Respect village life and ask before photographing people."],
  },
  manali: {
    highlights: ["Old Manali's cafes and lanes", "Hadimba Temple in a cedar forest", "Solang Valley for skiing, paragliding and zorbing (seasonal)", "The Beas River for rafting and riverside walks", "Atal Tunnel and the route towards Lahaul", "Rohtang Pass area (seasonal, with vehicle rules)"],
    bestTime: "March to June and September to November are pleasant for sightseeing. December to February is cold with snow at higher elevations. The monsoon (July to August) brings heavy rain, landslides and road closures.",
    gettingAround: "Taxis and local cabs are the main way to reach viewpoints and valleys, and taxi unions often set fixed rates. Getting to Manali involves a long road journey, so allow plenty of time.",
    safety: ["Monsoon rains can trigger landslides and flash floods and close roads, so check conditions before you travel and keep your schedule flexible.", "Use licensed adventure operators with certified guides for paragliding, rafting and skiing, and check that your insurance covers them.", "Mountain roads are narrow and winding. Avoid night driving.", "Weather can change quickly at higher altitudes, so carry warm layers."],
    health: ["Altitude effects can occur at higher passes. Ascend gradually and rest if you feel unwell.", "The sun is strong at altitude, so use sunscreen and sunglasses.", "Carry medicines for motion sickness on the winding approach."],
    tips: ["Some high routes and passes are open only seasonally, so confirm before planning onward travel.", "Book accommodation in advance for summer and the winter holidays.", "Respect local rules on drugs. Possession carries severe penalties even though it is sometimes easy to find in tourist areas."],
  },
  dharamshala: {
    highlights: ["McLeod Ganj and the Tsuglagkhang complex, the Dalai Lama's temple", "Tibetan monasteries, museums and cafes", "Bhagsu Waterfall and the nearby village", "The Triund trek with views of the Dhauladhar range", "Tibetan handicrafts and food, including momos and thukpa", "Norbulingka Institute near Sidhpur, focused on Tibetan arts"],
    bestTime: "March to June and September to November are generally pleasant. Winters are cold with snow in the higher areas. The monsoon (July to September) is very wet, with landslides and poor visibility.",
    gettingAround: "Dharamshala is the lower town and McLeod Ganj is the upper one, linked by steep roads. Taxis and shared cabs connect them, and McLeod Ganj itself is easy to explore on foot.",
    safety: ["Heavy monsoon rain can cause landslides and flash floods. Check conditions before you travel.", "Trekking to places such as Triund involves weather and terrain risks, so check the forecast, carry layers and consider a guide.", "Roads are steep and winding. Avoid night driving.", "Be respectful around the Tibetan community and avoid taking sides in political discussions in public."],
    health: ["Carry warm clothing, as evenings can be cold even outside winter.", "Take it easy on arrival if you are not used to hill roads and climbing.", "Choose clean restaurants and drink bottled or filtered water."],
    tips: ["Dress modestly and follow monastery rules on photography and behaviour.", "Public talks and teachings are sometimes open to visitors. Check notices for current arrangements.", "Book accommodation early in the main season."],
  },
};
for (const [k, v] of Object.entries(D)) det[k] = v;
fs.writeFileSync(tp, JSON.stringify(det, null, 1));

const slugs = [
  ...JSON.parse(fs.readFileSync(path.join(ROOT, "data", "destinations_wb.json"), "utf8")),
  ...dests,
].map((x) => x.slug);
console.log("destinations:", slugs.length, "details:", Object.keys(det).length);
console.log("missing details:", slugs.filter((s) => !det[s]));
