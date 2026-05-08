import { useState } from "react";


export default function useStack() {
    const [stack, setStack] = useState([]);
    const push = (item) => {
        setStack((prevStack) => [...prevStack, item]);
    };
    const pop = () => {
        setStack((prevStack) => {
            const newStack = [...prevStack];
            newStack.pop();
            return newStack;
        });
    };

    return { push, pop, data: stack }
}
