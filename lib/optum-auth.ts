import { APP_MODE, type AppMode } from './config'

interface TokenCache {
  token: string
  expiresAt: number
}

let cachedToken: TokenCache | null = null

export async function getOptumBearerToken(mode: AppMode = APP_MODE): Promise<string> {
  if (mode === 'mock') return 'mock-bearer-token'

  // Check cache — 60-second buffer before expiry
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token
  }

  const clientId = process.env.OPTUM_CLIENT_ID
  const clientSecret = process.env.OPTUM_CLIENT_SECRET
  const authUrl = process.env.OPTUM_AUTH_URL

  if (!clientId || !clientSecret || !authUrl) {
    throw new Error('Optum API credentials not configured. Set OPTUM_CLIENT_ID, OPTUM_CLIENT_SECRET, and OPTUM_AUTH_URL.')
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  })

  const response = await fetch(authUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Optum auth failed (${response.status}): ${errorText}`)
  }

  const data = await response.json()

  if (!data.access_token || !data.expires_in) {
    throw new Error('Optum auth response missing access_token or expires_in')
  }

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }

  return cachedToken.token
}
