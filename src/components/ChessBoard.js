import React from "react";
import './ChessBoard.css';

const position = [[
    '4', '2', '3', '5', '6', '3', '2', '4'],
    ['1', '1', '1', '1', '1', '1', '1', '1'],
    ['0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0'],
    ['0', '0', '0', '0', '0', '0', '0', '0'], 
    ['1', '1', '1', '1', '1', '1', '1', '1'],
    ['4', '2', '3', '5', '6', '3', '2', '4'
]];

const pieces = ['', 'Pawn', 'Knight', 'Bishop', 'Rook', 'Queen', 'King'];

const squareClick = (row, col) => {
    console.log(`${row}, ${col}`);
}

const ChessBoard = ({color}) => {
    console.log(`color ${color}`)
    const board = [];
    const className = `chess-board${color = 'black' ? ' rotate' : ''}`;
    console.log(`${className}`)

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
                onClick={() => squareClick(row, col)}>
                    {pieces[position[row][col]]}
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