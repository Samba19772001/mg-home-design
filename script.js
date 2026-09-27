const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", open);
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

document.getElementById("year").textContent = new Date().getFullYear();


// =========================================
// CONTRÔLE DU SON DES VIDÉOS
// =========================================

document.querySelectorAll(".sound-toggle").forEach(button => {

  button.addEventListener("click", () => {

    const video = button.closest(".video-placeholder, .about-media")
      ?.querySelector(".site-video");

    if (!video) return;

    video.muted = !video.muted;

    const icon = button.querySelector(".sound-icon");
    const text = button.querySelector(".sound-text");

    if (video.muted) {
      icon.textContent = "🔇";
      text.textContent = "Activer le son";
      button.setAttribute("aria-label", "Activer le son");
    } else {
      icon.textContent = "🔊";
      text.textContent = "Couper le son";
      button.setAttribute("aria-label", "Couper le son");
    }
  });

});


// =========================================
// GALERIE VIDÉO : lecture uniquement quand visible
// (évite que 6 vidéos tournent en même temps hors écran,
// ce qui pèse sur la batterie et la connexion mobile)
// =========================================

const galleryVideos = document.querySelectorAll(".gallery-video");

if (galleryVideos.length) {
  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => { /* autoplay bloqué : l'utilisateur peut cliquer */ });
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.35 });

  galleryVideos.forEach(video => {
    galleryObserver.observe(video);
    // Un clic/tap permet de relancer la lecture si le navigateur l'a bloquée
    video.addEventListener("click", () => {
      if (video.paused) video.play();
      else video.pause();
    });
  });
}