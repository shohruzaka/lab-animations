document.addEventListener('DOMContentLoaded', () => {
    // Index Page Logic
    if (document.getElementById('canvas-bg')) {
        initIndexPage();
    }

    // Password Hash Logic
    if (document.getElementById('passInput')) {
        initPasswordHashPage();
    }

    // HTTPS Demo Logic
    if (document.getElementById('stage')) {
        initHttpsDemoPage();
    }

    // Digital Signature Logic
    if (document.getElementById('msg-input')) {
        initDigitalSignaturePage();
    }

    // Block Cipher Logic
    if (document.getElementById('plainInput')) {
        initBlockCipherPage();
    }

    // About Page Logic
    if (document.getElementById('about-content')) {
        initAboutPage();
    }
});

/* --- Index Page Functions --- */
function initIndexPage() {
    // Typing Effect
    const textElement = document.getElementById('typing-text');
    const texts = ["Axborot xavfsizligi kelajagi", "Kriptografiya asoslari", "Xavfsiz tarmoq texnologiyalari"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            textElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }
    if (textElement) {
        type();
    }

    // Canvas Background Animation
    const canvas = document.getElementById('canvas-bg');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.fillStyle = 'rgba(0, 242, 254, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const numberOfParticles = (canvas.width * canvas.height) / 15000;
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 242, 254, ${0.1 - distance/1500})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();
}

/* --- Password Hash Page Functions --- */
function initPasswordHashPage() {
    function pseudoMD5(str) {
        if(!str) return "...";
        let h1 = 0x67452301, h2 = 0xEFCDAB89, h3 = 0x98BADCFE, h4 = 0x10325476;
        for(let i=0; i<str.length; i++) {
            let c = str.charCodeAt(i);
            h1 = ((h1 + c) * 2654435761) >>> 0;
            h2 = ((h2 + h1) * 1597334677) >>> 0;
            h3 = ((h3 + h2) * 668265261) >>> 0;
            h4 = ((h4 + h3) * 2246822507) >>> 0;
        }
        const toHex = (n) => n.toString(16).padStart(8, '0');
        return (toHex(h1) + toHex(h2) + toHex(h3) + toHex(h4)).substring(0, 32);
    }

    async function generateHashes(text) {
        const md5El = document.getElementById('md5-hash');
        const sha1El = document.getElementById('sha1-hash');
        const sha256El = document.getElementById('sha256-hash');
        const sha512El = document.getElementById('sha512-hash');

        if (!text) {
            [md5El, sha1El, sha256El, sha512El].forEach(el => el.innerText = "...");
            return;
        }

        md5El.innerText = pseudoMD5(text);

        const encoder = new TextEncoder();
        const data = encoder.encode(text);

        const hash = async (algo) => {
            const buf = await crypto.subtle.digest(algo, data);
            return Array.from(new Uint8Array(buf))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        };

        sha1El.innerText = await hash('SHA-1');
        sha256El.innerText = await hash('SHA-256');
        sha512El.innerText = await hash('SHA-512');
    }

    document.getElementById('passInput').addEventListener('input', (e) => {
        generateHashes(e.target.value);
    });
}

/* --- HTTPS Demo Page Functions --- */
let httpsStep = 0;
let httpsAutoPlayInterval = null;
let httpsIsMitm = false;

function initHttpsDemoPage() {
    // Global functions for button clicks
    window.resetSim = resetSim;
    window.toggleMitm = toggleMitm;
    window.toggleAutoPlay = toggleAutoPlay;
    window.nextStep = nextStep;
}

const httpsSteps = [
    { text: "Client Hello", desc: "Mijoz serverga 'Salom' (Client Hello) yuboradi. Unda qo'llab-quvvatlanadigan shifrlash turlari va tasodifiy raqam bor.", direction: 'right' },
    { text: "Server Hello + Sertifikat", desc: "Server javob beradi: Shifrlash turini tanlaydi va o'zining raqamli Sertifikatini (Public Key) yuboradi.", direction: 'left' },
    { text: "Key Exchange", desc: "Mijoz sertifikatni tekshiradi. Serverning ochiq kaliti yordamida 'Premaster Secret'ni shifrlab yuboradi.", direction: 'right' },
    { text: "Session Keys Generated", desc: "Ikkala tomon ham maxfiy 'Sessiya Kalitini' hisoblab chiqadi. Endi aloqa tayyor.", direction: 'center' },
    { text: "Secure Data Transfer", desc: "Xavfsiz aloqa o'rnatildi! Endi barcha ma'lumotlar shifrlangan holda uzatiladi.", direction: 'secure' }
];

