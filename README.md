# Turn-Based Board Game

## Overview

This project is a turn-based board game implemented with a React frontend and a Node.js backend using WebSocket for real-time communication. The game features a 5x5 board where two players (A and B) can move their pieces and track the move history.

## Features

- **5x5 Game Board**: A grid where players can place and move their pieces.
- **Player Turn Management**: Alternates turns between players A and B.
- **Piece Movement**: Allows players to select and move pieces on the board.
- **Move History**: Tracks and displays the history of moves made during the game.
- **Real-Time Updates**: Uses WebSocket to synchronize game state between the frontend and backend.

## Getting Started

### Prerequisites

- Node.js and npm installed
- Basic knowledge of React and WebSocket

### Frontend Setup

1. Navigate to the `frontend` directory.
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm start
    ```

### Backend Setup

1. Navigate to the `backend` directory.
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the server:
    ```bash
    npm start
    ```

### WebSocket Connection

Ensure that the WebSocket server is running on `ws://localhost:8080` for the frontend to connect and interact with the backend.

## Usage

1. **Open the Frontend**: The React app should be running and accessible in your browser.
2. **Play the Game**: Select a piece and click on the board to move it. The game alternates turns between players A and B.
3. **View Move History**: The history of moves will be displayed in the move history section.

## Known Issues

- The game may not handle all edge cases or complete game logic.
- Further development is needed to enhance game features and address any remaining bugs.


