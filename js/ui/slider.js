document.querySelectorAll(".slider").forEach((slider) => {
  const track = slider.querySelector(".slider-track");
  const range = slider.querySelector(".slider-range");
  const thumbs = slider.querySelectorAll(".slider-thumb");

  const min = Number(slider.dataset.min ?? 0);
  const max = Number(slider.dataset.max ?? 100);

  const values = thumbs.length === 2 ? [min, max] : [min];

  function updateUI() {
    thumbs.forEach((thumb, i) => {
      const pct = ((values[i] - min) / (max - min)) * 100;
      thumb.style.left = pct + "%";
    });

    if (thumbs.length === 2) {
      const start = ((values[0] - min) / (max - min)) * 100;
      const end = ((values[1] - min) / (max - min)) * 100;
      range.style.left = start + "%";
      range.style.width = end - start + "%";
    } else {
      const pct = ((values[0] - min) / (max - min)) * 100;
      range.style.width = pct + "%";
    }
  }

  function startDrag(e, index) {
    e.preventDefault();

    function move(ev) {
      const rect = track.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const pct = Math.min(1, Math.max(0, x / rect.width));
      const val = min + pct * (max - min);

      values[index] = val;

      // sort for range slider
      if (thumbs.length === 2) values.sort((a, b) => a - b);

      updateUI();
    }

    function stop() {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
    }

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
  }

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener("mousedown", (e) => startDrag(e, i));
  });

  updateUI();
});
