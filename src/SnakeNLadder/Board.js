import React, { useEffect, useState } from "react";
import "./Board.css";

function Board() {
  const [numPlayers, setNumPlayers] = useState(2);
  const [positions, setPositions] = useState(Array(numPlayers).fill(0));
  const [turn, setTurn] = useState(0);
  const [message, setMessage] = useState("");
  const [dice, setDice] = useState(null);
  const [endGame, setEndGame] = useState(false);

  const snakesAndLadders = {
    snakes: { 17: 7, 54: 34, 62: 19, 98: 79 },
    ladders: { 3: 22, 5: 8, 20: 29, 27: 1, 45: 75, 70: 91, 79: 99 },
  };
  const checkWin = () => {
    if (positions[turn] >= 99) {
      setMessage(`Player ${turn + 1} wins!`);
      return true;
    }
    return false;
  };

  const handleRoll = () => {
    const rollDice = Math.floor(Math.random() * 6) + 1;
    setDice(rollDice);

    let newPosition = positions[turn] + rollDice;
    let newPositions = [...positions];

    if (newPosition >= 100) {
      newPosition = 100;
    }

    if (newPosition in snakesAndLadders.snakes) {
      newPosition = snakesAndLadders.snakes[newPosition];
    } else if (newPosition in snakesAndLadders.ladders) {
      newPosition = snakesAndLadders.ladders[newPosition];
    }
    newPositions[turn] = newPosition;
    setPositions(newPositions);
    setTurn((prevTurn) => (prevTurn + 1) % numPlayers);
  };

  const handleNumPlayersChange = (e) => {
    const num = Number(e.target.value);
    setNumPlayers(num);
    setPositions(Array(num).fill(0));
    setTurn(0);
    setMessage("");
  };

  const displayBox = (indexValue) => {
    const cellNum = 100 - indexValue;
    const isSnake = Object.keys(snakesAndLadders.snakes).includes(
      indexValue.toString()
    );
    const isLadder = Object.keys(snakesAndLadders.ladders).includes(
      indexValue.toString()
    );

    return (
      <div className="main-box">
        <div className="box-number"> {cellNum}</div>
        <div className="snake-ladder">
          {`${isSnake ? "S" : isLadder ? "L" : ""}`}
        </div>
        <div className="player-container">
          {positions.map((player, index) => {
            return (
              player === cellNum - 1 && (
                <div className="player">{`P${index + 1}`}</div>
              )
            );
          })}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const value = checkWin();
    setEndGame(value);
  }, [dice]);

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
        <p>Turn: Player {turn + 1}</p>
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
      <div className="board">
        {[...Array(100)].map((_, index) => {
          return positions.map(
            (pos, idx) =>
              pos === index + 1 && <div key={idx}>{`P${idx + 1}`}</div>
          );
        })}
      </div>
      <div className="board">
        {[...Array(100)].map((_, index) => {
          return (
            <div key={index} className="boxes">
              {displayBox(index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Board;
