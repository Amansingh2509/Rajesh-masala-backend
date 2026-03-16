//server ko start krunga
require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");

connectDB();
app.listen(8765, () => {
  console.log("server is running at port 8765");
});
