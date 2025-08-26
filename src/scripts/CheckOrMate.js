export function isCheck(row, col, position, color) {
    // Check Diagonal
    if (checkDiagonal(row, col, position, color)) {
        return true;
    }

    if (checkStraight(row, col, position, color)) {
        return true;
    }

    if (checkKnight(row, col, position, color)) {
        return true;
    }

    if (checkPawn(row, col, position, color)) {
        return true;
    }

    return false;
}

function checkPawn(x, y, position, color) {
    let direction = -1;
    if (color === 'white') {
        direction = 1;
    }
    console.log(`direction: ${direction}`)
    if ((x + direction) >= 0 && (y + 1) >= 0 && ((x + direction) < 8) && ((y + 1) < 8) ) {
        console.log('here1')
        if (position[x + direction][y + 1].endsWith('1') && position[x + direction][y + 1].startsWith(color[0].toUpperCase())) {
            return true; // is Check
        }
    }

    if ((x + direction) >= 0 && (y - 1) >= 0 && ((x + direction) < 8) && ((y - 1) < 8) ) {
        console.log('here2')
        if (position[x + direction][y - 1].endsWith('1') && position[x + direction][y - 1].startsWith(color[0].toUpperCase())) {
            return true; // is Check
        }
    }
    return false;
}

function checkKnight(row, col, position, color) {

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
        if ((x) >= 0 && (y) >= 0 && (x < 8) && (y < 8) ) {
            if (position[x][y].endsWith('2') && position[x][y].startsWith(color[0].toUpperCase())) {
                return true; // is Check
            }
        }
    }
    return false;
}

function checkStraight(row, col, position, color) {
    let piecesToCheck = ['4', '5'];
    let isCheck = checkLine(position, row, col, color, piecesToCheck, -1, 0);
        if (isCheck == 1) {
            return true;
        }

        // Check Bottom Left
        isCheck = checkLine(position, row, col, color, piecesToCheck, 0, -1);
        if (isCheck == 1) {
            return true;
        }

        // Check Top Right
        isCheck = checkLine(position, row, col, color, piecesToCheck, 0, 1);
        if (isCheck == 1) {
            return true;
        }

        // Check Bottom Right
        isCheck = checkLine(position, row, col, color, piecesToCheck, 1, 0);
        if (isCheck == 1) {
            return true;
        }
}

function checkDiagonal(row, col, position, color) {
    let piecesToCheck = ['3', '5'];

        // Check Top Left
        let isCheck = checkLine(position, row, col, color, piecesToCheck, -1, -1);
        if (isCheck == 1) {
            return true;
        }

        // Check Bottom Left
        isCheck = checkLine(position, row, col, color, piecesToCheck, 1, -1);
        if (isCheck == 1) {
            return true;
        }

        // Check Top Right
        isCheck = checkLine(position, row, col, color, piecesToCheck, -1, 1);
        if (isCheck == 1) {
            return true;
        }

        // Check Bottom Right
        isCheck = checkLine(position, row, col, color, piecesToCheck, 1, 1);
        if (isCheck == 1) {
            return true;
        }

    return false;
}

function checkLine(position, row, col, color, piecesToCheck, rowSign, colSign) {
    let i = 1;
    while (i < 8) {
        let x = row + (rowSign * i);
        let y = col + (colSign * i);
        if ((x) >= 0 && (y) >= 0 && (x < 8) && (y < 8) ) {
            console.log('here');
            for (let j = 0; j < piecesToCheck.length; j++) {
                console.log(`piece: ${position[x][y]}`);
                if (position[x][y].endsWith(piecesToCheck[j]) && position[x][y].startsWith(color[0].toUpperCase())) {
                    return 1; // is Check
                } else if (!position[x][y].startsWith(color[0].toUpperCase()) && !position[x][y].startsWith('0')) {
                    return 0;
                }
            }
        }
        i++;
    }

    return 0;
}