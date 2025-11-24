// js/ui/card.js
// Leafy UI - Card Component (Re-usable for app & preview)

export function createCard({ title, description, action, content, footer }) {
  const card = document.createElement("div");
  card.className = "card";

  // --- Header ---
  if (title || description || action) {
    const header = document.createElement("div");
    header.className = "card-header";

    const headerLeft = document.createElement("div");
    headerLeft.className = "card-header-left";

    if (title) {
      const titleEl = document.createElement("h4");
      titleEl.className = "card-title";
      titleEl.textContent = title;
      headerLeft.appendChild(titleEl);
    }

    if (description) {
      const descEl = document.createElement("p");
      descEl.className = "card-description";
      descEl.textContent = description;
      headerLeft.appendChild(descEl);
    }

    header.appendChild(headerLeft);

    if (action) {
      const actionEl = document.createElement("div");
      actionEl.className = "card-action";
      actionEl.appendChild(action);
      header.appendChild(actionEl);
    }

    card.appendChild(header);
  }

  // --- Content ---
  if (content) {
    const contentEl = document.createElement("div");
    contentEl.className = "card-content";
    contentEl.appendChild(content);
    card.appendChild(contentEl);
  }

  // --- Footer ---
  if (footer) {
    const footerEl = document.createElement("div");
    footerEl.className = "card-footer";
    footerEl.appendChild(footer);
    card.appendChild(footerEl);
  }

  return card;
}
