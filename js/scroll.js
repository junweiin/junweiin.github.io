/**
 * Scroll Effects — Reading progress, TOC highlight, header blur, mobile nav
 */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    initScrollProgress();
    initTocHighlight();
    initHeaderScroll();
    initMobileNav();
    initBackToTop();
    initImageZoom();
  });

  // ─── Reading Progress Bar ───
  function initScrollProgress() {
    var bar = document.getElementById('readingProgress');
    if (!bar) return;

    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = Math.min(progress, 100) + '%';
    }, { passive: true });
  }

  // ─── TOC Active Section Highlight ───
  function initTocHighlight() {
    var tocNav = document.querySelector('.toc-nav');
    if (!tocNav) return;

    var links = tocNav.querySelectorAll('a');
    if (links.length === 0) return;

    // Get all heading IDs from TOC links
    var headings = [];
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var id = href.replace('#', '');
      var el = document.getElementById(id);
      if (el) {
        headings.push({ el: el, link: link });
      }
    });

    if (headings.length === 0) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Remove active from all
          links.forEach(function (l) { l.classList.remove('active'); });
          // Find matching link
          for (var i = 0; i < headings.length; i++) {
            if (headings[i].el === entry.target) {
              headings[i].link.classList.add('active');
              break;
            }
          }
        }
      });
    }, {
      rootMargin: '-80px 0px -70% 0px',
      threshold: 0
    });

    headings.forEach(function (h) {
      observer.observe(h.el);
    });
  }

  // ─── Header Scroll Effect ───
  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var lastScroll = 0;

    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;

      if (scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = scrollY;
    }, { passive: true });
  }

  // ─── Mobile Nav Toggle ───
  function initMobileNav() {
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('siteNav');

    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      toggle.classList.toggle('active');
      nav.classList.toggle('open');
    });

    // Close nav when clicking a link
    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('active');
        nav.classList.remove('open');
      });
    });

    // Close nav when clicking outside
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        toggle.classList.remove('active');
        nav.classList.remove('open');
      }
    });
  }

  // ─── Back to Top Button ───
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    // Show/hide button on scroll
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    // Scroll to top on click
    btn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ─── Image Zoom ───
  function initImageZoom() {
    // Only enable on post detail pages
    var postContent = document.getElementById('postContent');
    if (!postContent) return;

    var images = postContent.querySelectorAll('img');
    if (images.length === 0) return;

    // Create overlay
    var overlay = document.createElement('div');
    overlay.className = 'image-zoom-overlay';
    overlay.innerHTML = '<img src="" alt="">';
    document.body.appendChild(overlay);

    var overlayImg = overlay.querySelector('img');

    // Add click event to each image
    images.forEach(function (img) {
      // Skip images that are already wrapped in links or have special classes
      if (img.closest('a') || img.classList.contains('no-zoom')) return;

      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var imgSrc = img.getAttribute('data-src') || img.getAttribute('src');
        if (!imgSrc) return;

        overlayImg.setAttribute('src', imgSrc);
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close overlay
    function closeOverlay() {
      overlay.classList.remove('visible');
      document.body.style.overflow = '';
    }

    overlay.addEventListener('click', closeOverlay);

    // Close on ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('visible')) {
        closeOverlay();
      }
    });
  }
})();
