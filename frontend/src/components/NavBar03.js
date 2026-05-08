"use client"; // Required for Next.js App Router

import { useState, useEffect } from "react";

const NavBar03 = () => {
  // 1. State for the current theme
  const [theme, setTheme] = useState("light");

  // 2. List of available DaisyUI themes
  const daisyUIThemes = [
    "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", 
    "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", 
    "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", 
    "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", 
    "night", "coffee", "winter", "dim", "nord", "sunset"
  ];

  // 3. Effect to apply the theme to the HTML tag whenever state changes
  useEffect(() => {
    document.querySelector("html").setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme); // Save preference
  }, [theme]);

  // 4. Load saved theme from local storage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      
      {/* Navbar Start */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li><a>Item 1</a></li>
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li><a>Submenu 1</a></li>
                <li><a>Submenu 2</a></li>
              </ul>
            </li>
            <li><a>Item 3</a></li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a>Item 1</a></li>
          <li>
            <details>
              <summary>Parent</summary>
              <ul className="p-2">
                <li><a>Submenu 1</a></li>
                <li><a>Submenu 2</a></li>
              </ul>
            </details>
          </li>
          <li><a>Item 3</a></li>
        </ul>
      </div>

      {/* Navbar End - Theme Changer */}
      <div className="navbar-end">
        <select 
          className="select select-bordered w-full max-w-xs" 
          value={theme} 
          onChange={handleThemeChange}
        >
          <option disabled value="">Select Theme</option>
          {daisyUIThemes.map((themeName) => (
            <option key={themeName} value={themeName}>
              {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default NavBar03;