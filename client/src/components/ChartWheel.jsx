import React, { forwardRef, useEffect, useMemo, useRef } from "react";

/**
 * Simple SVG chart wheel:
 * - Outer ring with 12 houses (from server-provided Placidus cusps)
 * - Planets plotted by ecliptic longitude
 * - Basic labels; you can swap to glyph font later
 */
const ChartWheel = forwardRef(function ChartWheel({ natal }, ref) {
  const svgRef = useRef();

  // API may include Asc/MC as planets; ensure they draw last
  const planets = useMemo(() => {
    const list = (natal?.planets || []).filter(p => p.name && typeof p.longitude === "number");
    const order = ["Sun","Moon","Mercury","Venus","Mars","Jupiter","Saturn","Uranus","Neptune","Pluto","Asc","MC"];
    return list.sort((a,b)=> order.indexOf(a.name) - order.indexOf(b.name));
  }, [natal]);

  const houses = natal?.houses || [];

  // Expose toPNG() for PDF embedding
  React.useImperativeHandle(ref, () => ({
    async toPNG() {
      const svg = svgRef.current;
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();
      const canvas = document.createElement("canvas");
      const size = 700;
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext("2d");
      await new Promise(res => { img.onload = res; img.src = url; });
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      return canvas.toDataURL("image/png");
    }
  }));

  const size = 600, cx = size/2, cy = size/2, rOuter = 280, rInner = 200, rPlanets = 230;

  function polar(longitude, radius) {
    // 0° at Aries point to the right; rotate so 0° at top by subtracting 90°
    const ang = ((longitude - 90) * Math.PI) / 180;
    return [cx + radius * Math.cos(ang), cy + radius * Math.sin(ang)];
  }

  return (
    <div className="chartWrap">
      <svg ref={svgRef} width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Rings */}
        <circle cx={cx} cy={cy} r={rOuter} fill="none" stroke="#39445e" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={rInner} fill="none" stroke="#39445e" strokeWidth="1" />

        {/* 12 signs marks */}
        {Array.from({length:12},(_,i)=>(
          <g key={i}>
            {(() => {
              const [x1,y1] = polar(i*30, rInner);
              const [x2,y2] = polar(i*30, rOuter);
              return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2a3142" strokeWidth="1"/>;
            })()}
          </g>
        ))}

        {/* House cusps */}
        {houses.map((h, idx) => {
          const [x1,y1] = polar(h.cusp, rInner - 10);
          const [x2,y2] = polar(h.cusp, rOuter + 10);
          return <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#7dd3fc" strokeWidth="1.5" opacity="0.7" />
        })}

        {/* Planets */}
        {planets.map((p, i) => {
          const [x,y] = polar(p.longitude, rPlanets);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="6" fill="#a78bfa" />
              <text x={x+8} y={y+4} fontSize="12" fill="#e8ecf1">{p.name}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
});

export default ChartWheel;
