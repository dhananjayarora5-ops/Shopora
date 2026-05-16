const cart = {};
let wishlist = new Set();

const elements = {
  productList: document.getElementById('product-list'),
  cartCount: document.getElementById('cart-count'),
  cartToggle: document.getElementById('cart-toggle'),
  cartSidebar: document.getElementById('cart-sidebar'),
  cartClose: document.getElementById('cart-close'),
  cartItems: document.getElementById('cart-items'),
  cartTotal: document.getElementById('cart-total'),
  overlay: document.getElementById('overlay'),
  searchInput: document.getElementById('search-input'),
  searchButton: document.getElementById('search-button'),
  categoryButtons: document.querySelectorAll('.category-button'),
  wishlistToggle: document.getElementById('wishlist-toggle'),
  wishlistCount: document.getElementById('wishlist-count'),
  cartPreviewItems: document.querySelector('.cart-preview-items'),
  checkoutButton: document.getElementById('checkout-button'),
  checkoutItems: document.getElementById('checkout-items'),
  checkoutTotal: document.getElementById('checkout-total')
};

let activeCategory = 'all';
let activeSort = 'default';
let activeSearch = '';

function loadCartData() {
  try {
    const raw = localStorage.getItem('shopora_cart');
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    return {};
  }
}

function saveCartData() {
  localStorage.setItem('shopora_cart', JSON.stringify(cart));
}

function loadWishlistData() {
  try {
    const raw = localStorage.getItem('shopora_wishlist');
    return raw ? new Set(JSON.parse(raw).map(Number)) : new Set();
  } catch (error) {
    return new Set();
  }
}

function saveWishlistData() {
  localStorage.setItem('shopora_wishlist', JSON.stringify(Array.from(wishlist)));
}

function getSearchQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get('search') || '';
}

function renderProducts() {
  const visibleProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const normalizedSearch = activeSearch.toLowerCase();
    const matchesSearch = !normalizedSearch || product.title.toLowerCase().includes(normalizedSearch) || product.description.toLowerCase().includes(normalizedSearch) || product.brand.toLowerCase().includes(normalizedSearch);
    return matchesCategory && matchesSearch;
  });

  if (activeSort === 'low-high') {
    visibleProducts.sort((a, b) => a.price - b.price);
  } else if (activeSort === 'high-low') {
    visibleProducts.sort((a, b) => b.price - a.price);
  }

  if (elements.productList) {
    elements.productList.innerHTML = visibleProducts.map(renderProductCard).join('');
    attachWishlistHandlers();
  }
}

function renderProductCard(product) {
  const hasDiscount = product.discount && product.priceOld;
  const stockLabel = product.stock > 0 ? (product.stock > 10 ? 'In stock' : `Only ${product.stock} left`) : 'Out of stock';
  const stockClass = product.stock > 10 ? 'in-stock' : product.stock > 0 ? 'low-stock' : 'out-of-stock';

  return `
    <article class="product-card">
      <button class="wish-button" data-product-id="${product.id}" aria-pressed="${wishlist.has(product.id)}">${wishlist.has(product.id) ? '♥' : '♡'}</button>
      ${product.badge ? `<span class="badge-pill">${product.badge}</span>` : ''}
      <a class="product-link" href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.alt}" loading="lazy" />
      </a>
      <div class="product-card-content">
        <div class="product-card-header">
          <span class="badge-pill">${product.brand}</span>
          <span class="stock-pill ${stockClass}">${stockLabel}</span>
        </div>
        <h3 class="product-title"><a href="product.html?id=${product.id}">${product.title}</a></h3>
        <div class="product-rating">
          <span>★ ${product.rating.toFixed(1)}</span>
          <span>(${product.reviews} reviews)</span>
        </div>
        <p class="product-description">${product.description}</p>
        <div class="product-card-footer">
          <div class="price-block">
            <span class="product-price">$${product.price.toFixed(2)}</span>
            ${hasDiscount ? `<span class="product-old-price">$${product.priceOld.toFixed(2)}</span>` : ''}
          </div>
          <button type="button" class="add-to-cart" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>Add to cart</button>
        </div>
      </div>
    </article>
  `;
}

function attachWishlistHandlers() {
  document.querySelectorAll('.wish-button').forEach((button) => {
    const productId = Number(button.dataset.productId);
    const handler = () => toggleWishlist(productId, button);
    button.removeEventListener('click', handler);
    button.addEventListener('click', handler);
  });
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product || product.stock === 0) {
    return;
  }
  cart[productId] = cart[productId] ? cart[productId] + 1 : 1;
  saveCartData();
  updateCart();
  openCart();
}

