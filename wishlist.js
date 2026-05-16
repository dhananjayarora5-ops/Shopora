const elements = {
  wishlistList: document.getElementById('wishlist-list'),
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
  const total = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  if (elements.cartCount) elements.cartCount.textContent = total;
  if (elements.wishlistCount) elements.wishlistCount.textContent = wishlist.size;
}

function renderWishlist() {
  if (!elements.wishlistList) return;
  const items = Array.from(wishlist).map((id) => products.find((product) => product.id === Number(id))).filter(Boolean);
  if (!items.length) {
    elements.wishlistList.innerHTML = '<div class="wishlist-empty"><h3>Your wishlist is empty</h3><p>Add products to your wishlist to save them for later.</p></div>';
    return;
  }

  elements.wishlistList.innerHTML = items.map((product) => `
    <article class="wishlist-item">
      <img src="${product.image}" alt="${product.alt}" loading="lazy" />
      <div class="wishlist-item-content">
        <h3 class="wishlist-item-title"><a href="product.html?id=${product.id}">${product.title}</a></h3>
        <p class="product-description">${product.description}</p>
        <div class="product-card-footer">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          <button class="secondary-button" type="button" onclick="addToCart(${product.id})">Add to cart</button>
        </div>
        <div class="wishlist-item-actions">
          <button class="action-button" type="button" onclick="removeFromWishlist(${product.id})">Remove</button>
          <a class="secondary-link" href="product.html?id=${product.id}">View details</a>
        </div>
      </div>
    </article>
  `).join('');
}

function renderCartItems() {
  const itemIds = Object.keys(cart);
  if (!elements.cartItems) return;
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
  renderCartItems();
}

function removeFromWishlist(productId) {
  wishlist.delete(productId);
  saveWishlist();
  updateHeaderCounts();
  renderWishlist();
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

function openCart() {
  if (elements.cartSidebar) elements.cartSidebar.classList.add('open');
  if (elements.overlay) elements.overlay.classList.add('active');
  renderCartItems();
}

function closeCart() {
  if (elements.cartSidebar) elements.cartSidebar.classList.remove('open');
  if (elements.overlay) elements.overlay.classList.remove('active');
}

window.addEventListener('load', () => {
  cart = loadCart();
  wishlist = loadWishlist();
  updateHeaderCounts();
  renderWishlist();

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
