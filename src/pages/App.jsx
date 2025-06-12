import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import BBB from '@assets/musicSource/BBB.json';

const App = () => {
  const [gameState, setGameState] = useState({
    isPlaying: false,
    isPaused: false,
    score: 0,
    combo: 0,
    maxCombo: 0,
    currentTime: 0,
    startTime: null,
    activeNotes: [],
    speed: 1.5,
    tapTiming: 150,
  });

  const gameAreaRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(0);

  const notesDataRef = useRef(JSON.parse(BBB));

  const [availableNotes, setAvailableNotes] = useState([
    ...notesDataRef.current,
  ]);

  // ゲームループ
  const gameLoop = useCallback(
    (timestamp) => {
      if (!gameState.isPlaying || gameState.isPaused) {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      const currentTime = timestamp - gameState.startTime;
      lastTimeRef.current = timestamp;

      setGameState((prev) => {
        const gameAreaHeight = 600;
        const tapLineY = gameAreaHeight - 100;
        const lookAhead = 4000;

        // 新しいノーツの生成
        const newNotes = [];
        const remainingNotes = availableNotes.filter((noteData) => {
          if (
            noteData.start <= currentTime + lookAhead &&
            !prev.activeNotes.find(
              (n) => n.id === `${noteData.line}-${noteData.start}`
            )
          ) {
            newNotes.push({
              id: `${noteData.line}-${noteData.start}`,
              line: noteData.line,
              startTime: noteData.start,
              y: -60,
              hit: false,
              missed: false,
              spawned: true,
            });
            return false;
          }
          return true;
        });

        // ノーツ位置の更新
        const updatedNotes = [...prev.activeNotes, ...newNotes]
          .map((note) => {
            if (note.hit) return note;

            const timeDiff = currentTime - note.startTime;
            const fallDistance = (timeDiff / 1000) * 200 * prev.speed;
            const newY = fallDistance;

            // ミス判定
            if (newY > tapLineY + 80 && !note.missed && !note.hit) {
              return { ...note, y: newY, missed: true };
            }

            return { ...note, y: newY };
          })
          .filter((note) => note.y <= gameAreaHeight + 100);

        // コンボリセット処理
        const newMissedNotes = updatedNotes.filter(
          (note) =>
            note.missed &&
            !prev.activeNotes.find((n) => n.id === note.id && n.missed)
        );

        const newCombo = newMissedNotes.length > 0 ? 0 : prev.combo;

        // availableNotesの更新
        if (remainingNotes.length !== availableNotes.length) {
          setAvailableNotes(remainingNotes);
        }

        return {
          ...prev,
          activeNotes: updatedNotes,
          combo: newCombo,
          currentTime,
        };
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    },
    [
      gameState.isPlaying,
      gameState.isPaused,
      gameState.startTime,
      availableNotes,
    ]
  );

  // ゲーム開始
  const startGame = useCallback(() => {
    if (gameState.isPlaying) return;

    const startTime = performance.now();
    lastTimeRef.current = startTime;

    setGameState((prev) => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      startTime: startTime,
    }));
  }, [gameState.isPlaying]);

  // ゲーム一時停止
  const pauseGame = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, []);

  // ゲームリセット
  const resetGame = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setGameState({
      isPlaying: false,
      isPaused: false,
      score: 0,
      combo: 0,
      maxCombo: 0,
      currentTime: 0,
      startTime: null,
      activeNotes: [],
      speed: 1.5,
      tapTiming: 150,
    });

    setAvailableNotes([...notesDataRef.current]);
  }, []);

  // タップ処理
  const handleTap = useCallback(
    (lane) => {
      if (!gameState.isPlaying || gameState.isPaused) return;

      const gameAreaHeight = 600;
      const tapLineY = gameAreaHeight - 100;

      // 該当レーンのノーツを検索
      const laneNotes = gameState.activeNotes.filter(
        (note) => note.line === lane && !note.hit && !note.missed
      );

      if (laneNotes.length === 0) return;

      // 最も近いノーツを選択
      const closestNote = laneNotes.reduce((closest, note) => {
        const closestDiff = Math.abs(closest.y - tapLineY);
        const noteDiff = Math.abs(note.y - tapLineY);
        return noteDiff < closestDiff ? note : closest;
      });

      const distance = Math.abs(closestNote.y - tapLineY);
      let points = 0;

      if (distance <= 25) {
        points = 1000;
      } else if (distance <= 45) {
        points = 500;
      } else if (distance <= 70) {
        points = 200;
      } else {
        return;
      }

      const comboBonus = Math.floor(gameState.combo / 10);
      points += comboBonus * 50;

      setGameState((prev) => {
        const newCombo = prev.combo + 1;
        return {
          ...prev,
          score: prev.score + points,
          combo: newCombo,
          maxCombo: Math.max(prev.maxCombo, newCombo),
          activeNotes: prev.activeNotes.map((note) =>
            note.id === closestNote.id ? { ...note, hit: true } : note
          ),
        };
      });
    },
    [
      gameState.isPlaying,
      gameState.isPaused,
      gameState.activeNotes,
      gameState.combo,
    ]
  );

  // ゲームループ開始/停止
  useEffect(() => {
    if (gameState.isPlaying) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.isPlaying, gameLoop]);

  // キーボード操作
  useEffect(() => {
    const handleKeyDown = (e) => {
      const keyMap = {
        KeyA: 0,
        KeyS: 1,
        KeyD: 2,
        KeyF: 3,
        KeyG: 4,
      };

      if (keyMap in e.code) {
        e.preventDefault();
        handleTap(keyMap[e.code]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleTap]);

  const styles = useMemo(
    () => ({
      container: {
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: 'Arial, sans-serif',
      },
      header: {
        height: '80px',
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        color: 'white',
        zIndex: 100,
      },
      gameArea: {
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '400px',
      },
      lane: {
        position: 'absolute',
        width: '20%',
        height: '100%',
        borderLeft: '2px solid rgba(255, 255, 255, 0.3)',
        background:
          'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%)',
        top: 0,
      },
      tapLine: {
        position: 'absolute',
        bottom: '100px',
        width: '100%',
        height: '4px',
        background: 'linear-gradient(90deg, #ff4081, #e91e63, #ff4081)',
        boxShadow: '0 0 20px #ff4081',
        animation: 'pulse 2s infinite',
        zIndex: 50,
      },
      note: {
        position: 'absolute',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #ffeb3b, #ffc107)',
        border: '3px solid #fff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        fontSize: '20px',
        color: '#333',
        fontWeight: 'bold',
        transition: 'all 0.1s ease',
      },
      touchArea: {
        position: 'absolute',
        bottom: '0',
        width: '20%',
        height: '120px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderTop: '2px solid rgba(255, 255, 255, 0.3)',
        cursor: 'pointer',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: 'bold',
      },
      controls: {
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '15px',
        zIndex: 100,
      },
      button: {
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        color: 'white',
        border: 'none',
        borderRadius: '25px',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
        minWidth: '80px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.2s ease',
      },
      keyGuide: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '10px',
        fontSize: '12px',
        zIndex: 100,
      },
    }),
    []
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
          Score: {gameState.score.toLocaleString()}
        </div>
        <div style={{ fontSize: '18px', color: '#ffeb3b' }}>
          Combo: {gameState.combo} (Max: {gameState.maxCombo})
        </div>
      </div>

      <div style={styles.keyGuide}>Keys: A S D F G</div>

      <div style={styles.gameArea} ref={gameAreaRef}>
        {[0, 1, 2, 3, 4].map((lane) => (
          <div
            key={`lane-${lane}`}
            style={{
              ...styles.lane,
              left: `${lane * 20}%`,
            }}
          />
        ))}

        <div style={styles.tapLine} />

        {gameState.activeNotes.map((note) => {
          if (note.hit) return null;

          const lanePercent = note.line * 20 + 10;

          return (
            <div
              key={note.id}
              style={{
                ...styles.note,
                left: `calc(${lanePercent}% - 25px)`,
                top: `${note.y}px`,
                opacity: note.missed ? 0.3 : 1,
                transform: note.missed ? 'scale(0.8)' : 'scale(1)',
              }}
            >
              ♪
            </div>
          );
        })}

        {[0, 1, 2, 3, 4].map((lane) => (
          <div
            key={`touch-${lane}`}
            style={{
              ...styles.touchArea,
              left: `${lane * 20}%`,
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              handleTap(lane);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              handleTap(lane);
            }}
          >
            {['A', 'S', 'D', 'F', 'G'][lane]}
          </div>
        ))}
      </div>

      <div style={styles.controls}>
        <button
          style={{
            ...styles.button,
            background: gameState.isPlaying
              ? 'linear-gradient(135deg, #4caf50, #45a049)'
              : styles.button.background,
          }}
          onClick={startGame}
        >
          {gameState.isPlaying ? 'Playing' : 'Start'}
        </button>
        <button
          style={{
            ...styles.button,
            background: gameState.isPaused
              ? 'linear-gradient(135deg, #ff9800, #f57c00)'
              : styles.button.background,
          }}
          onClick={pauseGame}
        >
          {gameState.isPaused ? 'Resume' : 'Pause'}
        </button>
        <button style={styles.button} onClick={resetGame}>
          Reset
        </button>
      </div>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
          }
          
          button:active {
            transform: translateY(0);
          }
        `}
      </style>
    </div>
  );
};

export default App;
