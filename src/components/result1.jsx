import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Result1 = () => {
  const canvasRefTop = useRef(null);
  const canvasRefBottom = useRef(null);
  const containerRefTop = useRef(null);
  const containerRefBottom = useRef(null);
  const particlesTop = useRef([]);
  const particlesBottom = useRef([]);

  const createParticle = (canvas) => {
    const direction = Math.random() > 0.5 ? 'left' : 'right';
    const x = direction === 'left' ? 0 : canvas.width;
    const y = canvas.height;
    const vx = direction === 'left' ? Math.random() * 3 + 2 : -(Math.random() * 3 + 2);
    const vy = -Math.random() * 8 - 5;
    const r = Math.random() * 4 + 4;
    const color = `hsl(${Math.random() * 60 + 30}, 100%, 60%)`;

    return { x, y, vx, vy, r, color, life: 0, maxLife: 60 };
  };

  const drawParticles = (ctx, canvas, particleArray) => {
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // 残像効果で光が残るように
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'lighter';

  for (let i = particleArray.length - 1; i >= 0; i--) {
    const p = particleArray[i];

    ctx.beginPath();
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = p.color;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0; // 他の描画に影響を与えないようリセット

    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.3;
    p.life++;

    if (p.life > p.maxLife) {
      particleArray.splice(i, 1);
    }
  }

  if (particleArray.length < 20) {
    particleArray.push(createParticle(canvas));
  }
};

  useEffect(() => {
    const canvasTop = canvasRefTop.current;
    const canvasBottom = canvasRefBottom.current;
    const ctxTop = canvasTop.getContext('2d');
    const ctxBottom = canvasBottom.getContext('2d');

    const resizeCanvas = () => {
      canvasTop.width = window.innerWidth;
      canvasTop.height = window.innerHeight;
      canvasBottom.width = window.innerWidth;
      canvasBottom.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 下レイヤーを上下反転＆ぼかし
    gsap.set(containerRefBottom.current, {
      transformOrigin: 'center bottom',
      scaleY: -1,
      opacity: 1,
    });
    gsap.set(canvasBottom, {
      filter: 'blur(10px)',
    });

    const animate = () => {
      drawParticles(ctxTop, canvasTop, particlesTop.current);
      drawParticles(ctxBottom, canvasBottom, particlesBottom.current);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <>
      {/* Top Fireworks Canvas */}
      <div ref={containerRefTop} className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <canvas ref={canvasRefTop} className="w-full h-full" />
      </div>

      {/* Mirrored Bottom Fireworks Canvas */}
      <div ref={containerRefBottom} className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <canvas ref={canvasRefBottom} className="w-full h-full" />
      </div>
    </>
  );
};

export default Result1;