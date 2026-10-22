const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    menuToggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }));
  document.addEventListener("click", event => {
    if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  });
}

const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    projectCards.forEach(card => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();


// Load additional public repositories automatically from GitHub.
// Keep the three featured projects above curated; this area adds new repositories.
(async function loadGitHubProjects() {
  const grid = document.getElementById("github-projects-grid");
  const status = document.getElementById("github-projects-status");
  if (!grid || !status) return;

  const featuredNames = [
    "intelligentelectivesubjectselectionsystem",
    "fakenewsdetectionusingmachinelearning",
    "airesumescreeningsystem"
  ];
  const normalize = value => (value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
  const ignoredNames = new Set(["portfolio", ...featuredNames]);

  try {
    const response = await fetch(
      "https://api.github.com/users/MohiniNawale/repos?type=owner&sort=updated&per_page=100",
      { headers: { "Accept": "application/vnd.github+json" } }
    );
    if (!response.ok) throw new Error("GitHub returned " + response.status);
    const repositories = await response.json();
    const extraProjects = repositories.filter(repo =>
      !repo.fork &&
      !repo.archived &&
      !ignoredNames.has(normalize(repo.name)) &&
      !normalize(repo.name).includes("portfolio")
    );

    if (!extraProjects.length) {
      status.textContent = "New public GitHub repositories will appear here automatically. Add a short description and topics to each repository to make the cards more useful.";
      return;
    }

    grid.innerHTML = extraProjects.map(repo => {
      const topics = Array.isArray(repo.topics) ? repo.topics.slice(0, 4) : [];
      const tags = [repo.language, ...topics].filter(Boolean).slice(0, 5);
      const description = repo.description || "Explore this project and its source code on GitHub.";
      return `
        <article class="project-card card github-project-card">
          <div class="project-visual visual-github">
            <span class="visual-label">GITHUB REPOSITORY</span>
            <i class="fa-brands fa-github"></i>
            <span class="visual-code">${escapeHTML(repo.language || "OPEN SOURCE PROJECT")}</span>
          </div>
          <div class="project-content">
            <div class="project-meta"><span>${escapeHTML(repo.language || "PROJECT")}</span><span>UPDATED ${new Date(repo.updated_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }).toUpperCase()}</span></div>
            <h3>${escapeHTML(repo.name.replace(/[-_]/g, " "))}</h3>
            <p>${escapeHTML(description)}</p>
            <div class="tech-list">${tags.map(tag => `<span>${escapeHTML(tag)}</span>`).join("")}</div>
            <div class="project-footer">
              <span><i class="fa-solid fa-code-branch"></i> ${repo.stargazers_count} stars</span>
              <a href="${escapeHTML(repo.html_url)}" target="_blank" rel="noreferrer" aria-label="View ${escapeHTML(repo.name)} on GitHub"><i class="fa-brands fa-github"></i></a>
            </div>
          </div>
        </article>`;
    }).join("");
    status.textContent = "Showing additional public repositories from GitHub. This list refreshes automatically when you visit the portfolio.";
  } catch (error) {
    status.textContent = "GitHub projects could not load right now. You can still view all repositories on GitHub.";
    console.error("Could not load GitHub repositories:", error);
  }
})();
