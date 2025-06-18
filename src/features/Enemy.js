/**
 *
 * @param {Number} canvasWidth
 * @param {Number} canvasHeight
 * @returns 新しい "Enemy" のオブジェクトを返します
 */
const createEnemy = (canvasWidth, canvasHeight) => {
  const x = Math.random() * (canvasWidth - 64);
  const y = Math.random() * (canvasHeight / 2);

  return {
    x,
    y,
    width: 64,
    height: 64,
    alive: true,
  };
};

const updateEnemyCollisionDetection = ({ bullets, enemies, setScore }) => {
  bullets.forEach((bullet, bIndex) => {
    enemies.forEach((enemy) => {
      // * 矩形判定 && 生存判定
      if (
        enemy.alive &&
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        // 倒された時の処理
        enemy.alive = false;
        bullets.splice(bIndex, 1);
        setScore((s) => s + 10);
      }
    });
  });
};

// todo: アニメーションsvgに対応できるように調整
const drawEnemies = (ctx, enemies, enemyImg) => {
  enemies.forEach((enemy) => {
    if (enemy.alive && enemyImg.complete) {
      ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
      console.log('done draw enemy!!');
    }
  });
};

export { createEnemy, updateEnemyCollisionDetection, drawEnemies };
