import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";

import { FiUser, FiLogOut } from "react-icons/fi";

import toast from "react-hot-toast";
import useAuth from "../../Hooks/useAuth";
import Toggle from "./Toggle";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    logOut()
      .then(() => {
        toast.success("Logged out successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to log out");
      });
  };

  // LINKS (for desktop - horizontal)
  const desktopLinks = (
    <>
      <li>
        <NavLink to="/" className={({ isActive }) => (isActive ? "font-bold underline underline-offset-2 text-gray-800" : "")}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/courses" className={({ isActive }) => (isActive ? "font-bold underline underline-offset-2 text-gray-800" : "")}>
          Courses
        </NavLink>
      </li>
      <li>
        <NavLink to="/teachers" className={({ isActive }) => (isActive ? "font-bold underline underline-offset-2 text-gray-800" : "")}>
          Teachers
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "font-bold underline underline-offset-2 text-gray-800" : "")}>
          Dashboard
        </NavLink>
      </li>
      <li>
        <NavLink to="/contract" className={({ isActive }) => (isActive ? "font-bold underline underline-offset-2 text-gray-800" : "")}>
          Contract
        </NavLink>
      </li>
    </>
  );

  // LINKS (for mobile/tablet dropdown - vertical)
  

  return (
    <div
      className={`navbar sticky top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/200 backdrop-blur-md shadow-md" : "bg-gradient-to-br from-cyan-400 via-cyan-400 to-cyan-500"
      }`}
    >
      {/* Left side - Mobile Menu */}
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            {desktopLinks}
            <div className="mt-2">
              <Toggle checked={theme === "light"} onChange={toggleTheme} />
            </div>
            {user ? (
              <li>
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:bg-red-50">
                  <FiLogOut /> Log Out
                </button>
              </li>
            ) : (
              <li>
                <Link to="/login" className="btn bg-[#D9A299] text-white">
                  Log In
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{desktopLinks}</ul>
      </div>

      {/* Right side - Theme toggle & User */}
      <div className="navbar-end hidden lg:flex items-center gap-3">
        <Toggle checked={theme === "light"} onChange={toggleTheme} />
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-8 rounded-full ring ring-[#D9A299] ring-offset-1">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User Avatar" />
                ) : (
                  <div className="bg-gray-400 text-white flex items-center justify-center w-full h-full rounded-full text-lg font-semibold select-none">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-100 shadow-lg rounded-box w-64 mt-4 p-2 z-10"
            >
              <li className="px-2 py-2">
                <p className="font-bold text-sm">{user.displayName || "User"}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </li>
              <div className="divider my-1"></div>
              <li>
                <Link to="/main-dashboard" className="flex items-center gap-2">
                  <FiUser /> Dashboard
                </Link>
              </li>
              <div className="divider my-1"></div>
              <li>
                <button onClick={handleLogout} className="flex items-center gap-2 w-full text-left text-red-500 hover:bg-red-50">
                  <FiLogOut /> Log Out
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn text-base-100 bg-[#D9A299] hover:bg-[#c7938a]">
            Log In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
