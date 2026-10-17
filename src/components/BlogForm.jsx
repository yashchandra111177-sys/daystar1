import { useState } from 'react'
import { apiErrorMessage } from '../api/client'

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

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const submit = async (event) => {
    event.preventDefault()
    setError('')
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
        <label className="admin-field admin-field--wide">Cover image URL <span className="admin-field__hint">Optional; must be an HTTPS image URL.</span><input name="coverImage" type="url" inputMode="url" maxLength={2048} value={form.coverImage} onChange={(event) => update('coverImage', event.target.value)} /></label>
        <label className="admin-field">Author<input name="author" maxLength={60} value={form.author} onChange={(event) => update('author', event.target.value)} /></label>
      </div>
      <label className="admin-blog-publish"><input type="checkbox" checked={form.published} onChange={(event) => update('published', event.target.checked)} /><span><strong>Publish this story</strong><small>{form.published ? 'It will be visible on the storefront.' : 'Keep it as a private draft until it is ready.'}</small></span></label>
      {error && <p className="admin-form-error" role="alert">{error}</p>}
      <div className="admin-form__actions"><button type="button" className="button button--outline" onClick={onCancel} disabled={saving}>Cancel</button><button type="submit" className="button button--primary" disabled={saving}>{saving ? 'Saving…' : form.published ? 'Publish story' : 'Save draft'}</button></div>
    </form>
  )
}