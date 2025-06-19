// # React 関連のインポート
import React, { useState, useEffect, useRef } from 'react';

// # 自作モジュールのインポート
import { createPlayer, updatePlayer } from '@features/Player';
import { createEnemy, updateEnemyCollisionDetection } from '@features/Enemy';
import { createBullet, updateBullets } from '@features/Bullet';
import { createBoss, updateBossCollisionDetection } from '@features/Boss';
import { imagesLoader } from '@features/imagesLoader';
import { drawing } from '@features/Drawing';

// # "assets" からインポート
import styles from '@scss/App.module.scss';
import backgroundImg from '@assets/imgs/backgroundImage.png';

// # カスタムフックのインポート
import { useGameTimer } from '@hooks/useGameTimer';
import { usePlayerActionObserver } from '../hooks/usePlayerActionObserver';
import { drawBullet } from '../features/Bullet';

// # ドックン用コンポーネントをインポート
import HeartDockn from '../components/HeartDockn';

function App() {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);

  const [gameState, setGameState] = useState(true);
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(0.0);
  const [ready, setReady] = useState(false);

  const [playerImages, setPlayerImages] = useState([]);
  const [enemyFrames, setEnemyFrames] = useState([]);
  const [bossFrames, setBossFrames] = useState([]);
  const [bulletFrames, setBulletFrames] = useState([]);
  const [bgImage, setBgImage] = useState(null);

  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight);
  const MAX_ENEMIES = 10;

  const playerRef = useRef(createPlayer(canvasWidth, canvasHeight));
  const bossRef = useRef(null);
  const enemyRefs = useRef([]);
  const bulletRefs = useRef([]);
  const enemyBulletsRefs = useRef([]);

  const spawnEnemy = () => {
    if (enemyRefs.current.length < MAX_ENEMIES) {
      enemyRefs.current.push(createEnemy(canvasWidth, canvasHeight));
    }
  };

  const spawnBoss = () => {
    bossRef.current = createBoss(canvasWidth, canvasHeight);
  };

  useEffect(() => {
    const img = new Image();
    img.src = backgroundImg;
    img.onload = () => setBgImage(img);
    (async () => {
      const [pf, ef, bf, blf] = await Promise.all([
        imagesLoader('player/heartmove', 7),
        imagesLoader('player/heartmove', 7),
        imagesLoader('player/heartmove', 7),
        imagesLoader('player/heartmove', 7),
      ]);
      setPlayerImages(pf);
      setEnemyFrames(ef);
      setBossFrames(bf);
      setBulletFrames(blf);
      setReady(true);
    })();
  }, []);

  useGameTimer({
    setGameTime,
    setGameState,
    spawnEnemy,
    spawnBoss,
  });

  usePlayerActionObserver({
    playerRef: playerRef,
    bullet: bulletRefs,
    createBullet,
    updatePlayer,
    CANVAS_WIDTH: canvasWidth,
    gameState,
  });

  useEffect(() => {
    const resizeSetCanvas = () => {
      setCanvasWidth(window.innerWidth);
      setCanvasHeight(window.innerHeight);
    };
    window.addEventListener('resize', resizeSetCanvas);
    return () => window.removeEventListener('resize', resizeSetCanvas);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }
  }, [canvasWidth, canvasHeight]);

  useEffect(() => {
    if (!gameState || !ready) return;

    const loop = () => {
      updateGame();
      drawGame();
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [gameState, ready]);

  useEffect(() => {
    if (!gameState || !ready) return;

    const shootInterval = setInterval(() => {
      const enemies = enemyRefs.current.filter((e) => e.alive);
      if (enemies.length === 0) return;

      const shooter = enemies[Math.floor(Math.random() * enemies.length)];
      enemyBulletsRefs.current.push({
        x: shooter.x + shooter.width / 2 - 4,
        y: shooter.y + shooter.height,
        width: 8,
        height: 16,
        speed: 4,
      });
    }, 3000);

    return () => clearInterval(shootInterval);
  }, [gameState, ready]);

  const updateGame = () => {
    bulletRefs.current = updateBullets(bulletRefs.current);

    updateEnemyCollisionDetection({
      bullets: bulletRefs.current,
      enemies: enemyRefs.current,
      setScore,
    });

    updateBossCollisionDetection({
      bullets: bulletRefs.current,
      bossRef: bossRef,
      setScore,
      setGameState,
    });

    enemyBulletsRefs.current = updateEnemyBullets(enemyBulletsRefs.current);
    checkPlayerHit();
  };

  const updateEnemyBullets = (bullets) => {
    return bullets.map((b) => ({ ...b, y: b.y + b.speed })).filter((b) => b.y < canvasHeight);
  };

  const checkPlayerHit = () => {
    const player = playerRef.current;
    for (const bullet of enemyBulletsRefs.current) {
      if (
        bullet.x < player.x + player.width &&
        bullet.x + bullet.width > player.x &&
        bullet.y < player.y + player.height &&
        bullet.y + bullet.height > player.y
      ) {
        setGameState(false);
        break;
      }
    }
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas || !ready) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (bgImage) {
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    }

    drawing({ ctx, object: playerRef.current, objectImages: playerImages });
    drawBullet({ ctx, object: bulletRefs.current });
    // drawing({ ctx, object: bulletRefs.current, objectImages: bulletFrames });
    drawing({ ctx, object: enemyRefs.current, objectImages: enemyFrames });
    drawing({ ctx, object: bossRef.current, objectImages: bossFrames });

    enemyBulletsRefs.current.forEach((b) => {
      ctx.fillStyle = 'red';
      ctx.fillRect(b.x, b.y, b.width, b.height);
    });
  };

  return (
    <div className={styles['display']}>
      <h1 className={styles['display-score']}>Score: {score}</h1>
      <h2 className={styles['display-time']}>Time: {(gameTime / 10).toFixed(1)}s</h2>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} className={styles['display-canvas']} />
      <HeartDockn />
      {!gameState && <div className={styles['gameover']}>GAME OVER</div>}
    </div>
  );
}

export default App;
