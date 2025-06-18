const createPlayer = () => {
  return {
    x: 375,
    y: 500,
    width: 64,
    height: 64,
    speed: 5,
    frameIndex: 0,
    frameCount: 0,
  };
};

const updatePlayer = (player, direction, canvasWidth) => {
  if (direction === 'left') {
    player.x = Math.max(0, player.x - player.speed);
  } else if (direction === 'right') {
    player.x = Math.min(canvasWidth - player.width, player.x + player.speed);
  }
};

export { createPlayer, updatePlayer };
