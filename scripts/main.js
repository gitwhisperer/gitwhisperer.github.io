/* ==========================================================================
   HARSHIT TINKER - PORTFOLIO INTERACTIVITY SCRIPT (CLEAN EMOJI-FREE ENGINE)
   ========================================================================== */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. THEME SWITCHER (DARK / LIGHT MODE)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlEl = document.documentElement;

  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      htmlEl.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      htmlEl.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
    updateToggleIcon();
  }

  function toggleTheme() {
    const currentTheme = htmlEl.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleIcon();
  }

  function updateToggleIcon() {
    if (!themeToggleBtn) return;
    const isDark = htmlEl.getAttribute('data-theme') === 'dark';
    themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    themeToggleBtn.innerHTML = isDark
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
         </svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
         </svg>`;
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  initTheme();

  // --------------------------------------------------------------------------
  // 2. MOBILE NAVIGATION TOGGLE
  // --------------------------------------------------------------------------
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. BACK TO TOP BUTTON
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 4. EMAIL SPAM-PROTECTED REVEAL LINK
  // --------------------------------------------------------------------------
  const emailLinks = document.querySelectorAll('.email-link');
  emailLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const user = link.getAttribute('data-user');
      const domain = link.getAttribute('data-domain');
      if (user && domain) {
        const fullEmail = `${user}@${domain}`;
        const emailText = link.querySelector('.email-text');
        if (emailText) emailText.textContent = fullEmail;
        window.location.href = `mailto:${fullEmail}`;
      }
    });
  });

  // --------------------------------------------------------------------------
  // 5. SITE-DESIGNED FORM VALIDATION & FORMSPREE SUBMISSION
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  const errorName = document.getElementById('error-name');
  const errorEmail = document.getElementById('error-email');
  const errorMessage = document.getElementById('error-message');

  function clearErrors() {
    [nameInput, emailInput, messageInput].forEach(input => {
      if (input) input.classList.remove('invalid-input');
    });
    [errorName, errorEmail, errorMessage].forEach(err => {
      if (err) err.style.display = 'none';
    });
  }

  function validateForm() {
    clearErrors();
    let isValid = true;

    if (!nameInput || !nameInput.value.trim()) {
      if (nameInput) nameInput.classList.add('invalid-input');
      if (errorName) errorName.style.display = 'flex';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput || !emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      if (emailInput) emailInput.classList.add('invalid-input');
      if (errorEmail) errorEmail.style.display = 'flex';
      isValid = false;
    }

    if (!messageInput || !messageInput.value.trim()) {
      if (messageInput) messageInput.classList.add('invalid-input');
      if (errorMessage) errorMessage.style.display = 'flex';
      isValid = false;
    }

    return isValid;
  }

  [nameInput, emailInput, messageInput].forEach((input, index) => {
    if (input) {
      input.addEventListener('input', () => {
        input.classList.remove('invalid-input');
        const errNotice = [errorName, errorEmail, errorMessage][index];
        if (errNotice) errNotice.style.display = 'none';
      });
    }
  });

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      if (!validateForm()) {
        formStatus.hidden = false;
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Please fix the highlighted errors above before submitting.';
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message ↗';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
      }

      formStatus.hidden = false;
      formStatus.className = 'form-status';
      formStatus.textContent = 'Sending your message to Harshit Tinker...';

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          formStatus.className = 'form-status success';
          formStatus.textContent = 'Thank you! Your message has been received. Harshit will respond to your email shortly.';
          contactForm.reset();
          clearErrors();
        } else {
          const data = await response.json();
          formStatus.className = 'form-status error';
          if (data && data.errors) {
            formStatus.textContent = data.errors.map(err => err.message).join(', ');
          } else {
            formStatus.textContent = 'Oops! Problem submitting form. Please try again.';
          }
        }
      } catch (err) {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Connection error. Please check your internet connection and try again.';
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. SCROLL REVEAL OBSERVER
  // --------------------------------------------------------------------------
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.08 });

    reveals.forEach(el => revealObserver.observe(el));
  }

  // --------------------------------------------------------------------------
  // 7. OPEN MINIMALIST SUPER TIC-TAC-TOE
  // --------------------------------------------------------------------------
  const stttBoardContainer = document.getElementById('sttt-board');
  const stttTurnEl = document.getElementById('sttt-turn');
  const stttStatusEl = document.getElementById('sttt-status');
  const stttResetBtn = document.getElementById('sttt-reset');

  if (stttBoardContainer) {
    let boardState = Array.from({ length: 9 }, () => Array(9).fill(null));
    let subboardWinners = Array(9).fill(null);
    let subboardWinLines = Array(9).fill(-1);
    let globalWinLineIndex = -1;
    let activeBoard = -1; // -1 means player can pick any sub-board
    let currentPlayer = 'X';
    let gameOver = false;

    const WIN_PATTERNS = [
      [0, 1, 2], // Pattern 0: Top Row
      [3, 4, 5], // Pattern 1: Middle Row
      [6, 7, 8], // Pattern 2: Bottom Row
      [0, 3, 6], // Pattern 3: Left Col
      [1, 4, 7], // Pattern 4: Middle Col
      [2, 5, 8], // Pattern 5: Right Col
      [0, 4, 8], // Pattern 6: Diagonal Main
      [2, 4, 6]  // Pattern 7: Diagonal Anti
    ];

    function check3x3WinDetails(cells) {
      for (let p = 0; p < WIN_PATTERNS.length; p++) {
        const [a, b, c] = WIN_PATTERNS[p];
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
          return { winner: cells[a], patternIndex: p };
        }
      }
      return { winner: cells.every(c => c !== null) ? 'DRAW' : null, patternIndex: -1 };
    }

    function initSTTTBoard() {
      stttBoardContainer.innerHTML = '';
      boardState = Array.from({ length: 9 }, () => Array(9).fill(null));
      subboardWinners = Array(9).fill(null);
      subboardWinLines = Array(9).fill(-1);
      globalWinLineIndex = -1;
      activeBoard = -1;
      currentPlayer = 'X';
      gameOver = false;

      for (let b = 0; b < 9; b++) {
        const subboardEl = document.createElement('div');
        subboardEl.className = 'sttt-subboard';
        subboardEl.dataset.board = b;

        for (let c = 0; c < 9; c++) {
          const cellEl = document.createElement('div');
          cellEl.className = 'sttt-cell';
          cellEl.dataset.board = b;
          cellEl.dataset.cell = c;
          cellEl.addEventListener('click', () => handleCellClick(b, c));
          subboardEl.appendChild(cellEl);
        }

        stttBoardContainer.appendChild(subboardEl);
      }

      updateUI();
    }

    function updateUI() {
      // Highlight active subboard target
      document.querySelectorAll('.sttt-subboard').forEach((sbEl, b) => {
        sbEl.classList.remove('active-target');
        if (!gameOver && subboardWinners[b] === null && (activeBoard === -1 || activeBoard === b)) {
          sbEl.classList.add('active-target');
        }

        // Draw local animated strike line if won
        if (subboardWinLines[b] >= 0 && !sbEl.querySelector('.sttt-win-line')) {
          const lineEl = document.createElement('div');
          lineEl.className = `sttt-win-line line-pattern-${subboardWinLines[b]}`;
          sbEl.appendChild(lineEl);
        }

        // Overlay for conquered subboards
        if (subboardWinners[b] && subboardWinners[b] !== 'DRAW') {
          if (!sbEl.querySelector('.sttt-conquered')) {
            setTimeout(() => {
              if (!sbEl.querySelector('.sttt-conquered')) {
                const conqueredOverlay = document.createElement('div');
                conqueredOverlay.className = `sttt-conquered won-${subboardWinners[b]}`;
                conqueredOverlay.textContent = subboardWinners[b];
                sbEl.appendChild(conqueredOverlay);
              }
            }, 380);
          }
        }
      });

      // Draw Global Win Giant Strike Line across all 9 subboards
      if (globalWinLineIndex >= 0 && !stttBoardContainer.querySelector('.sttt-global-win-line')) {
        const globalLineEl = document.createElement('div');
        globalLineEl.className = `sttt-global-win-line global-pattern-${globalWinLineIndex}`;
        stttBoardContainer.appendChild(globalLineEl);
      }

      if (stttTurnEl) {
        if (gameOver) {
          stttTurnEl.textContent = 'MATCH COMPLETED';
          stttTurnEl.style.color = 'var(--text-main)';
        } else {
          stttTurnEl.textContent = activeBoard === -1 ? 'PLAY ANY BOARD' : `BOARD ${activeBoard + 1}`;
          stttTurnEl.style.color = 'var(--highlight-color)';
        }
      }

      if (stttStatusEl) {
        if (gameOver) {
          const globalWin = check3x3WinDetails(subboardWinners).winner;
          stttStatusEl.textContent = globalWin && globalWin !== 'DRAW' ? `VICTORY: PLAYER ${globalWin}!` : `MATCH DRAW!`;
        } else {
          stttStatusEl.textContent = currentPlayer === 'X' ? 'YOUR TURN [ X ]' : 'AI COMPUTING [ O ]...';
        }
      }
    }

    function makeMove(b, c) {
      if (gameOver || boardState[b][c] !== null || (activeBoard !== -1 && activeBoard !== b) || subboardWinners[b] !== null) {
        return false;
      }

      boardState[b][c] = currentPlayer;
      const cellEl = stttBoardContainer.querySelector(`.sttt-cell[data-board="${b}"][data-cell="${c}"]`);
      if (cellEl) {
        cellEl.textContent = currentPlayer;
        cellEl.classList.add('occupied', `val-${currentPlayer}`);
      }

      // Check sub-board win details
      const subWinDetails = check3x3WinDetails(boardState[b]);
      if (subWinDetails.winner) {
        subboardWinners[b] = subWinDetails.winner;
        subboardWinLines[b] = subWinDetails.patternIndex;
      }

      // Check global game win details
      const globalWinDetails = check3x3WinDetails(subboardWinners);
      if (globalWinDetails.winner) {
        gameOver = true;
        if (globalWinDetails.patternIndex >= 0) {
          globalWinLineIndex = globalWinDetails.patternIndex;
        }
        updateUI();
        return true;
      }

      // Determine next active board
      activeBoard = subboardWinners[c] !== null ? -1 : c;
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      updateUI();
      return true;
    }

    function handleCellClick(b, c) {
      if (currentPlayer !== 'X' || gameOver) return;

      const moved = makeMove(b, c);
      if (moved && !gameOver && currentPlayer === 'O') {
        setTimeout(makeAIMove, 350);
      }
    }

    function makeAIMove() {
      if (gameOver || currentPlayer !== 'O') return;

      let validMoves = [];
      let targetBoards = activeBoard === -1 ? [0,1,2,3,4,5,6,7,8].filter(b => subboardWinners[b] === null) : [activeBoard];

      targetBoards.forEach(b => {
        for (let c = 0; c < 9; c++) {
          if (boardState[b][c] === null) {
            validMoves.push({ b, c });
          }
        }
      });

      if (validMoves.length > 0) {
        const pick = validMoves[Math.floor(Math.random() * validMoves.length)];
        makeMove(pick.b, pick.c);
      }
    }

    if (stttResetBtn) {
      stttResetBtn.addEventListener('click', initSTTTBoard);
    }

    initSTTTBoard();
  }

})();
