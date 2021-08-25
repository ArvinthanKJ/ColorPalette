const { json } = require("body-parser");
const bodyParser = require("body-parser");
let ejs = require("ejs");
const express = require("express");
const bcrypt = require("bcrypt");

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

module.exports = function (app) {
  app.use(express.urlencoded({ extended: false }));
  //Database MongoDB

  const mongoose = require("mongoose");
  const Members = require("../models/members");
  mongoose.connect("mongodb://localhost/onsite2", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection
    .once("open", function () {
      console.log("Connection has been made with the databse");
    })
    .on("error", function (error) {
      console.log("Connection error:", error);
    });
  var userID;
  var paletteID;
  app.get("/dashboard", async (req, res) => {
    if (userID != null && paletteID != null) {
      var arr = [];
      for (var i = 0; i <= 3; i++) {
        var r = Math.floor(Math.random() * 200 + 56).toString(16);
        var g = Math.floor(Math.random() * 200 + 56).toString(16);
        var b = Math.floor(Math.random() * 200 + 56).toString(16);
        var element = "#" + r + g + b;
        arr.push(element);
      }
      console.log("zzzzzzzzzzzzzzzz");
      console.log(arr);
      res.render("dashboard.ejs", { arr: arr });
    } else res.redirect("/error");
  });

  app.post("/dashboard", async (req, res) => {
    console.log("==========");
    console.log(req.body.color);
    var col = req.body.color;
    await Members.findOne({ _id: userID }, async (err, docs) => {
      var tempArray = docs.palette;
      var tempArray1 = docs.palette;
      filt = (obj) => {
        console.log(obj);
        if (obj._id == paletteID) return true;
        else return false;
      };
      filt1 = (obj) => {
        console.log(obj);
        if (obj._id == paletteID) return false;
        else return true;
      };
      tempArray = tempArray.filter(filt);
      tempArray1 = tempArray1.filter(filt1);

      console.log(tempArray);
      tempArray[0].colors.push(col);
      tempArray1.push(tempArray[0]);
      await Members.updateOne(
        { _id: userID },
        { $set: { palette: tempArray1 } }
      );
    });
    //res.redirect("back");
  });

  app.get("/saved", async (req, res) => {
    if (userID != null && paletteID != null) {
      await Members.findOne({ _id: userID }, (err, docs) => {
        console.log(docs.colors);
        color = docs.palette;
        var colors;
        var name;
        color.forEach((element) => {
          if (element._id == paletteID) {
            colors = element.colors;
            name = element.name;
          }
        });
        res.render("saved.ejs", { docs: colors, name: name });
      });
    } else res.redirect("/error");
  });

  app.post("/saved", async (req, res) => {
    var del = req.body.color;
    await Members.findOne({ _id: userID }, async (err, docs) => {
      var tempArray2 = docs.palette;
      var tempArray3 = docs.palette;
      filt = (obj) => {
        console.log(obj);
        if (obj._id == paletteID) return true;
        else return false;
      };
      filt1 = (obj) => {
        console.log(obj);
        if (obj._id == paletteID) return false;
        else return true;
      };
      tempArray2 = tempArray2.filter(filt);
      var tempColors = tempArray2[0].colors;
      var index = tempColors.indexOf(del);
      if (index > -1) {
        tempColors.splice(index, 1);
      }
      tempArray2[0].colors = tempColors;
      tempArray3 = tempArray3.filter(filt1);

      console.log(tempArray2);
      tempArray3.push(tempArray2[0]);
      await Members.updateOne(
        { _id: userID },
        { $set: { palette: tempArray3 } }
      );
    });
    res.redirect("back");
  });
  app.get("/palettedashboard", async (req, res) => {
    if (req.query.data != null) userID = req.query.data;
    await Members.findOne({ _id: userID }, async (err, docs) => {
      if (docs == null) res.redirect("/error");
      res.render("palettedashboard.ejs", { palette: docs.palette });
    });
  });
  app.post("/palettedashboard", async (req, res) => {
    console.log("??????????/");
    console.log(req.body.but);
    paletteID = req.body.but;
    res.redirect("/dashboard");
  });
  app.get("/createpalette", async (req, res) => {
    res.render("createpalette.ejs");
  });
  app.post("/createpalette", async (req, res) => {
    console.log("+++++++++++++++++++");
    console.log(req.body);
    var a = [];
    var tempPalette = { name: req.body.palette, colors: a };

    await Members.updateOne(
      { _id: userID },
      { $push: { palette: tempPalette } }
    );

    res.redirect("/palettedashboard");
  });
};
