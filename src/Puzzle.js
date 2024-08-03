import React, { useState, useEffect } from 'react';
import './Puzzle.css';
import { faArrowLeft, faCopyright, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Snake from './Game';


const SIZE = 4; // 3x3 puzzle
const EMPTY = SIZE * SIZE - 1; // Index of the empty tile

const initialBoard = Array.from({ length: SIZE * SIZE }, (_, i) => i);

const getShuffledBoard = () => {
  let board = [...initialBoard];
  for (let i = board.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [board[i], board[j]] = [board[j], board[i]];
  }
  return board;
};

const Puzzle = () => {
  const [board, setBoard] = useState(getShuffledBoard());
  const [moveCount, setMoveCount] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(false);
  const [showPuzzleGame, setShowPuzzleGame] = useState(false);

  useEffect(() => {
    // Check if the board is in the solved state
    if (board.every((value, index) => value === index)) {
      setIsSolved(true);
    } else {
      setIsSolved(false);
    }
  }, [board]);

  const moveTile = (index) => {
    const emptyIndex = board.indexOf(EMPTY);
    const [emptyRow, emptyCol] = [Math.floor(emptyIndex / SIZE), emptyIndex % SIZE];
    const [tileRow, tileCol] = [Math.floor(index / SIZE), index % SIZE];

    // Check if the move is valid
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
    setShowPuzzleGame(false); // Hide puzzle game when going to start screen
  };

  return (
    <>
     {showStartScreen ? (
        <Snake />
      ) :(
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
      </div>
      <div className="footer">
            <FontAwesomeIcon icon={faCopyright} className="fa-icon" /> Created by
            <FontAwesomeIcon icon={faUserCircle} className="fa-icon" /> Vatan Mishra
          </div>
    </div>
      )
    }
    </>  
  );
};

export default Puzzle;
