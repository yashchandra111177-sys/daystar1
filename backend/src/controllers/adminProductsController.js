import Product from '../models/Product.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { isValidObjectId, validateProductInput } from '../utils/productValidation.js'

const serializeProduct = (product) => ({ ...product, id: String(product._id), _id: undefined })

export const listAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ updatedAt: -1 }).lean()
  res.json({ products: products.map(serializeProduct) })
})

export const createProduct = asyncHandler(async (req, res) => {
  const { errors, value } = validateProductInput(req.body)
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Check the product fields and try again.', errors })
  const product = await Product.create(value)
  res.status(201).json({ product: serializeProduct(product.toObject()) })
})

export const updateProduct = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Product not found.' })
  const { errors, value } = validateProductInput(req.body)
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Check the product fields and try again.', errors })
  const product = await Product.findByIdAndUpdate(req.params.id, { $set: value }, { new: true, runValidators: true }).lean()
  if (!product) return res.status(404).json({ message: 'Product not found.' })
  res.json({ product: serializeProduct(product) })
})

export const deleteProduct = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Product not found.' })
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) return res.status(404).json({ message: 'Product not found.' })
  res.status(204).end()
})