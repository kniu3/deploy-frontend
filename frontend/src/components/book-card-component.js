import React from "react";
import { Link } from "react-router-dom";

const BookCardComponent = (prop) => {
  let book = prop.books.volumeInfo;
  let bookId = prop.books.id;

  let title = book.title;

  console.log(prop);

  // If there are more than one author, join them with a comma, only keep top 3 authors
  let authors = book.authors
    ? book.authors.slice(0, 2).join(", ")
    : "Unknown";

  let image = book.imageLinks
    ? book.imageLinks.thumbnail
    : "";
  return (
    <div className="card" style={{ width: "20rem" }}>
      <img className="card-img-top" src={image} alt="No Image Available" style={{width:"20rem",height:"20rem"}}/>
      <div className="card-body" style={{ width:"20rem",height:"8rem",overflow:"scroll" }}>
        <h5 className="card-title">{title}</h5>
        <p className="card-text">by {authors}</p>
      </div>
      <Link to={`/book-details/${bookId}`} state={{ book: prop.books }} className="btn btn-outline-dark">
          View
      </Link>
    </div>
  );
};

export default BookCardComponent;
