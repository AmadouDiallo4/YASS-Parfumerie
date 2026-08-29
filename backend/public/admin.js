/* global */ 'use strict';

/* ============================================================
   YASS Admin — admin.js
   ============================================================ */

// ---- CONFIG ----
const API = '';          // same-origin: routes start with /api/

// ---- STATE ----
let token   = localStorage.getItem('yass_admin_token') || null;
let adminInfo = null;

let productPage = 1;
const PRODUCT_LIMIT = 12;
let productSearchTimer = null;

// ---- DOM helpers ----
const $ = (id) => document.getElementById(id);

function show(el)  { el.removeAttribute('hidden'); }
function hide(el)  { el.setAttribute('hidden', ''); }
function toggle(el, visible) { visible ? show(el) : hide(el); }

// ---- TOAST ----
let toastTimer = null;
function showToast(msg, type = 'success') {
  const t = $('toast');
  t.textContent = msg;
  t.className = `toast ${type}`;
  show(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => hide(t), 3500);
}

// ---- API FETCH ----
async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = json?.message || json?.error || `Erreur ${res.status}`;
    throw new Error(msg);
  }
  return json;
}

// ---- FORMAT ----
function fmtPrice(n) {
  return Number(n).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '\u00a0FCFA';
}
function fmtDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// ============================================================
//  NAVIGATION
// ============================================================
const SECTIONS = ['dashboard', 'products', 'categories', 'settings'];
const TITLES   = { dashboard: 'Dashboard', products: 'Produits', categories: 'Catégories', settings: 'Paramètres' };

function navigate(section) {
  SECTIONS.forEach((s) => {
    const sec = $('section' + s.charAt(0).toUpperCase() + s.slice(1));
    if (sec) sec.classList.toggle('active', s === section);
    const nav = document.querySelector(`.nav-item[data-section="${s}"]`);
    if (nav) nav.classList.toggle('active', s === section);
  });

  $('pageTitle').textContent = TITLES[section] || section;

  // mobile: close sidebar
  closeSidebar();

  // lazy-load content
  if (section === 'dashboard')   loadDashboard();
  if (section === 'products')    loadProducts(1);
  if (section === 'categories')  loadCategories();
  if (section === 'settings')    loadSettings();
}

// sidebar mobile
function openSidebar() {
  $('sidebar').classList.add('open');
  const ov = $('sidebarOverlay');
  show(ov);
}
function closeSidebar() {
  $('sidebar').classList.remove('open');
  hide($('sidebarOverlay'));
}

// ============================================================
//  AUTH
// ============================================================
async function doLogin(e) {
  e.preventDefault();
  const btn   = $('loginBtn');
  const errEl = $('loginError');
  hide(errEl);

  const email    = $('loginEmail').value.trim();
  const password = $('loginPassword').value;

  btn.disabled = true;
  btn.textContent = 'Connexion…';

  try {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    token = res.data?.token;
    adminInfo = res.data?.admin;

    if (!token) throw new Error('Token manquant dans la réponse');

    localStorage.setItem('yass_admin_token', token);
    enterAdmin();
  } catch (err) {
    errEl.textContent = err.message;
    show(errEl);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Se connecter';
  }
}

async function checkSession() {
  if (!token) return false;
  try {
    const res = await apiFetch('/api/auth/me');
    adminInfo = res.data;
    return true;
  } catch {
    token = null;
    localStorage.removeItem('yass_admin_token');
    return false;
  }
}

function enterAdmin() {
  hide($('loginScreen'));
  show($('adminShell'));
  const name = adminInfo?.name || adminInfo?.email || '';
  $('adminName').textContent   = name;
  $('topbarAdmin').textContent = name;
  navigate('dashboard');
}

async function doLogout() {
  try {
    await apiFetch('/api/auth/logout', { method: 'POST' });
  } catch { /* ignore */ }
  token = null;
  adminInfo = null;
  localStorage.removeItem('yass_admin_token');
  hide($('adminShell'));
  show($('loginScreen'));
  $('loginPassword').value = '';
}

