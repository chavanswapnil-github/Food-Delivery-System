const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware"); 

// 🚀 STEP 3 — Expanded Destructuring Controller Method Matrix
const { 
    addFood, 
    getFoods,
    getFoodsByRestaurant,
    getOwnerFoods, 
    updateFood,  
    deleteFood   
} = require("../controllers/foodController");

// Ordered Structural Application Endpoint Routes
// 1. GET Public Feed All
router.get("/", getFoods);

// 2. GET Protected Dashboard Menu Elements (Step 3 - Mounted above generic dynamic path variables)
router.get("/owner", authMiddleware, getOwnerFoods);

// 3. GET Public Filtered Context By Restaurant Link
router.get("/restaurant/:restaurantId", getFoodsByRestaurant);

// 4. POST Multi-part file stream additions
router.post("/", authMiddleware, upload.single("image"), addFood);

// 5. PUT Resource State Mutation Operations
router.put("/:id", authMiddleware, updateFood);

// 6. DELETE Target Entity Operations
router.delete("/:id", authMiddleware, deleteFood);

module.exports = router;