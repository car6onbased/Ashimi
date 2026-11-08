const stops = ['collapsed', 'half', 'full'];

function keepHome(element) {
  const home = document.createComment('');
  element.before(home);
  return destination => {
    if (destination) {
      if (element.parentElement !== destination) destination.append(element);
    } else if (home.nextSibling !== element) {
      home.after(element);
    }
  };
}

export function initMobileWorldSheet({onSpeak, onDecision}) {
  const mobile = matchMedia('(max-width: 620px)');
  const stage = document.getElementById('world-stage');
  const handle = document.getElementById('world-sheet-toggle');
  const sheet = handle.closest('.world-sheet');
  const content = document.getElementById('world-sheet-content');
  const context = document.getElementById('mobile-context-toggle');
  const speaker = document.getElementById('mobile-speaker');
  const speakerName = document.getElementById('mobile-speaker-name');
  const speakerRole = document.getElementById('mobile-speaker-role');
  const contacts = document.getElementById('mobile-contact-shortcuts');
  const conversation = document.getElementById('mobile-conversation-content');
  const conversationPanel = conversation.parentElement;
  const scrollHint = document.getElementById('mobile-conversation-scroll-hint');
  const decision = document.getElementById('mobile-decision-content');
  const decisionLink = document.getElementById('mobile-decision-link');
  const journey = document.getElementById('mobile-decision-journey');
  const progress = document.getElementById('progress');
  const caseTop = context.closest('.mobile-case-top');
  const dialogue = document.getElementById('conversation');
  const moveDetails = keepHome(content);
  const moveConversation = keepHome(dialogue);
  const moveDecision = keepHome(document.getElementById('world-decision-area'));
  const moveProgress = keepHome(progress);
  let stop = 0;
  let caseActive = false;
  let textMode = false;
  let decisionOpen = false;
  let topPanel = 'conversation';
  let speakerStarted = false;
  let conversationScroll = 0;
  let knownContacts = new Set();
  let drag = null;
  let suppressClick = false;

  const floatingCase = () => mobile.matches && caseActive && !textMode;

  function updateConversationScrollHint() {
    const maxScroll = conversation.scrollHeight - conversation.clientHeight;
    scrollHint.hidden = maxScroll <= 1;
    scrollHint.toggleAttribute('data-at-end', maxScroll - conversation.scrollTop <= 1);
  }

  function sync() {
    const phone = mobile.matches;
    const floating = floatingCase();
    const showingDecision = phone && caseActive && (textMode ? decisionOpen : stop > 0);
    const showingConversation = floating && speakerStarted && topPanel === 'conversation' && !stop;
    const showingContext = floating && topPanel === 'context' && !stop;
    if (!conversationPanel.hidden && !showingConversation) conversationScroll = conversation.scrollTop;
    moveConversation(floating ? conversation : null);
    moveDecision(phone && caseActive ? decision : null);
    moveProgress(phone && caseActive ? journey : null);
    progress.setAttribute('aria-label', phone && caseActive ? 'Decision journey' : 'Your progress');
    moveDetails(floating ? caseTop : null);
    if (!floating) {
      for (const disclosure of dialogue.querySelectorAll('.conversation-questions')) {
        disclosure.open = true;
      }
    }

    const showingDetails = floating ? showingContext : !showingDecision && (!phone || textMode || stop > 0);
    content.hidden = floating ? !showingContext : showingDecision;
    content.inert = !showingDetails;
    decision.hidden = !showingDecision;
    if (conversationPanel.hidden === showingConversation) {
      conversationPanel.hidden = !showingConversation;
      if (showingConversation) conversation.scrollTop = conversationScroll;
      updateConversationScrollHint();
    }

    sheet.dataset.stop = stops[stop];
    sheet.dataset.panel = showingDecision ? 'decision' : 'details';
    handle.setAttribute('aria-controls', floating || showingDecision ? decision.id : content.id);
    handle.setAttribute('aria-expanded', String(floating ? showingDecision : showingDetails || showingDecision));
    decisionLink.setAttribute('aria-expanded', String(showingDecision));
    context.setAttribute('aria-expanded', String(showingContext));
    speaker.setAttribute('aria-expanded', String(showingConversation));
  }

  function setStop(next) {
    const openingDecision = floatingCase() && !stop && next > 0;
    if (!next && mobile.matches && !textMode &&
        (decision.contains(document.activeElement) || sheet.contains(content) && content.contains(document.activeElement))) {
      handle.focus({preventScroll: true});
    }
    stop = next;
    sync();
    if (openingDecision) {
      stage.scrollIntoView({behavior: 'instant', block: 'start'});
      decision.scrollTop = 0;
    }
  }

  function moveStop(direction) {
    setStop(Math.max(0, Math.min(stops.length - 1, stop + direction)));
  }

  function closeDecision() {
    decisionOpen = false;
    setStop(0);
    (textMode ? decisionLink : handle).focus({preventScroll: true});
  }

  function finishDrag(event, cancelled = false) {
    if (drag?.id !== event.pointerId) return;
    const distance = drag.y - event.clientY;
    if (drag.moved) {
      suppressClick = true;
      if (!cancelled && Math.abs(distance) >= 36) moveStop(Math.sign(distance));
    }
    drag = null;
    delete sheet.dataset.dragging;
    sheet.style.removeProperty('height');
  }

  handle.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    suppressClick = false;
    drag = {id: event.pointerId, y: event.clientY, height: sheet.offsetHeight, moved: false};
    handle.setPointerCapture(event.pointerId);
  });
  handle.addEventListener('pointermove', event => {
    if (drag?.id !== event.pointerId) return;
    const distance = drag.y - event.clientY;
    if (Math.abs(distance) >= 6) drag.moved = true;
    if (!drag.moved) return;
    sheet.dataset.dragging = 'true';
    sheet.style.height = Math.max(0, drag.height + distance) + 'px';
  });
  handle.addEventListener('pointerup', event => finishDrag(event));
  handle.addEventListener('lostpointercapture', event => finishDrag(event, true));
  handle.addEventListener('click', event => {
    if (suppressClick && event.detail !== 0) return;
    setStop(floatingCase() && stop ? 0 : (stop + 1) % stops.length);
  });
  handle.addEventListener('keydown', event => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    moveStop(event.key === 'ArrowUp' ? 1 : -1);
  });
  sheet.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || event.defaultPrevented || !mobile.matches) return;
    if (floatingCase() || decisionOpen) closeDecision();
    else if (!textMode) setStop(0);
  });
  context.addEventListener('click', () => {
    topPanel = !stop && topPanel === 'context' ? null : 'context';
    setStop(0);
  });
  speaker.addEventListener('click', () => {
    if (!speakerStarted) {
      onSpeak('sam');
      return;
    }
    topPanel = !stop && topPanel === 'conversation' ? null : 'conversation';
    setStop(0);
  });
  decisionLink.addEventListener('click', () => {
    if (decisionOpen) closeDecision();
    else onDecision();
  });
  conversation.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || event.defaultPrevented) return;
    speaker.focus({preventScroll: true});
    topPanel = null;
    sync();
  });
  const conversationResize = new ResizeObserver(updateConversationScrollHint);
  conversationResize.observe(conversation);
  conversationResize.observe(dialogue);
  conversation.addEventListener('scroll', updateConversationScrollHint, {passive: true});
  content.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || event.defaultPrevented || !floatingCase()) return;
    context.focus({preventScroll: true});
    topPanel = null;
    sync();
  });

  const viewport = window.visualViewport;
  function fitViewport() {
    if (mobile.matches && viewport && viewport.scale === 1) {
      stage.style.setProperty('--map-viewport-height', viewport.height + 'px');
    } else {
      stage.style.removeProperty('--map-viewport-height');
    }
  }

  viewport?.addEventListener('resize', fitViewport);
  mobile.addEventListener('change', () => {
    fitViewport();
    sync();
  });
  fitViewport();
  sync();

  return {
    get isMobile() { return mobile.matches; },
    get isFloatingCase() { return floatingCase(); },
    setCaseActive(next) {
      if (next === caseActive) return;
      caseActive = next;
      decisionOpen = false;
      topPanel = 'conversation';
      speakerStarted = false;
      conversationScroll = 0;
      setStop(0);
    },
    openPicker() {
      if (!stop) setStop(1);
      if (mobile.matches) content.scrollTop = 0;
    },
    openConversation({resume = false} = {}) {
      decisionOpen = false;
      topPanel = 'conversation';
      setStop(0);
      if (!resume && mobile.matches) {
        conversation.scrollTop = 0;
        content.scrollTop = 0;
      }
    },
    openDecision() {
      if (!mobile.matches) return;
      if (floatingCase()) {
        if (!stop) setStop(1);
      } else if (!decisionOpen) {
        decisionOpen = true;
        setStop(1);
        stage.scrollIntoView({behavior: 'instant', block: 'start'});
      }
      decision.scrollTop = 0;
    },
    setSpeaker(person, started) {
      const changed = speakerStarted !== started;
      speakerStarted = started;
      speaker.querySelector('.person-portrait').dataset.portrait = person.id;
      speakerName.textContent = person.name;
      speakerRole.textContent = person.role;
      speaker.setAttribute('aria-label', (started ? 'Conversation with ' : 'Speak to ') + person.name);
      if (changed) sync();
    },
    setContacts(people, activeId) {
      const offset = contacts.scrollLeft;
      let introduced;
      const buttons = people.filter(person => person.id !== activeId).map(person => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'mobile-contact-shortcut';
        button.setAttribute('aria-label', 'Speak to ' + person.name + ', ' + person.role);
        const portrait = document.createElement('span');
        portrait.className = 'person-portrait';
        portrait.dataset.portrait = person.id;
        portrait.setAttribute('aria-hidden', 'true');
        button.append(portrait);
        button.onclick = () => onSpeak(person.id);
        if (!knownContacts.has(person.id)) introduced = button;
        return button;
      });
      contacts.replaceChildren(...buttons);
      contacts.hidden = !buttons.length;
      contacts.scrollLeft = offset;
      if (introduced) {
        const room = contacts.getBoundingClientRect();
        const portrait = introduced.getBoundingClientRect();
        if (portrait.right > room.right) contacts.scrollLeft += portrait.right - room.right;
        else if (portrait.left < room.left) contacts.scrollLeft -= room.left - portrait.left;
      }
      knownContacts = new Set(people.map(person => person.id));
    },
    close() {
      decisionOpen = false;
      setStop(0);
    },
    setTextMode(next) {
      textMode = next;
      sync();
    }
  };
}
