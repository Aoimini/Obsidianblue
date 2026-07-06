// Matter.js Module Aliases
const { Engine, World, Bodies, Body, Composite, Constraint, Vector, Events } = Matter;

// Game State Constants
const DESK_WIDTH = 800;
const DESK_HEIGHT = 600;
const DESK_MARGIN = 35; // Margin from canvas border to simulated desk edge
const DESK_PLAYABLE_WIDTH = DESK_WIDTH - DESK_MARGIN * 2;
const DESK_PLAYABLE_HEIGHT = DESK_HEIGHT - DESK_MARGIN * 2;

// Audio Variables
let audioCtx = null;

// Game Variables
let engine;
let world;
let canvas;
let ctx;
let playerEraser;
let cpuEraser;
let deskHazards = [];
let compassSpinner = null;
let pencils = [];

// Game Systems
let doodles = [];
let eraserDust = [];
let superGauge = 0; // 0 to 100
let isSuperFlickReady = false;
let currentTurn = 'player'; // 'player', 'cpu', 'sliding'
let lastTurnOwner = 'cpu'; // Track who played last to alternate turns ('player' or 'cpu')
let gameState = 'menu'; // 'menu', 'playing', 'gameover'
let winner = null;

// Interaction Variables (Player)
let isDragging = false;
let dragStartPos = { x: 0, y: 0 };
let dragCurrentPos = { x: 0, y: 0 };

// CPU Interaction variables (separating CPU visual dragging from player input)
let cpuIsDragging = false;
let cpuDragStartPos = { x: 0, y: 0 };
let cpuDragCurrentPos = { x: 0, y: 0 };

const MAX_DRAG_DIST = 150;
const FLICK_FORCE_MULTIPLIER = 0.003;
const SUPER_FLICK_FORCE_MULTIPLIER = 0.0055;

// Animation States
let fallAnimationPlayer = null; // { body, scale: 1, yOffset: 0 }
let fallAnimationCpu = null;
let screenShakeIntensity = 0;
let timeScale = 1.0;

// Setup listeners when page loads
window.addEventListener('DOMContentLoaded', () => {
    initUI();
});

// Initialize UI and DOM Event Listeners
function initUI() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    // Set fixed canvas size
    canvas.width = DESK_WIDTH;
    canvas.height = DESK_HEIGHT;

    // Start Button
    document.getElementById('start-game-btn').addEventListener('click', () => {
        initAudio();
        startGame();
    });

    // How to Play Button
    document.getElementById('how-to-btn').addEventListener('click', () => {
        document.getElementById('how-to-screen').classList.remove('hidden');
    });

    // Back to Menu Button
    document.getElementById('back-to-menu-btn').addEventListener('click', () => {
        document.getElementById('how-to-screen').classList.add('hidden');
    });

    // Restart Button
    document.getElementById('restart-btn').addEventListener('click', () => {
        startGame();
    });

    // Go to Menu Button
    document.getElementById('menu-btn').addEventListener('click', () => {
        showScreen('menu-screen');
        gameState = 'menu';
    });

    // Give Up Button
    document.getElementById('give-up-btn').addEventListener('click', () => {
        endGame('cpu');
    });

    // Canvas Mouse Events
    canvas.addEventListener('mousedown', handlePointerDown);
    canvas.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    // Canvas Touch Events (Mobile support)
    canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            handlePointerDown({
                clientX: touch.clientX,
                clientY: touch.clientY,
                preventDefault: () => e.preventDefault()
            });
        }
    });
    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            handlePointerMove({
                clientX: touch.clientX,
                clientY: touch.clientY,
                preventDefault: () => e.preventDefault()
            });
        }
    });
    window.addEventListener('touchend', () => {
        handlePointerUp();
    });

    // Initialize Game loop background running
    requestAnimationFrame(gameLoop);
}

// Initialize Web Audio Context (user interaction triggered)
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// ----------------------------------------------------
// Sound Synthesis Engine (Web Audio API)
// ----------------------------------------------------
function playSound(type) {
    if (!audioCtx) return;
    
    const now = audioCtx.currentTime;
    
    switch (type) {
        case 'flick': {
            // Slingshot release sound (sharp pitch drop)
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(250, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
            
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            
            osc.start(now);
            osc.stop(now + 0.15);
            break;
        }
        case 'super_flick': {
            // Power flick sound (heavy laser/blast sweep)
            const osc = audioCtx.createOscillator();
            const noise = createNoiseBuffer();
            const noiseNode = audioCtx.createBufferSource();
            const noiseGain = audioCtx.createGain();
            const gain = audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(60, now + 0.35);
            
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            
            if (noise) {
                noiseNode.buffer = noise;
                noiseNode.connect(noiseGain);
                noiseGain.connect(audioCtx.destination);
                noiseGain.gain.setValueAtTime(0.15, now);
                noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                noiseNode.start(now);
            }
            
            osc.start(now);
            osc.stop(now + 0.35);
            break;
        }
        case 'collision_wood': {
            // Wooden impact clack
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.08);
            
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            
            osc.start(now);
            osc.stop(now + 0.08);
            break;
        }
        case 'erase': {
            // Squeaky chalk/eraser clean sound (high pitch sweep)
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800 + Math.random() * 200, now);
            osc.frequency.linearRampToValueAtTime(600, now + 0.05);
            
            gain.gain.setValueAtTime(0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            
            osc.start(now);
            osc.stop(now + 0.05);
            break;
        }
        case 'fall': {
            // Pitch descend for falling off
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.6);
            
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
            
            osc.start(now);
            osc.stop(now + 0.6);
            break;
        }
        case 'win_chime': {
            // Upbeat chime sequence (Westminster segment modified)
            playMelody([
                { f: 261.63, d: 200 }, // C4
                { f: 329.63, d: 200 }, // E4
                { f: 293.66, d: 200 }, // D4
                { f: 392.00, d: 500 }  // G4
            ]);
            break;
        }
        case 'lose_chime': {
            // Sad chime sequence
            playMelody([
                { f: 293.66, d: 250 }, // D4
                { f: 277.18, d: 250 }, // C#4
                { f: 261.63, d: 250 }, // C4
                { f: 196.00, d: 600 }  // G3 (slow/heavy)
            ]);
            break;
        }
    }
}

function createNoiseBuffer() {
    if (!audioCtx) return null;
    const bufferSize = audioCtx.sampleRate * 0.4;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    return buffer;
}

