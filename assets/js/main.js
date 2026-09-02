/* ==========================================================================
   Zoobiedoo Infotech — site scripts
   Vanilla JS, no dependencies. Progressive enhancement only.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };

  /* ---------------------------------------------------------------- Header */
  function initHeader() {
    var header = $('.site-header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------- Desktop dropdown menus */
  function initDropdowns() {
    var items = $$('.nav-item.has-menu');
    if (!items.length) return;
    var closeTimer;

    function closeAll(except) {
      items.forEach(function (item) {
        if (item === except) return;
        item.classList.remove('is-open');
        var t = $('.nav-link', item);
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }

    items.forEach(function (item) {
      var trigger = $('.nav-link', item);
      var panel = $('.megamenu, .dropdown', item);
      if (!trigger || !panel) return;

      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-haspopup', 'true');

      function open() {
        window.clearTimeout(closeTimer);
        closeAll(item);
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
      function close() {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }

      item.addEventListener('mouseenter', open);
      item.addEventListener('mouseleave', function () {
        closeTimer = window.setTimeout(close, 140);
      });
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        item.classList.contains('is-open') ? close() : open();
      });
      item.addEventListener('focusin', open);
      item.addEventListener('focusout', function (e) {
        if (!item.contains(e.relatedTarget)) close();
      });
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll(null);
    });
    doc.addEventListener('click', function (e) {
      if (!e.target.closest('.nav-item.has-menu')) closeAll(null);
    });
  }

  /* ----------------------------------------------------------- Mobile menu */
  function initMobileNav() {
    var toggle = $('.nav-toggle');
    var panel  = $('.mobile-nav');
    var header = $('.site-header');
    if (!toggle || !panel) return;

    function setOpen(open) {
      toggle.classList.toggle('is-active', open);
      toggle.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('is-open', open);
      doc.body.classList.toggle('is-locked', open);
      if (header) header.classList.toggle('is-open', open);
    }

    toggle.addEventListener('click', function () {
      setOpen(!panel.classList.contains('is-open'));
    });

    $$('.m-trigger', panel).forEach(function (trigger) {
      var item = trigger.closest('.m-item');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.addEventListener('click', function () {
        var open = !item.classList.contains('is-open');
        item.classList.toggle('is-open', open);
        trigger.setAttribute('aria-expanded', String(open));
      });
    });

    $$('a', panel).forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1023 && panel.classList.contains('is-open')) setOpen(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
  }

  /* ------------------------------------------------------------- Accordion */
  function initAccordions() {
    $$('.accordion').forEach(function (acc) {
      var single = acc.hasAttribute('data-single');
      var items = $$('.acc-item', acc);

      items.forEach(function (item) {
        var trigger = $('.acc-trigger', item);
        var panel = $('.acc-panel', item);
        if (!trigger || !panel) return;

        var expanded = item.classList.contains('is-open');
        trigger.setAttribute('aria-expanded', String(expanded));
        panel.style.height = expanded ? 'auto' : '0px';

        trigger.addEventListener('click', function () {
          var isOpen = item.classList.contains('is-open');
          if (single && !isOpen) {
            items.forEach(function (other) {
              if (other !== item && other.classList.contains('is-open')) collapse(other);
            });
          }
          isOpen ? collapse(item) : expand(item);
        });
      });

      function expand(item) {
        var panel = $('.acc-panel', item);
        var inner = $('.acc-panel-inner', item);
        item.classList.add('is-open');
        $('.acc-trigger', item).setAttribute('aria-expanded', 'true');
        panel.style.height = inner.offsetHeight + 'px';
        window.setTimeout(function () {
          if (item.classList.contains('is-open')) panel.style.height = 'auto';
        }, 340);
      }
      function collapse(item) {
        var panel = $('.acc-panel', item);
        var inner = $('.acc-panel-inner', item);
        panel.style.height = inner.offsetHeight + 'px';
        void panel.offsetHeight;
        item.classList.remove('is-open');
        $('.acc-trigger', item).setAttribute('aria-expanded', 'false');
        panel.style.height = '0px';
      }
    });
  }

  /* -------------------------------------------------------- Scroll reveals */
  function initReveal() {
    var targets = $$('.reveal');
    if (!targets.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* --------------------------------------------------------- Count-up stats */
  function initCounters() {
    var els = $$('[data-count]');
    if (!els.length || reduceMotion || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        run(entry.target);
      });
    }, { threshold: 0.5 });

    els.forEach(function (el) { io.observe(el); });

    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      var decimals = (String(target).split('.')[1] || '').length;
      var start = performance.now();
      var duration = 1100;

      function frame(now) {
        var p = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
  }

  /* ------------------------------------------------------------- Filtering */
  function initFilters() {
    $$('[data-filter-group]').forEach(function (group) {
      var name = group.getAttribute('data-filter-group');
      var buttons = $$('.filter-btn', group);
      var target = $('[data-filter-target="' + name + '"]');
      if (!target) return;
      var cards = $$('[data-tags]', target);
      var counter = $('[data-filter-count="' + name + '"]');
      var empty = $('[data-filter-empty="' + name + '"]');

      function apply(value) {
        var shown = 0;
        cards.forEach(function (card) {
          var tags = (card.getAttribute('data-tags') || '').split(/\s*,\s*/);
          var match = value === 'all' || tags.indexOf(value) !== -1;
          card.classList.toggle('is-hidden', !match);
          if (match) shown++;
        });
        if (counter) counter.textContent = shown;
        if (empty) empty.classList.toggle('is-hidden', shown !== 0);
      }

      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          buttons.forEach(function (b) {
            b.classList.remove('is-active');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('is-active');
          btn.setAttribute('aria-pressed', 'true');
          apply(btn.getAttribute('data-filter'));
        });
      });
    });
  }

  /* ------------------------------------------------------------------ Forms */
  function initForms() {
    $$('form[data-validate]').forEach(function (form) {
      var status = $('.form-status', form);

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var firstBad = null;

        $$('[required]', form).forEach(function (input) {
          var field = input.closest('.field') || input.closest('.checkbox');
          var valid = input.type === 'checkbox' ? input.checked : input.value.trim() !== '';
          if (valid && input.type === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
          if (field) field.classList.toggle('has-error', !valid);
          if (!valid && !firstBad) firstBad = input;
        });

        if (firstBad) {
          firstBad.focus();
          if (status) status.classList.remove('is-visible');
          return;
        }

        if (status) {
          status.classList.add('is-visible');
          status.setAttribute('role', 'status');
        }
        form.reset();
        $$('.field', form).forEach(function (f) { f.classList.remove('has-error'); });
        if (status) status.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      });

      $$('.input, .select, .textarea', form).forEach(function (input) {
        input.addEventListener('input', function () {
          var field = input.closest('.field');
          if (field) field.classList.remove('has-error');
        });
      });
    });
  }

  /* -------------------------------------------------------------- Scrollspy */
  function initScrollspy() {
    var toc = $('.toc');
    if (!toc) return;
    var links = $$('a[href^="#"]', toc);
    var sections = links.map(function (a) { return doc.getElementById(a.getAttribute('href').slice(1)); })
                        .filter(Boolean);
    if (!sections.length) return;

    function onScroll() {
      var offset = 140;
      var current = sections[0];
      sections.forEach(function (section) {
        if (section.getBoundingClientRect().top <= offset) current = section;
      });
      links.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + current.id);
      });
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------ Back to top */
  function initBackToTop() {
    var btn = $('.to-top');
    if (!btn) return;
    var onScroll = function () { btn.classList.toggle('is-visible', window.scrollY > 700); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------------------ Misc */
  function initYear() {
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  function initCopy() {
    $$('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-copy');
        var done = function () {
          var label = btn.getAttribute('aria-label');
          btn.setAttribute('aria-label', 'Copied');
          btn.classList.add('is-copied');
          window.setTimeout(function () {
            btn.setAttribute('aria-label', label);
            btn.classList.remove('is-copied');
          }, 1600);
        };
        if (navigator.clipboard) navigator.clipboard.writeText(value).then(done, function () {});
        else done();
      });
    });
  }

  /* ------------------------------------------------------------------- Boot */
  function boot() {
    initHeader();
    initDropdowns();
    initMobileNav();
    initAccordions();
    initReveal();
    initCounters();
    initFilters();
    initForms();
    initScrollspy();
    initBackToTop();
    initYear();
    initCopy();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
