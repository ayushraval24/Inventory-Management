const User = require("../models/UserModel");
let passport = require("passport");
require("../config/passport");

exports.authRequired = (request, response, next) => {
  passport.authenticate("jwt", { session: false }, async (error, token) => {
    if (error || !token) {
      const err = new Error();
      err.status = 401;
      err.message = "Unauthorized";
      return next(err);
    } else {
      try {
        const user = await User.findById(token.id);
        request.user = user;
        if (!user) {
          const err = new Error();
          err.status = 401;
          err.message = "User does not exist anymore";
          return next(err);
        }
      } catch (error) {
        next(error);
      }
      next();
    }
  })(request, response, next);
};
