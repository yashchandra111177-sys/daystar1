import Blog from '../models/Blog.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { slugifyTitle } from '../utils/blogValidation.js'
import { isValidObjectId } from '../utils/productValidation.js'
import { validateBlogInput } from '../utils/blogValidation.js'

const serializeBlog = (blog) => ({ ...blog, id: String(blog._id), _id: undefined })

export const listAdminBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({}).sort({ updatedAt: -1 }).lean()
  res.json({ blogs: blogs.map(serializeBlog) })
})

export const createBlog = asyncHandler(async (req, res) => {
  const { errors, value } = validateBlogInput(req.body)
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Check the story fields and try again.', errors })

  const baseSlug = slugifyTitle(value.title)
  let slug = baseSlug
  let suffix = 2
  while (await Blog.exists({ slug })) slug = `${baseSlug}-${suffix++}`

  const blog = await Blog.create({ ...value, slug, publishedAt: value.published ? new Date() : null })
  res.status(201).json({ blog: serializeBlog(blog.toObject()) })
})

export const updateBlog = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Story not found.' })
  const { errors, value } = validateBlogInput(req.body)
  if (Object.keys(errors).length) return res.status(400).json({ message: 'Check the story fields and try again.', errors })

  const existing = await Blog.findById(req.params.id).select('published publishedAt')
  if (!existing) return res.status(404).json({ message: 'Story not found.' })
  const publishedAt = value.published ? (existing.publishedAt || new Date()) : existing.publishedAt
  const blog = await Blog.findByIdAndUpdate(req.params.id, { $set: { ...value, publishedAt } }, { new: true, runValidators: true }).lean()
  res.json({ blog: serializeBlog(blog) })
})

export const deleteBlog = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Story not found.' })
  const blog = await Blog.findByIdAndDelete(req.params.id)
  if (!blog) return res.status(404).json({ message: 'Story not found.' })
  res.status(204).end()
})