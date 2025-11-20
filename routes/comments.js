import express from "express";
import Comment from "../models/Comment.js";

const router = express.Router();

router.get("/:kitId", async (req, res) => {
  try {
    const comments = await Comment.find({ kitId: req.params.kitId }).sort({ createdAt: -1 });
    res.json({ data: comments });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { kitId, author, message } = req.body;
    if (!kitId || !message) return res.status(400).json({ error: "Faltan datos" });
    
    const comment = await Comment.create({ 
      kitId, 
      author: author || "Anónimo", 
      message 
    });
    res.status(201).json({ data: comment });
  } catch (err) {
    res.status(400).json({ error: "Error al publicar comentario" });
  }
});

export default router;