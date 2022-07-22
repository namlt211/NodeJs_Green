import jwt from "jsonwebtoken";
import { Role } from "../models/UserRole.js";
export const verifyAccessToken = (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid");
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated");
  }
};
export const verifyTokenAdmin = (req, res, next) => {
  verifyAccessToken(req, res, async () => {
    let id = req.user.userRole;
    const result = await Role.findOne({ _id: id });
    if (result.name === "ADMIN") {
      next();
    } else {
      res
        .status(403)
        .json({ success: false, message: "You're not authenticated" });
    }
  });
};

export const createBy = (token) => {
  const accessToken = token.split(" ")[1];
  let userId = "";
  jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json("Token is not valid");
    }
    userId = user.id;
  });
  return userId;
};
