(function () {
  "use strict";

  function lightboxShell() {
    var existing = document.querySelector("[data-lightbox]");
    if (existing) {
      return existing;
    }

    var root = document.createElement("div");
    root.className = "lightbox";
    root.setAttribute("data-lightbox", "");
    root.setAttribute("hidden", "");
    root.innerHTML =
      '<div class="lightbox-inner" role="dialog" aria-modal="true" aria-label="Image viewer">' +
      '<img alt="">' +
      '<div class="lightbox-toolbar">' +
      '<button type="button" data-lightbox-prev>Prev</button>' +
      '<span class="lightbox-caption" data-lightbox-caption></span>' +
      '<span>' +
      '<button type="button" data-lightbox-next>Next</button> ' +
      '<button type="button" data-lightbox-close>Close</button>' +
      "</span>" +
      "</div>" +
      "</div>";
    document.body.appendChild(root);
    return root;
  }

  function setupLightbox() {
    var root = lightboxShell();
    var img = root.querySelector("img");
    var caption = root.querySelector("[data-lightbox-caption]");
    var prevBtn = root.querySelector("[data-lightbox-prev]");
    var nextBtn = root.querySelector("[data-lightbox-next]");
    var closeBtn = root.querySelector("[data-lightbox-close]");
    var group = [];
    var index = 0;

    function show(i) {
      index = i;
      var item = group[index];
      img.src = item.src;
      img.alt = item.alt || "";
      caption.textContent = item.caption || "[ " + (index + 1) + " / " + group.length + " ]";
      var many = group.length > 1;
      prevBtn.hidden = !many;
      nextBtn.hidden = !many;
    }

    function openFrom(el) {
      var carousel = el.closest("[data-carousel]");
      if (carousel) {
        group = Array.prototype.slice.call(carousel.querySelectorAll("img"));
      } else {
        group = [el];
      }
      index = Math.max(0, group.indexOf(el));
      show(index);
      root.removeAttribute("hidden");
      root.classList.add("is-open");
      closeBtn.focus();
    }

    function close() {
      root.classList.remove("is-open");
      root.setAttribute("hidden", "");
      img.removeAttribute("src");
    }

    document.addEventListener("click", function (event) {
      var target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      if (target.matches("[data-zoom]")) {
        event.preventDefault();
        openFrom(target);
      }
    });

    prevBtn.addEventListener("click", function () {
      show((index - 1 + group.length) % group.length);
    });
    nextBtn.addEventListener("click", function () {
      show((index + 1) % group.length);
    });
    closeBtn.addEventListener("click", close);
    root.addEventListener("click", function (event) {
      if (event.target === root) {
        close();
      }
    });
    document.addEventListener("keydown", function (event) {
      if (!root.classList.contains("is-open")) {
        return;
      }
      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowLeft" && group.length > 1) {
        show((index - 1 + group.length) % group.length);
      } else if (event.key === "ArrowRight" && group.length > 1) {
        show((index + 1) % group.length);
      }
    });
  }

  function setupCarousels() {
    document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
      var slides = carousel.querySelectorAll(".carousel-slide");
      var status = carousel.querySelector("[data-carousel-status]");
      var prev = carousel.querySelector("[data-carousel-prev]");
      var next = carousel.querySelector("[data-carousel-next]");
      var index = 0;

      function render() {
        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === index);
        });
        if (status) {
          status.textContent = "[ " + (index + 1) + " / " + slides.length + " ]";
        }
      }

      if (prev) {
        prev.addEventListener("click", function () {
          index = (index - 1 + slides.length) % slides.length;
          render();
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          index = (index + 1) % slides.length;
          render();
        });
      }

      render();
    });
  }

  setupCarousels();
  setupLightbox();
})();
