import React, { useState } from 'react';
import './TicTacToe.css'; // Create a CSS file for styling
import { faArrowLeft, faCopyright, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Puzzle from './Puzzle';
import Tetris from './Tetris'; // Import Tetris component

const SIZE = 3; // 3x3 Tic-Tac-Toe board

const Game = () => {
  const [game, setGame] = useState('ticTacToe');

  if (game === 'puzzle') {
    return <Puzzle onBack={() => setGame('ticTacToe')} />;
  }
  if (game === 'tetris') {
    return <Tetris onBack={() => setGame('ticTacToe')} setGame={setGame} />;
  }
  return <TicTacToe onBack={() => setGame('puzzle')} setGame={setGame} />;
};

const TicTacToe = ({ onBack,setGame }) => {
  const [board, setBoard] = useState(Array(SIZE * SIZE).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);

  const handleClick = (index) => {
    if (board[index] || winner || !isXNext) return; // Ignore click if square is already filled, game is won, or it's not player's turn

    const newBoard = board.slice();
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsXNext(false);
    const result = checkWinner(newBoard);

    if (result) {
      setWinner(result);
    } else {
      robotMove(newBoard);
    }
  };

  const minimax = (board, depth, isMaximizing) => {
    const scores = { X: -10, O: 10, Tie: 0 };
    const result = checkWinner(board);

    if (result !== null) {
      return scores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = 'O';
          let score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = 'X';
          let score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const getBestMove = (board) => {
    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        let score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  const robotMove = (board) => {
    if (winner) return; // If there's already a winner, no more moves should be made

    const bestMove = getBestMove(board);
    const newBoard = board.slice();
    newBoard[bestMove] = 'O';
    setTimeout(() => {
      if (!winner) {
        setBoard(newBoard);
        setIsXNext(true);
        const result = checkWinner(newBoard);
        if (result) {
          setWinner(result);
        }
      }
    }, 500); // Delay to simulate thinking time
  };

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (!board.includes(null)) {
      return 'Tie';
    }

    return null;
  };

  const renderSquare = (index) => (
    <button
      className="square"
      onClick={() => handleClick(index)}
    >
      {board[index]}
    </button>
  );

  const handleReset = () => {
    setBoard(Array(SIZE * SIZE).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <>
      <div className="tic-tac-toe-container">
        <div className="board">
          {board.map((_, index) => renderSquare(index))}
        </div>
        <button className="back-button-tic" onClick={onBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="status">
          {winner ? (winner === 'Tie' ? 'It\'s a Tie!' : `Winner: ${winner}`) : `Next Player: ${isXNext ? 'X' : 'O'}`}
        </div>
        <button className="reset-button-tic" onClick={handleReset}>Reset Game</button>
        <button className="reset-button-tic" onClick={() => setGame('tetris')}>
        Play Tetris
      </button>
        <div className="footer">
          <FontAwesomeIcon icon={faCopyright} className="fa-icon" /> Created by
          <FontAwesomeIcon icon={faUserCircle} className="fa-icon" /> Vatan Mishra
        </div>
      </div>
    </>
  );
};

export default Game;
