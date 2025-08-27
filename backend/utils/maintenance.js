import AdminSettings from "../schemas/Settings.js";

export const maintenanceMode = async (req, res, next) => {
  try {
    const settings = await AdminSettings.findOne(); // your settings collection/document

    if (settings?.maintenanceMode) {
      // Check if user is logged in and an admin
      if (req.user && req.user.isAdmin) {
        return res.redirect('/admin/dashboard');
      }

      // Normal user or not logged in
      return res.redirect('/maintenance');
    }

    // Not in maintenance mode → continue
    next();
  } catch (error) {
    console.error("Maintenance middleware error:", error);
    next(); // fail-safe, let request go through
  }
};

