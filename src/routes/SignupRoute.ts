import express from "express";
import { signup } from "../controllers/UserController";

const router = express.Router();

router.route("/").post(signup);

export default router;
