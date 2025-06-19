import React, { useEffect, useRef, useState } from "react";
// import './HeartDockn.css';

const frameCount = 7;
const frameDelay = 50; // ms

const HeartDockn = () => {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [threshold, setThreshold] = useState(2080);
  const [aboveThreshold, setAboveThreshold] = useState(false);
  const [prevFiltered, setPrevFiltered] = useState(0);
  const [beatCount, setBeatCount] = useState(0);
  const [lastBeatTime, setLastBeatTime] = useState(0);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    const promises = [];
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `./svgs/dokudokuheart${i}.svg`;
      promises.push(
        new Promise((resolve) => {
          img.onload = resolve;
        })
      );
      imagesRef.current.push(img);
    }
    await Promise.all(promises);
  };

  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  const dockn = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    for (let i = frameCount - 1; i >= 0; i--) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imagesRef.current[i], 0, 0, canvas.width, canvas.height);
      await wait(frameDelay);
    }
  };

  const lowPassFilter = (currentValue) => {
    const alpha = 0.4;
    const filtered = alpha * currentValue + (1 - alpha) * prevFiltered;
    setPrevFiltered(filtered);
    return filtered;
  };

  const detectBeat = (value) => {
    const now = Date.now();
    if (value > threshold && !aboveThreshold) {
      if (now - lastBeatTime > 300) {
        setBeatCount((c) => c + 1);
        setLastBeatTime(now);
        dockn();
      }
      setAboveThreshold(true);
    } else if (value < threshold) {
      setAboveThreshold(false);
    }
  };

  const handleMockData = () => {
    // モックデータを使ってテストする関数（デバッグ用）
    const simulated = Math.random() * 1000 + 1800; // 1800〜2800
    const filtered = lowPassFilter(simulated);
    detectBeat(filtered);
  };

  return (
    <div className="heartdockn-container">
      <p>
        しきい値:{" "}
        <input
          type="range"
          min="1800"
          max="2500"
          step="1"
          value={threshold}
          onChange={(e) => setThreshold(parseInt(e.target.value))}
        />
        <span>{threshold}</span>
      </p>
      <button onClick={dockn}>ドックン</button>
      <button onClick={handleMockData}>テスト信号</button>
      <canvas
        ref={canvasRef}
        width="256"
        height="256"
        style={{ border: "1px solid #ccc" }}
      />
    </div>
  );
};

export default HeartDockn;
