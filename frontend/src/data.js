// ============================================
// ZAHOOR FLOUR MILLS — ALL DATA, CONSTANTS, HELPERS
// ============================================

export const COMPANY_INFO = {
  name: "Zahoor Flour Mills",
  tagline: "Pure. Fresh. Trusted.",
  owner: "Mr. Saleem Khan",
  established: "2012",
  phone: "+92-300-6900092",
  email: "info@zahoorflourmills.pk",
  address: "135A Bypass, Near Toyota Showroom, Sahiwal, Punjab, Pakistan",
  city: "Sahiwal",
  whatsapp: "+92-300-6900092",
  facebook: "https://facebook.com/zahoorflourmills",
  instagram: "https://instagram.com/zahoorflourmills",
  workingHours: "Mon - Sat: 8:00 AM - 8:00 PM",



  
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109022.68498038498!2d72.27847547128907!3d30.676379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3922b62cd908d5c5%3A0x8a8e3e22e1589dcc!2sSahiwal%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s",
};

// ===== HERO & SECTION IMAGES =====
// Replace these paths with your actual images
// Place images in: public/images/
export const IMAGES = {
  // Hero Section Backgrounds (1920x1080 recommended)
  // using external images so they're always available; replace with your own if desired
  heroBg: "/images/placeholder.png.jpeg",
  heroOverlay: "/images/placeholder.png",

  // Mill / About Images (800x600 recommended)
  millBuilding: "/images/mill.jpg.jpeg",         // Mill building photo

  // Fallback placeholder for missing images
  placeholder: "/images/placeholder.png",
  millInterior: "/images/placeholder.png", // Mill interior
  millProcess: "/images/mill-process.jpg",   // Milling process

  // Section Backgrounds (1920x800 recommended)
  wheatField: "/images/placeholder.png",
  processBg: "/images/placeholder.png",

  // Logo (200x200 recommended, PNG with transparency)
  logo: "/images/finallogo.jpg",
};

// ===== PRODUCT IMAGES =====
// Replace with your actual product photos
// Recommended: 600x600 square, JPG or WebP
export const PRODUCT_IMAGES = {
  // product images using local placeholder to ensure they load
  multiGrain: "/images/Products/multigrain.png",
  regular: "/images/Products/regular.png",
  white: "/images/Products/white.png",
  wholeWheat: "/images/Products/wholegrain.png",
  fine: "/images/Products/fine.png",
  maida: "/images/Products/maida.png",
  barley: "/images/Products/barley.png",
  bran: "/images/Products/bran.png",
  suji: "/images/Products/suji.png",
  oats: "/images/Products/regular.png",
};

export const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery' },
  { id: 'card', label: 'Debit / Credit card' },
];
export const FAQ_DATA = [
  { question: "What types of flour do you offer?", answer: "We offer Multi Grain Flour, Regular Flour, White Flour, Whole Wheat Flour, Fine Flour (Pratha), Maida, Barley, Bran (Choker), Suji, and Oats Flour." },
  { question: "What weight options are available?", answer: "Our products come in various weight options: 10kg, 20kg, 30kg, 40kg bags depending on the product type." },
  { question: "Do you offer wholesale pricing?", answer: "Yes! We offer special wholesale pricing for bulk orders. Please fill out the Wheat Seller Inquiry form or contact us directly for custom quotes." },
  { question: "What areas do you deliver to?", answer: "We deliver across Sahiwal and major cities in Punjab, Pakistan. For specific delivery inquiries, please contact us via phone." },
  { question: "How can I track my order?", answer: "Once your order is confirmed, you'll receive updates via phone/SMS. You can also contact us directly with your order number." },
  { question: "What is your return policy?", answer: "We accept returns within 24 hours of delivery if the product is unopened and in original packaging." },
  { question: "Is your whole wheat flour 100% natural?", answer: "Yes, our Whole Wheat Flour is made from premium quality wheat with no chemicals or preservatives." },
  { question: "How do I place a bulk order?", answer: "You can place bulk orders through our Wheat Seller form, by calling +92-300-6900092, or visiting our mill at Sahiwal." },
];

