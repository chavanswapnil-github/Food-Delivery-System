const service = require("../services/reviewService");

const addReview = async (req, res) => {

    try {

        await service.addReview(
            req.user.id,
            req.body.restaurant_id,
            req.body.rating,
            req.body.review
        );

        res.json({
            success: true,
            message: "Review added"
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });

    }

};

const getRestaurantReviews = async (req, res) => {

    const reviews =
        await service.getRestaurantReviews(req.params.id);

    const average =
        await service.getAverageRating(req.params.id);

    res.json({
        success: true,
        reviews,
        average
    });

};

const deleteReview = async (req, res) => {

    await service.deleteReview(
        req.params.id,
        req.user.id
    );

    res.json({
        success: true
    });

};

module.exports = {
    addReview,
    getRestaurantReviews,
    deleteReview
};