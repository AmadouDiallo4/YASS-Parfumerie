/* YASS Parfums – produit.js */

const detailRoot = document.getElementById('product-detail-root');
const productId = Number(new URLSearchParams(window.location.search).get('id'));

function renderState(message) {
  if (!detailRoot) return;
  detailRoot.innerHTML = `<p class="pd-state">${window.YassStorefront?.escHtml(message) || message}</p>`;
}

function stockText(product) {
  if (typeof product.stock !== 'number') return 'Disponibilité non renseignée';
  if (product.stock > 0) return `En stock (${product.stock})`;
  return 'Rupture de stock';
}

function buildImageList(product) {
  const images = [];
  if (product?.imagePrincipale) images.push(product.imagePrincipale);
  if (Array.isArray(product?.images)) {
    product.images.forEach((img) => {
      if (img) images.push(img);
    });
  }
  return [...new Set(images.filter(Boolean))];
}

function renderGallery(images, productName) {
  if (!images.length) {
    return `
      <div class="pd-gallery-main pd-gallery-placeholder" id="pd-main-image" aria-label="Aucune image disponible">
        <span>🖼️</span>
      </div>
    `;
  }

  const esc = window.YassStorefront.escHtml;
  const main = `
    <div class="pd-gallery-main">
      <img id="pd-main-image" src="${esc(images[0])}" alt="${esc(productName)}" loading="eager" />
    </div>
  `;

  if (images.length === 1) return main;

  const thumbs = images.map((src, index) => `
    <button class="pd-thumb ${index === 0 ? 'active' : ''}" type="button" data-src="${esc(src)}" aria-label="Voir image ${index + 1}">
      <img src="${esc(src)}" alt="Miniature ${index + 1}" loading="lazy" />
    </button>
  `).join('');

  return `${main}<div class="pd-thumbs" id="pd-thumbs">${thumbs}</div>`;
}

function toCartProduct(product) {
  const images = buildImageList(product);
  return {
    id: Number(product.id),
    name: product.nom,
    price: Number(product.prix || 0),
    image: images[0] || '',
    icon: '🛍️',
    source: product
  };
}

function renderProduct(product) {
  const esc = window.YassStorefront.escHtml;
  const formatPrice = window.YassStorefront.formatPrice;
  const images = buildImageList(product);
  const hasOldPrice = Number(product.ancienPrix) > Number(product.prix);

  detailRoot.innerHTML = `
    <article class="pd-product">
      <div class="pd-gallery">
        ${renderGallery(images, product.nom)}
      </div>

      <div class="pd-content">
        <div class="pd-head">
          <span class="product-badge">${esc(product.category?.nom || 'Produit')}</span>
          ${product.promotion ? '<span class="pd-promo">Promotion</span>' : ''}
        </div>

        <h1 class="pd-title">${esc(product.nom)}</h1>
        <p class="pd-desc">${esc(product.description || 'Description non disponible.')}</p>

        <div class="pd-price-wrap">
          <p class="pd-price">${formatPrice(product.prix)}</p>
          ${hasOldPrice ? `<p class="pd-old-price">${formatPrice(product.ancienPrix)}</p>` : ''}
        </div>

        <ul class="pd-meta">
          <li><strong>Catégorie :</strong> ${esc(product.category?.nom || '—')}</li>
          <li><strong>Marque :</strong> ${esc(product.marque || '—')}</li>
          <li><strong>Volume :</strong> ${esc(product.volume || '—')}</li>
          <li><strong>Genre :</strong> ${esc(product.genre || '—')}</li>
          <li><strong>Disponibilité :</strong> ${esc(stockText(product))}</li>
        </ul>

        <div class="pd-actions">
          <div class="pd-qty" aria-label="Sélecteur de quantité">
            <button type="button" class="pd-qty-btn" id="pd-qty-minus" aria-label="Diminuer la quantité">−</button>
            <input id="pd-qty-input" class="pd-qty-input" type="number" min="1" value="1" inputmode="numeric" />
            <button type="button" class="pd-qty-btn" id="pd-qty-plus" aria-label="Augmenter la quantité">+</button>
          </div>
          <button type="button" class="btn btn-primary" id="pd-add-to-cart">Ajouter au panier</button>
        </div>
      </div>
    </article>
  `;

  const mainImage = document.getElementById('pd-main-image');
  const thumbsContainer = document.getElementById('pd-thumbs');
  if (mainImage && thumbsContainer) {
    thumbsContainer.addEventListener('click', (e) => {
      const thumb = e.target.closest('.pd-thumb');
      if (!thumb) return;
      mainImage.src = thumb.dataset.src;
      thumbsContainer.querySelectorAll('.pd-thumb').forEach((el) => el.classList.remove('active'));
      thumb.classList.add('active');
    });
  }

  const qtyInput = document.getElementById('pd-qty-input');
  const minus = document.getElementById('pd-qty-minus');
  const plus = document.getElementById('pd-qty-plus');
  const addButton = document.getElementById('pd-add-to-cart');

  const safeQty = () => {
    const parsed = Number(qtyInput.value);
    if (!Number.isFinite(parsed) || parsed < 1) return 1;
    return Math.floor(parsed);
  };

  minus?.addEventListener('click', () => {
    qtyInput.value = String(Math.max(1, safeQty() - 1));
  });

  plus?.addEventListener('click', () => {
    qtyInput.value = String(safeQty() + 1);
  });

  qtyInput?.addEventListener('change', () => {
    qtyInput.value = String(Math.max(1, safeQty()));
  });

  addButton?.addEventListener('click', () => {
    window.YassStorefront.addToCart(toCartProduct(product), safeQty());
  });
}

async function loadProduct() {
  if (!detailRoot) return;

  if (!Number.isInteger(productId) || productId <= 0) {
    renderState('ID produit manquant ou invalide.');
    return;
  }

  renderState('Chargement du produit…');

  try {
    const response = await fetch(`/api/products/${productId}`);
    const payload = await response.json().catch(() => ({}));

    if (response.status === 404) {
      renderState('Produit introuvable');
      return;
    }

    if (!response.ok || payload?.success !== true || !payload?.data) {
      throw new Error(payload?.message || 'Erreur lors du chargement du produit.');
    }

    renderProduct(payload.data);
  } catch (error) {
    renderState(error?.message || 'Erreur API. Veuillez réessayer plus tard.');
  }
}

loadProduct();