// ============================================================
//  DASHBOARD
// ============================================================
async function loadDashboard() {
  try {
    const res = await apiFetch('/api/dashboard');
    const d = res.data;

    $('statTotal').textContent      = d.totalProducts ?? '—';
    $('statActive').textContent     = d.activeProducts ?? '—';
    $('statOutOfStock').textContent = d.outOfStockProducts ?? '—';
    $('statPromo').textContent      = d.promoProducts ?? '—';
    $('statCat').textContent        = d.totalCategories ?? '—';

    const tbody = $('latestProductsBody');
    if (!d.latestProducts?.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="table-empty">Aucun produit</td></tr>';
      return;
    }
    tbody.innerHTML = d.latestProducts.map((p) => `
      <tr>
        <td>${escHtml(p.nom)}</td>
        <td>${fmtPrice(p.prix)}</td>
        <td>${p.stock}</td>
        <td>${fmtDate(p.createdAt)}</td>
      </tr>`).join('');
  } catch (err) {
    showToast('Erreur dashboard : ' + err.message, 'error');
  }
}

// ============================================================
//  PRODUCTS
// ============================================================
async function loadProducts(page = 1, recherche = '') {
  productPage = page;
  const tbody = $('productsBody');
  tbody.innerHTML = '<tr><td colspan="7"><div class="spinner"></div></td></tr>';

  try {
    const params = new URLSearchParams({ page, limit: PRODUCT_LIMIT, tri: 'newest' });
    if (recherche) params.set('recherche', recherche);
    const res = await apiFetch(`/api/products?${params}`);
    const items = res.items || [];
    const { total = 0, totalPages = 1 } = res.pagination || {};

    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="table-empty">Aucun produit trouvé</td></tr>';
    } else {
      tbody.innerHTML = items.map((p) => {
        const img = p.imagePrincipale
          ? `<img src="${escHtml(p.imagePrincipale)}" class="product-thumb" alt="" loading="lazy">`
          : `<div class="product-thumb-placeholder">IMG</div>`;
        return `
        <tr>
          <td>${img}</td>
          <td>${escHtml(p.nom)}</td>
          <td>${escHtml(p.categorie?.nom || '—')}</td>
          <td>${fmtPrice(p.prix)}</td>
          <td>${p.stock ?? '—'}</td>
          <td><span class="badge ${p.actif ? 'badge--green' : 'badge--red'}">${p.actif ? 'Actif' : 'Inactif'}</span></td>
          <td class="actions-cell">
            <button class="btn-icon edit" title="Modifier" data-action="edit-product" data-id="${p.id}">
              <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon del" title="Supprimer" data-action="delete-product" data-id="${p.id}" data-name="${escHtml(p.nom)}">
              <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </td>
        </tr>`;
      }).join('');
    }

    renderPagination($('productPagination'), page, totalPages, (p) => {
      const q = $('productSearch').value.trim();
      loadProducts(p, q);
    });
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="7" class="table-empty">${escHtml(err.message)}</td></tr>`;
  }
}

function renderPagination(container, current, total, jumpFn) {
  if (total <= 1) { container.innerHTML = ''; return; }
  // jumpFn is stored globally so inline onclick can call it safely
  window._paginationJump = jumpFn;
  let html = `<button ${current === 1 ? 'disabled' : ''} onclick="_paginationJump(${current - 1})">‹</button>`;
  for (let i = 1; i <= total; i++) {
    if (total > 7 && Math.abs(i - current) > 2 && i !== 1 && i !== total) {
      if (i === 2 || i === total - 1) html += '<button disabled>…</button>';
      continue;
    }
    html += `<button class="${i === current ? 'active' : ''}" onclick="_paginationJump(${i})">${i}</button>`;
  }
  html += `<button ${current === total ? 'disabled' : ''} onclick="_paginationJump(${current + 1})">›</button>`;
  container.innerHTML = html;
}

// ---- Product modal ----
async function openProductModal(product = null) {
  let categories = [];
  try {
    const res = await apiFetch('/api/categories');
    categories = res.data || [];
  } catch { /* empty */ }

  const p = product || {};
  const catOptions = categories.map((c) =>
    `<option value="${c.id}" ${p.categorieId === c.id ? 'selected' : ''}>${escHtml(c.nom)}</option>`
  ).join('');

  const body = `
    <div class="field-group">
      <label>Nom *</label>
      <input type="text" id="pNom" value="${escHtml(p.nom || '')}" maxlength="200" />
    </div>
    <div class="field-group">
      <label>Description *</label>
      <textarea id="pDescription" rows="3">${escHtml(p.description || '')}</textarea>
    </div>
    <div class="field-group">
      <label>Prix (FCFA) *</label>
      <input type="number" id="pPrix" value="${p.prix || ''}" min="0" step="1" />
    </div>
    <div class="field-group">
      <label>Ancien prix (FCFA)</label>
      <input type="number" id="pAncienPrix" value="${p.ancienPrix || ''}" min="0" step="1" />
    </div>
    <div class="field-group">
      <label>Catégorie *</label>
      <select id="pCategorie"><option value="">— Choisir —</option>${catOptions}</select>
    </div>
    <div class="field-group">
      <label>Marque</label>
      <input type="text" id="pMarque" value="${escHtml(p.marque || '')}" maxlength="120" />
    </div>
    <div class="field-group">
      <label>Volume</label>
      <input type="text" id="pVolume" value="${escHtml(p.volume || '')}" maxlength="120" />
    </div>
    <div class="field-group">
      <label>Genre</label>
      <input type="text" id="pGenre" value="${escHtml(p.genre || '')}" maxlength="80" />
    </div>
    <div class="field-group">
      <label>Image principale (URL)</label>
      <input type="text" id="pImage" value="${escHtml(p.imagePrincipale || '')}" maxlength="500" />
    </div>
    <div class="field-group">
      <label>Stock</label>
      <input type="number" id="pStock" value="${p.stock ?? 0}" min="0" />
    </div>
    <div class="field-row">
      <input type="checkbox" id="pActif" ${p.actif !== false ? 'checked' : ''} />
      <label for="pActif">Produit actif</label>
    </div>
    <div class="field-row">
      <input type="checkbox" id="pFeatured" ${p.featured ? 'checked' : ''} />
      <label for="pFeatured">Mis en avant</label>
    </div>
    <div class="field-row">
      <input type="checkbox" id="pPromo" ${p.promotion ? 'checked' : ''} />
      <label for="pPromo">En promotion</label>
    </div>
    <p id="productModalErr" class="error-msg" hidden></p>
  `;

  openModal(product ? 'Modifier le produit' : 'Nouveau produit', body, async () => {
    const errEl = $('productModalErr');
    hide(errEl);

    const payload = {
      nom:            $('pNom').value.trim(),
      description:    $('pDescription').value.trim(),
      prix:           parseFloat($('pPrix').value),
      ancienPrix:     $('pAncienPrix').value ? parseFloat($('pAncienPrix').value) : undefined,
      categorieId:    parseInt($('pCategorie').value, 10),
      marque:         $('pMarque').value.trim() || undefined,
      volume:         $('pVolume').value.trim() || undefined,
      genre:          $('pGenre').value.trim() || undefined,
      imagePrincipale: $('pImage').value.trim() || undefined,
      stock:          parseInt($('pStock').value, 10),
      actif:          $('pActif').checked,
      featured:       $('pFeatured').checked,
      promotion:      $('pPromo').checked
    };

    // basic validation
    if (!payload.nom)         { errEl.textContent = 'Le nom est requis.'; show(errEl); return false; }
    if (!payload.description) { errEl.textContent = 'La description est requise.'; show(errEl); return false; }
    if (isNaN(payload.prix))  { errEl.textContent = 'Le prix est invalide.'; show(errEl); return false; }
    if (!payload.categorieId) { errEl.textContent = 'La catégorie est requise.'; show(errEl); return false; }

    try {
      if (product) {
        await apiFetch(`/api/products/${product.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        showToast('Produit mis à jour.', 'success');
      } else {
        await apiFetch('/api/products', { method: 'POST', body: JSON.stringify(payload) });
        showToast('Produit créé.', 'success');
      }
      closeModal();
      loadProducts(productPage, $('productSearch').value.trim());
    } catch (err) {
      errEl.textContent = err.message;
      show(errEl);
      return false;
    }
  });
}

