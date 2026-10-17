import { Router } from 'express'
import { getPublishedProduct, listPublishedProducts } from '../controllers/publicProductsController.js'

const router = Router()

router.get('/', listPublishedProducts)
router.get('/:id', getPublishedProduct)

export default router