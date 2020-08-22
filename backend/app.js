const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postsRoutes = require("./routes/posts");
const usersRoutes = require("./routes/user");
const path = require("path");

const app = express();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Database!"))
  .catch(() => console.log("Connection Failed!"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", express.static(path.join("backend/images")));

app.use(cors());

app.use("/api/posts", postsRoutes);
app.use("/api/user", usersRoutes);

module.exports = app;
