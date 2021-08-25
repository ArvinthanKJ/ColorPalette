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

  app.get("/dashboard", async (req, res) => {
    console.log(req.query.data);
    if (req.query.data != null) userID = req.query.data;
    if (userID != null) {
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
    await Members.updateOne({ _id: userID }, { $push: { colors: col } });
    //res.redirect("back");
  });

  app.get("/saved", async (req, res) => {
    if (userID != null) {
      await Members.findOne({ _id: userID }, (err, docs) => {
        console.log(docs.colors);
        colors = docs.colors;
        res.render("saved.ejs", { docs: colors });
      });
    } else res.redirect("/error");
  });

  app.post("/saved", async (req, res) => {
    var del = req.body.color;
    console.log(del);
    await Members.updateOne({ _id: userID }, { $pull: { colors: del } });
    res.redirect("back");
  });
};
