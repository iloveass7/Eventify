import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, LogOut } from 'lucide-react';
import '../App.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const isUserLoggedIn = localStorage.getItem('token') || localStorage.getItem('userData');
  const isAdminLoggedIn = localStorage.getItem('adminToken');
  const userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('adminToken');
    clearCart();
    navigate('/login');
    window.location.reload();
  };

  const dispatchSidebarToggle = (open) => {
    window.dispatchEvent(new CustomEvent('toggleSidebars', { detail: open }));
  };
  return (
    <>
      <nav className="bg-green-900 text-white shadow-md sticky top-0 z-50 w-full">
        {/* symmetrical side padding on all sizes; scales up on md/lg */}
        <div className="max-w-8xl mx-auto px-6 md:px-20 lg:px-30 py-4 flex items-center">
          {/* left: logo */}
          <div className="flex-1 flex justify-start">
            <Link to="/" aria-label="Home">
              {/* remove mx-10 to avoid asymmetric left-only spacing */}
              <img src="logo.png" alt="MyLogo" className="h-15 sm:h-20" />
            </Link>
          </div>

          {/* center: desktop links */}
          <ul className="hidden md:flex flex-10 justify-center gap-10 text-[1.6rem] font-semibold md:text-[1.3rem] lg:text-[1.5rem]">
            <li><Link to="/" className="hover:text-yellow-500">Home</Link></li>
            <li><Link to="/blogs" className="hover:text-yellow-500">Blogs</Link></li>
            <li><Link to="/about-us" className="hover:text-yellow-500">About</Link></li>
            <li>
              {isAdminLoggedIn ? (
                <Link to="/admin" className="hover:text-yellow-500">Admin Profile</Link>
              ) : isUserLoggedIn ? (
                <Link to="/profile" className="hover:text-yellow-500">{userData?.name || 'Profile'}</Link>
              ) : (
                <Link to="/login" className="hover:text-yellow-500">Login</Link>
              )}
            </li>
          </ul>

          {/* right: actions */}
          <div className="flex-1 flex justify-end items-center gap-6 md:gap-6 lg:gap-10">
            <button
              onClick={() => { setSearchOpen(true); dispatchSidebarToggle(true); }}
              title="Search"
              className="hover:text-yellow-500"
            >
              <Search size={31} />
            </button>

            {(isUserLoggedIn || isAdminLoggedIn) && (
              <button onClick={handleLogout} className="hover:text-red-500" title="Logout">
                <LogOut size={31} />
              </button>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
              {menuOpen ? <X size={31} /> : <Menu size={31} />}
            </button>
          </div>
        </div>

        {/* mobile dropdown — match the same side padding as the bar above */}
        {menuOpen && (
          <div className="md:hidden px-6 pt-8 pb-10 bg-green-900">
            <ul className="flex flex-col gap-6 text-2xl font-semibold">
              <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
              <li><Link to="/blogs" onClick={() => setMenuOpen(false)}>Blogs</Link></li>
              <li><Link to="/about-us" onClick={() => setMenuOpen(false)}>About Us</Link></li>
              <li>
                {isAdminLoggedIn ? (
                  <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Profile</Link>
                ) : isUserLoggedIn ? (
                  <Link to="/profile" onClick={() => setMenuOpen(false)}>{userData?.name || 'Profile'}</Link>
                ) : (
                  <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;