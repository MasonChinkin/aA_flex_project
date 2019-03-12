const express = require("express");
const router = express.Router();
const passport = require("passport");
const Journey = require("../../models/Journey");
const Photo = require("../../models/Photo");
const validatePhotoInput = require("../../validation/photos");
const NodeGeocoder = require("node-geocoder");
const geocoder = NodeGeocoder({ provider: "openstreetmap" });
const upload = require("../../services/file-upload");

router.get("/test", (req, res) =>
  res.json({ msg: "This is the photos  route" })
);

router.post(
  "/",
  upload.single("image"),
  // passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log(req.body, req.file.location);
    // let photo = req.body.photo;
    // let journey = req.body.journey;

    if (req.body.journeyId === undefined) {
      return res
        .status(400)
        .json({ journey: "Photo must be attached to a journey" });
    }
    // photo.journeyId = journey.id;
    let photo = {};
    photo.city = req.body.city;
    photo.country = req.body.country;
    photo.date = req.body.date;
    photo.journeyId = req.body.journeyId;
    photo.description = req.body.description;
    photo.url = req.file.location;

    const { errors, isValid } = await validatePhotoInput(photo);

    if (!isValid) {
      return res.status(400).json({ photos: errors });
    }

    // const singleUpload = upload.single("image");

    // // const uploadReq = req.body.aws;

    // await singleUpload(req, res, err => {
    //   if (err) {
    //     return res.status(400).json(err);
    //   } else {
    //     photo.url = req.file.key;
    //     // return res.json({ imageUrl: req.file.key });
    //   }
    // });

    let options = { city: photo.city, country: photo.country };
    let data = await geocoder.geocode(options);

    if (data.length === 0) {
      errors.location = "Enter a valid city/country location";
      return res.status(400).json(errors);
    }

    const firstResult = data[0];

    const newPhoto = new Photo({
      photoUrl: photo.url,
      city: photo.city,
      region: photo.province || null,
      country: photo.country,
      photoDateTime: new Date(photo.date),
      description: photo.description,
      latitude: firstResult.latitude,
      longitude: firstResult.longitude,
      journeyId: photo.journeyId
    });

    newPhoto.save(function(err, newPhoto) {
      if (err) {
        return res.status(400).json(err);
      } else {
        return res.status(200).json(newPhoto);
      }
    });
  }
);

module.exports = router;
