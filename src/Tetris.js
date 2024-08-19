import React, { useState, useEffect } from 'react';
import './Tetris.css';
import './Game.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCopyright, faUserCircle } from '@fortawesome/free-solid-svg-icons';

// Define constants and utility functions
const COLS = 10; // Number of columns
const ROWS = 20; // Number of rows
const BLOCK_SIZE = 30; // Block size in pixels

const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: 'cyan' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'blue' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'orange' },
  O: { shape: [[1, 1], [1, 1]], color: 'yellow' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'green' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'purple' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'red' },
};

const createBoard = () => {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
};

const randomTetromino = () => {
  const tetrominos = 'IJLOSTZ';
  const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return TETROMINOS[randTetromino];
};

const Tetris = ({ onBack }) => {
  const [board, setBoard] = useState(createBoard());
  const [currentPiece, setCurrentPiece] = useState({
    shape: randomTetromino().shape,
    color: randomTetromino().color,
    position: { x: COLS / 2 - 1, y: 0 },
  });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameOver) {
        movePieceDown();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currentPiece, board, gameOver]);

  const movePieceDown = () => {
    const { shape, position } = currentPiece;
    const newPos = { ...position, y: position.y + 1 };

    if (!isValidMove(shape, newPos)) {
      setPiece();
      return;
    }

    setCurrentPiece({ shape, position: newPos, color: currentPiece.color });
  };

  const movePieceLeft = () => {
    const { shape, position } = currentPiece;
    const newPos = { ...position, x: position.x - 1 };

    if (isValidMove(shape, newPos)) {
      setCurrentPiece({ shape, position: newPos, color: currentPiece.color });
    }
  };

  const movePieceRight = () => {
    const { shape, position } = currentPiece;
    const newPos = { ...position, x: position.x + 1 };

    if (isValidMove(shape, newPos)) {
      setCurrentPiece({ shape, position: newPos, color: currentPiece.color });
    }
  };

  const rotatePiece = () => {
    const { shape, position } = currentPiece;
    const rotatedShape = rotate(shape);

    if (isValidMove(rotatedShape, position)) {
      setCurrentPiece({ shape: rotatedShape, position, color: currentPiece.color });
    }
  };

  const rotate = (matrix) => {
    return matrix[0].map((_, i) => matrix.map(row => row[i])).reverse();
  };

  const isValidMove = (shape, position) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const newX = position.x + x;
          const newY = position.y + y;
  
          if (
            newX < 0 ||  // Check left boundary
            newX >= COLS ||  // Check right boundary
            newY >= ROWS ||  // Check bottom boundary
            (newY >= 0 && board[newY][newX] !== 0)  // Check if the cell is occupied
          ) {
            return false;
          }
        }
      }
    }
    return true;
  };
  

  const setPiece = () => {
    const newBoard = board.map(row => row.slice());
    const { shape, position, color } = currentPiece;

    shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          newBoard[position.y + y][position.x + x] = color;
        }
      });
    });

    setBoard(newBoard);
    checkRows(newBoard);
    const newPiece = randomTetromino();
    if (!isValidMove(newPiece.shape, { x: COLS / 2 - 1, y: 0 })) {
      setGameOver(true);
    } else {
      setCurrentPiece({
        shape: newPiece.shape,
        color: newPiece.color,
        position: { x: COLS / 2 - 1, y: 0 },
      });
    }
  };

  const checkRows = (newBoard) => {
    const clearedBoard = newBoard.filter(row => row.some(cell => cell === 0));
    const rowsCleared = ROWS - clearedBoard.length;
    setScore(score + rowsCleared * 10);

    for (let i = 0; i < rowsCleared; i++) {
      clearedBoard.unshift(Array(COLS).fill(0));
    }

    setBoard(clearedBoard);
  };

  const resetGame = () => {
    setBoard(createBoard());
    setGameOver(false);
    setScore(0);
    setCurrentPiece({
      shape: randomTetromino().shape,
      color: randomTetromino().color,
      position: { x: COLS / 2 - 1, y: 0 },
    });
  };

  const handleKeyDown = (e) => {
    if (gameOver) return;

    switch (e.key) {
      case 'ArrowLeft':
        movePieceLeft();
        break;
      case 'ArrowRight':
        movePieceRight();
        break;
      case 'ArrowDown':
        movePieceDown();
        break;
      case 'ArrowUp':
        rotatePiece();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPiece, gameOver]);

  const renderBoard = () => {
    const { shape, position, color } = currentPiece;
    const previewBoard = board.map(row => row.slice());

    shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          previewBoard[position.y + y][position.x + x] = color;
        }
      });
    });

    return previewBoard.map((row, y) => (
      <div key={y} className="tetris-row">
        {row.map((cell, x) => (
          <div
            key={x}
            className={`tetris-cell ${cell ? 'filled' : ''}`}
            style={{ backgroundColor: cell || '' }}
          ></div>
        ))}
      </div>
    ));
  };

  return (
    <div className="tetris-container">
      <div className="scoreboard-tetris">
        {gameOver && (
          <button className="back-button" onClick={onBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        )}
        <h1 className='score'>Score: {score}</h1>
      </div>
      <div className="tetris-body">
        {gameOver && (
          <div className="game-over">
            <p>Game Over</p>
            <button onClick={resetGame}>Restart</button>
          </div>
        )}
        <div className="tetris-board">{renderBoard()}</div>
      </div>
      <div className="footer">
        <FontAwesomeIcon icon={faCopyright} className="fa-icon" /> Created by
        <FontAwesomeIcon icon={faUserCircle} className="fa-icon" /> Vatan Mishra
      </div>
    </div>
  );
};

export default Tetris;
