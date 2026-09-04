/* Portfolio scripts — loaded by index.updated.html */

window.onload = function () {
  const sections = document.querySelectorAll('.page-section');
  const navPills = document.querySelectorAll('.nav-pill');
  const navSearch = document.getElementById('navSearch');
  const navSearchBtn = document.getElementById('navSearchBtn');
  const navSearchFeedback = document.getElementById('navSearchFeedback');
  const navSearchWrap = document.querySelector('.nav-search');
  const themeToggle = document.getElementById('themeToggle');

  const sectionLabels = {
    home: 'Home',
    about: 'About',
    services: 'Services',
    skills: 'Skills',
    experience: 'Experience',
    review: 'Projects',
    contact: 'Contact',
  };

  const sectionMap = {
    home: 'home',
    about: 'about',
    services: 'services',
    skills: 'skills',
    experience: 'experience',
    projects: 'review',
    project: 'review',
    review: 'review',
    work: 'review',
    contact: 'contact',
    resume: 'contact',
  };

  const phraseAliases = {
    'web dev': 'skills',
    'web developer': 'about',
    'web development': 'services',
    developer: 'about',
    dev: 'skills',
    design: 'services',
    designer: 'about',
    graphics: 'skills',
    'graphic design': 'services',
    video: 'skills',
    videography: 'review',
    videos: 'review',
    photography: 'skills',
    portfolio: 'review',
    cv: 'contact',
    email: 'contact',
    phone: 'contact',
    javascript: 'skills',
    python: 'skills',
    react: 'skills',
    django: 'skills',
    wordpress: 'skills',
    coffee: 'review',
    calculator: 'review',
    grocery: 'review',
    groccery: 'review',
    finance: 'review',
    financial: 'review',
    network: 'experience',
    telecom: 'experience',
    grace: 'about',
    xhristos: 'contact',
    xristeck: 'about',
    shopping: 'experience',
    church: 'experience',
    studio: 'experience',
  };

  let contentIndex = [];
  let feedbackTimer = null;

  let projectSwipers = [];
  let swipersInitialized = false;

  function createProjectSwiper(selector) {
    const el = document.querySelector(selector);
    if (!el) return null;

    const slideCount = el.querySelectorAll('.swiper-slide').length;

    return new Swiper(selector, {
      loop: slideCount > 3,
      spaceBetween: 18,
      slidesPerView: 1,
      slidesPerGroup: 1,
      grabCursor: true,
      speed: 600,
      observer: true,
      observeParents: true,
      watchOverflow: true,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      navigation: {
        nextEl: `${selector} .swiper-button-next`,
        prevEl: `${selector} .swiper-button-prev`,
      },
      pagination: {
        el: `${selector} .swiper-pagination`,
        clickable: true,
        dynamicBullets: slideCount > 8,
      },
      breakpoints: {
        640: { slidesPerView: Math.min(2, slideCount) },
        1024: { slidesPerView: Math.min(3, slideCount) },
      },
    });
  }

  function initProjectSwipers() {
    if (!swipersInitialized) {
      projectSwipers = ['#dev', '#graphics', '#videography']
        .map(createProjectSwiper)
        .filter(Boolean);
      swipersInitialized = true;
      return;
    }

    projectSwipers.forEach((swiper) => {
      swiper.update();
      if (swiper.autoplay && !swiper.autoplay.running) {
        swiper.autoplay.start();
      }
    });
  }

  function buildContentIndex() {
    contentIndex = [];

    sections.forEach((section) => {
      const sectionId = section.id;
      if (!sectionId) return;

      const contentRoot =
        section.querySelector('.inner-panel, .hero-content, .contact-panel') || section;
      const text = contentRoot.innerText.replace(/\s+/g, ' ').trim().toLowerCase();
      const heading = section.querySelector('.section-header h2, .heading, .hero-title');
      const label = heading?.innerText.replace(/\s+/g, ' ').trim() || sectionLabels[sectionId] || sectionId;

      contentIndex.push({ sectionId, label, text });
    });
  }

  function clearSearchHighlights() {
    document.querySelectorAll('.search-highlight').forEach((mark) => {
      const parent = mark.parentNode;
      if (!parent) return;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
  }

  function getSearchTerms(query) {
    const normalized = query.trim().toLowerCase();
    const terms = normalized.split(/\s+/).filter((term) => term.length > 1);
    return terms.length ? terms : normalized ? [normalized] : [];
  }

  function highlightSearchTerms(sectionId, query) {
    clearSearchHighlights();

    const section = document.getElementById(sectionId);
    const terms = getSearchTerms(query);
    if (!section || !terms.length) return;

    const replacements = [];
    const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement?.closest('.nav-dock, .swiper-button-prev, .swiper-button-next, .swiper-pagination')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let node = walker.nextNode();
    while (node) {
      const text = node.textContent;
      const lower = text.toLowerCase();
      let matchIndex = -1;
      let matchLength = 0;

      terms.forEach((term) => {
        const index = lower.indexOf(term);
        if (index !== -1 && (matchIndex === -1 || index < matchIndex)) {
          matchIndex = index;
          matchLength = term.length;
        }
      });

      if (matchIndex !== -1) {
        replacements.push({ node, matchIndex, matchLength });
      }

      node = walker.nextNode();
    }

    let firstHighlight = null;
    replacements.forEach(({ node, matchIndex, matchLength }) => {
      const text = node.textContent;
      const before = text.slice(0, matchIndex);
      const match = text.slice(matchIndex, matchIndex + matchLength);
      const after = text.slice(matchIndex + matchLength);
      const fragment = document.createDocumentFragment();

      if (before) fragment.appendChild(document.createTextNode(before));

      const mark = document.createElement('mark');
      mark.className = 'search-highlight';
      mark.textContent = match;
      fragment.appendChild(mark);

      if (after) fragment.appendChild(document.createTextNode(after));
      node.parentNode.replaceChild(fragment, node);

      if (!firstHighlight) firstHighlight = mark;
    });

    if (firstHighlight) {
      setTimeout(() => {
        firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 120);
    }
  }

  function showSearchFeedback(message, state) {
    if (!navSearchFeedback) return;

    clearTimeout(feedbackTimer);
    navSearchFeedback.hidden = false;
    navSearchFeedback.textContent = message;
    navSearchFeedback.className = `nav-search-feedback is-${state}`;

    if (navSearchWrap) {
      navSearchWrap.classList.toggle('is-error', state === 'error');
    }

    if (state !== 'error') {
      feedbackTimer = setTimeout(() => {
        navSearchFeedback.hidden = true;
        navSearchFeedback.textContent = '';
      }, 4500);
    }
  }

  function resolveSectionByName(query) {
    const value = query.trim().toLowerCase();
    if (!value) return null;

    if (sectionMap[value]) {
      return {
        sectionId: sectionMap[value],
        message: `Opening ${sectionLabels[sectionMap[value]]}…`,
        highlight: false,
      };
    }

    for (const [key, sectionId] of Object.entries(sectionMap)) {
      if (value.includes(key)) {
        return {
          sectionId,
          message: `Opening ${sectionLabels[sectionId]}…`,
          highlight: false,
        };
      }
    }

    return null;
  }

  function resolveSectionByPhrase(query) {
    const value = query.trim().toLowerCase();
    if (!value) return null;

    if (phraseAliases[value]) {
      const sectionId = phraseAliases[value];
      return {
        sectionId,
        message: `"${query.trim()}" → ${sectionLabels[sectionId]}`,
        highlight: true,
      };
    }

    for (const [phrase, sectionId] of Object.entries(phraseAliases)) {
      if (value.includes(phrase)) {
        return {
          sectionId,
          message: `"${query.trim()}" → ${sectionLabels[sectionId]}`,
          highlight: true,
        };
      }
    }

    return null;
  }

  function searchSectionContent(query) {
    const terms = getSearchTerms(query);
    if (!terms.length) return null;

    let bestMatch = null;
    let bestScore = 0;

    contentIndex.forEach((entry) => {
      let score = 0;

      terms.forEach((term) => {
        if (entry.text.includes(term)) score += term.length;
        if (entry.label.toLowerCase().includes(term)) score += 6;
      });

      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    });

    if (!bestMatch || bestScore < 3) return null;

    return {
      sectionId: bestMatch.sectionId,
      message: `Found "${query.trim()}" in ${sectionLabels[bestMatch.sectionId]}`,
      highlight: true,
    };
  }

  function resolveSearch(query) {
    const trimmed = query.trim();
    if (!trimmed) {
      return { type: 'empty' };
    }

    const directMatch = resolveSectionByName(trimmed);
    if (directMatch) {
      return { type: 'match', ...directMatch };
    }

    const phraseMatch = resolveSectionByPhrase(trimmed);
    if (phraseMatch) {
      return { type: 'match', ...phraseMatch };
    }

    const contentMatch = searchSectionContent(trimmed);
    if (contentMatch) {
      return { type: 'match', ...contentMatch };
    }

    return {
      type: 'none',
      message: `No section found for "${trimmed}". Try: about, web dev, react, coffee shop, contact.`,
    };
  }

  function runNavSearch() {
    const query = navSearch.value;
    const result = resolveSearch(query);

    if (result.type === 'empty') {
      showSearchFeedback('Type a section name or keyword to search.', 'info');
      return;
    }

    if (result.type === 'none') {
      showSearchFeedback(result.message, 'error');
      return;
    }

    showSearchFeedback(result.message, 'success');
    showSection(result.sectionId, { fromSearch: true });

    if (result.highlight) {
      requestAnimationFrame(() => {
        setTimeout(() => highlightSearchTerms(result.sectionId, query), 150);
      });
    }
  }

  function showSection(sectionId, options = {}) {
    if (!options.fromSearch) {
      clearSearchHighlights();
      if (navSearchFeedback) {
        navSearchFeedback.hidden = true;
        navSearchFeedback.textContent = '';
      }
      if (navSearchWrap) navSearchWrap.classList.remove('is-error');
    }

    sections.forEach((section) => {
      section.classList.toggle('active', section.id === sectionId);
    });

    navPills.forEach((pill) => {
      pill.classList.toggle('active', pill.dataset.section === sectionId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (sectionId === 'review') {
      requestAnimationFrame(() => {
        setTimeout(initProjectSwipers, 80);
      });
    }
  }

  buildContentIndex();

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-section]');
    if (!trigger) return;

    event.preventDefault();
    showSection(trigger.dataset.section);
  });

  navSearchBtn.addEventListener('click', runNavSearch);

  navSearch.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      runNavSearch();
    }
  });

  navSearch.addEventListener('input', () => {
    if (navSearchWrap) navSearchWrap.classList.remove('is-error');
    if (navSearchFeedback?.classList.contains('is-error')) {
      navSearchFeedback.hidden = true;
      navSearchFeedback.textContent = '';
    }
  });

  document.body.classList.remove('light-theme');

  if (themeToggle) {
    themeToggle.disabled = true;
    themeToggle.setAttribute('aria-disabled', 'true');
  }

  window.addEventListener('scroll', () => {
    const skillsSection = document.querySelector('.skills');
    if (!skillsSection) return;

    const progressBars = document.querySelectorAll('.progress-bar');
    const scrollPosition = window.scrollY + window.innerHeight;
    const skillsSectionTop = skillsSection.offsetTop;

    if (scrollPosition > skillsSectionTop) {
      progressBars.forEach((progressBar) => {
        const width = progressBar.getAttribute('data-width') || progressBar.style.width;
        if (width) progressBar.style.width = width.includes('%') ? width : `${width}%`;
      });
    }
  });

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const senderEmail = contactForm.querySelector('[name="email"]').value.trim();
      const message = contactForm.querySelector('[name="message"]').value.trim();
      const subject = encodeURIComponent(`Portfolio message from ${senderEmail}`);
      const body = encodeURIComponent(`From: ${senderEmail}\n\n${message}`);

      window.location.href = `mailto:damzchristo@gmail.com?subject=${subject}&body=${body}`;
    });
  }
};
