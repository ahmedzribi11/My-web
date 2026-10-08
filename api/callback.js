/**
 * Espace de gestion (/admin) — connexion GitHub, étape 2 : échange du code contre un jeton,
 * transmis à la fenêtre /admin du même domaine (protocole Decap CMS).
 */
export default async function handler(req, res) {
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const origin = `https://${host}`
  const cookie = /(?:^|;\s*)gcg_oauth_state=([a-f0-9]+)/.exec(req.headers.cookie || '')?.[1]
  const { code, state } = req.query

  if (!code || !state || state !== cookie) {
    return reply(res, origin, 'error', { message: 'Session de connexion expirée ou invalide. Réessayez depuis /admin.' })
  }

  try {
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_OAUTH_ID,
        client_secret: process.env.GITHUB_OAUTH_SECRET,
        code,
        redirect_uri: `${origin}/api/callback`,
      }),
    })
    const data = await r.json()
    if (!data.access_token) {
      return reply(res, origin, 'error', { message: data.error_description || data.error || 'Connexion GitHub refusée.' })
    }
    return reply(res, origin, 'success', { token: data.access_token, provider: 'github' })
  } catch {
    return reply(res, origin, 'error', { message: 'GitHub injoignable. Réessayez dans un instant.' })
  }
}

function reply(res, origin, status, content) {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`
  const js = (v) => JSON.stringify(v).replace(/</g, '\\u003c')
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Set-Cookie', 'gcg_oauth_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0')
  res.status(200).send(`<!doctype html><meta charset="utf-8"><title>GCG — connexion</title><p style="font-family:sans-serif">Connexion en cours…</p>
<script>
(function () {
  var origin = ${js(origin)}
  var message = ${js(message)}
  if (!window.opener) { document.body.textContent = ${js(status === 'success' ? 'Connecté. Vous pouvez fermer cette fenêtre.' : content.message || 'Erreur')}; return }
  // Le jeton n’est transmis qu’à l’espace de gestion du même domaine.
  function receive(e) {
    if (e.origin !== origin) return
    window.removeEventListener('message', receive)
    window.opener.postMessage(message, origin)
  }
  window.addEventListener('message', receive)
  window.opener.postMessage('authorizing:github', origin)
})()
</script>`)
}
