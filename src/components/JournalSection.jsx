import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiErrorMessage } from '../api/client'
import { listBlogs } from '../api/blog'
import BlogCard from './BlogCard'

export default function JournalSection() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')

    listBlogs({ signal: controller.signal })
      .then((items) => setBlogs(items.slice(0, 3)))
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          setError(apiErrorMessage(requestError, 'We could not load stories right now.'))
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [reloadKey])

  return (
    <section className="journal-section section">
      <div className="container">
        <div className="section-topline">
          <div className="section-heading section-heading--left"><p className="eyebrow">The Daystar journal</p><h2>Little notes for<br />brighter days.</h2><p className="section-heading__description">Practical reads and thoughtful ideas for everyday hydration.</p></div>
          {!loading && blogs.length > 0 && <Link to="/blog" className="text-link">View all stories <ArrowRight size={17} /></Link>}
        </div>
        {loading ? <p className="journal-state" role="status">Loading stories…</p> : error ? <div className="journal-state journal-state--error" role="alert"><p>{error}</p><button type="button" onClick={() => setReloadKey((key) => key + 1)}>Try again</button></div> : blogs.length > 0 ? <div className="journal-grid">{blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}</div> : <div className="journal-empty"><p>Our journal is just getting started.</p><span>Come back soon for notes from Daystar.</span></div>}
      </div>
    </section>
  )
}