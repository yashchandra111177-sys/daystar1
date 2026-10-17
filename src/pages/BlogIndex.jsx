import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listBlogs } from '../api/blog'
import BlogCard from '../components/BlogCard'

export default function BlogIndex() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    listBlogs()
      .then((items) => { if (active) setBlogs(items) })
      .catch(() => { if (active) setError(true) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <main className="journal-index container">
      <Link to="/" className="journal-back"><ArrowLeft size={15} /> Back to Daystar</Link>
      <header className="journal-index__heading"><p className="eyebrow">Notes from Daystar</p><h1>The journal</h1><p>Thoughtful reads for everyday hydration and brighter days.</p></header>
      {loading ? <p className="journal-state" role="status">Loading stories…</p> : error ? <p className="journal-state" role="alert">Stories could not be loaded right now. Please try again shortly.</p> : blogs.length ? <div className="journal-grid">{blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}</div> : <div className="journal-empty"><p>Our journal is just getting started.</p><span>Come back soon for notes from Daystar.</span></div>}
    </main>
  )
}