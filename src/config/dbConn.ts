import mongoose from "mongoose";

const connectionString: string = process.env.CONN_STRING || "";

const dbConn = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Michyb13:Michael13@cluster0.8nlc71g.mongodb.net/NotesDB?retryWrites=true&w=majority"
    );
    console.log("DB Connected");
  } catch (err) {
    console.log(err);
  }
};

export default dbConn;
