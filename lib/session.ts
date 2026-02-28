// Session utilities using Web Crypto API only (safe for Edge + Node.js runtimes)

export const SESSION_COOKIE = '__session'
export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

function base64urlEncode(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

function base64urlDecode(str: string): Uint8Array<ArrayBuffer> {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/')
  const pad = padded.length % 4
  const b64 = pad ? padded + '='.repeat(4 - pad) : padded
  const binary = atob(b64)
  const arr = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i)
  return arr
}

async function getHmacKey(): Promise<CryptoKey> {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET is not set')
  const keyBytes = new Uint8Array(secret.match(/.{2}/g)!.map(h => parseInt(h, 16)))
  return crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

export async function createSessionToken(): Promise<string> {
  const payload = JSON.stringify({ u: '1', exp: Date.now() + SESSION_DURATION_MS })
  const payloadB64 = base64urlEncode(new TextEncoder().encode(payload))

  const key = await getHmacKey()
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadB64))
  const sigB64 = base64urlEncode(new Uint8Array(sig))

  return `${payloadB64}.${sigB64}`
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const dot = token.lastIndexOf('.')
    if (dot === -1) return false

    const payloadB64 = token.slice(0, dot)
    const sigB64 = token.slice(dot + 1)

    const key = await getHmacKey()
    const sigBytes = base64urlDecode(sigB64)
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      new TextEncoder().encode(payloadB64)
    )

    if (!valid) return false

    const payload = JSON.parse(new TextDecoder().decode(base64urlDecode(payloadB64)))
    if (typeof payload.exp !== 'number' || Date.now() > payload.exp) return false

    return true
  } catch {
    return false
  }
}
