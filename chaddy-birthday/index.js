/**
 * PREMIUM BIRTHDAY EXPERIENCE ORCHESTRATOR
 */

const qs = (sel) => document.querySelector(sel);

// Elements
let giftCard, giftIconContainer, mainContainer, loveSvg, moContainer, birthdayCanvas, soundBlup, soundBlop, soundToggle;
let audioCtx;
let isMuted = false;
let currentMusicTimeout = null;

function initElements() {
    giftCard = qs('#gift-card');
    giftIconContainer = qs('#gift-icon-container');
    mainContainer = qs('#main-container');
    loveSvg = qs('#love-svg');
    moContainer = qs('#mo-container');
    birthdayCanvas = qs('#happy-birthday-canvas');
    soundBlup = qs('#sound-blup');
    soundBlop = qs('#sound-blop');
    soundToggle = qs('#sound-toggle');
    
    if (giftCard) giftCard.addEventListener('click', startSequence);
    if (giftIconContainer) giftIconContainer.addEventListener('click', startSequence);
    
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            isMuted = !isMuted;
            qs('#sound-icon').textContent = isMuted ? '🔇' : '🔊';
            
            // If we just unmuted and we are in the birthday phase, restart music
            if (!isMuted && birthdayCanvas && birthdayCanvas.classList.contains('visible')) {
                playBirthdayMusic();
            } else if (isMuted) {
                // Stop the loop
                if (currentMusicTimeout) clearTimeout(currentMusicTimeout);
            }
        });
    }
}

// --- PHASE 0: Background Particles ---
function initBackgroundParticles() {
    const container = qs('#particle-container');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'bg-particle';
        const size = Math.random() * 5 + 2;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        p.style.opacity = Math.random() * 0.5;
        p.style.animation = `floatParticle ${Math.random() * 10 + 10}s linear infinite`;
        p.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(p);
    }
}

// --- PHASE 1: Initialization ---

function startSequence() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    if (giftCard) {
        giftCard.style.transform = 'scale(0.8) translateY(100px)';
        giftCard.style.opacity = '0';
    }
    
    setTimeout(() => {
        if (giftCard) giftCard.classList.add('hidden');
        runLoveAnimation();
    }, 500);
}

// --- PHASE 2: Love Animation (mojs) ---

