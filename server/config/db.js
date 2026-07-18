const mysql = require("mysql2/promise");

// SSL is only needed for managed/cloud MySQL (e.g. PlanetScale, AWS RDS with
// forced TLS). A local MySQL install almost never has SSL configured, and
// forcing it here was silently killing every DB connection on localhost
// (the pool would just fail to connect, and every query built on top of it
// would hang or error out). Enable it explicitly via DB_SSL=true in .env
// when deploying against a host that requires it.
const useSSL = process.env.DB_SSL === "true";

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ...(useSSL ? { ssl: { rejectUnauthorized: false } } : {}),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

(async () => {
  try {
    const conn = await db.getConnection();
    console.log("✅ MySQL Connected");
    conn.release();
  } catch (err) {
    console.log("❌ Database Connection Failed");
    console.log(err);
  }
})();

module.exports = db;