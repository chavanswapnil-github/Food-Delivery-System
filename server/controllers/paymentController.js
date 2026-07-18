const crypto = require("crypto");
const paymentService = require("../services/paymentService");

const createPayment = async (req, res) => {
  try {
    const order = await paymentService.createOrder(req.body.amount);

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Payment creation failed",
    });

  }
};

const verifyPayment = async (req, res) => {

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const body =
    razorpay_order_id + "|" + razorpay_payment_id;

  const expected = crypto
    .createHmac(
      "sha256",
      process.env.RAZORPAY_KEY_SECRET
    )
    .update(body)
    .digest("hex");

  if (expected === razorpay_signature) {

    return res.json({
      success: true,
      message: "Payment Verified",
    });

  }

  res.status(400).json({
    success: false,
    message: "Payment Verification Failed",
  });

};

module.exports = {
  createPayment,
  verifyPayment,
};