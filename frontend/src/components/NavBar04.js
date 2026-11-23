"use client";

import { usePathname } from "next/navigation";
import NavLinks from "./navs/NavLinks";
import Timer from "./Timer";
import ThemeDropdown from "./ThemeDropdown";

const NavBar04 = () => {
  const pathname = usePathname();
  const isChatbotPage = pathname === "/chatbot";

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
            <NavLinks />
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">SujiMX</a>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <NavLinks />
        </ul>
      </div>
      <div className="navbar-end">
        {isChatbotPage && (
          <button
            type="button"
            className="btn btn-primary btn-sm mr-2"
            onClick={() => window.dispatchEvent(new Event("chat:add"))}
          >
            Add Chat
          </button>
        )}
        <Timer />
        <ThemeDropdown />
      </div>
    </div>
  );
};

export default NavBar04;