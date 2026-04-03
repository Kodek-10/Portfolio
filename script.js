// ====================== CONFIG ======================
const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
const particleCount = isMobile ? 30 : 60;
const connectionDistance = 140;

// ====================== THEME TOGGLE ======================
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
let isDarkMode = true;

function updateParticlesColor() {
    particles.forEach(p => {
        const colors = isDarkMode 
            ? ['#00f5c4', '#7c3aed', '#f59e0b'] 
            : ['#ff3b3b', '#ff6b6b', '#d4a017'];
        p.color = colors[Math.floor(Math.random() * 3)];
    });
}

themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    themeIcon.className = isDarkMode ? 'theme-icon fas fa-sun' : 'theme-icon fas fa-moon';
    updateParticlesColor();
});

// ====================== LOADER ======================
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.loader').classList.add('hidden');
    }, 800);
});

// ====================== CURSOR (Desktop only) ======================
if (!isMobile) {
    const cursor = document.querySelector('.cursor');
    const cursorTrail = document.querySelector('.cursor-trail');
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animateTrail() {
        trailX += (mouseX - trailX) * 0.15;
        trailY += (mouseY - trailY) * 0.15;
        cursorTrail.style.left = trailX + 'px';
        cursorTrail.style.top = trailY + 'px';
        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // Hover effect
    document.querySelectorAll('a, button, .skill-card, .project-card, .theme-toggle').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
}

// ====================== PARTICLES (optimisées) ======================
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0, mouseY = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.8;
        this.vy = (Math.random() - 0.5) * 1.8;
        this.size = Math.random() * 2.8 + 1;
        this.opacity = Math.random() * 0.5 + 0.4;
        this.color = isDarkMode 
            ? ['#00f5c4', '#7c3aed', '#f59e0b'][Math.floor(Math.random() * 3)]
            : ['#ff3b3b', '#ff6b6b', '#d4a017'][Math.floor(Math.random() * 3)];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
    }
}

function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}
createParticles();

