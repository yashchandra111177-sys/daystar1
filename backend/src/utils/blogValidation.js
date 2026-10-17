const blogFields = new Set(['title', 'excerpt', 'content', 'coverImage', 'author', 'published'])

function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

export function slugifyTitle(title) {
  return title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100) || 'daystar-story'
}

export function validateBlogInput(input) {
  const errors = {}
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { errors: { blog: 'A blog post object is required.' }, value: null }
  }

  for (const key of Object.keys(input)) {
    if (!blogFields.has(key)) errors[key] = 'This field is not allowed.'
  }

  const title = typeof input.title === 'string' ? input.title.trim() : ''
  const excerpt = typeof input.excerpt === 'string' ? input.excerpt.trim() : ''
  const content = typeof input.content === 'string' ? input.content.trim() : ''
  const coverImage = typeof input.coverImage === 'string' ? input.coverImage.trim() : ''
  const author = typeof input.author === 'string' && input.author.trim() ? input.author.trim() : 'Daystar'

  if (!title || title.length > 120) errors.title = 'Title is required and must be at most 120 characters.'
  if (!excerpt || excerpt.length > 320) errors.excerpt = 'Excerpt is required and must be at most 320 characters.'
  if (!content || content.length > 20000) errors.content = 'Content is required and must be at most 20000 characters.'
  if (coverImage && (!isHttpsUrl(coverImage) || coverImage.length > 2048)) errors.coverImage = 'Cover image must be a valid HTTPS URL.'
  if (author.length > 60) errors.author = 'Author must be at most 60 characters.'
  if (input.published !== undefined && typeof input.published !== 'boolean') errors.published = 'Published must be a boolean.'

  return {
    errors,
    value: { title, excerpt, content, coverImage, author, published: input.published ?? false },
  }
}