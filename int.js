/* ==========================================================================
   CONFIGURACIÓN PERSONALIZABLE (Puedes editar el nombre, carta o regalo aquí)
   ========================================================================== */
const CONFIG = {
    nombrePorDefecto: "JUAN",
    mensajeHermano: (nombre) => 
`¡Feliz cumpleaños #14, ${nombre}! ⚽🎮🎉

Hoy desbloqueas oficialmente el NIVEL 14 de tu vida y tu carta sube a 99 de media global. Quería hacerte algo diferente y único para que vieras lo mucho que valoro ser tu hermano mayor.

Tanto jugando al fútbol en la cancha como rompiéndola en los videojuegos y en el día a día, siempre demuestras que tienes talento y mentalidad de campeón. Verte crecer y convertirte en un crack es un orgullo enorme.

A los 14 años empieza una temporada épica: sigue metiendo golazos en todas tus metas, diviértete al máximo y recuerda siempre que aquí tienes a tu hermano mayor en tu equipo para apoyarte en cada partido y en cada misión.

¡Felices 14 años, crack!
— Tu Hermano Mayor 🤜🤛⚽`,
    recompensaCofre: "⚽🎮 ¡VALE OFICIAL POR: Tu regalo especial de 14 años + Partidazo / Tarde Gamer épica de hermanos con tu comida favorita invitada por tu hermano mayor! 🏆🍕"
};

/* ==========================================================================
   MOTOR DE AUDIO SINTETIZADO (Web Audio API - Sin archivos externos)
   ========================================================================== */
class CyberAudio {
    constructor() {
        this.ctx = null;
        this.sfxEnabled = true;
        this.musicPlaying = false;
        this.musicTimer = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    }

    playTone(freq, type = "sine", duration = 0.12, vol = 0.12, slideTo = null) {
        if (!this.sfxEnabled) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        if (slideTo) {
            osc.frequency.exponentialRampToValueAtTime(slideTo, this.ctx.currentTime + duration);
        }

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    hover() {
        this.playTone(520, "sine", 0.05, 0.04, 680);
    }

    click() {
        this.playTone(740, "triangle", 0.09, 0.1, 1100);
    }

    hit(step = 1) {
        const base = 220 + step * 35;
        this.playTone(base, "sawtooth", 0.11, 0.12, base * 1.4);
    }

    blowCandle() {
        this.playTone(300, "sine", 0.18, 0.1, 110);
    }

    explosion() {
        this.playTone(180, "sawtooth", 0.35, 0.15, 45);
    }

    achievement() {
        if (!this.sfxEnabled) return;
        this.init();
        if (!this.ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((n, i) => {
            setTimeout(() => this.playTone(n, "triangle", 0.22, 0.14), i * 90);
        });
    }

    toggleMusic() {
        this.init();
        if (this.musicPlaying) {
            this.musicPlaying = false;
            if (this.musicTimer) clearTimeout(this.musicTimer);
            return false;
        } else {
            this.musicPlaying = true;
            this.playBirthdayLoop();
            return true;
        }
    }

    playBirthdayLoop() {
        if (!this.musicPlaying || !this.ctx) return;
        // Melodía Synth de Feliz Cumpleaños (frecuencias en Hz y duración en ms)
        const melody = [
            [261.6, 280], [261.6, 200], [293.7, 450], [261.6, 450], [349.2, 450], [329.6, 800],
            [261.6, 280], [261.6, 200], [293.7, 450], [261.6, 450], [392.0, 450], [349.2, 800],
            [261.6, 280], [261.6, 200], [523.3, 450], [440.0, 450], [349.2, 450], [329.6, 450], [293.7, 700],
            [466.2, 280], [466.2, 200], [440.0, 450], [349.2, 450], [392.0, 450], [349.2, 900]
        ];

        let delay = 0;
        melody.forEach(([freq, dur]) => {
            const t = setTimeout(() => {
                if (!this.musicPlaying) return;
                this.playTone(freq, "triangle", dur / 1000, 0.08);
            }, delay);
            this.musicTimer = t;
            delay += dur + 50;
        });

        this.musicTimer = setTimeout(() => {
            if (this.musicPlaying) this.playBirthdayLoop();
        }, delay + 400);
    }
}

const sound = new CyberAudio();

/* ==========================================================================
   FONDO DE PARTÍCULAS Y FUEGOS ARTIFICIALES (#bg-canvas)
   ========================================================================== */
const bgCanvas = document.getElementById("bg-canvas");
const bgCtx = bgCanvas.getContext("2d");
let stars = [];
let fireworks = [];

function resizeBgCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeBgCanvas);
resizeBgCanvas();

for (let i = 0; i < 85; i++) {
    stars.push({
        x: Math.random() * bgCanvas.width,
        y: Math.random() * bgCanvas.height,
        r: Math.random() * 1.8 + 0.5,
        vy: Math.random() * 0.4 + 0.1,
        alpha: Math.random() * 0.8 + 0.2
    });
}

function launchFireworkBurst(x, y, count = 48) {
    const colors = ["#00f2fe", "#ffd700", "#ff0844", "#00ff88", "#b721ff", "#ffffff"];
    for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.2;
        const speed = Math.random() * 5.5 + 1.8;
        fireworks.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 1,
            size: Math.random() * 3 + 1.5,
            decay: Math.random() * 0.016 + 0.012
        });
    }
    sound.explosion();
}

