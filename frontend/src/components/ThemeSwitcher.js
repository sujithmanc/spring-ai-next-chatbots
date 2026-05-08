"use client"; // if you're in Next.js 13+ with app router

import { useState } from "react";
import { daisyUIThemes } from "../util/themes";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("light");

  const handleThemeChange = (e) => {
    console.info("Changing theme to:", e.target.value);
    const newTheme = e.target.value;
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <select
      className="select select-bordered w-full max-w-xs"
      value={theme}
      onChange={handleThemeChange}
    >
      {daisyUIThemes.map((themeName) => (
        <option key={themeName} value={themeName}>
          {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
        </option>
      ))}

    </select>
  );
}