function playMelody(notes) {
    let delay = 0;
    notes.forEach(note => {
        setTimeout(() => {
            if (gameState !== 'playing' && gameState !== 'gameover') return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.f, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + note.d / 1000);
            osc.start();
            osc.stop(audioCtx.currentTime + note.d / 1000);
        }, delay);
        delay += note.d;
    });
}

// ----------------------------------------------------
// Game Initialization & Setup
// ----------------------------------------------------
function startGame() {
    // 1. Setup Engine & World
    if (engine) {
        World.clear(world);
        Engine.clear(engine);
    }
    engine = Engine.create({
        gravity: { x: 0, y: 0 } // Top-down view (no vertical gravity on desk surface)
    });
    world = engine.world;

    // Reset variables
    doodles = [];
    eraserDust = [];
    superGauge = 0;
    isSuperFlickReady = false;
    currentTurn = 'player';
    lastTurnOwner = 'cpu';
    gameState = 'playing';
    winner = null;
    fallAnimationPlayer = null;
    fallAnimationCpu = null;
    screenShakeIntensity = 0;
    timeScale = 1.0;
    isDragging = false;
    cpuIsDragging = false;
    
    updateSuperGaugeUI();
    document.getElementById('turn-text').textContent = 'あなた';
    document.getElementById('turn-text').className = 'value text-player';
    
    // Hide all overlays, show HUD
    showScreen('hud');
    document.getElementById('hud').classList.remove('hidden');

    // 2. Generate Classroom Desk Layout
    // Outer desk border boundaries (just for checks, no physical walls to allow falling off!)
    
    // A: Player Eraser
    playerEraser = Bodies.rectangle(DESK_WIDTH * 0.25, DESK_HEIGHT * 0.5, 60, 35, {
        mass: 1.5,
        restitution: 0.4,   // Semi-bouncy
        friction: 0.04,     // Friction against table surface
        frictionAir: 0.012, // Damping
        label: 'player'
    });

    // B: CPU Eraser
    cpuEraser = Bodies.rectangle(DESK_WIDTH * 0.75, DESK_HEIGHT * 0.5, 60, 35, {
        mass: 1.5,
        restitution: 0.4,
        friction: 0.04,
        frictionAir: 0.012,
        label: 'cpu'
    });

    World.add(world, [playerEraser, cpuEraser]);

    // C: Hazards - Spinning Compass in the Center
    const compassPin = Bodies.circle(DESK_WIDTH * 0.5, DESK_HEIGHT * 0.5, 8, {
        isStatic: true,
        label: 'compass-pin'
    });
    const compassArm = Bodies.rectangle(DESK_WIDTH * 0.5, DESK_HEIGHT * 0.5, 140, 10, {
        mass: 2.5,
        restitution: 0.6,
        friction: 0.01,
        frictionAir: 0.005,
        label: 'compass-arm'
    });
    const compassConstraint = Constraint.create({
        bodyA: compassPin,
        bodyB: compassArm,
        pointB: { x: 0, y: 0 },
        stiffness: 1,
        length: 0
    });
    
    compassSpinner = { pin: compassPin, arm: compassArm, constraint: compassConstraint };
    World.add(world, [compassPin, compassArm, compassConstraint]);

    // D: Hazards - Hexagonal Rolling Pencils (Narrow Rectangles)
    pencils = [];
    const pencilPositions = [
        { x: DESK_WIDTH * 0.5, y: DESK_HEIGHT * 0.22, angle: Math.PI / 4 },
        { x: DESK_WIDTH * 0.5, y: DESK_HEIGHT * 0.78, angle: -Math.PI / 4 }
    ];
    
    pencilPositions.forEach((pos, idx) => {
        const pencil = Bodies.rectangle(pos.x, pos.y, 110, 10, {
            mass: 0.6, // Lighter than erasers
            restitution: 0.5,
            friction: 0.02,
            frictionAir: 0.01,
            angle: pos.angle,
            label: `pencil-${idx}`
        });
        pencils.push(pencil);
        World.add(world, pencil);
    });

    // E: Glue Puddles (coordinates, dimensions for drawing & damping checks)
    deskHazards = [
        { type: 'glue', x: DESK_WIDTH * 0.35, y: DESK_HEIGHT * 0.3, radius: 45 },
        { type: 'glue', x: DESK_WIDTH * 0.65, y: DESK_HEIGHT * 0.7, radius: 45 }
    ];

    // F: Generate Pencil Scribbles (Doodles to erase)
    generateDoodles();

    // Collision event for sound and sparks
    Events.on(engine, 'collisionStart', (event) => {
        event.pairs.forEach(pair => {
            const speed = Math.max(pair.bodyA.speed, pair.bodyB.speed);
            if (speed > 1.5) {
                // Play impact wood sound
                playSound('collision_wood');
                // Trigger screen shake proportional to speed
                screenShakeIntensity = Math.min(screenShakeIntensity + speed * 1.5, 12);
                
                // Spawn impact sparks (dust) at collision points
                const contacts = pair.activeContacts;
                if (contacts) {
                    contacts.forEach(contact => {
                        const pt = contact.vertex;
                        if (pt) spawnSparks(pt.x, pt.y, speed * 2);
                    });
                }
            }
        });
    });
}

// ----------------------------------------------------
// Scribble & Eraser Dust Generator
// ----------------------------------------------------
function generateDoodles() {
    doodles = [];
    
    // Pencil doodle presets (coordinates relative to canvas)
    const presets = [
        // Star doodle
        makeStarPath(DESK_WIDTH * 0.2, DESK_HEIGHT * 0.28, 40),
        makeStarPath(DESK_WIDTH * 0.8, DESK_HEIGHT * 0.28, 40),
        // Spiral in player/cpu paths
        makeSpiralPath(DESK_WIDTH * 0.3, DESK_HEIGHT * 0.5, 30),
        makeSpiralPath(DESK_WIDTH * 0.7, DESK_HEIGHT * 0.5, 30),
        // Mathematical / Classroom doodles
        makeFormulaPath("x+y=?", DESK_WIDTH * 0.45, DESK_HEIGHT * 0.12),
        makeFormulaPath("1+1=100", DESK_WIDTH * 0.45, DESK_HEIGHT * 0.88),
        // Smiley Face
        makeSmileyPath(DESK_WIDTH * 0.5, DESK_HEIGHT * 0.35, 25)
    ];

    presets.forEach(path => {
        path.forEach(pt => {
            doodles.push({ x: pt.x, y: pt.y, erased: false });
        });
    });
}

