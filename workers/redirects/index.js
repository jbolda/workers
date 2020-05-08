async function handleRequest(request) {
  let requestURL = new URL(request.url)
  let path = requestURL.pathname.replace(/\/+$/, '')
  let location = redirectMap.get(path)
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
