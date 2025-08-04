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
import { main } from "../scripts/ValidMoves";

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
                    setPiece, prevSquare, setPrevSquare, setUserTurn, 
                    dotsShown, setDotsShown, CanEnPassant, lastMove) => {
    //console.log(lastMove);
    if (piece !== '0' && piece !== '' && dotsShown[row][col] > 0) {
        const newPosition = position.map(row => [...row]);
        console.log(dotsShown);
        if ((prevSquare[0] != row || prevSquare[1] != col)) {
            console.log(`RIGHT HERE ${piece} ${Math.abs(lastMove[0]-row)} ${lastMove[0]} ${col}`);
            let enPassanted = false;
            if (CanEnPassant && piece.endsWith('1') && (Math.abs(lastMove[0]-row) == 1) && (lastMove[1] == col)) {
                    console.log('HEREEEEE');
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

            // Check if opponent can enPassant
            CanEnPassant = false;
            if (piece.endsWith('1') && Math.abs((row - prevSquare[0])) === 2) {
                CanEnPassant = true;
            }
    
            console.log(`enpassanted: ${enPassanted}`);
            console.log(`Can Enpassant: ${CanEnPassant}`);
            socket.emit('madeMove', opponent, prevSquare, row, col, piece, CanEnPassant, enPassanted);
            setUserTurn(false);
            setDotsShown(emptyArray);
        }
        setPiece('0');
    } else {
        setPrevSquare([[row],[col]]);
        setPiece(position[row][col]);
        if (position[row][col] !== '0' &&
            position[row][col].startsWith(color[0].toUpperCase())) {
            setDotsShown(main(row, col, position, color, CanEnPassant, lastMove));
        } else {
            setDotsShown(emptyArray);
        }
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
    const [CanEnPassant, setCanEnPassant] = useState(false);
    const [lastMove, setLastMove] = useState([,]);

    useEffect(() => {
        socket.on('yourTurn', ({from, to, piece, CanEnPassant, enPassanted}) => {
            const newPosition = position.map(row => [...row]);
            newPosition[to[0]][to[1]] = piece;
            newPosition[from[0]][from[1]] = '0';
            console.log(`${enPassanted} enPassanted`);
            if (enPassanted) {
                if (color === 'white') {
                    newPosition[to[0]-1][to[1]] = '0';
                } else {
                    newPosition[to[0]+1][to[1]] = '0';
                }
            }
            setPosition(newPosition);
            setUserTurn(true);
            setCanEnPassant(CanEnPassant);

            setLastMove([to[0],to[1]]);
            console.log(`lastMove ${lastMove[0]}, ${lastMove[1]}`);
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
                                                    setPrevSquare, setUserTurn, 
                                                    dotsShown, setDotsShown,
                                                    CanEnPassant, lastMove) : undefined}>
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