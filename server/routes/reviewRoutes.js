const router = require("express").Router();

const auth = require("../middleware/authMiddleware");

const {
    addReview,
    getRestaurantReviews,
    deleteReview
} = require("../controllers/reviewController");

router.post("/", auth, addReview);

router.get("/:id", getRestaurantReviews);

router.delete("/:id", auth, deleteReview);

module.exports = router;