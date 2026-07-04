/* ===== GALLERY PAGE ===== */
document.addEventListener('DOMContentLoaded', function () {

  /* -- Gallery filter tabs -- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const noResults = document.getElementById('galleryNoResults');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.dataset.filter;
        let visible = 0;
        galleryItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.classList.remove('hidden');
            visible++;
          } else {
            item.classList.add('hidden');
          }
        });
        if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
      });
    });
  }

  /* -- Lightbox -- */
  const lightbox     = document.getElementById('lightbox');
  const lbImg        = document.getElementById('lightboxImg');
  const lbCaption    = document.getElementById('lightboxCaption');
  const lbCounter    = document.getElementById('lightboxCounter');
  const lbClose      = document.getElementById('lightboxClose');
  const lbPrev       = document.getElementById('lightboxPrev');
  const lbNext       = document.getElementById('lightboxNext');

  if (lightbox) {
    let currentIndex = 0;
    let visibleItems = [];

    function getVisible() {
      return Array.from(galleryItems).filter(el => !el.classList.contains('hidden'));
    }

    function openLightbox(index) {
      visibleItems = getVisible();
      currentIndex = index;
      showLightboxItem(currentIndex);
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    function showLightboxItem(index) {
      const item = visibleItems[index];
      const img = item.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCaption.textContent = item.dataset.caption || img.alt;
      lbCounter.textContent = (index + 1) + ' / ' + visibleItems.length;
    }

    galleryItems.forEach(item => {
      item.addEventListener('click', function () {
        visibleItems = getVisible();
        const index = visibleItems.indexOf(this);
        if (index !== -1) openLightbox(index);
      });
    });

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === this) closeLightbox();
    });

    lbPrev.addEventListener('click', function () {
      currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      showLightboxItem(currentIndex);
    });

    lbNext.addEventListener('click', function () {
      currentIndex = (currentIndex + 1) % visibleItems.length;
      showLightboxItem(currentIndex);
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'ArrowLeft')  lbPrev.click();
      if (e.key === 'ArrowRight') lbNext.click();
      if (e.key === 'Escape')     closeLightbox();
    });
  }

});

/* ========================= */

document.addEventListener('DOMContentLoaded', function () {

  /*  MOBILE NAV  */
  const hamburger       = document.getElementById('hamburger');
  const stickyHamburger = document.getElementById('stickyHamburger');
  const mobileNav       = document.getElementById('mobileNav');
  const mobileClose     = document.getElementById('mobileClose');
  const mobileOverlay   = document.getElementById('mobileOverlay');

  function openMobile()  { mobileNav.classList.add('active'); mobileOverlay.classList.add('active'); document.body.style.overflow='hidden'; }
  function closeMobile() { mobileNav.classList.remove('active'); mobileOverlay.classList.remove('active'); document.body.style.overflow=''; }

  hamburger.addEventListener('click', openMobile);
  stickyHamburger?.addEventListener('click', openMobile);
  mobileClose.addEventListener('click', closeMobile);
  mobileOverlay.addEventListener('click', closeMobile);

  /*  STICKY HEADER  */
  const sticky = document.getElementById('stickyHeader');
  window.addEventListener('scroll', function () {
    sticky.classList.toggle('visible', window.scrollY > 200);
  });

  /*  HERO SLIDESHOW  */
  const slides = document.querySelectorAll('.hero-slider .slide');
  const dots   = document.querySelectorAll('.slider-dot');
  let current  = 0;
  let timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  document.getElementById('prevSlide').addEventListener('click', () => goTo(current - 1));
  document.getElementById('nextSlide').addEventListener('click', () => goTo(current + 1));
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.slide)));
  timer = setInterval(() => goTo(current + 1), 5000);

  /*  SEARCH  */
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose   = document.getElementById('searchClose');
  searchClose.addEventListener('click', () => searchOverlay.classList.remove('active'));
  searchOverlay.addEventListener('click', function(e) { if(e.target===this) this.classList.remove('active'); });

  /*  SCROLL ANIMATIONS  */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; } });
  }, { threshold: 0.1 });

  document.querySelectorAll('.vmv-card, .notice-card, .stat').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    observer.observe(el);
  });

});
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn     = document.getElementById('searchBtn');
    const searchBox     = document.getElementById('searchBox');
    const searchInput   = document.getElementById('searchBoxInput');
    const searchBoxBtn  = document.getElementById('searchBoxBtn');
    const searchResults = document.getElementById('searchBoxResults');
    if (!searchBtn || !searchBox || !searchInput) return;

    // Toggle search box visibility when clicking search icon
    searchBtn.addEventListener('click', function() {
        searchBox.classList.toggle('active');
        if (searchBox.classList.contains('active')) {
            searchInput.focus();
        }
    });

    // Close search box when clicking outside
    document.addEventListener('click', function(event) {
        if (!searchBox.contains(event.target) && event.target !== searchBtn) {
            searchBox.classList.remove('active');
        }
    });

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function renderResults(results, query) {
        if (!results.length) {
            searchResults.innerHTML = '<p class="search-box-empty">No results for &ldquo;' + escapeHtml(query) + '&rdquo;</p>';
            return;
        }
        searchResults.innerHTML = results.map(function(r) {
            return '<a class="search-box-result" href="' + r.url + '">' +
                     '<strong>' + escapeHtml(r.title) + '</strong>' +
                     '<span>' + r.excerptHtml + '</span>' +
                   '</a>';
        }).join('');
    }

    let debounceTimer;
    function runSearch() {
        const query = searchInput.value.trim();
        if (!query) {
            searchResults.innerHTML = '';
            return;
        }
        fetch('/api/search?q=' + encodeURIComponent(query))
            .then(function(res) { return res.json(); })
            .then(function(data) { renderResults(data.results || [], query); })
            .catch(function() {
                searchResults.innerHTML = '<p class="search-box-empty">Search is unavailable right now.</p>';
            });
    }

    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(runSearch, 250);
    });

    if (searchBoxBtn) searchBoxBtn.addEventListener('click', runSearch);

    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            runSearch();
        }
    });
});

