"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const config_1 = require("./config");
const authMiddleware_1 = require("./middlewares/authMiddleware");
const app = (0, express_1.default)();
app.use(express_1.default.json()); //step 3.1   remeber to add this, cause we are expecting the body to be json
//step 0 : creating the skeletons
//the endpoints of my application
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //step3:
    //add zod validation
    const username = req.body.username;
    const password = req.body.password;
    //shouldnt directly store someone's password
    //hash it first, can use an ext lib
    try {
        yield db_1.UserModel.create({
            username: username,
            password: password
        });
        res.json({
            msg: "User signed up"
        });
    }
    catch (e) {
        res.status(411).json({
            msg: "user already exists"
        });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //step4:
    const username = req.body.username;
    const password = req.body.password;
    //if user is not signed up
    //ie usernam not in db, then inform right here and return
    const existingUser = yield db_1.UserModel.findOne({
        username, password
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            id: existingUser._id
        }, config_1.JWT_PASSWORD);
        res.json({
            token
        });
    }
    else {
        res.status(403).json({
            msg: "Incorrect Credentials"
        });
    }
}));
app.post("/api/v1/content", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // step6:
    //auth verififcation middleware work here
    //taking in the data : done
    const link = req.body.link;
    const type = req.body.type;
    const title = req.body.title;
    //    const  tag=req.body.tag;
    yield db_1.ContentModel.create({
        link: link,
        type: type,
        title: title,
        userId: req.userId,
        tags: []
        // tags:tag, //this is an array, right? so update it accordingly 
        // userId:figure this out
    });
    res.status(201).json({
        msg: "content added"
    });
}));
app.get("/api/v1/content", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    //c
    const existingUser = yield db_1.UserModel.findOne({
        _id: userId
    });
    if (!existingUser) {
        return res.status(402).json({
            msg: "User dosent exists"
        });
    }
    const content = yield db_1.ContentModel.find({
        userId
    });
    res.status(201).json({
        content,
        msg: "tis is ur content"
    });
}));
app.delete("/api/v1/content/:id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.params.id;
    const deletedContent = yield db_1.ContentModel.findOneAndDelete({
        _id: contentId
    });
    if (!deletedContent) {
        return res.status(400).json({
            content: deletedContent
        });
    }
    res.status(200).json({
        msg: "Content deleted"
    });
}));
app.post("/api/v1/brain/share", authMiddleware_1.authMiddleware, (req, res) => {
});
app.post("/api/v1/brain/:shareLink", authMiddleware_1.authMiddleware, (req, res) => {
});
app.listen(3000, () => {
    console.log("server up on port 3000");
});