const httpsMitmSteps = [
    { text: "Client Hello", desc: "Mijoz serverga ulanmoqchi. Xaker so'rovni o'rtada ushlab qoladi.", from: 10, to: 50 },
    { text: "Forward Hello", desc: "Xaker so'rovni o'z nomidan serverga yuboradi.", from: 50, to: 90 },
    { text: "Server Hello", desc: "Server javob beradi. Xaker buni ham ushlab qoladi.", from: 90, to: 50 },
    { text: "Fake Cert", desc: "Xaker mijozga o'zining SOXTA sertifikatini yuboradi.", from: 50, to: 10, hacked: true },
    { text: "Key Exchange", desc: "Mijoz soxta sertifikat bilan kalitni shifrlaydi. Xaker uni ochib o'qiydi!", from: 10, to: 50, hacked: true },
    { text: "Forward Key", desc: "Xaker serverning asl kaliti bilan qayta shifrlab, serverga yuboradi.", from: 50, to: 90 },
    { text: "Data Theft", desc: "Aloqa o'rnatildi. Xaker barcha ma'lumotlarni o'qiy oladi!", from: 10, to: 90, hacked: true }
];

function toggleMitm() {
    httpsIsMitm = !httpsIsMitm;
    const btn = document.getElementById('btn-mitm');
    const h1 = document.querySelector('h1');
    const stage = document.getElementById('stage');
    
    if (httpsIsMitm) {
        stage.classList.add('mitm-mode');
        btn.innerText = "Normal Rejimga Qaytish";
        h1.innerText = "MITM Attack (Hujum)";
        h1.style.background = "linear-gradient(to right, #ef4444, #f59e0b)";
        h1.style.webkitBackgroundClip = "text";
        h1.style.webkitTextFillColor = "transparent";
        
        const dotsContainer = document.getElementById('dots');
        dotsContainer.innerHTML = '';
        httpsMitmSteps.forEach(() => {
            const d = document.createElement('div');
            d.className = 'dot';
            dotsContainer.appendChild(d);
        });
    } else {
        location.reload();
        return;
    }
    resetSim();
}

function toggleAutoPlay() {
    const btn = document.getElementById('btn-auto');
    if (httpsAutoPlayInterval) {
        clearInterval(httpsAutoPlayInterval);
        httpsAutoPlayInterval = null;
        btn.innerHTML = '<i class="bi bi-play-fill"></i> Avto';
    } else {
        nextStep();
        httpsAutoPlayInterval = setInterval(nextStep, 2500);
        btn.innerHTML = '<i class="bi bi-pause-fill"></i> To\'xtatish';
    }
}

function updateDots(current) {
    const currentDots = document.querySelectorAll('.dot');
    currentDots.forEach((d, i) => {
        if (i <= current) d.classList.add('active');
        else d.classList.remove('active');
    });
}

function resetSim() {
    httpsStep = 0;
    const packet = document.getElementById('packet');
    const stage = document.getElementById('stage');
    const log = document.getElementById('log');

    packet.style.opacity = '0';
    packet.style.left = '0';
    packet.classList.remove('hacked');
    stage.classList.remove('secure');
    log.innerText = "Jarayonni boshlash uchun 'Keyingi' tugmasini bosing.";
    if (httpsAutoPlayInterval) {
        clearInterval(httpsAutoPlayInterval);
        httpsAutoPlayInterval = null;
        document.getElementById('btn-auto').innerHTML = '<i class="bi bi-play-fill"></i> Avto';
    }
    updateDots(-1);
}

function nextStep() {
    const currentSteps = httpsIsMitm ? httpsMitmSteps : httpsSteps;
    if (httpsStep >= currentSteps.length) {
        resetSim();
        return;
    }

    const current = currentSteps[httpsStep];
    const packet = document.getElementById('packet');
    const log = document.getElementById('log');
    const stage = document.getElementById('stage');

    log.innerText = current.desc;
    packet.innerText = current.text;
    packet.style.opacity = '1';
    
    if(current.hacked) packet.classList.add('hacked');
    else packet.classList.remove('hacked');

    updateDots(httpsStep);

    if (httpsIsMitm) {
        packet.style.left = current.from + '%';
        setTimeout(() => { packet.style.left = current.to + '%'; }, 50);
    } else if (current.direction === 'right') {
        packet.style.left = '10%';
        setTimeout(() => { packet.style.left = '80%'; }, 50);
    } else if (current.direction === 'left') {
        packet.style.left = '80%';
        setTimeout(() => { packet.style.left = '10%'; }, 50);
    } else if (current.direction === 'center') {
        packet.style.left = '50%';
        packet.style.transform = 'translate(-50%, -50%) scale(1.2)';
        setTimeout(() => { packet.style.transform = 'translate(-50%, -50%) scale(1)'; }, 300);
    } else if (current.direction === 'secure') {
        packet.style.opacity = '0';
        stage.classList.add('secure');
    }

    httpsStep++;
}

