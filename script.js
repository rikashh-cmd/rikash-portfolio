// EDIT THIS: replace with the GitHub username whose public repositories you want to show.
const githubUsername = "rikash-cmd";

const projectDetails = {
  portfolio: { kicker: "PERSONAL PROJECT · 2026", title: "Personal Portfolio", description: "A responsive portfolio built with semantic HTML, plain CSS, and vanilla JavaScript. It brings together my background, learning journey, and selected work, with a theme switcher, accessible project details, and live GitHub repository cards.", tags: ["HTML5", "CSS3", "VANILLA JS", "ACCESSIBILITY"], url: "#" },
  marketing: { kicker: "INTERNSHIP · ONGOING", title: "Digital Marketing Practice", description: "A growing collection of practical experience from my digital marketing internship, including research into UK business listings, content, and the ways people discover businesses online. Add a public case study link here when you have one to share.", tags: ["CONTENT", "SEO", "RESEARCH"], url: "#" },
  learning: { kicker: "EXPERIMENTS · 2026", title: "Learning Lab", description: "A space for small experiments while I build a stronger foundation in software engineering and front-end development. Replace this with a link to your learning repository or a project you have published.", tags: ["JAVASCRIPT", "PRACTICE", "LEARNING"], url: "#" }
};

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navLinks.classList.toggle("open", !isOpen);
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  themeIcon.textContent = theme === "dark" ? "☀" : "☾";
  themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  localStorage.setItem("rikash-portfolio-theme", theme);
}
applyTheme(localStorage.getItem("rikash-portfolio-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
themeToggle.addEventListener("click", () => applyTheme(document.body.classList.contains("dark") ? "light" : "dark"));

const dialog = document.getElementById("project-dialog");
document.querySelectorAll(".project-open").forEach(button => button.addEventListener("click", () => {
  const detail = projectDetails[button.dataset.project];
  document.getElementById("dialog-kicker").textContent = detail.kicker;
  document.getElementById("dialog-title").textContent = detail.title;
  document.getElementById("dialog-description").textContent = detail.description;
  const tags = document.getElementById("dialog-tags");
  tags.replaceChildren(...detail.tags.map(tag => { const span = document.createElement("span"); span.textContent = tag; return span; }));
  const link = document.getElementById("dialog-link");
  link.href = detail.url;
  link.hidden = detail.url === "#";
  dialog.showModal();
}));
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });

const progress = document.getElementById("progress-bar");
function updateProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();
document.getElementById("year").textContent = new Date().getFullYear();

async function loadRepositories() {
  const status = document.getElementById("github-status");
  const list = document.getElementById("github-repos");
  const profile = document.getElementById("github-profile");
  if (!githubUsername || githubUsername === "YOUR_GITHUB_USERNAME") {
    status.textContent = "Add your GitHub username in script.js to show your public repositories here.";
    return;
  }
  profile.href = `https://github.com/${encodeURIComponent(githubUsername)}`;
  try {
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(githubUsername)}/repos?sort=updated&per_page=4`);
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    const repositories = await response.json();
    if (!repositories.length) { status.textContent = "No public repositories found yet — check back soon."; return; }
    status.textContent = "Recently updated public repositories:";
    repositories.forEach(repo => {
      const link = document.createElement("a");
      link.className = "repo-chip"; link.href = repo.html_url; link.target = "_blank"; link.rel = "noreferrer";
      link.append(document.createTextNode(repo.name));
      if (repo.language) { const language = document.createElement("small"); language.textContent = repo.language; link.append(language); }
      list.append(link);
    });
  } catch (error) {
    status.textContent = "Could not load repositories right now. Please visit the GitHub profile directly.";
  }
}
loadRepositories();
