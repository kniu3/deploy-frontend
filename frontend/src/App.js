import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/style.css";

//AuthService
import AuthService from "./services/auth.service";
//components
import NavComponent from "./components/nav-component";
import HomeComponent from "./components/home-component";
import SearchResultComponent from "./components/searchResult-component";
import MeComponent from "./components/me-component";
import VerifySuccessfully from "./components/verify-successfully";
import BookDetails from "./components/book-details-component";
import RecommendComponent from "./components/recommend-component";
import BookListDetailsComponent from "./components/booklist-details-component";
import PaymentComponent from "./components/payment-component";

function App() {
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());

  return (
    <div className="App">
      <NavComponent currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Routes>
        <Route
          path="/verify-successfully/:verificationToken"
          element={<VerifySuccessfully />}
        />
        <Route path="/" element={<HomeComponent />} />
        <Route
          exact
          path="/search-result"
          element={
            <SearchResultComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
        />
        <Route
          exact
          path="/me"
          element={
            <MeComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
        />
        <Route
          exact
          path="/book-details/:bookId"
          element={
            <BookDetails
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
        />
        <Route
          exact
          path="/recommend"
          element={
            <RecommendComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
        />
        <Route
          exact
          path="/booklist/:booklistId"
          element={
            <BookListDetailsComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
        />
        <Route
          exact
          path="/checkout"
          element={
            <PaymentComponent
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
