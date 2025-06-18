/**
 *
 * 連続したsvg画像ファイルを`switchingImageTiming`のフレーム単位で切り替えることで、
 * アニメーションを実現する処理を行います。対象のオブジェクトの
 * `frameIndex`, `frameCount`を用いることで動的に処理しています。
 *
 * ---
 *
 * @param {Object} params
 * @param {canvasDOM} params.ctx canvasDOMを受け取ります
 * @param {targetObject} params.object 描写対象のオブジェクトを受け取ります
 * @param {targetImagesArray} params.objectImages 描写対象のsvg配列を受け取ります
 * @param {ms} params.switchingImageTiming アニメーションを切り替えるタイミング（ミリ秒）
 *
 * ---
 *
 * @example 例)`setInterval`を用いることで継続して描写する事ができます。
 *
 * ```javascript
 * const drawingPlayer = setInterval(() => {
 *    drawing({ ctx, player, playerImages, switchingImageTiming: 6 });
 * }, 10)
 *
 * clearInterval(drawingPlayer);
 * ```
 *
 * ---
 *
 * @return void
 */
export const drawing = ({ ctx, object, objectImages, switchingImageTiming = 6 }) => {
  if (!ctx || !object || !objectImages || objectImages.length === 0) return;

  const drawOne = (obj) => {
    if (!obj || obj.frameIndex == null) return;

    const img = objectImages[obj.frameIndex];
    if (!img?.complete) return;

    ctx.drawImage(img, obj.x, obj.y, obj.width, obj.height);

    obj.frameCount = (obj.frameCount || 0) + 1;
    if (obj.frameCount % switchingImageTiming === 0) {
      obj.frameIndex = (obj.frameIndex + 1) % objectImages.length;
    }
  };

  if (Array.isArray(object)) {
    object.forEach(drawOne);
  } else {
    drawOne(object);
  }
};
