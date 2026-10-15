/**
 * YASHMEET PORTFOLIO - JAVASCRIPT ENGINE
 * Handles interactive cursor, Web Audio SFX, modals, showreel playback,
 * project filters, and smooth motion interactions.
 */

// --- 1. SOUND EFFECTS SYNTHESIZER (WEB AUDIO API) ---
class SoundManager {
  constructor() {
    this.enabled = true;
    this.ctx = null;
    this.initAudioContext();
  }

  initAudioContext() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.ctx = new AudioContext();
    }
  }

  playPop() {
    if (!this.enabled || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  playTick() {
    if (!this.enabled || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  playSwoosh() {
    if (!this.enabled || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

const sfx = new SoundManager();

// --- 2. CUSTOM CURSOR & CANVAS SPARKLE TRAIL ---
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');
const canvas = document.getElementById('doodleCanvas');
const ctx = canvas.getContext('2d');

let mouseX = -100;
let mouseY = -100;
let outlineX = -100;
let outlineY = -100;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const particles = [];
const PARTICLE_COLORS = ['#d4ff32', '#7b42f6', '#00d2ff', '#ff3377', '#ffffff'];

class DoodleParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 4 + 2;
    this.speedX = (Math.random() - 0.5) * 2;
    this.speedY = (Math.random() - 0.5) * 2 - 0.5;
    this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    this.alpha = 1;
    this.decay = Math.random() * 0.03 + 0.02;
    this.shape = Math.random() > 0.5 ? 'circle' : 'star';
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= this.decay;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    
    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Draw small four-pointed sparkle
      const s = this.size * 1.5;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y - s);
      ctx.quadraticCurveTo(this.x, this.y, this.x + s, this.y);
      ctx.quadraticCurveTo(this.x, this.y, this.x, this.y + s);
      ctx.quadraticCurveTo(this.x, this.y, this.x - s, this.y);
      ctx.quadraticCurveTo(this.x, this.y, this.x, this.y - s);
      ctx.fill();
    }
    ctx.restore();
  }
}

let lastParticleTime = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

  const now = performance.now();
  if (now - lastParticleTime > 45) {
    particles.push(new DoodleParticle(mouseX, mouseY));
    lastParticleTime = now;
  }
});

function animateCursorAndParticles() {
  // Smooth outline interpolation
  outlineX += (mouseX - outlineX) * 0.18;
  outlineY += (mouseY - outlineY) * 0.18;
  cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;

  // Clear and update canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].alpha <= 0) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(animateCursorAndParticles);
}
requestAnimationFrame(animateCursorAndParticles);

// Hover states for interactive elements
const interactiveSelectors = 'a, button, .project-card, .skill-item, .contact-item, .peek-mascot, .filter-chip';
document.querySelectorAll(interactiveSelectors).forEach((el) => {
  el.addEventListener('mouseenter', () => {
    document.body.classList.add('cursor-hover');
    sfx.playTick();
  });
  el.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-hover');
  });
});

// --- 3. SOUND TOGGLE BUTTON ---
const soundToggle = document.getElementById('soundToggle');
soundToggle.addEventListener('click', () => {
  const isEnabled = sfx.toggle();
  if (isEnabled) {
    soundToggle.classList.remove('muted');
    soundToggle.querySelector('.sound-icon').textContent = '🔊';
    soundToggle.querySelector('.sound-label').textContent = 'SFX: ON';
    sfx.playPop();
  } else {
    soundToggle.classList.add('muted');
    soundToggle.querySelector('.sound-icon').textContent = '🔇';
    soundToggle.querySelector('.sound-label').textContent = 'SFX: OFF';
  }
});

// --- 4. NAVBAR SCROLL & ACTIVE LINKS ---
const navbar = document.getElementById('navbar');
const navItems = document.querySelectorAll('.nav-links .nav-item');
const sections = document.querySelectorAll('section, footer');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active section spy
  let currentSection = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  navItems.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
});

