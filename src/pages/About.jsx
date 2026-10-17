import { ArrowRight, Heart, Leaf, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import ImageWithFallback from '../components/ImageWithFallback'
import SectionHeading from '../components/SectionHeading'
import WhatsAppButton from '../components/WhatsAppButton'

export default function About() {
  return (
    <>
      <main className="about-page">
        <section className="about-hero"><div className="container about-hero__grid"><div><div className="breadcrumbs"><Link to="/">Home</Link><ArrowRight size={13} /><span>About Daystar</span></div><p className="eyebrow">A brighter approach to rehydration</p><h1>For full days<br /><em>under the sun.</em></h1><p>Daystar brings rehydration salts into focus with a bright, approachable brand and product information that’s easy to find.</p></div><div className="about-hero__image"><ImageWithFallback src="https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=85" alt="Fresh citrus water in sunlight" /></div></div></section>
        <section className="section about-intro"><div className="container about-intro__grid"><p className="eyebrow">The idea behind Daystar</p><div><h2>Hydration that<br /><em>fits your day.</em></h2><p>Whether you’re travelling, spending time outdoors or keeping essentials at home, Daystar rehydration salts are designed to be easy to browse and convenient to carry.</p><p>Product ingredients, preparation instructions and approved claims should always be checked on the product packaging. Use each product only as directed.</p></div></div></section>
        <section className="values-section"><div className="container"><SectionHeading eyebrow="Our approach" title="Clear, bright and considered" /><div className="values-grid"><article><span><Heart size={22} /></span><h3>Easy to explore</h3><p>Find product formats and flavours in one straightforward collection.</p></article><article><span><Leaf size={22} /></span><h3>Pack-first guidance</h3><p>Preparation and usage directions belong to the approved product label.</p></article><article><span><Sparkles size={22} /></span><h3>Here when you need us</h3><p>Reach out to the Daystar team with product and order questions.</p></article></div></div></section>
        <section className="about-last"><div className="container about-last__grid"><div className="about-last__image"><ImageWithFallback src="https://images.unsplash.com/photo-1523362628745-0c100150b0e2?auto=format&fit=crop&w=1000&q=85" alt="Water with citrus in a clear glass" loading="lazy" /></div><div><p className="eyebrow">Need a hand?</p><h2>We’re here<br /><em>to help.</em></h2><p>Ask us about Daystar products, pack information or an order. We’ll be happy to point you in the right direction.</p><WhatsAppButton>Talk to Daystar</WhatsAppButton></div></div></section>
      </main>
      <Footer />
    </>
  )
}