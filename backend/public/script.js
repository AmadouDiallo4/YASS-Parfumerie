/* YASS Parfums – script.js */

const API_BASE = '';
const CART_STORAGE_KEY = 'yass_cart';

let products = [];
let cart = loadCart();

const $ = (id) => document.getElementById(id);

function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function displayName(name) {
  return String(name ?? '').replace(/_/g, ' ').trim();
}

function formatPrice(n) {
  return Number(n || 0).toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }) + ' FCFA';
}

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function categoryLabel(cat) {
  const map = {
    parfum: 'Parfums',
    cosmetique: 'Cosmétiques',
    'sante-bien-etre': 'Santé & Bien-être',
    divers: 'Divers'
  };
  return map[cat] || 'Produits';
}

function resolveCategorySlug(product) {
  const slug = normalizeText(product?.category?.slug || product?.categorie?.slug);
  if (slug === 'parfum' || slug === 'cosmetique' || slug === 'divers' || slug === 'sante-bien-etre') {
    return slug;
  }

  const categoryName = normalizeText(product?.category?.nom || product?.categorie?.nom);
  if (categoryName.includes('parfum')) return 'parfum';
  if (categoryName.includes('cosmet')) return 'cosmetique';
  if (categoryName.includes('sante') || categoryName.includes('bien')) return 'sante-bien-etre';
  if (categoryName.includes('divers') || categoryName.includes('electron')) return 'divers';

  return slug || 'divers';
}

function normalizeGender(genre) {
  const value = normalizeText(genre);
  if (value === 'femme') return 'femme';
  if (value === 'homme') return 'homme';
  return 'mixte';
}

function genderLabel(gender) {
  const map = { femme: 'Femme', homme: 'Homme', mixte: 'Mixte' };
  return map[gender] || 'Mixte';
}

function productCategoryLabel(product) {
  if (product?.categoryName) return product.categoryName;
  return categoryLabel(product.categorySlug);
}

function productIcon(product) {
  const map = {
    parfum: '🌸',
    cosmetique: '💄',
    'sante-bien-etre': '🧘',
    divers: '🛍️'
  };
  return map[product.categorySlug] || '🛍️';
}

function productPrimaryImage(product) {
  if (product?.imagePrincipale) return product.imagePrincipale;
  if (Array.isArray(product?.images) && product.images.length) return product.images[0];
  return '';
}

function mapApiProduct(item) {
  const categorySlug = resolveCategorySlug(item);
  const name = displayName(item.nom || item.name || 'Produit');
  return {
    id: Number(item.id),
    name,
    desc: item.description || '',
    price: Number(item.prix || item.price || 0),
    image: productPrimaryImage(item),
    categorySlug,
    categoryName: item?.category?.nom || item?.categorie?.nom || categoryLabel(categorySlug),
    gender: normalizeGender(item.genre || item.gender),
    icon: productIcon({ categorySlug }),
    source: item
  };
}

function cardImageHtml(product) {
  if (!product.image) {
    return `<div class="product-img" aria-hidden="true">${escHtml(product.icon)}</div>`;
  }

  return `
    <img class="product-img-photo" src="${escHtml(product.image)}" alt="${escHtml(product.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
    <div class="product-img product-img-fallback" aria-hidden="true" style="display:none">${escHtml(product.icon)}</div>
  `;
}

function renderProductCards(list, gridId, showGenderBadge = true) {
  const grid = $(gridId);
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = '<p class="cart-empty">Aucun produit disponible.</p>';
    return;
  }

  grid.innerHTML = list.map((product) => `
    <article class="product-card product-card-link" data-id="${product.id}" role="link" tabindex="0" aria-label="Voir ${escHtml(product.name)}">
      <div class="product-img-wrapper">${cardImageHtml(product)}</div>
      <div class="product-info">
        <span class="product-badge">${escHtml(productCategoryLabel(product))}</span>
        ${showGenderBadge && product.gender !== 'mixte' ? `<span class="product-gender gender-${escHtml(product.gender)}">${genderLabel(product.gender)}</span>` : ''}
        <h3>${escHtml(product.name)}</h3>
        <p class="product-desc">${escHtml(product.desc || 'Description à venir.')}</p>
        <p class="product-price">${formatPrice(product.price)}</p>
        <button class="btn-add" data-id="${product.id}" aria-label="Ajouter ${escHtml(product.name)} au panier">
          + Ajouter au panier
        </button>
      </div>
    </article>
  `).join('');
}

