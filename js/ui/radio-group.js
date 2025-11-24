document.addEventListener("DOMContentLoaded", () => {
  const group = document.getElementById("radio-group");
  const items = group.querySelectorAll(".radio-item");
  const currentView = document.getElementById("current-value");

  let value = group.dataset.value || null;

  function updateSelected() {
    items.forEach((item) => {
      const v = item.dataset.value;
      if (v === value) item.classList.add("selected");
      else item.classList.remove("selected");
    });

    currentView.textContent = value;
  }

  // 초기 상태 반영
  updateSelected();

  items.forEach((item) => {
    item.addEventListener("click", () => {
      value = item.dataset.value;
      group.dataset.value = value;
      updateSelected();
    });
  });
});
