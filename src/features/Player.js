const createPlayer = () => {
  return {
    x: 375,
    y: 1000,
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

/**
 *
 * Description：画像ファイルを`Canvas API`を用いてプレイヤーを描写します。
 *
 * ---
 *
 * @example
 * 例)`setInterval`を用いることで継続して描写する事ができます。
 * ```javascript
 * const drawingPlayer = setInterval(() => {
 *    drawPlayer( ctx, player, playerFrames, switchingFrame: 6);
 * }, 10)
 *
 * clearInterval(drawingPlayer);
 * ```
 * @param {Object} params
 * @param {CanvasDOM} params.ctx
 * @param {Object} params.player
 */
const drawPlayer = ({ ctx, player, playerFrames, switchingFrame }) => {
  const nowFrame = playerFrames[player.frameIndex];

  if (nowFrame?.complete) {
    ctx.drawImage(nowFrame, player.x, player.y, player.width, player.height);
  }

  player.frameCount++;
  // # "switchFrame" のタイミングで次のフレームに切り替える
  if (player.frameCount % switchingFrame === 0) {
    player.frameIndex = (player.frameIndex + 1) % playerFrames.length;
  }
};

export { createPlayer, updatePlayer, drawPlayer };
