document.addEventListener("DOMContentLoaded", () => {
  const dialog = document.querySelector(".cmd-dialog");
  const openBtn = document.getElementById("openCommand");
  const input = document.getElementById("cmdInput");
  const list = document.getElementById("cmdList");
  const empty = document.querySelector(".cmd-empty");
  const items = [...document.querySelectorAll(".cmd-item")];

  let selectedIndex = -1;

  function openDialog() {
    dialog.setAttribute("data-open", "true");
    input.value = "";
    filter("");
    selectedIndex = -1;
    input.focus();
  }

  function closeDialog() {
    dialog.setAttribute("data-open", "false");
  }

  openBtn.addEventListener("click", openDialog);

  dialog.addEventListener("click", (e) => {
    if (e.target.classList.contains("cmd-overlay")) closeDialog();
  });

  // 키보드: ⌘K
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openDialog();
    }
    if (e.key === "Escape") closeDialog();
  });

  // 검색 기능
  input.addEventListener("input", () => {
    filter(input.value.toLowerCase());
  });

  function filter(keyword) {
    let visibleCount = 0;

    items.forEach((item) => {
      const text = item.textContent.toLowerCase();
      const match = text.includes(keyword);
      item.style.display = match ? "flex" : "none";
      if (match) visibleCount++;
    });

    empty.style.display = visibleCount === 0 ? "block" : "none";
  }

  // 키보드 네비게이션
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0) {
        items[selectedIndex].click();
      }
    }
  });

  function move(dir) {
    const visible = items.filter((i) => i.style.display !== "none");
    if (!visible.length) return;

    if (selectedIndex < 0) selectedIndex = 0;
    else selectedIndex = (selectedIndex + dir + visible.length) % visible.length;

    visible.forEach((item) => item.removeAttribute("data-selected"));
    visible[selectedIndex].setAttribute("data-selected", "true");
    visible[selectedIndex].scrollIntoView({ block: "nearest" });
  }

  // 클릭 이벤트
  items.forEach((item) => {
    item.addEventListener("click", () => {
      console.log("Command run:", item.dataset.key);
      closeDialog();
    });
  });

});