/* --- Digital Signature Page Functions --- */
let currentSignature = "";

function initDigitalSignaturePage() {
    window.updateSender = updateSender;
    window.signMessage = signMessage;
    window.verifyMessage = verifyMessage;
    updateSender();
}

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function updateSender() {
    const text = document.getElementById('msg-input').value;
    const hash = await sha256(text);
    document.getElementById('sender-hash').innerText = hash;
}

async function signMessage() {
    const text = document.getElementById('msg-input').value;
    const hash = await sha256(text);
    currentSignature = btoa(hash).split('').reverse().join(''); 
    document.getElementById('sender-sig').innerText = currentSignature;
    document.getElementById('msg-verify').value = text;
    document.getElementById('receiver-sig').innerText = currentSignature;
    document.getElementById('status-box').style.display = 'none';
}

async function verifyMessage() {
    const text = document.getElementById('msg-verify').value;
    const hash = await sha256(text);
    document.getElementById('receiver-hash').innerText = hash;
    const decryptedSignatureHash = atob(currentSignature.split('').reverse().join(''));
    const statusBox = document.getElementById('status-box');
    statusBox.style.display = 'block';

    if (hash === decryptedSignatureHash) {
        statusBox.className = 'status-box status-valid';
        statusBox.innerHTML = "<i class='bi bi-check-circle-fill'></i> IMZO HAQIQIY! Hujjat o'zgarmagan.";
    } else {
        statusBox.className = 'status-box status-invalid';
        statusBox.innerHTML = "<i class='bi bi-x-circle-fill'></i> XATOLIK! Hujjat o'zgartirilgan yoki imzo soxta.";
    }
}

/* --- Block Cipher Page Functions --- */
let currentMode = 'ECB';
const demoTexts = ["SALOM DUNYO!", "XAVFSIZLIK", "BLOCK CIPHER"];
let animState = { textIndex: 0, charIndex: 0, isTyping: false, timer: null };

function initBlockCipherPage() {
    window.setMode = setMode;
    window.updateVis = updateVis;
    window.toggleAnimation = toggleAnimation;
    updateVis();
}

function toggleAnimation() {
    const checkbox = document.getElementById('animToggle');
    const input = document.getElementById('plainInput');
    
    if (checkbox.checked) {
        animState.isTyping = true;
        input.value = "";
        animState.charIndex = 0;
        typeNextChar();
    } else {
        animState.isTyping = false;
        clearTimeout(animState.timer);
    }
}

function typeNextChar() {
    if (!animState.isTyping) return;
    const currentText = demoTexts[animState.textIndex];
    const input = document.getElementById('plainInput');

    if (animState.charIndex < currentText.length) {
        input.value += currentText.charAt(animState.charIndex);
        animState.charIndex++;
        updateVis();
        animState.timer = setTimeout(typeNextChar, 200);
    } else {
        animState.timer = setTimeout(() => {
            if (!animState.isTyping) return;
            input.value = "";
            animState.charIndex = 0;
            animState.textIndex = (animState.textIndex + 1) % demoTexts.length;
            typeNextChar();
        }, 1500);
    }
}

function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => {
        b.classList.remove('active');
        if(b.innerText.includes(mode)) b.classList.add('active');
    });
    updateVis();
}

function stringToBlocks(str) {
    const blockSize = 4;
    const blocks = [];
    for (let i = 0; i < str.length; i += blockSize) {
        let chunk = str.substring(i, i + blockSize);
        if (chunk.length < blockSize) {
            chunk = chunk.padEnd(blockSize, '_');
        }
        blocks.push(chunk);
    }
    if (blocks.length === 0) blocks.push("____");
    return blocks;
}

