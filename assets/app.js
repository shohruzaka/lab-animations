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

    // Network Simulation Logic
    if (document.querySelector('.tarmoq')) {
        initTarmoqPage();
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
    window.copyHash = function(id) {
        const el = document.getElementById(id);
        if (!el || el.innerText === '...') return;
        
        navigator.clipboard.writeText(el.innerText).then(() => {
            const btn = el.parentElement.querySelector('.copy-btn i');
            if (btn) {
                const originalClass = btn.className;
                btn.className = 'bi bi-check-lg';
                btn.style.color = '#10b981';
                setTimeout(() => {
                    btn.className = originalClass;
                    btn.style.color = '';
                }, 1500);
            }
        });
    };

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

    function checkPasswordStrength(password) {
        const container = document.querySelector('.password-strength-container');
        const bar = document.getElementById('strengthBar');
        const text = document.getElementById('strengthText');

        if (!password) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';

        let score = 0;
        if (password.length > 6) score++;
        if (password.length > 10) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        let width = 0;
        let color = '#ef4444'; // weak
        let label = 'Juda Zaif';

        switch (score) {
            case 0:
            case 1:
                width = 20;
                color = '#ef4444'; // red
                label = 'Zaif';
                break;
            case 2:
                width = 40;
                color = '#f59e0b'; // orange
                label = "O'rtacha";
                break;
            case 3:
                width = 60;
                color = '#f59e0b';
                label = "Yaxshi";
                break;
            case 4:
                width = 80;
                color = '#10b981'; // green
                label = "Kuchli";
                break;
            case 5:
                width = 100;
                color = '#3b82f6'; // blue
                label = "Juda Kuchli";
                break;
        }

        bar.style.width = width + '%';
        bar.style.backgroundColor = color;
        text.innerText = label;
        text.style.color = color;
    }

    document.getElementById('passInput').addEventListener('input', (e) => {
        generateHashes(e.target.value);
        checkPasswordStrength(e.target.value);
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

/* --- Network Simulation Page Functions --- */
function initTarmoqPage() {
    const deviceData = {
        cpe: {
            title: "TP-Link CPE610",
            icon: "bi-router-fill",
            desc: "5GHz 300Mbps 23dBi tashqi CPE. Uzoq masofali (20km+) simsiz aloqa uchun mo'ljallangan. Yomg'ir va qorga chidamli korpus.",
            stats: "Status: Online | Signal: -62dBm | Link: 100% | Distance: 5.2km"
        },
        cpe_interior: {
            title: "TP-Link CPE610 (Client)",
            icon: "bi-router-fill",
            desc: "Qabul qiluvchi stansiya (Station Mode). Tashqi hududdan kelayotgan signalni qabul qilib, kabel orqali ichki tarmoqqa uzatadi.",
            stats: "Mode: Client | Signal: -58dBm | Link: 100%"
        },
        poe: {
            title: "Passive PoE Injector",
            icon: "bi-lightning-fill",
            desc: "Ethernet kabeli orqali ma'lumot va 24V elektr tokini bir vaqtning o'zida uzatadi. CPE ni ortiqcha kabellarsiz quvvatlaydi.",
            stats: "Output: 24V DC | Input: 220V AC | Status: Stable"
        },
        switch: {
            title: "TP-Link TL-SG108",
            icon: "bi-hdd-network",
            desc: `Gigabit Switch. Tarmoqni kengaytirish va bir nechta qurilmalarni ulash imkonini beradi.
            <table style="width:100%; margin-top:15px; border-collapse:collapse; font-size:0.85rem; color:#cbd5e1;">
                <tr style="border-bottom:1px solid #334155; text-align:left;">
                    <th style="padding:8px;">Port</th><th style="padding:8px;">Qurilma</th><th style="padding:8px;">Holat</th>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                    <td style="padding:8px;">1</td><td>PoE Injector (WAN)</td><td style="color:#10b981;">Active</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                    <td style="padding:8px;">2</td><td>Wi-Fi Router 1</td><td style="color:#10b981;">Active</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                    <td style="padding:8px;">3</td><td>Wi-Fi Router 2</td><td style="color:#10b981;">Active</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                    <td style="padding:8px;">4</td><td>Deco Mesh (Main)</td><td style="color:#10b981;">Active</td>
                </tr>
                <tr>
                    <td style="padding:8px;">5-8</td><td style="color:#64748b;">Bo'sh</td><td style="color:#64748b;">Idle</td>
                </tr>
            </table>`,
            stats: "Speed: 1000Mbps | Ports: 8 | Load: 15%"
        },
        deco: {
            title: "TP-Link Deco X50",
            icon: "bi-router",
            desc: "AI-Driven Mesh Wi-Fi 6 tizimi. Uyingizning har bir burchagida yuqori tezlikdagi internetni ta'minlaydi. O'lik zonalarni yo'qotadi.",
            stats: "Clients: 5 | Coverage: Excellent | Band: Dual-Band (2.4/5GHz)"
        },
        router: {
            title: "Distribution Wi-Fi Router",
            icon: "bi-router",
            desc: "Bu routerlarning asosiy vazifasi Deco nodelarga internet tarqatish va tarmoq yuklamasini taqsimlashdan iborat.",
            stats: "Role: Distribution | Uplink: 1Gbps | Target: Deco Mesh"
        }
    };

    // Smartfonlar uchun ma'lumotlarni generatsiya qilish
    const phoneModels = ["iPhone 15 Pro", "Samsung S24 Ultra", "Pixel 8 Pro", "Xiaomi 14", "Honor Magic 6"];
    ['phone1', 'phone2', 'phone3', 'phone4', 'phone6'].forEach((id, i) => {
        const speed = 150 + Math.floor(Math.random() * 300);
        deviceData[id] = {
            title: `Smartfon (${phoneModels[i % phoneModels.length]})`,
            icon: "bi-phone",
            desc: "Mesh rouming texnologiyasi tufayli xonalararo o'tganda ham uzilishsiz aloqa. Avtomatik eng yaqin nuqtaga ulanadi.",
            stats: `IP: 192.168.1.${102 + i} | Signal: -${45 + Math.floor(Math.random() * 20)}dBm | Band: 5GHz`,
            speedVal: speed
        };
    });

    // Laptoplar uchun ma'lumotlarni generatsiya qilish
    const laptopModels = ["MacBook Pro M3", "Dell XPS 15", "Lenovo ThinkPad X1", "HP Spectre x360"];
    ['laptop1', 'laptop2', 'laptop3', 'laptop4'].forEach((id, i) => {
        const speed = 300 + Math.floor(Math.random() * 600);
        deviceData[id] = {
            title: `Noutbuk (${laptopModels[i % laptopModels.length]})`,
            icon: "bi-laptop",
            desc: "Wi-Fi 6E moduli orqali yuqori tezlikdagi tarmoqqa ulangan. Katta hajmli ma'lumotlar almashinuvi va video oqimlar uchun optimallashtirilgan.",
            stats: `IP: 192.168.1.${20 + i} | Protocol: 802.11ax`,
            speedVal: speed
        };
    });

    let speedInterval = null;

    function updateDynamicStats(id) {
        const el = document.getElementById(id);
        if (!el || (!id.includes('phone') && !id.includes('laptop'))) return;

        const rect = el.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Signal manbalari (Access Points)
        const aps = ['deco1', 'deco2', 'deco3', 'router1', 'router2'];
        let minDist = Infinity;
        let nearestApId = null;

        aps.forEach(apId => {
            const ap = document.getElementById(apId);
            if (ap) {
                const r = ap.getBoundingClientRect();
                const ax = r.left + r.width / 2;
                const ay = r.top + r.height / 2;
                const d = Math.sqrt((x - ax) ** 2 + (y - ay) ** 2);
                if (d < minDist) {
                    minDist = d;
                    nearestApId = apId;
                }
            }
        });

        // Signal kuchini hisoblash (dBm)
        // Masofa qancha uzoq bo'lsa, signal shuncha pasayadi (-30dBm dan -90dBm gacha)
        // Ekranning o'lchamiga qarab taxminiy koeffitsient
        let dbm = -35 - Math.floor(minDist / 8);
        dbm += Math.floor(Math.random() * 4) - 2; // Kichik tebranish
        
        if (dbm > -20) dbm = -20;
        if (dbm < -95) dbm = -95;

        // Tezlikni hisoblash (Signal kuchiga qarab)
        // -30dBm -> 100%, -90dBm -> 0%
        let quality = Math.max(0, Math.min(1, (90 + dbm) / 60));
        let baseSpeed = id.includes('laptop') ? 900 : 450;
        let currentSpeed = Math.floor(baseSpeed * quality);
        if (currentSpeed < 0) currentSpeed = 0;

        const data = deviceData[id];
        if (data) {
            data.speedVal = currentSpeed;

            // Eng yaqin AP nomini olish
            let apName = "Unknown";
            if (nearestApId) {
                const apEl = document.getElementById(nearestApId);
                const label = apEl.querySelector('.device-label');
                if (label) apName = label.innerText;
                else if (nearestApId.includes('deco')) apName = "Deco Mesh";
                else if (nearestApId.includes('router')) apName = "Wi-Fi Router";
                else if (nearestApId.includes('cpe')) apName = "CPE Station";
            }

            let parts = data.stats.split(' | ');
            
            // Yangi stats qatorini yig'ish
            let newStats = [];
            
            const ipPart = parts.find(p => p.trim().startsWith('IP'));
            newStats.push(ipPart ? ipPart : `IP: 192.168.1.X`);
            newStats.push(`Signal: ${dbm}dBm`);
            newStats.push(`Connected: ${apName}`);
            const bandPart = parts.find(p => p.trim().startsWith('Band') || p.trim().startsWith('Protocol'));
            newStats.push(bandPart ? bandPart : (id.includes('laptop') ? 'Protocol: 802.11ax' : 'Band: 5GHz'));

            data.stats = newStats.join(' | ');
        }
    }

    let isDragging = false;

    window.showDetail = function(id) {
        if (isDragging) return;
        updateDynamicStats(id);
        const data = deviceData[id];
        if (!data) return;
        document.getElementById('detailTitle').innerText = data.title;
        document.getElementById('detailText').innerHTML = data.desc;
        document.getElementById('detailStats').innerText = data.stats;
        document.getElementById('detailIcon').innerHTML = `<i class="bi ${data.icon}"></i>`;
        
        const speedArea = document.getElementById('speedtestArea');
        if (data.speedVal) {
            speedArea.style.display = 'block';
            runSpeedTest(data.speedVal);
        } else {
            speedArea.style.display = 'none';
            if(speedInterval) clearInterval(speedInterval);
        }

        document.getElementById('detailPanel').classList.add('visible');
    };

    window.hideDetail = function() {
        document.getElementById('detailPanel').classList.remove('visible');
        if(speedInterval) clearInterval(speedInterval);
    };

    function runSpeedTest(targetSpeed) {
        const bar = document.getElementById('speedBar');
        const val = document.getElementById('speedValue');
        let current = 0;
        
        if(speedInterval) clearInterval(speedInterval);
        
        bar.style.width = '0%';
        val.innerText = '0.0';

        speedInterval = setInterval(() => {
            const diff = targetSpeed - current;
            // Tezlik oshishi effekti
            const step = Math.max(0.5, diff / 8) + Math.random() * 5;
            
            current += step;
            
            if (current >= targetSpeed) {
                current = targetSpeed;
                clearInterval(speedInterval);
            }

            // 1000Mbps shkalasiga nisbatan foiz
            const widthPerc = Math.min(100, (current / 1000) * 100); 
            bar.style.width = widthPerc + '%';
            val.innerText = current.toFixed(1);
        }, 30);
    }

    // Draw Cables (Realistic Connections)
    function drawCables() {
        const svg = document.getElementById('cable-overlay');
        if (!svg) return;
        svg.innerHTML = ''; // Clear existing
        
        const container = document.querySelector('.zone-interior');
        if (!container) return;
        const contRect = container.getBoundingClientRect();

        function getPointAndDir(el, side, offsetPercent = 50) {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            const x = r.left - contRect.left;
            const y = r.top - contRect.top;
            const w = r.width;
            const h = r.height;
            
            let p = { x: 0, y: 0, dir: {x:0, y:0} };

            switch(side) {
                case 'top': p.x = x + w * (offsetPercent/100); p.y = y; p.dir = {x: 0, y: -1}; break;
                case 'bottom': p.x = x + w * (offsetPercent/100); p.y = y + h; p.dir = {x: 0, y: 1}; break;
                case 'left': p.x = x; p.y = y + h * (offsetPercent/100); p.dir = {x: -1, y: 0}; break;
                case 'right': p.x = x + w; p.y = y + h * (offsetPercent/100); p.dir = {x: 1, y: 0}; break;
            }
            return p;
        }

        function drawSmartCable(el1, side1, el2, side2, color, offset1=50, offset2=50, isWireless=false) {
            const p1 = getPointAndDir(el1, side1, offset1);
            const p2 = getPointAndDir(el2, side2, offset2);
            if (!p1 || !p2) return;

            const dist = Math.sqrt(Math.pow(p2.x-p1.x, 2) + Math.pow(p2.y-p1.y, 2));
            const tension = Math.min(dist * 0.5, 150);

            const cp1x = p1.x + p1.dir.x * tension;
            const cp1y = p1.y + p1.dir.y * tension;
            const cp2x = p2.x + p2.dir.x * tension;
            const cp2y = p2.y + p2.dir.y * tension;

            const pathData = `M ${p1.x} ${p1.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
            const pathId = `cable-path-${el1.id}-${el2.id}`;

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('id', pathId);
            path.setAttribute('d', pathData);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', color);
            path.setAttribute('stroke-width', '2');
            path.setAttribute('stroke-linecap', 'round');
            path.style.filter = 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))';
            if (isWireless) {
                path.setAttribute('stroke-dasharray', '8,8');
                path.style.opacity = '0.6';
            }
            svg.appendChild(path);

            // Packet Animation
            const packet = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            packet.setAttribute('r', '3');
            packet.classList.add('packet-dot');
            packet.style.fill = color === '#ef4444' ? '#fca5a5' : '#93c5fd';

            const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
            anim.setAttribute('dur', Math.max(1.5, dist / 100) + 's');
            anim.setAttribute('repeatCount', 'indefinite');
            
            const mpath = document.createElementNS('http://www.w3.org/2000/svg', 'mpath');
            mpath.setAttribute('href', '#' + pathId);
            
            anim.appendChild(mpath);
            packet.appendChild(anim);
            svg.appendChild(packet);
        }

        const cpe = document.getElementById('cpe_interior');
        const cpeExt = document.getElementById('cpe');
        const poe = document.getElementById('poe');
        const sw = document.getElementById('switch');
        const r1 = document.getElementById('router1');
        const r2 = document.getElementById('router2');
        const deco = document.getElementById('deco1');

        // 0. Wireless Bridge (CPE Exterior -> CPE Interior)
        drawSmartCable(cpeExt, 'right', cpe, 'left', '#3b82f6', 50, 50, true);

        // 1. CPE -> PoE (Red, WAN)
        drawSmartCable(cpe, 'bottom', poe, 'left', '#ef4444', 50, 50);

        // 2. PoE -> Switch (Red, Uplink)
        drawSmartCable(poe, 'right', sw, 'right', '#ef4444', 50, 20);

        // 3. Switch -> Router 1 (Blue, LAN)
        drawSmartCable(sw, 'left', r1, 'left', '#3b82f6', 20, 50);

        // 4. Switch -> Router 2 (Blue, LAN)
        drawSmartCable(sw, 'left', r2, 'left', '#3b82f6', 50, 50);

        // 5. Switch -> Deco (Blue, LAN)
        drawSmartCable(sw, 'bottom', deco, 'right', '#3b82f6', 80, 50);
    }

    window.addEventListener('resize', drawCables);
    setTimeout(drawCables, 100);

    // Drag & Drop Logic
    const draggables = document.querySelectorAll('.user-device');
    let activeDrag = null;
    let startX, startY, startLeft, startTop;

    draggables.forEach(el => {
        el.style.cursor = 'grab';
        el.addEventListener('mousedown', startDrag);
        el.addEventListener('touchstart', startDrag, { passive: false });
    });

    function startDrag(e) {
        activeDrag = this;
        isDragging = false;
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        startX = clientX;
        startY = clientY;
        startLeft = activeDrag.offsetLeft;
        startTop = activeDrag.offsetTop;

        activeDrag.style.cursor = 'grabbing';
        activeDrag.style.transition = 'none';
        activeDrag.style.zIndex = '100';

        if (e.type.includes('mouse')) {
            document.addEventListener('mousemove', onDrag);
            document.addEventListener('mouseup', stopDrag);
        } else {
            document.addEventListener('touchmove', onDrag, { passive: false });
            document.addEventListener('touchend', stopDrag);
        }
    }

    function onDrag(e) {
        if (!activeDrag) return;
        
        const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
        
        if (Math.abs(clientX - startX) > 5 || Math.abs(clientY - startY) > 5) {
            isDragging = true;
        }

        if (isDragging) {
            e.preventDefault();
            const dx = clientX - startX;
            const dy = clientY - startY;
            activeDrag.style.left = `${startLeft + dx}px`;
            activeDrag.style.top = `${startTop + dy}px`;
            
            updateDynamicStats(activeDrag.id);
            
            const detailPanel = document.getElementById('detailPanel');
            if (detailPanel.classList.contains('visible')) {
                const currentTitle = document.getElementById('detailTitle').innerText;
                const deviceTitle = deviceData[activeDrag.id].title;
                if (deviceTitle && currentTitle === deviceTitle) {
                     const data = deviceData[activeDrag.id];
                     document.getElementById('detailStats').innerText = data.stats;
                }
            }
        }
    }

    function stopDrag() {
        if (!activeDrag) return;
        activeDrag.style.cursor = 'grab';
        activeDrag.style.transition = '';
        activeDrag.style.zIndex = '';
        activeDrag = null;
        setTimeout(() => { isDragging = false; }, 50);
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('touchend', stopDrag);
    }
}