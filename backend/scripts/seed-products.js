import { connectDatabase } from '../src/config/database.js'
import { validateRuntimeEnvironment } from '../src/config/env.js'
import Product from '../src/models/Product.js'

const initialProducts = [
  ['Daystar Lemon Rehydration Salts - Sample Pack', 99, null, 'Lemon Rehydration Salts', 'Sample listing. Replace pack size, approved ingredients, directions and product claims with the final product label before launch.', 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=1000&q=85', true, true, '2026-09-12'],
  ['Daystar Orange Rehydration Salts - Sample Pack', 99, null, 'Orange Rehydration Salts', 'Sample listing. Replace pack size, approved ingredients, directions and product claims with the final product label before launch.', 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=1000&q=85', true, true, '2026-09-20'],
  ['Daystar Lemon Rehydration Salts - Value Pack', 179, null, 'Lemon Rehydration Salts', 'Sample listing. Confirm the sachet count, approved ingredients, directions and price against the final product packaging.', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1000&q=85', true, false, '2026-08-18'],
  ['Daystar Orange Rehydration Salts - Value Pack', 179, null, 'Orange Rehydration Salts', 'Sample listing. Confirm the sachet count, approved ingredients, directions and price against the final product packaging.', 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=1000&q=85', true, false, '2026-08-12'],
  ['Daystar Rehydration Salts - Sample Variety Pack', 249, null, 'ORS Value Packs', 'Sample listing. Confirm included flavours, sachet count, approved ingredients, directions and price before launch.', 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=1000&q=85', false, true, '2026-09-02'],
  ['Daystar Rehydration Salts - Sample Travel Pack', 79, null, 'ORS Value Packs', 'Sample listing. Confirm pack contents, approved ingredients, directions and price against the final product packaging.', 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1000&q=85', false, false, '2026-06-14'],
  ['Daystar Unflavoured Rehydration Salts - Sample Pack', 99, null, 'ORS Value Packs', 'Sample listing. Confirm flavour, pack size, approved ingredients, directions and price against the final product packaging.', 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=1000&q=85', false, false, '2026-04-23'],
  ['Daystar Rehydration Salts - Sample Family Pack', 299, null, 'ORS Value Packs', 'Sample listing. Confirm included flavours, pack contents, approved ingredients, directions and price before launch.', 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=1000&q=85', false, false, '2026-02-14'],
].map(([name, price, originalPrice, category, description, image, featured, newArrival, createdAt]) => ({
  name, price, originalPrice, category, description, image, featured, newArrival,
  available: true, published: true, createdAt: new Date(createdAt),
}))

try {
  validateRuntimeEnvironment()
  await connectDatabase()
  if (await Product.exists({})) {
    throw new Error('Products already exist. Seed script will not overwrite an existing catalog.')
  }
  await Product.insertMany(initialProducts)
  console.info(`Added ${initialProducts.length} starter products.`)
} catch (error) {
  console.error(`Product seed failed: ${error.message}`)
  process.exitCode = 1
} finally {
  const mongoose = await import('mongoose')
  await mongoose.default.disconnect()
}