function celebrateFireworks(bursts = 5) {
    for (let i = 0; i < bursts; i++) {
        setTimeout(() => {
            const rx = Math.random() * (bgCanvas.width * 0.7) + bgCanvas.width * 0.15;
            const ry = Math.random() * (bgCanvas.height * 0.5) + bgCanvas.height * 0.1;
            launchFireworkBurst(rx, ry, 52);
        }, i * 260);
    }
}

function animateBg() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    // Estrellas cyber
    stars.forEach((s) => {
        s.y -= s.vy;
        if (s.y < 0) {
            s.y = bgCanvas.height;
            s.x = Math.random() * bgCanvas.width;
        }
        bgCtx.beginPath();
        bgCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        bgCtx.fillStyle = `rgba(0, 242, 254, ${s.alpha})`;
        bgCtx.fill();
    });

    // Partículas de fuegos artificiales
    for (let i = fireworks.length - 1; i >= 0; i--) {
        const p = fireworks[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // gravedad ligera
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
            fireworks.splice(i, 1);
            continue;
        }

        bgCtx.save();
        bgCtx.globalAlpha = p.alpha;
        bgCtx.fillStyle = p.color;
        bgCtx.shadowBlur = 10;
        bgCtx.shadowColor = p.color;
        bgCtx.beginPath();
        bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        bgCtx.fill();
        bgCtx.restore();
    }

    requestAnimationFrame(animateBg);
}
animateBg();

/* ==========================================================================
   SISTEMA DE LOGROS DESBLOQUEADOS (TOAST)
   ========================================================================== */
const unlockedAchievements = new Set();
let toastTimeout = null;

function unlockAchievement(id, title) {
    if (unlockedAchievements.has(id)) return;
    unlockedAchievements.add(id);

    const toast = document.getElementById("achievement-toast");
    const titleEl = document.getElementById("achievement-title");
    titleEl.textContent = title;
    toast.classList.remove("hidden");
    sound.achievement();

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.add("hidden");
    }, 4200);
}

/* ==========================================================================
   ARRANQUE DE LA EXPERIENCIA & PERSONALIZACIÓN DEL NOMBRE
   ========================================================================== */
let brotherName = CONFIG.nombrePorDefecto;
let currentXP = 14000;

const bootScreen = document.getElementById("boot-screen");
const mainHub = document.getElementById("main-hub");
const nameInput = document.getElementById("brother-name-input");
const startBtn = document.getElementById("start-btn");

function updateBrotherNameInDOM(name) {
    brotherName = (name || CONFIG.nombrePorDefecto).trim().toUpperCase();
    document.getElementById("display-name").textContent = brotherName;
    document.querySelectorAll(".brother-name-span").forEach((el) => {
        el.textContent = brotherName;
    });
    document.getElementById("reward-custom-text").textContent = CONFIG.recompensaCofre;
}

