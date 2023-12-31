require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
const db = require("./db/connection");
const PORT = process.env.PORT || 3333;

const is_prod = process.env.PORT;

if (is_prod) {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// import routes

const favorite_routes = require("./routes/favorite_routes");
const user_routes = require("./routes/user_routes");

// middleware
app.use(express.json());
app.use(cookieParser());

app.use("/api", [favorite_routes, user_routes]);

if (is_prod) {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

// ensure the db is open/start the server
db.once("open", () => {
  // start express
  app.listen(PORT, () => console.log(`Server started on ${PORT}`));
});
