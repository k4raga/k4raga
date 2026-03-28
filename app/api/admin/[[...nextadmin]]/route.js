export const runtime = 'nodejs'
import { createHandler } from '@adminjs/nextjs'
import { getAdmin } from '@/lib/adminSetup'

const authenticate = async (email, password) => {
  if (email === 'admin' && password === 'admin') {
    return { email }
  }
  return null
}

const handler = createHandler(getAdmin, authenticate, {
  cookieName: 'adminjs',
  cookiePassword: 'k4raga-adminjs-secret-key-2026-!!!!'
})

export { handler as GET, handler as POST }
