const express = require("express");
const Team = require("../models/Team");

const router = express.Router();

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

router.post("/", async (req, res) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json({ data: team });
  } catch (err) {
    res.status(400).json({ error: "Error al crear equipo" });
  }
});

module.exports = router;