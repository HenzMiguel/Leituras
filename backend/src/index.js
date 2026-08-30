import express from "express";
import cors from "cors";

import { conectarBanco, livrosCollection } from "./db.js";

await conectarBanco();

const collection = livrosCollection();

const api = express();
const router = express.Router();

api.use(cors());
api.use(express.json());

api.get("/", (req, res) => {
  res.json({ message: "up and running" });
});

router.get("/livros", async (_req, res) => {
  try {
    const livros = await collection.find().sort({ id: 1 }).toArray();
    res.json(livros);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar livros." });
  }
});

router.get("/livros/:id", async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "O id deve ser um inteiro." });
  }

  try {
    const livro = await collection.findOne({ id });
    if (!livro) {
      return res.status(404).json({ message: "Livro não encontrado." });
    }
    res.json(livro);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar livro." });
  }
});

router.post("/livros", async (req, res) => {
  try {
    const resultado = await collection.insertOne(req.body);
    const livro = await collection.findOne({ _id: resultado.insertedId });
    res.status(201).json(livro);
  } catch (error) {
    responderErroBanco(error, res, "Erro ao cadastrar livro.");
  }
});

router.put("/livros/:id", async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "O id deve ser um inteiro." });
  }

  try {
    const resultado = await collection.findOneAndUpdate(
      { id },
      { $set: { ...req.body, id } },
      { returnDocument: "after" }
    );
    if (!resultado) {
      return res.status(404).json({ message: "Livro não encontrado." });
    }
    res.json(resultado);
  } catch (error) {
    responderErroBanco(error, res, "Erro ao atualizar livro.");
  }
});

router.delete("/livros/:id", async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: "O id deve ser um inteiro." });
  }

  try {
    const resultado = await collection.deleteOne({ id });
    if (resultado.deletedCount === 0) {
      return res.status(404).json({ message: "Livro não encontrado." });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover livro." });
  }
});

function responderErroBanco(error, res, mensagemPadrao) {
  if (error.code === 11000) {
    return res.status(409).json({ message: "Já existe um livro com esse id." });
  }
  if (error.code === 121) {
    return res.status(400).json({ message: "Dados do livro inválidos." });
  }
  res.status(500).json({ message: mensagemPadrao });
}

api.use("/api", router);

api.listen(3000, () => {
  console.log("Servidor iniciado na porta 3000");
});