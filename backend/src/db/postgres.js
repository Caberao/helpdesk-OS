const { Pool } = require("pg");

const createPostgresAdapter = (config) => {
  const pool = new Pool(config);

  const init = async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS ordens_servico (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS vendas (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS empresa (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
  };

  const getAll = async (table) => {
    const { rows } = await pool.query(
      `SELECT id, data, created_at, updated_at FROM ${table} ORDER BY updated_at DESC`
    );
    return rows.map((row) => ({
      id: row.id,
      ...(row.data || {}),
      _createdAt: row.created_at,
      _updatedAt: row.updated_at,
    }));
  };

  const getById = async (table, id) => {
    const { rows } = await pool.query(
      `SELECT id, data, created_at, updated_at FROM ${table} WHERE id = $1 LIMIT 1`,
      [id]
    );
    if (!rows.length) {
      return null;
    }
    const row = rows[0];
    return {
      id: row.id,
      ...(row.data || {}),
      _createdAt: row.created_at,
      _updatedAt: row.updated_at,
    };
  };

  const upsert = async (table, id, payload) => {
    await pool.query(
      `
      INSERT INTO ${table} (id, data, updated_at)
      VALUES ($1, $2::jsonb, NOW())
      ON CONFLICT (id) DO UPDATE SET
        data = excluded.data,
        updated_at = NOW()
    `,
      [id, JSON.stringify(payload)]
    );
    return getById(table, id);
  };

  const remove = async (table, id) => {
    const result = await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
    return result.rowCount > 0;
  };

  return {
    init,
    getAll,
    getById,
    upsert,
    remove,
  };
};

module.exports = { createPostgresAdapter };
