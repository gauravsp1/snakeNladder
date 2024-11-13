import React, { useEffect, useState } from "react";
import "./Board.css";

function Board() {
  const [numPlayers, setNumPlayers] = useState(2);
  const [positions, setPositions] = useState(Array(numPlayers).fill(1));
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [message, setMessage] = useState("");
  const [dice, setDice] = useState(null);
  const [endGame, setEndGame] = useState(false);

  const snakesAndLadders = {
    snakes: { 17: 7, 54: 34, 62: 19, 98: 79 },
    ladders: { 3: 22, 5: 8, 20: 29, 27: 51, 45: 75, 70: 91, 79: 99 },
  };
  const checkWin = () => {
    for (let i = 0; i < positions.length; i++) {
      if (positions[i] >= 100) {
        setMessage(`Player ${i + 1} wins!`);
        return true;
      }
    }

    return false;
  };

  const handleRoll = () => {
    const rollDice = Math.floor(Math.random() * 6) + 1;

    setDice(rollDice);

    if (positions[currentPlayer] === 1 && rollDice !== 6) {
      setCurrentPlayer((prevTurn) => (prevTurn + 1) % numPlayers);
      return;
    }

    let newPosition = positions[currentPlayer] + rollDice;
    let newPositions = [...positions];

    if (newPosition >= 100) {
      newPosition = 100;
      setMessage(`Player ${currentPlayer + 1} wins!`);
    }

    if (newPosition in snakesAndLadders.snakes) {
      newPosition = snakesAndLadders.snakes[newPosition];
    } else if (newPosition in snakesAndLadders.ladders) {
      newPosition = snakesAndLadders.ladders[newPosition];
    }
    newPositions[currentPlayer] = newPosition;

    setPositions(newPositions);
    setCurrentPlayer((prevTurn) => (prevTurn + 1) % numPlayers);
  };

  const handleNumPlayersChange = (e) => {
    const num = Number(e.target.value);
    setNumPlayers(num);
    setPositions(Array(num).fill(1));
    setCurrentPlayer(0);
    setMessage("");
  };

  const displayBox = () => {
    const cells = [];
    let number = 100;

    for (let row = 0; row < 10; row++) {
      const rowCells = [];

      for (let col = 0; col < 10; col++) {
        const isSnake = Object.keys(snakesAndLadders.snakes).includes(
          number.toString()
        );
        const isLadder = Object.keys(snakesAndLadders.ladders).includes(
          number.toString()
        );
        rowCells.push(
          <div key={number} className="boxes">
            <div className="main-box">
              <div className="box-number"> {number}</div>
              <div className="snake-ladder">
                {`${isSnake ? "S" : isLadder ? "L" : ""}`}
              </div>
              <div className="player-container">
                {positions.map((player, index) => {
                  return (
                    player === number && (
                      <div className="player">{`P${index + 1}`}</div>
                    )
                  );
                })}
              </div>
            </div>
          </div>
        );
        number--;
      }

      if (row % 2 === 1) rowCells.reverse();
      cells.push(
        <div key={row} className="row">
          {rowCells}
        </div>
      );
    }
    return cells;
  };

  useEffect(() => {
    const value = checkWin();
    setEndGame(value);
  }, [positions]);

  return (
    <div className="main-container">
      <div>Snake and Ladder</div>
      <label>
        Number of Players:
        <select onChange={handleNumPlayersChange} value={numPlayers}>
          {[...Array(5)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </label>
      <div className="controls">
        <p>Turn: Player {currentPlayer + 1}</p>
        <button
          onClick={() => {
            if (!endGame) {
              handleRoll();
            }
          }}
        >
          Role Dice
        </button>
        <p>Dice Roll: {dice}</p>
        <p>{message}</p>
      </div>

      <div className="board">{displayBox()}</div>
    </div>
  );
}

export default Board;
