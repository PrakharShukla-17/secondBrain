import { NextFunction,Request,Response} from "express";
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from "../config";
import { stringify } from "node:querystring";




//step//9 after making custom.d.ts
interface JwtPayload{
    id?:string
}
 
//step 7
 export const authMiddleware=(req:Request, res:Response, next:NextFunction)=>{
    

     const authHeader=req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
  return res.status(401).json({
    msg: "Token missing or invalid"
  });
}

const token = authHeader.split(" ")[1];
    

    

    if(!token){
        res.status(403).json({
            msg:"No token provided, thus access was denied"
        })
        return;
    }
    
    try{
        const decoded=jwt.verify(token as string ,JWT_PASSWORD) as JwtPayload;
        
       //step 8:figuring this shit out....last stopped
       //figured.
        req.userId=decoded.id;
        next();

    }catch(e){
          return res.status(403).json({
                msg:"You're not logged in"
            })
    }
 }