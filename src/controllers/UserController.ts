import { Request, Response } from "express";
import userSchema from "../Models/User";
import bcrypt from "bcrypt";
import passwordValidator from "password-validator";
import jwt from "jsonwebtoken";
import { handleErrorResponse } from "./NoteController";

const schema = new passwordValidator().is().min(8).uppercase();

export const secretKey: string =
  "e5fcf126270b8d3eb4f492f659b7c28efbb7baa427e990c09d6d63d4b90bb488f0bcdbc26befa66d057b4c476de632aa10565d9cea88bf139102bfc4ff56f6d8";

export const signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return handleErrorResponse(res, 400, "All fields are required.");
  if (!schema.validate(password))
    return handleErrorResponse(
      res,
      400,
      "Password must be 8 characters and have an uppercase "
    );
  try {
    const existingUserEmail = await userSchema.findOne({ email });
    if (existingUserEmail)
      return handleErrorResponse(
        res,
        409,
        "User with this email already exists"
      );
    const existingUserUsername = await userSchema.findOne({ username });
    if (existingUserUsername)
      return handleErrorResponse(
        res,
        409,
        "User with this username already exists"
      );
    const hashedPassword = await bcrypt.hashSync(password, 10);
    const newUser = await userSchema.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    const token = jwt.sign({ user: username }, secretKey, {
      expiresIn: "1d",
    });

    return res.status(200).json({ user: username, token: token });
  } catch (err) {
    console.error(err);
    return handleErrorResponse(res, 500, "Internal Server Error");
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return handleErrorResponse(res, 400, "All fields are required.");
  if (!schema.validate(password))
    return handleErrorResponse(
      res,
      400,
      "Password must be 8 characters and have an uppercase "
    );
  try {
    const user = await userSchema.findOne({ email });
    if (!user) return handleErrorResponse(res, 404, "User doesn't exist");
    const confirmPassword = await bcrypt.compare(password, user.password);
    if (!confirmPassword)
      return handleErrorResponse(res, 400, "Password is incorrect.");
    const token = jwt.sign({ user: user.username }, secretKey, {
      expiresIn: "1d",
    });
    return res.status(200).json({ user: user.username, token: token });
  } catch (err) {
    console.error(err);
    return handleErrorResponse(res, 500, "Internal Server Error");
  }
};
