import React from 'react'

const Input = ({ id, label, error, ...props }) => {
  return (
    <div className="control no-margin">
      <label htmlFor="email">{label}</label>
      <input id={id} {...props} />
      {error && <div className="control-error"><p>{error}</p></div>}
    </div>
  )
}

export default Input