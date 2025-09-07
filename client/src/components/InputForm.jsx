import React, { useEffect, useState } from "react";
import { geocode } from "../api.js";

const demo = {
  name: "Demo Chart",
  year: 1984, month: 10, day: 25, time: "15:45",
  locationLabel: "Cincinnati, Ohio, USA", lat: 39.1031, lon: -84.5120
};

export default function InputForm({ onSubmit, loading }) {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState(""); // "HH:MM" optional
  const [locQ, setLocQ] = useState("");
  const [choices, setChoices] = useState([]);
  const [picked, setPicked] = useState(null);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (locQ.length < 3) { setChoices([]); return; }
      const { results } = await geocode(locQ);
      setChoices(results || []);
    }, 300);
    return () => clearTimeout(t);
  }, [locQ]);

  function applyDemo() {
    setName(demo.name);
    setYear(demo.year); setMonth(demo.month); setDay(demo.day); setTime(demo.time);
    setPicked({ label: demo.locationLabel, lat: demo.lat, lon: demo.lon });
    setLocQ(demo.locationLabel);
  }

  function submit() {
    if (!year || !month || !day || !picked) return alert("Please fill date and select a location.");
    onSubmit({
      name, year: +year, month: +month, day: +day,
      time: time || null,
      lat: picked.lat, lon: picked.lon,
      locationLabel: picked.label
    });
  }

  return (
    <>
      <label>Name (optional)</label>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />

      <div className="row" style={{marginTop:12}}>
        <div className="col">
          <label>Month</label>
          <input value={month} onChange={e=>setMonth(e.target.value)} placeholder="MM" />
        </div>
        <div className="col">
          <label>Day</label>
          <input value={day} onChange={e=>setDay(e.target.value)} placeholder="DD" />
        </div>
        <div className="col">
          <label>Year</label>
          <input value={year} onChange={e=>setYear(e.target.value)} placeholder="YYYY" />
        </div>
      </div>

      <label style={{marginTop:12}}>Time (optional, 24h)</label>
      <input value={time} onChange={e=>setTime(e.target.value)} placeholder="HH:MM" />

      <label style={{marginTop:12}}>Location</label>
      <input value={locQ} onChange={e=>setLocQ(e.target.value)} placeholder="City, Country" />
      {!!choices.length && (
        <div className="card" style={{marginTop:8}}>
          {choices.map((c,i)=>(
            <div key={i} style={{padding:"6px 8px", cursor:"pointer"}}
                 onClick={() => { setPicked(c); setLocQ(c.label); setChoices([]); }}>
              {c.label}
            </div>
          ))}
        </div>
      )}

      <div className="row" style={{marginTop:12}}>
        <div className="col">
          <button className="btn" disabled={loading} onClick={submit}>
            {loading ? "Working…" : "Calculate Chart"}
          </button>
        </div>
        <div className="col">
          <button className="btn secondary" onClick={applyDemo}>Demo Mode</button>
        </div>
      </div>
      <small className="note">We use a free OSM geocoder via the backend; API keys are optional if you add Prokerala for natal data.</small>
    </>
  );
}
