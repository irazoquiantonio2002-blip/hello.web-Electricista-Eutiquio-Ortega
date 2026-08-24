/* ==========================================================
   ELECTRICISTA EUTIQUIO ORTEGA — Interacciones
========================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Loader ---------- */
  window.addEventListener("load", function () {
    var loader = document.getElementById("loader");
    if (!loader) return;
    setTimeout(function () { loader.classList.add("hidden"); }, 500);
  });

  /* ---------- Año en footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar: fondo al hacer scroll ---------- */
  var navbar = document.getElementById("navbar");
  function onScrollNav() {
    if (!navbar) return;
    if (window.scrollY > 40) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  }
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ---------- Menú móvil ---------- */
  var hamburger = document.getElementById("hamburger");
  var mobMenu = document.getElementById("mob-menu");
  if (hamburger && mobMenu) {
    hamburger.addEventListener("click", function () {
      var open = hamburger.classList.toggle("open");
      mobMenu.classList.toggle("open", open);
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        hamburger.classList.remove("open");
        mobMenu.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Marquee: duplicar contenido para loop infinito ---------- */
  var marqueeItems = [
    "Servicio 24/7",
    "Cargadores para Auto Eléctrico",
    "Acometidas y Medidores CFE",
    "Subestaciones Eléctricas",
    "Automatización",
    "Cerco Eléctrico con Alarma",
    "Bobinado de Motores",
    "Trámites CFE y SENER"
  ];
  var marqueeEl = document.getElementById("marquee");
  if (marqueeEl) {
    var html = "";
    for (var r = 0; r < 2; r++) {
      marqueeItems.forEach(function (item) {
        html += '<span><i class="fa-solid fa-bolt"></i>' + item + "</span>";
      });
    }
    marqueeEl.innerHTML = html;
  }

  /* ---------- Contadores animados ---------- */
  var statEls = document.querySelectorAll(".stat-num");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && statEls.length) {
    var statIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            statIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statEls.forEach(function (el) { statIO.observe(el); });
  }

  /* ---------- Hero: partículas en canvas ---------- */
  var canvas = document.getElementById("hero-canvas");
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var particles = [];
    var w, h;

    function resize() {
      var hero = document.getElementById("hero");
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    }

    function createParticles() {
      var count = Math.min(60, Math.floor((w * h) / 22000));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.8 + 0.6,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          a: Math.random() * 0.5 + 0.15
        });
      }
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,180,0," + p.a + ")";
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }

    resize();
    createParticles();
    requestAnimationFrame(tick);
    window.addEventListener("resize", function () {
      resize();
      createParticles();
    });
  }

  /* ---------- Formulario de contacto → WhatsApp ---------- */
  /* TODO: sustituir por el número real de WhatsApp del negocio (formato 521XXXXXXXXXX) */
  var WHATSAPP_NUMBER = "521XXXXXXXXXX";

  var waForm = document.getElementById("wa-form");
  if (waForm) {
    waForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("f-name").value.trim();
      var interest = document.getElementById("f-interest").value;
      var msg = document.getElementById("f-msg").value.trim();

      var text =
        "Hola, soy " + name + ". " +
        "Me interesa: " + interest + ". " +
        "Detalle: " + msg;

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }
})();
