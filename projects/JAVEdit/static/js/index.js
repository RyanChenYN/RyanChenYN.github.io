document.addEventListener('DOMContentLoaded', () => {

  /* ── Copy BibTeX ── */
  const copyBtn = document.getElementById('copy-bibtex');
  const bibtexPre = document.getElementById('bibtex-content');
  if (copyBtn && bibtexPre) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(bibtexPre.innerText).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
      });
    });
  }

  /* ── Navbar active link on scroll ── */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.navbar-links a');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.navbar-links a[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => observer.observe(s));

  /* ── Animate stat numbers on scroll ── */
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();
      const animate = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        const val = target * ease;
        el.textContent = Math.round(val) + suffix;
        if (t < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      statObserver.unobserve(el);
    });
  }, { threshold: .5 });
  statNums.forEach(el => statObserver.observe(el));

  /* ── Category Tabs (Data Examples) ── */
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  /* ── Qualitative Comparison Viewer ── */
  const allGroups = Array.from(document.querySelectorAll('.cmp-group'));
  const prevBtn   = document.getElementById('cmp-prev');
  const nextBtn   = document.getElementById('cmp-next');
  const idxEl     = document.getElementById('cmp-idx');
  const totalEl   = document.getElementById('cmp-total');
  const instrEl   = document.querySelector('#cmp-instr span');
  const cmpTabs   = Array.from(document.querySelectorAll('.cmp-tab-btn'));

  let filteredGroups = [];
  let currentCat = 'Subject Editing';
  let currentIdx = 0;

  function filterByCat(cat) {
    return allGroups.filter(g => g.dataset.cat === cat);
  }

  function showCmpGroup(idx) {
    allGroups.forEach(g => {
      g.classList.remove('active');
      g.querySelectorAll('video').forEach(v => v.pause());
    });
    const g = filteredGroups[idx];
    if (g) g.classList.add('active');
    if (idxEl)   idxEl.textContent   = idx + 1;
    if (totalEl) totalEl.textContent = filteredGroups.length;
    if (instrEl) instrEl.textContent = g ? ('"' + (g.dataset.instr || '') + '"') : '';
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === filteredGroups.length - 1;
  }

  function switchCmpCat(cat) {
    currentCat = cat;
    filteredGroups = filterByCat(cat);
    currentIdx = 0;
    cmpTabs.forEach(t => t.classList.toggle('active', t.dataset.cmpCat === cat));
    showCmpGroup(0);
  }

  if (allGroups.length) {
    switchCmpCat('Subject Editing');

    cmpTabs.forEach(t => {
      t.addEventListener('click', () => switchCmpCat(t.dataset.cmpCat));
    });

    prevBtn && prevBtn.addEventListener('click', () => {
      if (currentIdx > 0) showCmpGroup(--currentIdx);
    });
    nextBtn && nextBtn.addEventListener('click', () => {
      if (currentIdx < filteredGroups.length - 1) showCmpGroup(++currentIdx);
    });
  }

});
