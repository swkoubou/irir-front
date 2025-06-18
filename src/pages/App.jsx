// # React 関連のインポート
import React, { useState, useEffect, useRef } from 'react';

// # 自作モジュールのインポート
import { createPlayer, updatePlayer, drawPlayer } from '@features/Player';
import { createEnemy, updateEnemyCollisionDetection, drawEnemies } from '@features/Enemy';
import { createBullet, updateBullets, drawBullets } from '@features/Bullet';
import { createBoss, updateBossCollisionDetection, drawBoss } from '@features/Boss';

// # SCSSのインポートする
import styles from '@scss/App.module.scss';

// # 画像ファイルのインポート
const playerFrames = Array.from({ length: 7 }, (_, i) => {
  const img = new Image();
  img.src = new URL(`.src/assets/imgs/player/heartmove${i + 1}.svg`, import.meta.url).href;
  return img;
});
const bossFrames = Array.from({ length: 7 }, (_, i) => {
  const img = new Image();
  img.src = new URL(`.src/assets/imgs/player/heartmove${i + 1}.svg`, import.meta.url).href;
  return img;
});
const enemyFrames = Array.from({ length: 7 }, (_, i) => {
  const img = new Image();
  img.src = new URL(`.src/assets/imgs/player/heartmove${i + 1}.svg`, import.meta.url).href;
  return img;
});
const bulletFrames = Array.from({ length: 7 }, (_, i) => {
  const img = new Image();
  img.src = new URL(`.src/assets/imgs/player/heartmove${i + 1}.svg`, import.meta.url).href;
  return img;
});

import backgroundImg from '@assets/backgroundImg.png';

// # カスタムフックのインポート
import { useGameTimer } from '@hooks/useGameTimer';
import { usePlayerActionObserver } from '../hooks/usePlayerActionObserver';

function App() {
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);

  const [gameState, setGameState] = useState('PLAYING');
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(0.0);

  // # 心拍数用の状態変数
  // # const [heartRate, setHeartRate] = useState(0);

  const MAX_ENEMIES = 10;
  const CANVAS_WIDTH = window.innerWidth;
  const CANVAS_HEIGHT = window.innerHeight;

  const playerRef = useRef(createPlayer());
  const bossRef = useRef(null);
  const enemyRefs = useRef([]);
  const bulletRefs = useRef([]);

  // # 雑魚敵オブジェクトを "enemyRefs" に追加
  const spawnEnemy = () => {
    if (enemyRefs.current.length < MAX_ENEMIES) {
      enemyRefs.current.push(createEnemy(CANVAS_WIDTH, CANVAS_HEIGHT));
    }
  };

  // # ボスオブジェクトを "bossRef" に追加
  const spawnBoss = () => {
    bossRef.current = createBoss(CANVAS_WIDTH);
  };

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
    bullet: bulletRefs.current,
    createBullet,
    updatePlayer,
    CANVAS_WIDTH,
    gameState,
  });

  useEffect(() => {
    if (gameState !== 'PLAYING') return;
    gameLoopRef.current = setInterval(() => {
      updateGame();
      drawGame();
    }, 1000 / 60);

    return () => clearInterval(gameLoopRef.current);
  }, [gameState]);

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
    if (!canvas) {
      console.log('cannot load canvas');
      return;
    }
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    drawPlayer(ctx, playerRef.current, playerFrames);
    drawBullets(ctx, bulletRefs.current, bulletFrames);
    drawEnemies(ctx, enemyRefs.current, enemyFrames);
    drawBoss(ctx, bossRef.current, bossFrames);
  };

  return (
    <div className={styles['display']}>
      <h1 className={styles['display-score']}>Score: {score}</h1>
      <h2 className={styles['display-time']}>Time: {gameTime / 100}s</h2>
      <img className={styles['display-background']} src={backgroundImg} />
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="border border-black" />
      {gameState === 'GAMEOVER' && <div className="">GAME OVER</div>}
    </div>
  );
}

export default App;
