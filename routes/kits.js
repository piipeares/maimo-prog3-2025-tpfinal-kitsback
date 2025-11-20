import express from "express";
import Kit from "../models/kit.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { teamId, season, type, q } = req.query;
    const filter = {};

    if (teamId) filter.teamId = teamId;
    if (season) filter.season = season;
    if (type) filter.type = type;

    if (q) {
      filter.$or = [
        { season: { $regex: q, $options: "i" } },
        { supplier: { $regex: q, $options: "i" } },
        { sponsor: { $regex: q, $options: "i" } },
      ];
    }

    const kits = await Kit.find(filter).sort({ createdAt: -1 });
    res.json({ data: kits });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener kits" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      teamId,
      teamName,
      season,
      type,
      supplier,
      sponsor,
      code,
      images,
      tags,
      notes,
    } = req.body;

    const kit = new Kit({
      teamId: teamId || null,
      teamName: teamName || "",
      season,
      type,
      supplier,
      sponsor,
      code,
      images: images || [],
      tags: tags || [],
      notes,
    });

    const saved = await kit.save();
    res.status(201).json({ data: saved });
  } catch (err) {
    res.status(400).json({ error: "Error al crear kit" });
  }
});

export default router;