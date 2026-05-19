export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      // req.user protect middleware se aata hai
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      // Role check
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      next();
    } catch (error) {
      console.error("Role middleware error:", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};