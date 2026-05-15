// ============================================
// ZAHOOR FLOUR MILLS — LUXURY PREMIUM COMPONENTS
// Golden + Green + Beige + Royal Blue + Black
// ============================================
import { FiUser } from 'react-icons/fi';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useLocation, useParams, useNavigate, Outlet, Navigate } from 'react-router-dom';
import {
  FiShoppingCart, FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiCheck, FiLogIn,
  FiUserPlus, FiStar, FiMessageSquare, FiShield, FiAward, FiTruck, FiHeart,
  FiTag, FiPercent, FiFacebook, FiInstagram,
  FiLock, FiGrid, FiBox, FiShoppingBag, FiUsers, FiLogOut, FiHome, FiPlus, FiCreditCard
} from 'react-icons/fi';
import { useCart, useAuth, useProducts } from './contexts';
import { apiUrl, docId } from './config';
import { COMPANY_INFO, IMAGES, PAYMENT_METHODS, FAQ_DATA, formatPrice, getPriceByWeight } from './data';
import { StripeCardSection } from './StripeCardSection';
import { getStripePromise, normalizePublishableKey } from './stripeClient';


// ===================== SCROLL TO TOP =====================
export const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};


// ===================== SCROLL REVEAL =====================
const useScrollReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }); },
      { threshold: 0.1 }
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);
  return ref;
};

const RevealSection = ({ children, className = '', style = {} }) => {
  const ref = useScrollReveal();
  return <div ref={ref} className={`reveal ${className}`} style={style}>{children}</div>;
};


// utility: all images fallback to placeholder
const handleImgError = e => {
  if (!e.target.dataset.fallback) {
    e.target.dataset.fallback = 'true';
    e.target.src = IMAGES.placeholder;
  }
};

// ===================== HERO GRAIN ANIMATION =====================
// subtle falling wheat grains over the hero section
export const HeroGrains = () => {
  const [grains, setGrains] = useState([]);

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      arr.push({
        id: i,
        left: Math.random() * 100,
        size: 3 + Math.random() * 6,
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 6,
        opacity: 0.2 + Math.random() * 0.3,
        variant: Math.random() > 0.5 ? 1 : 2,
      });
    }
    setGrains(arr);
  }, []);

  return (
    <div className="hero-grains">
      {grains.map(g => (
        <div key={g.id} style={{
          position: 'absolute',
          left: `${g.left}%`,
          top: '-5%',
          width: `${g.size}px`,
          height: `${g.size * 1.7}px`,
          background: `linear-gradient(135deg, rgba(197,162,84,${g.opacity + 0.15}), rgba(168,135,53,${g.opacity}))`,
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          animation: `${g.variant === 1 ? 'grainFall' : 'grainFall2'} ${g.duration}s linear ${g.delay}s infinite`,
          boxShadow: `0 0 ${g.size}px rgba(197,162,84,${g.opacity * 0.3})`,
        }} />
      ))}
    </div>
  );
};


// ===================== DISABLED — Keep exports for compatibility =====================
export const AbabeelBirds = () => null;
export const UnderwaterBubbles = () => null;
export const SwimmingFish = () => null;
export const WhaleAnimation = () => null;
export const UnderwaterLightRays = () => null;


// ===================== WHEAT TO FLOUR ANIMATION =====================
// shows wheat dropping from a hand, turning into dust and filling a bag
export const WheatTransform = () => {

  const grainDrops = [
    { id: 1, left: "50%", delay: "0s", duration: "2.5s", size: "5px", drift: "-8px", rotate: "18deg" },
    { id: 2, left: "48%", delay: "0.16s", duration: "2.8s", size: "5px", drift: "10px", rotate: "-12deg" },
    { id: 3, left: "53%", delay: "0.32s", duration: "2.6s", size: "5px", drift: "-12px", rotate: "22deg" },
    { id: 4, left: "46%", delay: "0.5s", duration: "2.9s", size: "4px", drift: "9px", rotate: "-18deg" },
    { id: 5, left: "55%", delay: "0.68s", duration: "2.7s", size: "5px", drift: "-7px", rotate: "26deg" },
    { id: 6, left: "49%", delay: "0.86s", duration: "2.9s", size: "4px", drift: "8px", rotate: "-10deg" },
    { id: 7, left: "52%", delay: "1.04s", duration: "2.7s", size: "5px", drift: "-9px", rotate: "14deg" },
    { id: 8, left: "47%", delay: "1.22s", duration: "3s", size: "4px", drift: "11px", rotate: "-24deg" },
    { id: 9, left: "54%", delay: "1.4s", duration: "2.8s", size: "5px", drift: "-8px", rotate: "20deg" },
    { id: 10, left: "50%", delay: "1.58s", duration: "2.85s", size: "4px", drift: "8px", rotate: "-16deg" },
  ];

  return (
    <section className="premium-transform-section">

      <div className="container premium-transform-grid">

        <RevealSection className="premium-transform-copy">
          <p className="premium-transform-eyebrow">Crafted with care</p>

          <h2>From Grain to Flour</h2>

          <p>
            Our wheat is carefully selected, cleaned, and transformed into fine,
            fresh flour with precision, purity, and premium quality.
          </p>
        </RevealSection>


        <RevealSection className="premium-transform-stage">

          <div className="premium-stage-glow" />


          <div className="premium-sack-wrap">
            <img
              src={`${process.env.PUBLIC_URL}/images/wheatsack.png`}
              alt="Wheat sack"
              className="premium-sack-asset"
              onError={handleImgError}
            />
          </div>


          <div className="premium-grain-stream" aria-hidden="true">
            {grainDrops.map((grain) => (

              <span
                key={grain.id}
                className="premium-grain-drop"
                style={{
                  left: grain.left,
                  width: grain.size,
                  height: `calc(${grain.size} * 1.5)`,
                  animationDelay: grain.delay,
                  animationDuration: grain.duration,
                  "--grain-drift": grain.drift,
                  "--grain-rotate": grain.rotate
                }}
              />

            ))}
          </div>


          <div className="premium-bowl-zone">

            <img
              src={`${process.env.PUBLIC_URL}/images/flourdisperse.png`}
              alt=""
              className="premium-flour-dust"
              onError={handleImgError}
            />

            <img
              src={`${process.env.PUBLIC_URL}/images/flourbowl.png`}
              alt="Flour bowl"
              className="premium-bowl-asset"
              onError={handleImgError}
            />

          </div>

        </RevealSection>

      </div>

    </section>
  );
};


// ===================== NAVBAR =====================
export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount } = useCart();
  const { isAdmin, loading: authLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path ? 'active' : '';
  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      
      {/* TOP BAR */}
      <div className="navbar-top">
        <div className="container navbar-top-content">
          <div style={{ display:'flex', gap:'20px', alignItems:'center' }}>
            <span>
              <FiPhone style={{ marginRight:'5px' }} />
              <a href={`tel:${COMPANY_INFO.phone}`}>{COMPANY_INFO.phone}</a>
            </span>
            <span>
              <FiMail style={{ marginRight:'5px' }} />
              <a href={`mailto:${COMPANY_INFO.email}`}>{COMPANY_INFO.email}</a>
            </span>
          </div>
          <div>
            <span>{COMPANY_INFO.workingHours}</span>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <div className="navbar-main">
        <div className="container navbar-main-content">

          {/* LOGO */}
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-placeholder">
              <img src={IMAGES.logo} alt="Zahoor Flour Mills Logo" onError={handleImgError} />
            </div>
            <div className="navbar-logo-text">
              <h1>{COMPANY_INFO.name}</h1>
              <p>{COMPANY_INFO.tagline}</p>
            </div>
          </Link>

          {/* LINKS */}
          <div className="navbar-links">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/about" className={isActive('/about')}>About</Link>
            <Link to="/products" className={isActive('/products')}>Products</Link>
            <Link to="/contact" className={isActive('/contact')}>Contact</Link>
            <Link to="/wheat-seller" className={isActive('/wheat-seller')}>Wholesale</Link>
            <Link to="/faq" className={isActive('/faq')}>FAQ</Link>
          </div>

          {/* ACTIONS */}
          <div className="navbar-actions">

            {/* CART */}
            <Link to="/cart" className="navbar-cart-btn">
              <span className="navbar-cart-icon">
                <FiShoppingCart />
              </span>
              <span className="navbar-cart-label">Cart</span>
              {cartCount > 0 && <span className="navbar-cart-count">{cartCount}</span>}
            </Link>

            {/* DASHBOARD — only after admin-panel login (not customer sign-in) */}
            {!authLoading && isAdmin && (
              <Link to="/admin/dashboard" className="navbar-cart-btn">
                <span className="navbar-cart-label">Dashboard</span>
              </Link>
            )}

            {/* USER ICON (SEPARATE RIGHT SIDE) */}
            <Link to="/signin" className="nav-icon" style={{ marginLeft: '12px' , color: '#fff'}}>
              <FiUser size={20} />
            </Link>

            {/* MOBILE MENU */}
            <button
              className={`navbar-hamburger ${mobileOpen ? 'open' : ''}`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <span /><span /><span />
            </button>

          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`navbar-mobile ${mobileOpen ? 'open' : ''}`}>
        {['/','/about','/products','/contact','/wheat-seller','/faq','/cart','/signin'].map(p => (
          <Link key={p} to={p} onClick={closeMobile}>
            {p === '/' ? 'Home' : p.slice(1).replace('-',' ').replace(/\b\w/g,l=>l.toUpperCase())}
          </Link>
        ))}
        {!authLoading && isAdmin && (
          <Link to="/admin/dashboard" onClick={closeMobile}>Dashboard</Link>
        )}
      </div>

    </nav>
  );
};




