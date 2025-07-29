import React, { useEffect, useState, useRef } from 'react';
import socket from './socket'; // ✅ shared socket instance


function Lobby() {
  const [header, setHeader] = useState('');
  const [joinedGame, setJoinedGame] = useState(false);
  const joinedGameRef = useRef(false);

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

    if (!joinedGameRef.current) {
      socket.emit('joinGame');
      joinedGameRef.current = true;
  }

    // 🔴 Cleanup when component unmounts (or re-renders)
    return () => {
      socket.off('waiting', onWaiting);
      socket.off('gameStart', onGameStart);
    };
  }, []);

  return <header>{header}</header>;
}

export default Lobby;
