import { Router } from 'express'
import { getPublishedBlog, listPublishedBlogs } from '../controllers/publicBlogsController.js'

const router = Router()

router.get('/', listPublishedBlogs)
router.get('/:slug', getPublishedBlog)

export default router