function makeStarPath(cx, cy, size) {
    const pts = [];
    const steps = 10;
    for (let i = 0; i < steps; i++) {
        const r = (i % 2 === 0) ? size : size / 2.2;
        const angle = (Math.PI * 2 / steps) * i - Math.PI / 2;
        pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
    // Interpolate points for finer line resolution
    return interpolatePoints(pts, 6);
}

function makeSpiralPath(cx, cy, maxR) {
    const pts = [];
    const steps = 40;
    for (let i = 0; i < steps; i++) {
        const r = (i / steps) * maxR;
        const angle = i * 0.4;
        pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
    return interpolatePoints(pts, 6);
}

function makeFormulaPath(text, startX, startY) {
    // Basic vector representation of simple characters for canvas doodles
    // To keep it clean, we just draw nice small scribbles here using simple custom vectors
    const pts = [];
    let curX = startX;
    for (let char of text) {
        if (char === 'x') {
            pts.push({x: curX, y: startY}, {x: curX+12, y: startY+12});
            pts.push({x: curX+12, y: startY}, {x: curX, y: startY+12});
        } else if (char === '+') {
            pts.push({x: curX+6, y: startY}, {x: curX+6, y: startY+12});
            pts.push({x: curX, y: startY+6}, {x: curX+12, y: startY+6});
        } else if (char === 'y') {
            pts.push({x: curX, y: startY}, {x: curX+6, y: startY+6}, {x: curX+12, y: startY});
            pts.push({x: curX+6, y: startY+6}, {x: curX+6, y: startY+12});
        } else if (char === '=') {
            pts.push({x: curX, y: startY+3}, {x: curX+12, y: startY+3});
            pts.push({x: curX, y: startY+9}, {x: curX+12, y: startY+9});
        } else if (char === '?') {
            pts.push({x: curX, y: startY+2}, {x: curX+6, y: startY}, {x: curX+12, y: startY+3}, {x: curX+6, y: startY+7}, {x: curX+6, y: startY+10});
        } else if (char === '1') {
            pts.push({x: curX+3, y: startY+2}, {x: curX+6, y: startY}, {x: curX+6, y: startY+12});
        } else if (char === '0') {
            pts.push({x: curX, y: startY}, {x: curX+10, y: startY}, {x: curX+10, y: startY+12}, {x: curX, y: startY+12}, {x: curX, y: startY});
        }
        curX += 20;
    }
    return pts;
}

function makeSmileyPath(cx, cy, r) {
    const pts = [];
    // Face circle (bottom half)
    for (let angle = 0; angle <= Math.PI; angle += 0.2) {
        pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * (r * 0.8) });
    }
    // Eyes
    pts.push({ x: cx - r/2, y: cy - r/4 });
    pts.push({ x: cx + r/2, y: cy - r/4 });
    return pts;
}

function interpolatePoints(pts, maxDist) {
    const result = [];
    if (pts.length === 0) return result;
    result.push(pts[0]);
    for (let i = 1; i < pts.length; i++) {
        const p1 = pts[i-1];
        const p2 = pts[i];
        const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        if (dist > maxDist) {
            const steps = Math.floor(dist / maxDist);
            for (let s = 1; s <= steps; s++) {
                const t = s / (steps + 1);
                result.push({
                    x: p1.x + (p2.x - p1.x) * t,
                    y: p1.y + (p2.y - p1.y) * t
                });
            }
        }
        result.push(p2);
    }
    return result;
}

function spawnSparks(x, y, count) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        eraserDust.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            radius: Math.random() * 2.5 + 1.5,
            alpha: 1.0,
            decay: Math.random() * 0.015 + 0.005,
            isSpark: true
        });
    }
}

// ----------------------------------------------------
// UI Screen Switcher
// ----------------------------------------------------
function showScreen(screenId) {
    // Hide all overlays
    document.querySelectorAll('.screen').forEach(scr => scr.classList.add('hidden'));
    
    if (screenId === 'hud') {
        document.getElementById('hud').classList.remove('hidden');
    } else {
        document.getElementById('hud').classList.add('hidden');
        document.getElementById(screenId).classList.remove('hidden');
    }
}

// ----------------------------------------------------
// Input Handling & Slingshot Drag-and-Release
// ----------------------------------------------------
function getCanvasMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) * (DESK_WIDTH / rect.width),
        y: (e.clientY - rect.top) * (DESK_HEIGHT / rect.height)
    };
}

function handlePointerDown(e) {
    if (gameState !== 'playing' || currentTurn !== 'player') return;
    if (fallAnimationPlayer || fallAnimationCpu) return;

    const mousePos = getCanvasMousePos(e);
    
    // Check if clicked inside Player Eraser
    const distToPlayer = Math.hypot(mousePos.x - playerEraser.position.x, mousePos.y - playerEraser.position.y);
    
    if (distToPlayer < 45) { // Interactive radius slightly larger than rectangle bounds
        isDragging = true;
        dragStartPos = { x: playerEraser.position.x, y: playerEraser.position.y };
        dragCurrentPos = { ...mousePos };
        if (e.preventDefault) e.preventDefault();
    }
}

function handlePointerMove(e) {
    if (!isDragging) return;
    
    const mousePos = getCanvasMousePos(e);
    dragCurrentPos = { ...mousePos };
    if (e.preventDefault) e.preventDefault();
}

function handlePointerUp() {
    if (!isDragging) return;
    isDragging = false;

    // Calculate pull vector (slingshot: launch is opposite to pull direction)
    const dx = dragStartPos.x - dragCurrentPos.x;
    const dy = dragStartPos.y - dragCurrentPos.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 15) { // Minimum pull distance threshold
        // Apply impulse
        const pullDir = { x: dx / dist, y: dy / dist };
        const forceMagnitude = Math.min(dist, MAX_DRAG_DIST);
        
        let forceMultiplier = FLICK_FORCE_MULTIPLIER;
        if (isSuperFlickReady) {
            forceMultiplier = SUPER_FLICK_FORCE_MULTIPLIER;
            playSound('super_flick');
            isSuperFlickReady = false;
            superGauge = 0;
            updateSuperGaugeUI();
            
            // Heavy recoil sparks
            spawnSparks(playerEraser.position.x, playerEraser.position.y, 25);
            screenShakeIntensity = 10;
        } else {
            playSound('flick');
        }

        const force = {
            x: pullDir.x * forceMagnitude * forceMultiplier,
            y: pullDir.y * forceMagnitude * forceMultiplier
        };

        // Apply force to player eraser center of mass
        Body.applyForce(playerEraser, playerEraser.position, force);
        
        // Pass turn
        lastTurnOwner = 'player';
        currentTurn = 'sliding';
        
        // Wait for bodies to stop moving to trigger CPU turn
        setTimeout(checkTurnState, 800);
    }
}

