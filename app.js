fetch("products.json")
  .then(res => res.json())
  .then(data => {
    window.products = data;
    renderTable(data);
  })
  .catch(() => alert("Failed to load product list"));

const tableBody = document.getElementById("productTable");
const searchBox = document.getElementById("searchBox");
const typeFilter = document.getElementById("typeFilter");

function renderTable(list) {
  tableBody.innerHTML = "";

  list.forEach(p => {
    if (!p.code) return;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${p.code}</td>
      <td>${p.name}</td>
      <td>${p.colour || "-"}</td>
      <td><a class="download-btn" href="${p.pdf}" target="_blank">Download</a></td>
    `;

    tableBody.appendChild(row);
  });
}

function applyFilters() {
  let filtered = window.products;

  const text = searchBox.value.toLowerCase();
  const type = typeFilter.value;

  filtered = filtered.filter(p =>
    (p.code?.toLowerCase().includes(text) ||
     p.name?.toLowerCase().includes(text))
  );

  if (type)
    filtered = filtered.filter(p => p.type === type);

  renderTable(filtered);
}

searchBox.addEventListener("input", applyFilters);
typeFilter.addEventListener("change", applyFilters);
