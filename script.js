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
// Une seule vidéo sonore à la fois
// =========================================

document.querySelectorAll(".sound-toggle").forEach(button => {
  button.addEventListener("click", () => {
    const video = button
      .closest(".video-placeholder, .about-media, .reel-media")
      ?.querySelector(".site-video");

    if (!video) return;

    // Si on active le son, couper celui des autres vidéos
    if (video.muted) {
      document.querySelectorAll(".site-video").forEach(otherVideo => {
        if (otherVideo !== video) {
          otherVideo.muted = true;

          const otherButton = otherVideo
            .closest(".video-placeholder, .about-media, .reel-media")
            ?.querySelector(".sound-toggle");

          if (otherButton) {
            const otherIcon = otherButton.querySelector(".sound-icon");
            const otherText = otherButton.querySelector(".sound-text");

            if (otherIcon) otherIcon.textContent = "🔇";
            if (otherText) otherText.textContent = "Activer le son";

            otherButton.setAttribute("aria-label", "Activer le son");
          }
        }
      });

      video.muted = false;
    } else {
      video.muted = true;
    }

    // Actualiser le bouton de la vidéo sélectionnée
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
// VIDÉOS : lecture uniquement quand visibles
// =========================================

const lazyVideos = document.querySelectorAll(".gallery-video, .site-video");

if (lazyVideos.length) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => { /* lecture bloquée : le visiteur peut cliquer */ });
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.35 });

  lazyVideos.forEach(video => videoObserver.observe(video));

  // Clic pour lecture/pause sur la galerie uniquement
  document.querySelectorAll(".gallery-video").forEach(video => {
    video.addEventListener("click", () => {
      if (video.paused) video.play();
      else video.pause();
    });
  });
}