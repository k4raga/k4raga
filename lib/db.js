import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'training.db')

let db = null

export default function getDb() {
  if (!db) {
    db = new Database(DB_PATH)
    db.exec(`
      CREATE TABLE IF NOT EXISTS training (
        date      TEXT PRIMARY KEY,
        cs        INTEGER DEFAULT 0,
        voice     INTEGER DEFAULT 0,
        cs_tasks  TEXT    DEFAULT '[]'
      )
    `)
  }
  return db
}
