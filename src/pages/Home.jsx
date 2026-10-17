import { ArrowDownRight, ArrowRight, Heart, Leaf, MessageCircleHeart } from 'lucide-react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import ImageWithFallback from '../components/ImageWithFallback'
import ProductGrid from '../components/ProductGrid'
import SectionHeading from '../components/SectionHeading'
import WhatsAppButton from '../components/WhatsAppButton'
import { categories } from '../data/products'
import ProductNotice from '../components/ProductNotice'
import { useProducts } from '../context/ProductsContext'
import JournalSection from '../components/JournalSection'

const categoryImages = {
  'Lemon Rehydration Salts': 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=1000&q=85',
  'Orange Rehydration Salts': 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=1000&q=85',
  'ORS Value Packs': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1000&q=85',
}

export default function Home() {
  const { products, loading, error, refresh } = useProducts()
  const featured = products.filter((product) => product.featured).slice(0, 4)

  return (
    <>
      <main>
        <section className="hero">
          <div className="hero__shape" aria-hidden="true" />
          <div className="container hero__inner">
            <div className="hero__copy">
              <p className="eyebrow"><span className="eyebrow__dot" /> A little brighter, every day</p>
              <div className="rubik-bubbles-regular">
                <h1>Everyday hydration,<br /><em>made simpler.</em></h1>
              </div>
              <p className="hero__description">Meet Daystar rehydration salts: a simple companion for busy days, warm weather and life on the go.</p>
              <div className="hero__actions">
                <Link to="/shop" className="button button--primary">Explore collection <ArrowRight size={17} /></Link>
                <Link to="/contact" className="button button--text">A little hello <ArrowDownRight size={17} /></Link>
              </div>
              <div className="hero__note"><span className="hero__note-mark">✳</span><span>Keep a little<br />sunshine close.</span></div>
            </div>
            <div className="hero__visual">
              <div className="hero__photo-frame">
                <ImageWithFallback src="https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=90" alt="A refreshing glass of citrus water" />
              </div>
              <div className="hero__blue-note"><span>Ready when you are</span><span className="hero__blue-note-star">✳</span></div>
              <div className="hero__caption"><span>DAYSTAR / 01</span><span>Hydration for the everyday</span></div>
            </div>
          </div>
          <div className="hero__bottom container"><span>Scroll a little</span><span className="hero__scroll-line" /></div>
        </section>

        <section className="benefits" aria-label="Our promises">
          <div className="container benefits__inner">
            <div className="benefit"><span className="benefit__icon"><Leaf size={21} /></span><div><h2>Simple to carry</h2><p>Keep a sachet close at hand.</p></div></div>
            <div className="benefit"><span className="benefit__icon benefit__icon--blue"><Heart size={21} /></span><div><h2>Clear pack directions</h2><p>Always follow the label.</p></div></div>
            <div className="benefit"><span className="benefit__icon benefit__icon--yellow"><MessageCircleHeart size={21} /></span><div><h2>Here to help</h2><p>Questions? Send us a message.</p></div></div>
          </div>
        </section>

        <section className="section featured-section">
          <div className="container">
            <div className="section-topline"><SectionHeading eyebrow="Meet your hydration sidekick" title="Daystar favourites" description="Find the rehydration salts that fit your day." align="left" /><Link to="/shop" className="text-link">View all products <ArrowRight size={17} /></Link></div>
            {loading || error || !featured.length
              ? <ProductNotice loading={loading} error={error} empty={!loading && !error && !featured.length} onRetry={refresh} emptyTitle="A few favourites are on their way" emptyMessage="Our most-loved finds will be back here soon." />
              : <ProductGrid items={featured} />}
          </div>
        </section>

        <section className="category-section section--compact">
          <div className="container">
            <div className="category-heading"><div><p className="eyebrow">Pick your Daystar</p><h2>A brighter way<br /><em>to rehydrate.</em></h2></div><p>Explore citrus favourites and handy multipacks. Follow the preparation and usage directions on each pack.</p></div>
            <div className="category-grid">
              {categories.map((category, index) => (
                <Link to={`/shop?category=${encodeURIComponent(category)}`} className={`category-tile category-tile--${index + 1}`} key={category}>
                  <ImageWithFallback src={categoryImages[category]} alt={`${category} collection`} loading="lazy" />
                  <span className="category-tile__overlay" />
                  <span className="category-tile__label"><span>{category}</span><span className="category-tile__arrow"><ArrowRight size={17} /></span></span>
                  <span className="category-tile__index">0{index + 1}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <JournalSection />

        <section className="story-section section">
          <div className="container story-grid">
            <div className="story-image-wrap"><ImageWithFallback src="https://images.unsplash.com/photo-1523362628745-0c100150b0e2?auto=format&fit=crop&w=1200&q=85" alt="A glass of water with fresh citrus" loading="lazy" /><span className="story-image-stamp">Bright days<br />start here</span></div>
            <div className="story-copy"><p className="eyebrow">A note from Daystar</p><h2>Hydration for<br /><em>real life.</em></h2><p>Daystar is here to make rehydration salts easy to discover and simple to keep close, whether you're heading out, travelling or stocking up at home.</p><p>Check each pack for its ingredients, preparation instructions and product information.</p><Link to="/about" className="button button--outline">Get to know Daystar <ArrowRight size={17} /></Link></div>
          </div>
        </section>

        <section className="contact-banner"><div className="contact-banner__flower contact-banner__flower--left" aria-hidden="true">✳</div><div className="contact-banner__content"><p className="eyebrow">A good place to start</p><h2>Questions about<br /><em>Daystar?</em></h2><p>We’re here for product and order enquiries.</p><WhatsAppButton>Chat with our team</WhatsAppButton></div><div className="contact-banner__flower contact-banner__flower--right" aria-hidden="true">✳</div></section>
      </main>
      <Footer />
    </>
  )
}