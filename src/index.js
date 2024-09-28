require("dotenv").config();
const { app } = require("./app");
const connectDB = require("./db/db");

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => console.log("MONGODB connection error", err));
