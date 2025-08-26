import React, { useEffect, useState, useRef } from "react";
import './ChessBoard.css';
import socket from "../socket";
import {isCheck } from "../scripts/CheckOrMate";

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

import { validMoves } from "../scripts/ValidMoves";

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

let moveIcon = ['', 'dot', 'hollow-circle'];

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
                    setPiece, prevSquare, setPrevSquare, setUserTurn, 
                    dotsShown, setDotsShown, CanEnPassant, lastMove, canCastle, setCanCastle,
                    myKingPos, oppKingPos) => {
    if (piece !== '0' && piece !== '' && dotsShown[row][col] > 0) {
        const newPosition = position.map(row => [...row]);
        if ((prevSquare[0] != row || prevSquare[1] != col)) {

            if (piece.endsWith('6')) {
                setCanCastle([false, false]);
                if ((col - prevSquare[1]) === 2) {
                    newPosition[row][col-1] = position[row][7];
                    newPosition[row][7] = '0';
                } else if ((col - prevSquare[1]) === -2) {
                    newPosition[row][col+1] = position[row][0];
                    newPosition[row][0] = '0';
                }
            }

            // Check if can castle - [0] is left - [1] is right
            if ((canCastle[0] || canCastle[1]) && piece.endsWith('4')) {
                if (prevSquare[1] == 0) {
                    setCanCastle([false,canCastle[1]]);
                } else {
                    setCanCastle([canCastle[0], false]);
                }
            }

            let enPassanted = false;
            if (CanEnPassant && piece.endsWith('1') && (Math.abs(lastMove[0]-row) == 1) && (lastMove[1] == col)) {
                    if (color === 'black') {
                        newPosition[row-1][lastMove[1]] = '0';
                    } else {
                        newPosition[row+1][lastMove[1]] = '0'
                    }
                    enPassanted = true;
            }

            newPosition[row][col] = piece;
            newPosition[prevSquare[0]][prevSquare[1]] = '0';
            setPosition(newPosition);
            let isItCheck = isCheck(oppKingPos.current[0], oppKingPos.current[1], newPosition, color);
            console.log(`check: ${isItCheck}`);
            // Check if opponent can enPassant
            CanEnPassant = false;
            if (piece.endsWith('1') && Math.abs((row - prevSquare[0])) === 2) {
                CanEnPassant = true;
            }
            socket.emit('madeMove', {
                opponent,
                from: prevSquare,
                to: [row, col],
                piece,
                CanEnPassant,
                enPassanted,
                newPos: newPosition
              });
            setUserTurn(false);
            setDotsShown(emptyArray);
        }
        setPiece('0');
    } else {
        setPrevSquare([row, col]);
        setPiece(position[row][col]);
        if (position[row][col] !== '0' &&
            position[row][col].startsWith(color[0].toUpperCase())) {
                console.log(`posBeforePass ${myKingPos.current[0]} ${myKingPos.current[1]}`)
            setDotsShown(validMoves(row, col, position, color, CanEnPassant, lastMove, canCastle, myKingPos.current));
        } else {
            setDotsShown(emptyArray);
        }
    }
}

const ChessBoard = ({opponent, color, position, setPosition, userTurn, setUserTurn}) => {
    const board = [];
    const className = `chess-board${color === 'black' ? ' rotate' : ''}`;
    const [piece, setPiece] = useState('');
    const [prevSquare, setPrevSquare] = useState([null, null]);
    const [dotsShown, setDotsShown] = useState(emptyArray);
    const [CanEnPassant, setCanEnPassant] = useState(false);
    const [lastMove, setLastMove] = useState([,]);
    const [canCastle, setCanCastle] = useState([true,true]);
    const myKingPos = useRef(null);
    const oppKingPos = useRef(null);

    useEffect(() => {
        socket.on('yourTurn', ({from, to, piece, CanEnPassant, enPassanted, newPos}) => {

            const newPosition = position.map(row => [...row]);
            newPosition[to[0]][to[1]] = piece;
            newPosition[from[0]][from[1]] = '0';
            
            if (enPassanted) {
                if (color === 'white') {
                    newPosition[to[0]-1][to[1]] = '0';
                } else {
                    newPosition[to[0]+1][to[1]] = '0';
                }
            }

            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    newPosition[i][j] = newPos[i][j];
                }
            }
            
            setPosition(newPosition);
            setUserTurn(true);
            setCanEnPassant(CanEnPassant);

            setLastMove([to[0],to[1]]);
        });

        return () => {
            socket.off('yourTurn');
        };
    }, [position])

    for (let row = 0; row < 8; row ++) {
        const squares = [];
        for (let col = 0; col < 8; col++) {
            const isBlack = (row + col) % 2 === 1;
            if (position[row][col] === (color === 'white' ? 'B6' : 'W6')) {
                oppKingPos.current = [row, col];
            }

            if (position[row][col] === (color === 'black' ? 'B6' : 'W6')) {
                myKingPos.current = [row, col];
            }

            squares.push(
                <div key={`${row}-${col}`} 
                className={`square ${isBlack ? 'black' : 'white'}`}
                onClick={userTurn ? () => squareClick(opponent, row, col, color, position, 
                                                    setPosition, piece, setPiece, prevSquare,
                                                    setPrevSquare, setUserTurn, 
                                                    dotsShown, setDotsShown,
                                                    CanEnPassant, lastMove, canCastle, setCanCastle, myKingPos, oppKingPos) : undefined}>
                    <div className={`${moveIcon[dotsShown[row][col]]}`}></div>
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