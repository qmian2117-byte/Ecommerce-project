const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect("/signin");
};

module.exports = isAuthenticated;
