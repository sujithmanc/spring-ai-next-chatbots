'use client'

import { useEffect, useState } from 'react'

export default function Timer() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const formatTime = (total) => {
    const mins = Math.floor(total / 60)
    const secs = total % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  useEffect(() => {
    let interval
    if (isRunning) interval = setInterval(() => setSeconds(p => p + 1), 1000)
    return () => clearInterval(interval)
  }, [isRunning])

  return (

    <button onClick={() => setIsRunning(p => !p)}
      className="btn btn-ghost text-xl">
      <pre>
        {isRunning ? formatTime(seconds) : 'Start'}
      </pre>
    </button>

  )
}
