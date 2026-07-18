const express = require("express");
const router = express.Router();

// Middleware imports
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware"); 

// Controller imports
const {
  getRestaurants,
  addRestaurant,
  searchRestaurants,
  getRestaurantById,
  getOwnerRestaurants,
  deleteRestaurant,
  updateRestaurant // Step 3: Imported controller function wrapper
} = require("../controllers/restaurantController");

// Routes

// 1. Search Route (Keep this above /:id so it doesn't get treated as an ID)
router.get("/search/:keyword", searchRestaurants);

// 2. Get Owner Specific Restaurants 
router.get("/owner", authMiddleware, getOwnerRestaurants);

// 3. Get Single Restaurant Route 
router.get("/:id", getRestaurantById);

// 4. Get All Restaurants Route
router.get("/", getRestaurants);

// 5. Create Restaurant Route 
router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "cover_image", maxCount: 1 }
  ]),
  addRestaurant
);

// 6. Delete Restaurant Route
router.delete("/:id", authMiddleware, deleteRestaurant);

// 🚀 Step 3 — Mount the security gate wrapper onto PUT actions for state mutations
router.put("/:id", authMiddleware, updateRestaurant);

module.exports = router;