function renderProducts(filter = 'all') {
  let filtered = products;

  if (filter === 'femme' || filter === 'homme') {
    filtered = products.filter((p) => p.gender === filter);
  } else if (filter !== 'all') {
    filtered = products.filter((p) => p.categorySlug === filter);
  }

  renderProductCards(filtered, 'products-grid');
}

function renderGenderGrid(gender, gridId) {
  const filtered = products.filter((p) => p.gender === gender);
  renderProductCards(filtered, gridId, false);
}

async function loadProductsFromApi() {
  const mainGrid = $('products-grid');
  if (!mainGrid) return;

  mainGrid.innerHTML = '<p class="cart-empty">Chargement des produits…</p>';

  try {
    const params = new URLSearchParams({ page: '1', limit: '200', tri: 'name_asc' });
    const response = await fetch(`${API_BASE}/api/products?${params.toString()}`);
    const payload = await response.json().catch(() => ({}));

    if (!response.ok || payload?.success !== true) {
      throw new Error(payload?.message || 'Impossible de charger les produits.');
    }

    const items = Array.isArray(payload.items)
      ? payload.items
      : Array.isArray(payload.data)
        ? payload.data
        : [];

    products = items
      .filter((item) => item && Number.isFinite(Number(item.id)))
      .map(mapApiProduct);

    renderProducts('all');
    renderGenderGrid('femme', 'products-grid-femmes');
    renderGenderGrid('homme', 'products-grid-hommes');
  } catch (error) {
    mainGrid.innerHTML = `<p class="cart-empty">${escHtml(error.message || 'Erreur de chargement.')}</p>`;
  }
}

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    if (!Array.isArray(saved)) return [];
    return saved
      .map((item) => ({
        id: Number(item.id),
        name: displayName(item.name || item.nom || 'Produit'),
        price: Number(item.price || item.prix || 0),
        image: item.image || '',
        icon: item.icon || '🛍️',
        qty: Math.max(1, Number(item.qty || item.quantite || 1))
      }))
      .filter((item) => Number.isFinite(item.id));
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function toCartItem(product, quantity = 1) {
  const source = product?.source || product || {};
  return {
    id: Number(product.id || source.id),
    name: displayName(product.name || source.nom || source.name || 'Produit'),
    price: Number(product.price ?? source.prix ?? source.price ?? 0),
    image: product.image || source.imagePrincipale || '',
    icon: product.icon || '🛍️',
    qty: Math.max(1, Number(quantity || 1))
  };
}

function addToCart(productOrId, quantity = 1) {
  const product = typeof productOrId === 'object'
    ? productOrId
    : products.find((p) => p.id === Number(productOrId));

  if (!product) return;

  const qty = Math.max(1, Number(quantity || 1));
  const existing = cart.find((item) => item.id === Number(product.id));

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push(toCartItem(product, qty));
  }

  saveCart();
  updateCartUI();
  showToast(`"${displayName(product.name || product.nom)}" ajouté au panier 🛍️`);
}

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if ($('cart-count')) $('cart-count').textContent = count;
  if ($('cart-total')) $('cart-total').textContent = formatPrice(total);

  renderCartItems();
}

