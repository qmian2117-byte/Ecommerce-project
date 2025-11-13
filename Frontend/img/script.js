
const products = window.products;
let filteredProducts = [...products];

const productList = document.getElementById('product-list');
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('filterCategory');
const sortPrice = document.getElementById('sortPrice');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderProducts(items) {
  if (!productList) return;
  productList.innerHTML = '';
  items.forEach(p => {
    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded shadow';
    div.innerHTML = \`
      <h2 class="text-xl font-bold">\${p.name}</h2>
      <p class="text-gray-600">\${p.category}</p>
      <p class="font-bold mt-2">$\${p.price}</p>
      <button onclick='addToCart(\${p.id})' class="mt-2 bg-blue-500 text-white px-3 py-1 rounded">Add to Cart</button>
    \`;
    productList.appendChild(div);
  });
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  const existing = cart.find(p => p.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Added to cart!');
}

function updateCartDisplay() {
  const container = document.getElementById('cart-items');
  const totalSpan = document.getElementById('total-price');
  if (!container || !totalSpan) return;
  container.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'bg-white p-4 rounded shadow';
    div.innerHTML = \`
      <h2 class="font-bold">\${item.name}</h2>
      <p>Qty: \${item.qty}</p>
      <p>Price: $\${item.price}</p>
    \`;
    container.appendChild(div);
  });
  totalSpan.innerText = total.toFixed(2);
}

function filterAndRender() {
  let value = searchInput?.value.toLowerCase() || '';
  let category = categoryFilter?.value || '';
  let sorted = [...products].filter(p =>
    p.name.toLowerCase().includes(value) &&
    (category === '' || p.category === category)
  );
  if (sortPrice?.value === 'asc') sorted.sort((a, b) => a.price - b.price);
  if (sortPrice?.value === 'desc') sorted.sort((a, b) => b.price - a.price);
  renderProducts(sorted);
}

if (searchInput) searchInput.addEventListener('input', filterAndRender);
if (categoryFilter) categoryFilter.addEventListener('change', filterAndRender);
if (sortPrice) sortPrice.addEventListener('change', filterAndRender);

if (categoryFilter) {
  let cats = [...new Set(products.map(p => p.category))];
  cats.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (productList) renderProducts(products);
  updateCartDisplay();
});
