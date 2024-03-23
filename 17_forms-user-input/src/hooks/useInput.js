import React, { useState } from 'react'

export default function useInput(defaultValue, validationFn) {
  const [enteredValue, setEnteredValue] = useState(defaultValue);
  const [didEdit, setDidEdit] = useState(false);

  const valueIsValid = validationFn(enteredValue);

  const handleInputChange = (e) => {
    setEnteredValue(e.target.value);
    setDidEdit(false);
  }

  const handleInputBlur = () => setDidEdit(true);

  return { 
    value: enteredValue,
    handleInputChange,
    handleInputBlur,
    hasError: !valueIsValid && didEdit
   }
}
