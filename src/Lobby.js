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
  const [isMate, setIsMate] = useState(false);
  const [youWin, setYouWin] = useState(false);
  const [inGame, setInGame] = useState(false);
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
      setInGame(true)
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
    {!inGame && <header style={{ color: "blue" }}>{header}</header>}

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        position: "relative", // allows absolute positioning inside
        width: "100%",
      }}
    >
      {/* Overlayed message */}
      {isMate && !youWin && (
        <header
          style={{
            position: "absolute",
            top: "7%", // adjust how low it appears
            left: "50%",
            transform: "translateX(-50%)", // centers horizontally
            color: "red",
            fontWeight: "bold",
            fontSize: "2.5rem",
            zIndex: 10, // ensures it's above ChessBoard
          }}
        >
          Checkmate - You Lose
        </header>
      )}
      {isMate && youWin && (
        <header
          style={{
            position: "absolute",
            top: "7%",
            left: "50%",
            transform: "translateX(-50%)",
            color: "green",
            fontWeight: "bold",
            fontSize: "2.5rem",
            zIndex: 10,
          }}
        >
          Checkmate - You Win!
        </header>
      )}

      <ChessBoard
        opponent={opponent}
        color={color}
        position={position}
        setPosition={setPosition}
        userTurn={myTurn}
        setUserTurn={setMyTurn}
        setIsMate={setIsMate}
        setYouWin={setYouWin}
      />
    </div>
  </div>

  );
}

export default Lobby;
