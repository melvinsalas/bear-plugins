/**
 * Theme Toggle Script
 * ---------------------------------------
 * Open Source under the MIT License
 * 
 * This script adds a lightweight, accessible light/dark mode toggle.
 * 
 * Features:
 *  - Detects and follows the user's system theme preference
 *  - Allows manual override (light or dark) stored in localStorage
 *  - Updates dynamically when system theme changes
 *  - Provides an accessible toggle button with SVG icons
 * 
 * Behavior:
 *  - Saves user's preference under localStorage key "theme"
 *  - Automatically applies the correct theme on page load
 *  - Falls back to system theme if no preference is stored
 */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const nav = document.querySelector("nav");
  if (!nav) return;

  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const getSystemTheme = () => (mq.matches ? "dark" : "light");
  const getSaved = () => localStorage.getItem("theme"); // "light" | "dark" | null

  const applyTheme = (theme) => {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme"); // follow system
    }
  };

  const sunIcon = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" fill="currentColor"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>`;
  const moonIcon = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M 12 2 A 10 10 0 1 0 22 12 A 7.5 7.5 0 1 1 12 2 Z"></path>
    </svg>`;

  const saved = getSaved();
  applyTheme(saved ?? null);

  const toggle = document.createElement("a");
  toggle.href = "#";
  toggle.style.marginLeft = "12px";
  toggle.id = "theme-toggle";

  const getEffectiveTheme = () => {
    const s = getSaved();
    return s ?? getSystemTheme();
  };

  const updateIcon = () => {
    const effective = getEffectiveTheme();
    toggle.innerHTML = effective === "dark" ? sunIcon : moonIcon;
    toggle.setAttribute("aria-label", effective === "dark" ? "Switch to light mode" : "Switch to dark mode");
  };

  const container = nav.querySelector("p") || nav;
  container.appendChild(toggle);
  updateIcon();

  toggle.addEventListener("click", (event) => {
    event.preventDefault();

    const system = getSystemTheme();
    const current = getEffectiveTheme();
    const next = current === "dark" ? "light" : "dark";

    applyTheme(next);

    if (next === system) {
      localStorage.removeItem("theme");
      applyTheme(null); // follow system again
    } else {
      localStorage.setItem("theme", next);
    }

    updateIcon();
  });

  mq.addEventListener("change", () => {
    if (!getSaved()) {
      applyTheme(null);
      updateIcon();
    }
  });
});
