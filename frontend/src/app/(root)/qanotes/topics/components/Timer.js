'use client'

import { useEffect, useState } from 'react'

export default function Timer() {
  const [seconds, setSeconds]   = useState(0)
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
    <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-900 text-white rounded-2xl p-6 shadow-lg">
      <h1 className="text-4xl font-bold mb-6">{formatTime(seconds)}</h1>
      <div className="flex gap-4">
        <button onClick={() => setIsRunning(p => !p)}
          className="px-5 py-2 rounded-xl bg-green-500 hover:bg-green-600 transition">
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button onClick={() => { setIsRunning(false); setSeconds(0) }}
          className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition">
          Reset
        </button>
      </div>
    </div>
  )
}