// --- 5. MOBILE DRAWER ---
const menuToggle = document.getElementById('menuToggle');
const closeDrawer = document.getElementById('closeDrawer');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerItems = document.querySelectorAll('.drawer-item');

menuToggle.addEventListener('click', () => {
  mobileDrawer.classList.add('open');
  sfx.playPop();
});

closeDrawer.addEventListener('click', () => {
  mobileDrawer.classList.remove('open');
});

drawerItems.forEach((item) => {
  item.addEventListener('click', () => {
    mobileDrawer.classList.remove('open');
  });
});

// --- 6. 3D TILT EFFECT ON HERO CHARACTER ---
const heroVisual = document.getElementById('heroVisual');
const characterFrame = document.querySelector('.character-frame');

if (heroVisual && characterFrame) {
  heroVisual.addEventListener('mousemove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = -(y / rect.height) * 16;
    const rotY = (x / rect.width) * 16;
    characterFrame.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  heroVisual.addEventListener('mouseleave', () => {
    characterFrame.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

// --- 7. PROJECT DATA & FILTERING ---
const projectsData = {
  run: {
    title: 'RUN!',
    category: '2D Animation • Action Short',
    image: 'assets/run.jpg',
    client: 'Sakuga Showcase Festival',
    year: '2026',
    role: 'Lead Animator, Storyboarder, Keyframe Artist',
    tools: 'Toon Boom Harmony, After Effects, Photoshop',
    synopsis: 'A high-energy, kinetic chase sequence inspired by 90s shonen anime. Features 850 hand-drawn animation frames, fluid smears, and dynamic perspective camera moves designed to convey raw speed and determination.',
    highlights: ['850+ Tradigital Frames', 'Hand-drawn impact frames & motion smears', 'Original high-tempo electronic score mix']
  },
  daydreams: {
    title: 'DAYDREAMS',
    category: 'Motion Graphics • Lo-Fi Short',
    image: 'assets/daydreams.jpg',
    client: 'ChilledCow / Lofi Girl Collective',
    year: '2025',
    role: 'Art Director, Motion Designer, Illustrator',
    tools: 'Adobe After Effects, Photoshop, Animate',
    synopsis: 'A warm, relaxing visual poem celebrating quiet afternoons, houseplants, and nostalgic tech. The TV-headed protagonist cycles through gentle pixel glazes and breathing ambient animations in a seamless loop.',
    highlights: ['Seamless 24-second ambient loop', 'Hand-textured warm pastel color grade', 'Over 4.2M views on streaming platforms']
  },
  lost_signal: {
    title: 'LOST SIGNAL',
    category: 'Animated Short • Sci-Fi Cyberpunk',
    image: 'assets/lost_signal.jpg',
    client: 'Indie Film Lab',
    year: '2025',
    role: 'Director, Animator, VFX Compositor',
    tools: 'Toon Boom Harmony, Blender (Grease Pencil), Premiere Pro',
    synopsis: 'Set in a neon-drenched dystopia where data is oxygen, a courier sprints across glowing cyber-corridors carrying humanity\'s last analog memory drive. Blends 2D anime character line art with 3D camera projections.',
    highlights: ['Hybrid 2D/3D grease pencil integration', 'Custom glitch shaders and chromatic aberration', 'Winner: Best Animation at Neo-Tokyo Indie Fest']
  },
  groovy_tunes: {
    title: 'GROOVY TUNES',
    category: 'Music Video • Character Motion',
    image: 'assets/groovy_tunes.jpg',
    client: 'Beats & Frogs Records',
    year: '2024',
    role: 'Character Designer, Lead Animator',
    tools: 'Adobe Animate, After Effects, Logic Pro',
    synopsis: 'A delightfully bouncy music video featuring a DJ frog spinning groovy disco beats. Employs classic squashing and stretching, rhythm-synced character dances, and neon sparkle confetti.',
    highlights: ['Frame-by-frame rhythmic lip sync', 'Vibrant pop-art neon palette', 'Viral TikTok dance challenge sensation']
  }
};

// Filter pills
const filterChips = document.querySelectorAll('.filter-chip');
const projectCards = document.querySelectorAll('.project-card');

filterChips.forEach((chip) => {
  chip.addEventListener('click', () => {
    filterChips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    sfx.playTick();

    const filterVal = chip.getAttribute('data-filter');

    projectCards.forEach((card) => {
      const cat = card.getAttribute('data-category');
      if (filterVal === 'all' || cat === filterVal) {
        card.style.display = 'flex';
        card.style.animation = 'fadeInUp 0.4s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// --- 8. PROJECT DETAIL MODAL ---
const projectModal = document.getElementById('projectModal');
const projectModalContent = document.getElementById('projectModalContent');
const closeProjectModal = document.getElementById('closeProjectModal');

function openProjectDetails(projectId) {
  const p = projectsData[projectId];
  if (!p) return;

  projectModalContent.innerHTML = `
    <div class="project-modal-header">
      <h2 class="project-modal-title">${p.title}</h2>
      <div class="project-modal-tags">
        <span class="meta-tag">${p.category}</span>
        <span class="meta-tag">${p.year}</span>
      </div>
    </div>

    <div class="project-modal-banner">
      <img src="${p.image}" alt="${p.title}">
    </div>

    <div class="project-modal-grid">
      <div class="project-synopsis">
        <h4>Overview</h4>
        <p>${p.synopsis}</p>
        
        <h4>Project Highlights</h4>
        <ul style="padding-left: 20px; color: #cbd5e1; margin-bottom: 20px;">
          ${p.highlights.map(h => `<li style="margin-bottom: 6px;">${h}</li>`).join('')}
        </ul>

        <button class="btn btn-lime" id="modalPlayShowreel" style="margin-top: 10px;">
          <span>▶ Watch In Showreel</span>
        </button>
      </div>

      <div class="project-sidebar">
        <div class="project-sidebar-item">
          <div class="sidebar-label">Client / Platform</div>
          <div class="sidebar-val">${p.client}</div>
        </div>
        <div class="project-sidebar-item">
          <div class="sidebar-label">Role</div>
          <div class="sidebar-val">${p.role}</div>
        </div>
        <div class="project-sidebar-item">
          <div class="sidebar-label">Software & Tools</div>
          <div class="sidebar-val">${p.tools}</div>
        </div>
      </div>
    </div>
  `;

  projectModal.classList.add('active');
  sfx.playPop();

  // Attach showreel jump
  const modalPlayBtn = document.getElementById('modalPlayShowreel');
  if (modalPlayBtn) {
    modalPlayBtn.addEventListener('click', () => {
      projectModal.classList.remove('active');
      openShowreel();
    });
  }
}

projectCards.forEach((card) => {
  card.addEventListener('click', () => {
    const id = card.getAttribute('data-project');
    openProjectDetails(id);
  });
});

closeProjectModal.addEventListener('click', () => {
  projectModal.classList.remove('active');
  sfx.playTick();
});

// Close modal on click outside
window.addEventListener('click', (e) => {
  if (e.target === projectModal) {
    projectModal.classList.remove('active');
  }
  if (e.target === showreelModal) {
    closeShowreel();
  }
  if (e.target === aboutModal) {
    aboutModal.classList.remove('active');
  }
});

// --- 9. SHOWREEL VIDEO SIMULATION & REAL VIDEO EMBED ---
const showreelModal = document.getElementById('showreelModal');
const closeShowreelModal = document.getElementById('closeShowreelModal');
const openShowreelHero = document.getElementById('openShowreelHero');
const openShowreelCard = document.getElementById('openShowreelCard');
const showreelThumbnailTrigger = document.getElementById('showreelThumbnailTrigger');

const switchVideoMode = document.getElementById('switchVideoMode');
const switchCanvasMode = document.getElementById('switchCanvasMode');
const realVideoPlayer = document.getElementById('realVideoPlayer');
const canvasVideoPlayer = document.getElementById('canvasVideoPlayer');
const reelIframe = document.getElementById('reelIframe');

const reelCanvas = document.getElementById('showreelCanvas');
const reelCtx = reelCanvas.getContext('2d');
const canvasPlayToggle = document.getElementById('canvasPlayToggle');
const canvasProgressBar = document.getElementById('canvasProgressBar');
const canvasTimeDisplay = document.getElementById('canvasTimeDisplay');
const canvasFullscreenBtn = document.getElementById('canvasFullscreenBtn');

let isPlaying = false;
let playProgress = 0; // 0 to 1
let animFrameId = null;
let currentReelMode = 'video'; // 'video' or 'canvas'

// Switcher Mode Handlers
if (switchVideoMode && switchCanvasMode) {
  switchVideoMode.addEventListener('click', () => {
    currentReelMode = 'video';
    switchVideoMode.classList.add('active');
    switchCanvasMode.classList.remove('active');
    realVideoPlayer.classList.add('active');
    canvasVideoPlayer.classList.remove('active');
    
    // Ensure iframe is loaded
    if (!reelIframe.src && reelIframe.getAttribute('data-src')) {
      reelIframe.src = reelIframe.getAttribute('data-src');
    }
    
    // Pause canvas animation
    isPlaying = false;
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    sfx.playTick();
  });

  switchCanvasMode.addEventListener('click', () => {
    currentReelMode = 'canvas';
    switchCanvasMode.classList.add('active');
    switchVideoMode.classList.remove('active');
    canvasVideoPlayer.classList.add('active');
    realVideoPlayer.classList.remove('active');

    // Pause iframe video
    if (reelIframe.contentWindow) {
      reelIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }

    // Start canvas animation
    isPlaying = true;
    canvasPlayToggle.textContent = '❚❚ Pause';
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(renderShowreelFrame);
    }
    sfx.playTick();
  });
}

// Preload project images into canvas memory
const reelImages = [
  { img: new Image(), title: 'RUN! — Sakuga Sequence' },
  { img: new Image(), title: 'DAYDREAMS — Lofi Animation' },
  { img: new Image(), title: 'LOST SIGNAL — Cyber Short' },
  { img: new Image(), title: 'GROOVY TUNES — Music Video' },
  { img: new Image(), title: 'YASHMEET — Motion Reel 2026' }
];

reelImages[0].img.src = 'assets/run.jpg';
reelImages[1].img.src = 'assets/daydreams.jpg';
reelImages[2].img.src = 'assets/lost_signal.jpg';
reelImages[3].img.src = 'assets/groovy_tunes.jpg';
reelImages[4].img.src = 'assets/showreel.jpg';

function renderShowreelFrame() {
  const w = reelCanvas.width;
  const h = reelCanvas.height;

  // Clear background
  reelCtx.fillStyle = '#080a10';
  reelCtx.fillRect(0, 0, w, h);

  // Which scene to display based on progress
  const sceneIndex = Math.floor(playProgress * (reelImages.length - 1));
  const nextSceneIndex = Math.min(sceneIndex + 1, reelImages.length - 1);
  const sceneSubProgress = (playProgress * (reelImages.length - 1)) % 1;

  const currentImg = reelImages[sceneIndex].img;
  const nextImg = reelImages[nextSceneIndex].img;

  if (currentImg.complete && currentImg.naturalWidth > 0) {
    reelCtx.save();
    // Dynamic slow zoom effect
    const scale = 1 + sceneSubProgress * 0.08;
    reelCtx.translate(w / 2, h / 2);
    reelCtx.scale(scale, scale);
    reelCtx.drawImage(currentImg, -w / 2, -h / 2, w, h);
    reelCtx.restore();

    // Crossfade to next image near boundary
    if (sceneSubProgress > 0.8 && nextImg.complete) {
      reelCtx.save();
      reelCtx.globalAlpha = (sceneSubProgress - 0.8) / 0.2;
      reelCtx.drawImage(nextImg, 0, 0, w, h);
      reelCtx.restore();
    }
  }

  // Cinematic Letterbox Vignette
  const grad = reelCtx.createRadialGradient(w/2, h/2, h/3, w/2, h/2, w/1.2);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.65)');
  reelCtx.fillStyle = grad;
  reelCtx.fillRect(0, 0, w, h);

  // Animated Audio Equalizer Bars on canvas
  reelCtx.fillStyle = 'rgba(212, 255, 50, 0.8)';
  const barCount = 18;
  const barWidth = 6;
  const barGap = 4;
  const eqX = 40;
  const eqY = h - 60;

  for (let i = 0; i < barCount; i++) {
    const wave = Math.sin(performance.now() * 0.008 + i * 0.4) * 0.5 + 0.5;
    const barH = isPlaying ? 10 + wave * 35 : 6;
    reelCtx.fillRect(eqX + i * (barWidth + barGap), eqY - barH, barWidth, barH);
  }

  // On-screen Title overlay
  reelCtx.fillStyle = '#ffffff';
  reelCtx.font = 'bold 24px Syne, sans-serif';
  reelCtx.fillText(reelImages[sceneIndex].title, eqX, h - 85);

  // 60 FPS badge
  reelCtx.fillStyle = '#d4ff32';
  reelCtx.font = 'bold 14px "Plus Jakarta Sans", monospace';
  reelCtx.fillText('● REC 4K 60FPS', w - 160, 50);

  // Advance playback
  if (isPlaying) {
    playProgress += 0.0018; // ~15 seconds total loop
    if (playProgress >= 1) playProgress = 0;

    // Update UI controls
    canvasProgressBar.style.width = `${playProgress * 100}%`;
    const totalSeconds = 108; // 1:48
    const curSec = Math.floor(playProgress * totalSeconds);
    const m = String(Math.floor(curSec / 60)).padStart(2, '0');
    const s = String(curSec % 60).padStart(2, '0');
    canvasTimeDisplay.textContent = `${m}:${s} / 01:48`;
  }

  animFrameId = requestAnimationFrame(renderShowreelFrame);
}

function openShowreel() {
  showreelModal.classList.add('active');
  sfx.playPop();

  if (currentReelMode === 'video') {
    if (!reelIframe.src && reelIframe.getAttribute('data-src')) {
      reelIframe.src = reelIframe.getAttribute('data-src');
    }
  } else {
    isPlaying = true;
    canvasPlayToggle.textContent = '❚❚ Pause';
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(renderShowreelFrame);
    }
  }
}

function closeShowreel() {
  showreelModal.classList.remove('active');
  isPlaying = false;
  canvasPlayToggle.textContent = '▶ Play';
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  // Pause/reset iframe video
  if (reelIframe.src) {
    const currentSrc = reelIframe.src;
    reelIframe.src = '';
    reelIframe.setAttribute('data-src', currentSrc);
  }
}

[openShowreelHero, openShowreelCard, showreelThumbnailTrigger].forEach((btn) => {
  if (btn) btn.addEventListener('click', openShowreel);
});

closeShowreelModal.addEventListener('click', closeShowreel);

canvasPlayToggle.addEventListener('click', () => {
  isPlaying = !isPlaying;
  canvasPlayToggle.textContent = isPlaying ? '❚❚ Pause' : '▶ Play';
  sfx.playTick();
});

// Scrubbing on progress bar
const scrubBarWrap = document.querySelector('.scrub-bar-wrap');
if (scrubBarWrap) {
  scrubBarWrap.addEventListener('click', (e) => {
    const rect = scrubBarWrap.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    playProgress = Math.max(0, Math.min(1, pos));
    canvasProgressBar.style.width = `${playProgress * 100}%`;
    sfx.playTick();
  });
}

// Fullscreen canvas
canvasFullscreenBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    reelCanvas.requestFullscreen().catch(err => alert(err.message));
  } else {
    document.exitFullscreen();
  }
});

// --- 10. ABOUT ME MODAL ---
const aboutModal = document.getElementById('aboutModal');
const openAboutDetailsBtn = document.getElementById('openAboutDetailsBtn');
const closeAboutModal = document.getElementById('closeAboutModal');

if (openAboutDetailsBtn) {
  openAboutDetailsBtn.addEventListener('click', () => {
    aboutModal.classList.add('active');
    sfx.playPop();
  });
}

if (closeAboutModal) {
  closeAboutModal.addEventListener('click', () => {
    aboutModal.classList.remove('active');
    sfx.playTick();
  });
}

// --- 11. CONTACT FORM HANDLING & VALIDATION ---
const contactForm = document.getElementById('contactForm');
const contactName = document.getElementById('contactName');
const contactEmail = document.getElementById('contactEmail');
const contactMessage = document.getElementById('contactMessage');
const selectedProjectType = document.getElementById('selectedProjectType');
const selectedBudget = document.getElementById('selectedBudget');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');
const contactSubmitBtn = document.getElementById('contactSubmitBtn');
const submitText = contactSubmitBtn.querySelector('.submit-text');
const submitSpinner = contactSubmitBtn.querySelector('.submit-spinner');
const formStatusMsg = document.getElementById('formStatusMsg');

const contactSuccessModal = document.getElementById('contactSuccessModal');
const closeSuccessModal = document.getElementById('closeSuccessModal');
const dismissSuccessBtn = document.getElementById('dismissSuccessBtn');
const successDesc = document.getElementById('successDesc');
const successSummary = document.getElementById('successSummary');

// Project type selection pills
const projectTypeButtons = document.querySelectorAll('#projectTypeRow .type-pill');
projectTypeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    projectTypeButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    selectedProjectType.value = btn.getAttribute('data-type');
    sfx.playTick();
  });
});

// Budget selection pills
const budgetButtons = document.querySelectorAll('#budgetRow .type-pill');
budgetButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    budgetButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    selectedBudget.value = btn.getAttribute('data-budget');
    sfx.playTick();
  });
});

