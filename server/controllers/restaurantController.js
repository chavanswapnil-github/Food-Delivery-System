const db = require("../config/db"); 
const restaurantModel = require("../models/restaurantModel");
const restaurantService = require("../services/restaurantService");

// GET All Restaurants
const getRestaurants = async (req, res) => {
  try {
    const results = await restaurantModel.getAllRestaurants();

    res.json({
      success: true,
      restaurants: results,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ADD Restaurant (Handles Multi-File Uploads)
const addRestaurant = async (req, res) => {
  try {
    const restaurant = {
      owner_id: req.user.id, 
      restaurant_name: req.body.restaurant_name,
      description: req.body.description,
      address: req.body.address,
      city: req.body.city,
      logo: req.files && req.files.logo ? req.files.logo[0].filename : "",
      cover_image: req.files && req.files.cover_image ? req.files.cover_image[0].filename : "",
    };

    await restaurantService.createRestaurant(restaurant);

    res.json({
      success: true,
      message: "Restaurant Added Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// SEARCH Restaurants Controller Function
const searchRestaurants = async (req, res) => {
  try {
    const keyword = `%${req.params.keyword}%`;
    const sql = `
      SELECT * FROM restaurants 
      WHERE restaurant_name LIKE ? 
         OR city LIKE ? 
         OR description LIKE ?
    `;
    
    // db.execute returns an array where the first element contains the rows
    const [results] = await db.execute(sql, [keyword, keyword, keyword]);

    res.json({
      success: true,
      restaurants: results,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET Single Restaurant by ID 
const getRestaurantById = async (req, res) => {
  try {
    const result = await restaurantService.getRestaurantById(req.params.id);

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    res.json({
      success: true,
      restaurant: result[0], 
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// GET Owner's Restaurants 
const getOwnerRestaurants = async (req, res) => {
  try {
    const results = await restaurantService.getOwnerRestaurants(req.user.id);
    
    res.json({
      success: true,
      restaurants: results
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// DELETE Restaurant
const deleteRestaurant = async (req, res) => {
  try {
    await restaurantService.deleteRestaurant(req.params.id, req.user.id);

    res.json({
      success: true,
      message: "Restaurant deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// UPDATE Restaurant
const updateRestaurant = async (req, res) => {
  try {
    const restaurant = {
      restaurant_name: req.body.restaurant_name,
      description: req.body.description,
      address: req.body.address,
      city: req.body.city,
    };

    await restaurantService.updateRestaurant(req.params.id, req.user.id, restaurant);

    res.json({
      success: true,
      message: "Restaurant Updated Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Updated Exports
module.exports = {
  getRestaurants,
  addRestaurant,
  searchRestaurants,
  getRestaurantById,
  getOwnerRestaurants,
  deleteRestaurant,
  updateRestaurant 
};