// ===================== FOOTER =====================
export const Footer = () => (
  <footer
    className="footer"
    style={{
      backgroundImage: `url(${process.env.PUBLIC_URL}/images/wheat-field.jpg)`
    }}
  >
    <div className="footer-overlay"></div>

    <div className="container">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>{COMPANY_INFO.name}</h3>
          <p>
            Bringing you the finest quality flour since {COMPANY_INFO.established}.
            Our commitment to purity and tradition makes us the trusted choice across Pakistan.
          </p>
          <div className="footer-social">
            <a href={COMPANY_INFO.facebook} target="_blank" rel="noreferrer">
              <FiFacebook />
            </a>
            <a href={COMPANY_INFO.instagram} target="_blank" rel="noreferrer">
              <FiInstagram />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Navigation</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Products</h4>
          <ul>
            <li><Link to="/products">Multi Grain Flour</Link></li>
            <li><Link to="/products">Whole Wheat Flour</Link></li>
            <li><Link to="/products">Fine Flour</Link></li>
            <li><Link to="/products">Maida</Link></li>
            <li><Link to="/wheat-seller">Wholesale</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <div className="footer-contact-item">
            <FiMapPin className="icon" />
            <p>{COMPANY_INFO.address}</p>
          </div>
          <div className="footer-contact-item">
            <FiPhone className="icon" />
            <p>{COMPANY_INFO.phone}</p>
          </div>
          <div className="footer-contact-item">
            <FiMail className="icon" />
            <p>{COMPANY_INFO.email}</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {COMPANY_INFO.established}–2026 <span>{COMPANY_INFO.name}</span>. All Rights Reserved.</p>
        <p>Owned by <span>{COMPANY_INFO.owner}</span></p>
      </div>
    </div>
  </footer>
);

const HeroSection = () => (
  <section className="hero">
    <div className="hero-bg">
      <img src={IMAGES.heroBg} alt="" onError={handleImgError} />
    </div>

    <div className="hero-overlay" />
    <HeroGrains />

    <div className="container hero-content">
      <p className="hero-subtitle">
        ✦ {COMPANY_INFO.tagline} Since {COMPANY_INFO.established} ✦
      </p>

      <h1 className="hero-title">
       Welcome to Zahoor Flour Mills
      </h1>

      <p className="hero-desc">
        Experience the finest quality flour crafted with tradition and modern technology.
        From our mills in Sahiwal to your table — taste the difference of purity.
      </p>

      <div className="hero-buttons">
        <Link to="/products" className="btn btn-primary hero-main-btn">
          Explore Products
        </Link>

        <Link to="/wheat-seller" className="btn btn-outline hero-outline-btn">
          Wholesale Inquiry
        </Link>
      </div>
    </div>
  </section>
);


// ===================== PROCESSING SECTION =====================
const processingSteps = [
  {
    number: '01',
    stepLabel: 'Step One',
    title: 'Wheat Receiving & Storage',
    desc: 'Fresh wheat is received at the mill and stored through a controlled handling system before processing begins.',
    image: '/images/processing1.jpeg',
  },
  {
    number: '02',
    stepLabel: 'Step Two',
    title: 'Cleaning & Pre-Cleaning',
    desc: 'The wheat passes through cleaning equipment to remove dust, stones, husk, and other unwanted impurities.',
    image: '/images/processing2.jpeg',
  },
  {
    number: '03',
    stepLabel: 'Step Three',
    title: 'Grinding & Roller Milling',
    desc: 'The cleaned wheat is gradually ground through roller mills to break it into flour and semolina stages.',
    image: '/images/processing3.jpeg',
  },
  {
    number: '04',
    stepLabel: 'Step Four',
    title: 'Sifting & Separation',
    desc: 'The ground material is sifted and separated carefully to sort flour, bran, and other particle sizes efficiently.',
    image: '/images/processing4.jpeg',
  },
  {
    number: '05',
    stepLabel: 'Step Five',
    title: 'Purification & Fine Processing',
    desc: 'The product moves through advanced purification and processing units to improve texture, consistency, and final quality.',
    image: '/images/processing5.jpeg',
  },
  {
    number: '06',
    stepLabel: 'Step Six',
    title: 'Final Collection & Packing',
    desc: 'The finished flour is collected through the final system and prepared for hygienic packaging and delivery.',
    image: '/images/processing6.jpeg',
  },
];

const ProcessingSection = () => (
  <section className="process-style-two section-padding">
    <div className="container">
      <RevealSection>
        <div className="process-style-two-header">
          <h2>Our Milling Process</h2>
          <p>From golden wheat fields to your kitchen</p>
        </div>
      </RevealSection>

      <div className="process-timeline-two">
        <div className="process-line-two" />

        {processingSteps.map((step, i) => (
          <RevealSection
            key={i}
            className={`process-item-two ${i % 2 === 0 ? 'left' : 'right'}`}
          >
            <div className="process-dot-two" />
            <div className="process-pill-two">{step.stepLabel}</div>

            <div className="process-card-two">
              <div className="process-card-image-two">
                <img src={step.image} alt={step.title} onError={handleImgError} />
              </div>

              <div className="process-card-body-two">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          </RevealSection>
        ))}
      </div>
    </div>
  </section>
);

