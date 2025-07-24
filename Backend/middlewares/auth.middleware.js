import jwt from 'jsonwebtoken';
import redisClient from '../services/redis.service.js';

export const auth = async (req,res,next)=>{
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    if(!token){
        res.status(401).json({message:"Unauthorized Access"});
    }

    try {

        const isTokenBlacklisted = await redisClient.get(token);
        
        if (isTokenBlacklisted) {  
            return res.status(403).json({message:"Token is Blacklisted"});
         }


        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({message:"Invalid Token"});
    }
}