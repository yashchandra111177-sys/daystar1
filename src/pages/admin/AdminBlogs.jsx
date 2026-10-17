import { BookOpen, ExternalLink, FilePenLine, Plus, Search, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api/admin'
import { apiErrorMessage } from '../../api/client'
import BlogForm from '../../components/BlogForm'
import ImageWithFallback from '../../components/ImageWithFallback'

const formatDate = (date) => new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(date))

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(undefined)
  const [deleting, setDeleting] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const [deletingNow, setDeletingNow] = useState(false)

  const loadBlogs = async () => {
    setLoading(true)
    setError('')
    try { setBlogs(await adminApi.listBlogs()) }
    catch (requestError) { setError(apiErrorMessage(requestError, 'Could not load journal stories.')) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadBlogs() }, [])

  const visibleBlogs = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return blogs.filter((blog) => `${blog.title} ${blog.excerpt}`.toLowerCase().includes(normalized))
  }, [blogs, query])

  const saveBlog = async (payload) => {
    if (editing) await adminApi.updateBlog(editing.id, payload)
    else await adminApi.createBlog(payload)
    setEditing(undefined)
    setNotice(editing ? 'Story updated.' : payload.published ? 'Story published.' : 'Draft saved.')
    await loadBlogs()
  }

  const removeBlog = async () => {
    if (!deleting) return
    setDeletingNow(true)
    setDeleteError('')
    try {
      await adminApi.deleteBlog(deleting.id)
      setDeleting(null)
      setNotice('Story deleted.')
      await loadBlogs()
    } catch (requestError) {
      setDeleteError(apiErrorMessage(requestError, 'The story could not be deleted.'))
    } finally {
      setDeletingNow(false)
    }
  }

  return (
    <main className="admin-content">
      <div className="admin-page-heading"><div><p className="eyebrow">Share a little knowledge</p><h1>Journal</h1><p>Write, edit and publish stories for your Daystar community.</p></div><button type="button" className="button button--primary" onClick={() => { setNotice(''); setEditing(null) }}><Plus size={17} /> Write a story</button></div>
      {notice && <div className="admin-success" role="status">{notice}<button type="button" aria-label="Dismiss message" onClick={() => setNotice('')}><X size={16} /></button></div>}
      <section className="admin-panel admin-products-panel">
        <div className="admin-products-toolbar"><div className="admin-products-count"><BookOpen size={18} /><span>{loading ? 'Loading stories…' : `${blogs.length} ${blogs.length === 1 ? 'story' : 'stories'}`}</span></div><label className="admin-search"><Search size={17} /><span className="sr-only">Search journal stories</span><input placeholder="Search stories" value={query} onChange={(event) => setQuery(event.target.value)} /><button type="button" aria-label="Clear search" hidden={!query} onClick={() => setQuery('')}><X size={14} /></button></label></div>
        {error && <div className="admin-alert" role="alert">{error}<button type="button" onClick={loadBlogs}>Try again</button></div>}
        {!error && loading && <div className="admin-panel__state" role="status">Loading journal…</div>}
        {!error && !loading && blogs.length === 0 && <div className="admin-panel__state"><span className="admin-empty-icon"><BookOpen size={22} /></span><h2>Your journal is ready.</h2><p>Write your first story and save it as a draft or publish it right away.</p><button type="button" className="button button--primary" onClick={() => setEditing(null)}><Plus size={16} /> Write the first story</button></div>}
        {!error && !loading && blogs.length > 0 && visibleBlogs.length === 0 && <div className="admin-panel__state"><p>No stories match “{query}”.</p><button type="button" className="button button--outline" onClick={() => setQuery('')}>Clear search</button></div>}
        {!error && !loading && visibleBlogs.length > 0 && <div className="admin-blog-list">{visibleBlogs.map((blog) => <article className="admin-blog-row" key={blog.id}><ImageWithFallback src={blog.coverImage} alt="" className="admin-blog-row__image" /><div className="admin-blog-row__details"><span>{blog.author} · {formatDate(blog.updatedAt)}</span><h2>{blog.title}</h2><p>{blog.excerpt}</p></div><span className={`admin-blog-status ${blog.published ? 'is-published' : ''}`}>{blog.published ? 'Published' : 'Draft'}</span><div className="admin-product-row__actions">{blog.published && <Link to={`/blog/${encodeURIComponent(blog.slug)}`} target="_blank" rel="noreferrer" className="admin-icon-action" aria-label={`View ${blog.title}`} title="View published story"><ExternalLink size={16} /></Link>}<button type="button" className="admin-icon-action" aria-label={`Edit ${blog.title}`} title="Edit story" onClick={() => { setNotice(''); setEditing(blog) }}><FilePenLine size={16} /></button><button type="button" className="admin-icon-action admin-icon-action--danger" aria-label={`Delete ${blog.title}`} title="Delete story" onClick={() => { setDeleteError(''); setDeleting(blog) }}><Trash2 size={16} /></button></div></article>)}</div>}
      </section>
      {editing !== undefined && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(undefined) }}><section className="admin-modal admin-blog-modal" role="dialog" aria-modal="true" aria-labelledby="blog-form-title"><div className="admin-modal__heading"><div><p className="eyebrow">{editing ? 'Refine your story' : 'A new note for the journal'}</p><h2 id="blog-form-title">{editing ? 'Edit story' : 'Write a story'}</h2></div><button type="button" className="admin-icon-action" aria-label="Close editor" onClick={() => setEditing(undefined)}><X size={19} /></button></div><BlogForm key={editing?.id || 'new-blog'} initialBlog={editing || null} onSave={saveBlog} onCancel={() => setEditing(undefined)} /></section></div>}
      {deleting && <div className="admin-modal-backdrop" role="presentation"><section className="admin-confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-blog-title"><span className="admin-confirm-modal__icon"><Trash2 size={20} /></span><h2 id="delete-blog-title">Delete this story?</h2><p><strong>{deleting.title}</strong> will be removed from the journal.</p>{deleteError && <p className="admin-form-error" role="alert">{deleteError}</p>}<div className="admin-form__actions"><button type="button" className="button button--outline" onClick={() => setDeleting(null)} disabled={deletingNow}>Keep story</button><button type="button" className="button button--danger" onClick={removeBlog} disabled={deletingNow}>{deletingNow ? 'Deleting…' : 'Delete story'}</button></div></section></div>}
    </main>
  )
}