import React, { useState } from 'react';

export default function GameBoard({ board, onSelectSquare }) {
  // const [gameBoard, setGameBoard] = useState(initialGameBoard);

  // function handleSelectSquare(rowIndex, colIndex){
  //   setGameBoard((prevGameBoard) => {
  //     const updatedBoard = [...prevGameBoard.map((innerArray) => [...innerArray])]
  //     updatedBoard[rowIndex][colIndex] = activePlayerSymbol;
  //     return updatedBoard;
  //   });

  //   onSelectSquare();
  // }



  return (
    <ol id="game-board">
      {board.map((row, i) => <li key={i}>
        <ol>
          {/* {row.map((playerSymbol, j) => <li key={j}><button onClick={() => handleSelectSquare(i, j)}>{playerSymbol}</button></li>)} */}
          {row.map((playerSymbol, j) => <li key={j}><button onClick={() => onSelectSquare(i,j)} disabled={playerSymbol !== null}>{playerSymbol}</button></li>)}
        </ol>
      </li>)}
    </ol>
  )
}
