import express from "express";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

const router = express.Router();

/*Add to Wishlist */
router.post("/add", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing data" });
    }

    // ensure product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        items: [{ productId }],
      });
    } else {
      const exists = wishlist.items.some(
        i => i.productId.toString() === productId
      );

      if (exists) {
        return res.json({ message: "Already in wishlist" });
      }

      wishlist.items.push({ productId });
    }

    await wishlist.save();
    res.json({ message: "Added to wishlist" });
  } catch (err) {
    console.error("WISHLIST ADD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* GET WISHLIST */
router.get("/:userId", async (req, res) => {
  const wishlist = await Wishlist.findOne({
    userId: req.params.userId,
  }).populate("items.productId");

  if (!wishlist) {
    return res.json({ items: [] });
  }

  const items = wishlist.items.map(i => {
    const p = i.productId;
    return {
      id: p._id,
      name: p.name,
      image: p.image,
      price: p.price,
      discount: p.discount || 0,
    };
  });

  res.json({ items });
});

/* REMOVE FROM WISHLIST */
router.delete("/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.json({ message: "Wishlist empty" });
    }

    wishlist.items = wishlist.items.filter(
      i => i.productId.toString() !== productId
    );

    await wishlist.save();
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error("WISHLIST REMOVE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;