const wishlistTarget = document.getElementById('wishlist-list');
const elements = {
  cartCount: document.getElementById('cart-count'),
  cartToggle: document.getElementById('cart-toggle'),
  cartSidebar: document.getElementById('cart-sidebar'),
  cartClose: document.getElementById('cart-close'),
  cartItems: document.getElementById('cart-items'),
  cartTotal: document.getElementById('cart-total'),
  overlay: document.getElementById('overlay'),
  searchInput: document.getElementById('search-input'),
  searchButton: document.getElementById('search-button')
};

let cart = {};
let wishlist = new Set();

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

function renderWishlist() {
  if (!wishlist.size) {
    wishlistTarget.innerHTML = `
      <div class="wishlist-empty">
        <h3>Your wishlist is empty</h3>
        <p>Save items while you browse and return later to purchase them.</p>
        <a class="secondary-link" href="index.html">Shop now</a>
      </div>
    `;
    return;
  }

  wishlistTarget.innerHTML = Array.from(wishlist).map((id) => {
    const product = products.find((item) => item.id === Number(id));
    if (!product) return '';
    return `
      <article class="wishlist-item">
        <img src="${product.image}" alt="${product.alt}" loading="lazy" />
        <div class="wishlist-item-content">
          <div>
            <h3 class="wishlist-item-title"><a href="product.html?id=${product.id}">${product.title}</a></h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <p class="product-description">${product.description}</p>
          </div>
          <div class="wishlist-item-actions">
            <button class="primary-button" type="button" onclick="addToCart(${product.id})">Add to cart</button>
            <button class="secondary-button" type="button" onclick="removeFromWishlist(${product.id})">Remove</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function addToCart(productId) {
  cart[productId] = cart[productId] ? cart[productId] + 1 : 1;
  saveCart();
  renderCartItems();
  updateHeaderCounts();
}

function removeFromWishlist(productId) {
  wishlist.delete(productId);
  saveWishlist();
  renderWishlist();
}

function changeQuantity(productId, delta) {
  if (!cart[productId]) return;
  cart[productId] += delta;
  if (cart[productId] < 1) {
    delete cart[productId];
  }
  saveCart();
  renderCartItems();
  updateHeaderCounts();
}

function removeFromCart(productId) {
  delete cart[productId];
  saveCart();
  renderCartItems();
  updateHeaderCounts();
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

window.addEventListener('load', () => {
  loadCart();
  loadWishlist();
  updateHeaderCounts();
  renderWishlist();
});

elements.cartToggle.addEventListener('click', openCart);
elements.cartClose.addEventListener('click', closeCart);
elements.overlay.addEventListener('click', closeCart);

elements.searchButton.addEventListener('click', () => {
  const query = elements.searchInput.value.trim();
  window.location.href = `index.html?search=${encodeURIComponent(query)}`;
});

globalThis.changeQuantity = changeQuantity;
globalThis.removeFromCart = removeFromCart;
globalThis.addToCart = addToCart;
globalThis.removeFromWishlist = removeFromWishlist;
