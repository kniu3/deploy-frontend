import React from "react";
import ReviewsService from "../services/reviews.service";

const ReviewCardComponent = (prop) => {
  const review = prop.review;

  const handleHideReview = () => {
    ReviewsService.hideReview(review._id)
      .then((response) => {
        console.log(response);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
    
  };
  return (
    <div className="border rounded p-3 mb-3">
      <i>{review.user.name}:</i>
      <h4>{review.review}</h4>
      <p>
        {review.date.split("T")[0] +
          " " +
          review.date.split("T")[1].slice(0, 5)}
      </p>
      <small>Inappropriate?</small>
      <button className="btn btn-outline-dark" onDoubleClick={handleHideReview}>
        Hide
      </button>
    </div>
  );
};

export default ReviewCardComponent;
