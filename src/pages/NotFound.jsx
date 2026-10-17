import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

export default function NotFound() {
  return <><main className="not-found"><span className="eyebrow">404 / A little detour</span><h1>This page took<br /><em>the scenic route.</em></h1><p>We can't seem to find the page you were looking for.</p><Link to="/" className="button button--primary"><ArrowLeft size={17} /> Back home</Link></main><Footer /></>
}