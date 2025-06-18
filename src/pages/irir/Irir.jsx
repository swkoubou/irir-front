import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { Navigate } from 'react-router';

const Irir = () => {
  //初期値を設定している
  const initialSeconds = 200; //タイムの初期値
  const [seconds, setSeconds] = useState(initialSeconds);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const formatTime = (totalSeconds) => {
    //分と秒に変えている
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}分${seconds}秒`;
  };

  const handleNavigate = async () => {
    if (!name.trim()) {
      //名前が入力されていないときのエラー
      setError('名前を入力してください。');
      return;
    }

    setError(''); // エラーをリセット

    try {
      await addDoc(collection(db, 'users'), {
        name: name,
        time: seconds,
        createdAt: new Date(),
      });
      console.log('保存成功');

      Navigate('/rank', { state: { name: name, time: seconds } }); //画面移行（プルリクエスト後に変更）とdbにデータを入れている
    } catch (e) {
      console.error('エラー: ', e);
      setError('データの保存中にエラーが発生しました。');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f4f4f4',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>クリアタイム</h1>
      <div style={{ fontSize: '24px', marginBottom: '30px' }}>タイム: {formatTime(seconds)}</div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="名前を入力してください"
          style={{
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            width: '250px',
          }}
        />
        <button
          onClick={handleNavigate}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          ランキングへ移動
        </button>
      </div>

      {error && (
        <div
          style={{
            color: 'red',
            backgroundColor: '#ffe0e0',
            padding: '10px 20px',
            borderRadius: '5px',
            fontWeight: 'bold',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default Irir;
