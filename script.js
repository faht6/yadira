// Configuration
const START_DATE = new Date("2023-02-26T00:00:00"); // 26 de Febrero de 2023

// Global elements
const envelope = document.querySelector('.envelope-wrapper');
const screenEnvelope = document.getElementById('screen-envelope');
const screenContent = document.getElementById('screen-content');
const audioPlayer = document.getElementById('audio-player');
const musicBtn = document.getElementById('music-control');
const lyricsContainer = document.getElementById('lyrics-container');
const staticSakuraBg = document.getElementById('static-sakura-bg');
const smileBtn = document.getElementById('smile-btn');
const footerEnvelope = document.querySelector('.footer-envelope-container');

// Audio Handling: Robust Unlock Strategy
// We use 'pointerdown' to capture both touch and mouse events early.
function unlockAudio() {
    // Check if audio is playable
    if (audioPlayer.readyState === 0) {
        audioPlayer.load();
    }

    // Attempt silent play-pause to unlock AudioContext
    // This is the "Magic Fix" for iOS/Android
    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            console.log("Audio unlocked successfully");

            // Remove listeners only after success
            document.removeEventListener('pointerdown', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
        }).catch(error => {
            console.log("Unlock failed (likely waiting for interaction):", error);
        });
    }
}

// Listen on the entire document for the FIRST interaction
document.addEventListener('pointerdown', unlockAudio, { once: false }); // keep trying until success
document.addEventListener('keydown', unlockAudio, { once: false });

// Animation State
let isOpen = false;
const messageText = "Si pudiera elegir un lugar seguro, sería a tu lado.";

// 1. Envelope Interaction
function openEnvelope() {
    if (isOpen) return;
    isOpen = true;

    envelope.classList.add('open');

    // Show Background
    if (staticSakuraBg) staticSakuraBg.classList.add('visible');

    // Play music immediately
    playMusic();

    setTimeout(() => {
        screenEnvelope.style.opacity = '0';
        setTimeout(() => {
            screenEnvelope.classList.add('hidden');
            screenContent.classList.remove('hidden');
            void screenContent.offsetWidth; // Trigger reflow
            screenContent.classList.add('visible');

            // Start Typewriter
            typeWriter(messageText, 'typewriter-message', 100);

            // Show new interactive features after content reveals
            setTimeout(() => {
                if (smileBtn) smileBtn.classList.add('visible');
                if (footerEnvelope) footerEnvelope.classList.add('visible');
            }, 2000); // Delay a bit more to let typing finish or progress

        }, 1000);
    }, 1500);
}

// Typewriter Function
function typeWriter(text, elementId, speed) {
    let i = 0;
    const element = document.getElementById(elementId);
    element.innerHTML = "";
    element.classList.add('typewriter-cursor');

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            element.classList.remove('typewriter-cursor'); // Stop blinking cursor when done
        }
    }
    type();
}

function playMusic() {
    audioPlayer.volume = 1.0;
    audioPlayer.play().then(() => {
        musicBtn.innerText = "⏸️"; // Pause icon
        musicBtn.onclick = pauseMusic;
    }).catch(error => {
        console.log("Autoplay prevented:", error);
        musicBtn.innerText = "▶️"; // Play icon
    });
}

function pauseMusic() {
    audioPlayer.pause();
    musicBtn.innerText = "▶️";
    musicBtn.onclick = playMusic;
}

function toggleMusic() {
    if (audioPlayer.paused) {
        playMusic();
    } else {
        pauseMusic();
    }
}

// 3. Counter Logic
function updateTimer() {
    const now = new Date();
    const diff = now - START_DATE;

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const years = Math.floor(days / 365);
    const remainingDays = days % 365;
    const months = Math.floor(remainingDays / 30);
    const finalDays = remainingDays % 30;

    document.getElementById('years').innerText = years;
    document.getElementById('months').innerText = months;
    document.getElementById('days').innerText = finalDays;
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
}

setInterval(updateTimer, 1000);
updateTimer();

// 4. Floating Hearts Background
function createHearts() {
    const container = document.getElementById('bg-hearts');
    const heartCount = 20;

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 2 + 's';
        heart.style.animationDelay = Math.random() * 5 + 's';
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';
        container.appendChild(heart);
    }
}

createHearts();

// 5. Cherry Blossom Effect (Sakura) - Enhanced
function createSakura() {
    const container = document.getElementById('sakura-container');
    const petalCount = 40; // Más pétalos

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');

        // Random size for depth effect
        const size = Math.random() * 15 + 10;
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';

        // Random horizontal position
        petal.style.left = Math.random() * 100 + 'vw';

        // Random animation duration (speed) and delay
        const duration = Math.random() * 5 + 6; // 6 to 11 seconds (slower is more realistic)
        petal.style.animationDuration = duration + 's';
        petal.style.animationDelay = Math.random() * 10 + 's';

        // Blur distant petals
        if (size < 12) {
            petal.style.filter = "blur(1px)";
            petal.style.opacity = "0.6";
        }

        container.appendChild(petal);
    }
}

createSakura();

// 6. Interactive Features

// Reasons to Smile
const reasons = [
    "Porque tienes la risa más bonita del mundo.",
    "Porque haces que los días grises brillen.",
    "Porque eres mi lugar seguro.",
    "Por la forma en que me miras.",
    "Porque contigo todo es mejor.",
    "Recuerdo nuestro primer beso... inolvidable.",
    "Porque eres inteligente, fuerte y hermosa.",
    "Por todas las veces que nos hemos reído hasta llorar.",
    "Porque eres Yadira, el amor de mi vida.",
    "Simplemente... ¡porque te amo!"
];

function showReason() {
    const modal = document.getElementById('reason-modal');
    const text = document.getElementById('reason-text');

    // Pick random reason
    const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
    text.innerText = randomReason;

    modal.classList.add('visible');
    modal.classList.remove('hidden');
}

function closeReason() {
    document.getElementById('reason-modal').classList.remove('visible');
    setTimeout(() => {
        document.getElementById('reason-modal').classList.add('hidden');
    }, 300);
}

// Cheetos Vale
function openMiniEnvelope() {
    const modal = document.getElementById('cheetos-modal');
    modal.classList.add('visible');
    modal.classList.remove('hidden');
}

function closeCheetos() {
    document.getElementById('cheetos-modal').classList.remove('visible');
    setTimeout(() => {
        document.getElementById('cheetos-modal').classList.add('hidden');
    }, 300);
}

// Click Heart Effect
document.addEventListener('click', function (e) {
    // Don't trigger on buttons to avoid visual clutter? Or yes? Let's do yes everywhere.
    createClickHeart(e.clientX, e.clientY);
});

function createClickHeart(x, y) {
    const heart = document.createElement('div');
    heart.classList.add('click-heart');
    heart.innerHTML = '❤️';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';

    // Random direction
    const tx = (Math.random() - 0.5) * 100 + 'px'; // -50 to 50
    const ty = (Math.random() - 1) * 100 + 'px'; // -100 to 0 (upwards)

    heart.style.setProperty('--tx', tx);
    heart.style.setProperty('--ty', ty);

    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 800);
}
