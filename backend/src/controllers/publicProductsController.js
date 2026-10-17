import Product from '../models/Product.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { isValidObjectId } from '../utils/productValidation.js'

const serializeProduct = (product) => ({ ...product, id: String(product._id), _id: undefined })

export const listPublishedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ published: true }).sort({ featured: -1, createdAt: -1 }).lean()
  res.json({ products: products.map(serializeProduct) })
})

export const getPublishedProduct = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Product not found.' })
  const product = await Product.findOne({ _id: req.params.id, published: true }).lean()
  if (!product) return res.status(404).json({ message: 'Product not found.' })
  res.json({ product: serializeProduct(product) })
})