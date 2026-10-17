import { Menu, Search, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import WhatsAppButton from './WhatsAppButton'

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const closeMenu = () => setMenuOpen(false)
  const submitSearch = (event) => {
    event.preventDefault()
    navigate(`/shop${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`)
    setSearchOpen(false)
    closeMenu()
  }

  return (
    <header className="site-header">
      <div className="announcement-bar">A little brighter, every day <span aria-hidden="true">✳</span> Meet Daystar rehydration salts</div>
      <div className="nav-shell">
        <div className="nav-main container">
          <Logo onClick={closeMenu} />
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map((link) => <NavLink key={link.to} to={link.to} end={link.to === '/'}>{link.label}</NavLink>)}
          </nav>
          <div className="nav-actions">
            <button className="icon-button search-toggle" type="button" aria-label="Search products" onClick={() => setSearchOpen((open) => !open)}>
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
            <WhatsAppButton compact className="nav-whatsapp">Say hello</WhatsAppButton>
            <button className="icon-button menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {searchOpen && (
          <form className="nav-search container" onSubmit={submitSearch} role="search">
            <Search size={18} aria-hidden="true" />
            <label className="sr-only" htmlFor="nav-search-input">Search the collection</label>
            <input id="nav-search-input" autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What are you looking for?" />
            <button type="submit">Search</button>
          </form>
        )}
        <div className={`mobile-nav ${menuOpen ? 'mobile-nav--open' : ''}`} aria-hidden={!menuOpen}>
          <nav aria-label="Mobile navigation">
            {links.map((link) => <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={closeMenu}>{link.label}</NavLink>)}
            <Link to="/shop" className="mobile-nav__shop" onClick={closeMenu}>Explore the collection <span>↗</span></Link>
          </nav>
        </div>
      </div>
    </header>
  )
}