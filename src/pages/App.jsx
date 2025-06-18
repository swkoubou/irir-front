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

  // # 心拍数用の状態変数
  // # const [heartRate, setHeartRate] = useState(0);

  const MAX_ENEMIES = 10;

  const playerRef = useRef(createPlayer());
  const bossRef = useRef(null);
  const enemyRefs = useRef([]);
  const bulletRefs = useRef([]);

  // # 雑魚敵オブジェクトを "enemyRefs" に追加
  const spawnEnemy = () => {
    if (enemyRefs.current.length < MAX_ENEMIES) {
      enemyRefs.current.push(createEnemy(canvasRef.current.width, canvasRef.current.height));
    }
  };

  // # ボスオブジェクトを "bossRef" に追加
  const spawnBoss = () => {
    bossRef.current = createBoss(canvasRef.current.width);
  };

  useEffect(() => {
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

  // # ゲームタイマーを生成し、時間ごとに決められた処理を行う
  useGameTimer({
    setGameTime,
    setGameState,
    spawnEnemy,
    spawnBoss,
  });

  // # ユーザーのキー入力を検知し、プレイヤーのアクション処理を行う
  usePlayerActionObserver({
    player: playerRef.current,
    bullet: bulletRefs,
    createBullet,
    updatePlayer,
    CANVAS_WIDTH: window.innerWidth,
    gameState,
  });

  // # リサイズされた時、Canvasサイズを調整する
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // # ゲームループ処理
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
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas || !ready) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawing({ ctx, object: playerRef.current, objectImages: playerImages });
    drawBullet({ ctx, object: bulletRefs.current });
    // drawing({ ctx, object: bulletRefs.current, objectImages: bulletFrames });
    drawing({ ctx, object: enemyRefs.current, objectImages: enemyFrames });
    drawing({ ctx, object: bossRef.current, objectImages: bossFrames });
  };

  return (
    <div className={styles['display']}>
      <img className={styles['display-background']} src={backgroundImg} />
      <h1 className={styles['display-score']}>Score: {score}</h1>
      <h2 className={styles['display-time']}>Time: {(gameTime / 10).toFixed(1)}s</h2>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className={styles['display-canvas']}
      />
      {!gameState && <div className="">GAME OVER</div>}
    </div>
  );
}

export default App;
