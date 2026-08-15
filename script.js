// YASS Parfumerie — script.js

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');

function highlightNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const sTop = section.offsetTop;
    const sHeight = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= sTop && scrollY < sTop + sHeight) {
      navLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`nav a[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}

window.addEventListener('scroll', highlightNav);

// Smooth image load fallback (already handled inline via onerror)
// Add active class styling via CSS if needed
document.head.insertAdjacentHTML('beforeend', `<style>
  nav ul li a.active {
    background: var(--gold);
    color: #1a1a2e;
  }
</style>`);
/* YASS Parfums – script.js */

// ===== Product Data =====
const products = [
  // Parfums Femmes
  { id: 1,  name: "AFTER HOURS",       category: "parfum", gender: "femme", icon: "🌙", price: 30000, desc: "Parfum femme envoûtant, idéal pour les soirées.",          image: "images/femmes/AFTER_HOURS.jpeg" },
  { id: 4,  name: "NANUKA",            category: "parfum", gender: "femme", icon: "🌸", price: 30000, desc: "Fragrance florale et douce, féminité naturelle.",           image: "images/femmes/NANUKA.jpeg" },
  { id: 16, name: "BELLAYA",           category: "parfum", gender: "femme", icon: "🌺", price: 30000, desc: "Élégance et douceur, bouquet de fleurs précieuses.",        image: "images/femmes/BELLAYA.jpeg" },
  { id: 17, name: "DRAGUEE BLANC",     category: "parfum", gender: "femme", icon: "🤍", price: 30000, desc: "Notes poudrées et sucrées, légèreté absolue.",              image: "images/femmes/DRAGUEE_BLANC.jpeg" },
  { id: 18, name: "FELICIA",           category: "parfum", gender: "femme", icon: "💐", price: 20000, desc: "Fraîcheur florale, pétales de rose et musc délicat.",       image: "images/femmes/FELICIA.jpeg" },
  { id: 19, name: "GOLDEN SMOOTHIE",   category: "parfum", gender: "femme", icon: "✨", price: 30000, desc: "Gourmand et lumineux, notes dorées et vanillées.",           image: "images/femmes/GOLDEN_SMOOTHIE.jpeg" },
  { id: 23, name: "MUSC BLANC",        category: "parfum", gender: "femme", icon: "🕊️", price: 20000, desc: "Musc blanc pur, douceur et sensualité raffinée.",           image: "images/femmes/MUSC_BLANC.jpeg" },
  { id: 24, name: "MUSC BLANC 1",      category: "parfum", gender: "femme", icon: "☁️", price: 20000, desc: "Variante du musc blanc, légèreté et fraîcheur.",            image: "images/femmes/MUSC_BLANC1.jpeg" },
  { id: 25, name: "VENUM",             category: "parfum", gender: "femme", icon: "💜", price: 20000, desc: "Intense et mystérieux, sillage envoûtant et durable.",       image: "images/femmes/VENUM.jpeg" },

  // Parfums Hommes
  { id: 2,  name: "AFRICAN LEGEND",    category: "parfum", gender: "homme", icon: "🏺", price: 30000, desc: "Fragrance boisée et épicée, puissance et caractère.",       image: "images/hommes/AFRICAN_LEGEND.jpeg" },
  { id: 3,  name: "ALBI",              category: "parfum", gender: "homme", icon: "🌲", price: 30000, desc: "Boisé et frais, élégance masculine affirmée.",               image: "images/hommes/ALBI.jpeg" },
  { id: 5,  name: "BIANCO",            category: "parfum", gender: "homme", icon: "🤍", price: 20000, desc: "Fraîcheur aquatique et notes blanches, modernité.",          image: "images/hommes/BIANCO.jpeg" },
  { id: 20, name: "BOIIS INTENSE 2004",category: "parfum", gender: "homme", icon: "🪵", price: 20000, desc: "Oud intense et bois sombre, signature envoûtante.",          image: "images/hommes/BOIIS_INTENSE_2004.jpeg" },
  { id: 21, name: "CREAMY LOVE",       category: "parfum", gender: "homme", icon: "🧡", price: 30000, desc: "Doux et crémeux, alliance boisée et gourmande.",             image: "images/hommes/CREAMY_LOVE.jpeg" },
  { id: 22, name: "FLOWER BOUQUET",    category: "parfum", gender: "homme", icon: "💐", price: 20000, desc: "Bouquet floral masculin, fraîcheur et légèreté.",            image: "images/hommes/FLOWER_BOUQUET.jpeg" },
  { id: 26, name: "GHOST OUD",         category: "parfum", gender: "homme", icon: "👻", price: 30000, desc: "Oud mystérieux et fumé, présence imposante.",                image: "images/hommes/GHOST_OUD.jpeg" },
  { id: 27, name: "KRYPTON",           category: "parfum", gender: "homme", icon: "⚡", price: 20000, desc: "Explosif et électrisant, énergie et dynamisme.",             image: "images/hommes/KRYPTON.jpeg" },
  { id: 28, name: "SKIN OF OUD",       category: "parfum", gender: "homme", icon: "🥇", price: 20000, desc: "Oud sur peau, chaleur et intimité naturelle.",               image: "images/hommes/SKIN_OF_OUD.jpeg" },
  { id: 29, name: "VERTIGO",           category: "parfum", gender: "homme", icon: "🌀", price: 30000, desc: "Tourbillon de sensations, profondeur et intensité.",         image: "images/hommes/VERTIGO.jpeg" },

  // Savons
  { id: 6,  name: "Savon Lavande",       category: "savon",  gender: "mixte",  icon: "💜", price: 6.90,  desc: "Savon artisanal à la lavande et huile d'argan. 100 g.",            image: "images/savon-lavande.jpg" },
  { id: 7,  name: "Savon Karité",        category: "savon",  gender: "mixte",  icon: "🧼", price: 7.50,  desc: "Beurre de karité pur, hydratation intense. 100 g.",                image: "images/savon-karite.jpg" },
  { id: 8,  name: "Savon Charbon Actif", category: "savon",  gender: "mixte",  icon: "⚫", price: 8.20,  desc: "Purifiant et détoxifiant, peau nette. 100 g.",                     image: "images/savon-charbon.jpg" },
  { id: 9,  name: "Savon Rose & Miel",   category: "savon",  gender: "mixte",  icon: "🌸", price: 7.90,  desc: "Douceur et éclat, formule nourrissante. 100 g.",                   image: "images/savon-rose-miel.jpg" },

  // Dentifrices
  { id: 10, name: "Dentifrice Charbon",       category: "dentifrice", gender: "mixte", icon: "🦷", price: 8.90, desc: "Blanchiment naturel au charbon actif. 75 ml.",              image: "images/dentifrice-charbon.jpg" },
  { id: 11, name: "Dentifrice Menthe Forte",  category: "dentifrice", gender: "mixte", icon: "🌿", price: 5.90, desc: "Fraîcheur longue durée, formule fluorée. 75 ml.",           image: "images/dentifrice-menthe.jpg" },
  { id: 12, name: "Dentifrice Argile Blanche",category: "dentifrice", gender: "mixte", icon: "🏔️", price: 9.50, desc: "Soin des gencives à l'argile pure. 60 ml.",                image: "images/dentifrice-argile.jpg" },

  // Déodorants
  { id: 13, name: "Déo Fleur de Coton",  category: "deodorant", gender: "mixte", icon: "🌼", price: 9.90,  desc: "Fraîcheur 48 h, sans sels d'aluminium. 150 ml.",                image: "images/deo-coton.jpg" },
  { id: 14, name: "Déo Bois & Musc",     category: "deodorant", gender: "mixte", icon: "🌳", price: 10.50, desc: "Boisé et subtil, confort toute la journée. 150 ml.",             image: "images/deo-bois-musc.jpg" },
  { id: 15, name: "Déo Aloe Vera",       category: "deodorant", gender: "mixte", icon: "🌱", price: 9.00,  desc: "Douceur de l'aloe vera, peau sensible. 150 ml.",                 image: "images/deo-aloe.jpg" },
];

// ===== Cart State =====
let cart = [];

// ===== DOM Helpers =====
const $ = (id) => document.getElementById(id);

// ===== Render Products =====
function renderProducts(filter = "all") {
  const grid = $("products-grid");
  grid.innerHTML = "";

  let filtered;
  if (filter === "all") {
    filtered = products;
  } else if (filter === "femme" || filter === "homme") {
    filtered = products.filter(p => p.gender === filter);
  } else {
    filtered = products.filter(p => p.category === filter);
  }

  filtered.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.id = product.id;
    const imgHtml = product.image
      ? `<img class="product-img-photo" src="${escHtml(product.image)}" alt="${escHtml(product.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="product-img product-img-fallback" aria-hidden="true" style="display:none">${escHtml(product.icon)}</div>`
      : `<div class="product-img" aria-hidden="true">${escHtml(product.icon)}</div>`;
    card.innerHTML = `
      <div class="product-img-wrapper">${imgHtml}</div>
      <div class="product-info">
        <span class="product-badge">${categoryLabel(product.category)}</span>
        ${product.gender !== "mixte" ? `<span class="product-gender gender-${escHtml(product.gender)}">${genderLabel(product.gender)}</span>` : ""}
        <h3>${escHtml(product.name)}</h3>
        <p class="product-desc">${escHtml(product.desc)}</p>
        <p class="product-price">${formatPrice(product.price)}</p>
        <button class="btn-add" data-id="${product.id}" aria-label="Ajouter ${escHtml(product.name)} au panier">
          + Ajouter au panier
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function categoryLabel(cat) {
  const map = { parfum: "Parfum", savon: "Savon", dentifrice: "Dentifrice", deodorant: "Déodorant" };
  return map[cat] || cat;
}

function genderLabel(gender) {
  const map = { femme: "Femme", homme: "Homme" };
  return map[gender] || gender;
}

function formatPrice(n) {
  return n.toLocaleString("fr-FR") + " CFA";
}

function escHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ===== Render Gender-specific Grid =====
function renderGenderGrid(gender, gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = "";
  const filtered = products.filter(p => p.gender === gender);
  filtered.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.id = product.id;
    const imgHtml = product.image
      ? `<img class="product-img-photo" src="${escHtml(product.image)}" alt="${escHtml(product.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="product-img product-img-fallback" aria-hidden="true" style="display:none">${escHtml(product.icon)}</div>`
      : `<div class="product-img" aria-hidden="true">${escHtml(product.icon)}</div>`;
    card.innerHTML = `
      <div class="product-img-wrapper">${imgHtml}</div>
      <div class="product-info">
        <span class="product-badge">${categoryLabel(product.category)}</span>
        <h3>${escHtml(product.name)}</h3>
        <p class="product-desc">${escHtml(product.desc)}</p>
        <p class="product-price">${formatPrice(product.price)}</p>
        <button class="btn-add" data-id="${product.id}" aria-label="Ajouter ${escHtml(product.name)} au panier">
          + Ajouter au panier
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ===== Filter Tabs =====
document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.filter);
  });
});

// ===== Cart Logic =====
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  showToast(`"${product.name}" ajouté au panier 🛍️`);
}

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  $("cart-count").textContent = count;

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  $("cart-total").textContent = formatPrice(total);

  renderCartItems();
}

function renderCartItems() {
  const list = $("cart-items");
  list.innerHTML = "";

  if (cart.length === 0) {
    list.innerHTML = '<li class="cart-empty">Votre panier est vide.</li>';
    return;
  }

  cart.forEach(item => {
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <span class="cart-item-icon" aria-hidden="true">${item.icon}</span>
      <div>
        <p class="cart-item-name">${escHtml(item.name)}</p>
        <p class="cart-item-qty">Qté : ${item.qty}</p>
      </div>
      <span class="cart-item-price">${formatPrice(item.price * item.qty)}</span>
    `;
    list.appendChild(li);
  });
}

