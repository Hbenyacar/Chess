import React, { useEffect, useState } from "react";

export function main() {

}

function checkSquare(position, x, y, touchedPiece, color, i) {
    console.log(`x ${x}`);
    console.log(`y ${y}`);
    console.log('h');
    if ((x) >= 0 && (y) >= 0 && (x < 8) && (y < 8) && (touchedPiece[i] != 1)) { // top left check for white
        console.log('e');
        if (!position[x][y].startsWith(color[0].toUpperCase()) || position[x][y] === '0') {
            console.log('r');
            if (position[x][y] !== '0') {
                console.log('e');
                return {arrVal: 2, touch: 1};
            } else {
                console.log('e');
                return {arrVal: 1, touch: 0};
            }
        }
    }
    return {arrVal: 0, touch: 1};

}

export function bishopMoves(row, col, position, color) {
    let array = [
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ], 
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ],
        [ 0, 0, 0, 0, 0, 0, 0, 0 ]
    ]
    let i = 1;
    let x = row;
    let y = col;
    let touchedPiece = [0, 0, 0, 0]
    console.log(position);
    console.log(color);
    while (i < 8) {
        console.log(i);
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