const service=require("../services/favoriteService");

const getFavorites=async(req,res)=>{

    try{

        const data=
        await service.getFavorites(req.user.id);

        res.json({
            success:true,
            favorites:data
        });

    }catch(err){

        console.log(err);

        res.status(500).json({
            success:false
        });

    }

};

const toggleFavorite=async(req,res)=>{

    try{

        const data=
        await service.toggleFavorite(
            req.user.id,
            req.params.foodId
        );

        res.json({
            success:true,
            ...data
        });

    }catch(err){

        console.log(err);

        res.status(500).json({
            success:false
        });

    }

};

module.exports={
    getFavorites,
    toggleFavorite
};