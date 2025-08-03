import React, { useEffect, useState } from "react";
import './ChessBoard.css';
import socket from "../socket";

import bBishop from './pieces-png/B-Bishop.png';
import bKing from './pieces-png/B-King.png';
import bKnight from './pieces-png/B-Knight.png';
import bPawn from './pieces-png/B-Pawn.png';
import bRook from './pieces-png/B-Rook.png';
import bQueen from './pieces-png/B-Queen.png';
import wBishop from './pieces-png/W-Bishop.png';
import wKing from './pieces-png/W-King.png';
import wKnight from './pieces-png/W-Knight.png';
import wPawn from './pieces-png/W-Pawn.png';
import wRook from './pieces-png/W-Rook.png';
import wQueen from './pieces-png/W-Queen.png';

import { bishopMoves } from "../scripts/ValidMoves";

const pieceImages = {
    'B1': bPawn,
    'B2': bKnight,
    'B3': bBishop,
    'B4': bRook,
    'B5': bQueen,
    'B6': bKing,
    'W1': wPawn,
    'W2': wKnight,
    'W3': wBishop,
    'W4': wRook,
    'W5': wQueen,
    'W6': wKing,
}

const pieces = ['', 'Pawn', 'Knight', 'Bishop', 'Rook', 'Queen', 'King'];

let temp = ['', 'dot', 'hollow-circle'];

const emptyArray = [
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ], 
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ]
];

const squareClick = (opponent, row, col, color, position, setPosition, piece,
                    setPiece, prevSquare, setPrevSquare, setUserTurn, dotsShown, setDotsShown) => {
    console.log(`color before enter ${color}`);
    setDotsShown(bishopMoves(row, col, position, color));
    if (piece !== '0' && piece !== '') {
        const newPosition = position.map(row => [...row]);
        if ((prevSquare[0] != row || prevSquare[1] != col) && dotsShown[row][col] > 0) {
            newPosition[row][col] = piece;
            newPosition[prevSquare[0]][prevSquare[1]] = '0';
            setPosition(newPosition);
            socket.emit('madeMove', opponent, prevSquare, row, col, piece);
            setUserTurn(false);
            setDotsShown(emptyArray);
        }
        setPiece('0');
    } else {
        setPrevSquare([[row],[col]]);
        setPiece(position[row][col]);
    }
}

const ChessBoard = ({opponent, color, position, setPosition, userTurn, setUserTurn}) => {
    console.log(`color ${color}`)
    const board = [];
    const className = `chess-board${color === 'black' ? ' rotate' : ''}`;
    const [piece, setPiece] = useState('');
    const [prevSquare, setPrevSquare] = useState([[null],[]]);
    console.log(`${className}`)
    const [dotsShown, setDotsShown] = useState(emptyArray);

    useEffect(() => {
        socket.on('yourTurn', ({from, to, piece}) => {
            const newPosition = position.map(row => [...row]);
            newPosition[to[0]][to[1]] = piece;
            newPosition[from[0]][from[1]] = '0';
            setPosition(newPosition);
            setUserTurn(true);
        });

        return () => {
            socket.off('yourTurn');
        };
    }, [position, setPosition, setUserTurn])

    for (let row = 0; row < 8; row ++) {
        const squares = [];
        for (let col = 0; col < 8; col++) {
            const isBlack = (row + col) % 2 === 1;
            squares.push(
                <div key={`${row}-${col}`} 
                className={`square ${isBlack ? 'black' : 'white'}`}
                onClick={userTurn ? () => squareClick(opponent, row, col, color, position, 
                                                    setPosition, piece, setPiece, prevSquare,
                                                    setPrevSquare, setUserTurn, dotsShown, setDotsShown) : undefined}>
                    <div className={`${temp[dotsShown[row][col]]}`}></div>
                    <img  className={`${color === 'black' ? 'rotate' : ''}`} src={pieceImages[position[row][col]]}></img>

                </div>
            );
        }
        board.push(
            <div key={row} className="board-row">
                {squares}
            </div>
        );
    }

    return <div className={className}>{board}</div>
}

export default ChessBoard;