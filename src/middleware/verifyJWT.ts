import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { secretKey } from "../controllers/UserController";

interface CustomRequest extends Request {
  user?: any;
}

const verifyJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer")) {
    return res.sendStatus(401);
  }

  const token = bearer.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey) as { user: any };
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
};

export default verifyJWT;
