import { Request, Response } from "express";
import noteSchema from "../Models/Notes";

export const handleErrorResponse = (
  res: Response,
  statusCode: number,
  message: string
) => {
  return res.status(statusCode).json({ message });
};
interface CustomRequest extends Request {
  user?: any;
}

export const getAllNotes = async (req: CustomRequest, res: Response) => {
  const user = req.user;
  try {
    const notes = await noteSchema.find({ user }).sort({ createdAt: -1 });
    if (!notes) return handleErrorResponse(res, 404, "No Notes Available");
    return res.status(200).json(notes);
  } catch (err) {
    console.error(err);
    return handleErrorResponse(res, 500, "Internal Server Error");
  }
};

export const getOneNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const note = await noteSchema.findById(id);
    if (!note) return handleErrorResponse(res, 404, "No Note Found");
    return res.status(200).json(note);
  } catch (err) {
    console.error(err);
    return handleErrorResponse(res, 500, "Internal Server Error");
  }
};

export const addNote = async (req: CustomRequest, res: Response) => {
  const { title, content } = req.body;
  const user = req.user;
  if (!title || !content)
    return handleErrorResponse(res, 400, "All fields are required");
  try {
    const newNote = await noteSchema.create({
      title: title,
      content: content,
      user: user,
    });
    return res.status(201).json(newNote);
  } catch (err) {
    console.error(err);
    return handleErrorResponse(res, 500, "Internal Server Error");
  }
};

export const editNote = async (req: Request, res: Response) => {
  const { editTitle, editContent } = req.body;
  const { id } = req.params;
  if (!editTitle || !editContent)
    return handleErrorResponse(res, 400, "All fields are required");
  try {
    const note = await noteSchema.findById(id);
    if (!note) return handleErrorResponse(res, 404, "No Note Found");
    note.title = editTitle;
    note.content = editContent;
    await note.save();
    res.status(200).json(note);
  } catch (err) {
    console.error(err);
    return handleErrorResponse(res, 500, "Internal Server Error");
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const note = await noteSchema.findById(id);
    if (!note) return handleErrorResponse(res, 404, "No Note Found");
    await note.deleteOne();
    res.status(200).json(note);
  } catch (err) {
    console.error(err);
    return handleErrorResponse(res, 500, "Internal Server Error");
  }
};
