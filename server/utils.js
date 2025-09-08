export function chunkText(str, chunkSize = 1800) {
  const out = [];
  let i = 0;
  while (i < str.length) {
    out.push(str.slice(i, i + chunkSize));
    i += chunkSize;
  }
  return out;
}

export function degToDms(deg) {
  const d = Math.floor(deg);
  const mfloat = (deg - d) * 60;
  const m = Math.floor(mfloat);
  const s = Math.round((mfloat - m) * 60);
  return `${d}°${m}'${s}"`;
}

export function toISODateTime(profile) {
  if (!profile) return "";
  const { year, month, day, time } = profile;
  return `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")} ${time || ""}`.trim();
}
