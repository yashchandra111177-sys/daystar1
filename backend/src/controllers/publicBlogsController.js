import Blog from '../models/Blog.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const serializeBlog = (blog) => ({ ...blog, id: String(blog._id), _id: undefined })

export const listPublishedBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ published: true })
    .select('-content')
    .sort({ publishedAt: -1 })
    .limit(24)
    .lean()
  res.json({ blogs: blogs.map(serializeBlog) })
})

export const getPublishedBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, published: true }).lean()
  if (!blog) return res.status(404).json({ message: 'Story not found.' })
  res.json({ blog: serializeBlog(blog) })
})