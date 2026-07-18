const foodService = require("../services/foodService");

// ADD Food Item
const addFood = (req, res) => {
    const food = {
        restaurant_id: req.body.restaurant_id,
        food_name: req.body.food_name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: req.file ? req.file.filename : null
    };

    foodService.createFood(food, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
        res.status(201).json({
            success: true,
            message: "Food Added Successfully"
        });
    });
};

// GET All Food Items
const getFoods = (req, res) => {
    foodService.getFoods((err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
        res.json({
            success: true,
            foods: results
        });
    });
};

// GET Food Items by Restaurant ID
const getFoodsByRestaurant = (req, res) => {
    const { restaurantId } = req.params;

    foodService.getFoodsByRestaurant(restaurantId, (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
        res.json({
            success: true,
            foods: results
        });
    });
};

// 🚀 STEP 2 — Added Extract Controller Function to handle Owner Domain context
const getOwnerFoods = (req, res) => {
  foodService.getOwnerFoods(
      req.user.id,
      (err, results) => {
          if (err) {
              return res.status(500).json({
                  success: false,
                  message: err.message
              });
          }
          res.json({
              success: true,
              foods: results
          });
      }
  );
};

// DELETE FOOD
const deleteFood = (req, res) => {
  foodService.deleteFood(req.params.id, req.user.id, (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
    res.json({
      success: true,
      message: "Food Deleted Successfully",
    });
  });
};

// UPDATE FOOD 
const updateFood = (req, res) => {
  foodService.updateFood(req.params.id, req.user.id, req.body, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }
      res.json({
        success: true,
        message: "Food Updated Successfully",
      });
    }
  );
};

// Updated Module Exports (Step 2)
module.exports = {
  addFood,
  getFoods,
  getFoodsByRestaurant,
  getOwnerFoods, 
  deleteFood,
  updateFood,
};