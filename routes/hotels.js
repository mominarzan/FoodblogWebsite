const express = require("express"),
  Hotel = require("../models/hotel"),
  middleware = require("../middleware/index"),
  router = express.Router();

// INDEX  - shows all hotels
router.get("/", (req, res) => {
  // Show All hotels from db
  Hotel.find({}, (err, allhotels) => {
    if (err) {
      console.log(err);
    } else {
      res.render("hotels/index", {
        hotels: allhotels,
        page: "hotels",
      });
    }
  });
});

// CREATE - add new  hotel to db
router.post("/", middleware.isLoggedIN, (req, res) => {
  // Get data from the user by form
  let name = req.body.name;
  let price = req.body.price;
  let img = req.body.img;
  let description = req.body.description;
  let location = req.body.location;
  // author
  let author = {
    id: req.user._id,
    username: req.user.username,
  };
  // Making a hotel
  let newHotel = {
    name: name,
    price: price,
    image: img,
    description: description,
    author: author,
    address: location,
  };

  // Create a new hotel and add it to db
  Hotel.create(newHotel, (err, newlyCreated) => {
    if (err) {
      console.log(err);
    } else {
      // Redirect to hotels Page
      res.redirect("/hotels");
    }
  });
});

// NEW - shows form to create new hotel
router.get("/new", middleware.isLoggedIN, (req, res) => {
  res.render("hotels/new");
});

// SHOW - Shows info about one hotel
// Order is IMP if kept above NEW, everytime SHOW is triggered as /hotels/name is treated as /hotels/:id
router.get("/:id", (req, res) => {
  // find hotel with provided id
  // .populate().exec() changes the comment id with actual comment
  Hotel.findById(req.params.id)
    .populate("comments")
    .exec((err, foundhotel) => {
      if (err) {
        console.log(err);
      } else {
        // render show template with that hotel
        res.render("hotels/show", { hotel: foundhotel });
      }
    });
});

// EDIT - form to update
router.get("/:id/edit", middleware.checkHotelOwner, (req, res) => {
  Hotel.findById(req.params.id, (err, foundhotel) => {
    res.render("hotels/edit", { hotel: foundhotel });
  });
});

// UPDATE - update hotel to db
router.put("/:id", middleware.checkHotelOwner, (req, res) => {
  // find and update hotel
  Hotel.findByIdAndUpdate(
    req.params.id,
    req.body.hotel,
    (err, updatedhotel) => {
      if (err) {
        res.redirect("/hotels");
      } else {
        res.redirect("/hotels/" + req.params.id);
      }
    }
  );
});

// DESTROY - delete the hotel
router.delete("/:id", middleware.checkHotelOwner, (req, res) => {
  Hotel.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect("/hotels");
    } else {
      res.redirect("/hotels");
    }
  });
});

module.exports = router;
