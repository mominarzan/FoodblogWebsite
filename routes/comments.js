const express = require("express"),
  Hotel = require("../models/hotel"),
  Comment = require("../models/comment"),
  middleware = require("../middleware/index"),
  router = express.Router({ mergeParams: true });

// NEW NESTED ROUTE - shows form to add a comment
router.get("/new", middleware.isLoggedIN, (req, res) => {
  // Find hotel by id
  Hotel.findById(req.params.id, (err, foundhotel) => {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { hotel: foundhotel });
    }
  });
});

// CREATE NESTED ROUTE - create a comment and add it to db with association to the hotel
router.post("/", middleware.isLoggedIN, (req, res) => {
  // find camp with id
  Hotel.findById(req.params.id, (err, foundhotel) => {
    if (err) {
      console.log(err);
      res.redirect("/hotels");
    } else {
      // create new comment
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          req.flash("error", "Something went wrong");
          console.log(err);
        } else {
          // Add usernamae and id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          // associate comment with camp
          foundhotel.comments.push(comment);
          foundhotel.save();
          req.flash("success", "Successfully added comment");
          // redirect to camp show
          res.redirect("/hotels/" + foundhotel._id);
        }
      });
    }
  });
});

// EDIT - form to update
router.get("/:comment_id/edit", middleware.checkCommentOwner, (req, res) => {
  Comment.findById(req.params.comment_id, (err, foundComment) => {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", {
        hotel_id: req.params.id,
        comment: foundComment,
      });
    }
  });
});

// UPDATE - update comment to db
router.put("/:comment_id", middleware.checkCommentOwner, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      if (err) {
        res.redirect("back");
      } else {
        res.redirect("/hotels/" + req.params.id);
      }
    }
  );
});

// DESTROY - delete the comment
router.delete("/:comment_id", middleware.checkCommentOwner, (req, res) => {
  Comment.findByIdAndDelete(req.params.comment_id, (err) => {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment Deleted");
      res.redirect("/hotels/" + req.params.id);
    }
  });
});

module.exports = router;
