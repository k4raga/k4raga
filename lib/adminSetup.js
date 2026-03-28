import AdminJS from 'adminjs'
import { Adapter, Resource, Database } from '@adminjs/sql'
import Knex from 'knex'
import path from 'path'

AdminJS.registerAdapter({ Resource, Database })

let cachedAdmin = null

export async function getAdmin() {
  if (cachedAdmin) return cachedAdmin

  const knex = Knex({
    client: 'sqlite3',
    connection: { filename: path.join(process.cwd(), 'training.db') },
    useNullAsDefault: true
  })

  // Ensure table exists before AdminJS introspects it
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS training (
      date      TEXT PRIMARY KEY,
      cs        INTEGER DEFAULT 0,
      voice     INTEGER DEFAULT 0,
      cs_tasks  TEXT    DEFAULT '[]'
    )
  `)

  const db = await Database.build(knex)

  cachedAdmin = new AdminJS({
    databases: [db],
    rootPath: '/api/admin',
    branding: {
      companyName: 'K4RAGA Admin',
      logo: false,
      favicon: '',
      theme: {
        colors: {
          primary100: '#D40000',
          primary80:  '#b30000',
          primary60:  '#8B0000',
          accent:     '#D40000',
          love:       '#D40000',
          filterBg:   '#141416',
          defaultText: '#F0F0F0',
          grey80:     '#6B6B78',
        }
      }
    }
  })

  return cachedAdmin
}