function mockEncrypt(text, keyModifier = 0) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) - hash) + text.charCodeAt(i) + keyModifier;
        hash |= 0;
    }
    return Math.abs(hash).toString(16).substring(0, 4).toUpperCase().padStart(4, '0');
}

function updateVis() {
    const input = document.getElementById('plainInput').value;
    const blocks = stringToBlocks(input);
    const container = document.getElementById('visArea');
    const infoBox = document.getElementById('infoBox');
    
    container.innerHTML = '';
    let html = '<div class="block-row">';
    let prevCipher = null;
    let iv = "A1B2";

    if (currentMode === 'ECB') {
        infoBox.innerHTML = `<span class="danger-text">ECB Rejimi:</span> Har bir blok alohida kalit bilan shifrlanadi. <br>Agar bloklar bir xil bo'lsa (masalan "TEST"), shifrlangan natija ham bir xil bo'ladi. Bu ma'lumotdagi naqshlarni (pattern) yashirmaydi.`;
        blocks.forEach((block, i) => {
            const cipher = mockEncrypt(block);
            html += `<div class="block-group"><div class="data-block">${block}</div><div class="arrow-down"><i class="bi bi-arrow-down"></i></div><div class="process-node"><i class="bi bi-key"></i></div><div class="arrow-down"><i class="bi bi-arrow-down"></i></div><div class="data-block cipher">${cipher}</div><div style="font-size:0.8rem; color:#64748b; margin-top:5px;">Blok ${i+1}</div></div>`;
        });
    } else if (currentMode === 'CBC') {
        infoBox.innerHTML = `<span class="safe-text">CBC Rejimi:</span> Har bir blok oldingi blokning shifrlangan natijasi bilan XOR qilinadi. <br>Birinchi blok uchun <b>IV</b> ishlatiladi. Bir xil ma'lumot bloklari har xil natija beradi.`;
        html += `<div class="block-group" style="margin-right: -20px;"><div class="data-block iv">IV: ${iv}</div><div class="arrow-down" style="transform: rotate(-45deg) translateX(10px);"><i class="bi bi-arrow-right"></i></div></div>`;
        blocks.forEach((block, i) => {
            let mix = prevCipher ? parseInt(prevCipher, 16) : parseInt(iv, 16);
            const cipher = mockEncrypt(block, mix);
            html += `<div class="block-group"><div class="data-block">${block}</div><div class="arrow-down"><i class="bi bi-arrow-down"></i></div><div class="process-node">XOR</div><div class="arrow-down"><i class="bi bi-arrow-down"></i></div><div class="process-node"><i class="bi bi-key"></i></div><div class="arrow-down"><i class="bi bi-arrow-down"></i></div><div class="data-block cipher">${cipher}</div></div>`;
            if (i < blocks.length - 1) html += `<div style="align-self: flex-end; margin-bottom: 65px; color: var(--accent); font-size: 1.5rem;"><i class="bi bi-arrow-right"></i></div>`;
            prevCipher = cipher;
        });
    } else if (currentMode === 'CTR') {
        infoBox.innerHTML = `<span class="safe-text">CTR Rejimi:</span> Bloklar shifrlanmaydi, balki "Hisoblagich" (Counter) shifrlanadi va ma'lumot bilan XOR qilinadi. <br>Bu parallel ishlash imkonini beradi (tezkor) va xavfsiz.`;
        blocks.forEach((block, i) => {
            const cipher = mockEncrypt(block, i * 100);
            html += `<div class="block-group"><div class="data-block iv" style="font-size:0.7rem">CTR+${i}</div><div class="arrow-down"><i class="bi bi-arrow-down"></i></div><div class="process-node"><i class="bi bi-key"></i></div><div class="arrow-down"><i class="bi bi-arrow-down"></i></div><div class="process-node">XOR</div><div class="arrow-down"><i class="bi bi-arrow-down"></i></div><div class="data-block cipher">${cipher}</div><div style="position:absolute; top: 135px; left: -60px; width: 50px; text-align:right; font-size:0.8rem; color:white;">${block} <i class="bi bi-arrow-right"></i></div></div>`;
        });
    }
    html += '</div>';
    container.innerHTML = html;
}

/* --- About Page Functions --- */
function initAboutPage() {
    const nameElement = document.getElementById('typing-name');
    if (!nameElement) return;
    const text = "Shohruz Turgunaliev";
    let index = 0;
    
    function typeName() {
        if (index < text.length) {
            nameElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeName, 100);
        }
    }
    typeName();
}