import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("ZORA API running");
});

/* PRODUCT ROUTES */
app.use("/api/products", productRoutes);

/* DB CONNECT */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port `);
    });
  })
  .catch((err) => {
    console.error("DB error:", err.message);
  });
