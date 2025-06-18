import React, { useState, useEffect } from "react";
import "./a.css";

export default function Rain() {
  const [rain, setRain] = useState([]);
  const [time, setTime] = useState(12);
  const [showResult, setShowResult] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const newRain = {
        id: Date.now(),
        x: Math.random() * window.innerWidth,
        speed: (Math.random() * 2) + 2,
      };

      setRain(now => [...now, newRain]);

      setTimeout(() => {
        setRain(now => now.filter(r => r.id !== newRain.id));
      }, 3000);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const onRestart = () => {
    setShowResult(false);
    setScore(0);
    setTime(0);
  };

  const onRanking=()=>{
    window.location.href="ランキング"
  }


  return (
    <div className="rain-back">
      {rain.map(rain => (
        <div
          key={rain.id}
          className="raindrop"
          style={{ left: rain.x, animationDuration: `${rain.speed}s` }}
        />
      ))}

      {showResult && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            zIndex: 50,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '2rem',
            borderRadius: '1rem',
            textAlign: 'center',
            maxWidth: '400px',
            width: '90%',
          }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>😭 ざんねん！</h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>タイム: {time} 秒</p>
          <button
            onClick={onRanking}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontSize: '1.125rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ランキング画面へ！
          </button>
          
          <button
            onClick={onRestart}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontSize: '1.125rem',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ホームに戻る！
          </button>
        </div>
      )}
    </div>
  );
}
