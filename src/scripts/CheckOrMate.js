export function isCheck(row, col, position, color) {
    // Check Diagonal
    return checkDiagonal(row, col, position, color);
}

function checkDiagonal(row, col, position, color) {
    let piecesToCheck = ['3', '5']

        let isCheck = checkSqaure(position, row, col, color, piecesToCheck, -1, -1);
        if (isCheck == 1) {
            return true;
        }

        isCheck = checkSqaure(position, row, col, color, piecesToCheck, 1, -1);
        if (isCheck == 1) {
            return true;
        }

        isCheck = checkSqaure(position, row, col, color, piecesToCheck, -1, 1);
        if (isCheck == 1) {
            return true;
        }

        isCheck = checkSqaure(position, row, col, color, piecesToCheck, 1, 1);
        if (isCheck == 1) {
            return true;
        }

    return false;
}

function checkSqaure(position, row, col, color, piecesToCheck, rowSign, colSign) {
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
                }
            }
        }
        i++;
    }

    return 0;
}