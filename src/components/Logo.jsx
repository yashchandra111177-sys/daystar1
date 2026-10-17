import { Link } from 'react-router-dom'
import { siteConfig } from '../config/siteConfig'

export default function Logo({ onClick }) {
  return (
    <Link className="brand-mark" to="/" aria-label={`${siteConfig.brandName} home`} onClick={onClick}>
      <img className="brand-mark__symbol" src="/daystar-sun.png" alt="" />
      <span className="brand-mark__text">
        <span className="brand-mark__name">daystar</span>
        <span className="brand-mark__tagline">{siteConfig.tagline}</span>
      </span>
    </Link>
  )
}