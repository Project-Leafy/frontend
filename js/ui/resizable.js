document.addEventListener("DOMContentLoaded", () => {
  const group = document.getElementById("panel-group");
  const direction = group.dataset.direction; // "horizontal" | "vertical"

  const panels = group.querySelectorAll(".panel");
  const handle = group.querySelector(".panel-handle");

  let isDragging = false;
  let startPos = 0;

  let leftPanel = panels[0];
  let rightPanel = panels[1];

  function startDrag(e) {
    isDragging = true;
    handle.classList.add("active");

    startPos = direction === "horizontal" ? e.clientX : e.clientY;

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
  }

  function onDrag(e) {
    if (!isDragging) return;

    const currentPos = direction === "horizontal" ? e.clientX : e.clientY;
    const diff = currentPos - startPos;

    if (direction === "horizontal") {
      const leftWidth = leftPanel.offsetWidth + diff;
      const min = 50;

      if (leftWidth > min && leftWidth < group.offsetWidth - min) {
        leftPanel.style.flex = `0 0 ${leftWidth}px`;
        startPos = currentPos;
      }
    } else {
      const topHeight = leftPanel.offsetHeight + diff;
      const min = 50;

      if (topHeight > min && topHeight < group.offsetHeight - min) {
        leftPanel.style.flex = `0 0 ${topHeight}px`;
        startPos = currentPos;
      }
    }
  }

  function stopDrag() {
    isDragging = false;
    handle.classList.remove("active");

    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
  }

  handle.addEventListener("mousedown", startDrag);
});
