async function handleRequest(/** @type {FetchEvent} */ event) {
  const url = new URL(event.request.url)

  if (!url.searchParams.has('force')) {
    const cache = caches.default
    const cacheKey = new Request(url.toString(), event.request)
    const cachedResponse = await cache.match(cacheKey)
    if (cachedResponse) return cachedResponse
  }

  if (url.pathname == '/') {
    const query = new URLSearchParams({
      filterByFormula: `AND(Active)`,
      'fields[]': 'URL',
    }).toString()
    const endpoint = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${TABLE_NAME}?${query}`
    const result = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${AIRTABLE_KEY}` },
    })

    const data = await result.json()

    const home = `<html>
    <body>
    <p>Visit <a href='https://www.jacobbolda.com'>jacobbolda.com</a></p>
    ${Array.from(data.records).reduce(
      (string, item) =>
        `${string}<p><span>${item[0]?.fields.URL}</span><span> points to </span><span><a href='${item[1]?.fields.URL}'>${item[1]?.fields.URL}</a></span></p>`,
      '',
    )}
    </body>
    </html>`
    return new Response(home, { headers: { 'Content-Type': 'text/html' } })
  }

  const slug = url.pathname.split('/')[1]
  if (slug) {
    const query = new URLSearchParams({
      filterByFormula: `AND(Slug="${slug}",Active)`,
      'fields[]': 'URL',
    }).toString()
    const endpoint = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${TABLE_NAME}?${query}`
    const result = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${AIRTABLE_KEY}` },
    })

    const data = await result.json()
    const redirectUrl = data.records[0]?.fields.URL

    if (redirectUrl) {
      const response = Response.redirect(redirectUrl, 307)
      if (url.searchParams.has('force')) {
        event.waitUntil(cache.delete(cacheKey))
      }
      event.waitUntil(cache.put(cacheKey, response.clone()))
      return response
    }

    return Response.redirect(`https://www.jacobbolda.com${path}/`, 307)
  }

  return new Response(null, { status: 404 })
}

addEventListener('fetch', async event => {
  event.respondWith(handleRequest(event))
})