/* ===== CONTACT PAGE ===== */
document.addEventListener('DOMContentLoaded', function () {

  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const submitBtn    = document.getElementById('submitBtn');
  const formSuccess  = document.getElementById('formSuccess');
  const formError    = document.getElementById('formError');
  const msgArea      = document.getElementById('cf-message');
  const charCount    = document.getElementById('charCount');
  const MAX_CHARS    = 1000;

  /* Character counter */
  if (msgArea && charCount) {
    msgArea.addEventListener('input', function () {
      const len = this.value.length;
      charCount.textContent = len + ' / ' + MAX_CHARS;
      if (len > MAX_CHARS) {
        this.value = this.value.substring(0, MAX_CHARS);
        charCount.textContent = MAX_CHARS + ' / ' + MAX_CHARS;
      }
      charCount.style.color = len > MAX_CHARS * 0.9 ? '#c0392b' : '#9aa0aa';
    });
  }

  /* Inline validation helpers */
  function showErr(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }
  function clearErr(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  }
  function markField(input, valid) {
    if (!input) return;
    input.style.borderColor = valid ? '#27ae60' : '#c0392b';
  }

  /* Live clear on input */
  ['cf-name','cf-email','cf-subject','cf-message'].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function() {
        clearErr('err-' + id.replace('cf-',''));
        el.style.borderColor = '';
      });
    }
  });

  /* Form submission */
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    formSuccess.classList.remove('visible');
    formError.classList.remove('visible');

    const name    = document.getElementById('cf-name');
    const email   = document.getElementById('cf-email');
    const subject = document.getElementById('cf-subject');
    const message = document.getElementById('cf-message');
    const agree   = document.getElementById('cf-agree');
    let valid     = true;

    /* Name */
    if (!name.value.trim()) {
      showErr('err-name', 'Please enter your full name.');
      markField(name, false);
      valid = false;
    } else {
      clearErr('err-name');
      markField(name, true);
    }

    /* Email */
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRe.test(email.value.trim())) {
      showErr('err-email', 'Please enter a valid email address.');
      markField(email, false);
      valid = false;
    } else {
      clearErr('err-email');
      markField(email, true);
    }

    /* Subject */
    if (!subject.value) {
      showErr('err-subject', 'Please select a subject.');
      markField(subject, false);
      valid = false;
    } else {
      clearErr('err-subject');
      markField(subject, true);
    }

    /* Message */
    if (message.value.trim().length < 10) {
      showErr('err-message', 'Please enter a message (at least 10 characters).');
      markField(message, false);
      valid = false;
    } else {
      clearErr('err-message');
      markField(message, true);
    }

    /* Consent */
    if (!agree.checked) {
      showErr('err-agree', 'You must agree to the Terms and Privacy Policy.');
      valid = false;
    } else {
      clearErr('err-agree');
    }

    if (!valid) {
      formError.classList.add('visible');
      formError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    /* Simulate sending */
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    setTimeout(function () {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      formSuccess.classList.add('visible');
      contactForm.reset();
      if (charCount) charCount.textContent = '0 / ' + MAX_CHARS;
      ['cf-name','cf-email','cf-subject','cf-message'].forEach(function(id) {
        const el = document.getElementById(id);
        if (el) el.style.borderColor = '';
      });
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1400);
  });

});
/* ========================= */
