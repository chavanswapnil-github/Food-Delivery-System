const axios = require("axios");

const sendEmail = async (email, subject, html) => {
  try {
    const response = await axios.post(
      "https://api.elasticemail.com/v2/email/send",
      null,
      {
        params: {
          apikey: process.env.ELASTIC_API_KEY,
          from: process.env.EMAIL_FROM,
          fromName: "Food Delivery System",
          to: email,
          subject: subject,
          bodyHtml: html,
          isTransactional: true,
        },
      }
    );

    console.log("✅ Email sent:", response.data);

    return response.data;
  } catch (err) {
    console.error(
      "❌ Elastic Email Error:",
      err.response?.data || err.message
    );
    throw err;
  }
};

module.exports = sendEmail;