// Real-time error clearance
contactName.addEventListener('input', () => { nameError.textContent = ''; });
contactEmail.addEventListener('input', () => { emailError.textContent = ''; });
contactMessage.addEventListener('input', () => { messageError.textContent = ''; });

// Form submission handler
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const nameVal = contactName.value.trim();
    const emailVal = contactEmail.value.trim();
    const messageVal = contactMessage.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate Name
    if (!nameVal) {
      nameError.textContent = 'Please enter your name.';
      isValid = false;
    } else if (nameVal.length < 2) {
      nameError.textContent = 'Name must be at least 2 characters.';
      isValid = false;
    }

    // Validate Email
    if (!emailVal) {
      emailError.textContent = 'Please enter your email address.';
      isValid = false;
    } else if (!emailRegex.test(emailVal)) {
      emailError.textContent = 'Please enter a valid email address (e.g. name@domain.com).';
      isValid = false;
    }

    // Validate Message
    if (!messageVal) {
      messageError.textContent = 'Please tell me a little about your project.';
      isValid = false;
    } else if (messageVal.length < 10) {
      messageError.textContent = 'Please provide at least 10 characters of detail.';
      isValid = false;
    }

    if (!isValid) {
      sfx.playTick();
      return;
    }

    // Simulating Sending Request
    contactSubmitBtn.disabled = true;
    submitText.textContent = 'Sending...';
    submitSpinner.classList.remove('hidden');

    setTimeout(() => {
      contactSubmitBtn.disabled = false;
      submitText.textContent = 'Send Message 🚀';
      submitSpinner.classList.add('hidden');

      // Populate Success Modal Summary
      successDesc.textContent = `Thanks, ${nameVal}! Your project inquiry has been received. Yashmeet will review your brief and get back to you at ${emailVal} within 24 hours.`;
      successSummary.innerHTML = `
        <div class="success-summary-item">
          <span>Client:</span>
          <strong>${nameVal}</strong>
        </div>
        <div class="success-summary-item">
          <span>Project Category:</span>
          <strong>${selectedProjectType.value}</strong>
        </div>
        <div class="success-summary-item">
          <span>Budget Range:</span>
          <strong>${selectedBudget.value}</strong>
        </div>
      `;

      // Show success modal
      contactSuccessModal.classList.add('active');
      sfx.playPop();

      // Launch Confetti bursts
      triggerConfetti();

      // Reset form
      contactForm.reset();
      projectTypeButtons.forEach((b, idx) => {
        if (idx === 0) b.classList.add('active');
        else b.classList.remove('active');
      });
      selectedProjectType.value = '2D Animation';

      budgetButtons.forEach((b, idx) => {
        if (idx === 1) b.classList.add('active');
        else b.classList.remove('active');
      });
      selectedBudget.value = '$2,000 - $5,000';
    }, 1000);
  });
}

