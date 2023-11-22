import express from "express";
import dotenv from "dotenv";
import noteRouter from "./routes/NoteRoutes";
import loginRoute from "./routes/LoginRoute";
import signupRoute from "./routes/SignupRoute";
import dbConn from "./config/dbConn";
import cors from "cors";
import verifyJWT from "./middleware/verifyJWT";

dotenv.config();
const app = express();
const port: number = 3500;
dbConn();

app.use(cors());

app.use(express.json());

app.use("/signup", signupRoute);
app.use("/login", loginRoute);
app.use(verifyJWT);
app.use("/notes", noteRouter);

app.listen(port, (): void => {
  console.log(`server running on port ${port} !`);
});
