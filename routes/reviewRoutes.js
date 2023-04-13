const express = require("express");
const router = express.Router();
const {
  createReview,
  getSingleReview,
  getAllReviews,
  updateReview,
  deleteReview,
  getSingleProductReviews,
} = require("../controllers/reviewController");
const { authenticateUser } = require("../middleware/authentication");

router.route("/").post(authenticateUser, createReview).get(getAllReviews);
router
  .route("/:id")
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

router.route("/:id/reviews").get(getSingleProductReviews);

module.exports = router;
