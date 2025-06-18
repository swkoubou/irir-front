const createBullet = (player) => {
  return {
    x: player.x + player.width / 2 - 5,
    y: player.y,
    width: 16,
    height: 16,
    speed: 10,
    frameIndex: 0,
    frameCount: 0,
  };
};

const updateBullets = (bullets) => {
  return bullets.filter((b) => {
    b.y -= b.speed;
    return b.y > 0;
  });
};

// todo: アニメーションsvgに対応できるように調整
const drawBullets = (ctx, bullets, bulletFrames, switchFrame) => {
  const nowFrame = bulletFrames[bullets.frameIndex];
  bullets.forEach((b) => {
    if (nowFrame.complete) {
      ctx.drawImage(nowFrame, b.x, b.y, b.width, b.height);
    }

    bullets.frameCount++;
    if (bullets.frameCount % switchFrame === 0) {
      bullets.frameIndex = (bullets.frameIndex + 1) % bulletFrames.length;
    }
  });
};

export { createBullet, updateBullets, drawBullets };
