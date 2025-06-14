import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const MAX_BOXES = 30;
const GAME_DURATION = 30;

const getRandomPosition = () => ({
  x: Math.floor(Math.random() * 85),
  y: Math.floor(Math.random() * 75),
});

const generateBoxes = (count) =>
  Array.from({ length: count }, (_, id) => ({
    id: Date.now() + id + Math.random(),
    ...getRandomPosition(),
  }));

export default function Stress() {
  const [boxes, setBoxes] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [started, setStarted] = useState(false);
  const boxRefs = useRef({});
  const canvasRef = useRef(null);
  const particles = useRef([]);

  // 効果音（public/sounds/fireworks.mp3に配置）
  const clickSound = useRef(null);
  useEffect(() => {
    clickSound.current = new Audio("/sounds/fireworks.mp3");
    clickSound.current.volume = 0.5;
  }, []);

  useEffect(() => {
    if (!started) return;

    setBoxes(generateBoxes(MAX_BOXES));
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started]);

  // パーティクルクラス
  class Particle {
    constructor(x, y, ctx) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 10;
      this.vy = (Math.random() - 0.5) * 10;
      this.alpha = 1;
      this.radius = Math.random() * 3 + 2;
      this.ctx = ctx;
      this.color = `hsla(${Math.random() * 360}, 100%, 70%, ${this.alpha})`;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.02;
      this.color = `hsla(${Math.random() * 360}, 100%, 70%, ${this.alpha})`;
    }

    draw() {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
    }

    isAlive() {
      return this.alpha > 0;
    }
  }

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.current.forEach((p) => {
        p.update();
        p.draw();
      });
      particles.current = particles.current.filter((p) => p.isAlive());
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const handleClick = (id) => {
    if (gameOver) return;

    const boxEl = boxRefs.current[id];
    if (!boxEl) return;

    if (clickSound.current) {
      clickSound.current.currentTime = 0;
      clickSound.current.play();
    }

    const rect = boxEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const ctx = canvasRef.current.getContext("2d");

    for (let i = 0; i < 20; i++) {
      particles.current.push(new Particle(centerX, centerY, ctx));
    }

    gsap.to(boxEl, {
      duration: 0.5,
      scale: 0,
      rotation: 720,
      x: "+=100",
      y: "+=100",
      opacity: 0,
      ease: "power3.out",
      onComplete: () => {
        setBoxes((prev) => {
          const filtered = prev.filter((b) => b.id !== id);
          return [...filtered, ...generateBoxes(1)];
        });
      },
    });

    setScore((prev) => prev + 1);
  };

  return (
    <div className="relative w-full max-w-[480px] h-[800px] mx-auto bg-black overflow-hidden">
      {/* パーティクル用のcanvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        width={window.innerWidth}
        height={window.innerHeight}
      />

      {!started && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-30 bg-black bg-opacity-80 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">
            ポテト君を破壊してストレスを発散しよう！
          </h1>
          <button
            onClick={() => {
              setStarted(true);
              setScore(0);
              setTimeLeft(GAME_DURATION);
              setGameOver(false);
            }}
            className="bg-yellow-400 text-black px-6 py-3 rounded-full text-xl font-bold shadow-lg"
          >
            ゲームスタート
          </button>
        </div>
      )}

      <div className="absolute top-4 left-4 text-white font-bold z-10 text-sm">
        ⏱ {timeLeft}s | 💥 Score: {score}
      </div>

      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white z-40 text-center px-4">
          <div className="text-3xl font-bold mb-4">💥 スコア: {score}</div>
          <p className="text-xl mb-4">ストレスは発散できたかな？</p>
          <button
            onClick={() => {
              setStarted(false);
              setGameOver(false);
            }}
            className="bg-white text-black px-5 py-2 rounded-full font-bold shadow"
          >
            タイトルへ戻る
          </button>
        </div>
      )}

      {started &&
        boxes.map((box) => (
          <img
            key={box.id}
            ref={(el) => (boxRefs.current[box.id] = el)}
            onClick={() => handleClick(box.id)}
            src="/images/potato.png"
            alt="potato"
            className="absolute w-12 h-12 object-contain cursor-pointer z-20"
            style={{
              top: `${box.y}%`,
              left: `${box.x}%`,
            }}
          />
        ))}
    </div>
  );
}