// ----------------------------------------------------
// CPU AI Decision Engine
// ----------------------------------------------------
function executeCpuTurn() {
    if (gameState !== 'playing' || winner !== null) return;
    
    document.getElementById('turn-text').textContent = '相手 (思考中...)';
    document.getElementById('turn-text').className = 'value text-cpu';

    // Wait 1.5 seconds for visual thinking pause
    setTimeout(() => {
        if (gameState !== 'playing') return;

        // Calculate direct line to Player
        const dx = playerEraser.position.x - cpuEraser.position.x;
        const dy = playerEraser.position.y - cpuEraser.position.y;
        const dist = Math.hypot(dx, dy);
        
        let targetAngle = Math.atan2(dy, dx);

        // CPU Logic: Add slight randomness based on distance (worse aim when far)
        const aimError = (Math.random() - 0.5) * (dist > 350 ? 0.25 : 0.08);
        targetAngle += aimError;

        // Calculate ideal force
        // CPU needs enough power to reach player but tries not to slide off the table
        let targetForceVal = dist * 0.0035; // base scaling
        
        // Make sure force matches standard capability
        const maxCpuForce = MAX_DRAG_DIST * FLICK_FORCE_MULTIPLIER;
        targetForceVal = Math.min(targetForceVal, maxCpuForce);
        targetForceVal = Math.max(targetForceVal, 0.15); // minimum force

        // If CPU is close to the desk edge behind it, it might pull a bit harder to escape danger
        const distToLeftEdge = cpuEraser.position.x - DESK_MARGIN;
        const distToRightEdge = DESK_WIDTH - DESK_MARGIN - cpuEraser.position.x;
        const distToTopEdge = cpuEraser.position.y - DESK_MARGIN;
        const distToBottomEdge = DESK_HEIGHT - DESK_MARGIN - cpuEraser.position.y;
        
        const minEdgeDist = Math.min(distToLeftEdge, distToRightEdge, distToTopEdge, distToBottomEdge);
        if (minEdgeDist < 60) {
            // CPU is in danger, shoot strongly to save itself or sacrifice to trade
            targetForceVal = Math.min(targetForceVal * 1.3, maxCpuForce);
        }

        // Animate the CPU pulling back (slingshot arrow representation)
        animateCpuDrag(targetAngle, targetForceVal);
    }, 1200);
}

function animateCpuDrag(angle, targetForceVal) {
    const maxDragPixels = (targetForceVal / FLICK_FORCE_MULTIPLIER);
    let currentDragPixels = 0;
    
    const dragInterval = setInterval(() => {
        if (gameState !== 'playing') {
            clearInterval(dragInterval);
            cpuIsDragging = false;
            return;
        }

        currentDragPixels += 8;
        
        // Simulate drag coordinates (pulling opposite to launch angle) using CPU variables
        cpuDragStartPos = { x: cpuEraser.position.x, y: cpuEraser.position.y };
        cpuDragCurrentPos = {
            x: cpuEraser.position.x - Math.cos(angle) * currentDragPixels,
            y: cpuEraser.position.y - Math.sin(angle) * currentDragPixels
        };
        cpuIsDragging = true;

        if (currentDragPixels >= maxDragPixels) {
            clearInterval(dragInterval);
            
            // Release shot
            setTimeout(() => {
                cpuIsDragging = false;
                
                const force = {
                    x: Math.cos(angle) * targetForceVal,
                    y: Math.sin(angle) * targetForceVal
                };
                
                playSound('flick');
                Body.applyForce(cpuEraser, cpuEraser.position, force);
                
                lastTurnOwner = 'cpu';
                currentTurn = 'sliding';
                setTimeout(checkTurnState, 800);
            }, 300);
        }
    }, 20);
}

// ----------------------------------------------------
// Turn State Management & Fall Detection
// ----------------------------------------------------
function checkTurnState() {
    if (gameState !== 'playing') return;

    // Check if bodies are still moving fast
    const bodies = Composite.allBodies(world);
    let stillMoving = false;
    
    bodies.forEach(body => {
        // Exclude stationary pins
        if (body.label === 'compass-pin') return;
        if (body.speed > 0.12) {
            stillMoving = true;
        }
    });

    if (stillMoving) {
        // Keep waiting
        setTimeout(checkTurnState, 150);
        return;
    }

    // Physics settled. Now decide turn or game over.
    if (winner !== null) return; // Wait for fall animation to trigger gameover
    
    // Switch turn
    if (currentTurn === 'sliding') {
        if (fallAnimationPlayer || fallAnimationCpu) {
            // Wait for fall animation to complete
            return;
        }
        
        // Swap turns
        if (playerEraser && cpuEraser) {
            if (lastTurnOwner === 'player') {
                currentTurn = 'cpu';
                executeCpuTurn();
            } else {
                currentTurn = 'player';
                document.getElementById('turn-text').textContent = 'あなた';
                document.getElementById('turn-text').className = 'value text-player';
            }
        }
    }
}

// Check if erasers have slipped off the wood desk
function checkDeskFalls() {
    if (gameState !== 'playing') return;

    // Boundary for falling off
    const leftLimit = DESK_MARGIN;
    const rightLimit = DESK_WIDTH - DESK_MARGIN;
    const topLimit = DESK_MARGIN;
    const bottomLimit = DESK_HEIGHT - DESK_MARGIN;

    // Player Fall Check
    if (!fallAnimationPlayer) {
        const pos = playerEraser.position;
        if (pos.x < leftLimit || pos.x > rightLimit || pos.y < topLimit || pos.y > bottomLimit) {
            fallAnimationPlayer = { body: playerEraser, scale: 1.0, yOffset: 0 };
            playSound('fall');
            // Disable collision so it doesn't bump objects while falling
            playerEraser.collisionFilter.mask = 0;
        }
    }

    // CPU Fall Check
    if (!fallAnimationCpu) {
        const pos = cpuEraser.position;
        if (pos.x < leftLimit || pos.x > rightLimit || pos.y < topLimit || pos.y > bottomLimit) {
            fallAnimationCpu = { body: cpuEraser, scale: 1.0, yOffset: 0 };
            playSound('fall');
            cpuEraser.collisionFilter.mask = 0;
        }
    }
}

