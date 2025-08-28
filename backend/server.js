const express = require("express");
const http = require("http");
const {Server } = require("socket.io")
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin: "*"}
})

const PORT = process.env.PORT || 4000;

let waitingPlayers = [];

io.on('connection', (socket => { 
    console.log(`Player connected: ${socket.id}`)
    socket.on('joinGame', () => {
        console.log(`array ${waitingPlayers.length}`)
        if (waitingPlayers.length === 0) {
            waitingPlayers.push(socket);
            console.log(socket.id);
            io.to(socket.id).emit('waiting', socket.id);
            console.log('here');
        } else {
          
            const poppedVal = waitingPlayers.pop(); // Safe because we're not mutating original state

            player1 = {
                color: 'white',
                user: socket.id,
                opponent: poppedVal.id
            }

            player2 = {
                color: 'black',
                user: poppedVal.id,
                opponent: socket.id
            }
           
            io.to(socket.id).emit('gameStart', player1);
            io.to(poppedVal.id).emit('gameStart', player2);

            console.log(socket.id);
            console.log(poppedVal.id);
        }
    });

    socket.on('madeMove', ({ opponent, from, to, piece, CanEnPassant, enPassanted, newPos, isMate}) => {
        console.log('In switch Turn');
        console.log(`isMate: ${isMate}`);
        io.to(opponent).emit('yourTurn', {
            from: from,
            to: to,
            piece: piece,
            CanEnPassant: CanEnPassant,
            enPassanted: enPassanted,
            newPos: newPos,
            isMate: isMate,
        });
    });
}))

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });