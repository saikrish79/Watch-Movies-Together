import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUserStore } from "../store/store";

const NavBar = (props) => {
  const user = useUserStore((state) => state.user);
  const location = useLocation();
  //console.log(location.pathname);

  const calculateLinkClasses = (loc) => {
    if (loc === "room" && location.pathname.includes("room"))
      return "nav-link active text-light";
    if (loc === "home" && location.pathname.includes("home"))
      return "nav-link active text-light";
    if (loc === "howto" && location.pathname.includes("howto"))
      return "nav-link active text-light";
    return "nav-link";
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/home">
            LetzWMT
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <Link
                className={calculateLinkClasses()}
                aria-current="page"
                to="/home"
              >
                Home
              </Link>
              <Link className={calculateLinkClasses()} to="/room">
                Room
              </Link>
              <Link
                className={calculateLinkClasses()}
                aria-current="page"
                to="/howto"
              >
                How to's
              </Link>
            </div>
          </div>
          {user.isAuthenticated && (
            <Link to="/userPage">Hello, {user.name} </Link>
          )}
          {!user.isAuthenticated && !location.pathname.includes("room") ? (
            <>
              <Link className="m-2 text-light" to="/userPage">
                {user.name}
              </Link>
            </>
          ) : (
            <>
              <p className="m-2 text-light">{user.name}</p>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
