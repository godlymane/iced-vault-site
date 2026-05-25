import {
  ArrowUpRight,
  BadgeCheck,
  BadgeDollarSign,
  Camera,
  ChevronRight,
  CreditCard,
  Crown,
  Diamond,
  Gem,
  LockKeyhole,
  Menu,
  MessageCircle,
  Minus,
  Music2,
  PackageCheck,
  Plus,
  ScanLine,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trash2,
  Truck,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { filters, seedProducts } from './data'
import { getMotionProfile } from './motion'
import VaultGemCanvas from './VaultGemCanvas'
import {
  buildConciergePrompt,
  getCertificateCode,
  getDropCountdown,
} from './vaultExperience'
import {
  addToCart,
  filterProducts,
  findProduct,
  getCartTotals,
  getStockStatus,
  mergeSavedProducts,
  removeFromCart,
  updateCartQuantity,
  updateInventory,
} from './store'
import type { CartItem, Product, ProductFilter } from './store'

const PRODUCTS_KEY = 'iced-vault-products'
const CART_KEY = 'iced-vault-cart'
const UNLOCK_KEY = 'iced-vault-unlocked'
const NEXT_DROP_TARGET = new Date('2026-05-30T20:00:00+05:30')

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const trustPoints = [
  { icon: ShieldCheck, label: 'GRA Certified', copy: 'Verification-first pieces with visible trust markers.' },
  { icon: Truck, label: 'Insured Shipping', copy: 'Tracked handoff flow for every reserved order.' },
  { icon: CreditCard, label: 'Secure Reserve', copy: 'Reserve through socials before final payment.' },
  { icon: BadgeDollarSign, label: 'Real Value', copy: 'Diamond look without diamond-level markup.' },
]

const testimonials = [
  { quote: 'Looks colder in person. The chain hits like a showroom piece.', name: 'VIP Buyer' },
  { quote: 'Clean packaging, fast replies, and the GRA badge made it easy.', name: 'First Drop Client' },
  { quote: 'Luxury feel without that fake flashy website energy.', name: 'Repeat Buyer' },
]

function loadProducts() {
  try {
    const saved = localStorage.getItem(PRODUCTS_KEY)
    return saved ? mergeSavedProducts(seedProducts, JSON.parse(saved) as Product[]) : seedProducts
  } catch {
    return seedProducts
  }
}

function loadCart() {
  try {
    const saved = localStorage.getItem(CART_KEY)
    return saved ? (JSON.parse(saved) as CartItem[]) : []
  } catch {
    return []
  }
}

function useLuxuryReveals() {
  useEffect(() => {
    const profile = getMotionProfile({
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      hasFinePointer: window.matchMedia('(pointer: fine)').matches,
    })

    document.body.classList.toggle('luxury-shimmer-active', profile.shimmer)

    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))

    if (!profile.reveals) {
      revealTargets.forEach((target) => target.classList.add('is-visible'))
      return () => {
        document.body.classList.remove('luxury-shimmer-active')
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.14 },
    )

    revealTargets.forEach((target) => observer.observe(target))
    const fallbackReveal = window.setTimeout(() => {
      revealTargets.forEach((target) => target.classList.add('is-visible'))
    }, 1400)

    return () => {
      observer.disconnect()
      window.clearTimeout(fallbackReveal)
      document.body.classList.remove('luxury-shimmer-active')
    }
  }, [])
}

function LuxuryCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const profile = getMotionProfile({
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      hasFinePointer: window.matchMedia('(pointer: fine)').matches,
    })

    if (!profile.cursor) {
      return
    }

    if (!cursorRef.current || !labelRef.current) {
      return
    }

    const cursorElement = cursorRef.current
    const labelElement = labelRef.current

    document.body.classList.add('luxury-cursor-active')

    let raf = 0
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2

    function moveCursor() {
      cursorElement.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf = 0
    }

    function handlePointerMove(event: PointerEvent) {
      x = event.clientX
      y = event.clientY

      if (!raf) {
        raf = window.requestAnimationFrame(moveCursor)
      }
    }

    function handlePointerOver(event: PointerEvent) {
      const target = (event.target as Element | null)?.closest<HTMLElement>(
        'a, button, input, [data-cursor]',
      )

      if (!target) {
        cursorElement.classList.remove('is-hovering')
        labelElement.textContent = ''
        return
      }

      cursorElement.classList.add('is-hovering')
      labelElement.textContent = target.dataset.cursor ?? ''
    }

    function handlePointerOut(event: PointerEvent) {
      if ((event.relatedTarget as Element | null)?.closest('a, button, input, [data-cursor]')) {
        return
      }

      cursorElement.classList.remove('is-hovering')
      labelElement.textContent = ''
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerover', handlePointerOver)
    window.addEventListener('pointerout', handlePointerOut)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerover', handlePointerOver)
      window.removeEventListener('pointerout', handlePointerOut)
      document.body.classList.remove('luxury-cursor-active')
      if (raf) {
        window.cancelAnimationFrame(raf)
      }
    }
  }, [])

  return (
    <div className="luxury-cursor" ref={cursorRef} aria-hidden="true">
      <span className="cursor-core" />
      <span className="cursor-ring" />
      <span className="cursor-label" ref={labelRef} />
    </div>
  )
}

