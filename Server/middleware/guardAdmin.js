module.exports = function authorizeAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return next({
      name: "Forbidden",
      message: "Only admin can access this route",
    }); // 403
  }
  next();
};
