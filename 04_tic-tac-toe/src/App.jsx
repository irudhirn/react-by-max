import { useState } from "react";

import Player from "./components/Player";
import GameBoard from "./components/GameBoard";
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./WINNING_COMBINATIONS";
import GameOver from "./components/GameOver";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveCurrentPlayer(gameTurns){
  let curPlayer = "X";
  
  if(gameTurns.length > 0 && gameTurns[0].player === "X"){
    curPlayer = "O";
  }  

  return curPlayer;
}

function deriveGameBoard(gameTurns){
    // let gameBoard = initialGameBoard;
    let gameBoard = [...initialGameBoard.map((arr) => [...arr])];

    for (const turn of gameTurns) {
      const { square, player } = turn;
      const { row, col } = square;
  
      gameBoard[row][col] = player;
    }

    return gameBoard;
}

function deriveWinner(gameBoard, players){
  let winner;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];
    
    if(firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol){
      // winner = firstSquareSymbol;
      winner = players[firstSquareSymbol];
    }
  }

  return winner;
}

function App() {
  const [players, setPlayers] = useState({
    'X': "Player 1",
    'O': "Player 2"
  });
  const [gameTurns, setGameTurns] = useState([]);
  // const [activePlayer, setActivePlayer] = useState("X");

  const curPlayer = deriveCurrentPlayer(gameTurns);

  const gameBoard = deriveGameBoard(gameTurns);

  const winner = deriveWinner(gameBoard, players);
  
  function handleSelectSquare(rowIndex, colIndex){
    // setActivePlayer((curPlayer) => curPlayer === "X" ? "O" : "X");
    
    setGameTurns(prev => {
      // let curPlayer = "X";
      
      // if(prev.length > 0 && prev[0].player === "X"){
      //   curPlayer = "O";
      // }
      const curPlayer = deriveCurrentPlayer(prev);

      const updatedTurns = [{ square: { row: rowIndex, col: colIndex }, player: curPlayer }, ...prev];

      return updatedTurns;
    });
  }

  const hasDraw = gameTurns.length === 9 && !winner;

  function handleRestart(){
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName){
    setPlayers((prev) => ({...prev, [symbol]: newName}));
  }
  
  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          {/* <Player initialName="Player 1" symbol="X" isActive={activePlayer === "X"} />
          <Player initialName="Player 2" symbol="O" isActive={activePlayer === "O"} /> */}
          <Player initialName="Player 1" symbol="X" isActive={curPlayer === "X"} onChangeName={handlePlayerNameChange} />
          <Player initialName="Player 2" symbol="O" isActive={curPlayer === "O"} onChangeName={handlePlayerNameChange} />
        </ol>
        {(hasDraw || winner) && <GameOver winner={winner} onRestart={handleRestart} />}
        {/* <GameBoard onSelectSquare={handleSelectSquare} activePlayerSymbol={activePlayer} /> */}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>

      <Log turns={gameTurns} />
    </main>
  )
}

export default App
