"use client";

import { useEffect, useState } from "react";

export default function Timer() {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    // Format time -> mm:ss
    const formatTime = (totalSeconds) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;

        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    useEffect(() => {
        let interval;

        if (isRunning) {
            interval = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning]);

    const handleStartPause = () => {
        setIsRunning((prev) => !prev);
    };

    const handleReset = () => {
        setIsRunning(false);
        setSeconds(0);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-900 text-white rounded-2xl p-6 shadow-lg">
            <h1 className="text-4xl font-bold mb-6">
                {formatTime(seconds)}
            </h1>

            <div className="flex gap-4">
                <button
                    onClick={handleStartPause}
                    className="px-5 py-2 rounded-xl bg-green-500 hover:bg-green-600 transition"
                >
                    {isRunning ? "Pause" : "Start"}
                </button>

                <button
                    onClick={handleReset}
                    className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}