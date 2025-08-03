import React, { useEffect, useState } from "react";

export function main() {

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
    console.log(color)
    while (i < 8) {
        if ((x-i) >= 0 && (y-i) >= 0 && touchedPiece[0] != 1) { // top left check for white
            if (!position[x-i][y-i].startsWith(color[0].toUpperCase()) || position[x-i][y-i] === '0') {
                if (position[x-i][y-i] !== '0') {
                    array[x-i][y-i] = 2;
                    touchedPiece[0] = 1;
                } else {
                    array[x-i][y-i] = 1;
                }
            }
        }
        if ((x+i) < 8  && (y+i) < 8 && touchedPiece[1] != 1) { // bottom right check for white
            if (!position[x+i][y+i].startsWith(color[0].toUpperCase()) || position[x+i][y+i] === '0') {
                if (position[x+i][y+i] !== '0') {
                    array[x+i][y+i] = 2;
                    touchedPiece[1] = 1;
                } else {
                    array[x+i][y+i] = 1;
                }
            }

        }
        if ((x-i) >= 0  && (y+i) < 8 && touchedPiece[2] != 1) { // top right check for white
            if (!position[x-i][y+i].startsWith(color[0].toUpperCase()) || position[x-i][y+i] === '0') {
                if (position[x-i][y+i] !== '0') {
                    array[x-i][y+i] = 2;
                    touchedPiece[2] = 1;
                } else {
                    array[x-i][y+i] = 1;
                }
            }

        }
        if ((x+i) < 8  && (y-i) >= 0 && touchedPiece[3] != 1) { // bottom left check for white
            if (!position[x+i][y-i].startsWith(color[0].toUpperCase()) || position[x+i][y-i] === '0') {
                if (position[x+i][y-i] !== '0') {
                    array[x+i][y-i] = 2;
                    touchedPiece[3] = 1;
                } else {
                    array[x+i][y-i] = 1;
                }
            }

        }
        i++;
    }
    console.log(array)
    return array;
}