function updateSuperGaugeUI() {
    const fill = document.getElementById('super-gauge');
    const text = document.getElementById('super-ready');
    fill.style.width = `${superGauge}%`;
    
    if (superGauge >= 100) {
        isSuperFlickReady = true;
        text.classList.remove('hidden');
    } else {
        isSuperFlickReady = false;
        text.classList.add('hidden');
    }
}

function endGame(gameWinner) {
    gameState = 'gameover';
    winner = gameWinner;
    
    document.getElementById('hud').classList.add('hidden');
    showScreen('game-over-screen');
    
    const title = document.getElementById('result-title');
    const desc = document.getElementById('result-desc');
    const stamp = document.getElementById('result-stamp');
    
    if (gameWinner === 'player') {
        playSound('win_chime');
        title.textContent = 'あなたの勝ち！';
        title.className = 'text-player';
        desc.textContent = '見事にCPUの消しゴムを机の外に落としました！たいへんよくできました！';
        stamp.textContent = 'たいへんよくできました';
        stamp.style.color = '#d93025';
        stamp.style.borderColor = '#d93025';
    } else {
        playSound('lose_chime');
        title.textContent = 'CPUの勝ち...';
        title.className = 'text-cpu';
        desc.textContent = '机から落とされてしまいました。もう一度挑戦してみましょう。';
        stamp.textContent = 'がんばりましょう';
        stamp.style.color = '#3b78e7';
        stamp.style.borderColor = '#3b78e7';
    }
}

// ----------------------------------------------------
// Main Loop (Physics & Custom Canvas Drawing)
// ----------------------------------------------------
function gameLoop() {
    updatePhysics();
    drawGame();
    requestAnimationFrame(gameLoop);
}

function updatePhysics() {
    if (gameState !== 'playing') return;

    // 1. Step Matter.js Physics Engine
    Engine.update(engine, (1000 / 60) * timeScale);

    // 2. Check Falls
    checkDeskFalls();

    // 3. Fall Animations (Shrinking)
    if (fallAnimationPlayer) {
        fallAnimationPlayer.scale -= 0.03;
        fallAnimationPlayer.yOffset += 4; // fall down screen
        if (fallAnimationPlayer.scale <= 0) {
            endGame('cpu');
            fallAnimationPlayer = null;
        }
    }
    if (fallAnimationCpu) {
        fallAnimationCpu.scale -= 0.03;
        fallAnimationCpu.yOffset += 4;
        if (fallAnimationCpu.scale <= 0) {
            endGame('player');
            fallAnimationCpu = null;
        }
    }

    // 4. Glue Puddle Slowdown & Friction Mechanics
    // Erasers linear damping in Glue Puddles
    [playerEraser, cpuEraser].forEach(eraser => {
        if (!eraser) return;
        let inGlue = false;
        
        deskHazards.forEach(hz => {
            if (hz.type === 'glue') {
                const dist = Math.hypot(eraser.position.x - hz.x, eraser.position.y - hz.y);
                if (dist < hz.radius) {
                    inGlue = true;
                }
            }
        });

        if (inGlue) {
            Body.setAngularVelocity(eraser, eraser.angularVelocity * 0.7);
            Body.setVelocity(eraser, { x: eraser.velocity.x * 0.75, y: eraser.velocity.y * 0.75 });
        }
    });

    // 5. Eraser Dust Friction Slowdown
    [playerEraser, cpuEraser].forEach(eraser => {
        if (!eraser || eraser.speed < 0.1) return;
        
        let dustDampingCount = 0;
        eraserDust.forEach(dust => {
            if (dust.isSpark) return; // Sparks don't slow down
            const dist = Math.hypot(eraser.position.x - dust.x, eraser.position.y - dust.y);
            if (dist < 28) {
                dustDampingCount++;
                // Blow dust away slightly
                const dx = dust.x - eraser.position.x;
                const dy = dust.y - eraser.position.y;
                const d = Math.hypot(dx, dy) || 1;
                dust.vx += (dx / d) * eraser.speed * 0.15;
                dust.vy += (dy / d) * eraser.speed * 0.15;
            }
        });

        if (dustDampingCount > 0) {
            // Apply air-like friction for moving through dust pile
            const dampingFactor = Math.max(0.98 - (dustDampingCount * 0.012), 0.75);
            Body.setVelocity(eraser, {
                x: eraser.velocity.x * dampingFactor,
                y: eraser.velocity.y * dampingFactor
            });
        }
    });

    // 6. Sliding Trails & Eraser Dust Spawning & Doodle Erasing
    [playerEraser, cpuEraser].forEach(eraser => {
        if (!eraser || eraser.speed < 0.8) return;
        
        // Spawn standard eraser dust particles at eraser tail
        if (Math.random() < 0.35) {
            const offsetDist = 20;
            const angle = eraser.angle + Math.PI; // behind
            const rx = eraser.position.x + Math.cos(angle) * offsetDist + (Math.random() - 0.5) * 15;
            const ry = eraser.position.y + Math.sin(angle) * offsetDist + (Math.random() - 0.5) * 15;
            
            eraserDust.push({
                x: rx,
                y: ry,
                vx: -eraser.velocity.x * 0.05 + (Math.random() - 0.5) * 0.2,
                vy: -eraser.velocity.y * 0.05 + (Math.random() - 0.5) * 0.2,
                radius: Math.random() * 3.5 + 2.0,
                alpha: 0.9,
                decay: 0.001, // decays very slowly, remains on desk
                isSpark: false
            });
        }

        // Check if sliding over doodles to erase them
        doodles.forEach(pt => {
            if (!pt.erased) {
                const dist = Math.hypot(eraser.position.x - pt.x, eraser.position.y - pt.y);
                if (dist < 28) {
                    pt.erased = true;
                    playSound('erase');

                    // If player, charge super gauge
                    if (eraser.label === 'player') {
                        superGauge = Math.min(superGauge + 3, 100);
                        updateSuperGaugeUI();
                    }

                    // Spawn small erasing particles
                    for (let k = 0; k < 3; k++) {
                        eraserDust.push({
                            x: pt.x,
                            y: pt.y,
                            vx: (Math.random() - 0.5) * 1.5,
                            vy: (Math.random() - 0.5) * 1.5,
                            radius: Math.random() * 2 + 1,
                            alpha: 1.0,
                            decay: 0.02,
                            isSpark: false
                        });
                    }
                }
            }
        });
    });

    // 7. Update Eraser Dust Particles
    eraserDust.forEach((dust, idx) => {
        dust.x += dust.vx;
        dust.y += dust.vy;
        // Friction with table
        dust.vx *= 0.92;
        dust.vy *= 0.92;
        // Decay opacity
        dust.alpha -= dust.decay;
        
        // Remove dead particles
        if (dust.alpha <= 0 || dust.x < 0 || dust.x > DESK_WIDTH || dust.y < 0 || dust.y > DESK_HEIGHT) {
            eraserDust.splice(idx, 1);
        }
    });

    // Decay screen shake
    if (screenShakeIntensity > 0) {
        screenShakeIntensity *= 0.9;
    }
}

