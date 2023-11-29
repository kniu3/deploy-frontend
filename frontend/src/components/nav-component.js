import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

const NavComponent = (prop) => {
  let [userInput, setUserInput] = useState("");
  let { currentUser,setCurrentUser } = prop;
  
  const navigator = useNavigate();

  const handleChangeUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const handleSearch = () => {
    navigator("/search-result", { state: { userInput: userInput } });
    setUserInput("");
    //if user already in search-result page, then refresh the page
    if (window.location.pathname === "/search-result") {
      window.location.reload();
    };
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    navigator("/");
    window.location.reload();
  }

  return (
    <nav
      className="navbar navbar-expand-lg bg-body-tertiary mw-100"
      style={{
        color: "#fafbfc",
        minHeight: "10vh",
        border: "0.5px solid #edece8",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Onlin3 Bookstor3
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse"
          id="navbarNav"
          style={{ justifyContent: "flex-end" }}
        >
          <ul
            className="navbar-nav"
            style={{ fontSize: "1.5rem", margin: "0rem 10rem" }}
          >
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/recommend">
                Recommend
              </Link>
            </li>

            {/* if user is logged in then show me and logout button */}
            {AuthService.getCurrentUser() ? (
              <li className="nav-item">
                <Link className="nav-link" to="/me">
                  Me
                </Link>
              </li>
            ) : (
              ""
            )}
            {AuthService.getCurrentUser() ? (
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={handleLogout}>
                  Logout
                </Link>
              </li>
            ) : (
              ""
            )}
          </ul>

          <div className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search Books here <3"
              aria-label="Search"
              value={userInput}
              onChange={handleChangeUserInput}
            />
            <button className="btn btn-outline-success" onClick={handleSearch}>
              Go!
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavComponent;
