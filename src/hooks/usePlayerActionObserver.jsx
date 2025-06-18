import { useEffect, useRef } from 'react';

/**
 * #### プレイヤーのキー入力（左右移動・弾発射）を監視し、状態に応じて処理を行うカスタムフック
 */
export const usePlayerActionObserver = ({ gameState, player, bullet, CANVAS_WIDTH, createBullet, updatePlayer }) => {
  const keyState = useRef({ left: false, right: false });

  useEffect(() => {
    if (!gameState) return;

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();

      if (key === 'arrowleft' || key === 'a') {
        keyState.current.left = true;
        e.preventDefault();
      }
      if (key === 'arrowright' || key === 'd') {
        keyState.current.right = true;
        e.preventDefault();
      }
      if (key === 'p') {
        bullet.current.push(createBullet(player));
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();

      if (key === 'arrowleft' || key === 'a') {
        keyState.current.left = false;
      }
      if (key === 'arrowright' || key === 'd') {
        keyState.current.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // # プレイヤーの移動を連続的に処理（60FPS）
  useEffect(() => {
    if (!gameState) return;

    const interval = setInterval(() => {
      if (keyState.current.left) updatePlayer(player, 'left', CANVAS_WIDTH);
      if (keyState.current.right) updatePlayer(player, 'right', CANVAS_WIDTH);
    }, 1000 / 60); // 60fps

    return () => clearInterval(interval);
  }, [gameState]);
};
