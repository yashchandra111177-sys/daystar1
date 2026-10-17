import test from 'node:test'
import assert from 'node:assert/strict'
import { slugifyTitle, validateBlogInput } from './blogValidation.js'

const validBlog = {
  title: 'Hydration for sunny days',
  excerpt: 'A few simple ways to stay prepared for warm weather.',
  content: 'Keep water close and follow the directions on your rehydration salts pack.',
  coverImage: 'https://images.example.com/sunny-day.jpg',
  published: true,
}

test('accepts valid blog fields and applies author defaults', () => {
  const result = validateBlogInput(validBlog)
  assert.deepEqual(result.errors, {})
  assert.equal(result.value.author, 'Daystar')
  assert.equal(result.value.published, true)
})

test('rejects unsafe image URLs, oversized content, and unknown fields', () => {
  const result = validateBlogInput({ ...validBlog, coverImage: 'javascript:alert(1)', content: 'x'.repeat(20001), isAdmin: true })
  assert.ok(result.errors.coverImage)
  assert.ok(result.errors.content)
  assert.ok(result.errors.isAdmin)
})

test('slugifies titles into URL-safe slugs', () => {
  assert.equal(slugifyTitle('Hydration for sunny days!'), 'hydration-for-sunny-days')
  assert.equal(slugifyTitle('   '), 'daystar-story')
})