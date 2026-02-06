import express from "express";
import Review from "../models/Review.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* ➕ ADD REVIEW */
router.post("/add", protect, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // prevent duplicate review by same user
    const existing = await Review.findOne({
      productId,
      userId: req.user._id,
    });

    if (existing) {
      return res.status(400).json({ message: "Already reviewed" });
    }

    const review = await Review.create({
      productId,
      userId: req.user._id,
      userName: req.user.name,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    console.error("ADD REVIEW ERROR:", err);
    res.status(500).json({ message: "Failed to add review" });
  }
});

/* 📥 GET REVIEWS BY PRODUCT */
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
    }).sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error("GET REVIEWS ERROR:", err);
    res.status(500).json({ message: "Failed to load reviews" });
  }
});

export default router;