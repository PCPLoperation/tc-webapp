/* ================================
   TEST CERTIFICATE WEB APP LOGIC
   ================================
   WHAT THIS FILE DOES:
   1️⃣ Fetches products.json
   2️⃣ Builds table (Desktop + Mobile)
   3️⃣ Enables live search
   4️⃣ Enables Type filter (PP / Hybrid / Specialty / PU etc.)
   5️⃣ Handles missing data safely
==================================== */

const JSON_URL = 'products.json';   // JSON lives in repo root

// DOM Elements
const tableBody = document.getElementById("table-body");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");

let PRODUCTS = [];

/* ================================
   FETCH JSON
==================================== */
async function loadProducts() {
  try {
    const response = await fetch(JSON_URL);

    if (!response.ok) {
      throw new Error("JSON not found");
    }

    PRODUCTS = await response.json();
    renderProducts(PRODUCTS);

  } catch (error) {
    console.error("Failed to load JSON", error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;color:red;">
          Failed to load products. Please refresh.
        </td>
      </tr>`;
  }
}

/* ================================
   RENDER TABLE
==================================== */
function renderProducts(list) {
  tableBody.innerHTML = "";

  if (!list || list.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;">
          No records found
        </td>
      </tr>`;
    return;
  }

  list.forEach(item => {
    const code = item.code || "";
    const name = item.name || "";
    const colour = item.colour || "";
    const pdf = item.pdf || "";

    const row = document.createElement("tr");

    row.innerHTML = `
      <!-- Desktop View -->
      <td class="desk-col">${code}</td>
      <td class="desk-col">${name}</td>
      <td class="desk-col">${colour}</td>
      <td class="desk-col">
        ${pdf ? `<a href="${pdf}" class="download-btn" download>Download</a>` : `N/A`}
      </td>

      <!-- Mobile Card View -->
      <td class="mobile-card">
        <div class="card-header">
          <span class="code">${code}</span>
          ${pdf ? `<a href="${pdf}" class="download-icon" download>⬇️</a>` : ``}
        </div>

        <div class="name">${name}</div>
        <div class="colour">${colour}</div>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

/* ================================
   FILTERING LOGIC
==================================== */
function filterProducts() {
  const search = searchInput.value.toLowerCase().trim();
  const type = typeFilter.value;

  const filtered = PRODUCTS.filter(item => {
    const matchesSearch =
      (item.code || "").toLowerCase().includes(search) ||
      (item.name || "").toLowerCase().includes(search) ||
      (item.colour || "").toLowerCase().includes(search);

    const matchesType =
      type === "all" || (item.type || "").toLowerCase() === type.toLowerCase();

    return matchesSearch && matchesType;
  });

  renderProducts(filtered);
}

/* ================================
   EVENT LISTENERS
==================================== */
searchInput.addEventListener("input", filterProducts);
typeFilter.addEventListener("change", filterProducts);

/* ================================
   INIT
==================================== */
loadProducts();
