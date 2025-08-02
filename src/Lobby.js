import React, { useEffect, useState, useRef } from 'react';
import socket from './socket';
import ChessBoard from './components/ChessBoard';

function Lobby() {
  const [header, setHeader] = useState('');
  const [joinedGame, setJoinedGame] = useState(false);
  const joinedGameRef = useRef(false);
  const [color, setColor] = useState('');
  const [username, setUser] = useState('');
  const [opponent, setOpponent] = useState('');
  const [position, setPosition] = useState([[
    'B4', 'B2', 'B3', 'B5', 'B6', 'B3', 'B2', 'B4'],
    ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],
    ['0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0'], 
    ['W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1'],
    ['W4', 'W2', 'W3', 'W5', 'W6', 'W3', 'W2', 'W4'
  ]]);


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
      <ChessBoard color={color} position={position} setPosition={setPosition}/>
    </div>

  );
}

export default Lobby;
