
const scene = document.querySelector('.scene');
const speaker = document.getElementById('speaker');
const dialogue = document.getElementById('dialogue');
const nextButton = document.getElementById('continue');
const notification = document.getElementById('notification');
const phone = document.getElementById('phone');
const closePhone = document.getElementById('closePhone');
const audioToggle = document.getElementById('audioToggle');

const beats = [
  {
    speaker: 'MILO',
    line: 'You know the worst part? I think the song is good.',
    milo: 'neutral',
    eli: 'neutral'
  },
  {
    speaker: 'ELI',
    line: 'That is usually what people are hoping for when they write one.',
    milo: 'smile',
    eli: 'soft'
  },
  {
    speaker: 'MILO',
    line: 'No. I mean good enough that they might actually hear it.',
    milo: 'hurt',
    eli: 'neutral'
  },
  {
    speaker: 'ELI',
    line: 'Then let them hear it. Before we get clever enough to ruin it.',
    milo: 'neutral',
    eli: 'tense'
  },
  {
    speaker: 'MILO',
    line: '...You saw the clip, didn’t you?',
    milo: 'smile',
    eli: 'soft'
  }
];

let beat = 0;

function renderBeat(index) {
  beat = index % beats.length;
  const item = beats[beat];
  scene.dataset.beat = String(beat);
  speaker.textContent = item.speaker;
  document.body.dataset.milo = item.milo;
  document.body.dataset.eli = item.eli;

  dialogue.animate(
    [
      { opacity: 0, transform: 'translateY(8px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ],
    { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' }
  );
  dialogue.textContent = item.line;
}

nextButton.addEventListener('click', () => renderBeat(beat + 1));
document.addEventListener('keydown', event => {
  if (event.key === ' ' || event.key === 'Enter') {
    if (phone.classList.contains('is-open')) return;
    event.preventDefault();
    renderBeat(beat + 1);
  }
  if (event.key === 'Escape' && phone.classList.contains('is-open')) {
    phone.classList.remove('is-open');
    phone.setAttribute('aria-hidden', 'true');
  }
});

function openPhone() {
  phone.classList.add('is-open');
  phone.setAttribute('aria-hidden', 'false');
  notification.animate(
    [{ opacity: 1 }, { opacity: .25 }],
    { duration: 240, fill: 'forwards' }
  );
}
notification.addEventListener('click', openPhone);
closePhone.addEventListener('click', () => {
  phone.classList.remove('is-open');
  phone.setAttribute('aria-hidden', 'true');
});

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
const set = document.querySelector('.set-back');

window.addEventListener('pointermove', event => {
  targetX = (event.clientX / window.innerWidth - .5) * 8;
  targetY = (event.clientY / window.innerHeight - .5) * 5;
});

function animateParallax() {
  currentX += (targetX - currentX) * .035;
  currentY += (targetY - currentY) * .035;
  set.style.setProperty('--px', currentX + 'px');
  set.style.setProperty('--py', currentY + 'px');
  requestAnimationFrame(animateParallax);
}
animateParallax();

const baseSetTransform = getComputedStyle(set).transform;
set.style.translate = 'var(--px, 0px) var(--py, 0px)';

let audioCtx;
let nodes = [];
let playing = false;

function createNoiseBuffer(ctx) {
  const length = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    last = last * .985 + white * .015;
    data[i] = last * .35;
  }
  return buffer;
}

function startAudio() {
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  const master = audioCtx.createGain();
  master.gain.value = .16;
  master.connect(audioCtx.destination);

  const pad = audioCtx.createOscillator();
  const padGain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  pad.type = 'triangle';
  pad.frequency.value = 110;
  filter.type = 'lowpass';
  filter.frequency.value = 480;
  filter.Q.value = 1.1;
  padGain.gain.value = .055;
  pad.connect(filter).connect(padGain).connect(master);

  const fifth = audioCtx.createOscillator();
  const fifthGain = audioCtx.createGain();
  fifth.type = 'sine';
  fifth.frequency.value = 164.81;
  fifthGain.gain.value = .025;
  fifth.connect(fifthGain).connect(master);

  const noise = audioCtx.createBufferSource();
  const noiseFilter = audioCtx.createBiquadFilter();
  const noiseGain = audioCtx.createGain();
  noise.buffer = createNoiseBuffer(audioCtx);
  noise.loop = true;
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = 1200;
  noiseFilter.Q.value = .35;
  noiseGain.gain.value = .018;
  noise.connect(noiseFilter).connect(noiseGain).connect(master);

  const wobble = audioCtx.createOscillator();
  const wobbleGain = audioCtx.createGain();
  wobble.frequency.value = .09;
  wobbleGain.gain.value = 8;
  wobble.connect(wobbleGain).connect(filter.frequency);

  pad.start();
  fifth.start();
  noise.start();
  wobble.start();
  nodes = [pad, fifth, noise, wobble, master];
}

function stopAudio() {
  nodes.forEach(node => {
    try { if (typeof node.stop === 'function') node.stop(); } catch (_) {}
    try { if (typeof node.disconnect === 'function') node.disconnect(); } catch (_) {}
  });
  nodes = [];
}

audioToggle.addEventListener('click', async () => {
  playing = !playing;
  if (playing) {
    startAudio();
    if (audioCtx.state === 'suspended') await audioCtx.resume();
    audioToggle.textContent = 'Ⅱ';
    audioToggle.classList.add('is-playing');
    audioToggle.setAttribute('aria-label', 'Pause demo ambience');
  } else {
    stopAudio();
    audioToggle.textContent = '▶';
    audioToggle.classList.remove('is-playing');
    audioToggle.setAttribute('aria-label', 'Play demo ambience');
  }
});

renderBeat(0);
