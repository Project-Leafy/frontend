/* ================================================
   SONNER - Pure JS Toast System
================================================ */

(function () {
  // Create container if not exists
  function ensureContainer() {
    let container = document.getElementById("sonner-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "sonner-container";
      document.body.appendChild(container);
    }
    return container;
  }

  // Remove toast with animation
  function removeToast(toast) {
    toast.style.animation = "sonner-out 0.35s forwards";
    setTimeout(() => toast.remove(), 350);
  }

  // Main toast function
  window.sonner = {
    show(message, options = {}) {
      const {
        description = "",
        duration = 3000,
        type = "default", // default, success, error, warning, info
        action, // { label: "Undo", onClick() {} }
      } = options;

      const container = ensureContainer();

      // Toast element
      const toast = document.createElement("div");
      toast.className = `sonner-toast ${
        type !== "default" ? "sonner-" + type : ""
      }`;

      // Body container
      const body = document.createElement("div");
      body.className = "sonner-body";

      const title = document.createElement("div");
      title.className = "sonner-title";
      title.textContent = message;
      body.appendChild(title);

      if (description) {
        const desc = document.createElement("div");
        desc.className = "sonner-description";
        desc.textContent = description;
        body.appendChild(desc);
      }

      toast.appendChild(body);

      // Action button
      if (action && action.label) {
        const actBtn = document.createElement("button");
        actBtn.className = "sonner-action";
        actBtn.textContent = action.label;
        actBtn.onclick = () => {
          action.onClick?.();
          removeToast(toast);
        };
        toast.appendChild(actBtn);
      }

      // Close button
      const closeBtn = document.createElement("button");
      closeBtn.className = "sonner-close";
      closeBtn.innerHTML = "✕";
      closeBtn.onclick = () => removeToast(toast);
      toast.appendChild(closeBtn);

      container.appendChild(toast);

      // Auto-remove
      if (duration !== Infinity) {
        setTimeout(() => removeToast(toast), duration);
      }
    },

    success(msg, opt = {}) {
      this.show(msg, { ...opt, type: "success" });
    },
    error(msg, opt = {}) {
      this.show(msg, { ...opt, type: "error" });
    },
    warning(msg, opt = {}) {
      this.show(msg, { ...opt, type: "warning" });
    },
    info(msg, opt = {}) {
      this.show(msg, { ...opt, type: "info" });
    },
  };
})();
