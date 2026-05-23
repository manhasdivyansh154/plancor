/* ===========================
   Plancor — script.js
   Plant-Based E-Commerce
=========================== */

// ---- Product Data ----
const products = [
  { id: 1,  name: "Monstera Deliciosa",      category: "plants",     emoji: "🌿", price: 699,  oldPrice: 899,  rating: 4.8, reviews: 124, badge: "Best Seller", badgeType: "organic" },
  { id: 2,  name: "Organic Tomato Seeds",    category: "seeds",      emoji: "🍅", price: 149,  oldPrice: null, rating: 4.6, reviews: 89,  badge: "Organic",     badgeType: "organic" },
  { id: 3,  name: "Basil Herb Kit",          category: "herbs",      emoji: "🌿", price: 299,  oldPrice: 399,  rating: 4.9, reviews: 201, badge: "Sale",        badgeType: "sale"    },
  { id: 4,  name: "Broccoli Seeds Pack",     category: "vegetables", emoji: "🥦", price: 129,  oldPrice: null, rating: 4.5, reviews: 67,  badge: "Organic",     badgeType: "organic" },
  { id: 5,  name: "Garden Trowel Set",       category: "tools",      emoji: "🧰", price: 449,  oldPrice: 599,  rating: 4.7, reviews: 43,  badge: "Sale",        badgeType: "sale"    },
  { id: 6,  name: "Snake Plant",             category: "plants",     emoji: "🪴", price: 499,  oldPrice: null, rating: 4.8, reviews: 188, badge: "Low Light",   badgeType: ""        },
  { id: 7,  name: "Lavender Seeds",          category: "herbs",      emoji: "💜", price: 189,  oldPrice: null, rating: 4.7, reviews: 95,  badge: "Organic",     badgeType: "organic" },
  { id: 8,  name: "Sunflower Seed Packet",   category: "seeds",      emoji: "🌻", price: 99,   oldPrice: null, rating: 4.6, reviews: 310, badge: "Popular",     badgeType: ""        },
  { id: 9,  name: "Peace Lily",              category: "plants",     emoji: "🌸", price: 599,  oldPrice: 749,  rating: 4.9, reviews: 142, badge: "Sale",        badgeType: "sale"    },
  { id: 10, name: "Spinach Seeds",           category: "vegetables", emoji: "🥬", price: 89,   oldPrice: null, rating: 4.5, reviews: 55,  badge: "Organic",     badgeType: "organic" },
  { id: 11, name: "Wooden Planter Box",      category: "tools",      emoji: "📦", price: 799,  oldPrice: 999,  rating: 4.6, reviews: 28,  badge: "Sale",        badgeType: "sale"    },
  { id: 12, name: "Coriander Starter Kit",  category: "herbs",      emoji: "🌱", price: 249,  oldPrice: null, rating: 4.8, reviews: 173, badge: "Top Rated",   badgeType: "organic" },
  { id: 13, name: "Aloe Vera Plant",         category: "plants",     emoji: "🌵", price: 379,  oldPrice: null, rating: 4.7, reviews: 256, badge: "Medicinal",   badgeType: "organic" },
  { id: 14, name: "Chilli Seeds",            category: "vegetables", emoji: "🌶️", price: 119,  oldPrice: null, rating: 4.4, reviews: 88,  badge: "Spicy 🔥",    badgeType: ""        },
  { id: 15, name: "Watering Can (2L)",       category: "tools",      emoji: "💧", price: 549,  oldPrice: 699,  rating: 4.8, reviews: 61,  badge: "Sale",        badgeType: "sale"    },
  { id: 16, name: "Pothos Golden",           category: "plants",     emoji: "🍃", price: 349,  oldPrice: null, rating: 4.9, reviews: 390, badge: "Easy Care",   badgeType: ""        },
];

// ---- Cart State ----
let cart = JSON.parse(localStorage.getItem('plancorCart')) || [];
let currentFilter = 'all';
let visibleCount = 8;

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartUI();
  initCartBtn();
});



// ============================================================
// HAMBURGER
// ============================================================
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  btn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    btn.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

// ============================================================
// PRODUCTS
// ============================================================
function renderProducts() {
  const list = currentFilter === 'all'
    ? products
    : products.filter(p => p.category === currentFilter);
  renderToGrid(list.slice(0, visibleCount));
  document.getElementById('loadMoreBtn').style.display =
    list.length > visibleCount ? 'inline-flex' : 'none';
}

