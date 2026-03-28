import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'cs.db')

let db = null

export default function getDb() {
  if (!db) {
    db = new Database(DB_PATH)
    db.exec(`
      CREATE TABLE IF NOT EXISTS training (
        date        TEXT PRIMARY KEY,
        done        INTEGER DEFAULT 0,
        cs_tasks    TEXT    DEFAULT '[]',
        cs_selected TEXT    DEFAULT '[]'
      );

      CREATE TABLE IF NOT EXISTS exercises (
        id    INTEGER PRIMARY KEY AUTOINCREMENT,
        num   TEXT    NOT NULL,
        name  TEXT    NOT NULL,
        hint  TEXT    NOT NULL DEFAULT '',
        active INTEGER NOT NULL DEFAULT 1
      );
    `)

    try { db.exec("ALTER TABLE training ADD COLUMN cs_selected TEXT DEFAULT '[]'") } catch (_) {}

    const EXERCISES = [
      ['01', 'Аим',           'Постановка прицела, хедшоты'],
      ['02', 'Мувмент',       'Контрастрейф, спрей в движении'],
      ['03', 'Пистолеты',     'Deagle, Dual Berettas, P250, P2000, USP-S'],
      ['04', 'Автоматы',      'Galil AR, MP7, MP9, MAC-10, FAMAS'],
      ['05', 'Снайпинг',      'SSG 08, AWP'],
      ['06', 'Чиловая катка', 'Deathmatch, Casual'],
    ]
    const count = db.prepare('SELECT COUNT(*) as n FROM exercises').get().n
    const sync = db.transaction(() => {
      if (count === 0) {
        const insert = db.prepare('INSERT INTO exercises (num, name, hint) VALUES (?, ?, ?)')
        EXERCISES.forEach(([num, name, hint]) => insert.run(num, name, hint))
      } else {
        const update = db.prepare('UPDATE exercises SET num = ?, name = ?, hint = ? WHERE id = ?')
        EXERCISES.forEach(([num, name, hint], i) => update.run(num, name, hint, i + 1))
      }
    })
    sync()
  }
  return db
}
