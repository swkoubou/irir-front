import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase';

const Irir = () => {
  //初期値を設定している
  const initialSeconds = 200;
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
      navigate('/about', { state: { name: name, time: seconds } }); //画面移行（プルリクエスト後に変更）とdbにデータを入れている
    } catch (e) {
      console.error('エラー: ', e);
      setError('データの保存中にエラーが発生しました。');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>クリアタイム</h1>

      <div style={{ fontSize: '24px', marginBottom: '10px' }}>
        タイム: {formatTime(seconds)}
      </div>
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="名前を入力してください"
        />
        <button onClick={handleNavigate} style={{ marginLeft: '10px' }}>
          Aboutへ移動
        </button>
      </div>

      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
    </div>
  );
};

export default Irir;
