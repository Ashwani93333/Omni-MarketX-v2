"use client";

export function ThemeScript() {
  const code = `
  (function () {
    try {
      var stored = JSON.parse(localStorage.getItem("omx-app-state") || "{}");
      var theme = (stored && stored.state && stored.state.theme) || "light";
      var dark = theme === "dark"
        || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      if (dark) document.documentElement.classList.add("dark");
    } catch (e) {}
  })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}