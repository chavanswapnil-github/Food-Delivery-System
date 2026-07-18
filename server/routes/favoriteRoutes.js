const router=require("express").Router();

const auth=require("../middleware/authMiddleware");

const{
getFavorites,
toggleFavorite
}=require("../controllers/favoriteController");

router.get("/",auth,getFavorites);

router.post("/:foodId",auth,toggleFavorite);

module.exports=router;