import axios from "axios";

/**
 * Normalize provider response:
 *  {
 *    planets: [{ name, longitude, latitude, retrograde }],
 *    houses:  [{ house:1..12, cusp: deg }],
 *    aspects: [{ a, b, type, orb }]
 *  }
 */
export async function getNatalData({ year, month, day, time, lat, lon, tzOffsetMinutes }) {
  const base = process.env.PROKERALA_API_BASE || "https://api.prokerala.com/v2/astrology";
  const key  = process.env.PROKERALA_API_KEY;

  // If no key, fall back to demo data so the app still works.
  if (!key) return demoNatal({ year, month, day, time, lat, lon, tzOffsetMinutes });

  const date = `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  const t = time || "12:00";
  const tz = (tzOffsetMinutes ?? 0) / 60;

  // Example Prokerala endpoints (adjust to your plan):
  // - /planet-position
  // - /house-cusps
  // - /ashtakvarga or aspects (if available in your plan)
  // Here we call two endpoints, then synthesize aspects simply on client later if needed.

  const headers = { Authorization: `Bearer ${key}` };
  const common = { datetime: `${date} ${t}`, latitude: lat, longitude: lon, ayanamsa: 1, house_system: "P" };

  const [planetsResp, housesResp] = await Promise.all([
    axios.get(`${base}/planet-position`, { params: common, headers }),
    axios.get(`${base}/house-cusps`, { params: common, headers })
  ]);

  const planets = (planetsResp.data?.data?.planet_positions || []).map(p => ({
    name: p.planet,
    longitude: p.longitude,
    latitude: p.latitude ?? 0,
    retrograde: !!p.retrograde
  }));

  const houses = (housesResp.data?.data?.houses || []).map((h, i) => ({
    house: i + 1, cusp: h.longitude
  }));

  // (Optional) aspects – if not available, we’ll compute simple Ptolemaic aspects by orb on the client
  const aspects = []; // keep empty; client computes basic ones

  return { planets, houses, aspects, system: "Tropical / Placidus" };
}

// Demo fallback if no API key
function demoNatal() {
  return {
    planets: [
      { name: "Sun", longitude: 2.3, latitude: 0, retrograde: false },
      { name: "Moon", longitude: 215.4, latitude: 0, retrograde: false },
      { name: "Mercury", longitude: 221.0, latitude: 0, retrograde: true },
      { name: "Venus", longitude: 258.2, latitude: 0, retrograde: false },
      { name: "Mars", longitude: 292.9, latitude: 0, retrograde: false },
      { name: "Jupiter", longitude: 287.7, latitude: 0, retrograde: false },
      { name: "Saturn", longitude: 220.1, latitude: 0, retrograde: false },
      { name: "Uranus", longitude: 254.6, latitude: 0, retrograde: false },
      { name: "Neptune", longitude: 270.2, latitude: 0, retrograde: false },
      { name: "Pluto", longitude: 215.9, latitude: 0, retrograde: false },
      { name: "Asc", longitude: 140.0, latitude: 0, retrograde: false },
      { name: "MC", longitude: 50.0, latitude: 0, retrograde: false }
    ],
    houses: Array.from({ length: 12 }, (_, i) => ({ house: i+1, cusp: (i * 30 + 140) % 360 })),
    aspects: [],
    system: "Demo Tropical / Placidus"
  };
}
