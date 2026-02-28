import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { createSessionToken, SESSION_COOKIE, SESSION_DURATION_MS } from '@/lib/session'

export const runtime = 'nodejs'

function timingSafeEqual(a: string, b: string): boolean {
  const aBytes = Buffer.from(a, 'utf8')
  const bBytes = Buffer.from(b, 'utf8')
  if (aBytes.length !== bBytes.length) {
    crypto.timingSafeEqual(aBytes, aBytes)
    return false
  }
  return crypto.timingSafeEqual(aBytes, bBytes)
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const expectedUsername = process.env.AUTH_USERNAME ?? ''
    const passwordHashEnv = process.env.AUTH_PASSWORD_HASH ?? ''

    if (!expectedUsername || !passwordHashEnv || !passwordHashEnv.includes('.')) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
    }

    const [saltHex, hashHex] = passwordHashEnv.split('.')
    const saltBuffer = Buffer.from(saltHex, 'hex')
    const expectedHash = Buffer.from(hashHex, 'hex')

    const usernameMatch = timingSafeEqual(String(username ?? ''), expectedUsername)

    let passwordMatch = false
    try {
      const derivedKey = crypto.scryptSync(String(password ?? ''), saltBuffer, 64, {
        N: 16384,
        r: 8,
        p: 1,
      })
      passwordMatch = crypto.timingSafeEqual(derivedKey, expectedHash)
    } catch {
      passwordMatch = false
    }

    if (!usernameMatch || !passwordMatch) {
      await new Promise(r => setTimeout(r, 200 + Math.random() * 100))
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await createSessionToken()
    const isProduction = process.env.NODE_ENV === 'production'
    const maxAge = Math.floor(SESSION_DURATION_MS / 1000)

    const response = NextResponse.json({ ok: true })
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge,
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
