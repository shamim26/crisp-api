import dotenv from "dotenv";
import { app } from "./app";
import connectDB from "./db/db";

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => console.log("MONGODB connection error", err));
