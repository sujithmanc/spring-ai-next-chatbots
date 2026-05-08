"use client";

import { useState, useEffect } from "react";

const NavBar04 = () => {
  const [theme, setTheme] = useState("light");

  const daisyUIThemes = [
    "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", 
    "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", 
    "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", 
    "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", 
    "night", "coffee", "winter", "dim", "nord", "sunset"
  ];

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

      {/* Navbar End - THEME DROPDOWN */}
      <div className="navbar-end">
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
      </div>
      
    </div>
  );
};

export default NavBar04;