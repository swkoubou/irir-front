import React from 'react';
import Result1 from './result1';
import Result2 from './result2';

const FinalResult = ({ time = 45, onRestart }) => {
  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans" >
      {/* Result1 */}
      <div
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 40 }}
      >
        <Result1 />
      </div>

      {/* Result2 */}
      <div
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}
      >
        <Result2 />
      </div>

      {/* FinalResult */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          zIndex: 60,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'auto',
          backgroundColor: 'rgba(255,255,255,0.9)',
          padding: '2rem',
          borderRadius: '1rem',
          textAlign: 'center',
          maxWidth: '400px',
          width: '90%',
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>🎉 ゲームクリア！</h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>タイム: {time} 秒</p>
        <button
          onClick={onHome}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontSize: '1.125rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ホーム画面へ
        </button>
        <button
          onClick={onRanking}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontSize: '1.125rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ランキング画面へ
        </button>
      </div>
    </div>
  );
};

export default FinalResult;