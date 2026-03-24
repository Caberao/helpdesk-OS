require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createDb } = require("./db");

const app = express();
const port = Number(process.env.PORT || "3333");
const db = createDb();

const ENTITY_TABLE = {
  clientes: "clientes",
  os: "ordens_servico",
  vendas: "vendas",
  empresa: "empresa",
};

const ENTITY_ID_FIELD = {
  clientes: "id",
  os: "id",
  vendas: "numero",
  empresa: "id",
};

const resolveEntity = (name) => ENTITY_TABLE[name] || null;

const resolveRecordId = (entityName, body = {}, paramId = "") => {
  if (paramId) {
    return String(paramId);
  }
  const idField = ENTITY_ID_FIELD[entityName] || "id";
  const raw = body[idField] || body.id || body.numero;
  if (!raw && entityName === "empresa") {
    return "principal";
  }
  return raw ? String(raw) : "";
};

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, provider: (process.env.DB_PROVIDER || "sqlite").toLowerCase() });
});

app.get("/api/:entity", async (req, res) => {
  try {
    const table = resolveEntity(req.params.entity);
    if (!table) {
      return res.status(400).json({ error: "Entidade inválida." });
    }
    const rows = await db.getAll(table);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar registros.", detail: error.message });
  }
});

app.get("/api/:entity/:id", async (req, res) => {
  try {
    const table = resolveEntity(req.params.entity);
    if (!table) {
      return res.status(400).json({ error: "Entidade inválida." });
    }
    const record = await db.getById(table, req.params.id);
    if (!record) {
      return res.status(404).json({ error: "Registro não encontrado." });
    }
    return res.json(record);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar registro.", detail: error.message });
  }
});

app.post("/api/:entity", async (req, res) => {
  try {
    const entityName = req.params.entity;
    const table = resolveEntity(entityName);
    if (!table) {
      return res.status(400).json({ error: "Entidade inválida." });
    }
    const id = resolveRecordId(entityName, req.body);
    if (!id) {
      return res.status(400).json({ error: "ID/Número obrigatório." });
    }
    const payload = { ...req.body };
    const idField = ENTITY_ID_FIELD[entityName] || "id";
    payload[idField] = id;
    const saved = await db.upsert(table, id, payload);
    return res.status(201).json(saved);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao salvar registro.", detail: error.message });
  }
});

app.put("/api/:entity/:id", async (req, res) => {
  try {
    const entityName = req.params.entity;
    const table = resolveEntity(entityName);
    if (!table) {
      return res.status(400).json({ error: "Entidade inválida." });
    }
    const id = resolveRecordId(entityName, req.body, req.params.id);
    if (!id) {
      return res.status(400).json({ error: "ID/Número obrigatório." });
    }
    const payload = { ...req.body };
    const idField = ENTITY_ID_FIELD[entityName] || "id";
    payload[idField] = id;
    const saved = await db.upsert(table, id, payload);
    return res.json(saved);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar registro.", detail: error.message });
  }
});

app.delete("/api/:entity/:id", async (req, res) => {
  try {
    const table = resolveEntity(req.params.entity);
    if (!table) {
      return res.status(400).json({ error: "Entidade inválida." });
    }
    const ok = await db.remove(table, req.params.id);
    if (!ok) {
      return res.status(404).json({ error: "Registro não encontrado." });
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Erro ao excluir registro.", detail: error.message });
  }
});

const boot = async () => {
  try {
    await db.init();
    app.listen(port, () => {
      console.log(`API Helpdesk ativa em http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Falha ao iniciar API:", error.message);
    process.exit(1);
  }
};

boot();
