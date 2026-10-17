import { ArrowRight, Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import SectionHeading from '../components/SectionHeading'
import WhatsAppButton from '../components/WhatsAppButton'
import { siteConfig } from '../config/siteConfig'

export default function Contact() {
  return (
    <>
      <main className="contact-page">
        <section className="contact-intro"><div className="container"><div className="breadcrumbs"><Link to="/">Home</Link><ArrowRight size={13} /><span>Contact</span></div><SectionHeading eyebrow="We're listening" title="Let's have a little chat." description="Questions about a piece, a gift idea, or just a hello? Our inbox is open." /></div></section>
        <section className="contact-content"><div className="container contact-content__grid"><div className="contact-direct"><p className="eyebrow">The easy way</p><h2>Real people.<br /><em>Real replies.</em></h2><p>Tell us what's on your mind and we'll get back to you as soon as we can. We are happy to help with product details, gifting and everything in between.</p><WhatsAppButton>Message us on WhatsApp</WhatsAppButton><div className="contact-hours"><span className="contact-hours__dot" /> Usually around Monday to Saturday, 10am–6pm IST</div></div><div className="contact-details"><h2>Or find us here</h2><a href={`mailto:${siteConfig.contactEmail}`}><span className="contact-details__icon"><Mail size={19} /></span><span><small>Email</small>{siteConfig.contactEmail}</span><ArrowRight size={16} /></a><a href={`tel:${siteConfig.contactPhone.replaceAll(' ', '')}`}><span className="contact-details__icon contact-details__icon--blue"><Phone size={19} /></span><span><small>Phone</small>{siteConfig.contactPhone}</span><ArrowRight size={16} /></a><a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer"><span className="contact-details__icon contact-details__icon--yellow"><Instagram size={19} /></span><span><small>Instagram</small>Follow our little world</span><ArrowRight size={16} /></a><div className="contact-details__note"><MapPin size={16} /><span>Thoughtfully chosen and shared across India.</span></div></div></div></section>
        <section className="contact-bottom"><div className="container"><MessageCircle size={23} /><p>Prefer to browse first?</p><Link to="/shop" className="text-link">Wander through the collection <ArrowRight size={17} /></Link></div></section>
      </main>
      <Footer />
    </>
  )
}