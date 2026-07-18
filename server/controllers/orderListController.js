const orderListService = require("../services/orderListService");

const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const results = await orderListService.getUserOrders(userId);

        res.json({
            success: true,
            orders: results
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    getUserOrders
};