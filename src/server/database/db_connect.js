import pg from 'pg'

const { Pool } = pg

const config = {
  user: process.env.BD_USER,
  password: process.env.BD_PASSWORD,
  host: process.env.BD_HOST,
  port: process.env.BD_PORT,
  database: process.env.BD_DATABASE,
  allowExitOnIdle: true
}

const pool = new Pool(config)

const db = async (query, values) => {
  try {
    const result = await pool.query(query, values)
    return result.rows
  } catch (error) {
    console.error('[db_connect]= db :', error)
    return error
  }
}

export default db
