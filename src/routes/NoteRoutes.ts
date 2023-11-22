import express from "express";
import {
  addNote,
  deleteNote,
  editNote,
  getAllNotes,
  getOneNote,
} from "../controllers/NoteController";

const router = express.Router();

router.route("/").get(getAllNotes).post(addNote);
router.route("/:id").get(getOneNote).put(editNote).delete(deleteNote);

export default router;
