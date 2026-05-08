/* Sai Rama Chandra — portfolio interactions */

/* ---------- progress bar + clock ---------- */
const progress = document.querySelector('.progress');
const topbar = document.querySelector('.topbar');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progress.style.width = pct + '%';
  if (topbar) topbar.classList.toggle('scrolled', h.scrollTop > 40);
}, { passive: true });

function tickClock() {
  const el = document.querySelector('.clock');
  if (!el) return;
  const d = new Date();
  const opts = { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata', hour12: false };
  el.textContent = 'HYD · ' + d.toLocaleTimeString('en-GB', opts) + ' IST';
}
tickClock(); setInterval(tickClock, 30000);

/* ---------- reveal-on-scroll ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal, .signature').forEach(el => io.observe(el));

/* ---------- terminal typewriter ---------- */
const termLines = [
  { html: '<span class="prompt">~/portfolio</span> $ cat skills.json', delay: 0 },
  { html: '<span class="com">// stack v2026</span>', delay: 380 },
  { html: '{', delay: 100 },
  { html: '  <span class="key">"languages"</span>: [<span class="str">"python"</span>, <span class="str">"ts"</span>, <span class="str">"js"</span>, <span class="str">"java"</span>, <span class="str">"c"</span>],', delay: 240 },
  { html: '  <span class="key">"backend"</span>: [<span class="str">"fastapi"</span>, <span class="str">"node"</span>, <span class="str">"express"</span>, <span class="str">"strapi"</span>, <span class="str">"socket.io"</span>],', delay: 240 },
  { html: '  <span class="key">"ml"</span>: [<span class="str">"xgboost"</span>, <span class="str">"random_forest"</span>, <span class="str">"isolation_forest"</span>],', delay: 240 },
  { html: '  <span class="key">"infra"</span>: [<span class="str">"docker"</span>, <span class="str">"nginx"</span>, <span class="str">"hetzner"</span>, <span class="str">"vercel"</span>],', delay: 240 },
  { html: '  <span class="key">"likes"</span>: <span class="str">"shipping things that don\'t break at 3am"</span>', delay: 280 },
  { html: '}', delay: 160 },
  { html: '<span class="prompt">~/portfolio</span> $ <span class="cursor"></span>', delay: 220 },
];

function startTerminal(el) {
  let t = 0;
  termLines.forEach((l) => {
    t += l.delay;
    setTimeout(() => {
      const div = document.createElement('div');
      div.innerHTML = l.html;
      div.style.opacity = 0;
      div.style.transform = 'translateY(4px)';
      div.style.transition = 'opacity 0.25s, transform 0.25s';
      el.appendChild(div);
      requestAnimationFrame(() => {
        div.style.opacity = 1;
        div.style.transform = 'none';
      });
      el.scrollTop = el.scrollHeight;
    }, t);
  });
}

const termIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const body = e.target.querySelector('.terminal-body');
      if (body && !body.dataset.run) { body.dataset.run = '1'; startTerminal(body); }
      termIO.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.terminal').forEach(el => termIO.observe(el));

/* ---------- QuoteAI agent diagram animation ---------- */
function startAgentDiagram(svg) {
  const nodes = svg.querySelectorAll('.agent-node');
  let i = 0;
  setInterval(() => {
    nodes.forEach(n => n.classList.remove('active'));
    nodes[i % nodes.length].classList.add('active');
    i++;
  }, 800);

  // particle pulses along each path
  const paths = svg.querySelectorAll('.flow-line');
  paths.forEach((p, idx) => {
    const len = p.getTotalLength();
    const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    particle.setAttribute('r', '3');
    particle.setAttribute('class', 'flow-particle');
    svg.appendChild(particle);
    let s = idx * 600;
    function tick(now) {
      const t = ((now - s) / 1800) % 1;
      if (t >= 0 && t <= 1) {
        const pt = p.getPointAtLength(t * len);
        particle.setAttribute('cx', pt.x);
        particle.setAttribute('cy', pt.y);
        particle.setAttribute('opacity', t < 0.05 || t > 0.95 ? 0 : 1);
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}
const diagIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.run) {
      e.target.dataset.run = '1';
      startAgentDiagram(e.target);
      diagIO.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('svg.diagram').forEach(s => diagIO.observe(s));

/* ---------- Booking calendar — race-condition demo ---------- */
function startBooking(el) {
  const cells = el.querySelectorAll('.cell');
  let order = [3, 7, 11, 14, 18, 22, 5, 9, 16];
  let i = 0;
  setInterval(() => {
    if (i < order.length) {
      cells[order[i]].classList.remove('lock');
      cells[order[i]].classList.add('b');
      i++;
    } else {
      // simulate race condition
      const idx = 12;
      cells[idx].classList.add('lock');
      setTimeout(() => {
        cells[idx].classList.remove('lock');
        cells[idx].classList.add('b');
      }, 1200);
      i = 0;
      // reset others
      setTimeout(() => {
        cells.forEach(c => c.classList.remove('b','lock'));
      }, 6000);
    }
  }, 600);
}
const bookingIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.run) {
      e.target.dataset.run = '1';
      startBooking(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.booking-vis').forEach(el => bookingIO.observe(el));

/* ---------- DevOps diff streaming ---------- */
function startDiff(el) {
  const lines = el.querySelectorAll('.ln');
  lines.forEach((l, i) => {
    l.style.opacity = 0;
    l.style.transform = 'translateX(-6px)';
    l.style.transition = 'opacity 0.3s, transform 0.3s';
    setTimeout(() => {
      l.style.opacity = 1;
      l.style.transform = 'none';
    }, 200 + i * 130);
  });
}
const diffIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.run) {
      e.target.dataset.run = '1';
      startDiff(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.diff-vis').forEach(el => diffIO.observe(el));

/* ---------- Wave bars ---------- */
function startWave(svg) {
  // generate bars if empty
  if (!svg.querySelector('.wave-bar')) {
    const N = 60;
    const w = 600 / N - 2;
    for (let i = 0; i < N; i++) {
      const b = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      b.setAttribute('class', 'wave-bar');
      b.setAttribute('x', i * (600 / N) + 1);
      b.setAttribute('y', 45);
      b.setAttribute('width', w);
      b.setAttribute('height', 10);
      svg.appendChild(b);
    }
  }
  const bars = svg.querySelectorAll('.wave-bar');
  let phase = 0;
  function tick() {
    bars.forEach((b, i) => {
      const v = Math.abs(Math.sin(phase + i * 0.35)) * 0.6
              + Math.abs(Math.sin(phase * 0.7 + i * 0.13)) * 0.4;
      const h = 6 + v * 80;
      b.setAttribute('y', 50 - h / 2);
      b.setAttribute('height', h);
      const hot = v > 0.85;
      b.classList.toggle('hot', hot);
    });
    phase += 0.08;
    requestAnimationFrame(tick);
  }
  tick();
}
document.querySelectorAll('svg.wave').forEach(startWave);

/* ---------- Traffic graph pulse ---------- */
function startGraph(svg) {
  const edges = svg.querySelectorAll('.graph-edge');
  setInterval(() => {
    edges.forEach(e => e.classList.remove('busy'));
    const pick = Math.floor(Math.random() * edges.length);
    edges[pick].classList.add('busy');
    const pick2 = Math.floor(Math.random() * edges.length);
    edges[pick2].classList.add('busy');
  }, 700);
}
document.querySelectorAll('svg.traffic').forEach(startGraph);

/* ---------- Hero ticker typewriter ---------- */
function startTicker(el) {
  const text = el.dataset.stream || '';
  let i = 0;
  function step() {
    el.textContent = text.slice(0, i);
    i++;
    if (i > text.length) {
      setTimeout(() => { i = 0; step(); }, 3500);
    } else {
      setTimeout(step, 45 + Math.random() * 35);
    }
  }
  step();
}
document.querySelectorAll('.ticker-val[data-stream]').forEach((el, idx) => {
  setTimeout(() => startTicker(el), 600 + idx * 350);
});

/* ---------- Connect spotlight ---------- */
const connect = document.querySelector('.connect');
if (connect) {
  connect.addEventListener('mousemove', (e) => {
    const r = connect.getBoundingClientRect();
    connect.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    connect.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  });
}

/* ---------- magnetic project hover ---------- */
document.querySelectorAll('.visual').forEach(v => {
  v.addEventListener('mousemove', (e) => {
    const r = v.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    v.style.transform = `perspective(1200px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
  });
  v.addEventListener('mouseleave', () => { v.style.transform = ''; });
});
