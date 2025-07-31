import React, { useEffect, useState, useRef } from 'react';
import socket from './socket'; // ✅ shared socket instance
import ChessBoard from './components/ChessBoard';


function Lobby() {
  const [header, setHeader] = useState('');
  const [joinedGame, setJoinedGame] = useState(false);
  const joinedGameRef = useRef(false);
  const [color, setColor] = useState('');
  const [username, setUser] = useState('');
  const [opponent, setOpponent] = useState('');



  useEffect(() => {

    const onWaiting = (userName) => {
      console.log('in here');  
      setHeader('Waiting for opponent');
      setUser(userName);
    };

    const onGameStart = (playerData) => {
      console.log('game started');
      setHeader("In game!");
      setColor(playerData.color);
      setUser(playerData.user);
      setOpponent(playerData.opponent);
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
      <header>{username}</header>
      <header>{opponent}</header>
      <ChessBoard/>
    </div>

  );
}

export default Lobby;
