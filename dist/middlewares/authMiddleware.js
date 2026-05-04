"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
//step 7
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            msg: "Token missing or invalid"
        });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(403).json({
            msg: "No token provided, thus access was denied"
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_PASSWORD);
        //step 8:figuring this shit out....last stopped
        //figured.
        req.userId = decoded.id;
        next();
    }
    catch (e) {
        return res.status(403).json({
            msg: "You're not logged in"
        });
    }
};
exports.authMiddleware = authMiddleware;
