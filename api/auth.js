import { randomBytes } from 'node:crypto'

/**
 * Espace de gestion (/admin) — connexion GitHub, étape 1 : redirection vers GitHub.
 * Variables d’environnement Vercel : GITHUB_OAUTH_ID et GITHUB_OAUTH_SECRET
 * (OAuth App GitHub, callback : https://<domaine>/api/callback).
 */
const SCOPES = new Set(['repo', 'public_repo', 'repo,user', 'public_repo,user'])

export default function handler(req, res) {
  const clientId = process.env.GITHUB_OAUTH_ID
  if (!clientId) {
    res.status(500).send('GITHUB_OAUTH_ID manquant : à définir dans Vercel → Settings → Environment Variables.')
    return
  }
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const scope = SCOPES.has(req.query.scope) ? req.query.scope : 'repo'
  const state = randomBytes(16).toString('hex')
  res.setHeader('Set-Cookie', `gcg_oauth_state=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`)
  res.setHeader('Cache-Control', 'no-store')
  const params = new URLSearchParams({ client_id: clientId, redirect_uri: `https://${host}/api/callback`, scope, state })
  res.redirect(302, `https://github.com/login/oauth/authorize?${params}`)
}
