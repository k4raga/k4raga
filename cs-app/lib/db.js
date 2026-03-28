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
      ['01', 'Аим',           'Постановка прицела, Хедшоты, Флик-шоты'],
      ['02', 'Мувмент',       'Контрастрейф, Спрей в движении, Пик угла'],
      ['03', 'Пистолеты',     'Deagle, P250 / P2000, USP-S / Dual Berettas'],
      ['04', 'Автоматы',      'MP7 / MP9, MAC-10, Galil AR / FAMAS'],
      ['05', 'Снайпинг',      'AWP, SSG 08, Флик-шоты'],
      ['06', 'Чиловая катка', 'Deathmatch, Casual, Arms Race'],
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
