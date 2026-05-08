"use client";
import { useState } from "react";
import useStack from "./useStack";

export default function StackUI({ myAct }) {
    const { push, pop, data } = useStack();
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
        myAct();
    };

    return (
        <div>
            <h2>Stack UI</h2>
            <input type="text" placeholder="Enter item to push" value={inputValue} onChange={handleInputChange} />
            <button className="btn btn-primary" onClick={() => push(inputValue)}>
                Push Item
            </button>
            <button className="btn btn-secondary" onClick={pop}>
                Pop Item
            </button>
            <ul>
                {data.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
}