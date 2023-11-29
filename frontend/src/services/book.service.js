import axios from "axios";

const API_URL = "https://ece9065group3api-51579a5ffecb.herokuapp.com/api";

class BookService {
  //add a book to a booklist
  addBookToList(bookListId, bookBody) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL + "/book/post-book-to-list",
      {
        bookListId: bookListId,
        bookBody: bookBody,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
  }
  //delete a book from a booklist
  deleteBookFromList(bookListId, bookId) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.delete(API_URL + "/book/delete-book-from-list", {
      data: {
        bookListId: bookListId,
        bookId: bookId,
      },
      headers: {
        Authorization: `${token}`,
      },
    });
  }
  //get a book by id
  getBookById(bookId) {
    return axios.get(API_URL+"/auth/public/books/" + bookId);
  }
}

const BookServiceInstance = new BookService();
export default BookServiceInstance;
