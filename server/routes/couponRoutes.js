const router=require("express").Router();

const{
getCoupons,
validateCoupon
}=require("../controllers/couponController");

router.get("/",getCoupons);

router.post("/apply",validateCoupon);

module.exports=router;