// ----------------------------------------------------
// Custom Graphics Rendering Loop (Canvas 2D)
// ----------------------------------------------------
function drawGame() {
    ctx.save();

    // Screen shake implementation
    if (screenShakeIntensity > 0.1) {
        const shakeX = (Math.random() - 0.5) * screenShakeIntensity;
        const shakeY = (Math.random() - 0.5) * screenShakeIntensity;
        ctx.translate(shakeX, shakeY);
    }

    // 1. Draw Wooden Desk Texture
    drawWoodDeskBackground();

    // 2. Draw Glue Puddles (below shadows)
    deskHazards.forEach(hz => {
        if (hz.type === 'glue') {
            drawGluePuddle(hz.x, hz.y, hz.radius);
        }
    });

    // 3. Draw Doodle Scribbles (below erasers)
    drawScribbles();

    // 4. Draw Eraser Dust Particles (below erasers)
    drawDustParticles();

    // 5. Draw 2.5D Shadows of all active bodies
    if (gameState === 'playing' || gameState === 'gameover') {
        ctx.save();
        // Shift shadow offset downwards/rightwards to simulate light source from top-left
        ctx.translate(8, 12);
        
        // Draw Player Shadow
        if (playerEraser && !fallAnimationPlayer) {
            drawBodyShadow(playerEraser, 60, 35, false);
        } else if (fallAnimationPlayer) {
            // Shadow separates and fades out
            ctx.save();
            ctx.translate(12 * (1 - fallAnimationPlayer.scale), 20 * (1 - fallAnimationPlayer.scale));
            drawBodyShadow(playerEraser, 60, 35, false, fallAnimationPlayer.scale * 0.15);
            ctx.restore();
        }

        // Draw CPU Shadow
        if (cpuEraser && !fallAnimationCpu) {
            drawBodyShadow(cpuEraser, 60, 35, false);
        } else if (fallAnimationCpu) {
            ctx.save();
            ctx.translate(12 * (1 - fallAnimationCpu.scale), 20 * (1 - fallAnimationCpu.scale));
            drawBodyShadow(cpuEraser, 60, 35, false, fallAnimationCpu.scale * 0.15);
            ctx.restore();
        }

        // Draw Pencils Shadow
        pencils.forEach(pencil => {
            drawBodyShadow(pencil, 110, 10, false);
        });

        // Draw Compass Arm Shadow
        if (compassSpinner) {
            drawBodyShadow(compassSpinner.arm, 140, 10, false);
        }
        ctx.restore();
    }

    // 6. Draw Bodies
    if (gameState === 'playing' || gameState === 'gameover') {
        // Draw Pencils
        pencils.forEach(pencil => {
            drawPencil(pencil);
        });

        // Draw Compass Spinner
        if (compassSpinner) {
            drawCompass(compassSpinner);
        }

        // Draw Player Eraser
        if (playerEraser) {
            ctx.save();
            ctx.translate(playerEraser.position.x, playerEraser.position.y);
            ctx.rotate(playerEraser.angle);
            if (fallAnimationPlayer) {
                ctx.scale(fallAnimationPlayer.scale, fallAnimationPlayer.scale);
            }
            drawEraserBody('player');
            ctx.restore();
        }

        // Draw CPU Eraser
        if (cpuEraser) {
            ctx.save();
            ctx.translate(cpuEraser.position.x, cpuEraser.position.y);
            ctx.rotate(cpuEraser.angle);
            if (fallAnimationCpu) {
                ctx.scale(fallAnimationCpu.scale, fallAnimationCpu.scale);
            }
            drawEraserBody('cpu');
            ctx.restore();
        }
    }

    // 7. Draw Drag slingshot arrow UI
    if (isDragging && currentTurn === 'player') {
        drawSlingshotUI('player');
    } else if (cpuIsDragging && currentTurn === 'cpu') {
        drawSlingshotUI('cpu');
    }

    ctx.restore();
}

// Draw Wooden Grain background programmatically
function drawWoodDeskBackground() {
    // Desk surface base wood gradient
    const grad = ctx.createLinearGradient(0, 0, DESK_WIDTH, DESK_HEIGHT);
    grad.addColorStop(0, '#e8af6d');
    grad.addColorStop(0.5, '#d39856');
    grad.addColorStop(1, '#be8241');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, DESK_WIDTH, DESK_HEIGHT);

    // Draw realistic wooden plank lines
    ctx.strokeStyle = 'rgba(92, 59, 29, 0.12)';
    ctx.lineWidth = 2;
    for (let y = 100; y < DESK_HEIGHT; y += 120) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(DESK_WIDTH, y);
        ctx.stroke();
    }

    // Fine wood grain texture curves
    ctx.strokeStyle = 'rgba(92, 59, 29, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 50 + i * 130);
        ctx.bezierCurveTo(DESK_WIDTH * 0.3, 80 + i * 130, DESK_WIDTH * 0.6, 20 + i * 130, DESK_WIDTH, 60 + i * 130);
        ctx.stroke();
    }

    // Pen/Pencil Groove (fudebako style) at the top
    ctx.fillStyle = 'rgba(75, 47, 23, 0.45)'; // dark indented shadow
    ctx.beginPath();
    ctx.roundRect(50, 10, DESK_WIDTH - 100, 16, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();

    // Wood bevel edge representing desk border
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 5;
    ctx.strokeRect(DESK_MARGIN, DESK_MARGIN, DESK_PLAYABLE_WIDTH, DESK_PLAYABLE_HEIGHT);

    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 2;
    ctx.strokeRect(DESK_MARGIN - 4, DESK_MARGIN - 4, DESK_PLAYABLE_WIDTH + 8, DESK_PLAYABLE_HEIGHT + 8);
}

