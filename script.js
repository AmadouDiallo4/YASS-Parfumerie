/* YASS Parfums – script.js */

// ===== Product Data =====
const products = [
  // Parfums / femmes
  { id: 1,  name: "AFTER HOURS",        category: "parfum", subCategory: "femmes", gender: "femme", icon: "🌙", price: 30000, desc: "Parfum femme envoûtant, idéal pour les soirées.", image: "images/femmes/AFTER_HOURS.jpeg" },
  { id: 4,  name: "NANUKA",             category: "parfum", subCategory: "femmes", gender: "femme", icon: "🌸", price: 30000, desc: "Fragrance florale et douce, féminité naturelle.", image: "images/femmes/NANUKA.jpeg" },
  { id: 16, name: "BELLAYA",            category: "parfum", subCategory: "femmes", gender: "femme", icon: "🌺", price: 30000, desc: "Élégance et douceur, bouquet de fleurs précieuses.", image: "images/femmes/BELLAYA.jpeg" },
  { id: 17, name: "DRAGUEE BLANC",      category: "parfum", subCategory: "femmes", gender: "femme", icon: "🤍", price: 30000, desc: "Notes poudrées et sucrées, légèreté absolue.", image: "images/femmes/DRAGUEE_BLANC.jpeg" },
  { id: 18, name: "FELICIA",            category: "parfum", subCategory: "femmes", gender: "femme", icon: "💐", price: 20000, desc: "Fraîcheur florale, pétales de rose et musc délicat.", image: "images/femmes/FELICIA.jpeg" },
  { id: 19, name: "GOLDEN SMOOTHIE",    category: "parfum", subCategory: "femmes", gender: "femme", icon: "✨", price: 30000, desc: "Gourmand et lumineux, notes dorées et vanillées.", image: "images/femmes/GOLDEN_SMOOTHIE.jpeg" },
  { id: 23, name: "MUSC BLANC",         category: "parfum", subCategory: "femmes", gender: "femme", icon: "🕊️", price: 20000, desc: "Musc blanc pur, douceur et sensualité raffinée.", image: "images/femmes/MUSC_BLANC.jpeg" },
  { id: 24, name: "MUSC BLANC 1",       category: "parfum", subCategory: "femmes", gender: "femme", icon: "☁️", price: 20000, desc: "Variante du musc blanc, légèreté et fraîcheur.", image: "images/femmes/MUSC_BLANC1.jpeg" },
  { id: 25, name: "VENUM",              category: "parfum", subCategory: "femmes", gender: "femme", icon: "💜", price: 20000, desc: "Intense et mystérieux, sillage envoûtant et durable.", image: "images/femmes/VENUM.jpeg" },

  // Parfums / hommes
  { id: 2,  name: "AFRICAN LEGEND",     category: "parfum", subCategory: "hommes", gender: "homme", icon: "🏺", price: 30000, desc: "Fragrance boisée et épicée, puissance et caractère.", image: "images/hommes/AFRICAN_LEGEND.jpeg" },
  { id: 3,  name: "ALBI",               category: "parfum", subCategory: "hommes", gender: "homme", icon: "🌲", price: 30000, desc: "Boisé et frais, élégance masculine affirmée.", image: "images/hommes/ALBI.jpeg" },
  { id: 5,  name: "BIANCO",             category: "parfum", subCategory: "hommes", gender: "homme", icon: "🤍", price: 20000, desc: "Fraîcheur aquatique et notes blanches, modernité.", image: "images/hommes/BIANCO.jpeg" },
  { id: 20, name: "BOIIS INTENSE 2004", category: "parfum", subCategory: "hommes", gender: "homme", icon: "🪵", price: 20000, desc: "Oud intense et bois sombre, signature envoûtante.", image: "images/hommes/BOIIS_INTENSE_2004.jpeg" },
  { id: 21, name: "CREAMY LOVE",        category: "parfum", subCategory: "hommes", gender: "homme", icon: "🧡", price: 30000, desc: "Doux et crémeux, alliance boisée et gourmande.", image: "images/hommes/CREAMY_LOVE.jpeg" },
  { id: 22, name: "FLOWER BOUQUET",     category: "parfum", subCategory: "hommes", gender: "homme", icon: "💐", price: 20000, desc: "Bouquet floral masculin, fraîcheur et légèreté.", image: "images/hommes/FLOWER_BOUQUET.jpeg" },
  { id: 26, name: "GHOST OUD",          category: "parfum", subCategory: "hommes", gender: "homme", icon: "👻", price: 30000, desc: "Oud mystérieux et fumé, présence imposante.", image: "images/hommes/GHOST_OUD.jpeg" },
  { id: 27, name: "KRYPTON",            category: "parfum", subCategory: "hommes", gender: "homme", icon: "⚡", price: 20000, desc: "Explosif et électrisant, énergie et dynamisme.", image: "images/hommes/KRYPTON.jpeg" },
  { id: 28, name: "SKIN OF OUD",        category: "parfum", subCategory: "hommes", gender: "homme", icon: "🥇", price: 20000, desc: "Oud sur peau, chaleur et intimité naturelle.", image: "images/hommes/SKIN_OF_OUD.jpeg" },
  { id: 29, name: "VERTIGO",            category: "parfum", subCategory: "hommes", gender: "homme", icon: "🌀", price: 30000, desc: "Tourbillon de sensations, profondeur et intensité.", image: "images/hommes/VERTIGO.jpeg" },

  // Parfums / brumes
  { id: 43, name: "BARBE_A_PAPA",       category: "parfum", subCategory: "brumes", gender: "mixte", icon: "🍭", price: 16000, desc: "Brume sucrée et réconfortante.", image: "images/brumes/BARBE_A_PAPA.jpeg" },
  { id: 44, name: "BRUME_BELLISSIMA",   category: "parfum", subCategory: "brumes", gender: "mixte", icon: "🌸", price: 16000, desc: "Brume fraîche et élégante pour le quotidien.", image: "images/brumes/BRUME_BELLISSIMA.jpeg" },
  { id: 45, name: "CARAIBE_COCO",       category: "parfum", subCategory: "brumes", gender: "mixte", icon: "🥥", price: 16000, desc: "Brume exotique aux notes coco.", image: "images/brumes/CARAIBE_COCO.jpeg" },
  { id: 46, name: "CATALIYA",           category: "parfum", subCategory: "brumes", gender: "mixte", icon: "🌺", price: 16000, desc: "Brume florale douce et lumineuse.", image: "images/brumes/CATALIYA.jpeg" },
  { id: 47, name: "NUAGE_SUCRE",        category: "parfum", subCategory: "brumes", gender: "mixte", icon: "☁️", price: 16000, desc: "Brume légère aux accords gourmands.", image: "images/brumes/NUAGE_SUCRE.jpeg" },
  { id: 48, name: "SWEET_CANDY",        category: "parfum", subCategory: "brumes", gender: "mixte", icon: "🍬", price: 16000, desc: "Brume sucrée, fraîche et pétillante.", image: "images/brumes/SWEET_CANDY.jpeg" },

  // Parfums / musc
  { id: 49, name: "MUSC_TAHARA_BOIS_MONTAIGNE", category: "parfum", subCategory: "musc", gender: "mixte", icon: "🪵", price: 20000, desc: "Musc boisé raffiné.", image: "images/musc/MUSC_TAHARA_BOIS_MONTAIGNE.jpeg" },
  { id: 50, name: "MUSC_TAHARA_PEACH",          category: "parfum", subCategory: "musc", gender: "mixte", icon: "🍑", price: 20000, desc: "Musc fruité aux notes de pêche.", image: "images/musc/MUSC_TAHARA_PEACH.jpeg" },
  { id: 51, name: "TAHARA_A_PAPA",              category: "parfum", subCategory: "musc", gender: "mixte", icon: "🍭", price: 20000, desc: "Musc gourmand inspiré de la barbe à papa.", image: "images/musc/TAHARA_A_PAPA.jpeg" },
  { id: 52, name: "TAHARA_JUST_OUD",            category: "parfum", subCategory: "musc", gender: "mixte", icon: "🖤", price: 20000, desc: "Musc intense et profond aux notes oud.", image: "images/musc/TAHARA_JUST_OUD.jpeg" },
  { id: 53, name: "TAHARA_NATUREL",             category: "parfum", subCategory: "musc", gender: "mixte", icon: "🌿", price: 20000, desc: "Musc pur et naturel.", image: "images/musc/TAHARA_NATUREL.jpeg" },
  { id: 54, name: "TAHARA_PINEAPPLE",           category: "parfum", subCategory: "musc", gender: "mixte", icon: "🍍", price: 20000, desc: "Musc fruité aux notes d’ananas.", image: "images/musc/TAHARA_PINEAPPLE.jpeg" },
  { id: 55, name: "TAHARA_ROSE_BONBON",         category: "parfum", subCategory: "musc", gender: "mixte", icon: "🌹", price: 20000, desc: "Musc floral et sucré, rose bonbon.", image: "images/musc/TAHARA_ROSE_BONBON.jpeg" },
  { id: 56, name: "TAHARA_ROUGE_ABSOLU",        category: "parfum", subCategory: "musc", gender: "mixte", icon: "❤️", price: 20000, desc: "Musc riche et sensuel.", image: "images/musc/TAHARA_ROUGE_ABSOLU.jpeg" },

  // Parfums / huiles parfumées
  { id: 36, name: "HUILES_PARFUMEES_FEMME", category: "parfum", subCategory: "huiles_parfumees", gender: "femme", icon: "🌺", price: 18000, desc: "Collection d’huiles parfumées dédiée aux senteurs féminines.", image: "" },
  { id: 38, name: "HUILES_PARFUMEES_HOMME", category: "parfum", subCategory: "huiles_parfumees", gender: "homme", icon: "🪔", price: 18000, desc: "Huiles parfumées aux notes intenses pour homme.", image: "" },

  // Cosmétiques
  { id: 6,  name: "CREME_NIVEA",              category: "cosmetique", subCategory: "creme",                gender: "mixte", icon: "🫙", price: 2000, desc: "Crème Nivea.", image: "images/cosmetiques/CREME_NIVEA.jpeg" },
  { id: 7,  name: "CREME_SOIN_CIEN",          category: "cosmetique", subCategory: "creme",                gender: "mixte", icon: "🧴", price: 2000, desc: "Crème soin Cien.", image: "images/cosmetiques/CREME_SOIN_CIEN.jpeg" },
  { id: 8,  name: "DENTALUX_FRAICHE",         category: "cosmetique", subCategory: "dentifrice",           gender: "mixte", icon: "🦷", price: 1500, desc: "Dentalux fraîche.", image: "images/cosmetiques/DENTALUX_FRAICHE.jpeg" },
  { id: 9,  name: "DEO_CIEN",                 category: "cosmetique", subCategory: "deodorant",            gender: "mixte", icon: "🌿", price: 2000, desc: "Déodorant Cien classique.", image: "images/cosmetiques/Deo_cien.jpeg" },
  { id: 10, name: "DEO_NARTA",                category: "cosmetique", subCategory: "deodorant",            gender: "mixte", icon: "🌿", price: 2500, desc: "Déodorant Narta.", image: "images/cosmetiques/Deo_Narta.jpeg" },
  { id: 11, name: "DEO_NARTA_PURE_EFFICACE",  category: "cosmetique", subCategory: "deodorant",            gender: "mixte", icon: "🌿", price: 2500, desc: "Déodorant Narta Pure Efficace.", image: "images/cosmetiques/Deo_Narta_Pure_efficace.jpeg" },
  { id: 12, name: "DEO_NIVEA",                category: "cosmetique", subCategory: "deodorant",            gender: "mixte", icon: "🌿", price: 2000, desc: "Déodorant Nivea.", image: "images/cosmetiques/Deo_Nivea.jpeg" },
  { id: 13, name: "DEODORANT_CIEN",           category: "cosmetique", subCategory: "deodorant",            gender: "mixte", icon: "🌿", price: 2000, desc: "Déodorant Cien format déodorant.", image: "images/cosmetiques/DEODORANT_CIEN.jpeg" },
  { id: 14, name: "HUILES_CURCUMA",           category: "cosmetique", subCategory: "huile",                gender: "mixte", icon: "✨", price: 2000, desc: "Huile de curcuma.", image: "images/cosmetiques/HUILE_CURCUMA.jpeg" },
  { id: 15, name: "HUILES_D'ARGAN_BIO",       category: "cosmetique", subCategory: "huile",                gender: "mixte", icon: "✨", price: 2000, desc: "Huile d'argan bio.", image: "images/cosmetiques/HUILE_DARGAN_BIO.jpeg" },
  { id: 30, name: "HUILE_NIGELE",             category: "cosmetique", subCategory: "huile",                gender: "mixte", icon: "✨", price: 2000, desc: "Huile de nigelle.", image: "images/cosmetiques/HUILE_NIGELE.jpeg" },
  { id: 31, name: "NARTA",                    category: "cosmetique", subCategory: "narta",                gender: "mixte", icon: "🧴", price: 2500, desc: "Narta.", image: "images/cosmetiques/NARTA.jpeg" },
  { id: 32, name: "NARTA_PURE_EFFICACE",      category: "cosmetique", subCategory: "narta_pure_efficace",  gender: "mixte", icon: "🧴", price: 2500, desc: "Narta Pure Efficace.", image: "images/cosmetiques/NARTA_PURE_EFFICACE.jpeg" },
  { id: 33, name: "PROBAC_SAVON_AU_SOUFRE",   category: "cosmetique", subCategory: "savon",                gender: "mixte", icon: "🧼", price: 1000, desc: "Savon Probac au soufre.", image: "images/cosmetiques/PROBAC_SAVON_AU_SOUFRE.jpeg" },
  { id: 34, name: "SANEX_SKINPROTEC",         category: "cosmetique", subCategory: "savon",                gender: "mixte", icon: "🧼", price: 2000, desc: "Sanex Skinprotec.", image: "images/cosmetiques/Sanex_Skinprotec.jpeg" },
  { id: 35, name: "SAVON_CIEN",               category: "cosmetique", subCategory: "savon",                gender: "mixte", icon: "🧼", price: 1000, desc: "Savon Cien.", image: "images/cosmetiques/SAVON_CIEN.jpeg" },
  { id: 37, name: "SAVON_DOVE",               category: "cosmetique", subCategory: "savon",                gender: "mixte", icon: "🧼", price: 1000, desc: "Savon Dove.", image: "images/cosmetiques/Savon_DOVE.jpeg" },
  { id: 39, name: "SAVON_OLIVE_CIEN",         category: "cosmetique", subCategory: "savon",                gender: "mixte", icon: "🧼", price: 1000, desc: "Savon Olive Cien.", image: "images/cosmetiques/Savon_Olive_Cien.jpeg" },
  { id: 40, name: "SAVON_PROBAC_FRAICHE",     category: "cosmetique", subCategory: "savon",                gender: "mixte", icon: "🧼", price: 1000, desc: "Savon Probac Fraîche.", image: "images/cosmetiques/SAVON_PROBAC_FRAICHE.jpeg" },
  { id: 41, name: "SHAMPOING_SOLIDE",         category: "cosmetique", subCategory: "shampoing_solide",     gender: "mixte", icon: "🧴", price: 2000, desc: "Shampoing solide.", image: "images/cosmetiques/SHAMPOING_SOLIDE.jpeg" },
  { id: 42, name: "HUILE_OLIVE",              category: "cosmetique", subCategory: "huile",                gender: "mixte", icon: "✨", price: 2000, desc: "Huile d'olive.", image: "images/cosmetiques/HUILE_OLIVE.jpeg" },
  { id: 57, name: "HUILE_D'ARGAN",            category: "cosmetique", subCategory: "huile",                gender: "mixte", icon: "✨", price: 2000, desc: "Huile d'argan.", image: "images/cosmetiques/HUILE_DARGAN.jpeg" },
  { id: 58, name: "HUILE_D'AMANDE",           category: "cosmetique", subCategory: "huile",                gender: "mixte", icon: "✨", price: 1500, desc: "Huile d'amande.", image: "images/cosmetiques/HUILE_AMANDE.jpeg" },
  { id: 59, name: "HUILE_NIGELE_TABARAK",     category: "cosmetique", subCategory: "huile",                gender: "mixte", icon: "✨", price: 2000, desc: "Huile nigelle Tabarak.", image: "images/cosmetiques/HUILE_NIGEL_TABARAK.jpeg" },

  // Santé & bien-être
  { id: 60, name: "SLIM_TEA_HEMANI",          category: "sante-bien-etre", gender: "mixte", icon: "🍵", price: 3500,  desc: "Thé minceur Hemani, favorise le bien-être et la silhouette.", image: "images/sante_bien_etre/SLIM_TEA_HEMANI.jpeg" },
  { id: 63, name: "SUROP_FENUGREC",           category: "sante-bien-etre", gender: "mixte", icon: "🌿", price: 3000,  desc: "Sirop de fenugrec, tonifiant et naturel.", image: "images/sante_bien_etre/surop_fenugrec.jpeg" },
  { id: 64, name: "THIOURAYE 1",              category: "sante-bien-etre", gender: "mixte", icon: "🔥", price: 7000,  desc: "Thiouraye (encens) pour parfumer agréablement vos espaces.", image: "images/sante_bien_etre/THIOURAYE1.jpeg" },
  { id: 65, name: "THIOURAYE 2",              category: "sante-bien-etre", gender: "mixte", icon: "🔥", price: 7000,  desc: "Thiouraye (encens) pour parfumer agréablement vos espaces.", image: "images/sante_bien_etre/THIOURAYE2.jpeg" },
  { id: 66, name: "THIOURAYE 3",              category: "sante-bien-etre", gender: "mixte", icon: "🔥", price: 7000,  desc: "Thiouraye (encens) pour parfumer agréablement vos espaces.", image: "images/sante_bien_etre/THIOURAYE3.jpeg" },

  // Divers
  { id: 61, name: "Électronique",             category: "divers",          gender: "mixte", icon: "🔌", price: 25000, desc: "Petits articles électroniques disponibles en boutique.", image: "" },
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
    const readableName = displayName(product.name);
    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.id = product.id;
    const imgHtml = product.image
      ? `<img class="product-img-photo" src="${escHtml(product.image)}" alt="${escHtml(readableName)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="product-img product-img-fallback" aria-hidden="true" style="display:none">${escHtml(product.icon)}</div>`
      : `<div class="product-img" aria-hidden="true">${escHtml(product.icon)}</div>`;
    card.innerHTML = `
      <div class="product-img-wrapper">${imgHtml}</div>
      <div class="product-info">
        <span class="product-badge">${productCategoryLabel(product)}</span>
        ${product.gender !== "mixte" ? `<span class="product-gender gender-${escHtml(product.gender)}">${genderLabel(product.gender)}</span>` : ""}
        <h3>${escHtml(readableName)}</h3>
        <p class="product-desc">${escHtml(product.desc)}</p>
        <p class="product-price">${formatPrice(product.price)}</p>
        <button class="btn-add" data-id="${product.id}" aria-label="Ajouter ${escHtml(readableName)} au panier">
          + Ajouter au panier
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function categoryLabel(cat) {
  const map = {
    parfum: "Parfums",
    cosmetique: "Cosmétiques",
    "sante-bien-etre": "Santé & Bien-être",
    divers: "Divers",
  };
  return map[cat] || cat;
}

function subCategoryLabel(subCategory) {
  const map = {
    hommes: "Hommes",
    femmes: "Femmes",
    brumes: "Brumes",
    musc: "Musc",
    huiles_parfumees: "Huiles parfumées",
    savon: "Savon",
    creme: "Crème",
    deodorant: "Déodorant",
    huile: "Huile",
    narta: "Narta",
    narta_pure_efficace: "Narta Pure Efficace",
    shampoing_solide: "Shampoing solide",
    dentifrice: "Dentifrice",
  };
  return map[subCategory] || subCategory;
}

function productCategoryLabel(product) {
  if (!product.subCategory) return categoryLabel(product.category);
  return `${categoryLabel(product.category)} / ${subCategoryLabel(product.subCategory)}`;
}

function genderLabel(gender) {
  const map = { femme: "Femme", homme: "Homme" };
  return map[gender] || gender;
}

function formatPrice(n) {
  return n.toLocaleString("fr-FR") + " CFA";
}

function displayName(name) {
  return name.replace(/_/g, " ");
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
    const readableName = displayName(product.name);
    const card = document.createElement("article");
    card.className = "product-card";
    card.dataset.id = product.id;
    const imgHtml = product.image
      ? `<img class="product-img-photo" src="${escHtml(product.image)}" alt="${escHtml(readableName)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="product-img product-img-fallback" aria-hidden="true" style="display:none">${escHtml(product.icon)}</div>`
      : `<div class="product-img" aria-hidden="true">${escHtml(product.icon)}</div>`;
    card.innerHTML = `
      <div class="product-img-wrapper">${imgHtml}</div>
      <div class="product-info">
        <span class="product-badge">${productCategoryLabel(product)}</span>
        <h3>${escHtml(readableName)}</h3>
        <p class="product-desc">${escHtml(product.desc)}</p>
        <p class="product-price">${formatPrice(product.price)}</p>
        <button class="btn-add" data-id="${product.id}" aria-label="Ajouter ${escHtml(readableName)} au panier">
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
  showToast(`"${displayName(product.name)}" ajouté au panier 🛍️`);
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
        <p class="cart-item-name">${escHtml(displayName(item.name))}</p>
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
  openCheckout();
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

// ===== Checkout Modal =====
function openCheckout() {
  const lines = cart.map(item =>
    `• ${escHtml(displayName(item.name))} x${item.qty} — ${formatPrice(item.price * item.qty)}`
  ).join("\n");
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  $("checkout-summary").textContent = lines + `\n\nTotal : ${formatPrice(total)}`;
  $("checkout-modal").classList.add("open");
  $("checkout-overlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCheckout() {
  $("checkout-modal").classList.remove("open");
  $("checkout-overlay").classList.remove("active");
  document.body.style.overflow = "";
}

$("btn-close-checkout").addEventListener("click", closeCheckout);
$("checkout-overlay").addEventListener("click", closeCheckout);

$("checkout-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const msg = $("checkout-msg");

  const nom       = form.querySelector('[name="checkout-nom"]').value.trim();
  const prenom    = form.querySelector('[name="checkout-prenom"]').value.trim();
  const adresse   = form.querySelector('[name="checkout-adresse"]').value.trim();
  const telephone = form.querySelector('[name="checkout-telephone"]').value.trim();
  const email     = form.querySelector('[name="checkout-email"]').value.trim();
  const paiement  = form.querySelector('[name="checkout-paiement"]').value;

  if (!nom || !prenom || !adresse || !telephone || !paiement) {
    msg.textContent = "Veuillez remplir tous les champs obligatoires (*).";
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemLines = cart.map(item =>
    `  - ${displayName(item.name)} x${item.qty} : ${formatPrice(item.price * item.qty)}`
  ).join("\n");

  const subject = encodeURIComponent("Nouvelle commande YASS Parfums");
  const body = encodeURIComponent(
    `NOUVELLE COMMANDE\n\nClient :\nNom : ${nom}\nPrénom : ${prenom}\nAdresse/Ville : ${adresse}\nTéléphone : ${telephone}${email ? "\nEmail : " + email : ""}\n\nMoyen de paiement : ${paiement}\n\nProduits commandés :\n${itemLines}\n\nTotal : ${formatPrice(total)}`
  );
  window.location.href = `mailto:ada9091@gmail.com?subject=${subject}&body=${body}`;

  msg.textContent = "Votre client mail s'ouvre pour confirmer la commande. ✅";
  cart = [];
  updateCartUI();
  form.reset();
  setTimeout(closeCheckout, 2500);
});



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

  const subject = encodeURIComponent("Message depuis YASS Parfums");
  const body = encodeURIComponent(
    `Nom : ${form.nom.value.trim()}\nEmail : ${form.email.value.trim()}\n\nMessage :\n${form.message.value.trim()}`
  );
  window.location.href = `mailto:ada9091@gmail.com?subject=${subject}&body=${body}`;

  msg.textContent = "Votre client mail s'ouvre pour envoyer le message. ✅";
  form.reset();
});

// ===== Footer Year =====
$("year").textContent = new Date().getFullYear();

// ===== Init =====
renderProducts();
renderGenderGrid("femme", "products-grid-femmes");
renderGenderGrid("homme", "products-grid-hommes");
renderCartItems();
