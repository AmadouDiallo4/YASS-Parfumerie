/* YASS Parfums – script.js */

// ===== Product Data =====
const products = [
  // Parfums Femmes
  { id: 1,  name: "Rose Éternelle",      category: "parfum", gender: "femme",  icon: "🌹", price: 49.90, desc: "Eau de parfum florale, notes de rose et musc blanc. 50 ml.",       image: "images/femmes/rose-eternelle.jpg" },
  { id: 4,  name: "Nuit de Jasmin",      category: "parfum", gender: "femme",  icon: "🌙", price: 55.00, desc: "Notes de jasmin, vanille et cèdre. 50 ml.",                        image: "images/femmes/nuit-de-jasmin.jpg" },
  { id: 16, name: "Fleur d'Oranger",     category: "parfum", gender: "femme",  icon: "🌼", price: 45.00, desc: "Fraîcheur florale, fleur d'oranger et bergamote. 50 ml.",          image: "images/femmes/fleur-oranger.jpg" },
  { id: 17, name: "Velours Rose",        category: "parfum", gender: "femme",  icon: "🌸", price: 52.90, desc: "Bouquet de roses et notes poudrées, féminité absolue. 50 ml.",     image: "images/femmes/velours-rose.jpg" },
  { id: 18, name: "Douce Vanille",       category: "parfum", gender: "femme",  icon: "🍦", price: 48.00, desc: "Gourmand et envoûtant, vanille crémeuse et musc doux. 50 ml.",     image: "images/femmes/douce-vanille.jpg" },
  { id: 19, name: "Pétale de Soie",      category: "parfum", gender: "femme",  icon: "🎀", price: 59.90, desc: "Soie florale, pivoine et bois de cèdre blanc. 75 ml.",             image: "images/femmes/petale-soie.jpg" },

  // Parfums Hommes
  { id: 2,  name: "Oud Prestige",        category: "parfum", gender: "homme",  icon: "🏺", price: 69.90, desc: "Parfum oriental intense, oud et bois de santal. 50 ml.",           image: "images/hommes/oud-prestige.jpg" },
  { id: 3,  name: "Fraîcheur Aqua",      category: "parfum", gender: "homme",  icon: "💧", price: 39.90, desc: "Eau de cologne légère, agrumes et menthe. 100 ml.",                image: "images/hommes/fraicheur-aqua.jpg" },
  { id: 5,  name: "Velvet Wood",         category: "parfum", gender: "homme",  icon: "🌲", price: 59.90, desc: "Boisé et chaleureux, idéal pour l'automne. 50 ml.",                image: "images/hommes/velvet-wood.jpg" },
  { id: 20, name: "Black Intense",       category: "parfum", gender: "homme",  icon: "🖤", price: 64.90, desc: "Cuir, poivre noir et ambre, élégance masculine. 50 ml.",           image: "images/hommes/black-intense.jpg" },
  { id: 21, name: "Brise Marine",        category: "parfum", gender: "homme",  icon: "⛵", price: 44.90, desc: "Aquatique et frais, sel marin et vétiver. 100 ml.",                image: "images/hommes/brise-marine.jpg" },
  { id: 22, name: "Cèdre & Tabac",       category: "parfum", gender: "homme",  icon: "🥃", price: 72.00, desc: "Notes de cèdre, tabac blond et fève tonka. 50 ml.",                image: "images/hommes/cedre-tabac.jpg" },

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
  return n.toFixed(2).replace(".", ",") + " €";
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