startBtn.addEventListener("click", () => {
    sound.init();
    sound.click();
    updateBrotherNameInDOM(nameInput.value || CONFIG.nombrePorDefecto);

    bootScreen.classList.add("hidden");
    mainHub.classList.remove("hidden");

    celebrateFireworks(6);
    unlockAchievement("start_14", `¡Nivel 14 Desbloqueado, ${brotherName}!`);
});

/* ==========================================================================
   CONTROLES DEL HUD (MÚSICA, SFX, FUEGOS ARTIFICIALES)
   ========================================================================== */
const musicBtn = document.getElementById("music-btn");
const sfxBtn = document.getElementById("sfx-btn");
const fireworksBtn = document.getElementById("fireworks-btn");

musicBtn.addEventListener("click", () => {
    const active = sound.toggleMusic();
    musicBtn.textContent = active ? "🎵 Música: ON" : "🎵 Música: OFF";
    musicBtn.classList.toggle("active", active);
});

sfxBtn.addEventListener("click", () => {
    sound.sfxEnabled = !sound.sfxEnabled;
    sfxBtn.textContent = sound.sfxEnabled ? "🔊 SFX: ON" : "🔇 SFX: OFF";
    sfxBtn.classList.toggle("active", sound.sfxEnabled);
    if (sound.sfxEnabled) sound.click();
});

fireworksBtn.addEventListener("click", () => {
    sound.click();
    celebrateFireworks(5);
});

/* ==========================================================================
   NAVEGACIÓN DE PESTAÑAS DEL MENÚ INTERACTIVO
   ========================================================================== */
const navCards = document.querySelectorAll(".nav-card");
const tabPanels = document.querySelectorAll(".tab-panel");

function switchTab(targetId) {
    sound.click();
    navCards.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.target === targetId);
    });
    tabPanels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === targetId);
    });

    if (targetId === "tab-letter") {
        startTypewriter();
        unlockAchievement("read_letter", "Mensaje del Hermano Mayor");
    } else if (targetId === "tab-stats") {
        animateStatsBars();
    }
}

navCards.forEach((btn) => {
    btn.addEventListener("mouseenter", () => sound.hover());
    btn.addEventListener("click", () => switchTab(btn.dataset.target));
});

document.querySelectorAll(".interactive-tile").forEach((tile) => {
    tile.addEventListener("mouseenter", () => sound.hover());
    tile.addEventListener("click", () => switchTab(tile.dataset.goto));
});

/* Contador en vivo de segundos (14 años) */
let baseSeconds = 14 * 365.25 * 24 * 3600;
setInterval(() => {
    baseSeconds += 1;
    const el = document.getElementById("live-seconds");
    if (el) el.textContent = Math.floor(baseSeconds).toLocaleString("es-ES");
}, 1000);

/* ==========================================================================
   SECCIÓN 2: CARTA CON EFECTO MÁQUINA DE ESCRIBIR
   ========================================================================== */
let typewriterTimer = null;
const typewriterEl = document.getElementById("typewriter-text");

function startTypewriter() {
    if (typewriterTimer) clearInterval(typewriterTimer);
    const fullText = CONFIG.mensajeHermano(brotherName);
    typewriterEl.textContent = "";
    let idx = 0;

    typewriterTimer = setInterval(() => {
        if (idx < fullText.length) {
            typewriterEl.textContent += fullText.charAt(idx);
            if (idx % 4 === 0) sound.playTone(620, "sine", 0.015, 0.018);
            idx++;
        } else {
            clearInterval(typewriterTimer);
        }
    }, 22);
}

document.getElementById("replay-letter-btn").addEventListener("click", () => {
    sound.click();
    startTypewriter();
});

