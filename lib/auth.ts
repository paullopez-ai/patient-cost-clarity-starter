import { cookies } from 'next/headers'
import { verifySessionToken, SESSION_COOKIE } from '@/lib/session'

export async function requireAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const valid = token ? await verifySessionToken(token) : false

  if (!valid) {
    throw new Error('Unauthorized')
  }

  return { userId: '1' }
}

export async function getOptionalAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const valid = token ? await verifySessionToken(token) : false

  return { userId: valid ? '1' : null }
}
