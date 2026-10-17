import axios from 'axios'
import { ImagePlus, LoaderCircle, UploadCloud } from 'lucide-react'
import { useRef, useState } from 'react'
import { adminApi } from '../api/admin'
import { apiErrorMessage } from '../api/client'
import ImageWithFallback from './ImageWithFallback'

const emptyBlog = { title: '', excerpt: '', content: '', coverImage: '', author: 'Daystar', published: false }

export default function BlogForm({ initialBlog, onSave, onCancel }) {
  const [form, setForm] = useState(() => initialBlog ? {
    title: initialBlog.title,
    excerpt: initialBlog.excerpt,
    content: initialBlog.content,
    coverImage: initialBlog.coverImage || '',
    author: initialBlog.author || 'Daystar',
    published: initialBlog.published,
  } : emptyBlog)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInput = useRef(null)

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const uploadCoverImage = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type) || file.size > 8 * 1024 * 1024) {
      setError('Choose a JPG, PNG, WebP or AVIF image under 8 MB.')
      return
    }

    setError('')
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
      update('coverImage', data.secure_url)
    } catch (uploadError) {
      setError(uploadError.response?.data?.message || 'Image upload failed. Check Cloudinary setup or enter an HTTPS image URL instead.')
    } finally {
      setUploading(false)
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (uploading) return
    setSaving(true)
    try {
      await onSave({ ...form, title: form.title.trim(), excerpt: form.excerpt.trim(), content: form.content.trim(), coverImage: form.coverImage.trim(), author: form.author.trim() || 'Daystar' })
    } catch (saveError) {
      setError(apiErrorMessage(saveError, 'The story could not be saved. Please try again.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="admin-form admin-blog-form" onSubmit={submit}>
      <div className="admin-form__grid">
        <label className="admin-field admin-field--wide">Story title<input autoFocus name="title" maxLength={120} value={form.title} onChange={(event) => update('title', event.target.value)} required /></label>
        <label className="admin-field admin-field--wide">Short introduction<textarea name="excerpt" rows="3" maxLength={320} value={form.excerpt} onChange={(event) => update('excerpt', event.target.value)} required /><span className="admin-field__hint">A short preview shown on the homepage and journal.</span></label>
        <label className="admin-field admin-field--wide">Article text<textarea className="admin-blog-form__content" name="content" rows="12" maxLength={20000} value={form.content} onChange={(event) => update('content', event.target.value)} required /><span className="admin-field__hint">Separate paragraphs with a blank line.</span></label>
        <div className="admin-field admin-field--wide">
          <span className="admin-field__label">Cover image</span>
          <div className="admin-upload-row">
            {form.coverImage ? <ImageWithFallback src={form.coverImage} alt="Journal cover preview" className="admin-image-preview" /> : <span className="admin-image-empty"><ImagePlus size={20} /> No image selected</span>}
            <div className="admin-upload-actions">
              <button type="button" className="button button--outline" onClick={() => fileInput.current?.click()} disabled={uploading || saving}><UploadCloud size={16} /> {uploading ? `Uploading ${uploadProgress}%` : 'Upload image'}</button>
              <input ref={fileInput} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={uploadCoverImage} />
              <span>JPG, PNG, WebP or AVIF · 8 MB max</span>
            </div>
          </div>
          {uploading && <div className="admin-progress" aria-label={`Upload ${uploadProgress}%`}><span style={{ width: `${uploadProgress}%` }} /></div>}
          <label className="admin-field admin-field--nested">Or enter an HTTPS image URL <span className="admin-field__hint">Optional.</span><input name="coverImage" type="url" inputMode="url" maxLength={2048} value={form.coverImage} onChange={(event) => update('coverImage', event.target.value)} /></label>
        </div>
        <label className="admin-field">Author<input name="author" maxLength={60} value={form.author} onChange={(event) => update('author', event.target.value)} /></label>
      </div>
      <label className="admin-blog-publish"><input type="checkbox" checked={form.published} onChange={(event) => update('published', event.target.checked)} /><span><strong>Publish this story</strong><small>{form.published ? 'It will be visible on the storefront.' : 'Keep it as a private draft until it is ready.'}</small></span></label>
      {error && <p className="admin-form-error" role="alert">{error}</p>}
      <div className="admin-form__actions"><button type="button" className="button button--outline" onClick={onCancel} disabled={saving || uploading}>Cancel</button><button type="submit" className="button button--primary" disabled={saving || uploading}>{uploading ? <LoaderCircle className="spin" size={16} /> : null}{saving ? 'Saving…' : form.published ? 'Publish story' : 'Save draft'}</button></div>
    </form>
  )
}