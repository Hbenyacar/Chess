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
  const [myTurn, setMyTurn] = useState(false);
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
      if (playerData.color === 'white') {
        setMyTurn(true);
      }
      setUser(playerData.user);
      setOpponent(playerData.opponent);
    };

    const onYourTurn = (prevSquare, row, col, position) => {
        const newPosition = position.map(row => [...row]);
        newPosition[row][col] = '';
        newPosition[prevSquare[0]][prevSquare[1]] = '0';
        setMyTurn(true);
    }

    socket.on('waiting', onWaiting);
    socket.on('gameStart', onGameStart);
    socket.on('yourTurn1', onYourTurn);

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
      <header>{`my color ${color}`}</header>
      <header>{`my turn ${myTurn}`}</header>
      <ChessBoard opponent={opponent} color={color} position={position} setPosition={setPosition} userTurn={myTurn} setUserTurn={setMyTurn}/>
    </div>

  );
}

export default Lobby;