function runLoveAnimation() {
    if (!loveSvg) return;
    loveSvg.classList.add('visible');

    const el = {
        container: moContainer,
        i: qs(".lttr--I"),
        l: qs(".lttr--L"),
        o: qs(".lttr--O"),
        v: qs(".lttr--V"),
        e: qs(".lttr--E"),
        y: qs(".lttr--Y"),
        o2: qs(".lttr--O2"),
        u: qs(".lttr--U"),
        lineLeft: qs(".line--left"),
        lineRight: qs(".line--rght"),
        colTxt: "#f8f9fa",
        colHeart: "#fa4843",
    };

    // Strict null check to avoid mojs internal errors
    for (let key in el) {
        if (!el[key]) {
            console.warn(`Element ${key} not found, skipping love animation`);
            startBirthdayCelebration();
            return;
        }
    }

    const easingHeart = mojs.easing.path("M0,100C2.9,86.7,33.6-7.3,46-7.3s15.2,22.7,26,22.7S89,0,100,0");

    class Heart extends mojs.CustomShape {
        getShape() { return '<path d="M50,88.9C25.5,78.2,0.5,54.4,3.8,31.1S41.3,1.8,50,29.9c8.7-28.2,42.8-22.2,46.2,1.2S74.5,78.2,50,88.9z"/>'; }
        getLength() { return 200; }
    }
    mojs.addShape("heart", Heart);

    const crtBoom = (delay = 0, x = 0, rd = 46) => {
        const crcl = new mojs.Shape({
            shape: "circle", fill: "none", stroke: el.colTxt, strokeWidth: { 5: 0 },
            radius: { [rd]: [rd + 20] }, easing: "quint.out", duration: 500 / 3,
            parent: el.container, delay, x,
        });
        const brst = new mojs.Burst({
            radius: { [rd + 15]: 110 }, angle: "rand(60, 180)", count: 3,
            timeline: { delay }, parent: el.container, x,
            children: {
                radius: [5, 3, 7], fill: el.colTxt, scale: { 1: 0, easing: "quad.in" },
                pathScale: [0.8, null], degreeShift: ["rand(13, 60)", null],
                duration: 1000 / 3, easing: "quint.out",
            },
        });
        return [crcl, brst];
    };

    const move = 1000;
    const boom = 200;
    const easing = "sin.inOut";
    const easingBoom = "sin.in";
    const easingOut = "sin.out";
    const opts = { duration: move, easing, opacity: 1 };
    const delta = 150;

    const loveTl = new mojs.Timeline();
    
    loveTl.add([
        new mojs.Tween({
            duration: move,
            onStart: () => {
                [el.i, el.l, el.o, el.v, el.e, el.y, el.o2, el.u].forEach((item) => {
                    if (item) item.style.opacity = 1;
                });
            },
            onComplete: () => {
                [el.l, el.o, el.v, el.e].forEach((item) => { if (item) item.style.opacity = 0; });
                if (!isMuted && soundBlop) soundBlop.play();
            },
        }),
        new mojs.Tween({
            duration: move * 2 + boom,
            onComplete: () => {
                [el.y, el.o2].forEach((item) => { if (item) item.style.opacity = 0; });
                if (!isMuted && soundBlop) soundBlop.play();
            },
        }),
        new mojs.Tween({
            duration: move * 3 + boom * 2 - delta,
            onComplete: () => {
                if (el.i) el.i.style.opacity = 0;
                if (!isMuted && soundBlop) soundBlop.play();
            },
        }),
        new mojs.Tween({
            duration: move * 3 + boom * 2,
            onComplete: () => {
                if (el.u) el.u.style.opacity = 0;
                if (!isMuted && soundBlup) soundBlup.play();
            },
        }),
        new mojs.Html({ ...opts, el: el.lineLeft, x: { 0: 52 } })
            .then({ duration: boom + move, easing, x: { to: 52 + 54 } })
            .then({ duration: boom + move, easing, x: { to: 52 + 54 + 60 } })
            .then({ duration: 150, easing, x: { to: 52 + 54 + 60 + 10 } })
            .then({ duration: 300 })
            .then({ duration: 350, x: { to: 0 }, easing: easingOut }),
        new mojs.Html({ ...opts, el: el.lineRight, x: { 0: -52 } })
            .then({ duration: boom + move, easing, x: { to: -52 - 54 } })
            .then({ duration: boom + move, easing, x: { to: -52 - 54 - 60 } })
            .then({ duration: 150, easing, x: { to: -52 - 54 - 60 - 10 } })
            .then({ duration: 300 })
            .then({ duration: 350, x: { to: 0 }, easing: easingOut }),
        new mojs.Html({ ...opts, el: el.i, x: { 0: 34 } })
            .then({ duration: boom, easing: easingBoom, x: { to: 34 + 19 } })
            .then({ duration: move, easing, x: { to: 34 + 19 + 40 } })
            .then({ duration: boom, easing: easingBoom, x: { to: 34 + 19 + 40 + 30 } })
            .then({ duration: move, easing, x: { to: 34 + 19 + 40 + 30 + 30 } }),
        new mojs.Html({ ...opts, el: el.l, x: { 0: 15 } }),
        new mojs.Html({ ...opts, el: el.o, x: { 0: 11 } }),
        new mojs.Html({ ...opts, el: el.v, x: { 0: 3 } }),
        new mojs.Html({ ...opts, el: el.e, x: { 0: -3 } }),
        new mojs.Html({ ...opts, el: el.y, x: { 0: -20 } })
            .then({ duration: boom, easing: easingBoom, x: { to: -20 - 33 } })
            .then({ duration: move, easing, x: { to: -20 - 33 - 24 } }),
        new mojs.Html({ ...opts, el: el.o2, x: { 0: -27 } })
            .then({ duration: boom, easing: easingBoom, x: { to: -27 - 27 } })
            .then({ duration: move, easing, x: { to: -27 - 27 - 30 } }),
        new mojs.Html({ ...opts, el: el.u, x: { 0: -32 } })
            .then({ duration: boom, easing: easingBoom, x: { to: -32 - 21 } })
            .then({ duration: move, easing, x: { to: -32 - 21 - 36 } })
            .then({ duration: boom, easing: easingBoom, x: { to: -32 - 21 - 36 - 31 } })
            .then({ duration: move, easing, x: { to: -32 - 21 - 36 - 31 - 27 } }),
        new mojs.Shape({
            parent: el.container, shape: "heart", delay: move, fill: el.colHeart, x: -64,
            scale: { 0: 0.95, easing: easingHeart }, duration: 500,
        })
            .then({ x: { to: -62, easing }, scale: { to: 0.65, easing }, duration: boom + move - 500 })
            .then({ duration: boom - 50, x: { to: -62 + 48 }, scale: { to: 0.9 }, easing: easingBoom })
            .then({ duration: 125, scale: { to: 0.8 }, easing: easingOut })
            .then({ duration: 125, scale: { to: 0.85 }, easing: easingOut })
            .then({ duration: move - 200, scale: { to: 0.45 }, easing })
            .then({ delay: -75, duration: 150, x: { to: 0 }, scale: { to: 0.9 }, easing: easingBoom })
            .then({ duration: 125, scale: { to: 0.8 }, easing: easingOut })
            .then({ duration: 125, scale: { to: 0.85 }, easing: easingOut })
            .then({ duration: 125 })
            .then({ duration: 350, scale: { to: 0 }, easing: easingOut }),
        ...crtBoom(move, -64, 46),
        ...crtBoom(move * 2 + boom, 18, 34),
        ...crtBoom(move * 3 + boom * 2 - delta, -64, 34),
        ...crtBoom(move * 3 + boom * 2, 45, 34),
    ]);

    loveTl.play();

    setTimeout(() => {
        if (loveSvg) {
            loveSvg.classList.remove('visible');
            loveSvg.style.opacity = '0';
        }
        setTimeout(startBirthdayCelebration, 300);
    }, 4500);
}

