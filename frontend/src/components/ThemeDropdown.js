"use client"

import { daisyUIThemes } from "@/util/themes";
import { useEffect, useState } from "react";

export default function ThemeDropdown() {

    const [theme, setTheme] = useState("light");



    useEffect(() => {
        document.querySelector("html").setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    return (

        <div className="dropdown dropdown-end">
            {/* THE TRIGGER BUTTON */}
            <div tabIndex={0} role="button" className="btn btn-ghost m-1">
                Theme
                <svg width="12px" height="12px" className="h-2 w-2 fill-current opacity-60 inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path></svg>
            </div>

            {/* THE DROPDOWN LIST */}
            <ul tabIndex={0} className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52 h-96 overflow-y-auto">
                {daisyUIThemes.map((themeName) => (
                    <li key={themeName}>
                        <input
                            type="radio"
                            name="theme-dropdown"
                            className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                            aria-label={themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                            value={themeName}
                            onChange={() => setTheme(themeName)}
                            checked={theme === themeName}
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}