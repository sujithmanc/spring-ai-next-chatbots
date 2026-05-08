"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { bgColorSets } from "../util.js/colors";

export default function FlipCard({ question, answer }) {
    const [flipped, setFlipped] = useState(false);

    function handleDoubleClick() {
        setFlipped((prev) => !prev);
    }

    const randomSet = bgColorSets[Math.floor(Math.random() * bgColorSets.length)];
    //const colorSet = bgColorSets[index % bgColorSets.length];
    randomSet.question = `bg-gradient-to-br from-gray-800 to-black text-white`;

    const cardSize = `absolute inset-0 flex flex-col items-center justify-center rounded-2xl shadow-xl [backface-visibility:hidden] px-6`;

    return (
        <div
            className="[perspective:1200px] w-80 h-56 cursor-pointer select-none"
            // onDoubleClick={handleDoubleClick}
            onClick={handleDoubleClick}
            title="Double-click to flip"
        >
            <motion.div
                className="relative w-full h-full"
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front Side - Question */}
                <div
                    className={`${cardSize} ${randomSet.question}`}
                >
                    {/* <span className="badge badge-primary mb-4">Question</span> */}
                    <span className="mb-4">Question</span>
                    <p className="text-xl font-semibold text-center">{question}</p>
                    <p className="text-xs text-base-content/50 mt-6">Double-click to reveal answer</p>
                </div>

                {/* Back Side - Answer */}
                <div
                    className={`${cardSize} ${randomSet.answer}`}
                    style={{ transform: "rotateY(180deg)" }}
                >
                    {/* <span className="badge badge-success mb-4">Answer</span> */}
                    <span className="mb-4">Answer</span>
                    <p className="text-xl font-semibold text-center">{answer}</p>
                    <p className="text-xs text-base-content/50 mt-6">Double-click to go back</p>
                </div>
            </motion.div>
        </div>
    );
}