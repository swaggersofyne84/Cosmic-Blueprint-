import Database from "@replit/database";
const db = new Database();

export async function saveSubmission(sub) {
  await db.set(`sub:${sub.id}`, sub);
  const list = (await db.get("subs")) || [];
  list.unshift(sub.id);
  await db.set("subs", list.slice(0, 200)); // cap
}

export async function listSubmissions() {
  const ids = (await db.get("subs")) || [];
  const items = await Promise.all(ids.map(id => db.get(`sub:${id}`)));
  return items.filter(Boolean);
    }
