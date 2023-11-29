import React from "react";
import { Link } from "react-router-dom";
import BookListService from "../services/booklist.service";

const BookListCard = (prop) => {
  let bookList = prop.bookList;
  let {currentUser} = prop;
  const bookListId = bookList._id;


  const isAuthor = () => {
    if (!currentUser) {
      return false;
    } else {
      return currentUser.user._id === bookList.user._id;
    }
  }

  const handleDelList = () => {
    BookListService.deleteBooklist(bookListId)
      .then((response) => {
        console.log(response);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container-fluid">
      <Link
        to={`/booklist/${bookListId}`}
        state={{ bookList: bookList, currentUser: currentUser }}
        className="list-group-item list-group-item-action flex-column align-items-start"
      >
        <div className="d-flex w-100 justify-content-between">
          <h5 className="mb-1">{bookList.name}</h5>
          <small className="text-muted">
            Last edited: {bookList.last_edited.slice(0, 10)}
          </small>
        </div>
        <p className="mb-1">{bookList.description}</p>
        <small className="text-muted">Count:{bookList.books.length}</small>
        <div className="position-absolute bottom-0 end-0">
          <small className="text-muted">Author: {bookList.user.name}</small>
        </div>
      </Link>
      {isAuthor() && bookList && (
        <button
          className="btn btn-outline-danger"
          onDoubleClick={handleDelList}
        >
          DELETE
        </button>
      )}
    </div>
  );
};

export default BookListCard;
