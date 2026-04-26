// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Synchronize Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

window.addEventListener("scroll", function () { let e = document.querySelector(".navbar"); e && (window.scrollY > 50 ? e.classList.add("scrolled") : e.classList.remove("scrolled")) }), document.addEventListener("DOMContentLoaded", function () {
    let loader = document.getElementById("loading-screen"),
        home = document.getElementById("home");

    // Minimum time the loader must stay visible for the "jaw-dropping" animation
    const minWait = 2500;

    setTimeout(() => {
        // Step 1: Trigger the panel slide-out in CSS
        loader.classList.add("hidden");

        // Step 2: Trigger the staggered hero entrance and nav items
        setTimeout(() => {
            home.classList.add("hero-revealed");
            // Staggered entrance for navbar items
            gsap.from(".navbar-brand, .nav-item, .nav-whatsapp-btn", {
                y: -20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            });
        }, 300);

        // Step 3: Cleanup loader from DOM after panels fully finish sliding
        setTimeout(() => {
            loader.style.display = "none";
        }, 1500);
    }, minWait);

    // Reverted Reveal Logic (Manual CSS class toggle)
    const revealElements = document.querySelectorAll(".reveal");
    function checkReveal() {
        revealElements.forEach(el => {
            let top = el.getBoundingClientRect().top;
            let windowHeight = window.innerHeight;
            if (top < windowHeight - 80) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
        });
    }
    checkReveal();
    window.addEventListener("scroll", checkReveal);
    lenis.on('scroll', checkReveal);
    const letters = document.querySelectorAll(".animated-title span");
    let index = 0;
    function animateLetters() {
        if (letters.length === 0) return;
        letters.forEach(e => e.classList.remove("active")),
            letters[index].classList.add("active"),
            index = (index + 1) % letters.length,
            setTimeout(animateLetters, 1e3)
    }
    if (letters.length > 0) animateLetters();

    document.getElementById("lottie-animation1").addEventListener("click", function () {
        let e = document.getElementById("about");
        window.scrollTo({ top: e.offsetTop - 90, behavior: "smooth" })
    });

    document.getElementById("lottie-animation").addEventListener("click", function () {
        window.location.href = "#home"
    });

    const chatbotWrapper = document.getElementById("chatbot-wrapper");
    const chatbotContainer = chatbotWrapper.querySelector("#chatbotContainer");
    const chatbotBtn = chatbotWrapper.querySelector(".chatbot-button");
    const chatbotCloseBtn = chatbotWrapper.querySelector(".btn-close");

    function toggleChatbot() {
        chatbotContainer.classList.toggle("open");
        chatbotBtn.classList.toggle("hidden", chatbotContainer.classList.contains("open"));
        if (chatbotContainer.classList.contains("open")) {
            hideTeaser();
            const badge = chatbotWrapper.querySelector(".chatbot-badge");
            if (badge) badge.style.display = 'none';
        }
    }

    function hideTeaser() {
        const teaser = chatbotWrapper.querySelector(".chatbot-teaser");
        if (teaser) teaser.classList.remove("visible");
    }

    // Show teaser after 4 seconds
    setTimeout(() => {
        const teaser = chatbotWrapper.querySelector(".chatbot-teaser");
        if (teaser && !chatbotContainer.classList.contains("open")) {
            teaser.classList.add("visible");
        }
    }, 4000);

    // Periodic shake to grab attention
    setInterval(() => {
        if (!chatbotContainer.classList.contains("open")) {
            gsap.to(chatbotBtn, {
                x: 5,
                duration: 0.1,
                repeat: 5,
                yoyo: true,
                ease: "power1.inOut"
            });
        }
    }, 10000);

    chatbotBtn.addEventListener("click", toggleChatbot);
    if (chatbotCloseBtn) chatbotCloseBtn.addEventListener("click", toggleChatbot);

    // Send message on button click
    const sendBtn = chatbotWrapper.querySelector(".send-btn");
    if (sendBtn) sendBtn.addEventListener("click", () => askOpenAI());

    // Send message on Enter key
    const questionInput = chatbotWrapper.querySelector("#question");
    if (questionInput) {
        questionInput.addEventListener("keypress", function (event) {
            if (event.key === 'Enter') {
                askOpenAI();
            }
        });
    }

    document.addEventListener("click", function (e) {
        if (chatbotContainer.classList.contains("open") &&
            !chatbotContainer.contains(e.target) &&
            !chatbotBtn.contains(e.target)) {
            chatbotContainer.classList.remove("open");
            chatbotBtn.classList.remove("hidden");
        }
    });
    // Chatbot Logic
    let chatHistory = [];
    const MAX_HISTORY = 5;
    let isGenerating = false;

    async function askOpenAI(msgText = null) {
        if (isGenerating) return;

        const inputField = chatbotWrapper.querySelector("#question");
        const sendBtn = chatbotWrapper.querySelector(".send-btn");
        const question = (typeof msgText === 'string') ? msgText : inputField.value.trim();
        const chatMessages = chatbotWrapper.querySelector("#chatMessages");

        if (!question) return;

        isGenerating = true;
        if (inputField) inputField.disabled = true;
        if (sendBtn) sendBtn.disabled = true;

        // Append User Message
        appendMessage(question, 'user-message');
        if (!msgText) inputField.value = "";
        
        chatHistory.push({ role: "user", content: question });
        if (chatHistory.length > MAX_HISTORY) {
            chatHistory = chatHistory.slice(-MAX_HISTORY);
        }

        // Simulate Typing (Premium Thinking State)
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot-message typing-indicator';
        typingIndicator.id = 'typingIndicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typingIndicator);
        scrollToBottom();

        // Deliberate "thinking" delay to feel more human
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ messages: chatHistory })
            });

            if (res.status === 429) {
                throw new Error("RATE_LIMIT");
            }
            if (!res.ok) throw new Error("Network response was not ok");
            
            // Remove typing indicator
            const indicator = document.getElementById('typingIndicator');
            if (indicator) indicator.remove();

            const botMessageDiv = appendMessage("", 'bot-message');
            
            const reader = res.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let done = false;
            let botFullResponse = "";
            let buffer = "";

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) {
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop(); // Keep the last incomplete line in the buffer
                    
                    for (const line of lines) {
                        if (line.startsWith("data: ")) {
                            const dataStr = line.replace("data: ", "").trim();
                            if (dataStr === "[DONE]") continue;
                            try {
                                const parsed = JSON.parse(dataStr);
                                const content = parsed.choices[0]?.delta?.content || "";
                                botFullResponse += content;
                                botMessageDiv.innerHTML = botFullResponse; // update word by word
                                scrollToBottom();
                            } catch (e) {
                                console.error("Error parsing stream data", e);
                            }
                        }
                    }
                }
            }
            
            chatHistory.push({ role: "assistant", content: botFullResponse });
            if (chatHistory.length > MAX_HISTORY) {
                chatHistory = chatHistory.slice(-MAX_HISTORY);
            }

        } catch (error) {
            console.error("Chat API error:", error);
            // Remove typing indicator
            const indicator = document.getElementById('typingIndicator');
            if (indicator) indicator.remove();

            let fallbackMsg = "You can contact me for more details.";
            if (error.message === "RATE_LIMIT") {
                fallbackMsg = "You're sending messages too fast. Please wait a moment.";
            }
            appendMessage(fallbackMsg, 'bot-message');
        } finally {
            isGenerating = false;
            if (inputField) {
                inputField.disabled = false;
                inputField.focus();
            }
            if (sendBtn) sendBtn.disabled = false;
        }
    }

    // Attach click listeners to quick options
    document.querySelectorAll('.quick-option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            askOpenAI(e.currentTarget.innerText);
        });
    });

    // Update anchor links to use Lenis scrollTo
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href');
            if (target === '#') return;
            lenis.scrollTo(target, {
                offset: -70,
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        });
    });

    function appendMessage(text, className) {
        const chatMessages = chatbotWrapper.querySelector("#chatMessages");
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${className}`;
        messageDiv.innerHTML = text; // using innerHTML to allow basic formatting if needed
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
        return messageDiv;
    }

    function scrollToBottom() {
        const chatMessages = chatbotWrapper.querySelector("#chatMessages");
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // New GSAP Custom Cursor Implementation
    (function () {
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouch) return;

        document.body.classList.add('use-custom-cursor');

        const cursor = document.createElement('div');
        cursor.className = 'cursor-follower';
        const dot = document.createElement('div');
        dot.className = 'cursor-dot';
        document.body.appendChild(cursor);
        document.body.appendChild(dot);

        let cursorX = gsap.quickTo(cursor, "left", { duration: 0.4, ease: "power3" });
        let cursorY = gsap.quickTo(cursor, "top", { duration: 0.4, ease: "power3" });
        let dotX = gsap.quickTo(dot, "left", { duration: 0.1, ease: "power3" });
        let dotY = gsap.quickTo(dot, "top", { duration: 0.1, ease: "power3" });

        window.addEventListener("mousemove", (e) => {
            cursorX(e.clientX);
            cursorY(e.clientY);
            dotX(e.clientX);
            dotY(e.clientY);
        });

        // Hover effect for links and buttons
        const hoverElements = 'a, button, .hover-target, .btn, input, textarea';
        document.querySelectorAll(hoverElements).forEach((el) => {
            el.addEventListener("mouseenter", () => {
                cursor.classList.add('hovering');
                gsap.to(cursor, {
                    scale: 3.5,
                    duration: 0.6,
                    ease: "expo.out",
                    borderColor: "rgba(255, 255, 255, 1)",
                    boxShadow: "0 0 30px rgba(255, 255, 255, 0.4)"
                });
                gsap.to(dot, { scale: 0, duration: 0.3, ease: "power2.in" });
            });
            el.addEventListener("mouseleave", () => {
                cursor.classList.remove('hovering');
                gsap.to(cursor, {
                    scale: 1,
                    duration: 0.6,
                    ease: "power3.out",
                    borderColor: "rgba(255, 255, 255, 0.8)",
                    boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)"
                });
                gsap.to(dot, { scale: 1, duration: 0.4, ease: "power2.out" });
            });
        });

        // Handle click pulse
        window.addEventListener("mousedown", (e) => {
            const pulse = document.createElement("div");
            pulse.className = "click-pulse";
            pulse.style.left = e.clientX + "px";
            pulse.style.top = e.clientY + "px";
            document.body.appendChild(pulse);
            pulse.addEventListener("animationend", () => pulse.remove());
        });

        // Hide cursor when leaving window
        document.addEventListener("mouseleave", () => {
            gsap.to([cursor, dot], { opacity: 0, duration: 0.3 });
        });
        document.addEventListener("mouseenter", () => {
            gsap.to([cursor, dot], { opacity: 1, duration: 0.3 });
        });

        // Disable custom cursor effect on profile image
        const profileImg = document.querySelector('img[src="/ProfileImage.jpeg"]');
        if (profileImg) {
            profileImg.addEventListener("mouseenter", () => {
                gsap.to([cursor, dot], { opacity: 0, duration: 0.2 });
                document.body.classList.remove('use-custom-cursor');
            });
            profileImg.addEventListener("mouseleave", () => {
                gsap.to([cursor, dot], { opacity: 1, duration: 0.2 });
                document.body.classList.add('use-custom-cursor');
            });
        }
    })();
    const cubes = document.querySelectorAll(".cube");

    cubes.forEach(cube => {
        let size = Math.floor(Math.random() * 11) + 40;

        cube.parentElement.style.width = size + "px";
        cube.parentElement.style.height = size + "px";

        cube.querySelectorAll(".face").forEach(face => {
            face.style.width = size + "px";
            face.style.height = size + "px";
        });

        let half = size / 2;
        cube.querySelector(".front").style.transform = `translateZ(${half}px)`;
        cube.querySelector(".back").style.transform = `rotateY(180deg) translateZ(${half}px)`;
        cube.querySelector(".left").style.transform = `rotateY(-90deg) translateZ(${half}px)`;
        cube.querySelector(".right").style.transform = `rotateY(90deg) translateZ(${half}px)`;
        cube.querySelector(".top").style.transform = `rotateX(90deg) translateZ(${half}px)`;
        cube.querySelector(".bottom").style.transform = `rotateX(-90deg) translateZ(${half}px)`;

        let duration = (Math.random() * 3 + 2).toFixed(2) + "s";
        let delay = (Math.random() * 2).toFixed(2) + "s";
        cube.style.animationDuration = duration;
        cube.style.animationDelay = delay;
    });

    // Hamburger Menu Logic
    const navbarToggler = document.querySelector(".navbar-toggler");
    const navbarCollapse = document.querySelector(".navbar-collapse");
    const navLinks = document.querySelectorAll(".nav-link");

    // Close on click outside
    document.addEventListener("click", function (event) {
        if (navbarCollapse.classList.contains("show") &&
            !navbarCollapse.contains(event.target) &&
            !navbarToggler.contains(event.target)) {
            new bootstrap.Collapse(navbarCollapse).hide();
        }
    });

    // Close on link click
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (navbarCollapse.classList.contains("show")) {
                new bootstrap.Collapse(navbarCollapse).hide();
            }
        });
    });
});
