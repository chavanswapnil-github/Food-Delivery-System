const db = require("../models/couponModel");

// Get All Coupons
const getCoupons = async () => {

    const [rows] = await db.query(
        `SELECT *
         FROM coupons
         WHERE status=1
         AND expiry_date>=CURDATE()`
    );

    return rows;

};

// Validate Coupon
const validateCoupon = async(code,total)=>{

    const [rows]=await db.query(
        `SELECT *
         FROM coupons
         WHERE code=?
         AND status=1
         AND expiry_date>=CURDATE()`,
        [code]
    );

    if(rows.length===0)
        throw new Error("Invalid Coupon");

    const coupon=rows[0];

    if(total<coupon.min_order)
        throw new Error(
            `Minimum order ₹${coupon.min_order}`
        );

    if(coupon.used_count>=coupon.usage_limit)
        throw new Error("Coupon expired");

    let discount=0;

    if(coupon.discount_type==="PERCENT"){

        discount=
        total*coupon.discount_value/100;

        if(
            coupon.max_discount>0 &&
            discount>coupon.max_discount
        ){
            discount=coupon.max_discount;
        }

    }else{

        discount=coupon.discount_value;

    }

    return{
        coupon,
        discount
    };

};

module.exports={
    getCoupons,
    validateCoupon
};