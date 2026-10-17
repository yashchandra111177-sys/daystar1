import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ImageWithFallback from './ImageWithFallback'

const formatDate = (date) => new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(date))

export default function BlogCard({ blog }) {
  return (
    <article className="journal-card">
      <Link className="journal-card__image" to={`/blog/${encodeURIComponent(blog.slug)}`} aria-label={`Read ${blog.title}`}>
        {blog.coverImage ? <ImageWithFallback src={blog.coverImage} alt="" loading="lazy" /> : <span className="journal-card__image-empty">Daystar journal</span>}
      </Link>
      <div className="journal-card__body">
        <p className="journal-card__meta">{formatDate(blog.publishedAt || blog.createdAt)} <span aria-hidden="true">·</span> {blog.author}</p>
        <h3><Link to={`/blog/${encodeURIComponent(blog.slug)}`}>{blog.title}</Link></h3>
        <p className="journal-card__excerpt">{blog.excerpt}</p>
        <Link className="journal-card__link" to={`/blog/${encodeURIComponent(blog.slug)}`}>Read story <ArrowUpRight size={15} /></Link>
      </div>
    </article>
  )
}