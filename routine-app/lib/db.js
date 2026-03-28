import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'routine.db')
let db = null

export default function getDb() {
  if (!db) {
    db = new Database(DB_PATH)
    db.exec(`
      CREATE TABLE IF NOT EXISTS training (
        date  TEXT PRIMARY KEY,
        done  INTEGER DEFAULT 0,
        tasks TEXT DEFAULT '[]'
      );
      CREATE TABLE IF NOT EXISTS habits (
        id     INTEGER PRIMARY KEY AUTOINCREMENT,
        num    TEXT NOT NULL,
        name   TEXT NOT NULL,
        hint   TEXT NOT NULL DEFAULT '',
        active INTEGER NOT NULL DEFAULT 1
      );
    `)

    try { db.exec("ALTER TABLE training ADD COLUMN tasks TEXT DEFAULT '[]'") } catch (_) {}

    const HABITS = [
      ['01', 'Растяжка', 'Утренняя растяжка и разминка тела'],
      ['02', 'Поток',    'Сессия глубокого фокуса без отвлечений'],
      ['03', 'Сон',      'Лёг вовремя, 7–9 часов качественного сна'],
    ]

    const count = db.prepare('SELECT COUNT(*) as n FROM habits').get().n
    const sync = db.transaction(() => {
      if (count === 0) {
        const insert = db.prepare('INSERT INTO habits (num, name, hint) VALUES (?, ?, ?)')
        HABITS.forEach(([num, name, hint]) => insert.run(num, name, hint))
      } else {
        const update = db.prepare('UPDATE habits SET num = ?, name = ?, hint = ? WHERE id = ?')
        HABITS.forEach(([num, name, hint], i) => update.run(num, name, hint, i + 1))
      }
    })
    sync()
  }
  return db
}
