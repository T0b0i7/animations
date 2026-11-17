function _classPrivateMethodGet(receiver, privateSet, fn) {if (!privateSet.has(receiver)) {throw new TypeError("attempted to get private field on non-instance");}return fn;}function _classPrivateFieldGet(receiver, privateMap) {var descriptor = privateMap.get(receiver);if (!descriptor) {throw new TypeError("attempted to get private field on non-instance");}if (descriptor.get) {return descriptor.get.call(receiver);}return descriptor.value;}function _classPrivateFieldSet(receiver, privateMap, value) {var descriptor = privateMap.get(receiver);if (!descriptor) {throw new TypeError("attempted to set private field on non-instance");}if (descriptor.set) {descriptor.set.call(receiver, value);} else {if (!descriptor.writable) {throw new TypeError("attempted to set read only private field");}descriptor.value = value;}return value;}import { Pane } from "https://cdn.jsdelivr.net/npm/tweakpane@4.0.3/dist/tweakpane.min.js";

const SVG_NS = "http://www.w3.org/2000/svg";

const CONFIG = {
  color: {
    crack: { l: 0.98, c: 0.01, h: 220, a: 0.95 },
    crackShadow: { l: 0.0, c: 0.0, h: 0, a: 0.2 },
    crackBranch: { l: 0.95, c: 0.01, h: 220, a: 0.4 },
    ring: { l: 0.97, c: 0.01, h: 210, a: 0.5 },
    dust: { l: 1.0, c: 0.0, h: 0, a: 0.9 },
    shardDark: { l: 0.12, c: 0.02, h: 220, aMin: 0.08, aMax: 0.3 },
    shardLight: { l: 0.94, c: 0.01, h: 210, aMin: 0.08, aMax: 0.2 },
    shardEdge: { l: 1.0, c: 0.0, h: 0, aMin: 0.1, aMax: 0.4 },
    pit: { l: 0, c: 0, h: 240, a: 0.96 },
    flash: { l: 1.0, c: 0.0, h: 0, a: 1.0 },
    particle: { l: 1.0, c: 0.0, h: 0, aMin: 0.7, aMax: 1.0 },
    particleShadow: "oklch(0% 0 0 / 0.35)" },

  crack: {
    rayCountMin: 4, rayCountMax: 16,
    maxRadiusMin: 180, maxRadiusMax: 340,
    rayLengthMin: 0.55, segmentMin: 12, segmentMax: 64,
    driftBase: 0.12, driftGrowth: 0.22, strokeMin: 0.5, strokeMax: 1.5,
    shadowOffset: [1.5, 2.5], shadowStroke: 2.0,
    branchProbability: 0.35, branchAngleMin: 0.3, branchAngleMax: 1.2,
    branchLenMin: 12, branchLenMax: 32, branchStroke: 0.25 },

  ring: {
    countMin: 3, countMax: 6,
    radiusBase: 15, radiusStepMin: 25, radiusStepMax: 45,
    wobbleRange: 12, skipProbability: 0.3, stroke: 0.75 },

  shard: {
    midRadiusMin: 32, midRadiusMax: 128, midJitter: 12,
    darkThreshold: 0.35, stagger: 0.025 },

  dust: {
    count: 12, radius: 18,
    lenMin: 1, lenMax: 12, strokeMin: 0.25, strokeMax: 1.5 },

  particle: {
    countMin: 15, countMax: 30, widthMin: 1, widthMax: 4, heightMin: 4, heightMax: 8,
    forceMin: 50, forceMax: 250, liftOffset: 50, gravityMin: 250, gravityMax: 400,
    rotateMax: 540, durationMin: 900, durationMax: 1800 },

  impact: { pitRadius: 8, flashRadius: 8, flashDuration: 0.125 },
  shake: { intensity: 6, duration: 180 } };


const MathUtils = {
  rand: (min, max) => min + Math.random() * (max - min),
  randInt: (min, max) => Math.floor(MathUtils.rand(min, max + 1)),
  polylineLength: (points) =>
  points.slice(1).reduce((total, p, i) => {
    const [x, y] = points[i];
    return total + Math.hypot(p[0] - x, p[1] - y);
  }, 0),
  pointsToPath: (points) =>
  points.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" "),
  buildAngles: (count) =>
  Array.from(
  { length: count },
  (_, i) => Math.PI * 2 / count * i + MathUtils.rand(-0.5, 0.5)).
  sort((a, b) => a - b) };


