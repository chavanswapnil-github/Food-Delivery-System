// Must run AFTER authMiddleware, which attaches the decoded JWT to req.user.
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }

  next();
};

module.exports = adminMiddleware;
