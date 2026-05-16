const detailTarget = document.getElementById('product-detail');
const elements = {
  cartCount: document.getElementById('cart-count'),
  cartToggle: document.getElementById('cart-toggle'),
  cartSidebar: document.getElementById('cart-sidebar'),
  cartClose: document.getElementById('cart-close'),
  cartItems: document.getElementById('cart-items'),
  cartTotal: document.getElementById('cart-total'),
  overlay: document.getElementById('overlay'),
  wishlistToggle: document.getElementById('wishlist-toggle'),
  wishlistCount: document.getElementById('wishlist-count')
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
    if (raw) {
      cart = JSON.parse(raw);
    }
  } catch (error) {
    cart = {};
  }
}

function saveCart() {
  localStorage.setItem('shopora_cart', JSON.stringify(cart));
}

function loadWishlist() {
  try {
    const raw = localStorage.getItem('shopora_wishlist');
    if (raw) {
      JSON.parse(raw).forEach((id) => wishlist.add(Number(id)));
    }
  } catch (error) {
    wishlist = new Set();
  }
}

function saveWishlist() {
  localStorage.setItem('shopora_wishlist', JSON.stringify(Array.from(wishlist)));
}

function updateHeaderCounts() {
  if (elements.cartCount) {
    const total = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    elements.cartCount.textContent = total;
  }
  if (elements.wishlistCount) {
    elements.wishlistCount.textContent = wishlist.size;
  }
}

function openCart() {
  elements.cartSidebar.classList.add('open');
  elements.overlay.classList.add('active');
  renderCartItems();
}

function closeCart() {
  elements.cartSidebar.classList.remove('open');
  elements.overlay.classList.remove('active');
}

function renderCartItems() {
  const itemIds = Object.keys(cart);
  if (!itemIds.length) {
    elements.cartItems.innerHTML = '<p>Your cart is empty. Add a product to get started.</p>';
    return;
  }
  elements.cartItems.innerHTML = itemIds.map((id) => {
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
  const total = Object.keys(cart).reduce((sum, id) => {
    const product = products.find((item) => item.id === Number(id));
    return sum + (product ? product.price * cart[id] : 0);
  }, 0);
  elements.cartTotal.textContent = '$' + total.toFixed(2);
}

function addToCart(productId) {
  cart[productId] = cart[productId] ? cart[productId] + 1 : 1;
  saveCart();
  updateHeaderCounts();
  alert('Added product to cart.');
}

function changeQuantity(productId, delta) {
  if (!cart[productId]) return;
  cart[productId] += delta;
  if (cart[productId] < 1) {
    delete cart[productId];
  }
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
    button.textContent = '♡';
  } else {
    wishlist.add(productId);
    button.textContent = '♥';
  }
  saveWishlist();
  updateHeaderCounts();
}

function showWishlist() {
  if (!wishlist.size) {
    alert('Your wishlist is empty.');
    return;
  }
  const list = Array.from(wishlist).map((id) => {
    const product = products.find((item) => item.id === Number(id));
    return product ? `• ${product.title}` : `• Item ${id}`;
  }).join('\n');
  alert('Wishlist:\n' + list);
}

function renderDetailPage() {
  const productId = getProductId();
  const product = products.find((item) => item.id === productId);
  if (!product || !detailTarget) {
    detailTarget.innerHTML = `
      <div class="product-not-found">
        <h2>Product not found</h2>
        <p>We couldn't find that product. Please return to the shop and choose a different item.</p>
        <a class="secondary-link" href="index.html">Back to shop</a>
      </div>
    `;
    return;
  }

  const isWishlist = wishlist.has(productId);
  detailTarget.innerHTML = `
    <div class="product-detail-grid">
      <div class="image-panel">
        <div class="image-zoom-container">
          <img src="${product.image}" alt="${product.alt}" />
          <span class="zoom-label">Hover to zoom</span>
        </div>
      </div>
      <div class="detail-copy">
        <span class="eyebrow">Shopora Picks</span>
        <h1>${product.title}</h1>
        <div class="product-badges">
          <span class="rating-pill">4.8 ★</span>
          <span class="tag-pill">Best seller</span>
        </div>
        <p class="product-price-large">$${product.price.toFixed(2)}</p>
        <p class="product-detail-description">${product.description}</p>
        <ul class="product-feature-list">
          <li>Premium finish with carefully selected materials.</li>
          <li>Fast delivery and trusted customer support.</li>
          <li>Designed for everyday comfort and performance.</li>
        </ul>
        <div class="product-actions">
          <button class="primary-button" id="buy-now">Buy now</button>
          <button class="secondary-button" id="add-to-cart">Add to cart</button>
          <button class="wish-button" id="detail-wishlist" aria-pressed="${isWishlist}">${isWishlist ? '♥' : '♡'}</button>
        </div>
        <div class="shipping-pill">Free delivery on orders over $99</div>
      </div>
    </div>
    <div class="product-extra">
      <h2>About this item</h2>
      <p>Experience elevated styling and modern convenience with this premium product, built to fit seamlessly into every part of your life.</p>
      <ul>
        <li>Trusted by customers for quality and value.</li>
        <li>Flexible return policy and easy checkout.</li>
        <li>Carefully packaged for safe delivery.</li>
      </ul>
    </div>
  `;

  const addToCartButton = document.getElementById('add-to-cart');
  const detailWishlistButton = document.getElementById('detail-wishlist');
  const buyNowButton = document.getElementById('buy-now');

  if (addToCartButton) {
    addToCartButton.addEventListener('click', () => addToCart(productId));
  }
  if (buyNowButton) {
    buyNowButton.addEventListener('click', () => {
      addToCart(productId);
      window.location.href = 'index.html';
    });
  }
  if (detailWishlistButton) {
    detailWishlistButton.addEventListener('click', () => toggleWishlist(productId, detailWishlistButton));
  }
}

window.addEventListener('load', () => {
  loadCart();
  loadWishlist();
  updateHeaderCounts();
  renderDetailPage();
});

elements.cartToggle.addEventListener('click', openCart);
elements.cartClose.addEventListener('click', closeCart);
elements.overlay.addEventListener('click', closeCart);

elements.searchButton.addEventListener('click', () => {
  const query = document.getElementById('search-input').value.trim();
  window.location.href = `index.html?search=${encodeURIComponent(query)}`;
});
