(() => {
  const intro = document.getElementById("introScreen");
  const palace = document.getElementById("palaceReveal");
  const openButton = document.getElementById("openInvitation");
  const tapHint = document.getElementById("tapHint");
  const skipIntro = document.getElementById("skipIntro");
  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const invitationContent = document.getElementById("invitationContent");
  let introStarted = false;

  function openInvitation() {
    if (introStarted) return;
    introStarted = true;
    intro.classList.add("opening");
    palace.classList.add("active");
    document.body.classList.add("locked");
    window.setTimeout(() => {
      palace.classList.add("open");
      palace.setAttribute("aria-hidden", "false");
    }, 250);
    window.setTimeout(enterWebsite, 3200);
  }
  function enterWebsite() {
    palace.classList.remove("open");
    palace.classList.remove("active");
    palace.setAttribute("aria-hidden", "true");
    intro.classList.add("dismissed");
    document.body.classList.remove("locked");
    header.classList.add("header-ready");
    invitationContent.setAttribute("tabindex", "-1");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  openButton.addEventListener("click", openInvitation);
  tapHint.addEventListener("click", openInvitation);
  skipIntro.addEventListener("click", enterWebsite);

  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "×" : "☰";
  });
  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    });
  });

  // Countdown uses the sample wedding date; change it in this file to your actual date.
  const weddingDate = new Date("2026-12-14T19:00:00+05:30").getTime();
  function updateCountdown() {
    const diff = Math.max(0, weddingDate - Date.now());
    const values = {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000)
    };
    Object.entries(values).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(value).padStart(2, "0");
    });
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Reveal elements as they enter the viewport.
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  // Highlight the active section in the navigation.
  const navLinks = [...mainNav.querySelectorAll('a[href^="#"]')];
  const sections = navLinks.map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach(section => sectionObserver.observe(section));

  // Gallery lightbox with next/previous navigation and keyboard support.
  const galleryItems = [...document.querySelectorAll(".gallery-item")];
  const lightbox = document.getElementById("lightbox");
  const lightboxPhoto = document.getElementById("lightboxPhoto");
  const lightboxCaption = document.getElementById("lightboxCaption");
  let currentPhoto = 0;
  function showPhoto(index) {
    currentPhoto = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentPhoto];
    lightboxPhoto.style.backgroundImage = getComputedStyle(item).backgroundImage;
    lightboxCaption.textContent = item.dataset.caption || "";
  }
  function openLightbox(index) {
    showPhoto(index);
    lightbox.hidden = false;
    document.body.classList.add("locked");
    document.getElementById("lightboxClose").focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("locked");
  }
  galleryItems.forEach((item, index) => item.addEventListener("click", () => openLightbox(index)));
  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev").addEventListener("click", () => showPhoto(currentPhoto - 1));
  document.getElementById("lightboxNext").addEventListener("click", () => showPhoto(currentPhoto + 1));
  lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", event => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showPhoto(currentPhoto - 1);
    if (event.key === "ArrowRight") showPhoto(currentPhoto + 1);
  });

})();