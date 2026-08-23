/* =============================================
   checkout.js  –  Page "Finaliser ma commande"
   ============================================= */

const DELIVERY_FEE = 2000;

// ── Utilities ────────────────────────────────
function formatPrice(n) {
  return n.toLocaleString("fr-FR") + " CFA";
}

function formatOrderDate(date) {
  return date.toISOString().slice(0, 10);
}

function formatOrderTime(date) {
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function displayName(name) {
  return name.replace(/_/g, " ");
}

function escHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function csvValue(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function buildItemsSummary(items) {
  return items.map(item => `${displayName(item.name)} x${item.qty} (${formatPrice(item.unitPrice)} / unité)`).join(" | ");
}

function downloadOrderCsv(dateKey, order) {
  const headers = [
    "Date commande", "Heure commande", "Nom", "Prénom",
    "Adresse/Ville", "Téléphone", "Email", "Paiement",
    "Produits", "Total (CFA)",
  ];
  const rows = [[
    order.orderDate, order.orderTime, order.nom, order.prenom,
    order.adresse, order.telephone, order.email, order.paiement,
    buildItemsSummary(order.items), order.total,
  ]];
  const csvContent = [headers, ...rows].map(row => row.map(csvValue).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF", csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `commandes-${dateKey}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

// ── Load cart from localStorage ───────────────
let cart = [];
try {
  cart = JSON.parse(localStorage.getItem("yass_checkout_cart") || "[]");
} catch {
  cart = [];
}

// ── Render summary ────────────────────────────
const itemsList  = document.getElementById("co-items-list");
const subtotalEl = document.getElementById("co-subtotal");
const deliveryEl = document.getElementById("co-delivery");
const totalEl    = document.getElementById("co-total");
const form       = document.getElementById("co-form");
const emptyMsg   = document.getElementById("co-empty-msg");

if (cart.length === 0) {
  emptyMsg.hidden = false;
  form.hidden = true;
  itemsList.innerHTML = `<li class="co-item-empty">Aucun article</li>`;
  subtotalEl.textContent = formatPrice(0);
  deliveryEl.textContent = formatPrice(0);
  totalEl.textContent    = formatPrice(0);
} else {
  cart.forEach(item => {
    const li = document.createElement("li");
    li.className = "co-item";
    li.innerHTML = `
      <span class="co-item-name">${escHtml(displayName(item.name))}</span>
      <span class="co-item-qty">× ${item.qty}</span>
      <span class="co-item-price">${formatPrice(item.price * item.qty)}</span>`;
    itemsList.appendChild(li);
  });
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total    = subtotal + DELIVERY_FEE;
  subtotalEl.textContent = formatPrice(subtotal);
  deliveryEl.textContent = formatPrice(DELIVERY_FEE);
  totalEl.textContent    = formatPrice(total);

  // ── Payment method toggle ─────────────────────
  const paiementSelect = form.querySelector('[name="co-paiement"]');
  const paymentInfo    = document.getElementById("co-payment-info");

  paiementSelect.addEventListener("change", () => {
    paymentInfo.hidden = paiementSelect.value !== "Wave / Orange Money";
  });

  // ── Form submission ───────────────────────────
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = document.getElementById("co-msg");

    const nom       = form.querySelector('[name="co-nom"]').value.trim();
    const prenom    = form.querySelector('[name="co-prenom"]').value.trim();
    const adresse   = form.querySelector('[name="co-adresse"]').value.trim();
    const telephone = form.querySelector('[name="co-telephone"]').value.trim();
    const email     = form.querySelector('[name="co-email"]').value.trim();
    const paiement  = paiementSelect.value;

    if (!nom || !prenom || !adresse || !telephone || !paiement) {
      msg.className = "form-msg error";
      msg.textContent = "Veuillez remplir tous les champs obligatoires (*).";
      return;
    }

    if (cart.length === 0) {
      msg.className = "form-msg error";
      msg.textContent = "Votre panier est vide.";
      return;
    }

    const now        = new Date();
    const orderDate  = formatOrderDate(now);
    const orderTime  = formatOrderTime(now);
    const subtotal   = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const total      = subtotal + DELIVERY_FEE;
    const orderItems = cart.map(item => ({
      name: item.name,
      qty: item.qty,
      unitPrice: item.price,
      linePrice: item.price * item.qty,
    }));
    const itemLines = orderItems.map(i =>
      `  - ${displayName(i.name)} x${i.qty} : ${formatPrice(i.linePrice)}`
    ).join("\n");

    const order = { orderDate, orderTime, nom, prenom, adresse, telephone, email, paiement, items: orderItems, total };

    try {
      downloadOrderCsv(orderDate, order);
    } catch {
      msg.className = "form-msg error";
      msg.textContent = "Une erreur est survenue lors de la génération du fichier CSV.";
      return;
    }

    const subject = encodeURIComponent("Nouvelle commande YASS Parfums");
    const body = encodeURIComponent(
      `NOUVELLE COMMANDE (${orderDate} ${orderTime})\n\nClient :\nNom : ${nom}\nPrénom : ${prenom}\nAdresse/Ville : ${adresse}\nTéléphone : ${telephone}${email ? "\nEmail : " + email : ""}\n\nMoyen de paiement : ${paiement}\n\nProduits commandés :\n${itemLines}\nFrais de livraison : ${formatPrice(DELIVERY_FEE)}\n\nTotal : ${formatPrice(total)}`
    );

    // Clear cart from storage
    localStorage.removeItem("yass_checkout_cart");

    msg.className = "form-msg success";
    msg.textContent = "Commande enregistrée. Le CSV du jour est téléchargé et votre client mail s'ouvre. ✅";

    setTimeout(() => {
      window.location.href = `mailto:ada9091@gmail.com?subject=${subject}&body=${body}`;
      // Redirect back to shop after the mail intent fires
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2500);
    }, 150);
  });
}

// ── Footer year ───────────────────────────────
document.getElementById("year").textContent = new Date().getFullYear();
