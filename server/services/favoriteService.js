const db = require("../models/favoriteModel");

// Get Favorites
const getFavorites = async (userId) => {

    const [rows] = await db.query(`
        SELECT
            f.id,
            foods.id AS food_id,
            foods.food_name,
            foods.price,
            foods.image,
            restaurants.restaurant_name
        FROM favorites f
        JOIN foods
            ON f.food_id=foods.id
        JOIN restaurants
            ON foods.restaurant_id=restaurants.id
        WHERE f.user_id=?
    `,[userId]);

    return rows;
};

// Toggle Favorite
const toggleFavorite = async(userId,foodId)=>{

    const [exist]=await db.query(
        `SELECT * FROM favorites
         WHERE user_id=? AND food_id=?`,
        [userId,foodId]
    );

    if(exist.length){

        await db.query(
            `DELETE FROM favorites
             WHERE user_id=? AND food_id=?`,
            [userId,foodId]
        );

        return{
            removed:true
        };

    }

    await db.query(
        `INSERT INTO favorites(user_id,food_id)
         VALUES(?,?)`,
        [userId,foodId]
    );

    return{
        removed:false
    };

};

module.exports={
    getFavorites,
    toggleFavorite
};