function updateCart() {
  const itemIds = Object.keys(cart);
  if (!elements.cartItems) return;

  if (!itemIds.length) {
    elements.cartItems.innerHTML = '<p>Your cart is empty. Add a product to start your order.</p>';
  } else {
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
  }

  const total = Object.keys(cart).reduce((sum, id) => {
    const product = products.find((item) => item.id === Number(id));
    return product ? sum + cart[id] * product.price : sum;
  }, 0);
  if (elements.cartTotal) {
    elements.cartTotal.textContent = `$${total.toFixed(2)}`;
  }
  if (elements.cartCount) {
    const count = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    elements.cartCount.textContent = count;
  }
  renderCartPreview();
  renderCheckoutSummary(total);
}

function renderCheckoutSummary(total) {
  if (!elements.checkoutItems || !elements.checkoutTotal) return;
  const itemIds = Object.keys(cart);
  if (!itemIds.length) {
    elements.checkoutItems.innerHTML = '<div class="checkout-item"><span>Your cart is empty.</span></div>';
    elements.checkoutTotal.textContent = '$0.00';
    return;
  }

  elements.checkoutItems.innerHTML = itemIds.map((id) => {
    const product = products.find((item) => item.id === Number(id));
    if (!product) return '';
    return `<div class="checkout-item"><span>${product.title} × ${cart[id]}</span><strong>$${(product.price * cart[id]).toFixed(2)}</strong></div>`;
  }).join('');
  elements.checkoutTotal.textContent = `$${total.toFixed(2)}`;
}

function renderCartPreview() {
  if (!elements.cartPreviewItems) return;
  const itemIds = Object.keys(cart);
  if (!itemIds.length) {
    elements.cartPreviewItems.innerHTML = '<p class="cart-empty-note">Your cart is currently empty.</p>';
    return;
  }

  elements.cartPreviewItems.innerHTML = itemIds.slice(0, 3).map((id) => {
    const product = products.find((item) => item.id === Number(id));
    if (!product) return '';
    return `<p>${cart[id]} × ${product.title}</p>`;
  }).join('');
}

function changeQuantity(productId, delta) {
  if (!cart[productId]) return;
  cart[productId] += delta;
  if (cart[productId] < 1) {
    delete cart[productId];
  }
  saveCartData();
  updateCart();
}

function removeFromCart(productId) {
  delete cart[productId];
  saveCartData();
  updateCart();
}

function toggleWishlist(productId, button) {
  if (wishlist.has(productId)) {
    wishlist.delete(productId);
    button.classList.remove('active');
    button.textContent = '♡';
    button.setAttribute('aria-pressed', 'false');
  } else {
    wishlist.add(productId);
    button.classList.add('active');
    button.textContent = '♥';
    button.setAttribute('aria-pressed', 'true');
  }
  saveWishlistData();
  updateWishlistCount();
}

function updateWishlistCount() {
  const count = wishlist.size;
  if (elements.wishlistCount) {
    elements.wishlistCount.textContent = count;
  }
}

function openCart() {
  if (elements.cartSidebar) elements.cartSidebar.classList.add('open');
  if (elements.overlay) elements.overlay.classList.add('active');
}

function closeCart() {
  if (elements.cartSidebar) elements.cartSidebar.classList.remove('open');
  if (elements.overlay) elements.overlay.classList.remove('active');
}

function applySearch() {
  activeSearch = elements.searchInput ? elements.searchInput.value.trim() : '';
  renderProducts();
}

function scrollToProducts() {
  const productsSection = document.getElementById('products');
  if (productsSection) productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

window.addEventListener('load', () => {
  Object.assign(cart, loadCartData());
  wishlist = loadWishlistData();
  activeSearch = getSearchQuery();
  if (elements.searchInput && activeSearch) {
    elements.searchInput.value = activeSearch;
  }
  renderProducts();
  updateCart();
  updateWishlistCount();
  if (elements.cartToggle) elements.cartToggle.addEventListener('click', openCart);
  if (elements.cartClose) elements.cartClose.addEventListener('click', closeCart);
  if (elements.overlay) elements.overlay.addEventListener('click', closeCart);
  if (elements.searchButton) elements.searchButton.addEventListener('click', applySearch);
  if (elements.searchInput) {
    elements.searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        applySearch();
      }
    });
  }
  if (elements.checkoutButton) {
    elements.checkoutButton.addEventListener('click', () => {
      window.location.href = 'checkout.html';
    });
  }
  const pageLoader = document.getElementById('page-loader');
  if (pageLoader) {
    pageLoader.classList.add('page-loader-hidden');
    setTimeout(() => pageLoader.remove(), 500);
  }
});
