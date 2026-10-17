import test from 'node:test'
import assert from 'node:assert/strict'
import { isValidObjectId, validateProductInput } from './productValidation.js'

const validProduct = {
  name: 'Blue Hour Mug',
  price: 680,
  category: 'Lemon Rehydration Salts',
  description: 'A hand-finished stoneware mug.',
  image: 'https://images.example.com/mug.jpg',
  featured: true,
  newArrival: false,
  available: true,
}

test('accepts valid product fields and applies optional defaults', () => {
  const result = validateProductInput(validProduct)
  assert.deepEqual(result.errors, {})
  assert.equal(result.value.originalPrice, null)
  assert.deepEqual(result.value.additionalImages, [])
})

test('rejects invalid prices, non-HTTPS image URLs, and unknown fields', () => {
  const result = validateProductInput({ ...validProduct, price: -1, image: 'javascript:alert(1)', isAdmin: true })
  assert.ok(result.errors.price)
  assert.ok(result.errors.image)
  assert.ok(result.errors.isAdmin)
})

test('rejects an original price below the sale price', () => {
  const result = validateProductInput({ ...validProduct, originalPrice: 500 })
  assert.ok(result.errors.originalPrice)
})

test('accepts only 24-character hexadecimal Mongo IDs', () => {
  assert.equal(isValidObjectId('507f1f77bcf86cd799439011'), true)
  assert.equal(isValidObjectId('not-an-id'), false)
})