const ColorUtils = {
  oklch: ({ l, c, h, a = 1 }) =>
  `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h} / ${a})`,
  oklchRandA: ({ l, c, h, aMin, aMax }) =>
  ColorUtils.oklch({ l, c, h, a: MathUtils.rand(aMin, aMax) }) };


const SvgUtils = {
  create: (tag, attrs = {}) => {
    const el = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  },
  group: (attrs = {}) => SvgUtils.create("g", attrs) };var _svg = new WeakMap();var _audio = new WeakMap();var _layers = new WeakMap();var _currentStressId = new WeakMap();var _demoTimer = new WeakMap();var _bindEvents = new WeakSet();var _triggerDemo = new WeakSet();var _handleImpact = new WeakSet();var _buildRay = new WeakSet();var _addCrack = new WeakSet();var _buildShardLayer = new WeakSet();var _buildCrackLayer = new WeakSet();var _buildRingLayer = new WeakSet();var _buildDustLayer = new WeakSet();var _spawnParticles = new WeakSet();var _shakeScreen = new WeakSet();


class GlassShatterEngine {






  constructor(svgId, audioId) {var _document$getElementB;_shakeScreen.add(this);_spawnParticles.add(this);_buildDustLayer.add(this);_buildRingLayer.add(this);_buildCrackLayer.add(this);_buildShardLayer.add(this);_addCrack.add(this);_buildRay.add(this);_handleImpact.add(this);_triggerDemo.add(this);_bindEvents.add(this);_svg.set(this, { writable: true, value: void 0 });_audio.set(this, { writable: true, value: void 0 });_layers.set(this, { writable: true, value: void 0 });_currentStressId.set(this, { writable: true, value: null });_demoTimer.set(this, { writable: true, value: null });
    _classPrivateFieldSet(this, _svg, document.getElementById(svgId));
    _classPrivateFieldSet(this, _audio, (_document$getElementB = document.getElementById(audioId)) !== null && _document$getElementB !== void 0 ? _document$getElementB : {
      currentTime: 0,
      play: () => Promise.resolve() });


    _classPrivateFieldSet(this, _layers, {
      shadow: _classPrivateFieldGet(this, _svg).querySelector("#shadow-layer"),
      shard: _classPrivateFieldGet(this, _svg).querySelector("#shard-layer"),
      ring: _classPrivateFieldGet(this, _svg).querySelector("#ring-layer"),
      crack: _classPrivateFieldGet(this, _svg).querySelector("#crack-layer"),
      dust: _classPrivateFieldGet(this, _svg).querySelector("#dust-layer"),
      stress: _classPrivateFieldGet(this, _svg).querySelector("#stress-layer"),
      bloom: _classPrivateFieldGet(this, _svg).querySelector("#bloom-layer"),
      impact: _classPrivateFieldGet(this, _svg).querySelector("#impact-layer") });


    const layerOrder = ["shadow", "shard", "ring", "crack", "dust", "stress", "bloom", "impact"];

    layerOrder.forEach(name => {
      if (!_classPrivateFieldGet(this, _layers)[name]) {
        _classPrivateFieldGet(this, _layers)[name] = SvgUtils.group({ id: `${name}-layer` });
      }
      _classPrivateFieldGet(this, _svg).appendChild(_classPrivateFieldGet(this, _layers)[name]);
    });

    _classPrivateMethodGet(this, _bindEvents, _bindEvents2).call(this);
    _classPrivateMethodGet(this, _triggerDemo, _triggerDemo2).call(this);
  }




































  simulateSmash() {
    _classPrivateMethodGet(this, _handleImpact, _handleImpact2).call(this, {
      clientX: MathUtils.rand(window.innerWidth * 0.2, window.innerWidth * 0.8),
      clientY: MathUtils.rand(window.innerHeight * 0.2, window.innerHeight * 0.8) });

  }