let fistBumps = 0;
document.getElementById("respect-btn").addEventListener("click", (e) => {
    fistBumps++;
    currentXP += 500;
    document.getElementById("xp-text").textContent = `XP: ${currentXP.toLocaleString("es-ES")} / 14,000 (NIVEL 14+)`;
    document.getElementById("fistbump-count").textContent = `🤜🤛 ¡${fistBumps} choque(s) de puños! (+${fistBumps * 500} XP)`;
    const rect = e.target.getBoundingClientRect();
    launchFireworkBurst(rect.left + rect.width / 2, rect.top, 28);
    unlockAchievement("fistbump", "Hermandad Indestructible");
});

/* ==========================================================================
   SECCIÓN 3: BARRAS DE ESTADÍSTICAS Y MODO OVERCLOCK
   ========================================================================== */
function animateStatsBars() {
    document.querySelectorAll(".stat-fill").forEach((bar) => {
        bar.style.width = "0%";
        setTimeout(() => {
            bar.style.width = bar.dataset.width;
        }, 120);
    });
}

const overclockBtn = document.getElementById("overclock-btn");
let isOverclocked = false;

overclockBtn.addEventListener("click", () => {
    isOverclocked = !isOverclocked;
    sound.achievement();
    celebrateFireworks(3);

    document.querySelectorAll(".stat-fill").forEach((bar) => {
        bar.classList.toggle("overclocked", isOverclocked);
        bar.style.width = "100%";
    });

    document.querySelectorAll(".stat-percent").forEach((lbl) => {
        lbl.textContent = isOverclocked ? "⚡ 999% SUPREMO" : lbl.dataset.base;
    });

    overclockBtn.textContent = isOverclocked
        ? "✅ MODO DIOS ACTIVADO (1000%)"
        : "🔥 ACTIVAR MODO DIOS (OVERCLOCK)";

    unlockAchievement("overclock_14", "Modo Dios Nivel 14 Activado");
});

/* ==========================================================================
   SECCIÓN 4: PASTEL INTERACTIVO DE 14 VELAS (CLIC + MICRÓFONO REAL)
   ========================================================================== */
const candlesRow = document.getElementById("candles-row");
const candlesCounter = document.getElementById("candles-counter");
const wishBanner = document.getElementById("wish-banner");
const TOTAL_CANDLES = 14;
let candlesLit = TOTAL_CANDLES;

function buildCandles() {
    candlesRow.innerHTML = "";
    candlesLit = TOTAL_CANDLES;
    wishBanner.classList.add("hidden");
    updateCandlesStatus();

    for (let i = 1; i <= TOTAL_CANDLES; i++) {
        const candle = document.createElement("div");
        candle.className = "candle";
        candle.title = `Vela #${i} - Haz clic para soplar`;

        const wick = document.createElement("div");
        wick.className = "candle-wick";

        const flame = document.createElement("div");
        flame.className = "candle-flame";

        candle.appendChild(wick);
        candle.appendChild(flame);

        candle.addEventListener("click", () => extinguishCandle(candle));
        candlesRow.appendChild(candle);
    }
}

function extinguishCandle(candleEl) {
    if (candleEl.classList.contains("out")) return;
    candleEl.classList.add("out");
    candlesLit--;
    sound.blowCandle();
    updateCandlesStatus();

    const rect = candleEl.getBoundingClientRect();
    launchFireworkBurst(rect.left + rect.width / 2, rect.top, 14);

    if (candlesLit === 0) {
        wishBanner.classList.remove("hidden");
        celebrateFireworks(7);
        unlockAchievement("wish_14", "¡Deseo de los 14 Años Cumplido!");
    }
}

function updateCandlesStatus() {
    candlesCounter.textContent = `Velas encendidas: ${candlesLit} / ${TOTAL_CANDLES}`;
}

document.getElementById("relight-btn").addEventListener("click", () => {
    sound.click();
    buildCandles();
});

// Soplar por micrófono
let micStream = null;
let micActive = false;
const micBtn = document.getElementById("mic-blow-btn");

