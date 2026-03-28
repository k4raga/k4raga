import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'cs.db')

let db = null

export default function getDb() {
  if (!db) {
    db = new Database(DB_PATH)
    db.exec(`
      CREATE TABLE IF NOT EXISTS training (
        date      TEXT PRIMARY KEY,
        done      INTEGER DEFAULT 0,
        cs_tasks  TEXT    DEFAULT '[]'
      );

      CREATE TABLE IF NOT EXISTS exercises (
        id    INTEGER PRIMARY KEY AUTOINCREMENT,
        num   TEXT    NOT NULL,
        name  TEXT    NOT NULL,
        hint  TEXT    NOT NULL DEFAULT '',
        active INTEGER NOT NULL DEFAULT 1
      );
    `)

    const count = db.prepare('SELECT COUNT(*) as n FROM exercises').get().n
    if (count === 0) {
      const insert = db.prepare('INSERT INTO exercises (num, name, hint) VALUES (?, ?, ?)')
      const seed = db.transaction(() => {
        insert.run('01', 'Постановка прицела', 'Crosshair placement — держим на уровне головы')
        insert.run('02', 'Остановка на W',     'Counter-strafe — мгновенная остановка перед стрельбой')
        insert.run('03', 'Дигл',               'Desert Eagle — тренируем one-tap на дальние дистанции')
        insert.run('04', 'Стреляем и ползём',  'Spray transfer + движение — контроль отдачи в движении')
        insert.run('05', 'Скаут / АВП',        'Снайпер — quick scope и flick shots')
        insert.run('06', 'Чиловая катка',      'Deathmatch или casual — закрепляем всё на практике')
      })
      seed()
    }
  }
  return db
}
