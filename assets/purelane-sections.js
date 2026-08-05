(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* reveal on scroll */
  function initReveal(root) {
    var els = root.querySelectorAll('.pl-rv');
    if (!els.length) return;
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('pl-in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add('pl-in'); });
    }
  }

  /* hero product rotator */
  function initHero(root) {
    var stage = root.querySelector('[data-pl-hstage]');
    if (!stage) return;
    var slides = [].slice.call(stage.querySelectorAll('.pl-hslide'));
    var dots = [].slice.call(root.querySelectorAll('[data-pl-hdots] button'));
    if (slides.length < 2) return;
    var i = 0, timer = null;
    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, idx) { s.classList.toggle('is-active', idx === i); });
      dots.forEach(function (d, idx) { d.classList.toggle('is-active', idx === i); });
    }
    function play() { if (!timer && !reduce) timer = setInterval(function () { go(i + 1); }, 3800); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    dots.forEach(function (d, idx) {
      d.addEventListener('click', function () { stop(); go(idx); play(); });
    });
    stage.addEventListener('mouseenter', stop);
    stage.addEventListener('mouseleave', play);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { e.isIntersecting ? play() : stop(); });
      }, { threshold: 0.2 }).observe(stage);
    } else { play(); }
  }

  /* review marquee: duplicate track once so the CSS 50% loop is seamless,
     and guarantee full accessibility (no duplicate announcements) */
  function initReviews(root) {
    var track = root.querySelector('[data-pl-revtrack]');
    if (!track || track.dataset.plDuped) return;
    var clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    [].slice.call(clone.querySelectorAll('[id]')).forEach(function (el) { el.removeAttribute('id'); });
    track.parentNode.appendChild(clone);
    track.dataset.plDuped = 'true';
  }

  function boot() {
    document.querySelectorAll('.pl-scope').forEach(function (root) {
      initReveal(root);
      initHero(root);
      initReviews(root);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* re-init when the theme editor adds/removes/reorders section blocks */
  document.addEventListener('shopify:section:load', function (e) {
    var root = e.target.querySelector('.pl-scope');
    if (root) { initReveal(root); initHero(root); initReviews(root); }
  });
})();