// ===================== PRODUCT CARD =====================
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const pid = docId(product);

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart({
      ...product,
      selectedWeight: product.weights[0],
      quantity: 1,
    });
  };

  const ratingFive =
    product.rating != null && Number.isFinite(Number(product.rating))
      ? Number(product.rating).toFixed(1)
      : null;
  const reviewCount = product.reviews ?? 0;

  return (
    <div className="product-card">
      <Link to={`/products/${pid}`} className="product-card-image-wrap">
        <div className="product-card-image">
          {product.image ? (
            <img src={product.image} alt={product.name} onError={handleImgError} />
          ) : (
            <span className="product-card-placeholder">📷 Add Image</span>
          )}
        </div>
      </Link>

      <div className="product-card-body">
        <h3 className="product-card-name">{product.name}</h3>

        <div className="product-card-rating-row" aria-label="Average rating">
          <FiStar className="product-card-star" aria-hidden />
          <span className="product-card-rating-num">{ratingFive != null ? `${ratingFive}/5` : '—'}</span>
          <span className="product-card-review-count">
            ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
          </span>
        </div>

        <p className="product-card-price">
          {formatPrice(product.price)} <span>/10 kg</span>
        </p>

        <Link to={`/products/${pid}#product-reviews`} className="product-card-review-cta">
          Write a review
        </Link>

        <div className="product-card-actions">
          <Link to={`/products/${pid}`} className="product-card-btn product-card-btn-outline">
            Details
          </Link>

          <button
            type="button"
            onClick={handleAdd}
            className="product-card-btn product-card-btn-fill"
          >
            <FiShoppingCart />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

// ===================== FEATURED PRODUCTS =====================
const FeaturedProducts = () => {
  const { products } = useProducts();
  const featured = products.filter((p) => p.featured).slice(0, 2);

  return (
    <section
      className="featured-products-section"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/productbackground.jpg)`
      }}
    >
      <div className="container featured-products-inner">
        <RevealSection>
          <div className="section-title featured-products-title">
            <h2>Featured Products</h2>
            <p>Handpicked premium flour varieties — quality you can trust</p>
          </div>
        </RevealSection>

        <div className="featured-products-grid">
          {featured.map((p) => (
            <RevealSection key={docId(p)}>
              <ProductCard product={p} />
            </RevealSection>
          ))}
        </div>

        <RevealSection>
          <div className="featured-products-cta">
            <Link to="/products" className="btn btn-secondary featured-view-all-btn">
              View All Products
            </Link>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};


// ===================== WHY CHOOSE US =====================
const whyFeatures = [
  { icon:<FiShield />, title:'100% Pure & Natural', desc:'No chemicals, no preservatives — only pure goodness from nature.' },
  { icon:<FiAward />, title:'13+ Years Legacy', desc:'Trusted by generations of families and businesses across Punjab.' },
  { icon:<FiTruck />, title:'Fast Delivery', desc:'Quick and reliable delivery across major cities of Punjab.' },
  { icon:<FiHeart />, title:'Customer First', desc:'Your satisfaction is our priority. Quality you can trust, every time.' },
];

const WhyChooseUs = () => (
  <section className="section-padding" style={{ background:'var(--white)', borderTop:'1px solid var(--gray-200)', borderBottom:'1px solid var(--gray-200)' }}>
    <div className="container">
      <RevealSection><div className="section-title"><h2>Why Choose Us</h2><p>We don't just make flour — we create a tradition of quality</p></div></RevealSection>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'26px' }}>
        {whyFeatures.map((f, i) => (
          <RevealSection key={i}>
            <div style={{
              background:'var(--beige-light)', padding:'36px 26px', borderRadius:'var(--radius-md)', textAlign:'center',
              border:'1px solid var(--gray-200)', transition:'all 0.4s ease', cursor:'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='var(--shadow-gold)'; e.currentTarget.style.borderColor='var(--gold-pale)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.borderColor='var(--gray-200)'; }}
            >
              <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'var(--black)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', color:'var(--gold)', margin:'0 auto 18px' }}>{f.icon}</div>
              <h4 style={{ marginBottom:'10px', fontFamily:'var(--font-heading)', fontSize:'1.05rem' }}>{f.title}</h4>
              <p style={{ fontSize:'0.85rem' }}>{f.desc}</p>
            </div>
          </RevealSection>
        ))}
      </div>
    </div>
  </section>
);


// ===================== ANNOUNCEMENTS =====================
const Announcements = () => (
  <section className="section-padding" style={{ background:'var(--beige-light)' }}>
    <div className="container">
      <RevealSection><div className="section-title"><h2>Latest Offers</h2><p>Stay updated with our special offers</p></div></RevealSection>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'20px' }}>
        {[
          { icon:<FiPercent />, title:'Ramadan Special', desc:'15% off on all 20kg+ bags.', color:'var(--royal-blue)' },
          { icon:<FiTruck />, title:'Free Delivery', desc:'Free delivery on orders above PKR 5,000.', color:'var(--green)' },
          { icon:<FiTag />, title:'Wholesale Rates', desc:'Special bulk pricing available.', color:'var(--gold-dark)' },
        ].map((item, i) => (
          <RevealSection key={i}>
            <div style={{
              background:'var(--white)', padding:'26px', borderRadius:'var(--radius-md)',
              border:'1px solid var(--gray-200)', borderLeft:`3px solid ${item.color}`,
              display:'flex', gap:'14px', alignItems:'flex-start', transition:'all 0.3s ease',
            }} onMouseEnter={e => e.currentTarget.style.transform='translateX(4px)'} onMouseLeave={e => e.currentTarget.style.transform='translateX(0)'}>
              <div style={{ fontSize:'1.2rem', color:item.color, marginTop:'2px' }}>{item.icon}</div>
              <div><h4 style={{ marginBottom:'6px', fontSize:'1rem' }}>{item.title}</h4><p style={{ fontSize:'0.85rem' }}>{item.desc}</p></div>
            </div>
          </RevealSection>
        ))}
      </div>
    </div>
  </section>
);


// ===================== MAP =====================
const GoogleMapSection = () => (
  <section style={{ background:'var(--black)', padding:'25px 0 0' }}>
    <div className="container">
      <RevealSection><div className="section-title"><h2 style={{ color:'var(--white)' }}>Find Us</h2><p style={{ color:'rgba(255,255,255,0.45)' }}>Visit our mill in Sahiwal</p></div></RevealSection>
    </div>
    <div style={{ width:'100%', height:'350px' }}>
      <iframe src={COMPANY_INFO.mapEmbedUrl} width="100%" height="100%" style={{ border:0, opacity:0.8, filter:'grayscale(30%)' }} allowFullScreen="" loading="lazy" title="Location" />
    </div>
  </section>
);


// ===================== HOME PAGE =====================
export const HomePage = () => (
  <main>
    <HeroSection />
    <WheatTransform />
    <FeaturedProducts />
    <ProcessingSection />
    <WhyChooseUs />
    <Announcements />
    <GoogleMapSection />
  </main>
);


// ===================== ABOUT PAGE =====================
export const AboutPage = () => (
  <div className="about-page">
    <div className="about-hero">
      <div className="container"><h1>About {COMPANY_INFO.name}</h1><p>A legacy of quality, trust, and tradition since {COMPANY_INFO.established}</p></div>
    </div>
    <section className="section-padding" style={{ background:'var(--beige-light)' }}>
      <div className="container">
        <div className="about-story">
          <div className="about-story-image">
            {/* === MILL IMAGE: Replace with your mill photo === */}
            <img src={IMAGES.millBuilding} alt="Mill" style={{ width:'100%', height:'100%', objectFit:'cover' }} onError={handleImgError} />
          </div>
          <div>
            <h2 style={{ marginBottom:'16px' }}>Our <span style={{ color:'var(--royal-blue)' }}>Story</span></h2>
            <p style={{ marginBottom:'14px' }}>Established in {COMPANY_INFO.established}, {COMPANY_INFO.name} was founded by {COMPANY_INFO.owner} with a vision to provide the purest flour to every Pakistani household.</p>
            <p style={{ marginBottom:'14px' }}>Located at {COMPANY_INFO.address}, our facility combines traditional techniques with modern technology.</p>
            <p>Today, we serve thousands of households and businesses across Sahiwal and Punjab.</p>
          </div>
        </div>
      </div>
    </section>
   
  </div>
);


// ===================== PRODUCTS PAGE =====================
export const ProductsPage = () => {
  const { products } = useProducts();
  const [activeCat, setActiveCat] = useState('All');
  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filtered = activeCat === 'All' ? products : products.filter(p => p.category === activeCat);

  return (
    <div className="products-page section-padding">
      <div className="container">
        <div className="section-title"><h2>Our Products</h2><p>Explore our complete range of premium flour</p></div>
        <div style={{ display:'flex', justifyContent:'center', gap:'10px', flexWrap:'wrap', marginBottom:'40px' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)} className={`btn ${activeCat === cat ? 'btn-primary' : 'btn-secondary'}`} style={{ padding:'9px 22px', fontSize:'0.78rem' }}>{cat}</button>
          ))}
        </div>
        <div className="products-grid">{filtered.map(p => <ProductCard key={docId(p)} product={p} />)}</div>
      </div>
    </div>
  );
};


// ===================== PRODUCT DETAIL =====================
export const ProductDetailPage = () => {
  const { id } = useParams();
  const { products, addReview } = useProducts();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const product = products.find((p) => String(docId(p)) === String(id));
  const [selectedWeight, setSelectedWeight] = useState('10kg');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    authorName: '',
    authorEmail: '',
    rating: 5,
    title: '',
    comment: '',
  });
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    if (product?.weights?.length) {
      setSelectedWeight(product.weights[0]);
    }
  }, [id, product]);

  useEffect(() => {
    if (user) {
      setReviewForm((f) => ({
        ...f,
        authorName: user.name || f.authorName,
        authorEmail: user.email || f.authorEmail,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!product) return undefined;
    if (window.location.hash !== '#product-reviews') return undefined;
    const t = window.setTimeout(() => {
      document.getElementById('product-reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return () => window.clearTimeout(t);
  }, [product, id]);

  useEffect(() => {
    if (!product) return undefined;
    const pid = docId(product);
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiUrl(`/api/reviews/product/${pid}`));
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) setReviews(data);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [product, id]);

  if (!product) return <div className="product-detail section-padding"><div className="container" style={{ textAlign:'center' }}><h2>Product not found</h2><Link to="/products" className="btn btn-primary" style={{ marginTop:'18px' }}>Back</Link></div></div>;

  const currentPrice = getPriceByWeight(product.price, selectedWeight);
  const ratingFiveDisplay =
    product.rating != null && Number.isFinite(Number(product.rating))
      ? Number(product.rating).toFixed(1)
      : null;

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewMsg('');
    try {
      await addReview({
        productId: docId(product),
        authorName: reviewForm.authorName.trim(),
        authorEmail: reviewForm.authorEmail.trim() || undefined,
        rating: Number(reviewForm.rating),
        title: reviewForm.title.trim(),
        comment: reviewForm.comment.trim(),
      });
      const res = await fetch(apiUrl(`/api/reviews/product/${docId(product)}`));
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
      setReviewForm((f) => ({ ...f, comment: '', title: '' }));
      setReviewMsg('Thank you — your review was posted.');
    } catch (err) {
      setReviewMsg(err.message || 'Could not post review.');
    }
  };

  return (
    <div className="product-detail section-padding">
      <div className="container">
        <p style={{ marginBottom:'28px', fontSize:'0.82rem', color:'var(--gray-400)' }}><Link to="/" style={{ color:'var(--royal-blue)' }}>Home</Link> / <Link to="/products" style={{ color:'var(--royal-blue)' }}>Products</Link> / <span style={{ color:'var(--black)' }}>{product.name}</span></p>
        <div className="product-detail-grid">
          <div className="product-detail-image">
            {product.image ? <img src={product.image} alt={product.name} onError={handleImgError} /> : <span style={{ color:'var(--gray-400)' }}>📷 Product Image</span>}
          </div>
          <div className="product-detail-info">
            <p className="product-detail-category">{product.category}</p>
            <h1>{product.name}</h1>
            <div className="product-detail-rating-row" aria-label="Average rating">
              <FiStar className="product-detail-star" aria-hidden />
              <span className="product-detail-rating-num">
                {ratingFiveDisplay != null ? `${ratingFiveDisplay}/5` : '—'}
              </span>
              <span className="product-detail-review-count">
                ({product.reviews ?? 0} {(product.reviews ?? 0) === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            <p className="product-detail-price">{formatPrice(currentPrice)}</p>
            <p className="product-detail-desc">{product.description}</p>
            <div style={{ marginBottom:'22px' }}>
              <h4 style={{ marginBottom:'10px', fontSize:'0.82rem', textTransform:'uppercase', letterSpacing:'1.5px' }}>Weight</h4>
              <div className="weight-options">{(product.weights || []).map(w => <button key={w} type="button" className={`weight-option ${selectedWeight === w ? 'active' : ''}`} onClick={() => setSelectedWeight(w)}>{w}</button>)}</div>
            </div>
            <div>
              <h4 style={{ marginBottom:'10px', fontSize:'0.82rem', textTransform:'uppercase', letterSpacing:'1.5px' }}>Quantity</h4>
              <div className="quantity-selector">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <input type="number" value={quantity} onChange={e => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))} />
                <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>
            <p style={{ fontSize:'1rem', fontWeight:'600', marginBottom:'22px' }}>Total: <span style={{ color:'var(--green)', fontSize:'1.4rem' }}>{formatPrice(currentPrice * quantity)}</span></p>
            <div className="product-detail-actions">
              <button type="button" onClick={() => addToCart({ ...product, selectedWeight, quantity })} className="btn btn-primary"><FiShoppingCart /> Add to Cart</button>
              <Link to="/wheat-seller" className="btn btn-secondary"><FiMessageSquare /> Bulk Quote</Link>
            </div>
          </div>
        </div>

        <section id="product-reviews" style={{ marginTop: '48px', paddingTop: '36px', borderTop: '1px solid var(--gray-200)' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '20px' }}>Customer reviews</h2>
          {reviews.length === 0 ? (
            <p style={{ color: 'var(--gray-400)', marginBottom: '24px' }}>
              No reviews yet — be the first to share your experience.
            </p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
              {reviews.map((r) => (
                <li key={docId(r)} style={{ padding: '16px 0', borderBottom: '1px solid var(--gray-200)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <strong>{r.authorName}</strong>
                    <span style={{ color: 'var(--gold)' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                  </div>
                  {r.title && <p style={{ fontWeight: 600, marginTop: '6px' }}>{r.title}</p>}
                  <p style={{ marginTop: '8px', fontSize: '0.95rem' }}>{r.comment}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '8px' }}>
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <h3 className="product-detail-write-heading">Write a review</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--gray-500)', marginBottom: '16px', maxWidth: '520px' }}>
            Anyone can leave a review. It is stored with this product and shows below for all visitors.
          </p>
          {reviewMsg && (
            <div style={{ padding: '10px 14px', marginBottom: '14px', borderRadius: 'var(--radius-sm)', background: reviewMsg.startsWith('Thank') ? 'var(--green-pale)' : '#fdeaea', color: reviewMsg.startsWith('Thank') ? 'var(--green)' : '#8b2e2e', fontSize: '0.9rem' }}>
              {reviewMsg}
            </div>
          )}
          <form onSubmit={submitReview} style={{ maxWidth: '520px' }}>
            <div className="form-group"><label>Your name *</label><input required value={reviewForm.authorName} onChange={(e) => setReviewForm({ ...reviewForm, authorName: e.target.value })} /></div>
            <div className="form-group"><label>Email (optional)</label><input type="email" value={reviewForm.authorEmail} onChange={(e) => setReviewForm({ ...reviewForm, authorEmail: e.target.value })} /></div>
            <div className="form-group"><label>Rating *</label>
              <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
              </select>
            </div>
            <div className="form-group"><label>Short title (optional)</label><input value={reviewForm.title} onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })} placeholder="e.g. Excellent quality" /></div>
            <div className="form-group"><label>Your review *</label><textarea required rows={4} value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Tell others about this flour…" /></div>
            <button type="submit" className="btn btn-primary"><FiSend /> Post review</button>
          </form>
        </section>
      </div>
    </div>
  );
};


// ===================== CART =====================
export const CartPage = () => {
  const { cartItems, clearCart, updateQuantity, removeFromCart } = useCart();
  if (cartItems.length === 0) return (
    <div className="cart-page section-padding"><div className="container cart-empty">
      <FiShoppingCart style={{ fontSize:'3rem', color:'var(--gray-300)', marginBottom:'16px' }} />
      <h2>Your Cart is Empty</h2><p style={{ marginBottom:'24px' }}>Add products to start</p>
      <Link to="/products" className="btn btn-primary">Browse Products</Link>
    </div></div>
  );
  const subtotal = cartItems.reduce((t, i) => t + getPriceByWeight(i.price, i.selectedWeight) * i.quantity, 0);
  const delivery = subtotal >= 5000 ? 0 : 250;
  const total = subtotal + delivery;

  return (
    <div className="cart-page section-padding"><div className="container">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px' }}>
        <h2>Shopping Cart ({cartItems.length})</h2>
        <button onClick={clearCart} className="btn btn-secondary" style={{ padding:'8px 18px', fontSize:'0.78rem' }}>Clear</button>
      </div>
      <div className="cart-layout">
        <div className="cart-items-list">
          {cartItems.map(item => (
            <div key={`${docId(item)}-${item.selectedWeight}`} className="cart-item">
              <div className="cart-item-image">{item.image ? <img src={item.image} alt={item.name} /> : <span>🌾</span>}</div>
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p className="cart-item-weight">{item.selectedWeight}</p>
                <p className="cart-item-price">{formatPrice(getPriceByWeight(item.price, item.selectedWeight) * item.quantity)}</p>
              </div>
              <div className="cart-item-controls">
                <div className="cart-item-qty">
                  <button onClick={() => updateQuantity(docId(item), item.selectedWeight, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(docId(item), item.selectedWeight, item.quantity + 1)}>+</button>
                </div>
                <button className="cart-item-remove" onClick={() => removeFromCart(docId(item), item.selectedWeight)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="cart-summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
          <div className="cart-summary-row"><span>Delivery</span><span>{delivery === 0 ? 'FREE' : formatPrice(delivery)}</span></div>
          <div className="cart-summary-total"><span>Total</span><span>{formatPrice(total)}</span></div>
          <Link to="/checkout" className="btn btn-primary" style={{ width:'100%', marginTop:'22px' }}>Proceed to Checkout</Link>
        </div>
      </div>
    </div></div>
  );
};


// ===================== CHECKOUT =====================
export const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { addOrder } = useProducts();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: '', phone: '', address: '', city: 'Sahiwal', paymentMethod: 'cod', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [intentErr, setIntentErr] = useState('');
  const [stripeUiErr, setStripeUiErr] = useState('');
  const [processing, setProcessing] = useState(false);
  const [resolvedPublishableKey, setResolvedPublishableKey] = useState(() =>
    normalizePublishableKey(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let next = normalizePublishableKey(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
      try {
        const res = await fetch(apiUrl('/api/payments/public-config'));
        const data = await res.json().catch(() => ({}));
        const fromServer = normalizePublishableKey(data.publishableKey);
        if (fromServer) next = fromServer;
      } catch {
        /* keep CRA env fallback if server unreachable */
      }
      if (!cancelled) setResolvedPublishableKey(next);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stripePublishableConfigured = Boolean(resolvedPublishableKey);
  const stripePromise = useMemo(
    () => getStripePromise(resolvedPublishableKey),
    [resolvedPublishableKey]
  );

  const subtotal = cartItems.reduce((t, i) => t + getPriceByWeight(i.price, i.selectedWeight) * i.quantity, 0);
  const delivery = subtotal >= 5000 ? 0 : 250;
  const total = subtotal + delivery;
  const amountMinor = Math.max(100, Math.round(total * 100));

  useEffect(() => {
    if (formData.paymentMethod !== 'card' || !resolvedPublishableKey) {
      setClientSecret(null);
      setIntentErr('');
      return undefined;
    }
    let cancelled = false;
    setIntentErr('');
    (async () => {
      try {
        const res = await fetch(apiUrl('/api/payments/create-payment-intent'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: amountMinor }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Could not start card payment');
        if (!cancelled) setClientSecret(data.clientSecret);
      } catch (e) {
        const raw = e.message || 'Payment setup failed';
        const friendly =
          /not configured|STRIPE|stripe|503|secret|publishable|backend\.env/i.test(raw)
            ? 'Card payment is not available right now. Please choose Cash on Delivery.'
            : 'We could not prepare card payment. Please try again or use Cash on Delivery.';
        if (!cancelled) setIntentErr(friendly);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [formData.paymentMethod, amountMinor, resolvedPublishableKey]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCodSubmit = async (e) => {
    e.preventDefault();
    if (formData.paymentMethod !== 'cod') return;
    try {
      await addOrder({
        ...formData,
        items: cartItems,
        subtotal,
        delivery,
        total,
        paymentStatus: 'pending',
      });
      clearCart();
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Could not place order. Is the backend running and MongoDB connected?');
    }
  };

  if (cartItems.length === 0 && !submitted) {
    return (
      <div className="checkout-page section-padding">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Your cart is empty</h2>
          <p style={{ margin: '16px 0 24px' }}>Add products before checkout.</p>
          <Link to="/products" className="btn btn-primary">Browse products</Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="checkout-page section-padding"><div className="container" style={{ textAlign:'center' }}>
        <div style={{ fontSize:'4rem', marginBottom:'16px' }}>✅</div>
        <h2 style={{ marginBottom:'14px' }}>Order Placed!</h2>
        <p style={{ marginBottom:'24px' }}>Thank you — we&apos;ll contact you shortly.</p>
        <button type="button" onClick={() => navigate('/')} className="btn btn-primary">Back to Home</button>
      </div></div>
    );
  }

  return (
    <div className="checkout-page section-padding"><div className="container">
      <h2 style={{ marginBottom:'28px' }}>Checkout</h2>
      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleCodSubmit}>
          <h3>Delivery Information</h3>
          <div className="form-group"><label>Full Name *</label><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Your full name" /></div>
          <div className="form-group"><label>Phone *</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="03XX XXXXXXX" /></div>
          <div className="form-group"><label>Address *</label><textarea name="address" value={formData.address} onChange={handleChange} required placeholder="Complete address" /></div>
          <div className="form-group"><label>City *</label><input type="text" name="city" value={formData.city} onChange={handleChange} required /></div>
          <h3 style={{ marginTop:'28px' }}>Payment</h3>
          <div className="payment-options">
            {PAYMENT_METHODS.map((m) => (
              <label key={m.id} className={`payment-option ${formData.paymentMethod === m.id ? 'active' : ''}`}>
                <input type="radio" name="paymentMethod" value={m.id} checked={formData.paymentMethod === m.id} onChange={handleChange} />
                {m.id === 'card' ? <><FiCreditCard style={{ marginRight: 6, verticalAlign: 'middle' }} />{m.label}</> : m.label}
              </label>
            ))}
          </div>
          {formData.paymentMethod === 'card' && !stripePublishableConfigured && (
            <p style={{ marginTop: 12, fontSize: '0.9rem', color: '#5c4a3a', background: '#faf6f0', padding: '12px 14px', borderRadius: 8, border: '1px solid var(--gray-200)' }}>
              Card payment is not available right now. Please use Cash on Delivery.
            </p>
          )}
          {formData.paymentMethod === 'card' && stripePublishableConfigured && intentErr && (
            <p style={{ marginTop: 12, color: '#a84040', fontSize: '0.9rem' }}>{intentErr}</p>
          )}
          {formData.paymentMethod === 'card' && stripePublishableConfigured && stripeUiErr && (
            <p style={{ marginTop: 12, color: '#a84040', fontSize: '0.9rem' }}>{stripeUiErr}</p>
          )}
          {formData.paymentMethod === 'card' && stripePublishableConfigured && clientSecret && stripePromise && (
            <StripeCardSection
              stripePromise={stripePromise}
              clientSecret={clientSecret}
              disabled={processing}
              onError={(msg) => {
                const s = String(msg);
                const looksTechnical =
                  /publishable|secret|not configured|invalid.?key|backend\.env|api.?key|No API key/i.test(s) ||
                  /network|fetch failed|failed to fetch/i.test(s);
                setStripeUiErr(
                  looksTechnical
                    ? 'Card payment could not continue. Please try Cash on Delivery or try again in a moment.'
                    : s
                );
              }}
              onPaid={async (paymentIntentId) => {
                setProcessing(true);
                setStripeUiErr('');
                try {
                  await addOrder({
                    ...formData,
                    items: cartItems,
                    subtotal,
                    delivery,
                    total,
                    paymentMethod: 'card',
                    stripePaymentIntentId: paymentIntentId,
                    paymentStatus: 'paid',
                  });
                  clearCart();
                  setSubmitted(true);
                } catch (err) {
                  alert(err.message || 'Order save failed after payment. Contact support with your payment reference.');
                }
                setProcessing(false);
              }}
            />
          )}
          <div className="form-group" style={{ marginTop:'20px' }}><label>Notes</label><textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Special instructions..." /></div>
          {formData.paymentMethod === 'cod' && (
            <button type="submit" className="btn btn-primary" style={{ width:'100%' }}>Place order — {formatPrice(total)}</button>
          )}
        </form>
        <div className="cart-summary">
          <h3>Your Order</h3>
          {cartItems.map(item => <div key={`${docId(item)}-${item.selectedWeight}`} className="cart-summary-row"><span>{item.name} ({item.selectedWeight}) × {item.quantity}</span><span>{formatPrice(getPriceByWeight(item.price, item.selectedWeight) * item.quantity)}</span></div>)}
          <div className="cart-summary-row"><span>Delivery</span><span>{delivery === 0 ? 'FREE' : formatPrice(delivery)}</span></div>
          <div className="cart-summary-total"><span>Total</span><span>{formatPrice(total)}</span></div>
        </div>
      </div>
    </div></div>
  );
};


// ===================== CONTACT =====================
export const ContactPage = () => {
  const { addContact } = useProducts();
  const [formData, setFormData] = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const [submitted, setSubmitted] = useState(false);
  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addContact(formData);
      setSubmitted(true);
      setFormData({ name:'', email:'', phone:'', subject:'', message:'' });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Could not send message. Is the backend running?');
    }
  };

  return (
    <div className="contact-page section-padding"><div className="container">
      <div className="section-title"><h2>Get In Touch</h2><p>We'd love to hear from you</p></div>
      <div className="contact-grid">
        <div className="contact-info-cards">
          {[
            { icon:<FiPhone />, title:'Phone', info:COMPANY_INFO.phone },
            { icon:<FiMail />, title:'Email', info:COMPANY_INFO.email },
            { icon:<FiMapPin />, title:'Address', info:COMPANY_INFO.address },
            { icon:<FiClock />, title:'Hours', info:COMPANY_INFO.workingHours },
          ].map((c,i) => <div key={i} className="contact-info-card"><div className="icon">{c.icon}</div><div><h4>{c.title}</h4><p>{c.info}</p></div></div>)}
        </div>
        <div className="contact-form-box">
          <h3 style={{ marginBottom:'22px' }}>Send Message</h3>
          {submitted && <div style={{ background:'var(--green-pale)', border:'1px solid var(--green)', color:'var(--green)', padding:'10px 18px', borderRadius:'var(--radius-sm)', marginBottom:'18px', fontSize:'0.9rem' }}>✅ Sent!</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" /></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
              <div className="form-group"><label>Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email" /></div>
              <div className="form-group"><label>Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="03XX" /></div>
            </div>
            <div className="form-group"><label>Subject *</label><input type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="Subject" /></div>
            <div className="form-group"><label>Message *</label><textarea name="message" value={formData.message} onChange={handleChange} required placeholder="Message..." rows="5" /></div>
            <button type="submit" className="btn btn-primary" style={{ width:'100%' }}><FiSend /> Send</button>
          </form>
        </div>
      </div>
    </div></div>
  );
};


// ===================== FAQ =====================
export const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div className="faq-page section-padding"><div className="container">
      <div className="section-title"><h2>FAQ</h2><p>Common questions answered</p></div>
      <div className="faq-list">
        {FAQ_DATA.map((item, i) => (
          <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`}>
            <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)}><span>{item.question}</span><span className="faq-toggle">+</span></button>
            <div className="faq-answer"><p>{item.answer}</p></div>
          </div>
        ))}
      </div>
    </div></div>
  );
};


