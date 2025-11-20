import express from "express";
import Kit from "../models/kit.js";

const router = express.Router();

router.get("/update-legends", async (req, res) => {
  try {
    const updates = [
      { team: "Inter", number: "10", name: "RONALDO" },
      { team: "City", number: "16", name: "AGUERO" },
      { team: "Manchester City", number: "16", name: "AGUERO" },
      { team: "Francia", number: "10", name: "ZIDANE" },
      { team: "France", number: "10", name: "ZIDANE" }
    ];

    let count = 0;

    for (const item of updates) {
      const resUpdate = await Kit.updateMany(
        { teamName: { $regex: item.team, $options: "i" } },
        { 
          $set: { 
            playerNumber: item.number, 
            playerName: item.name,
            sponsor: undefined 
          }
        }
      );
      count += resUpdate.modifiedCount;
    }

    res.json({ message: `Se actualizaron ${count} camisetas legendarias.` });
  } catch (err) {
    res.status(500).json({ error: "Error actualizando leyendas" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { teamId, season, type, q, limit, page } = req.query;
    const filter = {};

    if (teamId) filter.teamId = teamId;
    if (season) filter.season = season;
    if (type) filter.type = type;

    if (q) {
      filter.$or = [
        { season: { $regex: q, $options: "i" } },
        { supplier: { $regex: q, $options: "i" } },
        { teamName: { $regex: q, $options: "i" } },
        { playerName: { $regex: q, $options: "i" } },
      ];
    }

    const l = parseInt(limit) || 0;
    const p = parseInt(page) || 1;
    const skip = (p - 1) * l;

    const kits = await Kit.find(filter)
      .sort({ createdAt: -1 })
      .limit(l)
      .skip(skip);

    res.json({ data: kits });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener kits" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const kit = await Kit.findById(req.params.id);
    if (!kit) return res.status(404).json({ error: "Kit no encontrado" });
    res.json({ data: kit });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el kit" });
  }
});

router.post("/", async (req, res) => {
  try {
    const kit = new Kit(req.body);
    const saved = await kit.save();
    res.status(201).json({ data: saved });
  } catch (err) {
    res.status(400).json({ error: "Error al crear kit" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedKit = await Kit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedKit) return res.status(404).json({ error: "Kit no encontrado" });
    res.json({ data: updatedKit });
  } catch (err) {
    res.status(400).json({ error: "Error al actualizar kit" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Kit.findByIdAndDelete(req.params.id);
    res.json({ message: "Kit eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar kit" });
  }
});

export default router;