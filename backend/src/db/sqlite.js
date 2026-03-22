const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const ensureDir = (filePath) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const createSqliteAdapter = (sqlitePath) => {
  const absolutePath = path.resolve(process.cwd(), sqlitePath);
  ensureDir(absolutePath);
  const db = new Database(absolutePath);

  const init = () => {
    db.exec(`
      CREATE TABLE IF NOT EXISTS clientes (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ordens_servico (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orcamentos (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS vendas (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS empresa (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
  };

  const getAll = (table) => {
    const rows = db
      .prepare(`SELECT id, data, created_at, updated_at FROM ${table} ORDER BY updated_at DESC`)
      .all();
    return rows.map((row) => ({
      id: row.id,
      ...JSON.parse(row.data || "{}"),
      _createdAt: row.created_at,
      _updatedAt: row.updated_at,
    }));
  };

  const getById = (table, id) => {
    const row = db
      .prepare(`SELECT id, data, created_at, updated_at FROM ${table} WHERE id = ?`)
      .get(id);
    if (!row) {
      return null;
    }
    return {
      id: row.id,
      ...JSON.parse(row.data || "{}"),
      _createdAt: row.created_at,
      _updatedAt: row.updated_at,
    };
  };

  const upsert = (table, id, payload) => {
    db.prepare(
      `
      INSERT INTO ${table} (id, data, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        data = excluded.data,
        updated_at = CURRENT_TIMESTAMP
    `
    ).run(id, JSON.stringify(payload));
    return getById(table, id);
  };

  const remove = (table, id) => {
    const info = db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
    return info.changes > 0;
  };

  return {
    init,
    getAll,
    getById,
    upsert,
    remove,
  };
};

module.exports = { createSqliteAdapter };
