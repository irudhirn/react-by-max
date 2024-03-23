import React, { useState } from 'react';

export default function Player({initialName, symbol, isActive, onChangeName}) {
  const [playerName, setPlayerName] = useState(initialName);
  const [isEditing, setIsEditing] = useState(false);

  function handleEditClick(){
    setIsEditing((prev) => !prev);

    if(isEditing) onChangeName(symbol, playerName);
  }

  return (
    <li className={isActive ? "active" : null}>
      <span className="player">
        {!isEditing && ( <span className="player-name">{playerName}</span> )}
        {isEditing && ( <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)} /> )}
        <span className="player-symbol">{symbol}</span>
      </span>
      <button onClick={handleEditClick}>{!isEditing ? "Edit" : "Save"}</button>
    </li>
  )
}
