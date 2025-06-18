const createBoss = (canvasWidth) => {
  return {
    x: canvasWidth / 2 - 264,
    y: 100,
    width: 528,
    height: 528,
    hp: 20,
    alive: true,
    frameIndex: 0,
    frameCount: 0,
  };
};

const updateBossCollisionDetection = ({ bullets, bossRef, setScore, setGameState }) => {
  const boss = bossRef.current;
  if (!boss?.alive) return;

  bullets.forEach((bullet, bulletIndex) => {
    // * 矩形判定
    if (
      bullet.x < boss.x + boss.width &&
      bullet.x + bullet.width > boss.x &&
      bullet.y < boss.y + boss.height &&
      bullet.y < bullet.height > boss.y
    ) {
      bullets.splice(bulletIndex, 1);
      boss.hp--;
      if (boss.hp <= 0) {
        boss.alive = false;
        setScore((s) => s + 1000);
        setGameState('GAMEOVER');
      }
    }
  });
};

export { createBoss, updateBossCollisionDetection };
