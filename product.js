const detailTarget = document.getElementById('product-detail');
const elements = {
  cartCount: document.getElementById('cart-count'),
  cartToggle: document.getElementById('cart-toggle'),
  cartSidebar: document.getElementById('cart-sidebar'),
  cartClose: document.getElementById('cart-close'),
  cartItems: document.getElementById('cart-items'),
  cartTotal: document.getElementById('cart-total'),
  overlay: document.getElementById('overlay'),
  wishlistCount: document.getElementById('wishlist-count'),
  searchInput: document.getElementById('search-input'),
  searchButton: document.getElementById('search-button'),
};

let cart = {};
let wishlist = new Set();

function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get('id')) || null;
}

function loadCart() {
  try {
    const raw = localStorage.getItem('shopora_cart');
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

function saveCart() {
  localStorage.setItem('shopora_cart', JSON.stringify(cart));
}

function loadWishlist() {
  try {
    const raw = localStorage.getItem('shopora_wishlist');
    return raw ? new Set(JSON.parse(raw).map(Number)) : new Set();
  } catch (error) {
    return new Set();
  }
}

function saveWishlist() {
  localStorage.setItem('shopora_wishlist', JSON.stringify(Array.from(wishlist)));
}

function updateHeaderCounts() {
  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  if (elements.cartCount) elements.cartCount.textContent = cartCount;
  if (elements.wishlistCount) elements.wishlistCount.textContent = wishlist.size;
}

function openCart() {
  if (elements.cartSidebar) elements.cartSidebar.classList.add('open');
  if (elements.overlay) elements.overlay.classList.add('active');
  renderCartItems();
}

function closeCart() {
  if (elements.cartSidebar) elements.cartSidebar.classList.remove('open');
  if (elements.overlay) elements.overlay.classList.remove('active');
}

function renderCartItems() {
  const itemIds = Object.keys(cart);
  if (!elements.cartItems) return;
  if (!itemIds.length) {
    elements.cartItems.innerHTML = '<p>Your cart is empty. Add a product to get started.</p>';
    return;
  }

  const html = itemIds.map((id) => {
    const product = products.find((item) => item.id === Number(id));
    if (!product) return '';
    const quantity = cart[id];
    const subtotal = product.price * quantity;
    return `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.alt}" />
        <div class="cart-item-details">
          <p class="cart-item-title">${product.title}</p>
          <p class="cart-item-price">$${subtotal.toFixed(2)}</p>
          <div class="quantity-controls">
            <button type="button" onclick="changeQuantity(${product.id}, -1)">−</button>
            <span>${quantity}</span>
            <button type="button" onclick="changeQuantity(${product.id}, 1)">+</button>
          </div>
          <div class="cart-actions">
            <button type="button" onclick="removeFromCart(${product.id})">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  elements.cartItems.innerHTML = html;
  if (elements.cartTotal) {
    const total = itemIds.reduce((sum, id) => {
      const product = products.find((item) => item.id === Number(id));
      return sum + (product ? product.price * cart[id] : 0);
    }, 0);
    elements.cartTotal.textContent = '$' + total.toFixed(2);
  }
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  cart[productId] = cart[productId] ? cart[productId] + 1 : 1;
  saveCart();
  updateHeaderCounts();
  if (elements.checkoutButton) {
    elements.checkoutButton.disabled = false;
  }
}

function changeQuantity(productId, delta) {
  if (!cart[productId]) return;
  cart[productId] += delta;
  if (cart[productId] < 1) delete cart[productId];
  saveCart();
  updateHeaderCounts();
  renderCartItems();
}

function removeFromCart(productId) {
  delete cart[productId];
  saveCart();
  updateHeaderCounts();
  renderCartItems();
}

function toggleWishlist(productId, button) {
  if (wishlist.has(productId)) {
    wishlist.delete(productId);
    button.textContent = button.classList.contains('save-button') ? '♡ Add to Wishlist' : '♡';
    button.setAttribute('aria-pressed', 'false');
  } else {
    wishlist.add(productId);
    button.textContent = button.classList.contains('save-button') ? '♥ Saved to Wishlist' : '♥';
    button.setAttribute('aria-pressed', 'true');
  }
  saveWishlist();
  updateHeaderCounts();
}

function renderRelatedProducts(productId) {
  return products
    .filter((product) => product.id !== productId)
    .slice(0, 3)
    .map((product) => `
      <article class="product-card">
        <a class="product-link" href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.alt}" loading="lazy" />
        </a>
        <div class="product-card-content">
          <h3 class="product-title"><a href="product.html?id=${product.id}">${product.title}</a></h3>
          <p class="product-description">${product.description}</p>
          <div class="product-card-footer">
            <span class="product-price">$${product.price.toFixed(2)}</span>
            <button class="secondary-button" type="button" onclick="window.location.href='product.html?id=${product.id}'">View</button>
          </div>
        </div>
      </article>
    `)
    .join('');
}

function renderDetailPage() {
  const productId = getProductId();
  const product = products.find((item) => item.id === productId);
  if (!product || !detailTarget) {
    detailTarget.innerHTML = `
      <div class="product-not-found">
        <h2>Product not found</h2>
        <p>We couldn't locate this item. Please return to the shop to continue browsing.</p>
        <a class="secondary-link" href="index.html">Back to shop</a>
      </div>
    `;
    return;
  }

  const isWishlist = wishlist.has(productId);
  const oldPrice = product.priceOld ? `<span class="product-old-price">$${product.priceOld.toFixed(2)}</span>` : '';
  const stockText = product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left in stock` : 'Currently unavailable';

  detailTarget.innerHTML = `
    <div class="product-detail-grid amazon-detail">
      <div class="image-panel">
        <div class="thumb-list">
          <button type="button"><img src="${product.image}" alt="${product.alt}" /></button>
          <button type="button"><img src="${product.image}" alt="${product.alt}" /></button>
          <button type="button"><img src="${product.image}" alt="${product.alt}" /></button>
        </div>
        <div class="image-zoom-container">
          <img src="${product.image}" alt="${product.alt}" />
        </div>
      </div>
      <div class="detail-copy">
        <h1>${product.title}</h1>
        <a class="brand-link" href="index.html#products">Visit the ${product.brand} store</a>
        <div class="product-badges">
          <span class="rating-pill">★ ${product.rating.toFixed(1)}</span>
          <a href="#reviews">${product.reviews} ratings</a>
          <span class="tag-pill">${product.badge || 'Best seller'}</span>
        </div>
        <hr />
        <p class="product-price-large"><span>$</span>${product.price.toFixed(2)}</p>
        ${oldPrice}
        <p class="product-detail-description">${product.description}</p>
        <h2>About this item</h2>
        <ul class="product-feature-list">
          <li>Premium selected item from the ${product.category} department.</li>
          <li>Customer-rated ${product.rating.toFixed(1)} out of 5 with trusted buyer feedback.</li>
          <li>Ships fast with secure checkout and easy returns.</li>
          <li>Designed for everyday use with a refined, modern finish.</li>
        </ul>
      </div>
      <aside class="buy-box">
        <p class="product-price-large"><span>$</span>${product.price.toFixed(2)}</p>
        <p class="delivery-promise">FREE delivery tomorrow on orders over $99</p>
        <p class="secure-note">Secure transaction</p>
        <strong class="stock-state">${stockText}</strong>
        <label>
          Quantity
          <select id="quantity-select">
            <option>1</option>
            <option>2</option>
            <option>3</option>
          </select>
        </label>
        <button class="add-to-cart" id="add-to-cart">Add to Cart</button>
        <button class="buy-now-button" id="buy-now">Buy Now</button>
        <button class="save-button" id="detail-wishlist" aria-pressed="${isWishlist}">${isWishlist ? '♥ Saved to Wishlist' : '♡ Add to Wishlist'}</button>
        <dl class="seller-info">
          <div><dt>Ships from</dt><dd>Shopora</dd></div>
          <div><dt>Sold by</dt><dd>Shopora</dd></div>
          <div><dt>Returns</dt><dd>30-day policy</dd></div>
        </dl>
      </aside>
    </div>
    <div class="product-extra">
      <h2>Customers also viewed</h2>
      <div class="related-grid">
        ${renderRelatedProducts(productId)}
      </div>
    </div>
  `;

  const addToCartButton = document.getElementById('add-to-cart');
  const buyNowButton = document.getElementById('buy-now');
  const detailWishlistButton = document.getElementById('detail-wishlist');

  if (addToCartButton) {
    addToCartButton.addEventListener('click', () => addToCart(productId));
  }
  if (buyNowButton) {
    buyNowButton.addEventListener('click', () => {
      addToCart(productId);
      window.location.href = 'checkout.html';
    });
  }
  if (detailWishlistButton) {
    detailWishlistButton.addEventListener('click', () => toggleWishlist(productId, detailWishlistButton));
  }
}

window.addEventListener('load', () => {
  cart = loadCart();
  wishlist = loadWishlist();
  updateHeaderCounts();
  renderDetailPage();
  if (elements.cartToggle) elements.cartToggle.addEventListener('click', openCart);
  if (elements.cartClose) elements.cartClose.addEventListener('click', closeCart);
  if (elements.overlay) elements.overlay.addEventListener('click', closeCart);
  if (elements.searchButton && elements.searchInput) {
    elements.searchButton.addEventListener('click', () => {
      const query = elements.searchInput.value.trim();
      window.location.href = `index.html?search=${encodeURIComponent(query)}`;
    });
    elements.searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const query = elements.searchInput.value.trim();
        window.location.href = `index.html?search=${encodeURIComponent(query)}`;
      }
    });
  }
});