// Draw a sticky translucent yellow glue puddle
function drawGluePuddle(cx, cy, r) {
    ctx.save();
    ctx.fillStyle = 'rgba(252, 235, 172, 0.45)'; // sticky yellow liquid
    ctx.strokeStyle = 'rgba(250, 222, 115, 0.6)';
    ctx.lineWidth = 3;
    
    // Draw an irregular fluid bubble shape
    ctx.beginPath();
    const steps = 12;
    for (let i = 0; i < steps; i++) {
        const angle = (Math.PI * 2 / steps) * i;
        const wave = 4 * Math.sin(angle * 3);
        const rad = r + wave;
        const x = cx + Math.cos(angle) * rad;
        const y = cy + Math.sin(angle) * rad;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Inner shiny glaze highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath();
    ctx.ellipse(cx - r/3, cy - r/3, r/2, r/3, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// Draw Pencil Scribbles
function drawScribbles() {
    ctx.save();
    ctx.strokeStyle = 'rgba(40, 40, 42, 0.65)'; // graphite gray pencil
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // To prevent giant draw calls, we group lines and break on erased segments
    let isDrawingLine = false;
    for (let i = 0; i < doodles.length; i++) {
        const pt = doodles[i];
        if (pt.erased) {
            isDrawingLine = false;
            continue;
        }
        
        // Simple heuristic: if distance to previous is small, connect. Else start fresh.
        if (i > 0 && !doodles[i-1].erased && Math.hypot(pt.x - doodles[i-1].x, pt.y - doodles[i-1].y) < 22) {
            if (!isDrawingLine) {
                ctx.beginPath();
                ctx.moveTo(doodles[i-1].x, doodles[i-1].y);
                isDrawingLine = true;
            }
            ctx.lineTo(pt.x, pt.y);
            // Stroke right away to support custom path chunks
            ctx.stroke();
        } else {
            isDrawingLine = false;
        }
    }
    ctx.restore();
}

// Draw Eraser Dust Particles
function drawDustParticles() {
    ctx.save();
    eraserDust.forEach(dust => {
        if (dust.isSpark) {
            // Spark styling (yellow-white friction flashes)
            ctx.fillStyle = `rgba(255, 200, 100, ${dust.alpha})`;
            ctx.beginPath();
            ctx.arc(dust.x, dust.y, dust.radius, 0, Math.PI*2);
            ctx.fill();
        } else {
            // Eraser dust clump styling (greyish white)
            ctx.fillStyle = `rgba(240, 240, 243, ${dust.alpha * 0.95})`;
            ctx.beginPath();
            ctx.arc(dust.x, dust.y, dust.radius, 0, Math.PI*2);
            ctx.fill();
            
            // Subtle dust shadow
            ctx.strokeStyle = `rgba(0, 0, 0, ${dust.alpha * 0.1})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
    });
    ctx.restore();
}

// Draw generic shadow offset from body geometry
function drawBodyShadow(body, w, h, isCircle, scaleOverride = 0.25) {
    ctx.save();
    ctx.translate(body.position.x, body.position.y);
    ctx.rotate(body.angle);
    ctx.fillStyle = `rgba(0, 0, 0, ${scaleOverride})`;
    
    ctx.beginPath();
    if (isCircle) {
        ctx.arc(0, 0, w, 0, Math.PI*2);
    } else {
        ctx.roundRect(-w/2, -h/2, w, h, 3);
    }
    ctx.fill();
    ctx.restore();
}

// Draw classic styled eraser body
function drawEraserBody(team) {
    const w = 60;
    const h = 35;

    // A. Clean White Eraser rubber core
    ctx.fillStyle = '#f6f6f8';
    ctx.beginPath();
    ctx.roundRect(-w/2, -h/2, w, h, 3);
    ctx.fill();

    // B. Cardboard Sleeve (covers 70% of eraser body, offset to left)
    const sleeveW = 44;
    const sleeveX = -w/2 + 2; // leaves 14px of rubber exposed on right
    
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(sleeveX, -h/2 - 0.5, sleeveW, h + 1, 2);
    ctx.clip(); // clip pattern to sleeve shape

    if (team === 'player') {
        // Player: Classic blue/white/black Mono Sleeve
        ctx.fillStyle = '#0154a4'; // Blue top band
        ctx.fillRect(sleeveX, -h/2, sleeveW, h * 0.33);

        ctx.fillStyle = '#ffffff'; // White middle band
        ctx.fillRect(sleeveX, -h/2 + h * 0.33, sleeveW, h * 0.34);

        ctx.fillStyle = '#1e1d22'; // Black bottom band
        ctx.fillRect(sleeveX, -h/2 + h * 0.67, sleeveW, h * 0.33);

        // Sleeve details (Brand line and label)
        ctx.fillStyle = '#0154a4';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('MONO', sleeveX + sleeveW/2, 0);
    } else {
        // CPU: Sleek red/white/black Sleeve
        ctx.fillStyle = '#d93025'; // Red top
        ctx.fillRect(sleeveX, -h/2, sleeveW, h * 0.33);

        ctx.fillStyle = '#ffffff'; // White middle
        ctx.fillRect(sleeveX, -h/2 + h * 0.33, sleeveW, h * 0.34);

        ctx.fillStyle = '#1e1d22'; // Black bottom
        ctx.fillRect(sleeveX, -h/2 + h * 0.67, sleeveW, h * 0.33);

        ctx.fillStyle = '#d93025';
        ctx.font = 'bold 8px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('BOSS', sleeveX + sleeveW/2, 0);
    }
    ctx.restore();

    // C. Expose rubber dirt / texture lines on the right side
    ctx.strokeStyle = '#dfdfe3';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w/2 - 6, -h/2 + 4);
    ctx.lineTo(w/2 - 6, h/2 - 4);
    ctx.stroke();
}

// Draw a hexagon green/red school pencil
function drawPencil(pencil) {
    ctx.save();
    ctx.translate(pencil.position.x, pencil.position.y);
    ctx.rotate(pencil.angle);

    const w = 110;
    const h = 10;

    // Wooden pencil shaft
    ctx.fillStyle = '#4c9f70'; // Green hexagonal body
    ctx.fillRect(-w/2 + 10, -h/2, w - 22, h);

    // Fine lines on pencil body
    ctx.strokeStyle = '#32704c';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-w/2 + 10, -h/6);
    ctx.lineTo(w/2 - 12, -h/6);
    ctx.moveTo(-w/2 + 10, h/6);
    ctx.lineTo(w/2 - 12, h/6);
    ctx.stroke();

    // Sharpened Wooden Tip (triangle)
    ctx.fillStyle = '#e5c093'; // wood color
    ctx.beginPath();
    ctx.moveTo(w/2 - 12, -h/2);
    ctx.lineTo(w/2, 0);
    ctx.lineTo(w/2 - 12, h/2);
    ctx.closePath();
    ctx.fill();

    // Graphite pencil lead tip
    ctx.fillStyle = '#3a3a3d';
    ctx.beginPath();
    ctx.moveTo(w/2 - 4, -h/6);
    ctx.lineTo(w/2, 0);
    ctx.lineTo(w/2 - 4, h/6);
    ctx.closePath();
    ctx.fill();

    // Metal ferrule (silver band)
    ctx.fillStyle = '#bfbfbf';
    ctx.fillRect(-w/2 + 6, -h/2, 4, h);

    // Pink eraser tip
    ctx.fillStyle = '#ff9ca5';
    ctx.beginPath();
    ctx.roundRect(-w/2, -h/2, 6, h, [2, 0, 0, 2]);
    ctx.fill();

    ctx.restore();
}

// Draw dynamic classroom compass spinner
function drawCompass(compass) {
    // 1. Draw static center pin
    ctx.save();
    ctx.translate(compass.pin.position.x, compass.pin.position.y);
    ctx.fillStyle = '#e85c00'; // shiny copper/orange head pin
    ctx.strokeStyle = '#5c1000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
    
    // Pin shiny dot
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.arc(-3, -3, 3, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    // 2. Draw rotating compass arm
    ctx.save();
    ctx.translate(compass.arm.position.x, compass.arm.position.y);
    ctx.rotate(compass.arm.angle);

    const w = 140;
    const h = 10;

    // Metallic silver arm
    ctx.fillStyle = '#cccccc';
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(-w/2, -h/2, w, h, 2);
    ctx.fill();
    ctx.stroke();

    // Blue/Red central plastic joints
    ctx.fillStyle = '#1e73e8';
    ctx.fillRect(-15, -h/2 - 1, 30, h + 2);

    // Needle pointer (Left side)
    ctx.fillStyle = '#3a3a3d'; // sharp metal tip
    ctx.beginPath();
    ctx.moveTo(-w/2, -3);
    ctx.lineTo(-w/2 - 15, 0);
    ctx.lineTo(-w/2, 3);
    ctx.closePath();
    ctx.fill();

    // Pencil holder and pencil stub (Right side)
    ctx.fillStyle = '#f4b400'; // short yellow pencil attached
    ctx.fillRect(w/2, -h/2 - 4, 15, 8);
    // Wood tip
    ctx.fillStyle = '#e5c093';
    ctx.beginPath();
    ctx.moveTo(w/2 + 15, -h/2 - 4);
    ctx.lineTo(w/2 + 23, -h/2);
    ctx.lineTo(w/2 + 15, -h/2 + 4);
    ctx.closePath();
    ctx.fill();
    // Pencil lead
    ctx.fillStyle = '#3a3a3d';
    ctx.beginPath();
    ctx.moveTo(w/2 + 20, -h/2 - 2);
    ctx.lineTo(w/2 + 23, -h/2);
    ctx.lineTo(w/2 + 20, -h/2 + 2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

// Draw slingshot pulling arrow and projected trajectory
function drawSlingshotUI(team) {
    ctx.save();
    
    const activeBody = (team === 'player') ? playerEraser : cpuEraser;
    if (!activeBody) {
        ctx.restore();
        return;
    }

    const startX = (team === 'player') ? dragStartPos.x : cpuDragStartPos.x;
    const startY = (team === 'player') ? dragStartPos.y : cpuDragStartPos.y;
    const currX = (team === 'player') ? dragCurrentPos.x : cpuDragCurrentPos.x;
    const currY = (team === 'player') ? dragCurrentPos.y : cpuDragCurrentPos.y;

    // Calculate pull direction and strength
    const dx = startX - currX;
    const dy = startY - currY;
    const dist = Math.hypot(dx, dy);

    if (dist < 10) {
        ctx.restore();
        return;
    }

    const maxDragVal = Math.min(dist, MAX_DRAG_DIST);
    const angle = Math.atan2(dy, dx);

    // 1. Draw elastic pull line (pulling back like a rubber band)
    ctx.strokeStyle = (team === 'player') ? 'rgba(26, 115, 232, 0.45)' : 'rgba(217, 48, 37, 0.45)';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(activeBody.position.x, activeBody.position.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    // 2. Draw target dotted trajectory line (in launch direction)
    const launchDist = maxDragVal * 2.5; // Visual representation of force
    const launchX = activeBody.position.x + Math.cos(angle) * launchDist;
    const launchY = activeBody.position.y + Math.sin(angle) * launchDist;

    ctx.strokeStyle = (team === 'player' && isSuperFlickReady) ? 'rgba(234, 67, 53, 0.75)' : 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(activeBody.position.x, activeBody.position.y);
    ctx.lineTo(launchX, launchY);
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // 3. Draw launching arrow head
    ctx.save();
    ctx.translate(launchX, launchY);
    ctx.rotate(angle);

    ctx.fillStyle = (team === 'player' && isSuperFlickReady) ? '#ea4335' : '#333';
    
    // Super flick glowing pulse
    if (team === 'player' && isSuperFlickReady) {
        ctx.shadowColor = '#ea4335';
        ctx.shadowBlur = 10;
    }
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-15, -8);
    ctx.lineTo(-10, 0);
    ctx.lineTo(-15, 8);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.restore();
}
