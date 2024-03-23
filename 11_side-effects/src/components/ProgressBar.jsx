import React, { useEffect, useState } from 'react';

let TIMER = 3000;

export default function ProgressBar() {
  const [remainingTime, setRemainingTime] = useState(TIMER);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => prev - 10);
    }, 10);

    return () => clearInterval(interval);
  }, []);

  return (
    <progress value={remainingTime} max={TIMER} />
  )
}