export const sampleProducts = [
  { id:1, name:"Multi Grain Flour", price:2800, description:"A nutritious blend of multiple grains for balanced health. Perfect for health-conscious families.", category:"Health", image: PRODUCT_IMAGES.multiGrain, weights:["10kg","20kg","30kg","40kg"], featured:true, inStock:true, rating:4.9, reviews:124 },
  { id:2, name:"Regular Flour", price:1800, description:"Everyday fine flour for soft and fluffy rotis. The staple choice for every Pakistani home.", category:"Whole Wheat", image: PRODUCT_IMAGES.regular, weights:["10kg","20kg","30kg","40kg"], featured:false, inStock:true, rating:4.7, reviews:203 },
  { id:3, name:"White Flour", price:2000, description:"Refined white flour ideal for pastries, cakes and baking. Silky smooth texture guaranteed.", category:"Refined", image: PRODUCT_IMAGES.white, weights:["10kg","20kg","30kg","40kg"], featured:false, inStock:true, rating:4.5, reviews:89 },
  { id:4, name:"Whole Wheat Flour", price:2200, description:"Made from whole grains for maximum nutrition. Stone-ground to preserve natural goodness.", category:"Whole Wheat", image: PRODUCT_IMAGES.wholeWheat, weights:["10kg","20kg","30kg","40kg"], featured:true, inStock:true, rating:4.8, reviews:156 },
  { id:5, name:"Fine Flour (Pratha)", price:2400, description:"Extra fine texture, perfect for parathas and naans. Makes the softest layered parathas.", category:"Specialty", image: PRODUCT_IMAGES.fine, weights:["10kg","20kg","30kg","40kg"], featured:false, inStock:true, rating:4.6, reviews:78 },
  { id:6, name:"Maida", price:2100, description:"Refined wheat flour for bakery and sweets. Essential for samosas, jalebis and baked goods.", category:"Refined", image: PRODUCT_IMAGES.maida, weights:["10kg","20kg","30kg","40kg"], featured:false, inStock:true, rating:4.5, reviews:92 },
  { id:7, name:"Barley", price:1600, description:"Rich in fiber and ideal for health-conscious diets. Traditional grain with modern health benefits.", category:"Health", image: PRODUCT_IMAGES.barley, weights:["10kg","20kg","30kg"], featured:false, inStock:true, rating:4.4, reviews:45 },
  { id:8, name:"Bran (Choker)", price:800, description:"High in fiber, perfect for digestion and diet plans. Natural wheat bran for healthy living.", category:"Health", image: PRODUCT_IMAGES.bran, weights:["10kg","20kg","30kg"], featured:false, inStock:true, rating:4.3, reviews:38 },
  { id:9, name:"Suji", price:1500, description:"Coarse wheat flour perfect for halwa, upma and traditional Pakistani desserts.", category:"Specialty", image: PRODUCT_IMAGES.suji, weights:["10kg","20kg","30kg"], featured:false, inStock:true, rating:4.6, reviews:67 },
  { id:10, name:"Oats Flour", price:3200, description:"Gluten-free, heart-friendly flour from premium oats. Perfect for healthy breakfast options.", category:"Health", image: PRODUCT_IMAGES.oats, weights:["10kg","20kg","30kg"], featured:false, inStock:true, rating:4.7, reviews:52 },
];

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-PK', { style:'currency', currency:'PKR', minimumFractionDigits:0 }).format(price);
};

export const getPriceByWeight = (basePrice, weight) => {
  const multipliers = {
    '10kg': 1,
    '20kg': 2,
    '30kg': 3,
    '40kg': 4,
  };
  return Math.round(basePrice * (multipliers[weight] || 1));
};

export const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);
export const truncateText = (text, maxLength = 100) => text.length <= maxLength ? text : text.substr(0, maxLength) + '...';
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isValidPhone = (phone) => /^(\+92|0)?3[0-9]{9}$/.test(phone.replace(/\s|-/g, ''));