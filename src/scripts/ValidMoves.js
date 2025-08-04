import React, { useEffect, useState } from "react";


const emp = [
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ], 
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0 ]
]
export function main(row, col, position, color, CanEnPassant, lastMove) {
    let validMoves = [
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ], 
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ]
    ]

    console.log('in main');
    if (position[row][col].endsWith('1')) {
        return pawnMoves(validMoves, row, col, position, color, CanEnPassant, lastMove);
    } else if (position[row][col].endsWith('2')) {
        return knightMoves(validMoves, row, col, position, color);
    } else if (position[row][col].endsWith('3')) {
        return diagonal(validMoves, row, col, position, color);
    } else if (position[row][col].endsWith('4')) {
        return straight(validMoves, row, col, position, color);
    } else if (position[row][col].endsWith('5')) {
        validMoves = straight(validMoves, row, col, position, color);
        return diagonal(validMoves, row, col, position, color);
    } else if (position[row][col].endsWith('6')) {
        return emp;
    }
}

function checkSquare(position, x, y, touchedPiece, color, i) {
    if ((x) >= 0 && (y) >= 0 && (x < 8) && (y < 8) && (touchedPiece[i] != 1)) {
        if (!position[x][y].startsWith(color[0].toUpperCase()) || position[x][y] === '0') {
            if (position[x][y] !== '0') {
                return {arrVal: 2, touch: 1};
            } else {
                return {arrVal: 1, touch: 0};
            }
        }
    }
    return {arrVal: 0, touch: 1};
}

function straight(array, row, col, position, color) {
    let touched = [0,0,0,0];
    for (let i = 1; i < 8; i++) {
        let {arrVal, touch} = checkSquare(position, row+i, col, touched, color, 0);
        if (arrVal > 0) {
            array[row+i][col] = arrVal;
        }
        touched[0] = touch;

        ({arrVal, touch} = checkSquare(position, row-i, col, touched, color, 1));
        if (arrVal > 0) {
            array[row-i][col] = arrVal;
        }
        touched[1] = touch;

        ({arrVal, touch} = checkSquare(position, row, col+i, touched, color, 2));
        if (arrVal > 0) {
            array[row][col+i] = arrVal;
        }
        touched[2] = touch;

        ({arrVal, touch} = checkSquare(position, row, col-i, touched, color, 3));
        if (arrVal > 0) {
            array[row][col-i] = arrVal;
        }
        touched[3] = touch;
    }
    console.log(array);
    return array;
}

function pawnMoves(array, row, col, position, color, CanEnPassant, lastMove) {
    let touched = [0];
    let isBlack = 1;
    let startRow = 1;
    if (color === 'white') {
        isBlack = -1;
        startRow = 6;
    }

    let {arrVal, touch} = checkSquare(position, (row + isBlack), col, touched, color, 0);
    if (arrVal == 1) {
        array[row+isBlack][col] = arrVal;
    }
    if (row === startRow) { // 2 squares if not moved
        ({arrVal, touch} = checkSquare(position, row + (isBlack*(2)), col, touched, color, 0));
        if (arrVal == 1) {
            array[row + (isBlack*(2))][col] = arrVal;
        }
    }
    ({arrVal, touch} = checkSquare(position, (row + isBlack), (col-1), touched, color, 0));
    if (arrVal == 2) {
        array[row+isBlack][col-1] = arrVal;
    }
    ({arrVal, touch} = checkSquare(position, (row + isBlack), (col+1), touched, color, 0));
    if (arrVal == 2) {
        array[row+isBlack][col+1] = arrVal;
    }

    // Determine if this pawn can enPassant
    if (CanEnPassant && (row == lastMove[0]) && (Math.abs(col-lastMove[1]) == 1)) {
        console.log('in here')
        if (lastMove[1] > col) {
            array[row+isBlack][col+1] = 2;
        } else {
            array[row+isBlack][col-1] = 2;
        }
    }
    return array;
}

function knightMoves(array, row, col, position, color) {
    let touchedPiece = [0];

    const possibleMoves = [[[-1],[2]],
                        [[1],[-2]],
                        [[-1],[-2]],
                        [[1],[2]],
                        [[2],[-1]],
                        [[-2],[1]],
                        [[-2],[-1]],
                        [[2],[1]]];

    for (let i = 0; i < 8; i++) {
        let x = parseInt(row) + parseInt(possibleMoves[i][0]);
        let y = parseInt(col) + parseInt(possibleMoves[i][1]);
        let {arrVal, touch} = checkSquare(position, x, y, touchedPiece, color, 0);
        if (arrVal != 0) {
            array[x][y] = arrVal;
        }
    }
    return array;
} 


export function diagonal(array, row, col, position, color) {

    let i = 1;
    let x = row;
    let y = col;
    let touchedPiece = [0, 0, 0, 0]
    while (i < 8) {
        // top left check for white
        let {arrVal, touch} = checkSquare(position, (x-i), (y-i), touchedPiece, color, 0);
        if (arrVal != 0) {
            array[x-i][y-i] = arrVal;
        }
        touchedPiece[0] = touch;

        ({arrVal, touch} = checkSquare(position, (x+i), (y+i), touchedPiece, color, 1));
        if (arrVal != 0) {
            array[x+i][y+i] = arrVal;
        }
        touchedPiece[1] = touch;

        ({arrVal, touch} = checkSquare(position, (x-i), (y+i), touchedPiece, color, 2));
        if (arrVal != 0) {
            array[x-i][y+i] = arrVal;
        }
        touchedPiece[2] = touch;

        ({arrVal, touch} = checkSquare(position, (x+i), (y-i), touchedPiece, color, 3));
        if (arrVal != '0') {
            array[x+i][y-i] = arrVal;
        }
        touchedPiece[3] = touch;
        i++;
    }
    console.log(array)
    return array;
}