// --- PHASE 3: Birthday Celebration ---

function startBirthdayCelebration() {
    if (birthdayCanvas) birthdayCanvas.classList.add('visible');
    initBirthdayAnimation();
    playBirthdayMusic();
}

function initBirthdayAnimation() {
    const c = birthdayCanvas;
    if (!c) return;
    let w = (c.width = window.innerWidth),
        h = (c.height = window.innerHeight),
        ctx = c.getContext("2d"),
        hw = w / 2,
        hh = h / 2;
    
    const winW = window.innerWidth;
    const isMobile = winW < 600;
    
    const maxChars = Math.max(...["Joyeux Anniversaire", "Princesse Chaddy"].map(s => s.length));
    const dynamicSpacing = Math.min(45, (winW * 0.9) / maxChars);
    const dynamicSize = dynamicSpacing * 0.9;

    const opts = {
        strings: ["Joyeux Anniversaire", "Princesse Chaddy"],
        charSize: dynamicSize,
        charSpacing: dynamicSpacing,
        lineHeight: isMobile ? dynamicSize * 1.5 : 60,
        cx: w / 2,
        cy: h / 2,
        fireworkPrevPoints: 10,
        fireworkBaseLineWidth: 5,
        fireworkAddedLineWidth: 8,
        fireworkSpawnTime: 200,
        fireworkBaseReachTime: 30,
        fireworkAddedReachTime: 30,
        fireworkCircleBaseSize: 20,
        fireworkCircleAddedSize: 10,
        fireworkCircleBaseTime: 30,
        fireworkCircleAddedTime: 30,
        fireworkCircleFadeBaseTime: 10,
        fireworkCircleFadeAddedTime: 5,
        fireworkBaseShards: 5,
        fireworkAddedShards: 5,
        fireworkShardPrevPoints: 3,
        fireworkShardBaseVel: 4,
        fireworkShardAddedVel: 2,
        fireworkShardBaseSize: 3,
        fireworkShardAddedSize: 3,
        gravity: 0.1,
        upFlow: -0.1,
        letterContemplatingWaitTime: 360,
        balloonSpawnTime: 20,
        balloonBaseInflateTime: 10,
        balloonAddedInflateTime: 10,
        balloonBaseSize: 20,
        balloonAddedSize: 20,
        balloonBaseVel: 0.4,
        balloonAddedVel: 0.4,
        balloonBaseRadian: -(Math.PI / 2 - 0.5),
        balloonAddedRadian: -1,
    },
    calc = {
        totalWidth: opts.charSpacing * Math.max(...opts.strings.map(s => s.length)),
    },
    Tau = Math.PI * 2,
    TauQuarter = Tau / 4,
    letters = [];

    ctx.font = "bold " + opts.charSize + "px 'Playfair Display'";

    function Letter(char, x, y) {
        this.char = char; this.x = x; this.y = y;
        this.dx = -ctx.measureText(char).width / 2;
        this.dy = +opts.charSize / 2;
        this.fireworkDy = this.y - hh;
        var hue = (x / calc.totalWidth) * 360;
        this.color = "hsl(hue,80%,60%)".replace("hue", hue);
        this.lightAlphaColor = "hsla(hue,80%,light%,alp)".replace("hue", hue);
        this.lightColor = "hsl(hue,80%,light%)".replace("hue", hue);
        this.alphaColor = "hsla(hue,80%,60%,alp)".replace("hue", hue);
        this.reset();
    }

    Letter.prototype.reset = function () {
        this.phase = "firework"; this.tick = 0; this.spawned = false;
        this.spawningTime = (opts.fireworkSpawnTime * Math.random()) | 0;
        this.reachTime = (opts.fireworkBaseReachTime + opts.fireworkAddedReachTime * Math.random()) | 0;
        this.lineWidth = opts.fireworkBaseLineWidth + opts.fireworkAddedLineWidth * Math.random();
        this.prevPoints = [[0, hh, 0]];
    };

    Letter.prototype.step = function () {
        if (this.phase === "firework") {
            if (!this.spawned) {
                ++this.tick;
                if (this.tick >= this.spawningTime) { this.tick = 0; this.spawned = true; }
            } else {
                ++this.tick;
                var linearProportion = this.tick / this.reachTime,
                    armonicProportion = Math.sin(linearProportion * TauQuarter),
                    x = linearProportion * this.x,
                    y = hh + armonicProportion * this.fireworkDy;
                if (this.prevPoints.length > opts.fireworkPrevPoints) this.prevPoints.shift();
                this.prevPoints.push([x, y, linearProportion * this.lineWidth]);
                var lineWidthProportion = 1 / (this.prevPoints.length - 1);
                for (var i = 1; i < this.prevPoints.length; ++i) {
                    var point = this.prevPoints[i], point2 = this.prevPoints[i - 1];
                    ctx.strokeStyle = this.alphaColor.replace("alp", i / this.prevPoints.length);
                    ctx.lineWidth = point[2] * lineWidthProportion * i;
                    ctx.beginPath(); ctx.moveTo(point[0], point[1]); ctx.lineTo(point2[0], point2[1]); ctx.stroke();
                }
                if (this.tick >= this.reachTime) {
                    this.phase = "contemplate";
                    this.circleFinalSize = opts.fireworkCircleBaseSize + opts.fireworkCircleAddedSize * Math.random();
                    this.circleCompleteTime = (opts.fireworkCircleBaseTime + opts.fireworkCircleAddedTime * Math.random()) | 0;
                    this.circleCreating = true; this.circleFading = false;
                    this.circleFadeTime = (opts.fireworkCircleFadeBaseTime + opts.fireworkCircleFadeAddedTime * Math.random()) | 0;
                    this.tick = 0; this.tick2 = 0; this.shards = [];
                    var shardCount = (opts.fireworkBaseShards + opts.fireworkAddedShards * Math.random()) | 0,
                        angle = Tau / shardCount, cos = Math.cos(angle), sin = Math.sin(angle), sx = 1, sy = 0;
                    for (var i = 0; i < shardCount; ++i) {
                        var x1 = sx; sx = sx * cos - sy * sin; sy = sy * cos + x1 * sin;
                        this.shards.push(new Shard(this.x, this.y, sx, sy, this.alphaColor));
                    }
                }
            }
        } else if (this.phase === "contemplate") {
            ++this.tick;
            if (this.circleCreating) {
                ++this.tick2;
                var proportion = this.tick2 / this.circleCompleteTime, armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;
                ctx.beginPath();
                ctx.fillStyle = this.lightAlphaColor.replace("light", 50 + 50 * proportion).replace("alp", proportion);
                ctx.arc(this.x, this.y, armonic * this.circleFinalSize, 0, Tau);
                ctx.fill();
                if (this.tick2 > this.circleCompleteTime) { this.tick2 = 0; this.circleCreating = false; this.circleFading = true; }
            } else if (this.circleFading) {
                ctx.fillStyle = this.lightColor.replace("light", 70);
                ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
                ++this.tick2;
                var proportion = this.tick2 / this.circleFadeTime, armonic = -Math.cos(proportion * Math.PI) / 2 + 0.5;
                ctx.beginPath();
                ctx.fillStyle = this.lightAlphaColor.replace("light", 100).replace("alp", 1 - armonic);
                ctx.arc(this.x, this.y, this.circleFinalSize, 0, Tau);
                ctx.fill();
                if (this.tick2 >= this.circleFadeTime) this.circleFading = false;
            } else {
                ctx.fillStyle = this.lightColor.replace("light", 70);
                ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
            }
            for (var i = 0; i < this.shards.length; ++i) {
                this.shards[i].step();
                if (!this.shards[i].alive) { this.shards.splice(i, 1); --i; }
            }
            if (this.tick > opts.letterContemplatingWaitTime) {
                this.phase = "balloon"; this.tick = 0; this.spawning = true;
                this.spawnTime = (opts.balloonSpawnTime * Math.random()) | 0;
                this.inflating = false; this.inflateTime = (opts.balloonBaseInflateTime + opts.balloonAddedInflateTime * Math.random()) | 0;
                this.size = (opts.balloonBaseSize + opts.balloonAddedSize * Math.random()) | 0;
                var rad = opts.balloonBaseRadian + opts.balloonAddedRadian * Math.random(), vel = opts.balloonBaseVel + opts.balloonAddedVel * Math.random();
                this.vx = Math.cos(rad) * vel; this.vy = Math.sin(rad) * vel;
            }
        } else if (this.phase === "balloon") {
            ctx.strokeStyle = this.lightColor.replace("light", 80);
            if (this.spawning) {
                ++this.tick; ctx.fillStyle = this.lightColor.replace("light", 70);
                ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
                if (this.tick >= this.spawnTime) { this.tick = 0; this.spawning = false; this.inflating = true; }
            } else if (this.inflating) {
                ++this.tick;
                var proportion = this.tick / this.inflateTime, bx = (this.cx = this.x), by = (this.cy = this.y - this.size * proportion);
                ctx.fillStyle = this.alphaColor.replace("alp", proportion);
                ctx.beginPath(); generateBalloonPath(bx, by, this.size * proportion); ctx.fill();
                ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, this.y); ctx.stroke();
                ctx.fillStyle = this.lightColor.replace("light", 70);
                ctx.fillText(this.char, this.x + this.dx, this.y + this.dy);
                if (this.tick >= this.inflateTime) { this.tick = 0; this.inflating = false; }
            } else {
                this.cx += this.vx; this.cy += this.vy += opts.upFlow;
                ctx.fillStyle = this.color; ctx.beginPath(); generateBalloonPath(this.cx, this.cy, this.size); ctx.fill();
                ctx.beginPath(); ctx.moveTo(this.cx, this.cy); ctx.lineTo(this.cx, this.cy + this.size); ctx.stroke();
                ctx.fillStyle = this.lightColor.replace("light", 70);
                ctx.fillText(this.char, this.cx + this.dx, this.cy + this.dy + this.size);
                if (this.cy + this.size < -hh || this.cx < -hw || this.cy > hw) this.phase = "done";
            }
        }
    };

    function Shard(x, y, vx, vy, color) {
        var vel = opts.fireworkShardBaseVel + opts.fireworkShardAddedVel * Math.random();
        this.vx = vx * vel; this.vy = vy * vel; this.x = x; this.y = y;
        this.prevPoints = [[x, y]]; this.color = color; this.alive = true;
        this.size = opts.fireworkShardBaseSize + opts.fireworkShardAddedSize * Math.random();
    }
    Shard.prototype.step = function () {
        this.x += this.vx; this.y += this.vy += opts.gravity;
        if (this.prevPoints.length > opts.fireworkShardPrevPoints) this.prevPoints.shift();
        this.prevPoints.push([this.x, this.y]);
        var lineWidthProportion = this.size / this.prevPoints.length;
        for (var k = 0; k < this.prevPoints.length - 1; ++k) {
            var point = this.prevPoints[k], point2 = this.prevPoints[k + 1];
            ctx.strokeStyle = this.color.replace("alp", k / this.prevPoints.length);
            ctx.lineWidth = k * lineWidthProportion;
            ctx.beginPath(); ctx.moveTo(point[0], point[1]); ctx.lineTo(point2[0], point2[1]); ctx.stroke();
        }
        if (this.prevPoints[0][1] > hh) this.alive = false;
    };

    function generateBalloonPath(x, y, size) {
        ctx.moveTo(x, y);
        ctx.bezierCurveTo(x - size / 2, y - size / 2, x - size / 4, y - size, x, y - size);
        ctx.bezierCurveTo(x + size / 4, y - size, x + size / 2, y - size / 2, x, y);
    }

    function anim() {
        window.requestAnimationFrame(anim);
        ctx.clearRect(0, 0, w, h);
        ctx.translate(hw, hh);
        var done = true;
        for (var l = 0; l < letters.length; ++l) {
            letters[l].step();
            if (letters[l].phase !== "done") done = false;
        }
        ctx.translate(-hw, -hh);
        if (done) for (var l = 0; l < letters.length; ++l) letters[l].reset();
    }

    for (let i = 0; i < opts.strings.length; ++i) {
        for (var j = 0; j < opts.strings[i].length; ++j) {
            letters.push(new Letter(opts.strings[i][j],
                j * opts.charSpacing + opts.charSpacing / 2 - (opts.strings[i].length * opts.charSpacing) / 2,
                i * opts.lineHeight + opts.lineHeight / 2 - (opts.strings.length * opts.lineHeight) / 2
            ));
        }
    }

    anim();

    window.addEventListener("resize", function () {
        w = c.width = window.innerWidth; h = c.height = window.innerHeight;
        hw = w / 2; hh = h / 2;
        ctx.font = "bold " + opts.charSize + "px 'Playfair Display'";
    });
}

