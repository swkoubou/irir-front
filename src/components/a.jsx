import React, { useState, useEffect } from "react";
import "./a.css";

export default function Rain() {
  const [rain, setRain] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newRain = {
        id: Date.now(),
        x: Math.random() * window.innerWidth,
        speed: (Math.random()*2)+2,
      };

      setRain(now => [...now, newRain]);

      setTimeout(() => {
        setRain(now => now.filter(r => r.id !== newRain.id));
      }, 3000); 
    },100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rain-back">
      {rain.map(rain => (
        <div
          key={rain.id}
          className="raindrop"
          style={{ left: rain.x, animationDuration: `${rain.speed}s` }}
        />
      ))}
    </div>
  );
}