function triggerConfetti() {
  const colors = ['#d4ff32', '#7b42f6', '#00d2ff', '#ff3377', '#ffffff'];
  const count = 40;
  for (let i = 0; i < count; i++) {
    const p = new DoodleParticle(window.innerWidth / 2, window.innerHeight / 2);
    p.speedX = (Math.random() - 0.5) * 14;
    p.speedY = (Math.random() - 0.5) * 14 - 3;
    p.size = Math.random() * 6 + 3;
    p.decay = 0.015;
    particles.push(p);
  }
}

[closeSuccessModal, dismissSuccessBtn].forEach((btn) => {
  if (btn) {
    btn.addEventListener('click', () => {
      contactSuccessModal.classList.remove('active');
      sfx.playTick();
    });
  }
});

// Close modal on click outside
window.addEventListener('click', (e) => {
  if (e.target === contactSuccessModal) {
    contactSuccessModal.classList.remove('active');
  }
});

// --- 12. COPY EMAIL TO CLIPBOARD WITH TOAST ---
const copyEmailTrigger = document.getElementById('copyEmailTrigger');
const copyBadge = document.getElementById('copyBadge');
const toastNotification = document.getElementById('toastNotification');
const toastMessage = document.getElementById('toastMessage');

if (copyEmailTrigger) {
  copyEmailTrigger.addEventListener('click', () => {
    const email = 'hello@yashmeet.com';
    navigator.clipboard.writeText(email).then(() => {
      copyBadge.textContent = 'Copied!';
      copyBadge.style.background = '#00d2ff';
      showToast('Copied hello@yashmeet.com to clipboard! 📋');
      sfx.playPop();

      setTimeout(() => {
        copyBadge.textContent = 'Copy';
        copyBadge.style.background = 'var(--neon-lime)';
      }, 2500);
    });
  });
}

