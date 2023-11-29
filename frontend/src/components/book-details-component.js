import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import "../styles/book-detail.css";
import BookListService from "../services/booklist.service";
import BookService from "../services/book.service";

const BookDetails = (props) => {
  let { currentUser, setCurrentUser } = props;
  const location = useLocation();
  const [book, setBook] = useState(location.state.book);
  const [bookLists, setBookLists] = useState([]);
  const [checkedBookList, setCheckedBookList] = useState(null);
  const [msg, setMsg] = useState("");
  const [sucMsg, setSucMsg] = useState("");

  //fetch booklists for current user when window loads
  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.user._id;
      BookListService.getBookListsByUserId(userId)
        .then((response) => {
          setBookLists(response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [currentUser]);

  const selfLink = book.selfLink;
  //this component may come from search results or from booklist, so the imgSrc may be different, so we need to check
  //when coming from search results, the imgSrc is book.volumeInfo.imageLinks.thumbnail
  //when coming from booklist, the imgSrc is book.imgSrc
  // const imgSrc = book.imgSrc ? book.imgSrc : book.volumeInfo.imageLinks.thumbnail;
  const imgSrc = book.volumeInfo.imageLinks? book.volumeInfo.imageLinks.thumbnail : " ";
  const bookTitle = book.volumeInfo.title;
  const bookSubtitle = book.volumeInfo.subtitle;
  const bookAuthor = book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "Unknown";
  const bookCategory = book.volumeInfo.categories
    ? book.volumeInfo.categories.join(", ")
    : "Unknown";
  const bookDescription = book.volumeInfo.description
    ? book.volumeInfo.description
    : "No description available";
  const bookPublisher = book.volumeInfo.publisher
    ? book.volumeInfo.publisher
    : "Unknown";
  const bookPublishedDate = book.volumeInfo.publishedDate
    ? book.volumeInfo.publishedDate
    : "Unknown";
  const bookPageCount = book.volumeInfo.pageCount
    ? book.volumeInfo.pageCount.toString()
    : "Unknown";
  const bookLanguage = book.volumeInfo.language
    ? book.volumeInfo.language
    : "Unknown";
  const bookSalePrice = book.saleInfo.listPrice
    ? book.saleInfo.listPrice
    : { amount: "N/A", currencyCode: "" };

  const bookBody = {
    title: bookTitle,
    subTitle: bookSubtitle,
    authors: bookAuthor,
    description: bookDescription,
    categories: bookCategory,
    publisher: bookPublisher,
    publishedDate: bookPublishedDate,
    pageCount: bookPageCount,
    language: bookLanguage,
    salePrice: bookSalePrice,
    imgSrc: imgSrc,
    selfLink: selfLink,
  };

  if (!book) {
    return (
      <div className="container">
        <h1>Error: Book data not available</h1>
      </div>
    );
  }

  const handleCheckedBookList = (e) => {
    setCheckedBookList(e.target.value);
  };

  const handleAddBook = () => {
    if (checkedBookList) {
      BookService.addBookToList(checkedBookList, bookBody)
        .then((response) => {
          console.log(response.data);
          setCheckedBookList(null);
          setSucMsg(response.data.message);
        })
        .catch((err) => {
          setMsg(err.response.data.message);
        });
    }
  };

  return (
    <div className="container">
      {msg && setTimeout(() => setMsg(null), 5000)}
      {sucMsg && setTimeout(() => setSucMsg(null), 5000)}
      {sucMsg && <div className="alert alert-success">{sucMsg}</div>}
      {msg && <div className="alert alert-danger">{msg}</div>}
      <div className="book-container">
        <div className="img-container">
          <img src={imgSrc} alt="No Image Available" />
        </div>
        <div className="details-container">
          <h1 className="font-monospace">{bookTitle}</h1>
          {bookSubtitle && <h2 className="fst-italic">- {bookSubtitle}</h2>}
          <h1>
            Price: {bookSalePrice.amount + " " + bookSalePrice.currencyCode}
          </h1>

          <p>Author: {bookAuthor}</p>
          <p>Category: {bookCategory}</p>
          <p>Language: {bookLanguage}</p>
          <p>Publisher: {bookPublisher}</p>
          <p>Published Date: {bookPublishedDate}</p>
          <div className="description">
            <h3>Description:</h3>
            <p>{bookDescription}</p>
          </div>
          <p>#Pages: {bookPageCount}</p>

          {currentUser && (
            <div className="btn-group dropend">
              <button
                type="button"
                className="btn btn-outline-dark dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Add to my Booklist
              </button>
              <ul className="dropdown-menu">
                {bookLists && bookLists.length > 0 ? (
                  bookLists.map((booklist, index) => (
                    <li key={index}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="bookListRadios"
                        checked={checkedBookList === booklist._id}
                        value={booklist._id}
                        onChange={handleCheckedBookList}
                      />
                      <label className="form-check-label">
                        {booklist.name}
                      </label>
                    </li>
                  ))
                ) : (
                  <li>
                    <Link to="/me" className="btn btn-outline-dark btn-m">
                      Create a Booklist first
                    </Link>
                  </li>
                )}
                <button
                  className="btn btn-outline-dark btn-m"
                  onClick={handleAddBook}
                >
                  ADD
                </button>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
