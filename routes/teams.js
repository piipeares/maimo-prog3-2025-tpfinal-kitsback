import express from "express";
import Team from "../models/Team.js";
import Kit from "../models/kit.js";

const router = express.Router();

router.get("/seed-from-kits", async (req, res) => {
  try {
    const kits = await Kit.find();
    const stats = { teamsCreated: 0, kitsUpdated: 0 };

    for (const kit of kits) {
      if (!kit.teamName) continue;

      let team = await Team.findOne({ name: kit.teamName });
      
      if (!team) {
        team = await Team.create({
          name: kit.teamName,
          country: "Mundo",
          type: "club",
          logo: ""
        });
        stats.teamsCreated++;
      }

      if (!kit.teamId || kit.teamId.toString() !== team._id.toString()) {
        kit.teamId = team._id;
        await kit.save();
        stats.kitsUpdated++;
      }
    }

    res.json({ 
      message: "Sincronización exitosa", 
      details: `Se crearon ${stats.teamsCreated} equipos y se vincularon ${stats.kitsUpdated} camisetas.` 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al sincronizar equipos" });
  }
});

router.get("/update-logos", async (req, res) => {
  try {
    const mappings = [
      { key: "boca", file: "/boca.jpg" },
      { key: "lorenzo", file: "/sanlorenzo.jpg" },
      { key: "racing", file: "/racing.jpg" },
      { key: "inter", file: "/inter.jpg" },
      { key: "francia", file: "/francia.jpg" },
      { key: "japon", file: "/japon.jpg" },
      { key: "japón", file: "/japon.jpg" },
      { key: "city", file: "/mancity.jpg" },
      { key: "venezia", file: "/venecia.jpg" },
      { key: "venecia", file: "/venecia.jpg" },
      { key: "nacional", file: "/nacional.jpg" },
      { key: "nigeria", file: "/nigeria.jpg" }
    ];

    let updatedCount = 0;

    for (const map of mappings) {
      const result = await Team.updateMany(
        { name: { $regex: map.key, $options: "i" } },
        { $set: { logo: map.file } }
      );
      updatedCount += result.modifiedCount;
    }

    res.json({ message: `Se actualizaron ${updatedCount} logos correctamente.` });
  } catch (err) {
    res.status(500).json({ error: "Error actualizando logos" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { country, type, q } = req.query;
    const filter = {};
    if (country) filter.country = country;
    if (type) filter.type = type;
    if (q) filter.name = { $regex: q, $options: "i" };

    const teams = await Team.find(filter).sort({ name: 1 });
    res.json({ data: teams });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener equipos" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ error: "Equipo no encontrado" });
    res.json({ data: team });
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el equipo" });
  }
});

router.post("/", async (req, res) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json({ data: team });
  } catch (err) {
    res.status(400).json({ error: "Error al crear equipo" });
  }
});

export default router;