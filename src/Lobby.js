import React, { useEffect, useState, useRef } from 'react';
import socket from './socket'; // ✅ shared socket instance
import ChessBoard from './components/ChessBoard';


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

    return () => {
      socket.off('waiting', onWaiting);
      socket.off('gameStart', onGameStart);
    };
  }, []);

  return (
    <div>
      <header>{header}</header>
      <ChessBoard/>
    </div>

  );
}

export default Lobby;
