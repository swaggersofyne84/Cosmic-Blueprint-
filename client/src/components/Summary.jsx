import React from "react";

export default function Summary({ profile, natal }) {
  return (
    <>
      <h2>Summary</h2>
      <p><strong>Name:</strong> {profile?.name || "—"}</p>
      <p><strong>Birth:</strong> {`${profile.year}-${String(profile.month).padStart(2,"0")}-${String(profile.day).padStart(2,"0")} ${profile.time || ""}`}</p>
      <p><strong>Location:</strong> {profile?.locationLabel}</p>
      <p><strong>System:</strong> {natal?.system}</p>

      <h3>Planets</h3>
      <ul>
        {natal.planets?.map((p,i)=>(
          <li key={i}>{p.name}: {p.longitude.toFixed(2)}°{p.retrograde ? " (R)" : ""}</li>
        ))}
      </ul>

      <h3>Houses (Placidus)</h3>
      <ul>
        {natal.houses?.map((h,i)=>(
          <li key={i}>House {h.house}: {h.cusp.toFixed(2)}°</li>
        ))}
      </ul>
    </>
  );
}
