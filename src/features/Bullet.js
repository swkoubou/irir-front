const createBullet = (player) => {
  return {
    x: player.x + player.width / 2 - 5,
    y: player.y,
    width: 8,
    height: 8,
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

const drawBullet = ({ ctx, object }) => {
  if (!ctx || !object) return;

  const drawOne = (obj) => {
    if (!obj || obj.frameIndex == null) return;

    ctx.fillStyle = 'blue';
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
  };

  if (Array.isArray(object)) {
    object.forEach(drawOne);
  } else {
    drawOne(object);
  }
};

export { createBullet, updateBullets, drawBullet };
