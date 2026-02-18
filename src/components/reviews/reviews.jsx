import React from "react";
import "./reviews.css";

const reviews = [
  {
    name: "Ahmed Elkatiri",
    stars: 5,
    content:
      "Great experience! The car was clean, fuel-efficient, and the pickup process took less than 5 minutes. Highly recommended!",
  },
  {
    name: "Sarah Johnson",
    stars: 4,
    content:
      "Customer service was excellent. I extended my rental by 2 days and it was handled smoothly without hidden fees.",
  },
  {
    name: "Mohamed Rachidi",
    stars: 5,
    content:
      "The best rental company I’ve dealt with. The SUV was brand new and perfect for our family trip.",
  },
  {
    name: "Emily Carter",
    stars: 5,
    content:
      "Affordable prices and fast service. I booked online and the car was ready as soon as I arrived.",
  },
  {
    name: "Youssef Benali",
    stars: 4,
    content:
      "Very professional team. They upgraded my car for free because the one I booked wasn’t available.",
  },
  {
    name: "Lucas Martinez",
    stars: 5,
    content:
      "Smooth rental process and no surprises at drop-off. Car was reliable, clean, and comfortable.",
  },
];

const Reviews = () => {
  return (
    <div className="reviews-wrapper-x">
      <div className="reviews-track-x">
        {[...reviews, ...reviews].map((review, i) => (
          <div className="review-box" key={i}>
            <div className="review-header">
              <h4 className="review-name">{review.name}</h4>
              <div className="review-stars">{"⭐".repeat(review.stars)}</div>
            </div>

            <p className="review-content">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
