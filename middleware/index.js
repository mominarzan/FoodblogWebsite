const Hotel = require("../models/hotel");
const Comment = require("../models/comment");
const middlewareObj = {};

middlewareObj.checkHotelOwner = (req, res, next) => {
  if (req.isAuthenticated()) {
    Hotel.findById(req.params.id, (err, foundHotel) => {
      if (err) {
        // Goes back
        req.flash("error", "Hotel not found");
        res.redirect("back");
      } else {
        // Edit if user does user own the hotel
        if (foundHotel.author.id.equals(req.user._id)) {
          // render edit form
          next();
        } else {
          req.flash("error", "Permission Denied");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Authentication Required");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwner = (req, res, next) => {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if (err) {
        // Goes back
        req.flash("error", "Comment not found");
        res.redirect("back");
      } else {
        // Edit if user does user own the comment
        if (foundComment.author.id.equals(req.user._id)) {
          // render edit form
          next();
        } else {
          req.flash("error", "Permission Denied");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "Authentication Required");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIN = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Authentication Required");
  res.redirect("/login");
};

module.exports = middlewareObj;
