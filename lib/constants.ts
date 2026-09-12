export const RESERVED_SLUGS = [
  'admin',
  'dashboard',
  'api',
  'connexion',
  'inscription',
  'panier',
  'commande',
  'shop',
  'boutique',
  'session',
  'sessions',
  'produits',
  'commandes',
  'parametres',
  'settings',
  'help',
  'aide',
  'support',
  'contact',
  'about',
  'blog',
  'pricing',
  'static',
  '_next',
  'public',
  'assets',
  'images',
]

export function isValidSlug(slug: string): boolean {
  if (RESERVED_SLUGS.includes(slug)) return false
  if (!/^[a-z0-9-]+$/.test(slug)) return false
  if (slug.length < 3 || slug.length > 50) return false
  return true
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
}