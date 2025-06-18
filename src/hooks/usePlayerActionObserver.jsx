import React, { useEffect } from 'react';

/**
 * #### プレイヤーのキー入力（左右の動き、弾丸の発射（※デバッグ用））を監視し、状態に応じて処理を行うカスタムフック
 *  */
export const usePlayerActionObserver = ({ gameState, player, bullet, CANVAS_WIDTH, createBullet, updatePlayer }) => {
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const handleKeyPress = (e) => {
      switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
          updatePlayer(player, 'left', CANVAS_WIDTH);
          e.preventDefault();
          break;
        case 'arrowright':
        case 'd':
          updatePlayer(player, 'right', CANVAS_WIDTH);
          e.preventDefault();
          break;
        case 'p': // # 確認用の弾丸発射ボタン
          bullet.current.push(createBullet(player));
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    // # プレイヤーのキー操作を監視
    window.addEventListener('keydown', handleKeyPress);

    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState]); // ! "PLAYING" に変更されたときのみ実行されるようにしています
};
