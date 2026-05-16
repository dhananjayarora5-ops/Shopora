const cart = {};

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
  sortSelect: document.getElementById('sort-select'),
  filterLabel: document.getElementById('filter-label'),
  categoryButtons: document.querySelectorAll('.category-button'),
  wishlistToggle: document.getElementById('wishlist-toggle'),
  wishlistCount: document.getElementById('wishlist-count')
};

let activeCategory = 'all';
let activeSort = 'default';
let activeSearch = '';

function renderProducts() {
  let visibleProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.title.toLowerCase().includes(activeSearch) || product.description.toLowerCase().includes(activeSearch);
    return matchesCategory && matchesSearch;
  });

  if (activeSort === 'low-high') {
    visibleProducts.sort((a, b) => a.price - b.price);
  } else if (activeSort === 'high-low') {
    visibleProducts.sort((a, b) => b.price - a.price);
  }

  elements.productList.innerHTML = visibleProducts.map(renderProductCard).join('');
  attachWishlistHandlers();
}

function renderProductCard(product) {
  return `
    <article class="product-card">
      <button class="wish-button" data-product-id="${product.id}" aria-pressed="false" title="Add to wishlist">♡</button>
      <a class="product-link" href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.alt}" loading="lazy" />
      </a>
      <div class="product-info">
        <span class="product-category">${capitalize(product.category)}</span>
        <h3 class="product-title"><a href="product.html?id=${product.id}">${product.title}</a></h3>
        <p class="product-description">${product.description}</p>
        <div class="product-meta">
          <strong class="product-price">$${product.price.toFixed(2)}</strong>
          <button type="button" class="add-to-cart" onclick="addToCart(${product.id})">Add to cart</button>
        </div>
      </div>
    </article>
  `;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function addToCart(productId) {
  cart[productId] = cart[productId] ? cart[productId] + 1 : 1;
  updateCart();
  openCart();
}

function updateCart() {
  const itemIds = Object.keys(cart);
  const cartItems = itemIds.map((id) => {
    const product = products.find((item) => item.id === Number(id));
    const quantity = cart[id];
    const subtotal = quantity * product.price;
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
  });

  elements.cartItems.innerHTML = cartItems.length ? cartItems.join('') : '<p>Your cart is empty. Add a product to get started.</p>';
  elements.cartCount.textContent = itemIds.reduce((total, id) => total + cart[id], 0);
  elements.cartTotal.textContent = '$' + itemIds.reduce((sum, id) => {
    const product = products.find((item) => item.id === Number(id));
    return sum + cart[id] * product.price;
  }, 0).toFixed(2);
}

let wishlist = new Set();

function loadWishlist() {
  try {
    const raw = localStorage.getItem('shopora_wishlist');
    if (raw) {
      JSON.parse(raw).forEach(id => wishlist.add(Number(id)));
    }
  } catch (e) {
    wishlist = new Set();
  }
}

function saveWishlist() {
  localStorage.setItem('shopora_wishlist', JSON.stringify(Array.from(wishlist)));
}

function updateWishlistCount() {
  if (elements.wishlistCount) elements.wishlistCount.textContent = wishlist.size;
  if (elements.wishlistToggle) elements.wishlistToggle.setAttribute('aria-label', `Wishlist (${wishlist.size})`);
}

function attachWishlistHandlers() {
  const buttons = document.querySelectorAll('.wish-button');
  buttons.forEach((btn) => {
    const id = Number(btn.dataset.productId);
    const isFav = wishlist.has(id);
    btn.classList.toggle('active', isFav);
    btn.textContent = isFav ? '♥' : '♡';
    btn.setAttribute('aria-pressed', isFav);
    if (btn._wishHandler) btn.removeEventListener('click', btn._wishHandler);
    btn._wishHandler = () => {
      toggleWishlist(id, btn);
    };
    btn.addEventListener('click', btn._wishHandler);
  });
}

function toggleWishlist(productId, btnEl) {
  if (wishlist.has(productId)) {
    wishlist.delete(productId);
    btnEl.classList.remove('active');
    btnEl.textContent = '♡';
    btnEl.setAttribute('aria-pressed', 'false');
  } else {
    wishlist.add(productId);
    btnEl.classList.add('active');
    btnEl.textContent = '♥';
    btnEl.setAttribute('aria-pressed', 'true');
  }
  saveWishlist();
  updateWishlistCount();
}

function showWishlist() {
  if (!wishlist.size) {
    alert('Your wishlist is empty.');
    return;
  }
  const items = Array.from(wishlist).map(id => {
    const p = products.find(x => x.id === Number(id));
    return p ? `• ${p.title}` : `• Item ${id}`;
  }).join('\n');
  alert('Wishlist:\n' + items);
}

function changeQuantity(productId, delta) {
  if (!cart[productId]) return;
  cart[productId] += delta;
  if (cart[productId] < 1) {
    delete cart[productId];
  }
  updateCart();
}

function removeFromCart(productId) {
  delete cart[productId];
  updateCart();
}

function openCart() {
  elements.cartSidebar.classList.add('open');
  elements.overlay.classList.add('active');
}

function closeCart() {
  elements.cartSidebar.classList.remove('open');
  elements.overlay.classList.remove('active');
}

function applyCategory(category) {
  activeCategory = category;
  elements.filterLabel.textContent = category === 'all' ? 'All' : capitalize(category);
  elements.categoryButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.category === category);
  });
  renderProducts();
}

function applySort(sortValue) {
  activeSort = sortValue;
  renderProducts();
}

function applySearch() {
  activeSearch = elements.searchInput.value.trim().toLowerCase();
  renderProducts();
}

function scrollToProducts() {
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

window.addEventListener('load', () => {
  loadWishlist();
  renderProducts();
  updateCart();
  updateWishlistCount();
});

elements.searchButton.addEventListener('click', applySearch);

elements.searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    applySearch();
  }
});

elements.sortSelect.addEventListener('change', (event) => {
  applySort(event.target.value);
});

elements.cartToggle.addEventListener('click', openCart);

elements.cartClose.addEventListener('click', closeCart);

elements.overlay.addEventListener('click', closeCart);

elements.categoryButtons.forEach((button) => {
  button.addEventListener('click', () => applyCategory(button.dataset.category));
});
