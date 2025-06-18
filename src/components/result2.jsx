import React, { useEffect, useRef } from 'react';

const Result2 = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Firework {
      constructor(startX, direction = 'left') {
        this.startX = startX;
        this.startY = canvas.height;
        this.x = this.startX;
        this.y = this.startY;

        this.ctrlX =
          this.startX + (direction === 'left' ? 1 : -1) * (Math.random() * 100 + 100);
        this.ctrlY = Math.random() * canvas.height / 2 + 100;

        this.endX = this.ctrlX + (Math.random() * 50 - 25);
        this.endY = this.ctrlY - 100;

        this.progress = 0;
        this.exploded = false;
      }

      update() {
        this.progress += 0.02;
        if (this.progress >= 1) {
          this.exploded = true;
          explode(this.x, this.y);
        } else {
          const t = this.progress;
          this.x =
            (1 - t) * (1 - t) * this.startX +
            2 * (1 - t) * t * this.ctrlX +
            t * t * this.endX;
          this.y =
            (1 - t) * (1 - t) * this.startY +
            2 * (1 - t) * t * this.ctrlY +
            t * t * this.endY;
        }
      }

      draw(ctx) {
        ctx.save(); // 現在の描画状態を保存
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore(); // 描画状態を元に戻す
      }
    }

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 2 + 1;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 3 + 1;
        this.life = 0;
        this.maxLife = 50 + Math.random() * 50;
        this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.life++;
      }

      draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const fireworks = [];
    const particles = [];

    const explode = (x, y) => {
      for (let i = 0; i < 30; i++) {
        particles.push(new Particle(x, y));
      }
    };

    const launchFireworks = () => {
      const left = [50, 100, 150];
      const right = [canvas.width - 50, canvas.width - 100, canvas.width - 150];
      left.forEach((x) => fireworks.push(new Firework(x, 'left')));
      right.forEach((x) => fireworks.push(new Firework(x, 'right')));
    };

    launchFireworks();
    const interval = setInterval(launchFireworks, 2000);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // 背景透過

      // 花火を更新＆描画
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];
        if (!fw.exploded) {
          fw.update();
          fw.draw(ctx);
        } else {
          fireworks.splice(i, 1);
        }
      }

      // パーティクル更新＆描画
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.life > p.maxLife) particles.splice(i, 1);
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default Result2;