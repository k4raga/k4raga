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

    const first = db.prepare('SELECT name FROM exercises WHERE id = 1').get()
    if (!first || first.name !== 'Аим') {
      db.prepare('DELETE FROM exercises').run()
      const insert = db.prepare('INSERT INTO exercises (num, name, hint) VALUES (?, ?, ?)')
      const seed = db.transaction(() => {
        insert.run('01', 'Аим',        'Постановка прицела, хедшоты')
        insert.run('02', 'Мувмент',    'Остановка на W, стреляем и ползём')
        insert.run('03', 'Пистолеты', 'Дигл, беретта, П250, П200, УСП')
        insert.run('04', 'Вторичное', 'Галил, МП7, МП9, МАК10, Фамас')
        insert.run('05', 'Снайпинг',  'Скаут, АВП')
        insert.run('06', 'Чиловая катка', 'Deathmatch или casual — закрепляем всё на практике')
      })
      seed()
    }
  }
  return db
}
