import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  price: { type: Number, required: true, min: 0, max: 10000000 },
  originalPrice: { type: Number, default: null, min: 0, max: 10000000 },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, required: true, trim: true, maxlength: 3000 },
  image: { type: String, required: true, trim: true, maxlength: 2048 },
  additionalImages: { type: [String], default: [] },
  featured: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  available: { type: Boolean, default: true },
  published: { type: Boolean, default: true, index: true },
}, { timestamps: true, versionKey: false })

productSchema.index({ createdAt: -1 })

export default mongoose.model('Product', productSchema)