import assert from 'node:assert/strict'
import test from 'node:test'
import app from './app.js'

test('API health and admin request protections work without a database connection', async () => {
  const server = app.listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  const baseUrl = `http://127.0.0.1:${server.address().port}`

  try {
    const health = await fetch(`${baseUrl}/api/health`)
    const protectedProducts = await fetch(`${baseUrl}/api/admin/products`, {
      headers: { Origin: 'http://localhost:5173' },
    })
    const protectedBlogs = await fetch(`${baseUrl}/api/admin/blogs`, {
      headers: { Origin: 'http://localhost:5173' },
    })
    const missingAjaxHeader = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { Origin: 'http://localhost:5173', 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'owner@example.com', password: 'test-password' }),
    })
    const untrustedOrigin = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: {
        Origin: 'https://not-allowed.example',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'owner@example.com', password: 'test-password' }),
    })

    assert.equal(health.status, 200)
    assert.equal(protectedProducts.status, 401)
    assert.equal(protectedBlogs.status, 401)
    assert.equal(missingAjaxHeader.status, 403)
    assert.equal(untrustedOrigin.status, 403)
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  }
})