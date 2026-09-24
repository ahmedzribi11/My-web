(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  // Header background on scroll
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const setMenu = (open) => {
    links.classList.toggle("open", open);
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  };
  toggle.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

  // Project filters
  const filters = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project");
  filters.forEach((btn) =>
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.toggle("active", b === btn));
      const f = btn.dataset.filter;
      projects.forEach((p) => p.classList.toggle("hidden", f !== "all" && p.dataset.cat !== f));
    })
  );

  // Animated counters (only when data-count holds a number)
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    if (Number.isNaN(target)) return;
    const start = performance.now();
    const duration = 1400;
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + (t === 1 ? "+" : "");
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Reveal on scroll
  const revealTargets = document.querySelectorAll(
    ".section-head, .card, .project, .value, .client, .about-card, .split > div, .contact-form"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach((el) => io.observe(el));

    const statsIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll("[data-count]").forEach(animateCount);
        statsIo.disconnect();
      });
    });
    const stats = document.querySelector(".stats");
    if (stats) statsIo.observe(stats);
  } else {
    revealTargets.forEach((el) => el.classList.add("visible"));
    document.querySelectorAll("[data-count]").forEach(animateCount);
  }

  // Contact form: validate, then open the visitor's mail client
  const CONTACT_EMAIL = "contact@gcg.com"; // [À remplacer par l'adresse réelle]
  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll("[required]").forEach((field) => {
      const ok = field.value.trim() !== "" && field.checkValidity();
      field.classList.toggle("invalid", !ok);
      if (!ok) valid = false;
    });
    if (!valid) {
      note.textContent = "Merci de remplir correctement les champs obligatoires.";
      note.className = "form-note err";
      return;
    }
    const d = new FormData(form);
    const body = [
      `Nom : ${d.get("nom")}`,
      `Société : ${d.get("societe") || "-"}`,
      `E-mail : ${d.get("email")}`,
      `Téléphone : ${d.get("tel") || "-"}`,
      "",
      d.get("message"),
    ].join("\n");
    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(d.get("objet"))}&body=${encodeURIComponent(body)}`;
    note.textContent = "Votre messagerie va s'ouvrir pour envoyer le message. Merci !";
    note.className = "form-note ok";
    form.reset();
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
