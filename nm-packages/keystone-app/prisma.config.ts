import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'schema.prisma',
  migrations: {
    path: 'migrations',
  },
  datasource: {
    url:
      process.env.DATABASE_URL ||
      'postgres://postgres:password@localhost:5432/keystone',
  },
})
