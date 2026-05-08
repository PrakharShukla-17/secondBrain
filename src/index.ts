import express from "express"
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import { ContentModel, LinkModel, UserModel } from "./db";
import { JWT_PASSWORD } from "./config";
import { authMiddleware } from "./middlewares/authMiddleware";
import { random } from "./utils";

const app=express();

app.use(express.json());//step 3.1   remeber to add this, cause we are expecting the body to be json

//step 0 : creating the skeletons
//the endpoints of my application

app.post("/api/v1/signup", async(req,res)=>{
//step3:

    //add zod validation

    const username=req.body.username;
    const password=req.body.password;

    //shouldnt directly store someone's password
    //hash it first, can use an ext lib
   try{
   await UserModel.create({
        username:username,
        password:password
    })

    res.json({
        msg:"User signed up"
    })
   }
   catch(e){
        res.status(411).json({
            msg:"user already exists"
        })
   }
})

app.post("/api/v1/signin",async(req,res)=>{
    //step4:

    const username=req.body.username;
    const password=req.body.password;


    //if user is not signed up
    //ie usernam not in db, then inform right here and return

    const existingUser= await UserModel.findOne({
        username,password
    })

    if(existingUser){
       const token= jwt.sign({
            id:existingUser._id
        },JWT_PASSWORD)

        res.json({
            token
        })
    }else{
        res.status(403).json({
            msg:"Incorrect Credentials"
        })
    }

})

app.post("/api/v1/content",authMiddleware,async(req,res)=>{
// step6:
   //auth verififcation middleware work here
   //taking in the data : done

   const  link=req.body.link;
   const  type=req.body.type;
   const  title=req.body.title;
//    const  tag=req.body.tag;
   

   await ContentModel.create({
    link:link,
    type:type,
    title:title, 
    userId:req.userId,
    tags:[]
    // tags:tag, //this is an array, right? so update it accordingly 
    // userId:figure this out
   })
     
   res.status(201).json({
    msg:"content added"
   })
})

app.get("/api/v1/content",authMiddleware,async (req,res)=>{
    const userId=req.userId;


    //c


    const existingUser=await UserModel.findOne({
        _id:userId
    })

    if(!existingUser){
       return res.status(402).json({
        msg:"User dosent exists"
       })
    }

    const content= await ContentModel.find({
            userId
        })

        res.status(201).json({
            content,
            msg:"tis is ur content"
        })
})

app.delete("/api/v1/content/:id",authMiddleware,async(req,res)=>{
    const contentId=req.params.id;
    const deletedContent= await ContentModel.findOneAndDelete({
        _id:contentId,
        userId:req.userId
    })
    if(!deletedContent){
        return res.status(400).json({
            content: deletedContent
        })
    }

    res.status(200).json({
        msg:"Content deleted"
    })
})

app.post("/api/v1/brain/share",authMiddleware,async(req,res)=>{
        const share=req.body.share;
        const hash=random(10);
        if(share){

         const existingLink = await LinkModel.findOne({
           userId: req.userId,
         });

         if(existingLink){
            return res.status(300).json({
                msg:existingLink.hash
            })
         }

            await LinkModel.create({
                userId:req.userId,
                hash: hash
            })
        }else{
            await LinkModel.deleteOne({
                userId:req.userId
            })

            return res.json({
                msg:"Link no longer exists"
            })
        }

        res.json({
            msg:"Sharable Link updated succesfully",
            hash:hash
        })
})

app.get("/api/v1/brain/:shareLink",async (req,res)=>{
        const hash=req.params.shareLink;

        const Link=await LinkModel.findOne({
            hash:hash
        })

        if(!Link){
            return res.status(402).json({
                msg:"the sharable hash doesnt exist now"
            })
        }


        const linkContent=await ContentModel.find({
            userId:Link.userId
        })

        const user=await UserModel.findOne({
            _id:Link.userId
        })

        if(!user){
            return res.status(412).json({
                msg:"this ideally shouldnt happen, but it did?"
            })
        }


        res.status(200).json({
            username:user.username,
            content:linkContent
        })
})


app.listen(3000,()=>{
    console.log("server up on port 3000");
})