// ===== Cart Sidebar Toggle =====
function openCart() {
  $("cart-sidebar").classList.add("open");
  $("cart-overlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  $("cart-sidebar").classList.remove("open");
  $("cart-overlay").classList.remove("active");
  document.body.style.overflow = "";
}

$("btn-cart").addEventListener("click", openCart);
$("btn-close-cart").addEventListener("click", closeCart);
$("cart-overlay").addEventListener("click", closeCart);

$("btn-checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("Votre panier est vide !");
    return;
  }
  // Placeholder checkout action
  alert("Merci pour votre commande ! La fonctionnalité de paiement sera bientôt disponible.");
});

// ===== Delegate Add-to-Cart Clicks =====
["products-grid", "products-grid-femmes", "products-grid-hommes"].forEach(gridId => {
  const el = document.getElementById(gridId);
  if (el) {
    el.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-add");
      if (!btn) return;
      addToCart(Number(btn.dataset.id));
    });
  }
});

// ===== Toast =====
let toastTimer;
function showToast(msg) {
  const toast = $("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

// ===== Hamburger Menu =====
$("hamburger").addEventListener("click", () => {
  $("main-nav").classList.toggle("open");
});

// Close mobile nav on link click
document.querySelectorAll(".main-nav a").forEach(link => {
  link.addEventListener("click", () => $("main-nav").classList.remove("open"));
});

// ===== Contact Form =====
$("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const msg = $("form-msg");

  if (!form.nom.value.trim() || !form.email.value.trim() || !form.message.value.trim()) {
    msg.textContent = "Veuillez remplir tous les champs.";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email.value)) {
    msg.textContent = "Veuillez entrer une adresse email valide.";
    return;
  }

  msg.textContent = "Message envoyé ! Nous vous répondrons très bientôt. ✅";
  form.reset();
});

// ===== Footer Year =====
$("year").textContent = new Date().getFullYear();

// ===== Init =====
renderProducts();
renderGenderGrid("femme", "products-grid-femmes");
renderGenderGrid("homme", "products-grid-hommes");
renderCartItems();