function renderCartItems() {
  const list = $('cart-items');
  if (!list) return;

  if (!cart.length) {
    list.innerHTML = '<li class="cart-empty">Votre panier est vide.</li>';
    return;
  }

  list.innerHTML = cart.map((item) => `
    <li class="cart-item">
      ${item.image ? `<img class="cart-item-thumb" src="${escHtml(item.image)}" alt="${escHtml(item.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><span class="cart-item-icon" aria-hidden="true" style="display:none">${escHtml(item.icon || '🛍️')}</span>` : `<span class="cart-item-icon" aria-hidden="true">${escHtml(item.icon || '🛍️')}</span>`}
      <div>
        <p class="cart-item-name">${escHtml(item.name)}</p>
        <p class="cart-item-qty">Qté : ${item.qty}</p>
      </div>
      <span class="cart-item-price">${formatPrice(item.price * item.qty)}</span>
    </li>
  `).join('');
}

function openCart() {
  if (!$('cart-sidebar') || !$('cart-overlay')) return;
  $('cart-sidebar').classList.add('open');
  $('cart-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  if (!$('cart-sidebar') || !$('cart-overlay')) return;
  $('cart-sidebar').classList.remove('open');
  $('cart-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

function navigateToProduct(productId) {
  window.location.href = `produit.html?id=${Number(productId)}`;
}

function bindGridInteractions() {
  ['products-grid', 'products-grid-femmes', 'products-grid-hommes'].forEach((gridId) => {
    const grid = $(gridId);
    if (!grid) return;

    grid.addEventListener('click', (e) => {
      const addButton = e.target.closest('.btn-add');
      if (addButton) {
        e.preventDefault();
        e.stopPropagation();
        addToCart(Number(addButton.dataset.id));
        return;
      }

      const card = e.target.closest('.product-card[data-id]');
      if (!card) return;
      navigateToProduct(card.dataset.id);
    });

    grid.addEventListener('keydown', (e) => {
      const card = e.target.closest('.product-card[data-id]');
      if (!card) return;
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      navigateToProduct(card.dataset.id);
    });
  });
}

function bindFilterControls() {
  document.querySelectorAll('.tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((tab) => tab.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.filter || 'all');
    });
  });

  document.querySelectorAll('.category-card[data-filter]').forEach((card) => {
    card.addEventListener('click', () => {
      const filter = card.dataset.filter || 'all';
      document.querySelectorAll('.tab').forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.filter === filter);
      });
      renderProducts(filter);
    });
  });

  document.querySelectorAll('.main-nav a[data-filter]').forEach((link) => {
    link.addEventListener('click', () => {
      const filter = link.dataset.filter || 'all';
      document.querySelectorAll('.tab').forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.filter === filter);
      });
      renderProducts(filter);
    });
  });
}

let toastTimer;
function showToast(message) {
  const toast = $('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function initStaticUiBindings() {
  if ($('btn-cart')) $('btn-cart').addEventListener('click', openCart);
  if ($('btn-close-cart')) $('btn-close-cart').addEventListener('click', closeCart);
  if ($('cart-overlay')) $('cart-overlay').addEventListener('click', closeCart);

  if ($('btn-checkout')) {
    $('btn-checkout').addEventListener('click', () => {
      if (!cart.length) {
        showToast('Votre panier est vide !');
        return;
      }
      localStorage.setItem('yass_checkout_cart', JSON.stringify(cart));
      window.location.href = 'commande.html';
    });
  }

  if ($('hamburger') && $('main-nav')) {
    $('hamburger').addEventListener('click', () => {
      $('main-nav').classList.toggle('open');
    });
  }

  document.querySelectorAll('.main-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      if ($('main-nav')) $('main-nav').classList.remove('open');
    });
  });

  if ($('contact-form') && $('form-msg')) {
    $('contact-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const msg = $('form-msg');

      if (!form.nom.value.trim() || !form.email.value.trim() || !form.message.value.trim()) {
        msg.textContent = 'Veuillez remplir tous les champs.';
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.value)) {
        msg.textContent = 'Veuillez entrer une adresse email valide.';
        return;
      }

      const subject = encodeURIComponent('Message depuis YASS Parfums');
      const body = encodeURIComponent(
        `Nom : ${form.nom.value.trim()}\nEmail : ${form.email.value.trim()}\n\nMessage :\n${form.message.value.trim()}`
      );
      window.location.href = `mailto:ada9091@gmail.com?subject=${subject}&body=${body}`;

      msg.textContent = 'Votre client mail s\'ouvre pour envoyer le message. ✅';
      form.reset();
    });
  }

  if ($('year')) $('year').textContent = new Date().getFullYear();
}

function init() {
  window.YassStorefront = {
    addToCart,
    formatPrice,
    escHtml,
    displayName,
    categoryLabel,
    genderLabel,
    openCart,
    closeCart
  };

  initStaticUiBindings();
  bindGridInteractions();
  bindFilterControls();
  updateCartUI();

  if ($('products-grid')) {
    loadProductsFromApi();
  }
}

init();
