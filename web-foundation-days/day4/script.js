// ---------- 1. Select elements ----------
const textarea = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearBtn = document.querySelector("#clear-btn");
const themeToggle = document.querySelector("#theme-toggle");

const DRAFT_KEY = "quicknotes_draft";
const THEME_KEY = "quicknotes_theme";

// ---------- 2. Restore saved draft and theme on load ----------
const savedDraft = localStorage.getItem(DRAFT_KEY);
if (savedDraft !== null) {
  textarea.value = savedDraft;
}

const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "Light mode";
} else {
  themeToggle.textContent = "Dark mode";
}

// ---------- 3. Update counts and styling helper ----------
function updateCounts() {
  const text = textarea.value;
  const length = text.length;

  // Calculate word count (splitting by whitespace and filtering empty strings)
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  charCount.textContent = `${length} / 200 characters`;
  wordCount.textContent = `${words} words`;

  // Manage warning and over classes
  charCount.classList.remove("warning", "over");
  if (length > 200) {
    charCount.classList.add("over");
  } else if (length > 180) {
    charCount.classList.add("warning");
  }
}

// Run once on page load to reflect initial content
updateCounts();

// ---------- 4. Listen for typing (input event) ----------
textarea.addEventListener("input", () => {
  updateCounts();
  localStorage.setItem(DRAFT_KEY, textarea.value);
});

// ---------- 5. Clear button & Escape key handling ----------
function clearDraft() {
  textarea.value = "";
  localStorage.removeItem(DRAFT_KEY);
  updateCounts();
  textarea.focus();
}

clearBtn.addEventListener("click", clearDraft);

textarea.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    clearDraft();
  }
});

// ---------- 6. Theme toggle functionality ----------
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");

  if (isDark) {
    themeToggle.textContent = "Light mode";
    localStorage.setItem(THEME_KEY, "dark");
  } else {
    themeToggle.textContent = "Dark mode";
    localStorage.setItem(THEME_KEY, "light");
  }
});