export async function geocode(q) {
  const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
  return res.json();
}

export async function fetchNatal(payload) {
  const res = await fetch("/api/natal", {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function makeReport(payload) {
  const res = await fetch("/api/report", {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function listSubs() {
  const res = await fetch("/api/submissions");
  return res.json();
}
