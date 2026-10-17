import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listBlogs } from '../api/blog'
import BlogCard from './BlogCard'

export default function JournalSection() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    listBlogs()
      .then((items) => { if (active) setBlogs(items.slice(0, 3)) })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <section className="journal-section section">
      <div className="container">
        <div className="section-topline">
          <div className="section-heading section-heading--left"><p className="eyebrow">The Daystar journal</p><h2>Little notes for<br />brighter days.</h2><p className="section-heading__description">Practical reads and thoughtful ideas for everyday hydration.</p></div>
          {!loading && blogs.length > 0 && <Link to="/blog" className="text-link">View all stories <ArrowRight size={17} /></Link>}
        </div>
        {loading ? <p className="journal-state" role="status">Loading stories…</p> : blogs.length > 0 ? <div className="journal-grid">{blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}</div> : <div className="journal-empty"><p>Our journal is just getting started.</p><span>Come back soon for notes from Daystar.</span></div>}
      </div>
    </section>
  )
}