import { React, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BookCardComponent from "./book-card-component";
import "../styles/searchResult.css";

const SearchResultComponent = () => {
  const { state } = useLocation();
  const query = state.userInput;

  const [books, setBooks] = useState([]);

  const BOOK_KEY = "AIzaSyChwCdhIiQ2cKVmM_V9DeI6Hh0nddwVByg";
  const BOOK_API = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=0&maxResults=40&orderBy=newest&key=${BOOK_KEY}`;

  const fetchBook = async (api) => {
    try {
      const dataFetch = await fetch(api, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      let fetchData = await dataFetch.json();
      setBooks(fetchData.items);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchBook(BOOK_API);
  }, [BOOK_API]);

  return (
    <div>
      {!books && (
        <div className="no-books">
          <h1>No books found</h1>
        </div>
      )}{" "}
      {books && (
        <div className="alert alert-secondary" role="alert">
          Search Results for: {query}
        </div>
      )}
      <div className="grid-container">
        {books &&
          books.map((book) => {
            return (
              <div className="grid-item" key={book.id}>
                <BookCardComponent books={book}/>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SearchResultComponent;
