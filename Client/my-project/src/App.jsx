import React, { useState, useEffect } from 'react';
import './App.css';

const initialBoard = [
    ['A-P1', 'A-P2', 'A-P3', 'A-P4', 'A-P5'],
    ['A-H1', 'A-H2', 'A-H3', 'A-H4', 'A-H5'],
    [null, null, null, null, null],
    [null, null, null, null, null],
    ['B-P1', 'B-P2', 'B-P3', 'B-P4', 'B-P5']
];

const App = () => {
    const [board, setBoard] = useState(initialBoard);
    const [currentPlayer, setCurrentPlayer] = useState('A');
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [moveHistory, setMoveHistory] = useState([]);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        setWs(socket);

        socket.onopen = () => {
            socket.send(JSON.stringify({ type: 'init' }));
        };

        socket.onmessage = (message) => {
            const data = JSON.parse(message.data);
            if (data.type === 'state_update') {
                setBoard(data.gameState.board);
                setCurrentPlayer(data.gameState.currentPlayer);
                setMoveHistory(data.gameState.moveHistory || []);
            }
        };

        return () => {
            socket.close();
        };
    }, []);

    const handleCellClick = (row, col) => {
        if (selectedPiece) {
            const move = { row, col };
            const moveMessage = JSON.stringify({
                type: 'move',
                player: currentPlayer,
                character: selectedPiece.piece,
                move: move
            });
            ws.send(moveMessage);
            setSelectedPiece(null);
        } else {
            if (board[row][col] && board[row][col].startsWith(currentPlayer)) {
                setSelectedPiece({ piece: board[row][col], row, col });
            }
        }
    };

    const renderCellContent = (content, row, col) => {
        const isSelected = selectedPiece && selectedPiece.row === row && selectedPiece.col === col;
        return (
            <div
                className={`character ${content ? content.split('-')[0] : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleCellClick(row, col)}
            >
                {content}
            </div>
        );
    };

    return (
        <div className="App">
            <h1>Current Player: {currentPlayer}</h1>
            <div className="board">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((cellContent, colIndex) => (
                            <div
                                key={colIndex}
                                className={`cell ${cellContent ? 'occupied' : 'empty'}`}
                            >
                                {renderCellContent(cellContent, rowIndex, colIndex)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            {selectedPiece && (
                <div className="selected-info">
                    <p>Selected: {selectedPiece.piece}</p>
                    <div className="move-options">
                        <button onClick={() => handleCellClick(selectedPiece.row - 1, selectedPiece.col)}>Up</button>
                        <button onClick={() => handleCellClick(selectedPiece.row + 1, selectedPiece.col)}>Down</button>
                        <button onClick={() => handleCellClick(selectedPiece.row, selectedPiece.col - 1)}>Left</button>
                        <button onClick={() => handleCellClick(selectedPiece.row, selectedPiece.col + 1)}>Right</button>
                    </div>
                </div>
            )}
            <div className="move-history">
                <h2>Move History</h2>
                <ul>
                    {moveHistory.map((move, index) => (
                        <li key={index}>{move}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default App;
