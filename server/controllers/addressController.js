const addressService = require("../services/addressService");

// Add Address
const addAddress = async (req, res) => {
  try {
    const result = await addressService.addAddress(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      addressId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add address",
    });
  }
};

// Get Addresses
const getAddresses = async (req, res) => {
  try {
    const addresses = await addressService.getAddresses(req.user.id);

    res.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
    });
  }
};

// Update Address
const updateAddress = async (req, res) => {
  try {
    await addressService.updateAddress(
      req.params.id,
      req.user.id,
      req.body
    );

    res.json({
      success: true,
      message: "Address updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update address",
    });
  }
};

// Delete Address
const deleteAddress = async (req, res) => {
  try {
    await addressService.deleteAddress(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete address",
    });
  }
};

// Set Default Address
const setDefaultAddress = async (req, res) => {
  try {
    await addressService.setDefaultAddress(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      message: "Default address updated",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update default address",
    });
  }
};

module.exports = {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};