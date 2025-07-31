import React from "react";
import './ChessBoard.css';

const squareClick = (row, col) => {
    console.log(`${row}, ${col}`);
}

const ChessBoard = () => {
    const board = [];

    for (let row = 0; row < 8; row ++) {
        const squares = [];
        for (let col = 0; col < 8; col++) {
            const isBlack = (row + col) % 2 === 1;
            squares.push(
                <div key={`${row}-${col}`} 
                className={`square ${isBlack ? 'black' : 'white'}`}
                onClick={() => squareClick(row, col)}>

                </div>
            );
        }
        board.push(
            <div key={row} className="board-row">
                {squares}
            </div>
        );
    }

    return <div className="chess-board">{board}</div>
}

export default ChessBoard;