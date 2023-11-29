import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/auth.service";
import BookListService from "../services/booklist.service";
import BookListCard from "./book-list-card-component";

const RecommendComponent = (prop) => {
  let { currentUser,setCurrentUser } = prop;
  let [bookLists, setBookLists] = useState([]);

  const get10BookLists = () => {
    BookListService.getPublicBookLists10()
      .then((response) => {
        setBookLists(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getPublicBookLists = () => {
    BookListService.getPublicBookLists()
      .then((response) => {
        setBookLists(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    //if currentUser is null, then get 10 public booklists
    if (!currentUser) {
      get10BookLists();
    } else {
      getPublicBookLists();
    }
  }, [currentUser]);

  return (
    <div className="d-flex flex-column flex-wrap m-5 align-items-stretch">
      <div className="row">
        <div className="col-12 mw-100">
          <h1>We have chose some featured bookList for you</h1>
        </div>
      </div>
      <ul className="list-group mw-100">
        {bookLists &&
          bookLists.map((bookList) => {
            return (
              <div className="grid-item m-3" key={bookList._id}>
                <BookListCard bookList={bookList} currentUser={currentUser}/>
              </div>
            );
          })}
      </ul>
      {!currentUser && (
        <Link className="btn btn-outline-dark" to="/">Login for More</Link>
      )}
    </div>
  );
};

export default RecommendComponent;
