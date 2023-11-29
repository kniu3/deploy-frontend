import { React, useState } from "react";
import { Link } from "react-router-dom";
import BookService from "../services/book.service";
import BookListService from "../services/booklist.service";
import Accordion from "react-bootstrap/Accordion";

const InlistBookCardComponent = (props) => {
  const { book, currentUser, bookListId, bookList, setBookList } = props;

  const bookId = book._id;
  const title = book.title;
  const subTitle = book.subTitle;
  const authors = book.authors;
  const salePrice = book.salePrice;

  let [msg, setMsg] = useState("");

  const handleDeleteBook = () => {
    BookService.deleteBookFromList(bookListId, bookId)
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(title);
    setMsg("Copied to your clipboard!");
    setTimeout(() => {
      setMsg("");
    }, 5000);
  };

  return (
    <div className="container-fluid">
      <Accordion.Item eventKey={`${bookId}`}>
        <Accordion.Header>
        {title && title.slice(0, 50)}
          <i> by {authors}</i>
        </Accordion.Header>
        <Accordion.Body>
          <div className="d-flex flex-row flex-wrap m-5 align-items-stretch w-100">
            <div className="border rounded p-5 bg-light">
              <div className="d-flex flex-row">
                <img
                  className="rounded float-start"
                  src={book.imgSrc}
                  alt="No Image Available"
                />
                <div className="details-container m-5">
                  <h1 className="font-monospace">{title}</h1>
                  {subTitle && <h2 className="fst-italic">- {subTitle}</h2>}
                  <h1>
                    Price: {salePrice && salePrice.amount + " " + salePrice.currencyCode}
                  </h1>

                  <p>Author: {authors}</p>
                  <p>Category: {book.categories}</p>
                  <p>Language: {book.language}</p>
                  <p>Publisher: {book.publisher}</p>
                  <p>Published Date: {book.publishedDate}</p>
                  <div className="description">
                    <h3>Description:</h3>
                    <p>{book.description}</p>
                  </div>
                  <p>#Pages: {book.pageCount}</p>
                </div>
              </div>
              <button className="btn btn-outline-dark" onClick={handleCopy}>
                Copy
              </button>
              {currentUser && currentUser.user._id === bookList.user._id && (
                <button
                  className="btn btn-outline-dark"
                  onClick={handleDeleteBook}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </div>
  );
};

export default InlistBookCardComponent;