micBtn.addEventListener("click", async () => {
    if (micActive) {
        stopMic();
        return;
    }
    try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micActive = true;
        micBtn.textContent = "🎙️ ¡Sopla fuerte ahora! (Click para parar)";
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaStreamSource(micStream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);

        function detectBlow() {
            if (!micActive) return;
            analyser.getByteFrequencyData(data);
            const avg = data.reduce((a, b) => a + b, 0) / data.length;
            if (avg > 48) {
                const activeCandles = document.querySelectorAll(".candle:not(.out)");
                if (activeCandles.length > 0) {
                    const randomCandle = activeCandles[Math.floor(Math.random() * activeCandles.length)];
                    extinguishCandle(randomCandle);
                }
            }
            requestAnimationFrame(detectBlow);
        }
        detectBlow();
    } catch (err) {
        micBtn.textContent = "⚠️ Micrófono no disponible (Usa clic en las velas)";
    }
});

function stopMic() {
    micActive = false;
    if (micStream) {
        micStream.getTracks().forEach((t) => t.stop());
    }
    micBtn.textContent = "🎤 Activar Micrófono para Soplar";
}

buildCandles();

/* ==========================================================================
   SECCIÓN 5: MINI-JUEGO ARCADE (CAZA-REGALOS CYBER 14)
   ========================================================================== */
const arcadeCanvas = document.getElementById("arcade-canvas");
const ctx = arcadeCanvas.getContext("2d");
const arcadeOverlay = document.getElementById("arcade-overlay");
const startGameBtn = document.getElementById("start-game-btn");
const scoreEl = document.getElementById("game-score");
const highScoreEl = document.getElementById("game-high-score");
const statusTitle = document.getElementById("arcade-status-title");
const statusDesc = document.getElementById("arcade-status-desc");

let gameRunning = false;
let gameScore = 0;
let highScore = 0;
let playerX = arcadeCanvas.width / 2 - 45;
const playerWidth = 95;
const playerHeight = 18;
let fallingItems = [];

arcadeCanvas.addEventListener("mousemove", (e) => {
    const rect = arcadeCanvas.getBoundingClientRect();
    const scaleX = arcadeCanvas.width / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    playerX = Math.max(0, Math.min(arcadeCanvas.width - playerWidth, mouseX - playerWidth / 2));
});

function handleTouch(e) {
    e.preventDefault();
    const rect = arcadeCanvas.getBoundingClientRect();
    const scaleX = arcadeCanvas.width / rect.width;
    const touchX = (e.touches[0].clientX - rect.left) * scaleX;
    playerX = Math.max(0, Math.min(arcadeCanvas.width - playerWidth, touchX - playerWidth / 2));
}

arcadeCanvas.addEventListener("touchstart", handleTouch, { passive: false });
arcadeCanvas.addEventListener("touchmove", handleTouch, { passive: false });

function spawnItem() {
    if (!gameRunning) return;
    const rand = Math.random();
    let type = "ball";
    let emoji = "⚽";
    let points = 15;

    if (rand > 0.82) {
        type = "trophy";
        emoji = "🏆";
        points = 25;
    } else if (rand > 0.48) {
        type = "gamepad";
        emoji = "🎮";
        points = 15;
    } else if (rand < 0.12) {
        type = "redcard";
        emoji = "🟥";
        points = -20;
    } else if (rand < 0.24) {
        type = "bomb";
        emoji = "💣";
        points = -20;
    }

    fallingItems.push({
        x: Math.random() * (arcadeCanvas.width - 36) + 18,
        y: -20,
        vy: Math.random() * 2.2 + 2.4,
        type,
        emoji,
        points
    });
}

let spawnInterval = null;

function startArcadeGame() {
    sound.click();
    gameScore = 0;
    fallingItems = [];
    scoreEl.textContent = "0";
    gameRunning = true;
    arcadeOverlay.classList.add("hidden");

    if (spawnInterval) clearInterval(spawnInterval);
    spawnInterval = setInterval(spawnItem, 550);
    requestAnimationFrame(arcadeLoop);
}

