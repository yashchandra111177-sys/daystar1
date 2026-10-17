import axios from 'axios'
import { ImagePlus, LoaderCircle, UploadCloud, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { adminApi } from '../api/admin'
import ImageWithFallback from './ImageWithFallback'

const blankProduct = {
  name: '', price: '', originalPrice: '', category: '', description: '', image: '',
  additionalImages: '', featured: false, newArrival: false, available: true,
}

export default function ProductForm({ initialProduct, onSave, onCancel }) {
  const [form, setForm] = useState(() => initialProduct ? {
    ...initialProduct,
    price: String(initialProduct.price),
    originalPrice: initialProduct.originalPrice ? String(initialProduct.originalPrice) : '',
    additionalImages: (initialProduct.additionalImages || []).join('\n'),
  } : blankProduct)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInput = useRef(null)

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: '' }))
  }

  const uploadImage = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type) || file.size > 8 * 1024 * 1024) {
      setFormError('Choose a JPG, PNG, WebP or AVIF image under 8 MB.')
      return
    }

    setFormError('')
    setUploading(true)
    setUploadProgress(0)
    try {
      const signed = await adminApi.createUploadSignature()
      const payload = new FormData()
      payload.append('file', file)
      payload.append('api_key', signed.apiKey)
      payload.append('timestamp', String(signed.timestamp))
      payload.append('folder', signed.folder)
      payload.append('allowed_formats', signed.allowed_formats)
      payload.append('signature', signed.signature)
      const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`, payload, {
        onUploadProgress: (progress) => setUploadProgress(Math.round((progress.loaded / (progress.total || file.size)) * 100)),
      })
      update('image', data.secure_url)
    } catch (error) {
      setFormError(error.response?.data?.message || 'Image upload failed. Check Cloudinary setup or enter an HTTPS image URL instead.')
    } finally {
      setUploading(false)
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    setFormError('')
    setFieldErrors({})
    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      originalPrice: form.originalPrice === '' ? null : Number(form.originalPrice),
      category: form.category.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      additionalImages: form.additionalImages.split('\n').map((url) => url.trim()).filter(Boolean),
      featured: form.featured,
      newArrival: form.newArrival,
      available: form.available,
    }
    try {
      await onSave(payload)
    } catch (error) {
      setFormError(error.response?.data?.message || 'The product could not be saved.')
      setFieldErrors(error.response?.data?.errors || {})
    }
  }

  return (
    <form className="admin-form admin-product-form" onSubmit={submit}>
      <div className="admin-form__grid">
        <label className="admin-field">Product name<input autoFocus name="name" value={form.name} onChange={(event) => update('name', event.target.value)} maxLength={120} required aria-invalid={Boolean(fieldErrors.name)} />{fieldErrors.name && <small>{fieldErrors.name}</small>}</label>
        <label className="admin-field">Category<input name="category" list="product-category-options" value={form.category} onChange={(event) => update('category', event.target.value)} maxLength={80} required aria-invalid={Boolean(fieldErrors.category)} /><datalist id="product-category-options"><option value="Lemon Rehydration Salts" /><option value="Orange Rehydration Salts" /><option value="ORS Value Packs" /></datalist>{fieldErrors.category && <small>{fieldErrors.category}</small>}</label>
        <label className="admin-field">Price (INR)<input name="price" type="number" min="0" max="10000000" step="1" value={form.price} onChange={(event) => update('price', event.target.value)} required aria-invalid={Boolean(fieldErrors.price)} />{fieldErrors.price && <small>{fieldErrors.price}</small>}</label>
        <label className="admin-field">Original price (optional)<input name="originalPrice" type="number" min="0.01" max="10000000" step="1" value={form.originalPrice} onChange={(event) => update('originalPrice', event.target.value)} aria-invalid={Boolean(fieldErrors.originalPrice)} />{fieldErrors.originalPrice && <small>{fieldErrors.originalPrice}</small>}</label>
        <label className="admin-field admin-field--wide">Description<textarea name="description" rows="4" maxLength={3000} value={form.description} onChange={(event) => update('description', event.target.value)} required aria-invalid={Boolean(fieldErrors.description)} />{fieldErrors.description && <small>{fieldErrors.description}</small>}</label>
        <div className="admin-field admin-field--wide">
          <span className="admin-field__label">Main image</span>
          <div className="admin-upload-row">
            {form.image ? <ImageWithFallback src={form.image} alt="Product preview" className="admin-image-preview" /> : <span className="admin-image-empty"><ImagePlus size={20} /> No image selected</span>}
            <div className="admin-upload-actions"><button type="button" className="button button--outline" onClick={() => fileInput.current?.click()} disabled={uploading}><UploadCloud size={16} /> {uploading ? `Uploading ${uploadProgress}%` : 'Upload image'}</button><input ref={fileInput} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={uploadImage} /><span>JPG, PNG, WebP or AVIF · 8 MB max</span></div>
          </div>
          {uploading && <div className="admin-progress" aria-label={`Upload ${uploadProgress}%`}><span style={{ width: `${uploadProgress}%` }} /></div>}
          <label className="admin-field admin-field--nested">Or enter an HTTPS image URL<input name="image" type="url" inputMode="url" value={form.image} onChange={(event) => update('image', event.target.value)} required aria-invalid={Boolean(fieldErrors.image)} />{fieldErrors.image && <small>{fieldErrors.image}</small>}</label>
        </div>
        <label className="admin-field admin-field--wide">Additional image URLs <span className="admin-field__hint">One HTTPS URL per line, up to 8.</span><textarea name="additionalImages" rows="2" value={form.additionalImages} onChange={(event) => update('additionalImages', event.target.value)} aria-invalid={Boolean(fieldErrors.additionalImages)} />{fieldErrors.additionalImages && <small>{fieldErrors.additionalImages}</small>}</label>
      </div>
      <fieldset className="admin-toggles"><legend>Storefront display</legend><label><input type="checkbox" checked={form.featured} onChange={(event) => update('featured', event.target.checked)} /><span>Featured product</span></label><label><input type="checkbox" checked={form.newArrival} onChange={(event) => update('newArrival', event.target.checked)} /><span>New arrival</span></label><label><input type="checkbox" checked={form.available} onChange={(event) => update('available', event.target.checked)} /><span>Available to enquire</span></label></fieldset>
      {formError && <p className="admin-form-error" role="alert">{formError}</p>}
      <div className="admin-form__actions"><button type="button" className="button button--outline" onClick={onCancel}><X size={16} /> Cancel</button><button type="submit" className="button button--primary" disabled={uploading}>{uploading ? <LoaderCircle className="spin" size={16} /> : null}{initialProduct ? 'Save changes' : 'Create product'}</button></div>
    </form>
  )
}