export const siteConfig = {
  brandName: 'Daystar',
  tagline: 'Hydration, made brighter.',
  whatsappPhone: '918286604985',
  contactEmail: 'hello@daystar.example',
  contactPhone: '+918286604985',
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