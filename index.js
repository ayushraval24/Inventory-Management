require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const passport = require("passport");
const cookieSession = require("cookie-session");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

const isProduction = process.env.NODE_ENV === "production";

app.use(
  cookieSession({
    name: "tuto-session",
    keys: ["key1", "key2"],
  })
);

app.use(
  cors({
    origin: "*",
  })
);
app.use(require("morgan")("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

if (!isProduction) {
  app.use(errorHandler());
}

//Configure Mongoose
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to Database successfully");
});
mongoose.set("debug", true);

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const bugRoutes = require("./routes/bugRoutes");

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/bugs", bugRoutes);

if (!isProduction) {
  app.use((err, req, res, next) => {
    console.log("Tes Err: ", err.message);
    res.status(err.status || 500);
    res.json({
      errors: err,
      message: err.message ? err.message : "",
    });
  });
}

app.use((err, req, res, next) => {
  console.log("My error: ", err);
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    message: message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log("Server is running on port " + PORT);
});
