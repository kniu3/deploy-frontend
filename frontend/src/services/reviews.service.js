import axios from "axios";

const API_URL = "https://ece9065group3api-51579a5ffecb.herokuapp.com/api/";

class ReviewService {
  //post a new review to a booklist belongs to a user
  postReview(review, user, booklist) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.post(
      API_URL + "review/new",
      {
        review,
        user,
        booklist,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
  }
  //get all public reviews of a booklist
  getReviews(booklistId) {
    return axios.get(API_URL + `auth/public/review/${booklistId}`);
  }

  //hide a review
  hideReview(reviewId) {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return axios.put(API_URL + `review/update`,
      {
        reviewId: reviewId
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      });
  }
}

const reviewServiceInstance = new ReviewService();
export default reviewServiceInstance;
