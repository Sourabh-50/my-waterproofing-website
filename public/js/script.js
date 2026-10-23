/**
 * MY WATERPROOFING - MODERN VANILLA JAVASCRIPT
 * Fully interactive, glitch-free logic for Mobile, Tablet & Desktop
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. MOBILE DRAWER NAVIGATION & ACCESSIBILITY
  // -------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu(forceClose = false) {
    if (!hamburgerBtn || !mobileNavDrawer) return;
    const isOpen = forceClose ? false : !mobileNavDrawer.classList.contains('open');

    if (isOpen) {
      mobileNavDrawer.classList.add('open');
      hamburgerBtn.classList.add('active');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      mobileNavDrawer.classList.remove('open');
      hamburgerBtn.classList.remove('active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => toggleMobileMenu());
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMobileMenu(true));
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNavDrawer && mobileNavDrawer.classList.contains('open')) {
      toggleMobileMenu(true);
    }
  });

  // -------------------------------------------------------------------------
  // 2. STICKY HEADER & SCROLL BEHAVIOR
  // -------------------------------------------------------------------------
  const siteHeader = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header elevation
    if (siteHeader) {
      if (scrollY > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // -------------------------------------------------------------------------
  // 3. ACTIVE NAV HIGHLIGHTING VIA INTERSECTION OBSERVER
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          desktopNavLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((sec) => sectionObserver.observe(sec));
  }

  // -------------------------------------------------------------------------
  // 4. INTERACTIVE LEAKAGE PROBLEM DIAGNOSTIC TOOL
  // -------------------------------------------------------------------------
  const diagData = {
    terrace: {
      tag: 'Terrace & Roof Seepage',
      title: 'Terrace Seepage & Ceiling Damp Patches',
      desc: 'Rainwater ponding, cracked screed beds, deteriorated expansion joints, and degraded waterproofing membranes cause direct water percolation into lower floor ceilings and beams.',
      symptoms: [
        'Persistent damp patches or yellow stains on topmost flat ceilings',
        'Efflorescence (white salt deposits) and peeling ceiling paint',
        'Active water dripping during monsoon downpours in Pune',
      ],
      solution: 'Crack filling & coating with waterproofing compound engineered to protect terraces and roofs from rainwater seepage.',
      image: 'images/real-projects/real-site-terrace-crack-filling-grid.webp',
      serviceOption: 'Terrace & Roof Waterproofing',
    },
    bathroom: {
      tag: 'Concealed Bathroom Leakage',
      title: 'Bathroom & Toilet Floor Slab Seepage (No Tile Removal)',
      desc: 'Sub-floor water accumulation from faulty tile grouting, concealed pipe joints, or unsealed trap collars leaks directly to the neighbor’s ceiling below or adjacent bedroom walls.',
      symptoms: [
        'Paint peeling on adjoining bedroom or hallway skirting boards',
        'Lower floor flat complaining of dripping water from bathroom ceiling slab',
        'Persistent foul musty odour and black mould growth in grout crevices',
      ],
      solution: 'Pressure injection grouting with waterproofing compound directly into concrete voids, elastomeric joint sealing around drain traps—100% no tile breaking required.',
      image: 'images/real-projects/real-site-bathroom-after-waterproofing.webp',
      serviceOption: 'Specialist Pressure Injection Grouting for Bathroom, Toilet & Balcony Leakage',
    },
    balcony: {
      tag: 'Balcony Joint Ingress',
      title: 'Balcony Perimeter & Tile Joint Seepage',
      desc: 'Exposed to severe sun-heat cycles and heavy monsoon rains, balcony joints expand and crack, letting water penetrate into the cantilevered concrete slab.',
      symptoms: [
        'Peeling paint and rust stains on the underside of balcony slab',
        'Water seepage entering the living room floor skirting during rains',
        'Hairline cracks extending along the perimeter parapet wall',
      ],
      solution: 'Pressure injection grouting with waterproofing compound combined with crack filling & protective coating.',
      image: 'images/real-projects/real-site-balcony-pressure-injection-ports.webp',
      serviceOption: 'Balcony Leakage Treatment',
    },
    walls: {
      tag: 'External Wall Moisture',
      title: 'External Wall Cracks & Heavy Dampness',
      desc: 'Structural movement and thermal expansion cause exterior plaster cracks where wind-driven monsoon rain enters, creating deep dampness inside rooms.',
      symptoms: [
        'Extensive paint bubbling and wall plaster powdering internally',
        'Dark damp patches spreading rapidly across north-facing exterior walls',
        'Visible diagonal structural or shrinkage cracks on exterior facade',
      ],
      solution: 'Crack filling & coating with waterproofing compound to seal exterior cracks, stop rainwater percolation, and protect indoor walls.',
      image: 'images/service-external-wall.jpg',
      serviceOption: 'External Wall Crack Filling & Waterproofing',
    },
    tank: {
      tag: 'Water Storage Vessels',
      title: 'Overhead Water Tank Seepage',
      desc: 'Hydrostatic pressure causes concrete pore seepage and crack leaks, leading to water loss and dampness on the slab below.',
      symptoms: [
        'Water level dropping steadily without resident consumption',
        'Ceiling dampness directly beneath overhead water tank slab',
        'Algae accumulation and leakage visible through exterior tank walls',
      ],
      solution: 'Crack filling & coating with waterproofing compound and pressure injection grouting.',
      image: 'images/real-projects/real-site-water-tank-internal-coating.webp',
      serviceOption: 'Overhead Water Tank Waterproofing',
    },
  };

  const diagTabBtns = document.querySelectorAll('.diag-tab-btn');
  const diagBadge = document.getElementById('diagBadge');
  const diagTitle = document.getElementById('diagTitle');
  const diagDesc = document.getElementById('diagDesc');
  const diagSymptoms = document.getElementById('diagSymptoms');
  const diagSolution = document.getElementById('diagSolution');
  const diagImg = document.getElementById('diagImg');
  const diagBookBtn = document.getElementById('diagBookBtn');

  function updateDiagnostic(key) {
    const data = diagData[key];
    if (!data) return;

    if (diagBadge) diagBadge.textContent = data.tag;
    if (diagTitle) diagTitle.textContent = data.title;
    if (diagDesc) diagDesc.textContent = data.desc;
    if (diagSolution) diagSolution.textContent = data.solution;
    if (diagImg) {
      diagImg.src = data.image;
      diagImg.alt = data.title;
    }

    if (diagSymptoms) {
      diagSymptoms.innerHTML = '';
      data.symptoms.forEach((symptom) => {
        const li = document.createElement('div');
        li.className = 'diag-detail-item';
        li.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>${symptom}</span>
        `;
        diagSymptoms.appendChild(li);
      });
    }

    if (diagBookBtn) {
      diagBookBtn.setAttribute('data-preselect', data.serviceOption);
    }
  }

  diagTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      diagTabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-diag');
      updateDiagnostic(key);
    });
  });

  if (diagBookBtn) {
    diagBookBtn.addEventListener('click', () => {
      const service = diagBookBtn.getAttribute('data-preselect') || 'Pressure Injection Grouting';
      openBookingModal(service);
    });
  }

  // -------------------------------------------------------------------------
  // 5. BEFORE & AFTER INTERACTIVE IMAGE SLIDER
  // -------------------------------------------------------------------------
  const baContainer = document.getElementById('baSliderContainer');
  const baBefore = document.getElementById('baBeforeImage');
  const baHandle = document.getElementById('baSliderHandle');

  if (baContainer && baBefore && baHandle) {
    let isSliding = false;

    function setSliderPosition(xPos) {
      const rect = baContainer.getBoundingClientRect();
      let offsetX = xPos - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      baBefore.style.width = `${percentage}%`;
      baHandle.style.left = `${percentage}%`;
    }

    function onPointerMove(e) {
      if (!isSliding) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setSliderPosition(clientX);
    }

    function onPointerEnd() {
      isSliding = false;
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerEnd);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerEnd);
    }

    function onPointerStart(e) {
      isSliding = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setSliderPosition(clientX);

      window.addEventListener('mousemove', onPointerMove, { passive: false });
      window.addEventListener('mouseup', onPointerEnd);
      window.addEventListener('touchmove', onPointerMove, { passive: false });
      window.addEventListener('touchend', onPointerEnd);
    }

    baHandle.addEventListener('mousedown', onPointerStart);
    baHandle.addEventListener('touchstart', onPointerStart, { passive: true });
    baContainer.addEventListener('click', (e) => setSliderPosition(e.clientX));
  }

  // -------------------------------------------------------------------------
  // 6. INTERACTIVE COST & TIMELINE ESTIMATOR
  // -------------------------------------------------------------------------
  let selectedProperty = 'Apartment Flat';
  let selectedArea = 'Bathroom & Toilet';
  let selectedSize = '150 - 500 sq.ft';

  const propBtns = document.querySelectorAll('[data-calc-prop]');
  const areaBtns = document.querySelectorAll('[data-calc-area]');
  const sizeBtns = document.querySelectorAll('[data-calc-size]');

  const estApproach = document.getElementById('estApproach');
  const estTimeline = document.getElementById('estTimeline');
  const estWhatsAppBtn = document.getElementById('estWhatsAppBtn');

  function calculateEstimate() {
    let approach = 'Pressure Injection Grouting with Waterproofing Compound (No Tile Breaking)';
    let duration = '1 - 2 Days';

    if (selectedArea.includes('Terrace')) {
      approach = 'Crack Filling & Coating with Waterproofing Compound and Pressure Injection Grouting';
      duration = selectedSize.includes('1500+') ? '3 - 5 Days' : '2 - 3 Days';
    } else if (selectedArea.includes('Bathroom')) {
      approach = 'Non-Destructive Pressure Injection Grouting with Waterproofing Compound (Zero Tile Breaking)';
      duration = '1 Day (Quick Turnaround)';
    } else if (selectedArea.includes('Wall')) {
      approach = 'Crack Filling & Protective Coating with Waterproofing Compound';
      duration = '2 - 3 Days';
    } else if (selectedArea.includes('Tank')) {
      approach = 'Water Tank Crack Filling & Protective Coating with Waterproofing Compound';
      duration = '1 - 2 Days';
    } else if (selectedArea.includes('Balcony') || selectedArea.includes('Kitchen')) {
      approach = 'Non-Destructive Pressure Injection Grouting & Crack Filling with Waterproofing Compound';
      duration = '1 Day';
    } else if (selectedArea.includes('Basement')) {
      approach = 'Negative-Side Non-Destructive Pressure Injection Grouting & Crystalline Sealing';
      duration = '2 - 4 Days';
    } else if (selectedArea.includes('Pool')) {
      approach = 'Swimming Pool Hydrostatic Pressure Injection Grouting & Elastomeric Coating';
      duration = '3 - 5 Days';
    } else if (selectedArea.includes('Injection')) {
      approach = 'Specialist High-Pressure Injection Grouting (100% Non-Destructive, Zero Tile Breaking)';
      duration = '1 - 2 Days';
    }

    if (estApproach) estApproach.textContent = approach;
    if (estTimeline) estTimeline.textContent = duration;

    if (estWhatsAppBtn) {
      const msg = encodeURIComponent(
        `Hello MY Waterproofing! I used your online estimator for my ${selectedProperty} in Pune.\n` +
        `• Area: ${selectedArea}\n` +
        `• Size: ${selectedSize}\n` +
        `• Recommended: ${approach}\n` +
        `Please arrange a site inspection for me.`
      );
      estWhatsAppBtn.href = `https://wa.me/919822278989?text=${msg}`;
    }
  }

  propBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      propBtns.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedProperty = btn.getAttribute('data-calc-prop');
      calculateEstimate();
    });
  });

  areaBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      areaBtns.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedArea = btn.getAttribute('data-calc-area');
      calculateEstimate();
    });
  });

  sizeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = btn.getAttribute('data-calc-size');
      calculateEstimate();
    });
  });

  calculateEstimate();

  // -------------------------------------------------------------------------
  // 7. SERVICES FILTER TABS
  // -------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach((card) => {
        if (filter === 'all') {
          card.style.display = 'flex';
        } else {
          const category = card.getAttribute('data-category');
          if (category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 8. FAQS ACCORDION
  // -------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question-btn');
    const panel = item.querySelector('.faq-answer-panel');

    if (btn && panel) {
      btn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove('active');
            const otherBtn = other.querySelector('.faq-question-btn');
            const otherPanel = other.querySelector('.faq-answer-panel');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherPanel) otherPanel.style.maxHeight = null;
          }
        });

        // Toggle clicked item
        if (isActive) {
          item.classList.remove('active');
          btn.setAttribute('aria-expanded', 'false');
          panel.style.maxHeight = null;
        } else {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = `${panel.scrollHeight + 30}px`;
        }
      });
    }
  });

  // Open first FAQ by default
  if (faqItems.length > 0) {
    const firstItem = faqItems[0];
    firstItem.classList.add('active');
    const firstBtn = firstItem.querySelector('.faq-question-btn');
    const firstPanel = firstItem.querySelector('.faq-answer-panel');
    if (firstBtn) firstBtn.setAttribute('aria-expanded', 'true');
    if (firstPanel) firstPanel.style.maxHeight = `${firstPanel.scrollHeight + 30}px`;
  }

  // -------------------------------------------------------------------------
  // 9. QUICK BOOKING MODAL
  // -------------------------------------------------------------------------
  const bookingModal = document.getElementById('bookingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalServiceSelect = document.getElementById('modalServiceSelect');

  window.openBookingModal = function (preselectedService = '') {
    if (!bookingModal) return;
    if (modalServiceSelect && preselectedService) {
      modalServiceSelect.value = preselectedService;
    }
    bookingModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeBookingModal() {
    if (!bookingModal) return;
    bookingModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeBookingModal);
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeBookingModal();
    });
  }

  // Generic book triggers
  document.querySelectorAll('[data-open-modal]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const service = trigger.getAttribute('data-service') || '';
      openBookingModal(service);
    });
  });

  // -------------------------------------------------------------------------
  // 10. FORM VALIDATION & HIGH-CONVERSION DISPATCH
  // -------------------------------------------------------------------------
  function setupFormHandling(formId, alertId) {
    const form = document.getElementById(formId);
    const alertBox = document.getElementById(alertId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('[name="name"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const emailInput = form.querySelector('[name="email"]');
      const serviceInput = form.querySelector('[name="service"]');
      const locationInput = form.querySelector('[name="location"]');
      const descInput = form.querySelector('[name="description"]');
      const submitBtn = form.querySelector('button[type="submit"]');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        showFieldError(nameInput, 'Please enter your full name (at least 2 characters).');
        isValid = false;
      } else {
        clearFieldError(nameInput);
      }

      // Validate Indian Phone Number
      const phoneClean = phoneInput.value.replace(/\D/g, '');
      if (!phoneClean || !/^[6-9]\d{9}$/.test(phoneClean)) {
        showFieldError(phoneInput, 'Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).');
        isValid = false;
      } else {
        clearFieldError(phoneInput);
      }

      // Validate Email (optional or valid format)
      if (emailInput && emailInput.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
          showFieldError(emailInput, 'Please enter a valid email address.');
          isValid = false;
        } else {
          clearFieldError(emailInput);
        }
      }

      // Validate Service
      if (!serviceInput.value) {
        showFieldError(serviceInput, 'Please select the required waterproofing service.');
        isValid = false;
      } else {
        clearFieldError(serviceInput);
      }

      // Validate Location
      if (!locationInput.value.trim() || locationInput.value.trim().length < 3) {
        showFieldError(locationInput, 'Please provide your Pune locality / society name.');
        isValid = false;
      } else {
        clearFieldError(locationInput);
      }

      if (!isValid) return;

      // Show Loading State on button
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" class="spin-icon" style="animation: spin 1s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)"/>
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#ffffff"/>
        </svg>
        Confirming Inspection...
      `;

      // Format WhatsApp fallback message
      const waMsg = encodeURIComponent(
        `*NEW INSPECTION ENQUIRY - MY Waterproofing*\n\n` +
        `👤 *Name:* ${nameInput.value.trim()}\n` +
        `📞 *Phone:* ${phoneInput.value.trim()}\n` +
        `📍 *Location:* ${locationInput.value.trim()}\n` +
        `🛠️ *Service:* ${serviceInput.value}\n` +
        `📝 *Problem Details:* ${descInput ? descInput.value.trim() || 'Needs site inspection' : 'Needs site inspection'}\n\n` +
        `Please confirm available inspection slot in Pune.`
      );

      // Simulate instantaneous processing & provide direct WhatsApp link
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        if (alertBox) {
          alertBox.className = 'form-status-alert success';
          alertBox.innerHTML = `
            <div>
              <strong>✓ Inspection Request Registered!</strong><br>
              Thank you, ${nameInput.value.trim()}. Our Pune specialist is reviewing your location. You can also connect directly:
              <div style="margin-top: 8px;">
                <a href="https://wa.me/919822278989?text=${waMsg}" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm">
                  ⚡ Open in WhatsApp with These Details
                </a>
              </div>
            </div>
          `;
          alertBox.style.display = 'flex';
        }

        form.reset();
      }, 1200);
    });

    // Real-time error dismissal
    form.querySelectorAll('input, select, textarea').forEach((input) => {
      input.addEventListener('input', () => clearFieldError(input));
      input.addEventListener('change', () => clearFieldError(input));
    });
  }

  function showFieldError(input, message) {
    input.classList.add('invalid');
    let errElem = input.parentElement.querySelector('.field-error-msg');
    if (!errElem) {
      errElem = document.createElement('span');
      errElem.className = 'field-error-msg show';
      input.parentElement.appendChild(errElem);
    }
    errElem.textContent = message;
    errElem.classList.add('show');
  }

  function clearFieldError(input) {
    input.classList.remove('invalid');
    const errElem = input.parentElement.querySelector('.field-error-msg');
    if (errElem) {
      errElem.classList.remove('show');
    }
  }

  setupFormHandling('mainContactForm', 'mainFormAlert');
  setupFormHandling('modalBookingForm', 'modalFormAlert');
});
