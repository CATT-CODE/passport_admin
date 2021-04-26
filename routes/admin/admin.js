var express = require("express");
var router = express.Router();
var passport = require('passport');

var {
  signUp,
  login,
  updateProfile,
  createUserUsingAdminRoute,
  deleteUserByIdUsingAdminRoute,
  updateUserByEmailUsingAdminRoute,
  getAllUsersProfile,
} = require("./controller/adminController");

router.post("/sign-up", signUp);
router.post("/login", login);
router.put("/update-profile", passport.authenticate("jwt-admin", {session: false}), updateProfile);
router.get(
  "/get-all-users-profile",
  passport.authenticate("jwt-admin", { session: false }),
  getAllUsersProfile
);
router.post(
	"/admin-create",
	passport.authenticate("jwt-admin", { session: false }),
	createUserUsingAdminRoute
);
router.delete(
	"/delete-admin",
	passport.authenticate("jwt-admin", { session: false }),
	deleteUserByIdUsingAdminRoute
);
router.put(
	"/update-user",
	passport.authenticate("jwt-admin", { session: false }),
	updateUserByEmailUsingAdminRoute
);

module.exports = router;