function showToast(msg) {
  toastMessage.textContent = msg;
  toastNotification.classList.add('show');
  setTimeout(() => {
    toastNotification.classList.remove('show');
  }, 3200);
}

// --- 13. PEEKABOO MASCOT EASTER EGG ---
const peekMascot = document.getElementById('peekMascot');
if (peekMascot) {
  let mascotClicks = 0;
  peekMascot.addEventListener('click', () => {
    mascotClicks++;
    sfx.playPop();
    const face = peekMascot.querySelector('.mascot-eyes');
    const wave = peekMascot.querySelector('.mascot-wave');

    if (mascotClicks % 3 === 1) {
      face.textContent = '^‿^';
      wave.textContent = '✨';
      showToast('Yashmeet says: "Thanks for checking out my work!"');
    } else if (mascotClicks % 3 === 2) {
      face.textContent = '★.★';
      wave.textContent = '⚡';
      showToast('Need animation for your next project? Let\'s collaborate!');
    } else {
      face.textContent = 'ᵔᴥᵔ';
      wave.textContent = '✌️';
    }
  });
}

console.log("%c🎬 Yashmeet Portfolio Loaded Successfully with Contact & Video Engine! ✨", "background: #0b0d14; color: #d4ff32; font-size: 16px; padding: 8px; font-weight: bold;");

