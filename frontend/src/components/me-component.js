import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthService from "../services/auth.service";
import BookListService from "../services/booklist.service";
import BookListCard from "./book-list-card-component";

const MeComponent = (prop) => {
  let { currentUser, setCurrentUser } = prop;
  let [bookLists, setBookLists] = useState([]);
  const userId = currentUser.user._id;

  let [bookListName, setBookListName] = useState("");
  let [bookListDescription, setBookListDescription] = useState("");
  let [bookListPrivacy, setBookListPrivacy] = useState("public");
  let [msg, setMsg] = useState("");

  let [newPassword, setNewPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");

  let [successMsg, setSuccessMsg] = useState("");

  const handleBookListNameChange = (event) => {
    setBookListName(event.target.value);
  };
  const handleBookListDescriptionChange = (event) => {
    setBookListDescription(event.target.value);
  };
  const handleBookListPrivacyChange = (event) => {
    setBookListPrivacy(event.target.value);
  };

  const handleBookListCreate = async (event) => {
    event.preventDefault();

    // Check if the number of book lists exceeds 20
    if (bookLists.length >= 20) {
      setMsg("You have reached the maximum limit of book lists (20).");
      return;
    }

    // Check if a book list with the same name already exists
    if (bookLists.some((list) => list.name === bookListName)) {
      setMsg("A book list with the same name already exists.");
      return;
    }

    // Attempt to create a new book list
    try {
      const response = await BookListService.createBookList(
        bookListName,
        bookListDescription,
        bookListPrivacy,
        userId
      );

      // Close the dropdown menu
      document.querySelector(".dropdown-menu").classList.remove("show");

      // Add the new book list to the list
      setBookLists([...bookLists, response.data]);
      setBookListName("");
      setBookListDescription("");
      setBookListPrivacy("public");

      window.location.reload();
    } catch (err) {
      setMsg(err.response.data);
      setTimeout(() => {
        setMsg("");
      }, 5000);
    }
  };

  //get all booklists belongs to current user
  useEffect(() => {
    const fetchBookLists = async () => {
      if (currentUser && currentUser.user) {
        const response = await BookListService.getBookListsByUserId(
          currentUser.user._id
        );
        setBookLists(response.data);
      }
    };
    fetchBookLists();
  }, [userId]);

  //get current user data
  useEffect(() => {
    const fetchUserData = async () => {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);
    };
    if (!currentUser) {
      fetchUserData();
    }
  }, [currentUser, setCurrentUser]);
  //if user is not logged in, display a message
  if (!currentUser) {
    return (
      <div>
        <h1>You must login first before seeing this page.</h1>
      </div>
    );
  }



  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMsg("Passwords do not match.");
      setTimeout(() => {
        setMsg("");
      }, 5000);
      return;
    }
    await AuthService.updateUserPassword(userId, newPassword)
      .then((response) => {
        console.log(response);
        setSuccessMsg("Password updated successfully. Your new password is: " + newPassword);
        setTimeout(() => {
          setSuccessMsg("");
        }, 5000);

        // Close the dropdown menu
        document.querySelector(".dropdown-menu").classList.remove("show");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container">
      {msg && <div className="alert alert-danger">{msg}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      <h1>
        You are logged in as {currentUser.user.name}, here's your booklists:
      </h1>
      <h3>
        Role: {currentUser.user.role.toUpperCase()}
      </h3>
      <ul className="list-group">
        <div className="dropdown">
          <button
            type="button"
            className="btn btn-outline-dark dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            data-bs-auto-close="outside"
          >
            Update Password
          </button>
          <form className="dropdown-menu p-4">
            <div className="form-group">
              <label htmlFor="oldPassword">New Password</label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label htmlFor="newPassword">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={handleUpdatePassword}
              >
                UPDATE
              </button>
              <small>Forbidden for Google Login User</small>
            </div>
          </form>
        </div>
        <div className="dropdown">
          <button
            type="button"
            className="btn btn-outline-dark dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            data-bs-auto-close="outside"
          >
            Add Booklist
          </button>
          <form className="dropdown-menu p-4">
            <div className="form-group">
              <label htmlFor="name">Booklist Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={bookListName}
                onChange={handleBookListNameChange}
              />
              <label htmlFor="description">Booklist Description</label>
              <textarea
                type="text"
                className="form-control"
                id="description"
                value={bookListDescription}
                onChange={handleBookListDescriptionChange}
              />
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  value="public"
                  checked={bookListPrivacy === "public"}
                  onChange={handleBookListPrivacyChange}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                  Public
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault2"
                  value="private"
                  checked={bookListPrivacy === "private"}
                  onChange={handleBookListPrivacyChange}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                  Private
                </label>
              </div>
              <button
                type="submit"
                className="btn btn-outline-dark"
                onClick={handleBookListCreate}
              >
                CREATE LIST
              </button>
            </div>
          </form>
        </div>

        {bookLists &&
          bookLists.map((bookList) => {
            return (
              <div className="grid-item m-3" key={bookList._id}>
                <BookListCard bookList={bookList} currentUser={currentUser} />
              </div>
            );
          })}
      </ul>
    </div>
  );
};

export default MeComponent;