  reset() {
    Object.values(_classPrivateFieldGet(this, _layers)).forEach(layer => {
      if (layer) layer.replaceChildren();
    });
    _classPrivateFieldGet(this, _svg).
    querySelectorAll('filter[id^="stress-"]').
    forEach(el => el.remove());
  }}var _bindEvents2 = function _bindEvents2() {var _document$getElementB2;window.addEventListener("pointerdown", e => {if (e.target.closest(".tp-dfwv")) return;_classPrivateMethodGet(this, _handleImpact, _handleImpact2).call(this, e);}, { passive: true });(_document$getElementB2 = document.getElementById("reset")) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.addEventListener("pointerdown", e => {e.stopPropagation();this.reset();});};var _triggerDemo2 = function _triggerDemo2() {_classPrivateFieldSet(this, _demoTimer, setTimeout(() => {const x = window.innerWidth / 2;const y = window.innerHeight / 2;_classPrivateMethodGet(this, _handleImpact, _handleImpact2).call(this, { clientX: x, clientY: y });}, 1000));};var _handleImpact2 = function _handleImpact2({ clientX, clientY }) {clearTimeout(_classPrivateFieldGet(this, _demoTimer));_classPrivateMethodGet(this, _addCrack, _addCrack2).call(this, clientX, clientY);_classPrivateMethodGet(this, _spawnParticles, _spawnParticles2).call(this, clientX, clientY);_classPrivateMethodGet(this, _shakeScreen, _shakeScreen2).call(this);_classPrivateFieldGet(this, _audio).currentTime = 0;_classPrivateFieldGet(this, _audio).play().catch(() => {});};var _buildRay2 = function _buildRay2(

cx, cy, baseAngle, totalLength) {
  const { segmentMin, segmentMax, driftBase, driftGrowth } = CONFIG.crack;
  const points = [[cx, cy]];
  let x = cx,y = cy,angle = baseAngle,remaining = totalLength;

  while (remaining > 8) {
    const seg = Math.min(remaining, MathUtils.rand(segmentMin, segmentMax));
    const drift = driftBase + (1 - remaining / totalLength) * driftGrowth;
    angle += MathUtils.rand(-drift, drift);

    x += Math.cos(angle) * seg;
    y += Math.sin(angle) * seg;
    points.push([x, y]);
    remaining -= seg;
  }
  return points;
};var _addCrack2 = function _addCrack2(

cx, cy) {var _classPrivateFieldGet2, _classPrivateFieldGet3, _classPrivateFieldGet4, _classPrivateFieldGet5, _classPrivateFieldGet6, _classPrivateFieldGet7, _classPrivateFieldGet8;
  const { crack, impact, color } = CONFIG;
  _classPrivateFieldSet(this, _currentStressId, `stress-${Date.now()}`);
  const defs = _classPrivateFieldGet(this, _svg).querySelector("defs");

  const filter = SvgUtils.create("filter", {
    id: _classPrivateFieldGet(this, _currentStressId),
    x: "-200%", y: "-200%",
    width: "500%", height: "500%" });


  filter.append(
  SvgUtils.create("feTurbulence", {
    type: "fractalNoise", baseFrequency: "0.02",
    numOctaves: "2", result: "noise" }),

  SvgUtils.create("feDisplacementMap", {
    in: "SourceGraphic", in2: "noise", scale: "10",
    xChannelSelector: "R", yChannelSelector: "G" }));


  defs.appendChild(filter);

  const count = MathUtils.randInt(crack.rayCountMin, crack.rayCountMax);
  const maxR = MathUtils.rand(crack.maxRadiusMin, crack.maxRadiusMax);
  const angles = MathUtils.buildAngles(count);
  const rays = angles.map(a => _classPrivateMethodGet(
  this, _buildRay, _buildRay2).call(this, cx, cy, a, maxR * MathUtils.rand(crack.rayLengthMin, 1)));


  const crackElements = _classPrivateMethodGet(this, _buildCrackLayer, _buildCrackLayer2).call(this, rays, angles);

  (_classPrivateFieldGet2 = _classPrivateFieldGet(this, _layers).shard) === null || _classPrivateFieldGet2 === void 0 ? void 0 : _classPrivateFieldGet2.appendChild(_classPrivateMethodGet(this, _buildShardLayer, _buildShardLayer2).call(this, cx, cy, rays, angles));
  (_classPrivateFieldGet3 = _classPrivateFieldGet(this, _layers).shadow) === null || _classPrivateFieldGet3 === void 0 ? void 0 : _classPrivateFieldGet3.appendChild(crackElements.shadowGroup);

  (_classPrivateFieldGet4 = _classPrivateFieldGet(this, _layers).crack) === null || _classPrivateFieldGet4 === void 0 ? void 0 : _classPrivateFieldGet4.append(
  crackElements.glowGroup,
  crackElements.crackGroup,
  crackElements.branchGroup);


  (_classPrivateFieldGet5 = _classPrivateFieldGet(this, _layers).ring) === null || _classPrivateFieldGet5 === void 0 ? void 0 : _classPrivateFieldGet5.appendChild(_classPrivateMethodGet(this, _buildRingLayer, _buildRingLayer2).call(this, cx, cy, angles, count));
  (_classPrivateFieldGet6 = _classPrivateFieldGet(this, _layers).dust) === null || _classPrivateFieldGet6 === void 0 ? void 0 : _classPrivateFieldGet6.appendChild(_classPrivateMethodGet(this, _buildDustLayer, _buildDustLayer2).call(this, cx, cy));

  const pit = SvgUtils.create("circle", {
    cx, cy, r: impact.pitRadius,
    fill: ColorUtils.oklch(color.pit) });


  (_classPrivateFieldGet7 = _classPrivateFieldGet(this, _layers).impact) === null || _classPrivateFieldGet7 === void 0 ? void 0 : _classPrivateFieldGet7.appendChild(pit);

  const flash = SvgUtils.create("circle", {
    cx, cy, r: impact.flashRadius,
    fill: ColorUtils.oklch(color.flash),
    filter: "url(#glassBloom)" });

  flash.style.animation = `flashOut ${impact.flashDuration}s ease-out forwards`;
  (_classPrivateFieldGet8 = _classPrivateFieldGet(this, _layers).bloom) === null || _classPrivateFieldGet8 === void 0 ? void 0 : _classPrivateFieldGet8.appendChild(flash);
};var _buildShardLayer2 = function _buildShardLayer2(

cx, cy, rays, angles) {
  const { shard, color } = CONFIG;
  const g = SvgUtils.group();

  rays.forEach((ray, i) => {
    const next = rays[(i + 1) % rays.length];
    const nextAngle = angles[(i + 1) % angles.length];
    const midAngle = angles[i] + (nextAngle - angles[i]) / 2;
    const midRadius = MathUtils.rand(shard.midRadiusMin, shard.midRadiusMax);

    const pts = [
    [cx, cy],
    ...ray.slice(1, 1 + MathUtils.randInt(2, 5)),
    [
    cx + Math.cos(midAngle) * midRadius + MathUtils.rand(-shard.midJitter, shard.midJitter),
    cy + Math.sin(midAngle) * midRadius + MathUtils.rand(-shard.midJitter, shard.midJitter)],

    ...next.slice(1, 1 + MathUtils.randInt(2, 5)).toReversed()];


    const fill = Math.random() > shard.darkThreshold ?
    ColorUtils.oklchRandA(color.shardDark) :
    ColorUtils.oklchRandA(color.shardLight);

    const shardEl = SvgUtils.create("path", {
      d: `${MathUtils.pointsToPath(pts)} Z`,
      fill,
      stroke: ColorUtils.oklchRandA(color.shardEdge),
      "stroke-width": "0.5",
      filter: _classPrivateFieldGet(this, _currentStressId) ? `url(#${_classPrivateFieldGet(this, _currentStressId)})` : "url(#glassRefraction)" });


    shardEl.style.cssText = `opacity: 0; animation: fadeInShard 0.15s ${0.02 + i * shard.stagger}s ease forwards;`;
    g.appendChild(shardEl);
  });

  return g;
};var _buildCrackLayer2 = function _buildCrackLayer2(

rays, angles) {
  const { crack, color } = CONFIG;
  const groups = {
    shadowGroup: SvgUtils.group(),
    crackGroup: SvgUtils.group(),
    glowGroup: SvgUtils.group({ filter: "url(#glassBloom)", opacity: 0.7 }),
    branchGroup: SvgUtils.group() };


  rays.forEach((ray, i) => {
    const len = MathUtils.polylineLength(ray);
    const delay = (i * 0.015).toFixed(3);
    const anim = `drawLine ${0.15 + i * 0.015}s ${delay}s ease-out forwards`;
    const dash = { "stroke-dasharray": len, "stroke-dashoffset": len };

    const createPath = (opts, animStr) => {
      const p = SvgUtils.create("path", {
        d: MathUtils.pointsToPath(ray),
        fill: "none",
        ...opts,
        ...dash });

      p.style.animation = animStr;
      return p;
    };

    groups.shadowGroup.appendChild(
    createPath(
    {
      stroke: ColorUtils.oklch(color.crackShadow),
      "stroke-width": crack.shadowStroke,
      transform: `translate(${crack.shadowOffset.join(",")})` },

    anim));



    groups.crackGroup.appendChild(
    createPath(
    {
      stroke: ColorUtils.oklch(color.crack),
      "stroke-width": MathUtils.rand(crack.strokeMin, crack.strokeMax) },

    anim));



    groups.glowGroup.appendChild(
    createPath(
    {
      stroke: ColorUtils.oklch(color.crack),
      "stroke-width": MathUtils.rand(crack.strokeMin, crack.strokeMax) * 2.2,
      opacity: 0.25 },

    anim));



    ray.slice(1, -1).forEach(pt => {
      if (Math.random() > crack.branchProbability) return;

      const angle = angles[i] + (Math.random() > 0.5 ? 1 : -1) *
      MathUtils.rand(crack.branchAngleMin, crack.branchAngleMax);
      const branchRay = _classPrivateMethodGet(this, _buildRay, _buildRay2).call(this,
      pt[0], pt[1], angle,
      MathUtils.rand(crack.branchLenMin, crack.branchLenMax));

      const l = MathUtils.polylineLength(branchRay);

      const b = SvgUtils.create("path", {
        d: MathUtils.pointsToPath(branchRay),
        fill: "none",
        stroke: ColorUtils.oklch(color.crackBranch),
        "stroke-width": crack.branchStroke,
        "stroke-dasharray": l,
        "stroke-dashoffset": l });


      b.style.animation = `drawLine 0.2s ${MathUtils.rand(0.1, 0.2)}s ease-out forwards`;
      groups.branchGroup.appendChild(b);
    });
  });

  return groups;
};var _buildRingLayer2 = function _buildRingLayer2(

cx, cy, angles, rayCount) {
  const { ring, color } = CONFIG;
  const g = SvgUtils.group();
  const rings = MathUtils.randInt(ring.countMin, ring.countMax);

  for (let r = 0; r < rings; r++) {
    const radius = ring.radiusBase + r * MathUtils.rand(ring.radiusStepMin, ring.radiusStepMax);
    const delay = (0.15 + r * 0.05).toFixed(3);

    angles.forEach((a, i) => {
      if (Math.random() > ring.skipProbability) return;

      const na = angles[(i + 1) % rayCount];
      const span = (na - a + Math.PI * 2) % (Math.PI * 2);
      const wr = radius + MathUtils.rand(-ring.wobbleRange, ring.wobbleRange);

      const x1 = cx + Math.cos(a) * radius;
      const y1 = cy + Math.sin(a) * radius;
      const x2 = cx + Math.cos(na) * radius;
      const y2 = cy + Math.sin(na) * radius;

      const arc = SvgUtils.create("path", {
        d: `M${x1},${y1} A${wr},${wr} 0 ${span > Math.PI ? 1 : 0},1 ${x2},${y2}`,
        stroke: ColorUtils.oklch(color.ring),
        "stroke-width": ring.stroke,
        fill: "none" });


      arc.style.animation = `drawLine 0.18s ${delay}s ease-out forwards`;
      g.appendChild(arc);
    });
  }
  return g;
};var _buildDustLayer2 = function _buildDustLayer2(

cx, cy) {
  const { dust, color } = CONFIG;
  const g = SvgUtils.group();

  for (let i = 0; i < dust.count; i++) {
    const a = MathUtils.rand(0, Math.PI * 2);
    const d = Math.random() * dust.radius;
    const x = cx + Math.cos(a) * d;
    const y = cy + Math.sin(a) * d;
    const len = MathUtils.rand(dust.lenMin, dust.lenMax);

    const dustEl = SvgUtils.create("path", {
      d: `M${x},${y} L${x + Math.cos(a) * len},${y + Math.sin(a) * len}`,
      stroke: ColorUtils.oklch(color.dust),
      "stroke-width": MathUtils.rand(dust.strokeMin, dust.strokeMax),
      fill: "none" });


    dustEl.style.animation = "drawLine 0.1s ease-out forwards";
    g.appendChild(dustEl);
  }
  return g;
};var _spawnParticles2 = function _spawnParticles2(

cx, cy) {
  const { particle, color } = CONFIG;
  const count = MathUtils.randInt(particle.countMin, particle.countMax);

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");

    Object.assign(el.style, {
      position: "fixed",
      width: `${MathUtils.rand(particle.widthMin, particle.widthMax)}px`,
      height: `${MathUtils.rand(particle.heightMin, particle.heightMax)}px`,
      background: ColorUtils.oklchRandA(color.particle),
      boxShadow: `0 2px 4px ${color.particleShadow}`,
      left: `${cx}px`,
      top: `${cy}px`,
      pointerEvents: "none",
      zIndex: 20,
      borderRadius: Math.random() > 0.5 ? "2px" : "50%" });


    document.body.appendChild(el);

    const a = MathUtils.rand(0, Math.PI * 2);
    const f = MathUtils.rand(particle.forceMin, particle.forceMax);
    const vx = Math.cos(a) * f;
    const vy = Math.sin(a) * f - particle.liftOffset;
    const rot = MathUtils.rand(-particle.rotateMax, particle.rotateMax);

    el.animate(
    [
    { transform: "translate(-50%,-50%)", opacity: 1 },
    {
      transform: `translate(${vx * 0.6}px,${vy}px) rotate(${rot * 0.4}deg)`,
      opacity: 1, offset: 0.4 },

    {
      transform: `translate(${vx}px,${vy + MathUtils.rand(particle.gravityMin, particle.gravityMax)}px) rotate(${rot}deg)`,
      opacity: 0 }],


    {
      duration: MathUtils.rand(particle.durationMin, particle.durationMax),
      easing: "cubic-bezier(0.25,0.8,0.5,1)",
      fill: "forwards" }).

    onfinish = () => el.remove();
  }
};var _shakeScreen2 = function _shakeScreen2()

