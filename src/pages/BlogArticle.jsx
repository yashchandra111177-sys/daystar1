import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getBlog } from '../api/blog'
import ImageWithFallback from '../components/ImageWithFallback'

const formatDate = (date) => new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date(date))

export default function BlogArticle() {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(false)
    getBlog(slug)
      .then((item) => { if (active) setBlog(item) })
      .catch(() => { if (active) setError(true) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [slug])

  if (loading) return <main className="journal-message container" role="status">Loading story…</main>
  if (error || !blog) return <main className="journal-message container"><p>This story could not be found.</p><Link to="/blog" className="text-link"><ArrowLeft size={15} /> Back to the journal</Link></main>

  return (
    <main className="journal-article container">
      <Link to="/blog" className="journal-back"><ArrowLeft size={15} /> Back to the journal</Link>
      <article>
        <header className="journal-article__heading"><p className="eyebrow">Daystar journal</p><h1>{blog.title}</h1><p className="journal-article__meta">{formatDate(blog.publishedAt || blog.createdAt)} <span aria-hidden="true">·</span> By {blog.author}</p><p className="journal-article__excerpt">{blog.excerpt}</p></header>
        {blog.coverImage && <div className="journal-article__cover"><ImageWithFallback src={blog.coverImage} alt="" /></div>}
        <div className="journal-article__content">{blog.content.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      </article>
    </main>
  )
}