document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".input-otp");
  const slots = [...root.querySelectorAll(".input-otp-slot")];
  const hidden = root.querySelector(".input-otp-hidden");

  let index = 0;

  function updateUI() {
    const value = hidden.value;

    slots.forEach((slot, i) => {
      slot.textContent = value[i] || "";

      slot.classList.toggle("active", i === index);

      slot.querySelector(".otp-caret")?.remove();

      if (i === index && value.length === i) {
        const caret = document.createElement("div");
        caret.className = "otp-caret";
        slot.appendChild(caret);
      }
    });
  }

  function setIndex(i) {
    index = Math.max(0, Math.min(i, slots.length - 1));
    updateUI();
  }

  hidden.addEventListener("input", () => {
    let val = hidden.value.replace(/\D/g, "");
    if (val.length > 6) val = val.slice(0, 6);

    hidden.value = val;
    setIndex(val.length);
  });

  hidden.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") {
      const len = hidden.value.length;
      if (index > 0 && len === index) {
        setIndex(index - 1);
      }
    }
  });

  slots.forEach((slot, i) => {
    slot.addEventListener("click", () => {
      hidden.focus();
      setIndex(i);
    });
  });

  hidden.focus();
  updateUI();
});