// ===================== WHEAT SELLER =====================
export const WheatSellerPage = () => {
  const { addInquiry } = useProducts();
  const [formData, setFormData] = useState({ businessName:'', contactPerson:'', phone:'', email:'', quantity:'', message:'' });
  const [submitted, setSubmitted] = useState(false);
  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addInquiry(formData);
      setSubmitted(true);
      setFormData({ businessName:'', contactPerson:'', phone:'', email:'', quantity:'', message:'' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Could not submit inquiry. Is the backend running?');
    }
  };

  return (
    <div className="wheat-seller-page section-padding"><div className="container">
      <div className="wheat-seller-grid">
        <div className="wheat-seller-info">
          <h2>Wholesale & <span style={{ color:'var(--royal-blue)' }}>Bulk Orders</span></h2>
          <p>Zahoor Flour Mills offers competitive wholesale pricing with guaranteed quality.</p>
          <div className="wheat-seller-benefits">
            {['Competitive pricing','Quality guaranteed','Flexible quantities','Punjab-wide delivery','Dedicated support','Custom packaging'].map((b,i) => <div key={i} className="wheat-seller-benefit"><div className="check"><FiCheck /></div><span>{b}</span></div>)}
          </div>
        </div>
        <div className="wheat-seller-form-box">
          <h3 style={{ marginBottom:'22px' }}>Submit Inquiry</h3>
          {submitted && <div style={{ background:'var(--green-pale)', border:'1px solid var(--green)', color:'var(--green)', padding:'10px 18px', borderRadius:'var(--radius-sm)', marginBottom:'18px', fontSize:'0.9rem' }}>✅ Submitted!</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Business *</label><input type="text" name="businessName" value={formData.businessName} onChange={handleChange} required placeholder="Business name" /></div>
            <div className="form-group"><label>Contact *</label><input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required placeholder="Contact name" /></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
              <div className="form-group"><label>Phone *</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="03XX" /></div>
              <div className="form-group"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email" /></div>
            </div>
            <div className="form-group"><label>Quantity *</label><input type="text" name="quantity" value={formData.quantity} onChange={handleChange} required placeholder="e.g. 500 bags 40kg" /></div>
            <div className="form-group"><label>Message</label><textarea name="message" value={formData.message} onChange={handleChange} placeholder="Requirements..." rows="4" /></div>
            <button type="submit" className="btn btn-primary" style={{ width:'100%' }}><FiSend /> Submit</button>
          </form>
        </div>
      </div>
    </div></div>
  );
};


// ===================== AUTH =====================
export const SignInPage = () => {
  const { login } = useAuth(); const navigate = useNavigate();
  const [formData, setFormData] = useState({ email:'', password:'' }); const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(apiUrl('/api/users/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || 'Sign in failed');
        return;
      }
      login(data);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Cannot reach server. Start the backend and MongoDB, then try again.');
    }
  };
  return (
    <div className="auth-page section-padding"><div className="container auth-container"><div className="auth-box">
      <h2>Welcome Back</h2><p className="subtitle">Sign in to your account</p>
      {error && <div style={{ color:'#8b2e2e', marginBottom:'14px', fontSize:'0.85rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label>Email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email:e.target.value})} required placeholder="your@email.com" /></div>
        <div className="form-group"><label>Password</label><input type="password" value={formData.password} onChange={e => setFormData({...formData, password:e.target.value})} required placeholder="••••••••" /></div>
        <button type="submit" className="btn btn-primary" style={{ width:'100%' }}><FiLogIn /> Sign In</button>
      </form>
      <p className="auth-link">No account? <Link to="/signup">Sign Up</Link></p>
      <div className="auth-divider">or</div>
      <Link to="/admin/login" style={{ color:'var(--royal-blue)', fontSize:'0.85rem', fontWeight:'600' }}>Admin Login →</Link>
    </div></div></div>
  );
};

export const SignUpPage = () => {
  const { login } = useAuth(); const navigate = useNavigate();
  const [formData, setFormData] = useState({ name:'', email:'', phone:'', password:'', confirmPassword:'' }); const [error, setError] = useState('');
  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    setError('Passwords mismatch');
    return;
  }

  try {
    const res = await fetch(apiUrl('/api/users/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      }),
    });

    const data = await res.json();

 if (res.ok) {
  login(data);

  navigate('/', {
    state: { message: `Signed in as ${data.name}` }
  });
} else {
      setError(data.message || 'Signup failed');
    }

  } catch (error) {
    console.error(error);
    setError('Server error');
  }
};
  return (
    <div className="auth-page section-padding"><div className="container auth-container"><div className="auth-box">
      <h2>Create Account</h2><p className="subtitle">Join {COMPANY_INFO.name}</p>
      {error && <div style={{ color:'#8b2e2e', marginBottom:'14px', fontSize:'0.85rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label>Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Name" /></div>
        <div className="form-group"><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email" /></div>
        <div className="form-group"><label>Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="03XX" /></div>
        <div className="form-group"><label>Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Min 6" /></div>
        <div className="form-group"><label>Confirm</label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Re-enter" /></div>
        <button type="submit" className="btn btn-primary" style={{ width:'100%' }}><FiUserPlus /> Create</button>
      </form>
      <p className="auth-link">Have account? <Link to="/signin">Sign In</Link></p>
    </div></div></div>
  );
};


// ===================== ADMIN =====================
export const AdminLogin = () => {
  const { adminLogin, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: 'admin@zahoorflourmills.local', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(apiUrl('/api/auth/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }
      adminLogin({ token: data.token, user: data.user });
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError('Cannot reach server. Start the backend (npm start in the backend folder) and check the API URL.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login"><div className="admin-login-box">
      <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'var(--beige)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:'1.4rem', color:'var(--royal-blue)' }}><FiLock /></div>
      <h2>Admin Login</h2>
      <p className="subtitle">Store dashboard access.</p>
      {error && <div style={{ color:'#8b2e2e', marginBottom:'14px', fontSize:'0.85rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group"><label>Admin email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email:e.target.value})} required placeholder="admin@zahoorflourmills.local" disabled={submitting} /></div>
        <div className="form-group"><label>Password</label><input type="password" value={formData.password} onChange={e => setFormData({...formData, password:e.target.value})} required placeholder="Password" autoComplete="current-password" disabled={submitting} /></div>
        <button type="submit" className="btn btn-primary" style={{ width:'100%' }} disabled={submitting}><FiLock /> {submitting ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div></div>
  );
};

const adminLinks = [
  { path:'/admin/dashboard', label:'Dashboard', icon:<FiGrid /> },
  { path:'/admin/products', label:'Products', icon:<FiBox /> },
  { path:'/admin/orders', label:'Orders', icon:<FiShoppingBag /> },
  { path:'/admin/inquiries', label:'Inquiries', icon:<FiMessageSquare /> },
  { path:'/admin/contacts', label:'Contacts', icon:<FiMail /> },
  { path:'/admin/reviews', label:'Reviews', icon:<FiStar /> },
  { path:'/admin/users', label:'Users', icon:<FiUsers /> },
];

const AdminSidebar = () => {
  const location = useLocation(); const { logout } = useAuth();
  const navigate = useNavigate();

useEffect(() => {
  if (location.state?.message) {
    alert(location.state.message);

    // clear message so it doesn't repeat
    navigate(location.pathname, { replace: true, state: {} });
  }
}, [location, navigate]);
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-logo"><h3>{COMPANY_INFO.name}</h3><p>Admin Panel</p></div>
      <nav className="admin-sidebar-nav">
        {adminLinks.map(l => <Link key={l.path} to={l.path} className={`admin-sidebar-link ${location.pathname === l.path ? 'active' : ''}`}><span className="icon">{l.icon}</span><span>{l.label}</span></Link>)}
        <div style={{ marginTop:'24px', borderTop:'1px solid rgba(197,162,84,0.08)', paddingTop:'12px' }}>
          <Link to="/" className="admin-sidebar-link"><span className="icon"><FiHome /></span><span>Website</span></Link>
          <button onClick={logout} className="admin-sidebar-link" style={{ color:'#a84040' }}><span className="icon"><FiLogOut /></span><span>Logout</span></button>
        </div>
      </nav>
    </aside>
  );
};

export const AdminLayout = () => {
  const { isAdmin, loading } = useAuth();
  if (!loading && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main"><Outlet /></main>
    </div>
  );
};

export const AdminDashboard = () => {
  const { products, orders, inquiries, contacts } = useProducts();
  const { adminToken } = useAuth();
  const [reviewCount, setReviewCount] = useState(0);
  useEffect(() => {
    if (!adminToken) {
      setReviewCount(0);
      return undefined;
    }
    let c = true;
    (async () => {
      try {
        const res = await fetch(apiUrl('/api/reviews'), {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        const data = await res.json();
        if (c && Array.isArray(data)) setReviewCount(data.length);
      } catch {
        if (c) setReviewCount(0);
      }
    })();
    return () => { c = false; };
  }, [adminToken]);
  return (
    <div>
      <div className="admin-header"><h2>Dashboard</h2></div>
      <div className="admin-stats-grid">
        {[
          { title:'Products', value:products.length, icon:<FiBox />, color:'var(--royal-blue)' },
          { title:'Orders', value:orders.length, icon:<FiShoppingBag />, color:'var(--green)' },
          { title:'Pending', value:orders.filter(o => o.status === 'Pending').length, icon:<FiShoppingBag />, color:'var(--gold-dark)' },
          { title:'Inquiries (new)', value:inquiries.filter(i => !i.isRead).length, icon:<FiMessageSquare />, color:'var(--royal-blue)' },
          { title:'Contacts', value:contacts.length, icon:<FiMail />, color:'var(--green)' },
          { title:'Reviews', value:reviewCount, icon:<FiStar />, color:'var(--gold-dark)' },
        ].map((s,i) => <div key={i} className="admin-stat-card"><div className="admin-stat-info"><h4>{s.title}</h4><h2>{s.value}</h2></div><div className="admin-stat-icon" style={{ background:`${s.color}10`, color:s.color }}>{s.icon}</div></div>)}
      </div>
      <div className="admin-table-container">
        <div className="admin-table-header"><h3>Recent Orders</h3></div>
        <table className="admin-table">
          <thead><tr><th>ID</th><th>Customer</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {orders.slice(-5).reverse().map(o => <tr key={docId(o)}><td>#{docId(o)}</td><td>{o.fullName}</td><td><span className={`status-badge status-${o.status.toLowerCase()}`}>{o.status}</span></td><td>{new Date(o.createdAt).toLocaleDateString()}</td></tr>)}
            {orders.length === 0 && <tr><td colSpan="4" style={{ textAlign:'center', padding:'24px' }}>No orders</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name:'', price:'', description:'', category:'', weights:'10kg,20kg,30kg,40kg', featured:false, inStock:true, image:'' });
  useEffect(() => { if (editing) setFormData({ ...editing, weights:editing.weights?.join(',') || '' }); else setFormData({ name:'', price:'', description:'', category:'', weights:'10kg,20kg,30kg,40kg', featured:false, inStock:true, image:'' }); }, [editing]);
  const handleSave = async (e) => {
    e.preventDefault();
    const data = { ...formData, price: parseInt(formData.price, 10), weights: formData.weights.split(',').map((w) => w.trim()), rating: editing?.rating || 4.5, reviews: editing?.reviews || 0 };
    try {
      if (editing) await updateProduct(docId(editing), data);
      else await addProduct(data);
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Save failed');
    }
  };

  return (
    <div>
      <div className="admin-header"><h2>Products</h2><button onClick={() => { setEditing(null); setShowForm(true); }} className="btn btn-primary" style={{ padding:'9px 18px', fontSize:'0.78rem' }}><FiPlus /> Add</button></div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Featured</th><th>Stock</th><th>Actions</th></tr></thead>
          <tbody>{products.map(p => <tr key={docId(p)}><td style={{ fontWeight:'600' }}>{p.name}</td><td>{p.category}</td><td>{formatPrice(p.price)}</td><td>{p.featured ? '⭐' : '—'}</td><td><span className={`status-badge ${p.inStock ? 'status-delivered' : 'status-cancelled'}`}>{p.inStock ? 'In Stock' : 'Out'}</span></td><td style={{ display:'flex', gap:'6px' }}><button onClick={() => { setEditing(p); setShowForm(true); }} className="admin-action-btn admin-btn-edit">Edit</button><button onClick={() => { if (!window.confirm('Delete?')) return; deleteProduct(docId(p)).catch((err) => alert(err.message)); }} className="admin-action-btn admin-btn-delete">Delete</button></td></tr>)}</tbody>
        </table>
      </div>
      {showForm && <div className="admin-form-modal" onClick={() => { setShowForm(false); setEditing(null); }}><div className="admin-form-box" onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom:'22px' }}>{editing ? 'Edit' : 'Add'} Product</h3>
        <form onSubmit={handleSave}>
          <div className="form-group"><label>Name *</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name:e.target.value})} required /></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' }}>
            <div className="form-group"><label>Price *</label><input type="number" value={formData.price} onChange={e => setFormData({...formData, price:e.target.value})} required /></div>
            <div className="form-group"><label>Category *</label><select value={formData.category} onChange={e => setFormData({...formData, category:e.target.value})} required><option value="">Select</option><option>Whole Wheat</option><option>Refined</option><option>Specialty</option><option>Health</option></select></div>
          </div>
          <div className="form-group"><label>Description *</label><textarea value={formData.description} onChange={e => setFormData({...formData, description:e.target.value})} required rows="3" /></div>
          <div className="form-group"><label>Weights</label><input type="text" value={formData.weights} onChange={e => setFormData({...formData, weights:e.target.value})} /></div>
          <div className="form-group"><label>Image URL</label><input type="text" value={formData.image} onChange={e => setFormData({...formData, image:e.target.value})} placeholder="/images/Products/name.png or https://..." /></div>
          {formData.image ? (
            <div style={{ marginBottom: '18px' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginBottom: 8 }}>Preview</p>
              <img src={formData.image} alt="" style={{ maxWidth: '220px', maxHeight: '220px', objectFit: 'contain', borderRadius: 8, border: '1px solid var(--gray-200)' }} onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          ) : null}
          <div style={{ display:'flex', gap:'18px', marginBottom:'20px' }}>
            <label style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'0.9rem' }}><input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured:e.target.checked})} /> Featured</label>
            <label style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'0.9rem' }}><input type="checkbox" checked={formData.inStock} onChange={e => setFormData({...formData, inStock:e.target.checked})} /> In Stock</label>
          </div>
          <div style={{ display:'flex', gap:'10px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex:1 }}>{editing ? 'Update' : 'Add'}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="btn btn-secondary" style={{ flex:1 }}>Cancel</button>
          </div>
        </form>
      </div></div>}
    </div>
  );
};

export const AdminOrders = () => {
  const { orders, updateOrderStatus, deleteOrder, updateOrder } = useProducts();
  const [detail, setDetail] = useState(null);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    if (!detail) {
      setEditForm(null);
      return;
    }
    setEditForm({
      fullName: detail.fullName ?? '',
      phone: detail.phone ?? '',
      address: detail.address ?? '',
      city: detail.city ?? '',
      paymentMethod: detail.paymentMethod ?? 'cod',
      notes: detail.notes ?? '',
      status: detail.status ?? 'Pending',
      subtotal: detail.subtotal ?? 0,
      delivery: detail.delivery ?? 0,
      total: detail.total ?? 0,
      items: detail.items ?? [],
      stripePaymentIntentId: detail.stripePaymentIntentId ?? '',
      paymentStatus: detail.paymentStatus ?? 'pending',
    });
  }, [detail]);

  const saveDetail = async (e) => {
    e.preventDefault();
    if (!detail || !editForm) return;
    try {
      await updateOrder(docId(detail), editForm);
      setDetail(null);
    } catch (err) {
      alert(err.message || 'Save failed');
    }
  };

  return (
    <div>
      <div className="admin-header"><h2>Orders ({orders.length})</h2></div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead><tr><th>ID</th><th>Customer</th><th>Phone</th><th>Total</th><th>Pay</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {orders.length === 0 ? <tr><td colSpan="8" style={{ textAlign:'center', padding:'36px' }}>No orders</td></tr> :
              [...orders].reverse().map(o => (
                <tr key={docId(o)}>
                  <td>#{docId(o)}</td>
                  <td>{o.fullName}</td>
                  <td>{o.phone}</td>
                  <td style={{ fontWeight:'600' }}>{formatPrice(o.total)}</td>
                  <td style={{ fontSize: '0.75rem' }}>{o.paymentMethod}{o.stripePaymentIntentId ? <><br /><span style={{ color: 'var(--gray-400)' }}>Ref…{String(o.stripePaymentIntentId).slice(-6)}</span></> : null}</td>
                  <td><select value={o.status} onChange={(e) => updateOrderStatus(docId(o), e.target.value).catch((err) => alert(err.message))} className={`status-badge status-${o.status.toLowerCase()}`} style={{ cursor:'pointer', border:'none', padding:'5px 10px', borderRadius:'3px' }}><option>Pending</option><option>Processing</option><option>Delivered</option><option>Cancelled</option></select></td>
                  <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
                  <td style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                    <button type="button" onClick={() => setDetail(o)} className="admin-action-btn admin-btn-view">View / Edit</button>
                    <button type="button" onClick={() => { if (!window.confirm('Delete?')) return; deleteOrder(docId(o)).catch((err) => alert(err.message)); }} className="admin-action-btn admin-btn-delete">Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {detail && editForm && (
        <div className="admin-form-modal" onClick={() => setDetail(null)}>
          <div className="admin-form-box" style={{ maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '18px' }}>Order #{docId(detail)}</h3>
            <form onSubmit={saveDetail}>
              <div className="form-group"><label>Full name</label><input value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} required /></div>
              <div className="form-group"><label>Phone</label><input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} required /></div>
              <div className="form-group"><label>Address</label><textarea value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} rows={2} required /></div>
              <div className="form-group"><label>City</label><input value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group"><label>Subtotal</label><input type="number" value={editForm.subtotal} onChange={(e) => setEditForm({ ...editForm, subtotal: Number(e.target.value) })} /></div>
                <div className="form-group"><label>Delivery</label><input type="number" value={editForm.delivery} onChange={(e) => setEditForm({ ...editForm, delivery: Number(e.target.value) })} /></div>
              </div>
              <div className="form-group"><label>Total</label><input type="number" value={editForm.total} onChange={(e) => setEditForm({ ...editForm, total: Number(e.target.value) })} /></div>
              <div className="form-group"><label>Payment method</label><select value={editForm.paymentMethod} onChange={(e) => setEditForm({ ...editForm, paymentMethod: e.target.value })}><option value="cod">cod</option><option value="card">card</option></select></div>
              <div className="form-group"><label>Payment status</label><input value={editForm.paymentStatus} onChange={(e) => setEditForm({ ...editForm, paymentStatus: e.target.value })} placeholder="pending / paid" /></div>
              <div className="form-group"><label>Card payment reference</label><input value={editForm.stripePaymentIntentId} onChange={(e) => setEditForm({ ...editForm, stripePaymentIntentId: e.target.value })} /></div>
              <div className="form-group"><label>Order status</label><select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}><option>Pending</option><option>Processing</option><option>Delivered</option><option>Cancelled</option></select></div>
              <div className="form-group"><label>Notes</label><textarea value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} rows={2} /></div>
              <div className="form-group"><label>Line items (read-only)</label><pre style={{ fontSize: '0.75rem', background: 'var(--beige-light)', padding: '10px', borderRadius: 6, maxHeight: '160px', overflow: 'auto' }}>{JSON.stringify(editForm.items, null, 2)}</pre></div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDetail(null)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminInquiries = () => {
  const { inquiries, markInquiryRead, deleteInquiry, updateInquiry } = useProducts();
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (!edit) {
      setForm(null);
      return;
    }
    setForm({
      businessName: edit.businessName ?? '',
      contactPerson: edit.contactPerson ?? '',
      phone: edit.phone ?? '',
      email: edit.email ?? '',
      quantity: edit.quantity ?? '',
      message: edit.message ?? '',
      isRead: Boolean(edit.isRead),
    });
  }, [edit]);

  const saveInquiry = async (e) => {
    e.preventDefault();
    if (!edit || !form) return;
    try {
      await updateInquiry(docId(edit), form);
      setEdit(null);
    } catch (err) {
      alert(err.message || 'Save failed');
    }
  };

  return (
    <div>
      <div className="admin-header"><h2>Inquiries ({inquiries.length})</h2></div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead><tr><th>Business</th><th>Contact</th><th>Phone</th><th>Qty</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {inquiries.length === 0 ? <tr><td colSpan="7" style={{ textAlign:'center', padding:'36px' }}>No inquiries</td></tr> :
              [...inquiries].reverse().map(inq => (
                <tr key={docId(inq)}>
                  <td style={{ fontWeight:!inq.isRead ? '700' : '400' }}>{inq.businessName}</td>
                  <td>{inq.contactPerson}</td>
                  <td>{inq.phone}</td>
                  <td>{inq.quantity}</td>
                  <td><span className={`status-badge ${inq.isRead ? 'status-delivered' : 'status-pending'}`}>{inq.isRead ? 'Read' : 'New'}</span></td>
                  <td>{inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : '—'}</td>
                  <td style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                    <button type="button" onClick={() => setEdit(inq)} className="admin-action-btn admin-btn-edit">Edit</button>
                    {!inq.isRead && <button type="button" onClick={() => markInquiryRead(docId(inq)).catch((err) => alert(err.message))} className="admin-action-btn admin-btn-view">Mark read</button>}
                    <button type="button" onClick={() => { if (!window.confirm('Delete?')) return; deleteInquiry(docId(inq)).catch((err) => alert(err.message)); }} className="admin-action-btn admin-btn-delete">Del</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {edit && form && (
        <div className="admin-form-modal" onClick={() => setEdit(null)}>
          <div className="admin-form-box" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '18px' }}>Edit inquiry</h3>
            <form onSubmit={saveInquiry}>
              <div className="form-group"><label>Business</label><input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} required /></div>
              <div className="form-group"><label>Contact person</label><input value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} required /></div>
              <div className="form-group"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
              <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="form-group"><label>Quantity</label><input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required /></div>
              <div className="form-group"><label>Message</label><textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} /></div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}><input type="checkbox" checked={form.isRead} onChange={(e) => setForm({ ...form, isRead: e.target.checked })} /> Mark as read</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEdit(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminUsers = () => {
  const { deleteUser, updateUser } = useProducts();
  const { adminToken } = useAuth();
  const [rows, setRows] = useState([]);
  const [loadErr, setLoadErr] = useState('');
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', role: 'customer', password: '' });

  const load = useCallback(async () => {
    if (!adminToken) {
      setRows([]);
      setLoadErr('Not signed in');
      return;
    }
    try {
      const res = await fetch(apiUrl('/api/users'), {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load users');
      setRows(Array.isArray(data) ? data : []);
      setLoadErr('');
    } catch (e) {
      setLoadErr(e.message || 'Failed to load users');
    }
  }, [adminToken]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!edit) return;
    setForm({ name: edit.name || '', phone: edit.phone || '', role: edit.role || 'customer', password: '' });
  }, [edit]);

  const saveUser = async (e) => {
    e.preventDefault();
    if (!edit) return;
    try {
      const body = { name: form.name, phone: form.phone, role: form.role };
      if (form.password.trim()) body.password = form.password;
      await updateUser(docId(edit), body);
      setEdit(null);
      await load();
    } catch (err) {
      alert(err.message || 'Save failed');
    }
  };

  return (
    <div>
      <div className="admin-header"><h2>Users</h2></div>
      {loadErr && <p style={{ color: '#a84040', marginBottom: 12 }}>{loadErr}</p>}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign:'center', padding:'24px' }}>{loadErr ? '—' : 'No registered users yet'}</td></tr>
            ) : (
              rows.map((u) => (
                <tr key={docId(u)}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || '—'}</td>
                  <td>{u.role || 'customer'}</td>
                  <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                  <td style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button type="button" onClick={() => setEdit(u)} className="admin-action-btn admin-btn-edit">Edit</button>
                    <button type="button" onClick={() => { if (!window.confirm(`Delete user ${u.email}?`)) return; deleteUser(docId(u)).then(load).catch((err) => alert(err.message)); }} className="admin-action-btn admin-btn-delete">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {edit && (
        <div className="admin-form-modal" onClick={() => setEdit(null)}>
          <div className="admin-form-box" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '18px' }}>Edit user</h3>
            <form onSubmit={saveUser}>
              <div className="form-group"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="form-group"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="form-group"><label>Role</label><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="customer">customer</option><option value="admin">admin</option></select></div>
              <div className="form-group"><label>New password (optional)</label><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Leave blank to keep" /></div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEdit(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminContacts = () => {
  const { contacts, updateContact, deleteContact, refreshOrdersInquiriesContacts } = useProducts();
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (!edit) {
      setForm(null);
      return;
    }
    setForm({
      name: edit.name ?? '',
      email: edit.email ?? '',
      phone: edit.phone ?? '',
      subject: edit.subject ?? '',
      message: edit.message ?? '',
    });
  }, [edit]);

  const save = async (e) => {
    e.preventDefault();
    if (!edit || !form) return;
    try {
      await updateContact(docId(edit), form);
      setEdit(null);
      await refreshOrdersInquiriesContacts();
    } catch (err) {
      alert(err.message || 'Save failed');
    }
  };

  return (
    <div>
      <div className="admin-header"><h2>Contact messages ({contacts.length})</h2></div>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '36px' }}>No messages</td></tr>
            ) : (
              [...contacts].reverse().map((c) => (
                <tr key={docId(c)}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.subject}</td>
                  <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '—'}</td>
                  <td style={{ display: 'flex', gap: '6px' }}>
                    <button type="button" className="admin-action-btn admin-btn-view" onClick={() => setEdit(c)}>View / Edit</button>
                    <button type="button" className="admin-action-btn admin-btn-delete" onClick={() => { if (!window.confirm('Delete this message?')) return; deleteContact(docId(c)).then(() => refreshOrdersInquiriesContacts()).catch((e) => alert(e.message)); }}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {edit && form && (
        <div className="admin-form-modal" onClick={() => setEdit(null)}>
          <div className="admin-form-box" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '18px' }}>Contact message</h3>
            <form onSubmit={save}>
              <div className="form-group"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
              <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
              <div className="form-group"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="form-group"><label>Subject</label><input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required /></div>
              <div className="form-group"><label>Message</label><textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required /></div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEdit(null)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminReviews = () => {
  const { updateReview, deleteReview, refreshProducts } = useProducts();
  const { adminToken } = useAuth();
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    if (!adminToken) {
      setRows([]);
      setErr('Not signed in');
      return;
    }
    try {
      const res = await fetch(apiUrl('/api/reviews'), {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load');
      setRows(Array.isArray(data) ? data : []);
      setErr('');
    } catch (e) {
      setErr(e.message || 'Failed to load reviews');
    }
  }, [adminToken]);

  useEffect(() => {
    load();
  }, [load]);

  const productLabel = (r) => {
    if (r.productId && typeof r.productId === 'object' && r.productId.name) return r.productId.name;
    return String(r.productId || '');
  };

  return (
    <div>
      <div className="admin-header"><h2>Reviews ({rows.length})</h2></div>
      {err && <p style={{ color: '#a84040', marginBottom: 12 }}>{err}</p>}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead><tr><th>Product</th><th>Author</th><th>Rating</th><th>Comment</th><th>Approved</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '36px' }}>No reviews</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={docId(r)}>
                  <td style={{ maxWidth: '140px', fontSize: '0.85rem' }}>{productLabel(r)}</td>
                  <td>{r.authorName}</td>
                  <td>{r.rating}</td>
                  <td style={{ maxWidth: '220px', fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.comment}</td>
                  <td>{r.approved ? 'Yes' : 'No'}</td>
                  <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</td>
                  <td style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button type="button" className="admin-action-btn admin-btn-edit" onClick={() => updateReview(docId(r), { approved: !r.approved }).then(() => { load(); refreshProducts(); }).catch((e) => alert(e.message))}>{r.approved ? 'Hide' : 'Approve'}</button>
                    <button type="button" className="admin-action-btn admin-btn-delete" onClick={() => { if (!window.confirm('Delete review?')) return; deleteReview(docId(r)).then(() => load()).catch((e) => alert(e.message)); }}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};