function renderToGrid(list) {
  const grid = document.getElementById('productsGrid');
  if (list.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text-light)">
      🌱 No products found. Try another search!
    </div>`;
    return;
  }
  grid.innerHTML = list.map(p => createProductCard(p)).join('');
  // Attach button events
  grid.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
  });
 
  // Re-apply cursor listeners
  grid.querySelectorAll('.product-card').forEach(card => {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    card.addEventListener('mouseenter', () => {
      if(cursor) cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
      if(follower) follower.style.transform = 'translate(-50%,-50%) scale(1.4)';
    });
    card.addEventListener('mouseleave', () => {
      if(cursor) cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      if(follower) follower.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
}

function createProductCard(p) {
  const stars = '⭐'.repeat(Math.round(p.rating));
  const oldPrice = p.oldPrice ? `<span class="product-price-old">₹${p.oldPrice}</span>` : '';
  const badgeHtml = p.badge
    ? `<div class="product-badge ${p.badgeType}">${p.badge}</div>` : '';
  return `
    <div class="product-card reveal">
      <div class="product-img">
        ${badgeHtml}
       
        <span>${p.emoji}</span>
      </div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">
          <span class="stars-small">${stars}</span>
          <span class="rating-count">${p.rating} (${p.reviews})</span>
        </div>
        <div class="product-price-row">
          <div>
            <span class="product-price">₹${p.price}</span>
            ${oldPrice}
          </div>
          <button class="btn-add-cart" data-id="${p.id}">
            + Cart
          </button>
        </div>
      </div>
    </div>
  `;
}

function filterProducts(cat, btn) {
  currentFilter = cat;
  visibleCount  = 8;
  // Update filter buttons
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts();
  // Scroll to products
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Load More
document.getElementById('loadMoreBtn').addEventListener('click', () => {
  visibleCount += 4;
  renderProducts();
});

// ============================================================
// CART
// ============================================================
function initCartBtn() {
  const cartBtn = document.getElementById('cartBtn');

  if (cartBtn) {
    cartBtn.addEventListener('click', openCart);
  }
}
function openCart() {
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartSidebar').classList.add('open');
}
function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartSidebar').classList.remove('open');
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  updateCartUI();
  showToast(`✅ ${product.name} added to cart!`);
  // Animate cart button
  const cartBtn = document.getElementById('cartBtn');

  if (cartBtn) {
    cartBtn.style.transform = 'scale(1.3)';

    setTimeout(() => {
      cartBtn.style.transform = '';
    }, 300);
  }
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); updateCartUI(); }
}

function updateCartUI() {
  const count    = cart.reduce((s, i) => s + i.qty, 0);
  const total    = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const countEl  = document.getElementById('cartCount');
  const totalEl  = document.getElementById('cartTotal');
  const itemsEl  = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');

  countEl.textContent = count;
  countEl.classList.toggle('show', count > 0);
  totalEl.textContent = '₹' + total.toLocaleString('en-IN');
  footerEl.style.display = cart.length > 0 ? 'block' : 'none';

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🌱</div>
        <p>Your cart is empty</p>
        <a href="#products" class="btn-primary" onclick="closeCart()">Start Shopping</a>
      </div>`;
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-icon">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})">🗑️</button>
    </div>
  `).join('');
}

function saveCart() {
  localStorage.setItem('plancorCart', JSON.stringify(cart));
}

function checkout() {
  showToast('🎉 Order placed! Thank you for shopping at Plancor!');
  cart = [];
  saveCart();
  updateCartUI();
  closeCart();
}


// ============================================================
// CONTACT FORM
// ============================================================
function submitContact(e) {
  e.preventDefault();
  const msg = document.getElementById('formSuccess');
  msg.classList.add('show');
  e.target.reset();
  showToast('✅ Message sent successfully!');
  setTimeout(() => msg.classList.remove('show'), 5000);
}

// ============================================================
// TOAST
// ============================================================
function showToast(message) {
  console.log(message);
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}



// Stagger product card animations
const productObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      productObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

const observeCards = () => {
  document.querySelectorAll('.product-card.reveal:not(.observed)').forEach(el => {
    el.classList.add('observed');
    productObserver.observe(el);
  });
};
const cardMutationObs = new MutationObserver(observeCards);

const productsGrid = document.getElementById('productsGrid');

if (productsGrid) {
  cardMutationObs.observe(productsGrid, { childList: true });
}