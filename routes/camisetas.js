import express from "express";
const router = express.Router();
import Camiseta from "../models/camiseta.js";

const findAllCamisetas = async (req, res) => {
  try {
    const Camisetas = await Camiseta.find().select("_id name price categories");
    return res
      .status(200)
      .send({ message: "Todos los Camisetas", Camisetas: Camisetas });
  } catch (error) {
    return res.status(501).send({ message: "Hubo un error", error });
  }
};

const findOneCamiseta = async (req, res) => {
  const { id } = req.params;
  try {
    const Camiseta = await Camiseta.findOne({ _id: id }).select("_id name price categories");
    return res.status(200).send({ message: "Camisetao encontrado", Camiseta });
  } catch (error) {
    return res.status(501).send({ message: "Hubo un error", error });
  }
};

const addCamiseta = async (req, res) => {
  const { name, price, categories } = req.body;
  try {
    const Camiseta = new Camiseta({ name, price, categories });
    await Camiseta.save();
    return res.status(200).send({ message: "Camisetao creado", Camiseta });
  } catch (error) {
    return res.status(501).send({ message: "Hubo un error", error });
  }
};

const deleteCamiseta = async (req, res) => {
  const { id } = req.params;
  try {
    const CamisetaToDelete = await Camiseta.findOne({ _id: id });
    if (!CamisetaToDelete) {
      return res.status(404).send({ message: "No existe el Camisetao", id: id });
    }
    await Camiseta.deleteOne({ _id: id });
    return res
      .status(200)
      .send({ message: "Camisetao borrado", Camiseta: CamisetaToDelete });
  } catch (error) {
    return res.status(501).send({ message: "Hubo un error", error });
  }
};

const updateCamiseta = async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    const CamisetaToUpdate = await Camiseta.findOne({ _id: id });
    if (!CamisetaToUpdate) {
      return res.status(404).send({ message: "No existe el Camisetao", id: id });
    }

    //Valores a actualizar
    CamisetaToUpdate.name = name;
    CamisetaToUpdate.price = price;



    await CamisetaToUpdate.save();
    return res
      .status(200)
      .send({ message: "Camisetao actualizado", Camiseta: CamisetaToUpdate });
  } catch (error) {
    return res.status(501).send({ message: "Hubo un error", error });
  }
};

//CRUD endpoints
router.get("/", findAllCamisetas);
router.get("/:id", findOneCamiseta);
router.post("/", addCamiseta);
router.put("/:id", updateCamiseta);
router.delete("/:id", deleteCamiseta);

export default router;