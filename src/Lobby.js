import React, { useEffect, useState } from 'react';
import socket from './socket'; // ✅ shared socket instance


function Lobby() {
  const [header, setHeader] = useState('');

  useEffect(() => {

    const onWaiting = () => {
      console.log('in here');  
      setHeader('Waiting for opponent');
    };

    const onGameStart = () => {
      console.log('game started');
      setHeader("In game!");
    };

    socket.on('waiting', onWaiting);
    socket.on('gameStart', onGameStart);

    socket.emit('joinGame');

    // 🔴 Cleanup when component unmounts (or re-renders)
    return () => {
      socket.off('waiting', onWaiting);
      socket.off('gameStart', onGameStart);
    };
  }, []);

  return <header>{header}</header>;
}

export default Lobby;