async function editProduct(id) {
  try {
    const res = await apiFetch(`/api/products/${id}`);
    openProductModal(res.data);
  } catch (err) {
    showToast('Impossible de charger le produit : ' + err.message, 'error');
  }
}

function confirmDeleteProduct(id, nom) {
  openModal(
    'Supprimer le produit',
    `<p class="confirm-text">Voulez-vous vraiment supprimer <strong>${escHtml(nom)}</strong> ? Cette action est irréversible.</p>`,
    async () => {
      try {
        await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
        showToast('Produit supprimé.', 'success');
        closeModal();
        loadProducts(productPage, $('productSearch').value.trim());
      } catch (err) {
        showToast('Erreur : ' + err.message, 'error');
        return false;
      }
    }
  );
}

// ============================================================
//  CATEGORIES
// ============================================================
async function loadCategories() {
  const tbody = $('categoriesBody');
  tbody.innerHTML = '<tr><td colspan="5"><div class="spinner"></div></td></tr>';

  try {
    const res = await apiFetch('/api/categories');
    const cats = res.data || [];

    if (!cats.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="table-empty">Aucune catégorie</td></tr>';
      return;
    }
    tbody.innerHTML = cats.map((c) => `
      <tr>
        <td>${escHtml(c.nom)}</td>
        <td><code>${escHtml(c.slug || '')}</code></td>
        <td>${escHtml(c.description || '—')}</td>
        <td><span class="badge ${c.actif !== false ? 'badge--green' : 'badge--red'}">${c.actif !== false ? 'Actif' : 'Inactif'}</span></td>
        <td class="actions-cell">
          <button class="btn-icon edit" title="Modifier" data-action="edit-category" data-id="${c.id}">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-icon del" title="Supprimer" data-action="delete-category" data-id="${c.id}" data-name="${escHtml(c.nom)}">
            <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="table-empty">${escHtml(err.message)}</td></tr>`;
  }
}

function openCategoryModal(cat = null) {
  const c = cat || {};
  const body = `
    <div class="field-group">
      <label>Nom *</label>
      <input type="text" id="cNom" value="${escHtml(c.nom || '')}" maxlength="120" />
    </div>
    <div class="field-group">
      <label>Description</label>
      <textarea id="cDescription" rows="3" maxlength="2000">${escHtml(c.description || '')}</textarea>
    </div>
    <div class="field-row">
      <input type="checkbox" id="cActif" ${c.actif !== false ? 'checked' : ''} />
      <label for="cActif">Catégorie active</label>
    </div>
    <p id="catModalErr" class="error-msg" hidden></p>
  `;

  openModal(cat ? 'Modifier la catégorie' : 'Nouvelle catégorie', body, async () => {
    const errEl = $('catModalErr');
    hide(errEl);

    const payload = {
      nom:         $('cNom').value.trim(),
      description: $('cDescription').value.trim() || undefined,
      actif:       $('cActif').checked
    };

    if (!payload.nom) { errEl.textContent = 'Le nom est requis.'; show(errEl); return false; }

    try {
      if (cat) {
        await apiFetch(`/api/categories/${cat.id}`, { method: 'PUT', body: JSON.stringify(payload) });
        showToast('Catégorie mise à jour.', 'success');
      } else {
        await apiFetch('/api/categories', { method: 'POST', body: JSON.stringify(payload) });
        showToast('Catégorie créée.', 'success');
      }
      closeModal();
      loadCategories();
    } catch (err) {
      errEl.textContent = err.message;
      show(errEl);
      return false;
    }
  });
}

async function editCategory(id) {
  try {
    const res = await apiFetch(`/api/categories/${id}`);
    openCategoryModal(res.data);
  } catch (err) {
    showToast('Impossible de charger la catégorie : ' + err.message, 'error');
  }
}

function confirmDeleteCategory(id, nom) {
  openModal(
    'Supprimer la catégorie',
    `<p class="confirm-text">Voulez-vous vraiment supprimer la catégorie <strong>${escHtml(nom)}</strong> ?</p>`,
    async () => {
      try {
        await apiFetch(`/api/categories/${id}`, { method: 'DELETE' });
        showToast('Catégorie supprimée.', 'success');
        closeModal();
        loadCategories();
      } catch (err) {
        showToast('Erreur : ' + err.message, 'error');
        return false;
      }
    }
  );
}

// ============================================================
//  SETTINGS
// ============================================================
async function loadSettings() {
  try {
    const res = await apiFetch('/api/settings');
    const s = res.data || {};
    const form = $('settingsForm');
    Object.keys(s).forEach((k) => {
      const el = form.elements[k];
      if (el) el.value = s[k] ?? '';
    });
  } catch (err) {
    showToast('Erreur chargement paramètres : ' + err.message, 'error');
  }
}

async function saveSettings(e) {
  e.preventDefault();
  const btn    = $('saveSettingsBtn');
  const msgEl  = $('settingsMsg');
  const errEl  = $('settingsErr');
  hide(msgEl); hide(errEl);

  btn.disabled = true;
  btn.textContent = 'Enregistrement…';

  const form = $('settingsForm');
  const payload = {};
  Array.from(form.elements).forEach((el) => {
    if (el.name && el.value.trim() !== '') payload[el.name] = el.value.trim();
  });

  try {
    await apiFetch('/api/settings', { method: 'PUT', body: JSON.stringify(payload) });
    msgEl.textContent = 'Paramètres enregistrés avec succès.';
    show(msgEl);
    showToast('Paramètres enregistrés.', 'success');
  } catch (err) {
    errEl.textContent = err.message;
    show(errEl);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Enregistrer';
  }
}

// ============================================================
//  MODAL
// ============================================================
let _modalConfirmCb = null;

function openModal(title, bodyHtml, confirmCb) {
  $('modalTitle').textContent = title;
  $('modalBody').innerHTML    = bodyHtml;
  _modalConfirmCb             = confirmCb;
  show($('modal'));
}

function closeModal() {
  hide($('modal'));
  $('modalBody').innerHTML = '';
  _modalConfirmCb = null;
}

// ============================================================
//  XSS helper
// ============================================================
function escHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {

  // Login form
  $('loginForm').addEventListener('submit', doLogin);

  // Logout
  $('logoutBtn').addEventListener('click', doLogout);

  // Sidebar mobile
  $('menuToggle').addEventListener('click', openSidebar);
  $('sidebarClose').addEventListener('click', closeSidebar);
  $('sidebarOverlay').addEventListener('click', closeSidebar);

  // Nav items
  document.querySelectorAll('.nav-item').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(link.dataset.section);
    });
  });

  // Modal buttons
  $('modalClose').addEventListener('click',   closeModal);
  $('modalCancel').addEventListener('click',  closeModal);
  $('modal').querySelector('.modal-backdrop').addEventListener('click', closeModal);
  $('modalConfirm').addEventListener('click', async () => {
    if (_modalConfirmCb) await _modalConfirmCb();
  });

  // Add product
  $('addProductBtn').addEventListener('click', () => openProductModal());

  // Products table delegation
  $('productsBody').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const { action, id, name } = btn.dataset;
    if (action === 'edit-product')   editProduct(Number(id));
    if (action === 'delete-product') confirmDeleteProduct(Number(id), name || '');
  });

  // Product search
  $('productSearch').addEventListener('input', (e) => {
    clearTimeout(productSearchTimer);
    const q = e.target.value.trim();
    productSearchTimer = setTimeout(() => loadProducts(1, q), 350);
  });

  // Add category
  $('addCategoryBtn').addEventListener('click', () => openCategoryModal());

  // Categories table delegation
  $('categoriesBody').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const { action, id, name } = btn.dataset;
    if (action === 'edit-category')   editCategory(Number(id));
    if (action === 'delete-category') confirmDeleteCategory(Number(id), name || '');
  });

  // Settings form
  $('settingsForm').addEventListener('submit', saveSettings);

  // Check existing session
  const ok = await checkSession();
  if (ok) {
    enterAdmin();
  } else {
    show($('loginScreen'));
  }
});
