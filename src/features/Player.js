const createPlayer = (canvasWidth, canvasHeight) => {
  return {
    x: canvasWidth / 2 - 64,
    y: canvasHeight - 164,
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
