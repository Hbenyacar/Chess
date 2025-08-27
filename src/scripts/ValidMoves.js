import { isCheck } from "./CheckOrMate";

let KingPos = null;

export function validMoves(row, col, position, color, CanEnPassant, lastMove, canCastle, myKingPos, oppKingPos) {

    KingPos = [myKingPos[0], myKingPos[1]];
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
        return kingMoves(validMoves, row, col, position, color, canCastle, oppKingPos);
    }
}

function checkSquare(position, x, y, touchedPiece, color, i, origRow, origCol) {

    if ((x) >= 0 && (y) >= 0 && (x < 8) && (y < 8) && (touchedPiece[i] != 1)) {

        const newPosition = position.map(origRow => [...origRow]);
        newPosition[x][y] = position[origRow][origCol];
        newPosition[origRow][origCol] = '0';

        let oppColor = color;
        if (oppColor === 'white') {
            oppColor = 'black';
        } else {
            oppColor = 'white';
        }
        console.log(`new pos`);
        console.log(newPosition);

        if (isCheck(KingPos[0], KingPos[1], newPosition, oppColor)) {

            return {arrVal: 0, touch: 1};
        }


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
        let {arrVal, touch} = checkSquare(position, row+i, col, touched, color, 0, row, col);
        if (arrVal > 0) {
            array[row+i][col] = arrVal;
        }
        touched[0] = touch;

        ({arrVal, touch} = checkSquare(position, row-i, col, touched, color, 1, row, col));
        if (arrVal > 0) {
            array[row-i][col] = arrVal;
        }
        touched[1] = touch;

        ({arrVal, touch} = checkSquare(position, row, col+i, touched, color, 2, row, col));
        if (arrVal > 0) {
            array[row][col+i] = arrVal;
        }
        touched[2] = touch;

        ({arrVal, touch} = checkSquare(position, row, col-i, touched, color, 3, row, col));
        if (arrVal > 0) {
            array[row][col-i] = arrVal;
        }
        touched[3] = touch;
    }

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

    let {arrVal, touch} = checkSquare(position, (row + isBlack), col, touched, color, 0, row, col);
    if (arrVal == 1) {
        array[row+isBlack][col] = arrVal;
    }
    if (row === startRow && position[row+isBlack][col].startsWith('0')) { // 2 squares if not moved
        ({arrVal, touch} = checkSquare(position, row + (isBlack*(2)), col, touched, color, 0, row, col));
        if (arrVal == 1) {
            array[row + (isBlack*(2))][col] = arrVal;
        }
    }
    ({arrVal, touch} = checkSquare(position, (row + isBlack), (col-1), touched, color, 0, row, col));
    if (arrVal == 2) {
        array[row+isBlack][col-1] = arrVal;
    }
    ({arrVal, touch} = checkSquare(position, (row + isBlack), (col+1), touched, color, 0, row, col));
    if (arrVal == 2) {
        array[row+isBlack][col+1] = arrVal;
    }

    // Determine if this pawn can enPassant
    if (CanEnPassant && (row == lastMove[0]) && (Math.abs(col-lastMove[1]) == 1)) {

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

    const possibleMoves = [[-1, 2],
                        [1, -2],
                        [-1, -2],
                        [1, 2],
                        [2, -1],
                        [-2, 1],
                        [-2, -1],
                        [2, 1]];

    for (let i = 0; i < 8; i++) {
        let x = parseInt(row) + parseInt(possibleMoves[i][0]);
        let y = parseInt(col) + parseInt(possibleMoves[i][1]);
        let {arrVal, touch} = checkSquare(position, x, y, touchedPiece, color, 0, row, col);
        if (arrVal != 0) {
            array[x][y] = arrVal;
        }
    }
    return array;
}

function kingMoves(array, row, col, position, color, canCastle, oppKingPos) {
    let touchedPiece = [0];
    let arrVal = 0;
    let touch = 0;
    let tempKingPos = [KingPos[0], KingPos[1]];
    const possibleMoves = [[[-1],[-1]],
                        [[-1],[1]],
                        [[1],[1]],
                        [[1],[-1]],
                        [[0],[1]],
                        [[0],[-1]],
                        [[1],[0]],
                        [[-1],[0]]];

    for (let i = 0; i < 8; i++) {
        let x = parseInt(row) + parseInt(possibleMoves[i][0]);
        let y = parseInt(col) + parseInt(possibleMoves[i][1]);
        KingPos = [x, y];
        ({arrVal, touch} = checkSquare(position, x, y, touchedPiece, color, 0, row, col));
        if (arrVal != 0) {
            array[x][y] = arrVal;
        }
    }
    KingPos = [tempKingPos[0], tempKingPos[1]]

    for (let i = 0; i < 8; i++) {
        let x = parseInt(oppKingPos[0]) + parseInt(possibleMoves[i][0]);
        let y = parseInt(oppKingPos[1]) + parseInt(possibleMoves[i][1]);
        if ((x) >= 0 && (y) >= 0 && (x < 8) && (y < 8) && (touchedPiece[i] != 1)) {
            array[x][y] = '0';
        }
    }

    let oppColor = 'white';
    if (color === 'black') {
        row = 0;
    } else {
        oppColor = 'black';
        row = 7;
    }

    const left = true;
    const right = false;
    if (checkKingCastle(canCastle, row, left, position, oppColor)) {
        for (let i = 1; i <= 3; i++) {
            array[row][i] = 1;
        }
    }

    if (checkKingCastle(canCastle, row, right, position, oppColor)) {
        for (let i = 5; i <= 6; i++) {
            array[row][i] = 1;
        } 
    }

    return array;
}

function checkKingCastle(canCastle, row, left, position, oppColor) {
    if (!canCastle) {
        return false;
    }

    if (left && position[row][0].endsWith('4')) { // check left
        for (let i = 2; i <= 3; i++) {
            const newPosition = position.map(origRow => [...origRow]);
            newPosition[row][i] = position[row][5];
            newPosition[row][5] = '0';
            if (position[row][i] !== '0' || isCheck(row, i, newPosition, oppColor)) {
                return false;
            }
        }
    } else if (!left && position[row][7].endsWith('4')) { // check right
        for (let i = 5; i <= 6; i++) {
            const newPosition = position.map(origRow => [...origRow]);
            newPosition[row][i] = position[row][5];
            newPosition[row][5] = '0';
            if (position[row][i] !== '0' || isCheck(row, i, newPosition, oppColor)) {
                return false;
            }
        } 
    }

    return true;
}

function diagonal(array, row, col, position, color) {

    let i = 1;
    let x = row;
    let y = col;
    let touchedPiece = [0, 0, 0, 0]
    while (i < 8) {
        // top left check for white
        let {arrVal, touch} = checkSquare(position, (x-i), (y-i), touchedPiece, color, 0, row, col);
        if (arrVal != 0) {
            array[x-i][y-i] = arrVal;
        }
        touchedPiece[0] = touch;

        ({arrVal, touch} = checkSquare(position, (x+i), (y+i), touchedPiece, color, 1, row, col));
        if (arrVal != 0) {
            array[x+i][y+i] = arrVal;
        }
        touchedPiece[1] = touch;

        ({arrVal, touch} = checkSquare(position, (x-i), (y+i), touchedPiece, color, 2, row, col));
        if (arrVal != 0) {
            array[x-i][y+i] = arrVal;
        }
        touchedPiece[2] = touch;

        ({arrVal, touch} = checkSquare(position, (x+i), (y-i), touchedPiece, color, 3, row, col));
        if (arrVal != '0') {
            array[x+i][y-i] = arrVal;
        }
        touchedPiece[3] = touch;
        i++;
    }

    return array;
}