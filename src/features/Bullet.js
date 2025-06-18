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

export { createBullet, updateBullets };