function App() {
  useLuxuryReveals()

  const [vaultUnlocked, setVaultUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(UNLOCK_KEY) === 'true'
    } catch {
      return false
    }
  })
  const [products, setProducts] = useState<Product[]>(loadProducts)
  const [cart, setCart] = useState<CartItem[]>(loadCart)
  const [activeFilter, setActiveFilter] = useState<ProductFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [cartOpen, setCartOpen] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const [conciergePrompt, setConciergePrompt] = useState(buildConciergePrompt())
  const [certificateProduct, setCertificateProduct] = useState<Product | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [now, setNow] = useState(() => new Date())

  const visibleProducts = useMemo(
    () => filterProducts(products, activeFilter, searchTerm),
    [activeFilter, products, searchTerm],
  )
  const totals = useMemo(() => getCartTotals(cart, products), [cart, products])
  const featuredProduct = products[0] ?? seedProducts[0]
  const heroStock = getStockStatus(featuredProduct)
  const lowStockCount = products.filter((product) => product.stock > 0 && product.stock <= 3).length
  const totalInventory = products.reduce((sum, product) => sum + product.stock, 0)
  const vaultValue = products.reduce((sum, product) => sum + product.price * product.stock, 0)
  const countdown = useMemo(() => getDropCountdown(now, NEXT_DROP_TARGET), [now])

  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000)

    return () => window.clearInterval(timer)
  }, [])

  function handleAddToCart(productId: string) {
    setCart((currentCart) => addToCart(currentCart, products, productId))
    setCartOpen(true)
  }

  function handleQuantity(productId: string, quantity: number) {
    setCart((currentCart) => updateCartQuantity(currentCart, products, productId, quantity))
  }

  function handleInventory(productId: string, patch: Partial<Pick<Product, 'price' | 'stock'>>) {
    setProducts((currentProducts) => updateInventory(currentProducts, productId, patch))
  }

  function handleUnlockVault() {
    setVaultUnlocked(true)
    try {
      sessionStorage.setItem(UNLOCK_KEY, 'true')
    } catch {
      // Session storage can fail in private contexts; the visual unlock still works.
    }
  }

  function openConcierge(productName?: string) {
    setConciergePrompt(buildConciergePrompt(productName))
    setConciergeOpen(true)
  }

  const cartRows = cart
    .map((item) => ({ item, product: findProduct(products, item.productId) }))
    .filter((row): row is { item: CartItem; product: Product } => Boolean(row.product))

  return (
    <>
      <LuxuryCursor />

      {!vaultUnlocked && (
        <aside className="vault-unlock" role="dialog" aria-modal="true" aria-label="Unlock Iced Vault">
          <div className="unlock-scanline" />
          <div className="unlock-orbit" aria-hidden="true">
            <VaultGemCanvas />
          </div>
          <div className="unlock-panel">
            <span className="kicker">Private Access</span>
            <h2>Iced Vault</h2>
            <p>
              A black-box jewelry room for GRA certified moissanite, low-stock drops,
              and direct concierge reserve.
            </p>
            <button className="primary-button" type="button" data-cursor="Unlock" onClick={handleUnlockVault}>
              <LockKeyhole size={18} />
              Unlock the Vault
            </button>
            <button className="unlock-skip" type="button" onClick={handleUnlockVault}>
              Skip intro
            </button>
          </div>
        </aside>
      )}

      <header className="site-header">
        <a className="brand-lockup" href="#home" aria-label="Iced Vault home">
          <span className="brand-mark">IV</span>
          <span>
            <strong>Iced Vault</strong>
            <small>Private moissanite vault</small>
          </span>
        </a>

        <nav className={menuOpen ? 'site-nav open' : 'site-nav'} aria-label="Primary navigation">
          <a href="#drop" onClick={() => setMenuOpen(false)}>
            Drop
          </a>
          <a href="#shop" onClick={() => setMenuOpen(false)}>
            Shop
          </a>
          <a href="#standard" onClick={() => setMenuOpen(false)}>
            Standard
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Concierge
          </a>
        </nav>

        <div className="header-actions">
          <button
            className="icon-button admin-trigger"
            type="button"
            title="Inventory"
            aria-label="Open inventory"
            onClick={() => setAdminOpen(true)}
          >
            <SlidersHorizontal size={18} />
          </button>
          <button
            className="icon-button concierge-trigger"
            type="button"
            title="Vault concierge"
            aria-label="Open vault concierge"
            data-cursor="Ask"
            onClick={() => openConcierge()}
          >
            <MessageCircle size={18} />
          </button>
          <button
            className="cart-button"
            type="button"
            title="Cart"
            aria-label={`Open cart with ${totals.itemCount} items`}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag size={18} />
            <span>{totals.itemCount}</span>
          </button>
          <button
            className="icon-button menu-button"
            type="button"
            title="Menu"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home" aria-labelledby="hero-title">
          <img
            className="hero-image"
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2400&q=94"
            alt="Iced jewelry on a dark luxury surface"
          />
          <div className="hero-sheen" />
          <div className="hero-gem-stage" aria-hidden="true">
            <VaultGemCanvas />
          </div>
          <div className="hero-content" data-reveal>
            <div className="eyebrow">
              <Crown size={17} />
              Invite-only energy, public vault access
            </div>
            <p className="drop-code">DROP 01 / BLACK ICE ROOM</p>
            <h1 id="hero-title">Iced Vault</h1>
            <p className="hero-lede">
              GRA certified moissanite jewelry with a cold luxury finish and a streetwear pulse.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href="#drop" data-cursor="Enter">
                Enter the Drop
                <ChevronRight size={18} />
              </a>
              <a
                className="ghost-button"
                href="https://www.instagram.com/shopicedvault/"
                target="_blank"
                rel="noreferrer"
                data-cursor="Open"
              >
                <Camera size={18} />
                @shopicedvault
              </a>
            </div>
          </div>

          <div className="hero-vault-card" aria-label="Featured vault piece" data-reveal>
            <div className="vault-card-top">
              <span>Tonight's Pull</span>
              <span className={`stock-dot ${heroStock.tone}`}>{heroStock.label}</span>
            </div>
            <img src={featuredProduct.image} alt={featuredProduct.name} />
            <div className="vault-card-body">
              <span>{featuredProduct.drop}</span>
              <h2>{featuredProduct.name}</h2>
              <div>
                <strong>{money.format(featuredProduct.price)}</strong>
                <button
                  type="button"
                  data-cursor="Reserve"
                  onClick={() => handleAddToCart(featuredProduct.id)}
                >
                  Reserve
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="hero-proof" aria-label="Store highlights">
            <span>
              <BadgeCheck size={16} />
              GRA badge included
            </span>
            <span>
              <Zap size={16} />
              Low-stock drops
            </span>
            <span>
              <PackageCheck size={16} />
              Black-box presentation
            </span>
          </div>
        </section>

        <section className="ticker" aria-label="Brand promises">
          <span>Iced Out. Certified.</span>
          <span>Premium Moissanite. Real Value.</span>
          <span>Luxury Without Limits.</span>
          <span>DM Concierge Open.</span>
        </section>

        <section className="vip-drop-section" aria-label="Next VIP drop" data-reveal>
          <div className="vip-drop-copy">
            <span className="kicker">Next Vault Drop</span>
            <h2>Private room opens soon.</h2>
            <p>
              VIP access unlocks early previews, certificate scans, custom sizing help,
              and first reserve on the next low-stock release.
            </p>
          </div>
          <div className="countdown-panel" aria-label="Drop countdown">
            <div>
              <span>{countdown.days}</span>
              <p>Days</p>
            </div>
            <div>
              <span>{countdown.hours}</span>
              <p>Hours</p>
            </div>
            <div>
              <span>{countdown.minutes}</span>
              <p>Minutes</p>
            </div>
            <button className="ghost-button" type="button" data-cursor="VIP" onClick={() => openConcierge()}>
              Join VIP List
              <ArrowUpRight size={17} />
            </button>
          </div>
        </section>

        <section className="drop-section" id="drop" aria-labelledby="drop-title" data-reveal>
          <div className="section-heading">
            <div>
              <span className="kicker">Featured Drop</span>
              <h2 id="drop-title">A darker, colder way to buy ice.</h2>
            </div>
            <p>
              The vault is built like a private release: tight inventory, certified stones,
              clean visuals, and a direct reserve path through the brand socials.
            </p>
          </div>

          <div className="drop-grid">
            <article className="drop-visual">
              <img src={featuredProduct.image} alt={featuredProduct.name} />
              <div className="drop-stamp">
                <ScanLine size={18} />
                Verified GRA Pull
              </div>
            </article>
            <div className="drop-details">
              <span className="kicker">{featuredProduct.drop}</span>
              <h3>{featuredProduct.name}</h3>
              <p>{featuredProduct.description}</p>
              <div className="spec-grid">
                {featuredProduct.specs.map((spec) => (
                  <span key={spec}>{spec}</span>
                ))}
              </div>
              <div className="experience-actions">
                <button type="button" data-cursor="Verify" onClick={() => setCertificateProduct(featuredProduct)}>
                  <BadgeCheck size={16} />
                  View Certificate
                </button>
                <button type="button" data-cursor="Ask" onClick={() => openConcierge(featuredProduct.name)}>
                  <MessageCircle size={16} />
                  Ask Concierge
                </button>
              </div>
              <div className="drop-buy-row">
                <strong>{money.format(featuredProduct.price)}</strong>
              <button
                className="primary-button"
                type="button"
                data-cursor="Reserve"
                onClick={() => handleAddToCart(featuredProduct.id)}
              >
                  Reserve Piece
                  <ShoppingBag size={18} />
                </button>
              </div>
            </div>
            <div className="vault-metrics" aria-label="Vault metrics">
              <div>
                <span>{products.length}</span>
                <p>curated pieces</p>
              </div>
              <div>
                <span>{lowStockCount}</span>
                <p>final-call items</p>
              </div>
              <div>
                <span>{money.format(vaultValue)}</span>
                <p>vault value</p>
              </div>
            </div>
          </div>
        </section>

        <section className="shop-section" id="shop" aria-labelledby="shop-title" data-reveal>
          <div className="section-heading">
            <div>
              <span className="kicker">The Vault</span>
              <h2 id="shop-title">Certified ice, edited like a drop.</h2>
            </div>
            <p>
              Filter the room, open a quick view, and reserve the piece before the stock count
              disappears from the vault.
            </p>
          </div>

          <div className="shop-controls" aria-label="Product controls">
            <div className="segmented" role="tablist" aria-label="Product categories">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  className={activeFilter === filter.value ? 'active' : ''}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <label className="search-field">
              <Search size={18} />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search chains, rings, GRA"
              />
            </label>
          </div>

          <div className="product-grid">
            {visibleProducts.map((product) => {
              const status = getStockStatus(product)

              return (
                <article className="product-card" key={product.id} data-reveal>
                  <button
                    className="product-media"
                    type="button"
                    data-cursor="Inspect"
                    onClick={() => setSelectedProduct(product)}
                    aria-label={`View ${product.name}`}
                  >
                    <img src={product.image} alt={product.name} loading="lazy" />
                    <span className="cert-badge">
                      <BadgeCheck size={15} />
                      {product.certification}
                    </span>
                    <span className={`stock-badge ${status.tone}`}>{status.label}</span>
                    <span className="quick-view">Quick view</span>
                  </button>
                  <div className="product-body">
                    <div>
                      <p className="product-category">{product.drop}</p>
                      <h3>{product.name}</h3>
                    </div>
                    <p className="product-description">{product.description}</p>
                    <div className="product-meta">
                      <span>{product.stone}</span>
                      <span>{product.finish}</span>
                    </div>
                    <button
                      className="certificate-link"
                      type="button"
                      data-cursor="Verify"
                      onClick={() => setCertificateProduct(product)}
                    >
                      <BadgeCheck size={15} />
                      View GRA Certificate
                    </button>
                    <div className="product-footer">
                      <strong>{money.format(product.price)}</strong>
                      <button
                        className="add-button"
                        type="button"
                        disabled={product.stock < 1}
                        data-cursor="Reserve"
                        onClick={() => handleAddToCart(product.id)}
                      >
                        <ShoppingBag size={17} />
                        {product.stock > 0 ? 'Reserve' : 'Out'}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="trust-section" aria-label="Trust signals" data-reveal>
          {trustPoints.map(({ icon: Icon, label, copy }) => (
            <div className="trust-item" key={label} data-reveal>
              <Icon size={22} />
              <h3>{label}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </section>

        <section className="about-section" id="standard" aria-labelledby="about-title" data-reveal>
          <div className="about-copy">
            <span className="kicker">Iced Vault Standard</span>
            <h2 id="about-title">High-end jewelry energy with a streetwear pulse.</h2>
            <p>
              Iced Vault is built around premium moissanite pieces that stay clean, certified,
              and wearable. Every drop is styled for buyers who want the diamond look without
              diamond markup.
            </p>
          </div>
          <div className="vault-panel">
            <div className="panel-row">
              <Gem size={21} />
              <span>Moissanite selected for white fire and daily shine</span>
            </div>
            <div className="panel-row">
              <ShieldCheck size={21} />
              <span>Visible GRA Certified trust markers across the storefront</span>
            </div>
            <div className="panel-row">
              <LockKeyhole size={21} />
              <span>Low-stock vault drops with clean, black-box presentation</span>
            </div>
          </div>
        </section>

        <section className="testimonials-section" aria-label="Client notes" data-reveal>
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name} data-reveal>
              <div aria-hidden="true">
                <Star size={15} />
                <Star size={15} />
                <Star size={15} />
                <Star size={15} />
                <Star size={15} />
              </div>
              <blockquote>{testimonial.quote}</blockquote>
              <figcaption>{testimonial.name}</figcaption>
            </figure>
          ))}
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title" data-reveal>
          <div>
            <span className="kicker">Vault Concierge</span>
            <h2 id="contact-title">Reserve pieces, ask sizing, or catch the next private drop.</h2>
            <p>
              DM the brand for availability, wrist sizing, chain length, or a quick video of the
              stone fire before reserving.
            </p>
          </div>
          <div className="social-links">
            <a
              href="https://www.instagram.com/shopicedvault/"
              target="_blank"
              rel="noreferrer"
              data-cursor="DM"
            >
              <Camera size={20} />
              Instagram
              <span>@shopicedvault</span>
              <ArrowUpRight size={17} />
            </a>
            <a
              href="https://www.tiktok.com/@shopicedvault"
              target="_blank"
              rel="noreferrer"
              data-cursor="Watch"
            >
              <Music2 size={20} />
              TikTok
              <span>@shopicedvault</span>
              <ArrowUpRight size={17} />
            </a>
            <button type="button" data-cursor="Ask" onClick={() => openConcierge()}>
              <MessageCircle size={20} />
              Concierge DM
              <span>same-day replies</span>
              <ArrowUpRight size={17} />
            </button>
          </div>
        </section>
      </main>

      <a className="mobile-quick-bar" href="#shop">
        <Sparkles size={16} />
        Shop the drop
        <span>{totals.itemCount} in cart</span>
      </a>

      <aside className={cartOpen ? 'drawer open' : 'drawer'} aria-hidden={!cartOpen}>
        <div className="drawer-backdrop" onClick={() => setCartOpen(false)} />
        <div className="drawer-panel" role="dialog" aria-modal="true" aria-label="Shopping cart">
          <div className="drawer-header">
            <div>
              <span className="kicker">Cart</span>
              <h2>Your vault pull</h2>
            </div>
            <button
              className="icon-button"
              type="button"
              title="Close cart"
              aria-label="Close cart"
              onClick={() => setCartOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="drawer-list">
            {cartRows.length === 0 ? (
              <div className="empty-state">
                <Gem size={32} />
                <p>The vault is empty.</p>
              </div>
            ) : (
              cartRows.map(({ item, product }) => (
                <div className="cart-row" key={product.id}>
                  <img src={product.image} alt={product.name} />
                  <div>
                    <h3>{product.name}</h3>
                    <p>{money.format(product.price)}</p>
                    <div className="quantity-stepper">
                      <button
                        type="button"
                        aria-label={`Decrease ${product.name}`}
                        onClick={() => handleQuantity(product.id, item.quantity - 1)}
                      >
                        <Minus size={15} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase ${product.name}`}
                        onClick={() => handleQuantity(product.id, item.quantity + 1)}
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                  <button
                    className="icon-button"
                    type="button"
                    title="Remove item"
                    aria-label={`Remove ${product.name}`}
                    onClick={() => setCart((currentCart) => removeFromCart(currentCart, product.id))}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="checkout-box">
            <div>
              <span>Subtotal</span>
              <strong>{money.format(totals.subtotal)}</strong>
            </div>
            <div>
              <span>Reserve window</span>
              <strong>24h</strong>
            </div>
            <a
              className="primary-button full"
              href="https://www.instagram.com/shopicedvault/"
              target="_blank"
              rel="noreferrer"
              data-cursor="Reserve"
            >
              Reserve on Instagram
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </aside>

      <aside className={adminOpen ? 'drawer open' : 'drawer'} aria-hidden={!adminOpen}>
        <div className="drawer-backdrop" onClick={() => setAdminOpen(false)} />
        <div className="drawer-panel admin-panel" role="dialog" aria-modal="true" aria-label="Inventory">
          <div className="drawer-header">
            <div>
              <span className="kicker">Inventory</span>
              <h2>Vault control</h2>
            </div>
            <button
              className="icon-button"
              type="button"
              title="Close inventory"
              aria-label="Close inventory"
              onClick={() => setAdminOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="admin-stats">
            <span>{products.length} pieces</span>
            <span>{lowStockCount} low stock</span>
            <span>{totalInventory} units</span>
          </div>

          <div className="drawer-list">
            {products.map((product) => (
              <div className="admin-row" key={product.id}>
                <img src={product.image} alt="" />
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.category}</p>
                </div>
                <label>
                  Stock
                  <input
                    min="0"
                    type="number"
                    value={product.stock}
                    onChange={(event) =>
                      handleInventory(product.id, { stock: Number(event.target.value) })
                    }
                  />
                </label>
                <label>
                  Price
                  <input
                    min="0"
                    type="number"
                    value={product.price}
                    onChange={(event) =>
                      handleInventory(product.id, { price: Number(event.target.value) })
                    }
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {selectedProduct && (
        <aside className="modal-layer open" aria-hidden={false}>
          <div className="drawer-backdrop" onClick={() => setSelectedProduct(null)} />
          <div className="product-modal product-theater" role="dialog" aria-modal="true" aria-label={selectedProduct.name}>
            <button
              className="icon-button modal-close"
              type="button"
              title="Close product"
              aria-label="Close product"
              onClick={() => setSelectedProduct(null)}
            >
              <X size={18} />
            </button>
            <div className="theater-stage">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
              <div className="theater-scan">
                <ScanLine size={17} />
                Live product theater
              </div>
            </div>
            <div className="theater-details">
              <span className="cert-badge inline">
                <BadgeCheck size={15} />
                {selectedProduct.certification}
              </span>
              <p className="product-category">{selectedProduct.drop}</p>
              <h2>{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
              <div className="modal-meta">
                <span>{selectedProduct.stone}</span>
                <span>{selectedProduct.finish}</span>
                <span>{getStockStatus(selectedProduct).label}</span>
                <strong>{money.format(selectedProduct.price)}</strong>
              </div>
              <div className="modal-specs">
                {selectedProduct.specs.map((spec) => (
                  <span key={spec}>
                    <Diamond size={15} />
                    {spec}
                  </span>
                ))}
              </div>
              <div className="experience-actions theater-actions">
                <button type="button" data-cursor="Verify" onClick={() => setCertificateProduct(selectedProduct)}>
                  <BadgeCheck size={16} />
                  View Certificate
                </button>
                <button type="button" data-cursor="Ask" onClick={() => openConcierge(selectedProduct.name)}>
                  <MessageCircle size={16} />
                  Ask Concierge
                </button>
              </div>
              <button
                className="primary-button full"
                type="button"
                disabled={selectedProduct.stock < 1}
                data-cursor="Add"
                onClick={() => {
                  handleAddToCart(selectedProduct.id)
                  setSelectedProduct(null)
                }}
              >
                <ShoppingBag size={18} />
                Add to cart
              </button>
            </div>
          </div>
        </aside>
      )}

      {certificateProduct && (
        <aside className="modal-layer open" aria-hidden={false}>
          <div className="drawer-backdrop" onClick={() => setCertificateProduct(null)} />
          <div className="certificate-modal" role="dialog" aria-modal="true" aria-label="GRA certificate viewer">
            <button
              className="icon-button modal-close"
              type="button"
              title="Close certificate"
              aria-label="Close certificate"
              onClick={() => setCertificateProduct(null)}
            >
              <X size={18} />
            </button>
            <div className="certificate-card">
              <span className="kicker">GRA Certificate Viewer</span>
              <h2>{certificateProduct.name}</h2>
              <div className="certificate-code">
                <ScanLine size={20} />
                {getCertificateCode(certificateProduct)}
              </div>
              <div className="certificate-grid">
                <span>
                  Stone
                  <strong>{certificateProduct.stone}</strong>
                </span>
                <span>
                  Carat
                  <strong>{certificateProduct.carat ?? 'Verified on request'}</strong>
                </span>
                <span>
                  Cut
                  <strong>{certificateProduct.cut ?? 'Brilliant'}</strong>
                </span>
                <span>
                  Clarity
                  <strong>{certificateProduct.clarity ?? 'VVS simulated clarity'}</strong>
                </span>
                <span>
                  Date
                  <strong>{certificateProduct.certificateDate ?? 'May 2026'}</strong>
                </span>
                <span>
                  Status
                  <strong>Visible badge ready</strong>
                </span>
              </div>
              <p>
                Certificate details are presented as storefront trust markers. Final verification
                media and close-up proof can be sent by the Vault Concierge before reserve.
              </p>
              <button
                className="primary-button full"
                type="button"
                data-cursor="Ask"
                onClick={() => openConcierge(certificateProduct.name)}
              >
                Ask Concierge for Proof
                <MessageCircle size={18} />
              </button>
            </div>
          </div>
        </aside>
      )}

      {conciergeOpen && (
        <aside className="drawer open" aria-hidden={false}>
          <div className="drawer-backdrop" onClick={() => setConciergeOpen(false)} />
          <div className="drawer-panel concierge-panel" role="dialog" aria-modal="true" aria-label="Vault concierge">
            <div className="drawer-header">
              <div>
                <span className="kicker">Vault Concierge</span>
                <h2>Private reserve desk</h2>
              </div>
              <button
                className="icon-button"
                type="button"
                title="Close concierge"
                aria-label="Close concierge"
                onClick={() => setConciergeOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="concierge-body">
              <div className="concierge-orb">
                <Sparkles size={22} />
              </div>
              <p>
                Ask sizing, request a stone-fire video, check certificate proof, or reserve
                first access to the next vault room.
              </p>
              <div className="concierge-options">
                {['Sizing help', 'Certificate proof', 'Reserve a piece', 'Custom request'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setConciergePrompt(`${option}: ${buildConciergePrompt()}`)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <label className="concierge-message">
                Message
                <textarea
                  value={conciergePrompt}
                  onChange={(event) => setConciergePrompt(event.target.value)}
                  rows={5}
                />
              </label>
            </div>
            <div className="checkout-box">
              <a
                className="primary-button full"
                href="https://www.instagram.com/shopicedvault/"
                target="_blank"
                rel="noreferrer"
                data-cursor="DM"
              >
                Open Instagram DM
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </aside>
      )}
    </>
  )
}

export default App
