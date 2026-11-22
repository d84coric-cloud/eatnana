{
const CDN = window.EAT_CDN || 'img/';
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const G = typeof gsap !== 'undefined';
const ST = G && typeof ScrollTrigger !== 'undefined';
if (ST) { gsap.registerPlugin(ScrollTrigger); ScrollTrigger.config({ ignoreMobileResize: true }); }
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const body = document.body, intro = $('#intro'), top = $('#top'), dock = $('#dock');

/* ---------- Gerichte ---------- */
const DISHES = [
  { cyr: 'Жижиг-галнаш', name: 'Zhizhig-Galnash', img: 'galnash', pos: '50% 62%', text: 'Das Nationalgericht: Rind und Lamm, stundenlang gekocht, dazu handgeformte Galnash, kräftige Brühe und Knoblauchsauce.', price: '€ 16,90' },
  { cyr: 'Чепалгаш', name: 'Chepalgash', img: 'chepalgash', pos: '50% 50%', text: 'Hauchdünne Fladen mit Topfen, in Butter getränkt, gestapelt und wie eine Torte geschnitten.', price: '€ 8,50' },
  { cyr: 'Хингалш', name: 'Khingalsh', img: 'khingalsh', pos: '50% 50%', text: 'Goldene Halbmonde mit süßem Kürbis, frisch mit Butter bestrichen.', price: '€ 8,90' },
  { cyr: 'Жижиг-чорпа', name: 'Zhizhig-Chorpa', img: 'chorpa', pos: '60% 50%', text: 'Klare Fleischsuppe mit Lamm, Dill und Bärlauch. Wärmt bis in die Zehen.', price: '€ 7,90' },
  { cyr: 'Сискал', name: 'Siskal', img: 'siskal', pos: '50% 50%', text: 'Maisbrot mit knuspriger Kruste, dazu Topfen mit Butter.', price: '€ 3,50' }
];
const rail = $('#rail'), dots = $('#dots');
rail.innerHTML = DISHES.map((d, i) => `<article class="card" data-i="${i}" aria-label="${d.name}"><img src="${CDN}${d.img}.webp" alt="${d.name}, KI-Symbolbild" loading="lazy" style="object-position:${d.pos}"><div class="sh"></div><span class="cap">KI-Symbolbild</span><div class="in"><span class="cyr" lang="ce">${d.cyr}</span><h3>${d.name}</h3><p>${d.text}</p><div class="price"><span>Portion</span><b>${d.price}</b></div></div></article>`).join('');
dots.innerHTML = DISHES.map((d, i) => `<button type="button" aria-label="${d.name} zeigen" aria-current="${i === 0}"></button>`).join('');
const cards = $$('.card', rail), dotBtns = $$('button', dots);
let cur = 0;
const goCard = i => { i = Math.max(0, Math.min(cards.length - 1, i)); cards[i].scrollIntoView({ behavior: RM ? 'auto' : 'smooth', inline: 'center', block: 'nearest' }); };
dotBtns.forEach((b, i) => b.addEventListener('click', () => goCard(i)));
$('#prev').addEventListener('click', () => goCard(cur - 1));
$('#next').addEventListener('click', () => goCard(cur + 1));
let railTick = false;
const railUpd = () => {
  railTick = false; const vw = innerWidth; let best = 0, bd = 1e9;
  cards.forEach((c, i) => { const r = c.getBoundingClientRect(); const off = r.left + r.width / 2 - vw / 2; if (Math.abs(off) < bd) { bd = Math.abs(off); best = i; } if (!RM) c.firstElementChild.style.transform = `translate3d(${(-off / vw * 14).toFixed(2)}%,0,0)`; });
  if (best !== cur || !cards[best].classList.contains('on')) { cur = best; cards.forEach((c, i) => c.classList.toggle('on', i === cur)); dotBtns.forEach((b, j) => b.setAttribute('aria-current', j === cur)); }
};
rail.addEventListener('scroll', () => { if (!railTick) { railTick = true; requestAnimationFrame(railUpd); } }, { passive: true });
addEventListener('resize', railUpd);
railUpd();

/* ---------- Tisch-Formular ---------- */
const TIMES = ['12:00', '13:30', '18:00', '19:30'];
let persons = 2, time = 3;
const timesEl = $('#times'), pc = $('#pc');
const drawTimes = () => { timesEl.innerHTML = TIMES.map((t, i) => `<button type="button" data-i="${i}" aria-pressed="${i === time}">${t}</button>`).join(''); };
drawTimes();
timesEl.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; time = +b.dataset.i; drawTimes(); timesEl.querySelector(`[data-i="${time}"]`).focus(); });
const setP = v => { persons = Math.max(1, Math.min(12, v)); pc.textContent = persons; if (G && !RM) gsap.fromTo(pc, { scale: 1.35 }, { scale: 1, duration: .4, ease: 'back.out(3)' }); };
$('#minus').addEventListener('click', () => setP(persons - 1));
$('#plus').addEventListener('click', () => setP(persons + 1));
const fc = $('#fc');
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const dv = $('#dt').value; let ds = dv;
  try { ds = new Date(dv + 'T12:00:00').toLocaleDateString('de-AT', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (err) {}
  const nm = $('#nm').value.trim();
  $('#sum').textContent = `${nm ? nm + ', ' : ''}${persons === 1 ? '1 Person' : persons + ' Personen'} am ${ds} um ${TIMES[time]} Uhr. Larisa meldet sich bei dir.`;
  fc.classList.add('sent');
  if (!RM && fc.animate) for (let i = 0; i < 30; i++) {
    const s = document.createElement('i'); s.className = 'spark'; fc.appendChild(s);
    const a = Math.random() * Math.PI * 2, d = 90 + Math.random() * 190;
    s.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d}px),calc(-50% + ${Math.sin(a) * d}px)) scale(0)`, opacity: 0 }], { duration: 800 + Math.random() * 600, easing: 'cubic-bezier(.2,.8,.2,1)' }).onfinish = () => s.remove();
  }
});
$('#again').addEventListener('click', () => fc.classList.remove('sent'));

/* ---------- Countdown ---------- */
const TARGET = Date.parse('2026-12-24T12:00:00+01:00');
const cdEls = ['cdD', 'cdH', 'cdM', 'cdS'].map(id => $('#' + id));
const pad = n => String(n).padStart(2, '0');
const tickCD = () => {
  let s = Math.max(0, Math.floor((TARGET - Date.now()) / 1000));
  const v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60].map(pad);
  cdEls.forEach((el, i) => { if (el.textContent !== v[i]) { el.textContent = v[i]; el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip'); } });
};
tickCD(); setInterval(tickCD, 1000);

/* ---------- Laufband mit Scroll-Schwung ---------- */
const row = $('.marq .row');
let mx = 0, vel = 0, lastY = scrollY, marqOn = false;
new IntersectionObserver(es => { marqOn = es[0].isIntersecting; }).observe($('.marq'));
const marq = () => {
  const dy = scrollY - lastY; lastY = scrollY;
  vel = vel * 0.88 + dy * 0.12;
  if (marqOn && !RM) {
    const half = row.scrollWidth / 2;
    mx -= 1.1 + Math.min(Math.abs(vel) * 0.6, 14);
    if (mx <= -half) mx += half;
    row.style.transform = `translate3d(${mx.toFixed(1)}px,0,0) skewX(${Math.max(-14, Math.min(14, -vel * 0.5)).toFixed(2)}deg)`;
  }
  requestAnimationFrame(marq);
};
requestAnimationFrame(marq);

/* ---------- Kopfleiste, Daumenleiste ---------- */
const onScroll = () => { top.classList.toggle('solid', scrollY > 40); dock.classList.toggle('on', scrollY > innerHeight * 0.45); };
addEventListener('scroll', onScroll, { passive: true });
$('#replay').addEventListener('click', () => { try { history.replaceState(null, '', location.pathname); } catch (e) {} location.reload(); });

/* ---------- Überschriften wortweise ---------- */
const splitWords = el => { const t = el.textContent.trim(); el.setAttribute('aria-label', t); el.innerHTML = t.split(/\s+/).map(w => `<span class="w" aria-hidden="true"><span>${w}</span></span>`).join(' '); return $$('.w > span', el); };
const heroWords = splitWords($('.hero h2'));
const secWords = $$('.split').filter(h => !h.closest('.hero')).map(h => [h, splitWords(h)]);

/* ---------- Scroll-Szenen ---------- */
function scenes() {
  if (!ST || RM) return;
  gsap.to('.ph', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero .txt', { yPercent: -30, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 20%', scrub: true } });
  secWords.forEach(([h, ws]) => gsap.from(ws, { yPercent: 110, duration: .9, ease: 'power4.out', stagger: .07, scrollTrigger: { trigger: h, start: 'top 86%' } }));
  gsap.from(rail, { x: 260, opacity: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: rail, start: 'top 85%' } });
  const nl = $$('.nana .lines p');
  const tl = gsap.timeline({ scrollTrigger: { trigger: '.nana', start: 'top top', end: '+=170%', scrub: .6, pin: true, anticipatePin: 1 } });
  tl.fromTo('.nana .img img', { scale: 1.3 }, { scale: 1, ease: 'none', duration: 3 }, 0)
    .fromTo('.nana .frame rect', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', duration: 3 }, 0);
  nl.forEach((p, i) => tl.fromTo(p, { opacity: 0, y: 46, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: .55, ease: 'power2.out' }, .15 + i * .55));
  gsap.from('.cd div', { y: 80, rotateX: -70, opacity: 0, duration: 1, ease: 'back.out(1.6)', stagger: .1, scrollTrigger: { trigger: '.cd', start: 'top 88%' } });
  gsap.fromTo('#route', { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.map', start: 'top 80%', end: 'bottom 55%', scrub: true } });
  gsap.from('.facts li', { x: -40, opacity: 0, duration: .7, ease: 'power3.out', stagger: .1, scrollTrigger: { trigger: '.facts', start: 'top 85%' } });
  gsap.from('.fc', { y: 90, opacity: 0, rotate: -2, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.fc', start: 'top 90%' } });
  gsap.fromTo('#fat', { rotate: -200 }, { rotate: 0, ease: 'none', scrollTrigger: { trigger: 'footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
}

/* ---------- WebGL: aufsteigende Glut ---------- */
const EVS = `attribute float aSeed;uniform float uTime,uPR,uW,uH,uBurst;varying float vA;
void main(){float s=aSeed;float sp=.12+.3*fract(s*7.31);float y=mod(s*13.7+uTime*sp,uH)-uH*.5;
float x=(fract(s*91.7)-.5)*uW+sin(uTime*.7+s*40.)*.15;float z=(fract(s*33.1)-.5)*2.+uBurst*3.2;
vec4 mv=modelViewMatrix*vec4(x,y,z,1.);gl_Position=projectionMatrix*mv;
gl_PointSize=(2.+fract(s*5.1)*7.)*uPR*(2.2/max(.25,-mv.z))*(1.+uBurst*2.);
vA=(.3+.35*sin(uTime*3.+s*50.))*smoothstep(-uH*.5,-uH*.25,y)*(1.-smoothstep(uH*.15,uH*.5,y))*(1.-smoothstep(.6,1.,uBurst));}`;
const EFS = `varying float vA;void main(){vec2 c=gl_PointCoord-.5;float r=length(c);if(r>.5)discard;gl_FragColor=vec4(1.,.74,.38,pow(1.-r*2.,2.)*vA);}`;
let gl3 = null;
function initGL() {
  if (RM || typeof THREE === 'undefined') return null;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: $('#gl'), antialias: false, alpha: true, powerPreference: 'high-performance' }); } catch (e) { return null; }
  const pr = Math.min(devicePixelRatio || 1, 2); renderer.setPixelRatio(pr);
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(45, 1, .1, 60); cam.position.z = 4;
  const M = innerWidth < 760 ? 700 : 1400, eg = new THREE.BufferGeometry(), es = new Float32Array(M);
  for (let i = 0; i < M; i++) es[i] = Math.random();
  eg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(M * 3), 3));
  eg.setAttribute('aSeed', new THREE.BufferAttribute(es, 1));
  const U = { uTime: { value: 0 }, uPR: { value: pr }, uBurst: { value: 0 }, uW: { value: 4 }, uH: { value: 4 } };
  const em = new THREE.ShaderMaterial({ uniforms: U, vertexShader: EVS, fragmentShader: EFS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const ember = new THREE.Points(eg, em); ember.frustumCulled = false; scene.add(ember);
  const resize = () => { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); const vh = 2 * Math.tan(THREE.MathUtils.degToRad(22.5)) * 4; U.uW.value = vh * cam.aspect * 1.2; U.uH.value = vh * 1.2; };
  resize(); addEventListener('resize', resize);
  let raf = 0; const t0 = performance.now();
  const loop = now => { raf = requestAnimationFrame(loop); if (document.hidden) return; U.uTime.value = (now - t0) / 1000; renderer.render(scene, cam); };
  raf = requestAnimationFrame(loop);
  return { U, cam, stop() { cancelAnimationFrame(raf); removeEventListener('resize', resize); eg.dispose(); em.dispose(); renderer.dispose(); } };
}

/* ---------- Intro: Logo leuchtet auf, Schriftzug knallt rein ---------- */
const stage = $('#stage'), eimg = $('.stage img'), word = $('.word');
let entered = false, introTl = null;
const finish = () => {
  if (introTl) introTl.kill();
  if (gl3) { gl3.stop(); gl3 = null; }
  intro.remove(); body.classList.remove('locked');
  if (ST) ScrollTrigger.refresh();
};
function heroIn() {
  if (!G || RM) return;
  gsap.from(heroWords, { yPercent: 115, duration: 1, ease: 'power4.out', stagger: .08 });
  gsap.from('.hero .hp', { y: 26, opacity: 0, duration: .9, ease: 'power3.out', stagger: .12, delay: .45 });
  gsap.from(top, { y: -90, opacity: 0, duration: .9, ease: 'power3.out', delay: .3 });
}
function impact() {
  gsap.fromTo(stage, { x: 0, y: 0 }, { keyframes: [{ x: -10, y: 6, duration: .05 }, { x: 9, y: -5, duration: .05 }, { x: -6, y: 3, duration: .05 }, { x: 3, y: -1, duration: .05 }, { x: 0, y: 0, duration: .1 }] });
  gsap.fromTo('.shock', { opacity: .95, scale: .3 }, { opacity: 0, scale: 3.4, duration: .9, ease: 'power2.out' });
  gsap.fromTo('.flash', { opacity: .5 }, { opacity: 0, duration: .7, ease: 'power2.out' });
  if (gl3) gsap.fromTo(gl3.U.uBurst, { value: .3 }, { value: 0, duration: 1.2, ease: 'power2.out' });
  if (stage.animate) for (let i = 0; i < 34; i++) {
    const s = document.createElement('i'); s.className = 'ispark'; stage.appendChild(s);
    const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * stage.clientWidth * .45;
    s.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d}px),calc(-50% + ${Math.sin(a) * d * .7}px)) scale(0)`, opacity: 0 }], { duration: 700 + Math.random() * 700, easing: 'cubic-bezier(.15,.8,.25,1)' }).onfinish = () => s.remove();
  }
}
function playIntro() {
  if (!G || RM || entered) return;
  gsap.set(eimg, { filter: 'brightness(0) saturate(.6)', scale: 1.06 });
  gsap.set(word, { opacity: 0, scale: 2.8, filter: 'blur(10px)' });
  gsap.set(['.brand p', '.enter'], { opacity: 0, y: 16 });
  introTl = gsap.timeline({ delay: .2 });
  introTl.to(eimg, { filter: 'brightness(.4) saturate(.6)', scale: 1, duration: 1.5, ease: 'power2.out' })
    .to('.glow', { opacity: .45, duration: 1.2 }, .2)
    .to(eimg, { keyframes: [{ filter: 'brightness(1.35) saturate(1.1)', duration: .06 }, { filter: 'brightness(.45) saturate(.7)', duration: .09 }, { filter: 'brightness(1.2) saturate(1.05)', duration: .06 }, { filter: 'brightness(.7) saturate(.85)', duration: .11 }, { filter: 'brightness(1.1) saturate(1)', duration: .08 }, { filter: 'brightness(1) saturate(1)', duration: .25 }] }, 1.6)
    .to('.glow', { keyframes: [{ opacity: 1, duration: .06 }, { opacity: .3, duration: .09 }, { opacity: .95, duration: .06 }, { opacity: .5, duration: .11 }, { opacity: 1, duration: .33 }] }, 1.6)
    .to('.sweep', { xPercent: 260, duration: 1.1, ease: 'power2.inOut' }, 2.05)
    .to(word, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: .3, ease: 'power4.in' }, 2.6)
    .add(impact, 2.9)
    .to('.brand p', { opacity: 1, y: 0, duration: .8, ease: 'power3.out' }, 3.25)
    .to('.enter', { opacity: 1, y: 0, duration: .8, ease: 'power3.out' }, 3.55)
    .to(eimg, { filter: 'brightness(1.1) saturate(1.06)', duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }, 4.2);
}
function enter() {
  if (entered) return; entered = true;
  if (!G || RM) { finish(); return; }
  if (introTl) introTl.kill();
  gsap.set(['.enter', '.brand p'], { clearProps: 'transform' });
  const tl = gsap.timeline({ onComplete: finish });
  tl.to(['.brand', '.enter', '.skip'], { autoAlpha: 0, y: -20, duration: .4, ease: 'power2.in' }, 0)
    .to(word, { scale: 1.5, opacity: 0, duration: .5, ease: 'power2.in' }, 0)
    .to(stage, { scale: 5.5, transformOrigin: '52% 26%', duration: 1.5, ease: 'power3.in' }, .1)
    .to(eimg, { filter: 'brightness(1.7) saturate(1.2)', duration: 1.2, ease: 'power2.in' }, .3);
  if (gl3) tl.to(gl3.U.uBurst, { value: 1, duration: 1.5, ease: 'power2.in' }, 0);
  tl.to('.flash', { opacity: 1, duration: .45, ease: 'power2.in' }, 1.05)
    .set(stage, { autoAlpha: 0 }, 1.5)
    .set(intro, { backgroundColor: 'rgba(0,0,0,0)' }, 1.5)
    .set('.glow', { autoAlpha: 0 }, 1.5)
    .fromTo('.ph img', { scale: 1.35 }, { scale: 1, duration: 2.2, ease: 'power3.out' }, 1.45)
    .to('.flash', { opacity: 0, duration: .9, ease: 'power2.out' }, 1.5)
    .add(heroIn, 1.6)
    .to(intro, { autoAlpha: 0, duration: .3 }, 2.2);
}
$('#enter').addEventListener('click', enter);
$('#skip').addEventListener('click', enter);
let ty = null;
intro.addEventListener('touchstart', e => { ty = e.touches[0].clientY; }, { passive: true });
intro.addEventListener('touchmove', e => { e.preventDefault(); if (ty !== null && ty - e.touches[0].clientY > 70) { ty = null; enter(); } }, { passive: false });
intro.addEventListener('wheel', e => { if (e.deltaY > 25) enter(); }, { passive: true });

scenes();
if (location.hash && location.hash.length > 1 && location.hash !== '#start') { entered = true; finish(); const tg = document.getElementById(location.hash.slice(1)); if (tg) tg.scrollIntoView(); }
else {
  if (G && !RM) { gsap.set(eimg, { filter: 'brightness(0)' }); gsap.set(word, { opacity: 0 }); gsap.set(['.brand p', '.enter'], { opacity: 0 }); }
  (async () => {
    try { await Promise.race([Promise.all([document.fonts.load('900 100px Unbounded'), eimg.decode ? eimg.decode() : Promise.resolve()]), new Promise(r => setTimeout(r, 1800))]); } catch (e) {}
    if (entered) return;
    gl3 = initGL();
    playIntro();
  })();
}
onScroll();
}