const service=require("../services/couponService");

const getCoupons=async(req,res)=>{

    const coupons=
    await service.getCoupons();

    res.json({
        success:true,
        coupons
    });

};

const validateCoupon=async(req,res)=>{

    try{

        const data=
        await service.validateCoupon(
            req.body.code,
            req.body.total
        );

        res.json({
            success:true,
            ...data
        });

    }catch(err){

        res.status(400).json({
            success:false,
            message:err.message
        });

    }

};

module.exports={
    getCoupons,
    validateCoupon
};