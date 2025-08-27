const isRealAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { role, adminType } = req.user;

  if (role === "admin" && adminType === "real") {
    return next();
  }

  return res.status(403).json({ message: "Not Allowed: Real admin only" });
};

export default isRealAdmin