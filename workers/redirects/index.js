async function handleRequest(request) {
  let requestURL = new URL(request.url)

  let path = requestURL.pathname.replace(/\/+$/, '')
  // if homepage
  if (path === '') {
    const home = `<html>
    <body>
    <p>Visit <a href='https://www.jacobbolda.com'>jacobbolda.com</a></p>
    ${Array.from(redirectMap).reduce(
      (string, item) =>
        `${string}<p><span>${item[0]}</span><span> points to </span><span><a href='${item[1]}'>${item[1]}</a></span></p>`,
      '',
    )}
    </body>
    </html>`
    return new Response(home, { headers: { 'Content-Type': 'text/html' } })
  }

  let location = redirectMap.get(path)
  // any other link
  if (location) {
    return Response.redirect(location, 301)
  }

  // If not in map, return the original request
  return Response.redirect(`https://www.jacobbolda.com${path}/`, 301)
}

addEventListener('fetch', async event => {
  event.respondWith(handleRequest(event.request))
})

const externalHostname = 'www.jacobbolda.com'
const redirectMap = new Map([
  ['/loan', 'https://' + externalHostname + '/loan-efficiency-calculator/'],
  ['/gd', 'https://' + externalHostname + '/linking-data-in-gatsby/'],
  [
    '/personal-theme',
    'https://raw.githubusercontent.com/jbolda/gatsby-theme/master/recipes/personal/recipe.mdx',
  ],
])
