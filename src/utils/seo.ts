const SITE_URL = 'https://www.seigou.org'
const DEFAULT_TITLE = 'Seigou Club | Japan-China Youth Exchange Organization'
const DEFAULT_DESCRIPTION =
  'Seigou Club shares Japan-China youth exchange activities, events, and news.'

const normalizePath = (path: string) => {
  if (!path || path === '/') return '/'
  return path.replace(/\/+$/, '')
}

export const canonicalUrlForPath = (path: string) => `${SITE_URL}${normalizePath(path)}`

const upsertMeta = (selector: string, createAttrs: Record<string, string>, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    Object.entries(createAttrs).forEach(([key, value]) => el?.setAttribute(key, value))
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export const setCanonical = (url: string) => {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}

export const setRobots = (content: string) => {
  upsertMeta('meta[name="robots"]', { name: 'robots' }, content)
}

export const setSeo = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonical,
  image = `${SITE_URL}/images/seigou.jpg`,
}: {
  title?: string
  description?: string
  canonical: string
  image?: string
}) => {
  document.title = title
  setCanonical(canonical)
  upsertMeta('meta[name="description"]', { name: 'description' }, description)
  upsertMeta('meta[property="og:url"]', { property: 'og:url' }, canonical)
  upsertMeta('meta[property="og:title"]', { property: 'og:title' }, title)
  upsertMeta('meta[property="og:description"]', { property: 'og:description' }, description)
  upsertMeta('meta[property="og:image"]', { property: 'og:image' }, image)
  upsertMeta('meta[name="twitter:url"]', { name: 'twitter:url' }, canonical)
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, title)
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description)
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, image)
}

export const defaultSeoForPath = (path: string) => ({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  canonical: canonicalUrlForPath(path),
})
