const productFields = new Set([
  'name', 'price', 'originalPrice', 'category', 'description', 'image',
  'additionalImages', 'featured', 'newArrival', 'available',
])

function isHttpsUrl(value) {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

export function validateProductInput(input) {
  const errors = {}
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { errors: { product: 'A product object is required.' }, value: null }
  }

  for (const key of Object.keys(input)) {
    if (!productFields.has(key)) errors[key] = 'This field is not allowed.'
  }

  const name = typeof input.name === 'string' ? input.name.trim() : ''
  const category = typeof input.category === 'string' ? input.category.trim() : ''
  const description = typeof input.description === 'string' ? input.description.trim() : ''
  const image = typeof input.image === 'string' ? input.image.trim() : ''

  if (!name || name.length > 120) errors.name = 'Name is required and must be at most 120 characters.'
  if (!category || category.length > 80) errors.category = 'Category is required and must be at most 80 characters.'
  if (!description || description.length > 3000) errors.description = 'Description is required and must be at most 3000 characters.'
  if (!isHttpsUrl(image) || image.length > 2048) errors.image = 'A valid HTTPS image URL is required.'
  if (typeof input.price !== 'number' || !Number.isFinite(input.price) || input.price < 0 || input.price > 10000000) {
    errors.price = 'Price must be a number from 0 to 10000000.'
  }

  let originalPrice = null
  if (input.originalPrice !== undefined && input.originalPrice !== null && input.originalPrice !== '') {
    originalPrice = input.originalPrice
    if (typeof originalPrice !== 'number' || !Number.isFinite(originalPrice) || originalPrice <= 0 || originalPrice > 10000000) {
      errors.originalPrice = 'Original price must be a positive number no greater than 10000000.'
    } else if (typeof input.price === 'number' && originalPrice < input.price) {
      errors.originalPrice = 'Original price must be greater than or equal to the current price.'
    }
  }

  const additionalImages = input.additionalImages ?? []
  if (!Array.isArray(additionalImages) || additionalImages.length > 8 || additionalImages.some((url) => typeof url !== 'string' || !isHttpsUrl(url) || url.length > 2048)) {
    errors.additionalImages = 'Additional images must be up to 8 valid HTTPS URLs.'
  }

  const value = {
    name,
    price: input.price,
    originalPrice,
    category,
    description,
    image,
    additionalImages,
  }
  for (const field of ['featured', 'newArrival', 'available']) {
    if (input[field] !== undefined && typeof input[field] !== 'boolean') errors[field] = `${field} must be a boolean.`
    value[field] = input[field] ?? (field === 'available')
  }

  return { errors, value }
}

export function isValidObjectId(value) {
  return typeof value === 'string' && /^[a-f\d]{24}$/i.test(value)
}