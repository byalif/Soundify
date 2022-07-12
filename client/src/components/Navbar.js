import React, { useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { useGlobalContext } from "../context";

const Navbar = () => {
  useEffect(() => {
    getUser();
  }, []);
  const {
    toggle,
    setId,
    username,
    setUsername,
    setToggle,
    getUser,
    setLoggedIn,
    loggedIn,
  } = useGlobalContext();

  return (
    <div
      style={{ backgroundColor: `${!toggle ? "#e3e3e3" : "#333b45"}` }}
      className="nav-cont"
    >
      <div
        style={{ color: `${toggle ? "white" : "black"}` }}
        className="navbar"
      >
        <div className="left">
          <Link
            style={{ color: `${toggle ? "white" : "black"}` }}
            className="Link"
            to="/"
          >
            Home
          </Link>

          <Link
            style={{ color: `${toggle ? "white" : "black"}` }}
            className="Link"
            to="/playlist"
          >
            Playlists
          </Link>
          <Link
            style={{ color: `${toggle ? "white" : "black"}` }}
            className="Link"
            to="/register"
          >
            Register
          </Link>
        </div>
        <div className="right">
          {toggle ? (
            <FontAwesomeIcon
              onClick={() => {
                setToggle(!toggle);
              }}
              className="toggle"
              icon={faToggleOn}
            />
          ) : (
            <FontAwesomeIcon
              onClick={() => {
                setToggle(!toggle);
              }}
              className="toggle"
              icon={faToggleOff}
            />
          )}
          <Link
            style={{ color: `${toggle ? "white" : "black"}` }}
            className="Link"
            to="/post"
          >
            Upload
          </Link>
          {loggedIn ? (
            <a
              onClick={() => {
                setTimeout(() => {
                  window.location.reload();
                  setLoggedIn(false);
                  localStorage.removeItem("username");
                  localStorage.setItem("loggedIn", false);
                  localStorage.removeItem("accessToken");
                }, 300);
              }}
              style={{
                cursor: "pointer",
                color: `${toggle ? "white" : "black"}`,
              }}
              className="Link"
            >
              Sign out
            </a>
          ) : (
            <Link
              style={{ color: `${toggle ? "white" : "black"}` }}
              className="Link"
              to="/login"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
