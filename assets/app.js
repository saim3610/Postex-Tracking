const form = document.querySelector("[data-tracking-form]");
const input = document.querySelector("[data-tracking-input]");
const result = document.querySelector("[data-result]");
const officeInput = document.querySelector("[data-office-search]");

const formatDate = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
};

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const renderMessage = (message, type = "info") => {
  if (!result) return;
  result.classList.add("visible");
  result.innerHTML = `<div class="message ${type === "error" ? "error" : ""}">${escapeHtml(message)}</div>`;
  result.scrollIntoView({ behavior: "smooth", block: "start" });
};

const renderTracking = (data) => {
  const history = Array.isArray(data.history) ? data.history : [];
  const timeline = history.length
    ? history.map((item) => `
      <div class="timeline-item">
        <strong>${escapeHtml(item.status || "Shipment update")}</strong>
        <time>${escapeHtml(formatDate(item.datetime))}${item.status_code ? ` • Code ${escapeHtml(item.status_code)}` : ""}</time>
      </div>
    `).join("")
    : `<div class="message">No movement history is available for this tracking number yet.</div>`;

  result.classList.add("visible");
  result.innerHTML = `
    <article class="result-card" aria-live="polite">
      <div class="result-head">
        <div>
          <span class="eyebrow">Live PostEx Result</span>
          <h2>${escapeHtml(data.current_status || "Tracking Found")}</h2>
          <p>${escapeHtml(data.courier || "PostEx")} shipment details returned from the tracking API.</p>
        </div>
        <span class="status-badge">${escapeHtml(data.current_status_code || "Updated")}</span>
      </div>
      <div class="result-meta">
        <div><span>Tracking Number</span><strong>${escapeHtml(data.tracking_number || input.value)}</strong></div>
        <div><span>Customer</span><strong>${escapeHtml(data.customer_name || "Not shown")}</strong></div>
        <div><span>Pickup Date</span><strong>${escapeHtml(formatDate(data.pickup_date))}</strong></div>
        <div><span>Last Update</span><strong>${escapeHtml(formatDate(data.last_update))}</strong></div>
      </div>
      <div class="timeline">
        <h3>Shipment History Timeline</h3>
        ${timeline}
      </div>
    </article>
  `;
  result.scrollIntoView({ behavior: "smooth", block: "start" });
};

if (form && input && result) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const tracking = input.value.trim();

    if (!tracking) {
      renderMessage("Please enter your PostEx consignment number first.", "error");
      return;
    }

    renderMessage("Checking latest PostEx tracking status...");

    try {
      const response = await fetch(`/api/track?tracking=${encodeURIComponent(tracking)}`);
      const data = await response.json();

      if (!response.ok || data.success === false) {
        renderMessage(data.message || "No tracking result found for this consignment number.", "error");
        return;
      }

      renderTracking(data);
    } catch (error) {
      renderMessage("Unable to connect with tracking API right now. Please try again.", "error");
    }
  });
}

if (officeInput) {
  officeInput.addEventListener("input", () => {
    const query = officeInput.value.trim().toLowerCase();
    document.querySelectorAll("[data-office-card]").forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? "" : "none";
    });
  });
}
