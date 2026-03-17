// create  karenge server isme
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const contactRoutes = require("./routes/contact.routes");

const app = express();
require("./db/db");

const authRoutes = require("./routes/auth.routes");
const itemroutes = require("./routes/item.routes");

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);
app.use(express.json()); //middleware use taking data from frontend
app.use(cookieParser()); //middleware use for cookie  handling

// Session & Passport
app.use(
  session({
    secret: process.env.JWT_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

// Validate Google OAuth env vars before initializing strategy
const requiredGoogleEnv = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
];
const missingGoogleEnv = requiredGoogleEnv.filter((key) => !process.env[key]);
if (missingGoogleEnv.length > 0) {
  console.error(
    "❌ Missing Google OAuth environment variables:",
    missingGoogleEnv.join(", "),
  );
  console.error(
    "💡 Copy backend/.env.example to backend/.env and fill the values.",
  );
  console.error(
    "💡 Get credentials from https://console.cloud.google.com/apis/credentials",
  );
  console.error(
    "💡 Authorized redirect URIs: http://localhost:8765/api/auth/google/callback",
  );
  process.exit(1);
}

app.use(passport.initialize());
app.use(passport.session());

require("./strategies/google.strategy")(passport);

app.use("/api/auth", authRoutes);
app.use("/api/items", itemroutes);
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/contact", require("./routes/contact.routes"));

app.get("/", (req, res) => {
  res.send("hello its aman ");
});
app.use("/api", contactRoutes);
module.exports = app;
