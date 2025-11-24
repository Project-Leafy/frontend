class UIPagination {
  constructor(options) {
    this.root =
      typeof options.container === "string"
        ? document.querySelector(options.container)
        : options.container;

    if (!this.root) return;

    this.ul = this.root.querySelector(".pagination-content");
    if (!this.ul) return;

    this.totalPages = Math.max(1, options.totalPages || 1);
    this.currentPage = options.currentPage || 1;

    // 초기 렌더
    this.render();
  }

  setPage(page) {
    const newPage = Math.max(1, Math.min(this.totalPages, page));
    if (newPage === this.currentPage) return;
    this.currentPage = newPage;
    this.render();
  }

  createIconChevronLeft() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.classList.add("pagination-icon");
    const poly = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline",
    );
    poly.setAttribute("points", "15 18 9 12 15 6");
    poly.setAttribute("fill", "none");
    poly.setAttribute("stroke", "currentColor");
    poly.setAttribute("stroke-width", "2");
    poly.setAttribute("stroke-linecap", "round");
    poly.setAttribute("stroke-linejoin", "round");
    svg.appendChild(poly);
    return svg;
  }

  createIconChevronRight() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.classList.add("pagination-icon");
    const poly = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline",
    );
    poly.setAttribute("points", "9 18 15 12 9 6");
    poly.setAttribute("fill", "none");
    poly.setAttribute("stroke", "currentColor");
    poly.setAttribute("stroke-width", "2");
    poly.setAttribute("stroke-linecap", "round");
    poly.setAttribute("stroke-linejoin", "round");
    svg.appendChild(poly);
    return svg;
  }

  createIconMoreHorizontal() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.classList.add("pagination-icon");
    const c1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    const c2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    const c3 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    c1.setAttribute("cx", "5");
    c1.setAttribute("cy", "12");
    c1.setAttribute("r", "1.5");
    c2.setAttribute("cx", "12");
    c2.setAttribute("cy", "12");
    c2.setAttribute("r", "1.5");
    c3.setAttribute("cx", "19");
    c3.setAttribute("cy", "12");
    c3.setAttribute("r", "1.5");
    svg.appendChild(c1);
    svg.appendChild(c2);
    svg.appendChild(c3);
    return svg;
  }

  buildPageRange() {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages = [];

    if (total <= 7) {
      for (let p = 1; p <= total; p++) pages.push(p);
      return pages;
    }

    const startPage = Math.max(2, current - 1);
    const endPage = Math.min(total - 1, current + 1);

    pages.push(1);

    if (startPage > 2) {
      pages.push("ellipsis-left");
    }

    for (let p = startPage; p <= endPage; p++) {
      pages.push(p);
    }

    if (endPage < total - 1) {
      pages.push("ellipsis-right");
    }

    pages.push(total);

    return pages;
  }

  render() {
    if (!this.ul) return;
    this.ul.innerHTML = "";

    // Prev
    const prevLi = document.createElement("li");
    prevLi.classList.add("pagination-item");
    const prevA = document.createElement("a");
    prevA.href = "#";
    prevA.classList.add("pagination-link", "prev");
    prevA.setAttribute("aria-label", "Go to previous page");

    if (this.currentPage === 1) {
      prevA.classList.add("disabled");
    } else {
      prevA.addEventListener("click", (e) => {
        e.preventDefault();
        this.setPage(this.currentPage - 1);
      });
    }

    prevA.appendChild(this.createIconChevronLeft());
    const prevText = document.createElement("span");
    prevText.textContent = "Previous";
    prevText.classList.add("hide-sm");
    prevA.appendChild(prevText);

    prevLi.appendChild(prevA);
    this.ul.appendChild(prevLi);

    // Pages
    const range = this.buildPageRange();

    range.forEach((item) => {
      const li = document.createElement("li");
      li.classList.add("pagination-item");

      if (typeof item === "number") {
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = String(item);
        a.classList.add("pagination-link");
        if (item === this.currentPage) {
          a.classList.add("active");
          a.setAttribute("aria-current", "page");
        }

        a.addEventListener("click", (e) => {
          e.preventDefault();
          this.setPage(item);
        });

        li.appendChild(a);
      } else if (
        item === "ellipsis-left" ||
        item === "ellipsis-right"
      ) {
        const span = document.createElement("span");
        span.classList.add("pagination-ellipsis");
        span.setAttribute("aria-hidden", "true");
        span.appendChild(this.createIconMoreHorizontal());
        li.appendChild(span);
      }

      this.ul.appendChild(li);
    });

    // Next
    const nextLi = document.createElement("li");
    nextLi.classList.add("pagination-item");
    const nextA = document.createElement("a");
    nextA.href = "#";
    nextA.classList.add("pagination-link", "next");
    nextA.setAttribute("aria-label", "Go to next page");

    if (this.currentPage === this.totalPages) {
      nextA.classList.add("disabled");
    } else {
      nextA.addEventListener("click", (e) => {
        e.preventDefault();
        this.setPage(this.currentPage + 1);
      });
    }

    const nextText = document.createElement("span");
    nextText.textContent = "Next";
    nextText.classList.add("hide-sm");
    nextA.appendChild(nextText);
    nextA.appendChild(this.createIconChevronRight());

    nextLi.appendChild(nextA);
    this.ul.appendChild(nextLi);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // 데모용 – 나중에 totalPages/currentPage만 바꿔서 재사용하면 됨
  new UIPagination({
    container: "#pagination-root",
    totalPages: 20,
    currentPage: 3,
  });
});