let melodyNoteIndex = 0;
const melodyNotes = [
    { f: 262, d: .5 }, { f: 262, d: .5 }, { f: 294, d: 1 }, { f: 262, d: 1 }, { f: 349, d: 1 }, { f: 330, d: 2 },
    { f: 262, d: .5 }, { f: 262, d: .5 }, { f: 294, d: 1 }, { f: 262, d: 1 }, { f: 392, d: 1 }, { f: 349, d: 2 },
    { f: 262, d: .5 }, { f: 262, d: .5 }, { f: 523, d: 1 }, { f: 440, d: 1 }, { f: 349, d: 1 }, { f: 330, d: 1 }, { f: 294, d: 3 },
    { f: 466, d: .5 }, { f: 466, d: .5 }, { f: 440, d: 1 }, { f: 349, d: 1 }, { f: 392, d: 1 }, { f: 349, d: 2 },
];

function playBirthdayMusic() {
    if (isMuted || !audioCtx) return;

    function playNextNote() {
        if (isMuted) return; // Stop the loop if muted

        if (melodyNoteIndex >= melodyNotes.length) {
            melodyNoteIndex = 0; // Loop
        }

        const note = melodyNotes[melodyNoteIndex];
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "triangle";
        osc.frequency.value = note.f;
        gain.gain.value = 0.1;
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + note.d);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + note.d);

        const delay = note.d * 400; 
        
        melodyNoteIndex++;
        currentMusicTimeout = setTimeout(playNextNote, delay);
    }

    playNextNote();
}

// Global Initialization
window.addEventListener('DOMContentLoaded', () => {
    initElements();
    initBackgroundParticles();
});
