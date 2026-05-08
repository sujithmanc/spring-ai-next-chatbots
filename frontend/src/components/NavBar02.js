export default function NavBar02() {
  return (
    // 1. STICKY HEADER: 'sticky top-0 z-50' keeps it at the top
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      
      {/* NAVBAR START: Hamburger + Logo */}
      <div className="navbar-start">
        
        {/* MOBILE DROPDOWN (Hamburger) */}
        {/* 'lg:hidden' ensures this only shows on mobile */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
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
        
        {/* LOGO */}
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>

      {/* NAVBAR CENTER: Horizontal Menu */}
      {/* 'hidden lg:flex' ensures this hides on mobile and shows on large screens */}
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
    </div>
  );
};