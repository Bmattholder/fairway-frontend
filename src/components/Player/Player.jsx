import React, { useEffect, useState } from "react";
import axios from "axios";
import { playerActions } from "../../store/slices/playerSlice";
import { useDispatch, useSelector } from "react-redux";

import "./Player.css";

function Player(props) {
  const dispatch = useDispatch();
  const playerList = useSelector((state) => state.players.playerList);

  const [name, setName] = useState("");
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [editName, setEditName] = useState("");
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [editScoreId, setEditScoreId] = useState(null);
  const [updatedScore, setUpdatedScore] = useState("");

  useEffect(() => {
    const getPlayers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/players");
        const updatedPlayers = res.data.map((player) => {
          const scores = Array.isArray(player.scores)
            ? player.scores
            : JSON.parse(player.scores);
          return {
            ...player,
            scores,
          };
        });
        dispatch(playerActions.setPlayer(updatedPlayers));
      } catch (error) {
        console.log(error);
      }
    };
    getPlayers();
  }, [dispatch]);

  const addPlayer = async (e) => {
    e.preventDefault();
    if (name.trim() === "") {
      return;
    }

    try {
      const newScores = Array(18).fill("-");
      const newPlayer = {
        player: {
          name: name,
          scores: newScores,
          scorecard_id: 1,
        },
      };

      const res = await axios.post("http://localhost:5000/players", newPlayer);
      const updatedPlayer = { ...res.data, scores: newScores };
      dispatch(playerActions.setPlayer([...playerList, updatedPlayer]));
      setName("");
      setShowAddPlayer(false);
    } catch (error) {
      console.log(error);
    }
  };

  const editPlayer = (playerId, currentName) => {
    setEditingPlayerId(playerId);
    setEditName(currentName);
  };

  const updatePlayer = async (playerId) => {
    try {
      const updatedPlayer = {
        player: {
          name: editName,
        },
      };

      await axios.patch(
        `http://localhost:5000/players/${playerId}`,
        updatedPlayer
      );

      const updatedPlayers = playerList.map((player) =>
        player.id === playerId ? { ...player, name: editName } : player
      );
      dispatch(playerActions.setPlayer(updatedPlayers));
      setEditingPlayerId(null);
      setEditName("");
    } catch (error) {
      console.log(error);
    }
  };

  const deletePlayer = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/players/${id}`);

      const updatedPlayers = playerList.filter((player) => player.id !== id);
      dispatch(playerActions.setPlayer(updatedPlayers));
    } catch (error) {
      console.log(error);
    }
  };

  const startEditingScore = (playerId, scoreId) => {
    setEditScoreId({ playerId, scoreId });
    setUpdatedScore(
      playerList
        .find((player) => player.id === playerId)
        .scores[scoreId].toString()
    );
  };

  const updateScore = async (playerId, scoreId) => {
    try {
      const updatedScores = playerList
        .find((player) => player.id === playerId)
        .scores.map((score, index) =>
          index === scoreId ? Number(updatedScore) : score
        );

      if (updatedScores.includes(NaN)) {
        return;
      }

      const updatedPlayer = {
        player: {
          scores: updatedScores,
        },
      };

      await axios.patch(
        `http://localhost:5000/players/${playerId}`,
        updatedPlayer
      );

      const updatedPlayers = playerList.map((player) =>
        player.id === playerId ? { ...player, scores: updatedScores } : player
      );
      dispatch(playerActions.setPlayer(updatedPlayers));
      setEditScoreId(null);
      setUpdatedScore("");
    } catch (error) {
      console.log(error);
    }
  };

  const calculateTotalScore = (scores) => {
    const filteredScores = scores.filter((score) => score !== "-");
    const totalScore = filteredScores.reduce(
      (sum, score) => sum + Number(score),
      0
    );
    return totalScore;
  };

  const getLowestScorePlayerId = () => {
    let lowestScore = Infinity;
    let lowestScorePlayerId = null;

    playerList.forEach((player) => {
      const totalScore = calculateTotalScore(player.scores);
      if (totalScore < lowestScore) {
        lowestScore = totalScore;
        lowestScorePlayerId = player.id;
      }
    });

    return lowestScorePlayerId;
  };

  return (
    <div className="players-container">
      {playerList.map((player) => {
        const totalScore = calculateTotalScore(player.scores);
        const lowestScorePlayerId = getLowestScorePlayerId();

        return (
          <div key={player.id}>
            <div className="player-row">
              <div className="player-name-container">
                <p>
                  {editingPlayerId === player.id ? (
                    <>
                      <button
                        className="delete-button"
                        onClick={() => deletePlayer(player.id)}
                      >
                        X
                      </button>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                      <button
                        onClick={() => updatePlayer(player.id)}
                        className="save-edit-name-button"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <span
                      className="editable-name"
                      onClick={() => editPlayer(player.id, player.name)}
                    >
                      {player.name}
                    </span>
                  )}
                </p>
              </div>
              <div className="scores-container">
                {Array.isArray(player.scores) &&
                  player.scores.map((score, scoreIndex) => (
                    <span
                      key={scoreIndex}
                      className={`score-item ${
                        editScoreId?.playerId === player.id &&
                        editScoreId?.scoreId === scoreIndex
                          ? "edit-mode"
                          : ""
                      }`}
                      onClick={() => startEditingScore(player.id, scoreIndex)}
                    >
                      {editScoreId?.playerId === player.id &&
                      editScoreId?.scoreId === scoreIndex ? (
                        <>
                          <form
                            onSubmit={addPlayer}
                            className="edit-score-form"
                          >
                            <input
                              type="number"
                              min="1"
                              max="20"
                              value={updatedScore}
                              onChange={(e) => setUpdatedScore(e.target.value)}
                              className="number-edit"
                              required
                            />
                            <button
                              onClick={() => updateScore(player.id, scoreIndex)}
                              className="check-button"
                            >
                              ✅
                            </button>
                          </form>
                        </>
                      ) : (
                        score
                      )}
                    </span>
                  ))}
                <div
                  className={`score-item ${
                    player.id === lowestScorePlayerId ? "lowest-score" : ""
                  }`}
                >
                  {totalScore}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {showAddPlayer ? (
        <div className="add-player">
          <form>
            <div className="input-container">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="player-name-input"
                minLength="1"
                required
              />
              <div className="buttons-container">
                <button onClick={addPlayer} className="add-player-button">
                  Add
                </button>
                <button
                  onClick={() => setShowAddPlayer(false)}
                  className="cancel-add-player"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <button className="add-button" onClick={() => setShowAddPlayer(true)}>
          +
        </button>
      )}
    </div>
  );
}
export default Player;
