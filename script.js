const products = [
  {
    id: 1,
    category: 'electronics',
    title: 'Active Noise Cancelling Headphones',
    description: 'Wireless over-ear headphones with long battery life and ambient sound control.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1516707570264-65b5044df1b4?auto=format&fit=crop&w=800&q=80',
    alt: 'White wireless headphones with premium design'
  },
  {
    id: 2,
    category: 'electronics',
    title: 'Smart Home Display Hub',
    description: 'Voice-controlled smart display for home automation and video calling.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    alt: 'Smart home display on a modern desk'
  },
  {
    id: 3,
    category: 'fashion',
    title: 'Minimalist Leather Sneakers',
    description: 'Lightweight leather sneakers with comfortable cushioning for everyday wear.',
    price: 89.0,
    image: 'https://images.unsplash.com/photo-1528701800489-20d1d97a9373?auto=format&fit=crop&w=800&q=80',
    alt: 'Pair of minimalist leather sneakers on a white floor'
  },
  {
    id: 4,
    category: 'fashion',
    title: 'Tailored Wool Coat',
    description: 'Slim-fit wool coat finished with polished buttons and a refined silhouette.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    alt: 'Dark wool coat draped on a wooden chair'
  },
  {
    id: 5,
    category: 'home',
    title: 'Modern Ceramic Table Lamp',
    description: 'Soft matte ceramic lamp with warm LED glow for living room ambiance.',
    price: 64.0,
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80',
    alt: 'Ceramic table lamp by a cozy sofa'
  },
  {
    id: 6,
    category: 'home',
    title: 'Oak Wood Side Table',
    description: 'Compact side table crafted in solid oak with concealed storage drawer.',
    price: 109.5,
    image: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=800&q=80',
    alt: 'Oak side table with modern decor'
  },
  {
    id: 7,
    category: 'fitness',
    title: 'Portable Resistance Bands Set',
    description: 'Set of lightweight resistance bands for home cardio and strength training.',
    price: 29.95,
    image: 'https://images.unsplash.com/photo-1599058917218-12340537e81f?auto=format&fit=crop&w=800&q=80',
    alt: 'Resistance bands on a hardwood floor'
  },
  {
    id: 8,
    category: 'fitness',
    title: 'Smart Fitness Watch',
    description: 'Water-resistant activity tracker with workout metrics and sleep monitoring.',
    price: 169.0,
    image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80',
    alt: 'Fitness watch with activity tracking display'
  },
  {
    id: 9,
    category: 'beauty',
    title: 'Serene Skincare Collection',
    description: 'Daily skincare set with moisturizers and nourishing botanical formulas.',
    price: 58.5,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
    alt: 'Serene skincare products arranged on marble'
  },
  {
    id: 10,
    category: 'beauty',
    title: 'Refresh Facial Mist',
    description: 'Cooling facial mist that hydrates skin with natural antioxidants.',
    price: 22.0,
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
    alt: 'Facial mist spray bottle on a bright background'
  },
  {
    id: 11,
    category: 'electronics',
    title: 'Compact Bluetooth Speaker',
    description: 'Portable speaker with crisp sound and deep bass for indoor or outdoor use.',
    price: 79.0,
    image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=80',
    alt: 'Compact Bluetooth speaker with modern design'
  },
  {
    id: 12,
    category: 'fashion',
    title: 'Everyday Travel Backpack',
    description: 'Durable travel backpack with padded laptop compartment and organizer pockets.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    alt: 'Travel backpack placed near home entrance'
  },
  {
    id: 13,
    category: 'home',
    title: 'Luxury Sheet Set',
    description: 'Breathable cotton sheet set with a silky finish for a restful night.',
    price: 74.0,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    alt: 'Neatly folded luxury sheet set on a bed'
  },
  {
    id: 14,
    category: 'fitness',
    title: 'Recycled Yoga Mat',
    description: 'Eco-friendly yoga mat with enhanced grip and premium cushioning.',
    price: 39.5,
    image: 'https://images.unsplash.com/photo-1517430816045-df4b7de7d7c7?auto=format&fit=crop&w=800&q=80',
    alt: 'Person practicing yoga on a recycled mat'
  },
  {
    id: 15,
    category: 'beauty',
    title: 'Luxury Hair Styling Set',
    description: 'Salon-quality styling essentials for silky shine and easy glide.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    alt: 'Hair styling products arranged neatly'
  },
  {
    id: 16,
    category: 'electronics',
    title: 'Premium Laptop Stand',
    description: 'Ergonomic laptop stand with adjustable height and aluminum finish.',
    price: 44.0,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    alt: 'Laptop stand on desk with open laptop'
  },
  {
    id: 17,
    category: 'home',
    title: 'Modern Wall Art Print',
    description: 'Abstract wall art print framed for contemporary room styling.',
    price: 36.0,
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80',
    alt: 'Abstract wall art print above a sofa'
  },
  {
    id: 18,
    category: 'fashion',
    title: 'Classic Aviator Sunglasses',
    description: 'UV-protective aviator sunglasses finished in polished metal.',
    price: 69.0,
    image: 'https://images.unsplash.com/photo-1516637090014-cb1ab78511f5?auto=format&fit=crop&w=800&q=80',
    alt: 'Classic aviator sunglasses on a wooden table'
  },
  {
    id: 19,
    category: 'fitness',
    title: 'Wireless Earbuds for Running',
    description: 'Sweat-resistant earbuds with secure fit and powerful audio.',
    price: 94.0,
    image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=800&q=80',
    alt: 'Wireless earbuds in charging case'
  },
  {
    id: 20,
    category: 'beauty',
    title: 'Daily Vitamin Serum',
    description: 'Daily vitamin-infused serum to brighten skin and improve hydration.',
    price: 32.0,
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80',
    alt: 'Vitamin serum bottle next to green leaves'
  }
];

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
  categoryButtons: document.querySelectorAll('.category-button')
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
}

function renderProductCard(product) {
  return `
    <article class="product-card">
      <img src="${product.image}" alt="${product.alt}" loading="lazy" />
      <div class="product-info">
        <span class="product-category">${capitalize(product.category)}</span>
        <h3 class="product-title">${product.title}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-meta">
          <strong class="product-price">$${product.price.toFixed(2)}</strong>
          <button type="button" onclick="addToCart(${product.id})">Add to cart</button>
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
  renderProducts();
  updateCart();
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