{
  const { intensity, duration } = CONFIG.shake;
  if (intensity <= 0) return;

  const coinFlip = Math.random() < 0.5 ? -1 : 1;
  const shake = coinFlip * intensity;

  document.body.animate(
  [
  { transform: "translate(0,0)" },
  { transform: `translate(${shake}px,${shake * 0.5}px)` },
  { transform: `translate(${shake}px,${shake}px)` },
  { transform: "translate(0,0)" }],

  { duration, easing: "ease-in-out" });

};


document.addEventListener("DOMContentLoaded", () => {
  const engine = new GlassShatterEngine("glass-svg", "smash");
  const pane = new Pane({ title: "⚙️ Settings" });
  const {
    crack,
    ring,
    dust,
    particle,
    shake,
    impact } =
  CONFIG;

  const bind = (folder, target, key, opts) =>
  folder.addBinding(target, key, opts);

  const crackDir = pane.addFolder({ title: "Crack" });
  bind(crackDir, crack, "rayCountMin", { min: 2, max: 16, step: 1, label: "Min Rays" });
  bind(crackDir, crack, "rayCountMax", { min: 4, max: 32, step: 1, label: "Max Rays" });
  bind(crackDir, crack, "maxRadiusMin", { min: 50, max: 300, step: 10, label: "Min Radius" });
  bind(crackDir, crack, "maxRadiusMax", { min: 100, max: 800, step: 10, label: "Max Radius" });
  bind(crackDir, crack, "branchProbability", { min: 0, max: 1, step: 0.05, label: "Branch Odds" });

  const particleDir = pane.addFolder({ title: "Rings & Debris" });
  bind(particleDir, ring, "countMax", { min: 0, max: 12, step: 1, label: "Max Rings" });
  bind(particleDir, dust, "count", { min: 0, max: 50, step: 1, label: "Dust" });
  bind(particleDir, particle, "countMin", { min: 0, max: 50, step: 1, label: "Min" });
  bind(particleDir, particle, "countMax", { min: 0, max: 150, step: 1, label: "Max" });
  bind(particleDir, particle, "forceMax", { min: 100, max: 800, step: 10, label: "Force" });
  bind(particleDir, particle, "gravityMax", { min: 100, max: 1000, step: 10, label: "Gravity" });

  const impactDir = pane.addFolder({ title: "Impact FX" });
  bind(impactDir, shake, "intensity", { min: 0, max: 30, step: 1, label: "Shake" });
  bind(impactDir, impact, "flashDuration", { min: 0, max: 1, step: 0.05, label: "Flash" });

  const actionDir = pane.addFolder({ title: "Actions" });

  actionDir.
  addButton({ title: "Random Smash" }).
  on("click", () => engine.simulateSmash());

  actionDir.
  addButton({ title: "Clear" }).
  on("click", () => engine.reset());
});