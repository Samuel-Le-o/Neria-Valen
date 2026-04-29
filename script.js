const products = [
  {
    id: 1,
    name: "Essential Oversized Tee - Women",
    price: 48,
    category: "tops",
    sizes: ["S", "M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    description: "Relaxed women's silhouette in premium heavyweight cotton."
  },
  {
    id: 2,
    name: "Neria Slip Midi Dress",
    price: 108,
    category: "dresses",
    sizes: ["S", "M", "L"],
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
    description: "Elegant satin slip dress with a fluid feminine drape."
  },
  {
    id: 3,
    name: "Minimalist High-Waist Cargo Pants",
    price: 92,
    category: "bottoms",
    sizes: ["S", "M", "L"],
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=900&q=80",
    description: "Tailored high-waist utility fit with soft structure and movement."
  },
  {
    id: 4,
    name: "Neria Signature Rib-Knit Dress",
    price: 124,
    category: "dresses",
    sizes: ["S", "M", "L"],
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
    description: "Body-contouring rib-knit midi dress for elevated evenings."
  },
  {
    id: 5,
    name: "Contour Ribbed Tank - Women",
    price: 42,
    category: "tops",
    sizes: ["S", "M", "L"],
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    description: "Second-skin stretch women's tank designed for layering."
  },
  {
    id: 6,
    name: "Relaxed Pleated Wide-Leg Trousers",
    price: 114,
    category: "bottoms",
    sizes: ["M", "L", "XL"],
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    description: "Modern women's tailoring with a fluid wide-leg drape."
  }
];

const state = {
  cart: [],
  wishlist: [],
  currentPage: "home",
  currentProductId: null,
  search: ""
};

const pages = document.querySelectorAll(".page");
const shopGrid = document.getElementById("shopGrid");
const bestSellerGrid = document.getElementById("bestSellerGrid");
const productDetail = document.getElementById("productDetail");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const wishlistCount = document.getElementById("wishlistCount");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const searchInput = document.getElementById("searchInput");

const categoryFilter = document.getElementById("categoryFilter");
const sizeFilter = document.getElementById("sizeFilter");
const priceFilter = document.getElementById("priceFilter");
const sortSelect = document.getElementById("sortSelect");

function routeTo(page) {
  state.currentPage = page;
  pages.forEach((node) => node.classList.toggle("active", node.dataset.page === page));
  if (page === "shop") renderShopProducts();
  if (page === "product") renderProductDetail();
  if (page === "checkout") renderCart();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getFilteredProducts() {
  let list = [...products];
  const category = categoryFilter?.value || "all";
  const size = sizeFilter?.value || "all";
  const price = priceFilter?.value || "all";
  const search = state.search.trim().toLowerCase();

  if (category !== "all") list = list.filter((item) => item.category === category);
  if (size !== "all") list = list.filter((item) => item.sizes.includes(size));
  if (price !== "all") {
    const [min, max] = price.split("-").map(Number);
    list = list.filter((item) => item.price >= min && item.price <= max);
  }
  if (search) {
    list = list.filter((item) => {
      return item.name.toLowerCase().includes(search) || item.category.toLowerCase().includes(search);
    });
  }

  const sortValue = sortSelect?.value || "featured";
  if (sortValue === "low-high") list.sort((a, b) => a.price - b.price);
  if (sortValue === "high-low") list.sort((a, b) => b.price - a.price);
  return list;
}

function productCard(product) {
  const wished = state.wishlist.includes(product.id);
  return `
    <article class="product-card">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" />
        <button class="wishlist" data-wishlist="${product.id}">${wished ? "♥" : "♡"}</button>
      </div>
      <div class="product-body">
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <div class="product-actions">
          <button class="btn btn-light" data-quick-view="${product.id}">Quick View</button>
          <button class="btn btn-primary" data-add-to-cart="${product.id}">Add to Cart</button>
        </div>
        <button class="link-btn" data-open-product="${product.id}">View Details</button>
      </div>
    </article>
  `;
}

function renderShopProducts() {
  const filtered = getFilteredProducts();
  shopGrid.innerHTML = filtered.map(productCard).join("") || "<p>No products match your filters.</p>";
}

function renderBestSellers() {
  bestSellerGrid.innerHTML = products.slice(0, 3).map(productCard).join("");
}

function renderProductDetail() {
  const product = products.find((item) => item.id === state.currentProductId) || products[0];
  state.currentProductId = product.id;
  productDetail.innerHTML = `
    <img src="${product.image}" alt="${product.name}" />
    <div>
      <p class="eyebrow">${product.category}</p>
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <p><strong>$${product.price.toFixed(2)}</strong></p>
      <p>Available sizes: ${product.sizes.join(", ")}</p>
      <div class="product-actions">
        <button class="btn btn-primary" data-add-to-cart="${product.id}">Add to Cart</button>
        <button class="btn btn-light" data-quick-view="${product.id}">Quick View</button>
      </div>
    </div>
  `;
}

function updateBadges() {
  cartCount.textContent = state.cart.length;
  wishlistCount.textContent = state.wishlist.length;
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  state.cart.push(product);
  updateBadges();
  renderCart();
}

function toggleWishlist(productId) {
  const index = state.wishlist.indexOf(productId);
  if (index === -1) state.wishlist.push(productId);
  else state.wishlist.splice(index, 1);
  updateBadges();
  renderShopProducts();
  renderBestSellers();
}

function renderCart() {
  if (!cartItems) return;
  if (!state.cart.length) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cartItems.innerHTML = state.cart.map((item, index) => `
      <article class="cart-item">
        <div>
          <p><strong>${item.name}</strong></p>
          <p>$${item.price.toFixed(2)}</p>
        </div>
        <button class="btn btn-light" data-remove-cart="${index}">Remove</button>
      </article>
    `).join("");
  }

  const subtotal = state.cart.reduce((sum, item) => sum + item.price, 0);
  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  totalEl.textContent = `$${(subtotal + 8).toFixed(2)}`;
}

const quickViewModal = document.getElementById("quickViewModal");
const quickViewContent = document.getElementById("quickViewContent");

function openQuickView(productId) {
  const product = products.find((item) => item.id === productId);
  quickViewContent.innerHTML = `
    <div class="quick-view-grid">
      <img src="${product.image}" alt="${product.name}" />
      <div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>$${product.price.toFixed(2)}</strong></p>
        <button class="btn btn-primary" data-add-to-cart="${product.id}">Add to Cart</button>
      </div>
    </div>
  `;
  quickViewModal.showModal();
}

document.body.addEventListener("click", (event) => {
  const routeBtn = event.target.closest("[data-route]");
  if (routeBtn) {
    routeTo(routeBtn.dataset.route);
  }

  const addBtn = event.target.closest("[data-add-to-cart]");
  if (addBtn) addToCart(Number(addBtn.dataset.addToCart));

  const wishBtn = event.target.closest("[data-wishlist]");
  if (wishBtn) toggleWishlist(Number(wishBtn.dataset.wishlist));

  const openProductBtn = event.target.closest("[data-open-product]");
  if (openProductBtn) {
    state.currentProductId = Number(openProductBtn.dataset.openProduct);
    routeTo("product");
  }

  const quickBtn = event.target.closest("[data-quick-view]");
  if (quickBtn) openQuickView(Number(quickBtn.dataset.quickView));

  const removeBtn = event.target.closest("[data-remove-cart]");
  if (removeBtn) {
    state.cart.splice(Number(removeBtn.dataset.removeCart), 1);
    renderCart();
    updateBadges();
  }
});

document.getElementById("closeQuickView").addEventListener("click", () => quickViewModal.close());
document.getElementById("cartBtn").addEventListener("click", () => routeTo("checkout"));
document.getElementById("menuBtn").addEventListener("click", () => {
  document.getElementById("mobileMenu").classList.toggle("open");
});
document.getElementById("searchToggle").addEventListener("click", () => {
  document.getElementById("searchRow").classList.toggle("open");
});

[categoryFilter, sizeFilter, priceFilter, sortSelect].forEach((el) => {
  el?.addEventListener("change", renderShopProducts);
});

searchInput?.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderShopProducts();
});

document.getElementById("newsletterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  alert("Thanks for joining Neria Valen.");
  event.target.reset();
});

document.getElementById("contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  alert("Message sent. Our team will contact you shortly.");
  event.target.reset();
});

document.getElementById("checkoutForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!state.cart.length) {
    alert("Your cart is empty.");
    return;
  }
  alert("Order placed successfully. Thank you for shopping with Neria Valen.");
  state.cart = [];
  renderCart();
  updateBadges();
  event.target.reset();
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));

renderShopProducts();
renderBestSellers();
renderProductDetail();
renderCart();
updateBadges();
routeTo("home");
