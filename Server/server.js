const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 8080;

let gameState = {
    board: Array(5).fill(null).map(() => Array(5).fill(null)),
    players: {},
    currentPlayer: 'A',
    moveHistory: []
};

const initializeGame = () => {
    gameState.players['A'] = { P1: { x: 0, y: 0 }, P2: { x: 0, y: 1 }, P3: { x: 0, y: 2 }, P4: { x: 0, y: 3 }, P5: { x: 0, y: 4 }, H1: { x: 1, y: 0 }, H2: { x: 1, y: 1 }, H3: { x: 1, y: 2 }, H4: { x: 1, y: 3 }, H5: { x: 1, y: 4 } };
    gameState.players['B'] = { P1: { x: 4, y: 0 }, P2: { x: 4, y: 1 }, P3: { x: 4, y: 2 }, P4: { x: 4, y: 3 }, P5: { x: 4, y: 4 }, H1: { x: 3, y: 0 }, H2: { x: 3, y: 1 }, H3: { x: 3, y: 2 }, H4: { x: 3, y: 3 }, H5: { x: 3, y: 4 } };
    gameState.board[0] = ['A-P1', 'A-P2', 'A-P3', 'A-P4', 'A-P5'];
    gameState.board[1] = ['A-H1', 'A-H2', 'A-H3', 'A-H4', 'A-H5'];
    gameState.board[2] = [null, null, null, null, null];
    gameState.board[3] = [null, null, null, null, null];
    gameState.board[4] = ['B-P1', 'B-P2', 'B-P3', 'B-P4', 'B-P5'];
    gameState.moveHistory = [];
};

const isValidMove = (player, character, move) => {
    const { row, col } = move;
    return row >= 0 && row < 5 && col >= 0 && col < 5;
};

const processMove = (player, character, move) => {
    const { row, col } = move;
    const piecePosition = Object.values(gameState.players[player]).find(p => p.x === row && p.y === col);
    if (piecePosition) {
        gameState.board[piecePosition.x][piecePosition.y] = null;
        gameState.board[row][col] = character;
        piecePosition.x = row;
        piecePosition.y = col;

      
        gameState.moveHistory.push(`${character} moved to (${row}, ${col})`);
    }
};

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (data.type === 'init') {
            initializeGame();
            ws.send(JSON.stringify({ type: 'state_update', gameState }));
        }

        if (data.type === 'move') {
            const { player, character, move } = data;
            if (player === gameState.currentPlayer && isValidMove(player, character, move)) {
                processMove(player, character, move);
                gameState.currentPlayer = gameState.currentPlayer === 'A' ? 'B' : 'A';
                wss.clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type: 'state_update', gameState }));
                    }
                });
            } else {
                ws.send(JSON.stringify({ type: 'invalid_move' }));
            }
        }
    });

    ws.send(JSON.stringify({ type: 'state_update', gameState }));
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
