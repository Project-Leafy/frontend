const submitBtn = document.getElementById("submit-btn");

submitBtn.addEventListener("click", () => {
  validateField(
    "username-input",
    "username-msg",
    "Username must be 3~16 characters."
  );

  validateField(
    "email-input",
    "email-msg",
    "Please enter a valid email address."
  );
});

function validateField(inputId, msgId, message) {
  const input = document.getElementById(inputId);
  const msg = document.getElementById(msgId);

  if (!input.value.trim()) {
    msg.textContent = message;
    msg.classList.remove("hidden");
    return false;
  } else {
    msg.textContent = "";
    msg.classList.add("hidden");
    return true;
  }
}
