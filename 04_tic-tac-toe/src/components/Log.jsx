import React from 'react'

const Log = ({ turns }) => {
  return (
    <ul id="log">
      {turns.map((turn) => <li key={`${turn.square.row}${turn.square.col}`}>{turn.player} selected {turn.square.row}, {turn.square.col}</li>)}
    </ul>
  )
}

export default Log