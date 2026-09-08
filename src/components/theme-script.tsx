/* eslint-disable react-hooks/rules-of-hooks */
"use client";

export function ThemeScript() {
  const code = `
  (function () {
    try {
      var stored = JSON.parse(localStorage.getItem("omx-app-state") || "{}");
      var theme = (stored && stored.state && stored.state.theme) || "system";
      var dark = theme === "dark"
        || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      if (dark) document.documentElement.classList.add("dark");
    } catch (e) {}
  })();
  `;
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}