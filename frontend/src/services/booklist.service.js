import axios from "axios";

const API_URL = "https://ece9065group3api-51579a5ffecb.herokuapp.com/api/";

class BookListService {
  //get 10 public bookLists order by last edited
  getPublicBookLists10() {
    return axios.get(API_URL + "auth/booklist10");
  }
  //get all public bookLists order by last edited
  getPublicBookLists() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "book-list/all", {
      headers: {
        Authorization: `${token}`,
      },
    });
  }
  //get all bookLists belongs to a user
  getBookListsByUserId(userId) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "book-list/" + userId, {
      headers: {
        Authorization: `${token}`,
      },
    });
  }
  //create a new bookList
  createBookList(name, description, visibility, user) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL + "book-list/new",
      {
        name,
        description,
        visibility,
        user,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
  }
  //delete a bookList
  deleteBooklist(bookListId) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.delete(API_URL + "book-list/" + bookListId, {
      headers: {
        Authorization: `${token}`,
      },
    });
  }
  //get a bookList by id
  getBooklist(bookListId) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.get(API_URL + "book-list/list/" + bookListId, {
      headers: {
        Authorization: `${token}`,
      },
    });
  }

  //partially update a bookList
  updateBooklist(bookListId, name, description, visibility, user) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.patch(
      API_URL + "book-list/" + bookListId,
      {
        name,
        description,
        visibility,
        user
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
  }

}

const BookListServiceInstance = new BookListService();

export default BookListServiceInstance;