function endArcadeGame(won) {
    gameRunning = false;
    if (spawnInterval) clearInterval(spawnInterval);
    arcadeOverlay.classList.remove("hidden");

    if (won) {
        statusTitle.textContent = "🏆 ¡VICTORIA ÉPICA NIVEL 14! 🏆";
        statusDesc.textContent = `¡Alcanzaste los 140 puntos como un verdadero pro, ${brotherName}!`;
        startGameBtn.textContent = "🔄 JUGAR OTRA VEZ";
        celebrateFireworks(5);
        unlockAchievement("arcade_master", "Campeón Arcade Nivel 14");
    }
}

function arcadeLoop() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, arcadeCanvas.width, arcadeCanvas.height);

    // Fondo rejilla sutil
    ctx.strokeStyle = "rgba(0, 242, 254, 0.08)";
    for (let x = 0; x < arcadeCanvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, arcadeCanvas.height);
        ctx.stroke();
    }

    // Jugador (Barra Neón)
    ctx.save();
    ctx.fillStyle = "#00f2fe";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00f2fe";
    ctx.fillRect(playerX, arcadeCanvas.height - 34, playerWidth, playerHeight);
    ctx.fillStyle = "#040711";
    ctx.font = "bold 11px Orbitron, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("LVL 14", playerX + playerWidth / 2, arcadeCanvas.height - 21);
    ctx.restore();

    // Objetos cayendo
    for (let i = fallingItems.length - 1; i >= 0; i--) {
        const item = fallingItems[i];
        item.y += item.vy;

        ctx.font = "26px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(item.emoji, item.x, item.y);

        // Colisión con la barra del jugador
        const hitY = item.y >= arcadeCanvas.height - 42 && item.y <= arcadeCanvas.height - 12;
        const hitX = item.x >= playerX - 10 && item.x <= playerX + playerWidth + 10;

        if (hitY && hitX) {
            gameScore = Math.max(0, gameScore + item.points);
            scoreEl.textContent = gameScore;
            if (gameScore > highScore) {
                highScore = gameScore;
                highScoreEl.textContent = highScore;
            }

            if (item.points > 0) {
                sound.click();
            } else {
                sound.explosion();
            }

            fallingItems.splice(i, 1);

            if (gameScore >= 140) {
                endArcadeGame(true);
                return;
            }
            continue;
        }

        if (item.y > arcadeCanvas.height + 30) {
            fallingItems.splice(i, 1);
        }
    }

    requestAnimationFrame(arcadeLoop);
}

startGameBtn.addEventListener("click", startArcadeGame);

/* ==========================================================================
   SECCIÓN 6: COFRE SECRETO (14 IMPACTOS PARA ROMPER EL SELLO)
   ========================================================================== */
const lootChest = document.getElementById("loot-chest");
const hitsLeftEl = document.getElementById("hits-left");
const shieldBar = document.getElementById("shield-bar");
const chestEmoji = document.getElementById("chest-emoji");
const rewardReveal = document.getElementById("reward-reveal");
const vaultInstruction = document.getElementById("vault-instruction");

let hitsRemaining = 14;

lootChest.addEventListener("click", (e) => {
    if (hitsRemaining <= 0) return;

    hitsRemaining--;
    hitsLeftEl.textContent = hitsRemaining;
    shieldBar.style.width = `${(hitsRemaining / 14) * 100}%`;

    sound.hit(14 - hitsRemaining);

    lootChest.classList.remove("shake");
    void lootChest.offsetWidth; // reflow
    lootChest.classList.add("shake");

    const rect = lootChest.getBoundingClientRect();
    launchFireworkBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 16);

    if (hitsRemaining === 0) {
        chestEmoji.textContent = "👑";
        vaultInstruction.textContent = "🎉 ¡SELLO DESTRUIDO! Has desbloqueado el regalo de tu hermano mayor:";
        rewardReveal.classList.remove("hidden");
        celebrateFireworks(8);
        unlockAchievement("vault_14", "Cofre Mítico de los 14 Años Abierto");
    }
});

document.getElementById("claim-celebration-btn").addEventListener("click", () => {
    sound.achievement();
    celebrateFireworks(8);
});

