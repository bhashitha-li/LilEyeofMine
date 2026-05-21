// ── CUSTOM CURSOR ──
(function () {
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Smooth-follow ring
  (function loop() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  // Hover state on interactive elements
  const hoverSel = 'a, button, [data-modal], .masonry-item, .art-card, .filter-tab, .gallery-filter, .gallery-thumb';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) document.body.classList.remove('cursor-hover');
  });

  // Click burst
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

  // Hide/show on window enter/leave
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
})();

// ── FAT BEE FOLLOWER ──
(function () {
  const bee = document.createElement('div');
  bee.className = 'bee-follower';
  bee.innerHTML = `
    <div class="bee-body">
      <div class="bee-wing bee-wing-l"></div>
      <div class="bee-wing bee-wing-r"></div>
      <div class="bee-torso">
        <div class="bee-stripe"></div>
        <div class="bee-stripe"></div>
        <div class="bee-face">
          <div class="bee-eye"></div>
          <div class="bee-eye"></div>
        </div>
        <div class="bee-stinger"></div>
      </div>
    </div>
  `;
  document.body.appendChild(bee);

  let bx = -80, by = -80;   // bee position (very lazy follow)
  let mx = -80, my = -80;
  let facingLeft = false;
  let wobble = 0;
  let idleTimer = null;
  let isIdle = false;

  document.addEventListener('mousemove', e => {
    const prevMx = mx;
    mx = e.clientX;
    my = e.clientY;

    // Flip bee based on horizontal direction
    if (mx < prevMx - 1) facingLeft = true;
    if (mx > prevMx + 1) facingLeft = false;

    // Reset idle
    isIdle = false;
    bee.classList.remove('bee-idle');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      isIdle = true;
      bee.classList.add('bee-idle');
    }, 2500);
  });

  (function loop() {
    wobble += 0.07;

    // Bee lazily chases mouse — offset so it flies just behind & above
    const offsetX = facingLeft ? 38 : -38;
    const offsetY = -28 + Math.sin(wobble) * 5;
    const targetX = mx + offsetX;
    const targetY = my + offsetY;

    bx += (targetX - bx) * 0.045;
    by += (targetY - by) * 0.045;

    // Vertical bob
    const bob = Math.sin(wobble * 1.3) * 3;

    bee.style.left      = bx + 'px';
    bee.style.top       = (by + bob) + 'px';
    bee.style.transform = `translate(-50%, -50%) scaleX(${facingLeft ? -1 : 1})`;

    requestAnimationFrame(loop);
  })();

  // Hide on mouseleave
  document.addEventListener('mouseleave', () => bee.style.opacity = '0');
  document.addEventListener('mouseenter', () => bee.style.opacity = '1');
})();

// ── NAV SCROLL EFFECT ──
const nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));
}
