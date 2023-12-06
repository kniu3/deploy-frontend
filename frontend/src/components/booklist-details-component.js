import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BookService from "../services/book.service";
import BookListService from "../services/booklist.service";
import ReviewsService from "../services/reviews.service";
import InlistBookCardComponent from "./inlist-bookcard-component";
import Accordion from "react-bootstrap/Accordion";
import ReviewCardComponent from "./review-card-component";

const BookListDetailsComponent = (prop) => {
  const location = useLocation();
  let [bookList, setBookList] = useState(location.state.bookList);
  let [currentUser, setCurrentUser] = useState(location.state.currentUser);

  let [bookListName, setBookListName] = useState(bookList.name);
  let [bookListDescription, setBookListDescription] = useState(
    bookList.description
  );
  let [bookListVisibility, setBookListVisibility] = useState(
    bookList.visibility
  );

  let [reviewList, setReviewList] = useState([]);

  const bookListAuthor = bookList.user;
  const bookListId = bookList._id;

  let bookListBooks = bookList.books;

  //when bookList changes, re-render the component
  useEffect(() => {
    BookListService.getBooklist(bookListId)
      .then((response) => {
        setBookList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    ReviewsService.getReviews(bookListId)
      .then((response) => {
        console.log(response.data);
        setReviewList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);



  const handleBookListNameChange = (e) => {
    setBookListName(e.target.value);
  };
  const handleBookListDescriptionChange = (e) => {
    setBookListDescription(e.target.value);
  };
  const handleBookListVisibilityChange = (e) => {
    setBookListVisibility(e.target.value);
  };
  const navigator = useNavigate();
  //handle booklist update
  const handleBookListUpdate = (e) => {
    e.preventDefault();
    BookListService.updateBooklist(
      bookListId,
      bookListName,
      bookListDescription,
      bookListVisibility,
      bookListAuthor._id
    )
      .then((response) => {
        console.log(response.data);
        setBookList(response.data);

        //get where the user is from
        //go back to where the user is from
        navigator(-1);
      })
      .catch((error) => {
        console.log("We got an error here!!!!!!!!!!!!!!!!!!!!");
        console.log(error);
      });
  };
  //handle post review
  let [reviewContent, setReviewContent] = useState("");
  const handleReviewContentChange = (e) => {
    setReviewContent(e.target.value);
  };

  const handleSendReview = () => {
    ReviewsService.postReview(reviewContent, currentUser.user._id, bookListId)
      .then((response) => {
        const newReview = response.data;
        setReviewList((prevReviewList) => [newReview, ...prevReviewList]);
        setReviewContent("");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const scrollReviews = () => {
    const reviewsSection = document.getElementById("review");
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="d-flex flex-column flex-wrap m-5 align-items-stretch">
      <div className="border rounded p-5 bg-light">
        <h1>{bookListName}</h1>
        <h3>{bookListDescription}</h3>
        <h3>{bookListVisibility}</h3>

        <i>
          by: <h3>{bookListAuthor.name}</h3>
        </i>
        <button
          to="#review"
          className="btn btn-outline-dark"
          onClick={() => scrollReviews()}
        >
          See Reviews
        </button>
        {
          // if current user exist and currentUser is the bookList author, show edit button
          currentUser && currentUser.user._id === bookListAuthor._id && (
            <div>
              <Link
                to="/checkout"
                className="btn btn-outline-primary"
                state={{ bookList: bookList, currentUser: currentUser }}
              >
                Proceed to Checkout
              </Link>
              <div className="dropdown">
                <button
                  type="button"
                  className="btn btn-outline-info dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  data-bs-auto-close="outside"
                >
                  UPDATE
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
                        checked={bookListVisibility === "public"}
                        onChange={handleBookListVisibilityChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault1"
                      >
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
                        checked={bookListVisibility === "private"}
                        onChange={handleBookListVisibilityChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault2"
                      >
                        Private
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-outline-dark"
                      onClick={handleBookListUpdate}
                    >
                      Apply
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )
        }
      </div>
      <div className="flex-grow-1 border rounded p-5">
        <h2>Books</h2>
        {bookListBooks.length === 0 ? (
          // if bookList has no books, show this message
          <div>
            <h1>The owner has not collected any books~</h1>
          </div>
        ) : (
          <div className="d-flex flex-column flex-wrap border rounded p-3 w-100">
            <Accordion>
              {bookListBooks.map((book) => (
                <InlistBookCardComponent
                  key={book._id}
                  book={book}
                  bookListId={bookListId}
                  currentUser={currentUser}
                  bookList={bookList}
                  setBookList={setBookList}
                />
              ))}
            </Accordion>
          </div>
        )}
      </div>
      <div className="border rounded p-5 bg-light" id="review">
        <h2>Reviews</h2>
        {currentUser ? (
          <div className="d-flex flex-column mb-3">
            <textarea
              cols="20"
              rows="5"
              placeholder=" want to say something to the booklist?"
              value={reviewContent}
              onChange={handleReviewContentChange}
            ></textarea>
            <button className="btn btn-outline-dark" onClick={handleSendReview}>
              Send
            </button>
          </div>
        ) : (
          <div className="d-flex flex-column mb-3 align-items-center">
            <h4>
              Please{" "}
              <Link to="/" className="btn btn-outline-dark">
                log in
              </Link>{" "}
              to leave a review
            </h4>
          </div>
        )}
        {reviewList.length === 0 ? (
          <div>
            <h1>The owner has not collected any reviews~</h1>
          </div>
        ) : (
          <div className="d-flex flex-column flex-wrap border rounded p-3 w-100">
            {console.log(reviewList)}
            {reviewList &&
              reviewList.map((review) => (
                <ReviewCardComponent key={review._id} review={review} currentUser={currentUser} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookListDetailsComponent;
