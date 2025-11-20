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
        log.push(`Eliminado duplicado: ${team.name}`);
      } else {
        seenNames[normalizedName] = true;
        
        if (normalizedName.includes("nacional") && !team.logo) {
             team.logo = "/nacional.jpg";
             await team.save();
        }
      }
    }

    let realMadridStatus = "Ya existía";
    const realMadrid = await Team.findOne({ name: "Real Madrid" });
    
    if (!realMadrid) {
      await Team.create({ 
        name: "Real Madrid", 
        country: "España", 
        type: "club", 
        logo: "/realmadrid.jpg" 
      });
      realMadridStatus = "Creado exitosamente";
    } else {
      if (!realMadrid.logo) {
        realMadrid.logo = "/realmadrid.jpg";
        await realMadrid.save();
        realMadridStatus = "Actualizado con logo";
      }
    }

    let argentinaStatus = "Ya existía";
    const argentina = await Team.findOne({ name: "Argentina" });
    if (!argentina) {
        await Team.create({ 
            name: "Argentina", 
            country: "Argentina", 
            type: "national", 
            logo: "/argentina.jpg" 
        });
        argentinaStatus = "Creado exitosamente";
    }

    res.json({ 
      resultado: "Base de datos optimizada",
      duplicados_eliminados: deletedCount,
      real_madrid: realMadridStatus,
      argentina: argentinaStatus,
      detalle_borrados: log
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error crítico en reparación" });
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

router.get("/seed-from-kits", async (req, res) => {
    try {
      const kits = await Kit.find();
      for (const kit of kits) {
        if (!kit.teamName) continue;
        const exists = await Team.exists({ name: { $regex: new RegExp(`^${kit.teamName}$`, "i") } });
        if (!exists) {
          await Team.create({ name: kit.teamName, country: "Colección", type: "club", logo: "" });
        }
      }
      res.json({ message: "Seed completado" });
    } catch(e) { res.json({error: e.message}) }
});

router.get("/update-logos", async (req, res) => {
    try {
        const mappings = [
          { key: "boca", file: "/boca.jpg" },
          { key: "lorenzo", file: "/sanlorenzo.jpg" },
          { key: "racing", file: "/racing.jpg" },
          { key: "inter", file: "/inter.jpg" },
          { key: "francia", file: "/francia.jpg" },
          { key: "france", file: "/francia.jpg" },
          { key: "japon", file: "/japon.jpg" },
          { key: "japón", file: "/japon.jpg" },
          { key: "city", file: "/mancity.jpg" },
          { key: "venezia", file: "/venecia.jpg" },
          { key: "nacional", file: "/nacional.jpg" },
          { key: "nigeria", file: "/nigeria.jpg" },
          { key: "argentina", file: "/argentina.jpg" },
          { key: "madrid", file: "/realmadrid.jpg" },
          { key: "real", file: "/realmadrid.jpg" }
        ];
        for (const map of mappings) {
          await Team.updateMany({ name: { $regex: map.key, $options: "i" } }, { $set: { logo: map.file } });
        }
        res.json({ message: "Logos actualizados" });
    } catch(e) { res.json({error: e.message}) }
});

export default router;