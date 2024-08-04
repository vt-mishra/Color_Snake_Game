import React, { useState, useEffect } from 'react';
import './Puzzle.css';
import { faArrowLeft, faCopyright, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Snake from './Game';
import TicTacToe from './TicTacToe'; // Import your Tic-Tac-Toe component

const SIZE = 4; // 4x4 puzzle
const EMPTY = SIZE * SIZE - 1; // Index of the empty tile

const initialBoard = Array.from({ length: SIZE * SIZE }, (_, i) => i);

const getShuffledBoard = () => {
  let board;
  do {
    board = [...initialBoard];
    for (let i = board.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [board[i], board[j]] = [board[j], board[i]];
    }
  } while (!isSolvable(board));
  return board;
};

const isSolvable = (board) => {
  let inversions = 0;
  for (let i = 0; i < board.length - 1; i++) {
    for (let j = i + 1; j < board.length; j++) {
      if (board[i] !== EMPTY && board[j] !== EMPTY && board[i] > board[j]) {
        inversions++;
      }
    }
  }

  const emptyRow = Math.floor(board.indexOf(EMPTY) / SIZE);
  return (inversions + emptyRow) % 2 === 0;
};

const Puzzle = () => {
  const [board, setBoard] = useState(getShuffledBoard());
  const [moveCount, setMoveCount] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(false);
  const [showPuzzleGame, setShowPuzzleGame] = useState(true);
  const [showTicTacToe, setShowTicTacToe] = useState(false);

  useEffect(() => {
    checkSolved();
  }, [board]);

  const checkSolved = () => {
    if (board.every((value, index) => value === index)) {
      setIsSolved(true);
    } else {
      setIsSolved(false);
    }
  };

  const moveTile = (index) => {
    const emptyIndex = board.indexOf(EMPTY);
    const [emptyRow, emptyCol] = [Math.floor(emptyIndex / SIZE), emptyIndex % SIZE];
    const [tileRow, tileCol] = [Math.floor(index / SIZE), index % SIZE];

    if (
      (Math.abs(emptyRow - tileRow) === 1 && emptyCol === tileCol) ||
      (Math.abs(emptyCol - tileCol) === 1 && emptyRow === tileRow)
    ) {
      const newBoard = [...board];
      [newBoard[emptyIndex], newBoard[index]] = [newBoard[index], newBoard[emptyIndex]];
      setBoard(newBoard);
      setMoveCount(moveCount + 1);
    }
  };

  const resetPuzzle = () => {
    setBoard(getShuffledBoard());
    setMoveCount(0);
    setIsSolved(false);
  };

  const goToStartScreen = () => {
    setShowStartScreen(true);
    setShowPuzzleGame(false);
    setShowTicTacToe(false); // Hide Tic-Tac-Toe game when going to start screen
  };

  const goToTicTacToe = () => {
    setShowStartScreen(false);
    setShowPuzzleGame(false);
    setShowTicTacToe(true);
  };

  return (
    <>
      {showStartScreen ? (
        <Snake />
      ) : showTicTacToe ? (
        <TicTacToe />
      ) : (
        <div className="game-container-main">
          <div className="puzzle-board">
            {board.map((tile, index) => (
              <div
                key={index}
                className={`puzzle-tile ${tile === EMPTY ? 'empty' : ''}`}
                onClick={() => tile !== EMPTY && moveTile(index)}
              >
                {tile !== EMPTY ? tile + 1 : ''}
              </div>
            ))}
          </div>
          <div className="puzzle-info">
            <button className="back-button-pzzl" onClick={goToStartScreen}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div className='moves'>Moves: {moveCount}</div>
            <button onClick={resetPuzzle} className="reset-button">Reset Puzzle</button>
            {isSolved && <div className="solved-message">Puzzle Solved!</div>}
            <button onClick={goToTicTacToe} className="go-to-tictactoe-button">
              Go to Tic-Tac-Toe
            </button>
          </div>
          <div className="footer">
            <FontAwesomeIcon icon={faCopyright} className="fa-icon" /> Created by
            <FontAwesomeIcon icon={faUserCircle} className="fa-icon" /> Vatan Mishra
          </div>
        </div>
      )}
    </>
  );
};

export default Puzzle;
