const db = require("../models/reviewModel");

// Add Review
const addReview = async (userId, restaurantId, rating, review) => {

    const [exist] = await db.query(
        "SELECT id FROM reviews WHERE user_id=? AND restaurant_id=?",
        [userId, restaurantId]
    );

    if (exist.length > 0) {
        throw new Error("You have already reviewed this restaurant.");
    }

    const [result] = await db.query(
        `INSERT INTO reviews(user_id,restaurant_id,rating,review)
         VALUES(?,?,?,?)`,
        [userId, restaurantId, rating, review]
    );

    return result;
};

// Get Reviews
const getRestaurantReviews = async (restaurantId) => {

    const [rows] = await db.query(
        `SELECT
            r.*,
            u.full_name
         FROM reviews r
         JOIN users u
            ON r.user_id=u.id
         WHERE restaurant_id=?
         ORDER BY created_at DESC`,
        [restaurantId]
    );

    return rows;
};

// Average Rating
const getAverageRating = async (restaurantId) => {

    const [rows] = await db.query(
        `SELECT
            ROUND(AVG(rating),1) AS rating,
            COUNT(*) AS total
         FROM reviews
         WHERE restaurant_id=?`,
        [restaurantId]
    );

    return rows[0];
};

// Delete Review
const deleteReview = async (id, userId) => {

    await db.query(
        "DELETE FROM reviews WHERE id=? AND user_id=?",
        [id, userId]
    );

};

module.exports = {
    addReview,
    getRestaurantReviews,
    getAverageRating,
    deleteReview
};