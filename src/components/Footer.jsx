import { ArrowUpRight, Instagram } from 'lucide-react'
import { Link } from 'react-router-dom'
import { siteConfig } from '../config/siteConfig'
import Logo from './Logo'
import WhatsAppButton from './WhatsAppButton'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Logo />
          <p>Daystar rehydration salts for busy days, warm weather and life on the go.</p>
          <a className="footer-social" href={siteConfig.instagramUrl} target="_blank" rel="noreferrer" aria-label="Visit Instagram">
            <Instagram size={17} /> <span>Follow along</span> <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="footer-column">
          <h2>Explore</h2>
          <Link to="/shop">Shop all</Link>
          <Link to="/about">Our story</Link>
          <Link to="/contact">Get in touch</Link>
        </div>
        <div className="footer-column">
          <h2>Say hello</h2>
          <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          <a href={`tel:${siteConfig.contactPhone.replaceAll(' ', '')}`}>{siteConfig.contactPhone}</a>
          <WhatsAppButton compact>Message us</WhatsAppButton>
        </div>
        <div className="footer-note"><span>Made for the moments in between.</span><span className="footer-note__flower" aria-hidden="true">✳</span></div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.</span>
        <span>Thoughtfully chosen, always.</span>
      </div>
    </footer>
  )
}