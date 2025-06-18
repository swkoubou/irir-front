import { useEffect } from 'react';

/**
 * #### ゲーム開始時に
 */
export const useGameTimer = ({ setGameTime, setGameState, spawnEnemy, spawnBoss }) => {
  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime((time) => {
        // # 0.01 秒単位で刻むぜ！
        const newTime = time + 1;
        if (newTime % 50 === 0) {
          // # 5秒 ごとに雑魚敵が出現する
          spawnEnemy();
        }
        if (newTime === 4000) {
          // # 40秒 たつとボスが出現する
          spawnBoss();
        }
        if (newTime === 6000) {
          // # 60秒たつとゲームオーバーになる
          setGameState(false);
        }
        return newTime;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [setGameState, setGameTime, spawnBoss, spawnEnemy]);
};
