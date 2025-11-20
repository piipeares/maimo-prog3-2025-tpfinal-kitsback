import express from "express";
import Team from "../models/Team.js";
import Kit from "../models/kit.js";

const router = express.Router();

router.get("/fix-data", async (req, res) => {
  try {
    const allTeams = await Team.find();
    const seenNames = {};
    let deletedCount = 0;
    let log = [];

    for (const team of allTeams) {
      const normalizedName = team.name.trim().toLowerCase().replace(/\s+/g, ' ');
      
      if (seenNames[normalizedName]) {
        await Team.findByIdAndDelete(team._id);
        deletedCount++;
        log.push(`Eliminado general: ${team.name}`);
      } else {
        seenNames[normalizedName] = true;
      }
    }

    const nacionals = await Team.find({ 
      name: { $regex: "Nacional", $options: "i" } 
    });

    const montevideoTeams = nacionals.filter(t => t.name.toLowerCase().includes("montevideo"));

    if (montevideoTeams.length > 1) {
      for (let i = 1; i < montevideoTeams.length; i++) {
        await Team.findByIdAndDelete(montevideoTeams[i]._id);
        deletedCount++;
        log.push(`Eliminado duplicado específico: ${montevideoTeams[i].name}`);
        
        await Kit.updateMany(
          { teamId: montevideoTeams[i]._id },
          { $set: { teamId: montevideoTeams[0]._id } }
        );
      }
    }

    const requiredTeams = [
        { name: "Argentina", logo: "/argentina.jpg", type: "national", country: "Argentina" },
        { name: "Real Madrid", logo: "/realmadrid.jpg", type: "club", country: "España" }
    ];

    for (const reqTeam of requiredTeams) {
        const exists = await Team.findOne({ name: { $regex: new RegExp(`^${reqTeam.name}$`, "i") } });
        if (!exists) {
            await Team.create(reqTeam);
            log.push(`Creado faltante: ${reqTeam.name}`);
        } else if (!exists.logo) {
            exists.logo = reqTeam.logo;
            await exists.save();
        }
    }

    res.json({ 
      resultado: "Base de datos reparada",
      eliminados: deletedCount,
      detalle: log
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en la reparación" });
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

router.get("/seed-from-kits", async (req, res) => { res.json({message: "Use /fix-data"}); });
router.get("/update-logos", async (req, res) => { res.json({message: "Use /fix-data"}); });

router.post("/", async (req, res) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json({ data: team });
  } catch (err) {
    res.status(400).json({ error: "Error al crear equipo" });
  }
});

export default router;