function drawConnections() {
    const primary = isDarkMode ? '0,245,196' : '255,59,59';
    let count = 0;
    const max = 80;

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length && count < max; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist < connectionDistance) {
                const alpha = 0.25 * (1 - dist / connectionDistance);
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(${primary},${alpha})`;
                ctx.lineWidth = 1.2;
                ctx.stroke();
                count++;
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    drawConnections();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ====================== HAMBURGER MENU ======================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.style.display === 'flex';
    mobileMenu.style.display = isOpen ? 'none' : 'flex';
});

// ====================== EMAILJS ======================
const EMAILJS_PUBLIC_KEY = "ahxtg_8WKNFo_bNBy";   // ← remplace avec ta clé EmailJS
const EMAILJS_SERVICE_ID = "service_ns765h2";   // ← remplace avec ton Service ID
const EMAILJS_TEMPLATE_ID = "template_zdcxzed"; // ← remplace avec ton Template ID

emailjs.init(EMAILJS_PUBLIC_KEY);

const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const successMsg = document.getElementById('form-success');
const errorMsg = document.getElementById('form-error');

const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
document.body.appendChild(toastContainer);

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 4200);
}

function showPopup(message, type = 'info') {
    window.alert(`${type === 'success' ? '✅ ' : '❌ '}${message}`);
}

form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (EMAILJS_PUBLIC_KEY.includes('YOUR_') || EMAILJS_SERVICE_ID.includes('YOUR_') || EMAILJS_TEMPLATE_ID.includes('YOUR_')) {
        showToast('Configuration EmailJS non complétée. Remplacez les IDs dans script.js.', 'error');
        showPopup('Configuration EmailJS non complétée. Impossible d’envoyer le message.', 'error');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';

    const templateParams = {
        from_name: document.getElementById('name').value.trim(),
        from_email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim()
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
            successMsg.classList.remove('hidden');
            errorMsg.classList.add('hidden');
            form.reset();
            showToast('Message envoyé avec succès ! Je vous répondrai rapidement.', 'success');
            showPopup('Message envoyé avec succès !', 'success');
            setTimeout(() => successMsg.classList.add('hidden'), 5000);
        })
        .catch((err) => {
            console.error('EmailJS Error:', err);
            errorMsg.classList.remove('hidden');
            successMsg.classList.add('hidden');
            showToast('Une erreur est survenue lors de l’envoi. Veuillez réessayer.', 'error');
            showPopup('Une erreur est survenue lors de l’envoi. Vérifiez la configuration EmailJS.', 'error');
            setTimeout(() => errorMsg.classList.add('hidden'), 5000);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Envoyer le message';
        });
});

// ====================== Parallax 3D (throttled) ======================
const heroSection = document.querySelector('.hero');
const snippets = document.querySelectorAll('.code-snippet');
const heroContent = document.getElementById('hero-content');
let ticking = false;

heroSection.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const deltaX = (e.clientX - centerX) / centerX;
        const deltaY = (e.clientY - centerY) / centerY;

        snippets.forEach(snippet => {
            const depth = parseFloat(snippet.dataset.depth) || 0.3;
            const moveX = deltaX * depth * 40;
            const moveY = deltaY * depth * 30;
            snippet.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        const rotateX = deltaY * 6;
        const rotateY = deltaX * 8;
        heroContent.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;

        ticking = false;
    });
});

// ====================== Scroll Reveal ======================
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

// ====================== Count-up Animation ======================
const statNumbers = document.querySelectorAll('.stat-number');
let countersAnimated = false;

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            statNumbers.forEach(stat => {
                const target = parseInt(stat.dataset.target);
                let current = 0;
                const increment = target / 60;
                const interval = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target + (target === 100 ? '%' : '+');
                        clearInterval(interval);
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                }, 30);
            });
        }
    });
}, { threshold: 0.5 });

counterObserver.observe(document.querySelector('.about'));

// ====================== Skill Bars ======================
const skillCards = document.querySelectorAll('.skill-card');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

skillCards.forEach(card => skillObserver.observe(card));

// ====================== Smooth Scroll ======================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});


// ====================== AI ASSISTANT (Version corrigée 2026) ======================
const aiToggle = document.getElementById('ai-toggle');
const aiWindow = document.getElementById('ai-chat-window');
const aiClose = document.getElementById('ai-close');
const aiMessages = document.getElementById('ai-messages');
const aiInput = document.getElementById('ai-input');
const aiSend = document.getElementById('ai-send');

const GEMINI_API_KEY = "AIzaSyByiZ69ZO-DBKuYGTGfTAJzGRaJi9R9rwc";   // ← Mets ta vraie clé ici

const systemPrompt = `Tu es Isodi AI, un assistant amical, enthousiaste et professionnel qui représente Israel Wa Nzambi Nkuna, étudiant congolais passionné d'informatique basé à Ouagadougou, Burkina Faso.

Tu parles naturellement en français. Tu connais bien :
- Sa passion pour la cybersécurité et surtout l'intelligence artificielle
- Son rôle de développeur Full Stack (React, Next.js, Node.js, animations, etc.)
- Son envie de relier théorie et pratique pour un avenir tech plus sûr et intelligent

Réponds de manière concise, positive et engageante. Pose des questions si besoin pour mieux aider.`;

function addMessage(sender, text) {
    const div = document.createElement('div');
    div.className = `ai-message ${sender}`;
    div.textContent = text;
    aiMessages.appendChild(div);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

async function sendToGemini(userMessage) {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "TA_CLE_GEMINI_ICI") {
        addMessage("bot", "❌ Clé API Gemini non configurée. Mets ta vraie clé dans le code.");
        return;
    }

    addMessage("user", userMessage);
    aiInput.value = "";

    const loadingDiv = document.createElement('div');
    loadingDiv.className = "ai-message bot";
    loadingDiv.textContent = "Isodi AI réfléchit...";
    aiMessages.appendChild(loadingDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: systemPrompt + "\n\nQuestion de l'utilisateur : " + userMessage }]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 800
                    }
                })
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Nouveau parsing plus robuste (2026)
        let botReply = "Désolé, je n'ai pas pu générer de réponse.";
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            botReply = data.candidates[0].content.parts[0].text || botReply;
        }

        loadingDiv.remove();
        addMessage("bot", botReply);

    } catch (error) {
        console.error("Gemini Error:", error);
        loadingDiv.remove();
        addMessage("bot", "❌ Erreur de connexion à l'IA. Vérifie ta clé API Gemini ou ta connexion internet.");
    }
}

// Event listeners
aiSend.addEventListener('click', () => {
    const message = aiInput.value.trim();
    if (message) sendToGemini(message);
});

aiInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const message = aiInput.value.trim();
        if (message) sendToGemini(message);
    }
});

aiToggle.addEventListener('click', () => {
    aiWindow.classList.toggle('hidden');
    if (!aiWindow.classList.contains('hidden') && aiMessages.children.length === 0) {
        addMessage("bot", "Salut ! Je suis l'assistant IA d'Israel. Comment puis-je t'aider à mieux le connaître ?");
    }
});

aiClose.addEventListener('click', () => {
    aiWindow.classList.add('hidden');
});

console.log('%c✅ Portfolio Israel - Tout est prêt et optimisé !', 'color:#00f5c4; font-size:1.1rem; font-weight:bold');