/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['better-sqlite3', 'sqlite3', 'knex'],
}

export default nextConfig
