import React, { useEffect, useState, useSyncExternalStore } from "react";
import './ChessBoard.css';
import socket from "../socket";

const pieces = ['', 'Pawn', 'Knight', 'Bishop', 'Rook', 'Queen', 'King'];

const squareClick = (opponent, row, col, color, position, setPosition, piece,
                    setPiece, prevSquare, setPrevSquare, setUserTurn) => {

    if (piece !== '0' && piece !== '') {
        if (color === 'black' && position[row][col].startsWith('B')) {
            console.log('Valid Black!');
        } else if (color === 'white' && position[row][col].startsWith('W')) {
            console.log('Valid White!');
        } else {
            console.log('Invalid!');
        }
        const newPosition = position.map(row => [...row]);
        if (prevSquare[0] != row || prevSquare[1] != col) {
            newPosition[row][col] = piece;
            newPosition[prevSquare[0]][prevSquare[1]] = '0';
            setPosition(newPosition);
            socket.emit('madeMove', opponent, prevSquare, row, col, piece);
            setUserTurn(false);
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

    // ------------
    // Piece Values
    // ------------
    // Null 0
    // Pawn 1
    // Knight 2
    // Bishop 3
    // Rook 4
    // Queen 5
    // King 6

    for (let row = 0; row < 8; row ++) {
        const squares = [];
        for (let col = 0; col < 8; col++) {
            const isBlack = (row + col) % 2 === 1;
            squares.push(
                <div key={`${row}-${col}`} 
                className={`square ${isBlack ? 'black' : 'white'}`}
                onClick={userTurn ? () => squareClick(opponent, row, col, color, position, 
                                                    setPosition, piece, setPiece, prevSquare,
                                                    setPrevSquare, setUserTurn) : undefined}>
                    {pieces[position[row][col].substring(1,position[row][col].length)]}
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