/**
 * CRAFTOS ELROI 2.0 - CORE APPLICATION CONTROLLER
 * Handles interactive flows: Auth & 2FA, Guided Tour, Calendar & Rosters, Chat & Support Desk.
 */

(function () {
  'use strict';

  // --- Clock updater for mobile status bar ---
  function updateClock() {
    const clockEl = document.getElementById('statusClock');
    if (!clockEl) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    clockEl.textContent = `${hours}:${mins}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // --- Global State ---
  const state = {
    currentFlow: 'auth', // 'auth' | 'tour' | 'app'
    currentAuthStep: 1,
    currentTourSlide: 1,
    totalTourSlides: 9,
    currentTab: 'dashboard',
    unreadCount: 2,
    deviceMode: 'mobile', // 'mobile' | 'fluid'
    selectedFile: null
  };

  // ==========================================================================
  // VIEWPORT & FLOW MANAGEMENT
  // ==========================================================================

  window.switchFlow = function (flowName) {
    state.currentFlow = flowName;

    // Update Toolbar Buttons
    document.querySelectorAll('.flow-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.flow === flowName);
    });

    // Toggle Screen Views
    const viewMap = {
      auth: 'viewAuth',
      tour: 'viewTour',
      app: 'viewApp'
    };

    document.querySelectorAll('.screen-view').forEach(view => {
      view.classList.remove('active');
    });

    const targetView = document.getElementById(viewMap[flowName]);
    if (targetView) {
      targetView.classList.add('active');
      // Scroll to top of app screen
      document.getElementById('appScreen').scrollTop = 0;
    }
  };

  // Wire up flow buttons
  document.querySelectorAll('.flow-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.switchFlow(btn.dataset.flow);
    });
  });

  // Device Switcher
  document.querySelectorAll('.device-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.device-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.dataset.device;
      state.deviceMode = mode;
      const container = document.getElementById('viewportContainer');
      if (mode === 'fluid') {
        container.classList.add('fluid-mode');
      } else {
        container.classList.remove('fluid-mode');
      }
    });
  });

  // ==========================================================================
  // FLOW 1: AUTHENTICATION & 2FA STEPPER
  // ==========================================================================

  window.nextAuthStep = function (stepNumber) {
    state.currentAuthStep = stepNumber;

    // Hide all auth cards
    document.querySelectorAll('.auth-card').forEach(card => card.classList.remove('active'));

    const targetCard = document.getElementById(`authStep${stepNumber}`);
    if (targetCard) {
      targetCard.classList.add('active');

      // Update email chip if stepping to 2
      if (stepNumber === 2) {
        const emailVal = document.getElementById('inputEmail').value;
        const display = document.getElementById('displayEmail');
        if (display && emailVal) display.textContent = emailVal;
      }

      // Auto focus TOTP if step 4
      if (stepNumber === 4) {
        setupTotpAutoAdvance();
      }
    }
  };

  window.togglePasswordVisibility = function (inputId) {
    const input = document.getElementById(inputId);
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  };

  function setupTotpAutoAdvance() {
    const digits = document.querySelectorAll('.totp-digit');
    digits.forEach((digit, idx) => {
      digit.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && idx < digits.length - 1) {
          digits[idx + 1].focus();
        }
      });
      digit.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && idx > 0) {
          digits[idx - 1].focus();
        }
      });
    });
  }

  // ==========================================================================
  // FLOW 2: GUIDED ONBOARDING TOUR (9 SLIDES)
  // ==========================================================================

  window.goToSlide = function (slideNumber) {
    if (slideNumber < 1 || slideNumber > state.totalTourSlides) return;
    state.currentTourSlide = slideNumber;

    const track = document.getElementById('tourSlideTrack');
    if (track) {
      const offsetPercent = (slideNumber - 1) * -100;
      track.style.transform = `translateX(${offsetPercent}%)`;
    }

    // Update Progress Indicator & Dots
    const progressEl = document.getElementById('tourProgressText');
    if (progressEl) progressEl.textContent = `Slide ${slideNumber} of ${state.totalTourSlides}`;

    const dots = document.querySelectorAll('.tour-dots .dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === slideNumber - 1);
    });

    // Update Next Button text on last slide
    const nextText = document.getElementById('tourNextText');
    const prevBtn = document.getElementById('tourPrevBtn');
    if (nextText) {
      nextText.textContent = slideNumber === state.totalTourSlides ? 'Enter Dashboard' : 'Next Feature';
    }
    if (prevBtn) {
      prevBtn.style.visibility = slideNumber === 1 ? 'hidden' : 'visible';
    }
  };

  window.stepTour = function (direction) {
    const nextIdx = state.currentTourSlide + direction;
    if (nextIdx > state.totalTourSlides) {
      window.switchFlow('app');
      window.showToast('Welcome to CraftOS ELROI! You are now live.');
    } else if (nextIdx >= 1) {
      window.goToSlide(nextIdx);
    }
  };

  // Initialize tour on slide 1
  window.goToSlide(1);

  // ==========================================================================
  // FLOW 3: MAIN APP NAVIGATION & TAB SWITCHING
  // ==========================================================================

  window.switchTab = function (tabName) {
    state.currentTab = tabName;

    // Update Bottom Navigation buttons
    document.querySelectorAll('.bottom-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update Tab Panels
    const tabMap = {
      dashboard: 'tabDashboard',
      rosters: 'tabRosters',
      messages: 'tabMessages',
      notifications: 'tabNotifications',
      unavailability: 'tabUnavailability',
      qualifications: 'tabQualifications',
      profile: 'tabProfile',
      library: 'tabLibrary'
    };

    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    const targetPanel = document.getElementById(tabMap[tabName]);
    if (targetPanel) {
      targetPanel.classList.add('active');
      document.getElementById('appScreen').scrollTop = 0;
    }
  };

  // Slide-in Drawer Toggle
  window.toggleDrawer = function (isOpen) {
    const drawer = document.getElementById('appDrawer');
    const overlay = document.getElementById('drawerOverlay');
    if (isOpen) {
      drawer.classList.add('active');
      overlay.classList.add('active');
    } else {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
    }
  };

  // Sync animation
  window.triggerSync = function () {
    const syncIcon = document.getElementById('syncIcon');
    if (syncIcon) {
      syncIcon.classList.add('spinning');
      setTimeout(() => {
        syncIcon.classList.remove('spinning');
        window.showToast('Rosters & shift data synchronized.');
      }, 900);
    }
  };

  // ==========================================================================
  // DASHBOARD & CALENDAR INTERACTIONS
  // ==========================================================================

  window.filterCalendarEvents = function (filterType) {
    const cells = document.querySelectorAll('.cal-cell');
    cells.forEach(cell => {
      const isRoster = cell.classList.contains('event-roster');
      const isTraining = cell.classList.contains('event-training');
      const isLeave = cell.classList.contains('event-leave');

      const pill = cell.querySelector('.event-pill');
      if (!pill) return;

      if (filterType === 'all') {
        pill.style.display = 'block';
      } else if (filterType === 'confirmed' && isRoster) {
        pill.style.display = 'block';
      } else if (filterType === 'training' && isTraining) {
        pill.style.display = 'block';
      } else if (filterType === 'leave' && isLeave) {
        pill.style.display = 'block';
      } else {
        pill.style.display = 'none';
      }
    });
    window.showToast(`Calendar filtered by: ${filterType}`);
  };

  window.openDateDetail = function (eventType, dateLabel) {
    if (eventType === 'roster') {
      window.openJobDetailModal(
        'TEST-09991',
        'PILBARA MINERALS',
        'Testing LV Appearance',
        '16th Jun – 22nd Jun 2026',
        'Boilermaker',
        '4'
      );
    } else if (eventType === 'training') {
      window.showToast(`Training event on ${dateLabel}: Hot Work & Confined Space Refresher`);
    } else if (eventType === 'leave') {
      window.showToast(`Scheduled RNR Leave: ${dateLabel}`);
    }
  };

  // ==========================================================================
  // ROSTERS MODULE
  // ==========================================================================

  window.filterRosters = function (category, element) {
    document.querySelectorAll('#tabRosters .filter-pill').forEach(pill => pill.classList.remove('active'));
    element.classList.add('active');

    const cards = document.querySelectorAll('#rosterCardsFeed .roster-card');
    cards.forEach(card => {
      const isPending = card.dataset.pending === 'true';
      if (category === 'all' || category === 'active') {
        card.style.display = 'block';
      } else if (category === 'pending') {
        card.style.display = isPending ? 'block' : 'none';
      } else if (category === 'completed') {
        card.style.display = 'none';
      }
    });
  };

  window.openJobDetailModal = function (jobCode, site, title, dates, role, daysMob) {
    document.getElementById('modalJobCode').textContent = jobCode;
    document.getElementById('modalJobTitle').textContent = title;
    document.getElementById('modalSite').textContent = site;
    document.getElementById('modalDates').textContent = dates;
    document.getElementById('modalRole').textContent = role;
    document.getElementById('modalDaysMob').textContent = `${daysMob} Days`;

    const modal = document.getElementById('jobDetailModal');
    if (modal) modal.classList.remove('hidden');
  };

  // ==========================================================================
  // MESSAGES & SUPPORT DESK
  // ==========================================================================

  window.filterThreads = function (status, element) {
    document.querySelectorAll('#tabMessages .filter-pill').forEach(pill => pill.classList.remove('active'));
    element.classList.add('active');

    const items = document.querySelectorAll('#threadsContainer .thread-item');
    items.forEach(item => {
      if (status === 'all' || item.dataset.status === status) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  };

  window.searchMessages = function (query) {
    const q = query.toLowerCase().trim();
    const items = document.querySelectorAll('#threadsContainer .thread-item');
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? 'flex' : 'none';
    });
  };

  window.openNewConversationModal = function () {
    const modal = document.getElementById('newChatModal');
    if (modal) modal.classList.remove('hidden');
  };

  window.openJobChat = function (jobCode, site, jobTitle) {
    const modal = document.getElementById('newChatModal');
    if (modal) {
      document.getElementById('chatDeptSelect').value = 'Planning';
      document.getElementById('chatCategoryInput').value = `Inquiry: ${jobCode} (${site})`;
      document.getElementById('chatMessageInput').value = `I have a question regarding my upcoming roster for ${jobCode} – ${site} (${jobTitle}).`;
      modal.classList.remove('hidden');
    }
  };

  window.submitNewConversation = function () {
    const dept = document.getElementById('chatDeptSelect').value;
    const cat = document.getElementById('chatCategoryInput').value;
    const msg = document.getElementById('chatMessageInput').value;

    window.closeModal('newChatModal');
    window.openChatThread(dept, cat, msg);
    window.showToast('Conversation started with ' + dept);
  };

  window.openChatThread = function (dept, subject, initialMsg) {
    document.getElementById('chatThreadDept').textContent = `${dept} Desk`;
    document.getElementById('chatThreadSubject').textContent = subject;
    if (initialMsg) {
      document.getElementById('outgoingInitMsg').textContent = initialMsg;
    }

    const modal = document.getElementById('chatThreadModal');
    if (modal) modal.classList.remove('hidden');
  };

  window.sendChatMessage = function () {
    const input = document.getElementById('chatTypeInput');
    const text = input.value.trim();
    if (!text) return;

    const container = document.getElementById('chatMessagesBox');
    
    // Append outgoing message bubble
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble outgoing';
    bubble.innerHTML = `
      <div class="bubble-text">${escapeHtml(text)}</div>
      <div class="bubble-meta">
        <span class="bubble-time">${timeStr}</span>
        <span class="bubble-ticks">✓</span>
      </div>
    `;
    container.appendChild(bubble);
    input.value = '';
    container.scrollTop = container.scrollHeight;

    // Simulate real-time response from Planning coordinator
    setTimeout(() => {
      const reply = document.createElement('div');
      reply.className = 'chat-bubble incoming';
      reply.innerHTML = `
        <div class="sender-name">CraftOS Support &bull; Live</div>
        <div class="bubble-text">Thanks for your message, Himalay! We've received your note and will update your file shortly.</div>
        <div class="bubble-meta"><span class="bubble-time">${timeStr}</span></div>
      `;
      container.appendChild(reply);
      container.scrollTop = container.scrollHeight;
    }, 1200);
  };

  // ==========================================================================
  // NOTIFICATIONS CENTER
  // ==========================================================================

  window.switchNotifTab = function (tabType) {
    document.getElementById('notifUnreadTab').classList.toggle('active', tabType === 'unread');
    document.getElementById('notifReadTab').classList.toggle('active', tabType === 'read');

    const unreadCards = document.querySelectorAll('.notifications-feed .unread-notif');
    if (tabType === 'read') {
      window.showToast('Displaying 51 archived notifications');
    } else {
      unreadCards.forEach(c => c.style.display = 'block');
    }
  };

  window.filterNotifs = function (cat, element) {
    document.querySelectorAll('#tabNotifications .filter-pill').forEach(pill => pill.classList.remove('active'));
    element.classList.add('active');

    const cards = document.querySelectorAll('.notifications-feed .notif-card');
    cards.forEach(card => {
      if (cat === 'all' || card.dataset.category === cat) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  };

  window.markNotifRead = function (cardId) {
    const card = document.getElementById(cardId);
    if (card) {
      card.classList.remove('unread-notif');
      card.style.borderLeft = '1px solid var(--slate-light)';
      card.querySelector('.notif-card-actions').innerHTML = `
        <span style="font-size:0.75rem; color:var(--emerald-dark); font-weight:600;">✓ Confirmed &amp; Acknowledged</span>
      `;

      state.unreadCount = Math.max(0, state.unreadCount - 1);
      updateBadgeCounts();
      window.showToast('Notification marked as read & confirmed.');
    }
  };

  window.markAllAsRead = function () {
    document.querySelectorAll('.notifications-feed .unread-notif').forEach(card => {
      card.classList.remove('unread-notif');
    });
    state.unreadCount = 0;
    updateBadgeCounts();
    window.showToast('All notifications marked as read.');
  };

  function updateBadgeCounts() {
    const bellBadge = document.getElementById('unreadBadgeCount');
    const pillBadge = document.getElementById('unreadNotifPill');
    if (bellBadge) bellBadge.textContent = state.unreadCount;
    if (pillBadge) pillBadge.textContent = state.unreadCount;
  }

  // ==========================================================================
  // UNAVAILABILITY & QUALIFICATIONS
  // ==========================================================================

  window.openNewUnavailabilityModal = function () {
    const modal = document.getElementById('unavailModal');
    if (modal) modal.classList.remove('hidden');
  };

  window.submitUnavailability = function () {
    const start = document.getElementById('unavailStartDate').value;
    const end = document.getElementById('unavailEndDate').value;
    const reason = document.getElementById('unavailReason').value;
    const notes = document.getElementById('unavailNotes').value || 'Requested via app';

    const list = document.getElementById('unavailList');
    const card = document.createElement('div');
    card.className = 'unavail-card';
    card.innerHTML = `
      <div class="unavail-card-header">
        <div class="unavail-dates">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <strong>${start} to ${end}</strong>
        </div>
        <span class="leave-tag tag-holiday">${reason}</span>
      </div>
      <div class="unavail-card-body">
        <div class="unavail-detail-row">
          <span class="detail-label">Reason:</span>
          <span class="detail-val">${reason}</span>
        </div>
        <div class="unavail-detail-row">
          <span class="detail-label">Notes:</span>
          <span class="detail-val">${escapeHtml(notes)}</span>
        </div>
      </div>
      <div class="unavail-card-footer">
        <button class="btn-icon-action text-danger" onclick="window.showToast('Leave request deleted.'); this.closest('.unavail-card').remove();">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          <span>Delete</span>
        </button>
      </div>
    `;
    list.prepend(card);
    window.closeModal('unavailModal');
    window.showToast('Unavailability leave submitted to planning.');
  };

  window.openUploadQualModal = function () {
    const modal = document.getElementById('uploadQualModal');
    if (modal) modal.classList.remove('hidden');
  };

  window.simulateFileUpload = function () {
    state.selectedFile = 'Confined_Space_Ticket_2026.pdf';
    document.getElementById('uploadFileName').textContent = '📄 Confined_Space_Ticket_2026.pdf (1.4 MB Ready)';
    window.showToast('File selected: Confined_Space_Ticket_2026.pdf');
  };

  window.submitQualUpload = function () {
    const title = document.getElementById('qualTitleInput').value;
    const expiry = document.getElementById('qualExpiryDate').value;

    window.closeModal('uploadQualModal');
    window.showToast(`Submitted '${title}' for verification by Compliance team.`);
  };

  // ==========================================================================
  // SAFETY & POLICY LIBRARY VIEWER
  // ==========================================================================

  window.openDocViewer = function (title, category, code) {
    document.getElementById('docModalTitle').textContent = title;
    document.getElementById('docModalCategory').textContent = category;
    document.getElementById('docModalCode').textContent = code;

    const modal = document.getElementById('docViewerModal');
    if (modal) modal.classList.remove('hidden');
  };

  // ==========================================================================
  // UTILITIES & GLOBAL HELPERS
  // ==========================================================================

  window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('hidden');
  };

  window.showToast = function (msg) {
    const banner = document.getElementById('appToastBanner');
    const msgEl = document.getElementById('toastMessage');
    if (banner && msgEl) {
      msgEl.textContent = msg;
      banner.classList.remove('hidden');
      clearTimeout(window._toastTimer);
      window._toastTimer = setTimeout(() => {
        banner.classList.add('hidden');
      }, 4000);
    }
  };

  window.dismissToast = function () {
    const banner = document.getElementById('appToastBanner');
    if (banner) banner.classList.add('hidden');
  };

  window.copyToClipboard = function (text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        window.showToast(`Copied to clipboard: "${text}"`);
      }).catch(() => {
        window.showToast(`Copied: ${text}`);
      });
    } else {
      window.showToast(`Copied: ${text}`);
    }
  };

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

})();
