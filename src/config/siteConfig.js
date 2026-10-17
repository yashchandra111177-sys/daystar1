export const siteConfig = {
  brandName: 'Daystar',
  tagline: 'Hydration, made brighter.',
  whatsappPhone: '919702036934',
  contactEmail: 'hello@daystar.example',
  contactPhone: '+91 99999 99999',
  instagramUrl: 'https://www.instagram.com/',
}

export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)

export const whatsappUrl = (message) => {
  if (!/^91\d{10}$/.test(siteConfig.whatsappPhone)) return null
  return `https://wa.me/${siteConfig.whatsappPhone}?text=${encodeURIComponent(message)}`
}