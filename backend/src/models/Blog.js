import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, required: true, unique: true, index: true },
  excerpt: { type: String, required: true, trim: true, maxlength: 320 },
  content: { type: String, required: true, trim: true, maxlength: 20000 },
  coverImage: { type: String, default: '', trim: true, maxlength: 2048 },
  author: { type: String, default: 'Daystar', trim: true, maxlength: 60 },
  published: { type: Boolean, default: false, index: true },
  publishedAt: { type: Date, default: null },
}, { timestamps: true, versionKey: false })

blogSchema.index({ published: 1, publishedAt: -1 })

export default mongoose.model('Blog', blogSchema)